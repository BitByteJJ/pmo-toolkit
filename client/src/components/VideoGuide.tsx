import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, RotateCcw, ChevronRight } from 'lucide-react';

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
  rightIcon?: string; // emoji or short label
  diagram?: DiagramData;
  summaryPoints?: string[];
  durationMs?: number; // auto-calculated from narration length if omitted
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
        style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}
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
          style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}
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
          <h2 className="text-base font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}>
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
            style={{ color: '#1a1a2e', fontFamily: 'Sora, sans-serif' }}
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
              style={{ backgroundColor: color + (i % 2 === 0 ? '25' : '15'), color: '#1a1a2e', border: `1.5px solid ${color}40` }}
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
            style={{ color: '#1a1a2e', fontFamily: 'Sora, sans-serif' }}
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
                style={{ backgroundColor: color + '20', color: '#1a1a2e', border: `1.5px solid ${color}50` }}
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
            style={{ color: '#1a1a2e', fontFamily: 'Sora, sans-serif' }}
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
              style={{ backgroundColor: color + '20', color: '#1a1a2e', border: `2px solid ${color}60`, minHeight: '52px' }}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to bullet reveal
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
        <h2 className="text-base font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}>
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

// ─── Narration hook ───────────────────────────────────────────────────────────

// Voice priority list — higher index = lower priority
// Chrome on desktop: "Google UK English Female", "Google US English"
// macOS/iOS: "Samantha", "Daniel", "Karen", "Moira"
// Edge: "Microsoft Aria Online", "Microsoft Jenny Online"
const PREFERRED_VOICE_NAMES = [
  'Google UK English Female',
  'Microsoft Aria Online (Natural)',
  'Microsoft Jenny Online (Natural)',
  'Microsoft Sonia Online (Natural)',
  'Google US English',
  'Samantha',
  'Karen',
  'Daniel',
  'Moira',
  'Fiona',
];

function pickBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Try exact name match in priority order
  for (const name of PREFERRED_VOICE_NAMES) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }
  // Partial match: prefer "Natural" or "Online" voices
  const natural = voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online'))
  );
  if (natural) return natural;
  // Fallback: any English voice
  return voices.find(v => v.lang.startsWith('en-')) || voices.find(v => v.lang.startsWith('en')) || null;
}

// Add natural-sounding pauses by inserting commas/periods at sentence boundaries
function naturaliseText(text: string): string {
  return text
    // Ensure space after punctuation for cleaner pauses
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    // Replace em-dashes with comma pauses
    .replace(/—/g, ', ')
    // Replace colons with comma pauses
    .replace(/:/g, ',')
    // Remove parentheses but keep content
    .replace(/[()]/g, ', ');
}

function useNarration() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);

  // Load voices eagerly — browsers fire voiceschanged when async voices arrive
  useEffect(() => {
    if (!supported) return;
    const tryLoad = () => {
      const v = pickBestVoice();
      if (v) voiceRef.current = v;
    };
    tryLoad();
    window.speechSynthesis.addEventListener('voiceschanged', tryLoad);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', tryLoad);
  }, [supported]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!supported) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const processedText = naturaliseText(text);
    const voice = voiceRef.current ?? pickBestVoice();

    // Chrome bug: utterances > ~15s get silently cut off.
    // Fix: split into sentences and chain them sequentially.
    const sentences = processedText
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    if (sentences.length === 0) { onEnd?.(); return; }

    let cancelled = false;
    const speakNext = (index: number) => {
      if (cancelled || index >= sentences.length) {
        if (!cancelled) onEnd?.();
        return;
      }
      const u = new SpeechSynthesisUtterance(sentences[index]);
      u.rate = 0.88;
      u.pitch = 0.95;
      u.volume = 1.0;
      if (voice) u.voice = voice;
      u.onend = () => speakNext(index + 1);
      u.onerror = (e) => {
        // Ignore 'interrupted' errors (from cancel()) — they are expected
        if (e.error !== 'interrupted' && !cancelled) speakNext(index + 1);
      };
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    };

    // Store a cancel flag so stop() can interrupt the chain
    (utteranceRef as React.MutableRefObject<unknown>).current = { cancel: () => { cancelled = true; } };
    speakNext(0);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    // Cancel the sentence chain if active
    const ref = utteranceRef.current as { cancel?: () => void } | null;
    if (ref?.cancel) ref.cancel();
    window.speechSynthesis.cancel();
  }, [supported]);

  const pause = useCallback(() => {
    if (supported) window.speechSynthesis.pause();
  }, [supported]);

  const resume = useCallback(() => {
    if (supported) window.speechSynthesis.resume();
  }, [supported]);

  return { speak, stop, pause, resume, supported };
}

// ─── Main VideoGuide component ────────────────────────────────────────────────

interface VideoGuideProps {
  data: VideoGuideData;
}

export function VideoGuide({ data }: VideoGuideProps) {
  const { scenes, deckColor, deckBgColor, cardTitle } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const { speak, stop, pause, resume, supported } = useNarration();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const currentScene = scenes[currentIndex];
  const totalScenes = scenes.length;
  const progress = ((currentIndex + 1) / totalScenes) * 100;

  // Calculate scene duration from narration length (~140 words/min for speech)
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

  const handlePlay = () => {
    setHasStarted(true);
    setIsPlaying(true);
    playScene(currentIndex, isMuted);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    pause();
  };

  const handleResume = () => {
    setIsPlaying(true);
    playScene(currentIndex, isMuted);
  };

  const handleSkipForward = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    if (currentIndex < totalScenes - 1) {
      setCurrentIndex(i => i + 1);
      setSceneKey(k => k + 1);
      if (isPlaying) {
        setTimeout(() => playScene(currentIndex + 1, isMuted), 100);
      }
    }
  };

  const handleSkipBack = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSceneKey(k => k + 1);
      if (isPlaying) {
        setTimeout(() => playScene(currentIndex - 1, isMuted), 100);
      }
    }
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    setCurrentIndex(0);
    setSceneKey(k => k + 1);
    setIsPlaying(false);
    setHasStarted(false);
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      stop();
      setTimeout(() => playScene(currentIndex, newMuted), 100);
    }
  };

  const handleSceneClick = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    setCurrentIndex(index);
    setSceneKey(k => k + 1);
    setHasStarted(true);
    setIsPlaying(true);
    setTimeout(() => playScene(index, isMuted), 100);
  };

  useEffect(() => {
    return () => {
      stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Player */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${deckColor}30` }}>
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
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg mb-3"
                style={{ backgroundColor: deckColor }}
              >
                <Play size={24} fill="white" />
              </motion.button>
              <p className="text-sm font-semibold text-gray-700">Play Video Guide</p>
              <p className="text-xs text-gray-500 mt-1">{totalScenes} scenes · ~{Math.round(scenes.reduce((s, sc) => s + getSceneDuration(sc), 0) / 1000 / 60)} min</p>
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
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: deckBgColor }}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkipBack}
              disabled={currentIndex === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: deckColor + '15' }}
            >
              <SkipBack size={14} style={{ color: deckColor }} />
            </button>

            {isPlaying ? (
              <button
                onClick={handlePause}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: deckColor }}
              >
                <Pause size={16} fill="white" />
              </button>
            ) : (
              <button
                onClick={hasStarted ? handleResume : handlePlay}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: deckColor }}
              >
                <Play size={16} fill="white" />
              </button>
            )}

            <button
              onClick={handleSkipForward}
              disabled={currentIndex === totalScenes - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: deckColor + '15' }}
            >
              <SkipForward size={14} style={{ color: deckColor }} />
            </button>
          </div>

          <div className="text-xs font-medium text-gray-600 flex-1 text-center px-2 truncate">
            {currentScene.heading || cardTitle}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: deckColor + '15' }}
            >
              <RotateCcw size={13} style={{ color: deckColor }} />
            </button>
            {supported && (
              <button
                onClick={handleMuteToggle}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: deckColor + '15' }}
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
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-all"
            style={{
              backgroundColor: i === currentIndex ? deckColor : deckColor + '15',
              color: i === currentIndex ? 'white' : deckColor,
              border: `1.5px solid ${i === currentIndex ? deckColor : deckColor + '30'}`,
            }}
          >
            {i + 1}. {(scene.heading || scene.type).slice(0, 14)}
          </button>
        ))}
      </div>

      {/* Narration text */}
      <div className="rounded-xl p-3 text-xs text-gray-600 leading-relaxed" style={{ backgroundColor: deckColor + '08', border: `1px solid ${deckColor}20` }}>
        <span className="font-semibold text-gray-500 text-[10px] uppercase tracking-wide block mb-1">Narration</span>
        {currentScene.narration}
      </div>

      {!supported && (
        <p className="text-xs text-amber-600 text-center">Voice narration is not supported in this browser. Visual guide only.</p>
      )}
    </div>
  );
}
