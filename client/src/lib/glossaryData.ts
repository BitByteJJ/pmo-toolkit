// StratAlign — Glossary Data
// 120+ project management terms with plain-English definitions and card links

export interface GlossaryTerm {
  id: string;           // unique slug, e.g. "agile"
  term: string;         // display name
  definition: string;   // plain-English, 1–3 sentences
  relatedCards: string[]; // card IDs from pmoData
  seeAlso?: string[];   // other glossary term IDs
  category: GlossaryCategory;
}

export type GlossaryCategory =
  | 'methodology'
  | 'planning'
  | 'people'
  | 'risk'
  | 'quality'
  | 'finance'
  | 'communication'
  | 'tools'
  | 'governance'
  | 'agile';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ─── A ────────────────────────────────────────────────────────────────────
  {
    id: 'acceptance-criteria',
    term: 'Acceptance Criteria',
    definition: 'The specific conditions that a deliverable must meet before a stakeholder or customer will accept it. Clear acceptance criteria prevent disputes at handover and keep scope well-defined.',
    relatedCards: ['T14', 'T7', 'A14'],
    seeAlso: ['definition-of-done', 'scope-statement'],
    category: 'planning',
  },
  {
    id: 'agile',
    term: 'Agile',
    definition: 'An iterative, incremental approach to project delivery that prioritises customer collaboration, working software, and responding to change over following a rigid plan. Agile teams work in short cycles called sprints or iterations.',
    relatedCards: ['M2', 'M4'],
    seeAlso: ['scrum', 'sprint', 'kanban', 'waterfall'],
    category: 'methodology',
  },
  {
    id: 'assumption',
    term: 'Assumption',
    definition: 'A factor treated as true for planning purposes without proof. Assumptions must be documented, monitored, and revisited — if an assumption proves false, it often becomes a risk or issue.',
    relatedCards: ['T6', 'A33'],
    seeAlso: ['risk', 'constraint'],
    category: 'planning',
  },
  {
    id: 'agile-manifesto',
    term: 'Agile Manifesto',
    definition: 'A 2001 declaration by 17 software practitioners that defines four core values and twelve principles for agile software development. It underpins Scrum, XP, Kanban, and most modern delivery frameworks.',
    relatedCards: ['M2'],
    seeAlso: ['agile', 'scrum'],
    category: 'agile',
  },
  {
    id: 'action-log',
    term: 'Action Log',
    definition: 'A running list of agreed actions, owners, and due dates captured during meetings or reviews. It ensures accountability and prevents decisions from being forgotten.',
    relatedCards: ['T11', 'A10'],
    seeAlso: ['issue-log', 'raci'],
    category: 'tools',
  },
  // ─── B ────────────────────────────────────────────────────────────────────
  {
    id: 'backlog',
    term: 'Backlog',
    definition: 'An ordered list of work items (features, bugs, improvements) that a team intends to deliver. In Scrum, the Product Backlog is owned by the Product Owner and continuously refined.',
    relatedCards: ['M2', 'T2', 'A1'],
    seeAlso: ['sprint', 'user-story', 'agile'],
    category: 'agile',
  },
  {
    id: 'baseline',
    term: 'Baseline',
    definition: 'The approved, fixed reference point for scope, schedule, or cost against which actual performance is measured. Changes to a baseline require formal change control.',
    relatedCards: ['T3', 'T4', 'A14'],
    seeAlso: ['change-control', 'earned-value'],
    category: 'planning',
  },
  {
    id: 'benefits-realisation',
    term: 'Benefits Realisation',
    definition: 'The process of ensuring that the outcomes of a project deliver the expected business benefits. It extends beyond project closure — benefits may be tracked for months or years after delivery.',
    relatedCards: ['B1', 'B4', 'phase-closure'],
    seeAlso: ['business-case', 'roi'],
    category: 'governance',
  },
  {
    id: 'burndown-chart',
    term: 'Burndown Chart',
    definition: 'A graph showing remaining work (story points or tasks) against time. A healthy burndown trends downward toward zero by the end of the sprint or project.',
    relatedCards: ['T1', 'M2'],
    seeAlso: ['velocity', 'sprint', 'agile'],
    category: 'agile',
  },
  {
    id: 'business-case',
    term: 'Business Case',
    definition: 'A document that justifies initiating a project by outlining the problem, proposed solution, costs, benefits, risks, and alternatives. It is the primary input to the project approval decision.',
    relatedCards: ['B1', 'phase-setup'],
    seeAlso: ['benefits-realisation', 'roi'],
    category: 'governance',
  },
  // ─── C ────────────────────────────────────────────────────────────────────
  {
    id: 'change-control',
    term: 'Change Control',
    definition: 'A formal process for requesting, evaluating, approving, and implementing changes to a project\'s scope, schedule, or budget. It prevents uncontrolled scope creep and protects the baseline.',
    relatedCards: ['P5', 'A14', 'T14'],
    seeAlso: ['scope-creep', 'baseline', 'change-log'],
    category: 'governance',
  },
  {
    id: 'change-log',
    term: 'Change Log',
    definition: 'A register of all change requests submitted to a project, including their status (pending, approved, rejected) and impact. It provides an audit trail for scope decisions.',
    relatedCards: ['P5', 'A14'],
    seeAlso: ['change-control', 'issue-log'],
    category: 'tools',
  },
  {
    id: 'charter',
    term: 'Project Charter',
    definition: 'A formal document that authorises a project, names the project manager, defines high-level scope and objectives, and grants the PM authority to apply resources. It is typically signed by a sponsor.',
    relatedCards: ['phase-setup', 'T14'],
    seeAlso: ['sponsor', 'scope-statement'],
    category: 'governance',
  },
  {
    id: 'constraint',
    term: 'Constraint',
    definition: 'Any limitation that restricts project options — typically time, cost, scope, quality, resources, or risk. The triple constraint (scope, time, cost) is the classic framework for understanding trade-offs.',
    relatedCards: ['T7', 'A14', 'phase-setup'],
    seeAlso: ['assumption', 'triple-constraint'],
    category: 'planning',
  },
  {
    id: 'contingency',
    term: 'Contingency',
    definition: 'Reserve time or budget set aside to handle identified risks. Known risks get contingency reserves; unknown risks get management reserves. Contingency is not "slack" — it is tied to specific risk responses.',
    relatedCards: ['T6', 'P8', 'A33'],
    seeAlso: ['risk', 'risk-register', 'management-reserve'],
    category: 'risk',
  },
  {
    id: 'critical-path',
    term: 'Critical Path',
    definition: 'The longest sequence of dependent tasks that determines the minimum project duration. Any delay on the critical path delays the whole project; tasks not on it have "float" or "slack".',
    relatedCards: ['T3', 'T4', 'A3'],
    seeAlso: ['float', 'gantt-chart', 'wbs'],
    category: 'planning',
  },
  {
    id: 'cost-variance',
    term: 'Cost Variance (CV)',
    definition: 'In Earned Value Management, CV = Earned Value − Actual Cost. A positive CV means you are under budget; negative means over budget.',
    relatedCards: ['T4', 'A5'],
    seeAlso: ['earned-value', 'schedule-variance'],
    category: 'finance',
  },
  {
    id: 'communication-plan',
    term: 'Communication Plan',
    definition: 'A document defining who needs what information, when, in what format, and through which channel. It prevents information overload and ensures the right people stay informed.',
    relatedCards: ['T16', 'P2', 'A10'],
    seeAlso: ['stakeholder-management', 'raci'],
    category: 'communication',
  },
  // ─── D ────────────────────────────────────────────────────────────────────
  {
    id: 'daily-standup',
    term: 'Daily Stand-up (Daily Scrum)',
    definition: 'A short (15-minute) daily meeting where team members share what they did yesterday, what they will do today, and any blockers. It promotes transparency and rapid impediment removal.',
    relatedCards: ['M2', 'A10', 'P1'],
    seeAlso: ['scrum', 'sprint', 'agile'],
    category: 'agile',
  },
  {
    id: 'decomposition',
    term: 'Decomposition',
    definition: 'Breaking down deliverables or project work into smaller, more manageable components. The output is typically a Work Breakdown Structure (WBS) or a product backlog.',
    relatedCards: ['T3', 'A3'],
    seeAlso: ['wbs', 'critical-path'],
    category: 'planning',
  },
  {
    id: 'definition-of-done',
    term: 'Definition of Done (DoD)',
    definition: 'A shared agreement in agile teams on what "complete" means for a user story or increment. It typically includes coding, testing, documentation, and review criteria.',
    relatedCards: ['M2', 'A1'],
    seeAlso: ['acceptance-criteria', 'user-story'],
    category: 'agile',
  },
  {
    id: 'dependency',
    term: 'Dependency',
    definition: 'A relationship between tasks where one cannot start or finish until another has started or finished. Dependencies are classified as Finish-to-Start, Start-to-Start, Finish-to-Finish, or Start-to-Finish.',
    relatedCards: ['T3', 'T4', 'A3'],
    seeAlso: ['critical-path', 'gantt-chart'],
    category: 'planning',
  },
  {
    id: 'deliverable',
    term: 'Deliverable',
    definition: 'Any unique, verifiable product, result, or capability produced to complete a process, phase, or project. Deliverables can be tangible (a report, software) or intangible (a trained team).',
    relatedCards: ['T14', 'phase-execution'],
    seeAlso: ['acceptance-criteria', 'scope-statement'],
    category: 'planning',
  },
  // ─── E ────────────────────────────────────────────────────────────────────
  {
    id: 'earned-value',
    term: 'Earned Value Management (EVM)',
    definition: 'A technique for measuring project performance by comparing planned value, earned value, and actual cost. It provides objective data on schedule and cost performance at any point in the project.',
    relatedCards: ['T4', 'A5'],
    seeAlso: ['cost-variance', 'schedule-variance', 'spi'],
    category: 'finance',
  },
  {
    id: 'escalation',
    term: 'Escalation',
    definition: 'The process of raising an issue or risk to a higher level of authority when it cannot be resolved at the current level. Escalation paths should be defined in the project governance framework.',
    relatedCards: ['P9', 'A10', 'T6'],
    seeAlso: ['issue-log', 'governance'],
    category: 'governance',
  },
  {
    id: 'epic',
    term: 'Epic',
    definition: 'A large body of work in agile that can be broken down into smaller user stories. Epics typically represent a significant feature or business objective and may span multiple sprints.',
    relatedCards: ['M2', 'A1'],
    seeAlso: ['user-story', 'backlog', 'sprint'],
    category: 'agile',
  },
  // ─── F ────────────────────────────────────────────────────────────────────
  {
    id: 'float',
    term: 'Float (Slack)',
    definition: 'The amount of time a task can be delayed without delaying the project end date (total float) or the next task (free float). Tasks on the critical path have zero float.',
    relatedCards: ['T3', 'T4', 'A3'],
    seeAlso: ['critical-path', 'dependency'],
    category: 'planning',
  },
  {
    id: 'functional-requirement',
    term: 'Functional Requirement',
    definition: 'A statement of what a system or product must do — a specific behaviour or function. Contrasted with non-functional requirements (performance, security, usability).',
    relatedCards: ['T14', 'A1', 'T7'],
    seeAlso: ['acceptance-criteria', 'user-story'],
    category: 'planning',
  },
  {
    id: 'fishbone-diagram',
    term: 'Fishbone Diagram (Ishikawa)',
    definition: 'A cause-and-effect diagram that maps potential root causes of a problem across categories (People, Process, Equipment, Materials, Environment, Management). Used in root cause analysis.',
    relatedCards: ['A8', 'A7'],
    seeAlso: ['root-cause-analysis', 'five-whys'],
    category: 'quality',
  },
  {
    id: 'five-whys',
    term: 'Five Whys',
    definition: 'A root cause analysis technique that asks "Why?" repeatedly (typically five times) to drill down from a symptom to its underlying cause. Simple but powerful for process problems.',
    relatedCards: ['A7', 'A8'],
    seeAlso: ['fishbone-diagram', 'root-cause-analysis'],
    category: 'quality',
  },
  // ─── G ────────────────────────────────────────────────────────────────────
  {
    id: 'gantt-chart',
    term: 'Gantt Chart',
    definition: 'A horizontal bar chart that displays project tasks against a timeline, showing start/end dates, durations, and dependencies. The most widely used scheduling tool in project management.',
    relatedCards: ['T1', 'T3'],
    seeAlso: ['critical-path', 'wbs', 'dependency'],
    category: 'tools',
  },
  {
    id: 'governance',
    term: 'Governance',
    definition: 'The framework of rules, responsibilities, and processes that guide how decisions are made and accountability is maintained on a project or programme. Good governance prevents scope creep and ensures alignment.',
    relatedCards: ['B2', 'B3', 'A14'],
    seeAlso: ['charter', 'steering-committee', 'raci'],
    category: 'governance',
  },
  {
    id: 'gold-plating',
    term: 'Gold Plating',
    definition: 'Adding features or enhancements beyond the agreed scope without a change request. Although well-intentioned, gold plating wastes resources and can introduce unintended risks.',
    relatedCards: ['T14', 'P5', 'A14'],
    seeAlso: ['scope-creep', 'change-control'],
    category: 'planning',
  },
  // ─── H ────────────────────────────────────────────────────────────────────
  {
    id: 'hybrid',
    term: 'Hybrid Methodology',
    definition: 'A delivery approach that combines elements of both Waterfall and Agile. For example, using a Waterfall structure for phases and governance while running sprints within each phase.',
    relatedCards: ['M4', 'AG3'],
    seeAlso: ['agile', 'waterfall', 'scrum'],
    category: 'methodology',
  },
  {
    id: 'handover',
    term: 'Handover',
    definition: 'The formal transfer of a project\'s deliverables, documentation, and operational responsibility to the receiving team or client. A structured handover reduces post-project support burden.',
    relatedCards: ['phase-closure', 'T15'],
    seeAlso: ['lessons-learned', 'project-closure'],
    category: 'governance',
  },
  // ─── I ────────────────────────────────────────────────────────────────────
  {
    id: 'issue',
    term: 'Issue',
    definition: 'A problem or concern that has already occurred and requires action. Unlike a risk (which is potential), an issue is current and needs immediate management.',
    relatedCards: ['T11', 'P9'],
    seeAlso: ['risk', 'issue-log', 'escalation'],
    category: 'risk',
  },
  {
    id: 'issue-log',
    term: 'Issue Log',
    definition: 'A register tracking all open issues on a project, including description, owner, priority, and resolution status. It ensures nothing falls through the cracks.',
    relatedCards: ['T11', 'P9'],
    seeAlso: ['issue', 'risk-register', 'action-log'],
    category: 'tools',
  },
  {
    id: 'iteration',
    term: 'Iteration',
    definition: 'A fixed-length cycle of work in agile delivery, typically 1–4 weeks, at the end of which a potentially shippable increment is produced. Also called a sprint in Scrum.',
    relatedCards: ['M2', 'M3'],
    seeAlso: ['sprint', 'agile', 'backlog'],
    category: 'agile',
  },
  // ─── K ────────────────────────────────────────────────────────────────────
  {
    id: 'kanban',
    term: 'Kanban',
    definition: 'A visual workflow management method that limits work-in-progress (WIP) to improve flow and reduce bottlenecks. Work items move through columns (To Do → In Progress → Done) on a Kanban board.',
    relatedCards: ['M3', 'T2'],
    seeAlso: ['wip-limit', 'agile', 'lean'],
    category: 'methodology',
  },
  {
    id: 'kpi',
    term: 'KPI (Key Performance Indicator)',
    definition: 'A measurable value that shows how effectively a project or organisation is achieving its key objectives. Good KPIs are specific, measurable, and time-bound.',
    relatedCards: ['T4', 'T12', 'B1'],
    seeAlso: ['earned-value', 'milestone'],
    category: 'governance',
  },
  {
    id: 'kickoff-meeting',
    term: 'Kick-off Meeting',
    definition: 'The first formal meeting of a project team and stakeholders, used to align on objectives, roles, approach, and expectations. A well-run kick-off sets the tone for the entire project.',
    relatedCards: ['phase-setup', 'P2', 'A10'],
    seeAlso: ['charter', 'stakeholder-management'],
    category: 'communication',
  },
  // ─── L ────────────────────────────────────────────────────────────────────
  {
    id: 'lean',
    term: 'Lean',
    definition: 'A philosophy focused on eliminating waste and maximising value for the customer. Originating in Toyota\'s manufacturing system, Lean principles underpin Kanban and many agile practices.',
    relatedCards: ['M3', 'A6', 'A8'],
    seeAlso: ['kanban', 'value-stream', 'waste'],
    category: 'methodology',
  },
  {
    id: 'lessons-learned',
    term: 'Lessons Learned',
    definition: 'Knowledge gained from project experience — what went well, what went wrong, and what should be done differently. Capturing lessons learned improves future projects and builds organisational knowledge.',
    relatedCards: ['phase-closure', 'T15', 'A30'],
    seeAlso: ['retrospective', 'handover'],
    category: 'governance',
  },
  {
    id: 'lessons-learned-register',
    term: 'Lessons Learned Register',
    definition: 'A document or database where lessons learned are recorded throughout the project (not just at closure). Regular updates ensure insights are captured while still fresh.',
    relatedCards: ['T15', 'phase-closure'],
    seeAlso: ['lessons-learned', 'retrospective'],
    category: 'tools',
  },
  // ─── M ────────────────────────────────────────────────────────────────────
  {
    id: 'management-reserve',
    term: 'Management Reserve',
    definition: 'Budget set aside for unknown risks ("unknown unknowns") that are outside the project baseline. Unlike contingency, management reserve is controlled by senior management and requires formal approval to access.',
    relatedCards: ['P8', 'T6'],
    seeAlso: ['contingency', 'risk'],
    category: 'finance',
  },
  {
    id: 'milestone',
    term: 'Milestone',
    definition: 'A significant point or event in a project, such as the completion of a phase or delivery of a key output. Milestones have zero duration — they mark a moment, not a period of work.',
    relatedCards: ['T1', 'T3', 'phase-execution'],
    seeAlso: ['gantt-chart', 'critical-path'],
    category: 'planning',
  },
  {
    id: 'moscow',
    term: 'MoSCoW Prioritisation',
    definition: 'A prioritisation technique that classifies requirements as Must Have, Should Have, Could Have, or Won\'t Have. It helps teams agree on scope and manage trade-offs under time or budget pressure.',
    relatedCards: ['T7'],
    seeAlso: ['backlog', 'scope-statement', 'acceptance-criteria'],
    category: 'planning',
  },
  {
    id: 'monte-carlo',
    term: 'Monte Carlo Simulation',
    definition: 'A quantitative risk analysis technique that runs thousands of simulations using probability distributions for task durations or costs to produce a range of likely project outcomes.',
    relatedCards: ['A33', 'T6'],
    seeAlso: ['risk', 'contingency', 'sensitivity-analysis'],
    category: 'risk',
  },
  // ─── N ────────────────────────────────────────────────────────────────────
  {
    id: 'nfr',
    term: 'Non-Functional Requirement (NFR)',
    definition: 'A requirement that specifies how a system should behave rather than what it should do — covering performance, security, reliability, scalability, and usability.',
    relatedCards: ['T14', 'A1'],
    seeAlso: ['functional-requirement', 'acceptance-criteria'],
    category: 'planning',
  },
  // ─── O ────────────────────────────────────────────────────────────────────
  {
    id: 'ogc-gateway',
    term: 'OGC Gateway Review',
    definition: 'A peer review process used in UK public sector projects at key decision points (gates) to assess readiness to proceed. It provides independent assurance before major commitments are made.',
    relatedCards: ['B2', 'B3'],
    seeAlso: ['governance', 'stage-gate'],
    category: 'governance',
  },
  {
    id: 'organisational-change',
    term: 'Organisational Change Management (OCM)',
    definition: 'A structured approach to transitioning individuals, teams, and organisations from a current state to a desired future state. OCM focuses on the people side of change — communication, training, and resistance management.',
    relatedCards: ['B4', 'A25', 'A26'],
    seeAlso: ['change-control', 'stakeholder-management'],
    category: 'people',
  },
  {
    id: 'opportunity',
    term: 'Opportunity',
    definition: 'A risk with a positive potential impact on project objectives. Risk management covers both threats (negative risks) and opportunities (positive risks) — opportunities should be exploited, enhanced, or shared.',
    relatedCards: ['T6', 'A33'],
    seeAlso: ['risk', 'risk-register'],
    category: 'risk',
  },
  // ─── P ────────────────────────────────────────────────────────────────────
  {
    id: 'pdca',
    term: 'PDCA Cycle (Plan-Do-Check-Act)',
    definition: 'A four-step quality improvement cycle: Plan (identify the problem and plan a solution), Do (implement it on a small scale), Check (measure results), Act (standardise or adjust). Also called the Deming Cycle.',
    relatedCards: ['A6'],
    seeAlso: ['lean', 'kaizen', 'root-cause-analysis'],
    category: 'quality',
  },
  {
    id: 'pert',
    term: 'PERT (Programme Evaluation and Review Technique)',
    definition: 'A scheduling technique that uses three-point estimates (optimistic, most likely, pessimistic) to calculate expected task durations and model schedule uncertainty.',
    relatedCards: ['T3', 'A3', 'A33'],
    seeAlso: ['critical-path', 'three-point-estimate'],
    category: 'planning',
  },
  {
    id: 'portfolio',
    term: 'Portfolio',
    definition: 'A collection of projects, programmes, and operations managed as a group to achieve strategic objectives. Portfolio management prioritises investments and balances capacity across initiatives.',
    relatedCards: ['B1', 'B2'],
    seeAlso: ['programme', 'governance'],
    category: 'governance',
  },
  {
    id: 'programme',
    term: 'Programme',
    definition: 'A group of related projects managed in a coordinated way to obtain benefits and control that would not be available from managing them individually.',
    relatedCards: ['B1', 'B2'],
    seeAlso: ['portfolio', 'governance'],
    category: 'governance',
  },
  {
    id: 'project-closure',
    term: 'Project Closure',
    definition: 'The formal process of completing and closing a project, including final deliverable acceptance, lessons learned, team release, and contract closure. A structured closure prevents lingering obligations.',
    relatedCards: ['phase-closure', 'T15'],
    seeAlso: ['handover', 'lessons-learned'],
    category: 'governance',
  },
  {
    id: 'procurement',
    term: 'Procurement',
    definition: 'The process of acquiring goods, services, or results from outside the project team. It includes planning, soliciting bids, selecting suppliers, and managing contracts.',
    relatedCards: ['P17', 'A14'],
    seeAlso: ['contract', 'vendor-management'],
    category: 'governance',
  },
  {
    id: 'product-owner',
    term: 'Product Owner',
    definition: 'In Scrum, the person responsible for maximising the value of the product by managing and prioritising the product backlog. The Product Owner represents stakeholder interests to the development team.',
    relatedCards: ['M2', 'A1'],
    seeAlso: ['scrum', 'backlog', 'sprint'],
    category: 'agile',
  },
  // ─── Q ────────────────────────────────────────────────────────────────────
  {
    id: 'quality-assurance',
    term: 'Quality Assurance (QA)',
    definition: 'Planned and systematic activities that ensure quality requirements will be fulfilled. QA is proactive — it focuses on preventing defects through process improvement, not just finding them.',
    relatedCards: ['P14', 'A6', 'A8'],
    seeAlso: ['quality-control', 'pdca'],
    category: 'quality',
  },
  {
    id: 'quality-control',
    term: 'Quality Control (QC)',
    definition: 'The operational techniques and activities used to monitor and verify that deliverables meet quality standards. QC is reactive — it checks outputs against requirements.',
    relatedCards: ['P14', 'T12'],
    seeAlso: ['quality-assurance', 'acceptance-criteria'],
    category: 'quality',
  },
  // ─── R ────────────────────────────────────────────────────────────────────
  {
    id: 'raci',
    term: 'RACI Matrix',
    definition: 'A responsibility assignment matrix that maps tasks to roles: Responsible (does the work), Accountable (owns the outcome), Consulted (provides input), Informed (kept up to date). It clarifies who does what.',
    relatedCards: ['T16'],
    seeAlso: ['stakeholder-management', 'communication-plan'],
    category: 'people',
  },
  {
    id: 'retrospective',
    term: 'Retrospective',
    definition: 'A regular team meeting (typically at the end of each sprint) to reflect on what went well, what could be improved, and what actions to take. It is the engine of continuous improvement in agile teams.',
    relatedCards: ['M2', 'A30', 'P1'],
    seeAlso: ['lessons-learned', 'agile', 'sprint'],
    category: 'agile',
  },
  {
    id: 'risk',
    term: 'Risk',
    definition: 'An uncertain event or condition that, if it occurs, has a positive or negative effect on project objectives. Risks are characterised by probability and impact.',
    relatedCards: ['T6', 'A33'],
    seeAlso: ['risk-register', 'contingency', 'opportunity'],
    category: 'risk',
  },
  {
    id: 'risk-appetite',
    term: 'Risk Appetite',
    definition: 'The level of risk an organisation or project sponsor is willing to accept in pursuit of its objectives. Understanding risk appetite guides decisions about which risks to accept, mitigate, or escalate.',
    relatedCards: ['T6', 'A33', 'B3'],
    seeAlso: ['risk', 'risk-register'],
    category: 'risk',
  },
  {
    id: 'risk-register',
    term: 'Risk Register',
    definition: 'A document that records identified risks, their probability and impact ratings, owners, and planned responses. It is a living document updated throughout the project.',
    relatedCards: ['T6'],
    seeAlso: ['risk', 'contingency', 'issue-log'],
    category: 'tools',
  },
  {
    id: 'roi',
    term: 'Return on Investment (ROI)',
    definition: 'A measure of the financial return from a project relative to its cost, expressed as a percentage. ROI = (Net Benefit ÷ Cost) × 100. It is a key input to the business case.',
    relatedCards: ['B1', 'T4'],
    seeAlso: ['business-case', 'benefits-realisation'],
    category: 'finance',
  },
  {
    id: 'root-cause-analysis',
    term: 'Root Cause Analysis (RCA)',
    definition: 'A systematic process for identifying the fundamental cause of a problem, rather than treating symptoms. Common tools include the Five Whys, fishbone diagrams, and fault tree analysis.',
    relatedCards: ['A7', 'A8'],
    seeAlso: ['five-whys', 'fishbone-diagram'],
    category: 'quality',
  },
  // ─── S ────────────────────────────────────────────────────────────────────
  {
    id: 'schedule-variance',
    term: 'Schedule Variance (SV)',
    definition: 'In Earned Value Management, SV = Earned Value − Planned Value. A positive SV means the project is ahead of schedule; negative means behind.',
    relatedCards: ['T4', 'A5'],
    seeAlso: ['earned-value', 'cost-variance'],
    category: 'finance',
  },
  {
    id: 'scope-creep',
    term: 'Scope Creep',
    definition: 'The uncontrolled expansion of project scope without adjusting time, cost, or resources. It is one of the most common causes of project failure and is prevented through rigorous change control.',
    relatedCards: ['T14', 'P5', 'A14'],
    seeAlso: ['change-control', 'gold-plating', 'scope-statement'],
    category: 'planning',
  },
  {
    id: 'scope-statement',
    term: 'Scope Statement',
    definition: 'A document that defines the project\'s deliverables, boundaries, and what is explicitly excluded. It forms the basis for all scope-related decisions and change control.',
    relatedCards: ['T14'],
    seeAlso: ['scope-creep', 'wbs', 'acceptance-criteria'],
    category: 'planning',
  },
  {
    id: 'scrum',
    term: 'Scrum',
    definition: 'An agile framework for developing complex products in short iterations called sprints. Scrum defines three roles (Product Owner, Scrum Master, Development Team), five events, and three artefacts.',
    relatedCards: ['M2'],
    seeAlso: ['sprint', 'backlog', 'agile', 'daily-standup'],
    category: 'agile',
  },
  {
    id: 'scrum-master',
    term: 'Scrum Master',
    definition: 'The servant-leader of a Scrum team, responsible for facilitating Scrum events, removing impediments, and coaching the team on agile practices. The Scrum Master does not manage the team.',
    relatedCards: ['M2'],
    seeAlso: ['scrum', 'product-owner', 'agile'],
    category: 'agile',
  },
  {
    id: 'sensitivity-analysis',
    term: 'Sensitivity Analysis',
    definition: 'A technique for identifying which risks have the greatest potential impact on project outcomes by varying one input at a time. Results are often displayed as a tornado diagram.',
    relatedCards: ['A33', 'T6'],
    seeAlso: ['monte-carlo', 'risk'],
    category: 'risk',
  },
  {
    id: 'spi',
    term: 'Schedule Performance Index (SPI)',
    definition: 'In Earned Value Management, SPI = Earned Value ÷ Planned Value. An SPI above 1.0 means ahead of schedule; below 1.0 means behind.',
    relatedCards: ['T4', 'A5'],
    seeAlso: ['earned-value', 'schedule-variance'],
    category: 'finance',
  },
  {
    id: 'sponsor',
    term: 'Project Sponsor',
    definition: 'The senior individual who champions the project, provides funding, and is ultimately accountable for its success. The sponsor resolves issues that exceed the project manager\'s authority.',
    relatedCards: ['phase-setup', 'B1', 'P2'],
    seeAlso: ['stakeholder-management', 'charter'],
    category: 'people',
  },
  {
    id: 'sprint',
    term: 'Sprint',
    definition: 'A fixed-length iteration in Scrum (typically 1–4 weeks) during which a potentially shippable product increment is created. Sprints have a fixed goal and scope that should not change once started.',
    relatedCards: ['M2', 'A1'],
    seeAlso: ['scrum', 'backlog', 'velocity'],
    category: 'agile',
  },
  {
    id: 'stage-gate',
    term: 'Stage Gate',
    definition: 'A decision point between project phases where a governance body reviews progress and decides whether to continue, modify, or stop the project. Also called a phase gate or toll gate.',
    relatedCards: ['B2', 'B3', 'phase-execution'],
    seeAlso: ['governance', 'ogc-gateway'],
    category: 'governance',
  },
  {
    id: 'stakeholder',
    term: 'Stakeholder',
    definition: 'Any individual, group, or organisation that may affect, be affected by, or perceive itself to be affected by a project. Effective stakeholder management is critical to project success.',
    relatedCards: ['T16', 'P2', 'A10'],
    seeAlso: ['stakeholder-management', 'raci', 'communication-plan'],
    category: 'people',
  },
  {
    id: 'stakeholder-management',
    term: 'Stakeholder Management',
    definition: 'The process of identifying stakeholders, understanding their interests and influence, and developing strategies to engage them effectively throughout the project.',
    relatedCards: ['T16', 'P2', 'A10'],
    seeAlso: ['stakeholder', 'raci', 'communication-plan'],
    category: 'people',
  },
  {
    id: 'steering-committee',
    term: 'Steering Committee',
    definition: 'A group of senior stakeholders and decision-makers who provide strategic oversight and governance for a project or programme. They approve major changes and resolve escalated issues.',
    relatedCards: ['B2', 'B3', 'P2'],
    seeAlso: ['governance', 'sponsor', 'stage-gate'],
    category: 'governance',
  },
  {
    id: 'story-point',
    term: 'Story Point',
    definition: 'A unit used in agile to estimate the relative effort of a user story. Story points are abstract (not hours) and account for complexity, risk, and uncertainty. Teams calibrate their own scale.',
    relatedCards: ['M2', 'A1'],
    seeAlso: ['user-story', 'velocity', 'sprint'],
    category: 'agile',
  },
  {
    id: 'swot',
    term: 'SWOT Analysis',
    definition: 'A strategic planning tool that identifies Strengths, Weaknesses, Opportunities, and Threats. In project management, SWOT is used during initiation to assess the project environment.',
    relatedCards: ['A34', 'phase-setup'],
    seeAlso: ['risk', 'pestle'],
    category: 'planning',
  },
  // ─── T ────────────────────────────────────────────────────────────────────
  {
    id: 'three-point-estimate',
    term: 'Three-Point Estimate',
    definition: 'An estimation technique using optimistic (O), most likely (M), and pessimistic (P) values to calculate expected duration: (O + 4M + P) ÷ 6. It accounts for uncertainty better than single-point estimates.',
    relatedCards: ['T3', 'A3', 'A33'],
    seeAlso: ['pert', 'critical-path'],
    category: 'planning',
  },
  {
    id: 'timeboxing',
    term: 'Timeboxing',
    definition: 'Allocating a fixed, maximum amount of time to an activity or phase. If the work is not complete when the timebox expires, the team delivers what is ready and moves on. It prevents analysis paralysis.',
    relatedCards: ['A35', 'M2'],
    seeAlso: ['sprint', 'agile'],
    category: 'agile',
  },
  {
    id: 'triple-constraint',
    term: 'Triple Constraint (Iron Triangle)',
    definition: 'The three competing constraints of scope, time, and cost that define project boundaries. Changing one constraint forces trade-offs with the others. Quality is sometimes added as a fourth dimension.',
    relatedCards: ['T7', 'A14', 'phase-setup'],
    seeAlso: ['constraint', 'scope-creep'],
    category: 'planning',
  },
  // ─── U ────────────────────────────────────────────────────────────────────
  {
    id: 'user-story',
    term: 'User Story',
    definition: 'A short, simple description of a feature from the perspective of the end user: "As a [role], I want [goal] so that [benefit]." User stories are the primary unit of work in agile backlogs.',
    relatedCards: ['M2', 'A1', 'T7'],
    seeAlso: ['backlog', 'acceptance-criteria', 'epic'],
    category: 'agile',
  },
  // ─── V ────────────────────────────────────────────────────────────────────
  {
    id: 'value-stream',
    term: 'Value Stream',
    definition: 'The sequence of activities required to deliver a product or service to a customer. Value stream mapping identifies waste (non-value-adding steps) and opportunities for improvement.',
    relatedCards: ['A6', 'M3'],
    seeAlso: ['lean', 'kanban'],
    category: 'quality',
  },
  {
    id: 'velocity',
    term: 'Velocity',
    definition: 'The average amount of work (in story points) a Scrum team completes per sprint. Velocity is used to forecast how much work can be completed in future sprints.',
    relatedCards: ['M2', 'T1'],
    seeAlso: ['story-point', 'sprint', 'burndown-chart'],
    category: 'agile',
  },
  {
    id: 'vendor-management',
    term: 'Vendor Management',
    definition: 'The process of selecting, contracting, monitoring, and closing out relationships with external suppliers. Effective vendor management ensures third-party work meets quality, cost, and schedule requirements.',
    relatedCards: ['P17', 'T16'],
    seeAlso: ['procurement', 'stakeholder-management'],
    category: 'governance',
  },
  // ─── W ────────────────────────────────────────────────────────────────────
  {
    id: 'waterfall',
    term: 'Waterfall',
    definition: 'A sequential, phase-based delivery methodology where each phase (requirements, design, build, test, deploy) must be completed before the next begins. Best suited to projects with stable, well-defined requirements.',
    relatedCards: ['M1'],
    seeAlso: ['agile', 'hybrid', 'critical-path'],
    category: 'methodology',
  },
  {
    id: 'wbs',
    term: 'Work Breakdown Structure (WBS)',
    definition: 'A hierarchical decomposition of the total project scope into manageable work packages. The WBS is the foundation for scheduling, cost estimating, and resource planning.',
    relatedCards: ['T3'],
    seeAlso: ['decomposition', 'critical-path', 'gantt-chart'],
    category: 'planning',
  },
  {
    id: 'wip-limit',
    term: 'WIP Limit (Work-in-Progress Limit)',
    definition: 'A constraint on the maximum number of work items allowed in a given stage of a Kanban workflow. WIP limits expose bottlenecks and improve flow by preventing multitasking.',
    relatedCards: ['M3', 'T2'],
    seeAlso: ['kanban', 'lean'],
    category: 'agile',
  },
  {
    id: 'workshop',
    term: 'Workshop (Facilitated)',
    definition: 'A structured, time-boxed meeting designed to achieve a specific outcome — such as requirements elicitation, risk identification, or retrospective. Skilled facilitation is key to a productive workshop.',
    relatedCards: ['A10', 'A11', 'P1'],
    seeAlso: ['stakeholder-management', 'timeboxing'],
    category: 'communication',
  },
  // ─── Z ────────────────────────────────────────────────────────────────────
  {
    id: 'zero-defect',
    term: 'Zero Defect',
    definition: 'A quality management philosophy, popularised by Philip Crosby, that aims to eliminate defects entirely rather than accepting an acceptable quality level. It emphasises getting things right first time.',
    relatedCards: ['A6', 'P14'],
    seeAlso: ['quality-assurance', 'pdca'],
    category: 'quality',
  },
  // ─── Additional terms ─────────────────────────────────────────────────────
  {
    id: 'kaizen',
    term: 'Kaizen',
    definition: 'Japanese for "continuous improvement." A philosophy of making small, incremental improvements to processes every day. In project management, kaizen is embodied in retrospectives and PDCA cycles.',
    relatedCards: ['A6', 'A30'],
    seeAlso: ['pdca', 'lean', 'retrospective'],
    category: 'quality',
  },
  {
    id: 'pestle',
    term: 'PESTLE Analysis',
    definition: 'A framework for analysing the macro-environment affecting a project or organisation: Political, Economic, Social, Technological, Legal, and Environmental factors.',
    relatedCards: ['A34', 'B3'],
    seeAlso: ['swot', 'risk'],
    category: 'planning',
  },
  {
    id: 'definition-of-ready',
    term: 'Definition of Ready (DoR)',
    definition: 'A checklist of criteria a user story must meet before it can be pulled into a sprint. A strong DoR prevents teams from starting work on poorly defined stories.',
    relatedCards: ['M2', 'A1'],
    seeAlso: ['definition-of-done', 'user-story', 'backlog'],
    category: 'agile',
  },
  {
    id: 'contract',
    term: 'Contract',
    definition: 'A legally binding agreement between a buyer and seller that defines the work to be performed, deliverables, payment terms, and conditions. Contract type (fixed-price, time-and-materials, cost-reimbursable) affects risk allocation.',
    relatedCards: ['P17', 'B2'],
    seeAlso: ['procurement', 'vendor-management'],
    category: 'governance',
  },
  {
    id: 'waste',
    term: 'Waste (Muda)',
    definition: 'In Lean, any activity that consumes resources without adding value for the customer. The seven wastes (TIM WOOD) are: Transport, Inventory, Motion, Waiting, Overproduction, Over-processing, and Defects.',
    relatedCards: ['A6', 'M3'],
    seeAlso: ['lean', 'value-stream', 'kaizen'],
    category: 'quality',
  },
];

// ─── Lookup helpers ────────────────────────────────────────────────────────────

export function getTermById(id: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find(t => t.id === id);
}

export function getTermsByLetter(letter: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter(t => t.term.toUpperCase().startsWith(letter.toUpperCase()))
    .sort((a, b) => a.term.localeCompare(b.term));
}

export function searchTerms(query: string): GlossaryTerm[] {
  const q = query.toLowerCase();
  return GLOSSARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(q) ||
    t.definition.toLowerCase().includes(q)
  ).sort((a, b) => a.term.localeCompare(b.term));
}

export function getTermsForCard(cardId: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter(t => t.relatedCards.includes(cardId));
}

export const GLOSSARY_LETTERS: string[] = Array.from(
  new Set(GLOSSARY_TERMS.map(t => t.term[0].toUpperCase()))
).sort();

export const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  methodology: 'Methodology',
  planning: 'Planning',
  people: 'People',
  risk: 'Risk',
  quality: 'Quality',
  finance: 'Finance',
  communication: 'Communication',
  tools: 'Tools',
  governance: 'Governance',
  agile: 'Agile',
};

export const CATEGORY_COLORS: Record<GlossaryCategory, { bg: string; text: string; border: string }> = {
  methodology: { bg: '#EEF2FF', text: '#4F46E5', border: '#4F46E5' },
  planning:    { bg: '#FEF3C7', text: '#92400E', border: '#D97706' },
  people:      { bg: '#FFE4E6', text: '#881337', border: '#E11D48' },
  risk:        { bg: '#FEF9C3', text: '#713F12', border: '#CA8A04' },
  quality:     { bg: '#DCFCE7', text: '#14532D', border: '#16A34A' },
  finance:     { bg: '#D1FAE5', text: '#064E3B', border: '#059669' },
  communication: { bg: '#E0F2FE', text: '#0C4A6E', border: '#0284C7' },
  tools:       { bg: '#F1F5F9', text: '#1E293B', border: '#475569' },
  governance:  { bg: '#EDE9FE', text: '#4C1D95', border: '#7C3AED' },
  agile:       { bg: '#CCFBF1', text: '#134E4A', border: '#0D9488' },
};
