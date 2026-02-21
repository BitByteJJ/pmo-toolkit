// PMO Toolkit Navigator — Bottom Navigation
// Design: "Clarity Cards" — clean floating tab bar with active state indicators

import { useLocation } from 'wouter';
import { Home, LayoutGrid, Search, Bookmark, Map } from 'lucide-react';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useJourney, MAX_HEARTS } from '@/contexts/JourneyContext';
import { Heart } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/decks', icon: LayoutGrid, label: 'Decks' },
  { path: '/journey', icon: Map, label: 'Journey' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/bookmarks', icon: Bookmark, label: 'Saved' },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { bookmarks } = useBookmarks();
  const { state: journeyState } = useJourney();

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    if (path === '/decks') return location.startsWith('/deck') || location === '/decks';
    return location.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-1.5 pb-safe">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          const isBookmarkTab = path === '/bookmarks';
          const isJourneyTab = path === '/journey';
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all duration-200 relative ${
                active ? 'bg-stone-100' : 'hover:bg-stone-50'
              }`}
            >
              {/* Icon row with badge for bookmarks */}
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-stone-900' : 'text-stone-400'}
                />
                {isBookmarkTab && bookmarks.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {bookmarks.length > 9 ? '9+' : bookmarks.length}
                  </span>
                )}
              </div>

              {/* Hearts row — only on Journey tab, centred below icon */}
              {isJourneyTab && (
                <span className="flex items-center justify-center gap-px">
                  {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                    <Heart
                      key={i}
                      size={6}
                      className={
                        i < journeyState.hearts
                          ? 'text-rose-500 fill-rose-500'
                          : 'text-stone-300 fill-stone-200'
                      }
                    />
                  ))}
                </span>
              )}

              {/* Label */}
              <span
                className={`text-[9px] font-semibold leading-none ${
                  active ? 'text-stone-900' : 'text-stone-400'
                }`}
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
