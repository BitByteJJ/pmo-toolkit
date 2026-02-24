// AudioMode — Full audio player page
// Build playlists, control playback speed/pitch, see lock-screen instructions

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Headphones,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Info,
  Layers,
  List,
  Shuffle,
} from 'lucide-react';
import { CARDS, DECKS, getDeckById } from '@/lib/pmoData';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── SPEED SELECTOR ───────────────────────────────────────────────────────────
const SPEEDS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

function SpeedSelector() {
  const { rate, setRate } = useAudio();
  return (
    <div className="flex gap-1.5 flex-wrap">
      {SPEEDS.map(s => (
        <button
          key={s}
          onClick={() => setRate(s)}
          className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
          style={{
            background: rate === s ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.08)',
            border: rate === s ? '1.5px solid rgba(99,102,241,0.5)' : '1px solid rgba(99,102,241,0.15)',
            color: rate === s ? '#818cf8' : 'var(--muted-foreground)',
          }}
        >
          {s}×
        </button>
      ))}
    </div>
  );
}

// ─── NOW PLAYING ─────────────────────────────────────────────────────────────
function NowPlaying() {
  const { isDark } = useTheme();
  const {
    isPlaying,
    isPaused,
    currentTrack,
    currentIndex,
    playlist,
    pause,
    resume,
    stop,
    next,
    prev,
  } = useAudio();

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${currentTrack.deckColor}18, rgba(10,22,40,0.95))`
          : `linear-gradient(135deg, ${currentTrack.deckColor}10, rgba(255,255,255,0.95))`,
        border: `1.5px solid ${currentTrack.deckColor}35`,
        boxShadow: `0 8px 32px ${currentTrack.deckColor}20`,
      }}
    >
      {/* Track info */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: currentTrack.deckColor + '25', border: `1px solid ${currentTrack.deckColor}35` }}
        >
          <Headphones size={22} style={{ color: currentTrack.deckColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-black text-foreground truncate"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {currentTrack.title}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {currentTrack.deckTitle}
            {playlist.length > 1 && (
              <span className="ml-1.5 opacity-60">
                {currentIndex + 1} / {playlist.length}
              </span>
            )}
          </div>
        </div>
        <div
          className="px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{
            background: isPlaying && !isPaused ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            color: isPlaying && !isPaused ? '#34d399' : '#fbbf24',
            border: isPlaying && !isPaused ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
          }}
        >
          {isPlaying && !isPaused ? '▶ Playing' : '⏸ Paused'}
        </div>
      </div>

      {/* Progress indicator */}
      {playlist.length > 1 && (
        <div
          className="h-1 rounded-full overflow-hidden mb-4"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / playlist.length) * 100}%`,
              background: currentTrack.deckColor,
            }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          disabled={currentIndex <= 0}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 active:scale-90"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <SkipBack size={18} className="text-foreground" />
        </button>

        <button
          onClick={isPaused ? resume : pause}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: currentTrack.deckColor,
            boxShadow: `0 4px 20px ${currentTrack.deckColor}50`,
          }}
        >
          {isPaused ? (
            <Play size={22} className="text-white ml-1" />
          ) : (
            <Pause size={22} className="text-white" />
          )}
        </button>

        <button
          onClick={next}
          disabled={currentIndex >= playlist.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 active:scale-90"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <SkipForward size={18} className="text-foreground" />
        </button>

        <button
          onClick={stop}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <Square size={16} className="text-foreground" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── DECK PLAYLIST BUILDER ────────────────────────────────────────────────────
function PlaylistBuilder() {
  const { isDark } = useTheme();
  const { playCard, playDeck, isPlaying, currentTrack } = useAudio();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {DECKS.map(deck => {
        const deckCards = CARDS.filter(c => c.deckId === deck.id);
        const isOpen = expanded === deck.id;

        return (
          <div key={deck.id} className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {/* Deck header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{ background: deck.color + '20' }}
              >
                {deck.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground">{deck.title}</div>
                <div className="text-[10px] text-muted-foreground">{deckCards.length} cards</div>
              </div>
              <button
                onClick={() => playDeck(deck.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
                style={{
                  background: deck.color + '18',
                  border: `1px solid ${deck.color}30`,
                  color: deck.color,
                }}
              >
                <Play size={10} />
                Play all
              </button>
              <button
                onClick={() => setExpanded(isOpen ? null : deck.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
              >
                {isOpen ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
              </button>
            </div>

            {/* Card list */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="border-t"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  >
                    {deckCards.map(card => {
                      const isCurrentlyPlaying = isPlaying && currentTrack?.cardId === card.id;
                      return (
                        <button
                          key={card.id}
                          onClick={() => playCard(card.id)}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors"
                          style={{
                            background: isCurrentlyPlaying
                              ? deck.color + '12'
                              : 'transparent',
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                            style={{ background: deck.color + '18' }}
                          >
                            {isCurrentlyPlaying ? (
                              <Volume2 size={10} style={{ color: deck.color }} />
                            ) : (
                              <Play size={9} style={{ color: deck.color }} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-[9px] font-mono font-bold"
                                style={{ color: deck.color }}
                              >
                                {card.code}
                              </span>
                              <span className="text-xs font-semibold text-foreground truncate">
                                {card.title}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── LOCK SCREEN INSTRUCTIONS ────────────────────────────────────────────────
function LockScreenInfo() {
  const { isDark } = useTheme();
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Smartphone size={15} className="text-indigo-400" />
        <h3 className="text-sm font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
          Lock Screen Controls
        </h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        Once audio starts, lock your screen — playback continues and controls appear on your lock screen and in the notification tray (Android) or Control Centre (iOS).
      </p>
      <div className="space-y-2">
        {[
          { icon: '▶', label: 'Play / Pause', desc: 'Toggle narration' },
          { icon: '⏭', label: 'Next card', desc: 'Skip to next card in playlist' },
          { icon: '⏮', label: 'Previous card', desc: 'Go back to previous card' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
              style={{ background: 'rgba(99,102,241,0.15)' }}
            >
              {item.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">{item.label}</div>
              <div className="text-[10px] text-muted-foreground">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="mt-3 p-2.5 rounded-xl flex items-start gap-2"
        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
      >
        <Info size={12} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-[10px] text-amber-300 leading-relaxed">
          On iOS, keep the browser tab open. The screen can lock but the tab must remain the active one when locking. On Android Chrome, audio continues in the background automatically.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AudioMode() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const { isPlaying, isPaused, isSupported, playAll } = useAudio();
  const [activeTab, setActiveTab] = useState<'playlist' | 'settings'>('playlist');

  const bg = isDark
    ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, #0a1628 60%)'
    : 'radial-gradient(ellipse at top, rgba(99,102,241,0.05) 0%, #f1f5f9 60%)';

  return (
    <div className="min-h-screen pb-36" style={{ background: bg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{
          background: isDark ? 'rgba(10,22,40,0.92)' : 'rgba(241,245,249,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <ArrowLeft size={16} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Headphones size={16} className="text-indigo-400" />
          <h1 className="text-base font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Audio Mode
          </h1>
        </div>
        {!isPlaying && !isPaused && (
          <button
            onClick={playAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8',
            }}
          >
            <Shuffle size={11} />
            Play 20
          </button>
        )}
      </div>

      {/* Not supported warning */}
      {!isSupported && (
        <div
          className="mx-4 mt-4 p-4 rounded-2xl"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}
        >
          <p className="text-sm font-bold text-red-400 mb-1">Browser not supported</p>
          <p className="text-xs text-muted-foreground">
            Your browser does not support the Web Speech API. Try Chrome, Edge, or Safari on a modern device.
          </p>
        </div>
      )}

      <div className="px-4 pt-4 space-y-4">
        {/* Now playing */}
        {(isPlaying || isPaused) && <NowPlaying />}

        {/* Speed control */}
        {(isPlaying || isPaused) && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Volume2 size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-foreground">Playback Speed</span>
            </div>
            <SpeedSelector />
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
        >
          {[
            { id: 'playlist' as const, label: 'Playlist', icon: List },
            { id: 'settings' as const, label: 'Lock Screen', icon: Smartphone },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all"
              style={{
                background: activeTab === tab.id
                  ? (isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)')
                  : 'transparent',
                color: activeTab === tab.id ? '#818cf8' : 'var(--muted-foreground)',
                borderRadius: '10px',
              }}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'playlist' ? (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <PlaylistBuilder />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <LockScreenInfo />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PageFooter />
    </div>
  );
}
