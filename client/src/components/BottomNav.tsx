// PMO Toolkit Navigator — Bottom Navigation
// Premium floating tab bar — all 9 tabs restored, scrollable row

import { useLocation } from 'wouter';
import { Home, LayoutGrid, Sparkles, Search, Bookmark, Route, Map, BookOpen, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useJourney, MAX_HEARTS } from '@/contexts/JourneyContext';
import { Heart } from 'lucide-react';

const tabs = [
  { path: '/',             icon: Home,        label: 'Home'     },
  { path: '/decks',        icon: LayoutGrid,  label: 'Decks'    },
  { path: '/ai-suggest',   icon: Sparkles,    label: 'AI'       },
  { path: '/roadmap',      icon: Route,       label: 'Roadmap'  },
  { path: '/journey',      icon: Map,         label: 'Journey'  },
  { path: '/case-studies', icon: BookOpen,    label: 'Cases'    },
  { path: '/glossary',     icon: BookMarked,  label: 'Glossary' },
  { path: '/search',       icon: Search,      label: 'Search'   },
  { path: '/bookmarks',    icon: Bookmark,    label: 'Saved'    },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { bookmarks } = useBookmarks();
  const { state: journeyState } = useJourney();
  const hearts = journeyState.hearts;

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    if (path === '/decks') return location.startsWith('/deck') || location === '/decks';
    return location.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        borderTop: '1px solid rgba(0,0,0,0.055)',
        boxShadow: '0 -1px 0 rgba(255,255,255,0.9) inset, 0 -4px 16px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="flex items-center w-full overflow-x-auto px-2 pt-1.5"
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          const isBookmarkTab = path === '/bookmarks';
          const isJourneyTab = path === '/journey';

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-colors duration-150 shrink-0"
              style={{ minWidth: '52px' }}
              aria-label={label}
            >
              {/* Active pill background */}
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}

              {/* Icon + badge */}
              <div className="relative z-10">
                <Icon
                  size={21}
                  strokeWidth={active ? 2.4 : 1.7}
                  className={active ? 'text-stone-900' : 'text-stone-400'}
                  style={{ transition: 'stroke-width 0.15s ease, color 0.15s ease' }}
                />
                {isBookmarkTab && bookmarks.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {bookmarks.length > 9 ? '9+' : bookmarks.length}
                  </span>
                )}
              </div>

              {/* Hearts row — only on Journey tab */}
              {isJourneyTab && (
                <div className="flex gap-0.5 z-10 relative" style={{ marginTop: '-1px' }}>
                  {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                    <Heart
                      key={i}
                      size={7}
                      fill={i < hearts ? '#ef4444' : 'none'}
                      stroke={i < hearts ? '#ef4444' : '#ccc'}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              )}

              {/* Label */}
              <span
                className="relative z-10 text-[9px] font-semibold leading-none transition-colors duration-150"
                style={{ color: active ? '#1a1a2e' : '#a8a29e' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
