// StratAlign — Scenario Library Data
// Pre-built "starter packs" for common project situations

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  context: string; // longer description shown on detail view
  cardIds: string[]; // ordered list of recommended cards
  tips: string[]; // 2-3 practical tips for this scenario
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'first-project',
    title: 'Running Your First Project',
    subtitle: 'Where to start when everything is new',
    icon: '🚀',
    color: '#0284C7',
    bgColor: '#EFF6FF',
    difficulty: 'Beginner',
    description: 'You\'ve been handed a project and you\'re not sure where to begin. This pack covers the essentials.',
    context: 'Starting your first project can feel overwhelming. This scenario walks you through the foundational tools every new PM needs: how to define what you\'re delivering, who\'s involved, and how to build a basic plan.',
    cardIds: ['phases-1', 'process-8', 'T11', 'T1', 'people-9', 'A1'],
    tips: [
      'Start with a kick-off meeting to align everyone on goals before diving into planning',
      'Write down what is and isn\'t included in the project — this one step prevents most scope problems',
      'A simple spreadsheet plan is better than no plan at all',
    ],
  },
  {
    id: 'rescue-project',
    title: 'Rescuing a Failing Project',
    subtitle: 'Getting back on track when things go wrong',
    icon: '🆘',
    color: '#E11D48',
    bgColor: '#FFF1F2',
    difficulty: 'Intermediate',
    description: 'Your project is behind schedule, over budget, or losing stakeholder confidence. Here\'s how to turn it around.',
    context: 'When a project gets into trouble, the instinct is to work harder. But the real fix is to stop, diagnose the root cause, and reset expectations. This scenario gives you the tools to do that.',
    cardIds: ['T4', 'process-3', 'T9', 'people-9', 'process-8', 'A33'],
    tips: [
      'Hold a "reset" meeting with stakeholders — honesty about the situation builds more trust than silence',
      'Use Earned Value Management (T4) to get an objective picture of where you really are',
      'Focus on the critical path — not everything is equally important to fix',
    ],
  },
  {
    id: 'agile-transition',
    title: 'Moving to Agile',
    subtitle: 'Transitioning from waterfall to iterative delivery',
    icon: '🔄',
    color: '#059669',
    bgColor: '#ECFDF5',
    difficulty: 'Intermediate',
    description: 'Your organisation wants to adopt Agile but you\'re not sure how to make the shift. This pack explains the key concepts.',
    context: 'Agile isn\'t just a set of ceremonies — it\'s a mindset shift. This scenario covers the core Agile methodologies, the roles involved, and the techniques that make iterative delivery work in practice.',
    cardIds: ['M2', 'M3', 'A8', 'A9', 'A10', 'people-3'],
    tips: [
      'Start with one team and one project — don\'t try to transform the whole organisation at once',
      'The daily stand-up is the easiest Agile practice to introduce first',
      'Agile requires more stakeholder engagement, not less — set that expectation early',
    ],
  },
  {
    id: 'stakeholder-management',
    title: 'Managing Difficult Stakeholders',
    subtitle: 'When key people are resistant or disengaged',
    icon: '🤝',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    difficulty: 'Intermediate',
    description: 'Stakeholders who block progress, change their minds, or disengage can derail even well-run projects.',
    context: 'Stakeholder management is one of the most underrated PM skills. This scenario covers how to map who matters, understand their interests, and build the relationships that keep your project moving.',
    cardIds: ['people-9', 'people-10', 'T11', 'A15', 'people-7', 'process-11'],
    tips: [
      'Map your stakeholders before the project starts — surprises are always more expensive later',
      'Regular one-to-ones with key stakeholders are more effective than formal status reports',
      'Resistance usually comes from fear or misunderstanding — ask questions before defending your plan',
    ],
  },
  {
    id: 'team-conflict',
    title: 'Resolving Team Conflict',
    subtitle: 'When tensions are slowing the team down',
    icon: '⚡',
    color: '#D97706',
    bgColor: '#FEF3C7',
    difficulty: 'Intermediate',
    description: 'Conflict in teams is normal — but unresolved conflict is toxic. These tools help you address it constructively.',
    context: 'Team conflict often stems from unclear roles, competing priorities, or communication breakdowns. This scenario gives you frameworks to diagnose the root cause and facilitate resolution.',
    cardIds: ['people-3', 'people-7', 'A15', 'people-1', 'people-6', 'A16'],
    tips: [
      'Address conflict early — it rarely resolves itself and usually gets worse',
      'Focus on the behaviour or situation, not the person, when raising concerns',
      'Clarifying roles and responsibilities removes the most common source of team friction',
    ],
  },
  {
    id: 'large-programme',
    title: 'Running a Large Programme',
    subtitle: 'Managing multiple projects and workstreams',
    icon: '🏗️',
    color: '#0369A1',
    bgColor: '#E0F2FE',
    difficulty: 'Advanced',
    description: 'When your project grows into a programme with multiple workstreams, the complexity multiplies. Here\'s how to stay in control.',
    context: 'Programme management requires a different set of skills from project management. You\'re coordinating dependencies, managing a portfolio of risks, and leading leaders. This scenario covers the key frameworks.',
    cardIds: ['M6', 'M7', 'process-9', 'process-3', 'people-9', 'A33'],
    tips: [
      'Establish a programme governance structure before work begins — retrofitting it is painful',
      'Dependencies between workstreams are your biggest risk — map them explicitly',
      'Your job as programme manager is to remove blockers, not to manage tasks directly',
    ],
  },
  {
    id: 'remote-team',
    title: 'Leading a Remote Team',
    subtitle: 'Keeping distributed teams aligned and motivated',
    icon: '🌍',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    difficulty: 'Intermediate',
    description: 'Remote and hybrid teams need different communication rhythms and tools to stay connected and productive.',
    context: 'Managing a remote team isn\'t just about video calls. It requires deliberate communication structures, clear documentation, and extra effort to maintain team cohesion. This scenario covers the key practices.',
    cardIds: ['people-3', 'people-7', 'T11', 'A15', 'people-1', 'process-11'],
    tips: [
      'Over-communicate on remote teams — what feels like too much is usually just enough',
      'Async communication (written updates, shared docs) reduces meeting fatigue significantly',
      'Schedule regular informal check-ins — not just project updates — to maintain team connection',
    ],
  },
  {
    id: 'budget-recovery',
    title: 'Getting the Budget Back on Track',
    subtitle: 'When spending is out of control',
    icon: '💰',
    color: '#CA8A04',
    bgColor: '#FEFCE8',
    difficulty: 'Intermediate',
    description: 'Cost overruns are one of the most common project problems. These tools help you understand what\'s happening and fix it.',
    context: 'Budget problems rarely appear suddenly — they build up over time through scope creep, poor estimates, and unmanaged changes. This scenario gives you the tools to diagnose the root cause and get back on track.',
    cardIds: ['T4', 'process-5', 'T1', 'process-8', 'B3', 'process-3'],
    tips: [
      'Use Earned Value Management (T4) to get an objective view of cost performance — gut feel isn\'t enough',
      'Every budget overrun has a root cause — find it before you try to fix the symptoms',
      'A re-baseline is sometimes the right answer — pretending the original budget is still achievable helps nobody',
    ],
  },
  {
    id: 'scope-creep',
    title: 'Controlling Scope Creep',
    subtitle: 'When the project keeps growing beyond its boundaries',
    icon: '🌊',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    difficulty: 'Beginner',
    description: 'Scope creep is the silent killer of projects. These tools help you define, protect, and manage what\'s in and out.',
    context: 'Scope creep happens when small additions accumulate into a significantly larger project without corresponding adjustments to time, budget, or resources. The fix is a clear scope definition and a robust change control process.',
    cardIds: ['process-8', 'T9', 'A33', 'process-3', 'T11', 'people-9'],
    tips: [
      'A clear scope statement is your best defence — if it\'s not written down, it doesn\'t exist',
      'Every change request should be evaluated for impact on time, cost, and quality before approval',
      'Say "yes, and here\'s what it will cost" rather than just "no" — it keeps stakeholders engaged',
    ],
  },
  {
    id: 'risk-management',
    title: 'Managing Project Risk',
    subtitle: 'Identifying and preparing for what could go wrong',
    icon: '⚠️',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    difficulty: 'Beginner',
    description: 'Every project has risks. The difference between good and great PMs is how proactively they manage them.',
    context: 'Risk management isn\'t about being pessimistic — it\'s about being prepared. This scenario walks you through how to identify, assess, and respond to the risks that matter most to your project.',
    cardIds: ['process-3', 'T3', 'A33', 'process-9', 'T1', 'people-9'],
    tips: [
      'Run a risk workshop with your team early — they know things you don\'t',
      'Focus on high-probability, high-impact risks first — you can\'t manage everything',
      'A risk register is only useful if you review it regularly — build it into your weekly routine',
    ],
  },
  {
    id: 'project-closure',
    title: 'Closing a Project Well',
    subtitle: 'Finishing strong and capturing lessons learned',
    icon: '🎯',
    color: '#059669',
    bgColor: '#ECFDF5',
    difficulty: 'Beginner',
    description: 'Projects that end badly leave a bad impression regardless of how well they ran. Here\'s how to close with confidence.',
    context: 'Project closure is often rushed or skipped entirely. But a well-run closure secures sign-off, captures lessons, and sets up the next project for success. This scenario covers the key steps.',
    cardIds: ['process-17', 'phases-5', 'T11', 'people-9', 'process-11', 'A33'],
    tips: [
      'Get formal sign-off from the sponsor before declaring the project complete',
      'Lessons learned sessions are most valuable when run within a week of closure — memories fade fast',
      'Celebrate the team\'s achievement — it matters more than you think',
    ],
  },
  {
    id: 'benefits-realisation',
    title: 'Proving Project Value',
    subtitle: 'Measuring and communicating the benefits your project delivers',
    icon: '📈',
    color: '#0284C7',
    bgColor: '#EFF6FF',
    difficulty: 'Advanced',
    description: 'Delivering on time and budget isn\'t enough — you need to show the business value your project created.',
    context: 'Benefits realisation is the discipline of measuring whether a project actually delivered the outcomes it promised. This scenario covers how to define, track, and report on business benefits.',
    cardIds: ['B1', 'B2', 'B3', 'process-17', 'T4', 'people-9'],
    tips: [
      'Define measurable success criteria before the project starts — not after',
      'Benefits often take months to materialise after project closure — plan for post-project measurement',
      'Link project outputs (what you deliver) to business outcomes (what changes as a result)',
    ],
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}

export function getScenariosByDifficulty(difficulty: Scenario['difficulty']): Scenario[] {
  return SCENARIOS.filter(s => s.difficulty === difficulty);
}
