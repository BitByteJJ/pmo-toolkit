// StratAlign — Glossary Data
// 80+ plain-language PM definitions, each linked to the most relevant card(s)

export interface GlossaryTerm {
  term: string;
  definition: string;
  cardIds: string[];   // IDs of related cards in pmoData
  tags?: string[];     // optional topic tags
}

export const GLOSSARY: GlossaryTerm[] = [
  // A
  {
    term: 'Acceptance Criteria',
    definition: 'The specific conditions a deliverable must meet before it is considered complete and signed off by the client or stakeholder.',
    cardIds: ['process-8', 'T6'],
    tags: ['scope', 'quality'],
  },
  {
    term: 'Agile',
    definition: 'A flexible approach to managing projects that works in short cycles (sprints), welcomes changing requirements, and focuses on delivering working results quickly.',
    cardIds: ['M2', 'M3'],
    tags: ['methodology'],
  },
  {
    term: 'Assumptions Log',
    definition: 'A document that records all the things you are assuming to be true about your project — so you can revisit them if circumstances change.',
    cardIds: ['process-9'],
    tags: ['planning'],
  },
  {
    term: 'Backlog',
    definition: 'A prioritised list of work items, features, or tasks that need to be done. In Agile projects the team picks from the top of the backlog each sprint.',
    cardIds: ['M2', 'T5'],
    tags: ['agile', 'planning'],
  },
  {
    term: 'Baseline',
    definition: 'The approved, agreed version of a plan (scope, schedule, or budget) against which actual performance is measured.',
    cardIds: ['T1', 'T4'],
    tags: ['planning', 'monitoring'],
  },
  {
    term: 'Benefits Realisation',
    definition: 'The process of making sure the intended benefits of a project are actually achieved after it finishes — not just delivered on paper.',
    cardIds: ['B1', 'process-17'],
    tags: ['business', 'closure'],
  },
  {
    term: 'Budget at Completion (BAC)',
    definition: 'The total planned budget for the entire project.',
    cardIds: ['T4', 'process-5'],
    tags: ['cost', 'earned value'],
  },
  {
    term: 'Business Case',
    definition: 'A document that explains why a project is worth doing — the problem it solves, the benefits it will deliver, and the costs involved.',
    cardIds: ['B1', 'B2'],
    tags: ['business', 'initiation'],
  },
  // C
  {
    term: 'Change Control',
    definition: 'A formal process for reviewing, approving, and tracking any changes to the project scope, schedule, or budget.',
    cardIds: ['process-11', 'process-8'],
    tags: ['governance', 'scope'],
  },
  {
    term: 'Change Request',
    definition: 'A formal proposal to alter any aspect of the project — its scope, timeline, cost, or quality standards.',
    cardIds: ['process-11'],
    tags: ['governance'],
  },
  {
    term: 'Charter',
    definition: 'A short document that officially authorises a project, names the project manager, and outlines the objectives and key stakeholders.',
    cardIds: ['process-1'],
    tags: ['initiation'],
  },
  {
    term: 'Communications Plan',
    definition: 'A plan that describes who needs what information, when they need it, and how it will be delivered.',
    cardIds: ['process-10', 'A7'],
    tags: ['communication', 'stakeholders'],
  },
  {
    term: 'Constraint',
    definition: 'Any limitation that restricts how you can run the project — typically time, cost, or scope (the "triple constraint").',
    cardIds: ['T6', 'process-9'],
    tags: ['planning'],
  },
  {
    term: 'Cost Variance (CV)',
    definition: 'The difference between the budgeted cost of work performed and the actual cost. A negative CV means you are over budget.',
    cardIds: ['T4'],
    tags: ['cost', 'earned value'],
  },
  {
    term: 'Critical Path',
    definition: 'The longest sequence of dependent tasks in a project. Any delay on the critical path delays the whole project.',
    cardIds: ['T2', 'T1'],
    tags: ['schedule', 'planning'],
  },
  // D
  {
    term: 'Daily Stand-up',
    definition: 'A short (usually 15-minute) daily team meeting where everyone shares what they did yesterday, what they will do today, and any blockers.',
    cardIds: ['M2', 'A3'],
    tags: ['agile', 'communication'],
  },
  {
    term: 'Deliverable',
    definition: 'A specific, tangible output or result that must be produced as part of the project.',
    cardIds: ['process-8', 'T6'],
    tags: ['scope'],
  },
  {
    term: 'Dependencies',
    definition: 'Relationships between tasks where one task must start or finish before another can begin.',
    cardIds: ['T2', 'T1'],
    tags: ['schedule'],
  },
  // E
  {
    term: 'Earned Value Management (EVM)',
    definition: 'A technique for measuring project performance by comparing the planned value of work against the actual cost and the work actually completed.',
    cardIds: ['T4'],
    tags: ['cost', 'monitoring'],
  },
  {
    term: 'Escalation',
    definition: 'The process of raising an issue to a higher level of authority when it cannot be resolved at the current level.',
    cardIds: ['process-15', 'A7'],
    tags: ['governance', 'communication'],
  },
  {
    term: 'Estimate at Completion (EAC)',
    definition: 'A forecast of the total cost of the project based on current performance trends.',
    cardIds: ['T4'],
    tags: ['cost', 'earned value'],
  },
  // F
  {
    term: 'Float (Slack)',
    definition: 'The amount of time a task can be delayed without delaying the project end date.',
    cardIds: ['T2'],
    tags: ['schedule'],
  },
  {
    term: 'Functional Requirements',
    definition: 'Descriptions of what a product or system must do — its features and capabilities.',
    cardIds: ['process-8', 'T6'],
    tags: ['scope', 'requirements'],
  },
  // G
  {
    term: 'Gantt Chart',
    definition: 'A bar chart that shows the project schedule — tasks on the left, a timeline across the top, and bars showing when each task runs.',
    cardIds: ['T1'],
    tags: ['schedule', 'tools'],
  },
  {
    term: 'Governance',
    definition: 'The framework of rules, processes, and decision-making structures that guide how a project is run and overseen.',
    cardIds: ['process-15', 'B5'],
    tags: ['governance'],
  },
  // I
  {
    term: 'Issue',
    definition: 'A problem that has already occurred and needs to be resolved — as opposed to a risk, which is a problem that might occur.',
    cardIds: ['process-15', 'T3'],
    tags: ['monitoring', 'risk'],
  },
  {
    term: 'Issue Log',
    definition: 'A document that tracks all current issues, who owns them, and their resolution status.',
    cardIds: ['process-15'],
    tags: ['monitoring'],
  },
  {
    term: 'Iteration',
    definition: 'A fixed-length cycle of work (also called a sprint) in Agile projects, typically 1–4 weeks long.',
    cardIds: ['M2', 'M3'],
    tags: ['agile'],
  },
  // K
  {
    term: 'Kanban',
    definition: 'A visual workflow method that uses a board with columns (e.g. To Do, In Progress, Done) to manage and limit work in progress.',
    cardIds: ['M3', 'T5'],
    tags: ['agile', 'methodology'],
  },
  {
    term: 'Key Performance Indicator (KPI)',
    definition: 'A measurable value that shows how effectively a project or organisation is achieving its objectives.',
    cardIds: ['B3', 'T4'],
    tags: ['monitoring', 'business'],
  },
  {
    term: 'Kickoff Meeting',
    definition: 'The first formal meeting of the project team and key stakeholders, used to align everyone on the project goals, roles, and plan.',
    cardIds: ['process-1', 'A3'],
    tags: ['initiation', 'communication'],
  },
  // L
  {
    term: 'Lessons Learned',
    definition: 'Knowledge gained during a project — both what went well and what could be improved — documented so future projects can benefit.',
    cardIds: ['process-17', 'process-16'],
    tags: ['closure', 'learning'],
  },
  {
    term: 'Lessons Learned Register',
    definition: 'A document that captures lessons learned throughout the project, not just at the end.',
    cardIds: ['process-16'],
    tags: ['closure', 'learning'],
  },
  // M
  {
    term: 'Milestone',
    definition: 'A significant event or point in the project timeline, such as completing a phase or delivering a key output.',
    cardIds: ['T1', 'process-9'],
    tags: ['schedule'],
  },
  {
    term: 'MoSCoW Prioritisation',
    definition: 'A technique for ranking requirements as Must have, Should have, Could have, or Won\'t have — to focus effort on what matters most.',
    cardIds: ['T6', 'process-8'],
    tags: ['scope', 'planning'],
  },
  {
    term: 'MVP (Minimum Viable Product)',
    definition: 'The simplest version of a product that delivers enough value to be useful and to test assumptions with real users.',
    cardIds: ['M2', 'B4'],
    tags: ['agile', 'business'],
  },
  // O
  {
    term: 'OKR (Objectives and Key Results)',
    definition: 'A goal-setting framework where you define an ambitious objective and 2–5 measurable key results that show progress toward it.',
    cardIds: ['B3'],
    tags: ['business', 'strategy'],
  },
  // P
  {
    term: 'Phase Gate',
    definition: 'A review point at the end of a project phase where a decision is made to proceed, pause, or stop the project.',
    cardIds: ['PH1', 'process-15'],
    tags: ['governance', 'phases'],
  },
  {
    term: 'PRINCE2',
    definition: 'A structured project management methodology widely used in the UK and internationally, based on seven principles, themes, and processes.',
    cardIds: ['M5'],
    tags: ['methodology'],
  },
  {
    term: 'Procurement',
    definition: 'The process of obtaining goods or services from external suppliers, including planning, tendering, contracting, and managing vendors.',
    cardIds: ['process-12'],
    tags: ['procurement'],
  },
  {
    term: 'Programme',
    definition: 'A group of related projects managed together to achieve benefits that could not be achieved by managing them individually.',
    cardIds: ['B5'],
    tags: ['governance', 'strategy'],
  },
  {
    term: 'Project Charter',
    definition: 'See Charter.',
    cardIds: ['process-1'],
    tags: ['initiation'],
  },
  {
    term: 'Project Management Office (PMO)',
    definition: 'A team or department that sets and maintains project management standards, provides support, and oversees a portfolio of projects.',
    cardIds: ['B5'],
    tags: ['governance'],
  },
  {
    term: 'Project Sponsor',
    definition: 'The senior person who champions the project, provides resources, removes obstacles, and is ultimately accountable for its success.',
    cardIds: ['A7', 'A1'],
    tags: ['stakeholders', 'governance'],
  },
  // Q
  {
    term: 'Quality Assurance (QA)',
    definition: 'Activities that ensure the project\'s processes are being followed correctly to produce quality outputs.',
    cardIds: ['process-7'],
    tags: ['quality'],
  },
  {
    term: 'Quality Control (QC)',
    definition: 'Activities that check whether specific deliverables meet the required quality standards.',
    cardIds: ['process-7', 'T9'],
    tags: ['quality'],
  },
  // R
  {
    term: 'RACI Matrix',
    definition: 'A chart that maps tasks to people using four roles: Responsible (does the work), Accountable (owns the outcome), Consulted (gives input), Informed (kept in the loop).',
    cardIds: ['T8', 'A3'],
    tags: ['people', 'planning'],
  },
  {
    term: 'Requirements',
    definition: 'Documented descriptions of what the project must deliver — the needs and expectations of stakeholders.',
    cardIds: ['process-8', 'T6'],
    tags: ['scope', 'planning'],
  },
  {
    term: 'Resource Management',
    definition: 'Planning, allocating, and managing the people, equipment, and materials needed to complete the project.',
    cardIds: ['process-3', 'T3'],
    tags: ['people', 'planning'],
  },
  {
    term: 'Retrospective',
    definition: 'A team meeting at the end of a sprint or phase to reflect on what went well, what didn\'t, and how to improve.',
    cardIds: ['M2', 'process-16'],
    tags: ['agile', 'learning'],
  },
  {
    term: 'Risk',
    definition: 'An uncertain event or condition that, if it occurs, could have a positive or negative effect on the project.',
    cardIds: ['T3', 'process-4'],
    tags: ['risk'],
  },
  {
    term: 'Risk Appetite',
    definition: 'The level of risk an organisation or project sponsor is willing to accept in pursuit of its objectives.',
    cardIds: ['T3', 'process-4'],
    tags: ['risk', 'governance'],
  },
  {
    term: 'Risk Register',
    definition: 'A document that lists all identified risks, their likelihood and impact, and the planned responses.',
    cardIds: ['T3', 'process-4'],
    tags: ['risk'],
  },
  {
    term: 'Roadmap',
    definition: 'A high-level visual plan that shows the direction and major milestones of a project or product over time.',
    cardIds: ['T1', 'B4'],
    tags: ['planning', 'strategy'],
  },
  // S
  {
    term: 'Schedule Variance (SV)',
    definition: 'The difference between the planned value of work and the earned value. A negative SV means you are behind schedule.',
    cardIds: ['T4'],
    tags: ['schedule', 'earned value'],
  },
  {
    term: 'Scope',
    definition: 'The sum of all the work — and only the work — required to complete the project successfully.',
    cardIds: ['process-8', 'T6'],
    tags: ['scope'],
  },
  {
    term: 'Scope Creep',
    definition: 'The gradual, uncontrolled expansion of project scope without corresponding adjustments to time, cost, or resources.',
    cardIds: ['process-8', 'T6'],
    tags: ['scope', 'risk'],
  },
  {
    term: 'Scrum',
    definition: 'An Agile framework that organises work into sprints, with defined roles (Product Owner, Scrum Master, Development Team) and ceremonies.',
    cardIds: ['M2'],
    tags: ['agile', 'methodology'],
  },
  {
    term: 'Sprint',
    definition: 'A fixed-length period (usually 1–4 weeks) in Scrum during which the team completes a set of planned work items.',
    cardIds: ['M2'],
    tags: ['agile'],
  },
  {
    term: 'Stakeholder',
    definition: 'Any person or group who is affected by, or can affect, the project — including team members, clients, sponsors, and end users.',
    cardIds: ['A7', 'process-13'],
    tags: ['stakeholders'],
  },
  {
    term: 'Stakeholder Engagement',
    definition: 'The process of identifying, understanding, and actively managing the relationships with people who have an interest in the project.',
    cardIds: ['process-13', 'A7'],
    tags: ['stakeholders', 'communication'],
  },
  {
    term: 'Status Report',
    definition: 'A regular summary of project progress, covering schedule, budget, risks, and issues — shared with stakeholders.',
    cardIds: ['process-14', 'A7'],
    tags: ['communication', 'monitoring'],
  },
  {
    term: 'Story Points',
    definition: 'A unit used in Agile to estimate the relative effort or complexity of a user story, rather than time.',
    cardIds: ['M2', 'T5'],
    tags: ['agile', 'planning'],
  },
  // T
  {
    term: 'Team Charter',
    definition: 'An agreement that sets out how the team will work together — including norms, decision-making, and communication preferences.',
    cardIds: ['A3', 'A4'],
    tags: ['people', 'team'],
  },
  {
    term: 'Triple Constraint',
    definition: 'The three fundamental constraints of any project: scope, time, and cost. Changing one typically affects the others.',
    cardIds: ['T6', 'process-9'],
    tags: ['planning'],
  },
  // U
  {
    term: 'User Story',
    definition: 'A short, plain-language description of a feature from the perspective of the end user: "As a [user], I want [goal] so that [benefit]."',
    cardIds: ['M2', 'T6'],
    tags: ['agile', 'requirements'],
  },
  // V
  {
    term: 'Velocity',
    definition: 'In Agile, the average amount of work a team completes in a sprint — used to forecast how much can be done in future sprints.',
    cardIds: ['M2'],
    tags: ['agile', 'monitoring'],
  },
  {
    term: 'Vendor Management',
    definition: 'The process of selecting, contracting with, and overseeing external suppliers or service providers.',
    cardIds: ['process-12'],
    tags: ['procurement'],
  },
  // W
  {
    term: 'Waterfall',
    definition: 'A sequential project management approach where each phase (requirements, design, build, test, deploy) must be completed before the next begins.',
    cardIds: ['M1'],
    tags: ['methodology'],
  },
  {
    term: 'WBS (Work Breakdown Structure)',
    definition: 'A hierarchical breakdown of all the work needed to complete the project, divided into manageable chunks.',
    cardIds: ['T7', 'process-9'],
    tags: ['scope', 'planning'],
  },
  {
    term: 'Work Package',
    definition: 'The lowest level of the Work Breakdown Structure — a defined unit of work that can be assigned, tracked, and completed.',
    cardIds: ['T7'],
    tags: ['scope', 'planning'],
  },
];

// Get all unique first letters for the A–Z index
export function getGlossaryLetters(): string[] {
  const letters = new Set(GLOSSARY.map(t => t.term[0].toUpperCase()));
  return Array.from(letters).sort();
}

// Get terms starting with a given letter
export function getTermsByLetter(letter: string): GlossaryTerm[] {
  return GLOSSARY.filter(t => t.term[0].toUpperCase() === letter).sort((a, b) =>
    a.term.localeCompare(b.term)
  );
}

// Search terms by keyword
export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.toLowerCase();
  return GLOSSARY.filter(
    t =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      t.tags?.some(tag => tag.includes(q))
  );
}
