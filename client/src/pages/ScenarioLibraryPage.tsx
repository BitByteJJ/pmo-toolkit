// StratAlign — Scenario Library Page
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Lightbulb, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { SCENARIOS, Scenario } from '@/lib/scenarioData';
import { CARDS, getDeckById } from '@/lib/pmoData';
import { LEVEL_COLORS } from '@/lib/cardLevels';

function CardChip({ cardId }: { cardId: string }) {
  const [, navigate] = useLocation();
  const card = CARDS.find(c => c.id === cardId || c.code === cardId);
  const deck = card ? getDeckById(card.deckId) : null;
  if (!card || !deck) return null;
  return (
    <button
      onClick={() => navigate(`/card/${card.id}`)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 active:scale-95"
      style={{ backgroundColor: deck.bgColor, color: deck.color, border: `1px solid ${deck.color}25` }}
    >
      <span className="font-mono">{card.code}</span>
      <span className="max-w-[110px] truncate">{card.title}</span>
      <ExternalLink size={9} />
    </button>
  );
}

function DifficultyBadge({ level }: { level: Scenario['difficulty'] }) {
  const colors = LEVEL_COLORS[level.toLowerCase() as keyof typeof LEVEL_COLORS];
  return (
    <span
      className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {level}
    </span>
  );
}

function ScenarioCard({ scenario, onClick }: { scenario: Scenario; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden bg-white"
      style={{ boxShadow: `0 2px 8px ${scenario.color}18, 0 1px 3px rgba(0,0,0,0.06)` }}
    >
      <div className="h-1" style={{ backgroundColor: scenario.color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{scenario.icon}</span>
            <DifficultyBadge level={scenario.difficulty} />
          </div>
          <ChevronRight size={14} className="text-stone-300 shrink-0 mt-1" />
        </div>
        <h3
          className="text-sm font-black text-stone-900 leading-tight mb-1"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {scenario.title}
        </h3>
        <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">{scenario.description}</p>
        <div className="flex items-center gap-1 mt-3">
          <span className="text-[10px] text-stone-400 font-medium">{scenario.cardIds.length} cards</span>
          <span className="text-stone-200">·</span>
          <span className="text-[10px] font-bold" style={{ color: scenario.color }}>{scenario.subtitle}</span>
        </div>
      </div>
    </motion.button>
  );
}

function ScenarioDetail({ scenario, onClose }: { scenario: Scenario; onClose: () => void }) {
  const [, navigate] = useLocation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#F7F5F0' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(247,245,240,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button onClick={onClose} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
          <ChevronLeft size={16} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <DifficultyBadge level={scenario.difficulty} />
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-2xl mx-auto w-full">
        {/* Hero */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: `linear-gradient(135deg, ${scenario.color}15 0%, ${scenario.color}08 100%)`, border: `1px solid ${scenario.color}20` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{scenario.icon}</span>
            <div>
              <h1
                className="text-lg font-black text-stone-900 leading-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {scenario.title}
              </h1>
              <p className="text-xs font-semibold" style={{ color: scenario.color }}>{scenario.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">{scenario.context}</p>
        </div>

        {/* Recommended cards */}
        <div className="mb-5">
          <h2 className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-3">
            📚 Recommended cards for this scenario
          </h2>
          <div className="flex flex-wrap gap-2">
            {scenario.cardIds.map(id => <CardChip key={id} cardId={id} />)}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-5">
          <h2 className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-3">
            💡 Practical tips
          </h2>
          <div className="space-y-2.5">
            {scenario.tips.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 px-4 py-3 rounded-2xl bg-white"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-white"
                  style={{ backgroundColor: scenario.color }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Coach CTA */}
        <button
          onClick={() => navigate('/ai-coach')}
          className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 100%)' }}
        >
          <Lightbulb size={15} />
          Get personalised advice from AI Coach
        </button>
      </div>
    </motion.div>
  );
}

export default function ScenarioLibraryPage() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const filtered = activeFilter === 'All'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.difficulty === activeFilter);

  const filters: Array<'All' | 'Beginner' | 'Intermediate' | 'Advanced'> = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const filterColors: Record<string, string> = {
    All: '#1c1917',
    Beginner: '#059669',
    Intermediate: '#D97706',
    Advanced: '#E11D48',
  };

  return (
    <>
      <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
        {/* Header */}
        <div
          className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(247,245,240,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} />
            <span className="text-sm font-semibold">Back</span>
          </button>
          <span className="text-sm font-bold text-stone-800">Scenario Library</span>
          <div className="w-16" />
        </div>

        <div className="px-4 py-4 max-w-2xl mx-auto w-full">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1
              className="text-xl font-black text-stone-900 mb-1"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Scenario Library
            </h1>
            <p className="text-sm text-stone-500">
              Pre-built card packs for common project situations. Pick your scenario to get the right tools instantly.
            </p>
          </motion.div>

          {/* Filter pills */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  backgroundColor: activeFilter === f ? filterColors[f] : '#ffffff',
                  color: activeFilter === f ? '#ffffff' : '#78716c',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                {f} {f !== 'All' && `(${SCENARIOS.filter(s => s.difficulty === f).length})`}
              </button>
            ))}
          </div>

          {/* Scenario grid */}
          <div className="space-y-3">
            {filtered.map((scenario, i) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ScenarioCard scenario={scenario} onClick={() => setSelectedScenario(scenario)} />
              </motion.div>
            ))}
          </div>
        </div>

        <BottomNav />
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selectedScenario && (
          <ScenarioDetail scenario={selectedScenario} onClose={() => setSelectedScenario(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
