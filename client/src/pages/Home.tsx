// PMO Toolkit Navigator — Home Page
// Navigation hub: hero + quick stats + feature grid + daily challenge

import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  LayoutGrid, Sparkles, Search, Bookmark, Route, Map,
  BookOpen, BookMarked, Brain, Compass, Zap, Flame,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { CARDS, DECKS } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useJourney } from '@/contexts/JourneyContext';
import { JOURNEY_LESSONS } from '@/lib/journeyData';
import DailyChallenge from '@/components/DailyChallenge';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/wGRSygz6Vjmbiu3SMWngYA/sandbox/8jjxsB34pPKxphOQiFs3Lq-img-1_1771664268000_na1fn_aG9tZS1oZXJvLWlsbHVzdHJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd0dSU3lnejZWam1iaXUzU01XbmdZQS9zYW5kYm94LzhqanhzQjM0cFBLeHBoT1FpRnMzTHEtaW1nLTFfMTc3MTY2NDI2ODAwMF9uYTFmbl9hRzl0WlMxb1pYSnZMV2xzYkhWemRISmhkR2x2YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=S4o3nchQdvzrXjUzaEmILHtCFu3pQr8MJpBH6Vvsi3RozJHomZIlRLfeUaXF5eJgP~rOqh8WXVwSJysXS95gf7QCOlA4MTjVZoGtUUBSGKOCK68-X7QS6NNnpM0OMV1Ce3T6e-XJitV2r2ErD5-LvTGahuVXBqv9fy52lSsonVrGXHbs9zcV3M7ZrkaZy2ZVyoL1MNkLv4srxJia9Sdi2R0np11He-mXIiX4vBuQfFXTXVCyS717hslV5omlIwCxEm37whyzscAz9IHG29-6bviv8gQn09Is7qp5DxrCId89EM2kCQfoMp6CSsAHTddeIM3eHbREOv3gQRyEZs8OUA__';

// ─── Feature tiles ─────────────────────────────────────────────────────────────
// Each tile navigates to a feature. Color/icon/label chosen for clarity.
const FEATURE_TILES = [
  {
    path: '/decks',
    icon: LayoutGrid,
    label: 'Card Decks',
    sub: '8 decks · 166 cards',
    color: '#0284C7',
    bg: '#EFF6FF',
    textColor: '#1E3A5F',
  },
  {
    path: '/journey',
    icon: Map,
    label: 'Learning Journey',
    sub: '30-day guided path',
    color: '#7C3AED',
    bg: '#F5F3FF',
    textColor: '#3B1A6B',
  },
  {
    path: '/roadmap',
    icon: Route,
    label: 'Roadmap',
    sub: 'Structured learning paths',
    color: '#059669',
    bg: '#ECFDF5',
    textColor: '#064E3B',
  },
  {
    path: '/ai-suggest',
    icon: Sparkles,
    label: 'AI Tool Finder',
    sub: 'Get personalised picks',
    color: '#D97706',
    bg: '#FFFBEB',
    textColor: '#78350F',
  },
  {
    path: '/glossary',
    icon: BookMarked,
    label: 'Glossary',
    sub: '125 PM terms + quiz',
    color: '#DB2777',
    bg: '#FDF2F8',
    textColor: '#831843',
  },
  {
    path: '/case-studies',
    icon: BookOpen,
    label: 'Case Studies',
    sub: 'Real-world examples',
    color: '#0891B2',
    bg: '#ECFEFF',
    textColor: '#164E63',
  },
  {
    path: '/search',
    icon: Search,
    label: 'Search',
    sub: 'Find any tool fast',
    color: '#475569',
    bg: '#F8FAFC',
    textColor: '#1E293B',
  },
  {
    path: '/bookmarks',
    icon: Bookmark,
    label: 'Saved Cards',
    sub: 'Your reading list',
    color: '#E11D48',
    bg: '#FFF1F2',
    textColor: '#881337',
  },
  {
    path: '/decision',
    icon: Compass,
    label: 'Decision Helper',
    sub: 'Find the right tool',
    color: '#65A30D',
    bg: '#F7FEE7',
    textColor: '#365314',
  },
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

// ─── Feature tile ──────────────────────────────────────────────────────────────
function FeatureTile({ tile, index }: { tile: typeof FEATURE_TILES[0]; index: number }) {
  const [, navigate] = useLocation();
  const { icon: Icon, label, sub, color, bg, textColor, path } = tile;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(path)}
      className="relative flex flex-col items-start gap-2 p-3.5 rounded-2xl text-left w-full"
      style={{
        background: bg,
        boxShadow: `0 2px 8px ${color}18, 0 0 0 1px ${color}14`,
      }}
    >
      {/* Icon circle */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + '22' }}
      >
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>

      {/* Text */}
      <div>
        <p className="text-[12px] font-bold leading-tight" style={{ color: textColor, fontFamily: 'Sora, sans-serif' }}>
          {label}
        </p>
        <p className="text-[10px] leading-snug mt-0.5" style={{ color: textColor, opacity: 0.55 }}>
          {sub}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { bookmarks } = useBookmarks();
  const { deckProgress } = useCardProgress();
  const { state: journeyState } = useJourney();

  // Quick stats
  const totalCards = CARDS.length;
  const totalDecks = DECKS.length;
  const totalRead = DECKS.reduce((sum, d) => {
    const ids = d.id ? CARDS.filter(c => c.deckId === d.id).map(c => c.id) : [];
    return sum + Math.round(deckProgress(ids) * ids.length);
  }, 0);
  const currentDay = journeyState.highestDayUnlocked ?? 0;
  const totalDays = JOURNEY_LESSONS.length;

  return (
    <div className="app-shell min-h-screen" style={{ background: 'transparent' }}>
      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: '240px' }}
      >
        {/* Dark base layer */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0c2340 100%)' }}
        />

        {/* Background illustration — prominently visible, anchored right */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Illustration rendered on a white card so line-art colours show on dark bg */}
          <div
            className="absolute"
            style={{
              right: '-5%',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '160%',
              width: 'auto',
              maxWidth: '72%',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 55%, transparent 80%)',
            }}
          />
          <img
            src={HERO_IMG}
            alt=""
            aria-hidden="true"
            className="absolute"
            style={{
              right: '-5%',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '155%',
              width: 'auto',
              maxWidth: '72%',
              objectFit: 'contain',
              opacity: 0.52,
              filter: 'invert(1) brightness(2.4) saturate(0.45) drop-shadow(0 0 32px rgba(147,197,253,0.4))',
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
