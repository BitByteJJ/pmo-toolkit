// AI Suggest endpoint — takes a problem statement and returns ranked PMO card recommendations
// Uses the Manus built-in LLM API (OpenAI-compatible)

import type { IncomingMessage, ServerResponse } from 'http';

// Compact card catalogue for the LLM prompt (id, title, tagline, whenToUse, tags)
const CARD_CATALOGUE = [
  // PROJECT PHASES
  { id: 'phase-setup', code: 'Phase 1', title: 'Project Setup', tagline: 'Build a solid foundation before you launch', whenToUse: 'At the very start of any project, before committing resources or beginning execution work.', tags: ['setup', 'planning', 'scope', 'risk', 'stakeholders'] },
  { id: 'phase-execution', code: 'Phase 2', title: 'Project Execution', tagline: 'Maintain momentum through disciplined delivery', whenToUse: 'Once the project is set up and approved, throughout the active delivery period.', tags: ['execution', 'tracking', 'communication', 'change management'] },
  { id: 'phase-closure', code: 'Phase 3', title: 'Project Closure', tagline: 'Close with confidence and capture lessons learned', whenToUse: 'When all deliverables have been completed and accepted by the sponsor.', tags: ['closure', 'lessons learned', 'handover', 'benefits'] },
  // METHODOLOGIES
  { id: 'M1', code: 'M1', title: 'Waterfall', tagline: 'Sequential delivery for stable, well-defined projects', whenToUse: 'When requirements are fixed, well-understood, and unlikely to change.', tags: ['waterfall', 'sequential', 'methodology', 'planning'] },
  { id: 'M2', code: 'M2', title: 'Agile', tagline: 'Iterative delivery for evolving requirements', whenToUse: 'When requirements are uncertain or likely to evolve, and rapid feedback is valuable.', tags: ['agile', 'iterative', 'sprints', 'flexibility'] },
  { id: 'M3', code: 'M3', title: 'Kanban', tagline: 'Flow-based delivery for continuous work', whenToUse: 'For ongoing operational work or support teams where tasks arrive continuously.', tags: ['kanban', 'flow', 'wip', 'continuous delivery'] },
  { id: 'M4', code: 'M4', title: 'Hybrid', tagline: 'Blend Waterfall and Agile for complex programmes', whenToUse: 'When different parts of a project have different levels of certainty.', tags: ['hybrid', 'agile', 'waterfall', 'programme'] },
  // TOOLS
  { id: 'T1', code: 'T1', title: 'Gantt Chart', tagline: 'A visual timeline showing tasks, durations, and dependencies', whenToUse: 'When you need to plan, schedule, and track project tasks over time.', tags: ['scheduling', 'timeline', 'planning', 'dependencies'] },
  { id: 'T2', code: 'T2', title: 'Kanban Board', tagline: 'Visual task management with columns and WIP limits', whenToUse: 'To visualise workflow, limit work-in-progress, and identify bottlenecks.', tags: ['kanban', 'workflow', 'visualisation', 'wip'] },
  { id: 'T3', code: 'T3', title: 'Work Breakdown Structure', tagline: 'Decompose deliverables into manageable tasks', whenToUse: 'When planning a project and needing to break scope into assignable work packages.', tags: ['wbs', 'scope', 'decomposition', 'planning'] },
  { id: 'T4', code: 'T4', title: 'Earned Value Management', tagline: 'Measure performance by comparing planned vs. actual cost', whenToUse: 'To objectively measure project performance and forecast completion cost and date.', tags: ['evm', 'cost', 'performance', 'forecasting'] },
  { id: 'T5', code: 'T5', title: 'RACI Matrix', tagline: 'Clarify who is Responsible, Accountable, Consulted, Informed', whenToUse: 'When roles and responsibilities are unclear or overlapping.', tags: ['raci', 'roles', 'accountability', 'governance'] },
  { id: 'T6', code: 'T6', title: 'Risk Register', tagline: 'Central log of risks with mitigation and contingency plans', whenToUse: 'Throughout the project lifecycle to identify, assess, and manage risks.', tags: ['risk', 'mitigation', 'register', 'contingency'] },
  { id: 'T7', code: 'T7', title: 'MoSCoW Prioritisation', tagline: 'Must, Should, Could, Won\'t — focus on what matters most', whenToUse: 'When scope needs to be prioritised and trade-offs must be made.', tags: ['prioritisation', 'scope', 'moscow', 'requirements'] },
  { id: 'T8', code: 'T8', title: 'Fishbone Diagram', tagline: 'Trace defects to their root causes across categories', whenToUse: 'When investigating the root cause of a problem or defect.', tags: ['root cause', 'fishbone', 'ishikawa', 'quality'] },
  { id: 'T9', code: 'T9', title: 'Monte Carlo Simulation', tagline: 'Model thousands of scenarios to predict cost and time ranges', whenToUse: 'When you need probabilistic forecasts for schedule or cost.', tags: ['monte carlo', 'simulation', 'risk', 'forecasting'] },
  { id: 'T10', code: 'T10', title: 'Decision Tree Analysis', tagline: 'Evaluate decision paths, probabilities, and expected outcomes', whenToUse: 'When facing complex decisions with multiple uncertain outcomes.', tags: ['decision', 'analysis', 'probability', 'options'] },
  { id: 'T11', code: 'T11', title: 'Balanced Scorecard', tagline: 'Measure performance across four perspectives holistically', whenToUse: 'When you need a strategic performance management framework beyond financials.', tags: ['balanced scorecard', 'kpi', 'strategy', 'performance'] },
  { id: 'T12', code: 'T12', title: 'Delphi Technique', tagline: 'Anonymous expert consensus without groupthink', whenToUse: 'When you need expert consensus on uncertain estimates or decisions.', tags: ['delphi', 'consensus', 'estimation', 'expert'] },
  { id: 'T13', code: 'T13', title: 'Cost-Benefit Analysis', tagline: 'Compare total costs to total benefits for go/no-go decisions', whenToUse: 'Before committing to a project or major investment decision.', tags: ['cost benefit', 'roi', 'investment', 'decision'] },
  { id: 'T14', code: 'T14', title: 'Project Scope Statement', tagline: 'Define what\'s in and what\'s out — prevent scope creep', whenToUse: 'At project initiation to establish clear boundaries.', tags: ['scope', 'scope creep', 'boundaries', 'definition'] },
  { id: 'T15', code: 'T15', title: 'Force Field Analysis', tagline: 'Weigh driving forces against restraining forces for change', whenToUse: 'When planning a change and needing to identify what supports or blocks it.', tags: ['change', 'force field', 'lewin', 'analysis'] },
  { id: 'T16', code: 'T16', title: 'Stakeholder Matrix', tagline: 'Map power vs. interest to tailor your engagement strategy', whenToUse: 'At project start and whenever the stakeholder landscape changes.', tags: ['stakeholders', 'engagement', 'power interest', 'communication'] },
  { id: 'T17', code: 'T17', title: 'Burndown Chart', tagline: 'Track remaining work vs. time in each sprint', whenToUse: 'In Agile projects to visualise sprint progress and forecast completion.', tags: ['burndown', 'agile', 'sprint', 'velocity'] },
  // TECHNIQUES (A1-A82 — key selection)
  { id: 'A1', code: 'A1', title: 'Principled Negotiation', tagline: 'Focus on interests, not positions, for win-win outcomes', whenToUse: 'When negotiating with vendors, stakeholders, or team members.', tags: ['negotiation', 'conflict', 'interests', 'win-win'] },
  { id: 'A2', code: 'A2', title: 'Tuckman\'s Ladder', tagline: 'Guide teams through Forming, Storming, Norming, Performing', whenToUse: 'When building a new team or diagnosing team performance issues.', tags: ['team development', 'forming storming', 'team dynamics'] },
  { id: 'A3', code: 'A3', title: 'Performance Gap Analysis', tagline: 'Identify the gap between current and desired performance', whenToUse: 'When diagnosing why a team or process is underperforming.', tags: ['performance', 'gap analysis', 'improvement'] },
  { id: 'A5', code: 'A5', title: 'Knowledge Transfer Matrix', tagline: 'Map who knows what and ensure critical knowledge is shared', whenToUse: 'When key people are leaving or knowledge silos are a risk.', tags: ['knowledge', 'transfer', 'succession', 'silos'] },
  { id: 'A7', code: 'A7', title: 'Kaizen Blitz', tagline: 'Rapid focused improvement sprint to fix a specific problem', whenToUse: 'When a specific process needs rapid improvement in a short timeframe.', tags: ['kaizen', 'improvement', 'lean', 'rapid'] },
  { id: 'A8', code: 'A8', title: 'ZOPA & BATNA', tagline: 'Know your walk-away point before entering any negotiation', whenToUse: 'Before any significant negotiation with vendors, clients, or partners.', tags: ['negotiation', 'batna', 'zopa', 'contracts'] },
  { id: 'A9', code: 'A9', title: 'Co-Creation Workshops', tagline: 'Design solutions together with stakeholders', whenToUse: 'When stakeholder buy-in is critical and solutions need shared ownership.', tags: ['workshop', 'co-creation', 'stakeholders', 'collaboration'] },
  { id: 'A12', code: 'A12', title: 'Empathy Mapping', tagline: 'Understand what users think, feel, say, and do', whenToUse: 'When designing solutions and needing to understand user needs deeply.', tags: ['empathy', 'user research', 'design thinking', 'ux'] },
  { id: 'A13', code: 'A13', title: 'Lean Startup Pilot', tagline: 'Test assumptions with a minimum viable product', whenToUse: 'When validating a new idea or product before full investment.', tags: ['mvp', 'lean startup', 'validation', 'pilot'] },
  { id: 'A14', code: 'A14', title: 'Quantitative Risk Analysis', tagline: 'Assign numbers to risks for objective prioritisation', whenToUse: 'When you need to prioritise risks objectively using data.', tags: ['risk', 'quantitative', 'analysis', 'probability'] },
  { id: 'A15', code: 'A15', title: 'Stakeholder Engagement Matrix', tagline: 'Track and shift stakeholder engagement levels', whenToUse: 'When managing complex stakeholder landscapes with varying levels of support.', tags: ['stakeholders', 'engagement', 'communication', 'change'] },
  { id: 'A20', code: 'A20', title: 'Integrated Change Control', tagline: 'Formal workflow to evaluate and approve all project changes', whenToUse: 'When managing scope changes to prevent uncontrolled scope creep.', tags: ['change control', 'scope', 'governance', 'approval'] },
  { id: 'A22', code: 'A22', title: 'Agile-Waterfall Hybrid Mapping', tagline: 'Show how sprint outputs feed into formal Waterfall gates', whenToUse: 'When running hybrid projects that mix Agile and Waterfall elements.', tags: ['hybrid', 'agile', 'waterfall', 'gates'] },
  { id: 'A23', code: 'A23', title: 'Root Cause Analysis (5 Whys)', tagline: 'Ask "Why?" five times to find the real root cause', whenToUse: 'When a problem recurs and the surface fix isn\'t working.', tags: ['root cause', '5 whys', 'problem solving', 'quality'] },
  { id: 'A25', code: 'A25', title: 'Post-Implementation Review', tagline: 'Compare actual outcomes to objectives and capture lessons', whenToUse: 'After project completion to capture lessons and measure success.', tags: ['lessons learned', 'review', 'closure', 'retrospective'] },
  { id: 'A26', code: 'A26', title: 'Benefits Realisation Management', tagline: 'Track whether promised benefits are actually delivered', whenToUse: 'When projects are justified by business benefits that need to be tracked post-delivery.', tags: ['benefits', 'roi', 'value', 'measurement'] },
  { id: 'A27', code: 'A27', title: 'Scenario Planning', tagline: 'Prepare for multiple futures before they happen', whenToUse: 'When facing high uncertainty about future conditions.', tags: ['scenario', 'planning', 'uncertainty', 'strategy'] },
  { id: 'A28', code: 'A28', title: 'Kotter\'s 8-Step Model', tagline: 'Eight steps to embed large-scale organisational change', whenToUse: 'When leading significant organisational change programmes.', tags: ['change management', 'kotter', 'transformation', 'adoption'] },
  { id: 'A29', code: 'A29', title: 'Critical Chain PM (CCPM)', tagline: 'Resource-aware scheduling with strategic buffers', whenToUse: 'When resource contention is the primary scheduling constraint.', tags: ['critical chain', 'scheduling', 'buffers', 'resources'] },
  { id: 'A30', code: 'A30', title: 'Design Thinking', tagline: 'Empathise, Define, Ideate, Prototype, Test — user-first innovation', whenToUse: 'When solving complex problems that require a human-centred approach.', tags: ['design thinking', 'innovation', 'user', 'prototype'] },
  { id: 'A31', code: 'A31', title: 'Pareto Analysis', tagline: '80% of problems come from 20% of causes — find that 20%', whenToUse: 'When you need to focus effort on the highest-impact issues.', tags: ['pareto', '80/20', 'prioritisation', 'analysis'] },
  { id: 'A32', code: 'A32', title: 'SWOT Analysis', tagline: 'Strengths, Weaknesses, Opportunities, Threats — strategic clarity', whenToUse: 'When assessing a project, product, or organisation strategically.', tags: ['swot', 'strategy', 'analysis', 'planning'] },
  { id: 'A33', code: 'A33', title: 'Weighted Shortest Job First (WSJF)', tagline: 'Prioritise tasks by value delivered per unit of effort', whenToUse: 'In Agile/SAFe environments when prioritising the backlog.', tags: ['wsjf', 'prioritisation', 'agile', 'safe', 'backlog'] },
  { id: 'A34', code: 'A34', title: 'Value Stream Mapping', tagline: 'Map the entire flow from request to delivery — find the waste', whenToUse: 'When optimising a process end-to-end to eliminate waste.', tags: ['value stream', 'lean', 'waste', 'process improvement'] },
  { id: 'A35', code: 'A35', title: 'Timeboxing', tagline: 'Fix the time, flex the scope — prevent perfectionism', whenToUse: 'When teams are prone to over-engineering or perfectionism.', tags: ['timeboxing', 'agile', 'scope', 'time management'] },
  { id: 'A36', code: 'A36', title: 'Lewin\'s 3-Step Model', tagline: 'Unfreeze, Change, Refreeze — make change stick', whenToUse: 'When implementing change and needing a simple framework for adoption.', tags: ['change management', 'lewin', 'unfreeze', 'adoption'] },
  { id: 'A37', code: 'A37', title: 'McKinsey 7S Framework', tagline: 'Align seven organisational elements for strategic success', whenToUse: 'When diagnosing organisational alignment issues.', tags: ['mckinsey', '7s', 'organisation', 'alignment', 'strategy'] },
  { id: 'A38', code: 'A38', title: 'Belbin Team Roles', tagline: 'Balance nine natural team roles for high performance', whenToUse: 'When building or improving team composition.', tags: ['belbin', 'team roles', 'team building', 'performance'] },
  { id: 'A39', code: 'A39', title: '5 Dysfunctions of a Team', tagline: 'Address the five root causes of team failure', whenToUse: 'When a team is underperforming or experiencing trust issues.', tags: ['team', 'dysfunction', 'trust', 'lencioni'] },
  { id: 'A40', code: 'A40', title: 'PDCA Cycle', tagline: 'Plan, Do, Check, Act — continuous improvement in four steps', whenToUse: 'For any continuous improvement initiative.', tags: ['pdca', 'continuous improvement', 'quality', 'deming'] },
  { id: 'A41', code: 'A41', title: '8D Problem Solving', tagline: 'Eight disciplines for thorough, permanent problem resolution', whenToUse: 'When a serious problem needs a structured, permanent fix.', tags: ['8d', 'problem solving', 'quality', 'root cause'] },
  { id: 'A42', code: 'A42', title: 'SCARF Model', tagline: 'Address five social needs that drive human behaviour', whenToUse: 'When managing change, conflict, or motivation challenges.', tags: ['scarf', 'neuroscience', 'motivation', 'change', 'behaviour'] },
  { id: 'A43', code: 'A43', title: 'TKI Conflict Modes', tagline: 'Understand five conflict styles to resolve disputes effectively', whenToUse: 'When managing team conflict or stakeholder disputes.', tags: ['conflict', 'tki', 'resolution', 'styles'] },
  { id: 'A47', code: 'A47', title: 'Theory of Constraints (TOC)', tagline: 'Find and fix the one bottleneck limiting your whole system', whenToUse: 'When a single constraint is limiting overall system throughput.', tags: ['theory of constraints', 'bottleneck', 'throughput', 'goldratt'] },
  { id: 'A53', code: 'A53', title: 'Cynefin Framework', tagline: 'Match your decision approach to the complexity of the situation', whenToUse: 'When deciding how to approach a problem based on its complexity.', tags: ['cynefin', 'complexity', 'decision making', 'framework'] },
  { id: 'A55', code: 'A55', title: 'ADKAR® Model', tagline: 'Drive individual change through five building blocks', whenToUse: 'When managing change and needing to track individual adoption.', tags: ['adkar', 'change management', 'adoption', 'prosci'] },
  { id: 'A57', code: 'A57', title: 'Probability & Impact Matrix', tagline: 'Rank risks by likelihood and consequence', whenToUse: 'When prioritising risks for response planning.', tags: ['risk', 'probability', 'impact', 'matrix'] },
  { id: 'A58', code: 'A58', title: 'Lessons Learned', tagline: 'Capture what worked, what didn\'t, and what to do differently', whenToUse: 'At project milestones and closure to capture institutional knowledge.', tags: ['lessons learned', 'retrospective', 'knowledge', 'improvement'] },
  { id: 'A62', code: 'A62', title: 'Requirements Traceability Matrix', tagline: 'Link requirements to deliverables and tests end-to-end', whenToUse: 'When managing complex requirements that must be tracked through delivery.', tags: ['requirements', 'traceability', 'testing', 'scope'] },
  { id: 'A64', code: 'A64', title: 'Lightweight Governance Model', tagline: 'Right-size governance to avoid bureaucracy without losing control', whenToUse: 'When governance is either too heavy or too light for the project.', tags: ['governance', 'lightweight', 'control', 'oversight'] },
  { id: 'A66', code: 'A66', title: 'Nudge Theory', tagline: 'Design choices that guide behaviour without mandating it', whenToUse: 'When trying to influence team or stakeholder behaviour subtly.', tags: ['nudge', 'behaviour', 'influence', 'psychology'] },
  { id: 'A70', code: 'A70', title: 'Lewin\'s Force Field Analysis', tagline: 'Identify forces driving and restraining change', whenToUse: 'When planning change and needing to understand resistance.', tags: ['force field', 'change', 'resistance', 'lewin'] },
  { id: 'A71', code: 'A71', title: 'Hersey-Blanchard Situational Leadership', tagline: 'Adapt your leadership style to each team member\'s maturity', whenToUse: 'When leading a diverse team with varying skill and motivation levels.', tags: ['situational leadership', 'coaching', 'delegation', 'maturity'] },
  // PEOPLE DOMAIN
  { id: 'PD1', code: 'PD1', title: 'Build a Team', tagline: 'Assemble the right people with the right skills', whenToUse: 'At project start when forming the project team.', tags: ['team building', 'recruitment', 'skills', 'people'] },
  { id: 'PD2', code: 'PD2', title: 'Define Team Roles', tagline: 'Clarify who does what to prevent confusion and gaps', whenToUse: 'When roles and responsibilities are unclear.', tags: ['roles', 'responsibilities', 'raci', 'clarity'] },
  { id: 'PD3', code: 'PD3', title: 'Empower the Team', tagline: 'Give the team authority to make decisions and own outcomes', whenToUse: 'When team members are disengaged or overly dependent on the PM.', tags: ['empowerment', 'autonomy', 'motivation', 'delegation'] },
  { id: 'PD4', code: 'PD4', title: 'Manage Conflict', tagline: 'Address disagreements constructively before they escalate', whenToUse: 'When interpersonal or team conflicts arise.', tags: ['conflict', 'resolution', 'mediation', 'team'] },
  { id: 'PD5', code: 'PD5', title: 'Collaborate with Stakeholders', tagline: 'Build trust and alignment with all project stakeholders', whenToUse: 'Throughout the project to maintain stakeholder engagement.', tags: ['stakeholders', 'collaboration', 'trust', 'engagement'] },
  { id: 'PD6', code: 'PD6', title: 'Mentor & Coach', tagline: 'Develop team capability through guidance and feedback', whenToUse: 'When team members need skill development or confidence building.', tags: ['mentoring', 'coaching', 'development', 'feedback'] },
  { id: 'PD7', code: 'PD7', title: 'Support Performance', tagline: 'Identify and remove obstacles blocking team performance', whenToUse: 'When team performance is below expectations.', tags: ['performance', 'support', 'obstacles', 'improvement'] },
  { id: 'PD8', code: 'PD8', title: 'Communicate Effectively', tagline: 'Tailor messages to the right audience at the right time', whenToUse: 'Throughout the project to keep all parties informed.', tags: ['communication', 'stakeholders', 'reporting', 'messaging'] },
  { id: 'PD9', code: 'PD9', title: 'Lead the Team', tagline: 'Inspire, direct, and motivate the team toward project goals', whenToUse: 'Throughout the project lifecycle as the team leader.', tags: ['leadership', 'motivation', 'direction', 'vision'] },
  { id: 'PD10', code: 'PD10', title: 'Manage Virtual Teams', tagline: 'Keep distributed teams connected, aligned, and productive', whenToUse: 'When managing teams across different locations or time zones.', tags: ['virtual', 'remote', 'distributed', 'collaboration'] },
  { id: 'PD11', code: 'PD11', title: 'Manage Stakeholder Engagement', tagline: 'Actively manage stakeholder expectations and involvement', whenToUse: 'When stakeholders have conflicting interests or varying levels of support.', tags: ['stakeholders', 'engagement', 'expectations', 'influence'] },
  { id: 'PD12', code: 'PD12', title: 'Manage Conflict (Advanced)', tagline: 'Apply advanced techniques for complex interpersonal disputes', whenToUse: 'When standard conflict resolution approaches have failed.', tags: ['conflict', 'advanced', 'mediation', 'resolution'] },
  { id: 'PD13', code: 'PD13', title: 'Negotiate Agreements', tagline: 'Reach mutually beneficial agreements with all parties', whenToUse: 'When formal or informal agreements need to be reached.', tags: ['negotiation', 'agreements', 'contracts', 'win-win'] },
  { id: 'PD14', code: 'PD14', title: 'Collaborate Across Boundaries', tagline: 'Work effectively across departments, cultures, and organisations', whenToUse: 'When projects span multiple organisations or cultural contexts.', tags: ['cross-functional', 'culture', 'collaboration', 'boundaries'] },
  // PROCESS DOMAIN
  { id: 'PR1', code: 'PR1', title: 'Execute Project Work', tagline: 'Deliver project outputs through disciplined execution', whenToUse: 'During the execution phase to deliver project work.', tags: ['execution', 'delivery', 'work', 'outputs'] },
  { id: 'PR2', code: 'PR2', title: 'Manage Scope', tagline: 'Control what\'s in and out to prevent scope creep', whenToUse: 'Throughout the project to prevent uncontrolled scope growth.', tags: ['scope', 'scope creep', 'control', 'change'] },
  { id: 'PR3', code: 'PR3', title: 'Manage Quality', tagline: 'Ensure deliverables meet agreed quality standards', whenToUse: 'Throughout delivery to maintain quality standards.', tags: ['quality', 'standards', 'testing', 'assurance'] },
  { id: 'PR4', code: 'PR4', title: 'Manage Risk', tagline: 'Identify, assess, and respond to project risks proactively', whenToUse: 'Throughout the project to manage threats and opportunities.', tags: ['risk', 'management', 'mitigation', 'contingency'] },
  { id: 'PR5', code: 'PR5', title: 'Manage Issues', tagline: 'Resolve problems quickly before they become crises', whenToUse: 'When problems arise during project execution.', tags: ['issues', 'resolution', 'escalation', 'problem solving'] },
  { id: 'PR6', code: 'PR6', title: 'Manage Schedule', tagline: 'Keep the project on track against the baseline plan', whenToUse: 'Throughout execution to monitor and control the schedule.', tags: ['schedule', 'timeline', 'tracking', 'baseline'] },
  { id: 'PR7', code: 'PR7', title: 'Manage Budget', tagline: 'Control costs and forecast financial performance', whenToUse: 'Throughout the project to manage financial performance.', tags: ['budget', 'cost', 'financial', 'forecasting'] },
  { id: 'PR8', code: 'PR8', title: 'Manage Resources', tagline: 'Allocate and optimise people, equipment, and materials', whenToUse: 'When resource constraints are affecting project delivery.', tags: ['resources', 'allocation', 'capacity', 'people'] },
  { id: 'PR9', code: 'PR9', title: 'Manage Procurement', tagline: 'Source and manage vendors, contracts, and suppliers', whenToUse: 'When the project requires external suppliers or contractors.', tags: ['procurement', 'vendors', 'contracts', 'suppliers'] },
  { id: 'PR10', code: 'PR10', title: 'Manage Communications', tagline: 'Plan and execute a structured communication strategy', whenToUse: 'Throughout the project to keep all stakeholders informed.', tags: ['communications', 'plan', 'reporting', 'stakeholders'] },
  { id: 'PR11', code: 'PR11', title: 'Manage Change', tagline: 'Control changes through a formal change management process', whenToUse: 'When change requests arise during project execution.', tags: ['change', 'control', 'requests', 'governance'] },
  { id: 'PR12', code: 'PR12', title: 'Manage Knowledge', tagline: 'Capture and share project knowledge across the organisation', whenToUse: 'Throughout the project to prevent knowledge loss.', tags: ['knowledge', 'documentation', 'sharing', 'lessons'] },
  { id: 'PR13', code: 'PR13', title: 'Manage Benefits', tagline: 'Track and realise the business benefits the project was funded to deliver', whenToUse: 'From project approval through post-delivery to ensure benefits are realised.', tags: ['benefits', 'value', 'roi', 'realisation'] },
  { id: 'PR14', code: 'PR14', title: 'Manage Governance', tagline: 'Maintain appropriate oversight and decision-making structures', whenToUse: 'Throughout the project to ensure proper governance.', tags: ['governance', 'oversight', 'decisions', 'accountability'] },
  { id: 'PR15', code: 'PR15', title: 'Manage Stakeholders', tagline: 'Identify, analyse, and engage all project stakeholders', whenToUse: 'From project start to maintain stakeholder alignment.', tags: ['stakeholders', 'engagement', 'analysis', 'communication'] },
  { id: 'PR16', code: 'PR16', title: 'Manage Lessons Learned', tagline: 'Capture and apply lessons throughout the project', whenToUse: 'At milestones and project closure.', tags: ['lessons learned', 'retrospective', 'improvement', 'knowledge'] },
  { id: 'PR17', code: 'PR17', title: 'Close the Project', tagline: 'Formally close the project and hand over to operations', whenToUse: 'When all deliverables are complete and accepted.', tags: ['closure', 'handover', 'sign-off', 'completion'] },
  // BUSINESS ENVIRONMENT
  { id: 'BE1', code: 'BE1', title: 'Manage Compliance', tagline: 'Ensure the project meets all regulatory and legal requirements', whenToUse: 'When the project operates in a regulated environment.', tags: ['compliance', 'regulatory', 'legal', 'governance'] },
  { id: 'BE2', code: 'BE2', title: 'Evaluate External Environment', tagline: 'Assess how external factors affect the project', whenToUse: 'During planning and when external conditions change.', tags: ['external', 'pestle', 'environment', 'analysis'] },
  { id: 'BE3', code: 'BE3', title: 'Manage Organisational Change', tagline: 'Prepare the organisation for the changes the project will bring', whenToUse: 'When the project will significantly change how people work.', tags: ['change management', 'organisation', 'transformation', 'adoption'] },
  { id: 'BE4', code: 'BE4', title: 'Deliver Business Value', tagline: 'Ensure the project delivers measurable value to the organisation', whenToUse: 'Throughout the project to maintain focus on business outcomes.', tags: ['value', 'business', 'outcomes', 'benefits'] },
  // PMBOK 8 NEW TOOLS (T21–T43)
  { id: 'T21', code: 'T21', title: 'AI in Project Management', tagline: 'Leverage artificial intelligence to automate, predict, and optimise project work', whenToUse: 'When seeking to improve forecasting, automate reporting, or enhance decision-making with data.', tags: ['AI', 'machine learning', 'automation', 'forecasting', 'PMBOK 8'] },
  { id: 'T22', code: 'T22', title: 'Predictive Analytics', tagline: 'Use historical data and statistical models to forecast project outcomes', whenToUse: 'When you need to forecast schedule, cost, or risk outcomes based on historical data patterns.', tags: ['predictive analytics', 'forecasting', 'data', 'statistics', 'PMBOK 8'] },
  { id: 'T23', code: 'T23', title: 'Process Automations (RPA)', tagline: 'Automate repetitive project management tasks using robotic process automation', whenToUse: 'When repetitive administrative tasks consume significant team time and can be standardised.', tags: ['RPA', 'automation', 'efficiency', 'process', 'PMBOK 8'] },
  { id: 'T24', code: 'T24', title: 'Project Canvas', tagline: 'Capture the full project on a single visual page for rapid alignment', whenToUse: 'At project initiation or when stakeholders need a concise visual overview of the project.', tags: ['project canvas', 'visual', 'alignment', 'initiation', 'PMBOK 8'] },
  { id: 'T25', code: 'T25', title: 'Critical Path Drag', tagline: 'Measure how much each critical path activity is slowing down the project', whenToUse: 'When optimising a schedule and needing to identify which critical activities to compress first.', tags: ['critical path', 'drag', 'schedule', 'optimisation', 'PMBOK 8'] },
  { id: 'T26', code: 'T26', title: 'Critical Path Drag Cost', tagline: 'Quantify the cost of delay caused by each critical path activity', whenToUse: 'When making cost-benefit decisions about schedule compression on critical path activities.', tags: ['critical path', 'drag cost', 'schedule', 'cost', 'PMBOK 8'] },
  { id: 'T27', code: 'T27', title: 'In-Progress Postmortems', tagline: 'Run retrospectives during the project, not just at the end', whenToUse: 'At regular intervals during project execution to capture and apply lessons while they are still relevant.', tags: ['postmortem', 'retrospective', 'lessons learned', 'continuous improvement', 'PMBOK 8'] },
  { id: 'T28', code: 'T28', title: 'Customer Talks and Tests', tagline: 'Validate assumptions through direct customer conversations and prototype testing', whenToUse: 'When validating requirements, testing prototypes, or confirming that deliverables meet real user needs.', tags: ['customer', 'user testing', 'validation', 'requirements', 'PMBOK 8'] },
  { id: 'T29', code: 'T29', title: 'Analogous Estimating', tagline: 'Use historical data from similar projects to estimate cost and duration', whenToUse: 'In early project phases when detailed information is unavailable but historical comparators exist.', tags: ['estimating', 'analogous', 'historical', 'cost', 'schedule'] },
  { id: 'T30', code: 'T30', title: 'Bottom-Up Estimating', tagline: 'Build estimates from the lowest level of work detail upward', whenToUse: 'When high accuracy is required and the WBS is fully decomposed to work package level.', tags: ['estimating', 'bottom-up', 'WBS', 'accuracy', 'cost'] },
  { id: 'T31', code: 'T31', title: 'Parametric Estimating', tagline: 'Calculate estimates using statistical relationships between variables', whenToUse: 'When reliable historical data and measurable parameters exist to build a statistical model.', tags: ['estimating', 'parametric', 'statistical', 'cost', 'schedule'] },
  { id: 'T32', code: 'T32', title: 'Cost of Quality (CoQ)', tagline: 'Measure the total cost of achieving and failing to achieve quality', whenToUse: 'When making investment decisions about quality assurance versus the cost of defects and rework.', tags: ['quality', 'cost of quality', 'CoQ', 'prevention', 'appraisal'] },
  { id: 'T33', code: 'T33', title: 'Control Charts', tagline: 'Monitor process stability and detect variation using statistical limits', whenToUse: 'When monitoring repetitive processes to distinguish normal variation from signals requiring action.', tags: ['control charts', 'quality', 'statistical process control', 'variation', 'monitoring'] },
  { id: 'T34', code: 'T34', title: 'Schedule Compression', tagline: 'Shorten the project schedule without reducing scope using crashing or fast-tracking', whenToUse: 'When the project is behind schedule and needs to be recovered without cutting deliverables.', tags: ['schedule compression', 'crashing', 'fast-tracking', 'schedule', 'recovery'] },
  { id: 'T35', code: 'T35', title: 'Burnup Chart', tagline: 'Track completed work against total scope to visualise progress toward the goal', whenToUse: 'In Agile projects to show progress and make scope changes visible alongside completed work.', tags: ['burnup chart', 'agile', 'progress', 'scope', 'velocity'] },
  { id: 'T36', code: 'T36', title: 'Velocity', tagline: 'Measure the average amount of work a team completes per sprint', whenToUse: 'In Agile projects to forecast future sprint capacity and predict release dates.', tags: ['velocity', 'agile', 'sprint', 'capacity', 'forecasting'] },
  { id: 'T37', code: 'T37', title: 'Sprint Review', tagline: 'Inspect the sprint increment and adapt the backlog based on stakeholder feedback', whenToUse: 'At the end of every Agile sprint to demonstrate completed work and gather stakeholder input.', tags: ['sprint review', 'agile', 'scrum', 'feedback', 'increment'] },
  { id: 'T38', code: 'T38', title: 'Multicriteria Decision Analysis', tagline: 'Evaluate options against multiple weighted criteria for objective decision-making', whenToUse: 'When selecting between complex alternatives that involve trade-offs across multiple factors.', tags: ['multicriteria', 'decision analysis', 'weighted', 'evaluation', 'PMBOK 8'] },
  { id: 'T39', code: 'T39', title: 'To-Complete Performance Index (TCPI)', tagline: 'Calculate the efficiency needed to complete the project within budget', whenToUse: 'When assessing whether the remaining project budget is achievable given current performance.', tags: ['TCPI', 'earned value', 'performance', 'budget', 'forecasting'] },
  { id: 'T40', code: 'T40', title: 'Benchmarking', tagline: 'Compare project practices and performance against industry standards or best-in-class peers', whenToUse: 'When setting performance targets, identifying improvement opportunities, or validating estimates.', tags: ['benchmarking', 'comparison', 'best practice', 'performance', 'standards'] },
  { id: 'T41', code: 'T41', title: 'Prompt Lists', tagline: 'Use structured question lists to systematically identify risks and assumptions', whenToUse: 'During risk identification workshops to ensure comprehensive coverage of risk categories.', tags: ['prompt lists', 'risk identification', 'PESTLE', 'TECOP', 'PMBOK 8'] },
  { id: 'T42', code: 'T42', title: 'Make-or-Buy Analysis', tagline: 'Decide whether to build internally or procure externally based on cost, risk, and capability', whenToUse: 'When deciding whether to develop a capability in-house or outsource it to a vendor.', tags: ['make-or-buy', 'procurement', 'outsourcing', 'cost', 'capability'] },
  { id: 'T43', code: 'T43', title: 'AR/VR in Project Management', tagline: 'Use augmented and virtual reality to visualise, simulate, and collaborate on project work', whenToUse: 'When stakeholder visualisation, remote collaboration, or simulation of complex environments adds value.', tags: ['AR', 'VR', 'augmented reality', 'virtual reality', 'PMBOK 8'] },
  // PMBOK 8 NEW TECHNIQUES (A88–A93)
  { id: 'A88', code: 'A88', title: 'PMBOK 8 Principles', tagline: 'Apply the six core principles that underpin all project management practice', whenToUse: 'As a foundational reference when setting up governance, culture, and decision-making frameworks.', tags: ['PMBOK 8', 'principles', 'governance', 'foundation', 'standards'] },
  { id: 'A89', code: 'A89', title: 'Sustainability in Project Management', tagline: 'Embed ESG considerations into project planning, execution, and reporting', whenToUse: 'When the project has environmental, social, or governance impacts that need to be managed and reported.', tags: ['sustainability', 'ESG', 'environment', 'social', 'governance', 'PMBOK 8'] },
  { id: 'A90', code: 'A90', title: 'Resource-Based View (VRIO)', tagline: 'Assess organisational capabilities using the VRIO framework to build competitive advantage', whenToUse: 'When evaluating whether internal capabilities should be leveraged, developed, or outsourced.', tags: ['VRIO', 'resource-based view', 'competitive advantage', 'capability', 'strategy'] },
  { id: 'A91', code: 'A91', title: 'Genetic Algorithms', tagline: 'Apply evolutionary optimisation to solve complex project scheduling and resource problems', whenToUse: 'When facing complex optimisation problems in scheduling, resource allocation, or portfolio selection.', tags: ['genetic algorithms', 'optimisation', 'scheduling', 'AI', 'PMBOK 8'] },
  { id: 'A92', code: 'A92', title: 'Six Thinking Hats', tagline: 'Structure group thinking by assigning six distinct thinking modes to avoid groupthink', whenToUse: 'In workshops, retrospectives, or decision meetings where diverse perspectives need to be systematically explored.', tags: ['six thinking hats', 'de bono', 'creativity', 'decision making', 'facilitation'] },
  { id: 'A93', code: 'A93', title: 'Constructive Cost Model (COCOMO)', tagline: 'Estimate software project effort, cost, and schedule using algorithmic modelling', whenToUse: 'When estimating software development effort and needing a structured, repeatable algorithmic approach.', tags: ['COCOMO', 'software estimation', 'algorithmic', 'cost', 'effort'] },
  // PMBOK 8 NEW PEOPLE DOMAIN CARDS (P19–P21)
  { id: 'P19', code: 'P19', title: 'Organisational Cultural Intelligence', tagline: 'Navigate cultural differences to build trust and collaboration across diverse teams', whenToUse: 'When leading multicultural teams, managing cross-border projects, or working with international stakeholders.', tags: ['cultural intelligence', 'CQ', 'diversity', 'cross-cultural', 'PMBOK 8'] },
  { id: 'P20', code: 'P20', title: 'Green Human Resource Management', tagline: 'Integrate environmental sustainability into HR practices and team culture', whenToUse: 'When the organisation has sustainability goals that need to be embedded in team behaviour and practices.', tags: ['green HRM', 'sustainability', 'environment', 'HR', 'PMBOK 8'] },
  { id: 'P21', code: 'P21', title: 'Storytelling in Project Management', tagline: 'Use narrative techniques to communicate vision, build buy-in, and inspire action', whenToUse: 'When presenting to executives, onboarding new team members, or driving stakeholder engagement through compelling narratives.', tags: ['storytelling', 'communication', 'narrative', 'engagement', 'leadership'] },
  { id: "A10", code: "A10", title: "Mind Mapping", tagline: "Visually connect ideas to build shared understanding", whenToUse: "During brainstorming sessions, when exploring complex problems, or when building a shared vision across functions.", tags: ["mind mapping", "brainstorming", "visual", "ideas", "alignment"] },
  { id: "A11", code: "A11", title: "Reverse Mentoring", tagline: "Junior staff mentor senior staff on new skills and perspectives", whenToUse: "When senior staff need to update digital or technical skills, or when cross-generational knowledge exchange is needed.", tags: ["reverse mentoring", "knowledge transfer", "digital skills", "learning"] },
  { id: "A16", code: "A16", title: "Zero-Based Budgeting", tagline: "Justify every expense from zero — no legacy assumptions", whenToUse: "When budgets have grown incrementally without scrutiny, or when a fresh financial start is needed.", tags: ["zero-based budgeting", "budget", "cost", "financial planning"] },
  { id: "A17", code: "A17", title: "PERT Analysis", tagline: "Estimate task durations using optimistic, likely, and pessimistic scenarios", whenToUse: "When task durations are uncertain and you need a more realistic schedule estimate than single-point estimates provide.", tags: ["PERT", "estimation", "schedule", "uncertainty", "critical path"] },
  { id: "A18", code: "A18", title: "Six Sigma DMAIC", tagline: "Define, Measure, Analyse, Improve, Control — reduce defects systematically", whenToUse: "When defect rates are unacceptably high and a systematic, data-driven improvement approach is needed.", tags: ["Six Sigma", "DMAIC", "quality", "defects", "process improvement"] },
  { id: "A19", code: "A19", title: "Rolling Wave Planning", tagline: "Plan near-term tasks in detail, future tasks at a high level", whenToUse: "When future tasks are uncertain or dependent on outcomes of current work, making detailed upfront planning impractical.", tags: ["rolling wave", "planning", "progressive elaboration", "uncertainty"] },
  { id: "A21", code: "A21", title: "Should-Cost Analysis", tagline: "Estimate what something should cost to negotiate from a position of knowledge", whenToUse: "Before vendor negotiations or when evaluating whether a proposal is fairly priced.", tags: ["should-cost", "cost estimation", "negotiation", "procurement"] },
  { id: "A24", code: "A24", title: "Knowledge-Centred Service (KCS)", tagline: "Compare actual outcomes to objectives and capture lessons", whenToUse: "Perfect for support-heavy environments or recurring Q&A. Reduces repeated efforts by referencing established solutions.", tags: ["KCS", "knowledge base", "documentation", "support", "reuse"] },
  { id: "A4", code: "A4", title: "Delegation Poker", tagline: "Define exactly how much authority to delegate", whenToUse: "When defining empowerment boundaries for team members or stakeholders, especially in Agile environments.", tags: ["delegation", "empowerment", "authority", "Agile", "management 3.0"] },
  { id: "A44", code: "A44", title: "Tannenbaum-Schmidt Continuum", tagline: "Slide from autocratic to democratic leadership as the team matures", whenToUse: "Great for team building or trust exercises. Identifies blind spots or hidden information that could affect team dynamics.", tags: ["leadership", "delegation", "autocratic", "democratic", "continuum"] },
  { id: "A45", code: "A45", title: "Johari Window", tagline: "Expand the Open quadrant — reduce blind spots and hidden areas", whenToUse: "Great for team building or trust exercises. Identifies blind spots or hidden information that could affect team dynamics.", tags: ["Johari Window", "self-awareness", "blind spots", "feedback", "trust"] },
  { id: "A46", code: "A46", title: "A3 Problem Solving", tagline: "Capture problem, analysis, solution, and action on one page", whenToUse: "Good for repeated issues that need structured resolution. Forces concise thinking and clarity.", tags: ["A3", "problem solving", "Lean", "one-page", "concise"] },
  { id: "A48", code: "A48", title: "Freedman's FREEED Approach", tagline: "Six phases for structured, flexible organisational transitions", whenToUse: "", tags: ["Freedman", "change management", "transition", "organisational change"] },
  { id: "A49", code: "A49", title: "Heart, Head, Hands (3H)", tagline: "Address emotional, rational, and practical dimensions of change", whenToUse: "Great for rolling out new procedures or bridging emotional vs. logical concerns.", tags: ["3H", "Heart Head Hands", "change management", "adoption", "emotional"] },
  { id: "A50", code: "A50", title: "Soft Systems Methodology (SSM)", tagline: "Tackle messy, ill-defined problems with rich pictures and debate", whenToUse: "If stakeholder politics or unclear requirements make the problem fuzzy. Encourages learning cycles before final solutions.", tags: ["SSM", "soft systems", "messy problems", "rich pictures", "Checkland"] },
  { id: "A51", code: "A51", title: "Open Space Technology", tagline: "Self-organised group sessions where the best ideas surface naturally", whenToUse: "Large group events with diverse stakeholders. Emergent discussions reveal synergy beyond a top-down set agenda.", tags: ["Open Space", "facilitation", "self-organisation", "large groups", "emergent"] },
  { id: "A52", code: "A52", title: "DACI Decision Framework", tagline: "Driver, Approver, Contributors, Informed — one person decides", whenToUse: "Reduces confusion about who makes final calls. Good for decisions with many contributors but a single Approver.", tags: ["DACI", "decision making", "governance", "accountability", "RACI"] },
  { id: "A54", code: "A54", title: "PMBOK Process Groups", tagline: "Five process groups from Initiating to Closing", whenToUse: "Ensures all core phases are addressed, from initial authorisation to final closeout. Offers a standard approach to organising tasks.", tags: ["PMBOK", "process groups", "Initiating", "Planning", "Executing", "Closing"] },
  { id: "A56", code: "A56", title: "Probability & Impact Matrix", tagline: "Motivate individuals by understanding their dominant need", whenToUse: "Visually compares numerous risks. Ideal if the project has limited resources to manage all risks equally.", tags: ["McClelland", "motivation", "Achievement", "Affiliation", "Power"] },
  { id: "A59", code: "A59", title: "Virtual Brainstorming Software", tagline: "Collaborative digital tools to generate ideas across distributed teams", whenToUse: "When team members are remote or spread across time zones. Ideal for sprint planning, retrospectives, or any session requiring group ideation.", tags: ["virtual", "brainstorming", "remote", "collaboration", "digital tools"] },
  { id: "A6", code: "A6", title: "Personality Profiling", tagline: "Understand individual styles to build better teams", whenToUse: "During team formation or when interpersonal friction is hindering collaboration.", tags: ["personality", "MBTI", "DISC", "team building", "communication"] },
  { id: "A60", code: "A60", title: "Social Contracting", tagline: "A team-agreed charter of norms and behaviours that everyone signs up to", whenToUse: "At project kick-off or when onboarding new team members. Especially valuable for cross-functional or diverse teams with different working styles.", tags: ["team norms", "social contract", "ground rules", "team charter", "agreements"] },
  { id: "A61", code: "A61", title: "Visual Communications Dashboard", tagline: "A real-time visual display of project status for all stakeholders", whenToUse: "Throughout project execution, especially when managing multiple stakeholders with different information needs. Critical for maintaining transparency.", tags: ["dashboard", "visual management", "communications", "status reporting", "transparency"] },
  { id: "A63", code: "A63", title: "Document Management System (DMS) Automation", tagline: "Automate document versioning so everyone always works from the latest file", whenToUse: "Essential in regulated environments where compliance disclaimers must remain current. Minimises accidental use of outdated specifications or proced...", tags: ["document management", "version control", "DMS", "automation", "compliance"] },
  { id: "A65", code: "A65", title: "Compliance Gap Assessment", tagline: "Identify and close gaps between current practice and regulatory requirements", whenToUse: "Vital in heavily regulated fields (FDA, ISO, GDPR, etc.). Prevents missed disclaimers or instructions that could lead to legal issues or product re...", tags: ["compliance", "gap assessment", "regulatory", "audit", "risk"] },
  { id: "A67", code: "A67", title: "Maslow's Hierarchy of Needs", tagline: "Understand what motivates your team by addressing their fundamental needs first", whenToUse: "Useful to diagnose if team motivation is hampered by unmet basic needs (job insecurity, unclear roles) before expecting high-level performance or c...", tags: ["hierarchy of needs", "motivation", "team wellbeing", "psychology"] },
  { id: "A68", code: "A68", title: "Rogers' Diffusion of Innovation", tagline: "Understand how new ideas spread — and tailor your adoption strategy accordingly", whenToUse: "When launching a new product, process, or method that must gain acceptance across various user groups. Helps tailor messaging and engagement to eac...", tags: ["diffusion of innovation", "adoption", "change management", "Rogers", "early adopters"] },
  { id: "A69", code: "A69", title: "McKinsey's 3 Horizons", tagline: "Balance short-term delivery with mid-term growth and long-term innovation", whenToUse: "Ensures you do not sacrifice future growth for short-term wins. Good for planning product expansions or new lines while maintaining current revenue...", tags: ["McKinsey", "3 horizons", "strategy", "innovation", "portfolio"] },
  { id: "A72", code: "A72", title: "Porter's Five Forces", tagline: "Analyse competitive forces to shape your market strategy", whenToUse: "Shapes go/no-go decisions for product lines and reveals if a market is too competitive or if your position is strong. Ideal for business environmen...", tags: ["Porter", "five forces", "competitive analysis", "market strategy", "business environment"] },
  { id: "A73", code: "A73", title: "Vroom's Expectancy Theory", tagline: "Map your organisation's culture to understand what drives behaviour", whenToUse: "If you sense the team is unmotivated or uncertain about how their work leads to meaningful outcomes. Diagnoses if the link between effort and rewar...", tags: ["Vroom", "expectancy theory", "motivation", "rewards", "performance"] },
  { id: "A74", code: "A74", title: "The Cultural Web", tagline: "Map your organisation's culture to understand what drives behaviour", whenToUse: "When cultural norms are sabotaging new processes or changes. Great for diagnosing intangible cultural obstacles that rational plans cannot overcome.", tags: ["cultural web", "organisational culture", "change management", "paradigm", "stories"] },
  { id: "A75", code: "A75", title: "Bridges' Transition Model", tagline: "Classify your products as Stars, Cash Cows, Question Marks, or Dogs", whenToUse: "For portfolio management — deciding where to invest, maintain, or divest. Summarises the brand's product lines for strategic resource allocation.", tags: ["BCG matrix", "portfolio", "Stars", "Cash Cows", "strategy"] },
  { id: "A76", code: "A76", title: "Bridges' Transition Model", tagline: "Support people through the psychological journey of change, not just the process", whenToUse: "Large changes that cause emotional upheaval. Helps managers support staff through each transition stage, recognising that the psychological journey...", tags: ["transition model", "change management", "endings", "neutral zone"] },
  { id: "A77", code: "A77", title: "Kübler-Ross Change Curve", tagline: "Recognise the emotional stages people go through during significant change", whenToUse: "When staff react emotionally to a significant organisational shift. Helps leaders recognise and respond to emotional stages rather than treating th...", tags: ["Kübler-Ross", "change curve", "grief stages", "emotional change", "resistance"] },
  { id: "A78", code: "A78", title: "TRIZ (Theory of Inventive Problem Solving)", tagline: "Resolve design contradictions using universal inventive principles", whenToUse: "Perfect for complex mechanical or user design challenges where conventional thinking hits a wall. Encourages thinking beyond standard constraints.", tags: ["TRIZ", "inventive problem solving", "design", "contradiction", "innovation"] },
  { id: "A79", code: "A79", title: "Project Closeout", tagline: "Formally end the project — obtain sign-off, release resources, archive docs", whenToUse: "At the end of every project or phase. Finalises the project so no loose ends linger and provides a clean handover to whoever maintains or builds on...", tags: ["project closeout", "closure", "sign-off", "handover", "archiving"] },
  { id: "A80", code: "A80", title: "Story Point Estimation", tagline: "Estimate effort by relative complexity, not hours — for more honest sprint planning", whenToUse: "Helps Agile teams plan sprints with consistent velocity. Prevents time-based illusions by focusing on complexity relative to a known baseline story.", tags: ["story points", "estimation", "Agile", "planning poker", "velocity"] },
  { id: "A81", code: "A81", title: "Net Promoter Score (NPS)", tagline: "Measure customer loyalty with a single powerful question", whenToUse: "Tracks overall user satisfaction or brand enthusiasm. Simple to calculate, widely understood, and easy to benchmark over time.", tags: ["NPS", "Net Promoter Score", "customer satisfaction", "loyalty", "measurement"] },
  { id: "A82", code: "A82", title: "Wideband Delphi", tagline: "Refine estimates through structured expert discussion and anonymous rounds", whenToUse: "Useful for complex tasks requiring more in-depth iteration than standard Delphi (T12). Reduces bias by maintaining anonymity in early estimates but...", tags: ["Wideband Delphi", "estimation", "expert consensus", "planning", "Delphi"] },
  { id: "A83", code: "A83", title: "Pre-Mortem Analysis", tagline: "Imagine the project has already failed — then work backwards to prevent it", whenToUse: "This technique is best applied at the beginning of a project, or at key milestones, after the project plan has been developed but before significan...", tags: [] },
  { id: "A84", code: "A84", title: "Kano Model", tagline: "Separate must-haves from delighters to build what customers actually value", whenToUse: "", tags: [] },
  { id: "A85", code: "A85", title: "User Story Mapping", tagline: "Arrange user stories on a two-axis map to reveal the full product journey", whenToUse: "", tags: [] },
  { id: "A86", code: "A86", title: "Retrospective (Agile)", tagline: "Inspect and adapt your team process at the end of every iteration to continuously improve", whenToUse: "Run a retrospective at the end of every sprint (typically every 1-4 weeks). Also use it after major milestones, project phases, or significant inci...", tags: [] },
  { id: "A87", code: "A87", title: "Definition of Done (DoD)", tagline: "A shared, explicit checklist that every increment must pass before it is considered complete", whenToUse: "", tags: [] },
  { id: "AG1", code: "AG1", title: "Self-Assessment Intro", tagline: "Determine which approach suits each project segment", whenToUse: "At the start of project planning, before committing to a methodology.", tags: ["archetype", "methodology selection", "assessment"] },
  { id: "AG2", code: "AG2", title: "Key Archetyping Questions", tagline: "Ask the right questions to choose the right path", whenToUse: "After initial self-assessment (AG1), to refine the methodology decision.", tags: ["archetype", "questions", "risk", "agile", "waterfall"] },
  { id: "AG3", code: "AG3", title: "Choosing a Path", tagline: "Commit to Waterfall, Agile, or Hybrid with confidence", whenToUse: "After completing AG1 and AG2, ready to commit to a methodology.", tags: ["archetype", "decision", "waterfall", "agile", "hybrid"] },
  { id: "BE05", code: "BE05", title: "PESTLE Analysis", tagline: "Scan the macro-environment before your project is blindsided by it", whenToUse: "Use PESTLE at project initiation to inform the business case, during planning to shape risk registers, and periodically throughout execution whenev...", tags: [] },
  { id: "M5", code: "M5", title: "Scrum Framework", tagline: "Iterative sprints, defined roles, and continuous delivery of working software", whenToUse: "Scrum is ideal for projects with evolving requirements, where rapid feedback and continuous delivery are crucial. It is particularly effective for ...", tags: [] },
  { id: "M6", code: "M6", title: "PRINCE2", tagline: "Controlled stages, defined roles, and board-level governance for structured delivery", whenToUse: "PRINCE2 is particularly effective for projects requiring a high degree of control, clear governance, and defined stages, such as government contrac...", tags: [] },
  { id: "M7", code: "M7", title: "SAFe - Scaled Agile Framework", tagline: "Align multiple Agile teams around a shared programme cadence and strategy", whenToUse: "SAFe is ideal for large organizations facing challenges in coordinating multiple Agile teams, managing complex product portfolios, or delivering la...", tags: [] },
  { id: "M8", code: "M8", title: "Value Delivery System", tagline: "Align every project activity to measurable value for stakeholders and the organisation", whenToUse: "Apply this lens at project initiation to establish a clear benefits map, and revisit it at every stage gate or sprint review. It is especially impo...", tags: [] },
  { id: "M9", code: "M9", title: "Development Approach & Lifecycle", tagline: "Choose the right delivery approach — predictive, iterative, incremental, agile, or hybrid", whenToUse: "", tags: [] },
  { id: "T18", code: "T18", title: "Critical Path Method CPM", tagline: "Find the longest chain of dependent tasks to reveal your true project deadline", whenToUse: "", tags: [] },
  { id: "T19", code: "T19", title: "RAID Log", tagline: "One log to track Risks, Assumptions, Issues, and Dependencies — nothing falls through", whenToUse: "The RAID Log should be initiated at the very beginning of a project during the planning phase and maintained continuously until project closure. It...", tags: [] },
  { id: "T20", code: "T20", title: "Continuous Integration & Deployment (CI/CD)", tagline: "Automate the build, test, and release pipeline to deliver working software safely and frequently", whenToUse: "Implement CI/CD at the start of any software project using an agile or iterative approach. It is especially critical when teams are deploying infre...", tags: [] },
  { id: "business-1", code: "BE01", title: "Plan & Manage Compliance", tagline: "Integrate compliance from day one", whenToUse: "In regulated industries or whenever legal, regulatory, or policy requirements apply to the project.", tags: ["compliance", "regulatory", "audit", "risk"] },
  { id: "business-2", code: "BE02", title: "Evaluate & Deliver Benefits", tagline: "Ensure the project delivers its promised value", whenToUse: "From project initiation through post-launch — benefits realisation is an ongoing discipline.", tags: ["benefits", "value", "ROI", "scorecard", "realisation"] },
  { id: "business-3", code: "BE03", title: "Address External Changes", tagline: "Scan the horizon and adapt before disruption hits", whenToUse: "Regularly throughout the project, especially in volatile or competitive environments.", tags: ["SWOT", "PESTLE", "environment", "scenario planning", "external"] },
  { id: "business-4", code: "BE04", title: "Support Organisational Change", tagline: "Align people and processes to the new reality", whenToUse: "When the project introduces significant changes to processes, systems, or ways of working.", tags: ["change management", "organisational change", "Kotter", "Lewin"] },
  { id: "P1", code: "P01", title: "Manage Conflict", tagline: "Turn friction into productive dialogue", whenToUse: "When team members or stakeholders have opposing needs, when regulatory and business priorities clash, or when interpersonal friction is slowing pro...", tags: ["conflict", "negotiation", "team", "stakeholders"] },
  { id: "P10", code: "P10", title: "Build Shared Understanding", tagline: "Create a unifying vision across all functions", whenToUse: "At project kickoff and whenever cross-functional confusion or misalignment emerges.", tags: ["alignment", "vision", "brainstorming", "cross-functional"] },
  { id: "P11", code: "P11", title: "Engage Virtual Teams", tagline: "Bridge time zones with structure and empathy", whenToUse: "When team members are distributed across different time zones or locations.", tags: ["virtual teams", "remote", "collaboration", "time zones"] },
  { id: "P12", code: "P12", title: "Define Team Ground Rules", tagline: "Establish norms that everyone owns", whenToUse: "At team formation and whenever team dynamics shift significantly.", tags: ["ground rules", "social contract", "norms", "team culture"] },
  { id: "P13", code: "P13", title: "Mentor Stakeholders", tagline: "Transfer knowledge through structured mentoring", whenToUse: "When new hires lack domain knowledge, when digital skills need updating, or when critical knowledge is siloed.", tags: ["mentoring", "knowledge transfer", "skills", "learning"] },
  { id: "P14", code: "P14", title: "Promote Team EI", tagline: "Lead with emotional intelligence under pressure", whenToUse: "Continuously, but especially during high-stress periods, tight deadlines, or when team morale is at risk.", tags: ["emotional intelligence", "empathy", "leadership", "wellbeing"] },
  { id: "P15", code: "P15", title: "Psychological Safety", tagline: "Create the safety for teams to speak up, take risks, and learn from failure", whenToUse: "Implement psychological safety when forming new teams, during periods of significant change, or when addressing performance issues related to commu...", tags: [] },
  { id: "P16", code: "P16", title: "Stakeholder Performance Domain", tagline: "Engage the right people in the right way throughout the entire project lifecycle", whenToUse: "Use this domain from project initiation through closure. It is particularly critical during change-heavy phases, when new stakeholders emerge, or w...", tags: [] },
  { id: "P17", code: "P17", title: "Team Performance Domain", tagline: "Build a high-performing team culture grounded in trust, shared ownership, and continuous growth", whenToUse: "Apply this domain throughout the project lifecycle, with particular intensity during team formation (Tuckman Forming-Storming) and during periods o...", tags: [] },
  { id: "P18", code: "P18", title: "Servant Leadership", tagline: "Lead by removing obstacles, empowering your team, and putting their needs before your own", whenToUse: "Apply servant leadership principles in all team interactions, but especially when working with self-organising agile teams, cross-functional groups...", tags: [] },
  { id: "P2", code: "P02", title: "Lead a Team", tagline: "Guide diverse teams from forming to performing", whenToUse: "Throughout the project lifecycle, from team formation to project closure.", tags: ["leadership", "team", "RACI", "performance", "Tuckman"] },
  { id: "P3", code: "P03", title: "Support Team Performance", tagline: "Remove obstacles and sustain team momentum", whenToUse: "Continuously during execution, especially when velocity drops or team morale is at risk.", tags: ["performance", "coaching", "impediments", "morale"] },
  { id: "P4", code: "P04", title: "Empower Team Members", tagline: "Delegate authority with clear boundaries", whenToUse: "When team members or stakeholders need authority to make decisions independently without constant escalation.", tags: ["empowerment", "delegation", "authority", "stakeholders"] },
  { id: "P5", code: "P05", title: "Ensure Adequate Training", tagline: "Close skill gaps before they become project risks", whenToUse: "During team formation and onboarding, or whenever new tools, processes, or requirements are introduced.", tags: ["training", "skills", "mentoring", "onboarding"] },
  { id: "P6", code: "P06", title: "Build a Team", tagline: "Assemble a balanced team with a clear charter", whenToUse: "At project initiation when assembling the project team for the first time.", tags: ["team building", "charter", "roles", "Belbin"] },
  { id: "P7", code: "P07", title: "Address & Remove Impediments", tagline: "Escalate fast, resolve permanently", whenToUse: "Continuously during execution, especially in daily stand-ups or when team members report blockages.", tags: ["impediments", "blockers", "escalation", "problem solving"] },
  { id: "P8", code: "P08", title: "Negotiate Project Agreements", tagline: "Reach fair agreements that preserve relationships", whenToUse: "When finalising vendor contracts, resource agreements, or resolving internal disputes about project scope or priorities.", tags: ["negotiation", "vendors", "contracts", "BATNA"] },
  { id: "P9", code: "P09", title: "Collaborate with Stakeholders", tagline: "Turn stakeholders into champions", whenToUse: "Throughout the project, especially when stakeholder expectations are misaligned or when key decisions require buy-in.", tags: ["stakeholders", "collaboration", "workshops", "engagement"] },
  { id: "PR1", code: "PR01", title: "Execute with Urgency", tagline: "Deliver early wins to maintain sponsor excitement", whenToUse: "When the sponsor seeks quick wins, when the project needs to demonstrate value early, or when momentum is at risk.", tags: ["urgency", "quick wins", "prioritisation", "value delivery"] },
  { id: "PR10", code: "PR10", title: "Manage Project Changes", tagline: "Select and manage vendors with rigour", whenToUse: "Whenever a new request arises that would alter the approved project baseline.", tags: ["change control", "change request", "governance", "baseline"] },
  { id: "PR11", code: "PR11", title: "Plan & Manage Procurement", tagline: "Select and manage vendors with rigour", whenToUse: "When external vendors or suppliers are needed for project deliverables.", tags: ["procurement", "vendors", "RFP", "contracts", "SLA"] },
  { id: "PR12", code: "PR12", title: "Manage Project Artifacts", tagline: "Version-controlled documents everyone can trust", whenToUse: "Throughout the project — document management is a continuous discipline.", tags: ["documents", "versioning", "DMS", "knowledge management"] },
  { id: "PR13", code: "PR13", title: "Determine Methodology", tagline: "Minimal but sufficient oversight for fast decisions", whenToUse: "At project initiation, before planning begins.", tags: ["methodology", "waterfall", "agile", "hybrid", "selection"] },
  { id: "PR14", code: "PR14", title: "Establish Governance", tagline: "Minimal but sufficient oversight for fast decisions", whenToUse: "At project setup, before execution begins.", tags: ["governance", "RACI", "authority", "escalation", "oversight"] },
  { id: "PR15", code: "PR15", title: "Manage Project Issues", tagline: "Log it, own it, fix it — fast", whenToUse: "Continuously during execution — issues arise throughout the project lifecycle.", tags: ["issues", "log", "problem solving", "escalation"] },
  { id: "PR16", code: "PR16", title: "Ensure Knowledge Transfer", tagline: "Capture solutions before they walk out the door", whenToUse: "Throughout the project, especially at closure and during team transitions.", tags: ["knowledge transfer", "documentation", "best practices", "KCS"] },
  { id: "PR17", code: "PR17", title: "Plan Project Closure", tagline: "Close cleanly and celebrate success", whenToUse: "When all deliverables are accepted and the project is ready to close.", tags: ["closure", "sign-off", "lessons learned", "archiving"] },
  { id: "PR18", code: "PR18", title: "Planning Performance Domain", tagline: "Plan just enough, just in time — adaptive planning over exhaustive upfront blueprints", whenToUse: "Apply this domain at every level of planning: strategic roadmaps, release plans, iteration plans, and daily standups. It is especially valuable whe...", tags: [] },
  { id: "PR19", code: "PR19", title: "Delivery Performance Domain", tagline: "Focus on delivering value continuously, not just completing tasks on a schedule", whenToUse: "Apply this domain throughout execution, with particular focus during sprint reviews, quality gates, and customer acceptance testing. It is essentia...", tags: [] },
  { id: "PR2", code: "PR02", title: "Manage Communications", tagline: "Right message, right person, right time", whenToUse: "Throughout the project, especially in multi-department or multi-stakeholder environments.", tags: ["communication", "stakeholders", "dashboard", "plan"] },
  { id: "PR20", code: "PR20", title: "Measurement Performance Domain", tagline: "Measure what matters — use data to assess project health and drive informed decisions", whenToUse: "Apply this domain from project initiation (defining what to measure) through closure (evaluating actual versus planned benefits). It is especially ...", tags: [] },
  { id: "PR21", code: "PR21", title: "Uncertainty Performance Domain", tagline: "Navigate ambiguity and volatility by building resilience and adaptive capacity into your project", whenToUse: "Apply this domain throughout the project, with heightened focus during initiation (when uncertainty is highest) and at major decision points. It is...", tags: [] },
  { id: "PR3", code: "PR03", title: "Assess & Manage Risks", tagline: "Stay proactive — identify risks before they become issues", whenToUse: "From project setup through closure — risk management is continuous.", tags: ["risk", "register", "mitigation", "Monte Carlo", "contingency"] },
  { id: "PR4", code: "PR04", title: "Engage Stakeholders", tagline: "Map influence, plan engagement, build support", whenToUse: "From project initiation, with ongoing engagement throughout delivery.", tags: ["stakeholders", "engagement", "power-interest", "workshops"] },
  { id: "PR5", code: "PR05", title: "Plan & Manage Budget", tagline: "Track every pound against the plan", whenToUse: "During planning and continuously throughout execution.", tags: ["budget", "EVM", "cost", "resources", "contingency"] },
  { id: "PR6", code: "PR06", title: "Plan & Manage Schedule", tagline: "Build a realistic schedule and defend it", whenToUse: "During planning and continuously monitored throughout execution.", tags: ["schedule", "Gantt", "critical path", "PERT", "CCPM"] },
  { id: "PR7", code: "PR07", title: "Plan & Manage Quality", tagline: "Define quality standards and catch defects early", whenToUse: "From planning through delivery — quality must be built in, not inspected in.", tags: ["quality", "QA", "defects", "Fishbone", "Six Sigma"] },
  { id: "PR8", code: "PR08", title: "Plan & Manage Scope", tagline: "Define boundaries and prevent scope creep", whenToUse: "During planning and enforced throughout execution whenever new requests arise.", tags: ["scope", "requirements", "change control", "sign-off"] },
  { id: "PR9", code: "PR09", title: "Integrate Project Planning", tagline: "One master plan that connects all subsidiary plans", whenToUse: "During planning, before execution begins.", tags: ["integration", "master plan", "WBS", "dependencies"] },

];

// Build a compact catalogue string for the LLM prompt (omit whenToUse to save tokens)
function buildCatalogueText(): string {
  return CARD_CATALOGUE.map(c =>
    `${c.code}|${c.title}|${c.tagline}|${c.tags.join(',')}`
  ).join('\n');
}

const SYSTEM_PROMPT = `PMO expert. Given a project problem, pick 4-6 most relevant cards from this catalogue and explain why each helps.

CATALOGUE (code|title|tagline|tags):
${buildCatalogueText()}

Reply ONLY with JSON:
{"summary":"1-2 sentences on the problem","recommendations":[{"cardId":"exact code","reason":"1-2 sentences why this card helps"}]}

Rules: use exact cardIds from catalogue, 4-6 cards ordered by relevance, reasons must be specific to the problem.`;

export async function handleAiSuggest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Parse request body — support both pre-parsed (Express) and raw stream (Vite dev)
  let problem: string;
  try {
    let parsed: any;
    if ((req as any)._parsedBody) {
      // Body already parsed by Express middleware
      parsed = (req as any)._parsedBody;
    } else {
      // Raw stream (Vite dev server)
      let body = '';
      await new Promise<void>((resolve, reject) => {
        req.on('data', (chunk) => { body += chunk.toString(); });
        req.on('end', resolve);
        req.on('error', reject);
      });
      parsed = JSON.parse(body);
    }
    problem = parsed.problem?.trim();
    if (!problem) throw new Error('Missing problem');
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request body. Expected { problem: string }' }));
    return;
  }

  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'LLM API not configured' }));
    return;
  }

  // Set a 20-second timeout on the request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const llmRes = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `My problem: ${problem}` },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });
    clearTimeout(timeoutId);

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      console.error('[AI Suggest] LLM error:', llmRes.status, errText);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'LLM request failed', detail: errText }));
      return;
    }

    const llmData = await llmRes.json() as { choices: Array<{ message: { content: string } }> };
    const content = llmData.choices?.[0]?.message?.content ?? '';

    // Parse the JSON response from the LLM
    let parsed: { summary: string; recommendations: Array<{ cardId: string; reason: string }> };
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[AI Suggest] Failed to parse LLM JSON:', content);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to parse LLM response', raw: content }));
      return;
    }

    // Enrich recommendations with card metadata
    const enriched = parsed.recommendations.map(rec => {
      const card = CARD_CATALOGUE.find(c => c.id === rec.cardId || c.code === rec.cardId);
      return {
        cardId: card?.id ?? rec.cardId,
        code: card?.code ?? rec.cardId,
        title: card?.title ?? rec.cardId,
        tagline: card?.tagline ?? '',
        reason: rec.reason,
      };
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ summary: parsed.summary, recommendations: enriched }));
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      console.error('[AI Suggest] Request timed out');
      res.writeHead(504, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request timed out. Please try again.' }));
    } else {
      console.error('[AI Suggest] Unexpected error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}
