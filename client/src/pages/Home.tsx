// PMO Toolkit Navigator — Home Page
// Navigation hub: hero + quick stats + feature grid + daily challenge

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  LayoutGrid, Sparkles, Search, Bookmark, Route, Map,
  BookOpen, BookMarked, Compass, Zap, Flame, ArrowRight, FileText, Code2,
} from 'lucide-react';
import { useOnboardingTour } from '@/components/OnboardingTour';
import OnboardingTour from '@/components/OnboardingTour';
import { CARDS, DECKS } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useJourney } from '@/contexts/JourneyContext';
import { JOURNEY_LESSONS } from '@/lib/journeyData';
import DailyChallenge from '@/components/DailyChallenge';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/wGRSygz6Vjmbiu3SMWngYA/sandbox/8jjxsB34pPKxphOQiFs3Lq-img-1_1771664268000_na1fn_aG9tZS1oZXJvLWlsbHVzdHJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd0dSU3lnejZWam1iaXUzU01XbmdZQS9zYW5kYm94LzhqanhzQjM0cFBLeHBoT1FpRnMzTHEtaW1nLTFfMTc3MTY2NDI2ODAwMF9uYTFmbl9hRzl0WlMxb1pYSnZMV2xzYkhWemRISmhkR2x2YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=S4o3nchQdvzrXjUzaEmILHtCFu3pQr8MJpBH6Vvsi3RozJHomZIlRLfeUaXF5eJgP~rOqh8WXVwSJysXS95gf7QCOlA4MTjVZoGtUUBSGKOCK68-X7QS6NNnpM0OMV1Ce3T6e-XJitV2r2ErD5-LvTGahuVXBqv9fy52lSsonVrGXHbs9zcV3M7ZrkaZy2ZVyoL1MNkLv4srxJia9Sdi2R0np11He-mXIiX4vBuQfFXTXVCyS717hslV5omlIwCxEm37whyzscAz9IHG29-6bviv8gQn09Is7qp5DxrCId89EM2kCQfoMp6CSsAHTddeIM3eHbREOv3gQRyEZs8OUA__';

// localStorage key for last-viewed card
const LAST_CARD_KEY = 'pmo_last_card';

// ─── Feature tiles ────────────────────────────────────────────────────────────
const FEATURE_TILES = [
  { path: '/decks',        icon: LayoutGrid,  label: 'Card Decks',       sub: '8 decks · 198 cards',       color: '#60A5FA', bg: 'rgba(96,165,250,0.10)',  textColor: '#BAE6FD' },
  { path: '/journey',      icon: Map,         label: 'Learning Journey',  sub: '35-day guided path',         color: '#A78BFA', bg: 'rgba(167,139,250,0.10)', textColor: '#DDD6FE' },
  { path: '/roadmap',      icon: Route,       label: 'Roadmap',           sub: 'Structured learning paths',  color: '#34D399', bg: 'rgba(52,211,153,0.10)',  textColor: '#A7F3D0' },
  { path: '/ai-suggest',   icon: Sparkles,    label: 'AI Tool Finder',    sub: 'Get personalised picks',     color: '#FBBF24', bg: 'rgba(251,191,36,0.10)',  textColor: '#FDE68A' },
  { path: '/glossary',     icon: BookMarked,  label: 'Glossary',          sub: '158 PM terms + quiz',        color: '#F472B6', bg: 'rgba(244,114,182,0.10)', textColor: '#FBCFE8' },
  { path: '/case-studies', icon: BookOpen,    label: 'Case Studies',      sub: 'Real-world examples',        color: '#22D3EE', bg: 'rgba(34,211,238,0.10)',  textColor: '#A5F3FC' },
  { path: '/search',       icon: Search,      label: 'Search',            sub: 'Find any tool fast',         color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', textColor: '#CBD5E1' },
  { path: '/bookmarks',    icon: Bookmark,    label: 'Saved Cards',       sub: 'Your reading list',          color: '#F87171', bg: 'rgba(248,113,113,0.10)', textColor: '#FECACA' },
  { path: '/decision',     icon: Compass,     label: 'Decision Helper',   sub: 'Find the right tool',        color: '#86EFAC', bg: 'rgba(134,239,172,0.10)', textColor: '#BBF7D0' },
  { path: '/templates',    icon: FileText,    label: 'Template Library',  sub: '198 fillable templates',     color: '#FB923C', bg: 'rgba(251,146,60,0.10)',  textColor: '#FED7AA' },
  { path: '/how-it-was-built', icon: Code2,  label: 'How It Was Built',  sub: 'Prompts, tools & process',   color: '#A78BFA', bg: 'rgba(167,139,250,0.10)', textColor: '#DDD6FE' },
];

// ─── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label, color, isDark }: { icon: React.ElementType; value: string | number; label: string; color: string; isDark: boolean }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: color + '18' }}>
      <Icon size={13} style={{ color }} />
      <span className="text-[11px] font-bold" style={{ color }}>{value}</span>
      <span className="text-[10px] font-medium" style={{ color: isDark ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.7)' }}>{label}</span>
    </div>
  );
}

// ─── Feature tile ─────────────────────────────────────────────────────────────
function FeatureTile({ tile, index, isDark }: { tile: typeof FEATURE_TILES[0]; index: number; isDark: boolean }) {
  const [, navigate] = useLocation();
  const { icon: Icon, label, sub, color, bg, textColor, path } = tile;

  // In light mode, use a slightly more opaque bg and darker text
  const tileBg = isDark ? bg : bg.replace('0.10', '0.12');
  const tileTextColor = isDark ? textColor : color; // use the accent colour directly in light mode for legibility

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, rotate: (index % 2 === 0 ? 1.2 : -1.2) }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.45, delay: 0.05 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, y: -3, rotate: (index % 2 === 0 ? 0.5 : -0.5) }}
      whileTap={{ scale: 0.96, rotate: 0 }}
      onClick={() => navigate(path)}
      className="relative flex flex-col items-start gap-2 p-3.5 rounded-2xl text-left w-full overflow-hidden"
      style={{
        background: tileBg,
        boxShadow: isDark
          ? `0 4px 20px ${color}30, 0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px ${color}25`
          : `0 4px 20px ${color}20, 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px ${color}20`,
        backdropFilter: 'blur(20px) saturate(1.5)',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}
      />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative z-10"
        style={{ background: color + '22' }}
      >
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>
      <div className="relative z-10">
        <p className="text-[12px] font-bold leading-tight" style={{ color: tileTextColor, fontFamily: 'Sora, sans-serif' }}>
          {label}
        </p>
        <p className="text-[10px] leading-snug mt-0.5" style={{ color: tileTextColor, opacity: isDark ? 0.8 : 0.75 }}>
          {sub}
        </p>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl"
        style={{ background: color, opacity: 0.6 }}
      />
    </motion.button>
  );
}

// ─── Continue card ─────────────────────────────────────────────────────────────
function ContinueCard({ isDark }: { isDark: boolean }) {
  const [, navigate] = useLocation();
  const [lastCardId, setLastCardId] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLastCardId(localStorage.getItem(LAST_CARD_KEY));
    } catch { /* ignore */ }
  }, []);

  if (!lastCardId) return null;
  const card = CARDS.find(c => c.id === lastCardId);
  if (!card) return null;
  const deck = DECKS.find(d => d.id === card.deckId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mx-4 mt-4"
    >
      <motion.button
        whileHover={{ scale: 1.015, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(`/card/${card.id}`)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left relative overflow-hidden"
        style={{
          background: isDark ? 'rgba(15,32,64,0.75)' : 'rgba(239,246,255,0.9)',
          boxShadow: isDark
            ? '0 4px 20px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,102,241,0.25)'
            : '0 4px 20px rgba(99,102,241,0.10), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(99,102,241,0.20)',
          backdropFilter: 'blur(20px) saturate(1.5)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)' }}
        />
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
          style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)' }}
        >
          {deck?.icon ?? '📋'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5" style={{ color: '#6366f1' }}>
            Continue where you left off
          </p>
          <p
            className="text-[13px] font-bold leading-tight truncate"
            style={{ fontFamily: 'Sora, sans-serif', color: isDark ? '#ffffff' : '#1e293b' }}
          >
            {card.title}
          </p>
          {deck && (
            <p className="text-[10px] mt-0.5" style={{ color: isDark ? 'rgba(147,197,253,0.7)' : '#6366f1', opacity: 0.8 }}>
              {deck.title}
            </p>
          )}
        </div>
        <ArrowRight size={16} style={{ color: '#6366f1' }} className="shrink-0" />
      </motion.button>
    </motion.div>
  );
}

// ─── Tour button ─────────────────────────────────────────────────────────────
function TourButton() {
  const [localShow, setLocalShow] = useState(false);
  const { resetTour } = useOnboardingTour();

  const handleClick = () => {
    resetTour();
    setLocalShow(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80 active:scale-95"
        style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA' }}
      >
        <Sparkles size={10} strokeWidth={2.5} />
        Take the tour
      </button>
      {localShow && <OnboardingTour onDismiss={() => setLocalShow(false)} />}
    </>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { bookmarks } = useBookmarks();
  const { deckProgress } = useCardProgress();
  const { state: journeyState } = useJourney();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Parallax scroll state
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Quick stats
  const totalCards = CARDS.length;
  const totalDecks = DECKS.length;
  const totalRead = DECKS.reduce((sum, d) => {
    const ids = d.id ? CARDS.filter(c => c.deckId === d.id).map(c => c.id) : [];
    return sum + Math.round(deckProgress(ids) * ids.length);
  }, 0);
  const currentDay = journeyState.highestDayUnlocked ?? 0;
  const totalDays = JOURNEY_LESSONS.length;

  // Parallax offset: illustration moves at 40% of scroll speed
  const parallaxOffset = scrollY * 0.4;

  // Theme-aware hero colours
  const heroBg = isDark ? '#0a1628' : '#f0f4f8';
  const heroGradientLeft = isDark
    ? 'linear-gradient(to right, #0a1628 32%, rgba(10,22,40,0.85) 55%, rgba(10,22,40,0.30) 75%, transparent 100%)'
    : 'linear-gradient(to right, #f0f4f8 32%, rgba(240,244,248,0.85) 55%, rgba(240,244,248,0.30) 75%, transparent 100%)';
  const heroBottomFade = isDark
    ? 'linear-gradient(to bottom, transparent, #0a1628)'
    : 'linear-gradient(to bottom, transparent, #f0f4f8)';
  const heroTaglineColor = isDark ? '#93c5fd' : '#6366f1';
  const heroTitleColor = isDark ? '#ffffff' : '#0f172a';
  const heroSubColor = isDark ? 'rgba(191,219,254,0.8)' : 'rgba(71,85,105,0.85)';

  return (
    <div className="min-h-screen" style={{ background: heroBg }}>

      {/* ── Hero ── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden lg:max-w-none"
        style={{ minHeight: '240px' }}
      >
        {/* Base layer */}
        <div className="absolute inset-0" style={{ background: heroBg }} />

        {/* Background illustration */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Soft radial glow */}
          <div
            className="absolute"
            style={{
              right: '-5%',
              top: '50%',
              transform: `translateY(calc(-50% + ${parallaxOffset * 0.3}px))`,
              width: '72%',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.10) 50%, transparent 80%)'
                : 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, rgba(99,102,241,0.06) 50%, transparent 80%)',
            }}
          />

          {/* Illustration with parallax */}
          <img
            src={HERO_IMG}
            alt=""
            aria-hidden="true"
            className="absolute"
            style={{
              right: '-5%',
              top: '50%',
              transform: `translateY(calc(-50% + ${parallaxOffset}px))`,
              height: '155%',
              width: 'auto',
              maxWidth: '72%',
              objectFit: 'contain',
              opacity: isDark ? 0.52 : 0.35,
              filter: isDark
                ? 'invert(1) brightness(2.2) saturate(0.7) hue-rotate(200deg) drop-shadow(0 0 32px rgba(139,92,246,0.45))'
                : 'invert(1) brightness(0) saturate(0) hue-rotate(200deg) drop-shadow(0 0 20px rgba(99,102,241,0.20))',
            }}
          />

          {/* Left-side gradient */}
          <div className="absolute inset-0" style={{ background: heroGradientLeft }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: heroBottomFade }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-5 pt-12 pb-6" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1.5"
              style={{ color: heroTaglineColor }}
            >
              StratAlign
            </p>
            <h1
              className="text-[26px] font-extrabold leading-tight mb-2"
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em', color: heroTitleColor }}
            >
              Your PM Toolkit
            </h1>
            <p className="text-[13px] leading-relaxed opacity-80 max-w-xs" style={{ color: heroSubColor }}>
              {totalCards} tools, techniques &amp; frameworks — all in one place.
            </p>
          </motion.div>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            <StatPill icon={LayoutGrid} value={totalDecks} label="decks" color="#60A5FA" isDark={isDark} />
            <StatPill icon={Zap} value={totalRead} label="read" color="#34D399" isDark={isDark} />
            <StatPill icon={Bookmark} value={bookmarks.length} label="saved" color="#F87171" isDark={isDark} />
            {currentDay > 0 && (
              <StatPill icon={Flame} value={`Day ${currentDay}/${totalDays}`} label="journey" color="#FBBF24" isDark={isDark} />
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Continue where you left off ── */}
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <ContinueCard isDark={isDark} />
      </div>

      {/* ── Daily Challenge ── */}
      <div className="px-4 pt-4" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <DailyChallenge darkMode={isDark} />
      </div>

      {/* ── Feature grid ── */}
      <div className="px-4 pt-5 pb-28" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-[10px] font-extrabold tracking-widest uppercase"
            style={{ color: isDark ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.6)', fontFamily: 'Inter, sans-serif' }}
          >
            Explore
          </p>
          <TourButton />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEATURE_TILES.map((tile, i) => (
            <FeatureTile key={tile.path} tile={tile} index={i} isDark={isDark} />
          ))}
        </div>
      </div>
      <PageFooter />
    </div>
  );
}
