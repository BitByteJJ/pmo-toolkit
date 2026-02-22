// client/src/lib/learningJourneys.ts
// Curated learning journey paths for three experience levels

export type JourneyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface JourneyMilestone {
  /** Card ID from pmoData */
  cardId: string;
  /** Short description of why this card is at this point in the journey */
  rationale: string;
  /** Optional milestone marker — marks a key achievement point */
  milestone?: string;
}

export interface JourneySection {
  title: string;
  description: string;
  color: string;
  steps: JourneyMilestone[];
}

export interface LearningJourney {
  level: JourneyLevel;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
  textColor: string;
  totalWeeks: number;
  sections: JourneySection[];
}

export const LEARNING_JOURNEYS: LearningJourney[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER — New to project management, learning the fundamentals
  // ─────────────────────────────────────────────────────────────────────────
  {
    level: 'beginner',
    title: 'First Project',
    subtitle: 'New to Project Management',
    description: 'You\'ve just been handed your first project. This path takes you from "what even is a project?" to confidently running your first delivery — covering the essential tools every PM needs from day one.',
    emoji: '🌱',
    color: '#059669',
    bgColor: '#ECFDF5',
    textColor: '#064E3B',
    totalWeeks: 8,
    sections: [
      {
        title: 'Understand the Landscape',
        description: 'Get oriented — what is a project, who\'s involved, and how does it work?',
        color: '#059669',
        steps: [
          { cardId: 'phase-setup', rationale: 'Start here — understand what project setup means before you touch anything else.', milestone: 'Start Here' },
          { cardId: 'M1', rationale: 'Learn the most common delivery approach: Waterfall. Most organisations still use it.' },
          { cardId: 'T16', rationale: 'Identify who cares about your project and why — this shapes everything.' },
          { cardId: 'T5', rationale: 'Clarify who does what. Confusion about roles kills projects early.', milestone: 'Foundation Built' },
        ],
      },
      {
        title: 'Plan Before You Build',
        description: 'Learn the planning tools that prevent chaos before it starts.',
        color: '#0284C7',
        steps: [
          { cardId: 'T14', rationale: 'Define exactly what\'s in and out of scope — this is your project\'s contract.' },
          { cardId: 'T3', rationale: 'Break the work into manageable chunks so nothing gets missed.' },
          { cardId: 'T1', rationale: 'Build your first Gantt chart to visualise the schedule and dependencies.' },
          { cardId: 'T6', rationale: 'Start tracking risks before they become problems.', milestone: 'Plan Complete' },
        ],
      },
      {
        title: 'Deliver & Track',
        description: 'Run your project day-to-day and keep it on track.',
        color: '#D97706',
        steps: [
          { cardId: 'phase-execution', rationale: 'Understand what execution really means — it\'s more than just doing the work.' },
          { cardId: 'process-2', rationale: 'Keep stakeholders informed with a structured communication approach.' },
          { cardId: 'process-10', rationale: 'Handle change requests without letting scope creep derail you.' },
          { cardId: 'T7', rationale: 'When things get tight, use MoSCoW to prioritise what must be delivered.', milestone: 'Delivery Confident' },
        ],
      },
      {
        title: 'Close & Learn',
        description: 'Finish the project properly and capture what you\'ve learned.',
        color: '#7C3AED',
        steps: [
          { cardId: 'phase-closure', rationale: 'Learn how to close a project properly — it\'s not just stopping work.' },
          { cardId: 'A25', rationale: 'Run a post-implementation review to measure success and capture lessons.', milestone: '🎓 First Project Complete!' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE — Running projects, wants to level up
  // ─────────────────────────────────────────────────────────────────────────
  {
    level: 'intermediate',
    title: 'Levelling Up',
    subtitle: 'Experienced PM, Ready to Go Deeper',
    description: 'You\'ve delivered projects and know the basics. Now it\'s time to sharpen your toolkit — better risk management, stakeholder influence, Agile fluency, and the techniques that separate good PMs from great ones.',
    emoji: '🚀',
    color: '#0284C7',
    bgColor: '#EFF6FF',
    textColor: '#1E3A5F',
    totalWeeks: 10,
    sections: [
      {
        title: 'Sharpen Your Risk Game',
        description: 'Move beyond basic risk registers to sophisticated risk thinking.',
        color: '#DC2626',
        steps: [
          { cardId: 'A14', rationale: 'Go beyond gut feel — assign numbers to risks for objective prioritisation.', milestone: 'Risk Mastery Begins' },
          { cardId: 'T9', rationale: 'Use Monte Carlo simulation to model schedule and cost uncertainty.' },
          { cardId: 'T10', rationale: 'Use decision trees to evaluate complex choices with uncertain outcomes.' },
          { cardId: 'A27', rationale: 'Prepare for multiple futures with scenario planning.', milestone: 'Risk Expert' },
        ],
      },
      {
        title: 'Master Agile & Hybrid',
        description: 'Become fluent in Agile and know when to blend it with Waterfall.',
        color: '#059669',
        steps: [
          { cardId: 'M2', rationale: 'Deepen your Agile understanding beyond the basics.' },
          { cardId: 'T17', rationale: 'Use burndown charts to track sprint progress and forecast completion.' },
          { cardId: 'A33', rationale: 'Prioritise your backlog using WSJF — value per unit of effort.' },
          { cardId: 'M4', rationale: 'Learn when and how to blend Agile and Waterfall for complex programmes.', milestone: 'Agile Fluent' },
        ],
      },
      {
        title: 'Influence Stakeholders',
        description: 'Move from managing stakeholders to genuinely influencing them.',
        color: '#7C3AED',
        steps: [
          { cardId: 'A15', rationale: 'Track and actively shift stakeholder engagement levels.' },
          { cardId: 'A9', rationale: 'Use co-creation workshops to build shared ownership of solutions.' },
          { cardId: 'A1', rationale: 'Negotiate effectively using principled negotiation — focus on interests, not positions.' },
          { cardId: 'A8', rationale: 'Know your walk-away point before any significant negotiation.', milestone: 'Stakeholder Influencer' },
        ],
      },
      {
        title: 'Performance & Delivery',
        description: 'Measure and improve project performance with precision.',
        color: '#D97706',
        steps: [
          { cardId: 'T4', rationale: 'Use Earned Value Management to objectively measure project performance.' },
          { cardId: 'A34', rationale: 'Map your value stream to find and eliminate waste in your delivery process.' },
          { cardId: 'A26', rationale: 'Ensure the benefits your project promised are actually being realised.', milestone: '🏆 Senior PM Ready' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED — Senior PM / PMO Lead, strategic and organisational focus
  // ─────────────────────────────────────────────────────────────────────────
  {
    level: 'advanced',
    title: 'PMO Leadership',
    subtitle: 'Senior PM / PMO Lead',
    description: 'You\'re operating at programme or PMO level. This path covers the strategic, organisational, and leadership capabilities that define exceptional PMO leaders — from portfolio governance to organisational change and building high-performing teams.',
    emoji: '⚡',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    textColor: '#3B0764',
    totalWeeks: 12,
    sections: [
      {
        title: 'Strategic Thinking',
        description: 'Think beyond projects to programmes, portfolios, and business strategy.',
        color: '#7C3AED',
        steps: [
          { cardId: 'T11', rationale: 'Use the Balanced Scorecard to measure performance across all four strategic perspectives.', milestone: 'Strategic Lens On' },
          { cardId: 'A32', rationale: 'Apply SWOT analysis to assess your programme or PMO strategically.' },
          { cardId: 'A27', rationale: 'Use scenario planning to prepare your portfolio for multiple futures.' },
          { cardId: 'T13', rationale: 'Lead cost-benefit analysis for major investment decisions.' },
        ],
      },
      {
        title: 'Organisational Change',
        description: 'Lead the human side of transformation — the hardest part of any programme.',
        color: '#DC2626',
        steps: [
          { cardId: 'A28', rationale: 'Use Kotter\'s 8-Step Model to embed large-scale organisational change.', milestone: 'Change Leader' },
          { cardId: 'business-4', rationale: 'Prepare the organisation for the changes your programme will bring.' },
          { cardId: 'T15', rationale: 'Use Force Field Analysis to identify what drives and blocks change.' },
          { cardId: 'A30', rationale: 'Apply Design Thinking to solve complex, human-centred problems.' },
        ],
      },
      {
        title: 'Team & Knowledge Leadership',
        description: 'Build high-performing teams and ensure critical knowledge flows across the organisation.',
        color: '#D97706',
        steps: [
          { cardId: 'A2', rationale: 'Diagnose and guide your teams through development stages with Tuckman\'s Ladder.' },
          { cardId: 'A5', rationale: 'Map critical knowledge and ensure it\'s shared before key people leave.' },
          { cardId: 'T12', rationale: 'Use the Delphi Technique to build expert consensus without groupthink.', milestone: 'Team Builder' },
          { cardId: 'A7', rationale: 'Run Kaizen Blitz sessions to rapidly improve specific processes.' },
        ],
      },
      {
        title: 'Governance & Compliance',
        description: 'Establish the governance structures that keep programmes on track.',
        color: '#0284C7',
        steps: [
          { cardId: 'A20', rationale: 'Implement integrated change control to govern all programme changes.' },
          { cardId: 'process-14', rationale: 'Design and maintain appropriate oversight and decision-making structures.' },
          { cardId: 'business-1', rationale: 'Ensure your programme meets all regulatory and legal requirements.' },
          { cardId: 'business-2', rationale: 'Keep the entire programme focused on delivering measurable business value.', milestone: '🎯 PMO Leader' },
        ],
      },
    ],
  },
];

export function getJourneyByLevel(level: JourneyLevel): LearningJourney | undefined {
  return LEARNING_JOURNEYS.find(j => j.level === level);
}
