// PMO Toolkit Navigator — Top Navigation Bar
// Mobile: frosted glass bar with wordmark + Bookmarks + Mini-Apps dropdown
// Desktop (lg+): wordmark + primary nav links + Bookmarks + Mini-Apps dropdown
// Decks navigation lives exclusively in the BottomNav centre slot

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Home, ChevronDown, LayoutGrid, Sparkles,
  BookMarked, BookOpen, Search, Bookmark, FileText, Compass,
  Map, Route, Grid3X3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/contexts/BookmarksContext';

interface TopNavProps {
  accentColor?: string;
  bgColor?: string;
}

// Primary nav links shown on desktop (not in any dropdown)
const PRIMARY_LINKS = [
  { path: '/',       icon: Home,   label: 'Home'   },
  { path: '/search', icon: Search, label: 'Search' },
];

// Mini-Apps: all the interactive tools
const MINI_APPS = [
  {
    path: '/ai-suggest',
    icon: Sparkles,
    label: 'AI Tool Finder',
    desc: 'Describe your challenge — AI picks the best tools',
    color: '#6366f1',
  },
  {
    path: '/decision',
    icon: Compass,
    label: 'Decision Helper',
    desc: 'Answer 3 questions to find the right approach',
    color: '#0ea5e9',
  },
  {
    path: '/templates',
    icon: FileText,
    label: 'Template Library',
    desc: '198 fillable templates — PDF & Word download',
    color: '#10b981',
  },
  {
    path: '/journey',
    icon: Map,
    label: 'Learning Journey',
    desc: '35-day structured PM learning game',
    color: '#f59e0b',
  },
  {
    path: '/roadmap',
    icon: Route,
    label: 'Learning Roadmap',
    desc: 'Beginner → Advanced curated study paths',
    color: '#8b5cf6',
  },
  {
    path: '/glossary',
    icon: BookMarked,
    label: 'Glossary',
    desc: '120+ PM terms defined and linked to cards',
    color: '#ec4899',
  },
  {
    path: '/case-studies',
    icon: BookOpen,
    label: 'Case Studies',
    desc: 'Real-world PM stories for every tool',
    color: '#ef4444',
  },
];

type DropdownType = 'apps' | null;

export default function TopNav({ accentColor = '#475569' }: TopNavProps) {
  const [location, navigate] = useLocation();
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const appsRef = useRef<HTMLDivElement>(null);
  const { bookmarks } = useBookmarks();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      const clickedApps = appsRef.current?.contains(target);
      if (!clickedApps) setOpenDropdown(null);
    }
    if (openDropdown) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [openDropdown]);

  const toggle = (which: DropdownType) =>
    setOpenDropdown(prev => (prev === which ? null : which));

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  // ── Mini-Apps dropdown panel ──────────────────────────────────────────────
  const AppsPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.07)',
        border: '1px solid rgba(0,0,0,0.07)',
        transformOrigin: 'top right',
        zIndex: 60,
      }}
    >
      <div className="px-3.5 pt-3 pb-1.5">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Mini-Apps</p>
      </div>
      <div className="pb-2">
        {MINI_APPS.map((app, i) => {
          const active = isActive(app.path);
          return (
            <motion.button
              key={app.path}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => { setOpenDropdown(null); navigate(app.path); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-stone-50/80 active:bg-stone-100"
              style={{ backgroundColor: active ? app.color + '0d' : undefined }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: app.color + '18' }}
              >
                <app.icon size={14} strokeWidth={2} style={{ color: app.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[12.5px] font-semibold leading-tight truncate"
                  style={{ color: active ? app.color : '#1c1917' }}
                >
                  {app.label}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 leading-tight line-clamp-1">{app.desc}</div>
              </div>
              {active && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: app.color }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '48px',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* ── Mobile layout (< lg) ─────────────────────────────────────────── */}
      <div
        className="lg:hidden px-3 h-full flex items-center justify-between relative"
        style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}
      >
        {/* Wordmark */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 transition-all hover:bg-black/5 active:scale-95 shrink-0"
          aria-label="Go to home"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
          >
            <LayoutGrid size={11} strokeWidth={2.5} color="white" />
          </div>
          <span
            className="text-[13px] font-black tracking-tight"
            style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}
          >
            StratAlign
          </span>
        </button>

        {/* Right side: Bookmarks + Mini-Apps */}
        <div className="flex items-center gap-1">
          {/* Bookmarks button (mobile) */}
          <button
            onClick={() => navigate('/bookmarks')}
            className="relative flex items-center justify-center rounded-xl w-8 h-8 transition-all hover:bg-black/5 active:scale-95"
            aria-label="Bookmarks"
          >
            <Bookmark
              size={16}
              strokeWidth={location === '/bookmarks' ? 2.4 : 1.8}
              style={{ color: location === '/bookmarks' ? accentColor : '#64748b' }}
            />
            {bookmarks.length > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </button>

          {/* Mini-Apps dropdown */}
          <div className="relative" ref={appsRef}>
            <button
              onClick={() => toggle('apps')}
              className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 transition-all hover:bg-black/5 active:scale-95"
              style={{ color: accentColor }}
              aria-label="Open mini-apps"
              aria-expanded={openDropdown === 'apps'}
            >
              <Grid3X3 size={15} strokeWidth={2} />
              <motion.div animate={{ rotate: openDropdown === 'apps' ? 180 : 0 }} transition={{ duration: 0.18 }}>
                <ChevronDown size={12} strokeWidth={2.5} />
              </motion.div>
            </button>
            <AnimatePresence>{openDropdown === 'apps' && <AppsPanel />}</AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Desktop layout (lg+) ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex items-center h-full px-6 gap-1"
        style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}
      >
        {/* Wordmark */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mr-4 shrink-0"
          aria-label="Go to home"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
          >
            <LayoutGrid size={13} strokeWidth={2.5} color="white" />
          </div>
          <span
            className="text-[14px] font-black tracking-tight"
            style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}
          >
            StratAlign
          </span>
        </button>

        {/* Primary nav links */}
        <div className="flex items-center gap-0.5 flex-1">
          {PRIMARY_LINKS.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all"
                style={{
                  color: active ? accentColor : '#64748b',
                  backgroundColor: active ? accentColor + '12' : 'transparent',
                }}
              >
                <Icon size={13} strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Right side: Bookmarks + Mini-Apps */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Bookmarks button (desktop) */}
          <button
            onClick={() => navigate('/bookmarks')}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all hover:bg-black/5"
            style={{
              color: location === '/bookmarks' ? accentColor : '#64748b',
              backgroundColor: location === '/bookmarks' ? accentColor + '12' : 'transparent',
            }}
          >
            <Bookmark size={13} strokeWidth={location === '/bookmarks' ? 2.4 : 1.8} />
            Saved
            {bookmarks.length > 0 && (
              <span className="min-w-[16px] h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </button>

          {/* Mini-Apps dropdown */}
          <div className="relative" ref={appsRef}>
            <button
              onClick={() => toggle('apps')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:bg-black/5"
              style={{ color: accentColor }}
              aria-expanded={openDropdown === 'apps'}
            >
              <Grid3X3 size={13} strokeWidth={2} />
              Mini-Apps
              <ChevronDown
                size={12}
                strokeWidth={2.5}
                style={{
                  transform: openDropdown === 'apps' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            <AnimatePresence>{openDropdown === 'apps' && <AppsPanel />}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
