const CARD_CATALOGUE = [
  // PROJECT PHASES
  { id: "phase-setup", code: "Phase 1", title: "Project Setup", tagline: "Build a solid foundation before you launch", whenToUse: "At the very start of any project, before committing resources or beginning execution work.", tags: ["setup", "planning", "scope", "risk", "stakeholders"] },
  { id: "phase-execution", code: "Phase 2", title: "Project Execution", tagline: "Maintain momentum through disciplined delivery", whenToUse: "Once the project is set up and approved, throughout the active delivery period.", tags: ["execution", "tracking", "communication", "change management"] },
  { id: "phase-closure", code: "Phase 3", title: "Project Closure", tagline: "Close with confidence and capture lessons learned", whenToUse: "When all deliverables have been completed and accepted by the sponsor.", tags: ["closure", "lessons learned", "handover", "benefits"] },
  // METHODOLOGIES
  { id: "M1", code: "M1", title: "Waterfall", tagline: "Sequential delivery for stable, well-defined projects", whenToUse: "When requirements are fixed, well-understood, and unlikely to change.", tags: ["waterfall", "sequential", "methodology", "planning"] },
  { id: "M2", code: "M2", title: "Agile", tagline: "Iterative delivery for evolving requirements", whenToUse: "When requirements are uncertain or likely to evolve, and rapid feedback is valuable.", tags: ["agile", "iterative", "sprints", "flexibility"] },
  { id: "M3", code: "M3", title: "Kanban", tagline: "Flow-based delivery for continuous work", whenToUse: "For ongoing operational work or support teams where tasks arrive continuously.", tags: ["kanban", "flow", "wip", "continuous delivery"] },
  { id: "M4", code: "M4", title: "Hybrid", tagline: "Blend Waterfall and Agile for complex programmes", whenToUse: "When different parts of a project have different levels of certainty.", tags: ["hybrid", "agile", "waterfall", "programme"] },
  // TOOLS
  { id: "T1", code: "T1", title: "Gantt Chart", tagline: "A visual timeline showing tasks, durations, and dependencies", whenToUse: "When you need to plan, schedule, and track project tasks over time.", tags: ["scheduling", "timeline", "planning", "dependencies"] },
  { id: "T2", code: "T2", title: "Kanban Board", tagline: "Visual task management with columns and WIP limits", whenToUse: "To visualise workflow, limit work-in-progress, and identify bottlenecks.", tags: ["kanban", "workflow", "visualisation", "wip"] },
  { id: "T3", code: "T3", title: "Work Breakdown Structure", tagline: "Decompose deliverables into manageable tasks", whenToUse: "When planning a project and needing to break scope into assignable work packages.", tags: ["wbs", "scope", "decomposition", "planning"] },
  { id: "T4", code: "T4", title: "Earned Value Management", tagline: "Measure performance by comparing planned vs. actual cost", whenToUse: "To objectively measure project performance and forecast completion cost and date.", tags: ["evm", "cost", "performance", "forecasting"] },
  { id: "T5", code: "T5", title: "RACI Matrix", tagline: "Clarify who is Responsible, Accountable, Consulted, Informed", whenToUse: "When roles and responsibilities are unclear or overlapping.", tags: ["raci", "roles", "accountability", "governance"] },
  { id: "T6", code: "T6", title: "Risk Register", tagline: "Central log of risks with mitigation and contingency plans", whenToUse: "Throughout the project lifecycle to identify, assess, and manage risks.", tags: ["risk", "mitigation", "register", "contingency"] },
  { id: "T7", code: "T7", title: "MoSCoW Prioritisation", tagline: "Must, Should, Could, Won't \u2014 focus on what matters most", whenToUse: "When scope needs to be prioritised and trade-offs must be made.", tags: ["prioritisation", "scope", "moscow", "requirements"] },
  { id: "T8", code: "T8", title: "Fishbone Diagram", tagline: "Trace defects to their root causes across categories", whenToUse: "When investigating the root cause of a problem or defect.", tags: ["root cause", "fishbone", "ishikawa", "quality"] },
  { id: "T9", code: "T9", title: "Monte Carlo Simulation", tagline: "Model thousands of scenarios to predict cost and time ranges", whenToUse: "When you need probabilistic forecasts for schedule or cost.", tags: ["monte carlo", "simulation", "risk", "forecasting"] },
  { id: "T10", code: "T10", title: "Decision Tree Analysis", tagline: "Evaluate decision paths, probabilities, and expected outcomes", whenToUse: "When facing complex decisions with multiple uncertain outcomes.", tags: ["decision", "analysis", "probability", "options"] },
  { id: "T11", code: "T11", title: "Balanced Scorecard", tagline: "Measure performance across four perspectives holistically", whenToUse: "When you need a strategic performance management framework beyond financials.", tags: ["balanced scorecard", "kpi", "strategy", "performance"] },
  { id: "T12", code: "T12", title: "Delphi Technique", tagline: "Anonymous expert consensus without groupthink", whenToUse: "When you need expert consensus on uncertain estimates or decisions.", tags: ["delphi", "consensus", "estimation", "expert"] },
  { id: "T13", code: "T13", title: "Cost-Benefit Analysis", tagline: "Compare total costs to total benefits for go/no-go decisions", whenToUse: "Before committing to a project or major investment decision.", tags: ["cost benefit", "roi", "investment", "decision"] },
  { id: "T14", code: "T14", title: "Project Scope Statement", tagline: "Define what's in and what's out \u2014 prevent scope creep", whenToUse: "At project initiation to establish clear boundaries.", tags: ["scope", "scope creep", "boundaries", "definition"] },
  { id: "T15", code: "T15", title: "Force Field Analysis", tagline: "Weigh driving forces against restraining forces for change", whenToUse: "When planning a change and needing to identify what supports or blocks it.", tags: ["change", "force field", "lewin", "analysis"] },
  { id: "T16", code: "T16", title: "Stakeholder Matrix", tagline: "Map power vs. interest to tailor your engagement strategy", whenToUse: "At project start and whenever the stakeholder landscape changes.", tags: ["stakeholders", "engagement", "power interest", "communication"] },
  { id: "T17", code: "T17", title: "Burndown Chart", tagline: "Track remaining work vs. time in each sprint", whenToUse: "In Agile projects to visualise sprint progress and forecast completion.", tags: ["burndown", "agile", "sprint", "velocity"] },
  // TECHNIQUES (A1-A82 — key selection)
  { id: "A1", code: "A1", title: "Principled Negotiation", tagline: "Focus on interests, not positions, for win-win outcomes", whenToUse: "When negotiating with vendors, stakeholders, or team members.", tags: ["negotiation", "conflict", "interests", "win-win"] },
  { id: "A2", code: "A2", title: "Tuckman's Ladder", tagline: "Guide teams through Forming, Storming, Norming, Performing", whenToUse: "When building a new team or diagnosing team performance issues.", tags: ["team development", "forming storming", "team dynamics"] },
  { id: "A3", code: "A3", title: "Performance Gap Analysis", tagline: "Identify the gap between current and desired performance", whenToUse: "When diagnosing why a team or process is underperforming.", tags: ["performance", "gap analysis", "improvement"] },
  { id: "A5", code: "A5", title: "Knowledge Transfer Matrix", tagline: "Map who knows what and ensure critical knowledge is shared", whenToUse: "When key people are leaving or knowledge silos are a risk.", tags: ["knowledge", "transfer", "succession", "silos"] },
  { id: "A7", code: "A7", title: "Kaizen Blitz", tagline: "Rapid focused improvement sprint to fix a specific problem", whenToUse: "When a specific process needs rapid improvement in a short timeframe.", tags: ["kaizen", "improvement", "lean", "rapid"] },
  { id: "A8", code: "A8", title: "ZOPA & BATNA", tagline: "Know your walk-away point before entering any negotiation", whenToUse: "Before any significant negotiation with vendors, clients, or partners.", tags: ["negotiation", "batna", "zopa", "contracts"] },
  { id: "A9", code: "A9", title: "Co-Creation Workshops", tagline: "Design solutions together with stakeholders", whenToUse: "When stakeholder buy-in is critical and solutions need shared ownership.", tags: ["workshop", "co-creation", "stakeholders", "collaboration"] },
  { id: "A12", code: "A12", title: "Empathy Mapping", tagline: "Understand what users think, feel, say, and do", whenToUse: "When designing solutions and needing to understand user needs deeply.", tags: ["empathy", "user research", "design thinking", "ux"] },
  { id: "A13", code: "A13", title: "Lean Startup Pilot", tagline: "Test assumptions with a minimum viable product", whenToUse: "When validating a new idea or product before full investment.", tags: ["mvp", "lean startup", "validation", "pilot"] },
  { id: "A14", code: "A14", title: "Quantitative Risk Analysis", tagline: "Assign numbers to risks for objective prioritisation", whenToUse: "When you need to prioritise risks objectively using data.", tags: ["risk", "quantitative", "analysis", "probability"] },
  { id: "A15", code: "A15", title: "Stakeholder Engagement Matrix", tagline: "Track and shift stakeholder engagement levels", whenToUse: "When managing complex stakeholder landscapes with varying levels of support.", tags: ["stakeholders", "engagement", "communication", "change"] },
  { id: "A20", code: "A20", title: "Integrated Change Control", tagline: "Formal workflow to evaluate and approve all project changes", whenToUse: "When managing scope changes to prevent uncontrolled scope creep.", tags: ["change control", "scope", "governance", "approval"] },
  { id: "A22", code: "A22", title: "Agile-Waterfall Hybrid Mapping", tagline: "Show how sprint outputs feed into formal Waterfall gates", whenToUse: "When running hybrid projects that mix Agile and Waterfall elements.", tags: ["hybrid", "agile", "waterfall", "gates"] },
  { id: "A23", code: "A23", title: "Root Cause Analysis (5 Whys)", tagline: 'Ask "Why?" five times to find the real root cause', whenToUse: "When a problem recurs and the surface fix isn't working.", tags: ["root cause", "5 whys", "problem solving", "quality"] },
  { id: "A25", code: "A25", title: "Post-Implementation Review", tagline: "Compare actual outcomes to objectives and capture lessons", whenToUse: "After project completion to capture lessons and measure success.", tags: ["lessons learned", "review", "closure", "retrospective"] },
  { id: "A26", code: "A26", title: "Benefits Realisation Management", tagline: "Track whether promised benefits are actually delivered", whenToUse: "When projects are justified by business benefits that need to be tracked post-delivery.", tags: ["benefits", "roi", "value", "measurement"] },
  { id: "A27", code: "A27", title: "Scenario Planning", tagline: "Prepare for multiple futures before they happen", whenToUse: "When facing high uncertainty about future conditions.", tags: ["scenario", "planning", "uncertainty", "strategy"] },
  { id: "A28", code: "A28", title: "Kotter's 8-Step Model", tagline: "Eight steps to embed large-scale organisational change", whenToUse: "When leading significant organisational change programmes.", tags: ["change management", "kotter", "transformation", "adoption"] },
  { id: "A29", code: "A29", title: "Critical Chain PM (CCPM)", tagline: "Resource-aware scheduling with strategic buffers", whenToUse: "When resource contention is the primary scheduling constraint.", tags: ["critical chain", "scheduling", "buffers", "resources"] },
  { id: "A30", code: "A30", title: "Design Thinking", tagline: "Empathise, Define, Ideate, Prototype, Test \u2014 user-first innovation", whenToUse: "When solving complex problems that require a human-centred approach.", tags: ["design thinking", "innovation", "user", "prototype"] },
  { id: "A31", code: "A31", title: "Pareto Analysis", tagline: "80% of problems come from 20% of causes \u2014 find that 20%", whenToUse: "When you need to focus effort on the highest-impact issues.", tags: ["pareto", "80/20", "prioritisation", "analysis"] },
  { id: "A32", code: "A32", title: "SWOT Analysis", tagline: "Strengths, Weaknesses, Opportunities, Threats \u2014 strategic clarity", whenToUse: "When assessing a project, product, or organisation strategically.", tags: ["swot", "strategy", "analysis", "planning"] },
  { id: "A33", code: "A33", title: "Weighted Shortest Job First (WSJF)", tagline: "Prioritise tasks by value delivered per unit of effort", whenToUse: "In Agile/SAFe environments when prioritising the backlog.", tags: ["wsjf", "prioritisation", "agile", "safe", "backlog"] },
  { id: "A34", code: "A34", title: "Value Stream Mapping", tagline: "Map the entire flow from request to delivery \u2014 find the waste", whenToUse: "When optimising a process end-to-end to eliminate waste.", tags: ["value stream", "lean", "waste", "process improvement"] },
  { id: "A35", code: "A35", title: "Timeboxing", tagline: "Fix the time, flex the scope \u2014 prevent perfectionism", whenToUse: "When teams are prone to over-engineering or perfectionism.", tags: ["timeboxing", "agile", "scope", "time management"] },
  { id: "A36", code: "A36", title: "Lewin's 3-Step Model", tagline: "Unfreeze, Change, Refreeze \u2014 make change stick", whenToUse: "When implementing change and needing a simple framework for adoption.", tags: ["change management", "lewin", "unfreeze", "adoption"] },
  { id: "A37", code: "A37", title: "McKinsey 7S Framework", tagline: "Align seven organisational elements for strategic success", whenToUse: "When diagnosing organisational alignment issues.", tags: ["mckinsey", "7s", "organisation", "alignment", "strategy"] },
  { id: "A38", code: "A38", title: "Belbin Team Roles", tagline: "Balance nine natural team roles for high performance", whenToUse: "When building or improving team composition.", tags: ["belbin", "team roles", "team building", "performance"] },
  { id: "A39", code: "A39", title: "5 Dysfunctions of a Team", tagline: "Address the five root causes of team failure", whenToUse: "When a team is underperforming or experiencing trust issues.", tags: ["team", "dysfunction", "trust", "lencioni"] },
  { id: "A40", code: "A40", title: "PDCA Cycle", tagline: "Plan, Do, Check, Act \u2014 continuous improvement in four steps", whenToUse: "For any continuous improvement initiative.", tags: ["pdca", "continuous improvement", "quality", "deming"] },
  { id: "A41", code: "A41", title: "8D Problem Solving", tagline: "Eight disciplines for thorough, permanent problem resolution", whenToUse: "When a serious problem needs a structured, permanent fix.", tags: ["8d", "problem solving", "quality", "root cause"] },
  { id: "A42", code: "A42", title: "SCARF Model", tagline: "Address five social needs that drive human behaviour", whenToUse: "When managing change, conflict, or motivation challenges.", tags: ["scarf", "neuroscience", "motivation", "change", "behaviour"] },
  { id: "A43", code: "A43", title: "TKI Conflict Modes", tagline: "Understand five conflict styles to resolve disputes effectively", whenToUse: "When managing team conflict or stakeholder disputes.", tags: ["conflict", "tki", "resolution", "styles"] },
  { id: "A47", code: "A47", title: "Theory of Constraints (TOC)", tagline: "Find and fix the one bottleneck limiting your whole system", whenToUse: "When a single constraint is limiting overall system throughput.", tags: ["theory of constraints", "bottleneck", "throughput", "goldratt"] },
  { id: "A53", code: "A53", title: "Cynefin Framework", tagline: "Match your decision approach to the complexity of the situation", whenToUse: "When deciding how to approach a problem based on its complexity.", tags: ["cynefin", "complexity", "decision making", "framework"] },
  { id: "A55", code: "A55", title: "ADKAR\xAE Model", tagline: "Drive individual change through five building blocks", whenToUse: "When managing change and needing to track individual adoption.", tags: ["adkar", "change management", "adoption", "prosci"] },
  { id: "A57", code: "A57", title: "Probability & Impact Matrix", tagline: "Rank risks by likelihood and consequence", whenToUse: "When prioritising risks for response planning.", tags: ["risk", "probability", "impact", "matrix"] },
  { id: "A58", code: "A58", title: "Lessons Learned", tagline: "Capture what worked, what didn't, and what to do differently", whenToUse: "At project milestones and closure to capture institutional knowledge.", tags: ["lessons learned", "retrospective", "knowledge", "improvement"] },
  { id: "A62", code: "A62", title: "Requirements Traceability Matrix", tagline: "Link requirements to deliverables and tests end-to-end", whenToUse: "When managing complex requirements that must be tracked through delivery.", tags: ["requirements", "traceability", "testing", "scope"] },
  { id: "A64", code: "A64", title: "Lightweight Governance Model", tagline: "Right-size governance to avoid bureaucracy without losing control", whenToUse: "When governance is either too heavy or too light for the project.", tags: ["governance", "lightweight", "control", "oversight"] },
  { id: "A66", code: "A66", title: "Nudge Theory", tagline: "Design choices that guide behaviour without mandating it", whenToUse: "When trying to influence team or stakeholder behaviour subtly.", tags: ["nudge", "behaviour", "influence", "psychology"] },
  { id: "A70", code: "A70", title: "Lewin's Force Field Analysis", tagline: "Identify forces driving and restraining change", whenToUse: "When planning change and needing to understand resistance.", tags: ["force field", "change", "resistance", "lewin"] },
  { id: "A71", code: "A71", title: "Hersey-Blanchard Situational Leadership", tagline: "Adapt your leadership style to each team member's maturity", whenToUse: "When leading a diverse team with varying skill and motivation levels.", tags: ["situational leadership", "coaching", "delegation", "maturity"] },
  // PEOPLE DOMAIN
  { id: "PD1", code: "PD1", title: "Build a Team", tagline: "Assemble the right people with the right skills", whenToUse: "At project start when forming the project team.", tags: ["team building", "recruitment", "skills", "people"] },
  { id: "PD2", code: "PD2", title: "Define Team Roles", tagline: "Clarify who does what to prevent confusion and gaps", whenToUse: "When roles and responsibilities are unclear.", tags: ["roles", "responsibilities", "raci", "clarity"] },
  { id: "PD3", code: "PD3", title: "Empower the Team", tagline: "Give the team authority to make decisions and own outcomes", whenToUse: "When team members are disengaged or overly dependent on the PM.", tags: ["empowerment", "autonomy", "motivation", "delegation"] },
  { id: "PD4", code: "PD4", title: "Manage Conflict", tagline: "Address disagreements constructively before they escalate", whenToUse: "When interpersonal or team conflicts arise.", tags: ["conflict", "resolution", "mediation", "team"] },
  { id: "PD5", code: "PD5", title: "Collaborate with Stakeholders", tagline: "Build trust and alignment with all project stakeholders", whenToUse: "Throughout the project to maintain stakeholder engagement.", tags: ["stakeholders", "collaboration", "trust", "engagement"] },
  { id: "PD6", code: "PD6", title: "Mentor & Coach", tagline: "Develop team capability through guidance and feedback", whenToUse: "When team members need skill development or confidence building.", tags: ["mentoring", "coaching", "development", "feedback"] },
  { id: "PD7", code: "PD7", title: "Support Performance", tagline: "Identify and remove obstacles blocking team performance", whenToUse: "When team performance is below expectations.", tags: ["performance", "support", "obstacles", "improvement"] },
  { id: "PD8", code: "PD8", title: "Communicate Effectively", tagline: "Tailor messages to the right audience at the right time", whenToUse: "Throughout the project to keep all parties informed.", tags: ["communication", "stakeholders", "reporting", "messaging"] },
  { id: "PD9", code: "PD9", title: "Lead the Team", tagline: "Inspire, direct, and motivate the team toward project goals", whenToUse: "Throughout the project lifecycle as the team leader.", tags: ["leadership", "motivation", "direction", "vision"] },
  { id: "PD10", code: "PD10", title: "Manage Virtual Teams", tagline: "Keep distributed teams connected, aligned, and productive", whenToUse: "When managing teams across different locations or time zones.", tags: ["virtual", "remote", "distributed", "collaboration"] },
  { id: "PD11", code: "PD11", title: "Manage Stakeholder Engagement", tagline: "Actively manage stakeholder expectations and involvement", whenToUse: "When stakeholders have conflicting interests or varying levels of support.", tags: ["stakeholders", "engagement", "expectations", "influence"] },
  { id: "PD12", code: "PD12", title: "Manage Conflict (Advanced)", tagline: "Apply advanced techniques for complex interpersonal disputes", whenToUse: "When standard conflict resolution approaches have failed.", tags: ["conflict", "advanced", "mediation", "resolution"] },
  { id: "PD13", code: "PD13", title: "Negotiate Agreements", tagline: "Reach mutually beneficial agreements with all parties", whenToUse: "When formal or informal agreements need to be reached.", tags: ["negotiation", "agreements", "contracts", "win-win"] },
  { id: "PD14", code: "PD14", title: "Collaborate Across Boundaries", tagline: "Work effectively across departments, cultures, and organisations", whenToUse: "When projects span multiple organisations or cultural contexts.", tags: ["cross-functional", "culture", "collaboration", "boundaries"] },
  // PROCESS DOMAIN
  { id: "PR1", code: "PR1", title: "Execute Project Work", tagline: "Deliver project outputs through disciplined execution", whenToUse: "During the execution phase to deliver project work.", tags: ["execution", "delivery", "work", "outputs"] },
  { id: "PR2", code: "PR2", title: "Manage Scope", tagline: "Control what's in and out to prevent scope creep", whenToUse: "Throughout the project to prevent uncontrolled scope growth.", tags: ["scope", "scope creep", "control", "change"] },
  { id: "PR3", code: "PR3", title: "Manage Quality", tagline: "Ensure deliverables meet agreed quality standards", whenToUse: "Throughout delivery to maintain quality standards.", tags: ["quality", "standards", "testing", "assurance"] },
  { id: "PR4", code: "PR4", title: "Manage Risk", tagline: "Identify, assess, and respond to project risks proactively", whenToUse: "Throughout the project to manage threats and opportunities.", tags: ["risk", "management", "mitigation", "contingency"] },
  { id: "PR5", code: "PR5", title: "Manage Issues", tagline: "Resolve problems quickly before they become crises", whenToUse: "When problems arise during project execution.", tags: ["issues", "resolution", "escalation", "problem solving"] },
  { id: "PR6", code: "PR6", title: "Manage Schedule", tagline: "Keep the project on track against the baseline plan", whenToUse: "Throughout execution to monitor and control the schedule.", tags: ["schedule", "timeline", "tracking", "baseline"] },
  { id: "PR7", code: "PR7", title: "Manage Budget", tagline: "Control costs and forecast financial performance", whenToUse: "Throughout the project to manage financial performance.", tags: ["budget", "cost", "financial", "forecasting"] },
  { id: "PR8", code: "PR8", title: "Manage Resources", tagline: "Allocate and optimise people, equipment, and materials", whenToUse: "When resource constraints are affecting project delivery.", tags: ["resources", "allocation", "capacity", "people"] },
  { id: "PR9", code: "PR9", title: "Manage Procurement", tagline: "Source and manage vendors, contracts, and suppliers", whenToUse: "When the project requires external suppliers or contractors.", tags: ["procurement", "vendors", "contracts", "suppliers"] },
  { id: "PR10", code: "PR10", title: "Manage Communications", tagline: "Plan and execute a structured communication strategy", whenToUse: "Throughout the project to keep all stakeholders informed.", tags: ["communications", "plan", "reporting", "stakeholders"] },
  { id: "PR11", code: "PR11", title: "Manage Change", tagline: "Control changes through a formal change management process", whenToUse: "When change requests arise during project execution.", tags: ["change", "control", "requests", "governance"] },
  { id: "PR12", code: "PR12", title: "Manage Knowledge", tagline: "Capture and share project knowledge across the organisation", whenToUse: "Throughout the project to prevent knowledge loss.", tags: ["knowledge", "documentation", "sharing", "lessons"] },
  { id: "PR13", code: "PR13", title: "Manage Benefits", tagline: "Track and realise the business benefits the project was funded to deliver", whenToUse: "From project approval through post-delivery to ensure benefits are realised.", tags: ["benefits", "value", "roi", "realisation"] },
  { id: "PR14", code: "PR14", title: "Manage Governance", tagline: "Maintain appropriate oversight and decision-making structures", whenToUse: "Throughout the project to ensure proper governance.", tags: ["governance", "oversight", "decisions", "accountability"] },
  { id: "PR15", code: "PR15", title: "Manage Stakeholders", tagline: "Identify, analyse, and engage all project stakeholders", whenToUse: "From project start to maintain stakeholder alignment.", tags: ["stakeholders", "engagement", "analysis", "communication"] },
  { id: "PR16", code: "PR16", title: "Manage Lessons Learned", tagline: "Capture and apply lessons throughout the project", whenToUse: "At milestones and project closure.", tags: ["lessons learned", "retrospective", "improvement", "knowledge"] },
  { id: "PR17", code: "PR17", title: "Close the Project", tagline: "Formally close the project and hand over to operations", whenToUse: "When all deliverables are complete and accepted.", tags: ["closure", "handover", "sign-off", "completion"] },
  // BUSINESS ENVIRONMENT
  { id: "BE1", code: "BE1", title: "Manage Compliance", tagline: "Ensure the project meets all regulatory and legal requirements", whenToUse: "When the project operates in a regulated environment.", tags: ["compliance", "regulatory", "legal", "governance"] },
  { id: "BE2", code: "BE2", title: "Evaluate External Environment", tagline: "Assess how external factors affect the project", whenToUse: "During planning and when external conditions change.", tags: ["external", "pestle", "environment", "analysis"] },
  { id: "BE3", code: "BE3", title: "Manage Organisational Change", tagline: "Prepare the organisation for the changes the project will bring", whenToUse: "When the project will significantly change how people work.", tags: ["change management", "organisation", "transformation", "adoption"] },
  { id: "BE4", code: "BE4", title: "Deliver Business Value", tagline: "Ensure the project delivers measurable value to the organisation", whenToUse: "Throughout the project to maintain focus on business outcomes.", tags: ["value", "business", "outcomes", "benefits"] }
];
function buildCatalogueText() {
  return CARD_CATALOGUE.map(
    (c) => `${c.code} | ${c.title} | ${c.tagline} | When to use: ${c.whenToUse} | Tags: ${c.tags.join(", ")}`
  ).join("\n");
}
const SYSTEM_PROMPT = `You are a PMO (Project Management Office) expert advisor. Your job is to help project managers find the right tools, techniques, and frameworks from a curated library of ${CARD_CATALOGUE.length} cards.

Given a problem statement from the user, you will:
1. Analyse the core challenge they are facing
2. Select the 4-6 most relevant cards from the catalogue below
3. For each card, explain in 1-2 sentences WHY it specifically addresses their problem
4. Order them from most to least relevant

CARD CATALOGUE:
${buildCatalogueText()}

Respond ONLY with valid JSON in this exact format:
{
  "summary": "A 1-2 sentence summary of the problem and your overall recommendation approach",
  "recommendations": [
    {
      "cardId": "the card id (e.g. T6, A23, PD4)",
      "reason": "1-2 sentences explaining exactly why this card addresses their specific problem"
    }
  ]
}

Rules:
- Only recommend cards from the catalogue above (use the exact cardId)
- Recommend 4-6 cards, ordered by relevance
- Keep reasons specific to the user's problem, not generic descriptions
- Do not mention 'pip deck' anywhere`;
async function handleAiSuggest(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  let body = "";
  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", resolve);
    req.on("error", reject);
  });
  let problem;
  try {
    const parsed = JSON.parse(body);
    problem = parsed.problem?.trim();
    if (!problem) throw new Error("Missing problem");
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid request body. Expected { problem: string }" }));
    return;
  }
  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;
  if (!apiUrl || !apiKey) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "LLM API not configured" }));
    return;
  }
  try {
    const llmRes = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `My problem: ${problem}` }
        ],
        temperature: 0.3,
        max_tokens: 1024
      })
    });
    if (!llmRes.ok) {
      const errText = await llmRes.text();
      console.error("[AI Suggest] LLM error:", llmRes.status, errText);
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "LLM request failed", detail: errText }));
      return;
    }
    const llmData = await llmRes.json();
    const content = llmData.choices?.[0]?.message?.content ?? "";
    let parsed;
    try {
      const cleaned = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[AI Suggest] Failed to parse LLM JSON:", content);
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to parse LLM response", raw: content }));
      return;
    }
    const enriched = parsed.recommendations.map((rec) => {
      const card = CARD_CATALOGUE.find((c) => c.id === rec.cardId || c.code === rec.cardId);
      return {
        cardId: card?.id ?? rec.cardId,
        code: card?.code ?? rec.cardId,
        title: card?.title ?? rec.cardId,
        tagline: card?.tagline ?? "",
        reason: rec.reason
      };
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ summary: parsed.summary, recommendations: enriched }));
  } catch (err) {
    console.error("[AI Suggest] Unexpected error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
export {
  handleAiSuggest
};
