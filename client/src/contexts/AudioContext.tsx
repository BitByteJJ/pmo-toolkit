// AudioContext — StratAlign Theater multi-host podcast mode
// Up to 5 hosts (Alex, Sam, Jordan, Maya, Chris) using Google Cloud TTS Journey voices.
//
// PERFORMANCE: Uses SSE streaming so the UI shows live "Generating segment X of Y…" progress
// instead of a blank loading spinner for the full generation time.
//
// DOWNLOAD: Sends all base64 segments to /api/podcast-download which stitches them into
// a single MP3 binary and triggers a browser download.

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
  durationSeconds?: number;
}

export interface AudioTrack {
  cardId: string;
  title: string;
  deckTitle: string;
  deckColor: string;
  segments: PodcastSegment[];
  currentSegmentIndex: number;
  totalSegments: number;
  cast: SpeakerName[];
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  loadingProgress: { done: number; total: number } | null; // SSE progress
  loadingStatus: string; // human-readable status message
  currentTrack: AudioTrack | null;
  currentIndex: number;
  playlist: Omit<AudioTrack, 'segments' | 'currentSegmentIndex' | 'totalSegments'>[];
  currentSpeaker: SpeakerName | null;
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
  downloadEpisode: () => void;
  isSupported: boolean;
}

// ─── PODCAST CACHE ────────────────────────────────────────────────────────────
// Use localStorage (persists across page reloads) with a size guard.
const CACHE_PREFIX = 'pmo_podcast_v4_';

function getCachedEpisode(cardId: string): { segments: PodcastSegment[]; cast: SpeakerName[] } | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + cardId);
    if (!raw) return null;
    return JSON.parse(raw) as { segments: PodcastSegment[]; cast: SpeakerName[] };
  } catch {
    return null;
  }
}

function setCachedEpisode(cardId: string, segments: PodcastSegment[], cast: SpeakerName[]) {
  try {
    localStorage.setItem(CACHE_PREFIX + cardId, JSON.stringify({ segments, cast }));
  } catch {
    // localStorage full — try evicting the oldest episode cache entries
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
      if (keys.length > 0) {
        localStorage.removeItem(keys[0]);
        localStorage.setItem(CACHE_PREFIX + cardId, JSON.stringify({ segments, cast }));
      }
    } catch {
      // Give up silently — caching is best-effort
    }
  }
}

// ─── BASE64 → BLOB URL ────────────────────────────────────────────────────────
function base64ToBlobUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/mpeg' }); // MUST be 'audio/mpeg'
  return URL.createObjectURL(blob);
}

// ─── SSE PODCAST FETCH ────────────────────────────────────────────────────────
// Connects to /api/podcast with Accept: text/event-stream so the server streams
// progress events. Falls back to regular JSON fetch if SSE is not available.
async function fetchPodcastEpisodeSSE(
  card: PMOCard,
  deckTitle: string,
  onProgress: (done: number, total: number) => void,
  onStatus: (msg: string) => void
): Promise<{ segments: PodcastSegment[]; cast: SpeakerName[] }> {
  const cached = getCachedEpisode(card.id);
  if (cached) {
    onStatus('Loading from cache…');
    return cached;
  }

  const body = JSON.stringify({
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
  });

  // Use fetch with SSE — EventSource doesn't support POST, so we use fetch + ReadableStream
  const response = await fetch('/api/podcast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Podcast API error ${response.status}: ${err.slice(0, 200)}`);
  }

  const contentType = response.headers.get('content-type') ?? '';

  // ── SSE path ──
  if (contentType.includes('text/event-stream') && response.body) {
    return new Promise((resolve, reject) => {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processChunk = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;

              try {
                const event = JSON.parse(jsonStr) as {
                  type: string;
                  done?: number;
                  total?: number;
                  message?: string;
                  segments?: PodcastSegment[];
                  cast?: SpeakerName[];
                  totalLines?: number;
                };

                if (event.type === 'progress' && event.done != null && event.total != null) {
                  onProgress(event.done, event.total);
                } else if (event.type === 'status' && event.message) {
                  onStatus(event.message);
                  if (event.total != null) onProgress(0, event.total);
                } else if (event.type === 'cast') {
                  // cast selected — no UI action needed yet
                } else if (event.type === 'done' && event.segments) {
                  const cast = event.cast ?? ['Alex', 'Sam'];
                  setCachedEpisode(card.id, event.segments, cast);
                  resolve({ segments: event.segments, cast });
                } else if (event.type === 'error') {
                  reject(new Error(event.message ?? 'Unknown SSE error'));
                }
              } catch {
                // Ignore malformed SSE lines
              }
            }
          }
        } catch (err) {
          reject(err);
        }
      };

      processChunk();
    });
  }

  // ── JSON fallback (non-SSE response) ──
  const data = await response.json() as { segments: PodcastSegment[]; cast?: SpeakerName[] };
  if (!data.segments?.length) throw new Error('No podcast segments returned');
  const cast = data.cast ?? ['Alex', 'Sam'];
  setCachedEpisode(card.id, data.segments, cast);
  return { segments: data.segments, cast };
}

// ─── JINGLE & OUTRO ─────────────────────────────────────────────────────────
// Intro plays before the first spoken segment of a fresh (non-cached) episode.
// Outro stinger plays after the final spoken segment of every episode.
//
// Root cause of previous failure: browser fetch() to CDN was blocked by CORS
// (CDN doesn't send Access-Control-Allow-Origin). Fix: route through our own
// /api/audio-proxy endpoint which proxies the file server-side with CORS headers.
// The <audio> src is set to the same-origin proxy URL, which is always allowed.
// Files are served directly from client/public as same-origin static assets.
// This bypasses all CORS issues — no proxy, no CDN fetch, no autoplay policy.
const JINGLE_URL = '/stratalign-intro.mp3';
const OUTRO_URL  = '/stratalign-outro.mp3';

// ─── WEB AUDIO API APPROACH ──────────────────────────────────────────────────
// Problem: new Audio().play() after an async await fails silently on iOS/Safari
// because the browser considers the user gesture chain broken after any await.
//
// Solution: Use the Web Audio API (AudioContext). Once unlocked with a single
// user gesture (even a silent one), it stays unlocked permanently — no gesture
// required for subsequent play() calls, even after async operations.
//
// We pre-fetch and decode both audio files as AudioBuffers on first use.
// Playback via AudioContext.createBufferSource() never needs a gesture.

let _audioCtx: AudioContext | null = null;
const _audioBuffers: Record<string, AudioBuffer> = {};
// Store in-flight fetch promises so concurrent callers share the same fetch
const _audioBufferPromises: Record<string, Promise<AudioBuffer | null>> = {};

// Call this synchronously inside a user gesture handler to unlock the AudioContext.
// Also pre-loads both jingle buffers so they're ready before the episode finishes generating.
export function unlockAudioContext() {
  if (typeof window === 'undefined') return;
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Pre-load both audio files immediately so they're cached as AudioBuffers.
    // Store the promises so playJingle/playOutro can await them instead of getting null.
    _audioBufferPromises[JINGLE_URL] = loadAudioBuffer(JINGLE_URL);
    _audioBufferPromises[OUTRO_URL]  = loadAudioBuffer(OUTRO_URL);
  }
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume().catch(() => {});
  }
}

async function loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
  // Return cached buffer immediately
  if (_audioBuffers[url]) return _audioBuffers[url];
  // Return in-flight promise if one already exists (prevents duplicate fetches)
  const existing = _audioBufferPromises[url];
  if (existing) return existing;
  if (!_audioCtx) return null;
  const promise = (async () => {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const arrayBuf = await resp.arrayBuffer();
      const decoded = await _audioCtx!.decodeAudioData(arrayBuf);
      _audioBuffers[url] = decoded;
      return decoded;
    } catch (e) {
      console.warn('[StratAlign Theater] Failed to load audio buffer:', url, e);
      return null;
    }
  })();
  _audioBufferPromises[url] = promise;
  return promise;
}

function playAudioBuffer(buffer: AudioBuffer): Promise<void> {
  return new Promise((resolve) => {
    if (!_audioCtx) { resolve(); return; }
    const source = _audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(_audioCtx.destination);
    source.onended = () => resolve();
    source.start(0);
  });
}

async function playJingleAsync(): Promise<void> {
  const buf = await loadAudioBuffer(JINGLE_URL);
  if (buf) await playAudioBuffer(buf);
}

async function playOutroAsync(): Promise<void> {
  const buf = await loadAudioBuffer(OUTRO_URL);
  if (buf) await playAudioBuffer(buf);
}

function playJingle(onEnded: () => void) {
  playJingleAsync().then(onEnded).catch(onEnded);
}

function playOutro(onEnded: () => void) {
  playOutroAsync().then(onEnded).catch(onEnded);
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const isSupported = typeof window !== 'undefined' && typeof Audio !== 'undefined';

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    loadingProgress: null,
    loadingStatus: '',
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
  const currentBlobUrlRef = useRef<string | null>(null);
  const currentTrackRef = useRef<AudioTrack | null>(null);
  // Guard flag: set to true when stop() is called so that the audio element's
  // onended event (which fires when src is cleared) does NOT trigger the outro.
  const isStoppedRef = useRef(false);

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

  function revokePreviousBlobUrl() {
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
  }

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

  const playSegment = useCallback((
    segment: PodcastSegment,
    segIdx: number,
    totalSegments: number,
    onEnded: () => void
  ) => {
    const audio = getAudio();
    audio.pause();
    revokePreviousBlobUrl();
    const blobUrl = base64ToBlobUrl(segment.audioContent);
    currentBlobUrlRef.current = blobUrl;
    audio.src = blobUrl;
    audio.playbackRate = stateRef.current.rate;

    setState(prev => ({
      ...prev,
      segmentProgress: 0,
      segmentElapsed: 0,
      segmentDuration: 0,
      episodeSegmentIndex: segIdx,
      episodeTotalSegments: totalSegments,
    }));

    audio.onended = onEnded;
    audio.onerror = () => onEnded();
    audio.play().catch(err => {
      console.error('[StratAlign Theater] play() failed:', err);
    });
  }, []);

  const playTrackSegments = useCallback((track: AudioTrack, startSegment = 0, playIntroJingle = false) => {
    // Reset stop guard so this new episode plays fully
    isStoppedRef.current = false;
    currentTrackRef.current = { ...track, currentSegmentIndex: startSegment };

    const playNext = (segIdx: number) => {
      // If stop() was called, bail out immediately — do NOT play outro
      if (isStoppedRef.current) return;
      const t = currentTrackRef.current;
      if (!t || segIdx >= t.segments.length) {
        // Episode finished naturally — play outro stinger
        const finishEpisode = () => {
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
        };
        // Play outro stinger (gracefully skip if blocked or CDN unreachable)
        playOutro(finishEpisode);
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

    if (playIntroJingle && startSegment === 0) {
      // Play jingle first, then start the episode
      playJingle(() => playNext(startSegment));
    } else {
      playNext(startSegment);
    }
  }, [playSegment]);

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
      loadingProgress: null,
      loadingStatus: 'Writing script…',
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
    // Check cache BEFORE fetching — fetchPodcastEpisodeSSE returns cache immediately
    // so we must check here to know whether to play the intro jingle
    const wasFromCache = !!getCachedEpisode(card.id);
    try {
      const result = await fetchPodcastEpisodeSSE(
        card,
        deckTitle,
        (done, total) => {
          setState(prev => ({
            ...prev,
            loadingProgress: { done, total },
            loadingStatus: `Generating audio… ${done}/${total}`,
          }));
        },
        (msg) => {
          setState(prev => ({ ...prev, loadingStatus: msg }));
        }
      );
      segments = result.segments;
      cast = result.cast;
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        loadingProgress: null,
        loadingStatus: '',
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
      loadingProgress: null,
      loadingStatus: '',
      currentTrack: track,
      episodeTotalSegments: segments.length,
    }));

    // Play intro jingle on every episode start
    playTrackSegments(track, 0, true);
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

  // ── Download current episode as MP3 ──
  const downloadEpisode = useCallback(async () => {
    const track = stateRef.current.currentTrack;
    if (!track || track.segments.length === 0) return;

    try {
      const response = await fetch('/api/podcast-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segments: track.segments.map(s => ({
            audioContent: s.audioContent,
            speaker: s.speaker,
            line: s.line,
          })),
          title: track.title,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Download failed: ${err.slice(0, 100)}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = track.title
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .slice(0, 80);
      a.href = url;
      a.download = `${safeName}-stratalign-theater.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error('[StratAlign Theater] Download failed:', err);
    }
  }, []);

  // ── Public API ──
  const playCard = useCallback((cardId: string) => {
    // MUST unlock AudioContext synchronously here — this is the user gesture entry point.
    // Any async work (fetch, await) after this point breaks the gesture chain on iOS/Safari.
    // Once unlocked, AudioContext stays unlocked permanently for the session.
    unlockAudioContext();
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
    unlockAudioContext(); // unlock on user gesture
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
    // Set stop guard BEFORE clearing audio.src — clearing src fires onended
    // which would otherwise trigger the outro via playNext
    isStoppedRef.current = true;
    const audio = getAudio();
    audio.onended = null; // also clear the handler explicitly
    audio.onerror = null;
    audio.pause();
    audio.src = '';
    revokePreviousBlobUrl();
    currentTrackRef.current = null;
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      loadingProgress: null,
      loadingStatus: '',
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
      downloadEpisode,
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
