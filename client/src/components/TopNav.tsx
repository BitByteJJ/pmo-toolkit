// PMO Toolkit Navigator — Top Navigation Bar
// Mobile: frosted glass bar with wordmark + deck dropdown
// Desktop (lg+): full horizontal nav with all main sections
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Home, ChevronDown, LayoutGrid, Map, Route, Sparkles,
  BookMarked, BookOpen, Search, Bookmark, FileText, Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DECKS } from '@/lib/pmoData';

interface TopNavProps {
  accentColor?: string;
  bgColor?: string;
}

const NAV_LINKS = [
  { path: '/',             icon: Home,       label: 'Home'       },
  { path: '/decks',        icon: LayoutGrid, label: 'Decks'      },
  { path: '/journey',      icon: Map,        label: 'Journey'    },
  { path: '/roadmap',      icon: Route,      label: 'Roadmap'    },
  { path: '/decision',     icon: Compass,    label: 'Decision'   },
  { path: '/ai-suggest',   icon: Sparkles,   label: 'AI Suggest' },
  { path: '/templates',    icon: FileText,   label: 'Templates'  },
  { path: '/glossary',     icon: BookMarked, label: 'Glossary'   },
  { path: '/case-studies', icon: BookOpen,   label: 'Cases'      },
  { path: '/search',       icon: Search,     label: 'Search'     },
  { path: '/bookmarks',    icon: Bookmark,   label: 'Saved'      },
];

export default function TopNav({ accentColor = '#475569' }: TopNavProps) {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    if (path === '/decks') return location.startsWith('/deck') || location === '/decks';
    return location.startsWith(path);
  };

  const DeckDropdownContent = () => (
    <>
      {DECKS.map((deck, i) => (
        <motion.button
          key={deck.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          onClick={() => { setOpen(false); navigate(`/deck/${deck.id}`); }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-stone-50/80 active:bg-stone-100"
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: deck.color }} />
          <span className="text-base leading-none shrink-0">{deck.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold text-stone-800 truncate leading-tight">{deck.title}</div>
            <div className="text-[9.5px] text-stone-400 font-mono mt-0.5">{deck.subtitle}</div>
          </div>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: deck.color + '18', color: deck.color }}
          >
            {deck.cardCount}
          </span>
        </motion.button>
      ))}
    </>
  );

  const dropdownPanel = (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.07)',
        border: '1px solid rgba(0,0,0,0.07)',
        transformOrigin: 'top right',
      }}
    >
      <div className="px-3.5 pt-3 pb-1.5">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Jump to deck</p>
      </div>
      <div className="pb-2">
        <DeckDropdownContent />
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
      <div className="lg:hidden px-4 h-full flex items-center justify-between relative" style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all hover:bg-black/5 active:scale-95"
          style={{ color: accentColor }}
          aria-label="Go to home"
        >
          <Home size={15} strokeWidth={2.2} />
          <span className="text-[12px] font-bold">Home</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none select-none">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
            <LayoutGrid size={11} strokeWidth={2.5} color="white" />
          </div>
          <span className="text-[13px] font-black tracking-tight" style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}>
            StratAlign
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 transition-all hover:bg-black/5 active:scale-95"
            style={{ color: accentColor }}
            aria-label="Jump to a deck"
            aria-expanded={open}
          >
            <span className="text-[12px] font-bold hidden sm:inline">Decks</span>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
              <ChevronDown size={13} strokeWidth={2.5} />
            </motion.div>
          </button>
          <AnimatePresence>{open && dropdownPanel}</AnimatePresence>
        </div>
      </div>

      {/* ── Desktop layout (lg+) ─────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center h-full px-6 gap-1" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Wordmark */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mr-4 shrink-0" aria-label="Go to home">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
            <LayoutGrid size={13} strokeWidth={2.5} color="white" />
          </div>
          <span className="text-[14px] font-black tracking-tight" style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a2e' }}>
            StratAlign
          </span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {NAV_LINKS.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all"
                style={{ color: active ? accentColor : '#64748b', backgroundColor: active ? accentColor + '12' : 'transparent' }}
              >
                <Icon size={13} strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Deck quick-jump (desktop) */}
        <div className="relative shrink-0 ml-2" ref={dropdownRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:bg-black/5"
            style={{ color: accentColor }}
          >
            <ChevronDown size={13} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            Decks
          </button>
          <AnimatePresence>{open && dropdownPanel}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}
