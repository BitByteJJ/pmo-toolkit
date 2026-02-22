// client/src/pages/LearningRoadmap.tsx
// Learning Journey Roadmap — curated paths for Beginner, Intermediate, Advanced

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Trophy, Zap, CheckCircle2, Circle, Lock, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { LEARNING_JOURNEYS, type JourneyLevel, type LearningJourney } from '@/lib/learningJourneys';
import { getCardById } from '@/lib/pmoData';
import { useCardProgress } from '@/hooks/useCardProgress';

// ─── Level Selector ───────────────────────────────────────────────────────────

function LevelCard({
  journey,
  selected,
  onSelect,
}: {
  journey: LearningJourney;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="relative w-full text-left rounded-2xl p-4 transition-all overflow-hidden"
      style={{
        backgroundColor: selected ? journey.color : journey.bgColor,
        border: `2px solid ${selected ? journey.color : journey.color + '30'}`,
        boxShadow: selected ? `0 4px 16px ${journey.color}30` : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: selected ? 'rgba(255,255,255,0.2)' : journey.color + '20' }}
        >
          {journey.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[9px] font-bold uppercase tracking-widest mb-0.5"
            style={{ color: selected ? 'rgba(255,255,255,0.7)' : journey.color }}
          >
            {journey.subtitle}
          </div>
          <h3
            className="text-[15px] font-black leading-tight mb-1"
            style={{
              fontFamily: 'Sora, sans-serif',
              color: selected ? '#fff' : journey.textColor,
            }}
          >
            {journey.title}
          </h3>
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-semibold"
              style={{ color: selected ? 'rgba(255,255,255,0.7)' : journey.color }}
            >
              {journey.sections.reduce((sum, s) => sum + s.steps.length, 0)} cards
            </span>
            <span
              className="text-[10px] font-semibold"
              style={{ color: selected ? 'rgba(255,255,255,0.7)' : journey.textColor, opacity: 0.6 }}
            >
              ~{journey.totalWeeks} weeks
            </span>
          </div>
        </div>
        <ChevronRight
          size={16}
          style={{ color: selected ? 'rgba(255,255,255,0.6)' : journey.color + '60' }}
          className="shrink-0 mt-1"
        />
      </div>
    </motion.button>
  );
}

// ─── Roadmap Step ─────────────────────────────────────────────────────────────

function RoadmapStep({
  step,
  index,
  sectionIndex,
  totalInSection,
  journey,
  isRead,
  isLocked,
  onNavigate,
}: {
  step: { cardId: string; rationale: string; milestone?: string };
  index: number;
  sectionIndex: number;
  totalInSection: number;
  journey: LearningJourney;
  isRead: boolean;
  isLocked: boolean;
  onNavigate: (cardId: string) => void;
}) {
  const card = getCardById(step.cardId);
  const isLast = index === totalInSection - 1;

  if (!card) return null;

  return (
    <div className="relative">
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[19px] top-[40px] w-0.5 bottom-0"
          style={{
            backgroundColor: isRead ? journey.color + '40' : '#E7E5E4',
            height: 'calc(100% - 8px)',
          }}
        />
      )}

      <div className="flex gap-3 pb-3">
        {/* Step indicator */}
        <div className="relative shrink-0 mt-1">
          {isRead ? (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: journey.color }}
            >
              <CheckCircle2 size={16} className="text-white" />
            </div>
          ) : isLocked ? (
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100">
              <Lock size={14} className="text-stone-300" />
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border-2"
              style={{ borderColor: journey.color, backgroundColor: journey.bgColor }}
            >
              <Circle size={10} style={{ color: journey.color }} />
            </div>
          )}
        </div>

        {/* Card content */}
        <motion.button
          whileHover={!isLocked ? { x: 2 } : {}}
          whileTap={!isLocked ? { scale: 0.98 } : {}}
          onClick={() => !isLocked && onNavigate(step.cardId)}
          className="flex-1 text-left rounded-2xl p-3 transition-all"
          style={{
            backgroundColor: isRead ? journey.color + '08' : isLocked ? '#FAFAF8' : '#fff',
            border: `1.5px solid ${isRead ? journey.color + '25' : isLocked ? '#E7E5E4' : '#F5F5F4'}`,
            boxShadow: isLocked ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
            opacity: isLocked ? 0.5 : 1,
            cursor: isLocked ? 'default' : 'pointer',
          }}
        >
          {/* Milestone badge */}
          {step.milestone && (
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy size={10} style={{ color: journey.color }} />
              <span
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: journey.color }}
              >
                {step.milestone}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: journey.color + '15',
                    color: journey.color,
                  }}
                >
                  {card.code ?? card.id.toUpperCase()}
                </span>
                {isRead && (
                  <span className="text-[9px] font-bold text-emerald-600">✓ Read</span>
                )}
              </div>
              <h4
                className="text-[13px] font-bold leading-tight mb-1"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  color: isLocked ? '#A8A29E' : '#1C1917',
                }}
              >
                {card.title}
              </h4>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: isLocked ? '#D6D3D1' : '#78716C' }}
              >
                {step.rationale}
              </p>
            </div>
            {!isLocked && (
              <ArrowRight size={13} className="shrink-0 mt-1" style={{ color: journey.color + '60' }} />
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}

// ─── Journey Roadmap ─────────────────────────────────────────────────────────

function JourneyRoadmap({ journey }: { journey: LearningJourney }) {
  const [, navigate] = useLocation();
  const { isRead } = useCardProgress();

  // Compute which steps are read
  const allSteps = journey.sections.flatMap(s => s.steps);
  const readSteps = new Set(allSteps.map(s => s.cardId).filter(id => isRead(id)));
  const totalSteps = allSteps.length;
  const completedSteps = readSteps.size;
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  // Determine locked steps: a step is locked if the previous step hasn't been read
  // (only lock steps after the first unread one)
  let foundUnread = false;
  const lockedSet = new Set<string>();
  for (const step of allSteps) {
    if (foundUnread) {
      lockedSet.add(step.cardId);
    } else if (!isRead(step.cardId)) {
      foundUnread = true;
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Progress bar */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: journey.color + '10', border: `1.5px solid ${journey.color}25` }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{journey.emoji}</span>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: journey.color }}>
                Your Progress
              </div>
              <div className="text-[13px] font-black" style={{ fontFamily: 'Sora, sans-serif', color: journey.textColor }}>
                {completedSteps} of {totalSteps} cards read
              </div>
            </div>
          </div>
          <div
            className="text-[22px] font-black"
            style={{ fontFamily: 'Sora, sans-serif', color: journey.color }}
          >
            {progressPct}%
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: journey.color + '20' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ backgroundColor: journey.color }}
          />
        </div>
      </div>

      {/* Sections */}
      {journey.sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Section header */}
          <div className="flex items-center gap-2 mb-3 px-1">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: section.color }}
            >
              <MapPin size={11} className="text-white" />
            </div>
            <div>
              <div className="text-[11px] font-black text-stone-800" style={{ fontFamily: 'Sora, sans-serif' }}>
                {section.title}
              </div>
              <div className="text-[10px] text-stone-400">{section.description}</div>
            </div>
          </div>

          {/* Steps */}
          <div className="pl-1">
            {section.steps.map((step, stepIdx) => (
              <RoadmapStep
                key={step.cardId}
                step={step}
                index={stepIdx}
                sectionIndex={sectionIdx}
                totalInSection={section.steps.length}
                journey={{ ...journey, color: section.color }}
                isRead={isRead(step.cardId)}
                isLocked={lockedSet.has(step.cardId)}
                onNavigate={(id) => navigate(`/card/${id}?from=roadmap`)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Completion message */}
      {progressPct === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6 text-center"
          style={{ backgroundColor: journey.color, color: '#fff' }}
        >
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-black mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            Journey Complete!
          </h3>
          <p className="text-[12px] opacity-80">
            You've completed the {journey.title} path. Explore the next level to keep growing.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LearningRoadmap() {
  const [selectedLevel, setSelectedLevel] = useState<JourneyLevel | null>(null);
  const selectedJourney = selectedLevel
    ? LEARNING_JOURNEYS.find(j => j.level === selectedLevel)
    : null;

  return (
    <div className="min-h-screen pt-11 pb-24" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Header */}
      <div
        className="sticky top-11 z-20 px-4"
        style={{ backgroundColor: '#FAFAF8', borderBottom: '1px solid #F5F5F4' }}
      >
        <div className="max-w-2xl mx-auto py-3 flex items-center justify-between">
          <div>
            <h1
              className="text-[18px] font-black text-stone-900 leading-tight"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Learning Roadmap
            </h1>
            <p className="text-[11px] text-stone-400 font-medium">
              Curated paths for every stage of your PM career
            </p>
          </div>
          <Zap size={20} className="text-stone-300" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Level selector */}
        <div className="space-y-3 mb-6">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-1">
            Choose your level
          </p>
          {LEARNING_JOURNEYS.map(journey => (
            <LevelCard
              key={journey.level}
              journey={journey}
              selected={selectedLevel === journey.level}
              onSelect={() => setSelectedLevel(
                selectedLevel === journey.level ? null : journey.level
              )}
            />
          ))}
        </div>

        {/* Roadmap */}
        <AnimatePresence mode="wait">
          {selectedJourney && (
            <motion.div
              key={selectedJourney.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Journey description */}
              <div className="mb-5 px-1">
                <p className="text-[13px] text-stone-600 leading-relaxed">
                  {selectedJourney.description}
                </p>
              </div>

              <JourneyRoadmap journey={selectedJourney} />
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedLevel && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-[13px] text-stone-400 font-medium">
              Select a level above to see your personalised roadmap
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
