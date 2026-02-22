/**
 * Improves all weak proTips in pmoData.ts by replacing them with
 * specific, actionable, longer versions.
 * Run: node scripts/improveProTips.mjs
 */

import { readFileSync, writeFileSync } from 'fs';

let src = readFileSync('./client/src/lib/pmoData.ts', 'utf8');

// Map of card ID → new proTip (specific, actionable, 100-160 chars)
const IMPROVEMENTS = {
  'phase-execution': `Real-time monitoring and proactive risk handling (A14) prevent unpleasant surprises — run a weekly 15-minute status pulse with your team to surface blockers before they escalate.`,
  'T1': `Review your Gantt chart weekly with the team, not just the PM — team members often spot scheduling conflicts or resource clashes that aren't visible from the top.`,
  'T2': `Keep stand-ups to 15 minutes maximum. If a blocker needs deeper discussion, "park it" and schedule a separate session — protecting the daily rhythm is more valuable than solving every issue on the spot.`,
  'T3': `A thorough WBS is your best guard against missing critical tasks — decompose until each work package is small enough to estimate and assign to a single owner.`,
  'T4': `Run EVM checks bi-weekly, not just at month-end — catching a CPI below 0.9 early gives you time to recover before the variance compounds into a formal change request.`,
  'T5': `Avoid multiple "A" (Accountable) assignments on the same task — this prevents confusion on final decision authority and ensures someone is genuinely on the hook for delivery.`,
  'T8': `Combine with 5 Whys (A23) for deeper root-cause exploration — the Ishikawa diagram shows you where to look, and 5 Whys tells you why it happened.`,
  'T9': `Historical data from similar past projects dramatically improves distribution accuracy — even rough analogues are better than pure guesswork when setting probability ranges.`,
  'T10': `Assigning realistic probabilities is crucial — guesswork undermines the tree's value. Use historical data or expert elicitation with at least two independent estimates per node.`,
  'T11': `Focus on three to five critical KPIs per perspective to avoid overload — a Balanced Scorecard with 30 metrics is as useless as one with none. Less is more.`,
  'T15': `Sometimes a small effort to reduce a single strong restraining force can tip the entire balance — identify the one restraining force causing the most friction and address it first.`,
  'T17': `A quick daily glance at your Kanban board identifies if you need to reassign tasks or cut scope — WIP limits are only effective if you enforce them rather than just track them.`,
  'A4': `Clear delegation guidelines prevent confusion or overreach — document what decisions each level can make autonomously, and revisit as team maturity grows to progressively expand autonomy.`,
  'A5': `Pair with KCS (A24) to ensure transferred knowledge is captured in a searchable format — knowledge transfer that lives only in someone's head disappears when they leave.`,
  'A6': `Use DISC profiles as a starting point for conversation, not as fixed labels — people adapt their style under pressure, so revisit profiles when team dynamics shift significantly.`,
  'A7': `Use a Kaizen Blitz after Value Stream Mapping (A34) to target the biggest bottlenecks — a focused 3-day sprint on one process often delivers more improvement than months of gradual change.`,
  'A9': `Involving stakeholders in the creation of a process map builds champions for the solution — people defend what they helped design, dramatically reducing adoption resistance.`,
  'A10': `Mind maps are most powerful when created collaboratively — everyone sees the connections differently, and the group synthesis often reveals blind spots that solo mapping misses.`,
  'A11': `Frame benchmarking as mutual learning — both parties gain insights. Approach peers with a clear value exchange ("we share our data, you share yours") to open doors that cold requests cannot.`,
  'A12': `Conduct empathy mapping with real users when possible — assumptions about what users think or feel are often wrong. Even a 30-minute interview per persona dramatically improves accuracy.`,
  'A14': `Combine EVM with Monte Carlo simulation (T9) for a full probabilistic view of project outcomes — EVM tells you where you are, Monte Carlo tells you where you're likely to end up.`,
  'A16': `Activity-Based Costing is particularly powerful for identifying legacy costs that no longer deliver value — many organisations discover 20-30% of activities add no customer value once they map them.`,
  'A17': `PERT is most valuable for novel tasks where historical data is limited — the three-point estimate forces honest conversations about uncertainty that single-point estimates hide.`,
  'A18': `Don't skip the Measure phase — without baseline data, you're guessing at root causes and have no way to prove your improvement actually worked.`,
  'A23': `Don't stop at the first "why" — keep drilling down until the root cause is something you can actually control. A cause you can't influence is not a useful root cause.`,
  'A24': `If the team updates the knowledge base in real-time rather than in batch, it stays fresh and adoption stays high — stale knowledge bases are abandoned within weeks.`,
  'A26': `Don't declare victory at release — keep monitoring benefits for 3-6 months post-launch. Many projects deliver the output but fail to realise the outcome they were funded for.`,
  'A27': `Focus on two or three plausible extremes, not an endless set of trivial variants — the goal is to stress-test your strategy against genuinely different futures, not to cover every possibility.`,
  'A30': `Fail fast and learn — prototypes let you pivot without huge sunk costs. A paper prototype tested with five users will reveal more usability issues than months of internal design reviews.`,
  'A31': `Sometimes shifting resources to fix the critical 20% yields significant overall gains quickly — identify your Pareto items first, then allocate your best people to them before tackling the long tail.`,
  'A32': `Pair SWOT with Scenario Planning (A27) for robust market adaptations — SWOT gives you a snapshot, Scenario Planning stress-tests your strategy against multiple possible futures.`,
  'A34': `Use a Kaizen Blitz (A7) on the biggest bottlenecks identified after mapping — Value Stream Mapping shows you where waste is, Kaizen Blitz removes it.`,
  'A36': `Spend enough time in the "unfreezing" phase — or staff will resist the change. Lewin's most common failure mode is rushing to the "change" phase before people have let go of the old way.`,
  'A37': `A mismatch in any element of the McKinsey 7-S model can derail an otherwise solid plan — check all seven elements, not just Strategy and Structure, before declaring alignment.`,
  'A38': `Too many "Plants" and no "Completer-Finisher" leads to many ideas but poor final quality — audit your team's Belbin profiles and fill gaps with targeted recruitment or role assignment.`,
  'A39': `Trust is the foundation — without it, all other dysfunctions are inevitable. Address trust issues directly before trying to fix accountability or results — the order matters.`,
  'A46': `The one-page limit is a feature, not a constraint — it forces clarity and prevents burying the real problem in lengthy documents. If it won't fit on one page, the problem isn't well-defined yet.`,
  'A47': `Focus improvement efforts on the constraint first — optimising non-constraints is waste. Identify your single biggest bottleneck and subordinate everything else to exploiting it.`,
  'A49': `Ignoring any dimension of the ADKAR model leads to partial adoption or resistance — if people have Awareness and Desire but lack Knowledge, training is the fix, not more communication.`,
  'A51': `Trust participants' autonomy in Open Space Technology — often, the best ideas surface spontaneously from self-organised groups rather than from facilitator-directed sessions.`,
  'A52': `One Approver per decision keeps sign-off from stalling in committee — if you find yourself with two Approvers on the RACI, escalate to leadership to clarify who has final authority.`,
};

let changeCount = 0;
for (const [cardId, newTip] of Object.entries(IMPROVEMENTS)) {
  // Find the card block and replace its proTip
  // Match proTip: 'old text' for this specific card
  const cardBlockRe = new RegExp(
    `(id:\\s*'${cardId}'[\\s\\S]*?proTip:\\s*')((?:[^'\\\\]|\\\\.)*)(')`,
    'g'
  );
  const before = src;
  src = src.replace(cardBlockRe, (match, prefix, oldTip, suffix) => {
    // Escape single quotes in new tip
    const escaped = newTip.replace(/'/g, "\\'");
    return prefix + escaped + suffix;
  });
  if (src !== before) {
    changeCount++;
    console.log(`✓ Updated ${cardId}`);
  } else {
    console.log(`✗ No match for ${cardId}`);
  }
}

writeFileSync('./client/src/lib/pmoData.ts', src, 'utf8');
console.log(`\nDone — ${changeCount} proTips updated.`);
