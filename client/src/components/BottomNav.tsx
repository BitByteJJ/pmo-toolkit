// PMO Toolkit Navigator — Bottom Navigation
// 5 tabs: Home, AI, Decks(dropdown centre), Search, Templates
// Bookmarks/Saved moved to TopNav

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Home, Sparkles, FileText, Search, LayoutGrid, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DECKS } from '@/lib/pmoData';

// Side tabs (not the centre Decks button)
const SIDE_TABS = [
  { path: '/',           icon: Home,     label: 'Home'      },
  { path: '/ai-suggest', icon: Sparkles, label: 'AI'        },
  // centre slot = Decks dropdown
  { path: '/search',     icon: Search,   label: 'Search'    },
  { path: '/templates',  icon: FileText, label: 'Templates' },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const [decksOpen, setDecksOpen] = useState(false);
  const decksRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!decksOpen) return;
    const handler = (e: MouseEvent) => {
      if (!decksRef.current?.contains(e.target as Node)) setDecksOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [decksOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  const isDecksActive = location.startsWith('/deck');

  // Render one of the 4 side tabs
  const SideTab = ({ path, icon: Icon, label }: { path: string; icon: typeof Home; label: string }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => { setDecksOpen(false); navigate(path); }}
        className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl"
        style={{ minWidth: 0 }}
        aria-label={label}
      >
        {active && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-x-1 inset-y-0 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        )}
        <div className="relative z-10">
          <Icon
            size={20}
            strokeWidth={active ? 2.4 : 1.7}
            style={{
              color: active ? '#e2e8f0' : 'rgba(148,163,184,0.55)',
              transition: 'stroke-width 0.15s ease, color 0.15s ease',
            }}
          />
        </div>
        <span
          className="relative z-10 leading-none font-semibold"
          style={{
            fontSize: '9px',
            color: active ? '#e2e8f0' : 'rgba(148,163,184,0.55)',
            transition: 'color 0.15s ease',
          }}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10,22,40,0.88)',
        backdropFilter: 'blur(24px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* Decks upward dropdown panel — fixed to viewport centre */}
      <AnimatePresence>
        {decksOpen && (
          <motion.div
            ref={decksRef}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed rounded-2xl overflow-hidden"
            style={{
              width: '288px',
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
              left: 'calc(50vw - 144px)',
              transform: 'none',
              background: 'rgba(20,24,42,0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              zIndex: 60,
            }}
          >
            <div className="px-3.5 pt-3 pb-1.5">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Jump to deck</p>
            </div>
            <div className="pb-2 max-h-72 overflow-y-auto">
              {DECKS.map((deck, i) => (
                <motion.button
                  key={deck.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  onClick={() => { setDecksOpen(false); navigate(`/deck/${deck.id}`); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-white/5 active:bg-card/10"
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: deck.color }} />
                  <span className="text-base leading-none shrink-0">{deck.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-slate-100 truncate leading-tight">{deck.title}</div>
                    <div className="text-[9.5px] text-slate-300 font-mono mt-0.5">{deck.subtitle}</div>
                  </div>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: deck.color + '18', color: deck.color }}
                  >
                    {deck.cardCount}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="flex items-stretch w-full"
        style={{
          paddingTop: '6px',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {/* Left two tabs: Home, AI */}
        <SideTab path="/" icon={Home} label="Home" />
        <SideTab path="/ai-suggest" icon={Sparkles} label="AI" />

        {/* Centre: Decks dropdown button */}
        <div className="relative flex flex-col items-center justify-center flex-1" style={{ minWidth: 0 }}>
          <button
            onClick={() => setDecksOpen(prev => !prev)}
            className="relative flex flex-col items-center justify-center gap-0.5 w-full py-1 rounded-xl"
            aria-label="Browse decks"
            aria-expanded={decksOpen}
          >
            {/* Active/open pill */}
            {(decksOpen || isDecksActive) && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-x-1 inset-y-0 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-0.5">
              <LayoutGrid
                size={20}
                strokeWidth={(decksOpen || isDecksActive) ? 2.4 : 1.7}
                style={{
                  color: (decksOpen || isDecksActive) ? '#e2e8f0' : 'rgba(148,163,184,0.55)',
                  transition: 'color 0.15s ease',
                }}
              />
              <motion.div
                animate={{ rotate: decksOpen ? 0 : 180 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp
                  size={11}
                  strokeWidth={2.5}
                  style={{
                    color: (decksOpen || isDecksActive) ? '#e2e8f0' : 'rgba(148,163,184,0.4)',
                  }}
                />
              </motion.div>
            </div>
            <span
              className="relative z-10 leading-none font-semibold"
              style={{
                fontSize: '9px',
                color: (decksOpen || isDecksActive) ? '#e2e8f0' : 'rgba(148,163,184,0.55)',
                transition: 'color 0.15s ease',
              }}
            >
              Decks
            </span>
          </button>
        </div>

        {/* Right two tabs: Search, Templates */}
        <SideTab path="/search" icon={Search} label="Search" />
        <SideTab path="/templates" icon={FileText} label="Templates" />
      </div>
    </nav>
  );
}
