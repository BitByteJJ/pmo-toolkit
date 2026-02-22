// PMO Toolkit Navigator — Top Navigation Bar
// Persistent across all non-home pages: Home button (left) + Quick-Jump deck dropdown (right)

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Home, ChevronDown, LayoutGrid } from 'lucide-react';
import { DECKS } from '@/lib/pmoData';

interface TopNavProps {
  /** Accent colour for the active deck (used for the border/highlight) */
  accentColor?: string;
  /** Background colour (inherits page bg by default) */
  bgColor?: string;
}

export default function TopNav({ accentColor = '#475569', bgColor }: TopNavProps) {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const bg = bgColor ?? 'rgba(255,255,255,0.92)';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-11"
      style={{
        background: bg,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1.5px solid ${accentColor}22`,
      }}
    >
      <div className="max-w-2xl mx-auto px-4 h-full flex items-center justify-between relative">
      {/* Home button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-[12px] font-bold rounded-xl px-2.5 py-1.5 transition-all hover:bg-black/5 active:scale-95"
        style={{ color: accentColor }}
        aria-label="Go to home"
      >
        <Home size={14} strokeWidth={2.2} />
        <span>Home</span>
      </button>

      {/* App title — centred within the content column */}
      <span
        className="absolute left-1/2 -translate-x-1/2 text-[11px] font-black tracking-tight text-stone-500 pointer-events-none select-none"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        StratAlign
      </span>

      {/* Quick-jump dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1 text-[11px] font-bold rounded-xl px-2.5 py-1.5 transition-all hover:bg-black/5 active:scale-95"
          style={{ color: accentColor }}
          aria-label="Jump to a deck"
          aria-expanded={open}
        >
          <LayoutGrid size={13} strokeWidth={2.2} />
          <span className="hidden sm:inline">Decks</span>
          <ChevronDown
            size={11}
            strokeWidth={2.5}
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.18s ease',
            }}
          />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.07)',
            }}
          >
            <div className="px-3 pt-2.5 pb-1">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Jump to deck</p>
            </div>
            <div className="pb-2">
              {DECKS.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => {
                    setOpen(false);
                    navigate(`/deck/${deck.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-stone-50 active:bg-stone-100"
                >
                  {/* Colour dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: deck.color }}
                  />
                  {/* Deck icon */}
                  <span className="text-base leading-none shrink-0">{deck.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-stone-800 truncate">{deck.title}</div>
                    <div className="text-[9px] text-stone-400 font-mono">{deck.subtitle}</div>
                  </div>
                  {/* Card count pill */}
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: deck.color + '18', color: deck.color }}
                  >
                    {deck.cardCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
