// AudioPlayerBar — Persistent mini-player bar shown above BottomNav when audio is active
// Shows loading spinner while Google TTS audio is being generated

import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Loader2,
  Headphones,
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AudioPlayerBar() {
  const { isDark } = useTheme();
  const {
    isPlaying,
    isPaused,
    isLoading,
    currentTrack,
    currentIndex,
    playlist,
    pause,
    resume,
    stop,
    next,
    prev,
  } = useAudio();

  const isActive = isPlaying || isPaused || isLoading;

  return (
    <AnimatePresence>
      {isActive && currentTrack && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-1"
          style={{ maxWidth: '480px', margin: '0 auto' }}
        >
          <div
            className="rounded-2xl px-3 py-2.5 flex items-center gap-3"
            style={{
              background: isDark
                ? 'rgba(10,22,40,0.97)'
                : 'rgba(255,255,255,0.97)',
              border: isDark
                ? `1.5px solid ${currentTrack.deckColor}40`
                : `1.5px solid ${currentTrack.deckColor}30`,
              boxShadow: `0 -4px 24px ${currentTrack.deckColor}20, 0 4px 16px rgba(0,0,0,0.2)`,
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Icon + track info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative"
                style={{ background: currentTrack.deckColor + '22' }}
              >
                {isLoading ? (
                  <Loader2
                    size={13}
                    className="animate-spin"
                    style={{ color: currentTrack.deckColor }}
                  />
                ) : (
                  <Headphones size={13} style={{ color: currentTrack.deckColor }} />
                )}
              </div>
              <div className="min-w-0">
                <div
                  className="text-xs font-black text-foreground truncate leading-tight"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {currentTrack.title}
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {isLoading ? (
                    <span style={{ color: currentTrack.deckColor }}>Generating audio…</span>
                  ) : (
                    <>
                      {currentTrack.deckTitle}
                      {playlist.length > 1 && (
                        <span className="ml-1 opacity-60">
                          · {currentIndex + 1}/{playlist.length}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {playlist.length > 1 && (
                <button
                  onClick={prev}
                  disabled={currentIndex <= 0 || isLoading}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                >
                  <SkipBack size={13} className="text-foreground" />
                </button>
              )}

              <button
                onClick={isPaused ? resume : pause}
                disabled={isLoading}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
                style={{
                  background: currentTrack.deckColor,
                  boxShadow: `0 2px 8px ${currentTrack.deckColor}50`,
                }}
              >
                {isLoading ? (
                  <Loader2 size={14} className="text-white animate-spin" />
                ) : isPaused ? (
                  <Play size={14} className="text-white ml-0.5" />
                ) : (
                  <Pause size={14} className="text-white" />
                )}
              </button>

              {playlist.length > 1 && (
                <button
                  onClick={next}
                  disabled={currentIndex >= playlist.length - 1 || isLoading}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                >
                  <SkipForward size={13} className="text-foreground" />
                </button>
              )}

              <button
                onClick={stop}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
              >
                <X size={13} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
