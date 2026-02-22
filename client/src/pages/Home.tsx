// PMO Toolkit Navigator — Home Page
// Navigation hub: hero + quick stats + feature grid + daily challenge

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  LayoutGrid, Sparkles, Search, Bookmark, Route, Map,
  BookOpen, BookMarked, Compass, Zap, Flame, ArrowRight,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { CARDS, DECKS } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useJourney } from '@/contexts/JourneyContext';
import { JOURNEY_LESSONS } from '@/lib/journeyData';
import DailyChallenge from '@/components/DailyChallenge';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/wGRSygz6Vjmbiu3SMWngYA/sandbox/8jjxsB34pPKxphOQiFs3Lq-img-1_1771664268000_na1fn_aG9tZS1oZXJvLWlsbHVzdHJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd0dSU3lnejZWam1iaXUzU01XbmdZQS9zYW5kYm94LzhqanhzQjM0cFBLeHBoT1FpRnMzTHEtaW1nLTFfMTc3MTY2NDI2ODAwMF9uYTFmbl9hRzl0WlMxb1pYSnZMV2xzYkhWemRISmhkR2x2YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=S4o3nchQdvzrXjUzaEmILHtCFu3pQr8MJpBH6Vvsi3RozJHomZIlRLfeUaXF5eJgP~rOqh8WXVwSJysXS95gf7QCOlA4MTjVZoGtUUBSGKOCK68-X7QS6NNnpM0OMV1Ce3T6e-XJitV2r2ErD5-LvTGahuVXBqv9fy52lSsonVrGXHbs9zcV3M7ZrkaZy2ZVyoL1MNkLv4srxJia9Sdi2R0np11He-mXIiX4vBuQfFXTXVCyS717hslV5omlIwCxEm37whyzscAz9IHG29-6bviv8gQn09Is7qp5DxrCId89EM2kCQfoMp6CSsAHTddeIM3eHbREOv3gQRyEZs8OUA__';

// localStorage key for last-viewed card
const LAST_CARD_KEY = 'pmo_last_card';

// ─── Feature tiles ─────────────────────────────────────────────────────────────
const FEATURE_TILES = [
  { path: '/decks',        icon: LayoutGrid,  label: 'Card Decks',       sub: '8 decks · 166 cards',       color: '#0284C7', bg: '#EFF6FF', textColor: '#1E3A5F' },
  { path: '/journey',      icon: Map,         label: 'Learning Journey',  sub: '30-day guided path',         color: '#7C3AED', bg: '#F5F3FF', textColor: '#3B1A6B' },
  { path: '/roadmap',      icon: Route,       label: 'Roadmap',           sub: 'Structured learning paths',  color: '#059669', bg: '#ECFDF5', textColor: '#064E3B' },
  { path: '/ai-suggest',   icon: Sparkles,    label: 'AI Tool Finder',    sub: 'Get personalised picks',     color: '#D97706', bg: '#FFFBEB', textColor: '#78350F' },
  { path: '/glossary',     icon: BookMarked,  label: 'Glossary',          sub: '125 PM terms + quiz',        color: '#DB2777', bg: '#FDF2F8', textColor: '#831843' },
  { path: '/case-studies', icon: BookOpen,    label: 'Case Studies',      sub: 'Real-world examples',        color: '#0891B2', bg: '#ECFEFF', textColor: '#164E63' },
  { path: '/search',       icon: Search,      label: 'Search',            sub: 'Find any tool fast',         color: '#475569', bg: '#F8FAFC', textColor: '#1E293B' },
  { path: '/bookmarks',    icon: Bookmark,    label: 'Saved Cards',       sub: 'Your reading list',          color: '#E11D48', bg: '#FFF1F2', textColor: '#881337' },
  { path: '/decision',     icon: Compass,     label: 'Decision Helper',   sub: 'Find the right tool',        color: '#65A30D', bg: '#F7FEE7', textColor: '#365314' },
];

// ─── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label, color }: { icon: React.ElementType; value: string | number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: color + '18' }}>
      <Icon size={13} style={{ color }} />
      <span className="text-[11px] font-bold" style={{ color }}>{value}</span>
      <span className="text-[10px] text-stone-400 font-medium">{label}</span>
    </div>
  );
}

// ─── Feature tile — deck-card style with bounce shadow ─────────────────────────
function FeatureTile({ tile, index }: { tile: typeof FEATURE_TILES[0]; index: number }) {
  const [, navigate] = useLocation();
  const { icon: Icon, label, sub, color, bg, textColor, path } = tile;

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
        background: bg,
        boxShadow: `0 4px 16px ${color}28, 0 2px 6px rgba(0,0,0,0.06), 0 0 0 1px ${color}18`,
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Subtle card-stack shadow layers (like deck cards) */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        }}
      />

      {/* Icon circle */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative z-10"
        style={{ background: color + '22' }}
      >
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>

      {/* Text */}
      <div className="relative z-10">
        <p className="text-[12px] font-bold leading-tight" style={{ color: textColor, fontFamily: 'Sora, sans-serif' }}>
          {label}
        </p>
        <p className="text-[10px] leading-snug mt-0.5" style={{ color: textColor, opacity: 0.55 }}>
          {sub}
        </p>
      </div>

      {/* Bottom accent bar (like deck cards) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl"
        style={{ background: color, opacity: 0.6 }}
      />
    </motion.button>
  );
}

// ─── Continue card ─────────────────────────────────────────────────────────────
function ContinueCard() {
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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a5f 100%)',
          boxShadow: '0 4px 20px rgba(99,102,241,0.25), 0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
          }}
        />

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          {deck?.icon ?? '📋'}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono font-bold tracking-widest text-blue-300 uppercase mb-0.5">
            Continue where you left off
          </p>
          <p className="text-[13px] font-bold text-white leading-tight truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
            {card.title}
          </p>
          {deck && (
            <p className="text-[10px] text-blue-200 opacity-70 mt-0.5">{deck.title}</p>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight size={16} className="text-blue-300 shrink-0" />
      </motion.button>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { bookmarks } = useBookmarks();
  const { deckProgress } = useCardProgress();
  const { state: journeyState } = useJourney();

  // Parallax scroll state
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = document.querySelector('.app-shell') as HTMLElement | null;
    const el = container ?? window;
    const onScroll = () => {
      const y = container ? container.scrollTop : window.scrollY;
      setScrollY(y);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
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

  return (
    <div className="app-shell min-h-screen" style={{ background: 'transparent' }}>
      {/* ── Hero ── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ minHeight: '240px' }}
      >
        {/* Dark base layer */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0c2340 100%)' }}
        />

        {/* Background illustration — parallax, blue-purple tinted */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Soft radial glow behind illustration */}
          <div
            className="absolute"
            style={{
              right: '-5%',
              top: '50%',
              transform: `translateY(calc(-50% + ${parallaxOffset * 0.3}px))`,
              width: '72%',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.10) 50%, transparent 80%)',
            }}
          />

          {/* Illustration with parallax + blue-purple tint */}
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
              opacity: 0.52,
              // Invert white bg → dark, then tint blue-purple, add glow
              filter: 'invert(1) brightness(2.2) saturate(0.7) hue-rotate(200deg) drop-shadow(0 0 32px rgba(139,92,246,0.45))',
            }}
          />

          {/* Left-side gradient so text stays readable */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, #0f172a 28%, #0f172acc 50%, #0f172a44 72%, transparent 100%)',
            }}
          />
          {/* Bottom fade for smooth transition */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to bottom, transparent, #0f172a)' }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-5 pt-12 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-mono font-bold tracking-widest text-blue-300 uppercase mb-1.5">
              StratAlign
            </p>
            <h1
              className="text-[26px] font-extrabold text-white leading-tight mb-2"
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em' }}
            >
              Your PM Toolkit
            </h1>
            <p className="text-[13px] text-blue-100 leading-relaxed opacity-80 max-w-xs">
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
            <StatPill icon={LayoutGrid} value={totalDecks} label="decks" color="#60A5FA" />
            <StatPill icon={Zap} value={totalRead} label="read" color="#34D399" />
            <StatPill icon={Bookmark} value={bookmarks.length} label="saved" color="#F87171" />
            {currentDay > 0 && (
              <StatPill icon={Flame} value={`Day ${currentDay}/${totalDays}`} label="journey" color="#FBBF24" />
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Continue where you left off ── */}
      <ContinueCard />

      {/* ── Daily Challenge ── */}
      <div className="px-4 pt-4">
        <DailyChallenge />
      </div>

      {/* ── Feature grid ── */}
      <div className="px-4 pt-5 pb-28">
        <p
          className="text-[10px] font-extrabold tracking-widest uppercase mb-3"
          style={{ color: '#a8a29e', fontFamily: 'Inter, sans-serif' }}
        >
          Explore
        </p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURE_TILES.map((tile, i) => (
            <FeatureTile key={tile.path} tile={tile} index={i} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
