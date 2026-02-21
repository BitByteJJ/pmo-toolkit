// Design: "Clarity Cards" — card-based intro content for each deck
// Each deck has: coverImage, howToStart (3 ways), systemCard (decision flow), categoriesCard (overview)

export interface HowToStartItem {
  title: string;
  steps: string[];
}

export interface SystemNode {
  question: string;
  yesNext: string | null; // null = terminal "take action"
  noCategory: string;
  noIcon: string;
}

export interface CategoryItem {
  icon: string;
  name: string;
  description: string;
  color: string;
}

export interface DeckIntro {
  deckId: string;
  coverImage: string;
  tagline: string;
  howToStart: HowToStartItem[];
  quickTips: string[];
  systemNodes?: SystemNode[];
  systemTerminal?: string;
  categories: CategoryItem[];
}

export const DECK_INTROS: DeckIntro[] = [
  {
    deckId: 'phases',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/epNvaChDmInzjphr.png',
    tagline: 'Navigate any project from first idea to final handover.',
    howToStart: [
      {
        title: 'Follow the lifecycle',
        steps: [
          'Start with the Setup card to build your foundation.',
          'Move to Execution once scope and team are confirmed.',
          'Use Closure to formally end and capture lessons.',
        ],
      },
      {
        title: 'Jump to your current phase',
        steps: [
          'Identify which phase your project is in right now.',
          'Open that card and scan the checklist.',
          'Use the related cards to go deeper on any step.',
        ],
      },
      {
        title: 'Use as a health check',
        steps: [
          'Read all three cards top to bottom.',
          'Mark any steps you have not yet completed.',
          'Prioritise the gaps before moving forward.',
        ],
      },
    ],
    quickTips: [
      'A weak Setup is the root cause of most project failures — invest time here.',
      'Execution is iterative; revisit the card at each major milestone.',
      'Closure is often skipped — but lessons learned are your most valuable asset.',
    ],
    categories: [
      { icon: '🚀', name: 'Setup', description: 'Define scope, team, methodology, and risk framework.', color: '#D97706' },
      { icon: '⚡', name: 'Execution', description: 'Deliver, monitor, adapt, and communicate progress.', color: '#EA580C' },
      { icon: '🏁', name: 'Closure', description: 'Handover, document, celebrate, and capture lessons.', color: '#B45309' },
    ],
  },
  {
    deckId: 'archetypes',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/UHlTjAHHMkQgHafH.png',
    tagline: 'Find the right approach before you commit to a methodology.',
    howToStart: [
      {
        title: 'Answer the questions',
        steps: [
          'Start with AG1 — assess project complexity and novelty.',
          'Move to AG2 — evaluate team experience and stakeholder clarity.',
          'Use AG3 to confirm your recommended methodology.',
        ],
      },
      {
        title: 'Use it with your team',
        steps: [
          'Share the AG1 card with your project sponsor.',
          'Have each team member score independently.',
          'Discuss differences to align on the right approach.',
        ],
      },
      {
        title: 'Revisit mid-project',
        steps: [
          'Re-run AG1 if scope or team changes significantly.',
          'Compare your new score to the original.',
          'Adjust methodology if the gap is large.',
        ],
      },
    ],
    quickTips: [
      'Most projects sit between archetypes — use the closest match as a starting point.',
      'Archetyping is a conversation starter, not a rigid prescription.',
      'Revisit if the project context changes significantly mid-delivery.',
    ],
    categories: [
      { icon: '🔍', name: 'AG1 — Complexity', description: 'Assess how novel, complex, and uncertain the project is.', color: '#0D9488' },
      { icon: '🤝', name: 'AG2 — Team & Stakeholders', description: 'Evaluate experience, clarity, and engagement levels.', color: '#0891B2' },
      { icon: '✅', name: 'AG3 — Recommendation', description: 'Get a methodology recommendation based on your scores.', color: '#059669' },
    ],
  },
  {
    deckId: 'methodologies',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/bdAxarcmvXIHqVvw.png',
    tagline: 'Choose the delivery approach that fits your project reality.',
    howToStart: [
      {
        title: 'Use the Archetyping Guide first',
        steps: [
          'Complete AG1–AG3 to get a methodology recommendation.',
          'Open the recommended methodology card.',
          'Use the related cards to go deeper on tools and techniques.',
        ],
      },
      {
        title: 'Compare all four',
        steps: [
          'Read all four methodology cards in sequence.',
          'Note which "When to use" criteria match your project.',
          'Pick the closest fit — or combine elements for a hybrid.',
        ],
      },
      {
        title: 'Adapt mid-project',
        steps: [
          'If your current approach is not working, open this deck.',
          'Identify what is causing friction.',
          'Consider switching to or blending with another methodology.',
        ],
      },
    ],
    quickTips: [
      'No methodology is perfect — the best one is the one your team will actually follow.',
      'Hybrid approaches are increasingly the norm in complex organisations.',
      'Methodology choice affects tooling, governance, and team rhythm — align early.',
    ],
    systemNodes: [
      { question: 'Is the scope fully defined and stable?', yesNext: 'node2', noCategory: 'Agile', noIcon: '🏃' },
      { question: 'Is delivery sequential with clear handoffs?', yesNext: 'node3', noCategory: 'Kanban', noIcon: '📋' },
      { question: 'Are regulatory or compliance requirements high?', yesNext: null, noCategory: 'Hybrid', noIcon: '🔀' },
    ],
    systemTerminal: 'Use Waterfall — sequential, document-driven delivery.',
    categories: [
      { icon: '💧', name: 'M1 — Waterfall', description: 'Sequential phases with defined deliverables at each gate.', color: '#4F46E5' },
      { icon: '🏃', name: 'M2 — Agile', description: 'Iterative sprints with continuous stakeholder feedback.', color: '#7C3AED' },
      { icon: '📋', name: 'M3 — Kanban', description: 'Flow-based delivery with WIP limits and visual boards.', color: '#6D28D9' },
      { icon: '🔀', name: 'M4 — Hybrid', description: 'Blend of Waterfall and Agile tailored to context.', color: '#5B21B6' },
    ],
  },
  {
    deckId: 'people',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/TOYDIIqTWyLFwfCY.png',
    tagline: 'Lead, motivate, and align the humans behind every project.',
    howToStart: [
      {
        title: 'Follow your current challenge',
        steps: [
          'Identify the people issue you are facing right now.',
          'Find the matching card (conflict, motivation, communication, etc.).',
          'Use the related cards to build a broader response.',
        ],
      },
      {
        title: 'Build a team charter',
        steps: [
          'Start with "Lead a Team" and "Build Shared Understanding".',
          'Use the RACI tool (T5) to define roles.',
          'Revisit "Manage Conflict" and "Support Performance" regularly.',
        ],
      },
      {
        title: 'Stakeholder management sprint',
        steps: [
          'Open "Identify Stakeholders" and map your landscape.',
          'Use "Manage Stakeholder Expectations" to plan engagement.',
          'Track with the Stakeholder Matrix tool (T16).',
        ],
      },
    ],
    quickTips: [
      'People issues are the #1 cause of project delays — address them early and directly.',
      'Use the Tuckman model (A2) to understand where your team is in its development.',
      'Psychological safety (A59 SCARF) is the foundation of high-performing teams.',
    ],
    categories: [
      { icon: '👥', name: 'Team Leadership', description: 'Lead, motivate, and develop your project team.', color: '#E11D48' },
      { icon: '🤝', name: 'Stakeholders', description: 'Identify, engage, and manage stakeholder expectations.', color: '#BE185D' },
      { icon: '💬', name: 'Communication', description: 'Build shared understanding and manage conflict.', color: '#9D174D' },
      { icon: '🌱', name: 'Culture & Change', description: 'Foster ownership, resilience, and adaptability.', color: '#831843' },
    ],
  },
  {
    deckId: 'process',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/GrdQOwJjSnFKcKVn.png',
    tagline: 'Execute with rigour — scope, risk, budget, quality, and governance.',
    howToStart: [
      {
        title: 'Follow the execution sequence',
        steps: [
          'Start with "Define Scope" and "Create a Project Plan".',
          'Set up your "Risk Management" and "Budget Management" processes.',
          'Use "Monitor and Control" throughout delivery.',
        ],
      },
      {
        title: 'Address a specific process gap',
        steps: [
          'Identify which process area is causing problems.',
          'Open the relevant card and follow the steps.',
          'Link to the Tools deck for supporting templates.',
        ],
      },
      {
        title: 'Governance setup sprint',
        steps: [
          'Open "Establish Governance" and "Manage Change Requests".',
          'Define your decision-making framework.',
          'Set up reporting cadence using "Report Progress".',
        ],
      },
    ],
    quickTips: [
      'Scope creep is silent — use a formal change request process from day one.',
      'Risk management is not a one-time exercise; review the register weekly.',
      'Quality is built in, not inspected in — define acceptance criteria upfront.',
    ],
    categories: [
      { icon: '📐', name: 'Planning', description: 'Scope, WBS, scheduling, and resource planning.', color: '#059669' },
      { icon: '⚠️', name: 'Risk & Quality', description: 'Identify, assess, and mitigate risks; assure quality.', color: '#0D9488' },
      { icon: '💰', name: 'Budget & Procurement', description: 'Estimate, track, and control project costs.', color: '#0891B2' },
      { icon: '📊', name: 'Monitoring & Governance', description: 'Track progress, manage changes, report status.', color: '#0284C7' },
    ],
  },
  {
    deckId: 'business',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/CbjqUzAWrljDJesJ.png',
    tagline: 'Operate within the broader organisational and external context.',
    howToStart: [
      {
        title: 'Scan your environment first',
        steps: [
          'Open "Navigate External Changes" and run a PESTLE scan.',
          'Identify which external factors most affect your project.',
          'Feed findings into your risk register.',
        ],
      },
      {
        title: 'Benefits and compliance check',
        steps: [
          'Open "Ensure Legal and Regulatory Compliance" early.',
          'Map your project benefits using "Deliver Benefits".',
          'Review both cards at each phase gate.',
        ],
      },
      {
        title: 'Change management sprint',
        steps: [
          'Open "Manage Organisational Change".',
          'Use ADKAR (A75) or Kotter (A73) to structure your approach.',
          'Align with the People Domain cards for team impact.',
        ],
      },
    ],
    quickTips: [
      'Benefits realisation is often forgotten after go-live — assign an owner before closure.',
      'Regulatory compliance is non-negotiable; build it into your project plan from day one.',
      'External changes (PESTLE) can invalidate your business case — review quarterly.',
    ],
    categories: [
      { icon: '⚖️', name: 'Compliance', description: 'Legal, regulatory, and ethical obligations.', color: '#7C3AED' },
      { icon: '💎', name: 'Benefits', description: 'Define, track, and realise project benefits.', color: '#6D28D9' },
      { icon: '🌍', name: 'External Environment', description: 'PESTLE, market forces, and external change.', color: '#5B21B6' },
      { icon: '🔄', name: 'Organisational Change', description: 'Manage the human side of transformation.', color: '#4C1D95' },
    ],
  },
  {
    deckId: 'tools',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/wYAdBnNHDXPbyggk.png',
    tagline: '17 practical templates ready to use on any project.',
    howToStart: [
      {
        title: 'Pick the tool you need now',
        steps: [
          'Browse the categories below to find the right tool.',
          'Open the card and follow the step-by-step guide.',
          'Use the Visual Reference diagram as a template starting point.',
        ],
      },
      {
        title: 'Set up a new project toolkit',
        steps: [
          'Start with T14 (Scope Statement) and T3 (WBS).',
          'Add T6 (Risk Register) and T16 (Stakeholder Matrix).',
          'Set up T1 (Gantt Chart) for your timeline.',
        ],
      },
      {
        title: 'Diagnose a struggling project',
        steps: [
          'Open T11 (Balanced Scorecard) to assess overall health.',
          'Use T6 (Risk Register) to surface hidden risks.',
          'Apply T7 (MoSCoW) to re-prioritise if scope is unclear.',
        ],
      },
    ],
    quickTips: [
      'A tool is only as good as the conversation it creates — use them collaboratively.',
      'Start simple: a basic Gantt and Risk Register covers 80% of most projects.',
      'The Visual Reference on each card shows the template structure at a glance.',
    ],
    categories: [
      { icon: '📅', name: 'Planning Tools', description: 'Gantt, WBS, Kanban, and scheduling templates.', color: '#0284C7' },
      { icon: '⚠️', name: 'Risk & Decision Tools', description: 'Risk Register, Decision Log, MoSCoW prioritisation.', color: '#0369A1' },
      { icon: '👥', name: 'People & Communication Tools', description: 'RACI Matrix, Stakeholder Matrix, Communication Plan.', color: '#075985' },
      { icon: '📊', name: 'Performance Tools', description: 'Balanced Scorecard, EVM, Lessons Learned Register.', color: '#0C4A6E' },
    ],
  },
  {
    deckId: 'techniques',
    coverImage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/nazJKMRPUyxDWRas.png',
    tagline: '82 advanced techniques to deepen your project management mastery.',
    howToStart: [
      {
        title: 'Follow a related card link',
        steps: [
          'Find a technique referenced on a tool or domain card.',
          'Open it to go deeper on that specific approach.',
          'Explore its related cards to build a full picture.',
        ],
      },
      {
        title: 'Browse by challenge',
        steps: [
          'Use Search to find techniques matching your situation.',
          'Filter by tags like #negotiation, #risk, or #agile.',
          'Bookmark the most relevant ones for quick access.',
        ],
      },
      {
        title: 'Build a technique library',
        steps: [
          'Work through A1–A20 to cover the core techniques.',
          'Save any technique you have used or want to try.',
          'Revisit your saved cards before each new project.',
        ],
      },
    ],
    quickTips: [
      'Techniques are most powerful when combined — look at the related cards on each one.',
      'A1–A20 cover the most universally applicable techniques; start there.',
      'Many techniques have proprietary origins — check the copyright notice at the bottom of each card.',
    ],
    categories: [
      { icon: '🔍', name: 'Analysis & Planning', description: 'Root cause analysis, estimation, risk quantification.', color: '#475569' },
      { icon: '🤝', name: 'Negotiation & Influence', description: 'BATNA, stakeholder influence, conflict resolution.', color: '#334155' },
      { icon: '🚀', name: 'Agile & Lean', description: 'Scrum, Kanban, WSJF, retrospectives, and more.', color: '#1E293B' },
      { icon: '🔄', name: 'Change & Leadership', description: 'ADKAR, Kotter, SCARF, and transformation models.', color: '#0F172A' },
    ],
  },
];

export function getDeckIntro(deckId: string): DeckIntro | undefined {
  return DECK_INTROS.find(d => d.deckId === deckId);
}
