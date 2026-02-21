// PMO Toolkit Navigator — Card Detail Page
// Design: "Clarity Cards" — full card with step-by-step, pro tips, related cards
// Features: swipe navigation, share/copy link, related card popover, notes panel, read tracking

import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  ArrowLeft, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight,
  Lightbulb, ListChecks, Info, Link2, Tag, Sparkles, ShieldCheck, ExternalLink, Cpu,
  Share2, StickyNote, X, Zap, FileText, Copy, Download, Check
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import BottomNav from '@/components/BottomNav';
import { getCardById, getDeckById, getRelatedCards, getCardsByDeck } from '@/lib/pmoData';
import { getCopyrightNotices, GENERAL_DISCLAIMER } from '@/lib/copyrightData';
import { getCardIllustration } from '@/lib/toolImages';
import { getVisualReference } from '@/components/VisualReference';
import { useBookmarks } from '@/contexts/BookmarksContext';
import ShareSheet from '@/components/ShareSheet';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useCardNotes } from '@/hooks/useCardNotes';
import { getTemplateByCardId } from '@/lib/templateData';

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// Related card popover chip
function RelatedCardChip({ related, onNavigate }: {
  related: NonNullable<ReturnType<typeof getCardById>>;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const relDeck = getDeckById(related.deckId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all hover:opacity-80 active:scale-95"
        style={{
          backgroundColor: relDeck?.bgColor ?? '#F1F5F9',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }}
      >
        <span className="text-[9px] font-mono font-bold" style={{ color: relDeck?.color }}>
          {related.code}
        </span>
        <span className="text-[10px] text-stone-600 max-w-[90px] truncate">{related.title}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(255,255,255,0.98)',
              boxShadow: '0 8px 28px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
              border: `1.5px solid ${relDeck?.color ?? '#e5e7eb'}30`,
            }}
          >
            {/* Colour bar */}
            <div className="h-1 w-full" style={{ backgroundColor: relDeck?.color }} />
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: relDeck?.bgColor, color: relDeck?.color }}
                >
                  {related.code}
                </span>
                <span className="text-[10px] text-stone-400 capitalize">{related.type}</span>
              </div>
              <p className="text-[13px] font-bold text-stone-800 leading-tight mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                {related.title}
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-3">{related.tagline}</p>
              <button
                onClick={() => { setOpen(false); onNavigate(); }}
                className="w-full text-center text-[11px] font-bold py-1.5 rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: relDeck?.color, color: '#fff' }}
              >
                Open card →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Deck completion celebration overlay
function CompletionCelebration({ deck, onDismiss }: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="rounded-3xl p-8 text-center max-w-xs w-full"
        style={{ backgroundColor: deck.bgColor, border: `2px solid ${deck.color}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl mb-3">🎉</div>
        <h2
          className="text-xl font-black mb-1"
          style={{ fontFamily: 'Sora, sans-serif', color: deck.textColor }}
        >
          Deck Complete!
        </h2>
        <p className="text-sm mb-1 font-bold" style={{ color: deck.color }}>{deck.title}</p>
        <p className="text-[12px] mb-5" style={{ color: deck.textColor, opacity: 0.65 }}>
          You've read every card in this deck. Excellent work!
        </p>
        <button
          onClick={onDismiss}
          className="w-full py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: deck.color }}
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardDetail() {
  const [, params] = useRoute('/card/:cardId');
  const [, navigate] = useLocation();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { markRead, isRead, deckProgress, deckReadCount } = useCardProgress();
  const { getNote, setNote, hasNote } = useCardNotes();

  const cardId = params?.cardId ?? '';
  const card = getCardById(cardId);

  const [showShare, setShowShare] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'template'>('overview');
  const [copied, setCopied] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [swipeHint, setSwipeHint] = useState(false);

  // Swipe motion values
  const x = useMotionValue(0);
  const cardOpacity = useTransform(x, [-120, 0, 120], [0.4, 1, 0.4]);
  const cardRotate = useTransform(x, [-120, 0, 120], [-6, 0, 6]);

  // Mark card as read on mount, check for deck completion
  useEffect(() => {
    const currentCard = getCardById(cardId);
    if (!currentCard) return;
    const wasRead = isRead(currentCard.id);
    markRead(currentCard.id);

    // Load note
    setNoteText(getNote(currentCard.id));

    // Check if deck is now complete (only show once, when this card was the last unread)
    if (!wasRead) {
      const dc = getCardsByDeck(currentCard.deckId);
      const readAfter = dc.filter(c => c.id === currentCard.id || isRead(c.id)).length;
      if (readAfter === dc.length) {
        setTimeout(() => setShowCelebration(true), 800);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId]);

  // Show swipe hint briefly on first load
  useEffect(() => {
    setSwipeHint(true);
    const t = setTimeout(() => setSwipeHint(false), 1800);
    return () => clearTimeout(t);
  }, [cardId]);

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
  const readCount = deckReadCount(deckCards.map(c => c.id));
  const deckPct = Math.round(deckProgress(deckCards.map(c => c.id)) * 100);

  function handleShare() {
    setShowShare(true);
  }

  function handleSwipeEnd(_: unknown, info: PanInfo) {
    const threshold = 80;
    if (info.offset.x < -threshold && nextCard) {
      navigate(`/card/${nextCard.id}`);
    } else if (info.offset.x > threshold && prevCard) {
      navigate(`/card/${prevCard.id}`);
    }
    x.set(0);
  }

  const template = getTemplateByCardId(card?.id ?? '');

  const handleCopyTemplate = useCallback(() => {
    if (!template) return;
    const text = template.sections
      .map(s => `## ${s.heading}\n\n${s.content}`)
      .join('\n\n---\n\n');
    const full = `# ${template.title}\n\n${template.description}\n\n${text}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [template]);

  const handleDownloadTemplate = useCallback(() => {
    if (!template) return;
    const text = template.sections
      .map(s => `## ${s.heading}\n\n${s.content}`)
      .join('\n\n---\n\n');
    const full = `# ${template.title}\n\n${template.description}\n\n${text}`;
    const blob = new Blob([full], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card?.code ?? 'template'}-${template.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [template, card]);

  function saveNote() {
    if (card) setNote(card.id, noteText);
    setShowNotes(false);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 overflow-x-hidden">

      {/* Completion celebration overlay */}
      <AnimatePresence>
        {showCelebration && deck && (
          <CompletionCelebration deck={deck} onDismiss={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>

      {/* Notes drawer */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowNotes(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="w-full max-w-2xl rounded-t-3xl bg-white p-5 pb-8"
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.12)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StickyNote size={15} style={{ color: deck?.color }} />
                  <span className="text-sm font-bold text-stone-800">My Notes</span>
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: deck?.bgColor, color: deck?.color }}
                  >
                    {card.code}
                  </span>
                </div>
                <button onClick={() => setShowNotes(false)} className="p-1 rounded-lg hover:bg-stone-100">
                  <X size={15} className="text-stone-400" />
                </button>
              </div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Jot down how you applied this technique, key insights, or reminders…"
                className="w-full h-36 text-sm text-stone-700 leading-relaxed resize-none rounded-xl border border-stone-200 p-3 focus:outline-none focus:border-stone-400 placeholder:text-stone-300"
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveNote}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: deck?.color }}
                >
                  Save note
                </button>
                {noteText.trim() !== getNote(card.id) && (
                  <button
                    onClick={() => { setNoteText(getNote(card.id)); setShowNotes(false); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Header — swipeable, illustration sits behind text */}
      <motion.div
        style={{ x, opacity: cardOpacity, rotate: cardRotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={handleSwipeEnd}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div
          className="relative overflow-hidden"
          style={{ backgroundColor: deck?.bgColor ?? '#F8F8F6', minHeight: getCardIllustration(card.id) ? '260px' : 'auto' }}
        >
        {/* Desktop centering wrapper */}
        <div className="max-w-2xl mx-auto relative" style={{ minHeight: 'inherit' }}>
          {/* Illustration as absolute background layer */}
          {getCardIllustration(card.id) && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
              <img
                src={getCardIllustration(card.id)!}
                alt=""
                aria-hidden="true"
                className="absolute"
                style={{
                  right: '0',
                  bottom: '-5%',
                  width: '56%',
                  maxWidth: '280px',
                  height: 'auto',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                  opacity: 0.92,
                }}
                loading="eager"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${deck?.bgColor ?? '#F8F8F6'} 28%, ${deck?.bgColor ?? '#F8F8F6'}99 50%, transparent 80%)`,
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-8"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${deck?.bgColor ?? '#F8F8F6'}CC)`,
                }}
              />
            </div>
          )}

          {/* Foreground content */}
          <div className="relative px-4 pt-[3.75rem] pb-5" style={{ zIndex: 1 }}>
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
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium opacity-50" style={{ color: deck?.textColor }}>
                  {currentIndex + 1} / {deckCards.length}
                </span>
                {/* Notes button */}
                <button
                  onClick={() => setShowNotes(true)}
                  className="p-2 rounded-xl transition-all hover:scale-110 active:scale-90 relative"
                  style={{ backgroundColor: deck?.color + '20' }}
                  title="My notes"
                >
                  <StickyNote size={14} style={{ color: hasNote(card.id) ? deck?.color : deck?.textColor, opacity: hasNote(card.id) ? 1 : 0.6 }} />
                  {hasNote(card.id) && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: deck?.color }}
                    />
                  )}
                </button>
                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl transition-all hover:scale-110 active:scale-90"
                  style={{ backgroundColor: deck?.color + '20' }}
                  title="Share"
                >
                  <Share2 size={14} style={{ color: deck?.textColor, opacity: 0.7 }} />
                </button>
                {/* Bookmark button */}
                <button
                  onClick={() => toggleBookmark(card.id)}
                  className="p-2 rounded-xl transition-all hover:scale-110 active:scale-90"
                  style={{ backgroundColor: deck?.color + '20' }}
                >
                  {bookmarked
                    ? <BookmarkCheck size={16} className="text-rose-500" />
                    : <Bookmark size={16} style={{ color: deck?.textColor, opacity: 0.7 }} />
                  }
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
              {/* Read indicator */}
              <span
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
              >
                <Zap size={8} />
                {readCount}/{deckCards.length} read
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
              style={{ fontFamily: 'Sora, sans-serif', color: deck?.textColor, maxWidth: '68%' }}
            >
              {card.title}
            </h1>

            {/* Tagline */}
            <p className="text-sm leading-relaxed" style={{ color: deck?.textColor, opacity: 0.7, maxWidth: '68%' }}>
              {card.tagline}
            </p>

            {/* Deck progress bar */}
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold" style={{ color: deck?.textColor, opacity: 0.45 }}>
                  Deck progress
                </span>
                <span className="text-[9px] font-bold" style={{ color: deck?.color }}>
                  {deckPct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${deckPct}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ backgroundColor: deck?.color }}
                />
              </div>
            </div>
          </div>
        </div>{/* end desktop centering wrapper */}
        </div>
      </motion.div>

      {/* Swipe hint */}
      <AnimatePresence>
        {swipeHint && (prevCard || nextCard) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-1.5 py-1.5"
          >
            {prevCard && <ChevronLeft size={12} className="text-stone-300" />}
            <span className="text-[10px] text-stone-300 font-medium">swipe to navigate</span>
            {nextCard && <ChevronRight size={12} className="text-stone-300" />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tab Bar ── */}
      <div className="sticky top-0 z-30 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 pt-2 pb-0">
            {(['overview', 'template'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold capitalize transition-all"
                style={{
                  color: activeTab === tab ? (deck?.color ?? '#0284C7') : '#a8a29e',
                }}
              >
                {tab === 'template' && <FileText size={11} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'template' && template && (
                  <span
                    className="text-[8px] font-bold px-1 py-0.5 rounded-full"
                    style={{ backgroundColor: (deck?.color ?? '#0284C7') + '20', color: deck?.color ?? '#0284C7' }}
                  >
                    {template.sections.length}
                  </span>
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: deck?.color ?? '#0284C7' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id + '-' + activeTab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28 }}
          className="max-w-2xl mx-auto px-4 pt-4 space-y-3"
        >
          {/* ── TEMPLATE TAB ── */}
          {activeTab === 'template' && (
            <>
              {template ? (
                <div className="space-y-4">
                  {/* Header */}
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: (deck?.color ?? '#0284C7') + '10', border: `1.5px solid ${deck?.color ?? '#0284C7'}25` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileText size={12} style={{ color: deck?.color }} />
                          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: deck?.color }}>Working Template</span>
                        </div>
                        <h2 className="text-[14px] font-bold text-stone-800 leading-tight mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {template.title}
                        </h2>
                        <p className="text-[11px] text-stone-500 leading-relaxed">{template.description}</p>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleCopyTemplate}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: deck?.color ?? '#0284C7' }}
                      >
                        {copied ? <Check size={11} /> : <Copy size={11} />}
                        {copied ? 'Copied!' : 'Copy as Markdown'}
                      </button>
                      <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: (deck?.color ?? '#0284C7') + '15', color: deck?.color ?? '#0284C7' }}
                      >
                        <Download size={11} />
                        Download .md
                      </button>
                    </div>
                  </div>

                  {/* Template sections */}
                  {template.sections.map((section, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div
                        className="px-4 py-2.5 flex items-center gap-2"
                        style={{ backgroundColor: (deck?.color ?? '#0284C7') + '08', borderBottom: `1px solid ${deck?.color ?? '#0284C7'}15` }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: deck?.color ?? '#0284C7' }}
                        />
                        <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{section.heading}</span>
                      </div>
                      <div className="p-4 overflow-x-auto">
                        <pre
                          className="text-[11px] text-stone-600 leading-relaxed whitespace-pre-wrap font-mono"
                          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                        >
                          {section.content}
                        </pre>
                      </div>
                    </div>
                  ))}

                  {/* Usage tip */}
                  <div
                    className="rounded-2xl p-3.5 flex items-start gap-2.5"
                    style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}
                  >
                    <Lightbulb size={13} className="shrink-0 mt-0.5 text-amber-600" />
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      <strong>How to use:</strong> Copy this template into Excel, Notion, Confluence, or any Markdown editor. Replace the example rows with your project data. The column headers are designed to be immediately usable.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText size={32} className="text-stone-200 mb-3" />
                  <p className="text-sm font-semibold text-stone-400">Template coming soon</p>
                  <p className="text-[11px] text-stone-300 mt-1">A working template for this card is being prepared.</p>
                </div>
              )}
            </>
          )}

          {/* ── OVERVIEW TAB content (existing) ── */}
          {activeTab === 'overview' && (
            <>

          {/* My note (if exists) */}
          {hasNote(card.id) && (
            <button
              onClick={() => setShowNotes(true)}
              className="w-full text-left rounded-2xl p-3.5 flex items-start gap-2.5 transition-all hover:opacity-90"
              style={{
                backgroundColor: (deck?.color ?? '#475569') + '10',
                border: `1.5px dashed ${deck?.color ?? '#475569'}40`,
              }}
            >
              <StickyNote size={14} className="shrink-0 mt-0.5" style={{ color: deck?.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: deck?.color }}>
                  My Note
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">{getNote(card.id)}</p>
              </div>
              <span className="text-[10px] text-stone-400 shrink-0">Edit</span>
            </button>
          )}

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
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: deck?.color }}>
                    Pro Tip
                  </span>
                  <p className="text-sm text-stone-700 leading-relaxed mt-0.5">{card.proTip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Visual Reference Diagram */}
          {(() => {
            const diagram = getVisualReference(card.id);
            if (!diagram) return null;
            return (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: (deck?.color ?? '#6B7280') + '20' }}
                  >
                    <Cpu size={11} style={{ color: deck?.color ?? '#6B7280' }} />
                  </div>
                  <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Visual Reference</h3>
                </div>
                {diagram}
              </div>
            );
          })()}

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

          {/* Related Cards — with preview popovers */}
          {relatedCards.length > 0 && (
            <div className="pb-2">
              <div className="flex items-center gap-2 mb-2.5">
                <Link2 size={11} className="text-stone-400" />
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Related Cards
                </span>
                <span className="text-[9px] text-stone-300 font-medium">(tap to preview)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedCards.map(related => (
                  <RelatedCardChip
                    key={related.id}
                    related={related}
                    onNavigate={() => navigate(`/card/${related.id}`)}
                  />
                ))}
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
              style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}
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

          {/* General disclaimer */}
          <div className="pb-2">
            <p className="text-[9px] text-stone-400 leading-relaxed text-center px-2">
              {GENERAL_DISCLAIMER}
            </p>
          </div>

            </>
          )}{/* end overview tab */}

        </motion.div>
      </AnimatePresence>

      <BottomNav />

      {/* Social share sheet */}
      <ShareSheet
        open={showShare}
        onClose={() => setShowShare(false)}
        url={window.location.href}
        title={card.title}
        tagline={card.tagline}
      />
    </div>
  );
}
