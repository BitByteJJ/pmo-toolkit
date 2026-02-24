// AudioMode — Two-host podcast player page
// Alex (male, Journey-D) and Sam (female, Journey-O) discuss each PMO card

import { useState, useCallback } from 'react';
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
  ChevronDown,
  ChevronUp,
  Smartphone,
  Info,
  List,
  Mic2,
  Loader2,
  Radio,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { CARDS, DECKS } from '@/lib/pmoData';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── FORMAT TIME ─────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── SPEAKER CONFIG ───────────────────────────────────────────────────────────
const SPEAKERS = {
  Alex: { color: '#6366f1', label: 'Alex', role: 'Senior PM', emoji: '👨‍💼' },
  Sam:  { color: '#ec4899', label: 'Sam',  role: 'PM Coach',  emoji: '👩‍💼' },
};

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

// ─── HOST AVATARS ─────────────────────────────────────────────────────────────
function HostAvatars({ activeSpeaker }: { activeSpeaker: 'Alex' | 'Sam' | null }) {
  const { isDark } = useTheme();
  return (
    <div className="flex items-center justify-center gap-6 py-2">
      {(['Alex', 'Sam'] as const).map(name => {
        const s = SPEAKERS[name];
        const isActive = activeSpeaker === name;
        return (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={isActive ? { scale: [1, 1.06, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
              transition={isActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${s.color}30, ${s.color}15)`
                  : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: isActive ? `2px solid ${s.color}60` : '2px solid transparent',
                boxShadow: isActive ? `0 0 20px ${s.color}30` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {s.emoji}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: s.color }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Mic2 size={8} className="text-white" />
                </motion.div>
              )}
            </motion.div>
            <div className="text-center">
              <div
                className="text-xs font-black"
                style={{
                  color: isActive ? s.color : 'var(--muted-foreground)',
                  fontFamily: 'Sora, sans-serif',
                  transition: 'color 0.3s',
                }}
              >
                {s.label}
              </div>
              <div className="text-[9px] text-muted-foreground">{s.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── LIVE TRANSCRIPT LINE ─────────────────────────────────────────────────────
function LiveTranscript({ line, speaker }: { line: string; speaker: 'Alex' | 'Sam' | null }) {
  const { isDark } = useTheme();
  if (!line || !speaker) return null;
  const s = SPEAKERS[speaker];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={line.slice(0, 30)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl p-3"
        style={{
          background: isDark ? `${s.color}12` : `${s.color}08`,
          border: `1px solid ${s.color}25`,
        }}
      >
        <div className="flex items-start gap-2">
          <span className="text-base shrink-0 mt-0.5">{s.emoji}</span>
          <div>
            <span className="text-[10px] font-bold mr-1.5" style={{ color: s.color }}>
              {s.label}:
            </span>
            <span className="text-xs text-foreground leading-relaxed">{line}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── NOW PLAYING ─────────────────────────────────────────────────────────────
function NowPlaying() {
  const { isDark } = useTheme();
  const {
    isPlaying,
    isPaused,
    isLoading,
    isBuffering,
    currentTrack,
    currentIndex,
    playlist,
    currentSpeaker,
    currentLine,
    segmentProgress,
    segmentElapsed,
    segmentDuration,
    episodeSegmentIndex,
    episodeTotalSegments,
    pause,
    resume,
    stop,
    next,
    prev,
  } = useAudio();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const downloadEpisode = useCallback(async () => {
    if (!currentTrack?.segments?.length) return;
    setIsDownloading(true);
    setDownloadDone(false);
    try {
      const res = await fetch('/api/podcast-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segments: currentTrack.segments,
          title: currentTrack.title,
        }),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTrack.title.replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '-').toLowerCase()}-pmo-podcast.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    } catch (err) {
      console.error('[Download]', err);
    } finally {
      setIsDownloading(false);
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 space-y-4"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(10,22,40,0.95))'
          : 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(255,255,255,0.95))',
        border: '1.5px solid rgba(99,102,241,0.25)',
        boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
      }}
    >
      {/* Episode header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
        >
          {isLoading ? (
            <Loader2 size={22} className="text-indigo-400 animate-spin" />
          ) : (
            <Radio size={22} className="text-indigo-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-black text-foreground truncate"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {currentTrack.title}
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
            <span>StratAlign Theater</span>
            {playlist.length > 1 && (
              <span className="opacity-50">· {currentIndex + 1}/{playlist.length}</span>
            )}
          </div>
        </div>
        <div
          className="px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{
            background: isLoading ? 'rgba(99,102,241,0.15)' : isPlaying ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            color: isLoading ? '#818cf8' : isPlaying ? '#34d399' : '#fbbf24',
            border: isLoading ? '1px solid rgba(99,102,241,0.3)' : isPlaying ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
          }}
        >
          {isLoading ? '⏳ Generating…' : isBuffering ? '⏳ Buffering…' : isPlaying ? '● LIVE' : '⏸ Paused'}
        </div>
      </div>

      {/* Loading / buffering message */}
      {(isLoading || isBuffering) && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            {isLoading ? 'Alex and Sam are preparing your episode…' : 'Loading next exchange…'}
          </p>
          {isLoading && (
            <p className="text-[10px] text-muted-foreground opacity-60 mt-1">
              Playback starts in a few seconds
            </p>
          )}
        </div>
      )}

      {/* Host avatars — only shown when playing */}
      {!isLoading && (
        <HostAvatars activeSpeaker={currentSpeaker ?? null} />
      )}

      {/* Live transcript */}
      {!isLoading && currentLine && (
        <LiveTranscript line={currentLine} speaker={currentSpeaker ?? null} />
      )}

      {/* Segment progress bar with time */}
      {!isLoading && segmentDuration > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {formatTime(segmentElapsed)}
            </span>
            <span className="text-[10px] text-muted-foreground opacity-60">
              {episodeSegmentIndex + 1} / {episodeTotalSegments} exchanges
            </span>
            <span className="text-[10px] text-muted-foreground">
              -{formatTime(segmentDuration - segmentElapsed)}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${segmentProgress * 100}%`,
                background: currentSpeaker === 'Alex' ? '#6366f1' : '#ec4899',
                transition: 'width 0.25s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* Playlist progress */}
      {playlist.length > 1 && (
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / playlist.length) * 100}%`,
              background: 'linear-gradient(90deg, #6366f1, #ec4899)',
            }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          disabled={currentIndex <= 0 || isLoading}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 active:scale-90"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <SkipBack size={18} className="text-foreground" />
        </button>

        <button
          onClick={isPaused ? resume : pause}
          disabled={isLoading}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          }}
        >
          {isLoading ? (
            <Loader2 size={22} className="text-white animate-spin" />
          ) : isPaused ? (
            <Play size={22} className="text-white ml-1" />
          ) : (
            <Pause size={22} className="text-white" />
          )}
        </button>

        <button
          onClick={next}
          disabled={currentIndex >= playlist.length - 1 || isLoading}
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

      {/* Download episode button */}
      {!isLoading && currentTrack?.segments?.length > 0 && (
        <button
          onClick={downloadEpisode}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-98 disabled:opacity-60"
          style={{
            background: downloadDone
              ? 'rgba(16,185,129,0.15)'
              : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            border: downloadDone
              ? '1px solid rgba(16,185,129,0.3)'
              : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            color: downloadDone ? '#34d399' : 'var(--muted-foreground)',
          }}
        >
          {isDownloading ? (
            <><Loader2 size={13} className="animate-spin" /> Preparing MP3…</>
          ) : downloadDone ? (
            <><CheckCircle2 size={13} /> Downloaded!</>
          ) : (
            <><Download size={13} /> Download Episode MP3</>
          )}
        </button>
      )}
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
          <div
            key={deck.id}
            className="rounded-2xl overflow-hidden"
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
                <div className="text-[10px] text-muted-foreground">{deckCards.length} episodes</div>
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
                Play deck
              </button>
              <button
                onClick={() => setExpanded(isOpen ? null : deck.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
              >
                {isOpen
                  ? <ChevronUp size={13} className="text-muted-foreground" />
                  : <ChevronDown size={13} className="text-muted-foreground" />}
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
                            background: isCurrentlyPlaying ? deck.color + '12' : 'transparent',
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                            style={{ background: deck.color + '18' }}
                          >
                            {isCurrentlyPlaying ? (
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              >
                                <Radio size={10} style={{ color: deck.color }} />
                              </motion.div>
                            ) : (
                              <Play size={9} style={{ color: deck.color }} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate block">
                              {card.title}
                            </span>
                            <span className="text-[9px] text-muted-foreground">{card.tagline}</span>
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

// ─── LOCK SCREEN INFO ─────────────────────────────────────────────────────────
function LockScreenInfo() {
  const { isDark } = useTheme();
  return (
    <div
      className="rounded-2xl p-4 space-y-4"
      style={{
        background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      <div className="flex items-center gap-2">
        <Smartphone size={15} className="text-indigo-400" />
        <h3 className="text-sm font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
          Lock Screen Controls
        </h3>
      </div>

      {/* Host intro */}
      <div
        className="rounded-xl p-3 flex items-start gap-3"
        style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
      >
        <div className="flex gap-1.5 shrink-0 mt-0.5">
          <span className="text-lg">👨‍💼</span>
          <span className="text-lg">👩‍💼</span>
        </div>
        <div>
          <p className="text-xs font-bold text-foreground mb-0.5">Meet your hosts</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-semibold" style={{ color: '#6366f1' }}>Alex</span> is a seasoned PM who loves frameworks and real-world examples.{' '}
            <span className="font-semibold" style={{ color: '#ec4899' }}>Sam</span> is a PM coach who asks the questions you're thinking.
            Together they turn each card into a 4–6 minute deep-dive conversation.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Once an episode starts, lock your screen — playback continues and controls appear on your lock screen and notification tray. The episode title and current host are shown as the media metadata.
      </p>

      <div className="space-y-2">
        {[
          { icon: '▶', label: 'Play / Pause', desc: 'Toggle the episode' },
          { icon: '⏭', label: 'Next card', desc: 'Skip to the next episode in your playlist' },
          { icon: '⏮', label: 'Previous card', desc: 'Go back to the previous episode' },
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
        className="p-2.5 rounded-xl flex items-start gap-2"
        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
      >
        <Info size={12} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-[10px] text-amber-300 leading-relaxed">
          On iOS, keep the browser tab open when locking — the tab must be active. On Android Chrome, audio continues in the background automatically.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AudioMode() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const { isPlaying, isPaused, isLoading, isSupported } = useAudio();
  const [activeTab, setActiveTab] = useState<'playlist' | 'settings'>('playlist');

  const bg = isDark
    ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.04) 50%, #0a1628 70%)'
    : 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, rgba(236,72,153,0.02) 50%, #f1f5f9 70%)';

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
          <div className="flex gap-0.5">
            <span className="text-base">👨‍💼</span>
            <span className="text-base">👩‍💼</span>
          </div>
          <h1 className="text-base font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            StratAlign Theater
          </h1>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.15))',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#818cf8',
          }}
        >
          <Headphones size={9} />
          Alex &amp; Sam
        </div>
      </div>

      {/* Not supported warning */}
      {!isSupported && (
        <div
          className="mx-4 mt-4 p-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <p className="text-sm font-bold text-red-400 mb-1">Browser not supported</p>
          <p className="text-xs text-muted-foreground">
            Your browser does not support audio playback. Try Chrome, Edge, or Safari on a modern device.
          </p>
        </div>
      )}

      <div className="px-4 pt-4 space-y-4">
        {/* Now playing */}
        {(isPlaying || isPaused || isLoading) && <NowPlaying />}

        {/* Speed control — only when playing */}
        {(isPlaying || isPaused) && !isLoading && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Headphones size={14} className="text-indigo-400" />
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
            { id: 'playlist' as const, label: 'Episodes', icon: List },
            { id: 'settings' as const, label: 'Hosts & Lock Screen', icon: Smartphone },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all"
              style={{
                background: activeTab === tab.id
                  ? isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)'
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
