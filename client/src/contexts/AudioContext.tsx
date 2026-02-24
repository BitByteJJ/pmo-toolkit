// AudioContext — TTS narration using Web Speech API + Media Session API
// Media Session API exposes lock-screen controls on mobile devices
// Supports play/pause, next/prev card, and continuous playlist mode

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
  text: string; // full narration text
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTrack: AudioTrack | null;
  currentIndex: number;
  playlist: AudioTrack[];
  rate: number;
  pitch: number;
  volume: number;
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
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  isSupported: boolean;
}

// ─── NARRATION BUILDER ────────────────────────────────────────────────────────
function buildNarration(card: PMOCard): string {
  const parts: string[] = [];
  parts.push(`${card.code}: ${card.title}.`);
  parts.push(card.tagline + '.');
  parts.push('What it is. ' + card.whatItIs);
  parts.push('When to use it. ' + card.whenToUse);
  if (card.steps && card.steps.length > 0) {
    parts.push('Key steps. ' + card.steps.join('. '));
  }
  parts.push('Pro tip. ' + card.proTip);
  if (card.example) {
    parts.push('Example. ' + card.example);
  }
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

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    currentTrack: null,
    currentIndex: -1,
    playlist: [],
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Media Session API setup ──
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => {
      resumeInternal();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      pauseInternal();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      nextInternal();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      prevInternal();
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      stopInternal();
    });

    return () => {
      (['play', 'pause', 'nexttrack', 'previoustrack', 'stop'] as MediaSessionAction[]).forEach(
        action => {
          try { navigator.mediaSession.setActionHandler(action, null); } catch {}
        }
      );
    };
  }, []);

  // ── Update Media Session metadata when track changes ──
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (!state.currentTrack) {
      navigator.mediaSession.metadata = null;
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: state.currentTrack.title,
      artist: state.currentTrack.deckTitle,
      album: 'PMO Toolkit',
      artwork: [
        { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      ],
    });
    navigator.mediaSession.playbackState = state.isPlaying && !state.isPaused ? 'playing' : 'paused';
  }, [state.currentTrack, state.isPlaying, state.isPaused]);

  // ── Internal speak function ──
  function speakTrack(track: AudioTrack, index: number, playlist: AudioTrack[]) {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(track.text);
    utterance.rate = stateRef.current.rate;
    utterance.pitch = stateRef.current.pitch;
    utterance.volume = stateRef.current.volume;

    utterance.onstart = () => {
      setState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentTrack: track,
        currentIndex: index,
        playlist,
      }));
    };

    utterance.onend = () => {
      // Auto-advance to next track
      const nextIdx = index + 1;
      if (nextIdx < playlist.length) {
        speakTrack(playlist[nextIdx], nextIdx, playlist);
      } else {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
        }));
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'none';
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted') return; // expected on cancel
      setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  // ── Exposed controls ──
  const playCard = useCallback((cardId: string) => {
    const card = CARDS.find(c => c.id === cardId);
    if (!card) return;
    const track = buildTrack(card);
    const playlist = [track];
    setState(prev => ({ ...prev, playlist, currentIndex: 0 }));
    speakTrack(track, 0, playlist);
  }, []);

  const playDeck = useCallback((deckId: string) => {
    const deckCards = CARDS.filter(c => c.deckId === deckId);
    if (deckCards.length === 0) return;
    const playlist = deckCards.map(buildTrack);
    setState(prev => ({ ...prev, playlist, currentIndex: 0 }));
    speakTrack(playlist[0], 0, playlist);
  }, []);

  const playAll = useCallback(() => {
    const playlist = CARDS.slice(0, 20).map(buildTrack); // limit to 20 for sanity
    setState(prev => ({ ...prev, playlist, currentIndex: 0 }));
    speakTrack(playlist[0], 0, playlist);
  }, []);

  function pauseInternal() {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setState(prev => ({ ...prev, isPaused: true }));
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
  }

  function resumeInternal() {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setState(prev => ({ ...prev, isPaused: false }));
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
  }

  function stopInternal() {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
  }

  function nextInternal() {
    const { currentIndex, playlist } = stateRef.current;
    const nextIdx = currentIndex + 1;
    if (nextIdx < playlist.length) {
      speakTrack(playlist[nextIdx], nextIdx, playlist);
    }
  }

  function prevInternal() {
    const { currentIndex, playlist } = stateRef.current;
    const prevIdx = currentIndex - 1;
    if (prevIdx >= 0) {
      speakTrack(playlist[prevIdx], prevIdx, playlist);
    }
  }

  const pause = useCallback(pauseInternal, [isSupported]);
  const resume = useCallback(resumeInternal, [isSupported]);
  const stop = useCallback(stopInternal, [isSupported]);
  const next = useCallback(nextInternal, []);
  const prev = useCallback(prevInternal, []);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate }));
    if (utteranceRef.current) utteranceRef.current.rate = rate;
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setState(prev => ({ ...prev, pitch }));
    if (utteranceRef.current) utteranceRef.current.pitch = pitch;
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
    if (utteranceRef.current) utteranceRef.current.volume = volume;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

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
        setPitch,
        setVolume,
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
