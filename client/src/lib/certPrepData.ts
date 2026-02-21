// Certification Prep Data — PMP, PRINCE2, APM exam-style questions

export type CertType = 'pmp' | 'prince2' | 'apm';

export interface CertQuestion {
  id: string;
  cert: CertType;
  domain: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  cardRef?: string; // linked card ID
}

export interface CertExam {
  id: CertType;
  name: string;
  fullName: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  description: string;
  questionCount: number;
  timeMinutes: number;
  domains: string[];
}

export const CERT_EXAMS: CertExam[] = [
  {
    id: 'pmp',
    name: 'PMP',
    fullName: 'Project Management Professional',
    color: '#0284C7',
    bgColor: '#EFF6FF',
    textColor: '#1E3A5F',
    icon: '🏆',
    description: 'The gold standard in project management certification, covering predictive, agile, and hybrid approaches.',
    questionCount: 180,
    timeMinutes: 230,
    domains: ['People', 'Process', 'Business Environment'],
  },
  {
    id: 'prince2',
    name: 'PRINCE2',
    fullName: 'Projects IN Controlled Environments',
    color: '#059669',
    bgColor: '#ECFDF5',
    textColor: '#064E3B',
    icon: '👑',
    description: 'A structured project management method widely used in the UK and internationally, focused on governance and control.',
    questionCount: 60,
    timeMinutes: 60,
    domains: ['Principles', 'Themes', 'Processes', 'Tailoring'],
  },
  {
    id: 'apm',
    name: 'APM PMQ',
    fullName: 'APM Project Management Qualification',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    textColor: '#3B0764',
    icon: '📋',
    description: 'The APM Project Management Qualification (PMQ) is a knowledge-based qualification for project professionals.',
    questionCount: 60,
    timeMinutes: 120,
    domains: ['Context', 'Planning', 'Execution', 'Governance'],
  },
];

export const CERT_QUESTIONS: CertQuestion[] = [
  // ── PMP QUESTIONS ──
  // People domain
  {
    id: 'pmp-p-001',
    cert: 'pmp',
    domain: 'People',
    question: 'A project manager notices that two team members are in conflict over the approach to a technical problem. What is the BEST first step?',
    options: [
      'Escalate the conflict to the project sponsor immediately',
      'Facilitate a meeting between the two team members to understand each perspective',
      'Make a unilateral decision on the approach to resolve the conflict',
      'Ignore the conflict and hope it resolves itself',
    ],
    correctIndex: 1,
    explanation: 'The best approach is to facilitate a collaborative discussion. Direct confrontation between parties with a neutral mediator (the PM) is the most effective conflict resolution technique. Escalation should only happen if internal resolution fails.',
    cardRef: 'people-5',
  },
  {
    id: 'pmp-p-002',
    cert: 'pmp',
    domain: 'People',
    question: 'Which leadership style is MOST appropriate when team members are highly skilled and motivated?',
    options: [
      'Directing — telling team members exactly what to do',
      'Coaching — providing guidance and feedback',
      'Delegating — assigning tasks with minimal oversight',
      'Supporting — focusing on team relationships',
    ],
    correctIndex: 2,
    explanation: 'With highly skilled and motivated team members, a delegating style is most effective. The Situational Leadership model (Hersey & Blanchard) indicates that high competence + high commitment = delegate. Micromanagement would be counterproductive.',
    cardRef: 'archetypes-1',
  },
  {
    id: 'pmp-p-003',
    cert: 'pmp',
    domain: 'People',
    question: 'A new project manager joins a project that is already underway. The team seems disengaged and productivity is low. What should the PM do FIRST?',
    options: [
      'Replace underperforming team members',
      'Conduct a team assessment to understand the root cause of disengagement',
      'Implement a new incentive scheme immediately',
      'Escalate the performance issues to HR',
    ],
    correctIndex: 1,
    explanation: 'Before taking any action, the PM should diagnose the root cause. Disengagement can stem from many sources — unclear goals, poor communication, lack of recognition, or external factors. Jumping to solutions without understanding the problem often makes things worse.',
    cardRef: 'people-3',
  },
  {
    id: 'pmp-p-004',
    cert: 'pmp',
    domain: 'People',
    question: 'During a retrospective, a team member raises a concern that was also raised in the previous three retrospectives but never addressed. What should the project manager do?',
    options: [
      'Add it to the backlog for future consideration',
      'Acknowledge the concern and explain why it has not been addressed',
      'Create an action item with a specific owner and due date, and follow up at the next retrospective',
      'Ask the team member to submit a formal change request',
    ],
    correctIndex: 2,
    explanation: 'Retrospectives are only valuable if they lead to action. A recurring unaddressed concern signals a process failure. The PM should assign a specific owner and deadline, then verify completion — this is the "inspect and adapt" principle in practice.',
    cardRef: 'process-13',
  },
  {
    id: 'pmp-p-005',
    cert: 'pmp',
    domain: 'People',
    question: 'A stakeholder who was not engaged early in the project is now raising significant objections during execution. What is the BEST approach?',
    options: [
      'Proceed with the project and document the stakeholder\'s objections',
      'Pause the project until the stakeholder approves the approach',
      'Schedule a meeting to understand the stakeholder\'s concerns and explore options',
      'Escalate to the project sponsor to manage the stakeholder',
    ],
    correctIndex: 2,
    explanation: 'Late-emerging stakeholder concerns are best addressed through direct engagement. Understanding their specific objections may reveal legitimate issues that can be addressed, or allow the PM to explain constraints that make changes difficult. Escalation is a last resort.',
    cardRef: 'people-7',
  },
  // Process domain
  {
    id: 'pmp-pr-001',
    cert: 'pmp',
    domain: 'Process',
    question: 'A project\'s Earned Value (EV) is $80,000 and the Planned Value (PV) is $100,000. The Actual Cost (AC) is $90,000. What does this tell you?',
    options: [
      'The project is ahead of schedule and under budget',
      'The project is behind schedule and over budget',
      'The project is behind schedule but under budget',
      'The project is ahead of schedule but over budget',
    ],
    correctIndex: 1,
    explanation: 'Schedule Variance (SV) = EV - PV = $80k - $100k = -$20k (behind schedule). Cost Variance (CV) = EV - AC = $80k - $90k = -$10k (over budget). Both variances are negative, indicating the project is behind schedule AND over budget.',
    cardRef: 'T4',
  },
  {
    id: 'pmp-pr-002',
    cert: 'pmp',
    domain: 'Process',
    question: 'Which risk response strategy involves shifting the negative impact of a risk to a third party?',
    options: [
      'Avoid',
      'Mitigate',
      'Transfer',
      'Accept',
    ],
    correctIndex: 2,
    explanation: 'Transfer involves shifting the financial impact of a risk to a third party (e.g., insurance, fixed-price contracts). The risk itself is not eliminated — the responsibility for managing it is transferred. Common examples include insurance and outsourcing.',
    cardRef: 'T6',
  },
  {
    id: 'pmp-pr-003',
    cert: 'pmp',
    domain: 'Process',
    question: 'A project manager is creating a schedule. Which technique shows the longest path through the project network and determines the minimum project duration?',
    options: [
      'Gantt Chart',
      'Critical Path Method (CPM)',
      'Program Evaluation and Review Technique (PERT)',
      'Resource Levelling',
    ],
    correctIndex: 1,
    explanation: 'The Critical Path Method (CPM) identifies the longest sequence of dependent tasks (the critical path), which determines the minimum project duration. Any delay to a critical path task delays the entire project. Float/slack is zero on the critical path.',
    cardRef: 'T2',
  },
  {
    id: 'pmp-pr-004',
    cert: 'pmp',
    domain: 'Process',
    question: 'In agile projects, what is the PRIMARY purpose of a sprint review?',
    options: [
      'To assess team performance and identify underperformers',
      'To inspect the increment and adapt the product backlog based on stakeholder feedback',
      'To plan the next sprint\'s tasks and assign story points',
      'To retrospectively review the team\'s processes and identify improvements',
    ],
    correctIndex: 1,
    explanation: 'The sprint review is an inspect-and-adapt event focused on the product. The team demonstrates the increment to stakeholders, who provide feedback that may lead to backlog adjustments. It is NOT a performance review (that\'s the retrospective) or planning session.',
    cardRef: 'M5',
  },
  {
    id: 'pmp-pr-005',
    cert: 'pmp',
    domain: 'Process',
    question: 'A project manager discovers that a key deliverable does not meet the quality standards defined in the project plan. What should they do FIRST?',
    options: [
      'Deliver the product and document the defect for future improvement',
      'Conduct a root cause analysis to understand why the quality standard was not met',
      'Immediately escalate to the project sponsor',
      'Renegotiate the quality standards with the customer',
    ],
    correctIndex: 1,
    explanation: 'Before taking corrective action, the PM must understand why the quality failure occurred. Root cause analysis (e.g., Fishbone/Ishikawa diagram, 5 Whys) prevents recurrence. Delivering a substandard product without investigation risks repeating the problem.',
    cardRef: 'T9',
  },
  // Business Environment domain
  {
    id: 'pmp-be-001',
    cert: 'pmp',
    domain: 'Business Environment',
    question: 'A project has been approved and is aligned with the organisation\'s strategic objectives. Midway through, the business strategy changes. What should the project manager do?',
    options: [
      'Continue the project as planned since it was already approved',
      'Immediately stop the project',
      'Conduct a benefits realisation review to assess whether the project still delivers value',
      'Ask the team to adapt the deliverables without formal approval',
    ],
    correctIndex: 2,
    explanation: 'Projects exist to deliver business value. When strategy changes, the PM should assess whether the project still aligns with the new direction. A benefits realisation review provides the data to make an informed decision — continue, modify, or terminate.',
    cardRef: 'business-1',
  },
  {
    id: 'pmp-be-002',
    cert: 'pmp',
    domain: 'Business Environment',
    question: 'Which document formally authorises a project and gives the project manager the authority to apply organisational resources?',
    options: [
      'Project Management Plan',
      'Project Charter',
      'Statement of Work',
      'Business Case',
    ],
    correctIndex: 1,
    explanation: 'The Project Charter is the document that formally authorises a project. It names the project manager, defines high-level scope and objectives, and grants the PM authority to use resources. It is signed by the project sponsor.',
    cardRef: 'phases-1',
  },
  {
    id: 'pmp-be-003',
    cert: 'pmp',
    domain: 'Business Environment',
    question: 'An organisation is transitioning from waterfall to agile. A project manager is asked to lead a hybrid project. What is the MOST important consideration?',
    options: [
      'Ensuring all team members are certified in agile methodologies',
      'Tailoring the approach to fit the project\'s specific needs and organisational context',
      'Using agile for all aspects of the project to demonstrate commitment to the transition',
      'Getting approval from the PMO before using any agile practices',
    ],
    correctIndex: 1,
    explanation: 'Hybrid approaches should be tailored to the project context. Not all aspects of a project benefit equally from agile or waterfall. The PM\'s role is to select the right tools and techniques for each situation, not to apply a methodology dogmatically.',
    cardRef: 'M7',
  },
  // ── PRINCE2 QUESTIONS ──
  {
    id: 'p2-001',
    cert: 'prince2',
    domain: 'Principles',
    question: 'Which PRINCE2 principle states that a project must have a justifiable reason to start and that justification must remain valid throughout the project?',
    options: [
      'Manage by stages',
      'Continued business justification',
      'Learn from experience',
      'Focus on products',
    ],
    correctIndex: 1,
    explanation: 'Continued Business Justification is a core PRINCE2 principle. The business case must be valid at the start, reviewed at each stage boundary, and remain viable throughout. If justification is lost, the project should be stopped.',
    cardRef: 'M3',
  },
  {
    id: 'p2-002',
    cert: 'prince2',
    domain: 'Themes',
    question: 'In PRINCE2, which theme is responsible for establishing mechanisms to judge whether the project is (and remains) desirable, viable, and achievable?',
    options: [
      'Risk',
      'Quality',
      'Business Case',
      'Plans',
    ],
    correctIndex: 2,
    explanation: 'The Business Case theme ensures the project has a sound justification. It covers desirability (is it worth doing?), viability (can we do it?), and achievability (can we deliver it?). The business case is owned by the Executive (sponsor).',
    cardRef: 'business-2',
  },
  {
    id: 'p2-003',
    cert: 'prince2',
    domain: 'Processes',
    question: 'At the end of each management stage in PRINCE2, which process is used to review the stage and authorise the next stage?',
    options: [
      'Starting Up a Project',
      'Initiating a Project',
      'Managing a Stage Boundary',
      'Directing a Project',
    ],
    correctIndex: 3,
    explanation: 'Directing a Project is the process used by the Project Board (sponsor/senior users/supplier) to authorise each stage. Managing a Stage Boundary prepares the information for the Project Board to review. The Board then uses Directing a Project to give the go/no-go decision.',
    cardRef: 'phases-4',
  },
  {
    id: 'p2-004',
    cert: 'prince2',
    domain: 'Themes',
    question: 'In PRINCE2, what is the purpose of the Risk theme?',
    options: [
      'To identify, assess, and control uncertainty that could affect the project\'s objectives',
      'To define the quality criteria for project deliverables',
      'To establish the project\'s governance structure',
      'To manage the project\'s financial resources',
    ],
    correctIndex: 0,
    explanation: 'The Risk theme in PRINCE2 focuses on identifying, assessing, and controlling threats and opportunities. Both threats (negative risks) and opportunities (positive risks) are managed. The Risk Register is the key product of this theme.',
    cardRef: 'T6',
  },
  {
    id: 'p2-005',
    cert: 'prince2',
    domain: 'Tailoring',
    question: 'A small internal project has a single, experienced project manager who also acts as the team manager. Which PRINCE2 tailoring principle applies?',
    options: [
      'Combine roles where appropriate for the project context',
      'Ignore PRINCE2 principles for small projects',
      'Always maintain full role separation for governance',
      'Use a different methodology for small projects',
    ],
    correctIndex: 0,
    explanation: 'PRINCE2 explicitly supports tailoring, including combining roles. On small projects, it is common and acceptable for one person to hold multiple roles (e.g., Project Manager + Team Manager). The key is that responsibilities are fulfilled, not that separate people hold each role.',
    cardRef: 'M3',
  },
  {
    id: 'p2-006',
    cert: 'prince2',
    domain: 'Principles',
    question: 'Which PRINCE2 principle ensures that project management effort is directed at areas that need it, rather than applying the same level of control to everything?',
    options: [
      'Manage by exception',
      'Manage by stages',
      'Defined roles and responsibilities',
      'Focus on products',
    ],
    correctIndex: 0,
    explanation: 'Manage by Exception sets tolerances (time, cost, quality, scope, risk, benefit) at each level of management. If a tolerance is forecast to be exceeded, it is escalated. This allows senior management to focus on exceptions rather than day-to-day decisions.',
    cardRef: 'process-11',
  },
  // ── APM QUESTIONS ──
  {
    id: 'apm-001',
    cert: 'apm',
    domain: 'Context',
    question: 'What is the PRIMARY purpose of a stakeholder engagement plan?',
    options: [
      'To document all stakeholders and their contact details',
      'To define how stakeholders will be identified, analysed, and engaged throughout the project',
      'To record stakeholder complaints and issues',
      'To assign stakeholders to specific project roles',
    ],
    correctIndex: 1,
    explanation: 'A stakeholder engagement plan defines the strategy for managing stakeholder relationships — who they are, what their interests and influence are, and how the project will communicate with and involve them. It is a proactive, living document updated throughout the project.',
    cardRef: 'people-7',
  },
  {
    id: 'apm-002',
    cert: 'apm',
    domain: 'Planning',
    question: 'Which estimating technique uses historical data from similar past projects to estimate cost and duration?',
    options: [
      'Bottom-up estimating',
      'Parametric estimating',
      'Analogous estimating',
      'Three-point estimating',
    ],
    correctIndex: 2,
    explanation: 'Analogous estimating (also called top-down estimating) uses data from similar past projects as the basis for estimates. It is quick but less accurate. It is most useful in early project phases when detailed information is not yet available.',
    cardRef: 'T1',
  },
  {
    id: 'apm-003',
    cert: 'apm',
    domain: 'Execution',
    question: 'A project manager is managing a project with significant uncertainty. Which approach is MOST appropriate for managing this uncertainty?',
    options: [
      'Create a detailed plan and stick to it regardless of changes',
      'Use an iterative approach with frequent reviews and adaptation',
      'Increase the project budget to cover all possible risks',
      'Reduce the project scope to eliminate uncertainty',
    ],
    correctIndex: 1,
    explanation: 'High uncertainty environments benefit from iterative, adaptive approaches. Frequent reviews allow the team to incorporate new information and adjust course. This is the foundation of agile and iterative project management — empirical process control over predictive planning.',
    cardRef: 'M5',
  },
  {
    id: 'apm-004',
    cert: 'apm',
    domain: 'Governance',
    question: 'What is the purpose of a project audit?',
    options: [
      'To find fault with the project manager\'s performance',
      'To provide an independent assessment of the project\'s compliance with standards and likelihood of success',
      'To approve the project budget',
      'To replace the project steering committee',
    ],
    correctIndex: 1,
    explanation: 'Project audits provide independent, objective assessments of whether a project is following defined processes and standards, and whether it is likely to achieve its objectives. They are quality assurance activities, not performance management tools.',
    cardRef: 'process-7',
  },
  {
    id: 'apm-005',
    cert: 'apm',
    domain: 'Context',
    question: 'A project is part of a programme. What is the MAIN difference between project management and programme management?',
    options: [
      'Programme management involves larger budgets',
      'Programme management coordinates multiple related projects to deliver benefits that could not be achieved by managing them independently',
      'Programme management uses different methodologies',
      'Programme management is only used in the public sector',
    ],
    correctIndex: 1,
    explanation: 'Programme management coordinates multiple related projects and activities to deliver strategic benefits. The key distinction is that programmes focus on benefits realisation and managing interdependencies between projects, not just delivering individual project outputs.',
    cardRef: 'business-4',
  },
  {
    id: 'apm-006',
    cert: 'apm',
    domain: 'Planning',
    question: 'What does a Work Breakdown Structure (WBS) decompose?',
    options: [
      'The project schedule into individual tasks',
      'The project scope into smaller, manageable components',
      'The project budget into cost categories',
      'The project team into work packages',
    ],
    correctIndex: 1,
    explanation: 'A WBS decomposes the total project scope (deliverables and work) into smaller, more manageable components called work packages. It is scope-oriented, not activity-oriented. The WBS is the foundation for schedule, cost, and resource planning.',
    cardRef: 'T3',
  },
  {
    id: 'apm-007',
    cert: 'apm',
    domain: 'Governance',
    question: 'Which document defines the authority levels, decision-making processes, and reporting requirements for a project?',
    options: [
      'Project Management Plan',
      'Project Charter',
      'Project Governance Framework',
      'RACI Matrix',
    ],
    correctIndex: 2,
    explanation: 'A Project Governance Framework (or Terms of Reference) defines how decisions are made, who has authority at each level, escalation paths, and reporting requirements. It establishes the "rules of the game" for the project\'s management.',
    cardRef: 'process-11',
  },
  {
    id: 'apm-008',
    cert: 'apm',
    domain: 'Execution',
    question: 'A project manager wants to understand the root cause of a quality defect. Which tool is MOST appropriate?',
    options: [
      'Gantt Chart',
      'Fishbone (Ishikawa) Diagram',
      'Risk Register',
      'Stakeholder Map',
    ],
    correctIndex: 1,
    explanation: 'The Fishbone (Ishikawa) Diagram is a root cause analysis tool that helps identify the underlying causes of a problem by categorising potential causes (e.g., People, Process, Equipment, Materials, Environment). It is widely used in quality management.',
    cardRef: 'T9',
  },
];

export function getQuestionsByCert(cert: CertType): CertQuestion[] {
  return CERT_QUESTIONS.filter(q => q.cert === cert);
}

export function getQuestionsByDomain(cert: CertType, domain: string): CertQuestion[] {
  return CERT_QUESTIONS.filter(q => q.cert === cert && q.domain === domain);
}

export function getCertById(id: CertType): CertExam | undefined {
  return CERT_EXAMS.find(e => e.id === id);
}
