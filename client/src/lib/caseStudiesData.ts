// StratAlign — Case Studies Data Library
// Real-world examples showing PM tools in action.
// Each card can have one case study. The Case Studies tab on CardDetail
// is only rendered when a case study exists for that card.

export interface CaseStudy {
  cardId: string;
  organisation: string;
  industry: string;
  projectName: string;
  challenge: string;
  approach: string;
  outcome: string;
  lessonsLearned: string[];
  timeframe?: string;
  teamSize?: string;
  quote?: { text: string; attribution: string };
}

const CASE_STUDIES: CaseStudy[] = [

  // ─── Methodologies ────────────────────────────────────────────────────────

  {
    cardId: 'M1',
    organisation: 'NASA Jet Propulsion Laboratory',
    industry: 'Aerospace & Government',
    projectName: 'Mars Science Laboratory (Curiosity Rover)',
    challenge: 'Delivering a highly complex, safety-critical rover with zero tolerance for failure. Requirements were fixed by physics and mission science, making a sequential, plan-driven approach essential.',
    approach: 'JPL applied a strict Waterfall methodology with formal phase gates: requirements, design, build, test, and launch. Each phase required sign-off before the next could begin. Extensive documentation and verification testing were mandated at every stage.',
    outcome: 'Curiosity landed successfully on Mars in August 2012 and continues to operate over a decade later. The structured approach ensured every component was traceable to a verified requirement, with no critical failures during the mission-critical entry, descent, and landing sequence.',
    lessonsLearned: [
      'Waterfall excels when requirements are fully known upfront and change would be catastrophic.',
      'Formal phase gates create accountability and prevent scope creep in high-stakes environments.',
      'Comprehensive documentation is an investment, not overhead — it enables knowledge transfer across multi-year projects.',
    ],
    timeframe: '8 years (2004–2012)',
    teamSize: '2,500+ engineers and scientists',
    quote: {
      text: 'We had one chance to get it right. Every requirement, every test, every sign-off existed because a mistake 350 million miles away cannot be undone.',
      attribution: 'MSL Project Manager, JPL',
    },
  },

  {
    cardId: 'M2',
    organisation: 'Spotify',
    industry: 'Technology / Music Streaming',
    projectName: 'Squad Model — Agile at Scale',
    challenge: 'Spotify needed to scale from a small startup to hundreds of engineers while preserving the speed and autonomy that made them innovative. Traditional hierarchies were slowing delivery and killing morale.',
    approach: 'Spotify developed its own Agile-inspired model built around autonomous Squads (small cross-functional teams owning a feature area), Tribes (collections of squads), Chapters (skill communities), and Guilds (interest communities). Each squad ran its own Agile ceremonies and had end-to-end ownership of its product area.',
    outcome: 'Spotify scaled to over 2,000 engineers while maintaining rapid release cycles. The model became so influential it was adopted (or adapted) by companies worldwide, including ING Bank, Zalando, and Klarna.',
    lessonsLearned: [
      'Agile at scale requires deliberate organisational design, not just process adoption.',
      'Autonomy and alignment must be balanced — squads need freedom within guardrails.',
      'The "Spotify model" is a mindset, not a template; copying it without the culture often fails.',
    ],
    timeframe: '2012–present',
    teamSize: '2,000+ engineers across 150+ squads',
    quote: {
      text: 'We try to have a minimum of rules and a maximum of trust.',
      attribution: 'Henrik Kniberg, Agile Coach at Spotify',
    },
  },

  {
    cardId: 'M3',
    organisation: 'Toyota',
    industry: 'Automotive Manufacturing',
    projectName: 'Toyota Production System — Kanban Origins',
    challenge: 'Post-war Toyota faced severe material shortages and needed to eliminate waste across its production lines. Overproduction was causing inventory build-up and hiding quality problems.',
    approach: 'Toyota engineer Taiichi Ohno developed the Kanban system, inspired by US supermarket restocking. Cards (kanbans) signalled when a workstation needed more parts, creating a pull-based flow. Work only moved forward when there was capacity to receive it, making bottlenecks visible immediately.',
    outcome: 'Toyota became the world\'s most efficient automaker. The Toyota Production System, with Kanban at its core, reduced inventory by over 75%, cut defect rates dramatically, and enabled just-in-time manufacturing that competitors spent decades trying to replicate.',
    lessonsLearned: [
      'Visualising work in progress is the first step to improving flow.',
      'Pull systems prevent overproduction and surface bottlenecks naturally.',
      'Limiting WIP is uncomfortable at first but essential for sustainable pace.',
    ],
    timeframe: '1950s–present',
    teamSize: 'Entire production workforce (tens of thousands)',
    quote: {
      text: 'All we are doing is looking at the time line, from the moment the customer gives us an order to the point when we collect the cash. And we are reducing that time line.',
      attribution: 'Taiichi Ohno, Father of the Toyota Production System',
    },
  },

  {
    cardId: 'M4',
    organisation: 'ING Bank',
    industry: 'Financial Services',
    projectName: 'Agile Transformation with Hybrid Delivery',
    challenge: 'ING needed to compete with fintech disruptors while still operating under strict financial regulation. Pure Agile conflicted with compliance requirements; pure Waterfall was too slow for digital product development.',
    approach: 'ING adopted a Hybrid methodology: product development teams used Agile sprints for customer-facing features, while regulatory and infrastructure projects followed a structured Waterfall approach with formal sign-offs. A governance layer connected both streams, ensuring compliance without blocking innovation.',
    outcome: 'ING reduced time-to-market for new features from 18 months to under 5 weeks. The bank successfully launched challenger products like Yolt while maintaining full regulatory compliance. The hybrid model is now their standard operating approach.',
    lessonsLearned: [
      'One methodology rarely fits an entire organisation — match the approach to the work type.',
      'Governance bridges between Agile and Waterfall streams prevent compliance gaps.',
      'Cultural change is harder than process change; invest in coaching alongside tooling.',
    ],
    timeframe: '2015–2018 transformation, ongoing',
    teamSize: '350 squads, ~9,000 employees restructured',
  },

  // ─── Tools ────────────────────────────────────────────────────────────────

  {
    cardId: 'T1',
    organisation: 'Crossrail (Elizabeth Line)',
    industry: 'Infrastructure / Transport',
    projectName: 'Elizabeth Line — London\'s New Railway',
    challenge: 'Coordinating 10,000 workers across 40 construction sites simultaneously, with interdependencies between tunnelling, station fit-out, systems integration, and testing that spanned over a decade.',
    approach: 'Programme managers used hierarchical Gantt Charts at multiple levels: a master programme Gantt showing major milestones, section-level Gantt charts for each station and tunnel drive, and 12-week lookahead Gantt charts for detailed scheduling. Microsoft Project integrated with Primavera P6 for cross-contractor visibility.',
    outcome: 'Despite significant delays (the line opened in 2022, four years late), the Gantt-based programme controls were credited with preventing further slippage once the recovery plan was implemented. The tool enabled rapid scenario modelling when the opening date was revised.',
    lessonsLearned: [
      'Gantt Charts at multiple levels of detail serve different audiences — executives need milestones, site managers need daily tasks.',
      'Interdependency mapping between contractors is as important as individual task scheduling.',
      'A Gantt Chart shows the plan; earned value management shows reality — use both.',
    ],
    timeframe: '2009–2022',
    teamSize: '10,000 workers at peak',
  },

  {
    cardId: 'T2',
    organisation: 'Trello / Atlassian',
    industry: 'Technology / SaaS',
    projectName: 'Remote-First Product Development',
    challenge: 'Trello\'s own engineering team needed to coordinate asynchronous product development across time zones after going fully remote, without losing visibility of work in progress.',
    approach: 'The team used Kanban boards with columns for Backlog, In Progress, In Review, and Done. Each card contained the full context needed to work asynchronously. WIP limits were set per column, and a daily async standup replaced synchronous meetings. The board became the single source of truth.',
    outcome: 'Trello\'s engineering team maintained delivery velocity after going remote and used their own product as a showcase for distributed Kanban. The approach influenced how Atlassian marketed Trello to remote teams globally.',
    lessonsLearned: [
      'Kanban boards are especially powerful for remote teams where verbal communication is limited.',
      'WIP limits force prioritisation conversations that would otherwise be avoided.',
      'Cards must contain full context — a title alone is not enough for async work.',
    ],
    timeframe: '2020–present',
    teamSize: '50-person distributed engineering team',
  },

  {
    cardId: 'T3',
    organisation: 'Boeing',
    industry: 'Aerospace Manufacturing',
    projectName: '787 Dreamliner Development',
    challenge: 'The 787 involved over 50 global suppliers contributing major structural components. Boeing needed a way to decompose the entire aircraft into manageable work packages that could be assigned, tracked, and integrated across continents.',
    approach: 'Boeing created a multi-level Work Breakdown Structure that decomposed the aircraft from the top level (787 Programme) through systems (fuselage, wings, avionics) down to individual components and tasks. Each WBS element had a unique identifier, budget, schedule, and responsible party. The WBS became the backbone of the entire programme management system.',
    outcome: 'Despite significant programme delays caused by supply chain integration challenges (the WBS itself was sound, but supplier readiness was underestimated), the WBS structure enabled Boeing to identify and isolate problems. The 787 eventually entered service and became one of Boeing\'s most commercially successful aircraft.',
    lessonsLearned: [
      'A WBS is only as good as the assumptions behind it — validate supplier capabilities before locking the structure.',
      'The WBS should be created collaboratively with the teams who will execute the work.',
      'WBS elements need owners, not just labels — accountability must be explicit.',
    ],
    timeframe: '2004–2011 (development phase)',
    teamSize: '50+ global suppliers, thousands of engineers',
  },

  {
    cardId: 'T4',
    organisation: 'US Department of Defense',
    industry: 'Government / Defence',
    projectName: 'F-35 Joint Strike Fighter Programme',
    challenge: 'Managing a $400 billion programme across multiple contractors, countries, and decades required an objective, data-driven method to measure true progress rather than relying on contractor self-reporting.',
    approach: 'The DoD mandated Earned Value Management across all major defence contracts. Each contractor reported Planned Value, Earned Value, and Actual Cost monthly. Cost Performance Index (CPI) and Schedule Performance Index (SPI) were calculated and reviewed at programme reviews. Variances triggered formal corrective action plans.',
    outcome: 'EVM revealed significant cost and schedule overruns early enough to trigger programme restructuring. While the F-35 still experienced major overruns, EVM data enabled the DoD to make informed decisions about scope, funding, and contractor performance rather than discovering problems at delivery.',
    lessonsLearned: [
      'EVM is a diagnostic tool — it tells you there is a problem, not how to fix it.',
      'CPI below 0.9 early in a project is a strong predictor of final cost overrun.',
      'EVM requires disciplined baseline management — changing the baseline to hide variances defeats the purpose.',
    ],
    timeframe: '2001–present',
    teamSize: 'Programme office of 3,000+, multiple prime contractors',
  },

  {
    cardId: 'T5',
    organisation: 'Google',
    industry: 'Technology',
    projectName: 'Google Chrome Launch (2008)',
    challenge: 'Launching a new browser involved dozens of teams: engineering, security, UX, legal, marketing, and localisation. Without clear ownership, decisions were being made by the wrong people and critical tasks were falling through the cracks.',
    approach: 'Google used a RACI Matrix to define roles across all workstreams. Each major deliverable — rendering engine, extension API, security model, marketing campaign — had a single Accountable owner, clear Responsible parties, and defined Consulted and Informed stakeholders. The matrix was reviewed weekly and updated as the team grew.',
    outcome: 'Chrome launched on schedule in September 2008 and within two years became the world\'s most-used browser. Post-launch reviews credited the clear ownership model with enabling fast decision-making and preventing the "design by committee" problem that had plagued earlier browser projects.',
    lessonsLearned: [
      'There must be exactly one Accountable person per deliverable — shared accountability means no accountability.',
      'RACI matrices become stale quickly on fast-moving projects; schedule regular reviews.',
      'The "Informed" column is often underused — keeping stakeholders informed prevents surprises.',
    ],
    timeframe: '2006–2008 (development to launch)',
    teamSize: '100+ across multiple teams',
  },

  {
    cardId: 'T6',
    organisation: 'Heathrow Airport',
    industry: 'Aviation / Infrastructure',
    projectName: 'Terminal 5 Construction',
    challenge: 'The £4.3 billion Terminal 5 project faced hundreds of risks across construction, systems integration, and operational readiness. The infamous opening-day baggage system failure showed what happens when risk management is inadequate.',
    approach: 'During construction, Heathrow maintained a comprehensive Risk Register with over 2,000 identified risks. Each risk had a probability rating, impact score, risk owner, and mitigation plan. The register was reviewed weekly by the programme board. For operational risks (baggage handling), a separate register tracked technology integration risks.',
    outcome: 'Construction was delivered on time and within budget — a rare achievement for major infrastructure. However, the baggage system risks were inadequately mitigated, leading to the chaotic opening day in March 2008. The lesson became a case study in the difference between having a risk register and actively managing it.',
    lessonsLearned: [
      'A risk register is not a risk management system — risks must be actively monitored and mitigated.',
      'Operational readiness risks deserve the same rigour as construction risks.',
      'Risk owners must have the authority and resources to implement mitigations.',
    ],
    timeframe: '2002–2008',
    teamSize: '60,000 workers over the construction period',
    quote: {
      text: 'We had identified the baggage system as a risk. What we failed to do was test it under realistic conditions before opening day.',
      attribution: 'T5 Programme Director, post-incident review',
    },
  },

  {
    cardId: 'T7',
    organisation: 'Airbnb',
    industry: 'Technology / Hospitality',
    projectName: 'Mobile App Redesign (2014)',
    challenge: 'Airbnb\'s product team had a backlog of hundreds of features requested by hosts, guests, and internal stakeholders. With limited engineering capacity, they needed a principled way to decide what to build for the mobile app redesign.',
    approach: 'The product team applied MoSCoW Prioritisation across all feature requests. Must-Have features (core booking flow, messaging, payments) were locked. Should-Have features (reviews, wish lists) were included if capacity allowed. Could-Have features (social sharing, map views) were deferred. Won\'t-Have features were explicitly parked for future consideration.',
    outcome: 'The redesigned app launched on time with a focused feature set. User satisfaction scores increased 22% compared to the previous version. By explicitly categorising Won\'t-Have items, the team avoided scope creep and stakeholder disappointment — everyone knew what was deferred and why.',
    lessonsLearned: [
      'MoSCoW only works if stakeholders genuinely accept the Won\'t-Have category.',
      'Must-Have should be the minimum viable product — if everything is Must-Have, the tool has failed.',
      'Document the rationale for each category to prevent revisiting decisions mid-project.',
    ],
    timeframe: '2013–2014',
    teamSize: '30-person product and engineering team',
  },

  {
    cardId: 'T8',
    organisation: 'Toyota (Quality Division)',
    industry: 'Automotive Manufacturing',
    projectName: 'Brake Defect Root Cause Analysis',
    challenge: 'A production line was producing brake assemblies with an intermittent defect rate of 0.3%. The defect was causing recalls and warranty costs. Multiple potential causes had been identified but the true root cause was unclear.',
    approach: 'Quality engineers used a Fishbone (Ishikawa) Diagram to systematically map all potential causes across the 6M categories: Machine, Method, Material, Man, Measurement, and Mother Nature. The team brainstormed causes in each category, then used data collection to test each hypothesis. The diagram revealed that the root cause was a combination of a worn machine component (Machine) and an inconsistent inspection procedure (Method).',
    outcome: 'The defect rate dropped to near zero within two production cycles after both root causes were addressed. The structured approach prevented the team from jumping to the most obvious solution (replacing the machine) and missing the procedural issue that would have caused the defect to recur.',
    lessonsLearned: [
      'Fishbone diagrams prevent teams from fixing symptoms rather than causes.',
      'The most obvious cause is rarely the only cause — always explore all categories.',
      'Combine the diagram with data collection to validate hypotheses rather than relying on intuition.',
    ],
    timeframe: '3-week investigation',
    teamSize: '8-person cross-functional quality team',
  },

  {
    cardId: 'T11',
    organisation: 'City of Charlotte, North Carolina',
    industry: 'Local Government',
    projectName: 'Corporate Scorecard Implementation',
    challenge: 'Charlotte\'s city government was struggling to connect its strategic goals (safe community, quality of life, economic opportunity) to day-to-day operational performance. Departments operated in silos with no shared performance framework.',
    approach: 'Charlotte became one of the first US cities to implement the Balanced Scorecard in the 1990s. The city defined objectives across four perspectives: Financial (cost efficiency), Customer (citizen satisfaction), Internal Process (service delivery), and Learning & Growth (staff development). Each department developed cascading scorecards aligned to the city\'s strategic map.',
    outcome: 'Charlotte won the Malcolm Baldrige National Quality Award and became an international model for government performance management. The Balanced Scorecard approach was credited with improving citizen satisfaction scores by 15% over five years while reducing per-capita service costs.',
    lessonsLearned: [
      'Strategy maps that show cause-and-effect relationships between objectives are more powerful than scorecards alone.',
      'Cascading scorecards from city level to department level creates alignment without micromanagement.',
      'Public sector scorecards must balance financial efficiency with citizen outcomes — cost reduction alone is not success.',
    ],
    timeframe: '1996–2001 (initial implementation)',
    teamSize: 'City-wide, 6,000+ employees',
  },

  {
    cardId: 'T16',
    organisation: 'Salesforce',
    industry: 'Technology / CRM',
    projectName: 'Enterprise CRM Implementation at a Global Bank',
    challenge: 'A major bank implementing Salesforce had 200+ stakeholders across retail banking, corporate banking, IT, compliance, and marketing. Without a clear picture of who had influence and who had interest, the implementation team was spending equal time on all stakeholders — including those who had little impact on success.',
    approach: 'The project team created a Stakeholder Matrix mapping all 200+ stakeholders on a Power/Interest grid. High-power, high-interest stakeholders (CIO, Head of Retail Banking) were managed closely with weekly briefings. High-power, low-interest stakeholders (CFO) were kept satisfied with monthly executive summaries. Low-power, high-interest stakeholders (branch managers) were kept informed through a newsletter. Low-power, low-interest stakeholders were monitored passively.',
    outcome: 'The implementation was delivered on time and within budget. Post-project surveys showed 87% stakeholder satisfaction. The team credited the matrix with preventing two near-fatal escalations — both from high-power stakeholders who had been under-engaged before the matrix was applied.',
    lessonsLearned: [
      'Stakeholder positions shift during a project — review the matrix at least monthly.',
      'Moving low-interest stakeholders to high-interest (through engagement) is often worth the investment.',
      'The matrix is a starting point; the real work is the engagement strategy that follows.',
    ],
    timeframe: '18-month implementation',
    teamSize: '45-person project team, 200+ stakeholders',
  },

  {
    cardId: 'T17',
    organisation: 'Spotify Engineering',
    industry: 'Technology',
    projectName: 'Squad Velocity Tracking',
    challenge: 'Spotify\'s engineering squads needed a way to track whether they were on track to deliver sprint goals and to make the impact of technical debt visible to product managers who were pushing for features.',
    approach: 'Each squad maintained a Burndown Chart for every two-week sprint. Story points were estimated at sprint planning and tracked daily. When the actual burndown line diverged from the ideal line, the squad held an impromptu discussion to identify blockers. The charts were displayed on physical boards in the team area and updated during daily standups.',
    outcome: 'Squads using burndown charts consistently identified blockers 2–3 days earlier than squads using only verbal standups. The visual nature of the chart made it easy for product managers to see when technical debt was slowing delivery, leading to more balanced sprint planning.',
    lessonsLearned: [
      'Burndown charts are most valuable when the team updates them daily — weekly updates hide daily blockers.',
      'A flat burndown line (no progress) is a signal to investigate immediately, not at the sprint retrospective.',
      'Burndown charts measure output, not outcomes — combine with customer metrics for full picture.',
    ],
    timeframe: 'Ongoing practice',
    teamSize: '6–8 person squads',
  },

  // ─── People Domain ────────────────────────────────────────────────────────

  {
    cardId: 'people-1',
    organisation: 'Pixar Animation Studios',
    industry: 'Entertainment / Creative',
    projectName: 'Braintrust Model — Creative Conflict Resolution',
    challenge: 'During production of early films, creative disagreements between directors and producers were escalating into personal conflicts that threatened project delivery. The traditional hierarchy meant junior team members couldn\'t challenge senior creative decisions even when they spotted problems.',
    approach: 'Pixar developed the "Braintrust" — a regular meeting where directors presented work-in-progress to a group of experienced storytellers. Feedback was candid and direct, but crucially, the Braintrust had no authority to direct changes. The director retained creative control. This separated the conflict from the power dynamic, making honest feedback safe.',
    outcome: 'Films like Toy Story 2, Finding Nemo, and Up were significantly improved through Braintrust feedback. The model became central to Pixar\'s creative process and was documented by CEO Ed Catmull as a key reason for the studio\'s sustained creative success.',
    lessonsLearned: [
      'Separating feedback from authority makes honest critique possible.',
      'Psychological safety must be designed into the process, not assumed.',
      'The goal of conflict resolution is better outcomes, not harmony — productive disagreement is healthy.',
    ],
    timeframe: 'Established mid-1990s, ongoing',
    teamSize: '8–12 person Braintrust, 200–400 per film production',
    quote: {
      text: 'The Braintrust works because it is made up of people who have a deep understanding of storytelling and who genuinely want each other\'s films to succeed.',
      attribution: 'Ed Catmull, Co-founder of Pixar',
    },
  },

  {
    cardId: 'people-2',
    organisation: 'Microsoft',
    industry: 'Technology',
    projectName: 'Satya Nadella\'s Cultural Transformation',
    challenge: 'When Satya Nadella became CEO in 2014, Microsoft\'s culture was characterised by internal competition, fixed mindset thinking, and siloed teams that refused to collaborate. The "stack ranking" performance system had created a culture where employees competed against each other rather than against competitors.',
    approach: 'Nadella applied servant leadership principles: he modelled a growth mindset publicly, eliminated stack ranking, and focused on empowering teams rather than directing them. He articulated a clear mission ("empower every person and organisation on the planet to achieve more") and gave teams the autonomy to pursue it. He prioritised listening over telling.',
    outcome: 'Microsoft\'s market capitalisation grew from $300 billion to over $2 trillion under Nadella\'s leadership. Employee engagement scores improved dramatically. The cultural shift enabled the Azure cloud platform to grow from a minor product to the company\'s primary revenue driver.',
    lessonsLearned: [
      'Culture change starts with leadership behaviour, not policy announcements.',
      'A clear, inspiring mission gives teams direction without micromanagement.',
      'Removing systems that incentivise the wrong behaviour (stack ranking) is as important as adding new ones.',
    ],
    timeframe: '2014–present',
    teamSize: '220,000+ employees',
    quote: {
      text: 'Our industry does not respect tradition — it only respects innovation.',
      attribution: 'Satya Nadella, CEO of Microsoft',
    },
  },

  {
    cardId: 'people-6',
    organisation: 'Valve Corporation',
    industry: 'Technology / Gaming',
    projectName: 'Flat Organisation Team Building',
    challenge: 'Valve, maker of Steam and Half-Life, operates with no managers and no formal hierarchy. Building effective teams for game development required a radically different approach to team formation and role definition.',
    approach: 'Valve uses a self-organising team model where employees choose which projects to work on and physically move their desks to join teams. Teams form around projects, not departments. Role clarity emerges through a "stack ranking" of peers (different from Microsoft\'s — focused on contribution, not competition). New hires are given a handbook that explicitly describes how to build their team and find their role.',
    outcome: 'Valve has produced some of the most commercially successful games in history (Half-Life, Portal, Counter-Strike) and built Steam into the dominant PC gaming platform. The flat structure enables rapid team formation and prevents the bureaucratic overhead that slows larger studios.',
    lessonsLearned: [
      'Self-organising teams require explicit norms and cultural scaffolding — flat does not mean unstructured.',
      'Transparency about how decisions are made is essential when there is no hierarchy to defer to.',
      'This model works in specific contexts; it requires a high density of senior, self-motivated talent.',
    ],
    timeframe: 'Founded 1996, ongoing',
    teamSize: '360 employees (intentionally small)',
  },

  {
    cardId: 'people-9',
    organisation: 'NHS England',
    industry: 'Healthcare / Public Sector',
    projectName: 'COVID-19 Vaccine Rollout Programme',
    challenge: 'The UK\'s COVID-19 vaccination programme required unprecedented collaboration between NHS England, local authorities, GP networks, pharmacies, military logistics, and private sector partners — many of whom had never worked together before.',
    approach: 'The programme established a National Vaccination Programme Board with representatives from all stakeholder groups. Regular stakeholder forums were held at national, regional, and local levels. A shared data platform gave all partners visibility of vaccination rates and supply. Stakeholder collaboration was structured around shared outcomes (vaccination targets) rather than organisational boundaries.',
    outcome: 'The UK vaccinated over 15 million people in the first 12 weeks of the programme — the fastest rollout of any large country. The collaborative model was credited with enabling rapid problem-solving when supply issues arose, as partners shared information openly rather than protecting their own positions.',
    lessonsLearned: [
      'Shared data platforms break down information silos that prevent effective collaboration.',
      'Shared outcomes (not shared processes) are the most powerful alignment mechanism.',
      'In crisis situations, stakeholders are more willing to collaborate — use that window to establish lasting norms.',
    ],
    timeframe: 'December 2020 – March 2021 (first phase)',
    teamSize: '80,000+ vaccination staff across all partners',
  },

  // ─── Process Domain ───────────────────────────────────────────────────────

  {
    cardId: 'process-3',
    organisation: 'BP (British Petroleum)',
    industry: 'Energy / Oil & Gas',
    projectName: 'Deepwater Horizon — Risk Management Failure',
    challenge: 'The Deepwater Horizon drilling operation faced multiple identified risks related to well integrity, blowout preventer reliability, and cement job quality. The question was whether these risks were adequately assessed and mitigated.',
    approach: 'BP\'s risk management process identified the risks but the probability and impact assessments were systematically underestimated due to production pressure and cost-cutting. Key risk indicators (abnormal pressure readings, failed cement tests) were observed but not escalated. The risk register existed but was not driving decision-making.',
    outcome: 'The Deepwater Horizon explosion in April 2010 killed 11 workers and caused the largest marine oil spill in US history. The subsequent investigation found that the risk management process had failed not due to lack of tools, but due to a culture that prioritised schedule and cost over safety risk escalation.',
    lessonsLearned: [
      'Risk management culture matters more than risk management tools — a register that nobody acts on is worse than useless.',
      'Risk escalation must be psychologically safe; people must be able to raise concerns without career consequences.',
      'Leading indicators (near-misses, anomalous readings) must be taken seriously, not explained away.',
    ],
    timeframe: '2010',
    teamSize: '126 crew on the rig at time of explosion',
    quote: {
      text: 'The immediate cause was the failure of a cement job. The root cause was a management system that did not ensure the right decisions were made.',
      attribution: 'Presidential Commission on the BP Deepwater Horizon Oil Spill',
    },
  },

  {
    cardId: 'process-5',
    organisation: 'Sydney Opera House',
    industry: 'Architecture / Public Infrastructure',
    projectName: 'Sydney Opera House Construction',
    challenge: 'The Sydney Opera House is the most famous example of budget overrun in construction history. The original estimate was AUD $7 million; the final cost was AUD $102 million. Understanding what went wrong is as instructive as any success story.',
    approach: 'The original budget was prepared before the design was complete, a fundamental error in budget planning. As the iconic shell roof design was developed, costs escalated dramatically. There was no formal change control process, no contingency reserve, and no mechanism to re-baseline the budget when scope changed significantly.',
    outcome: 'The Opera House was completed in 1973, ten years late and 1,400% over budget. It is now one of the most visited buildings in the world and a UNESCO World Heritage Site. The project became a global case study in the consequences of inadequate budget planning and scope management.',
    lessonsLearned: [
      'Never finalise a budget before the design is sufficiently developed — parametric estimates on incomplete designs are unreliable.',
      'Contingency reserves must be sized to the uncertainty in the estimate, not to what is politically acceptable.',
      'Budget overruns compound — early overruns signal systemic problems that will worsen without intervention.',
    ],
    timeframe: '1957–1973',
    teamSize: '10,000 workers over the construction period',
  },

  {
    cardId: 'process-8',
    organisation: 'Denver International Airport',
    industry: 'Aviation / Infrastructure',
    projectName: 'Automated Baggage System Scope Failure',
    challenge: 'Denver International Airport added an automated baggage handling system to the project scope late in the programme. The system was vastly more complex than initially understood, and scope was not adequately defined before contracts were signed.',
    approach: 'The baggage system scope was added without a detailed requirements analysis or realistic schedule assessment. As the system was built, the scope expanded continuously — new requirements emerged, integration complexity was underestimated, and the original scope statement was never formally updated to reflect reality.',
    outcome: 'The baggage system caused the airport to open 16 months late at a cost overrun of $2 billion. When it finally opened, the system still failed repeatedly and was eventually abandoned in 2005, replaced by a conventional baggage system. The project became the definitive case study in scope management failure.',
    lessonsLearned: [
      'Scope must be fully defined before work begins — "we\'ll figure it out as we go" is not a scope management strategy.',
      'Adding major scope items late in a project requires a full re-baseline of schedule and budget.',
      'Scope creep is often invisible until it becomes catastrophic — track scope changes formally from day one.',
    ],
    timeframe: '1989–1995',
    teamSize: '3,000+ workers on the baggage system alone',
  },

  {
    cardId: 'process-10',
    organisation: 'Apple',
    industry: 'Technology / Consumer Electronics',
    projectName: 'iPhone Development (2005–2007)',
    challenge: 'The original iPhone project underwent massive scope and design changes during development. Steve Jobs famously scrapped the entire hardware keyboard concept midway through the project and demanded a touchscreen-only device, requiring significant rework.',
    approach: 'Apple\'s change management process was highly centralised — all major changes required Jobs\' direct approval. When the touchscreen decision was made, the team conducted a rapid impact assessment, re-baselined the schedule, and reallocated resources. The change was treated as a project restart, not a modification, with a new timeline and clear deliverables.',
    outcome: 'The iPhone launched in June 2007 and redefined the mobile phone industry. The willingness to make a major scope change and manage it rigorously — rather than proceeding with a suboptimal design — was central to the product\'s success.',
    lessonsLearned: [
      'Not all changes are bad — the discipline is in evaluating impact rigorously before approving.',
      'Major scope changes require a re-baseline, not a patch to the existing plan.',
      'Change authority must be clear — ambiguity about who can approve changes leads to either paralysis or chaos.',
    ],
    timeframe: '2005–2007',
    teamSize: '1,000+ engineers across hardware, software, and design',
  },

  // ─── Business Environment ─────────────────────────────────────────────────

  {
    cardId: 'business-2',
    organisation: 'Rolls-Royce',
    industry: 'Aerospace / Engineering',
    projectName: 'Power-by-the-Hour — Benefits Realisation Innovation',
    challenge: 'Rolls-Royce sold jet engines but struggled to demonstrate the long-term value of their engines to airlines. Airlines focused on upfront purchase price rather than total cost of ownership. Rolls-Royce needed a way to align their commercial model with the benefits they actually delivered.',
    approach: 'Rolls-Royce developed the "Power-by-the-Hour" model, charging airlines per hour of engine use rather than per engine. This required a complete rethinking of how benefits were defined and measured. The project team worked with airlines to define the value metrics that mattered (availability, reliability, cost per flight hour) and built a service model around delivering those outcomes.',
    outcome: 'Power-by-the-Hour became the dominant commercial model in the aerospace engine industry, with over 50% of Rolls-Royce\'s revenue now coming from services rather than products. The model transformed Rolls-Royce from an engine manufacturer into a performance outcomes business.',
    lessonsLearned: [
      'Benefits realisation starts with defining what "value" means to the customer, not to the supplier.',
      'Aligning commercial incentives with benefit delivery is more powerful than any governance mechanism.',
      'Measuring outcomes (engine availability) rather than outputs (engines sold) changes how teams prioritise work.',
    ],
    timeframe: '1962 (concept), 1990s (widespread adoption)',
    teamSize: 'Programme team of 200+, global service network of thousands',
  },

  // ─── Advanced Techniques ──────────────────────────────────────────────────

  {
    cardId: 'A1',
    organisation: 'Camp David Accords Negotiation',
    industry: 'International Diplomacy',
    projectName: 'Egypt-Israel Peace Treaty Negotiation (1978)',
    challenge: 'Egypt and Israel had been in a state of war for 30 years. Positions were entrenched: Egypt demanded the return of the Sinai Peninsula; Israel refused to withdraw. Traditional positional bargaining had failed repeatedly.',
    approach: 'US mediators, guided by what would later be codified as Principled Negotiation (Fisher & Ury\'s "Getting to Yes"), focused both parties on underlying interests rather than stated positions. Egypt\'s interest was sovereignty and national dignity; Israel\'s was security. These interests were compatible even though the positions were not. Creative options (phased withdrawal, demilitarised zones) satisfied both sets of interests.',
    outcome: 'The Camp David Accords were signed in 1978, leading to the Egypt-Israel Peace Treaty in 1979 — the first peace treaty between Israel and an Arab nation. The negotiation became the foundational case study for interest-based negotiation and directly inspired Fisher & Ury\'s landmark book.',
    lessonsLearned: [
      'Positions are what people say they want; interests are why they want it — always dig for interests.',
      'Creative options that satisfy both parties\' interests are almost always available once interests are understood.',
      'Objective criteria (international law, precedent) provide neutral ground when parties distrust each other.',
    ],
    timeframe: '13 days of intensive negotiation, September 1978',
    teamSize: 'Three delegations of 10–15 negotiators each',
    quote: {
      text: 'The key insight was that Egypt wanted sovereignty and Israel wanted security. These are not the same thing, and both can be achieved simultaneously.',
      attribution: 'Roger Fisher, co-author of Getting to Yes',
    },
  },

  {
    cardId: 'A18',
    organisation: 'General Electric',
    industry: 'Manufacturing / Conglomerate',
    projectName: 'Six Sigma Transformation under Jack Welch',
    challenge: 'GE\'s manufacturing processes had defect rates that were costing the company an estimated $8–12 billion annually. Quality was inconsistent across divisions, and there was no systematic approach to process improvement.',
    approach: 'Jack Welch mandated Six Sigma DMAIC across all GE businesses in 1995. Every manager was required to complete Six Sigma training. Projects followed the Define-Measure-Analyse-Improve-Control framework rigorously. Black Belts (dedicated improvement specialists) led projects; Green Belts (part-time practitioners) supported them. Results were measured in financial savings, not just defect reduction.',
    outcome: 'GE saved over $10 billion in the first five years of the Six Sigma programme. The approach became so central to GE\'s identity that Six Sigma certification became a prerequisite for promotion to senior management. GE\'s success inspired hundreds of companies to adopt Six Sigma.',
    lessonsLearned: [
      'Six Sigma requires top-level commitment — Welch\'s personal mandate was essential to adoption.',
      'Measuring financial impact (not just quality metrics) makes the business case undeniable.',
      'The Control phase is the most neglected — improvements that are not sustained are not improvements.',
    ],
    timeframe: '1995–2000 (initial transformation)',
    teamSize: '100,000+ trained practitioners across GE',
    quote: {
      text: 'Six Sigma is the most important initiative GE has ever undertaken.',
      attribution: 'Jack Welch, former CEO of General Electric',
    },
  },

  {
    cardId: 'A23',
    organisation: 'Toyota (Quality Division)',
    industry: 'Automotive Manufacturing',
    projectName: 'Production Line Stoppage — 5 Whys in Action',
    challenge: 'A robot on a production line stopped unexpectedly. The immediate response was to restart it, but the same failure recurred three times in a week, causing significant production delays.',
    approach: 'A quality engineer applied the 5 Whys: (1) Why did the robot stop? — Circuit overloaded. (2) Why was the circuit overloaded? — Insufficient lubrication. (3) Why was there insufficient lubrication? — The lubrication pump was not circulating properly. (4) Why was the pump not circulating properly? — The pump intake was clogged with metal shavings. (5) Why was the intake clogged? — There was no filter on the intake. The root cause was the absence of a filter, not the robot failure.',
    outcome: 'A filter was installed on the pump intake. The robot never stopped again for the same reason. The fix cost less than £50. Without the 5 Whys analysis, the team would have continued replacing the pump or the robot at a cost of thousands of pounds per incident.',
    lessonsLearned: [
      'The first answer to "why" is almost never the root cause — keep asking.',
      'Root causes are often systemic (missing a filter) rather than component failures.',
      'The 5 Whys is most powerful when used by the people closest to the problem.',
    ],
    timeframe: '1-week investigation',
    teamSize: '3-person quality team',
  },

  {
    cardId: 'A25',
    organisation: 'Heathrow Airport',
    industry: 'Aviation / Infrastructure',
    projectName: 'Terminal 5 Post-Implementation Review',
    challenge: 'After the chaotic opening of Terminal 5 in March 2008, BAA (now Heathrow Airport Holdings) needed to understand what went wrong with the baggage and check-in systems to prevent recurrence in future terminal projects.',
    approach: 'BAA conducted a formal Post-Implementation Review six months after opening. The review examined the gap between planned and actual performance across all systems. It used structured interviews with staff, analysis of incident logs, and comparison against the original business case. The review identified that operational testing had been inadequate and that staff training had been compressed due to schedule pressure.',
    outcome: 'The PIR findings directly shaped the approach to Terminal 2 (The Queen\'s Terminal), which opened in 2014 and was widely praised for its smooth operation. Lessons from T5 were explicitly incorporated into the T2 project plan, including extended operational trials and earlier staff training.',
    lessonsLearned: [
      'Post-Implementation Reviews are only valuable if their findings are acted upon in future projects.',
      'The review should be conducted by people with enough distance from the project to be objective.',
      'Comparing actual benefits against the original business case is the most honest measure of project success.',
    ],
    timeframe: '6 months post-opening (2008)',
    teamSize: '15-person review team',
  },

  {
    cardId: 'A28',
    organisation: 'Ford Motor Company',
    industry: 'Automotive Manufacturing',
    projectName: 'Ford\'s Turnaround under Alan Mulally (2006–2014)',
    challenge: 'Ford was losing billions of dollars annually in 2006, with a fragmented product line, poor quality reputation, and a culture of internal politics that prevented honest reporting of problems. The company was close to bankruptcy.',
    approach: 'CEO Alan Mulally applied a structured change management approach aligned to Kotter\'s 8-Step model. He created urgency by publishing Ford\'s losses publicly. He built a guiding coalition of senior leaders committed to the "One Ford" plan. He communicated a clear vision (one company, one team, one plan, one goal). He empowered action by eliminating the culture of hiding bad news — his famous Business Plan Review meetings required honest red/yellow/green status reporting.',
    outcome: 'Ford was the only US automaker to avoid government bailout during the 2008 financial crisis. By 2011, Ford was profitable again. The "One Ford" transformation is studied as a model of large-scale organisational change management.',
    lessonsLearned: [
      'Creating genuine urgency (not manufactured crisis) is the essential first step in change management.',
      'Leaders must model the behaviour they want — Mulally\'s own transparency in BPR meetings made honesty safe.',
      'Short-term wins (first profitable quarter) must be celebrated to sustain momentum through a long change programme.',
    ],
    timeframe: '2006–2014',
    teamSize: '160,000 employees worldwide',
    quote: {
      text: 'The first person to bring a red status to a BPR meeting was treated like a hero. That changed everything.',
      attribution: 'Alan Mulally, former CEO of Ford Motor Company',
    },
  },

  {
    cardId: 'A30',
    organisation: 'IDEO',
    industry: 'Design Consultancy',
    projectName: 'Redesigning the Shopping Cart (ABC Nightline, 1999)',
    challenge: 'ABC News challenged IDEO to redesign the supermarket shopping cart in just five days — a task that would normally take months. The challenge was to demonstrate Design Thinking as a practical methodology, not just a philosophy.',
    approach: 'IDEO applied the full Design Thinking process in five days: Empathise (observing shoppers and store staff), Define (identifying the core problems: child safety, theft, maneuverability), Ideate (wild brainstorming with no judgment), Prototype (building rough physical models in hours), and Test (getting immediate feedback from real users). The process was deliberately iterative, with multiple prototype-test cycles.',
    outcome: 'IDEO produced a radically redesigned shopping cart concept in five days. The cart featured modular baskets (reducing theft), a child seat with safety harness, and a hook for personal bags. The ABC Nightline documentary became one of the most-watched business programmes of the year and introduced Design Thinking to a mainstream audience.',
    lessonsLearned: [
      'Rapid prototyping reveals problems that months of planning cannot — build something, anything, and test it.',
      'Empathy (observing real users) generates insights that surveys and focus groups miss.',
      'Constraints (five days) can be creative catalysts rather than limitations.',
    ],
    timeframe: '5 days',
    teamSize: '8-person multidisciplinary team',
    quote: {
      text: 'Enlightened trial and error succeeds over the planning of the lone genius.',
      attribution: 'David Kelley, founder of IDEO',
    },
  },

  {
    cardId: 'A35',
    organisation: 'Google',
    industry: 'Technology',
    projectName: 'Google Sprint — Design Sprint Framework',
    challenge: 'Google Ventures needed a way to help its portfolio companies answer critical business questions and test ideas without spending months building products that might fail. Traditional project timelines were too slow for the pace of startup decision-making.',
    approach: 'Jake Knapp at Google developed the Design Sprint — a five-day Timeboxing framework: Monday (Map the problem), Tuesday (Sketch solutions), Wednesday (Decide on the best solution), Thursday (Build a prototype), Friday (Test with real users). Each day had a fixed agenda and strict time limits. The timebox forced decisions that would otherwise take weeks of meetings.',
    outcome: 'The Design Sprint framework was adopted by hundreds of companies including Slack, Airbnb, and Uber. Google published the methodology as an open-source framework. Teams consistently reported that five days of structured sprinting produced better decisions than months of traditional product development.',
    lessonsLearned: [
      'Timeboxing forces prioritisation — when you have five days, you cannot debate everything.',
      'Testing with five real users on Friday reveals more than any amount of internal discussion.',
      'The sprint works because it separates divergent thinking (ideation) from convergent thinking (decision-making).',
    ],
    timeframe: '5 days per sprint',
    teamSize: '5–7 person sprint team',
    quote: {
      text: 'The sprint is a greatest hits of business strategy, innovation, behavioural science, and design thinking, packaged into a step-by-step process.',
      attribution: 'Jake Knapp, creator of the Design Sprint',
    },
  },

  {
    cardId: 'A40',
    organisation: 'W. Edwards Deming / Japanese Manufacturing',
    industry: 'Manufacturing / Quality',
    projectName: 'Post-War Japanese Industrial Transformation',
    challenge: 'Post-war Japan had a reputation for producing cheap, low-quality goods. Japanese manufacturers needed a systematic approach to quality improvement that could be sustained over time, not just applied to individual defects.',
    approach: 'W. Edwards Deming introduced the PDCA (Plan-Do-Check-Act) cycle to Japanese manufacturers in the 1950s. The cycle created a continuous improvement loop: Plan (identify an improvement opportunity and plan the change), Do (implement on a small scale), Check (measure results against the plan), Act (standardise if successful, or return to Plan if not). The cycle was applied at every level, from factory floor to executive strategy.',
    outcome: 'Japanese manufacturers transformed their quality reputation within two decades. By the 1970s, Japanese cars and electronics were outcompeting US and European products on quality and reliability. The PDCA cycle became the foundation of the broader Total Quality Management movement and is embedded in ISO 9001 and lean manufacturing practices worldwide.',
    lessonsLearned: [
      'Continuous improvement is a discipline, not a project — it requires ongoing cycles, not one-time initiatives.',
      'Small-scale pilots (the Do phase) reduce the risk of large-scale failures.',
      'The Check phase is the most neglected — measuring results honestly is harder than planning or acting.',
    ],
    timeframe: '1950s–1970s (transformation period)',
    teamSize: 'Industry-wide adoption across Japan',
    quote: {
      text: 'It is not enough to do your best; you must know what to do, and then do your best.',
      attribution: 'W. Edwards Deming',
    },
  },

  {
    cardId: 'A53',
    organisation: 'US Army',
    industry: 'Military / Government',
    projectName: 'Sense-Making in Complex Operations',
    challenge: 'Military commanders in complex, rapidly evolving situations were applying rigid, process-driven approaches to problems that required adaptive, emergent responses. The result was slow decision-making and poor outcomes in chaotic environments.',
    approach: 'The US Army adopted the Cynefin Framework (developed by Dave Snowden at IBM) to help commanders categorise the nature of the situation they faced. Simple situations (clear cause-effect) called for best practice. Complicated situations called for expert analysis. Complex situations (like counterinsurgency) required probing, sensing, and responding rather than planning and executing. Chaotic situations required immediate action to establish order.',
    outcome: 'The Cynefin Framework was incorporated into US Army doctrine and used in leadership development programmes. Commanders trained in the framework reported better decision-making in ambiguous situations by avoiding the trap of applying complicated-domain solutions to complex-domain problems.',
    lessonsLearned: [
      'The biggest risk in complex situations is applying the wrong type of thinking — best practice in a complex domain is dangerous.',
      'In complex environments, small safe-to-fail experiments are more valuable than large planned initiatives.',
      'Cynefin is a sense-making tool, not a decision-making tool — it helps you understand what kind of problem you have.',
    ],
    timeframe: '2003–present (ongoing adoption)',
    teamSize: 'Doctrine applied across the US Army',
  },

  {
    cardId: 'A55',
    organisation: 'Prosci / Change Management Industry',
    industry: 'Change Management / Consulting',
    projectName: 'ERP Implementation at a Global Manufacturer',
    challenge: 'A global manufacturer implementing SAP across 15 countries was experiencing resistance from employees who felt the change was being done to them rather than with them. Previous ERP implementations had failed due to poor adoption.',
    approach: 'The change management team applied the ADKAR® Model to structure their change programme. They assessed each stakeholder group\'s position on the ADKAR dimensions: Awareness (do they know why the change is happening?), Desire (do they want to support it?), Knowledge (do they know how to change?), Ability (can they demonstrate the new behaviours?), Reinforcement (are the new behaviours being sustained?). Interventions were targeted to the specific gaps identified.',
    outcome: 'The SAP implementation achieved 94% user adoption within six months of go-live, compared to an industry average of 65%. The structured ADKAR assessment enabled the team to identify that the primary barrier was Desire (employees didn\'t see the personal benefit), not Knowledge — leading to a targeted communication campaign rather than additional training.',
    lessonsLearned: [
      'Diagnosing the specific ADKAR gap prevents wasting resources on the wrong intervention (e.g., training when the real issue is motivation).',
      'Individual change happens before organisational change — address the person, not just the process.',
      'Reinforcement is the most commonly skipped step and the most common reason changes fail to stick.',
    ],
    timeframe: '18-month implementation',
    teamSize: '5,000 affected employees across 15 countries',
  },

];

// ─── Lookup helpers ────────────────────────────────────────────────────────────

/** Returns the case study for a given card ID, or undefined if none exists. */
export function getCaseStudyByCardId(cardId: string): CaseStudy | undefined {
  return CASE_STUDIES.find(cs => cs.cardId === cardId);
}

/** Returns all case studies (for a browse/index page). */
export function getAllCaseStudies(): CaseStudy[] {
  return CASE_STUDIES;
}

/** Returns the set of card IDs that have a case study. */
export const CARDS_WITH_CASE_STUDIES = new Set(CASE_STUDIES.map(cs => cs.cardId));
