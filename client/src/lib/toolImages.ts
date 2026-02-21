// PMO Toolkit Navigator — Visual Reference diagrams
// Maps card IDs to CDN image URLs shown as "Visual Reference" in CardDetail

export const TOOL_IMAGES: Record<string, { url: string; caption: string }> = {

  // ─── PROJECT PHASES ────────────────────────────────────────────────────────
  'phase-setup': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/fyxggZtPrYvhQrUq.png',
    caption: 'Project Initiation Flow — from defining objectives through stakeholder identification, feasibility assessment, and sponsor approval to an approved Project Charter.',
  },
  'phase-execution': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/GXngRGaUjJVVOCoB.png',
    caption: 'Execution & Monitor-Control Loop — six concurrent activities (track progress, manage risks, control scope, report status, manage stakeholders, lead team) feeding into the central execute-and-monitor cycle.',
  },
  'phase-closure': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/CfNGRdVboFBbWqAu.png',
    caption: 'Project Closure Checklist — eight closure actions from deliverable acceptance and lessons learned through contract closure, resource release, and team celebration.',
  },

  // ─── ARCHETYPING GUIDE ─────────────────────────────────────────────────────
  AG1: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/cOTaJhgRFoUzoPED.png',
    caption: 'AG1 Project Complexity Self-Assessment — rate your project across five dimensions (stakeholder complexity, technical uncertainty, organisational change, regulatory constraints, team distribution) to determine overall complexity level.',
  },
  AG2: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/gYXGQaBVKJKpXZOe.png',
    caption: 'AG2 Methodology Selection Matrix — a 2×2 grid mapping uncertainty vs. governance level to the most appropriate delivery approach: Waterfall, Agile/Scrum, PRINCE2/PMI, or Hybrid.',
  },
  AG3: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/etUxiEvHxvUSqLhm.png',
    caption: 'AG3 Team & Stakeholder Archetype Radar — compare current state vs. ideal across six dimensions: sponsor engagement, team maturity, stakeholder alignment, change readiness, risk tolerance, and resource availability.',
  },

  // ─── METHODOLOGIES ─────────────────────────────────────────────────────────
  M1: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/LCPGZXmqcxUHQUNu.png',
    caption: 'M1 Waterfall Methodology — sequential cascade of phases: Requirements → Design → Development → Testing → Deployment → Maintenance. Each phase completes before the next begins.',
  },
  M2: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/UYcVglOkpMVpdUAy.png',
    caption: 'M2 Agile/Scrum Sprint Cycle — iterative loop of Sprint Planning, Daily Standup, Sprint Review, Sprint Retrospective, and Backlog Refinement, driven by the Product Backlog.',
  },
  M3: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/CsqhdAhsnaSeCdVT.png',
    caption: 'M3 Kanban Board — four-column workflow (Backlog → In Progress → Review → Done) with WIP limits to prevent bottlenecks and maintain flow.',
  },
  M4: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/GLWlNSeGILqUXCTw.png',
    caption: 'M4 Hybrid Methodology — Waterfall governance (Initiation → Closure) wrapping three Agile delivery sprints, combining structured oversight with iterative execution.',
  },

  // ─── PEOPLE DOMAIN ─────────────────────────────────────────────────────────
  'people-1': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/joFVLWglKrOEuDNh.png',
    caption: 'P01 Conflict Resolution Modes — Thomas-Kilmann model mapping five conflict styles (Collaborate, Compete, Accommodate, Avoid, Compromise) on assertiveness vs. cooperativeness axes.',
  },
  'people-2': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/hlfZNIgBOqrgVNTz.png',
    caption: "P02 Tuckman's Team Development Stages — five progressive stages (Forming → Storming → Norming → Performing → Adjourning) shown as ascending bars reflecting growing team capability.",
  },
  'people-8': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/kTEZFYDYxqsZnnOi.png',
    caption: 'P08 Negotiation Preparation Framework — five-step process: Clarify Interests → Know Your BATNA → Set ZOPA → Prepare Options → Agree & Document.',
  },

  // ─── PROCESS DOMAIN ────────────────────────────────────────────────────────
  'process-1': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/nOLsrybylEFSWDXL.png',
    caption: 'PR01 Scope Management Process — six sequential steps: Plan Scope → Collect Requirements → Define Scope → Create WBS → Validate Scope → Control Scope.',
  },
  'process-5': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/RGPeOVnwcJbNsYOR.png',
    caption: 'PR05 Risk Management Cycle — six-step iterative loop: Identify → Qualitative Analysis → Quantitative Analysis → Plan Responses → Implement Responses → Monitor Risks.',
  },
  'process-14': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/tPdUWhhIRjACfCpG.png',
    caption: 'PR14 Governance Framework — hierarchical pyramid from Steering Committee at the top through PMO, Project Manager, Work Package Owners, to Team Members. Authority flows top-down; accountability flows bottom-up.',
  },

  // ─── BUSINESS ENVIRONMENT ──────────────────────────────────────────────────
  'business-1': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/JlfVOFBPgagEItPH.png',
    caption: 'BE1 PESTLE Analysis — six-factor external environment scan: Political, Economic, Social, Technological, Legal, Environmental.',
  },
  'business-2': {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/bFiaGziSFwPEiPNY.png',
    caption: 'BE2 SWOT Analysis — 2×2 matrix of internal Strengths & Weaknesses vs. external Opportunities & Threats, with example items in each quadrant.',
  },

  // ─── TOOLS DECK (T1–T17) ───────────────────────────────────────────────────
  T1: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/KqQaIPXAZEiOLZHq.png',
    caption: 'Gantt Chart — visual timeline showing tasks, durations, and dependencies across project phases.',
  },
  T2: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/kbwYzpXfjLATzPVf.png',
    caption: 'Kanban Board — three-column workflow (To Do → In Progress → Done) with WIP limits.',
  },
  T3: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/WKXesVWeqIQTgMUR.png',
    caption: 'Work Breakdown Structure (WBS) — hierarchical decomposition of deliverables into manageable tasks.',
  },
  T4: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/zTiROVhuEgRFvtOj.png',
    caption: 'Earned Value Management (EVM) — PV vs EV vs AC curves showing schedule and cost performance.',
  },
  T5: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/nYUOxirbRBMlmegk.png',
    caption: 'RACI Matrix — Responsible, Accountable, Consulted, Informed assignments per task and role.',
  },
  T6: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/KVyQJNkcynnBTiMk.png',
    caption: 'Risk Register — log of risks rated by probability and impact, with owners and mitigation plans.',
  },
  T7: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/WvENiKXTUySqXYKE.png',
    caption: "MoSCoW Prioritisation — Must Have, Should Have, Could Have, and Won't Have categories.",
  },
  T8: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/sZqMVVlMVtOCfLqs.png',
    caption: 'Fishbone (Ishikawa) Diagram — cause-and-effect analysis across Methods, Materials, Machines, Manpower, Measurement, and Environment.',
  },
  T9: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/NgqpigseHRtFjtzj.png',
    caption: 'Monte Carlo Simulation — probability distributions for cost and duration across 1,000 iterations.',
  },
  T10: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/MQMnrWddmivLfdiG.png',
    caption: 'Decision Tree Analysis — branching paths with probabilities and expected value outcomes.',
  },
  T11: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/uoaLVkgUykbCQyWL.png',
    caption: 'Balanced Scorecard — KPIs across Financial, Customer, Internal Process, and Learning & Growth perspectives.',
  },
  T12: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/QsMktCvOrvnwJsjy.png',
    caption: 'Delphi Technique — iterative anonymous expert consensus cycle from question definition to convergence.',
  },
  T13: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/BacdoXXeEAjqJMrJ.png',
    caption: 'Cost-Benefit Analysis — comparing total costs vs. total benefits to determine net value.',
  },
  T14: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/JJqRUnVyqidssjnl.png',
    caption: 'Project Scope Statement — objectives, in-scope/out-of-scope items, constraints, and assumptions.',
  },
  T15: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/VQGXtLvVGpPbSkDk.png',
    caption: 'Force Field Analysis — driving forces vs. restraining forces for a proposed change.',
  },
  T16: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/FmeoIjfNDKGQKePG.png',
    caption: 'Stakeholder Matrix — power/interest grid for tailoring engagement strategies per stakeholder.',
  },
  T17: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/GexJFOWQKagjXowv.png',
    caption: 'Burndown Chart — remaining story points vs. time, comparing actual vs. ideal burn rate.',
  },

  // ─── ADVANCED TECHNIQUES ───────────────────────────────────────────────────
  A2: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/wnoCfMCNHhqUylrn.png',
    caption: "Tuckman's Ladder — team performance curve showing the dip at Storming and rise through Norming to peak performance, with Adjourning at close.",
  },
  A8: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/LISScExBfTCdvDvt.png',
    caption: "ZOPA & BATNA Negotiation Map — number line showing Buyer's BATNA (walk-away max price), Seller's BATNA (walk-away min price), and the Zone of Possible Agreement (ZOPA) between them.",
  },
  A21: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/LRUVPgpzfTOiVweP.png',
    caption: 'Six Sigma DMAIC Cycle — five sequential phases: Define → Measure → Analyse → Improve → Control, each with specific objectives and outputs.',
  },
  A29: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/WkwnkjboJAdQJxQc.png',
    caption: '5 Whys Root Cause Drill-Down — iterative questioning from surface problem through five levels of "Why?" to identify the true root cause and assign a process owner.',
  },
  A35: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/RAfZMZaAaMrnIvPT.png',
    caption: "Kotter's 8-Step Change Model — sequential steps from creating urgency through forming a coalition, communicating vision, removing obstacles, celebrating wins, and anchoring change in culture.",
  },
  A36: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/tPrUjgouHokHVcfN.png',
    caption: 'Critical Chain PM (CCPM) — critical chain tasks with project buffer at the end, plus a feeding chain with its own feeding buffer merging into the critical chain.',
  },
  A60: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/HlIVJOSgMOevEmBm.png',
    caption: 'TKI Conflict Mode Instrument — five conflict-handling modes (Collaborate, Compete, Accommodate, Avoid, Compromise) mapped on assertiveness vs. cooperativeness axes.',
  },
  A75: {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/ZailnucEuRRUAZAc.png',
    caption: 'ADKAR® Change Management Model (Prosci®) — five building blocks of individual change: Awareness → Desire → Knowledge → Ability → Reinforcement.',
  },
};
