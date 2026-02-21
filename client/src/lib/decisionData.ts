/**
 * PM Decision Helper — Decision Tree Data
 *
 * A branching questionnaire that guides anyone — from complete beginners to
 * experienced PMs — to the most relevant tools, techniques, and frameworks
 * from the 144-card library.
 *
 * Language principle: describe SITUATIONS and FEELINGS, not PM terminology.
 * A beginner should be able to answer every question without prior knowledge.
 *
 * Card ID reference:
 *   phase-setup, phase-execution, phase-closure  (Phases deck)
 *   AG1, AG2, AG3                                (Agile/methodology archetypes)
 *   M1–M4                                        (Methodologies)
 *   people-1 … people-14                         (People domain)
 *   process-1 … process-17                       (Process domain)
 *   business-1 … business-4                      (Business domain)
 *   T1–T17                                       (Tools deck)
 *   A1–A82                                       (Advanced Techniques deck)
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
    question: 'Where are you right now?',
    hint: 'Pick the option that best describes your current situation — no experience needed.',
    answers: [
      {
        id: 'a-new',
        label: 'I\'m new to projects or project management',
        description: 'Just starting out, or running your first project',
        nextQuestionId: 'q-new',
      },
      {
        id: 'a-planning',
        label: 'I\'m trying to plan or organise my project',
        description: 'Working out what to do, when, and who does it',
        nextQuestionId: 'q-planning',
      },
      {
        id: 'a-people',
        label: 'I\'m having trouble with people or relationships',
        description: 'Team tension, difficult stakeholders, or communication problems',
        nextQuestionId: 'q-people',
      },
      {
        id: 'a-risk',
        label: 'Something feels uncertain or has gone wrong',
        description: 'Risks, issues, or unexpected problems',
        nextQuestionId: 'q-risk',
      },
      {
        id: 'a-delivery',
        label: 'My project is running but I need to improve how it\'s going',
        description: 'Tracking progress, quality, or keeping things on track',
        nextQuestionId: 'q-delivery',
      },
      {
        id: 'a-strategy',
        label: 'I need to make a case or get approval for something',
        description: 'Justifying the project, making decisions, or setting up oversight',
        nextQuestionId: 'q-strategy',
      },
      {
        id: 'a-change',
        label: 'I\'m trying to change how people work or think',
        description: 'Introducing new ways of working, tools, or culture',
        nextQuestionId: 'q-change',
      },
      {
        id: 'a-closure',
        label: 'My project is finishing and I need to wrap it up well',
        description: 'Closing down, handing over, or capturing what we learned',
        nextQuestionId: 'q-closure',
      },
    ],
  },

  // ── NEW TO PM ─────────────────────────────────────────────────────────────
  {
    id: 'q-new',
    question: 'What would be most helpful for you right now?',
    hint: 'Everyone starts somewhere — pick what feels most useful.',
    answers: [
      {
        id: 'a-new-understand',
        label: 'I want to understand what project management actually is',
        description: 'The basics: phases, roles, and how projects work',
        recommendations: ['phase-setup', 'phase-execution', 'AG1', 'A2'],
      },
      {
        id: 'a-new-start',
        label: 'I\'ve been asked to run a project and don\'t know where to start',
        description: 'First steps, setting up, and getting organised',
        recommendations: ['phase-setup', 'T5', 'T6', 'T3'],
      },
      {
        id: 'a-new-approach',
        label: 'I\'m not sure which approach to use — Agile, Waterfall, or something else',
        description: 'Choosing the right way to run your project',
        recommendations: ['AG1', 'AG2', 'AG3', 'M4'],
      },
      {
        id: 'a-new-team',
        label: 'I need to work with a team but I\'ve never led one before',
        description: 'Roles, responsibilities, and getting people working together',
        recommendations: ['people-6', 'A38', 'T3', 'A2'],
      },
      {
        id: 'a-new-sponsor',
        label: 'I need to get buy-in from my manager or senior leaders',
        description: 'Presenting your project and getting support',
        recommendations: ['T5', 'T8', 'A66', 'people-9'],
      },
    ],
  },

  // ── PLANNING ──────────────────────────────────────────────────────────────
  {
    id: 'q-planning',
    question: 'What part of planning is giving you trouble?',
    hint: 'Choose the thing that feels most uncertain or overwhelming.',
    answers: [
      {
        id: 'a-plan-schedule',
        label: 'I don\'t know how to create a realistic timeline',
        description: 'Working out what happens when, and in what order',
        recommendations: ['T1', 'A17', 'A29', 'process-6'],
      },
      {
        id: 'a-plan-scope',
        label: 'I\'m not clear on what\'s in and out of scope',
        description: 'Defining boundaries and managing requests for more work',
        recommendations: ['T2', 'T3', 'A62', 'process-8'],
      },
      {
        id: 'a-plan-estimate',
        label: 'I\'m not sure how long things will take or what they\'ll cost',
        description: 'Estimating effort, time, and budget',
        recommendations: ['A17', 'A80', 'A82', 'T4'],
      },
      {
        id: 'a-plan-budget',
        label: 'My project is going over budget and I\'m not sure how to fix it',
        description: 'Tracking spend and getting finances back under control',
        recommendations: ['T4', 'T1', 'process-5', 'process-9'],
      },
      {
        id: 'a-plan-resource',
        label: 'I don\'t have the right people or enough capacity',
        description: 'Working out who does what and managing workloads',
        recommendations: ['T3', 'A38', 'people-2', 'process-9'],
      },
    ],
  },

  // ── PEOPLE ────────────────────────────────────────────────────────────────
  {
    id: 'q-people',
    question: 'What is the people challenge you\'re facing?',
    hint: 'Pick the situation that feels closest to what you\'re experiencing.',
    answers: [
      {
        id: 'a-people-conflict',
        label: 'There\'s tension or conflict in my team',
        description: 'Disagreements, difficult personalities, or a team that isn\'t gelling',
        recommendations: ['people-1', 'A43', 'A39', 'A42'],
      },
      {
        id: 'a-people-engage',
        label: 'Key people aren\'t engaged or are pushing back on the project',
        description: 'Getting support from stakeholders who are resistant or disinterested',
        recommendations: ['people-9', 'T5', 'T6', 'A66'],
      },
      {
        id: 'a-people-team',
        label: 'I\'m building a new team or the team isn\'t working well together yet',
        description: 'Getting people aligned, clear on roles, and working as a unit',
        recommendations: ['people-6', 'A38', 'A2', 'people-3'],
      },
      {
        id: 'a-people-lead',
        label: 'I\'m not sure how to lead or manage the people on my project',
        description: 'When to step in, when to delegate, and how to get the best from people',
        recommendations: ['A44', 'A67', 'people-4', 'A45'],
      },
      {
        id: 'a-people-motivate',
        label: 'My team seems disengaged or low on energy',
        description: 'Morale is low, people are going through the motions, or enthusiasm has dropped',
        recommendations: ['A56', 'A42', 'A60', 'people-3'],
      },
      {
        id: 'a-people-negotiate',
        label: 'I need to reach an agreement with someone who has different priorities',
        description: 'Negotiating with suppliers, sponsors, or other teams',
        recommendations: ['people-8', 'T6', 'A52', 'people-9'],
      },
    ],
  },

  // ── RISK ──────────────────────────────────────────────────────────────────
  {
    id: 'q-risk',
    question: 'What kind of uncertainty or problem are you dealing with?',
    hint: 'Pick the option that best describes where you are.',
    answers: [
      {
        id: 'a-risk-identify',
        label: 'I want to think ahead and spot problems before they happen',
        description: 'Proactively identifying things that could go wrong',
        recommendations: ['T7', 'A32', 'A53', 'A51'],
      },
      {
        id: 'a-risk-assess',
        label: 'I have a list of risks but don\'t know which ones to focus on',
        description: 'Working out which risks are most serious and need attention first',
        recommendations: ['T7', 'A57', 'A31', 'process-3'],
      },
      {
        id: 'a-risk-respond',
        label: 'I know the risks — I need a plan to deal with them',
        description: 'Building responses, backup plans, and contingencies',
        recommendations: ['T7', 'process-3', 'A47', 'process-9'],
      },
      {
        id: 'a-risk-issue',
        label: 'Something has already gone wrong and I need to fix it',
        description: 'An active problem, crisis, or issue that needs resolving now',
        recommendations: ['A41', 'A46', 'people-7', 'process-15'],
      },
      {
        id: 'a-risk-compliance',
        label: 'I need to meet regulatory or audit requirements',
        description: 'Compliance, documentation trails, or external oversight',
        recommendations: ['A65', 'A62', 'T7', 'process-14'],
      },
    ],
  },

  // ── DELIVERY ──────────────────────────────────────────────────────────────
  {
    id: 'q-delivery',
    question: 'What\'s not working well in how your project is running?',
    hint: 'Choose the area that needs the most attention right now.',
    answers: [
      {
        id: 'a-del-track',
        label: 'I\'m not sure if we\'re on track or how to show progress to others',
        description: 'Reporting, dashboards, and keeping stakeholders informed',
        recommendations: ['T4', 'A61', 'T1', 'process-5'],
      },
      {
        id: 'a-del-quality',
        label: 'The work being delivered isn\'t meeting the standard expected',
        description: 'Quality problems, errors, or rework',
        recommendations: ['A40', 'A41', 'A46', 'process-7'],
      },
      {
        id: 'a-del-change',
        label: 'People keep asking for more things and the scope keeps growing',
        description: 'Managing new requests and keeping the project focused',
        recommendations: ['T2', 'process-8', 'T7', 'A64'],
      },
      {
        id: 'a-del-agile',
        label: 'My team works in short cycles and I want to improve how we plan and review',
        description: 'Sprint planning, reviews, and continuous improvement',
        recommendations: ['M2', 'A35', 'A80', 'A58'],
      },
      {
        id: 'a-del-bottleneck',
        label: 'Work keeps getting stuck or slowing down at certain points',
        description: 'Bottlenecks, blockers, and things that stop the team moving forward',
        recommendations: ['M3', 'A47', 'people-7', 'A34'],
      },
      {
        id: 'a-del-comms',
        label: 'The team isn\'t communicating well or meetings feel unproductive',
        description: 'Information sharing, alignment, and collaboration',
        recommendations: ['T6', 'A61', 'A59', 'people-10'],
      },
    ],
  },

  // ── STRATEGY ──────────────────────────────────────────────────────────────
  {
    id: 'q-strategy',
    question: 'What kind of decision or approval are you working towards?',
    hint: 'Pick the situation that best matches what you\'re trying to achieve.',
    answers: [
      {
        id: 'a-strat-business-case',
        label: 'I need to convince people the project is worth doing',
        description: 'Building a case, showing the value, and getting sign-off',
        recommendations: ['T8', 'A75', 'A32', 'business-1'],
      },
      {
        id: 'a-strat-portfolio',
        label: 'There are too many projects and I need to decide which ones to prioritise',
        description: 'Choosing where to focus time, money, and people',
        recommendations: ['A75', 'A33', 'A31', 'T8'],
      },
      {
        id: 'a-strat-decision',
        label: 'I\'m facing a difficult decision with no obvious right answer',
        description: 'Weighing up options, trade-offs, and competing priorities',
        recommendations: ['A52', 'A53', 'A50', 'AG3'],
      },
      {
        id: 'a-strat-governance',
        label: 'I need to set up clearer rules for who decides what',
        description: 'Accountability, escalation, and oversight structures',
        recommendations: ['A64', 'A52', 'T3', 'process-14'],
      },
      {
        id: 'a-strat-benefits',
        label: 'I need to show that the project actually delivered value',
        description: 'Measuring outcomes and proving the investment was worthwhile',
        recommendations: ['business-1', 'T8', 'A81', 'process-17'],
      },
    ],
  },

  // ── CHANGE ────────────────────────────────────────────────────────────────
  {
    id: 'q-change',
    question: 'What kind of change are you trying to make happen?',
    hint: 'Choose the description that best fits your situation.',
    answers: [
      {
        id: 'a-change-resistance',
        label: 'People are resisting or ignoring the change',
        description: 'Pushback, scepticism, or people reverting to old ways',
        recommendations: ['A55', 'A36', 'A66', 'A48'],
      },
      {
        id: 'a-change-culture',
        label: 'I\'m trying to change how people think or behave, not just what they do',
        description: 'Shifting mindsets, values, or the way things are done around here',
        recommendations: ['A72', 'A37', 'A28', 'A60'],
      },
      {
        id: 'a-change-large',
        label: 'This is a large change affecting many people across the organisation',
        description: 'Organisation-wide transformation with multiple workstreams',
        recommendations: ['A28', 'A55', 'A37', 'A36'],
      },
      {
        id: 'a-change-process',
        label: 'A process or way of working is inefficient and needs redesigning',
        description: 'Removing waste, streamlining steps, or improving how work flows',
        recommendations: ['A34', 'A40', 'A47', 'A46'],
      },
      {
        id: 'a-change-adoption',
        label: 'We\'re rolling out a new tool or system and people aren\'t using it',
        description: 'Technology adoption, training, and embedding new ways of working',
        recommendations: ['A55', 'A66', 'A30', 'A48'],
      },
    ],
  },

  // ── METHODOLOGY ───────────────────────────────────────────────────────────
  {
    id: 'q-methodology',
    question: 'How would you describe your project?',
    hint: 'Don\'t worry about the right answer — just pick what feels closest.',
    answers: [
      {
        id: 'a-meth-stable',
        label: 'We know exactly what we\'re building and it\'s unlikely to change',
        description: 'Clear requirements, fixed scope, and a defined end point',
        recommendations: ['M1', 'T1', 'A17', 'A54'],
      },
      {
        id: 'a-meth-evolving',
        label: 'We\'re figuring it out as we go — requirements keep changing',
        description: 'Frequent feedback, evolving scope, and iterative delivery',
        recommendations: ['M2', 'A35', 'A80', 'M3'],
      },
      {
        id: 'a-meth-mixed',
        label: 'Some parts are fixed, others are flexible',
        description: 'A mix of structured planning and adaptive delivery',
        recommendations: ['M4', 'AG3', 'A64', 'A54'],
      },
      {
        id: 'a-meth-complex',
        label: 'This is unlike anything we\'ve done before — it\'s genuinely uncertain',
        description: 'Novel, ambiguous, or highly complex with no clear path',
        recommendations: ['A53', 'M2', 'A50', 'A30'],
      },
      {
        id: 'a-meth-unsure',
        label: 'I\'m not sure — I need help choosing the right approach',
        description: 'Not sure which method fits your project',
        recommendations: ['AG1', 'AG2', 'AG3', 'A53', 'M4'],
      },
    ],
  },

  // ── CLOSURE ───────────────────────────────────────────────────────────────
  {
    id: 'q-closure',
    question: 'What does "wrapping up well" look like for you?',
    hint: 'Choose the aspect of closure that matters most right now.',
    answers: [
      {
        id: 'a-close-lessons',
        label: 'I want to capture what we learned so we don\'t repeat the same mistakes',
        description: 'Reflecting on what went well, what didn\'t, and why',
        recommendations: ['A58', 'phase-closure', 'A40', 'process-17'],
      },
      {
        id: 'a-close-handover',
        label: 'I need to hand the project over to the people who will run it day-to-day',
        description: 'Transition, documentation, and making sure nothing gets lost',
        recommendations: ['A79', 'phase-closure', 'A63', 'process-16'],
      },
      {
        id: 'a-close-benefits',
        label: 'I need to show whether the project actually achieved what it set out to do',
        description: 'Measuring outcomes and proving the value delivered',
        recommendations: ['business-1', 'A81', 'T8', 'process-17'],
      },
      {
        id: 'a-close-celebrate',
        label: 'I want to recognise the team\'s effort and close on a positive note',
        description: 'Celebrating success and giving people proper closure',
        recommendations: ['phase-closure', 'A58', 'people-3', 'A60'],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RESULT METADATA
// Maps a set of recommended card IDs (joined with commas) to a headline and
// rationale shown on the results screen.
// ─────────────────────────────────────────────────────────────────────────────

export const RESULT_HEADLINES: Record<string, { headline: string; rationale: string }> = {
  // ── New to PM ──────────────────────────────────────────────────────────────
  'phase-setup,phase-execution,AG1,A2':
    { headline: 'PM Foundations to Get You Started', rationale: 'These cards cover the basics of how projects work, the phases they go through, and the key roles involved — a great starting point for anyone new to project management.' },
  'phase-setup,T5,T6,T3':
    { headline: 'First Steps for a New Project', rationale: 'These tools help you kick off a project the right way — defining what you\'re doing, who\'s involved, and how you\'ll communicate.' },
  'AG1,AG2,AG3,M4':
    { headline: 'Choosing Your Delivery Approach', rationale: 'These frameworks help you assess your project\'s context and choose between Agile, Waterfall, or a hybrid approach.' },
  'people-6,A38,T3,A2':
    { headline: 'Building and Leading Your First Team', rationale: 'These tools help you clarify roles, get people working together, and understand what makes a team effective.' },
  'T5,T8,A66,people-9':
    { headline: 'Getting Buy-In and Support', rationale: 'These techniques help you understand your stakeholders, communicate your project\'s value, and build the support you need to succeed.' },

  // ── Planning ───────────────────────────────────────────────────────────────
  'T1,A17,A29,process-6':
    { headline: 'Building a Realistic Timeline', rationale: 'These tools help you plan a schedule that accounts for dependencies, critical tasks, and realistic estimates — so you can commit to dates with confidence.' },
  'T2,T3,A62,process-8':
    { headline: 'Defining and Protecting Scope', rationale: 'Use these to be crystal clear about what the project will and won\'t deliver, and to manage requests for additional work formally.' },
  'A17,A80,A82,T4':
    { headline: 'Estimating Time and Cost', rationale: 'These techniques range from expert judgement to data-driven sizing, helping you produce estimates that are honest and defensible.' },
  'T4,T1,process-5,process-9':
    { headline: 'Getting the Budget Back on Track', rationale: 'These tools help you understand where the money is going, forecast final costs, and take corrective action before it\'s too late.' },
  'T3,A38,people-2,process-9':
    { headline: 'Sorting Out Roles and Capacity', rationale: 'Clarify who does what, balance workloads fairly, and make sure the right people are assigned to the right tasks.' },

  // ── People ─────────────────────────────────────────────────────────────────
  'people-1,A43,A39,A42':
    { headline: 'Resolving Team Conflict', rationale: 'These frameworks help you understand the source of tension, choose the right approach to resolve it, and rebuild trust within the team.' },
  'people-9,T5,T6,A66':
    { headline: 'Engaging Difficult Stakeholders', rationale: 'Map who matters, understand their concerns, and use structured techniques to build genuine support for your project.' },
  'people-6,A38,A2,people-3':
    { headline: 'Getting Your Team Working Well Together', rationale: 'Build a cohesive, high-performing team from day one using these evidence-based models for team development and role clarity.' },
  'A44,A67,people-4,A45':
    { headline: 'Leading and Delegating Effectively', rationale: 'Adapt your leadership style to the situation, know when to step in and when to step back, and empower your team to do their best work.' },
  'A56,A42,A60,people-3':
    { headline: 'Rebuilding Team Motivation', rationale: 'Understand what drives your team members individually and create the conditions for sustained engagement and high performance.' },
  'people-8,T6,A52,people-9':
    { headline: 'Reaching Agreements with Others', rationale: 'Structure your negotiations, understand the other side\'s interests, and reach durable agreements with vendors, sponsors, and partners.' },

  // ── Risk ───────────────────────────────────────────────────────────────────
  'T7,A32,A53,A51':
    { headline: 'Spotting Problems Before They Happen', rationale: 'Use structured brainstorming, environmental scanning, and sense-making to uncover risks you haven\'t thought of yet.' },
  'T7,A57,A31,process-3':
    { headline: 'Deciding Which Risks to Focus On', rationale: 'Score and rank your risks so you can focus your energy where it will make the most difference.' },
  'T7,process-3,A47,process-9':
    { headline: 'Planning How to Handle Risks', rationale: 'Build contingency plans and mitigation strategies before risks turn into real problems.' },
  'A41,A46,people-7,process-15':
    { headline: 'Fixing Something That\'s Already Gone Wrong', rationale: 'Structured problem-solving tools to diagnose root causes, resolve active issues, and prevent recurrence.' },
  'A65,A62,T7,process-14':
    { headline: 'Meeting Compliance and Audit Requirements', rationale: 'Ensure traceability, close compliance gaps, and satisfy regulatory or external oversight requirements.' },

  // ── Delivery ───────────────────────────────────────────────────────────────
  'T4,A61,T1,process-5':
    { headline: 'Showing Progress and Keeping People Informed', rationale: 'Visualise project health, communicate status clearly, and give stakeholders the confidence that things are under control.' },
  'A40,A41,A46,process-7':
    { headline: 'Improving Quality and Reducing Errors', rationale: 'Embed quality into how you work and use structured problem-solving to find and fix the root causes of defects.' },
  'T2,process-8,T7,A64':
    { headline: 'Managing Scope and Change Requests', rationale: 'Handle requests for additional work formally, assess their impact, and keep your project focused on what was agreed.' },
  'M2,A35,A80,A58':
    { headline: 'Running Better Sprints and Agile Ceremonies', rationale: 'Improve how you plan, estimate, and review work in short cycles — and build a culture of continuous improvement.' },
  'M3,A47,people-7,A34':
    { headline: 'Removing Bottlenecks and Getting Work Flowing', rationale: 'Identify where work is getting stuck, remove the constraints, and restore momentum to your team.' },
  'T6,A61,A59,people-10':
    { headline: 'Improving How the Team Communicates', rationale: 'Make information flow better, run more productive meetings, and keep distributed or cross-functional teams aligned.' },

  // ── Strategy ───────────────────────────────────────────────────────────────
  'T8,A75,A32,business-1':
    { headline: 'Making the Case for Your Project', rationale: 'Build a compelling argument for why the project is worth doing, quantify the benefits, and secure the approval you need.' },
  'A75,A33,A31,T8':
    { headline: 'Prioritising Projects and Deciding What to Fund', rationale: 'Evaluate and rank projects objectively so you can make defensible decisions about where to invest time and money.' },
  'A52,A53,A50,AG3':
    { headline: 'Making a Difficult Decision', rationale: 'Navigate ambiguity and competing options with structured frameworks that bring clarity to complex choices.' },
  'A64,A52,T3,process-14':
    { headline: 'Setting Up Clear Accountability and Oversight', rationale: 'Establish who decides what, how decisions get escalated, and how the project is governed without creating bureaucracy.' },
  'business-1,T8,A81,process-17':
    { headline: 'Proving the Project Delivered Value', rationale: 'Track and demonstrate the outcomes your project was funded to deliver — turning outputs into measurable benefits.' },

  // ── Change ─────────────────────────────────────────────────────────────────
  'A55,A36,A66,A48':
    { headline: 'Overcoming Resistance to Change', rationale: 'Understand why people resist change and apply proven techniques to build genuine adoption rather than compliance.' },
  'A72,A37,A28,A60':
    { headline: 'Shifting How People Think and Behave', rationale: 'Diagnose your current culture and design targeted interventions to shift mindsets, values, and behaviours.' },
  'A28,A55,A37,A36':
    { headline: 'Leading a Large-Scale Transformation', rationale: 'Structured models that address both the rational and emotional dimensions of organisation-wide change.' },
  'A34,A40,A47,A46':
    { headline: 'Redesigning an Inefficient Process', rationale: 'Map, analyse, and redesign processes to eliminate waste, reduce errors, and improve how work flows.' },
  'A55,A66,A30,A48':
    { headline: 'Getting People to Use a New Tool or System', rationale: 'Drive adoption of new technology and ways of working using behavioural and change management techniques.' },

  // ── Methodology ────────────────────────────────────────────────────────────
  'M1,T1,A17,A54':
    { headline: 'A Structured, Plan-Driven Approach', rationale: 'A sequential approach suited to projects with stable, well-defined requirements and formal governance needs.' },
  'M2,A35,A80,M3':
    { headline: 'An Agile, Iterative Approach', rationale: 'Deliver value in short cycles, embrace change, and continuously improve based on feedback.' },
  'M4,AG3,A64,A54':
    { headline: 'A Hybrid Approach That Blends Both', rationale: 'Combine the structure of traditional planning with the flexibility of Agile to match your project\'s unique constraints.' },
  'A53,M2,A50,A30':
    { headline: 'Tools for Genuinely Uncertain Situations', rationale: 'Sense-making and adaptive tools for novel, first-of-its-kind, or highly ambiguous projects where the path isn\'t clear.' },
  'AG1,AG2,AG3,A53,M4':
    { headline: 'Choosing the Right Approach for Your Project', rationale: 'Use these structured tools to assess your context and make an informed choice about how to run your project.' },

  // ── Closure ────────────────────────────────────────────────────────────────
  'A58,phase-closure,A40,process-17':
    { headline: 'Capturing Lessons and Improving for Next Time', rationale: 'Reflect on what worked and what didn\'t before institutional memory fades — so the next project starts smarter.' },
  'A79,phase-closure,A63,process-16':
    { headline: 'Handing Over Smoothly', rationale: 'Ensure a clean transition to the people who will run things day-to-day, with nothing falling through the cracks.' },
  'business-1,A81,T8,process-17':
    { headline: 'Showing Whether the Project Delivered What It Promised', rationale: 'Measure outcomes against the original goals and demonstrate the value the project created.' },
  'phase-closure,A58,people-3,A60':
    { headline: 'Celebrating the Team and Closing Well', rationale: 'Acknowledge contributions, celebrate success, and give the team a proper sense of closure and recognition.' },
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
    rationale: 'Based on your answers, these are the most relevant tools and frameworks from the StratAlign library.',
  };
}
