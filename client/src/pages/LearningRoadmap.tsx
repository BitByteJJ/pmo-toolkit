// client/src/pages/LearningRoadmap.tsx
// Learning Journey Roadmap — curated paths for Beginner, Intermediate, Advanced

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Trophy, Zap, CheckCircle2, Circle, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { LEARNING_JOURNEYS, type JourneyLevel, type LearningJourney } from '@/lib/learningJourneys';
import { getCardById } from '@/lib/pmoData';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── Level Selector Card ──────────────────────────────────────────────────────

function LevelCard({
  journey,
  selected,
  onSelect,
}: {
  journey: LearningJourney;
  selected: boolean;
  onSelect: () => void;
}) {
  const totalCards = journey.sections.reduce((sum, s) => sum + s.steps.length, 0);

  return (
    <motion.button
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.975 }}
      onClick={onSelect}
      className="relative w-full text-left rounded-2xl overflow-hidden transition-all"
      style={{
        /* Frosted glass base */
        background: selected
          ? `linear-gradient(135deg, ${journey.color}28 0%, ${journey.color}10 100%)`
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
        border: `1.5px solid ${selected ? journey.color + '55' : 'rgba(255,255,255,0.09)'}`,
        boxShadow: selected
          ? `0 0 0 1px ${journey.color}22, 0 8px 24px ${journey.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Subtle accent glow strip at top when selected */}
      {selected && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${journey.color}80, transparent)` }}
        />
      )}

      <div className="p-4 flex items-start gap-3">
        {/* Emoji badge */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 relative"
          style={{
            background: selected
              ? `linear-gradient(135deg, ${journey.color}40, ${journey.color}20)`
              : `${journey.color}18`,
            border: `1px solid ${journey.color}30`,
            boxShadow: selected ? `0 4px 12px ${journey.color}30` : 'none',
          }}
        >
          {journey.emoji}
          {selected && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: journey.color }}
            >
              <Sparkles size={8} className="text-white" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div
            className="text-[9px] font-black uppercase tracking-[0.12em] mb-0.5"
            style={{ color: selected ? journey.color : journey.color + 'bb' }}
          >
            {journey.subtitle}
          </div>
          <h3
            className="text-[15px] font-black leading-tight mb-1.5"
            style={{
              fontFamily: 'Sora, sans-serif',
              color: selected ? '#f1f5f9' : '#cbd5e1',
            }}
          >
            {journey.title}
          </h3>
          {/* Pill stats */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: `${journey.color}22`,
                color: journey.color,
                border: `1px solid ${journey.color}30`,
              }}
            >
              {totalCards} cards
            </span>
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              ~{journey.totalWeeks} weeks
            </span>
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {journey.sections.length} sections
            </span>
          </div>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: selected ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 mt-1"
        >
          <ChevronDown
            size={16}
            style={{ color: selected ? journey.color : 'rgba(255,255,255,0.25)' }}
          />
        </motion.div>
      </div>
    </motion.button>
  );
}

// ─── Roadmap Step ─────────────────────────────────────────────────────────────

function RoadmapStep({
  step,
  index,
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
          className="absolute left-[19px] top-[40px] w-0.5"
          style={{
            background: isRead
              ? `linear-gradient(to bottom, ${journey.color}60, ${journey.color}20)`
              : 'rgba(255,255,255,0.08)',
            height: 'calc(100% - 8px)',
          }}
        />
      )}

      <div className="flex gap-3 pb-3">
        {/* Step indicator */}
        <div className="relative shrink-0 mt-1">
          {isRead ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${journey.color}, ${journey.color}cc)`,
                boxShadow: `0 0 10px ${journey.color}50`,
              }}
            >
              <CheckCircle2 size={16} className="text-white" />
            </motion.div>
          ) : isLocked ? (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.08)',
              }}
            >
              <Lock size={13} className="text-slate-600" />
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border-2"
              style={{
                borderColor: journey.color,
                background: `${journey.color}12`,
                boxShadow: `0 0 8px ${journey.color}30`,
              }}
            >
              <Circle size={9} style={{ color: journey.color }} />
            </div>
          )}
        </div>

        {/* Card content — frosted glass */}
        <motion.button
          whileHover={!isLocked ? { x: 2, boxShadow: `0 4px 16px ${journey.color}20` } : {}}
          whileTap={!isLocked ? { scale: 0.98 } : {}}
          onClick={() => !isLocked && onNavigate(step.cardId)}
          className="flex-1 text-left rounded-2xl p-3 transition-all"
          style={{
            background: isRead
              ? `linear-gradient(135deg, ${journey.color}12, ${journey.color}06)`
              : isLocked
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1.5px solid ${
              isRead
                ? journey.color + '35'
                : isLocked
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.10)'
            }`,
            boxShadow: isRead
              ? `inset 0 1px 0 ${journey.color}20`
              : isLocked
              ? 'none'
              : 'inset 0 1px 0 rgba(255,255,255,0.06)',
            opacity: isLocked ? 0.45 : 1,
            cursor: isLocked ? 'default' : 'pointer',
          }}
        >
          {/* Milestone badge */}
          {step.milestone && (
            <div
              className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg w-fit"
              style={{
                background: `${journey.color}18`,
                border: `1px solid ${journey.color}30`,
              }}
            >
              <Trophy size={9} style={{ color: journey.color }} />
              <span
                className="text-[8px] font-black uppercase tracking-widest"
                style={{ color: journey.color }}
              >
                {step.milestone}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                  style={{
                    background: `${journey.color}20`,
                    color: journey.color,
                    border: `1px solid ${journey.color}30`,
                  }}
                >
                  {card.code ?? card.id.toUpperCase()}
                </span>
                {isRead && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{
                      background: 'rgba(52,211,153,0.12)',
                      color: '#34d399',
                      border: '1px solid rgba(52,211,153,0.25)',
                    }}
                  >
                    ✓ Read
                  </span>
                )}
              </div>
              <h4
                className="text-[13px] font-bold leading-tight mb-1"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  color: isLocked ? '#475569' : isRead ? '#f1f5f9' : '#e2e8f0',
                }}
              >
                {card.title}
              </h4>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: isLocked ? '#334155' : '#7c8fa8' }}
              >
                {step.rationale}
              </p>
            </div>
            {!isLocked && (
              <ArrowRight
                size={13}
                className="shrink-0 mt-1"
                style={{ color: isRead ? journey.color + '80' : journey.color + '50' }}
              />
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

  const allSteps = journey.sections.flatMap(s => s.steps);
  const totalSteps = allSteps.length;
  const completedSteps = allSteps.filter(s => isRead(s.cardId)).length;
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

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
    <div className="space-y-5 pb-8">
      {/* Progress card — frosted */}
      <div
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${journey.color}18, ${journey.color}08)`,
          backdropFilter: 'blur(20px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1.5px solid ${journey.color}30`,
          boxShadow: `inset 0 1px 0 ${journey.color}20`,
        }}
      >
        {/* Decorative glow blob */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
          style={{ background: journey.color + '20' }}
        />
        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{journey.emoji}</span>
            <div>
              <div
                className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                style={{ color: journey.color }}
              >
                Your Progress
              </div>
              <div
                className="text-[14px] font-black text-slate-100"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {completedSteps} of {totalSteps} cards read
              </div>
            </div>
          </div>
          <div
            className="text-[26px] font-black tabular-nums"
            style={{ fontFamily: 'Sora, sans-serif', color: journey.color }}
          >
            {progressPct}%
          </div>
        </div>
        <div
          className="h-2.5 rounded-full overflow-hidden"
          style={{ background: `${journey.color}18` }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(90deg, ${journey.color}cc, ${journey.color})`,
              boxShadow: `0 0 8px ${journey.color}60`,
            }}
          />
        </div>
      </div>

      {/* Sections */}
      {journey.sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Section header — frosted pill */}
          <div
            className="flex items-center gap-2.5 mb-3 px-3 py-2.5 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${section.color}18, ${section.color}08)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: `1px solid ${section.color}30`,
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${section.color}, ${section.color}cc)`,
                boxShadow: `0 2px 8px ${section.color}40`,
              }}
            >
              <MapPin size={12} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[12px] font-black leading-tight"
                style={{ fontFamily: 'Sora, sans-serif', color: '#f1f5f9' }}
              >
                {section.title}
              </div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {section.description}
              </div>
            </div>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              style={{
                background: `${section.color}20`,
                color: section.color,
                border: `1px solid ${section.color}30`,
              }}
            >
              {section.steps.length}
            </span>
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
          className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${journey.color}, ${journey.color}cc)`,
            boxShadow: `0 8px 32px ${journey.color}40`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)',
            }}
          />
          <div className="text-4xl mb-2 relative">🎉</div>
          <h3 className="text-lg font-black mb-1 text-white relative" style={{ fontFamily: 'Sora, sans-serif' }}>
            Journey Complete!
          </h3>
          <p className="text-[12px] text-white/80 relative">
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
  const { isDark } = useTheme();
  const selectedJourney = selectedLevel
    ? LEARNING_JOURNEYS.find(j => j.level === selectedLevel)
    : null;

  return (
    <div
      className="min-h-screen pt-12 pb-28"
      style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-12 z-20 px-4"
        style={{
          background: isDark ? 'rgba(10,22,40,0.92)' : 'rgba(241,245,249,0.92)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        }}
      >
        <div className="max-w-lg mx-auto py-3 flex items-center justify-between">
          <div>
            <h1
              className="text-[18px] font-black text-slate-100 leading-tight"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Learning Roadmap
            </h1>
            <p className="text-[11px] text-muted-foreground font-medium">
              Curated paths for every stage of your PM career
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            <Zap size={16} className="text-violet-400" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Level selector */}
        <div className="space-y-3 mb-6">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em] px-1">
            Choose your level
          </p>
          {LEARNING_JOURNEYS.map(journey => (
            <LevelCard
              key={journey.level}
              journey={journey}
              selected={selectedLevel === journey.level}
              onSelect={() =>
                setSelectedLevel(selectedLevel === journey.level ? null : journey.level)
              }
            />
          ))}
        </div>

        {/* Roadmap content */}
        <AnimatePresence mode="wait">
          {selectedJourney && (
            <motion.div
              key={selectedJourney.level}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <div className="mb-4 px-1">
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  {selectedJourney.description}
                </p>
              </div>
              <JourneyRoadmap journey={selectedJourney} />
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <div className="text-5xl mb-3">🗺️</div>
            <p className="text-[13px] text-muted-foreground font-medium">
              Select a level above to see your personalised roadmap
            </p>
          </motion.div>
        )}
      </div>
      <PageFooter />
    </div>
  );
}
