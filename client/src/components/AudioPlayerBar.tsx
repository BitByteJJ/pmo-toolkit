// AudioPlayerBar — Persistent mini-player shown above BottomNav during podcast playback
// Shows which host is currently speaking with an animated indicator

import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Loader2,
  Mic2,
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';

// Speaker avatar colours
const SPEAKER_COLORS: Record<string, string> = {
  Alex: '#6366f1', // indigo — male host
  Sam:  '#ec4899', // pink — female host
};

export default function AudioPlayerBar() {
  const { isDark } = useTheme();
  const {
    isPlaying,
    isPaused,
    isLoading,
    currentTrack,
    currentIndex,
    playlist,
    currentSpeaker,
    pause,
    resume,
    stop,
    next,
    prev,
  } = useAudio();

  const isActive = isPlaying || isPaused || isLoading;
  const speakerColor = currentSpeaker ? SPEAKER_COLORS[currentSpeaker] ?? currentTrack?.deckColor : currentTrack?.deckColor;

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
              background: isDark ? 'rgba(10,22,40,0.97)' : 'rgba(255,255,255,0.97)',
              border: `1.5px solid ${speakerColor}40`,
              boxShadow: `0 -4px 24px ${speakerColor}20, 0 4px 16px rgba(0,0,0,0.2)`,
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Speaker avatar + track info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Animated speaker avatar */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative"
                style={{ background: (speakerColor ?? '#6366f1') + '22' }}
              >
                {isLoading ? (
                  <Loader2 size={13} className="animate-spin" style={{ color: speakerColor }} />
                ) : (
                  <>
                    <Mic2 size={13} style={{ color: speakerColor }} />
                    {isPlaying && (
                      <motion.div
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                        style={{ background: speakerColor }}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}
                  </>
                )}
              </div>

              <div className="min-w-0">
                <div
                  className="text-xs font-black text-foreground truncate leading-tight"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {currentTrack.title}
                </div>
                <div className="text-[9px] text-muted-foreground flex items-center gap-1">
                  {isLoading ? (
                    <span style={{ color: speakerColor }}>Generating episode…</span>
                  ) : currentSpeaker ? (
                    <span style={{ color: speakerColor }} className="font-semibold">
                      {currentSpeaker} speaking
                    </span>
                  ) : (
                    currentTrack.deckTitle
                  )}
                  {playlist.length > 1 && !isLoading && (
                    <span className="opacity-50">· {currentIndex + 1}/{playlist.length}</span>
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
                  background: speakerColor,
                  boxShadow: `0 2px 8px ${speakerColor}50`,
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
