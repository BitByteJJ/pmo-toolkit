// AudioContext — StratAlign Theater
// Multi-character podcast (up to 5 cast members) with Google Cloud TTS Journey voices.
// Plays the branded intro jingle before each episode, then streams segments.
// Episode numbers (S1E#) are assigned per-card and persist in localStorage.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { CARDS, getDeckById } from '@/lib/pmoData';
import { getEpisodeId } from '@/lib/episodeNumbers';

// ─── CAST ─────────────────────────────────────────────────────────────────────
export type CastMember = 'Alex' | 'Sam' | 'Jordan' | 'Maya' | 'Chris';

export const CAST_META: Record<CastMember, { role: string; color: string; emoji: string }> = {
  Alex:  { role: 'Senior PM & Host',    color: '#6366f1', emoji: '👨‍💼' },
  Sam:   { role: 'Business Analyst',    color: '#ec4899', emoji: '👩‍💻' },
  Jordan:{ role: 'Executive Sponsor',   color: '#f59e0b', emoji: '👩‍⚖️' },
  Maya:  { role: 'Team Lead',           color: '#10b981', emoji: '👨‍🔧' },
  Chris: { role: "Devil's Advocate",    color: '#ef4444', emoji: '🤔' },
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface PodcastSegment {
  speaker: CastMember;
  line: string;
  audioContent: string; // base64 MP3
  index: number;
}

export interface AudioTrack {
  cardId: string;
  title: string;
  deckTitle: string;
  deckColor: string;
  episodeId: string; // e.g. "S1E7"
  segments: PodcastSegment[];
  currentSegmentIndex: number;
  totalSegments: number;
  activeCast: CastMember[];
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  isJingle: boolean; // true while the intro jingle is playing
  currentTrack: AudioTrack | null;
  currentIndex: number;
  playlist: Omit<AudioTrack, 'segments' | 'currentSegmentIndex' | 'totalSegments' | 'activeCast'>[];
  currentSpeaker: CastMember | null;
  currentLine: string;
  rate: number;
  error: string | null;
  segmentProgress: number;
  segmentElapsed: number;
  segmentDuration: number;
  episodeSegmentIndex: number;
  episodeTotalSegments: number;
  activeCast: CastMember[];
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

// ─── JINGLE ───────────────────────────────────────────────────────────────────
const JINGLE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/emcbKlQRIrHjopVD.mp3';

// ─── CACHE ────────────────────────────────────────────────────────────────────
const CACHE_PREFIX = 'sat_podcast_v3_'; // bumped version for new cast

function getCachedEpisode(cardId: string): PodcastSegment[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + cardId);
    if (!raw) return null;
    return JSON.parse(raw) as PodcastSegment[];
  } catch { return null; }
}

function setCachedEpisode(cardId: string, segments: PodcastSegment[]) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + cardId, JSON.stringify(segments));
  } catch { /* storage full */ }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const isSupported = typeof window !== 'undefined' && typeof Audio !== 'undefined';

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    isBuffering: false,
    isJingle: false,
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
    activeCast: [],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const segmentQueueRef = useRef<PodcastSegment[]>([]);
  const streamDoneRef = useRef(false);
  const playingSegIdxRef = useRef(-1);
  const isPlayingRef = useRef(false);
  const currentCardIdRef = useRef<string>('');

  function getAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
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
        if (dur > 0 && isFinite(dur)) setState(prev => ({ ...prev, segmentDuration: dur }));
      });
      audioRef.current = audio;
    }
    return audioRef.current;
  }

  // ── Media Session ──
  function updateMediaSession(
    track: Omit<AudioTrack, 'segments' | 'currentSegmentIndex' | 'totalSegments' | 'activeCast'> | null,
    playing: boolean,
    speaker?: CastMember | null
  ) {
    if (!('mediaSession' in navigator)) return;
    if (!track) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      return;
    }
    const speakerMeta = speaker ? CAST_META[speaker] : null;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${track.episodeId}: ${track.title}`,
      artist: speakerMeta ? `${speakerMeta.emoji} ${speaker} — ${speakerMeta.role}` : track.deckTitle,
      album: 'StratAlign Theater',
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      ],
    });
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  // ── Play intro jingle then call onDone ──
  const playJingle = useCallback((cardId: string, onDone: () => void) => {
    const audio = getAudio();
    audio.pause();
    audio.src = JINGLE_URL;
    audio.playbackRate = stateRef.current.rate;

    setState(prev => ({
      ...prev,
      isJingle: true,
      isPlaying: true,
      isLoading: false,
      currentSpeaker: null,
      currentLine: 'StratAlign Theater',
      segmentProgress: 0,
      segmentElapsed: 0,
      segmentDuration: 0,
    }));

    audio.onended = () => {
      if (cardId !== currentCardIdRef.current) return;
      setState(prev => ({ ...prev, isJingle: false }));
      onDone();
    };
    audio.onerror = () => {
      // If jingle fails, skip it and go straight to episode
      if (cardId !== currentCardIdRef.current) return;
      setState(prev => ({ ...prev, isJingle: false }));
      onDone();
    };
    audio.play().catch(() => {
      setState(prev => ({ ...prev, isJingle: false }));
      onDone();
    });
  }, []);

  // ── Dequeue and play the next segment ──
  const playNextSegment = useCallback((cardId: string) => {
    if (cardId !== currentCardIdRef.current) return;
    if (stateRef.current.isPaused) return;

    const queue = segmentQueueRef.current;
    const nextIdx = playingSegIdxRef.current + 1;
    const segment = queue.find(s => s.index === nextIdx);

    if (!segment) {
      if (streamDoneRef.current) {
        const { currentIndex, playlist } = stateRef.current;
        isPlayingRef.current = false;
        if (currentIndex + 1 < playlist.length) {
          const nextCard = CARDS.find(c => c.id === playlist[currentIndex + 1].cardId);
          if (nextCard) playCardById(nextCard.id, currentIndex + 1, stateRef.current.playlist);
        } else {
          setState(prev => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            isBuffering: false,
            currentSpeaker: null,
            currentLine: '',
            segmentProgress: 1,
          }));
          updateMediaSession(null, false);
        }
      } else {
        setState(prev => ({ ...prev, isBuffering: true }));
        isPlayingRef.current = false;
        setTimeout(() => {
          if (cardId === currentCardIdRef.current && !stateRef.current.isPaused) {
            playNextSegment(cardId);
          }
        }, 200);
      }
      return;
    }

    playingSegIdxRef.current = nextIdx;
    isPlayingRef.current = true;

    const audio = getAudio();
    audio.pause();
    audio.src = `data:audio/mp3;base64,${segment.audioContent}`;
    audio.playbackRate = stateRef.current.rate;

    const totalKnown = streamDoneRef.current
      ? queue.length
      : Math.max(queue.length, nextIdx + 2);

    // Track active cast members seen so far
    const seenSpeakers = new Set<CastMember>(
      queue.filter(s => s.index <= nextIdx).map(s => s.speaker)
    );

    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isBuffering: false,
      isLoading: false,
      isJingle: false,
      currentSpeaker: segment.speaker,
      currentLine: segment.line,
      segmentProgress: 0,
      segmentElapsed: 0,
      segmentDuration: 0,
      episodeSegmentIndex: nextIdx,
      episodeTotalSegments: totalKnown,
      activeCast: Array.from(seenSpeakers),
      currentTrack: prev.currentTrack
        ? {
            ...prev.currentTrack,
            currentSegmentIndex: nextIdx,
            segments: queue.slice(),
            activeCast: Array.from(seenSpeakers),
          }
        : prev.currentTrack,
    }));

    const lightTrack = stateRef.current.playlist[stateRef.current.currentIndex];
    updateMediaSession(lightTrack ?? null, true, segment.speaker);

    audio.onended = () => {
      isPlayingRef.current = false;
      if (cardId === currentCardIdRef.current && !stateRef.current.isPaused) {
        playNextSegment(cardId);
      }
    };
    audio.onerror = () => {
      console.warn('[Theater] Segment error, skipping');
      isPlayingRef.current = false;
      if (cardId === currentCardIdRef.current) playNextSegment(cardId);
    };
    audio.play().catch(err => console.error('[Theater] play() failed:', err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core: stream episode then play ──
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
    const episodeId = getEpisodeId(cardId);

    const audio = getAudio();
    audio.pause();
    audio.src = '';
    audio.onended = null;
    audio.onerror = null;

    currentCardIdRef.current = cardId;
    segmentQueueRef.current = [];
    streamDoneRef.current = false;
    playingSegIdxRef.current = -1;
    isPlayingRef.current = false;

    const lightTrack = { cardId, title: card.title, deckTitle, deckColor, episodeId };

    setState(prev => ({
      ...prev,
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      isBuffering: false,
      isJingle: false,
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
      activeCast: [],
      currentTrack: {
        cardId,
        title: card.title,
        deckTitle,
        deckColor,
        episodeId,
        segments: [],
        currentSegmentIndex: 0,
        totalSegments: 0,
        activeCast: [],
      },
    }));

    // Determine if we should play jingle (not for cached replays to avoid repetition)
    const cached = getCachedEpisode(cardId);
    const shouldPlayJingle = !cached?.length;

    const startEpisode = (segments?: PodcastSegment[]) => {
      if (segments?.length) {
        // Cached — load and play
        segmentQueueRef.current = segments;
        streamDoneRef.current = true;
        const castSet = new Set<CastMember>(segments.map(s => s.speaker));
        setState(prev => ({
          ...prev,
          isLoading: false,
          episodeTotalSegments: segments.length,
          activeCast: Array.from(castSet),
          currentTrack: prev.currentTrack
            ? { ...prev.currentTrack, segments, totalSegments: segments.length, activeCast: Array.from(castSet) }
            : prev.currentTrack,
        }));
        playNextSegment(cardId);
      }
      // else: streaming will kick off playback when first segment arrives
    };

    if (shouldPlayJingle) {
      // Play jingle first, then start streaming/playback
      playJingle(cardId, () => {
        if (cardId !== currentCardIdRef.current) return;
        if (!streamDoneRef.current && segmentQueueRef.current.length === 0) {
          // Still loading — show loading state while stream catches up
          setState(prev => ({ ...prev, isJingle: false, isLoading: true }));
        } else {
          playNextSegment(cardId);
        }
      });
    }

    if (cached?.length) {
      console.log(`[Theater] Cache hit for: ${card.title}`);
      startEpisode(cached);
      return;
    }

    // Stream from server
    let streamStarted = false;

    try {
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

      if (!response.ok || !response.body) {
        const err = await response.text();
        throw new Error(`Podcast API error ${response.status}: ${err.slice(0, 200)}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let lineBuffer = '';

      while (true) {
        if (cardId !== currentCardIdRef.current) { reader.cancel(); return; }

        const { done, value } = await reader.read();
        if (done) break;

        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);

            if (parsed.done) {
              streamDoneRef.current = true;
              const allSegments = segmentQueueRef.current;
              if (allSegments.length > 0) setCachedEpisode(cardId, allSegments);
              const castSet = new Set<CastMember>(allSegments.map(s => s.speaker));
              setState(prev => ({
                ...prev,
                episodeTotalSegments: allSegments.length,
                activeCast: Array.from(castSet),
                currentTrack: prev.currentTrack
                  ? { ...prev.currentTrack, totalSegments: allSegments.length, segments: allSegments.slice(), activeCast: Array.from(castSet) }
                  : prev.currentTrack,
              }));
              if (!isPlayingRef.current && !stateRef.current.isPaused && !stateRef.current.isJingle) {
                playNextSegment(cardId);
              }
              continue;
            }

            if (parsed.error) { console.error('[Theater] Stream error:', parsed.error); continue; }

            const segment: PodcastSegment = {
              speaker: parsed.speaker as CastMember,
              line: parsed.line,
              audioContent: parsed.audioContent,
              index: parsed.index,
            };

            segmentQueueRef.current = [...segmentQueueRef.current, segment];

            if (!streamStarted) {
              streamStarted = true;
              setState(prev => ({ ...prev, isLoading: false }));
              // Only start playback if jingle has already finished
              if (!isPlayingRef.current && !stateRef.current.isJingle) {
                playNextSegment(cardId);
              }
            }

            const currentSegments = segmentQueueRef.current;
            setState(prev => ({
              ...prev,
              episodeTotalSegments: streamDoneRef.current
                ? currentSegments.length
                : Math.max(prev.episodeTotalSegments, segment.index + 2),
              currentTrack: prev.currentTrack
                ? { ...prev.currentTrack, segments: currentSegments.slice() }
                : prev.currentTrack,
            }));

          } catch { /* skip malformed line */ }
        }
      }

      streamDoneRef.current = true;
      if (!isPlayingRef.current && !stateRef.current.isPaused && !stateRef.current.isJingle) {
        playNextSegment(cardId);
      }

    } catch (err) {
      if (cardId !== currentCardIdRef.current) return;
      console.error('[Theater] Stream error:', err);
      setState(prev => ({ ...prev, isLoading: false, isBuffering: false, isPlaying: false, error: String(err) }));
    }
  }, [playJingle, playNextSegment]);

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
      setState(prev => ({ ...prev, isPaused: true, isPlaying: false, isBuffering: false }));
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
      currentCardIdRef.current = '';
      setState(prev => ({
        ...prev,
        isPlaying: false, isPaused: false, isBuffering: false, isJingle: false,
        currentTrack: null, currentIndex: -1, playlist: [],
        segmentProgress: 0, segmentElapsed: 0, segmentDuration: 0,
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
    const episodeId = getEpisodeId(cardId);
    const lightPlaylist = [{
      cardId,
      title: card.title,
      deckTitle: deck?.title ?? card.deckId,
      deckColor: deck?.color ?? '#6366f1',
      episodeId,
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
      episodeId: getEpisodeId(c.id),
    }));
    playCardById(deckCards[0].id, 0, lightPlaylist);
  }, [playCardById]);

  const pause = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    setState(prev => ({ ...prev, isPaused: true, isPlaying: false, isBuffering: false }));
    const { playlist, currentIndex, currentSpeaker } = stateRef.current;
    updateMediaSession(playlist[currentIndex] ?? null, false, currentSpeaker);
  }, []);

  const resume = useCallback(() => {
    const audio = getAudio();
    if (audio.src && audio.src !== window.location.href) {
      audio.play().then(() => {
        setState(prev => ({ ...prev, isPaused: false, isPlaying: true }));
        const { playlist, currentIndex, currentSpeaker } = stateRef.current;
        updateMediaSession(playlist[currentIndex] ?? null, true, currentSpeaker);
      }).catch(() => {});
    } else {
      setState(prev => ({ ...prev, isPaused: false }));
      playNextSegment(currentCardIdRef.current);
    }
  }, [playNextSegment]);

  const stop = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    audio.src = '';
    audio.onended = null;
    audio.onerror = null;
    currentCardIdRef.current = '';
    segmentQueueRef.current = [];
    streamDoneRef.current = false;
    playingSegIdxRef.current = -1;
    isPlayingRef.current = false;
    setState(prev => ({
      ...prev,
      isPlaying: false, isPaused: false, isLoading: false, isBuffering: false, isJingle: false,
      currentTrack: null, currentIndex: -1, playlist: [], currentSpeaker: null, currentLine: '',
      segmentProgress: 0, segmentElapsed: 0, segmentDuration: 0,
      episodeSegmentIndex: 0, episodeTotalSegments: 0, activeCast: [],
    }));
    updateMediaSession(null, false);
  }, []);

  const next = useCallback(() => {
    const { currentIndex, playlist } = stateRef.current;
    if (currentIndex + 1 < playlist.length) playCardById(playlist[currentIndex + 1].cardId, currentIndex + 1, playlist);
  }, [playCardById]);

  const prev = useCallback(() => {
    const { currentIndex, playlist } = stateRef.current;
    if (currentIndex - 1 >= 0) playCardById(playlist[currentIndex - 1].cardId, currentIndex - 1, playlist);
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
