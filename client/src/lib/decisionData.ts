/**
 * PM Decision Helper — Decision Tree Data
 *
 * A branching questionnaire that guides a project manager to the most
 * relevant tools, techniques, and frameworks from the 144-card library.
 *
 * Structure:
 *   - Each Question has an id, the question text, a context hint, and
 *     an array of Answer options.
 *   - Each Answer has display text, an optional icon, and either:
 *       nextQuestionId  → branch to another question, OR
 *       recommendations → array of card IDs to surface as results
 *   - The root question is always 'q-start'.
 */

export interface DecisionAnswer {
  id: string;
  label: string;
  description?: string;
  nextQuestionId?: string;
  recommendations?: string[];
}

export interface DecisionQuestion {
  id: string;
  question: string;
  hint?: string;
  answers: DecisionAnswer[];
}

export interface DecisionResult {
  cardIds: string[];
  headline: string;
  rationale: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DECISION TREE
// ─────────────────────────────────────────────────────────────────────────────

export const DECISION_QUESTIONS: DecisionQuestion[] = [

  // ── ROOT ──────────────────────────────────────────────────────────────────
  {
    id: 'q-start',
    question: 'What is your primary challenge right now?',
    hint: 'Choose the area where you most need support today.',
    answers: [
      { id: 'a-planning',    label: 'Planning & Scheduling',    description: 'Scope, timeline, budget, or estimation',  nextQuestionId: 'q-planning' },
      { id: 'a-people',      label: 'People & Stakeholders',    description: 'Team dynamics, conflict, or engagement',   nextQuestionId: 'q-people' },
      { id: 'a-risk',        label: 'Risk & Issues',            description: 'Identifying, assessing, or responding',    nextQuestionId: 'q-risk' },
      { id: 'a-delivery',    label: 'Delivery & Execution',     description: 'Tracking progress, quality, or change',    nextQuestionId: 'q-delivery' },
      { id: 'a-strategy',    label: 'Strategy & Governance',    description: 'Business case, portfolio, or decisions',   nextQuestionId: 'q-strategy' },
      { id: 'a-change',      label: 'Change & Transformation',  description: 'Organisational change or adoption',        nextQuestionId: 'q-change' },
      { id: 'a-methodology', label: 'Choosing a Methodology',   description: 'Agile vs Waterfall vs Hybrid',             nextQuestionId: 'q-methodology' },
      { id: 'a-closure',     label: 'Project Closure',          description: 'Handover, lessons, or benefits realisation', nextQuestionId: 'q-closure' },
    ],
  },

  // ── PLANNING ──────────────────────────────────────────────────────────────
  {
    id: 'q-planning',
    question: 'What specifically do you need help with in planning?',
    hint: 'Pick the planning challenge that is most pressing.',
    answers: [
      {
        id: 'a-plan-schedule',
        label: 'Building or tracking a schedule',
        description: 'Gantt, milestones, dependencies',
        recommendations: ['T1', 'A17', 'A29', 'PR09'],
      },
      {
        id: 'a-plan-scope',
        label: 'Defining or managing scope',
        description: 'WBS, requirements, scope creep',
        recommendations: ['T2', 'T3', 'A62', 'PR08'],
      },
      {
        id: 'a-plan-estimate',
        label: 'Estimating effort or cost',
        description: 'Sizing, analogous, parametric',
        recommendations: ['A17', 'A80', 'A82', 'T4'],
      },
      {
        id: 'a-plan-budget',
        label: 'Controlling budget & earned value',
        description: 'CPI, SPI, forecasting',
        recommendations: ['T4', 'T1', 'PR09', 'PR10'],
      },
      {
        id: 'a-plan-resource',
        label: 'Allocating or managing resources',
        description: 'Capacity, RACI, roles',
        recommendations: ['T3', 'A38', 'people-2', 'PR09'],
      },
    ],
  },

  // ── PEOPLE ────────────────────────────────────────────────────────────────
  {
    id: 'q-people',
    question: 'What is the people or stakeholder challenge?',
    hint: 'Select the situation that best describes your current difficulty.',
    answers: [
      {
        id: 'a-people-conflict',
        label: 'Managing conflict in the team',
        description: 'Disagreements, tension, or dysfunction',
        recommendations: ['people-1', 'A43', 'A39', 'A42'],
      },
      {
        id: 'a-people-engage',
        label: 'Engaging or influencing stakeholders',
        description: 'Buy-in, resistance, or communication',
        recommendations: ['people-9', 'T5', 'T6', 'A66'],
      },
      {
        id: 'a-people-team',
        label: 'Building or developing the team',
        description: 'New team, roles, or performance',
        recommendations: ['people-6', 'A38', 'A2', 'people-3'],
      },
      {
        id: 'a-people-lead',
        label: 'Leadership style or delegation',
        description: 'Authority, empowerment, or situational leadership',
        recommendations: ['A44', 'A67', 'people-4', 'A45'],
      },
      {
        id: 'a-people-motivate',
        label: 'Motivating the team',
        description: 'Low morale, disengagement, or recognition',
        recommendations: ['A56', 'A42', 'A60', 'people-3'],
      },
      {
        id: 'a-people-negotiate',
        label: 'Negotiating agreements or contracts',
        description: 'Vendors, sponsors, or internal agreements',
        recommendations: ['people-8', 'T6', 'A52', 'people-9'],
      },
    ],
  },

  // ── RISK ──────────────────────────────────────────────────────────────────
  {
    id: 'q-risk',
    question: 'Where are you in the risk management process?',
    hint: 'Identify the stage where you need the most support.',
    answers: [
      {
        id: 'a-risk-identify',
        label: 'Identifying risks I haven\'t thought of yet',
        description: 'Brainstorming, checklists, or workshops',
        recommendations: ['T7', 'A32', 'A53', 'A51'],
      },
      {
        id: 'a-risk-assess',
        label: 'Assessing and prioritising risks',
        description: 'Probability, impact, scoring',
        recommendations: ['T7', 'A57', 'A31', 'PR05'],
      },
      {
        id: 'a-risk-respond',
        label: 'Planning responses to risks',
        description: 'Mitigation, contingency, or transfer',
        recommendations: ['T7', 'PR05', 'A47', 'PR09'],
      },
      {
        id: 'a-risk-issue',
        label: 'Managing an active issue or crisis',
        description: 'Something has already gone wrong',
        recommendations: ['A41', 'A46', 'people-7', 'PR05'],
      },
      {
        id: 'a-risk-compliance',
        label: 'Compliance or regulatory risk',
        description: 'Audit, traceability, or regulatory requirements',
        recommendations: ['A65', 'A62', 'T7', 'M1'],
      },
    ],
  },

  // ── DELIVERY ──────────────────────────────────────────────────────────────
  {
    id: 'q-delivery',
    question: 'What is the delivery or execution challenge?',
    hint: 'Choose the aspect of execution that needs attention.',
    answers: [
      {
        id: 'a-del-track',
        label: 'Tracking progress and reporting status',
        description: 'Dashboards, status reports, KPIs',
        recommendations: ['T4', 'A61', 'T1', 'PR10'],
      },
      {
        id: 'a-del-quality',
        label: 'Ensuring quality and reducing defects',
        description: 'QA, testing, or continuous improvement',
        recommendations: ['A40', 'A41', 'A46', 'PR11'],
      },
      {
        id: 'a-del-change',
        label: 'Managing scope or change requests',
        description: 'Change control, scope creep, or re-baselining',
        recommendations: ['T2', 'PR08', 'T7', 'A64'],
      },
      {
        id: 'a-del-agile',
        label: 'Running sprints or Agile ceremonies',
        description: 'Backlog, sprint planning, retrospectives',
        recommendations: ['M2', 'A35', 'A80', 'A58'],
      },
      {
        id: 'a-del-bottleneck',
        label: 'Removing bottlenecks or blockers',
        description: 'Flow, WIP limits, or impediments',
        recommendations: ['M3', 'A47', 'people-7', 'A34'],
      },
      {
        id: 'a-del-comms',
        label: 'Improving team communication',
        description: 'Meetings, updates, or remote collaboration',
        recommendations: ['T6', 'A61', 'A59', 'people-10'],
      },
    ],
  },

  // ── STRATEGY ──────────────────────────────────────────────────────────────
  {
    id: 'q-strategy',
    question: 'What is the strategic or governance challenge?',
    hint: 'Select the area where strategic clarity is needed.',
    answers: [
      {
        id: 'a-strat-business-case',
        label: 'Building or justifying a business case',
        description: 'Benefits, ROI, or investment approval',
        recommendations: ['T8', 'A75', 'A32', 'business-1'],
      },
      {
        id: 'a-strat-portfolio',
        label: 'Prioritising projects or portfolio decisions',
        description: 'Which projects to fund or kill',
        recommendations: ['A75', 'A33', 'A31', 'T8'],
      },
      {
        id: 'a-strat-decision',
        label: 'Making a complex decision',
        description: 'Multiple options, ambiguity, or competing priorities',
        recommendations: ['A52', 'A53', 'A50', 'AG3'],
      },
      {
        id: 'a-strat-governance',
        label: 'Setting up governance or oversight',
        description: 'Steering committees, RACI, or escalation paths',
        recommendations: ['A64', 'A52', 'T3', 'PR09'],
      },
      {
        id: 'a-strat-benefits',
        label: 'Tracking or realising benefits',
        description: 'Benefits realisation, KPIs, or value delivery',
        recommendations: ['business-1', 'T8', 'A81', 'PR12'],
      },
    ],
  },

  // ── CHANGE ────────────────────────────────────────────────────────────────
  {
    id: 'q-change',
    question: 'What type of change or transformation are you managing?',
    hint: 'Identify the nature of the change initiative.',
    answers: [
      {
        id: 'a-change-resistance',
        label: 'Overcoming resistance to change',
        description: 'People are pushing back or disengaged',
        recommendations: ['A55', 'A36', 'A66', 'A48'],
      },
      {
        id: 'a-change-culture',
        label: 'Shifting organisational culture',
        description: 'Values, behaviours, or mindset change',
        recommendations: ['A72', 'A37', 'A28', 'A60'],
      },
      {
        id: 'a-change-large',
        label: 'Leading a large-scale transformation',
        description: 'Enterprise-wide or multi-team change',
        recommendations: ['A28', 'A55', 'A37', 'A36'],
      },
      {
        id: 'a-change-process',
        label: 'Improving or redesigning a process',
        description: 'Waste, inefficiency, or re-engineering',
        recommendations: ['A34', 'A40', 'A47', 'A46'],
      },
      {
        id: 'a-change-adoption',
        label: 'Driving adoption of a new tool or system',
        description: 'Technology rollout or new ways of working',
        recommendations: ['A55', 'A66', 'A30', 'A48'],
      },
    ],
  },

  // ── METHODOLOGY ───────────────────────────────────────────────────────────
  {
    id: 'q-methodology',
    question: 'What best describes your project environment?',
    hint: 'This helps match you to the right delivery approach.',
    answers: [
      {
        id: 'a-meth-stable',
        label: 'Stable scope, fixed requirements',
        description: 'Requirements are clear and unlikely to change',
        recommendations: ['M1', 'T1', 'A17', 'A54'],
      },
      {
        id: 'a-meth-evolving',
        label: 'Evolving scope, frequent change',
        description: 'Requirements change often or are unclear',
        recommendations: ['M2', 'A35', 'A80', 'M3'],
      },
      {
        id: 'a-meth-mixed',
        label: 'Mix of fixed and flexible elements',
        description: 'Some parts are regulated, others are iterative',
        recommendations: ['M4', 'AG3', 'A64', 'A54'],
      },
      {
        id: 'a-meth-complex',
        label: 'Highly complex or uncertain environment',
        description: 'Novel, ambiguous, or first-of-its-kind',
        recommendations: ['A53', 'M2', 'A50', 'A30'],
      },
      {
        id: 'a-meth-unsure',
        label: 'Not sure which approach to use',
        description: 'Need a structured way to decide',
        recommendations: ['AG1', 'AG2', 'AG3', 'A53', 'M4'],
      },
    ],
  },

  // ── CLOSURE ───────────────────────────────────────────────────────────────
  {
    id: 'q-closure',
    question: 'What aspect of project closure needs attention?',
    hint: 'Select the closure activity that is most relevant.',
    answers: [
      {
        id: 'a-close-lessons',
        label: 'Capturing lessons learned',
        description: 'Retrospective, knowledge transfer',
        recommendations: ['A58', 'phase-closure', 'A40', 'PR12'],
      },
      {
        id: 'a-close-handover',
        label: 'Handing over to operations',
        description: 'Transition, documentation, or BAU handoff',
        recommendations: ['A79', 'phase-closure', 'A63', 'PR12'],
      },
      {
        id: 'a-close-benefits',
        label: 'Measuring and realising benefits',
        description: 'Post-implementation review, KPIs',
        recommendations: ['business-1', 'A81', 'T8', 'PR12'],
      },
      {
        id: 'a-close-celebrate',
        label: 'Recognising and celebrating the team',
        description: 'Team acknowledgement and closure',
        recommendations: ['phase-closure', 'A58', 'people-3', 'A60'],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RESULT METADATA
// Maps a set of recommended card IDs to a headline and rationale
// ─────────────────────────────────────────────────────────────────────────────

export const RESULT_HEADLINES: Record<string, { headline: string; rationale: string }> = {
  // Planning
  'T1,A17,A29,PR09':         { headline: 'Schedule & Timeline Tools', rationale: 'These tools help you build a realistic schedule, identify the critical path, and manage dependencies with confidence.' },
  'T2,T3,A62,PR08':          { headline: 'Scope Management Toolkit', rationale: 'Use these to define boundaries clearly, manage change requests, and keep scope creep under control.' },
  'A17,A80,A82,T4':          { headline: 'Estimation Techniques', rationale: 'These approaches range from expert-based to data-driven estimation, helping you size work accurately.' },
  'T4,T1,PR09,PR10':         { headline: 'Budget & Earned Value Tools', rationale: 'Track financial performance in real time and forecast completion with these proven cost-control techniques.' },
  'T3,A38,people-2,PR09':    { headline: 'Resource & Capacity Tools', rationale: 'Clarify roles, balance workloads, and ensure the right people are on the right tasks.' },
  // People
  'people-1,A43,A39,A42':    { headline: 'Conflict Resolution Toolkit', rationale: 'These frameworks help you diagnose the source of conflict and choose the right resolution approach.' },
  'people-9,T5,T6,A66':      { headline: 'Stakeholder Engagement Tools', rationale: 'Map, analyse, and influence your stakeholders with these structured engagement techniques.' },
  'people-6,A38,A2,people-3':{ headline: 'Team Building & Development', rationale: 'Build a cohesive, high-performing team from day one using these evidence-based models.' },
  'A44,A67,people-4,A45':    { headline: 'Leadership & Delegation Tools', rationale: 'Adapt your leadership style to the situation and empower your team effectively.' },
  'A56,A42,A60,people-3':    { headline: 'Team Motivation Toolkit', rationale: 'Understand what drives your team and create the conditions for sustained high performance.' },
  'people-8,T6,A52,people-9':{ headline: 'Negotiation & Agreement Tools', rationale: 'Structure your negotiations and reach durable agreements with vendors, sponsors, and partners.' },
  // Risk
  'T7,A32,A53,A51':          { headline: 'Risk Identification Techniques', rationale: 'Uncover hidden risks using structured brainstorming, environmental analysis, and sense-making frameworks.' },
  'T7,A57,A31,PR05':         { headline: 'Risk Assessment & Prioritisation', rationale: 'Score and rank your risks so you focus mitigation effort where it matters most.' },
  'T7,PR05,A47,PR09':        { headline: 'Risk Response Planning', rationale: 'Build contingency plans and mitigation strategies before risks become issues.' },
  'A41,A46,people-7,PR05':   { headline: 'Issue & Crisis Management', rationale: 'Structured problem-solving tools to diagnose root causes and resolve active issues fast.' },
  'A65,A62,T7,M1':           { headline: 'Compliance & Regulatory Risk', rationale: 'Ensure traceability, close compliance gaps, and satisfy regulatory requirements.' },
  // Delivery
  'T4,A61,T1,PR10':          { headline: 'Progress Tracking & Reporting', rationale: 'Visualise project health, communicate status clearly, and keep sponsors informed.' },
  'A40,A41,A46,PR11':        { headline: 'Quality & Continuous Improvement', rationale: 'Embed quality into delivery and use structured problem-solving to eliminate defects.' },
  'T2,PR08,T7,A64':          { headline: 'Change Control Toolkit', rationale: 'Manage scope changes formally, assess impact, and maintain baseline integrity.' },
  'M2,A35,A80,A58':          { headline: 'Agile Delivery Toolkit', rationale: 'Run effective sprints, estimate accurately, and continuously improve your Agile ceremonies.' },
  'M3,A47,people-7,A34':     { headline: 'Flow & Bottleneck Removal', rationale: 'Identify and eliminate constraints to restore delivery flow and throughput.' },
  'T6,A61,A59,people-10':    { headline: 'Communication & Collaboration', rationale: 'Improve information flow, run effective meetings, and align distributed teams.' },
  // Strategy
  'T8,A75,A32,business-1':   { headline: 'Business Case & Value Tools', rationale: 'Build a compelling business case, quantify benefits, and secure investment approval.' },
  'A75,A33,A31,T8':          { headline: 'Portfolio Prioritisation Tools', rationale: 'Evaluate and rank projects objectively to maximise portfolio value.' },
  'A52,A53,A50,AG3':         { headline: 'Complex Decision-Making Tools', rationale: 'Navigate ambiguity and competing options with structured decision frameworks.' },
  'A64,A52,T3,PR09':         { headline: 'Governance & Oversight Tools', rationale: 'Establish clear accountability, escalation paths, and lightweight governance structures.' },
  'business-1,T8,A81,PR12':  { headline: 'Benefits Realisation Toolkit', rationale: 'Track and realise the value your project was funded to deliver.' },
  // Change
  'A55,A36,A66,A48':         { headline: 'Overcoming Resistance to Change', rationale: 'Understand the psychology of resistance and apply proven techniques to build adoption.' },
  'A72,A37,A28,A60':         { headline: 'Culture Change Toolkit', rationale: 'Diagnose your current culture and design targeted interventions to shift mindsets and behaviours.' },
  'A28,A55,A37,A36':         { headline: 'Large-Scale Transformation', rationale: 'Lead enterprise change with structured models that address both the rational and emotional dimensions.' },
  'A34,A40,A47,A46':         { headline: 'Process Improvement Tools', rationale: 'Map, analyse, and redesign processes to eliminate waste and improve flow.' },
  'A55,A66,A30,A48':         { headline: 'Technology & System Adoption', rationale: 'Drive adoption of new tools and ways of working using behavioural and change management techniques.' },
  // Methodology
  'M1,T1,A17,A54':           { headline: 'Waterfall & Predictive Delivery', rationale: 'A sequential, plan-driven approach suited to stable scopes with formal governance requirements.' },
  'M2,A35,A80,M3':           { headline: 'Agile & Iterative Delivery', rationale: 'Iterative approaches that embrace change and deliver value incrementally.' },
  'M4,AG3,A64,A54':          { headline: 'Hybrid Delivery Approach', rationale: 'Blend predictive and adaptive elements to match your project\'s unique constraints.' },
  'A53,M2,A50,A30':          { headline: 'Complex & Uncertain Environments', rationale: 'Sense-making and adaptive tools for novel, first-of-its-kind, or highly ambiguous projects.' },
  'AG1,AG2,AG3,A53,M4':      { headline: 'Methodology Selection Guide', rationale: 'Use these structured tools to assess your context and choose the right delivery approach.' },
  // Closure
  'A58,phase-closure,A40,PR12':        { headline: 'Lessons Learned & Retrospectives', rationale: 'Capture what worked, what didn\'t, and how to improve — before institutional memory fades.' },
  'A79,phase-closure,A63,PR12':        { headline: 'Handover & Transition Tools', rationale: 'Ensure a smooth transition to operations with structured handover documentation and sign-offs.' },
  'business-1,A81,T8,PR12':           { headline: 'Benefits Realisation & Post-Review', rationale: 'Measure whether your project delivered the value it promised.' },
  'phase-closure,A58,people-3,A60':   { headline: 'Team Closure & Recognition', rationale: 'Close the project on a high note — acknowledge contributions, celebrate success, and build lasting relationships.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getQuestionById(id: string): DecisionQuestion | undefined {
  return DECISION_QUESTIONS.find(q => q.id === id);
}

export function getResultMeta(cardIds: string[]): { headline: string; rationale: string } {
  const key = cardIds.join(',');
  return RESULT_HEADLINES[key] ?? {
    headline: 'Recommended Tools for Your Situation',
    rationale: 'Based on your answers, these are the most relevant tools and frameworks from the PMO Toolkit.',
  };
}
