// Case Studies — real-world stories showing PM tools in action
// Each case study is linked to a card ID

export interface CaseStudy {
  id: string;
  cardId: string;
  title: string;
  industry: string;
  company: string; // anonymised or real
  challenge: string;
  approach: string;
  outcome: string;
  lesson: string;
  tags: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  // T1 — Gantt Chart
  {
    id: 'cs-T1-1',
    cardId: 'T1',
    title: 'Keeping a Hospital IT Rollout on Track',
    industry: 'Healthcare',
    company: 'Regional NHS Trust (UK)',
    challenge: 'A 14-month electronic patient records rollout across 6 hospital sites had no shared visibility of progress. Each site manager was tracking tasks in separate spreadsheets, leading to missed dependencies and last-minute surprises.',
    approach: 'The project manager introduced a master Gantt chart in Microsoft Project, breaking the rollout into phases (infrastructure, training, go-live) per site. Dependencies between sites were made explicit — site 2 could not go live until site 1 had completed training and signed off.',
    outcome: 'The shared Gantt became the single source of truth for weekly steering meetings. Two critical path delays were spotted 6 weeks early, allowing resource reallocation. The project completed 3 weeks late (vs. a previous estimate of 4 months late).',
    lesson: 'A Gantt chart is most powerful not as a planning tool but as a communication tool. Making dependencies visible to all stakeholders is what prevents late surprises.',
    tags: ['IT', 'Healthcare', 'Schedule Management'],
  },
  // T2 — Critical Path Method
  {
    id: 'cs-T2-1',
    cardId: 'T2',
    title: 'Accelerating a Factory Shutdown',
    industry: 'Manufacturing',
    company: 'Automotive Components Manufacturer',
    challenge: 'A planned 10-day factory shutdown for equipment upgrades was estimated to cost £2M per day in lost production. The project team needed to find ways to compress the schedule without compromising safety.',
    approach: 'The PM mapped all 340 tasks into a network diagram and calculated the critical path. Of the 340 tasks, only 47 were on the critical path. The team focused crashing efforts (adding resources) exclusively on those 47 tasks, leaving the 293 non-critical tasks unchanged.',
    outcome: 'The shutdown was completed in 8 days instead of 10, saving approximately £4M in lost production. The non-critical tasks were completed with float to spare, and no safety incidents occurred.',
    lesson: 'Not all tasks are equal. Spending time and money accelerating non-critical tasks is waste. CPM tells you exactly where to focus your effort.',
    tags: ['Manufacturing', 'Schedule Compression', 'Critical Path'],
  },
  // T4 — Earned Value Management
  {
    id: 'cs-T4-1',
    cardId: 'T4',
    title: 'Catching a £3M Overrun Before It Happened',
    industry: 'Construction',
    company: 'Major UK Infrastructure Project',
    challenge: 'A £45M road widening project was 4 months in. The project sponsor felt "something was off" but the monthly reports showed costs tracking to budget. The PM was asked to investigate.',
    approach: 'The PM introduced Earned Value Management for the first time on the project. When EV ($12M worth of work completed) was compared to AC ($15M spent) and PV ($14M planned), the CPI was 0.80 — meaning for every £1 spent, only 80p of value was being delivered. The SPI was 0.86 — behind schedule too.',
    outcome: 'The EVM analysis revealed a forecast overrun of £9M (EAC = BAC/CPI = £45M/0.80 = £56M). The sponsor approved a recovery plan 5 months before the overrun would have become visible in traditional cost reports. The final overrun was contained to £4.2M.',
    lesson: 'Traditional cost reports tell you what you\'ve spent. EVM tells you what you\'ve got for what you\'ve spent. The difference is the early warning system every project needs.',
    tags: ['Construction', 'Cost Control', 'EVM'],
  },
  // T6 — Risk Register
  {
    id: 'cs-T6-1',
    cardId: 'T6',
    title: 'The Risk That Saved a Software Launch',
    industry: 'Technology',
    company: 'FinTech Startup',
    challenge: 'A payments startup was 6 weeks from launching its first product. The team was focused on feature delivery and had not formally assessed risks. The CTO felt the launch date was "aggressive but achievable".',
    approach: 'The PM facilitated a 2-hour risk workshop with the core team. 34 risks were identified. One risk — "third-party payment gateway API changes without notice" — was rated high probability/high impact. The team had assumed the API was stable. A mitigation action was created: contact the gateway provider to confirm API stability and subscribe to their changelog.',
    outcome: 'Two days later, the gateway provider announced a breaking API change scheduled for 4 weeks\' time — exactly during the planned launch window. Because the risk had been identified and the team was already monitoring, they had 4 weeks to adapt rather than discovering it on launch day. The launch was delayed by 2 weeks (not 8).',
    lesson: 'The most valuable risks in a register are not the ones everyone already knows about. They\'re the ones that seem obvious in hindsight but nobody had explicitly named.',
    tags: ['Technology', 'Risk Management', 'Launch'],
  },
  // T9 — Fishbone Diagram
  {
    id: 'cs-T9-1',
    cardId: 'T9',
    title: 'Finding the Real Reason Deliveries Were Late',
    industry: 'Logistics',
    company: 'E-commerce Fulfilment Centre',
    challenge: 'A warehouse was consistently missing its 24-hour delivery promise, with 18% of orders arriving late. Management assumed the problem was driver shortages and had been hiring more drivers for 3 months with no improvement.',
    approach: 'A quality improvement team used a Fishbone diagram to map all possible causes of late deliveries across 6 categories (People, Process, Equipment, Materials, Environment, Management). The analysis revealed that 73% of late deliveries originated from a single picking station that was 40 metres further from the dispatch bay than all others.',
    outcome: 'Relocating the picking station cost £8,000 and took 3 days. Late deliveries dropped from 18% to 4% within 2 weeks. The hiring programme was paused, saving £180,000 in annual salary costs.',
    lesson: 'The obvious cause is rarely the root cause. A structured cause-and-effect analysis prevents expensive solutions to the wrong problem.',
    tags: ['Logistics', 'Quality', 'Root Cause Analysis'],
  },
  // M2 — Scrum
  {
    id: 'cs-M2-1',
    cardId: 'M2',
    title: 'Transforming a Failing Government Digital Project',
    industry: 'Government',
    company: 'UK Government Digital Service',
    challenge: 'A citizen-facing benefits portal had been in development for 3 years using a traditional waterfall approach. £12M had been spent with nothing delivered to users. The project was at risk of cancellation.',
    approach: 'A new delivery team was brought in and switched to Scrum with 2-week sprints. The first sprint delivered a working (though limited) version of the most-used feature — address lookup. Real users tested it in week 3. Feedback revealed that the original requirements had misunderstood how citizens actually searched for their address.',
    outcome: 'Within 6 months, the team had delivered a working portal used by 40,000 citizens per month. The total cost of the working product was £2.1M — a fraction of the original £12M spend. The early user testing prevented building 18 months of features based on incorrect assumptions.',
    lesson: 'Delivering working software to real users early is not just an agile principle — it\'s risk management. Every month you delay user feedback is a month of potential wasted effort.',
    tags: ['Government', 'Agile', 'Digital Transformation'],
  },
  // M5 — Kanban
  {
    id: 'cs-M5-1',
    cardId: 'M5',
    title: 'Reducing Support Ticket Backlog by 70%',
    industry: 'Software',
    company: 'SaaS Company (Series B)',
    challenge: 'A customer support team had a growing backlog of 400+ open tickets. The team was working hard but tickets were taking an average of 8 days to resolve. Customer satisfaction scores were declining.',
    approach: 'The team lead introduced a Kanban board with explicit WIP limits: maximum 5 tickets in "In Progress" per person, maximum 10 in "Awaiting Customer Response". The WIP limits forced the team to finish tickets before starting new ones. A daily standup focused on blocked tickets rather than status updates.',
    outcome: 'Within 6 weeks, average resolution time dropped from 8 days to 2.5 days. The backlog fell from 400 to 120 tickets. Customer satisfaction scores increased by 22 points. The team reported feeling less stressed despite handling the same volume of work.',
    lesson: 'The counterintuitive truth about Kanban: doing less work at once makes you faster overall. WIP limits force focus and surface bottlenecks that busyness was hiding.',
    tags: ['Software', 'Kanban', 'Customer Support'],
  },
  // people-5 — Conflict Resolution
  {
    id: 'cs-people5-1',
    cardId: 'people-5',
    title: 'Resolving a Technical Standoff That Was Blocking a Launch',
    industry: 'Technology',
    company: 'Scale-up (Series A)',
    challenge: 'Two senior engineers were in a prolonged disagreement about database architecture. The conflict had lasted 6 weeks and was blocking 4 other developers. The CTO had tried to intervene twice but both engineers felt their approach was being dismissed.',
    approach: 'The PM used a structured conflict resolution approach: first meeting each engineer separately to understand their underlying concerns (not just their stated positions). It emerged that both engineers agreed on the core requirement — they disagreed on which risk was more important to mitigate. A joint session was facilitated where both engineers presented their approach as a solution to a specific risk, rather than as "the right answer".',
    outcome: 'The engineers agreed on a hybrid approach that addressed both risks within 2 hours of the joint session. The 6-week standoff was resolved in a single afternoon. The PM noted that neither engineer had previously understood what the other was actually worried about.',
    lesson: 'Most technical conflicts are not about technology. They\'re about different risk tolerances and unstated assumptions. Separating positions from interests is the fastest path to resolution.',
    tags: ['Technology', 'Conflict Resolution', 'Team Management'],
  },
  // people-7 — Stakeholder Management
  {
    id: 'cs-people7-1',
    cardId: 'people-7',
    title: 'Turning a Hostile Stakeholder into a Champion',
    industry: 'Retail',
    company: 'National Retailer',
    challenge: 'A new inventory management system was being rolled out across 200 stores. The regional manager for the North was vocally opposed to the project, telling store managers it was "another IT project that would create more work, not less". His opposition was spreading to other regions.',
    approach: 'The PM met with the regional manager one-to-one and listened without defending the project. The manager\'s core concern was that the previous system rollout had required his team to do double data entry for 3 months. The PM acknowledged this was a legitimate failure and invited the manager to join the project\'s User Advisory Group, giving him direct input into the rollout plan for his region.',
    outcome: 'The regional manager became one of the project\'s strongest advocates. He identified 3 process changes that reduced the transition workload significantly. His region had the smoothest rollout of all, and he presented the results at the company\'s annual conference.',
    lesson: 'Resistance is almost always based on a legitimate past experience or unmet need. Finding out what that is — and genuinely addressing it — converts opponents into allies.',
    tags: ['Retail', 'Stakeholder Management', 'Change Management'],
  },
  // process-3 — Risk Assessment
  {
    id: 'cs-proc3-1',
    cardId: 'process-3',
    title: 'The Risk Assessment That Prevented a £500k Penalty',
    industry: 'Financial Services',
    company: 'Insurance Company',
    challenge: 'A regulatory compliance project had a hard deadline — missing it would trigger a £500,000 FCA fine. The project was on track, but a risk assessment had never been formally conducted.',
    approach: 'With 10 weeks to go, the PM facilitated a structured risk assessment using a probability/impact matrix. One risk stood out: "Key developer leaves before completion" was rated high probability (the developer had been headhunted twice in the past year) and critical impact (she was the only person who understood the legacy system integration).',
    outcome: 'The PM immediately arranged knowledge transfer sessions and documented the integration approach. Three weeks later, the developer resigned. Because of the knowledge transfer, her replacement was productive within 2 weeks rather than the estimated 8 weeks. The project completed on time. The £500k fine was avoided.',
    lesson: 'Risk assessment is not a bureaucratic exercise. It is the process of asking "what could go wrong?" before it does. The value is in the conversation, not the document.',
    tags: ['Financial Services', 'Risk Management', 'Compliance'],
  },
  // archetypes-1 — Project Sponsor
  {
    id: 'cs-arch1-1',
    cardId: 'archetypes-1',
    title: 'What Happens When the Sponsor Goes Missing',
    industry: 'Retail',
    company: 'Global Fashion Retailer',
    challenge: 'A major ERP implementation had a project sponsor who was enthusiastic at kickoff but became increasingly unavailable as the project progressed. Decisions that required sponsor authority were queuing up, causing delays. The project team was making decisions they were not empowered to make.',
    approach: 'The PM documented the backlog of 12 pending decisions and their impact on the schedule. She requested a 30-minute monthly governance meeting with the sponsor and presented the decision backlog as a risk to the project\'s business case. She also proposed a delegated authority matrix so that lower-stakes decisions could be made without sponsor involvement.',
    outcome: 'The sponsor re-engaged, cleared the decision backlog in two meetings, and approved the delegated authority matrix. The project recovered 3 weeks of lost time. The PM later reflected that presenting the sponsor\'s absence as a business risk (not a personal failing) was the key to re-engaging them.',
    lesson: 'A disengaged sponsor is one of the most common and most damaging project risks. The solution is not to work around them — it is to make the cost of their absence visible and specific.',
    tags: ['Retail', 'Governance', 'Stakeholder Management'],
  },
  // T3 — Work Breakdown Structure
  {
    id: 'cs-T3-1',
    cardId: 'T3',
    title: 'How a WBS Revealed a Missing £200k of Work',
    industry: 'Construction',
    company: 'Commercial Property Developer',
    challenge: 'A £1.8M office fit-out project had been scoped and budgeted based on a high-level description. The project manager had a nagging feeling the budget was too tight but could not identify where the gap was.',
    approach: 'The PM created a detailed Work Breakdown Structure, decomposing the project to Level 3 (work packages). When the WBS was reviewed with the quantity surveyor, two entire work packages were identified that had not been included in the original budget: IT infrastructure cabling (£95,000) and acoustic ceiling treatment (£110,000). Both had been assumed to be "someone else\'s scope".',
    outcome: 'The £205,000 gap was identified before contracts were signed. The client was informed and the budget was revised. The project completed within the revised budget. Without the WBS, the overrun would have been discovered mid-construction with no contractual mechanism to recover costs.',
    lesson: 'A WBS is a scope discovery tool as much as a planning tool. The act of decomposing work to the level of work packages reliably surfaces scope that was assumed but never explicitly included.',
    tags: ['Construction', 'Scope Management', 'Cost Management'],
  },
];

export function getCaseStudiesByCard(cardId: string): CaseStudy[] {
  return CASE_STUDIES.filter(cs => cs.cardId === cardId);
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find(cs => cs.id === id);
}
