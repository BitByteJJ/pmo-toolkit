// PMO Toolkit Navigator — Template Library
// Each card has a structured, immediately usable working template.
// Templates are rendered as Markdown tables + sections in the Template sub-tab.

export interface TemplateSection {
  heading: string;
  content: string; // Markdown — tables, lists, or prose
}

export interface CardTemplate {
  cardId: string;
  title: string;
  description: string; // one-line purpose of this template
  sections: TemplateSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper to build a markdown table
// ─────────────────────────────────────────────────────────────────────────────
// (Used during authoring — not exported)

// ─────────────────────────────────────────────────────────────────────────────
// PHASE CARDS (PH1–PH3)
// ─────────────────────────────────────────────────────────────────────────────

const phaseTemplates: CardTemplate[] = [
  {
    cardId: 'phase-setup',
    title: 'Project Setup Checklist',
    description: 'A comprehensive checklist to ensure every Setup phase activity is completed before execution begins.',
    sections: [
      {
        heading: 'Project Identity',
        content: `| Field | Your Entry |
|---|---|
| Project Name | |
| Project Sponsor | |
| Project Manager | |
| Start Date | |
| Target End Date | |
| Budget (£/$ estimate) | |
| Priority Level | High / Medium / Low |`,
      },
      {
        heading: 'Setup Checklist',
        content: `| # | Activity | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | Define project objectives and success criteria | PM | ☐ | |
| 2 | Identify and document stakeholders | PM | ☐ | |
| 3 | Complete Stakeholder Matrix (T16) | PM | ☐ | |
| 4 | Draft Project Scope Statement (T14) | PM | ☐ | |
| 5 | Select delivery methodology (M1–M4) | PM + Sponsor | ☐ | |
| 6 | Build initial WBS (T3) | PM | ☐ | |
| 7 | Create RACI Matrix (T5) | PM | ☐ | |
| 8 | Identify top 10 risks (T6) | PM + Team | ☐ | |
| 9 | Establish governance structure (PR14) | PM + Sponsor | ☐ | |
| 10 | Kick-off meeting held | PM | ☐ | |`,
      },
      {
        heading: 'Success Criteria',
        content: `| Criterion | Measurement Method | Target |
|---|---|---|
| | | |
| | | |`,
      },
    ],
  },
  {
    cardId: 'phase-execution',
    title: 'Execution Phase Status Report',
    description: 'A weekly status report template to track progress, issues, and decisions during project execution.',
    sections: [
      {
        heading: 'Report Header',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Reporting Period | Week ending: |
| Report Author | |
| Overall RAG Status | 🟢 Green / 🟡 Amber / 🔴 Red |`,
      },
      {
        heading: 'Progress Summary',
        content: `| Workstream | Planned % Complete | Actual % Complete | RAG | Comment |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Key Milestones',
        content: `| Milestone | Planned Date | Forecast Date | Status |
|---|---|---|---|
| | | | ☐ On Track / ⚠ At Risk / ✗ Delayed |`,
      },
      {
        heading: 'Issues & Risks',
        content: `| ID | Type | Description | Impact | Owner | Due Date |
|---|---|---|---|---|---|
| | Issue | | | | |
| | Risk | | | | |`,
      },
      {
        heading: 'Decisions Required',
        content: `| # | Decision Needed | By Whom | By When |
|---|---|---|---|
| | | | |`,
      },
    ],
  },
  {
    cardId: 'phase-closure',
    title: 'Project Closure Report',
    description: 'A structured closure report to formally close the project, capture lessons, and release resources.',
    sections: [
      {
        heading: 'Project Summary',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Original End Date | |
| Actual End Date | |
| Original Budget | |
| Final Cost | |
| Variance | |`,
      },
      {
        heading: 'Objectives vs Outcomes',
        content: `| Objective | Achieved? | Notes |
|---|---|---|
| | ✓ Yes / ✗ No / ⚠ Partial | |`,
      },
      {
        heading: 'Lessons Learned',
        content: `| Category | What Went Well | What to Improve | Recommendation |
|---|---|---|---|
| Planning | | | |
| Execution | | | |
| Stakeholder Mgmt | | | |
| Risk Management | | | |
| Team & People | | | |`,
      },
      {
        heading: 'Closure Checklist',
        content: `| Activity | Owner | Done? |
|---|---|---|
| All deliverables accepted by sponsor | | ☐ |
| Final financial reconciliation complete | | ☐ |
| Project artifacts archived | | ☐ |
| Team members released and thanked | | ☐ |
| Post-Implementation Review scheduled | | ☐ |
| Lessons Learned documented | | ☐ |
| Formal sign-off obtained | | ☐ |`,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE CARDS (AG1–AG3)
// ─────────────────────────────────────────────────────────────────────────────

const archetypeTemplates: CardTemplate[] = [
  {
    cardId: 'AG1',
    title: 'Project Complexity Assessment',
    description: 'Score your project across key dimensions to determine the right approach and methodology.',
    sections: [
      {
        heading: 'Complexity Scoring Matrix',
        content: `Rate each dimension 1 (Low) to 5 (High).

| Dimension | Score (1–5) | Notes |
|---|---|---|
| Scope clarity — how well defined are requirements? | | |
| Stakeholder complexity — number and diversity of stakeholders | | |
| Technical complexity — novelty of technology or solution | | |
| Organisational change — degree of behaviour/culture change | | |
| Timeline pressure — how fixed is the deadline? | | |
| Budget constraints — how tight is the funding? | | |
| Team experience — familiarity with this type of project | | |
| Regulatory/compliance requirements | | |
| **Total Score** | **/40** | |`,
      },
      {
        heading: 'Interpretation Guide',
        content: `| Total Score | Recommended Approach |
|---|---|
| 8–16 | Simple project — Lightweight Waterfall or Kanban |
| 17–24 | Moderate complexity — Agile or Hybrid |
| 25–32 | High complexity — Structured Agile with governance gates |
| 33–40 | Very high complexity — Hybrid with PMO oversight |`,
      },
    ],
  },
  {
    cardId: 'AG2',
    title: 'Methodology Selection Worksheet',
    description: 'A structured worksheet to select the best delivery methodology for your project context.',
    sections: [
      {
        heading: 'Context Questions',
        content: `| Question | Your Answer |
|---|---|
| Are requirements fully known upfront? | Yes / No / Partially |
| Will requirements change frequently? | Yes / No / Unsure |
| Is the customer available for regular feedback? | Yes / No |
| Is the team co-located or distributed? | Co-located / Distributed / Hybrid |
| Is there a fixed delivery date? | Yes / No |
| Is there a fixed budget? | Yes / No |
| What is the team size? | < 10 / 10–50 / 50+ |`,
      },
      {
        heading: 'Methodology Fit Matrix',
        content: `| Criterion | Waterfall | Agile | Kanban | Hybrid |
|---|---|---|---|---|
| Fixed requirements | ✓ Best | ✗ Poor | ✗ Poor | ✓ Good |
| Changing requirements | ✗ Poor | ✓ Best | ✓ Good | ✓ Good |
| Regular customer feedback | ✗ Limited | ✓ Best | ✓ Good | ✓ Good |
| Fixed deadline | ✓ Good | ⚠ Risky | ⚠ Risky | ✓ Good |
| Fixed budget | ✓ Best | ⚠ Risky | ✓ Good | ✓ Good |`,
      },
      {
        heading: 'Decision',
        content: `| Field | Your Entry |
|---|---|
| Selected Methodology | |
| Rationale | |
| Agreed by | |
| Date | |`,
      },
    ],
  },
  {
    cardId: 'AG3',
    title: 'Hybrid Approach Design Canvas',
    description: 'Design a bespoke hybrid methodology by mapping which phases use which approach.',
    sections: [
      {
        heading: 'Hybrid Design Map',
        content: `| Project Phase | Approach | Cadence | Key Artefacts | Governance Gate? |
|---|---|---|---|---|
| Initiation & Discovery | Waterfall | One-off | Business Case, Scope Statement | ✓ Gate 1 |
| Planning | Waterfall | One-off | WBS, Risk Register, Schedule | ✓ Gate 2 |
| Design / Architecture | Waterfall | One-off | Design Docs | ✓ Gate 3 |
| Build / Development | Agile | 2-week sprints | Sprint backlog, burndown | ✗ |
| Testing | Agile | 2-week sprints | Test results, defect log | ✗ |
| UAT | Waterfall | One-off | UAT sign-off | ✓ Gate 4 |
| Deployment | Waterfall | One-off | Release notes | ✓ Gate 5 |
| Closure | Waterfall | One-off | Closure report, PIR | ✓ Gate 6 |`,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// METHODOLOGY CARDS (M1–M4)
// ─────────────────────────────────────────────────────────────────────────────

const methodologyTemplates: CardTemplate[] = [
  {
    cardId: 'M1',
    title: 'Waterfall Project Plan Template',
    description: 'A sequential phase-gate plan with milestones, deliverables, and sign-off requirements.',
    sections: [
      {
        heading: 'Phase Gate Plan',
        content: `| Phase | Key Activities | Deliverables | Owner | Start | End | Sign-off Required |
|---|---|---|---|---|---|---|
| Initiation | Define objectives, appoint PM | Project Charter | Sponsor | | | ✓ |
| Planning | WBS, schedule, risk register | Project Plan | PM | | | ✓ |
| Design | Architecture, specifications | Design Document | Lead | | | ✓ |
| Build | Development, configuration | Working solution | Team | | | ✗ |
| Test | SIT, UAT | Test Report | QA | | | ✓ |
| Deploy | Release, training, go-live | Release Notes | PM | | | ✓ |
| Close | Lessons learned, archive | Closure Report | PM | | | ✓ |`,
      },
      {
        heading: 'Change Control Log',
        content: `| Change ID | Description | Requested By | Impact (Cost/Time/Scope) | Decision | Date |
|---|---|---|---|---|---|
| CC-001 | | | | Approved / Rejected | |`,
      },
    ],
  },
  {
    cardId: 'M2',
    title: 'Agile Sprint Planning Template',
    description: 'A sprint planning board with backlog, sprint goal, capacity, and acceptance criteria.',
    sections: [
      {
        heading: 'Sprint Header',
        content: `| Field | Detail |
|---|---|
| Sprint Number | |
| Sprint Goal | |
| Start Date | |
| End Date | |
| Team Capacity (story points) | |`,
      },
      {
        heading: 'Sprint Backlog',
        content: `| Story ID | User Story | Acceptance Criteria | Story Points | Assigned To | Status |
|---|---|---|---|---|---|
| US-001 | As a [user], I want [goal] so that [benefit] | | | | To Do |
| US-002 | | | | | To Do |`,
      },
      {
        heading: 'Daily Standup Log',
        content: `| Date | Team Member | Yesterday | Today | Blockers |
|---|---|---|---|---|
| | | | | |`,
      },
      {
        heading: 'Sprint Retrospective',
        content: `| Category | Item | Action Owner | Due |
|---|---|---|---|
| ✓ Keep | | | |
| ✗ Stop | | | |
| ▲ Try | | | |`,
      },
    ],
  },
  {
    cardId: 'M3',
    title: 'Kanban Board Template',
    description: 'A Kanban board with WIP limits, flow metrics, and a blocker log.',
    sections: [
      {
        heading: 'Board Columns & WIP Limits',
        content: `| Column | WIP Limit | Description |
|---|---|---|
| Backlog | Unlimited | All incoming work items |
| Ready | 5 | Refined and ready to start |
| In Progress | 3 | Actively being worked on |
| In Review | 2 | Awaiting review or approval |
| Done | Unlimited | Completed items |`,
      },
      {
        heading: 'Work Item Log',
        content: `| Item ID | Title | Priority | Entered Backlog | Started | Completed | Cycle Time (days) |
|---|---|---|---|---|---|---|
| K-001 | | High / Med / Low | | | | |`,
      },
      {
        heading: 'Blocker Log',
        content: `| Item ID | Blocker Description | Date Raised | Owner | Resolution | Date Resolved |
|---|---|---|---|---|---|
| | | | | | |`,
      },
      {
        heading: 'Flow Metrics (Weekly)',
        content: `| Week | Throughput (items done) | Avg Cycle Time (days) | WIP Violations | Notes |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'M4',
    title: 'Hybrid Delivery Plan',
    description: 'A hybrid plan combining Waterfall governance gates with Agile sprint delivery.',
    sections: [
      {
        heading: 'Governance Gates',
        content: `| Gate | Name | Criteria to Pass | Decision Maker | Planned Date | Outcome |
|---|---|---|---|---|---|
| G1 | Project Initiation | Business case approved | Sponsor | | Pass / Fail |
| G2 | Planning Complete | Plan signed off | PMO | | Pass / Fail |
| G3 | Design Approved | Architecture signed off | Tech Lead | | Pass / Fail |
| G4 | UAT Complete | Zero P1 defects | QA Lead | | Pass / Fail |
| G5 | Go-Live | Deployment successful | PM | | Pass / Fail |`,
      },
      {
        heading: 'Sprint Schedule',
        content: `| Sprint | Goal | Start | End | Velocity (SP) | Status |
|---|---|---|---|---|---|
| Sprint 1 | | | | | |
| Sprint 2 | | | | | |
| Sprint 3 | | | | | |`,
      },
    ],
  },
  {
    cardId: 'M8',
    title: 'Value Delivery System Canvas',
    description: "Map your organisation's end-to-end value delivery system across portfolio, programme, and project layers.",
    sections: [
      {
        heading: 'System Overview',
        content: `| Field | Your Entry |
|---|---|
| Organisation / Portfolio Name | |
| Primary Value Stream | |
| Key Stakeholder Groups | |
| Delivery Horizon (months) | |`,
      },
      {
        heading: 'Value Delivery Components',
        content: `| Component | Current State | Target State | Owner | Priority |
|---|---|---|---|---|
| Portfolio Governance | | | | |
| Programme Management | | | | |
| Project Execution | | | | |
| Operations & Benefits | | | | |`,
      },
      {
        heading: 'Performance Indicators',
        content: `| KPI | Baseline | Target | Frequency | Owner |
|---|---|---|---|---|
| Benefits Realised (%) | | | | |
| On-Time Delivery Rate | | | | |
| Stakeholder Satisfaction | | | | |
| Resource Utilisation | | | | |`,
      },
    ],
  },
  {
    cardId: 'M9',
    title: 'Development Approach & Lifecycle Selector',
    description: 'Determine the most appropriate delivery approach for your project using PMI guidance.',
    sections: [
      {
        heading: 'Project Characteristics Assessment',
        content: `| Factor | Score 1-5 (1=Low, 5=High) | Notes |
|---|---|---|
| Requirements Clarity | | |
| Stakeholder Availability | | |
| Risk Tolerance | | |
| Delivery Frequency Needed | | |
| Team Agile Maturity | | |
| Regulatory Constraints | | |`,
      },
      {
        heading: 'Approach Recommendation',
        content: `| Score Range | Recommended Approach |
|---|---|
| 6-12 | Predictive (Waterfall) |
| 13-20 | Hybrid |
| 21-30 | Adaptive (Agile/Iterative) |

**Your Total Score:** ___
**Recommended Approach:** ___`,
      },
      {
        heading: 'Lifecycle Milestones',
        content: `| Phase | Key Deliverable | Gate Criteria | Date |
|---|---|---|---|
| Initiation | | | |
| Planning | | | |
| Execution | | | |
| Delivery | | | |
| Closure | | | |`,
      },
    ],
  },
  {
    cardId: 'M5',
    title: 'Scrum Sprint Planning Board',
    description: 'Plan and track a Scrum sprint from backlog refinement through to sprint review.',
    sections: [
      {
        heading: 'Sprint Details',
        content: `| Field | Entry |
|---|---|
| Sprint Number | |
| Sprint Goal | |
| Sprint Duration (weeks) | |
| Start Date | |
| End Date | |
| Scrum Master | |
| Product Owner | |`,
      },
      {
        heading: 'Sprint Backlog',
        content: `| Story ID | User Story | Story Points | Assignee | Status |
|---|---|---|---|---|
| US-001 | As a [user] I want [goal] so that [benefit] | | | To Do |
| US-002 | | | | To Do |
| US-003 | | | | To Do |
| US-004 | | | | To Do |
| US-005 | | | | To Do |`,
      },
      {
        heading: 'Daily Scrum Tracker',
        content: `| Date | What did I do yesterday? | What will I do today? | Blockers? |
|---|---|---|---|
| Day 1 | | | |
| Day 2 | | | |
| Day 3 | | | |
| Day 4 | | | |
| Day 5 | | | |`,
      },
      {
        heading: 'Sprint Review & Retrospective',
        content: `**Sprint Review**

| Metric | Planned | Actual |
|---|---|---|
| Story Points Committed | | |
| Story Points Completed | | |
| Velocity | | |
| Bugs Found | | |

**Retrospective**

What went well:

What could be improved:

Action items for next sprint:`,
      },
    ],
  },
  {
    cardId: 'M6',
    title: 'PRINCE2 Project Brief',
    description: 'Document the project mandate, objectives, scope, and governance structure using PRINCE2 principles.',
    sections: [
      {
        heading: 'Project Definition',
        content: `| Field | Entry |
|---|---|
| Project Title | |
| Project Mandate / Trigger | |
| Project Objective | |
| Desired Outcome | |
| Scope (In) | |
| Scope (Out) | |
| Constraints | |
| Assumptions | |`,
      },
      {
        heading: 'Business Case Summary',
        content: `| Element | Description |
|---|---|
| Reasons (Why) | |
| Expected Benefits | |
| Expected Dis-benefits | |
| Timescale | |
| Costs (Estimate) | |
| Investment Appraisal | |
| Major Risks | |`,
      },
      {
        heading: 'Project Organisation',
        content: `| Role | Name | Responsibilities |
|---|---|---|
| Executive (Sponsor) | | Owns the Business Case; accountable for project success |
| Senior User | | Represents user interests; approves requirements |
| Senior Supplier | | Represents supplier interests; approves design |
| Project Manager | | Day-to-day management; reports to Project Board |
| Team Manager(s) | | Delivers work packages |`,
      },
      {
        heading: 'Stage Plan Summary',
        content: `| Stage | Key Deliverables | Start | End | Budget |
|---|---|---|---|---|
| Initiation Stage | Project Initiation Document | | | |
| Stage 1 | | | | |
| Stage 2 | | | | |
| Stage 3 | | | | |
| Final Stage | End Project Report | | | |`,
      },
    ],
  },
  {
    cardId: 'M7',
    title: 'SAFe PI Planning Canvas',
    description: 'Plan a Programme Increment (PI) across multiple Agile Release Trains using SAFe principles.',
    sections: [
      {
        heading: 'PI Overview',
        content: `| Field | Entry |
|---|---|
| PI Number | |
| PI Duration (weeks) | |
| PI Start Date | |
| PI End Date | |
| Agile Release Train (ART) | |
| Release Train Engineer (RTE) | |
| Business Context / Vision | |`,
      },
      {
        heading: 'PI Objectives',
        content: `| # | PI Objective | Business Value (1-10) | Team | Committed? |
|---|---|---|---|---|
| 1 | | | | Yes / Stretch |
| 2 | | | | Yes / Stretch |
| 3 | | | | Yes / Stretch |
| 4 | | | | Yes / Stretch |
| 5 | | | | Yes / Stretch |`,
      },
      {
        heading: 'Team Iteration Plan',
        content: `| Team | Iteration 1 | Iteration 2 | Iteration 3 | Iteration 4 | IP Iteration |
|---|---|---|---|---|---|
| Team A | | | | | |
| Team B | | | | | |
| Team C | | | | | |
| Team D | | | | | |`,
      },
      {
        heading: 'Risks & Dependencies',
        content: `| ID | Risk / Dependency | Owner | Mitigation | Status |
|---|---|---|---|---|
| R1 | | | | |
| R2 | | | | |
| D1 | | | | |
| D2 | | | | |`,
      },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// PEOPLE DOMAIN CARDS (P01–P14)
// ─────────────────────────────────────────────────────────────────────────────

const peopleTemplates: CardTemplate[] = [
  {
    cardId: 'people-1',
    title: 'Leadership Style Self-Assessment',
    description: 'Reflect on your current leadership approach and identify development areas.',
    sections: [
      {
        heading: 'Leadership Style Inventory',
        content: `Rate yourself 1 (Rarely) to 5 (Always).

| Behaviour | Score | Notes |
|---|---|---|
| I adapt my style to each team member's experience level | | |
| I delegate tasks with clear outcomes, not just instructions | | |
| I give regular, specific, constructive feedback | | |
| I create psychological safety for the team to speak up | | |
| I actively remove blockers before they escalate | | |
| I involve the team in decision-making where appropriate | | |
| I recognise and celebrate team contributions | | |
| I model the behaviours I expect from others | | |`,
      },
      {
        heading: 'Development Plan',
        content: `| Development Area | Target Behaviour | Action | Support Needed | Review Date |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-2',
    title: 'Team Performance Review',
    description: 'A structured review to assess team performance and identify coaching opportunities.',
    sections: [
      {
        heading: 'Team Performance Matrix',
        content: `| Team Member | Role | Strengths | Development Area | Performance Rating | Notes |
|---|---|---|---|---|---|
| | | | | 1–5 | |`,
      },
      {
        heading: 'Team Health Check',
        content: `| Dimension | Score (1–5) | Action Needed |
|---|---|---|
| Clarity of goals and roles | | |
| Quality of communication | | |
| Trust and psychological safety | | |
| Conflict resolution | | |
| Accountability | | |
| Delivery consistency | | |`,
      },
    ],
  },
  {
    cardId: 'people-3',
    title: 'Conflict Resolution Log',
    description: 'Document and track interpersonal or team conflicts through to resolution.',
    sections: [
      {
        heading: 'Conflict Register',
        content: `| ID | Date Raised | Parties Involved | Description | Root Cause | Resolution Approach | Owner | Status | Resolved Date |
|---|---|---|---|---|---|---|---|---|
| C-001 | | | | | | | Open / Resolved | |`,
      },
      {
        heading: 'Resolution Techniques Used',
        content: `| Conflict ID | Technique Applied | Outcome | Follow-up Required |
|---|---|---|---|
| | Collaborate / Compromise / Accommodate / Avoid / Force | | |`,
      },
    ],
  },
  {
    cardId: 'people-4',
    title: 'Empowerment & Accountability Matrix',
    description: 'Clarify who is empowered to make which decisions and at what level.',
    sections: [
      {
        heading: 'Decision Empowerment Matrix',
        content: `| Decision Type | Team Member Can Decide Alone | Needs PM Input | Needs Sponsor Approval | Notes |
|---|---|---|---|---|
| Day-to-day task prioritisation | ✓ | | | |
| Scope changes < 5% | | ✓ | | |
| Scope changes > 5% | | | ✓ | |
| Budget reallocation < 10% | | ✓ | | |
| Budget reallocation > 10% | | | ✓ | |
| Vendor/supplier selection | | ✓ | | |
| Team structure changes | | | ✓ | |`,
      },
    ],
  },
  {
    cardId: 'people-5',
    title: 'Motivation & Recognition Tracker',
    description: 'Track individual motivators and recognition activities to sustain team morale.',
    sections: [
      {
        heading: 'Individual Motivator Profile',
        content: `| Team Member | Primary Motivator | Secondary Motivator | Preferred Recognition | Last Recognised | Notes |
|---|---|---|---|---|---|
| | Achievement / Affiliation / Power | | Public / Private / Written | | |`,
      },
      {
        heading: 'Recognition Log',
        content: `| Date | Team Member | Achievement | Recognition Given | Delivered By |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-6',
    title: 'Team Charter',
    description: 'A team charter that defines purpose, norms, roles, and working agreements.',
    sections: [
      {
        heading: 'Team Identity',
        content: `| Field | Detail |
|---|---|
| Team Name | |
| Project / Programme | |
| Team Purpose (one sentence) | |
| Team Lead / PM | |
| Date Agreed | |`,
      },
      {
        heading: 'Working Agreements',
        content: `| Category | Agreement |
|---|---|
| Meeting norms | e.g. Start on time, cameras on for virtual meetings |
| Communication | e.g. Slack for day-to-day, email for formal decisions |
| Decision making | e.g. Consensus first, PM decides if no agreement in 24h |
| Conflict resolution | e.g. Raise directly first, then escalate to PM |
| Quality standards | e.g. All deliverables peer-reviewed before submission |
| Availability | e.g. Core hours 09:00–15:00 local time |`,
      },
      {
        heading: 'Roles & Responsibilities',
        content: `| Name | Role | Key Responsibilities | Availability (%) |
|---|---|---|---|
| | | | |`,
      },
    ],
  },
  {
    cardId: 'people-7',
    title: 'Impediment Log',
    description: 'Track and resolve team blockers and impediments systematically.',
    sections: [
      {
        heading: 'Impediment Register',
        content: `| ID | Date Raised | Description | Impact | Raised By | Owner | Priority | Status | Resolution | Resolved Date |
|---|---|---|---|---|---|---|---|---|---|
| IMP-001 | | | | | | High / Med / Low | Open | | |`,
      },
    ],
  },
  {
    cardId: 'people-8',
    title: 'Negotiation Preparation Sheet',
    description: 'Prepare for a project negotiation by mapping positions, interests, and ZOPA.',
    sections: [
      {
        heading: 'Negotiation Context',
        content: `| Field | Detail |
|---|---|
| Negotiation Topic | |
| Your Position | |
| Other Party | |
| Their Likely Position | |
| Deadline | |`,
      },
      {
        heading: 'Interests & Priorities',
        content: `| Party | Core Interest | Secondary Interest | Red Lines (Non-negotiable) |
|---|---|---|---|
| Us | | | |
| Them | | | |`,
      },
      {
        heading: 'ZOPA & BATNA',
        content: `| Element | Detail |
|---|---|
| Our ideal outcome | |
| Our acceptable outcome | |
| Our BATNA (Best Alternative to Negotiated Agreement) | |
| Their likely BATNA | |
| Zone of Possible Agreement (ZOPA) | |
| Concessions we can offer | |`,
      },
    ],
  },
  {
    cardId: 'people-9',
    title: 'Stakeholder Collaboration Plan',
    description: 'Plan and track collaborative activities with key stakeholders throughout the project.',
    sections: [
      {
        heading: 'Collaboration Activity Plan',
        content: `| Stakeholder | Collaboration Type | Frequency | Format | Owner | Next Date | Notes |
|---|---|---|---|---|---|---|
| | Workshop / Review / 1:1 / Survey | | In-person / Virtual | | | |`,
      },
      {
        heading: 'Co-Creation Log',
        content: `| Date | Activity | Stakeholders Involved | Outcomes / Decisions | Follow-up Actions |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-10',
    title: 'Shared Understanding Canvas',
    description: 'Align the team and stakeholders on project vision, goals, constraints, and success criteria.',
    sections: [
      {
        heading: 'Project Vision Statement',
        content: `| Element | Detail |
|---|---|
| Problem we are solving | |
| Who benefits | |
| What success looks like | |
| What is out of scope | |
| Key constraints | |`,
      },
      {
        heading: 'Alignment Check',
        content: `| Stakeholder | Agrees on Vision? | Agrees on Scope? | Agrees on Success Criteria? | Notes |
|---|---|---|---|---|
| | ✓ / ✗ / ⚠ | ✓ / ✗ / ⚠ | ✓ / ✗ / ⚠ | |`,
      },
    ],
  },
  {
    cardId: 'people-11',
    title: 'Virtual Team Engagement Plan',
    description: 'A plan to keep distributed team members connected, informed, and engaged.',
    sections: [
      {
        heading: 'Virtual Team Profile',
        content: `| Team Member | Location / Timezone | Preferred Communication | Availability (Core Hours) |
|---|---|---|---|
| | | Slack / Email / Video | |`,
      },
      {
        heading: 'Engagement Activities',
        content: `| Activity | Purpose | Frequency | Format | Owner |
|---|---|---|---|---|
| Daily standup | Sync on progress and blockers | Daily | Video call | PM |
| Team retrospective | Improve ways of working | Bi-weekly | Video workshop | PM |
| Virtual social | Build relationships | Monthly | Informal video | Team |
| 1:1 check-in | Individual wellbeing | Bi-weekly | Video / call | PM |`,
      },
    ],
  },
  {
    cardId: 'people-12',
    title: 'Team Ground Rules Document',
    description: 'A co-created set of ground rules to govern team behaviour and working norms.',
    sections: [
      {
        heading: 'Ground Rules',
        content: `| Category | Rule | Agreed By Team? |
|---|---|---|
| Meetings | We start and end on time | ✓ / ✗ |
| Meetings | We come prepared with relevant updates | ✓ / ✗ |
| Communication | We respond to messages within 4 business hours | ✓ / ✗ |
| Communication | We use [tool] for urgent items, email for formal records | ✓ / ✗ |
| Decisions | We seek consensus; PM decides if no agreement in 24h | ✓ / ✗ |
| Conflict | We address issues directly with the person first | ✓ / ✗ |
| Quality | We review our own work before passing it on | ✓ / ✗ |
| Respect | We listen without interrupting | ✓ / ✗ |`,
      },
      {
        heading: 'Sign-off',
        content: `| Team Member | Signature / Initials | Date |
|---|---|---|
| | | |`,
      },
    ],
  },
  {
    cardId: 'people-13',
    title: 'Mentoring & Coaching Plan',
    description: 'A structured plan for mentoring stakeholders or team members through a project or skill development.',
    sections: [
      {
        heading: 'Mentoring Relationship',
        content: `| Field | Detail |
|---|---|
| Mentor | |
| Mentee | |
| Focus Area | |
| Duration | |
| Meeting Frequency | |`,
      },
      {
        heading: 'Development Goals',
        content: `| Goal | Current State | Target State | Success Measure | Review Date |
|---|---|---|---|---|
| | | | | |`,
      },
      {
        heading: 'Session Log',
        content: `| Date | Topics Discussed | Actions Agreed | Mentee Progress | Next Steps |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-14',
    title: 'Team Emotional Intelligence Assessment',
    description: 'Assess and develop emotional intelligence across the team to improve collaboration.',
    sections: [
      {
        heading: 'EI Competency Assessment',
        content: `Rate each competency 1 (Developing) to 5 (Exemplary).

| EI Competency | Team Member 1 | Team Member 2 | Team Member 3 | Team Average |
|---|---|---|---|---|
| Self-awareness | | | | |
| Self-regulation | | | | |
| Motivation | | | | |
| Empathy | | | | |
| Social skills | | | | |`,
      },
      {
        heading: 'Development Actions',
        content: `| Competency | Team Action | Individual Action | Owner | Timeline |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-15',
    title: 'Psychological Safety Assessment & Action Plan',
    description: "Measure your team's current psychological safety level and create a targeted action plan to improve it.",
    sections: [
      {
        heading: 'Psychological Safety Survey (Team Self-Assessment)',
        content: `Rate each statement 1 (Strongly Disagree) to 5 (Strongly Agree). Complete anonymously for honest results.

| Statement | Score (1–5) |
|---|---|
| If I make a mistake, it is not held against me | |
| I can raise concerns without fear of negative consequences | |
| Team members value my unique skills and contributions | |
| It is safe to take risks on this team | |
| I can ask for help without feeling judged | |
| No one on this team would deliberately undermine my efforts | |
| I feel comfortable disagreeing with the project manager | |
| **Average Score** | |`,
      },
      {
        heading: 'Psychological Safety Level Interpretation',
        content: `| Average Score | Level | Recommended Action |
|---|---|---|
| 4.5 – 5.0 | Exemplary | Maintain and share practices with other teams |
| 3.5 – 4.4 | Strong | Targeted reinforcement in lowest-scoring areas |
| 2.5 – 3.4 | Developing | Structured intervention programme required |
| 1.0 – 2.4 | At Risk | Immediate leadership coaching and team reset |`,
      },
      {
        heading: 'Action Plan',
        content: `| Area for Improvement | Specific Action | Owner | Timeline | Success Measure |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-16',
    title: 'Stakeholder Performance Domain Tracker',
    description: 'Track stakeholder engagement across the Stakeholder Performance Domain.',
    sections: [
      {
        heading: 'Stakeholder Engagement Register',
        content: `| Stakeholder | Role | Interest Level | Influence Level | Current Engagement | Target Engagement | Actions |
|---|---|---|---|---|---|---|
| | | H/M/L | H/M/L | Unaware/Resistant/Neutral/Supportive/Leading | | |`,
      },
      {
        heading: 'Engagement Actions Log',
        content: `| Date | Stakeholder | Action Taken | Response | Next Step | Owner |
|---|---|---|---|---|---|
| | | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-17',
    title: 'Team Performance Domain Health Check',
    description: 'Assess team health across the five Team Performance Domain dimensions.',
    sections: [
      {
        heading: 'Team Health Assessment',
        content: `Rate each dimension 1 (Poor) to 5 (Excellent).

| Dimension | Score | Evidence | Action Needed |
|---|---|---|---|
| Shared ownership and accountability | | | |
| High-trust environment | | | |
| Collaborative decision-making | | | |
| Continuous learning culture | | | |
| Adaptability to change | | | |
| **Total** | **/25** | | |`,
      },
      {
        heading: 'Improvement Actions',
        content: `| Priority | Action | Owner | Due Date | Status |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'people-18',
    title: 'Servant Leadership Self-Assessment',
    description: 'Evaluate your servant leadership behaviours and identify growth areas.',
    sections: [
      {
        heading: 'Servant Leadership Inventory',
        content: `Rate yourself 1 (Rarely) to 5 (Always).

| Servant Leadership Behaviour | Score | Example | Development Action |
|---|---|---|---|
| I listen actively before responding | | | |
| I prioritise team needs over personal recognition | | | |
| I create conditions for team autonomy | | | |
| I remove obstacles proactively | | | |
| I build community and shared purpose | | | |
| I develop others' capabilities | | | |
| I lead with empathy and emotional intelligence | | | |
| I share power and decision-making | | | |
| **Total** | **/40** | | |`,
      },
      {
        heading: 'Growth Plan',
        content: `| Focus Area | Current Behaviour | Target Behaviour | Support Needed | Review Date |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS DOMAIN CARDS (PR01–PR17)
// ─────────────────────────────────────────────────────────────────────────────

const processTemplates: CardTemplate[] = [
  {
    cardId: 'process-1',
    title: 'Execution Urgency Dashboard',
    description: 'A daily execution tracker to maintain momentum and surface blockers early.',
    sections: [
      {
        heading: 'Daily Execution Tracker',
        content: `| Date | Priority Task | Owner | Due | Status | Blocker? |
|---|---|---|---|---|---|
| | | | | ✓ Done / ⚠ At Risk / ✗ Blocked | |`,
      },
      {
        heading: 'Velocity Check',
        content: `| Week | Planned Tasks | Completed Tasks | Completion Rate | Key Blocker |
|---|---|---|---|---|
| | | | % | |`,
      },
    ],
  },
  {
    cardId: 'process-2',
    title: 'Communications Plan',
    description: 'A structured plan defining what information is communicated, to whom, how, and when.',
    sections: [
      {
        heading: 'Communications Matrix',
        content: `| Audience | Information Needed | Format | Frequency | Channel | Owner | Notes |
|---|---|---|---|---|---|---|
| Project Sponsor | Status, risks, decisions | Status Report | Weekly | Email | PM | |
| Steering Committee | Progress, budget, issues | Dashboard | Monthly | Meeting | PM | |
| Project Team | Tasks, blockers, updates | Standup | Daily | Video/Chat | PM | |
| End Users | Upcoming changes, training | Newsletter | Monthly | Email | Comms Lead | |
| Vendors | Requirements, feedback | Meeting | Bi-weekly | Video | PM | |`,
      },
      {
        heading: 'Communication Log',
        content: `| Date | Audience | Message Summary | Channel | Sent By | Response Required? | Response Received? |
|---|---|---|---|---|---|---|
| | | | | | | |`,
      },
    ],
  },
  {
    cardId: 'process-3',
    title: 'Risk Register',
    description: 'A comprehensive risk register to identify, assess, and manage project risks.',
    sections: [
      {
        heading: 'Risk Register',
        content: `| Risk ID | Description | Category | Probability (1–5) | Impact (1–5) | Risk Score | Response Strategy | Owner | Status | Review Date |
|---|---|---|---|---|---|---|---|---|---|
| R-001 | | Technical / People / External / Financial | | | P×I | Avoid / Mitigate / Transfer / Accept | | Open | |
| R-002 | | | | | | | | Open | |`,
      },
      {
        heading: 'Risk Scoring Guide',
        content: `| Score | Probability | Impact |
|---|---|---|
| 1 | Very unlikely (<10%) | Negligible |
| 2 | Unlikely (10–30%) | Minor |
| 3 | Possible (30–50%) | Moderate |
| 4 | Likely (50–70%) | Significant |
| 5 | Very likely (>70%) | Critical |`,
      },
    ],
  },
  {
    cardId: 'process-4',
    title: 'Stakeholder Engagement Plan',
    description: 'A plan to systematically engage stakeholders based on their influence and interest.',
    sections: [
      {
        heading: 'Stakeholder Register',
        content: `| Stakeholder | Role | Influence (H/M/L) | Interest (H/M/L) | Current Engagement | Target Engagement | Engagement Actions | Owner |
|---|---|---|---|---|---|---|---|
| | | | | Unaware / Resistant / Neutral / Supportive / Champion | | | |`,
      },
      {
        heading: 'Engagement Activity Log',
        content: `| Date | Stakeholder | Activity | Outcome | Next Action | Due Date |
|---|---|---|---|---|---|
| | | | | | |`,
      },
    ],
  },
  {
    cardId: 'process-5',
    title: 'Project Budget Tracker',
    description: 'Track planned vs actual spend across budget categories with variance analysis.',
    sections: [
      {
        heading: 'Budget Summary',
        content: `| Category | Approved Budget | Committed | Actual Spend | Forecast to Complete | Variance | RAG |
|---|---|---|---|---|---|---|
| Labour — Internal | | | | | | 🟢/🟡/🔴 |
| Labour — Contractors | | | | | | |
| Software / Licences | | | | | | |
| Hardware | | | | | | |
| Travel & Expenses | | | | | | |
| Training | | | | | | |
| Contingency | | | | | | |
| **Total** | | | | | | |`,
      },
      {
        heading: 'Spend Log',
        content: `| Date | Description | Category | Supplier | Amount | Invoice Ref | Approved By |
|---|---|---|---|---|---|---|
| | | | | | | |`,
      },
    ],
  },
  {
    cardId: 'process-6',
    title: 'Project Schedule Template',
    description: 'A milestone-based schedule with task dependencies and critical path indicators.',
    sections: [
      {
        heading: 'Master Schedule',
        content: `| Task ID | Task Name | Predecessor | Duration (days) | Start Date | End Date | Owner | % Complete | Critical Path? |
|---|---|---|---|---|---|---|---|---|
| T1.1 | | — | | | | | | ✓ / ✗ |
| T1.2 | | T1.1 | | | | | | |`,
      },
      {
        heading: 'Key Milestones',
        content: `| Milestone | Planned Date | Forecast Date | Actual Date | Status |
|---|---|---|---|---|
| Project Kick-off | | | | |
| Design Complete | | | | |
| Build Complete | | | | |
| UAT Sign-off | | | | |
| Go-Live | | | | |
| Project Closure | | | | |`,
      },
    ],
  },
  {
    cardId: 'process-7',
    title: 'Quality Management Plan',
    description: 'Define quality standards, review processes, and acceptance criteria for project deliverables.',
    sections: [
      {
        heading: 'Quality Standards',
        content: `| Deliverable | Quality Standard | Acceptance Criteria | Review Method | Reviewer | Frequency |
|---|---|---|---|---|---|
| | | | Peer Review / Testing / Audit | | |`,
      },
      {
        heading: 'Quality Review Log',
        content: `| Date | Deliverable | Reviewer | Defects Found | Severity | Status | Re-review Date |
|---|---|---|---|---|---|---|
| | | | | P1 Critical / P2 Major / P3 Minor | Pass / Fail / Conditional | |`,
      },
    ],
  },
  {
    cardId: 'process-8',
    title: 'Scope Management Plan',
    description: 'Define, document, and control project scope with a clear change management process.',
    sections: [
      {
        heading: 'Scope Statement',
        content: `| Element | Detail |
|---|---|
| Project Objectives | |
| In Scope | |
| Out of Scope | |
| Assumptions | |
| Constraints | |
| Deliverables | |`,
      },
      {
        heading: 'Scope Change Log',
        content: `| Change ID | Description | Requested By | Date | Impact (Cost/Time/Quality) | Decision | Approved By |
|---|---|---|---|---|---|---|
| SC-001 | | | | | Approved / Rejected / Deferred | |`,
      },
    ],
  },
  {
    cardId: 'process-9',
    title: 'Integrated Project Plan',
    description: 'A one-page integrated plan linking scope, schedule, budget, risks, and resources.',
    sections: [
      {
        heading: 'Plan Summary',
        content: `| Dimension | Summary | Owner | Status |
|---|---|---|---|
| Scope | Key deliverables and boundaries | PM | |
| Schedule | Key milestones and critical path | PM | |
| Budget | Total approved budget and contingency | PM | |
| Resources | Key team members and availability | PM | |
| Risks | Top 5 risks and mitigations | PM | |
| Quality | Key standards and review gates | QA | |
| Communications | Stakeholder comms plan | PM | |
| Procurement | Key vendors and contracts | PM | |`,
      },
    ],
  },
  {
    cardId: 'process-10',
    title: 'Change Control Log',
    description: 'A formal log to capture, assess, and approve all project change requests.',
    sections: [
      {
        heading: 'Change Request Log',
        content: `| CR ID | Title | Description | Requested By | Date | Priority | Impact on Cost | Impact on Schedule | Impact on Scope | Decision | Approved By | Date Closed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CR-001 | | | | | High / Med / Low | | | | Approved / Rejected / Deferred | | |`,
      },
    ],
  },
  {
    cardId: 'process-11',
    title: 'Procurement Plan',
    description: 'Plan and track all procurement activities, vendor selection, and contract management.',
    sections: [
      {
        heading: 'Procurement Register',
        content: `| Item | Justification | Procurement Method | Vendor Shortlist | Selected Vendor | Contract Value | Contract Type | Start Date | End Date | Status |
|---|---|---|---|---|---|---|---|---|---|
| | | RFQ / RFP / Direct | | | | Fixed / T&M | | | |`,
      },
      {
        heading: 'Vendor Performance Log',
        content: `| Vendor | Contract ID | Review Date | Delivery Score (1–5) | Quality Score (1–5) | Communication Score (1–5) | Issues | Actions |
|---|---|---|---|---|---|---|---|
| | | | | | | | |`,
      },
    ],
  },
  {
    cardId: 'process-12',
    title: 'Document Management Register',
    description: 'Track all project documents, versions, owners, and storage locations.',
    sections: [
      {
        heading: 'Document Register',
        content: `| Doc ID | Document Name | Type | Version | Owner | Status | Storage Location | Last Updated | Review Date |
|---|---|---|---|---|---|---|---|---|
| DOC-001 | Project Charter | Governance | v1.0 | PM | Approved | SharePoint/Drive | | |
| DOC-002 | Project Plan | Planning | | PM | Draft | | | |`,
      },
    ],
  },
  {
    cardId: 'process-13',
    title: 'Methodology Selection Record',
    description: 'Document the rationale for the chosen delivery methodology.',
    sections: [
      {
        heading: 'Selection Record',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Options Considered | Waterfall / Agile / Kanban / Hybrid |
| Selected Methodology | |
| Key Reasons | |
| Constraints Considered | |
| Agreed By | |
| Date | |`,
      },
    ],
  },
  {
    cardId: 'process-14',
    title: 'Governance Framework',
    description: 'Define the governance structure, decision rights, and escalation paths for the project.',
    sections: [
      {
        heading: 'Governance Structure',
        content: `| Body | Members | Frequency | Decision Authority | Quorum |
|---|---|---|---|---|
| Project Steering Committee | | Monthly | Strategic decisions, budget > £X | |
| Project Board | | Bi-weekly | Tactical decisions, scope changes | |
| Project Team | | Weekly | Day-to-day delivery | |`,
      },
      {
        heading: 'Escalation Matrix',
        content: `| Issue Type | First Escalation | Second Escalation | Final Escalation | Response Time |
|---|---|---|---|---|
| Budget variance < 5% | PM | | | 24h |
| Budget variance > 5% | PM | Sponsor | Steering Committee | 48h |
| Schedule delay < 1 week | PM | | | 24h |
| Schedule delay > 1 week | PM | Sponsor | | 48h |
| Scope change | PM | Project Board | Steering Committee | 48h |`,
      },
    ],
  },
  {
    cardId: 'process-15',
    title: 'Issues Log',
    description: 'Track, assign, and resolve project issues systematically.',
    sections: [
      {
        heading: 'Issues Register',
        content: `| Issue ID | Date Raised | Description | Category | Impact | Priority | Owner | Status | Resolution | Closed Date |
|---|---|---|---|---|---|---|---|---|---|
| I-001 | | | Technical / People / Process / External | High / Med / Low | P1 / P2 / P3 | | Open | | |`,
      },
    ],
  },
  {
    cardId: 'process-16',
    title: 'Knowledge Transfer Plan',
    description: 'Ensure critical project knowledge is captured and transferred to the receiving organisation.',
    sections: [
      {
        heading: 'Knowledge Transfer Register',
        content: `| Knowledge Area | Current Owner | Recipient | Transfer Method | Documentation Location | Transfer Date | Confirmed? |
|---|---|---|---|---|---|---|
| | | | Training / Documentation / Shadowing / Workshop | | | ✓ / ✗ |`,
      },
      {
        heading: 'Knowledge Transfer Checklist',
        content: `| Activity | Owner | Due Date | Status |
|---|---|---|---|
| Identify all critical knowledge areas | PM | | ☐ |
| Assign knowledge owners | PM | | ☐ |
| Create documentation for each area | Knowledge Owners | | ☐ |
| Conduct handover sessions | Knowledge Owners | | ☐ |
| Confirm recipient understanding | PM | | ☐ |
| Archive all materials | PM | | ☐ |`,
      },
    ],
  },
  {
    cardId: 'process-17',
    title: 'Project Closure Checklist',
    description: 'A comprehensive checklist to ensure all closure activities are completed.',
    sections: [
      {
        heading: 'Closure Checklist',
        content: `| Activity | Owner | Due Date | Status | Notes |
|---|---|---|---|---|
| All deliverables accepted by sponsor | PM | | ☐ | |
| Final budget reconciliation complete | Finance | | ☐ | |
| All contracts closed | Procurement | | ☐ | |
| Team members formally released | PM | | ☐ | |
| Lessons learned documented | PM | | ☐ | |
| Post-Implementation Review scheduled | PM | | ☐ | |
| Project artifacts archived | PM | | ☐ | |
| Formal sign-off document signed | Sponsor | | ☐ | |
| Team recognition/celebration held | PM | | ☐ | |`,
      },
    ],
  },
  {
    cardId: 'process-18',
    title: 'Planning Performance Domain Checklist',
    description: 'Ensure all Planning Performance Domain activities are addressed.',
    sections: [
      {
        heading: 'Planning Domain Checklist',
        content: `| Planning Activity | Completed | Owner | Notes |
|---|---|---|---|
| Delivery approach selected (predictive/agile/hybrid) | ☐ | | |
| Project scope defined and agreed | ☐ | | |
| Schedule baseline established | ☐ | | |
| Budget baseline established | ☐ | | |
| Resource plan completed | ☐ | | |
| Risk register populated | ☐ | | |
| Communication plan agreed | ☐ | | |
| Quality management approach defined | ☐ | | |
| Procurement strategy confirmed | ☐ | | |`,
      },
      {
        heading: 'Planning Assumptions & Constraints',
        content: `| Type | Description | Impact | Owner |
|---|---|---|---|
| Assumption | | | |
| Constraint | | | |`,
      },
    ],
  },
  {
    cardId: 'process-19',
    title: 'Delivery Performance Domain Tracker',
    description: 'Track delivery progress against the Delivery Performance Domain outcomes.',
    sections: [
      {
        heading: 'Delivery Outcomes Tracker',
        content: `| Outcome | Target | Actual | Variance | Action |
|---|---|---|---|---|
| Requirements met (%) | 100% | | | |
| Scope delivered on time | Yes | | | |
| Quality criteria met | Yes | | | |
| Stakeholder acceptance obtained | Yes | | | |`,
      },
      {
        heading: 'Deliverable Acceptance Log',
        content: `| Deliverable | Acceptance Criteria | Accepted By | Date | Notes |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'process-20',
    title: 'Measurement Performance Domain Dashboard',
    description: 'Define and track the key metrics for the Measurement Performance Domain.',
    sections: [
      {
        heading: 'Project Metrics Dashboard',
        content: `| Metric | Baseline | Current | Target | Trend | Action |
|---|---|---|---|---|---|
| Schedule Performance Index (SPI) | 1.0 | | >0.9 | | |
| Cost Performance Index (CPI) | 1.0 | | >0.9 | | |
| Scope Completion (%) | 0% | | 100% | | |
| Defect Rate | 0 | | <5% | | |
| Stakeholder Satisfaction | | | >4/5 | | |
| Team Velocity (if Agile) | | | | | |`,
      },
      {
        heading: 'Measurement Review Log',
        content: `| Date | Metric | Value | Interpretation | Decision Made |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'process-21',
    title: 'Uncertainty Performance Domain Risk Log',
    description: 'Manage uncertainty and ambiguity using the Uncertainty Performance Domain framework.',
    sections: [
      {
        heading: 'Uncertainty Register',
        content: `| ID | Uncertainty Type | Description | Probability | Impact | Response Strategy | Owner | Status |
|---|---|---|---|---|---|---|---|
| U-001 | Risk / Ambiguity / Complexity / Volatility | | H/M/L | H/M/L | Accept/Mitigate/Transfer/Avoid/Exploit | | Open |`,
      },
      {
        heading: 'Resilience Actions',
        content: `| Action | Purpose | Owner | Due Date | Status |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS ENVIRONMENT CARDS (BE01–BE04)
// ─────────────────────────────────────────────────────────────────────────────

const businessTemplates: CardTemplate[] = [
  {
    cardId: 'business-1',
    title: 'Compliance Register',
    description: 'Identify, track, and manage all regulatory and compliance requirements for the project.',
    sections: [
      {
        heading: 'Compliance Register',
        content: `| Req ID | Regulation / Standard | Requirement Description | Applies To | Owner | Evidence Required | Status | Review Date |
|---|---|---|---|---|---|---|---|
| C-001 | GDPR | Personal data must be encrypted at rest | Data systems | Tech Lead | Encryption audit | ☐ Compliant | |
| C-002 | ISO 27001 | Information security policy in place | All systems | CISO | Policy document | ☐ Compliant | |`,
      },
    ],
  },
  {
    cardId: 'business-2',
    title: 'Benefits Realisation Plan',
    description: 'Define, track, and report on the business benefits the project is expected to deliver.',
    sections: [
      {
        heading: 'Benefits Register',
        content: `| Benefit ID | Benefit Description | Type | Baseline Value | Target Value | Measurement Method | Owner | Realisation Date | Actual Value | Status |
|---|---|---|---|---|---|---|---|---|---|
| B-001 | | Financial / Efficiency / Quality / Strategic | | | | | | | On Track / At Risk |`,
      },
      {
        heading: 'Benefits Realisation Timeline',
        content: `| Quarter | Expected Benefits | Measurement Activity | Owner | Achieved? |
|---|---|---|---|---|
| Q1 post go-live | | | | |
| Q2 post go-live | | | | |
| 12 months post go-live | | | | |`,
      },
    ],
  },
  {
    cardId: 'business-3',
    title: 'External Change Impact Assessment',
    description: 'Assess the impact of external changes (regulatory, market, political) on the project.',
    sections: [
      {
        heading: 'External Change Log',
        content: `| Change ID | Source | Description | Date Identified | Impact on Project | Severity | Response Action | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| EC-001 | Regulatory / Market / Political / Technology | | | | High / Med / Low | | | Open |`,
      },
    ],
  },
  {
    cardId: 'business-4',
    title: 'Organisational Change Management Plan',
    description: 'Plan the people-side of change to maximise adoption and minimise resistance.',
    sections: [
      {
        heading: 'Change Impact Assessment',
        content: `| Stakeholder Group | Current State | Future State | Impact Level | Resistance Risk | Engagement Actions |
|---|---|---|---|---|---|
| | | | High / Med / Low | High / Med / Low | |`,
      },
      {
        heading: 'Change Readiness Assessment',
        content: `| Dimension | Score (1–5) | Notes |
|---|---|---|
| Leadership alignment and sponsorship | | |
| Communication clarity | | |
| Training and capability building | | |
| Resistance management | | |
| Reinforcement mechanisms | | |`,
      },
      {
        heading: 'Change Activity Plan',
        content: `| Activity | Purpose | Audience | Owner | Date | Status |
|---|---|---|---|---|---|
| Change impact workshop | Identify affected groups | PM + HR | | | ☐ |
| Leadership alignment session | Secure sponsor commitment | Sponsors | | | ☐ |
| Communication campaign | Inform all staff | All staff | Comms | | ☐ |
| Training delivery | Build capability | Impacted users | L&D | | ☐ |
| Go-live support | Reduce day-1 issues | All users | Support | | ☐ |`,
      },
    ],
  },
  {
    cardId: 'BE05',
    title: 'PESTLE Analysis Canvas',
    description: 'Scan the macro-environment across six dimensions to surface threats and opportunities before they impact your project.',
    sections: [
      {
        heading: 'Project Context',
        content: `| Field | Entry |
|---|---|
| Project / Initiative | |
| Industry / Sector | |
| Geography | |
| Analysis Date | |
| Facilitator | |`,
      },
      {
        heading: 'PESTLE Factors',
        content: `| Factor | Key Observations | Impact (H/M/L) | Opportunity or Threat | Response |
|---|---|---|---|---|
| Political | | | | |
| Economic | | | | |
| Social | | | | |
| Technological | | | | |
| Legal | | | | |
| Environmental | | | | |`,
      },
      {
        heading: 'Priority Factors',
        content: `List the top 3 factors requiring immediate attention and the planned response:

1. Factor: ___  Impact: ___  Response: ___
2. Factor: ___  Impact: ___  Response: ___
3. Factor: ___  Impact: ___  Response: ___`,
      },
      {
        heading: 'Review Schedule',
        content: `| Review Date | Trigger | Owner | Changes Since Last Review |
|---|---|---|---|
| | | | |
| | | | |`,
      },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS CARDS (T1–T17)
// ─────────────────────────────────────────────────────────────────────────────

const toolTemplates: CardTemplate[] = [
  {
    cardId: 'T1',
    title: 'Gantt Chart Template',
    description: 'A structured Gantt chart with tasks, durations, dependencies, and milestone markers.',
    sections: [
      {
        heading: 'Project Gantt Chart',
        content: `| Task ID | Task Name | Owner | Duration | Start | End | Dependency | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | **Initiation** | PM | 5d | | | — | ████ | | | | | | | |
| 1.1 | Define objectives | PM | 2d | | | — | ██ | | | | | | | |
| 1.2 | Stakeholder mapping | PM | 3d | | | 1.1 | ██ | █ | | | | | | |
| 2.0 | **Planning** | PM | 10d | | | 1.0 | | ████ | ████ | | | | | |
| 3.0 | **Execution** | Team | 20d | | | 2.0 | | | | ████ | ████ | ████ | ████ | ████ |
| 4.0 | **Closure** | PM | 5d | | | 3.0 | | | | | | | | ████ |

**Legend:** ████ = Task duration | ◆ = Milestone`,
      },
    ],
  },
  {
    cardId: 'T2',
    title: 'Kanban Board Template',
    description: 'A ready-to-use Kanban board with WIP limits and a work item log.',
    sections: [
      {
        heading: 'Kanban Board',
        content: `| Backlog | Ready (WIP: 5) | In Progress (WIP: 3) | In Review (WIP: 2) | Done |
|---|---|---|---|---|
| Item 4: Feature D | Item 3: Feature C | Item 1: Feature A | Item 2: Feature B | Item 0: Setup |
| Item 5: Bug fix | | | | |`,
      },
      {
        heading: 'Work Item Log',
        content: `| ID | Title | Priority | Added | Started | Completed | Cycle Time |
|---|---|---|---|---|---|---|
| K-001 | | High | | | | days |`,
      },
    ],
  },
  {
    cardId: 'T3',
    title: 'Work Breakdown Structure (WBS)',
    description: 'A hierarchical WBS decomposing the project into manageable work packages.',
    sections: [
      {
        heading: 'WBS Hierarchy',
        content: `| WBS Code | Deliverable / Work Package | Level | Owner | Estimated Effort | Notes |
|---|---|---|---|---|---|
| 1.0 | **Project Name** | 1 | PM | | |
| 1.1 | Initiation | 2 | PM | | |
| 1.1.1 | Project Charter | 3 | PM | 2 days | |
| 1.1.2 | Stakeholder Register | 3 | PM | 1 day | |
| 1.2 | Planning | 2 | PM | | |
| 1.2.1 | Project Plan | 3 | PM | 3 days | |
| 1.2.2 | Risk Register | 3 | PM | 1 day | |
| 1.3 | Execution | 2 | Team | | |
| 1.3.1 | [Work Package 1] | 3 | | | |
| 1.4 | Closure | 2 | PM | | |
| 1.4.1 | Lessons Learned | 3 | PM | 1 day | |`,
      },
    ],
  },
  {
    cardId: 'T4',
    title: 'Earned Value Management Tracker',
    description: 'Track project cost and schedule performance using EVM metrics.',
    sections: [
      {
        heading: 'EVM Summary',
        content: `| Period | Planned Value (PV) | Earned Value (EV) | Actual Cost (AC) | SV (EV–PV) | CV (EV–AC) | SPI (EV/PV) | CPI (EV/AC) |
|---|---|---|---|---|---|---|---|
| Month 1 | | | | | | | |
| Month 2 | | | | | | | |`,
      },
      {
        heading: 'EVM Interpretation Guide',
        content: `| Metric | Formula | > 1.0 means | < 1.0 means |
|---|---|---|---|
| SPI (Schedule Performance Index) | EV / PV | Ahead of schedule | Behind schedule |
| CPI (Cost Performance Index) | EV / AC | Under budget | Over budget |
| SV (Schedule Variance) | EV – PV | Ahead | Behind |
| CV (Cost Variance) | EV – AC | Under budget | Over budget |`,
      },
      {
        heading: 'Forecast',
        content: `| Metric | Formula | Value |
|---|---|---|
| Budget at Completion (BAC) | Total approved budget | |
| Estimate at Completion (EAC) | BAC / CPI | |
| Estimate to Complete (ETC) | EAC – AC | |
| Variance at Completion (VAC) | BAC – EAC | |`,
      },
    ],
  },
  {
    cardId: 'T5',
    title: 'RACI Matrix',
    description: 'A RACI matrix assigning Responsible, Accountable, Consulted, and Informed roles to every task.',
    sections: [
      {
        heading: 'RACI Matrix',
        content: `| Activity / Deliverable | PM | Sponsor | Tech Lead | Business Analyst | QA Lead | End User |
|---|---|---|---|---|---|---|
| Define project scope | A | C | C | R | I | C |
| Develop project plan | R | A | C | C | I | I |
| Design solution | I | I | R | A | C | C |
| Build / develop | I | I | A | C | I | I |
| Test solution | I | I | C | C | A/R | C |
| Deploy to production | R | A | R | C | C | I |
| Sign-off deliverables | C | A/R | C | C | C | R |

**Key:** R = Responsible | A = Accountable | C = Consulted | I = Informed`,
      },
    ],
  },
  {
    cardId: 'T6',
    title: 'Risk Register',
    description: 'A full risk register with probability/impact scoring and response tracking.',
    sections: [
      {
        heading: 'Risk Register',
        content: `| Risk ID | Description | Category | Probability (1–5) | Impact (1–5) | Score | Response | Owner | Contingency | Status |
|---|---|---|---|---|---|---|---|---|---|
| R-001 | Key resource unavailable | Resource | 3 | 4 | 12 | Mitigate: cross-train backup | PM | Use contractor | Open |
| R-002 | Scope creep | Scope | 4 | 3 | 12 | Avoid: strict change control | PM | Escalate to board | Open |
| R-003 | Technology failure | Technical | 2 | 5 | 10 | Mitigate: DR plan | Tech Lead | Rollback plan | Open |`,
      },
      {
        heading: 'Risk Heat Map',
        content: `| | **Impact 1** | **Impact 2** | **Impact 3** | **Impact 4** | **Impact 5** |
|---|---|---|---|---|---|
| **Prob 5** | 5 | 10 | 15 | 20 | **25** |
| **Prob 4** | 4 | 8 | 12 | **16** | **20** |
| **Prob 3** | 3 | 6 | **9** | **12** | **15** |
| **Prob 2** | 2 | 4 | 6 | 8 | 10 |
| **Prob 1** | 1 | 2 | 3 | 4 | 5 |

**🔴 High (12–25) | 🟡 Medium (6–11) | 🟢 Low (1–5)**`,
      },
    ],
  },
  {
    cardId: 'T7',
    title: 'MoSCoW Prioritisation Template',
    description: 'Prioritise project requirements using the MoSCoW method.',
    sections: [
      {
        heading: 'MoSCoW Backlog',
        content: `| ID | Requirement / Feature | Must Have | Should Have | Could Have | Won't Have | Rationale | Owner |
|---|---|---|---|---|---|---|---|
| REQ-001 | User login | ✓ | | | | Security requirement | Dev |
| REQ-002 | Export to PDF | | ✓ | | | Requested by 70% of users | Dev |
| REQ-003 | Dark mode | | | ✓ | | Nice to have | Dev |
| REQ-004 | Multi-language | | | | ✓ | Out of scope for v1 | — |`,
      },
      {
        heading: 'Prioritisation Summary',
        content: `| Category | Count | % of Total | Effort Estimate |
|---|---|---|---|
| Must Have | | | |
| Should Have | | | |
| Could Have | | | |
| Won't Have | | | |`,
      },
    ],
  },
  {
    cardId: 'T8',
    title: 'Fishbone (Ishikawa) Diagram Template',
    description: 'A structured cause-and-effect analysis to identify root causes of a problem.',
    sections: [
      {
        heading: 'Problem Statement',
        content: `| Field | Detail |
|---|---|
| Problem / Effect | |
| Date Identified | |
| Impact | |
| Team Involved | |`,
      },
      {
        heading: 'Cause Categories',
        content: `| Category (Bone) | Potential Causes | Root Cause? (✓/✗) |
|---|---|---|
| **People** | Lack of training | |
| **People** | High staff turnover | |
| **Process** | Unclear procedures | |
| **Process** | No quality checks | |
| **Technology** | System downtime | |
| **Technology** | Outdated tools | |
| **Materials** | Poor quality inputs | |
| **Environment** | Remote working challenges | |
| **Measurement** | No KPIs defined | |
| **Management** | Unclear priorities | |`,
      },
      {
        heading: 'Root Cause & Actions',
        content: `| Root Cause | Evidence | Corrective Action | Owner | Due Date |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'T9',
    title: 'Monte Carlo Simulation Input Sheet',
    description: 'Prepare inputs for a Monte Carlo simulation to model schedule and cost uncertainty.',
    sections: [
      {
        heading: 'Task Duration Estimates (Three-Point)',
        content: `| Task | Optimistic (O) | Most Likely (M) | Pessimistic (P) | PERT Estimate [(O+4M+P)/6] |
|---|---|---|---|---|
| Task 1 | | | | |
| Task 2 | | | | |
| Task 3 | | | | |`,
      },
      {
        heading: 'Cost Estimates (Three-Point)',
        content: `| Cost Item | Optimistic (£) | Most Likely (£) | Pessimistic (£) | PERT Estimate |
|---|---|---|---|---|
| Labour | | | | |
| Software | | | | |
| Hardware | | | | |`,
      },
      {
        heading: 'Simulation Results (to be filled after running simulation)',
        content: `| Confidence Level | Schedule Completion Date | Total Cost |
|---|---|---|
| P50 (50% confidence) | | |
| P80 (80% confidence) | | |
| P90 (90% confidence) | | |`,
      },
    ],
  },
  {
    cardId: 'T10',
    title: 'Decision Tree Template',
    description: 'A structured decision tree to evaluate options and their expected monetary values.',
    sections: [
      {
        heading: 'Decision Context',
        content: `| Field | Detail |
|---|---|
| Decision to Make | |
| Decision Maker | |
| Date | |
| Deadline | |`,
      },
      {
        heading: 'Decision Tree Analysis',
        content: `| Option | Scenario | Probability | Outcome Value | Expected Value (P × V) |
|---|---|---|---|---|
| Option A: Build in-house | Success | 0.7 | £500,000 | £350,000 |
| Option A: Build in-house | Failure | 0.3 | -£200,000 | -£60,000 |
| **Option A EMV** | | | | **£290,000** |
| Option B: Buy off-shelf | Success | 0.9 | £300,000 | £270,000 |
| Option B: Buy off-shelf | Failure | 0.1 | -£50,000 | -£5,000 |
| **Option B EMV** | | | | **£265,000** |`,
      },
      {
        heading: 'Recommendation',
        content: `| Field | Detail |
|---|---|
| Recommended Option | |
| Rationale | |
| Non-financial factors considered | |`,
      },
    ],
  },
  {
    cardId: 'T11',
    title: 'Balanced Scorecard Template',
    description: 'A balanced scorecard linking project objectives to four strategic perspectives.',
    sections: [
      {
        heading: 'Balanced Scorecard',
        content: `| Perspective | Strategic Objective | KPI | Target | Actual | RAG |
|---|---|---|---|---|---|
| **Financial** | Deliver within budget | CPI ≥ 1.0 | ≥ 1.0 | | 🟢/🟡/🔴 |
| **Financial** | Realise projected ROI | ROI % | ≥ 15% | | |
| **Customer** | Achieve user adoption | % users active at 90 days | ≥ 80% | | |
| **Customer** | Improve satisfaction | NPS score | ≥ +30 | | |
| **Internal Process** | Deliver on schedule | SPI ≥ 1.0 | ≥ 1.0 | | |
| **Internal Process** | Reduce defect rate | Defects per release | < 5 P1 | | |
| **Learning & Growth** | Upskill team | Training hours completed | 20h/person | | |
| **Learning & Growth** | Capture lessons | Lessons documented | 100% | | |`,
      },
    ],
  },
  {
    cardId: 'T12',
    title: 'Delphi Technique Estimation Sheet',
    description: 'A structured multi-round expert estimation worksheet using the Delphi method.',
    sections: [
      {
        heading: 'Expert Panel',
        content: `| Expert | Role | Expertise Area |
|---|---|---|
| Expert 1 | | |
| Expert 2 | | |
| Expert 3 | | |`,
      },
      {
        heading: 'Round 1 — Individual Estimates',
        content: `| Item to Estimate | Expert 1 | Expert 2 | Expert 3 | Mean | Std Dev | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |`,
      },
      {
        heading: 'Round 2 — Revised Estimates (after sharing Round 1 results)',
        content: `| Item | Expert 1 (revised) | Expert 2 (revised) | Expert 3 (revised) | Consensus Estimate | Confidence |
|---|---|---|---|---|---|
| | | | | | High / Med / Low |`,
      },
    ],
  },
  {
    cardId: 'T13',
    title: 'Cost-Benefit Analysis Template',
    description: 'A structured CBA to quantify costs and benefits and calculate ROI and payback period.',
    sections: [
      {
        heading: 'Costs',
        content: `| Cost Category | Year 0 | Year 1 | Year 2 | Year 3 | Total |
|---|---|---|---|---|---|
| Development / Build | | | | | |
| Infrastructure | | | | | |
| Licences / Software | | | | | |
| Training | | | | | |
| Change management | | | | | |
| Ongoing support | | | | | |
| **Total Costs** | | | | | |`,
      },
      {
        heading: 'Benefits',
        content: `| Benefit Category | Year 0 | Year 1 | Year 2 | Year 3 | Total |
|---|---|---|---|---|---|
| Cost savings | | | | | |
| Revenue increase | | | | | |
| Efficiency gains | | | | | |
| Risk reduction | | | | | |
| **Total Benefits** | | | | | |`,
      },
      {
        heading: 'Summary',
        content: `| Metric | Value |
|---|---|
| Total Costs | |
| Total Benefits | |
| Net Benefit (Benefits – Costs) | |
| ROI % [(Net Benefit / Costs) × 100] | |
| Payback Period | |
| Recommendation | Proceed / Do Not Proceed / Revisit |`,
      },
    ],
  },
  {
    cardId: 'T14',
    title: 'Project Scope Statement',
    description: 'A formal scope statement defining objectives, deliverables, boundaries, and constraints.',
    sections: [
      {
        heading: 'Scope Statement',
        content: `| Element | Detail |
|---|---|
| Project Name | |
| Project Sponsor | |
| Project Manager | |
| Version | |
| Date | |`,
      },
      {
        heading: 'Objectives',
        content: `| # | Objective | Success Measure |
|---|---|---|
| 1 | | |
| 2 | | |`,
      },
      {
        heading: 'In Scope',
        content: `| # | In-Scope Item |
|---|---|
| 1 | |
| 2 | |`,
      },
      {
        heading: 'Out of Scope',
        content: `| # | Out-of-Scope Item | Reason |
|---|---|---|
| 1 | | |`,
      },
      {
        heading: 'Assumptions & Constraints',
        content: `| Type | Description |
|---|---|
| Assumption | |
| Constraint | |`,
      },
    ],
  },
  {
    cardId: 'T15',
    title: 'Force Field Analysis Template',
    description: 'Analyse the forces driving and restraining a proposed change to assess feasibility.',
    sections: [
      {
        heading: 'Change Statement',
        content: `| Field | Detail |
|---|---|
| Proposed Change | |
| Current State | |
| Desired State | |`,
      },
      {
        heading: 'Force Field Analysis',
        content: `| Driving Forces (For Change) | Strength (1–5) | Restraining Forces (Against Change) | Strength (1–5) |
|---|---|---|---|
| Cost savings | 4 | Fear of job losses | 4 |
| Improved efficiency | 3 | Lack of skills | 3 |
| Customer demand | 5 | Budget constraints | 2 |
| **Total Driving Score** | | **Total Restraining Score** | |`,
      },
      {
        heading: 'Action Plan',
        content: `| Action | Purpose (Strengthen driving / Weaken restraining) | Owner | Due Date |
|---|---|---|---|
| | | | |`,
      },
    ],
  },
  {
    cardId: 'T16',
    title: 'Stakeholder Matrix',
    description: 'Map stakeholders by influence and interest to prioritise engagement strategies.',
    sections: [
      {
        heading: 'Stakeholder Register',
        content: `| Stakeholder | Role | Influence (H/M/L) | Interest (H/M/L) | Quadrant | Current Attitude | Desired Attitude | Engagement Strategy |
|---|---|---|---|---|---|---|---|
| | | | | Manage Closely / Keep Satisfied / Keep Informed / Monitor | Supporter / Neutral / Resistor | | |`,
      },
      {
        heading: 'Stakeholder Matrix Grid',
        content: `|  | **Low Interest** | **High Interest** |
|---|---|---|
| **High Influence** | Keep Satisfied | Manage Closely |
| **Low Influence** | Monitor | Keep Informed |`,
      },
    ],
  },
  {
    cardId: 'T17',
    title: 'Burndown Chart Data Template',
    description: 'Track sprint or release progress with a burndown chart data table.',
    sections: [
      {
        heading: 'Sprint Burndown Data',
        content: `| Day | Ideal Remaining (SP) | Actual Remaining (SP) | Completed Today (SP) | Notes |
|---|---|---|---|---|
| Day 0 (Sprint Start) | 40 | 40 | — | |
| Day 1 | 36 | 38 | 2 | |
| Day 2 | 32 | 34 | 4 | |
| Day 3 | 28 | 30 | 4 | |
| Day 4 | 24 | 28 | 2 | Blocker: dependency |
| Day 5 | 20 | 22 | 6 | |
| Day 6 | 16 | 18 | 4 | |
| Day 7 | 12 | 14 | 4 | |
| Day 8 | 8 | 10 | 4 | |
| Day 9 | 4 | 6 | 4 | |
| Day 10 (Sprint End) | 0 | 2 | 4 | 2 SP carried over |`,
      },
    ],
  },
  {
    cardId: 'T20',
    title: 'CI/CD Pipeline Design Canvas',
    description: 'Design and document your Continuous Integration and Continuous Delivery pipeline.',
    sections: [
      {
        heading: 'Pipeline Stages',
        content: `| Stage | Tools Used | Trigger | Success Criteria | Owner |
|---|---|---|---|---|
| Source Control | | Code commit | Branch policy met | |
| Build | | On commit | Build passes | |
| Unit Test | | On build | >80% coverage | |
| Code Quality | | On build | No critical issues | |
| Integration Test | | On merge | All tests pass | |
| Staging Deploy | | On PR merge | Deploy successful | |
| UAT / Smoke Test | | On staging deploy | Key flows pass | |
| Production Deploy | | Manual approval | Deploy successful | |`,
      },
      {
        heading: 'Pipeline Health Metrics',
        content: `| Metric | Current | Target | Notes |
|---|---|---|---|
| Build success rate | | >95% | |
| Mean time to deploy (mins) | | <30 | |
| Deployment frequency (per week) | | | |
| Change failure rate | | <5% | |
| Mean time to recovery (MTTR) | | <1hr | |`,
      },
    ],
  },

  {
    cardId: 'T18',
    title: 'Critical Path Method (CPM) Worksheet',
    description: 'Map your project network, calculate early/late start and finish times, and identify the critical path.',
    sections: [
      {
        heading: 'Activity List',
        content: `| Activity ID | Activity Name | Duration (days) | Predecessors | Resources |
|---|---|---|---|---|
| A | | | None | |
| B | | | A | |
| C | | | A | |
| D | | | B, C | |
| E | | | D | |`,
      },
      {
        heading: 'Forward & Backward Pass',
        content: `| Activity | Duration | ES | EF | LS | LF | Float |
|---|---|---|---|---|---|---|
| A | | | | | | |
| B | | | | | | |
| C | | | | | | |
| D | | | | | | |
| E | | | | | | |

ES = Early Start  EF = Early Finish  LS = Late Start  LF = Late Finish  Float = LF minus EF`,
      },
      {
        heading: 'Critical Path',
        content: `Critical Path: ___ to ___ to ___ to ___

Total Project Duration: ___ days

Activities with Zero Float (must not slip):`,
      },
      {
        heading: 'Schedule Risk',
        content: `| Activity | Float (days) | Risk if Delayed | Mitigation |
|---|---|---|---|
| | | | |
| | | | |`,
      },
    ],
  },
  {
    cardId: 'T19',
    title: 'RAID Log',
    description: 'Track Risks, Assumptions, Issues, and Dependencies in one central log throughout the project lifecycle.',
    sections: [
      {
        heading: 'Risks',
        content: `| ID | Risk Description | Probability (H/M/L) | Impact (H/M/L) | Score | Owner | Response | Status |
|---|---|---|---|---|---|---|---|
| R001 | | | | | | | Open |
| R002 | | | | | | | Open |
| R003 | | | | | | | Open |`,
      },
      {
        heading: 'Assumptions',
        content: `| ID | Assumption | If Wrong, Impact | Owner | Validation Date | Status |
|---|---|---|---|---|---|
| A001 | | | | | Active |
| A002 | | | | | Active |`,
      },
      {
        heading: 'Issues',
        content: `| ID | Issue Description | Priority (H/M/L) | Owner | Resolution | Due Date | Status |
|---|---|---|---|---|---|---|
| I001 | | | | | | Open |
| I002 | | | | | | Open |`,
      },
      {
        heading: 'Dependencies',
        content: `| ID | Dependency Description | Type (Internal/External) | Depends On | Owner | Due Date | Status |
|---|---|---|---|---|---|---|
| D001 | | | | | | On Track |
| D002 | | | | | | On Track |`,
      },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// TECHNIQUES CARDS (A1–A82) — selected key templates
// ─────────────────────────────────────────────────────────────────────────────

const techniqueTemplates: CardTemplate[] = [
  {
    cardId: 'A1',
    title: 'Principled Negotiation Prep Sheet',
    description: 'Prepare for a principled negotiation using the Fisher & Ury framework.',
    sections: [
      {
        heading: 'Negotiation Preparation',
        content: `| Element | Our Position | Their Likely Position |
|---|---|---|
| Stated Position | | |
| Underlying Interest | | |
| Shared Interests | | |
| Options for Mutual Gain | | |
| Objective Criteria to Use | | |
| Our BATNA | | |
| Their Likely BATNA | | |`,
      },
    ],
  },
  {
    cardId: 'A2',
    title: "Tuckman's Team Stage Assessment",
    description: "Identify which stage of Tuckman's model your team is in and plan interventions.",
    sections: [
      {
        heading: 'Team Stage Indicators',
        content: `| Stage | Key Behaviours Present? | Evidence | PM Actions |
|---|---|---|---|
| **Forming** | Polite, uncertain, dependent on leader | ✓ / ✗ | Set clear direction, establish norms |
| **Storming** | Conflict, power struggles, resistance | ✓ / ✗ | Facilitate conflict, clarify roles |
| **Norming** | Cohesion, shared norms, collaboration | ✓ / ✗ | Reinforce norms, delegate more |
| **Performing** | High output, self-directing, innovative | ✓ / ✗ | Remove blockers, celebrate wins |
| **Adjourning** | Closure, reflection, disengagement | ✓ / ✗ | Recognise contributions, lessons learned |`,
      },
      {
        heading: 'Current Assessment',
        content: `| Field | Detail |
|---|---|
| Current Stage | |
| Evidence | |
| PM Interventions Planned | |`,
      },
    ],
  },
  {
    cardId: 'A3',
    title: 'Performance Gap Analysis',
    description: 'Identify the gap between current and required performance and plan interventions.',
    sections: [
      {
        heading: 'Performance Gap Matrix',
        content: `| Competency / Skill | Required Level (1–5) | Current Level (1–5) | Gap | Priority | Development Action |
|---|---|---|---|---|---|
| | | | | High / Med / Low | |`,
      },
    ],
  },
  {
    cardId: 'A4',
    title: 'Delegation Poker Card',
    description: 'Use the 7 levels of delegation to clarify decision authority for each task.',
    sections: [
      {
        heading: 'Delegation Level Matrix',
        content: `| Task / Decision | Delegation Level | Level Description | Owner | Notes |
|---|---|---|---|---|
| | 1 | Tell — PM decides and announces | | |
| | 2 | Sell — PM decides and persuades | | |
| | 3 | Consult — PM asks for input then decides | | |
| | 4 | Agree — PM and team decide together | | |
| | 5 | Advise — Team decides, PM advises | | |
| | 6 | Inquire — Team decides, PM asks to be informed | | |
| | 7 | Delegate — Team decides fully | | |`,
      },
      {
        heading: 'Task Delegation Register',
        content: `| Task | Current Level | Target Level | Rationale | Review Date |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A5',
    title: 'Knowledge Transfer Matrix',
    description: 'Map critical knowledge to owners and plan structured transfer activities.',
    sections: [
      {
        heading: 'Knowledge Map',
        content: `| Knowledge Area | Criticality | Current Owner | Backup Owner | Transfer Method | Documentation? | Transfer Date | Confirmed? |
|---|---|---|---|---|---|---|---|
| | High / Med / Low | | | Training / Docs / Shadowing | ✓ / ✗ | | ✓ / ✗ |`,
      },
    ],
  },
  {
    cardId: 'A6',
    title: 'Personality Profiling Team Map',
    description: 'Map team personality profiles to understand communication and collaboration styles.',
    sections: [
      {
        heading: 'Team Profile Summary',
        content: `| Team Member | Profile Type | Key Strengths | Potential Blind Spots | Best Communication Style | Preferred Work Style |
|---|---|---|---|---|---|
| | DISC / MBTI / Big 5 | | | | |`,
      },
      {
        heading: 'Team Diversity Analysis',
        content: `| Profile Type | Count | % of Team | Implications for Team Dynamics |
|---|---|---|---|
| | | | |`,
      },
    ],
  },
  {
    cardId: 'A7',
    title: 'Kaizen Blitz Event Plan',
    description: 'Plan and run a focused 3–5 day rapid improvement event.',
    sections: [
      {
        heading: 'Event Overview',
        content: `| Field | Detail |
|---|---|
| Process to Improve | |
| Event Dates | |
| Team Members | |
| Sponsor | |
| Target Improvement | |`,
      },
      {
        heading: 'Day-by-Day Plan',
        content: `| Day | Activities | Owner | Output |
|---|---|---|---|
| Day 1 | Understand current state, map process, identify waste | Team | Current state map |
| Day 2 | Analyse root causes, brainstorm improvements | Team | Root cause analysis |
| Day 3 | Design future state, plan implementation | Team | Future state map |
| Day 4 | Implement quick wins, test changes | Team | Implemented changes |
| Day 5 | Measure results, document, present to sponsor | Team | Results report |`,
      },
    ],
  },
  {
    cardId: 'A8',
    title: 'ZOPA & BATNA Worksheet',
    description: 'Map the Zone of Possible Agreement and Best Alternative to Negotiated Agreement.',
    sections: [
      {
        heading: 'ZOPA Analysis',
        content: `| Party | Ideal Outcome | Acceptable Outcome | Walk-away Point | BATNA |
|---|---|---|---|---|
| Us | | | | |
| Them | | | | |`,
      },
      {
        heading: 'ZOPA Calculation',
        content: `| Element | Value |
|---|---|
| Our walk-away point | |
| Their walk-away point | |
| Zone of Possible Agreement | Between [our walk-away] and [their walk-away] |
| Proposed Agreement | |`,
      },
    ],
  },
  {
    cardId: 'A9',
    title: 'Co-Creation Workshop Plan',
    description: 'Plan and facilitate a co-creation workshop with stakeholders.',
    sections: [
      {
        heading: 'Workshop Overview',
        content: `| Field | Detail |
|---|---|
| Workshop Title | |
| Date & Time | |
| Location / Platform | |
| Facilitator | |
| Participants | |
| Objective | |
| Expected Outputs | |`,
      },
      {
        heading: 'Agenda',
        content: `| Time | Activity | Facilitator | Materials Needed |
|---|---|---|---|
| 00:00 | Welcome and context setting | | |
| 00:15 | Current state exploration | | Sticky notes, whiteboard |
| 00:45 | Problem definition | | |
| 01:15 | Ideation — generate solutions | | |
| 01:45 | Prioritise and select ideas | | Voting dots |
| 02:15 | Action planning | | |
| 02:45 | Wrap-up and next steps | | |`,
      },
    ],
  },
  {
    cardId: 'A10',
    title: 'Mind Map Template',
    description: 'A structured mind map for project planning, brainstorming, or problem analysis.',
    sections: [
      {
        heading: 'Mind Map Structure',
        content: `| Central Topic | Main Branch | Sub-Branch 1 | Sub-Branch 2 |
|---|---|---|---|
| **[Your Topic]** | People | Team structure | Roles & responsibilities |
| | People | Stakeholders | Engagement plan |
| | Process | Methodology | Agile / Waterfall |
| | Process | Governance | Steering committee |
| | Technology | Tools | Jira, Confluence |
| | Technology | Infrastructure | Cloud / On-premise |
| | Budget | Costs | Labour, software |
| | Budget | Benefits | ROI, savings |`,
      },
    ],
  },
  {
    cardId: 'A11',
    title: 'Reverse Mentoring Programme Plan',
    description: 'Structure a reverse mentoring programme pairing junior and senior staff.',
    sections: [
      {
        heading: 'Programme Overview',
        content: `| Field | Detail |
|---|---|
| Programme Name | |
| Duration | |
| Frequency of Sessions | |
| Focus Areas | Digital skills / New ways of working / Cultural awareness |`,
      },
      {
        heading: 'Pairing Register',
        content: `| Junior Mentor | Senior Mentee | Focus Topic | Session Frequency | Start Date | Status |
|---|---|---|---|---|---|
| | | | | | Active / Completed |`,
      },
    ],
  },
  {
    cardId: 'A12',
    title: 'Empathy Map',
    description: 'Build empathy for a stakeholder or user group by mapping their thoughts, feelings, and behaviours.',
    sections: [
      {
        heading: 'Empathy Map',
        content: `| Quadrant | Observations |
|---|---|
| **THINK & FEEL** — What matters most? What worries them? | |
| **HEAR** — What do colleagues / managers / media say? | |
| **SEE** — What do they observe in their environment? | |
| **SAY & DO** — What do they say publicly? What actions do they take? | |
| **PAINS** — Frustrations, obstacles, fears | |
| **GAINS** — Goals, desires, measures of success | |`,
      },
    ],
  },
  {
    cardId: 'A13',
    title: 'Lean Startup Pilot Plan',
    description: 'Design a Build-Measure-Learn pilot to test a project assumption quickly.',
    sections: [
      {
        heading: 'Hypothesis',
        content: `| Element | Detail |
|---|---|
| Assumption to Test | |
| We believe that… | |
| We will know this is true when… | |
| Minimum Viable Test | |`,
      },
      {
        heading: 'Build-Measure-Learn Cycle',
        content: `| Cycle | Build (What we created) | Measure (Metrics tracked) | Learn (What we discovered) | Decision |
|---|---|---|---|---|
| Cycle 1 | | | | Pivot / Persevere / Stop |
| Cycle 2 | | | | |`,
      },
    ],
  },
  {
    cardId: 'A14',
    title: 'Quantitative Risk Analysis Sheet',
    description: 'Perform expected monetary value analysis on key project risks.',
    sections: [
      {
        heading: 'EMV Analysis',
        content: `| Risk ID | Description | Probability | Impact (£) | EMV (P × I) | Response Cost | Net EMV |
|---|---|---|---|---|---|---|
| R-001 | | 0.3 | | | | |
| R-002 | | 0.5 | | | | |`,
      },
      {
        heading: 'Contingency Reserve Calculation',
        content: `| Element | Value |
|---|---|
| Sum of all positive EMVs (opportunities) | |
| Sum of all negative EMVs (threats) | |
| Net EMV | |
| Recommended Contingency Reserve | |`,
      },
    ],
  },
  {
    cardId: 'A15',
    title: 'Stakeholder Engagement Matrix',
    description: 'Track current vs desired stakeholder engagement levels and plan actions.',
    sections: [
      {
        heading: 'Engagement Matrix',
        content: `| Stakeholder | Unaware | Resistant | Neutral | Supportive | Champion | Current (C) | Desired (D) | Actions to Close Gap |
|---|---|---|---|---|---|---|---|---|
| | | | | | | C | D | |`,
      },
    ],
  },
  {
    cardId: 'A16',
    title: 'Zero-Based Budget Template',
    description: 'Build a project budget from zero, justifying every line item from scratch.',
    sections: [
      {
        heading: 'Zero-Based Budget',
        content: `| Budget Line | Justification | Quantity | Unit Cost | Total Cost | Priority | Approved? |
|---|---|---|---|---|---|---|
| PM Labour | Required to manage delivery | 100 days | £600/day | £60,000 | Must Have | ✓ |
| Developer Labour | Core build resource | 200 days | £500/day | £100,000 | Must Have | ✓ |
| Software Licence | Required for delivery platform | 1 year | £10,000 | £10,000 | Must Have | ✓ |
| Training | Team upskilling | 5 people | £1,000 | £5,000 | Should Have | ✓ |
| Contingency | 10% of total | | | | Must Have | ✓ |`,
      },
    ],
  },
  {
    cardId: 'A17',
    title: 'PERT Analysis Template',
    description: 'Calculate PERT estimates for project tasks using three-point estimation.',
    sections: [
      {
        heading: 'PERT Calculation Table',
        content: `| Task | Optimistic (O) | Most Likely (M) | Pessimistic (P) | PERT Estimate [(O+4M+P)/6] | Std Dev [(P-O)/6] | Variance |
|---|---|---|---|---|---|---|
| Task 1 | | | | | | |
| Task 2 | | | | | | |
| **Project Total** | | | | | | |`,
      },
      {
        heading: 'Confidence Intervals',
        content: `| Confidence Level | Formula | Estimated Duration |
|---|---|---|
| 68% (1σ) | PERT ± 1 Std Dev | |
| 95% (2σ) | PERT ± 2 Std Dev | |
| 99.7% (3σ) | PERT ± 3 Std Dev | |`,
      },
    ],
  },
  {
    cardId: 'A18',
    title: 'Six Sigma DMAIC Project Charter',
    description: 'A DMAIC project charter to structure a Six Sigma improvement initiative.',
    sections: [
      {
        heading: 'Project Charter',
        content: `| Field | Detail |
|---|---|
| Project Title | |
| Problem Statement | |
| Goal Statement | |
| Scope | |
| Team | |
| Sponsor | |
| Timeline | |`,
      },
      {
        heading: 'DMAIC Phase Plan',
        content: `| Phase | Key Activities | Tools | Deliverables | Owner | Due Date |
|---|---|---|---|---|---|
| Define | Define problem, scope, team | SIPOC, VOC | Project Charter | | |
| Measure | Baseline current performance | Process map, data collection | Baseline data | | |
| Analyse | Identify root causes | Fishbone, 5 Whys, Pareto | Root cause analysis | | |
| Improve | Develop and test solutions | Pilot, DOE | Improved process | | |
| Control | Sustain improvements | Control chart, SOP | Control plan | | |`,
      },
    ],
  },
  {
    cardId: 'A19',
    title: 'Rolling Wave Planning Template',
    description: 'Plan near-term work in detail while keeping future phases at a high level.',
    sections: [
      {
        heading: 'Rolling Wave Plan',
        content: `| Planning Horizon | Detail Level | Tasks / Work Packages | Owner | Duration | Status |
|---|---|---|---|---|---|
| **Now (0–2 weeks)** | Full detail | | | | Active |
| **Near (2–6 weeks)** | Moderate detail | | | | Planned |
| **Medium (6–12 weeks)** | High level | | | | Outline |
| **Far (12+ weeks)** | Summary only | | | | TBD |`,
      },
      {
        heading: 'Wave Refresh Log',
        content: `| Date | Wave Refreshed | New Information Incorporated | Changes Made | Owner |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A20',
    title: 'Integrated Change Control Log',
    description: 'Manage all change requests through a formal integrated change control process.',
    sections: [
      {
        heading: 'Change Request Form',
        content: `| Field | Detail |
|---|---|
| Change Request ID | |
| Title | |
| Requested By | |
| Date Submitted | |
| Description | |
| Justification | |
| Impact on Scope | |
| Impact on Schedule | |
| Impact on Cost | |
| Impact on Quality | |
| Impact on Risk | |
| Recommended Action | Approve / Reject / Defer |
| Decision | |
| Decision By | |
| Date Decided | |`,
      },
    ],
  },
  {
    cardId: 'A21',
    title: 'Should-Cost Analysis Template',
    description: 'Estimate what a product or service should cost to strengthen procurement negotiations.',
    sections: [
      {
        heading: 'Should-Cost Breakdown',
        content: `| Cost Element | Our Estimate | Supplier Quote | Variance | Notes |
|---|---|---|---|---|
| Direct Labour | | | | |
| Materials | | | | |
| Overhead | | | | |
| Profit Margin | | | | |
| **Total** | | | | |`,
      },
      {
        heading: 'Negotiation Target',
        content: `| Element | Value |
|---|---|
| Our Should-Cost Total | |
| Supplier Quote | |
| Target Negotiated Price | |
| Maximum Acceptable Price | |`,
      },
    ],
  },
  {
    cardId: 'A22',
    title: 'Agile-Waterfall Hybrid Mapping Template',
    description: 'Map which project phases use Agile vs Waterfall delivery and define the integration points.',
    sections: [
      {
        heading: 'Hybrid Phase Map',
        content: `| Phase | Approach | Rationale | Key Artefacts | Integration Point |
|---|---|---|---|---|
| Initiation | Waterfall | Fixed requirements for business case | Business Case, Charter | Gate 1 |
| Planning | Waterfall | Baseline needed for governance | Project Plan, WBS | Gate 2 |
| Design | Waterfall | Architecture must be agreed before build | Design Document | Gate 3 |
| Build | Agile | Requirements evolve during development | Sprint backlog, burndown | — |
| Test | Agile | Iterative testing with each sprint | Test reports | — |
| UAT | Waterfall | Formal sign-off required | UAT report | Gate 4 |
| Deployment | Waterfall | Single coordinated release | Release notes | Gate 5 |`,
      },
    ],
  },
  {
    cardId: 'A23',
    title: '5 Whys Root Cause Analysis',
    description: 'Drill down to the root cause of a problem by asking "Why?" five times.',
    sections: [
      {
        heading: '5 Whys Analysis',
        content: `| Level | Question | Answer |
|---|---|---|
| Problem Statement | What is the problem? | |
| Why 1 | Why did this happen? | |
| Why 2 | Why did that happen? | |
| Why 3 | Why did that happen? | |
| Why 4 | Why did that happen? | |
| Why 5 | Why did that happen? | |
| **Root Cause** | | |`,
      },
      {
        heading: 'Corrective Actions',
        content: `| Root Cause | Corrective Action | Owner | Due Date | Status |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A24',
    title: 'Knowledge-Centred Service (KCS) Article Template',
    description: 'A KCS article template to capture and share project knowledge in a reusable format.',
    sections: [
      {
        heading: 'KCS Article',
        content: `| Field | Detail |
|---|---|
| Article ID | |
| Title | |
| Category | Process / Technical / People / Decision |
| Author | |
| Date Created | |
| Last Updated | |`,
      },
      {
        heading: 'Content',
        content: `| Section | Content |
|---|---|
| **Issue / Question** | What problem or question does this address? |
| **Environment / Context** | When does this apply? What are the conditions? |
| **Resolution / Answer** | What is the solution or answer? |
| **Cause** | Why does this happen? |
| **Related Articles** | Links to related knowledge |`,
      },
    ],
  },
  {
    cardId: 'A25',
    title: 'Post-Implementation Review Template',
    description: 'A structured PIR to evaluate project outcomes against objectives and capture lessons.',
    sections: [
      {
        heading: 'PIR Summary',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Review Date | |
| Facilitator | |
| Attendees | |`,
      },
      {
        heading: 'Objectives vs Outcomes',
        content: `| Objective | Target | Actual | Achieved? | Variance |
|---|---|---|---|---|
| | | | ✓ / ✗ / ⚠ Partial | |`,
      },
      {
        heading: 'Benefits Realised',
        content: `| Benefit | Expected | Actual | Notes |
|---|---|---|---|
| | | | |`,
      },
      {
        heading: 'Lessons Learned',
        content: `| Category | What Went Well | What to Improve | Recommendation for Future Projects |
|---|---|---|---|
| Planning | | | |
| Execution | | | |
| Stakeholder Management | | | |
| Risk Management | | | |
| Technology | | | |`,
      },
    ],
  },
  {
    cardId: 'A26',
    title: 'Benefits Realisation Register',
    description: 'Track and measure the realisation of project benefits over time.',
    sections: [
      {
        heading: 'Benefits Register',
        content: `| Benefit ID | Description | Type | Baseline | Target | Measurement Method | Owner | Realisation Date | Actual | Status |
|---|---|---|---|---|---|---|---|---|---|
| B-001 | | Financial / Efficiency / Quality | | | | | | | On Track / At Risk / Realised |`,
      },
    ],
  },
  {
    cardId: 'A27',
    title: 'Scenario Planning Template',
    description: 'Develop and analyse multiple future scenarios to stress-test project strategy.',
    sections: [
      {
        heading: 'Scenario Overview',
        content: `| Scenario | Name | Description | Probability | Key Drivers |
|---|---|---|---|---|
| 1 | Best Case | Everything goes to plan | | |
| 2 | Base Case | Most likely outcome | | |
| 3 | Worst Case | Major risks materialise | | |
| 4 | Black Swan | Unexpected disruptive event | | |`,
      },
      {
        heading: 'Scenario Impact Analysis',
        content: `| Scenario | Impact on Schedule | Impact on Budget | Impact on Scope | Response Strategy |
|---|---|---|---|---|
| Best Case | | | | |
| Base Case | | | | |
| Worst Case | | | | |`,
      },
    ],
  },
  {
    cardId: 'A28',
    title: "Kotter's 8-Step Change Plan",
    description: "Plan an organisational change initiative using Kotter's 8-step model.",
    sections: [
      {
        heading: "Kotter's 8-Step Plan",
        content: `| Step | Activity | Owner | Timeline | Status | Notes |
|---|---|---|---|---|---|
| 1. Create Urgency | Identify and communicate the burning platform | Sponsor | | ☐ | |
| 2. Form Guiding Coalition | Build a cross-functional change team | PM | | ☐ | |
| 3. Create Vision | Define the change vision and strategy | Leadership | | ☐ | |
| 4. Communicate Vision | Share vision widely and consistently | Comms | | ☐ | |
| 5. Remove Obstacles | Identify and remove barriers to change | PM | | ☐ | |
| 6. Create Short-term Wins | Plan and celebrate early wins | PM | | ☐ | |
| 7. Build on Change | Use wins to drive further change | PM | | ☐ | |
| 8. Anchor in Culture | Embed change in processes and culture | HR / Leadership | | ☐ | |`,
      },
    ],
  },
  {
    cardId: 'A29',
    title: 'Critical Chain Project Plan',
    description: 'Build a critical chain schedule with buffers to protect project completion.',
    sections: [
      {
        heading: 'Critical Chain Schedule',
        content: `| Task | Duration (50% estimate) | Dependency | Resource | Buffer Added? |
|---|---|---|---|---|
| | | | | ✓ / ✗ |`,
      },
      {
        heading: 'Buffer Management',
        content: `| Buffer Type | Location | Size | Current Consumption | RAG | Action |
|---|---|---|---|---|---|
| Project Buffer | End of critical chain | | % consumed | 🟢/🟡/🔴 | |
| Feeding Buffer | Where non-critical joins critical | | % consumed | | |
| Resource Buffer | Before critical resource | | % consumed | | |`,
      },
    ],
  },
  {
    cardId: 'A30',
    title: 'Design Thinking Workshop Plan',
    description: 'Plan a Design Thinking workshop through the five stages: Empathise, Define, Ideate, Prototype, Test.',
    sections: [
      {
        heading: 'Workshop Plan',
        content: `| Stage | Activities | Tools | Output | Duration |
|---|---|---|---|---|
| **Empathise** | User interviews, observation | Empathy maps | User insights | 60 min |
| **Define** | Synthesise insights, write HMW statements | Affinity mapping | Problem statement | 45 min |
| **Ideate** | Brainstorm, SCAMPER, crazy 8s | Sticky notes | 50+ ideas | 60 min |
| **Prototype** | Build low-fidelity prototype | Paper, wireframes | Prototype | 60 min |
| **Test** | User testing, feedback | Observation | Validated insights | 45 min |`,
      },
    ],
  },
  {
    cardId: 'A31',
    title: 'Pareto Analysis Template',
    description: 'Identify the 20% of causes responsible for 80% of problems.',
    sections: [
      {
        heading: 'Pareto Data Table',
        content: `| Cause | Frequency | % of Total | Cumulative % |
|---|---|---|---|
| Cause 1 | | | |
| Cause 2 | | | |
| Cause 3 | | | |
| Cause 4 | | | |
| Cause 5 | | | |
| **Total** | | 100% | |`,
      },
      {
        heading: 'Action Plan (Top 20% of causes)',
        content: `| Cause | Action | Owner | Due Date | Expected Impact |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A32',
    title: 'SWOT Analysis Template',
    description: 'Analyse Strengths, Weaknesses, Opportunities, and Threats for your project or organisation.',
    sections: [
      {
        heading: 'SWOT Matrix',
        content: `| | **Helpful (to achieve objective)** | **Harmful (to achieve objective)** |
|---|---|---|
| **Internal** | **Strengths** | **Weaknesses** |
| | 1. | 1. |
| | 2. | 2. |
| | 3. | 3. |
| **External** | **Opportunities** | **Threats** |
| | 1. | 1. |
| | 2. | 2. |
| | 3. | 3. |`,
      },
      {
        heading: 'Strategic Actions (TOWS)',
        content: `| Strategy | Description | Priority |
|---|---|---|
| SO (Strengths × Opportunities) | Use strengths to exploit opportunities | |
| WO (Weaknesses × Opportunities) | Overcome weaknesses to exploit opportunities | |
| ST (Strengths × Threats) | Use strengths to mitigate threats | |
| WT (Weaknesses × Threats) | Minimise weaknesses and avoid threats | |`,
      },
    ],
  },
  {
    cardId: 'A33',
    title: 'WSJF Prioritisation Template',
    description: 'Prioritise features using Weighted Shortest Job First to maximise value delivery.',
    sections: [
      {
        heading: 'WSJF Calculation',
        content: `| Feature | User-Business Value (1–10) | Time Criticality (1–10) | Risk Reduction / Opportunity (1–10) | Cost of Delay (sum) | Job Size (1–10) | WSJF (CoD / Size) | Priority Rank |
|---|---|---|---|---|---|---|---|
| Feature A | | | | | | | |
| Feature B | | | | | | | |
| Feature C | | | | | | | |`,
      },
    ],
  },
  {
    cardId: 'A34',
    title: 'Value Stream Map Template',
    description: 'Map the current state value stream to identify waste and design the future state.',
    sections: [
      {
        heading: 'Current State Map',
        content: `| Process Step | Cycle Time | Wait Time | % Complete & Accurate | Inventory | Issues / Waste |
|---|---|---|---|---|---|
| Step 1 | | | | | |
| Step 2 | | | | | |
| **Total** | | | | | |`,
      },
      {
        heading: 'Waste Identification',
        content: `| Waste Type (TIMWOODS) | Present? | Description | Improvement Idea |
|---|---|---|---|
| Transport | ✓ / ✗ | | |
| Inventory | ✓ / ✗ | | |
| Motion | ✓ / ✗ | | |
| Waiting | ✓ / ✗ | | |
| Overproduction | ✓ / ✗ | | |
| Over-processing | ✓ / ✗ | | |
| Defects | ✓ / ✗ | | |
| Skills (unused) | ✓ / ✗ | | |`,
      },
    ],
  },
  {
    cardId: 'A35',
    title: 'Timeboxing Schedule Template',
    description: 'Plan work into fixed timeboxes to create focus and protect delivery commitments.',
    sections: [
      {
        heading: 'Timebox Plan',
        content: `| Timebox | Duration | Goal | Committed Work | Owner | Status | Outcome |
|---|---|---|---|---|---|---|
| Timebox 1 | 2 weeks | | | | Active / Complete | |
| Timebox 2 | 2 weeks | | | | | |`,
      },
    ],
  },
  {
    cardId: 'A36',
    title: "Lewin's Change Management Plan",
    description: "Plan an organisational change using Lewin's Unfreeze-Change-Refreeze model.",
    sections: [
      {
        heading: 'Change Plan',
        content: `| Phase | Activities | Owner | Timeline | Success Indicators |
|---|---|---|---|---|
| **Unfreeze** | Communicate urgency, challenge current state, build readiness | Sponsor / PM | | Awareness > 80% |
| **Change** | Implement new processes, train staff, pilot changes | PM / Team | | Adoption > 60% |
| **Refreeze** | Embed in policy, reinforce behaviours, update job descriptions | HR / Leadership | | Sustained adoption > 80% |`,
      },
    ],
  },
  {
    cardId: 'A37',
    title: 'McKinsey 7S Assessment',
    description: 'Assess organisational alignment across the 7S framework to identify change impacts.',
    sections: [
      {
        heading: '7S Assessment',
        content: `| Element | Current State | Future State | Gap | Change Actions |
|---|---|---|---|---|
| **Strategy** | | | | |
| **Structure** | | | | |
| **Systems** | | | | |
| **Shared Values** | | | | |
| **Style** (Leadership) | | | | |
| **Staff** | | | | |
| **Skills** | | | | |`,
      },
    ],
  },
  {
    cardId: 'A38',
    title: 'Belbin Team Roles Profile',
    description: 'Map Belbin team roles across the project team to identify strengths and gaps.',
    sections: [
      {
        heading: 'Team Role Map',
        content: `| Team Member | Primary Belbin Role | Secondary Role | Strengths | Allowable Weaknesses |
|---|---|---|---|---|
| | Plant / Resource Investigator / Co-ordinator / Shaper / Monitor Evaluator / Teamworker / Implementer / Completer Finisher / Specialist | | | |`,
      },
      {
        heading: 'Team Balance Analysis',
        content: `| Role Category | Roles Present | Roles Missing | Impact | Action |
|---|---|---|---|---|
| Action-oriented | Shaper, Implementer, Completer Finisher | | | |
| People-oriented | Co-ordinator, Teamworker, Resource Investigator | | | |
| Thought-oriented | Plant, Monitor Evaluator, Specialist | | | |`,
      },
    ],
  },
  {
    cardId: 'A39',
    title: '5 Dysfunctions Team Assessment',
    description: "Assess your team against Lencioni's 5 Dysfunctions and plan interventions.",
    sections: [
      {
        heading: 'Dysfunction Assessment',
        content: `Rate each dysfunction 1 (Severe) to 5 (Healthy).

| Dysfunction | Score | Evidence | Intervention |
|---|---|---|---|
| **Absence of Trust** — Team members are not vulnerable with each other | | | |
| **Fear of Conflict** — Team avoids productive debate | | | |
| **Lack of Commitment** — Team members don't commit to decisions | | | |
| **Avoidance of Accountability** — Team members don't hold each other accountable | | | |
| **Inattention to Results** — Team prioritises individual goals over collective results | | | |`,
      },
    ],
  },
  {
    cardId: 'A40',
    title: 'PDCA Cycle Template',
    description: 'Apply the Plan-Do-Check-Act cycle to drive continuous improvement.',
    sections: [
      {
        heading: 'PDCA Cycle',
        content: `| Phase | Activities | Owner | Due Date | Output |
|---|---|---|---|---|
| **Plan** | Define the problem, set targets, identify root causes, plan solution | | | Action plan |
| **Do** | Implement the solution on a small scale / pilot | | | Pilot results |
| **Check** | Measure results against targets, analyse data | | | Analysis report |
| **Act** | Standardise if successful; restart cycle if not | | | Updated standard |`,
      },
      {
        heading: 'Improvement Log',
        content: `| Cycle # | Problem | Target | Solution Tested | Result | Decision |
|---|---|---|---|---|---|
| 1 | | | | | Standardise / Iterate / Abandon |`,
      },
    ],
  },
  {
    cardId: 'A41',
    title: '8D Problem Solving Report',
    description: 'A structured 8D report to resolve a critical quality or project problem.',
    sections: [
      {
        heading: '8D Report',
        content: `| Discipline | Activity | Owner | Date | Status |
|---|---|---|---|---|
| **D1 — Team** | Form a cross-functional team | | | ☐ |
| **D2 — Problem Description** | Define the problem in measurable terms | | | ☐ |
| **D3 — Interim Containment** | Implement immediate containment actions | | | ☐ |
| **D4 — Root Cause** | Identify and verify root causes (5 Whys, Fishbone) | | | ☐ |
| **D5 — Corrective Actions** | Select and verify permanent corrective actions | | | ☐ |
| **D6 — Implement** | Implement and validate corrective actions | | | ☐ |
| **D7 — Prevent Recurrence** | Update systems, processes, and standards | | | ☐ |
| **D8 — Recognise Team** | Acknowledge team contributions | | | ☐ |`,
      },
    ],
  },
  {
    cardId: 'A42',
    title: 'SCARF Model Stakeholder Assessment',
    description: 'Assess stakeholder SCARF needs to design effective engagement and communication.',
    sections: [
      {
        heading: 'SCARF Assessment',
        content: `| Stakeholder | Status Needs | Certainty Needs | Autonomy Needs | Relatedness Needs | Fairness Concerns | Engagement Approach |
|---|---|---|---|---|---|---|
| | High / Med / Low | High / Med / Low | High / Med / Low | High / Med / Low | High / Med / Low | |`,
      },
    ],
  },
  {
    cardId: 'A43',
    title: 'TKI Conflict Mode Assessment',
    description: 'Assess which conflict mode is most appropriate for a given situation.',
    sections: [
      {
        heading: 'Conflict Situation Assessment',
        content: `| Conflict | Parties | Stakes | Relationship Importance | Time Available | Recommended Mode | Rationale |
|---|---|---|---|---|---|---|
| | | High / Med / Low | High / Med / Low | Urgent / Flexible | Compete / Collaborate / Compromise / Avoid / Accommodate | |`,
      },
      {
        heading: 'TKI Mode Guide',
        content: `| Mode | Assertiveness | Cooperativeness | Best Used When |
|---|---|---|---|
| **Competing** | High | Low | Quick decision needed, stakes are high |
| **Collaborating** | High | High | Both parties' needs are important, time allows |
| **Compromising** | Medium | Medium | Temporary solution needed, equal power |
| **Avoiding** | Low | Low | Issue is trivial, emotions are high |
| **Accommodating** | Low | High | Relationship matters more than the issue |`,
      },
    ],
  },
  {
    cardId: 'A44',
    title: 'Tannenbaum-Schmidt Leadership Continuum',
    description: 'Select the appropriate leadership style on the continuum for a given situation.',
    sections: [
      {
        heading: 'Situation Assessment',
        content: `| Decision | Team Experience | Time Available | Stakes | Recommended Style | Rationale |
|---|---|---|---|---|---|
| | High / Med / Low | Urgent / Flexible | High / Med / Low | Tell / Sell / Consult / Participate / Delegate | |`,
      },
      {
        heading: 'Continuum Reference',
        content: `| Style | PM Authority | Team Freedom | Description |
|---|---|---|---|
| Tell | High | Low | PM decides and announces |
| Sell | High | Low | PM decides and persuades |
| Consult | Med | Med | PM asks for input then decides |
| Participate | Med | Med | PM and team decide together |
| Delegate | Low | High | Team decides within agreed limits |`,
      },
    ],
  },
  {
    cardId: 'A45',
    title: 'Johari Window Team Exercise',
    description: 'Use the Johari Window to build self-awareness and trust within the team.',
    sections: [
      {
        heading: 'Johari Window',
        content: `|  | **Known to Self** | **Unknown to Self** |
|---|---|---|
| **Known to Others** | **Open Arena** — Shared knowledge, strengths, working style | **Blind Spot** — Behaviours others see but you don't |
| **Unknown to Others** | **Hidden Area** — Things you know but haven't shared | **Unknown** — Undiscovered potential |`,
      },
      {
        heading: 'Development Actions',
        content: `| Quadrant | Action to Take | Owner | Timeline |
|---|---|---|---|
| Expand Open Arena | Share more about your working style and preferences | | |
| Reduce Blind Spot | Seek feedback from colleagues | | |
| Reduce Hidden Area | Share relevant personal context with the team | | |`,
      },
    ],
  },
  {
    cardId: 'A46',
    title: 'A3 Problem Solving Report',
    description: 'A one-page A3 report to define, analyse, and resolve a project problem.',
    sections: [
      {
        heading: 'A3 Report',
        content: `| Section | Content |
|---|---|
| **Background** | Why is this problem important? What is the context? |
| **Current Condition** | What is happening now? (Data, process map, metrics) |
| **Target Condition** | What should be happening? (Measurable goal) |
| **Root Cause Analysis** | Why is there a gap? (5 Whys, Fishbone) |
| **Countermeasures** | What actions will close the gap? |
| **Implementation Plan** | Who does what by when? |
| **Follow-up** | How will we verify the fix worked? |`,
      },
    ],
  },
  {
    cardId: 'A47',
    title: 'Theory of Constraints Analysis',
    description: 'Identify and exploit the system constraint to improve overall project throughput.',
    sections: [
      {
        heading: 'Constraint Identification',
        content: `| Process Step | Capacity | Demand | Utilisation % | Is This the Constraint? |
|---|---|---|---|---|
| | | | | ✓ / ✗ |`,
      },
      {
        heading: '5 Focusing Steps',
        content: `| Step | Activity | Owner | Actions Taken |
|---|---|---|---|
| 1. Identify | Find the system constraint | | |
| 2. Exploit | Get maximum output from the constraint | | |
| 3. Subordinate | Align all other processes to support the constraint | | |
| 4. Elevate | Increase the capacity of the constraint | | |
| 5. Repeat | Find the next constraint | | |`,
      },
    ],
  },
  {
    cardId: 'A48',
    title: 'Heart, Head, Hands Learning Design',
    description: 'Design a learning or change intervention addressing emotional, cognitive, and behavioural dimensions.',
    sections: [
      {
        heading: 'Learning Design Canvas',
        content: `| Dimension | Objective | Activities | Success Measure |
|---|---|---|---|
| **Heart** (Emotional — Why) | Build motivation and emotional commitment | Storytelling, case studies, personal impact | Engagement score > 80% |
| **Head** (Cognitive — What) | Build knowledge and understanding | Training, e-learning, workshops | Knowledge test > 75% |
| **Hands** (Behavioural — How) | Build practical skills | Practice, coaching, on-the-job application | Skill demonstration |`,
      },
    ],
  },
  {
    cardId: 'A50',
    title: 'Soft Systems Methodology (SSM) Rich Picture',
    description: 'Capture the messy human situation around a problem using an SSM rich picture structure.',
    sections: [
      {
        heading: 'Rich Picture Elements',
        content: `| Element | Description | Key Actors | Conflicts / Tensions |
|---|---|---|---|
| Roles | Who is involved and what do they do? | | |
| Norms | What rules, processes, and expectations exist? | | |
| Values | What do people care about? | | |
| Processes | What activities are happening? | | |
| Conflicts | Where are the tensions? | | |`,
      },
      {
        heading: 'Root Definitions (CATWOE)',
        content: `| Element | Description |
|---|---|
| **C** — Customers | Who benefits or is harmed by the system? |
| **A** — Actors | Who carries out the activities? |
| **T** — Transformation | What input is transformed into what output? |
| **W** — Weltanschauung (Worldview) | What assumption makes this transformation meaningful? |
| **O** — Owner | Who can stop the system? |
| **E** — Environment | What constraints exist outside the system? |`,
      },
    ],
  },
  {
    cardId: 'A51',
    title: 'Open Space Technology Event Plan',
    description: 'Plan a self-organising Open Space event to surface and solve complex problems.',
    sections: [
      {
        heading: 'Event Overview',
        content: `| Field | Detail |
|---|---|
| Theme / Central Question | |
| Date & Duration | |
| Location | |
| Expected Participants | |
| Facilitator | |`,
      },
      {
        heading: 'Session Log',
        content: `| Session Title | Convener | Time | Location | Participants | Key Outputs |
|---|---|---|---|---|---|
| | | | | | |`,
      },
      {
        heading: 'Proceedings Summary',
        content: `| Theme | Key Insights | Actions Agreed | Owner | Due Date |
|---|---|---|---|---|
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A52',
    title: 'DACI Decision Framework',
    description: 'Clarify who is the Driver, Approver, Contributor, and Informed for each key decision.',
    sections: [
      {
        heading: 'DACI Matrix',
        content: `| Decision | Driver (owns the process) | Approver (final say) | Contributors (input) | Informed (notified) | Deadline |
|---|---|---|---|---|---|
| | | | | | |`,
      },
      {
        heading: 'DACI Reference',
        content: `| Role | Responsibility |
|---|---|
| **D — Driver** | Owns the decision process, gathers input, drives to conclusion |
| **A — Approver** | Has final decision authority; there should be only one |
| **C — Contributor** | Provides expertise and input; no vote |
| **I — Informed** | Notified of the decision; no input required |`,
      },
    ],
  },
  {
    cardId: 'A53',
    title: 'Cynefin Framework Decision Map',
    description: 'Classify project situations into Cynefin domains to select the right management approach.',
    sections: [
      {
        heading: 'Situation Classification',
        content: `| Situation / Problem | Domain | Rationale | Recommended Approach |
|---|---|---|---|
| | Clear / Complicated / Complex / Chaotic / Confused | | |`,
      },
      {
        heading: 'Domain Reference Guide',
        content: `| Domain | Characteristics | Approach | PM Actions |
|---|---|---|---|
| **Clear** | Cause-effect obvious, best practice exists | Sense → Categorise → Respond | Apply standard process |
| **Complicated** | Cause-effect requires analysis, good practice | Sense → Analyse → Respond | Engage experts |
| **Complex** | Cause-effect only visible in retrospect, emergent | Probe → Sense → Respond | Run safe-to-fail experiments |
| **Chaotic** | No cause-effect, crisis | Act → Sense → Respond | Act decisively, stabilise |
| **Confused** | Domain unclear | Decompose into sub-problems | Break down and classify |`,
      },
    ],
  },
  {
    cardId: 'A54',
    title: 'PMBOK Process Group Checklist',
    description: 'A checklist of key activities across all five PMBOK process groups.',
    sections: [
      {
        heading: 'Process Group Checklist',
        content: `| Process Group | Key Activity | Owner | Status |
|---|---|---|---|
| **Initiating** | Develop Project Charter | PM | ☐ |
| **Initiating** | Identify Stakeholders | PM | ☐ |
| **Planning** | Develop Project Management Plan | PM | ☐ |
| **Planning** | Plan Scope, Schedule, Cost, Quality, Risk | PM | ☐ |
| **Executing** | Direct and Manage Project Work | PM | ☐ |
| **Executing** | Manage Stakeholder Engagement | PM | ☐ |
| **Monitoring & Controlling** | Monitor and Control Project Work | PM | ☐ |
| **Monitoring & Controlling** | Perform Integrated Change Control | PM | ☐ |
| **Closing** | Close Project or Phase | PM | ☐ |`,
      },
    ],
  },
  {
    cardId: 'A55',
    title: 'ADKAR Change Readiness Assessment',
    description: 'Assess individual and organisational readiness for change using the ADKAR model.',
    sections: [
      {
        heading: 'ADKAR Assessment',
        content: `Rate each element 1 (Not present) to 5 (Fully present).

| ADKAR Element | Individual Score | Team Score | Org Score | Gap Actions |
|---|---|---|---|---|
| **A — Awareness** of the need for change | | | | |
| **D — Desire** to support the change | | | | |
| **K — Knowledge** of how to change | | | | |
| **A — Ability** to implement the change | | | | |
| **R — Reinforcement** to sustain the change | | | | |`,
      },
    ],
  },
  {
    cardId: 'A56',
    title: "McClelland's Needs Motivation Profile",
    description: "Profile team members' dominant motivational needs to tailor leadership approach.",
    sections: [
      {
        heading: 'Motivation Profile',
        content: `| Team Member | Achievement Need (1–5) | Affiliation Need (1–5) | Power Need (1–5) | Dominant Need | Recommended Approach |
|---|---|---|---|---|---|
| | | | | | |`,
      },
      {
        heading: 'Motivation Strategies',
        content: `| Need | Characteristics | Effective Motivators |
|---|---|---|
| **Achievement** | Goal-oriented, likes challenge, wants feedback | Stretch goals, autonomy, regular feedback |
| **Affiliation** | Relationship-focused, collaborative, avoids conflict | Team activities, harmony, recognition |
| **Power** | Influence-seeking, competitive, leadership-oriented | Leadership roles, responsibility, influence |`,
      },
    ],
  },
  {
    cardId: 'A57',
    title: 'Probability & Impact Matrix',
    description: 'Plot risks on a probability-impact matrix to prioritise risk responses.',
    sections: [
      {
        heading: 'Risk Plot',
        content: `| Risk ID | Description | Probability (1–5) | Impact (1–5) | Score | Quadrant | Response Priority |
|---|---|---|---|---|---|---|
| R-001 | | | | | High-High / High-Low / Low-High / Low-Low | Immediate / Monitor / Accept |`,
      },
      {
        heading: 'Matrix Grid',
        content: `| | **Impact: Low (1–2)** | **Impact: Medium (3)** | **Impact: High (4–5)** |
|---|---|---|---|
| **Prob: High (4–5)** | 🟡 Medium | 🔴 High | 🔴 Critical |
| **Prob: Medium (3)** | 🟢 Low | 🟡 Medium | 🔴 High |
| **Prob: Low (1–2)** | 🟢 Negligible | 🟢 Low | 🟡 Medium |`,
      },
    ],
  },
  {
    cardId: 'A58',
    title: 'Lessons Learned Register',
    description: 'Capture, categorise, and share lessons learned throughout the project.',
    sections: [
      {
        heading: 'Lessons Learned Register',
        content: `| ID | Date | Category | Lesson Description | Impact | Root Cause | Recommendation | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| LL-001 | | Planning / Execution / Stakeholder / Risk / Technology | | Positive / Negative | | | | Documented / Shared |`,
      },
    ],
  },
  {
    cardId: 'A59',
    title: 'Virtual Brainstorming Session Plan',
    description: 'Plan and facilitate a structured virtual brainstorming session.',
    sections: [
      {
        heading: 'Session Plan',
        content: `| Field | Detail |
|---|---|
| Topic / Question | |
| Date & Time | |
| Platform | Miro / Mural / FigJam / Whiteboard |
| Facilitator | |
| Participants | |
| Duration | |`,
      },
      {
        heading: 'Agenda',
        content: `| Time | Activity | Method | Owner |
|---|---|---|---|
| 0:00 | Welcome and warm-up | Icebreaker | Facilitator |
| 0:10 | Problem framing | Share context | Facilitator |
| 0:20 | Silent idea generation | Individual sticky notes | All |
| 0:35 | Share and cluster ideas | Affinity mapping | All |
| 0:50 | Dot voting — prioritise top ideas | Voting | All |
| 1:00 | Action planning | | Facilitator |`,
      },
    ],
  },
  {
    cardId: 'A60',
    title: 'Social Contracting Workshop',
    description: 'Co-create a social contract that defines how the team will work together.',
    sections: [
      {
        heading: 'Social Contract',
        content: `| Category | Agreement | Agreed By |
|---|---|---|
| Communication | | ✓ |
| Decision Making | | ✓ |
| Conflict Resolution | | ✓ |
| Quality Standards | | ✓ |
| Availability & Hours | | ✓ |
| Respect & Inclusion | | ✓ |`,
      },
    ],
  },
  {
    cardId: 'A61',
    title: 'Visual Communications Dashboard Template',
    description: 'A one-page visual dashboard to communicate project status at a glance.',
    sections: [
      {
        heading: 'Dashboard',
        content: `| Section | Metric | Target | Actual | RAG | Trend |
|---|---|---|---|---|---|
| **Schedule** | SPI | ≥ 1.0 | | 🟢/🟡/🔴 | ↑ / → / ↓ |
| **Budget** | CPI | ≥ 1.0 | | | |
| **Scope** | Change requests open | < 3 | | | |
| **Quality** | Defects (P1) | 0 | | | |
| **Risks** | High risks open | < 5 | | | |
| **Team** | Morale score | ≥ 7/10 | | | |
| **Stakeholders** | Satisfaction score | ≥ 7/10 | | | |`,
      },
    ],
  },
  {
    cardId: 'A62',
    title: 'Requirements Traceability Matrix',
    description: 'Trace each requirement from source through design, build, and test to verify coverage.',
    sections: [
      {
        heading: 'Requirements Traceability Matrix',
        content: `| Req ID | Requirement Description | Source | Priority | Design Ref | Build Ref | Test Case ID | Test Status | Sign-off |
|---|---|---|---|---|---|---|---|---|
| REQ-001 | | Business Case | Must Have | | | TC-001 | Pass / Fail / Not Tested | ✓ / ✗ |`,
      },
    ],
  },
  {
    cardId: 'A63',
    title: 'Document Management System Automation Plan',
    description: 'Plan the automation of document management workflows to reduce manual effort.',
    sections: [
      {
        heading: 'Automation Opportunities',
        content: `| Process | Current Manual Steps | Automation Approach | Tool | Effort to Automate | Time Saved | Priority |
|---|---|---|---|---|---|---|
| Document versioning | Manual rename + email | Auto-versioning in SharePoint/Drive | SharePoint | Low | 2h/week | High |
| Review reminders | Manual calendar entries | Automated workflow notifications | Power Automate | Low | 1h/week | High |
| Approval routing | Email chain | Digital approval workflow | DocuSign / Power Automate | Med | 3h/week | High |`,
      },
    ],
  },
  {
    cardId: 'A64',
    title: 'Lightweight Governance Model',
    description: 'Design a streamlined governance model appropriate for smaller or agile projects.',
    sections: [
      {
        heading: 'Governance Structure',
        content: `| Decision Type | Who Decides | How | Frequency | Escalation |
|---|---|---|---|---|
| Day-to-day delivery | Team | Team standup | Daily | PM |
| Scope/budget < 5% | PM | PM judgement | As needed | Sponsor |
| Scope/budget > 5% | PM + Sponsor | Bi-weekly check-in | Bi-weekly | Steering |
| Strategic direction | Sponsor | Monthly review | Monthly | — |`,
      },
    ],
  },
  {
    cardId: 'A65',
    title: 'Compliance Gap Assessment',
    description: 'Identify gaps between current compliance posture and required standards.',
    sections: [
      {
        heading: 'Compliance Gap Register',
        content: `| Requirement | Standard / Regulation | Current State | Required State | Gap | Risk Level | Remediation Action | Owner | Due Date |
|---|---|---|---|---|---|---|---|---|
| | | | | | High / Med / Low | | | |`,
      },
    ],
  },
  {
    cardId: 'A66',
    title: 'Nudge Theory Intervention Design',
    description: 'Design behavioural nudges to encourage desired project behaviours without mandating them.',
    sections: [
      {
        heading: 'Nudge Design Canvas',
        content: `| Desired Behaviour | Current Behaviour | Barrier | Nudge Type | Nudge Design | Owner | Measure of Success |
|---|---|---|---|---|---|---|
| Submit timesheets on time | Late submissions | Forgetting | Reminder | Automated Friday 4pm reminder | PM | < 5% late submissions |
| Use risk register | Ad-hoc risk management | Friction | Default | Pre-populated risk register template | PM | 100% risks logged |`,
      },
      {
        heading: 'Nudge Types Reference',
        content: `| Type | Description | Example |
|---|---|---|
| Default | Make the desired option the default | Pre-ticked checkbox for weekly updates |
| Reminder | Timely prompts to trigger action | Automated deadline reminders |
| Social proof | Show what peers are doing | "90% of the team has submitted" |
| Simplification | Remove friction from desired behaviour | One-click status update |
| Feedback | Provide real-time progress information | Live dashboard showing completion % |`,
      },
    ],
  },
  {
    cardId: 'A67',
    title: 'Situational Leadership Assessment',
    description: 'Assess each team member\'s development level and select the appropriate leadership style.',
    sections: [
      {
        heading: 'Team Member Assessment',
        content: `| Team Member | Task | Competence (1–4) | Commitment (1–4) | Development Level | Leadership Style |
|---|---|---|---|---|---|
| | | | | D1 / D2 / D3 / D4 | Directing / Coaching / Supporting / Delegating |`,
      },
      {
        heading: 'Development Level Guide',
        content: `| Level | Competence | Commitment | Leadership Style |
|---|---|---|---|
| D1 | Low | High (enthusiastic beginner) | S1 — Directing (high task, low relationship) |
| D2 | Some | Low (disillusioned learner) | S2 — Coaching (high task, high relationship) |
| D3 | Moderate-High | Variable (capable but cautious) | S3 — Supporting (low task, high relationship) |
| D4 | High | High (self-reliant achiever) | S4 — Delegating (low task, low relationship) |`,
      },
    ],
  },
  {
    cardId: 'A68',
    title: "Rogers' Diffusion of Innovation — Adoption Planner",
    description: "Map your stakeholders across the adoption curve and tailor your communication strategy for each segment.",
    sections: [
      {
        heading: 'Stakeholder Adoption Mapping',
        content: `| Adopter Segment | % of Population | Characteristics | Your Stakeholders | Engagement Strategy |
|---|---|---|---|---|
| Innovators | 2.5% | Risk-tolerant, tech-savvy, visionary | | Early access, co-creation |
| Early Adopters | 13.5% | Opinion leaders, open to change | | Champions programme, case studies |
| Early Majority | 34% | Pragmatic, need proof of value | | Peer testimonials, clear ROI |
| Late Majority | 34% | Sceptical, change-resistant | | Mandates, peer pressure, simplicity |
| Laggards | 16% | Tradition-bound, last to adopt | | Minimum viable change, compliance |`,
      },
      {
        heading: 'Adoption Acceleration Actions',
        content: `**Critical Mass Target:** Reach ____% adoption by ________ (date)

**Chasm Crossing Strategy** (Early Adopters → Early Majority):
- Identify 2–3 reference customers / champion teams
- Document and publicise their success stories
- Simplify the adoption process to reduce friction

**Key Barriers to Adoption:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Mitigation Actions:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________`,
      },
    ],
  },
  {
    cardId: 'A69',
    title: "McKinsey's 3 Horizons — Portfolio Planner",
    description: "Balance your project portfolio across short-term delivery, mid-term growth, and long-term innovation.",
    sections: [
      {
        heading: '3 Horizons Portfolio Map',
        content: `| Horizon | Time Frame | Focus | Current Initiatives | Investment % | Owner |
|---|---|---|---|---|---|
| H1 — Defend & Extend | 0–12 months | Optimise core business | | | |
| H2 — Nurture & Build | 1–3 years | Emerging opportunities | | | |
| H3 — Create & Imagine | 3–5+ years | Transformational bets | | | |`,
      },
      {
        heading: 'Portfolio Balance Assessment',
        content: `**Current H1 : H2 : H3 investment split:** ___% : ___% : ___%

**Recommended split for your context:**
- Stable, mature industry: 70% : 20% : 10%
- High-growth sector: 50% : 30% : 20%
- Disrupted market: 40% : 30% : 30%

**Gaps identified:**
- Under-invested horizon: H___ — Action: _______________
- Over-invested horizon: H___ — Action: _______________

**H2 → H1 graduation criteria** (when does an H2 initiative become core?):
_______________________________________________`,
      },
    ],
  },
  {
    cardId: 'A70',
    title: "Lewin's Force Field Analysis",
    description: "Weigh driving and restraining forces to decide whether a proposed change is viable and how to tip the balance.",
    sections: [
      {
        heading: 'Force Field Diagram',
        content: `**Proposed Change:** _______________________________________________

| Driving Forces (FOR change) | Strength (1–5) | Restraining Forces (AGAINST change) | Strength (1–5) |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |
| **Total Driving Score** | | **Total Restraining Score** | |`,
      },
      {
        heading: 'Decision & Action Plan',
        content: `**Net Score** (Driving − Restraining): _______

**Viability Assessment:**
- +3 or above: Change is viable — proceed
- 0 to +2: Borderline — strengthen drivers or reduce restraints first
- Negative: Change is not viable in current conditions

**Top 3 Actions to Strengthen Driving Forces:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Top 3 Actions to Reduce Restraining Forces:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________`,
      },
    ],
  },
  {
    cardId: 'A72',
    title: 'Cultural Web Analysis',
    description: 'Map the cultural web of an organisation to understand the current culture and plan change.',
    sections: [
      {
        heading: 'Cultural Web Map',
        content: `| Element | Current State | Desired State | Change Actions |
|---|---|---|---|
| **Stories** — What stories do people tell? | | | |
| **Rituals & Routines** — What behaviours are rewarded? | | | |
| **Symbols** — What logos, offices, language signal status? | | | |
| **Power Structures** — Who has real power? | | | |
| **Organisational Structure** — How is it organised? | | | |
| **Control Systems** — What is measured and rewarded? | | | |
| **Paradigm** — Core assumptions about the organisation | | | |`,
      },
    ],
  },
  {
    cardId: 'A73',
    title: "Vroom's Expectancy Theory — Motivation Audit",
    description: "Diagnose motivation gaps in your team by assessing the three expectancy levers: effort, performance, and reward.",
    sections: [
      {
        heading: 'Team Motivation Assessment',
        content: `| Team Member | Expectancy: "My effort will lead to performance" (1–5) | Instrumentality: "Performance will lead to reward" (1–5) | Valence: "I value the reward" (1–5) | Motivation Score (E×I×V) | Action Needed |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |`,
      },
      {
        heading: 'Motivation Lever Interventions',
        content: `**Low Expectancy (effort ≠ performance):**
- Provide clearer goals and success criteria
- Offer training, coaching, or remove blockers
- Ensure workload is realistic

**Low Instrumentality (performance ≠ reward):**
- Make the reward system transparent and consistent
- Follow through on promises — close the feedback loop
- Recognise effort publicly and promptly

**Low Valence (reward not valued):**
- Have a 1:1 conversation to understand individual motivators
- Offer choice in rewards where possible (flexibility, development, recognition)
- Align project goals to personal career objectives`,
      },
    ],
  },
  {
    cardId: 'A75',
    title: 'BCG Matrix Portfolio Analysis',
    description: 'Classify projects or products in a BCG matrix to guide portfolio investment decisions.',
    sections: [
      {
        heading: 'BCG Matrix',
        content: `| Project / Product | Market Growth Rate | Relative Market Share | Quadrant | Investment Strategy |
|---|---|---|---|---|
| | High / Low | High / Low | Star / Cash Cow / Question Mark / Dog | Invest / Harvest / Divest / Hold |`,
      },
      {
        heading: 'Quadrant Reference',
        content: `| Quadrant | Growth | Share | Strategy |
|---|---|---|---|
| **Star** | High | High | Invest to maintain leadership |
| **Cash Cow** | Low | High | Harvest cash, minimal investment |
| **Question Mark** | High | Low | Invest selectively or divest |
| **Dog** | Low | Low | Divest or discontinue |`,
      },
    ],
  },
  {
    cardId: 'A76',
    title: 'TRIZ Contradiction Matrix',
    description: 'Use TRIZ to resolve technical or management contradictions in project problem-solving.',
    sections: [
      {
        heading: 'Contradiction Identification',
        content: `| Problem | Improving Parameter | Worsening Parameter | TRIZ Inventive Principles Suggested |
|---|---|---|---|
| | | | |`,
      },
      {
        heading: 'Solution Generation',
        content: `| Inventive Principle | Description | How to Apply to Our Problem |
|---|---|---|
| Segmentation | Divide an object into independent parts | |
| Taking out | Separate an interfering part | |
| Local quality | Transition from homogeneous to heterogeneous | |
| Asymmetry | Change symmetrical form to asymmetrical | |`,
      },
    ],
  },
  {
    cardId: 'A77',
    title: "Kübler-Ross Change Curve — Team Transition Tracker",
    description: "Track where each team member sits on the emotional change curve and apply targeted support to accelerate acceptance.",
    sections: [
      {
        heading: 'Team Transition Map',
        content: `| Stage | Emotional State | Signs to Watch For | Your Team Members | Support Action |
|---|---|---|---|---|
| 1. Shock | Disbelief, numbness | Silence, confusion, "this can't be right" | | Communicate clearly and early |
| 2. Denial | Resistance, minimising | "It won't affect us", business as usual | | Provide facts, repeat the message |
| 3. Frustration | Anger, blame | Complaints, low energy, absenteeism | | Listen actively, acknowledge feelings |
| 4. Depression | Low morale, withdrawal | Disengagement, reduced output | | 1:1 support, celebrate small wins |
| 5. Experiment | Tentative exploration | Testing new ways, cautious optimism | | Encourage, provide safe space to try |
| 6. Decision | Acceptance, commitment | Engagement returns, problem-solving | | Reinforce positive behaviour |
| 7. Integration | New normal | Full adoption, helping others | | Recognise champions, share stories |`,
      },
      {
        heading: 'Transition Support Plan',
        content: `**Change being managed:** _______________________________________________

**Current team distribution across stages:**
- Stages 1–3 (pre-acceptance): ___% of team
- Stage 4 (trough): ___% of team
- Stages 5–7 (moving forward): ___% of team

**Priority support actions this week:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Success indicator** (how will you know the team has reached Stage 7?):
_______________________________________________`,
      },
    ],
  },
  {
    cardId: 'A79',
    title: 'Project Closeout Checklist',
    description: 'A comprehensive project closeout checklist to formally close all project activities.',
    sections: [
      {
        heading: 'Closeout Checklist',
        content: `| Activity | Owner | Due Date | Status |
|---|---|---|---|
| Final deliverables accepted by sponsor | PM | | ☐ |
| All contracts formally closed | Procurement | | ☐ |
| Final budget reconciliation | Finance | | ☐ |
| Team members formally released | PM | | ☐ |
| Lessons learned documented | PM | | ☐ |
| Post-Implementation Review scheduled | PM | | ☐ |
| Project documentation archived | PM | | ☐ |
| System access revoked for leavers | IT | | ☐ |
| Formal sign-off obtained | Sponsor | | ☐ |
| Team celebration held | PM | | ☐ |`,
      },
    ],
  },
  {
    cardId: 'A80',
    title: 'Story Point Estimation Sheet',
    description: 'Estimate user stories using story points with Planning Poker or T-shirt sizing.',
    sections: [
      {
        heading: 'Story Point Estimates',
        content: `| Story ID | User Story | Complexity | Effort | Uncertainty | Story Points | Notes |
|---|---|---|---|---|---|---|
| US-001 | As a user, I want to... | Low / Med / High | Low / Med / High | Low / Med / High | 1 / 2 / 3 / 5 / 8 / 13 | |`,
      },
      {
        heading: 'Fibonacci Reference',
        content: `| Points | Meaning |
|---|---|
| 1 | Trivial — less than a day |
| 2 | Simple — 1–2 days |
| 3 | Small — 2–3 days |
| 5 | Medium — 3–5 days |
| 8 | Large — 1–2 weeks |
| 13 | Very large — consider splitting |
| 21+ | Too large — must be split |`,
      },
    ],
  },
  {
    cardId: 'A81',
    title: 'Net Promoter Score Survey',
    description: 'Measure stakeholder or user satisfaction using the Net Promoter Score methodology.',
    sections: [
      {
        heading: 'NPS Survey',
        content: `| Question | Scale |
|---|---|
| How likely are you to recommend this project/product/service to a colleague? | 0 (Not at all) — 10 (Extremely likely) |
| What is the primary reason for your score? | Open text |
| What one thing would most improve your experience? | Open text |`,
      },
      {
        heading: 'NPS Calculation',
        content: `| Category | Score Range | Count | % of Total |
|---|---|---|---|
| Promoters | 9–10 | | |
| Passives | 7–8 | | |
| Detractors | 0–6 | | |
| **NPS = % Promoters – % Detractors** | | | |`,
      },
      {
        heading: 'NPS Interpretation',
        content: `| NPS Score | Interpretation |
|---|---|
| > 50 | Excellent |
| 30–50 | Good |
| 0–29 | Needs improvement |
| < 0 | Critical — immediate action required |`,
      },
    ],
  },
  {
    cardId: 'A82',
    title: 'Wideband Delphi Estimation Sheet',
    description: 'Facilitate a Wideband Delphi estimation session to reach consensus on effort estimates.',
    sections: [
      {
        heading: 'Estimation Panel',
        content: `| Expert | Role | Domain Expertise |
|---|---|---|
| Expert 1 | | |
| Expert 2 | | |
| Expert 3 | | |`,
      },
      {
        heading: 'Estimation Rounds',
        content: `| Work Item | Round 1 Estimates | Outlier Discussion | Round 2 Estimates | Consensus Estimate | Confidence |
|---|---|---|---|---|---|
| | E1: E2: E3: | | E1: E2: E3: | | High / Med / Low |`,
      },
    ],
  },
  {
    cardId: 'A86',
    title: 'Sprint Retrospective Template',
    description: 'A structured retrospective to inspect and adapt team processes at the end of each sprint.',
    sections: [
      {
        heading: 'Retrospective Board',
        content: `| Category | Items | Action | Owner | Due |
|---|---|---|---|---|
| ✓ What went well | | — | — | — |
| ✗ What didn't go well | | | | |
| ▲ What to try next sprint | | | | |
| ? Questions / Confusions | | | | |`,
      },
      {
        heading: 'Action Tracker',
        content: `| Sprint | Action | Owner | Due Date | Status |
|---|---|---|---|---|
| | | | | Open / Done |`,
      },
      {
        heading: 'Team Health Pulse',
        content: `Rate each dimension 1 (Low) to 5 (High) — anonymous voting encouraged.

| Dimension | Score | Notes |
|---|---|---|
| Fun & motivation | | |
| Learning & growth | | |
| Delivery confidence | | |
| Team collaboration | | |
| Process clarity | | |`,
      },
    ],
  },
  {
    cardId: 'A87',
    title: 'Definition of Done Checklist',
    description: 'Define and apply a rigorous Definition of Done to ensure consistent quality across all user stories.',
    sections: [
      {
        heading: 'Definition of Done — Standard Criteria',
        content: `| Criterion | Applies? | Notes |
|---|---|---|
| Code reviewed by at least one peer | ✓ / ✗ | |
| Unit tests written and passing | ✓ / ✗ | |
| Integration tests passing | ✓ / ✗ | |
| Code merged to main branch | ✓ / ✗ | |
| Build pipeline passing | ✓ / ✗ | |
| Acceptance criteria verified by PO | ✓ / ✗ | |
| Documentation updated | ✓ / ✗ | |
| No open P1/P2 defects | ✓ / ✗ | |
| Deployed to staging environment | ✓ / ✗ | |`,
      },
      {
        heading: 'Story-Level DoD Verification',
        content: `| Story ID | Title | All DoD Met? | Verified By | Date |
|---|---|---|---|---|
| | | ✓ Yes / ✗ No | | |`,
      },
    ],
  },

  {
    cardId: 'A49',
    title: 'Heart, Head, Hands (3H) Change Plan',
    description: 'Design a change initiative that addresses emotional, rational, and practical dimensions simultaneously.',
    sections: [
      {
        heading: 'Change Overview',
        content: `| Field | Entry |
|---|---|
| Change Initiative | |
| Target Audience | |
| Change Lead | |
| Target Date | |`,
      },
      {
        heading: 'Heart (Emotional)',
        content: `Address the emotional why - connect the change to values, purpose, and identity.

| Stakeholder Group | Current Emotional State | Desired Emotional State | Key Messages | Activities |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Head (Rational)',
        content: `Provide the logical case - data, evidence, and clear reasoning.

| Stakeholder Group | Key Concerns | Evidence / Data to Share | Communication Channel | Owner |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Hands (Practical)',
        content: `Enable action - training, tools, and support to make the change possible.

| Capability Gap | Training / Support Needed | Format | Owner | Deadline |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A71',
    title: 'Situational Leadership Assessment',
    description: "Assess each team member's development level and select the matching leadership style using the Hersey-Blanchard model.",
    sections: [
      {
        heading: 'Team Member Assessment',
        content: `| Team Member | Task / Role | Competence (1-4) | Commitment (1-4) | Development Level | Recommended Style |
|---|---|---|---|---|---|
| | | | | D1/D2/D3/D4 | S1/S2/S3/S4 |
| | | | | D1/D2/D3/D4 | S1/S2/S3/S4 |
| | | | | D1/D2/D3/D4 | S1/S2/S3/S4 |

D1 = Enthusiastic Beginner - Style S1 Directing
D2 = Disillusioned Learner - Style S2 Coaching
D3 = Capable but Cautious - Style S3 Supporting
D4 = Self-Reliant Achiever - Style S4 Delegating`,
      },
      {
        heading: 'Leadership Actions',
        content: `| Team Member | Current Style | Planned Actions | Check-in Date | Progress |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A74',
    title: 'Cultural Web Mapping Canvas',
    description: "Map the six elements of your organisation's cultural web to understand the paradigm driving current behaviour.",
    sections: [
      {
        heading: 'Cultural Web Elements',
        content: `| Element | Current State (What exists today?) | Desired State (What needs to change?) |
|---|---|---|
| Stories (What do people talk about?) | | |
| Rituals and Routines (What behaviours are rewarded?) | | |
| Symbols (What do logos, offices, titles signal?) | | |
| Organisational Structure (Formal and informal power) | | |
| Control Systems (What is measured and rewarded?) | | |
| Power Structures (Who has real influence?) | | |`,
      },
      {
        heading: 'The Paradigm',
        content: `The central paradigm (the core assumption driving all six elements):

Current paradigm: ___

Desired paradigm: ___`,
      },
      {
        heading: 'Change Priorities',
        content: `| Element to Change | Specific Action | Owner | Timeline | Success Indicator |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A78',
    title: 'TRIZ Contradiction Matrix',
    description: 'Identify the technical or physical contradiction in your design problem and apply the relevant inventive principles.',
    sections: [
      {
        heading: 'Problem Definition',
        content: `| Field | Entry |
|---|---|
| System / Product Being Improved | |
| Desired Improvement (what you want to improve) | |
| Undesired Consequence (what gets worse) | |
| Type of Contradiction | Technical / Physical |`,
      },
      {
        heading: 'Contradiction Analysis',
        content: `Technical Contradiction (improving one parameter worsens another):

Improving parameter: ___
Worsening parameter: ___
Relevant TRIZ Inventive Principles (from matrix): ___

Physical Contradiction (same parameter must have opposite values):

Parameter must be: ___ AND ___
Separation principle to apply: Time / Space / Condition / System Level`,
      },
      {
        heading: 'Solution Concepts',
        content: `| Inventive Principle | Concept Generated | Feasibility (H/M/L) | Next Step |
|---|---|---|---|
| | | | |
| | | | |
| | | | |`,
      },
    ],
  },
  {
    cardId: 'A83',
    title: 'Pre-Mortem Analysis',
    description: 'Imagine the project has already failed and work backwards to identify the most likely causes - then prevent them.',
    sections: [
      {
        heading: 'Project Context',
        content: `| Field | Entry |
|---|---|
| Project / Initiative | |
| Pre-Mortem Date | |
| Facilitator | |
| Participants | |
| Planned Launch / Delivery Date | |`,
      },
      {
        heading: 'Failure Scenarios',
        content: `Imagine it is [delivery date + 6 months] and the project has failed completely. List every plausible reason:

| # | Failure Reason | Category (Scope/Schedule/Budget/Quality/Stakeholder/External) | Likelihood (H/M/L) |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |`,
      },
      {
        heading: 'Top Risks & Preventive Actions',
        content: `| Failure Reason | Root Cause | Preventive Action | Owner | By When |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Plan Adjustments',
        content: `Based on the pre-mortem, list specific changes to the project plan:

1. 
2. 
3. 

Review date for these adjustments: ___`,
      },
    ],
  },
  {
    cardId: 'A84',
    title: 'Kano Model Feature Prioritisation',
    description: 'Classify product features into Must-Haves, Performance, and Delighters to prioritise the backlog by customer value.',
    sections: [
      {
        heading: 'Feature Survey Results',
        content: `| Feature | Functional (if present, how do you feel?) | Dysfunctional (if absent, how do you feel?) | Category | Priority |
|---|---|---|---|---|
| | | | Must-Have / Performance / Delighter / Indifferent | |
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Kano Categories Summary',
        content: `| Category | Features | Rationale |
|---|---|---|
| Must-Have (Basic) | | Customers expect these - absence causes dissatisfaction |
| Performance (Linear) | | More = better; directly drives satisfaction |
| Delighter (Excitement) | | Unexpected; creates delight when present |
| Indifferent | | Customers do not care either way |
| Reverse | | Some customers dislike this feature |`,
      },
      {
        heading: 'Prioritised Backlog',
        content: `| Priority | Feature | Category | Rationale | Sprint / Release |
|---|---|---|---|---|
| 1 | | Must-Have | | |
| 2 | | Must-Have | | |
| 3 | | Performance | | |
| 4 | | Delighter | | |`,
      },
    ],
  },
  {
    cardId: 'A85',
    title: 'User Story Map',
    description: 'Arrange user stories on a two-axis map to reveal the full product journey and plan coherent release slices.',
    sections: [
      {
        heading: 'User Persona & Journey',
        content: `| Field | Entry |
|---|---|
| Primary Persona | |
| Persona Goal | |
| Journey Start | |
| Journey End | |`,
      },
      {
        heading: 'Story Map Backbone (Activities)',
        content: `List the high-level user activities in chronological order across the backbone:

| Activity 1 | Activity 2 | Activity 3 | Activity 4 | Activity 5 |
|---|---|---|---|---|
| e.g. Sign Up | e.g. Onboard | e.g. Use Core Feature | e.g. Manage Account | e.g. Get Support |`,
      },
      {
        heading: 'User Tasks & Stories',
        content: `| Activity | Task (Walking Skeleton) | User Story | Priority | Release |
|---|---|---|---|---|
| | | As a [user] I want [goal] so that [benefit] | Must / Should / Could | R1 / R2 / R3 |
| | | | | |
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Release Slices',
        content: `| Release | Stories Included | User Value Delivered | Target Date |
|---|---|---|---|
| Release 1 (MVP) | | Minimum viable experience | |
| Release 2 | | | |
| Release 3 | | | |`,
      },
    ],
  },

  {
    cardId: 'T21',
    title: 'AI in Project Management — Use Case Assessment',
    description: 'Evaluate which project tasks are suitable for AI augmentation and plan your implementation approach.',
    sections: [
      {
        heading: 'Project Context',
        content: `| Field | Your Entry |
|---|---|
| Project Name | |
| Project Manager | |
| Assessment Date | |
| Project Type | Predictive / Agile / Hybrid |`,
      },
      {
        heading: 'AI Use Case Inventory',
        content: `| Task / Activity | Current Manual Effort (hrs/wk) | AI Tool / Approach | Expected Benefit | Feasibility (H/M/L) | Priority |
|---|---|---|---|---|---|
| Schedule forecasting | | Predictive analytics engine | Reduce replanning time | | |
| Risk identification | | NLP-based risk scanner | Earlier detection | | |
| Status reporting | | LLM-generated summaries | Save 2 hrs/week | | |
| Resource optimisation | | AI scheduling tool | Reduce idle time | | |
| Document review | | AI document analysis | Faster compliance check | | |
| Meeting notes | | AI transcription + summary | Save admin time | | |`,
      },
      {
        heading: 'Readiness Assessment',
        content: `| Readiness Factor | Status | Gap / Action Needed |
|---|---|---|
| Data quality (clean, structured project data available) | ✅ / ❌ | |
| Team AI literacy (basic understanding of tools) | ✅ / ❌ | |
| Tool access (licences, integrations in place) | ✅ / ❌ | |
| Governance (AI usage policy exists) | ✅ / ❌ | |
| Ethical review (bias, privacy considerations done) | ✅ / ❌ | |`,
      },
      {
        heading: 'Implementation Plan',
        content: `| Use Case | Owner | Start Date | Success Metric | Review Date |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'T22',
    title: 'Predictive Analytics — Forecast Worksheet',
    description: 'Apply predictive analytics to forecast project schedule, cost, and risk outcomes.',
    sections: [
      {
        heading: 'Project Forecast Header',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Forecast Date | |
| Data Source | |
| Forecasting Method | Regression / Monte Carlo / ML Model / Trend Analysis |`,
      },
      {
        heading: 'Schedule Forecast',
        content: `| Milestone | Planned Date | Current Trend Date | Confidence Level | Corrective Action |
|---|---|---|---|---|
| | | | 80% / 90% / 95% | |
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Cost Forecast',
        content: `| Cost Element | Budget (BAC) | EAC (Forecast at Completion) | Variance | Confidence | Action |
|---|---|---|---|---|---|
| Total Project | | | | | |
| Phase 1 | | | | | |
| Phase 2 | | | | | |`,
      },
      {
        heading: 'Risk Probability Forecast',
        content: `| Risk ID | Risk Description | Historical Occurrence Rate | Predicted Probability | Impact if Occurs | Recommended Response |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |`,
      },
      {
        heading: 'Forecast Assumptions and Limitations',
        content: `Document the key assumptions underlying your forecasts and any data limitations that may affect accuracy.

| Assumption / Limitation | Impact on Forecast Reliability |
|---|---|
| | |
| | |`,
      },
    ],
  },
  {
    cardId: 'T23',
    title: 'Process Automation (RPA) Candidate Assessment',
    description: 'Identify and prioritise project management tasks suitable for robotic process automation.',
    sections: [
      {
        heading: 'Assessment Context',
        content: `| Field | Detail |
|---|---|
| Project / Function | |
| Assessor | |
| Date | |`,
      },
      {
        heading: 'Automation Candidate Scoring',
        content: `Score each criterion 1–5 (5 = most suitable for automation).

| Task Name | Rule-Based? (1–5) | High Volume? (1–5) | Stable Process? (1–5) | Digital Input? (1–5) | Total Score | Recommendation |
|---|---|---|---|---|---|---|
| Status report compilation | | | | | | |
| Timesheet reminders | | | | | | |
| Budget variance alerts | | | | | | |
| Meeting scheduling | | | | | | |
| Document routing / approvals | | | | | | |
| Risk register updates | | | | | | |`,
      },
      {
        heading: 'Business Case Summary',
        content: `| Field | Detail |
|---|---|
| Top Automation Candidate | |
| Current manual effort (hrs/month) | |
| Estimated automation savings (hrs/month) | |
| Implementation cost estimate | |
| Payback period | |
| Key risk of automating | |`,
      },
      {
        heading: 'Implementation Checklist',
        content: `| Step | Owner | Status |
|---|---|---|
| Document current process (as-is) | | ☐ |
| Validate process is stable and rule-based | | ☐ |
| Select RPA tool (UiPath, Power Automate, etc.) | | ☐ |
| Build and test automation script | | ☐ |
| Run parallel operation (manual + automated) | | ☐ |
| Decommission manual process | | ☐ |
| Monitor and maintain | | ☐ |`,
      },
    ],
  },
  {
    cardId: 'T24',
    title: 'Project Canvas',
    description: 'A single-page visual overview of the entire project — purpose, stakeholders, scope, approach, and success criteria.',
    sections: [
      {
        heading: 'Project Canvas',
        content: `Complete all nine sections. Keep each entry to 2–3 bullet points maximum.

| Section | Content |
|---|---|
| **1. Why** (Purpose / Problem) | What problem are we solving? Why does this project exist? |
| **2. Who** (Key Stakeholders) | Sponsor: Customer: Team: |
| **3. What** (Scope — In) | What is included in this project? |
| **4. What Not** (Scope — Out) | What is explicitly excluded? |
| **5. How** (Approach / Methodology) | Predictive / Agile / Hybrid. Key phases or sprints. |
| **6. When** (Timeline) | Start: End: Key milestones: |
| **7. How Much** (Budget) | Total budget: Contingency: |
| **8. Success** (Definition of Done) | How will we know the project succeeded? |
| **9. Risks** (Top 3) | 1. 2. 3. |`,
      },
      {
        heading: 'Approval and Sign-Off',
        content: `| Role | Name | Signature | Date |
|---|---|---|---|
| Project Sponsor | | | |
| Project Manager | | | |
| Key Stakeholder | | | |`,
      },
    ],
  },
  {
    cardId: 'T25',
    title: 'Critical Path Drag Analysis Worksheet',
    description: 'Calculate the drag and drag cost for each activity on the critical path to prioritise compression efforts.',
    sections: [
      {
        heading: 'Project Header',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Analysis Date | |
| Project Duration (PD) | ___ working days |
| Daily Cost of Delay | £/$ ___ per day |`,
      },
      {
        heading: 'Critical Path Activity List',
        content: `| Activity ID | Activity Name | Duration (days) | Parallel Activities on Critical Path? | Drag (days) | Drag Cost (£/$) | Compression Option |
|---|---|---|---|---|---|---|
| | | | Yes / No | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

**Drag Calculation Rules:**
- If an activity has no parallel activities: Drag = Activity Duration
- If parallel activities exist: Drag = min(Activity Duration, longest parallel activity duration)
- Drag Cost = Drag (days) × Daily Cost of Delay`,
      },
      {
        heading: 'Compression Priority Matrix',
        content: `Rank activities by drag cost to identify where schedule compression delivers the most value.

| Priority | Activity | Drag Cost | Compression Method | Estimated Cost to Compress | Net Benefit |
|---|---|---|---|---|---|
| 1 (Highest) | | | Fast-track / Crash | | |
| 2 | | | | | |
| 3 | | | | | |`,
      },
    ],
  },
  {
    cardId: 'T26',
    title: 'Drag Cost and Schedule Compression Decision',
    description: 'Use drag cost to make data-driven decisions about whether to invest in schedule compression.',
    sections: [
      {
        heading: 'Compression Decision Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Current Project Duration | ___ days |
| Target Duration | ___ days |
| Days to Compress | ___ days |
| Daily Value of Early Completion (or cost of delay) | £/$ ___ |`,
      },
      {
        heading: 'Compression Options Analysis',
        content: `| Option | Activity Affected | Days Saved | Cost to Compress | Drag Cost Eliminated | Net Benefit (Drag Cost − Compression Cost) | Recommended? |
|---|---|---|---|---|---|---|
| Fast-track Phase 2 & 3 | | | | | | Yes / No |
| Add resources to Activity X | | | | | | |
| Reduce scope of Activity Y | | | | | | |
| Outsource Activity Z | | | | | | |`,
      },
      {
        heading: 'Decision Summary',
        content: `| Field | Detail |
|---|---|
| Selected Compression Option | |
| Total Investment Required | |
| Total Drag Cost Eliminated | |
| Net Benefit | |
| Approved by | |
| Decision Date | |`,
      },
      {
        heading: 'Risk of Compression',
        content: `| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Quality reduction from fast-tracking | | | |
| Team burnout from resource loading | | | |
| Scope creep from parallel working | | | |`,
      },
    ],
  },
  {
    cardId: 'T27',
    title: 'In-Progress Postmortem (Mid-Project Retrospective)',
    description: 'Conduct a structured mid-project review to capture lessons and improve delivery before the project ends.',
    sections: [
      {
        heading: 'Session Header',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Review Date | |
| Facilitator | |
| Participants | |
| Phase / Sprint Reviewed | |`,
      },
      {
        heading: 'What Is Working Well (Keep)',
        content: `| # | Observation | Impact | Action to Reinforce |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |`,
      },
      {
        heading: 'What Is Not Working (Stop)',
        content: `| # | Observation | Root Cause | Action to Stop / Fix | Owner | By When |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |`,
      },
      {
        heading: 'What We Should Try (Start)',
        content: `| # | Proposed Experiment | Expected Benefit | Owner | By When |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |`,
      },
      {
        heading: 'Action Register',
        content: `| Action | Owner | Due Date | Status |
|---|---|---|---|
| | | | ☐ Open |
| | | | ☐ Open |`,
      },
    ],
  },
  {
    cardId: 'T28',
    title: 'Customer Talks and Tests — Feedback Capture Sheet',
    description: 'Structure customer conversations and prototype tests to gather actionable product and project feedback.',
    sections: [
      {
        heading: 'Session Header',
        content: `| Field | Detail |
|---|---|
| Session Type | Customer Interview / Usability Test / Prototype Review |
| Date | |
| Customer / Participant | |
| Product / Feature Being Tested | |
| Facilitator | |
| Observer / Note-Taker | |`,
      },
      {
        heading: 'Key Questions',
        content: `Prepare 5–7 open questions before the session. Do not lead the customer.

| # | Question | Purpose |
|---|---|---|
| 1 | Tell me about how you currently [do X]... | Understand current behaviour |
| 2 | What is the hardest part of [X] for you? | Identify pain points |
| 3 | Walk me through what you would do with this [prototype]... | Observe natural behaviour |
| 4 | What would you expect to happen when you [action]? | Identify mental model gaps |
| 5 | | |`,
      },
      {
        heading: 'Observation Log',
        content: `| Timestamp | What the Customer Said / Did | Insight / Interpretation | Priority (H/M/L) |
|---|---|---|---|
| | | | |
| | | | |
| | | | |`,
      },
      {
        heading: 'Synthesis — Key Findings',
        content: `| Finding | Evidence (Quote / Observation) | Recommended Action | Owner |
|---|---|---|---|
| | | | |
| | | | |`,
      },
    ],
  },
  {
    cardId: 'T29',
    title: 'Analogous Estimating Worksheet',
    description: 'Use historical project data to produce a top-down estimate for a new project or phase.',
    sections: [
      {
        heading: 'New Project Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Estimator | |
| Estimate Date | |
| Estimate Type | Duration / Cost / Effort |
| Confidence Level Required | ±10% / ±25% / ±50% |`,
      },
      {
        heading: 'Analogous Project Comparison',
        content: `| Attribute | Historical Project 1 | Historical Project 2 | Historical Project 3 | New Project |
|---|---|---|---|---|
| Project Name | | | | (Current) |
| Scope Complexity | Low / Med / High | | | |
| Team Size | | | | |
| Duration (weeks) | | | | |
| Total Cost (£/$) | | | | |
| Technology Similarity | High / Med / Low | | | |
| Stakeholder Complexity | | | | |
| Key Differences from New Project | | | | N/A |`,
      },
      {
        heading: 'Adjustment Factors',
        content: `| Factor | Direction | Adjustment % | Rationale |
|---|---|---|---|
| Scope is larger/smaller | +/− | | |
| Team is more/less experienced | +/− | | |
| Technology is newer/more complex | +/− | | |
| Regulatory requirements | +/− | | |
| **Net Adjustment** | | | |`,
      },
      {
        heading: 'Final Estimate',
        content: `| Metric | Historical Average | Adjusted Estimate | Range (±%) |
|---|---|---|---|
| Duration | | | |
| Cost | | | |
| Effort (person-days) | | | |`,
      },
    ],
  },
  {
    cardId: 'T30',
    title: 'Bottom-Up Estimating Worksheet',
    description: 'Build a detailed estimate by summing work package estimates from the WBS.',
    sections: [
      {
        heading: 'Estimate Header',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| WBS Version | |
| Estimator(s) | |
| Estimate Date | |
| Estimate Basis | Expert Judgement / Historical Data / Parametric |`,
      },
      {
        heading: 'Work Package Estimates',
        content: `| WBS Code | Work Package Name | Deliverable | Optimistic (O) | Most Likely (M) | Pessimistic (P) | PERT Estimate [(O+4M+P)/6] | Cost Rate (£/$/hr) | Total Cost |
|---|---|---|---|---|---|---|---|---|
| 1.1.1 | | | | | | | | |
| 1.1.2 | | | | | | | | |
| 1.2.1 | | | | | | | | |
| 1.2.2 | | | | | | | | |
| **TOTAL** | | | | | | | | |`,
      },
      {
        heading: 'Contingency Reserve',
        content: `| Risk Level | Recommended Reserve % | Reserve Amount |
|---|---|---|
| Low (well-understood scope) | 5–10% | |
| Medium (some uncertainty) | 10–20% | |
| High (novel or complex) | 20–30% | |
| **Selected Reserve** | | |`,
      },
      {
        heading: 'Estimate Summary',
        content: `| Component | Amount (£/$) |
|---|---|
| Sum of Work Package Estimates | |
| Contingency Reserve | |
| Management Reserve (if applicable) | |
| **Total Project Budget** | |`,
      },
    ],
  },
  {
    cardId: 'T31',
    title: 'Parametric Estimating Worksheet',
    description: 'Calculate estimates using unit rates and statistical relationships from historical data.',
    sections: [
      {
        heading: 'Estimate Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Estimator | |
| Date | |
| Parameter Being Estimated | Duration / Cost / Effort |`,
      },
      {
        heading: 'Parameter Identification',
        content: `| Work Element | Unit of Measure | Historical Rate (per unit) | Data Source | Quantity in This Project | Estimate |
|---|---|---|---|---|---|
| Software development | Function points | £X per FP | Previous projects | | |
| Documentation | Pages | X hrs per page | Industry benchmark | | |
| Testing | Test cases | X hrs per test case | Team data | | |
| Training delivery | Participants | £X per participant | Training dept | | |
| | | | | | |`,
      },
      {
        heading: 'Rate Validation',
        content: `| Rate Used | Source | Date of Data | Adjustment for Inflation/Complexity | Validated Rate |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Final Parametric Estimate',
        content: `| Element | Quantity | Rate | Estimate | Confidence |
|---|---|---|---|---|
| | | | | ±___% |
| | | | | |
| **Total** | | | | |`,
      },
    ],
  },
  {
    cardId: 'T32',
    title: 'Cost of Quality (CoQ) Analysis',
    description: 'Categorise and quantify quality costs to identify where prevention investment reduces total project cost.',
    sections: [
      {
        heading: 'Project Header',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Analysis Period | |
| Analyst | |
| Total Project Budget | |`,
      },
      {
        heading: 'Cost of Conformance (Prevention + Appraisal)',
        content: `| Category | Activity | Estimated Cost (£/$) | Actual Cost (£/$) |
|---|---|---|---|
| **Prevention** | Requirements review | | |
| | Design reviews | | |
| | Process documentation | | |
| | Training | | |
| | Quality planning | | |
| **Appraisal** | Testing and inspection | | |
| | Audits | | |
| | Peer reviews | | |
| **Subtotal — Conformance** | | | |`,
      },
      {
        heading: 'Cost of Non-Conformance (Internal + External Failure)',
        content: `| Category | Activity | Estimated Cost (£/$) | Actual Cost (£/$) |
|---|---|---|---|
| **Internal Failure** | Rework | | |
| | Defect fixing | | |
| | Scrap / wasted effort | | |
| **External Failure** | Customer complaints | | |
| | Warranty / support | | |
| | Reputational damage | | |
| **Subtotal — Non-Conformance** | | | |`,
      },
      {
        heading: 'CoQ Summary and Decision',
        content: `| Metric | Value |
|---|---|
| Total Cost of Conformance | |
| Total Cost of Non-Conformance | |
| **Total Cost of Quality** | |
| CoQ as % of Project Budget | |
| Recommended Investment Shift | Increase prevention by £/$ ___ to reduce failure costs by £/$ ___ |`,
      },
    ],
  },
  {
    cardId: 'T33',
    title: 'Control Chart — Process Monitoring Sheet',
    description: 'Set up and interpret a control chart to distinguish normal process variation from special cause variation.',
    sections: [
      {
        heading: 'Control Chart Setup',
        content: `| Field | Detail |
|---|---|
| Process Being Monitored | |
| Metric / Measurement | |
| Measurement Frequency | Daily / Weekly / Per Sprint |
| Baseline Data Period | |
| Number of Data Points for Baseline | Min. 20 recommended |`,
      },
      {
        heading: 'Control Limit Calculation',
        content: `| Statistic | Value |
|---|---|
| Process Mean (X̄) | |
| Standard Deviation (σ) | |
| Upper Control Limit (UCL = X̄ + 3σ) | |
| Lower Control Limit (LCL = X̄ − 3σ) | |
| Upper Specification Limit (if applicable) | |
| Lower Specification Limit (if applicable) | |`,
      },
      {
        heading: 'Data Log',
        content: `| Period | Measurement | Within Control Limits? | Special Cause Signal? | Action Taken |
|---|---|---|---|---|
| 1 | | Yes / No | Yes / No | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |`,
      },
      {
        heading: 'Special Cause Rules (Nelson Rules)',
        content: `Flag a special cause if any of these patterns appear:
| Rule | Pattern | Detected? |
|---|---|---|
| Rule 1 | One point beyond ±3σ | |
| Rule 2 | Nine consecutive points on same side of mean | |
| Rule 3 | Six consecutive points trending up or down | |
| Rule 4 | Fourteen alternating up-down points | |`,
      },
    ],
  },
  {
    cardId: 'T34',
    title: 'Schedule Compression Decision Matrix',
    description: 'Evaluate crashing and fast-tracking options to compress the schedule with minimum cost and risk.',
    sections: [
      {
        heading: 'Compression Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Current End Date | |
| Required End Date | |
| Days to Compress | |
| Reason for Compression | |`,
      },
      {
        heading: 'Fast-Tracking Options',
        content: `Fast-tracking overlaps activities that were originally sequential. Increases risk of rework.

| Activity Pair | Original Sequence | Overlap Possible? | Days Saved | Risk Introduced | Net Recommendation |
|---|---|---|---|---|---|
| Phase 2 start before Phase 1 complete | Sequential | | | Rework risk | |
| Testing starts before all dev complete | Sequential | | | Defect risk | |
| | | | | | |`,
      },
      {
        heading: 'Crashing Options',
        content: `Crashing adds resources to shorten activity duration. Increases cost.

| Activity | Current Duration | Crashed Duration | Days Saved | Additional Cost | Cost per Day Saved | Recommended? |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |`,
      },
      {
        heading: 'Decision Summary',
        content: `| Field | Detail |
|---|---|
| Selected Approach | Fast-track / Crash / Combination |
| Total Days Saved | |
| Total Additional Cost | |
| Key Risks Accepted | |
| Approved by | |`,
      },
    ],
  },
  {
    cardId: 'T35',
    title: 'Burnup Chart — Sprint / Release Tracker',
    description: 'Track completed work against total scope to visualise progress and detect scope creep.',
    sections: [
      {
        heading: 'Burnup Chart Setup',
        content: `| Field | Detail |
|---|---|
| Project / Release Name | |
| Start Date | |
| Target End Date | |
| Total Scope (story points / tasks) | |
| Velocity (average points per sprint) | |
| Projected Completion Date | |`,
      },
      {
        heading: 'Sprint-by-Sprint Data Log',
        content: `| Sprint # | Sprint End Date | Total Scope (cumulative) | Completed Work (cumulative) | Scope Added This Sprint | Scope Removed This Sprint | On Track? |
|---|---|---|---|---|---|---|
| 1 | | | | | | Yes / No |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |
| 6 | | | | | | |`,
      },
      {
        heading: 'Scope Change Log',
        content: `| Date | Change Description | Points Added / Removed | Approved by | Impact on Release Date |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Release Forecast',
        content: `| Scenario | Projected Completion Date | Assumptions |
|---|---|---|
| Current velocity maintained | | |
| Velocity increases by 10% | | |
| Scope reduced by 20% | | |`,
      },
    ],
  },
  {
    cardId: 'T36',
    title: 'Velocity Tracking and Forecasting Sheet',
    description: 'Track team velocity across sprints and use it to forecast release dates and capacity.',
    sections: [
      {
        heading: 'Team Context',
        content: `| Field | Detail |
|---|---|
| Team Name | |
| Sprint Length | ___ weeks |
| Team Size (developers) | |
| Tracking Start Date | |`,
      },
      {
        heading: 'Velocity Log',
        content: `| Sprint # | Sprint Goal | Points Committed | Points Completed | Velocity | Factors Affecting Velocity |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| **Average Velocity** | | | | | |`,
      },
      {
        heading: 'Release Forecast',
        content: `| Field | Detail |
|---|---|
| Total Remaining Story Points | |
| Average Velocity (last 3 sprints) | |
| Sprints Remaining | Total ÷ Velocity = ___ sprints |
| Projected Release Date | |
| Confidence Range | Optimistic: ___ / Pessimistic: ___ |`,
      },
      {
        heading: 'Velocity Improvement Actions',
        content: `| Issue Reducing Velocity | Root Cause | Action | Owner | Target Sprint |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'T37',
    title: 'Sprint Review Agenda and Feedback Capture',
    description: 'Structure the Sprint Review to demonstrate working software and capture stakeholder feedback effectively.',
    sections: [
      {
        heading: 'Sprint Review Header',
        content: `| Field | Detail |
|---|---|
| Project / Product Name | |
| Sprint Number | |
| Sprint End Date | |
| Facilitator (Scrum Master) | |
| Product Owner | |
| Stakeholders Invited | |`,
      },
      {
        heading: 'Sprint Summary',
        content: `| Metric | Value |
|---|---|
| Sprint Goal | |
| Points Committed | |
| Points Completed | |
| Sprint Goal Achieved? | Yes / Partially / No |
| Stories Completed | |
| Stories Not Completed (and why) | |`,
      },
      {
        heading: 'Demo Agenda',
        content: `| # | Feature / Story | Demo Owner | Time Allocated | Stakeholder Questions |
|---|---|---|---|---|
| 1 | | | 5 min | |
| 2 | | | 5 min | |
| 3 | | | 5 min | |`,
      },
      {
        heading: 'Stakeholder Feedback',
        content: `| Feedback Item | From | Type | Priority | Action / Decision |
|---|---|---|---|---|
| | | Bug / Enhancement / Question / Approval | H/M/L | |
| | | | | |
| | | | | |`,
      },
      {
        heading: 'Product Backlog Updates',
        content: `| New / Modified Item | Type | Priority | Added to Backlog? |
|---|---|---|---|
| | Story / Bug / Spike | | Yes / No |
| | | | |`,
      },
    ],
  },
  {
    cardId: 'T38',
    title: 'Multicriteria Decision Analysis (MCDA) Matrix',
    description: 'Evaluate and score multiple options against weighted criteria to make an objective, defensible decision.',
    sections: [
      {
        heading: 'Decision Context',
        content: `| Field | Detail |
|---|---|
| Decision to Be Made | |
| Decision Maker(s) | |
| Date | |
| Options Being Evaluated | List all options below |`,
      },
      {
        heading: 'Criteria Weighting',
        content: `Assign weights to each criterion (weights must total 100%).

| # | Criterion | Weight (%) | Rationale |
|---|---|---|---|
| 1 | Cost | | |
| 2 | Time to implement | | |
| 3 | Risk level | | |
| 4 | Strategic alignment | | |
| 5 | Stakeholder acceptance | | |
| 6 | Technical feasibility | | |
| **Total** | | **100%** | |`,
      },
      {
        heading: 'Scoring Matrix',
        content: `Score each option against each criterion (1 = Poor, 5 = Excellent). Multiply score × weight for weighted score.

| Criterion | Weight | Option A Score | Option A Weighted | Option B Score | Option B Weighted | Option C Score | Option C Weighted |
|---|---|---|---|---|---|---|---|
| Cost | | | | | | | |
| Time | | | | | | | |
| Risk | | | | | | | |
| Strategic fit | | | | | | | |
| Stakeholder acceptance | | | | | | | |
| Technical feasibility | | | | | | | |
| **Total Weighted Score** | | | | | | | |`,
      },
      {
        heading: 'Decision and Rationale',
        content: `| Field | Detail |
|---|---|
| Recommended Option | |
| Key Reasons | |
| Key Risks of This Decision | |
| Approved by | |`,
      },
    ],
  },
  {
    cardId: 'T39',
    title: 'TCPI (To-Complete Performance Index) Tracker',
    description: 'Calculate and monitor the TCPI to understand the efficiency required to complete the project within budget.',
    sections: [
      {
        heading: 'EVM Baseline Data',
        content: `| Field | Value |
|---|---|
| Budget at Completion (BAC) | £/$ |
| Planned Value (PV) — work scheduled to date | £/$ |
| Earned Value (EV) — work completed to date | £/$ |
| Actual Cost (AC) — money spent to date | £/$ |`,
      },
      {
        heading: 'Performance Indices',
        content: `| Index | Formula | Value | Interpretation |
|---|---|---|---|
| Cost Performance Index (CPI) | EV ÷ AC | | >1.0 = under budget |
| Schedule Performance Index (SPI) | EV ÷ PV | | >1.0 = ahead of schedule |
| Cost Variance (CV) | EV − AC | | Positive = under budget |
| Schedule Variance (SV) | EV − PV | | Positive = ahead |`,
      },
      {
        heading: 'TCPI Calculation',
        content: `| Scenario | Formula | Value | Feasibility |
|---|---|---|---|
| TCPI to complete within BAC | (BAC − EV) ÷ (BAC − AC) | | <1.1 = achievable |
| TCPI to complete within EAC | (BAC − EV) ÷ (EAC − AC) | | |

**EAC Options:**
- EAC (if current CPI continues) = BAC ÷ CPI
- EAC (if past variances are atypical) = AC + (BAC − EV)`,
      },
      {
        heading: 'Recovery Action Plan',
        content: `| If TCPI > 1.1 (recovery required) | Action | Owner | Target Date |
|---|---|---|---|
| Reduce scope | | | |
| Add resources | | | |
| Renegotiate contract / budget | | | |
| Re-baseline (with sponsor approval) | | | |`,
      },
    ],
  },
  {
    cardId: 'T40',
    title: 'Benchmarking Analysis Worksheet',
    description: 'Compare project or process performance against internal or external benchmarks to identify improvement opportunities.',
    sections: [
      {
        heading: 'Benchmarking Context',
        content: `| Field | Detail |
|---|---|
| Subject Being Benchmarked | |
| Benchmarking Type | Internal / Competitive / Functional / Generic |
| Benchmark Sources | |
| Analysis Date | |`,
      },
      {
        heading: 'Metrics Comparison',
        content: `| Metric | Our Current Performance | Best-in-Class Benchmark | Gap | Gap as % | Priority to Close |
|---|---|---|---|---|---|
| Schedule performance (SPI) | | | | | H/M/L |
| Cost performance (CPI) | | | | | |
| Defect rate | | | | | |
| Customer satisfaction score | | | | | |
| Team velocity (if agile) | | | | | |
| Time to resolve issues | | | | | |`,
      },
      {
        heading: 'Root Cause of Gaps',
        content: `| Gap | Root Cause | Contributing Factors |
|---|---|---|
| | | |
| | | |`,
      },
      {
        heading: 'Improvement Actions',
        content: `| Gap to Close | Action | Owner | Target Date | Expected Improvement |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'T41',
    title: 'Prompt List — Risk Identification Worksheet',
    description: 'Use structured prompt categories (PESTLE, TECOP, VUCA) to ensure comprehensive risk identification.',
    sections: [
      {
        heading: 'Project Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Risk Workshop Date | |
| Facilitator | |
| Participants | |`,
      },
      {
        heading: 'PESTLE Prompt List',
        content: `For each category, brainstorm risks and opportunities. Record all items — filter later.

| Category | Prompt Questions | Risks / Opportunities Identified |
|---|---|---|
| **P — Political** | Government policy changes? Regulatory shifts? Geopolitical instability? | |
| **E — Economic** | Inflation? Exchange rates? Budget constraints? Recession risk? | |
| **S — Social** | Stakeholder resistance? Cultural factors? Skills availability? | |
| **T — Technological** | Technology obsolescence? Cybersecurity? Integration risks? AI disruption? | |
| **L — Legal** | Compliance requirements? Contract risks? IP issues? | |
| **E — Environmental** | Climate risk? Sustainability requirements? Supply chain disruption? | |`,
      },
      {
        heading: 'Additional Prompts',
        content: `| Category | Prompt Questions | Risks / Opportunities Identified |
|---|---|---|
| **Scope** | Unclear requirements? Scope creep? Dependencies? | |
| **Resources** | Key person dependency? Skill gaps? Vendor reliability? | |
| **Schedule** | Critical path risks? External dependencies? | |
| **Stakeholders** | Conflicting interests? Disengaged sponsors? | |`,
      },
      {
        heading: 'Risk Register Input',
        content: `Transfer identified risks to the Risk Register (T6) for assessment and response planning.

| Risk ID | Risk Description | Category | Initial Probability | Initial Impact | Owner |
|---|---|---|---|---|---|
| R001 | | | H/M/L | H/M/L | |
| R002 | | | | | |`,
      },
    ],
  },
  {
    cardId: 'T42',
    title: 'Make-or-Buy Analysis Worksheet',
    description: 'Evaluate whether to build a capability internally or procure it externally using a structured cost-benefit framework.',
    sections: [
      {
        heading: 'Decision Context',
        content: `| Field | Detail |
|---|---|
| Item / Capability Being Evaluated | |
| Decision Owner | |
| Date | |
| Strategic Context | |`,
      },
      {
        heading: 'Make (Build Internally) Analysis',
        content: `| Factor | Assessment | Score (1–5) |
|---|---|---|
| Internal capability / expertise available | | |
| Cost to build (one-time + ongoing) | £/$ | |
| Time to build | ___ weeks | |
| Control over quality and IP | High / Medium / Low | |
| Strategic importance / core competency | High / Medium / Low | |
| Flexibility for future changes | High / Medium / Low | |
| **Total Score** | | |`,
      },
      {
        heading: 'Buy (Procure Externally) Analysis',
        content: `| Factor | Assessment | Score (1–5) |
|---|---|---|
| Market availability of suppliers | | |
| Cost to buy (licence + integration + ongoing) | £/$ | |
| Time to procure and implement | ___ weeks | |
| Vendor reliability and support | High / Medium / Low | |
| Dependency / lock-in risk | High / Medium / Low | |
| Customisation possible | High / Medium / Low | |
| **Total Score** | | |`,
      },
      {
        heading: 'Decision Summary',
        content: `| Field | Detail |
|---|---|
| Recommended Decision | Make / Buy / Hybrid |
| Key Rationale | |
| Total Cost Comparison (5-year TCO) | Make: £/$ ___ vs Buy: £/$ ___ |
| Key Risks of Decision | |
| Approved by | |`,
      },
    ],
  },
  {
    cardId: 'T43',
    title: 'AR/VR in Project Management — Use Case Planner',
    description: 'Identify and plan the use of augmented and virtual reality tools to enhance project delivery.',
    sections: [
      {
        heading: 'Project Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Project Type | Construction / Engineering / Training / Design / Other |
| AR/VR Planner | |
| Date | |`,
      },
      {
        heading: 'AR/VR Use Case Assessment',
        content: `| Use Case | AR or VR? | Applicable to This Project? | Expected Benefit | Feasibility (H/M/L) | Priority |
|---|---|---|---|---|---|
| Virtual site walkthrough / design review | VR | Yes / No | Reduce design errors | | |
| AR overlay for construction inspection | AR | Yes / No | Faster snag identification | | |
| Remote stakeholder collaboration | VR | Yes / No | Reduce travel costs | | |
| Safety training simulation | VR | Yes / No | Safer training environment | | |
| Progress visualisation (4D BIM) | AR/VR | Yes / No | Better schedule communication | | |
| Customer / client experience preview | VR | Yes / No | Improve stakeholder buy-in | | |`,
      },
      {
        heading: 'Implementation Requirements',
        content: `| Requirement | Detail | Status |
|---|---|---|
| Hardware (headsets, devices) | | ☐ Sourced |
| Software / platform | | ☐ Licenced |
| 3D model / content creation | | ☐ Planned |
| Team training | | ☐ Scheduled |
| IT infrastructure / connectivity | | ☐ Confirmed |`,
      },
      {
        heading: 'ROI Estimate',
        content: `| Benefit | Estimated Value (£/$) | Confidence |
|---|---|---|
| Reduced rework from earlier design review | | |
| Travel cost savings | | |
| Training cost reduction | | |
| **Total Estimated Benefit** | | |
| **Implementation Cost** | | |
| **Estimated ROI** | | |`,
      },
    ],
  },

// === ADVANCED TECHNIQUES: A88–A93 ===

  {
    cardId: 'A88',
    title: 'PMBOK 8 Principles — Self-Assessment',
    description: 'Assess how well your project applies each of the six PMBOK 8 principles and identify improvement actions.',
    sections: [
      {
        heading: 'Assessment Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Assessor | |
| Date | |
| Project Phase | |`,
      },
      {
        heading: 'Principles Self-Assessment',
        content: `Rate your project's application of each principle: 1 = Not applied, 3 = Partially applied, 5 = Fully applied.

| # | PMBOK 8 Principle | Rating (1–5) | Evidence / Examples | Gap / Improvement Action |
|---|---|---|---|---|
| 1 | **Be a Diligent, Respectful, and Caring Steward** — Act with integrity, care for people, finances, and environment | | | |
| 2 | **Create a Collaborative Project Team Environment** — Build a high-performing team through trust, inclusion, and shared ownership | | | |
| 3 | **Effectively Engage with Stakeholders** — Proactively involve stakeholders to understand needs and manage expectations | | | |
| 4 | **Focus on Value** — Continuously evaluate and align work to deliver the intended benefits | | | |
| 5 | **Recognise, Evaluate, and Respond to System Interactions** — Understand the project as part of a larger system and manage interdependencies | | | |
| 6 | **Demonstrate Leadership Behaviours** — Motivate, influence, and adapt leadership style to context | | | |`,
      },
      {
        heading: 'Priority Improvement Actions',
        content: `| Principle | Improvement Action | Owner | By When |
|---|---|---|---|
| | | | |
| | | | |
| | | | |`,
      },
    ],
  },
  {
    cardId: 'A89',
    title: 'Sustainability in Project Management — ESG Impact Assessment',
    description: 'Assess and plan the environmental, social, and governance impacts of your project.',
    sections: [
      {
        heading: 'Project ESG Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Project Manager | |
| Date | |
| Organisational ESG Commitments | |`,
      },
      {
        heading: 'Environmental Impact Assessment',
        content: `| Environmental Factor | Current Project Impact | Mitigation / Enhancement Action | Owner | Target |
|---|---|---|---|---|
| Carbon emissions (travel, energy, materials) | High / Medium / Low | | | |
| Waste generation | | | | |
| Resource consumption (water, materials) | | | | |
| Biodiversity / land use | | | | |
| Supply chain environmental risk | | | | |`,
      },
      {
        heading: 'Social Impact Assessment',
        content: `| Social Factor | Current Project Impact | Mitigation / Enhancement Action | Owner | Target |
|---|---|---|---|---|
| Community impact (local employment, disruption) | | | | |
| Diversity and inclusion in team | | | | |
| Health and safety | | | | |
| Stakeholder wellbeing | | | | |
| Human rights in supply chain | | | | |`,
      },
      {
        heading: 'Governance Assessment',
        content: `| Governance Factor | Status | Action Needed |
|---|---|---|
| Ethical decision-making processes in place | ✅ / ❌ | |
| Transparency in reporting | ✅ / ❌ | |
| Anti-corruption and compliance controls | ✅ / ❌ | |
| Stakeholder accountability mechanisms | ✅ / ❌ | |`,
      },
      {
        heading: 'ESG Commitments and KPIs',
        content: `| ESG Commitment | KPI | Baseline | Target | Reporting Frequency |
|---|---|---|---|---|
| | | | | |
| | | | | |`,
      },
    ],
  },
  {
    cardId: 'A90',
    title: 'VRIO Framework — Resource and Capability Analysis',
    description: 'Apply the VRIO framework to identify which organisational resources and capabilities create sustainable competitive advantage.',
    sections: [
      {
        heading: 'Analysis Context',
        content: `| Field | Detail |
|---|---|
| Organisation / Business Unit | |
| Analyst | |
| Date | |
| Strategic Question | What capabilities should we build or protect? |`,
      },
      {
        heading: 'VRIO Assessment Matrix',
        content: `For each resource or capability, answer V, R, I, O with Yes/No.

| Resource / Capability | Valuable? (V) | Rare? (R) | Inimitable? (I) | Organised to Exploit? (O) | Competitive Implication | Priority Action |
|---|---|---|---|---|---|---|
| | | | | | Disadvantage / Parity / Temporary Advantage / Sustained Advantage | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

**Interpretation:**
- V=No → Competitive Disadvantage
- V=Yes, R=No → Competitive Parity
- V=Yes, R=Yes, I=No → Temporary Competitive Advantage
- V=Yes, R=Yes, I=Yes, O=No → Unexploited Advantage
- V=Yes, R=Yes, I=Yes, O=Yes → Sustained Competitive Advantage`,
      },
      {
        heading: 'Strategic Implications',
        content: `| Capability | VRIO Result | Strategic Action | Investment Required | Priority |
|---|---|---|---|---|
| | Sustained Advantage | Protect and leverage | | High |
| | Temporary Advantage | Build imitability barriers | | |
| | Competitive Parity | Maintain or divest | | |`,
      },
    ],
  },
  {
    cardId: 'A91',
    title: 'Genetic Algorithm — Schedule Optimisation Worksheet',
    description: 'Apply genetic algorithm principles to optimise complex project schedules with multiple constraints.',
    sections: [
      {
        heading: 'Optimisation Problem Definition',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Optimisation Objective | Minimise duration / Minimise cost / Maximise resource utilisation |
| Number of Activities | |
| Number of Resources | |
| Key Constraints | |`,
      },
      {
        heading: 'Constraint Definition',
        content: `| Constraint Type | Description | Hard or Soft? |
|---|---|---|
| Resource availability | | Hard |
| Precedence relationships | | Hard |
| Budget limit | | Hard |
| Preferred working hours | | Soft |
| Skill requirements | | Hard |
| | | |`,
      },
      {
        heading: 'Fitness Function Definition',
        content: `Define how to score each potential schedule (higher = better).

| Objective | Weight (%) | Measurement |
|---|---|---|
| Total project duration | | Days (lower = better) |
| Total project cost | | £/$ (lower = better) |
| Resource utilisation | | % (higher = better) |
| Risk score | | (lower = better) |
| **Total** | **100%** | |`,
      },
      {
        heading: 'Algorithm Configuration (for software tool)',
        content: `| Parameter | Value | Notes |
|---|---|---|
| Population size | 50–200 | Larger = more thorough but slower |
| Number of generations | 100–500 | More = better optimisation |
| Crossover rate | 0.7–0.9 | Probability of combining two solutions |
| Mutation rate | 0.01–0.1 | Probability of random change |
| Selection method | Tournament / Roulette | |`,
      },
      {
        heading: 'Results Comparison',
        content: `| Solution | Duration | Cost | Resource Utilisation | Risk Score | Fitness Score | Selected? |
|---|---|---|---|---|---|---|
| Baseline (current plan) | | | | | | |
| GA Solution 1 | | | | | | |
| GA Solution 2 | | | | | | |
| GA Solution 3 | | | | | Yes / No | |`,
      },
    ],
  },
  {
    cardId: 'A92',
    title: 'Six Thinking Hats — Structured Decision Session',
    description: 'Facilitate a Six Thinking Hats session to explore a decision or problem from six distinct perspectives.',
    sections: [
      {
        heading: 'Session Setup',
        content: `| Field | Detail |
|---|---|
| Topic / Decision | |
| Facilitator | |
| Date | |
| Participants | |
| Session Duration | 60–90 minutes recommended |`,
      },
      {
        heading: 'Six Hats Sequence',
        content: `Recommended sequence for decision-making: Blue → White → Green → Yellow → Black → Red → Blue.

| Hat | Colour | Focus | Time | Key Questions | Outputs / Notes |
|---|---|---|---|---|---|
| **Blue Hat** | 🔵 Blue | Process and control | 5 min | What is the goal? What process will we use? | |
| **White Hat** | ⚪ White | Facts and data | 10 min | What do we know? What data do we need? | |
| **Green Hat** | 🟢 Green | Creativity and alternatives | 15 min | What new ideas can we generate? What if...? | |
| **Yellow Hat** | 🟡 Yellow | Optimism and benefits | 10 min | What are the benefits? What is the best case? | |
| **Black Hat** | ⚫ Black | Caution and risks | 10 min | What could go wrong? What are the weaknesses? | |
| **Red Hat** | 🔴 Red | Emotions and intuition | 5 min | What is your gut feeling? What concerns you? | |
| **Blue Hat** | 🔵 Blue | Summary and decision | 5 min | What have we decided? What are next steps? | |`,
      },
      {
        heading: 'Decision Output',
        content: `| Field | Detail |
|---|---|
| Decision Made | |
| Key Benefits Identified | |
| Key Risks to Mitigate | |
| Dissenting Views Noted | |
| Next Steps | |
| Owner | |`,
      },
    ],
  },
  {
    cardId: 'A93',
    title: 'COCOMO Estimation Model Worksheet',
    description: 'Apply the Constructive Cost Model (COCOMO) to estimate software project effort, duration, and team size.',
    sections: [
      {
        heading: 'Project Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Estimator | |
| Date | |
| COCOMO Model Type | Basic / Intermediate / Detailed |
| Software Category | Organic / Semi-Detached / Embedded |`,
      },
      {
        heading: 'Size Estimation — Input',
        content: `| Method | Value | Notes |
|---|---|---|
| Estimated Lines of Code (KLOC) | | 1 KLOC = 1,000 lines |
| Function Points (if using FP method) | | |
| Conversion to KLOC (if using FP) | FP × language factor | |`,
      },
      {
        heading: 'Language Conversion Factors',
        content: `Approximate lines of code per function point by language.

| Language | Lines of Code per Function Point |
|---|---|
| Java / C# | ~53 |
| Python | ~33 |
| JavaScript | ~47 |
| C++ | ~55 |`,
      },
      {
        heading: 'COCOMO Coefficients by Project Type',
        content: `| Software Category | Effort Coefficient (a) | Effort Exponent (b) | Duration Coefficient (c) | Duration Exponent (d) |
|---|---|---|---|---|
| Organic (small, familiar) | 2.4 | 1.05 | 2.5 | 0.38 |
| Semi-Detached (medium, mixed) | 3.0 | 1.12 | 2.5 | 0.35 |
| Embedded (large, complex) | 3.6 | 1.20 | 2.5 | 0.32 |`,
      },
      {
        heading: 'Calculation Formulas',
        content: `- Effort (person-months) = a × (KLOC)^b
- Duration (months) = c × (Effort)^d
- Team Size = Effort ÷ Duration`,
      },
      {
        heading: 'Estimation Results',
        content: `| Metric | Calculation | Result |
|---|---|---|
| Estimated Effort (person-months) | a × KLOC^b | |
| Estimated Duration (months) | c × Effort^d | |
| Recommended Team Size | Effort ÷ Duration | |`,
      },
      {
        heading: 'Cost Calculation',
        content: `| Field | Value |
|---|---|
| Average Monthly Cost per Person (£/$) | |
| Total Effort (person-months) | |
| **Estimated Total Cost** | |
| Contingency Reserve (15–25%) | |
| **Total Budget Estimate** | |`,
      },
    ],
  },

// === PEOPLE DECK: people-19–people-21 ===

  {
    cardId: 'people-19',
    title: 'Cultural Intelligence (CQ) Team Assessment',
    description: 'Assess and develop cultural intelligence across your project team to improve cross-cultural collaboration.',
    sections: [
      {
        heading: 'Team Context',
        content: `| Field | Detail |
|---|---|
| Project Name | |
| Team Composition (nationalities / backgrounds) | |
| Facilitator | |
| Date | |`,
      },
      {
        heading: 'CQ Self-Assessment (Individual)',
        content: `Each team member rates themselves on each CQ dimension (1 = Low, 5 = High).

| CQ Dimension | Description | Self-Rating (1–5) | Evidence / Example |
|---|---|---|---|
| **CQ Drive** | Motivation and confidence to work across cultures | | |
| **CQ Knowledge** | Understanding of cultural differences (values, norms, practices) | | |
| **CQ Strategy** | Ability to plan and adapt in cross-cultural situations | | |
| **CQ Action** | Ability to adapt verbal and non-verbal behaviour across cultures | | |`,
      },
      {
        heading: 'Team Cultural Inventory',
        content: `| Team Member | Cultural Background | Communication Style | Decision-Making Style | Conflict Style | Key Strengths | Development Area |
|---|---|---|---|---|---|---|
| | | Direct / Indirect | Hierarchical / Consensus | Confrontational / Avoidant | | |
| | | | | | | |
| | | | | | | |`,
      },
      {
        heading: 'Cultural Risk and Mitigation',
        content: `| Cultural Risk | Potential Impact | Mitigation Strategy | Owner |
|---|---|---|---|
| Language barriers in written communication | Misunderstandings in requirements | Use plain language + visual aids | |
| Different attitudes to hierarchy | Junior members not raising issues | Explicitly invite all voices | |
| Different time zone working norms | Delayed responses | Agree core overlap hours | |
| | | | |`,
      },
      {
        heading: 'Team Development Actions',
        content: `| Action | Purpose | Owner | By When |
|---|---|---|---|
| Cultural awareness workshop | Build shared understanding | | |
| Buddy system across cultures | Build relationships | | |
| Communication protocol agreement | Reduce misunderstandings | | |`,
      },
    ],
  },
  {
    cardId: 'people-20',
    title: 'Green HRM — Sustainable Team Practices Planner',
    description: 'Plan and implement environmentally sustainable human resource practices across the project team.',
    sections: [
      {
        heading: 'Context',
        content: `| Field | Detail |
|---|---|
| Project / Organisation | |
| Green HRM Lead | |
| Date | |
| Organisational Sustainability Goals | |`,
      },
      {
        heading: 'Green HRM Practice Assessment',
        content: `| Practice Area | Current State | Target State | Gap | Priority |
|---|---|---|---|---|
| **Recruitment** — Attract sustainability-minded talent; green employer branding | | | | H/M/L |
| **Training** — Environmental awareness, green skills development | | | | |
| **Performance Management** — Include sustainability KPIs in appraisals | | | | |
| **Rewards** — Recognise and incentivise green behaviours | | | | |
| **Working Practices** — Remote work, paperless processes, green travel policy | | | | |
| **Wellbeing** — Biophilic workplace, mental health, work-life balance | | | | |`,
      },
      {
        heading: 'Green Behaviours Action Plan',
        content: `| Green Behaviour to Encourage | Initiative | Owner | Target Date | Measurement |
|---|---|---|---|---|
| Reduce business travel | Video-first policy | | | Travel cost / CO2 |
| Paperless project management | Digital-only documentation | | | Paper usage |
| Energy-conscious working | Flexible hours to reduce peak demand | | | Energy bills |
| | | | | |`,
      },
      {
        heading: 'Green KPIs',
        content: `| KPI | Baseline | Target | Reporting Frequency |
|---|---|---|---|
| Business travel CO2 (tonnes/year) | | | Quarterly |
| Paper consumption (reams/month) | | | Monthly |
| Remote working days (% of total) | | | Monthly |
| Team sustainability training completion | | 100% | Annual |`,
      },
    ],
  },
  {
    cardId: 'people-21',
    title: 'Storytelling in Project Management — Narrative Planner',
    description: 'Craft compelling project narratives to engage stakeholders, communicate change, and drive action.',
    sections: [
      {
        heading: 'Story Context',
        content: `| Field | Detail |
|---|---|
| Story Purpose | Stakeholder buy-in / Change communication / Status update / Lessons learned |
| Audience | |
| Key Message (one sentence) | |
| Desired Outcome | What should the audience think, feel, or do after hearing this story? |`,
      },
      {
        heading: 'Story Structure (Hero\'s Journey Framework)',
        content: `| Story Element | Your Content |
|---|---|
| **The World Before** — Set the scene. What was the situation before this project? | |
| **The Challenge** — What problem or opportunity triggered this project? | |
| **The Hero** — Who is the protagonist? (Could be the team, a customer, or the organisation) | |
| **The Journey** — What obstacles were overcome? What did the team learn? | |
| **The Transformation** — What changed as a result of the project? | |
| **The Call to Action** — What do you want the audience to do next? | |`,
      },
      {
        heading: 'Stakeholder-Specific Narrative Adaptation',
        content: `| Stakeholder Group | What They Care About | Key Story Angle | Tone | Format |
|---|---|---|---|---|
| Executive Sponsor | ROI, strategic alignment | Business impact | Formal, concise | 2-min verbal + 1-slide |
| Project Team | Recognition, purpose | Team achievement | Warm, celebratory | Team meeting story |
| End Users | How it affects them | Personal benefit | Empathetic | Case study / testimonial |
| Board / Governance | Risk, compliance | Accountability | Factual | Written report |`,
      },
      {
        heading: 'Story Quality Checklist',
        content: `| Criterion | ✅ / ❌ | Notes |
|---|---|---|
| Opens with a hook (surprising fact, question, or vivid scene) | | |
| Has a clear protagonist the audience can identify with | | |
| Includes specific, concrete details (not vague generalities) | | |
| Shows emotion or human impact | | |
| Has a clear, single key message | | |
| Ends with a specific call to action | | |
| Length is appropriate for the audience and format | | |`,
      },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// MASTER EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_TEMPLATES: CardTemplate[] = [
  ...phaseTemplates,
  ...archetypeTemplates,
  ...methodologyTemplates,
  ...peopleTemplates,
  ...processTemplates,
  ...businessTemplates,
  ...toolTemplates,
  ...techniqueTemplates,
];

export function getTemplateByCardId(cardId: string): CardTemplate | undefined {
  return ALL_TEMPLATES.find(t => t.cardId === cardId);
}
