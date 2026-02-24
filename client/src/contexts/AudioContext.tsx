// AudioContext — Google Cloud TTS narration (Journey-O voice) + Media Session API
// Uses HTMLAudioElement so the browser treats it as real media → lock-screen controls work
// Caches generated audio in sessionStorage (base64) to avoid re-fetching

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { CARDS, getDeckById, type PMOCard } from '@/lib/pmoData';

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface AudioTrack {
  cardId: string;
  title: string;
  deckTitle: string;
  deckColor: string;
  text: string; // full narration script sent to TTS
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean; // true while fetching TTS audio
  currentTrack: AudioTrack | null;
  currentIndex: number;
  playlist: AudioTrack[];
  rate: number;
  error: string | null;
}

interface AudioContextValue extends AudioState {
  playCard: (cardId: string) => void;
  playDeck: (deckId: string) => void;
  playAll: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  setRate: (rate: number) => void;
  isSupported: boolean;
}

// ─── PODCAST-STYLE NARRATION BUILDER ─────────────────────────────────────────
// Writes a natural, conversational script — not a dry recitation of fields.
function buildNarration(card: PMOCard): string {
  const parts: string[] = [];

  // Hook — conversational opener
  parts.push(
    `Welcome to the ${card.title} card, from the ${getDeckById(card.deckId)?.title ?? 'PMO Toolkit'} deck.`
  );

  // Tagline as a one-liner
  parts.push(card.tagline + '.');

  // What it is — conversational bridge
  parts.push(`So, what exactly is it? ${card.whatItIs}`);

  // When to use — framed as advice
  parts.push(`You'd reach for this tool when ${card.whenToUse.replace(/^when /i, '').replace(/^use this /i, '')}`);

  // Steps — if present, narrate as a short list
  if (card.steps && card.steps.length > 0) {
    const stepCount = card.steps.length;
    parts.push(
      `There are ${stepCount} key step${stepCount > 1 ? 's' : ''} to follow. ` +
      card.steps.map((s, i) => `Step ${i + 1}: ${s}`).join('. ')
    );
  }

  // Pro tip — framed as insider advice
  parts.push(`Here's a pro tip from experienced practitioners. ${card.proTip}`);

  // Example — if present
  if (card.example) {
    parts.push(`To make this concrete, here's a real-world example. ${card.example}`);
  }

  // Sign-off
  parts.push(
    `That's the ${card.title} card. Tap the screen to explore related tools, or keep listening for the next card in your playlist.`
  );

  return parts.join(' ');
}

function buildTrack(card: PMOCard): AudioTrack {
  const deck = getDeckById(card.deckId);
  return {
    cardId: card.id,
    title: card.title,
    deckTitle: deck?.title ?? card.deckId,
    deckColor: deck?.color ?? '#6366f1',
    text: buildNarration(card),
  };
}

// ─── TTS FETCH + CACHE ────────────────────────────────────────────────────────
const TTS_CACHE_PREFIX = 'pmo_tts_v2_';

async function fetchTtsAudio(text: string, cardId: string): Promise<string> {
  const cacheKey = TTS_CACHE_PREFIX + cardId;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {}

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`TTS API error ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json() as { audioContent?: string };
  if (!data.audioContent) throw new Error('No audio content returned');

  const dataUrl = `data:audio/mp3;base64,${data.audioContent}`;

  try {
    sessionStorage.setItem(cacheKey, dataUrl);
  } catch {}

  return dataUrl;
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const isSupported = typeof window !== 'undefined' && typeof Audio !== 'undefined';

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentTrack: null,
    currentIndex: -1,
    playlist: [],
    rate: 1.0,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Ensure a single HTMLAudioElement exists ──
  function getAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }

  // ── Update Media Session metadata ──
  function updateMediaSession(track: AudioTrack | null, playing: boolean) {
    if (!('mediaSession' in navigator)) return;
    if (!track) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.deckTitle,
      album: 'StratAlign PMO Toolkit',
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      ],
    });
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  // ── Core play function — fetches TTS then plays ──
  const playTrackAtIndex = useCallback(
    async (playlist: AudioTrack[], index: number) => {
      if (index < 0 || index >= playlist.length) return;
      const track = playlist[index];

      // Stop any current audio
      const audio = getAudio();
      audio.pause();
      audio.src = '';

      setState(prev => ({
        ...prev,
        isLoading: true,
        isPlaying: false,
        isPaused: false,
        currentTrack: track,
        currentIndex: index,
        playlist,
        error: null,
      }));
      updateMediaSession(track, false);

      let dataUrl: string;
      try {
        dataUrl = await fetchTtsAudio(track.text, track.cardId);
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          error: String(err),
        }));
        return;
      }

      audio.src = dataUrl;
      audio.playbackRate = stateRef.current.rate;

      // Auto-advance when track ends
      audio.onended = () => {
        const nextIdx = stateRef.current.currentIndex + 1;
        if (nextIdx < stateRef.current.playlist.length) {
          playTrackAtIndex(stateRef.current.playlist, nextIdx);
        } else {
          setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
          updateMediaSession(stateRef.current.currentTrack, false);
        }
      };

      audio.onerror = () => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          error: 'Audio playback error',
        }));
      };

      try {
        await audio.play();
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: true,
          isPaused: false,
        }));
        updateMediaSession(track, true);
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          error: 'Could not start playback: ' + String(err),
        }));
      }
    },
    []
  );

  // ── Media Session action handlers ──
  // Must be registered AFTER audio starts (browsers require user gesture)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const registerHandlers = () => {
      navigator.mediaSession.setActionHandler('play', () => {
        const audio = getAudio();
        audio.play().then(() => {
          setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
          updateMediaSession(stateRef.current.currentTrack, true);
        }).catch(() => {});
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        const audio = getAudio();
        audio.pause();
        setState(prev => ({ ...prev, isPaused: true }));
        updateMediaSession(stateRef.current.currentTrack, false);
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        const { currentIndex, playlist } = stateRef.current;
        if (currentIndex + 1 < playlist.length) {
          playTrackAtIndex(playlist, currentIndex + 1);
        }
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        const { currentIndex, playlist } = stateRef.current;
        if (currentIndex - 1 >= 0) {
          playTrackAtIndex(playlist, currentIndex - 1);
        }
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        const audio = getAudio();
        audio.pause();
        audio.src = '';
        setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        updateMediaSession(null, false);
      });
    };

    registerHandlers();

    return () => {
      (['play', 'pause', 'nexttrack', 'previoustrack', 'stop'] as MediaSessionAction[]).forEach(
        action => {
          try { navigator.mediaSession.setActionHandler(action, null); } catch {}
        }
      );
    };
  }, [playTrackAtIndex]);

  // ── Public API ──
  const playCard = useCallback((cardId: string) => {
    const card = CARDS.find(c => c.id === cardId);
    if (!card) return;
    const track = buildTrack(card);
    playTrackAtIndex([track], 0);
  }, [playTrackAtIndex]);

  const playDeck = useCallback((deckId: string) => {
    const deckCards = CARDS.filter(c => c.deckId === deckId);
    if (deckCards.length === 0) return;
    const playlist = deckCards.map(buildTrack);
    playTrackAtIndex(playlist, 0);
  }, [playTrackAtIndex]);

  const playAll = useCallback(() => {
    // Pick 20 cards spread across decks for a varied playlist
    const playlist = CARDS.slice(0, 20).map(buildTrack);
    playTrackAtIndex(playlist, 0);
  }, [playTrackAtIndex]);

  const pause = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    setState(prev => ({ ...prev, isPaused: true }));
    updateMediaSession(stateRef.current.currentTrack, false);
  }, []);

  const resume = useCallback(() => {
    const audio = getAudio();
    audio.play().then(() => {
      setState(prev => ({ ...prev, isPaused: false, isPlaying: true }));
      updateMediaSession(stateRef.current.currentTrack, true);
    }).catch(() => {});
  }, []);

  const stop = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    audio.src = '';
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentTrack: null,
      currentIndex: -1,
      playlist: [],
    }));
    updateMediaSession(null, false);
  }, []);

  const next = useCallback(() => {
    const { currentIndex, playlist } = stateRef.current;
    if (currentIndex + 1 < playlist.length) {
      playTrackAtIndex(playlist, currentIndex + 1);
    }
  }, [playTrackAtIndex]);

  const prev = useCallback(() => {
    const { currentIndex, playlist } = stateRef.current;
    if (currentIndex - 1 >= 0) {
      playTrackAtIndex(playlist, currentIndex - 1);
    }
  }, [playTrackAtIndex]);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate }));
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        ...state,
        playCard,
        playDeck,
        playAll,
        pause,
        resume,
        stop,
        next,
        prev,
        setRate,
        isSupported,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
