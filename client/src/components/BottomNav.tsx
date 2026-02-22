// PMO Toolkit Navigator — Bottom Navigation
// Fixed to bottom of viewport, full-width, 9 tabs evenly distributed

import { useLocation } from 'wouter';
import { Home, LayoutGrid, Sparkles, Search, Bookmark, Route, Map, BookOpen, BookMarked, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useJourney, MAX_HEARTS } from '@/contexts/JourneyContext';

const tabs = [
  { path: '/',             icon: Home,        label: 'Home'     },
  { path: '/decks',        icon: LayoutGrid,  label: 'Decks'    },
  { path: '/journey',      icon: Map,         label: 'Journey'  },
  { path: '/roadmap',      icon: Route,       label: 'Roadmap'  },
  { path: '/ai-suggest',   icon: Sparkles,    label: 'AI'       },
  { path: '/glossary',     icon: BookMarked,  label: 'Glossary' },
  { path: '/case-studies', icon: BookOpen,    label: 'Cases'    },
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
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(24px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 -1px 0 rgba(255,255,255,0.9) inset, 0 -4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="flex items-stretch w-full"
        style={{
          paddingTop: '6px',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
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
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl"
              style={{ minWidth: 0 }}
              aria-label={label}
            >
              {/* Active pill background */}
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-x-1 inset-y-0 rounded-xl"
                  style={{ backgroundColor: 'rgba(0,0,0,0.055)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}

              {/* Icon + badge */}
              <div className="relative z-10">
                <Icon
                  size={19}
                  strokeWidth={active ? 2.4 : 1.7}
                  style={{
                    color: active ? '#1a1a2e' : '#a8a29e',
                    transition: 'stroke-width 0.15s ease, color 0.15s ease',
                  }}
                />
                {isBookmarkTab && bookmarks.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1.5 min-w-[13px] h-3 bg-rose-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none"
                  >
                    {bookmarks.length > 9 ? '9+' : bookmarks.length}
                  </span>
                )}
              </div>

              {/* Hearts row — Journey tab only */}
              {isJourneyTab && (
                <div className="flex gap-0.5 z-10 relative" style={{ marginTop: '-1px' }}>
                  {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                    <Heart
                      key={i}
                      size={6}
                      fill={i < hearts ? '#ef4444' : 'none'}
                      stroke={i < hearts ? '#ef4444' : '#ccc'}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              )}

              {/* Label */}
              <span
                className="relative z-10 leading-none font-semibold"
                style={{
                  fontSize: '8px',
                  color: active ? '#1a1a2e' : '#a8a29e',
                  transition: 'color 0.15s ease',
                }}
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
