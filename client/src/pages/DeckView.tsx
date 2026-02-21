// PMO Toolkit Navigator — Deck View Page
// Design: "Clarity Cards" — pip-deck style card list with color-coded deck header

import { useRoute, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark, BookmarkCheck, Search } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { DECKS, getCardsByDeck, getDeckById } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function CardListItem({
  card,
  deck,
  onNavigate,
}: {
  card: ReturnType<typeof getCardsByDeck>[0];
  deck: ReturnType<typeof getDeckById>;
  onNavigate: () => void;
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(card.id);

  return (
    <motion.div variants={itemVariants}>
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
          borderLeft: `4px solid ${deck?.color ?? '#ccc'}`,
        }}
      >
        <button
          onClick={onNavigate}
          className="w-full text-left p-4 pr-2"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: deck?.bgColor, color: deck?.textColor }}
                >
                  {card.code}
                </span>
                <span className="text-[9px] text-stone-400 font-medium capitalize">
                  {card.type}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-stone-800 leading-tight">{card.title}</h3>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">{card.tagline}</p>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                toggleBookmark(card.id);
              }}
              className="shrink-0 p-2 rounded-xl transition-colors hover:bg-stone-50 active:scale-90"
            >
              {bookmarked ? (
                <BookmarkCheck size={15} className="text-rose-500" />
              ) : (
                <Bookmark size={15} className="text-stone-300" />
              )}
            </button>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

export default function DeckView() {
  const [, params] = useRoute('/deck/:deckId');
  const [, navigate] = useLocation();
  const deckId = params?.deckId ?? 'tools';

  const deck = getDeckById(deckId);
  const cards = getCardsByDeck(deckId);

  // If deck not found, show all decks list
  if (!deck) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pb-24">
        <div className="bg-white border-b border-stone-100 px-4 pt-14 pb-4">
          <h1 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>
            All Decks
          </h1>
        </div>
        <div className="px-4 pt-4 space-y-2.5">
          {DECKS.map(d => (
            <button
              key={d.id}
              onClick={() => navigate(`/deck/${d.id}`)}
              className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01] active:scale-[0.98]"
              style={{
                backgroundColor: d.bgColor,
                borderLeft: `4px solid ${d.color}`,
                boxShadow: `0 1px 3px ${d.color}18`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: d.textColor }}>{d.title}</h3>
                  <p className="text-[10px] opacity-60" style={{ color: d.textColor }}>{getCardsByDeck(d.id).length} cards</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  // Group cards by type
  const groupedCards = cards.reduce<Record<string, typeof cards>>((acc, card) => {
    const key = card.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(card);
    return acc;
  }, {});

  const typeLabels: Record<string, string> = {
    phase: 'Project Phases',
    archetype: 'Archetypes',
    methodology: 'Methodologies',
    task: 'Domain Tasks',
    tool: 'Tools',
    technique: 'Techniques',
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* Deck Header */}
      <div
        className="px-4 pt-14 pb-5"
        style={{ backgroundColor: deck.bgColor }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[11px] font-semibold mb-4 transition-opacity hover:opacity-100 opacity-60"
          style={{ color: deck.textColor }}
        >
          <ArrowLeft size={13} />
          Home
        </button>
        <div className="flex items-start gap-3">
          <span className="text-4xl leading-none shrink-0">{deck.icon}</span>
          <div className="flex-1 min-w-0">
            <div
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded mb-1.5 inline-block"
              style={{ backgroundColor: deck.color + '25', color: deck.textColor }}
            >
              {deck.subtitle}
            </div>
            <h1
              className="text-xl font-bold leading-tight"
              style={{ fontFamily: 'Sora, sans-serif', color: deck.textColor }}
            >
              {deck.title}
            </h1>
            <p className="text-[11px] mt-1 opacity-65 leading-relaxed" style={{ color: deck.textColor }}>
              {deck.description}
            </p>
          </div>
        </div>

        {/* Stats + Search row */}
        <div className="flex items-center gap-2 mt-4">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: deck.color + '25', color: deck.textColor }}
          >
            {cards.length} cards
          </span>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: deck.color + '25', color: deck.textColor }}
          >
            <Search size={11} />
            Search
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-0.5 rounded-full bg-black/10" />
      </div>

      {/* Cards List */}
      <div className="px-4 pt-4 space-y-5">
        {Object.entries(groupedCards).map(([type, typeCards]) => (
          <div key={type}>
            <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">
              {typeLabels[type] ?? type} ({typeCards.length})
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {typeCards.map(card => (
                <CardListItem
                  key={card.id}
                  card={card}
                  deck={deck}
                  onNavigate={() => navigate(`/card/${card.id}`)}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
