// AudioContext — Two-host podcast mode using Google Cloud TTS (streaming)
// Alex (Journey-D, male) and Sam (Journey-O, female) have a natural back-and-forth conversation.
//
// Streaming architecture:
//   - /api/podcast returns NDJSON segments as each TTS line completes server-side
//   - We start playing the FIRST segment as soon as it arrives (~3-5 s)
//   - Subsequent segments are queued and played back-to-back with no gap
//   - A "buffering" state is shown when the player is waiting for the next segment

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
  index: number;
}

export interface AudioTrack {
  cardId: string;
  title: string;
  deckTitle: string;
  deckColor: string;
  segments: PodcastSegment[];
  currentSegmentIndex: number;
  totalSegments: number;
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;      // fetching first segment
  isBuffering: boolean;    // playing but waiting for next segment
  currentTrack: AudioTrack | null;
  currentIndex: number;
  playlist: Omit<AudioTrack, 'segments' | 'currentSegmentIndex' | 'totalSegments'>[];
  currentSpeaker: 'Alex' | 'Sam' | null;
  currentLine: string;
  rate: number;
  error: string | null;
  segmentProgress: number;
  segmentElapsed: number;
  segmentDuration: number;
  episodeSegmentIndex: number;
  episodeTotalSegments: number;
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
const CACHE_PREFIX = 'pmo_podcast_v2_';

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

  // Segment queue — segments arrive from the stream and are queued here
  // The playback engine dequeues them one by one
  const segmentQueueRef = useRef<PodcastSegment[]>([]);
  const streamDoneRef = useRef(false);       // stream has finished sending segments
  const playingSegIdxRef = useRef(-1);       // which segment index is currently playing
  const isPlayingRef = useRef(false);        // avoid re-entrant playNext calls
  const currentCardIdRef = useRef<string>(''); // guard against stale callbacks

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
        if (dur > 0 && isFinite(dur)) {
          setState(prev => ({ ...prev, segmentDuration: dur }));
        }
      });

      audioRef.current = audio;
    }
    return audioRef.current;
  }

  // ── Media Session ──
  function updateMediaSession(
    track: Omit<AudioTrack, 'segments' | 'currentSegmentIndex' | 'totalSegments'> | null,
    playing: boolean,
    speaker?: 'Alex' | 'Sam' | null
  ) {
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

  // ── Dequeue and play the next available segment ──
  const playNextSegment = useCallback((cardId: string) => {
    // Guard: if the card has changed, stop
    if (cardId !== currentCardIdRef.current) return;
    if (stateRef.current.isPaused) return;

    const queue = segmentQueueRef.current;

    // Find the next segment in order
    const nextIdx = playingSegIdxRef.current + 1;
    const segment = queue.find(s => s.index === nextIdx);

    if (!segment) {
      // Not in queue yet
      if (streamDoneRef.current) {
        // Stream finished and no more segments — episode complete
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
        // Still streaming — show buffering state and poll
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
      : Math.max(queue.length, nextIdx + 2); // estimate

    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isBuffering: false,
      isLoading: false,
      currentSpeaker: segment.speaker,
      currentLine: segment.line,
      segmentProgress: 0,
      segmentElapsed: 0,
      segmentDuration: 0,
      episodeSegmentIndex: nextIdx,
      episodeTotalSegments: totalKnown,
      currentTrack: prev.currentTrack
        ? { ...prev.currentTrack, currentSegmentIndex: nextIdx, segments: queue.slice() }
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
      console.warn('[Audio] Segment error, skipping');
      isPlayingRef.current = false;
      if (cardId === currentCardIdRef.current) playNextSegment(cardId);
    };

    audio.play().catch(err => console.error('[Audio] play() failed:', err));
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

    // Stop current audio and reset state
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

    const lightTrack = {
      cardId,
      title: card.title,
      deckTitle,
      deckColor,
    };

    setState(prev => ({
      ...prev,
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      isBuffering: false,
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
      },
    }));

    // Check cache first — if cached, skip streaming
    const cached = getCachedEpisode(cardId);
    if (cached?.length) {
      console.log(`[Podcast] Cache hit for: ${card.title}`);
      segmentQueueRef.current = cached;
      streamDoneRef.current = true;
      setState(prev => ({
        ...prev,
        isLoading: false,
        episodeTotalSegments: cached.length,
        currentTrack: prev.currentTrack
          ? { ...prev.currentTrack, segments: cached, totalSegments: cached.length }
          : prev.currentTrack,
      }));
      playNextSegment(cardId);
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
        // Stop if card changed (user pressed a different card)
        if (cardId !== currentCardIdRef.current) {
          reader.cancel();
          return;
        }

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
              // Cache the complete episode
              const allSegments = segmentQueueRef.current;
              if (allSegments.length > 0) {
                setCachedEpisode(cardId, allSegments);
              }
              // Update total count
              setState(prev => ({
                ...prev,
                episodeTotalSegments: allSegments.length,
                currentTrack: prev.currentTrack
                  ? { ...prev.currentTrack, totalSegments: allSegments.length, segments: allSegments.slice() }
                  : prev.currentTrack,
              }));
              // If buffering, kick off playback
              if (!isPlayingRef.current && !stateRef.current.isPaused) {
                playNextSegment(cardId);
              }
              continue;
            }

            if (parsed.error) {
              console.error('[Podcast] Stream error:', parsed.error);
              continue;
            }

            // It's a segment
            const segment: PodcastSegment = {
              speaker: parsed.speaker,
              line: parsed.line,
              audioContent: parsed.audioContent,
              index: parsed.index,
            };

            segmentQueueRef.current = [...segmentQueueRef.current, segment];

            // Start playback as soon as the first segment arrives
            if (!streamStarted) {
              streamStarted = true;
              setState(prev => ({ ...prev, isLoading: false }));
              if (!isPlayingRef.current) {
                playNextSegment(cardId);
              }
            }

            // Update track segments in state
            const currentSegments = segmentQueueRef.current;
            setState(prev => ({
              ...prev,
              episodeTotalSegments: streamDoneRef.current ? currentSegments.length : Math.max(prev.episodeTotalSegments, segment.index + 2),
              currentTrack: prev.currentTrack
                ? { ...prev.currentTrack, segments: currentSegments.slice() }
                : prev.currentTrack,
            }));

          } catch {
            // malformed JSON line — skip
          }
        }
      }

      // Handle any remaining buffered line
      if (lineBuffer.trim()) {
        try {
          const parsed = JSON.parse(lineBuffer.trim());
          if (parsed.done) {
            streamDoneRef.current = true;
            if (!isPlayingRef.current && !stateRef.current.isPaused) {
              playNextSegment(cardId);
            }
          }
        } catch { /* ignore */ }
      }

      streamDoneRef.current = true;
      if (!isPlayingRef.current && !stateRef.current.isPaused) {
        playNextSegment(cardId);
      }

    } catch (err) {
      if (cardId !== currentCardIdRef.current) return; // stale
      console.error('[Podcast] Stream error:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isBuffering: false,
        isPlaying: false,
        error: String(err),
      }));
    }
  }, [playNextSegment]);

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
        isPlaying: false,
        isPaused: false,
        isBuffering: false,
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
    setState(prev => ({ ...prev, isPaused: true, isPlaying: false, isBuffering: false }));
    const { playlist, currentIndex, currentSpeaker } = stateRef.current;
    updateMediaSession(playlist[currentIndex] ?? null, false, currentSpeaker);
  }, []);

  const resume = useCallback(() => {
    const audio = getAudio();
    // If we have a src, resume it; otherwise kick off next segment
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
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      isBuffering: false,
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
