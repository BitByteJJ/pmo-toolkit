// PMO Toolkit Navigator — Card Detail Page
// Design: "Clarity Cards" — full card with step-by-step, pro tips, related cards

import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight,
  Lightbulb, ListChecks, Info, Link2, Tag, Sparkles, ShieldCheck, ExternalLink, Image
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { getCardById, getDeckById, getRelatedCards, getCardsByDeck } from '@/lib/pmoData';
import { getCopyrightNotices, GENERAL_DISCLAIMER } from '@/lib/copyrightData';
import { getCardIllustration } from '@/lib/toolImages';
import { useBookmarks } from '@/contexts/BookmarksContext';

function Section({ icon: Icon, title, children, color }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon size={11} style={{ color }} />
        </div>
        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function CardDetail() {
  const [, params] = useRoute('/card/:cardId');
  const [, navigate] = useLocation();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const cardId = params?.cardId ?? '';
  const card = getCardById(cardId);

  if (!card) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center pb-24">
        <div className="text-center px-8">
          <p className="text-stone-400 text-sm mb-4">Card not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-stone-700 bg-white rounded-xl px-4 py-2 shadow-sm"
          >
            Go home
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const deck = getDeckById(card.deckId);
  const deckCards = getCardsByDeck(card.deckId);
  const currentIndex = deckCards.findIndex(c => c.id === card.id);
  const prevCard = currentIndex > 0 ? deckCards[currentIndex - 1] : null;
  const nextCard = currentIndex < deckCards.length - 1 ? deckCards[currentIndex + 1] : null;
  const relatedCards = getRelatedCards(card);
  const bookmarked = isBookmarked(card.id);
  const progress = ((currentIndex + 1) / deckCards.length) * 100;
  const copyrightNotices = getCopyrightNotices(card.id);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* Card Header */}
      <div
        className="px-4 pt-14 pb-5 relative"
        style={{ backgroundColor: deck?.bgColor ?? '#F8F8F6' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/deck/${card.deckId}`)}
            className="flex items-center gap-1.5 text-[11px] font-semibold opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: deck?.textColor }}
          >
            <ArrowLeft size={13} />
            {deck?.title ?? 'Back'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium opacity-50" style={{ color: deck?.textColor }}>
              {currentIndex + 1} / {deckCards.length}
            </span>
            <button
              onClick={() => toggleBookmark(card.id)}
              className="p-2 rounded-xl transition-all hover:scale-110 active:scale-90"
              style={{ backgroundColor: deck?.color + '20' }}
            >
              {bookmarked ? (
                <BookmarkCheck size={16} className="text-rose-500" />
              ) : (
                <Bookmark size={16} style={{ color: deck?.textColor, opacity: 0.7 }} />
              )}
            </button>
          </div>
        </div>

        {/* Card code badge + type */}
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: deck?.color, color: '#fff' }}
          >
            {card.code}
          </span>
          <span
            className="text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full"
            style={{ backgroundColor: deck?.color + '20', color: deck?.textColor, opacity: 0.8 }}
          >
            {card.type}
          </span>
          {copyrightNotices.length > 0 && (
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
            >
              <ShieldCheck size={9} />
              Proprietary
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-[22px] font-bold leading-tight mb-2"
          style={{ fontFamily: 'Sora, sans-serif', color: deck?.textColor }}
        >
          {card.title}
        </h1>

        {/* Tagline */}
        <p className="text-sm leading-relaxed" style={{ color: deck?.textColor, opacity: 0.7 }}>
          {card.tagline}
        </p>

        {/* Illustration in header */}
        {getCardIllustration(card.id) && (
          <div className="mt-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.35)' }}>
            <img
              src={getCardIllustration(card.id)!}
              alt={`${card.title} illustration`}
              className="w-full h-auto block"
              style={{ maxHeight: '220px', objectFit: 'contain', padding: '12px', mixBlendMode: 'multiply' }}
              loading="eager"
            />
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4 h-1 rounded-full bg-black/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ backgroundColor: deck?.color }}
          />
        </div>
      </div>

      {/* Card Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28 }}
          className="px-4 pt-4 space-y-3"
        >
          {/* What it is */}
          <Section icon={Info} title="What it is" color={deck?.color ?? '#6B7280'}>
            <p className="text-sm text-stone-700 leading-relaxed">{card.whatItIs}</p>
          </Section>

          {/* When to use */}
          {card.whenToUse && (
            <Section icon={Tag} title="When to use" color={deck?.color ?? '#6B7280'}>
              <p className="text-sm text-stone-700 leading-relaxed">{card.whenToUse}</p>
            </Section>
          )}

          {/* Steps */}
          {card.steps && card.steps.length > 0 && (
            <Section icon={ListChecks} title="How to use it" color={deck?.color ?? '#6B7280'}>
              <ol className="space-y-3">
                {card.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5 leading-none"
                      style={{ backgroundColor: deck?.color, color: '#fff' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-stone-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {/* Pro Tip */}
          {card.proTip && (
            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: deck?.color + '12',
                borderLeft: `3px solid ${deck?.color}`,
              }}
            >
              <div className="flex items-start gap-2.5">
                <Lightbulb size={14} className="shrink-0 mt-0.5" style={{ color: deck?.color }} />
                <div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: deck?.color }}
                  >
                    Pro Tip
                  </span>
                  <p className="text-sm text-stone-700 leading-relaxed mt-0.5">{card.proTip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Example */}
          {card.example && (
            <Section icon={Sparkles} title="Example" color={deck?.color ?? '#6B7280'}>
              <p className="text-sm text-stone-600 leading-relaxed italic">{card.example}</p>
            </Section>
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Cards */}
          {relatedCards.length > 0 && (
            <div className="pb-2">
              <div className="flex items-center gap-2 mb-2.5">
                <Link2 size={11} className="text-stone-400" />
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Related Cards
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedCards.map(related => {
                  const relDeck = getDeckById(related.deckId);
                  return (
                    <button
                      key={related.id}
                      onClick={() => navigate(`/card/${related.id}`)}
                      className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all hover:opacity-80 active:scale-95"
                      style={{
                        backgroundColor: relDeck?.bgColor ?? '#F1F5F9',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      }}
                    >
                      <span
                        className="text-[9px] font-mono font-bold"
                        style={{ color: relDeck?.color }}
                      >
                        {related.code}
                      </span>
                      <span className="text-[10px] text-stone-600 max-w-[90px] truncate">
                        {related.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="flex gap-2.5 pt-1 pb-4">
            {prevCard ? (
              <button
                onClick={() => navigate(`/card/${prevCard.id}`)}
                className="flex-1 flex items-center gap-2 bg-white rounded-2xl p-3 transition-all active:scale-[0.97] hover:shadow-md"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <ChevronLeft size={15} className="text-stone-400 shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-[9px] text-stone-400 font-bold uppercase tracking-wide">Prev</div>
                  <div className="text-[11px] font-semibold text-stone-700 truncate">{prevCard.title}</div>
                </div>
              </button>
            ) : (
              <div className="flex-1" />
            )}
            {nextCard ? (
              <button
                onClick={() => navigate(`/card/${nextCard.id}`)}
                className="flex-1 flex items-center justify-end gap-2 bg-white rounded-2xl p-3 transition-all active:scale-[0.97] hover:shadow-md"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <div className="text-right min-w-0">
                  <div className="text-[9px] text-stone-400 font-bold uppercase tracking-wide">Next</div>
                  <div className="text-[11px] font-semibold text-stone-700 truncate">{nextCard.title}</div>
                </div>
                <ChevronRight size={15} className="text-stone-400 shrink-0" />
              </button>
            ) : (
              <div className="flex-1" />
            )}
          </div>

          {/* ─── COPYRIGHT FOOTNOTE ─────────────────────────────────── */}
          {copyrightNotices.length > 0 && (
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={13} className="text-amber-600 shrink-0" />
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Intellectual Property Notice
                </span>
              </div>
              {copyrightNotices.map((notice, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-amber-800">{notice.name}</p>
                  <p className="text-[10px] text-amber-700 leading-relaxed">{notice.notice}</p>
                  {notice.url && (
                    <a
                      href={notice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-medium hover:underline"
                    >
                      <ExternalLink size={9} />
                      {notice.url.replace('https://', '')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* General disclaimer — shown on all cards */}
          <div className="pb-2">
            <p className="text-[9px] text-stone-400 leading-relaxed text-center px-2">
              {GENERAL_DISCLAIMER}
            </p>
          </div>

        </motion.div>
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
