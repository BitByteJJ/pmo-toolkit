// AudioMode.tsx — StratAlign Theater
// Multi-host podcast UI supporting up to 5 characters.
// Characters are dynamically selected per episode based on topic complexity.

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
  Users,
} from 'lucide-react';
import { CARDS, DECKS } from '@/lib/pmoData';
import { useAudio, type SpeakerName, SPEAKER_COLORS, SPEAKER_ROLES, SPEAKER_EMOJI } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── FORMAT TIME ─────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

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
// Shows only the active cast for the current episode, with the speaking host animated.
function HostAvatars({
  activeSpeaker,
  cast,
}: {
  activeSpeaker: SpeakerName | null;
  cast: SpeakerName[];
}) {
  const { isDark } = useTheme();
  const displayCast = cast.length > 0 ? cast : (['Alex', 'Sam'] as SpeakerName[]);

  return (
    <div className="flex items-center justify-center gap-3 py-2 flex-wrap">
      {displayCast.map(name => {
        const color = SPEAKER_COLORS[name];
        const emoji = SPEAKER_EMOJI[name];
        const role = SPEAKER_ROLES[name];
        const isActive = activeSpeaker === name;
        return (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={isActive ? { scale: [1, 1.06, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
              transition={isActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${color}30, ${color}15)`
                  : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: isActive ? `2px solid ${color}60` : '2px solid transparent',
                boxShadow: isActive ? `0 0 18px ${color}30` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {emoji}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: color }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Mic2 size={7} className="text-white" />
                </motion.div>
              )}
            </motion.div>
            <div className="text-center">
              <div
                className="text-[10px] font-black"
                style={{
                  color: isActive ? color : 'var(--muted-foreground)',
                  fontFamily: 'Sora, sans-serif',
                  transition: 'color 0.3s',
                }}
              >
                {name}
              </div>
              <div className="text-[8px] text-muted-foreground opacity-70">{role.split(' ')[0]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── LIVE TRANSCRIPT LINE ─────────────────────────────────────────────────────
function LiveTranscript({ line, speaker }: { line: string; speaker: SpeakerName | null }) {
  const { isDark } = useTheme();
  if (!line || !speaker) return null;
  const color = SPEAKER_COLORS[speaker];
  const emoji = SPEAKER_EMOJI[speaker];
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
          background: isDark ? `${color}12` : `${color}08`,
          border: `1px solid ${color}25`,
        }}
      >
        <div className="flex items-start gap-2">
          <span className="text-base shrink-0 mt-0.5">{emoji}</span>
          <div>
            <span className="text-[10px] font-bold mr-1.5" style={{ color }}>
              {speaker}:
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
      a.download = `${currentTrack.title.replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '-').toLowerCase()}-strataling-theater.mp3`;
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

  const cast = currentTrack.cast ?? ['Alex', 'Sam'];
  const castLabel = cast.join(' · ');
  const progressBarColor = currentSpeaker ? SPEAKER_COLORS[currentSpeaker] : '#6366f1';

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
            <span className="opacity-70">StratAlign Theater</span>
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
          {isLoading ? '⏳ Generating…' : isPlaying ? '● LIVE' : '⏸ Paused'}
        </div>
      </div>

      {/* Cast badge */}
      {!isLoading && cast.length > 0 && (
        <div className="flex items-center gap-1.5">
          <Users size={10} className="text-muted-foreground opacity-60 shrink-0" />
          <span className="text-[9px] text-muted-foreground opacity-70">
            {cast.length === 2 ? 'Core duo' : cast.length === 3 ? '3-host panel' : cast.length === 4 ? '4-host roundtable' : 'Full cast'}:
          </span>
          <div className="flex gap-1 flex-wrap">
            {cast.map(name => (
              <span
                key={name}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: `${SPEAKER_COLORS[name]}20`,
                  color: SPEAKER_COLORS[name],
                  border: `1px solid ${SPEAKER_COLORS[name]}30`,
                }}
              >
                {SPEAKER_EMOJI[name]} {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Loading message */}
      {isLoading && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            The StratAlign Theater cast is preparing your episode…
          </p>
          <p className="text-[10px] text-muted-foreground opacity-60 mt-1">
            This takes about 20–40 seconds for a full episode
          </p>
        </div>
      )}

      {/* Host avatars — only shown when playing */}
      {!isLoading && (
        <HostAvatars activeSpeaker={currentSpeaker} cast={cast} />
      )}

      {/* Live transcript */}
      {!isLoading && currentLine && (
        <LiveTranscript line={currentLine} speaker={currentSpeaker} />
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
                background: progressBarColor,
                transition: 'width 0.25s linear, background 0.3s ease',
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

// ─── CAST BIOS ────────────────────────────────────────────────────────────────
const ALL_CAST: { name: SpeakerName; bio: string }[] = [
  {
    name: 'Alex',
    bio: 'Senior PMO Consultant with 15+ years in enterprise transformation. Loves real-world war stories and hard-won lessons from complex programmes.',
  },
  {
    name: 'Sam',
    bio: 'Agile Coach and people-first thinker. Great at asking the questions listeners are thinking, and champions simplicity over process bloat.',
  },
  {
    name: 'Jordan',
    bio: 'Strategy & Change Management Lead. Connects tools to organisational culture and asks "but why does this actually matter?" at every turn.',
  },
  {
    name: 'Maya',
    bio: 'Data & Analytics Specialist. Evidence-driven and metric-obsessed — challenges vague claims with "show me the data" and loves measurable outcomes.',
  },
  {
    name: 'Chris',
    bio: 'Startup Founder & Product Manager. Brings lean startup energy to enterprise tools — always asking what a small, fast-moving team can actually do.',
  },
];

// ─── LOCK SCREEN INFO ─────────────────────────────────────────────────────────
function LockScreenInfo() {
  const { isDark } = useTheme();
  return (
    <div className="space-y-4">
      {/* Cast bios */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Users size={15} className="text-indigo-400" />
          <h3 className="text-sm font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Meet the Cast
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          StratAlign Theater dynamically selects 2–5 hosts per episode based on the topic's complexity and strategic depth. Simple tools get the core duo; complex frameworks get the full roundtable.
        </p>
        <div className="space-y-2">
          {ALL_CAST.map(({ name, bio }) => {
            const color = SPEAKER_COLORS[name];
            const emoji = SPEAKER_EMOJI[name];
            const role = SPEAKER_ROLES[name];
            return (
              <div
                key={name}
                className="rounded-xl p-3 flex items-start gap-3"
                style={{
                  background: isDark ? `${color}10` : `${color}07`,
                  border: `1px solid ${color}20`,
                }}
              >
                <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold" style={{ color }}>{name}</span>
                    <span className="text-[9px] text-muted-foreground opacity-70">· {role}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{bio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lock screen controls */}
      <div
        className="rounded-2xl p-4 space-y-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <Smartphone size={15} className="text-indigo-400" />
          <h3 className="text-sm font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Lock Screen Controls
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Once an episode starts, lock your screen — playback continues and controls appear on your lock screen and notification tray. The episode title and active cast are shown as the media metadata.
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
            {(['🎙️', '💡', '🗺️'] as const).map((e, i) => (
              <span key={i} className="text-sm">{e}</span>
            ))}
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
          5 hosts
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
            { id: 'settings' as const, label: 'Cast & Controls', icon: Users },
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
