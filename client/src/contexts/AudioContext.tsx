// AudioContext — StratAlign Theater multi-host podcast mode
// Up to 5 hosts (Alex, Sam, Jordan, Maya, Chris) using Google Cloud TTS Journey voices.
// Each card generates a full podcast episode via /api/podcast (LLM script + TTS per segment).
// Segments are played sequentially via HTMLAudioElement for proper lock-screen Media Session support.
//
// KEY FIX: audio MIME type must be 'audio/mpeg' (not 'audio/mp3') for browser compatibility.
// Blob URLs are used instead of data: URLs for better mobile support.

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
export type SpeakerName = 'Alex' | 'Sam' | 'Jordan' | 'Maya' | 'Chris';

export const SPEAKER_COLORS: Record<SpeakerName, string> = {
  Alex:   '#6366f1', // indigo
  Sam:    '#ec4899', // pink
  Jordan: '#10b981', // emerald
  Maya:   '#f59e0b', // amber
  Chris:  '#3b82f6', // blue
};

export const SPEAKER_ROLES: Record<SpeakerName, string> = {
  Alex:   'Senior PMO Consultant',
  Sam:    'Agile Coach',
  Jordan: 'Strategy Lead',
  Maya:   'Data Specialist',
  Chris:  'Product Manager',
};

export const SPEAKER_EMOJI: Record<SpeakerName, string> = {
  Alex:   '🎙️',
  Sam:    '💡',
  Jordan: '🗺️',
  Maya:   '📊',
  Chris:  '🚀',
};

export interface PodcastSegment {
  speaker: SpeakerName;
  line: string;
  audioContent: string; // base64 MP3
  durationSeconds?: number; // filled in after decode
}

export interface AudioTrack {
  cardId: string;
  title: string;
  deckTitle: string;
  deckColor: string;
  segments: PodcastSegment[];
  currentSegmentIndex: number;
  totalSegments: number;
  cast: SpeakerName[]; // active characters for this episode
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTrack: AudioTrack | null;
  currentIndex: number;       // index in the playlist
  playlist: Omit<AudioTrack, 'segments' | 'currentSegmentIndex' | 'totalSegments'>[]; // lightweight playlist
  currentSpeaker: SpeakerName | null;
  currentLine: string;
  rate: number;
  error: string | null;
  // Progress tracking
  segmentProgress: number;    // 0–1 within current segment
  segmentElapsed: number;     // seconds elapsed in current segment
  segmentDuration: number;    // total seconds of current segment
  episodeSegmentIndex: number; // which segment (0-based) we're on
  episodeTotalSegments: number; // total segments in episode
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
const CACHE_PREFIX = 'pmo_podcast_v3_'; // bump version to invalidate old 2-host cache

function getCachedEpisode(cardId: string): { segments: PodcastSegment[]; cast: SpeakerName[] } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + cardId);
    if (!raw) return null;
    return JSON.parse(raw) as { segments: PodcastSegment[]; cast: SpeakerName[] };
  } catch {
    return null;
  }
}

function setCachedEpisode(cardId: string, segments: PodcastSegment[], cast: SpeakerName[]) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + cardId, JSON.stringify({ segments, cast }));
  } catch {
    // sessionStorage full — skip caching
  }
}

// ─── BASE64 → BLOB URL ────────────────────────────────────────────────────────
// Using Blob URLs with 'audio/mpeg' (not 'audio/mp3') for maximum browser compatibility.
function base64ToBlobUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/mpeg' }); // MUST be 'audio/mpeg'
  return URL.createObjectURL(blob);
}

// ─── FETCH PODCAST EPISODE ────────────────────────────────────────────────────
async function fetchPodcastEpisode(
  card: PMOCard,
  deckTitle: string
): Promise<{ segments: PodcastSegment[]; cast: SpeakerName[] }> {
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

  const data = await response.json() as { segments: PodcastSegment[]; cast?: SpeakerName[] };
  if (!data.segments?.length) throw new Error('No podcast segments returned');

  const cast = data.cast ?? ['Alex', 'Sam'];
  setCachedEpisode(card.id, data.segments, cast);
  return { segments: data.segments, cast };
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
    segmentProgress: 0,
    segmentElapsed: 0,
    segmentDuration: 0,
    episodeSegmentIndex: 0,
    episodeTotalSegments: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Track current blob URL so we can revoke it when done
  const currentBlobUrlRef = useRef<string | null>(null);

  // Ref to hold the current track's segments so the onended callback can access them
  const currentTrackRef = useRef<AudioTrack | null>(null);

  function getAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';

      // ── Progress tracking via timeupdate ──
      audio.addEventListener('timeupdate', () => {
        const dur = audio.duration || 0;
        const cur = audio.currentTime || 0;
        if (dur > 0) {
          setState(prev => ({
            ...prev,
            segmentElapsed: cur,
            segmentDuration: dur,
            segmentProgress: cur / dur,
          }));
        }
      });

      audio.addEventListener('durationchange', () => {
        const dur = audio.duration || 0;
        if (dur > 0 && isFinite(dur)) {
          setState(prev => ({ ...prev, segmentDuration: dur }));
        }
      });

      audioRef.current = audio;
    }
    return audioRef.current;
  }

  // ── Revoke previous blob URL to free memory ──
  function revokePreviousBlobUrl() {
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
  }

  // ── Media Session ──
  function updateMediaSession(
    track: Omit<AudioTrack, 'segments' | 'currentSegmentIndex' | 'totalSegments'> | null,
    playing: boolean,
    speaker?: SpeakerName | null
  ) {
    if (!('mediaSession' in navigator)) return;
    if (!track) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      return;
    }
    const castLabel = track.cast?.join(', ') ?? (speaker ?? 'Alex & Sam');
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: `${castLabel} — ${track.deckTitle}`,
      album: 'StratAlign Theater',
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      ],
    });
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  // ── Play a single segment (base64 MP3 → Blob URL) ──
  const playSegment = useCallback((
    segment: PodcastSegment,
    segIdx: number,
    totalSegments: number,
    onEnded: () => void
  ) => {
    const audio = getAudio();
    audio.pause();

    // Revoke previous blob URL and create a new one
    revokePreviousBlobUrl();
    const blobUrl = base64ToBlobUrl(segment.audioContent);
    currentBlobUrlRef.current = blobUrl;

    audio.src = blobUrl;
    audio.playbackRate = stateRef.current.rate;

    // Reset progress for new segment
    setState(prev => ({
      ...prev,
      segmentProgress: 0,
      segmentElapsed: 0,
      segmentDuration: 0,
      episodeSegmentIndex: segIdx,
      episodeTotalSegments: totalSegments,
    }));

    audio.onended = onEnded;
    audio.onerror = (e) => {
      console.warn('[StratAlign Theater] Segment playback error, skipping', e);
      onEnded(); // skip broken segment
    };

    audio.play().catch(err => {
      console.error('[StratAlign Theater] play() failed:', err);
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
          setState(prev => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            currentSpeaker: null,
            currentLine: '',
            segmentProgress: 1,
          }));
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

      playSegment(segment, segIdx, t.segments.length, () => playNext(segIdx + 1));
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
    revokePreviousBlobUrl();
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
      segmentProgress: 0,
      segmentElapsed: 0,
      segmentDuration: 0,
      episodeSegmentIndex: 0,
      episodeTotalSegments: 0,
      currentTrack: {
        cardId,
        title: card.title,
        deckTitle,
        deckColor,
        segments: [],
        currentSegmentIndex: 0,
        totalSegments: 0,
        cast: ['Alex', 'Sam'],
      },
    }));

    let segments: PodcastSegment[];
    let cast: SpeakerName[];
    try {
      const result = await fetchPodcastEpisode(card, deckTitle);
      segments = result.segments;
      cast = result.cast;
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
      totalSegments: segments.length,
      cast,
    };

    setState(prev => ({
      ...prev,
      isLoading: false,
      currentTrack: track,
      episodeTotalSegments: segments.length,
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
      revokePreviousBlobUrl();
      currentTrackRef.current = null;
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentTrack: null,
        currentIndex: -1,
        playlist: [],
        segmentProgress: 0,
        segmentElapsed: 0,
        segmentDuration: 0,
      }));
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
      cast: ['Alex', 'Sam'] as SpeakerName[],
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
      cast: ['Alex', 'Sam'] as SpeakerName[],
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
    revokePreviousBlobUrl();
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
      segmentProgress: 0,
      segmentElapsed: 0,
      segmentDuration: 0,
      episodeSegmentIndex: 0,
      episodeTotalSegments: 0,
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
      revokePreviousBlobUrl();
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
