import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, RotateCcw, ChevronRight, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SceneType = 'title' | 'bullet-reveal' | 'diagram' | 'quote' | 'split' | 'summary';

export interface DiagramData {
  type: 'matrix' | 'flow' | 'pyramid' | 'cycle' | 'list';
  labels?: string[];
  steps?: string[];
}

export interface VideoScene {
  id: string;
  type: SceneType;
  narration: string;
  heading?: string;
  bullets?: string[];
  quote?: string;
  leftText?: string;
  rightIcon?: string;
  diagram?: DiagramData;
  summaryPoints?: string[];
  durationMs?: number;
}

export interface VideoGuideData {
  cardId: string;
  cardTitle: string;
  deckColor: string;
  deckBgColor: string;
  scenes: VideoScene[];
}

// ─── Scene renderers ──────────────────────────────────────────────────────────

function TitleScene({ scene, color, bgColor }: { scene: VideoScene; color: string; bgColor: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-6" style={{ backgroundColor: bgColor }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-1 w-24 rounded-full mb-6"
        style={{ backgroundColor: color }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-2xl font-bold leading-tight mb-3"
        style={{ fontFamily: 'Sora, sans-serif', color: '#e2e8f0' }}
      >
        {scene.heading}
      </motion.h1>
      {scene.leftText && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-gray-600 max-w-xs leading-relaxed"
        >
          {scene.leftText}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
        className="h-1 w-24 rounded-full mt-6"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function BulletRevealScene({ scene, color, bgColor }: { scene: VideoScene; color: string; bgColor: string }) {
  const bullets = scene.bullets || [];
  return (
    <div className="flex flex-col justify-center h-full px-8 py-6" style={{ backgroundColor: bgColor }}>
      {scene.heading && (
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-bold mb-5"
          style={{ fontFamily: 'Sora, sans-serif', color: '#e2e8f0' }}
        >
          {scene.heading}
        </motion.h2>
      )}
      <div className="space-y-3">
        {bullets.map((bullet, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.35 }}
            className="flex items-start gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.35 }}
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-700 leading-relaxed">{bullet}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuoteScene({ scene, color, bgColor }: { scene: VideoScene; color: string; bgColor: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-6" style={{ backgroundColor: bgColor }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-5xl mb-4 leading-none"
        style={{ color: color, fontFamily: 'Georgia, serif' }}
      >
        "
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base font-medium text-center leading-relaxed text-gray-800 italic max-w-xs"
      >
        {scene.quote}
      </motion.p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="h-0.5 w-16 rounded-full mt-5"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function SplitScene({ scene, color, bgColor }: { scene: VideoScene; color: string; bgColor: string }) {
  return (
    <div className="flex items-center h-full px-6 py-6 gap-4" style={{ backgroundColor: bgColor }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {scene.heading && (
          <h2 className="text-base font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif', color: '#e2e8f0' }}>
            {scene.heading}
          </h2>
        )}
        <p className="text-sm text-gray-700 leading-relaxed">{scene.leftText}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
        style={{ backgroundColor: color + '20', border: `2px solid ${color}40` }}
      >
        {scene.rightIcon || '💡'}
      </motion.div>
    </div>
  );
}

function DiagramScene({ scene, color, bgColor }: { scene: VideoScene; color: string; bgColor: string }) {
  const d = scene.diagram;
  if (!d) return <BulletRevealScene scene={scene} color={color} bgColor={bgColor} />;

  if (d.type === 'matrix' && d.labels && d.labels.length >= 4) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-4" style={{ backgroundColor: bgColor }}>
        {scene.heading && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold mb-4 text-center"
            style={{ color: '#e2e8f0', fontFamily: 'Sora, sans-serif' }}
          >
            {scene.heading}
          </motion.h2>
        )}
        <div className="grid grid-cols-2 gap-1.5 w-full max-w-[240px]">
          {d.labels.map((label, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.15 }}
              className="rounded-xl p-3 text-center text-xs font-semibold"
              style={{ backgroundColor: color + (i % 2 === 0 ? '25' : '15'), color: '#e2e8f0', border: `1.5px solid ${color}40` }}
            >
              {label}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (d.type === 'flow' && d.steps) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-4" style={{ backgroundColor: bgColor }}>
        {scene.heading && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold mb-4 text-center"
            style={{ color: '#e2e8f0', fontFamily: 'Sora, sans-serif' }}
          >
            {scene.heading}
          </motion.h2>
        )}
        <div className="flex flex-col items-center gap-1 w-full max-w-[220px]">
          {d.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.2 }}
              className="w-full"
            >
              <div
                className="rounded-lg px-3 py-2 text-center text-xs font-semibold w-full"
                style={{ backgroundColor: color + '20', color: '#e2e8f0', border: `1.5px solid ${color}50` }}
              >
                {step}
              </div>
              {i < d.steps!.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <ChevronRight size={14} style={{ color, transform: 'rotate(90deg)' }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (d.type === 'cycle' && d.steps) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-4" style={{ backgroundColor: bgColor }}>
        {scene.heading && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold mb-3 text-center"
            style={{ color: '#e2e8f0', fontFamily: 'Sora, sans-serif' }}
          >
            {scene.heading}
          </motion.h2>
        )}
        <div className="grid grid-cols-2 gap-2 w-full max-w-[220px]">
          {d.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.2 }}
              className="rounded-full px-2 py-2 text-center text-[11px] font-bold flex items-center justify-center"
              style={{ backgroundColor: color + '20', color: '#e2e8f0', border: `2px solid ${color}60`, minHeight: '52px' }}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return <BulletRevealScene scene={scene} color={color} bgColor={bgColor} />;
}

function SummaryScene({ scene, color, bgColor }: { scene: VideoScene; color: string; bgColor: string }) {
  const points = scene.summaryPoints || scene.bullets || [];
  return (
    <div className="flex flex-col justify-center h-full px-8 py-6" style={{ backgroundColor: bgColor }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-5"
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
          ✓
        </div>
        <h2 className="text-base font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#e2e8f0' }}>
          {scene.heading || 'Key Takeaways'}
        </h2>
      </motion.div>
      <div className="space-y-2.5">
        {points.map((pt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.3 }}
            className="flex items-start gap-3 p-2.5 rounded-xl"
            style={{ backgroundColor: color + '12' }}
          >
            <span className="text-sm font-bold shrink-0" style={{ color }}>0{i + 1}</span>
            <span className="text-sm text-gray-700 leading-snug">{pt}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Scene renderer dispatcher ────────────────────────────────────────────────

function SceneRenderer({ scene, color, bgColor }: { scene: VideoScene; color: string; bgColor: string }) {
  switch (scene.type) {
    case 'title': return <TitleScene scene={scene} color={color} bgColor={bgColor} />;
    case 'bullet-reveal': return <BulletRevealScene scene={scene} color={color} bgColor={bgColor} />;
    case 'quote': return <QuoteScene scene={scene} color={color} bgColor={bgColor} />;
    case 'split': return <SplitScene scene={scene} color={color} bgColor={bgColor} />;
    case 'diagram': return <DiagramScene scene={scene} color={color} bgColor={bgColor} />;
    case 'summary': return <SummaryScene scene={scene} color={color} bgColor={bgColor} />;
    default: return <BulletRevealScene scene={scene} color={color} bgColor={bgColor} />;
  }
}

// ─── TTS cache & pre-fetch helpers ───────────────────────────────────────────

const audioBufferCache = new Map<string, AudioBuffer>();
const fetchingPromises = new Map<string, Promise<AudioBuffer | null>>();

let sharedAudioCtx: AudioContext | null = null;
function getSharedAudioCtx(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioContext();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function softenPunctuation(text: string): string {
  return text
    .replace(/\s*—\s*/g, ', ')
    .replace(/:\s+/g, ', ')
    .replace(/;\s+/g, ', ')
    .replace(/\.\.\./g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function isFastConnection(): boolean {
  const nav = navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } };
  const conn = nav.connection;
  if (!conn) return true;
  if (conn.saveData) return false;
  return conn.effectiveType === '4g' || conn.effectiveType === undefined;
}

async function fetchAndDecodeAudio(text: string): Promise<AudioBuffer | null> {
  const processed = softenPunctuation(text);
  if (audioBufferCache.has(processed)) return audioBufferCache.get(processed)!;
  if (fetchingPromises.has(processed)) return fetchingPromises.get(processed)!;

  const promise = (async (): Promise<AudioBuffer | null> => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: processed }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const data = await res.json() as { audioContent: string };

      const binary = atob(data.audioContent);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const ctx = getSharedAudioCtx();
      const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
      audioBufferCache.set(processed, audioBuffer);
      return audioBuffer;
    } catch (err) {
      console.warn('[TTS] Pre-fetch failed:', err);
      return null;
    } finally {
      fetchingPromises.delete(processed);
    }
  })();

  fetchingPromises.set(processed, promise);
  return promise;
}

// ─── Podcast ambient sounds (synthesised via Web Audio API) ──────────────────
//
// Sound 1 — Intro chime: a warm three-note rising chord (C4-E4-G4) played with
//   a soft piano-like envelope. Fades in over 80 ms, sustains 0.6 s, fades out
//   over 1.2 s. Total duration ~2 s. Played once when the user presses Play.
//
// Sound 2 — Ambient pad: a very quiet (gain 0.045) drone on C2 built from two
//   slightly detuned sawtooth oscillators run through a lowpass filter at 320 Hz.
//   This creates the warm, low "room hum" you hear on podcast recordings. Loops
//   continuously while narration is playing; fades out when paused/stopped.

function playIntroChime(ctx: AudioContext): void {
  // Three-note rising chord: C4 (261.6 Hz), E4 (329.6 Hz), G4 (392 Hz)
  const notes = [261.63, 329.63, 392.0];
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Soft piano-like envelope: attack 80 ms, hold, release 1.2 s
    const startAt = now + i * 0.08; // stagger each note slightly
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(0.18, startAt + 0.08);
    gain.gain.setValueAtTime(0.18, startAt + 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.8);

    // Gentle lowpass to remove harshness
    filter.type = 'lowpass';
    filter.frequency.value = 3200;
    filter.Q.value = 0.5;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startAt);
    osc.stop(startAt + 1.9);
  });
}

interface AmbientPad {
  stop: (fadeMs?: number) => void;
}

function startAmbientPad(ctx: AudioContext): AmbientPad {
  // Two slightly detuned sawtooth oscillators → lowpass → gain
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const masterGain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc1.frequency.value = 65.41; // C2
  osc2.type = 'sawtooth';
  osc2.frequency.value = 65.41 * 1.004; // slight detune for warmth

  filter.type = 'lowpass';
  filter.frequency.value = 320;
  filter.Q.value = 0.8;

  // Very quiet — sits under the voice without competing
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start();
  osc2.start();

  return {
    stop: (fadeMs = 800) => {
      const now = ctx.currentTime;
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
      osc1.stop(now + fadeMs / 1000 + 0.05);
      osc2.stop(now + fadeMs / 1000 + 0.05);
    },
  };
}

// ─── Narration hook ───────────────────────────────────────────────────────────

function useNarration() {
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const onEndRef = useRef<(() => void) | null>(null);
  const cancelledRef = useRef(false);

  const stopSource = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.onended = null; sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    stopSource();
    pausedAtRef.current = 0;
    bufferRef.current = null;
    onEndRef.current = null;
  }, [stopSource]);

  const playBuffer = useCallback((buffer: AudioBuffer, offsetSecs: number, onEnd?: () => void) => {
    const ctx = getSharedAudioCtx();
    stopSource();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    onEndRef.current = onEnd || null;
    source.onended = () => {
      if (!cancelledRef.current) {
        pausedAtRef.current = 0;
        onEndRef.current?.();
      }
    };
    sourceRef.current = source;
    startTimeRef.current = ctx.currentTime - offsetSecs;
    source.start(0, offsetSecs);
  }, [stopSource]);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    cancelledRef.current = false;
    pausedAtRef.current = 0;
    bufferRef.current = null;
    stopSource();

    const audioBuffer = await fetchAndDecodeAudio(text);
    if (cancelledRef.current) return;

    if (audioBuffer) {
      bufferRef.current = audioBuffer;
      playBuffer(audioBuffer, 0, onEnd);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(softenPunctuation(text));
        u.rate = 0.88; u.pitch = 0.95;
        u.onend = () => { if (!cancelledRef.current) onEnd?.(); };
        window.speechSynthesis.speak(u);
      } else {
        onEnd?.();
      }
    }
  }, [stopSource, playBuffer]);

  const pause = useCallback(() => {
    const ctx = getSharedAudioCtx();
    if (sourceRef.current) {
      pausedAtRef.current = ctx.currentTime - startTimeRef.current;
      stopSource();
    }
  }, [stopSource]);

  const resume = useCallback(() => {
    if (bufferRef.current) {
      playBuffer(bufferRef.current, pausedAtRef.current, onEndRef.current ?? undefined);
    }
  }, [playBuffer]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      stopSource();
    };
  }, [stopSource]);

  return { speak, stop, pause, resume, supported: true };
}

// ─── Main VideoGuide component ────────────────────────────────────────────────

interface VideoGuideProps {
  data: VideoGuideData;
}

const AVA_NAME = 'Ava';
const AVA_GREETING_KEY = 'ava-greeting-date';

function getAvaGreeting(): string | null {
  const today = new Date().toDateString();
  const lastSeen = localStorage.getItem(AVA_GREETING_KEY);
  if (lastSeen === today) return null;
  localStorage.setItem(AVA_GREETING_KEY, today);
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return `Hi, good ${timeOfDay}. I'm ${AVA_NAME}, your learning guide. Let's dive in.`;
}

export function VideoGuide({ data }: VideoGuideProps) {
  const { scenes, deckColor, deckBgColor, cardTitle } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const [isWarmingUp, setIsWarmingUp] = useState(true);

  const { speak, stop, pause, resume, supported } = useNarration();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Holds the currently running ambient pad so we can stop it on pause/unmount
  const ambientPadRef = useRef<AmbientPad | null>(null);

  const currentScene = scenes[currentIndex];
  const totalScenes = scenes.length;
  const progress = ((currentIndex + 1) / totalScenes) * 100;

  // ── Pre-fetch scene 0 on mount ──
  useEffect(() => {
    if (scenes.length === 0) return;
    setIsWarmingUp(true);
    fetchAndDecodeAudio(scenes[0].narration).then(() => setIsWarmingUp(false));
  }, [scenes]);

  // ── Smart pre-fetch: all scenes on fast connections, just next on slow ──
  useEffect(() => {
    if (scenes.length === 0) return;
    if (isFastConnection()) {
      scenes.forEach((scene, i) => {
        setTimeout(() => fetchAndDecodeAudio(scene.narration).catch(() => {}), i * 300);
      });
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex < scenes.length) {
        fetchAndDecodeAudio(scenes[nextIndex].narration).catch(() => {});
      }
    }
  }, [scenes, currentIndex]);

  // ── Stop ambient pad on unmount ──
  useEffect(() => {
    return () => {
      ambientPadRef.current?.stop(400);
      ambientPadRef.current = null;
      stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getSceneDuration = (scene: VideoScene) => {
    if (scene.durationMs) return scene.durationMs;
    const words = scene.narration.split(' ').length;
    return Math.max(4000, (words / 140) * 60 * 1000 + 1500);
  };

  const advanceScene = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= totalScenes - 1) {
        setIsPlaying(false);
        stop();
        // Fade out ambient pad when guide ends
        ambientPadRef.current?.stop(1200);
        ambientPadRef.current = null;
        return prev;
      }
      return prev + 1;
    });
    setSceneKey(k => k + 1);
  }, [totalScenes, stop]);

  const playScene = useCallback((index: number, muted: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const scene = scenes[index];
    const duration = getSceneDuration(scene);

    if (!muted && supported) {
      speak(scene.narration, () => {
        timerRef.current = setTimeout(advanceScene, 800);
      });
    } else {
      timerRef.current = setTimeout(advanceScene, duration);
    }
  }, [scenes, speak, advanceScene, supported]);

  useEffect(() => {
    if (isPlaying) {
      playScene(currentIndex, isMuted);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPlaying, sceneKey]);

  // Start ambient pad + intro chime when playback begins
  const startAmbience = useCallback((muted: boolean) => {
    if (muted) return;
    const ctx = getSharedAudioCtx();
    // Play intro chime on very first play
    if (!hasStarted) {
      playIntroChime(ctx);
    }
    // Start ambient pad if not already running
    if (!ambientPadRef.current) {
      ambientPadRef.current = startAmbientPad(ctx);
    }
  }, [hasStarted]);

  const handlePlay = () => {
    startAmbience(isMuted);
    setHasStarted(true);
    setIsPlaying(true);

    if (!isMuted && supported && currentIndex === 0) {
      const greeting = getAvaGreeting();
      if (greeting) {
        speak(greeting, () => playScene(0, isMuted));
        return;
      }
    }

    playScene(currentIndex, isMuted);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    pause();
    // Fade out ambient pad while paused
    ambientPadRef.current?.stop(600);
    ambientPadRef.current = null;
  };

  const handleResume = () => {
    // Restart ambient pad on resume (no chime)
    if (!isMuted) {
      const ctx = getSharedAudioCtx();
      ambientPadRef.current = startAmbientPad(ctx);
    }
    setIsPlaying(true);
    playScene(currentIndex, isMuted);
  };

  const handleSkipForward = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    if (currentIndex < totalScenes - 1) {
      setCurrentIndex(i => i + 1);
      setSceneKey(k => k + 1);
      if (isPlaying) setTimeout(() => playScene(currentIndex + 1, isMuted), 50);
    }
  };

  const handleSkipBack = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSceneKey(k => k + 1);
      if (isPlaying) setTimeout(() => playScene(currentIndex - 1, isMuted), 50);
    }
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    ambientPadRef.current?.stop(400);
    ambientPadRef.current = null;
    setCurrentIndex(0);
    setSceneKey(k => k + 1);
    setIsPlaying(false);
    setHasStarted(false);
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      // Muting — stop ambient pad
      ambientPadRef.current?.stop(400);
      ambientPadRef.current = null;
    } else if (isPlaying) {
      // Unmuting while playing — restart ambient pad
      const ctx = getSharedAudioCtx();
      ambientPadRef.current = startAmbientPad(ctx);
    }
    if (isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      stop();
      setTimeout(() => playScene(currentIndex, newMuted), 50);
    }
  };

  const handleSceneClick = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    setCurrentIndex(index);
    setSceneKey(k => k + 1);
    setHasStarted(true);
    setIsPlaying(true);
    // Ensure ambient pad is running
    if (!isMuted && !ambientPadRef.current) {
      const ctx = getSharedAudioCtx();
      ambientPadRef.current = startAmbientPad(ctx);
    }
    setTimeout(() => playScene(index, isMuted), 50);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Player */}
      <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 4px 24px ${deckColor}22, 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1.5px ${deckColor}28` }}>
        {/* Scene viewport */}
        <div className="relative" style={{ height: '280px', backgroundColor: deckBgColor }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`scene-${currentIndex}-${sceneKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <SceneRenderer scene={currentScene} color={deckColor} bgColor={deckBgColor} />
            </motion.div>
          </AnimatePresence>

          {/* Start overlay */}
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: `${deckBgColor}e8` }}
            >
              <motion.button
                whileHover={{ scale: isWarmingUp ? 1 : 1.08 }}
                whileTap={{ scale: isWarmingUp ? 1 : 0.95 }}
                onClick={isWarmingUp ? undefined : handlePlay}
                disabled={isWarmingUp}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg mb-3"
                style={{ backgroundColor: deckColor, opacity: isWarmingUp ? 0.85 : 1 }}
              >
                {isWarmingUp ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Play size={24} fill="white" />
                )}
              </motion.button>
              <p className="text-sm font-semibold text-gray-700">
                {isWarmingUp ? 'Preparing audio…' : 'Play Video Guide'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totalScenes} scenes · ~{Math.round(scenes.reduce((s, sc) => s + getSceneDuration(sc), 0) / 1000 / 60)} min
              </p>
            </motion.div>
          )}

          {/* Scene counter */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: deckColor + 'cc' }}>
            {currentIndex + 1} / {totalScenes}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full" style={{ backgroundColor: deckColor + '20' }}>
          <motion.div
            className="h-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: deckColor }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3.5" style={{ backgroundColor: deckBgColor, borderTop: `1px solid ${deckColor}18` }}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkipBack}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105"
              style={{ backgroundColor: deckColor + '18', boxShadow: `0 1px 3px ${deckColor}20` }}
            >
              <SkipBack size={14} style={{ color: deckColor }} />
            </button>

            {isPlaying ? (
              <button
                onClick={handlePause}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
                style={{ backgroundColor: deckColor, boxShadow: `0 4px 12px ${deckColor}50` }}
              >
                <Pause size={18} fill="white" />
              </button>
            ) : (
              <button
                onClick={hasStarted ? handleResume : handlePlay}
                disabled={!hasStarted && isWarmingUp}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white disabled:opacity-60 transition-all hover:scale-105"
                style={{ backgroundColor: deckColor, boxShadow: `0 4px 12px ${deckColor}50` }}
              >
                {!hasStarted && isWarmingUp
                  ? <Loader2 size={18} className="animate-spin" />
                  : <Play size={18} fill="white" />
                }
              </button>
            )}

            <button
              onClick={handleSkipForward}
              disabled={currentIndex === totalScenes - 1}
              className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105"
              style={{ backgroundColor: deckColor + '18', boxShadow: `0 1px 3px ${deckColor}20` }}
            >
              <SkipForward size={14} style={{ color: deckColor }} />
            </button>
          </div>

          <div className="text-[11px] font-semibold text-gray-500 flex-1 text-center px-2 truncate tracking-tight">
            {currentScene.heading || cardTitle}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: deckColor + '18', boxShadow: `0 1px 3px ${deckColor}20` }}
            >
              <RotateCcw size={13} style={{ color: deckColor }} />
            </button>
            {supported && (
              <button
                onClick={handleMuteToggle}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ backgroundColor: deckColor + '18', boxShadow: `0 1px 3px ${deckColor}20` }}
              >
                {isMuted ? <VolumeX size={14} style={{ color: deckColor }} /> : <Volume2 size={14} style={{ color: deckColor }} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scene strip */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {scenes.map((scene, i) => (
          <button
            key={i}
            onClick={() => handleSceneClick(i)}
            className="shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-bold transition-all"
            style={{
              backgroundColor: i === currentIndex ? deckColor : 'white',
              color: i === currentIndex ? 'white' : deckColor,
              boxShadow: i === currentIndex
                ? `0 2px 8px ${deckColor}40`
                : '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
            }}
          >
            {i + 1}. {(scene.heading || scene.type).slice(0, 14)}
          </button>
        ))}
      </div>

      {/* Narration text */}
      <div className="rounded-2xl p-4 text-xs text-gray-600 leading-relaxed" style={{ backgroundColor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}>
        <span className="font-semibold text-gray-500 text-[10px] uppercase tracking-wide block mb-1">Narration</span>
        {currentScene.narration}
      </div>

      {!supported && (
        <p className="text-xs text-amber-600 text-center">Voice narration is not supported in this browser. Visual guide only.</p>
      )}
    </div>
  );
}
