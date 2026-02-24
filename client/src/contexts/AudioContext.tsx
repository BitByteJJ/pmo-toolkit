// AudioContext — Two-host podcast mode using Google Cloud TTS
// Alex (Journey-D, male) and Sam (Journey-O, female) have a natural back-and-forth conversation.
// Each card generates a full podcast episode via /api/podcast (LLM script + TTS per segment).
// Segments are played sequentially via HTMLAudioElement for proper lock-screen Media Session support.

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
export interface PodcastSegment {
  speaker: 'Alex' | 'Sam';
  line: string;
  audioContent: string; // base64 MP3
}

export interface AudioTrack {
  cardId: string;
  title: string;
  deckTitle: string;
  deckColor: string;
  segments: PodcastSegment[];
  currentSegmentIndex: number;
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTrack: AudioTrack | null;
  currentIndex: number;       // index in the playlist
  playlist: Omit<AudioTrack, 'segments' | 'currentSegmentIndex'>[]; // lightweight playlist
  currentSpeaker: 'Alex' | 'Sam' | null;
  currentLine: string;
  rate: number;
  error: string | null;
}

interface AudioContextValue extends AudioState {
  playCard: (cardId: string) => void;
  playDeck: (deckId: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  setRate: (rate: number) => void;
  playAll: () => void;
  isSupported: boolean;
}

// ─── PODCAST CACHE ────────────────────────────────────────────────────────────
const CACHE_PREFIX = 'pmo_podcast_v1_';

function getCachedEpisode(cardId: string): PodcastSegment[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + cardId);
    if (!raw) return null;
    return JSON.parse(raw) as PodcastSegment[];
  } catch {
    return null;
  }
}

function setCachedEpisode(cardId: string, segments: PodcastSegment[]) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + cardId, JSON.stringify(segments));
  } catch {
    // sessionStorage full — skip caching
  }
}

// ─── FETCH PODCAST EPISODE ────────────────────────────────────────────────────
async function fetchPodcastEpisode(card: PMOCard, deckTitle: string): Promise<PodcastSegment[]> {
  const cached = getCachedEpisode(card.id);
  if (cached) return cached;

  const response = await fetch('/api/podcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card: {
        title: card.title,
        tagline: card.tagline,
        whatItIs: card.whatItIs,
        whenToUse: card.whenToUse,
        steps: card.steps,
        proTip: card.proTip,
        example: card.example,
        deckTitle,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Podcast API error ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json() as { segments: PodcastSegment[] };
  if (!data.segments?.length) throw new Error('No podcast segments returned');

  setCachedEpisode(card.id, data.segments);
  return data.segments;
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
    currentSpeaker: null,
    currentLine: '',
    rate: 1.0,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Ref to hold the current track's segments so the onended callback can access them
  const currentTrackRef = useRef<AudioTrack | null>(null);

  function getAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }

  // ── Media Session ──
  function updateMediaSession(track: Omit<AudioTrack, 'segments' | 'currentSegmentIndex'> | null, playing: boolean, speaker?: 'Alex' | 'Sam' | null) {
    if (!('mediaSession' in navigator)) return;
    if (!track) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: speaker ? `${speaker} — ${track.deckTitle}` : track.deckTitle,
      album: 'StratAlign PMO Podcast',
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      ],
    });
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  // ── Play a single segment (base64 MP3) ──
  const playSegment = useCallback((
    segment: PodcastSegment,
    onEnded: () => void
  ) => {
    const audio = getAudio();
    audio.pause();
    audio.src = `data:audio/mp3;base64,${segment.audioContent}`;
    audio.playbackRate = stateRef.current.rate;

    audio.onended = onEnded;
    audio.onerror = () => {
      console.warn('[Audio] Segment playback error, skipping');
      onEnded(); // skip broken segment
    };

    audio.play().catch(err => {
      console.error('[Audio] play() failed:', err);
    });
  }, []);

  // ── Play all segments of a track sequentially ──
  const playTrackSegments = useCallback((track: AudioTrack, startSegment = 0) => {
    currentTrackRef.current = { ...track, currentSegmentIndex: startSegment };

    const playNext = (segIdx: number) => {
      const t = currentTrackRef.current;
      if (!t || segIdx >= t.segments.length) {
        // Episode finished — advance to next track in playlist
        const { currentIndex, playlist } = stateRef.current;
        if (currentIndex + 1 < playlist.length) {
          const nextCard = CARDS.find(c => c.id === playlist[currentIndex + 1].cardId);
          if (nextCard) {
            playCardById(nextCard.id, currentIndex + 1, stateRef.current.playlist);
          }
        } else {
          setState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentSpeaker: null, currentLine: '' }));
          updateMediaSession(null, false);
        }
        return;
      }

      const segment = t.segments[segIdx];
      currentTrackRef.current = { ...t, currentSegmentIndex: segIdx };

      setState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentSpeaker: segment.speaker,
        currentLine: segment.line,
        currentTrack: currentTrackRef.current,
      }));

      const lightTrack = stateRef.current.playlist[stateRef.current.currentIndex];
      updateMediaSession(lightTrack ?? null, true, segment.speaker);

      playSegment(segment, () => playNext(segIdx + 1));
    };

    playNext(startSegment);
  }, [playSegment]);

  // ── Core: fetch episode then play ──
  const playCardById = useCallback(async (
    cardId: string,
    playlistIndex: number,
    playlist: AudioState['playlist']
  ) => {
    const card = CARDS.find(c => c.id === cardId);
    if (!card) return;

    const deck = getDeckById(card.deckId);
    const deckTitle = deck?.title ?? card.deckId;
    const deckColor = deck?.color ?? '#6366f1';

    // Stop current audio
    const audio = getAudio();
    audio.pause();
    audio.src = '';
    currentTrackRef.current = null;

    setState(prev => ({
      ...prev,
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      currentSpeaker: null,
      currentLine: '',
      currentIndex: playlistIndex,
      playlist,
      error: null,
      currentTrack: {
        cardId,
        title: card.title,
        deckTitle,
        deckColor,
        segments: [],
        currentSegmentIndex: 0,
      },
    }));

    let segments: PodcastSegment[];
    try {
      segments = await fetchPodcastEpisode(card, deckTitle);
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        error: String(err),
      }));
      return;
    }

    const track: AudioTrack = {
      cardId,
      title: card.title,
      deckTitle,
      deckColor,
      segments,
      currentSegmentIndex: 0,
    };

    setState(prev => ({
      ...prev,
      isLoading: false,
      currentTrack: track,
    }));

    playTrackSegments(track, 0);
  }, [playTrackSegments]);

  // ── Media Session action handlers ──
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => {
      const audio = getAudio();
      audio.play().then(() => {
        setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
        const { playlist, currentIndex, currentSpeaker } = stateRef.current;
        updateMediaSession(playlist[currentIndex] ?? null, true, currentSpeaker);
      }).catch(() => {});
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      const audio = getAudio();
      audio.pause();
      setState(prev => ({ ...prev, isPaused: true, isPlaying: false }));
      const { playlist, currentIndex, currentSpeaker } = stateRef.current;
      updateMediaSession(playlist[currentIndex] ?? null, false, currentSpeaker);
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      const { currentIndex, playlist } = stateRef.current;
      if (currentIndex + 1 < playlist.length) {
        playCardById(playlist[currentIndex + 1].cardId, currentIndex + 1, playlist);
      }
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      const { currentIndex, playlist } = stateRef.current;
      if (currentIndex - 1 >= 0) {
        playCardById(playlist[currentIndex - 1].cardId, currentIndex - 1, playlist);
      }
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      const audio = getAudio();
      audio.pause();
      audio.src = '';
      currentTrackRef.current = null;
      setState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentTrack: null, currentIndex: -1, playlist: [] }));
      updateMediaSession(null, false);
    });

    return () => {
      (['play', 'pause', 'nexttrack', 'previoustrack', 'stop'] as MediaSessionAction[]).forEach(
        action => { try { navigator.mediaSession.setActionHandler(action, null); } catch {} }
      );
    };
  }, [playCardById]);

  // ── Public API ──
  const playCard = useCallback((cardId: string) => {
    const card = CARDS.find(c => c.id === cardId);
    if (!card) return;
    const deck = getDeckById(card.deckId);
    const lightPlaylist = [{
      cardId,
      title: card.title,
      deckTitle: deck?.title ?? card.deckId,
      deckColor: deck?.color ?? '#6366f1',
    }];
    playCardById(cardId, 0, lightPlaylist);
  }, [playCardById]);

  const playDeck = useCallback((deckId: string) => {
    const deckCards = CARDS.filter(c => c.deckId === deckId);
    if (!deckCards.length) return;
    const deck = getDeckById(deckId);
    const lightPlaylist = deckCards.map(c => ({
      cardId: c.id,
      title: c.title,
      deckTitle: deck?.title ?? deckId,
      deckColor: deck?.color ?? '#6366f1',
    }));
    playCardById(deckCards[0].id, 0, lightPlaylist);
  }, [playCardById]);

  const pause = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    setState(prev => ({ ...prev, isPaused: true, isPlaying: false }));
    const { playlist, currentIndex, currentSpeaker } = stateRef.current;
    updateMediaSession(playlist[currentIndex] ?? null, false, currentSpeaker);
  }, []);

  const resume = useCallback(() => {
    const audio = getAudio();
    audio.play().then(() => {
      setState(prev => ({ ...prev, isPaused: false, isPlaying: true }));
      const { playlist, currentIndex, currentSpeaker } = stateRef.current;
      updateMediaSession(playlist[currentIndex] ?? null, true, currentSpeaker);
    }).catch(() => {});
  }, []);

  const stop = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    audio.src = '';
    currentTrackRef.current = null;
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentTrack: null,
      currentIndex: -1,
      playlist: [],
      currentSpeaker: null,
      currentLine: '',
    }));
    updateMediaSession(null, false);
  }, []);

  const next = useCallback(() => {
    const { currentIndex, playlist } = stateRef.current;
    if (currentIndex + 1 < playlist.length) {
      playCardById(playlist[currentIndex + 1].cardId, currentIndex + 1, playlist);
    }
  }, [playCardById]);

  const prev = useCallback(() => {
    const { currentIndex, playlist } = stateRef.current;
    if (currentIndex - 1 >= 0) {
      playCardById(playlist[currentIndex - 1].cardId, currentIndex - 1, playlist);
    }
  }, [playCardById]);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate }));
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, []);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) { audio.pause(); audio.src = ''; }
    };
  }, []);

  return (
    <Ctx.Provider value={{
      ...state,
      playCard,
      playDeck,
      playAll: () => playDeck(CARDS[0]?.deckId ?? ''),
      pause,
      resume,
      stop,
      next,
      prev,
      setRate,
      isSupported,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
