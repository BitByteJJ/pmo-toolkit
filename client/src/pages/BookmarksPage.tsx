// PMO Toolkit Navigator — Bookmarks Page
// Design: "Clarity Cards" — saved cards list with clear/remove actions

import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkX, ArrowRight } from 'lucide-react';
import { getCardById, getDeckById } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function BookmarksPage() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const { bookmarks, toggleBookmark, clearBookmarks } = useBookmarks();

  const savedCards = bookmarks
    .map(id => getCardById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getCardById>>[];

  return (
    <div className="min-h-screen pt-12 pb-24" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
      {/* Header */}
      <div className="border-b pt-4 pb-4" style={{ background: isDark ? 'rgba(8,14,32,0.94)' : 'rgba(248,250,252,0.94)', backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-xl font-bold text-slate-100"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Saved Cards
              </h1>
              <p className="text-[11px] text-foreground font-medium mt-0.5">
                {savedCards.length} card{savedCards.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            {savedCards.length > 0 && (
              <button
                onClick={clearBookmarks}
                className="text-xs text-rose-400 font-semibold hover:text-rose-600 transition-colors px-2 py-1 rounded-lg hover:bg-rose-900/20"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-2xl mx-auto">
        {savedCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Bookmark size={26} className="text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">No saved cards yet</h2>
            <p className="text-sm text-foreground max-w-xs leading-relaxed">
              Tap the bookmark icon on any card to save it here for quick reference.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-foreground bg-card rounded-xl px-4 py-2.5 transition-all hover:shadow-md"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            >
              Browse decks
              <ArrowRight size={13} />
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {savedCards.map((card, i) => {
                const deck = getDeckById(card.deckId);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div
                      className="bg-card rounded-2xl overflow-hidden"
                      style={{
                        borderLeft: `4px solid ${deck?.color ?? '#ccc'}`,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.055), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div className="flex items-start gap-0 p-4 pr-2">
                        <button
                          onClick={() => navigate(`/card/${card.id}`)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: deck?.bgColor, color: deck?.textColor }}
                            >
                              {card.code}
                            </span>
                            <span className="text-[9px] text-foreground font-medium capitalize">{card.type}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-foreground leading-tight">{card.title}</h3>
                          <p className="text-[11px] text-foreground mt-1 line-clamp-2 leading-relaxed">{card.tagline}</p>
                        </button>
                        <button
                          onClick={() => toggleBookmark(card.id)}
                          className="shrink-0 p-2 rounded-xl hover:bg-rose-900/20 transition-colors ml-1"
                        >
                          <BookmarkX size={15} className="text-rose-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
