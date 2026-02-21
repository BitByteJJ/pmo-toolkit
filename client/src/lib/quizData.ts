// StratAlign — Deck Quiz Data
// 10 questions per deck, scenario-based, reusing the JourneyQuestion format.
// Questions are deliberately practical and beginner-accessible.

import type { JourneyQuestion } from './journeyData';

export interface DeckQuiz {
  deckId: string;
  questions: JourneyQuestion[];
}

// ─── PHASES DECK ──────────────────────────────────────────────────────────────
const phasesQuiz: DeckQuiz = {
  deckId: 'phases',
  questions: [
    {
      id: 'qz-phases-1', type: 'mcq',
      prompt: 'You\'ve been asked to run a new project. What is the very first thing you should do?',
      options: ['Assign tasks to the team', 'Define the project objectives, scope, and success criteria', 'Build a Gantt chart', 'Hold a kickoff meeting with all stakeholders'],
      correctIndex: 1,
      explanation: 'Before anything else, you need to know what you\'re trying to achieve and what\'s in scope. Without this, every other action risks being wasted effort.',
      cardRefs: ['phase-setup'], xp: 10,
    },
    {
      id: 'qz-phases-2', type: 'truefalse',
      prompt: 'True or False: Once a project plan is approved, it should never be changed.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Plans change — that\'s normal. What matters is managing changes formally through a change control process, not ignoring them or making ad-hoc changes without approval.',
      cardRefs: ['phase-execution'], xp: 10,
    },
    {
      id: 'qz-phases-3', type: 'scenario',
      prompt: 'Your project has finished and the client is happy. A colleague says "let\'s skip the closure phase and move on." What do you do?',
      options: ['Agree — the project is done', 'Insist on a proper closure: archive documents, release resources, run a lessons-learned session', 'Only do the paperwork', 'Ask the sponsor'],
      correctIndex: 1,
      explanation: 'Closure captures lessons that make your next project better. Skipping it means repeating the same mistakes. It also ensures resources are formally released and contracts are closed.',
      cardRefs: ['phase-closure'], xp: 10,
    },
    {
      id: 'qz-phases-4', type: 'mcq',
      prompt: 'During which phase do you identify stakeholders and define the project charter?',
      options: ['Execution', 'Closure', 'Setup', 'Monitoring'],
      correctIndex: 2,
      explanation: 'The Setup phase is where you lay the foundations: objectives, scope, team, stakeholders, methodology, and the project charter.',
      cardRefs: ['phase-setup'], xp: 10,
    },
    {
      id: 'qz-phases-5', type: 'scenario',
      prompt: 'Halfway through your project, a key stakeholder asks for a significant new feature. What is the correct response?',
      options: ['Add it immediately to keep the stakeholder happy', 'Refuse — the scope is fixed', 'Assess the impact on time, cost, and scope, then raise a formal change request', 'Ask the team to fit it in during spare time'],
      correctIndex: 2,
      explanation: 'All changes should go through formal change control. You assess the impact first, then the sponsor or change board decides whether to approve it.',
      cardRefs: ['phase-execution'], xp: 10,
    },
    {
      id: 'qz-phases-6', type: 'mcq',
      prompt: 'What is the primary purpose of a Post-Implementation Review (PIR)?',
      options: ['To blame team members for failures', 'To capture lessons learned and improve future projects', 'To calculate the final project cost', 'To close the project budget'],
      correctIndex: 1,
      explanation: 'A PIR is a structured reflection on what went well and what didn\'t. The goal is organisational learning, not blame.',
      cardRefs: ['phase-closure'], xp: 10,
    },
    {
      id: 'qz-phases-7', type: 'truefalse',
      prompt: 'True or False: Monitoring and controlling only happens at the end of a project.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Monitoring and controlling happens continuously throughout the project. You track progress, manage risks, and take corrective action at every stage.',
      cardRefs: ['phase-execution'], xp: 10,
    },
    {
      id: 'qz-phases-8', type: 'scenario',
      prompt: 'Your project is 60% complete and you realise it will overrun the budget by 20%. What should you do first?',
      options: ['Say nothing and hope it resolves itself', 'Immediately escalate to the sponsor with a clear picture of the situation and options', 'Cut team hours to save money', 'Reduce the project scope without telling anyone'],
      correctIndex: 1,
      explanation: 'Transparency is essential. Escalate early with facts and options. Sponsors hate surprises — they can usually help if they know early enough.',
      cardRefs: ['phase-execution'], xp: 10,
    },
    {
      id: 'qz-phases-9', type: 'mcq',
      prompt: 'Which document formally authorises a project to begin?',
      options: ['Project Plan', 'Risk Register', 'Project Charter', 'Gantt Chart'],
      correctIndex: 2,
      explanation: 'The Project Charter is the formal document that authorises the project, names the PM, and outlines the high-level scope and objectives.',
      cardRefs: ['phase-setup'], xp: 10,
    },
    {
      id: 'qz-phases-10', type: 'scenario',
      prompt: 'A team member says "we\'re done — all tasks are ticked off." Is the project ready to close?',
      options: ['Yes — if all tasks are done, the project is complete', 'Not necessarily — you also need formal sign-off from the sponsor and client', 'Only if the budget is fully spent', 'Yes, as long as the team is happy'],
      correctIndex: 1,
      explanation: 'Completion requires formal acceptance from the sponsor and/or client, not just task completion. Without sign-off, you have no evidence the deliverables were accepted.',
      cardRefs: ['phase-closure'], xp: 10,
    },
  ],
};

// ─── ARCHETYPES DECK ──────────────────────────────────────────────────────────
const archetypesQuiz: DeckQuiz = {
  deckId: 'archetypes',
  questions: [
    {
      id: 'qz-arch-1', type: 'mcq',
      prompt: 'A team member constantly questions decisions and challenges the approach. Which archetype best describes them?',
      options: ['The Blocker', 'The Devil\'s Advocate', 'The Passenger', 'The Micromanager'],
      correctIndex: 1,
      explanation: 'The Devil\'s Advocate challenges assumptions constructively. Managed well, this person improves decision quality. The key is channelling their energy positively.',
      cardRefs: ['A1'], xp: 10,
    },
    {
      id: 'qz-arch-2', type: 'truefalse',
      prompt: 'True or False: A Micromanager is always harmful to a project and should be removed from the team.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Micromanagement is a behaviour, not a fixed trait. Often it stems from anxiety or past failures. Addressing the root cause — building trust and providing visibility — is more effective than removal.',
      cardRefs: ['A2'], xp: 10,
    },
    {
      id: 'qz-arch-3', type: 'scenario',
      prompt: 'A senior stakeholder keeps changing their mind about what they want. Every meeting produces new requirements. How do you handle this?',
      options: ['Implement every change immediately', 'Ignore the changes and stick to the original plan', 'Acknowledge their input, document it, and route it through formal change control', 'Escalate to their manager'],
      correctIndex: 2,
      explanation: 'Scope creep from senior stakeholders is common. Formal change control protects the project while keeping the stakeholder engaged and respected.',
      cardRefs: ['A3'], xp: 10,
    },
    {
      id: 'qz-arch-4', type: 'mcq',
      prompt: 'Which archetype tends to over-promise and under-deliver, often due to wanting to please everyone?',
      options: ['The Blocker', 'The People Pleaser', 'The Expert', 'The Passenger'],
      correctIndex: 1,
      explanation: 'The People Pleaser says yes to everything, which creates unrealistic expectations. Coaching them to set boundaries and manage expectations is the key intervention.',
      cardRefs: ['A4'], xp: 10,
    },
    {
      id: 'qz-arch-5', type: 'scenario',
      prompt: 'One of your team members is highly skilled but dismissive of others\' ideas and dominates meetings. What is your approach?',
      options: ['Let them dominate — they\'re the expert', 'Privately coach them on collaborative behaviours and create space for others to contribute', 'Remove them from the project', 'Ignore the behaviour'],
      correctIndex: 1,
      explanation: 'Expert archetypes add huge value but can stifle team creativity. Private coaching and structured facilitation techniques (e.g. round-robin input) balance their contribution.',
      cardRefs: ['A5'], xp: 10,
    },
    {
      id: 'qz-arch-6', type: 'truefalse',
      prompt: 'True or False: A Passenger (someone who does the minimum and avoids accountability) is best handled by giving them more responsibility.',
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: 'Giving a Passenger meaningful ownership — a specific deliverable they\'re accountable for — often re-engages them. People disengage when they feel their contribution doesn\'t matter.',
      cardRefs: ['A6'], xp: 10,
    },
    {
      id: 'qz-arch-7', type: 'mcq',
      prompt: 'A stakeholder consistently misses meetings and doesn\'t respond to emails. Which archetype is this?',
      options: ['The Ghost', 'The Blocker', 'The Expert', 'The Sponsor'],
      correctIndex: 0,
      explanation: 'The Ghost is disengaged or overwhelmed. Re-engaging them requires understanding why they\'re absent — often it\'s competing priorities — and finding a lighter-touch way to keep them involved.',
      cardRefs: ['A7'], xp: 10,
    },
    {
      id: 'qz-arch-8', type: 'scenario',
      prompt: 'Your project sponsor is enthusiastic but keeps adding new ideas without considering the impact on scope. How do you manage this?',
      options: ['Add all ideas to the backlog without filtering', 'Politely but firmly explain the scope impact and route ideas through change control', 'Ignore the ideas', 'Implement the ideas and adjust the plan later'],
      correctIndex: 1,
      explanation: 'Sponsor enthusiasm is an asset — but uncontrolled scope additions are dangerous. A good PM channels that energy through structured processes while keeping the sponsor engaged.',
      cardRefs: ['A8'], xp: 10,
    },
    {
      id: 'qz-arch-9', type: 'mcq',
      prompt: 'What is the most effective first step when you identify a difficult archetype on your project?',
      options: ['Escalate immediately', 'Understand the root cause of their behaviour before intervening', 'Remove them from the team', 'Complain to HR'],
      correctIndex: 1,
      explanation: 'Behaviour has a cause. Understanding whether someone is anxious, overloaded, disengaged, or protecting their territory shapes a much more effective response.',
      cardRefs: ['A1'], xp: 10,
    },
    {
      id: 'qz-arch-10', type: 'truefalse',
      prompt: 'True or False: The same person can display different archetypes on different projects.',
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: 'Archetypes are context-dependent. Someone who is a Blocker on one project (where they feel ignored) might be a Champion on another (where they feel valued). Context shapes behaviour.',
      cardRefs: ['A1'], xp: 10,
    },
  ],
};

// ─── METHODOLOGIES DECK ───────────────────────────────────────────────────────
const methodologiesQuiz: DeckQuiz = {
  deckId: 'methodologies',
  questions: [
    {
      id: 'qz-meth-1', type: 'mcq',
      prompt: 'Which methodology is best suited for a project with well-defined, stable requirements?',
      options: ['Agile / Scrum', 'Waterfall', 'Kanban', 'SAFe'],
      correctIndex: 1,
      explanation: 'Waterfall works well when requirements are clear and unlikely to change — such as construction or regulatory compliance projects.',
      cardRefs: ['M1'], xp: 10,
    },
    {
      id: 'qz-meth-2', type: 'scenario',
      prompt: 'You\'re building a mobile app where customer needs are unclear and likely to evolve. Which approach is most appropriate?',
      options: ['Waterfall — plan everything upfront', 'Agile — iterate in short sprints and adapt based on feedback', 'PRINCE2 — follow a rigid stage-gate process', 'Do nothing until requirements are finalised'],
      correctIndex: 1,
      explanation: 'Agile thrives in uncertain, fast-changing environments. Short sprints allow you to validate assumptions early and pivot before investing too much.',
      cardRefs: ['M2'], xp: 10,
    },
    {
      id: 'qz-meth-3', type: 'truefalse',
      prompt: 'True or False: Scrum and Agile are the same thing.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Agile is a mindset and set of principles. Scrum is one specific framework that implements Agile values. Kanban, SAFe, and XP are other Agile frameworks.',
      cardRefs: ['M3'], xp: 10,
    },
    {
      id: 'qz-meth-4', type: 'mcq',
      prompt: 'In Scrum, what is the purpose of a Sprint Retrospective?',
      options: ['To plan the next sprint\'s work', 'To review the product increment with stakeholders', 'To reflect on the team\'s process and identify improvements', 'To update the project plan'],
      correctIndex: 2,
      explanation: 'The Retrospective is a team-focused session on how they work together — not what they built. It\'s where continuous improvement happens.',
      cardRefs: ['M3'], xp: 10,
    },
    {
      id: 'qz-meth-5', type: 'scenario',
      prompt: 'Your team has a steady flow of support tickets and small improvements with no fixed deadlines. Which methodology fits best?',
      options: ['Scrum with 2-week sprints', 'Kanban — visualise flow and limit work in progress', 'Waterfall', 'PRINCE2'],
      correctIndex: 1,
      explanation: 'Kanban is ideal for continuous flow work without fixed iterations. It visualises work, limits WIP, and optimises throughput.',
      cardRefs: ['M4'], xp: 10,
    },
    {
      id: 'qz-meth-6', type: 'mcq',
      prompt: 'PRINCE2 is best described as:',
      options: ['An Agile framework for software teams', 'A process-based project management method with defined roles and stage gates', 'A risk management tool', 'A scheduling technique'],
      correctIndex: 1,
      explanation: 'PRINCE2 (Projects IN Controlled Environments) is a structured method with defined processes, roles, and stage-gate controls. It\'s widely used in government and large organisations.',
      cardRefs: ['M5'], xp: 10,
    },
    {
      id: 'qz-meth-7', type: 'truefalse',
      prompt: 'True or False: You must choose one methodology and stick to it for the entire project.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Hybrid approaches are common and often more effective. For example, using PRINCE2 for governance and Agile for delivery combines structured oversight with flexible execution.',
      cardRefs: ['M6'], xp: 10,
    },
    {
      id: 'qz-meth-8', type: 'scenario',
      prompt: 'A large bank wants to run Agile across 50 teams while maintaining enterprise governance. Which framework addresses this?',
      options: ['Basic Scrum', 'SAFe (Scaled Agile Framework)', 'Kanban', 'Waterfall'],
      correctIndex: 1,
      explanation: 'SAFe is designed for enterprise-scale Agile, coordinating multiple teams through Agile Release Trains while maintaining portfolio-level governance.',
      cardRefs: ['M7'], xp: 10,
    },
    {
      id: 'qz-meth-9', type: 'mcq',
      prompt: 'What does "Definition of Done" mean in Agile?',
      options: ['The project is complete', 'A shared agreement on what criteria a piece of work must meet to be considered finished', 'The sprint has ended', 'The client has signed off'],
      correctIndex: 1,
      explanation: 'The Definition of Done prevents ambiguity about completion. It\'s a checklist agreed by the team — e.g. coded, tested, reviewed, documented, deployed to staging.',
      cardRefs: ['M3'], xp: 10,
    },
    {
      id: 'qz-meth-10', type: 'scenario',
      prompt: 'You\'re a new PM and your organisation has no standard methodology. How do you choose one?',
      options: ['Use whatever you\'ve used before', 'Assess the project type, team size, requirement stability, and stakeholder needs, then select the best fit', 'Always use Agile — it\'s the most modern', 'Ask your manager to decide'],
      correctIndex: 1,
      explanation: 'Methodology selection should be context-driven. The right choice depends on the nature of the work, the team\'s maturity, and the organisation\'s culture.',
      cardRefs: ['M1'], xp: 10,
    },
  ],
};

// ─── PEOPLE DECK ──────────────────────────────────────────────────────────────
const peopleQuiz: DeckQuiz = {
  deckId: 'people',
  questions: [
    {
      id: 'qz-ppl-1', type: 'mcq',
      prompt: 'Two team members are in open conflict and it\'s affecting team morale. What is your first step?',
      options: ['Ignore it and hope it resolves itself', 'Speak to each person privately to understand their perspective before bringing them together', 'Immediately escalate to HR', 'Remove one of them from the project'],
      correctIndex: 1,
      explanation: 'Understanding each party\'s perspective privately prevents defensiveness and gives you the full picture before attempting resolution.',
      cardRefs: ['people-1'], xp: 10,
    },
    {
      id: 'qz-ppl-2', type: 'truefalse',
      prompt: 'True or False: A high-performing team requires no management once it reaches the "Performing" stage of Tuckman\'s model.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Even high-performing teams need support. Team composition changes, new challenges emerge, and teams can regress. Ongoing coaching and recognition maintain performance.',
      cardRefs: ['people-2'], xp: 10,
    },
    {
      id: 'qz-ppl-3', type: 'scenario',
      prompt: 'A key stakeholder is resistant to your project and keeps raising objections in meetings. How do you handle this?',
      options: ['Exclude them from future meetings', 'Understand their concerns privately, address legitimate issues, and bring them on side', 'Escalate to their manager', 'Ignore their objections'],
      correctIndex: 1,
      explanation: 'Resistant stakeholders often have valid concerns. Engaging them privately, listening genuinely, and addressing their issues converts opponents into allies.',
      cardRefs: ['people-3'], xp: 10,
    },
    {
      id: 'qz-ppl-4', type: 'mcq',
      prompt: 'What is the purpose of a RACI matrix?',
      options: ['To track project risks', 'To clarify who is Responsible, Accountable, Consulted, and Informed for each task', 'To schedule project activities', 'To manage the project budget'],
      correctIndex: 1,
      explanation: 'A RACI matrix eliminates confusion about roles. Without it, tasks fall through the gaps or get duplicated because people assume someone else is handling them.',
      cardRefs: ['people-4'], xp: 10,
    },
    {
      id: 'qz-ppl-5', type: 'scenario',
      prompt: 'Your team seems demotivated and productivity has dropped. What is the most effective first step?',
      options: ['Threaten consequences for poor performance', 'Have individual conversations to understand what\'s causing the drop and address root causes', 'Add more process and oversight', 'Ignore it — motivation fluctuates naturally'],
      correctIndex: 1,
      explanation: 'Motivation drops have causes — unclear goals, lack of recognition, personal issues, or feeling undervalued. Listening first gives you the information to respond effectively.',
      cardRefs: ['people-5'], xp: 10,
    },
    {
      id: 'qz-ppl-6', type: 'mcq',
      prompt: 'Which leadership style is most appropriate when a team member is new and lacks confidence?',
      options: ['Delegating — give them full autonomy', 'Directing — provide clear instructions and close support', 'Laissez-faire — let them figure it out', 'Coaching — ask questions and let them discover answers'],
      correctIndex: 1,
      explanation: 'New team members need clear direction and support. As they grow in confidence and competence, you progressively shift toward coaching and then delegating.',
      cardRefs: ['people-6'], xp: 10,
    },
    {
      id: 'qz-ppl-7', type: 'truefalse',
      prompt: 'True or False: Stakeholder management ends once the project is approved.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Stakeholder management is continuous. Stakeholders\' interests, influence, and concerns change throughout the project. Regular engagement prevents surprises.',
      cardRefs: ['people-3'], xp: 10,
    },
    {
      id: 'qz-ppl-8', type: 'scenario',
      prompt: 'A team member consistently delivers late and blames external factors. How do you address this?',
      options: ['Accept their excuses and adjust the plan', 'Have a direct, private conversation: acknowledge the challenges, agree on specific commitments, and follow up', 'Publicly call them out in a team meeting', 'Remove them from the project immediately'],
      correctIndex: 1,
      explanation: 'Direct, private conversations with clear expectations and follow-up are the most effective way to address performance issues. Public criticism damages trust and morale.',
      cardRefs: ['people-7'], xp: 10,
    },
    {
      id: 'qz-ppl-9', type: 'mcq',
      prompt: 'What does "psychological safety" mean in a team context?',
      options: ['Physical safety in the workplace', 'Team members feel safe to speak up, share ideas, and admit mistakes without fear of punishment', 'A risk management technique', 'A type of insurance for project teams'],
      correctIndex: 1,
      explanation: 'Psychological safety is the foundation of high-performing teams. Without it, people hide problems, avoid risks, and don\'t innovate — which is fatal for complex projects.',
      cardRefs: ['people-8'], xp: 10,
    },
    {
      id: 'qz-ppl-10', type: 'scenario',
      prompt: 'Your project team is distributed across three time zones. Communication is breaking down. What is your best approach?',
      options: ['Require everyone to work the same hours', 'Establish clear communication protocols: agreed overlap hours, async-first norms, and regular video check-ins', 'Reduce the team size', 'Move everyone to the same location'],
      correctIndex: 1,
      explanation: 'Distributed teams need explicit communication agreements. Async-first with regular synchronous touchpoints balances flexibility with connection.',
      cardRefs: ['people-9'], xp: 10,
    },
  ],
};

// ─── PROCESS DECK ─────────────────────────────────────────────────────────────
const processQuiz: DeckQuiz = {
  deckId: 'process',
  questions: [
    {
      id: 'qz-proc-1', type: 'mcq',
      prompt: 'What is the primary purpose of a Risk Register?',
      options: ['To track project costs', 'To document, assess, and manage project risks in one place', 'To record team performance', 'To list project stakeholders'],
      correctIndex: 1,
      explanation: 'A Risk Register is the central tool for risk management. It captures each risk, its likelihood and impact, and the planned response — keeping risks visible and managed.',
      cardRefs: ['process-3'], xp: 10,
    },
    {
      id: 'qz-proc-2', type: 'scenario',
      prompt: 'A new risk has been identified: a key supplier might go out of business. What do you do?',
      options: ['Ignore it — it\'s unlikely', 'Add it to the Risk Register, assess likelihood and impact, and define a contingency plan', 'Immediately find a new supplier', 'Escalate to the board'],
      correctIndex: 1,
      explanation: 'All risks should be logged, assessed, and have a response plan. You may also want to identify a backup supplier as a contingency, but the first step is formal documentation.',
      cardRefs: ['process-3'], xp: 10,
    },
    {
      id: 'qz-proc-3', type: 'truefalse',
      prompt: 'True or False: Scope creep is always caused by the client asking for more.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Scope creep can come from any direction — the team adding features, the PM agreeing to extras informally, or the sponsor changing priorities. Poor scope definition is often the root cause.',
      cardRefs: ['process-8'], xp: 10,
    },
    {
      id: 'qz-proc-4', type: 'mcq',
      prompt: 'What is a Change Control process designed to do?',
      options: ['Prevent any changes to the project', 'Ensure all changes are assessed for impact and formally approved before implementation', 'Speed up project delivery', 'Reduce project costs'],
      correctIndex: 1,
      explanation: 'Change control doesn\'t prevent change — it manages it. Every change is assessed for its impact on scope, time, cost, and quality before a decision is made.',
      cardRefs: ['process-8'], xp: 10,
    },
    {
      id: 'qz-proc-5', type: 'scenario',
      prompt: 'Your project is tracking behind schedule. What is the first thing you should do?',
      options: ['Immediately add more people to the project', 'Analyse the cause of the delay before deciding on a response', 'Extend the deadline', 'Cut scope without telling the sponsor'],
      correctIndex: 1,
      explanation: 'Adding people to a late project often makes it later (Brooks\'s Law). Understanding the cause first — whether it\'s a bottleneck, a dependency, or a skills gap — leads to a better solution.',
      cardRefs: ['process-9'], xp: 10,
    },
    {
      id: 'qz-proc-6', type: 'mcq',
      prompt: 'What does "quality assurance" mean in project management?',
      options: ['Checking the final deliverable for defects', 'The ongoing process of ensuring project processes are fit for purpose and being followed', 'Writing a quality plan', 'Testing software'],
      correctIndex: 1,
      explanation: 'Quality assurance is process-focused — it\'s about preventing defects by ensuring the right processes are in place. Quality control is product-focused — checking the output.',
      cardRefs: ['process-7'], xp: 10,
    },
    {
      id: 'qz-proc-7', type: 'truefalse',
      prompt: 'True or False: A project issue and a project risk are the same thing.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'A risk is a potential future event. An issue is a problem that has already occurred. They require different responses — risks are managed proactively, issues reactively.',
      cardRefs: ['process-3'], xp: 10,
    },
    {
      id: 'qz-proc-8', type: 'scenario',
      prompt: 'A stakeholder asks for a small change that "won\'t take long." How do you respond?',
      options: ['Agree immediately to keep them happy', 'Assess the impact on scope, time, and cost, then route through change control', 'Refuse — the scope is fixed', 'Ask the team to fit it in after hours'],
      correctIndex: 1,
      explanation: '"Small" changes accumulate. Each one individually seems trivial, but together they cause scope creep, budget overruns, and schedule delays. Change control protects the project.',
      cardRefs: ['process-8'], xp: 10,
    },
    {
      id: 'qz-proc-9', type: 'mcq',
      prompt: 'What is the purpose of a project baseline?',
      options: ['To set the minimum acceptable quality', 'To provide a fixed reference point for scope, schedule, and cost against which actual performance is measured', 'To define the project start date', 'To list all project risks'],
      correctIndex: 1,
      explanation: 'A baseline is your approved plan. Comparing actuals against the baseline tells you whether you\'re on track and by how much you\'ve deviated.',
      cardRefs: ['process-9'], xp: 10,
    },
    {
      id: 'qz-proc-10', type: 'scenario',
      prompt: 'You\'re managing a complex project and realise there\'s no formal process for approving deliverables. What do you do?',
      options: ['Continue without one — it slows things down', 'Establish a simple sign-off process with the sponsor and key stakeholders immediately', 'Wait until the end of the project', 'Ask the team to self-certify their own work'],
      correctIndex: 1,
      explanation: 'Without a formal sign-off process, deliverables can be disputed at the end of the project. Establishing one early prevents costly rework and disagreements.',
      cardRefs: ['process-7'], xp: 10,
    },
  ],
};

// ─── BUSINESS DECK ────────────────────────────────────────────────────────────
const businessQuiz: DeckQuiz = {
  deckId: 'business',
  questions: [
    {
      id: 'qz-biz-1', type: 'mcq',
      prompt: 'What is a Business Case primarily used for?',
      options: ['To track project progress', 'To justify the investment in a project by outlining costs, benefits, and risks', 'To manage project risks', 'To assign tasks to the team'],
      correctIndex: 1,
      explanation: 'A Business Case is the document that justifies why a project should be approved and funded. It\'s the foundation of investment decision-making.',
      cardRefs: ['B1'], xp: 10,
    },
    {
      id: 'qz-biz-2', type: 'scenario',
      prompt: 'Your project\'s Business Case assumed a 20% cost saving, but halfway through, the saving looks more like 8%. What should you do?',
      options: ['Continue — the project is already approved', 'Update the Business Case and present the revised figures to the sponsor for a go/no-go decision', 'Hide the revised figures until the project is complete', 'Increase scope to recover the saving'],
      correctIndex: 1,
      explanation: 'The Business Case should be a living document. If the justification for the project has changed materially, the sponsor needs to make an informed decision about whether to continue.',
      cardRefs: ['B1'], xp: 10,
    },
    {
      id: 'qz-biz-3', type: 'truefalse',
      prompt: 'True or False: Benefits realisation only happens after the project has closed.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Some benefits can be realised during the project. Benefits realisation management tracks whether expected benefits are being achieved — both during and after delivery.',
      cardRefs: ['B2'], xp: 10,
    },
    {
      id: 'qz-biz-4', type: 'mcq',
      prompt: 'What does ROI stand for, and why does it matter in project management?',
      options: ['Risk of Investment — it measures project risk', 'Return on Investment — it measures the financial benefit relative to the cost', 'Rate of Implementation — it tracks delivery speed', 'Record of Issues — it logs project problems'],
      correctIndex: 1,
      explanation: 'ROI measures whether a project is worth doing financially. A positive ROI means the benefits outweigh the costs. It\'s a key metric for investment decisions.',
      cardRefs: ['B3'], xp: 10,
    },
    {
      id: 'qz-biz-5', type: 'scenario',
      prompt: 'A sponsor asks "what\'s the payback period for this project?" What are they asking?',
      options: ['How long the project will take to deliver', 'How long it will take for the financial benefits to recover the initial investment', 'What the total project cost is', 'When the project will be complete'],
      correctIndex: 1,
      explanation: 'Payback period is the time it takes for cumulative benefits to equal the initial investment. Shorter payback periods are generally preferred as they reduce financial risk.',
      cardRefs: ['B3'], xp: 10,
    },
    {
      id: 'qz-biz-6', type: 'mcq',
      prompt: 'What is organisational change management (OCM) concerned with?',
      options: ['Managing changes to the project scope', 'Helping people in an organisation adapt to and adopt changes introduced by a project', 'Changing the project team', 'Updating the project plan'],
      correctIndex: 1,
      explanation: 'OCM focuses on the human side of change — ensuring people understand, accept, and are able to work in the new way. Projects that ignore OCM often fail at adoption.',
      cardRefs: ['B4'], xp: 10,
    },
    {
      id: 'qz-biz-7', type: 'truefalse',
      prompt: 'True or False: A project can be delivered on time and on budget but still be considered a failure.',
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: 'If a project delivers on time and budget but the benefits aren\'t realised — because users don\'t adopt the system, or the business problem wasn\'t solved — it\'s still a failure. Benefits realisation is the true measure of success.',
      cardRefs: ['B2'], xp: 10,
    },
    {
      id: 'qz-biz-8', type: 'scenario',
      prompt: 'Your project will require 200 staff to change how they work. The sponsor says "they\'ll just have to adapt." What is your concern?',
      options: ['None — the sponsor is right', 'Without a structured change management plan, adoption will be low and benefits won\'t be realised', 'The project is too big', 'The staff will need more pay'],
      correctIndex: 1,
      explanation: 'Resistance to change is the #1 reason technology and process projects fail. A structured OCM plan — communication, training, and support — dramatically improves adoption.',
      cardRefs: ['B4'], xp: 10,
    },
    {
      id: 'qz-biz-9', type: 'mcq',
      prompt: 'What is a portfolio in project management terms?',
      options: ['A collection of a PM\'s past projects', 'A group of projects and programmes managed together to achieve strategic objectives', 'A financial investment portfolio', 'A project plan document'],
      correctIndex: 1,
      explanation: 'Portfolio management ensures that an organisation\'s projects collectively deliver its strategy. It involves prioritising, balancing, and governing multiple projects as a whole.',
      cardRefs: ['B5'], xp: 10,
    },
    {
      id: 'qz-biz-10', type: 'scenario',
      prompt: 'Two projects in your organisation are competing for the same limited resources. Who should resolve this conflict?',
      options: ['The two project managers between themselves', 'The portfolio or programme manager, who has visibility of all projects and strategic priorities', 'The most senior PM', 'HR'],
      correctIndex: 1,
      explanation: 'Resource conflicts between projects are a portfolio-level concern. The portfolio manager has the strategic view to prioritise based on business value and urgency.',
      cardRefs: ['B5'], xp: 10,
    },
  ],
};

// ─── TOOLS DECK ───────────────────────────────────────────────────────────────
const toolsQuiz: DeckQuiz = {
  deckId: 'tools',
  questions: [
    {
      id: 'qz-tools-1', type: 'mcq',
      prompt: 'What is a Gantt chart primarily used for?',
      options: ['Tracking project costs', 'Visualising the project schedule with tasks, durations, and dependencies', 'Managing project risks', 'Assigning team roles'],
      correctIndex: 1,
      explanation: 'A Gantt chart is a bar chart that shows tasks on a timeline, including their start/end dates and dependencies. It\'s the most widely used scheduling tool in project management.',
      cardRefs: ['T1'], xp: 10,
    },
    {
      id: 'qz-tools-2', type: 'scenario',
      prompt: 'You need to identify the longest sequence of dependent tasks in your project to find the minimum project duration. Which tool do you use?',
      options: ['Gantt Chart', 'Critical Path Method (CPM)', 'Risk Register', 'RACI Matrix'],
      correctIndex: 1,
      explanation: 'The Critical Path Method identifies the longest chain of dependent tasks — the critical path. Any delay on this path delays the whole project.',
      cardRefs: ['T2'], xp: 10,
    },
    {
      id: 'qz-tools-3', type: 'truefalse',
      prompt: 'True or False: A Risk Register should only be updated at the start of a project.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'A Risk Register is a living document. New risks emerge throughout the project and existing risks change in likelihood and impact. It should be reviewed regularly — at least at each milestone.',
      cardRefs: ['T6'], xp: 10,
    },
    {
      id: 'qz-tools-4', type: 'mcq',
      prompt: 'Earned Value Management (EVM) measures project performance using which three values?',
      options: ['Budget, Actual Cost, Forecast', 'Planned Value, Earned Value, Actual Cost', 'Scope, Time, Cost', 'Risk, Quality, Schedule'],
      correctIndex: 1,
      explanation: 'EVM uses Planned Value (what you planned to spend), Earned Value (the value of work done), and Actual Cost (what you actually spent) to calculate schedule and cost variances.',
      cardRefs: ['T4'], xp: 10,
    },
    {
      id: 'qz-tools-5', type: 'scenario',
      prompt: 'You want to understand which stakeholders have the most influence over your project and how to engage them. Which tool helps?',
      options: ['Gantt Chart', 'Stakeholder Matrix', 'Risk Register', 'Work Breakdown Structure'],
      correctIndex: 1,
      explanation: 'A Stakeholder Matrix maps stakeholders by influence and interest, helping you prioritise engagement and tailor your communication strategy.',
      cardRefs: ['T16'], xp: 10,
    },
    {
      id: 'qz-tools-6', type: 'mcq',
      prompt: 'What is a Work Breakdown Structure (WBS)?',
      options: ['A list of project risks', 'A hierarchical decomposition of the total project scope into manageable work packages', 'A project schedule', 'A team organisation chart'],
      correctIndex: 1,
      explanation: 'A WBS breaks the project scope into smaller, manageable pieces. It\'s the foundation for scheduling, costing, and assigning work.',
      cardRefs: ['T3'], xp: 10,
    },
    {
      id: 'qz-tools-7', type: 'truefalse',
      prompt: 'True or False: A RAID log tracks Risks, Assumptions, Issues, and Dependencies.',
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: 'RAID stands for Risks, Assumptions, Issues, and Dependencies. It\'s a consolidated log that gives the PM a single view of the key factors that could affect the project.',
      cardRefs: ['T7'], xp: 10,
    },
    {
      id: 'qz-tools-8', type: 'scenario',
      prompt: 'Your project has a Schedule Performance Index (SPI) of 0.8. What does this tell you?',
      options: ['The project is 20% over budget', 'The project is progressing at 80% of the planned rate — it is behind schedule', 'The project is 20% ahead of schedule', 'The project quality is at 80%'],
      correctIndex: 1,
      explanation: 'An SPI below 1.0 means you\'re behind schedule. SPI = Earned Value / Planned Value. An SPI of 0.8 means for every £1 of planned work, only £0.80 of value has been delivered.',
      cardRefs: ['T4'], xp: 10,
    },
    {
      id: 'qz-tools-9', type: 'mcq',
      prompt: 'What is the purpose of a project dashboard?',
      options: ['To replace the project plan', 'To provide a real-time, visual summary of project status for stakeholders', 'To track individual team member performance', 'To manage project finances'],
      correctIndex: 1,
      explanation: 'A project dashboard gives stakeholders a quick, visual overview of key metrics — RAG status, schedule, budget, risks, and milestones — without requiring them to read detailed reports.',
      cardRefs: ['T5'], xp: 10,
    },
    {
      id: 'qz-tools-10', type: 'scenario',
      prompt: 'You\'re starting a new project and want to map out all the work required. Where do you start?',
      options: ['Build a Gantt chart immediately', 'Create a Work Breakdown Structure to decompose the scope before scheduling', 'Assign tasks to the team', 'Write a risk register'],
      correctIndex: 1,
      explanation: 'The WBS should come before the schedule. You can\'t schedule work you haven\'t identified. The WBS ensures nothing is missed before you start estimating and planning.',
      cardRefs: ['T3'], xp: 10,
    },
  ],
};

// ─── TECHNIQUES DECK ──────────────────────────────────────────────────────────
const techniquesQuiz: DeckQuiz = {
  deckId: 'techniques',
  questions: [
    {
      id: 'qz-tech-1', type: 'mcq',
      prompt: 'What is MoSCoW prioritisation used for?',
      options: ['Scheduling tasks', 'Categorising requirements as Must have, Should have, Could have, and Won\'t have', 'Managing project risks', 'Assigning team roles'],
      correctIndex: 1,
      explanation: 'MoSCoW helps teams and stakeholders agree on what\'s essential versus desirable. It\'s particularly useful in Agile projects where scope must be managed within a fixed timebox.',
      cardRefs: ['A1'], xp: 10,
    },
    {
      id: 'qz-tech-2', type: 'scenario',
      prompt: 'Your team has 30 backlog items and a 2-week sprint. How do you decide what to include?',
      options: ['Take the first 30 items in the list', 'Prioritise by business value and effort, then select items that fit within the sprint capacity', 'Let the team choose their favourite tasks', 'Include everything and work overtime'],
      correctIndex: 1,
      explanation: 'Sprint planning involves prioritising by value and feasibility. The product owner prioritises by value; the team assesses effort. Together they select a realistic sprint backlog.',
      cardRefs: ['A2'], xp: 10,
    },
    {
      id: 'qz-tech-3', type: 'truefalse',
      prompt: 'True or False: A fishbone diagram (Ishikawa) is used to identify the root causes of a problem.',
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: 'A fishbone diagram maps potential causes of a problem across categories (people, process, technology, environment, etc.), helping teams identify root causes rather than just symptoms.',
      cardRefs: ['A3'], xp: 10,
    },
    {
      id: 'qz-tech-4', type: 'mcq',
      prompt: 'What does a SWOT analysis examine?',
      options: ['Schedule, Work, Outcomes, Timeline', 'Strengths, Weaknesses, Opportunities, Threats', 'Scope, Workload, Objectives, Tasks', 'Stakeholders, Workflow, Operations, Technology'],
      correctIndex: 1,
      explanation: 'SWOT is a strategic analysis tool. Internal factors (Strengths and Weaknesses) are within your control; external factors (Opportunities and Threats) are in the environment.',
      cardRefs: ['A4'], xp: 10,
    },
    {
      id: 'qz-tech-5', type: 'scenario',
      prompt: 'You need to estimate how long a task will take, but there\'s significant uncertainty. Which technique gives you a range rather than a single point estimate?',
      options: ['Gantt Chart', 'Three-Point Estimating (PERT)', 'Critical Path Method', 'Risk Register'],
      correctIndex: 1,
      explanation: 'Three-Point Estimating uses optimistic, most likely, and pessimistic estimates to calculate a weighted average and range. It\'s more realistic than single-point estimates in uncertain situations.',
      cardRefs: ['A5'], xp: 10,
    },
    {
      id: 'qz-tech-6', type: 'mcq',
      prompt: 'What is the purpose of a retrospective in Agile?',
      options: ['To review the product with stakeholders', 'To reflect on the team\'s process and identify improvements for the next sprint', 'To plan the next sprint\'s work', 'To update the project plan'],
      correctIndex: 1,
      explanation: 'Retrospectives are about continuous improvement of how the team works, not what they built. They\'re a core Agile ceremony that drives team learning and adaptation.',
      cardRefs: ['A6'], xp: 10,
    },
    {
      id: 'qz-tech-7', type: 'truefalse',
      prompt: 'True or False: The Pareto Principle (80/20 rule) suggests that 80% of problems come from 20% of causes.',
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: 'The Pareto Principle is a useful heuristic: focus on the 20% of causes that drive 80% of the impact. In project management, this helps prioritise where to focus improvement efforts.',
      cardRefs: ['A7'], xp: 10,
    },
    {
      id: 'qz-tech-8', type: 'scenario',
      prompt: 'You need to get a diverse group of stakeholders to agree on project priorities. Which facilitation technique is most effective?',
      options: ['Let the most senior person decide', 'Use dot voting or a structured prioritisation exercise to surface collective preferences', 'Take a majority vote', 'Decide yourself and present it as agreed'],
      correctIndex: 1,
      explanation: 'Structured facilitation techniques like dot voting create buy-in by giving everyone a voice. Decisions made collaboratively are more likely to be supported in implementation.',
      cardRefs: ['A8'], xp: 10,
    },
    {
      id: 'qz-tech-9', type: 'mcq',
      prompt: 'What is a lessons-learned session designed to produce?',
      options: ['A blame report', 'Documented insights on what worked and what didn\'t, to improve future projects', 'A final project report', 'A performance review for team members'],
      correctIndex: 1,
      explanation: 'Lessons learned capture organisational knowledge. They should be documented and shared — not filed away. The goal is to avoid repeating mistakes and replicate successes.',
      cardRefs: ['A9'], xp: 10,
    },
    {
      id: 'qz-tech-10', type: 'scenario',
      prompt: 'Your project has many interdependent tasks and you\'re worried about which delays will affect the end date. Which technique helps you identify these?',
      options: ['SWOT Analysis', 'Critical Path Analysis', 'MoSCoW Prioritisation', 'Stakeholder Matrix'],
      correctIndex: 1,
      explanation: 'Critical Path Analysis identifies the sequence of tasks that determines the minimum project duration. Any delay on the critical path directly delays the project end date.',
      cardRefs: ['A10'], xp: 10,
    },
  ],
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const ALL_DECK_QUIZZES: DeckQuiz[] = [
  phasesQuiz,
  archetypesQuiz,
  methodologiesQuiz,
  peopleQuiz,
  processQuiz,
  businessQuiz,
  toolsQuiz,
  techniquesQuiz,
];

export function getQuizForDeck(deckId: string): DeckQuiz | undefined {
  return ALL_DECK_QUIZZES.find(q => q.deckId === deckId);
}

/** Pick a deterministic daily question from the full question pool based on today's date */
export function getDailyChallenge(): JourneyQuestion {
  const allQuestions = ALL_DECK_QUIZZES.flatMap(d => d.questions);
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % allQuestions.length;
  return allQuestions[index];
}

/** Get the deck ID for a quiz question */
export function getDeckIdForQuestion(questionId: string): string | undefined {
  for (const dq of ALL_DECK_QUIZZES) {
    if (dq.questions.some(q => q.id === questionId)) return dq.deckId;
  }
  return undefined;
}
