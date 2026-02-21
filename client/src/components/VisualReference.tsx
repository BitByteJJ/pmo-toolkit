// PMO Toolkit — Futuristic Visual Reference Diagrams
// Style: dark blueprint/HUD aesthetic — thin electric-cyan lines, glowing nodes, monospace labels
// Each card type gets a unique SVG diagram rendered inline (no external images needed)

import React from 'react';

// ─── Shared style constants ──────────────────────────────────────────────────
const BG = '#0A0F1A';
const GRID = '#1A2535';
const LINE = '#00D4FF';
const LINE2 = '#00FF88';
const LINE3 = '#FF6B35';
const DIM = '#2A4060';
const LABEL = '#7ECFEF';
const LABEL2 = '#A0FFD0';
const GLOW = 'drop-shadow(0 0 4px #00D4FF) drop-shadow(0 0 8px #00D4FF88)';
const GLOW2 = 'drop-shadow(0 0 4px #00FF88) drop-shadow(0 0 8px #00FF8888)';
const GLOW3 = 'drop-shadow(0 0 4px #FF6B35) drop-shadow(0 0 8px #FF6B3588)';

interface DiagramProps { color?: string }

// ─── Wrapper ─────────────────────────────────────────────────────────────────
function DiagramWrapper({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: BG,
        border: `1px solid ${DIM}`,
        boxShadow: `0 0 20px rgba(0,212,255,0.08), inset 0 0 40px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: `1px solid ${DIM}`, background: '#060C14' }}
      >
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FFBD2E' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#28C840' }} />
        </div>
        <span
          className="text-[9px] font-mono tracking-widest uppercase flex-1 text-center"
          style={{ color: LABEL, opacity: 0.7 }}
        >
          {label}
        </span>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: LINE, boxShadow: `0 0 4px ${LINE}` }} />
      </div>
      {children}
    </div>
  );
}

// ─── Grid background helper ───────────────────────────────────────────────────
function GridBg({ w = 320, h = 200 }: { w?: number; h?: number }) {
  const cols = Math.ceil(w / 20);
  const rows = Math.ceil(h / 20);
  return (
    <g opacity="0.15">
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={h} stroke={GRID} strokeWidth="0.5" />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 20} x2={w} y2={i * 20} stroke={GRID} strokeWidth="0.5" />
      ))}
    </g>
  );
}

// ─── Glowing dot ─────────────────────────────────────────────────────────────
function GlowDot({ x, y, r = 3, color = LINE }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <circle cx={x} cy={y} r={r} fill={color} style={{ filter: `drop-shadow(0 0 ${r * 2}px ${color})` }} />
  );
}

// ─── Corner brackets ─────────────────────────────────────────────────────────
function Brackets({ x, y, w, h, size = 8, color = DIM }: { x: number; y: number; w: number; h: number; size?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="1" fill="none">
      <polyline points={`${x + size},${y} ${x},${y} ${x},${y + size}`} />
      <polyline points={`${x + w - size},${y} ${x + w},${y} ${x + w},${y + size}`} />
      <polyline points={`${x},${y + h - size} ${x},${y + h} ${x + size},${y + h}`} />
      <polyline points={`${x + w},${y + h - size} ${x + w},${y + h} ${x + w - size},${y + h}`} />
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T1 — Gantt Chart
// ═══════════════════════════════════════════════════════════════════════════════
export function GanttDiagram() {
  const tasks = [
    { label: 'INITIATION', start: 0, len: 3, color: LINE },
    { label: 'PLANNING', start: 2, len: 4, color: LINE2 },
    { label: 'EXECUTION', start: 5, len: 5, color: LINE },
    { label: 'MONITORING', start: 5, len: 5, color: LINE3 },
    { label: 'CLOSURE', start: 9, len: 2, color: LINE2 },
  ];
  const cols = 11;
  const colW = 22;
  const rowH = 24;
  const labelW = 80;
  const svgW = labelW + cols * colW + 20;
  const svgH = tasks.length * rowH + 40;

  return (
    <DiagramWrapper label="GANTT CHART // T1">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Week headers */}
        {Array.from({ length: cols }).map((_, i) => (
          <text key={i} x={labelW + i * colW + colW / 2} y={14} textAnchor="middle"
            fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.6">W{i + 1}</text>
        ))}
        {/* Tasks */}
        {tasks.map((t, i) => {
          const y = 22 + i * rowH;
          const barX = labelW + t.start * colW + 2;
          const barW = t.len * colW - 4;
          return (
            <g key={i}>
              <text x={labelW - 4} y={y + 10} textAnchor="end" fill={LABEL} fontSize="7" fontFamily="monospace">{t.label}</text>
              <rect x={barX} y={y + 2} width={barW} height={14} rx="2"
                fill={t.color} opacity="0.2" />
              <rect x={barX} y={y + 2} width={barW} height={14} rx="2"
                fill="none" stroke={t.color} strokeWidth="1"
                style={{ filter: `drop-shadow(0 0 3px ${t.color})` }} />
              <GlowDot x={barX} y={y + 9} r={2} color={t.color} />
              <GlowDot x={barX + barW} y={y + 9} r={2} color={t.color} />
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T2 — Kanban Board
// ═══════════════════════════════════════════════════════════════════════════════
export function KanbanDiagram() {
  const cols = [
    { label: 'BACKLOG', items: ['Task A', 'Task B', 'Task C'], color: DIM },
    { label: 'IN PROGRESS', items: ['Task D', 'Task E'], color: LINE, wip: '2/3' },
    { label: 'REVIEW', items: ['Task F'], color: LINE3, wip: '1/2' },
    { label: 'DONE', items: ['Task G', 'Task H'], color: LINE2 },
  ];
  const colW = 72;
  const svgW = cols.length * colW + (cols.length - 1) * 6 + 12;
  const svgH = 180;

  return (
    <DiagramWrapper label="KANBAN BOARD // T2">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {cols.map((col, ci) => {
          const x = 6 + ci * (colW + 6);
          return (
            <g key={ci}>
              {/* Column header */}
              <rect x={x} y={8} width={colW} height={18} rx="3" fill={col.color} opacity="0.15" />
              <rect x={x} y={8} width={colW} height={18} rx="3" fill="none" stroke={col.color} strokeWidth="0.8" />
              <text x={x + colW / 2} y={20} textAnchor="middle" fill={col.color} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{col.label}</text>
              {col.wip && (
                <text x={x + colW - 4} y={20} textAnchor="end" fill={col.color} fontSize="5.5" fontFamily="monospace" opacity="0.7">WIP {col.wip}</text>
              )}
              {/* Cards */}
              {col.items.map((item, ii) => {
                const cy = 34 + ii * 28;
                return (
                  <g key={ii}>
                    <rect x={x + 4} y={cy} width={colW - 8} height={20} rx="2" fill={col.color} opacity="0.08" />
                    <rect x={x + 4} y={cy} width={colW - 8} height={20} rx="2" fill="none" stroke={col.color} strokeWidth="0.6" opacity="0.5" />
                    <text x={x + colW / 2} y={cy + 13} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace">{item}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T3 — Work Breakdown Structure
// ═══════════════════════════════════════════════════════════════════════════════
export function WBSDiagram() {
  const svgW = 320;
  const svgH = 190;
  const nodes = [
    { id: 'root', label: 'PROJECT', x: 160, y: 24, color: LINE },
    { id: 'D1', label: 'DESIGN', x: 60, y: 80, color: LINE2 },
    { id: 'D2', label: 'BUILD', x: 160, y: 80, color: LINE2 },
    { id: 'D3', label: 'DEPLOY', x: 260, y: 80, color: LINE2 },
    { id: 'D1a', label: 'UX', x: 24, y: 148, color: LINE3 },
    { id: 'D1b', label: 'SPEC', x: 72, y: 148, color: LINE3 },
    { id: 'D2a', label: 'DEV', x: 128, y: 148, color: LINE3 },
    { id: 'D2b', label: 'QA', x: 176, y: 148, color: LINE3 },
    { id: 'D3a', label: 'STAGE', x: 228, y: 148, color: LINE3 },
    { id: 'D3b', label: 'PROD', x: 280, y: 148, color: LINE3 },
  ];
  const edges = [
    ['root', 'D1'], ['root', 'D2'], ['root', 'D3'],
    ['D1', 'D1a'], ['D1', 'D1b'],
    ['D2', 'D2a'], ['D2', 'D2b'],
    ['D3', 'D3a'], ['D3', 'D3b'],
  ];
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <DiagramWrapper label="WORK BREAKDOWN STRUCTURE // T3">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {edges.map(([a, b], i) => {
          const na = nodeMap[a], nb = nodeMap[b];
          return (
            <line key={i} x1={na.x} y1={na.y + 10} x2={nb.x} y2={nb.y - 10}
              stroke={DIM} strokeWidth="1" strokeDasharray="3,2" />
          );
        })}
        {nodes.map(n => (
          <g key={n.id}>
            <rect x={n.x - 22} y={n.y - 10} width={44} height={20} rx="3"
              fill={n.color} opacity="0.12" />
            <rect x={n.x - 22} y={n.y - 10} width={44} height={20} rx="3"
              fill="none" stroke={n.color} strokeWidth="0.8"
              style={{ filter: `drop-shadow(0 0 3px ${n.color}66)` }} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color} fontSize="7" fontFamily="monospace" fontWeight="bold">{n.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T4 — Earned Value Management
// ═══════════════════════════════════════════════════════════════════════════════
export function EVMDiagram() {
  const svgW = 320;
  const svgH = 190;
  const pts = [0, 40, 80, 120, 160, 200, 240, 280];
  const pv = [0, 20, 45, 75, 110, 145, 175, 195];
  const ev = [0, 15, 35, 60, 85, 110, 140, 165];
  const ac = [0, 18, 42, 72, 105, 142, 178, 200];
  const scaleX = (v: number) => 30 + (v / 280) * 270;
  const scaleY = (v: number) => svgH - 20 - (v / 200) * 150;

  const toPath = (xs: number[], ys: number[]) =>
    xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${scaleX(x)},${scaleY(ys[i])}`).join(' ');

  return (
    <DiagramWrapper label="EARNED VALUE MANAGEMENT // T4">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Axes */}
        <line x1={30} y1={svgH - 20} x2={svgW - 10} y2={svgH - 20} stroke={DIM} strokeWidth="1" />
        <line x1={30} y1={10} x2={30} y2={svgH - 20} stroke={DIM} strokeWidth="1" />
        <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5">TIME →</text>
        <text x={12} y={svgH / 2} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5" transform={`rotate(-90, 12, ${svgH / 2})`}>COST →</text>
        {/* Lines */}
        <path d={toPath(pts, pv)} fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="5,3"
          style={{ filter: GLOW }} />
        <path d={toPath(pts, ev)} fill="none" stroke={LINE2} strokeWidth="1.5"
          style={{ filter: GLOW2 }} />
        <path d={toPath(pts, ac)} fill="none" stroke={LINE3} strokeWidth="1.5"
          style={{ filter: GLOW3 }} />
        {/* Legend */}
        {[{ label: 'PV', color: LINE, dash: true }, { label: 'EV', color: LINE2 }, { label: 'AC', color: LINE3 }].map((l, i) => (
          <g key={i}>
            <line x1={svgW - 70} y1={20 + i * 14} x2={svgW - 56} y2={20 + i * 14}
              stroke={l.color} strokeWidth="1.5" strokeDasharray={l.dash ? '4,2' : undefined} />
            <text x={svgW - 52} y={24 + i * 14} fill={l.color} fontSize="7" fontFamily="monospace">{l.label}</text>
          </g>
        ))}
        {/* Variance annotation */}
        <line x1={scaleX(240)} y1={scaleY(ac[6])} x2={scaleX(240)} y2={scaleY(ev[6])}
          stroke={LINE3} strokeWidth="0.8" strokeDasharray="2,2" />
        <text x={scaleX(240) + 3} y={(scaleY(ac[6]) + scaleY(ev[6])) / 2} fill={LINE3} fontSize="6" fontFamily="monospace">CV</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T5 — RACI Matrix
// ═══════════════════════════════════════════════════════════════════════════════
export function RACIDiagram() {
  const tasks = ['REQUIREMENTS', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT'];
  const roles = ['PM', 'DEV', 'QA', 'CLIENT', 'EXEC'];
  const matrix = [
    ['A', 'R', 'C', 'I', 'I'],
    ['A', 'R', 'C', 'C', 'I'],
    ['I', 'R', 'C', 'I', 'I'],
    ['A', 'C', 'R', 'C', 'I'],
    ['A', 'R', 'I', 'I', 'C'],
  ];
  const colors: Record<string, string> = { A: LINE, R: LINE2, C: LINE3, I: DIM };
  const colW = 36;
  const rowH = 24;
  const labelW = 90;
  const svgW = labelW + roles.length * colW + 10;
  const svgH = tasks.length * rowH + 36;

  return (
    <DiagramWrapper label="RACI MATRIX // T5">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Role headers */}
        {roles.map((r, i) => (
          <g key={i}>
            <rect x={labelW + i * colW + 2} y={4} width={colW - 4} height={18} rx="2"
              fill={LINE} opacity="0.1" />
            <text x={labelW + i * colW + colW / 2} y={16} textAnchor="middle"
              fill={LINE} fontSize="7" fontFamily="monospace" fontWeight="bold">{r}</text>
          </g>
        ))}
        {/* Rows */}
        {tasks.map((task, ti) => {
          const y = 26 + ti * rowH;
          return (
            <g key={ti}>
              <text x={labelW - 4} y={y + 14} textAnchor="end" fill={LABEL} fontSize="7" fontFamily="monospace">{task}</text>
              {matrix[ti].map((cell, ci) => {
                const cx = labelW + ci * colW + colW / 2;
                const cy = y + 4;
                const c = colors[cell] || DIM;
                return (
                  <g key={ci}>
                    <rect x={labelW + ci * colW + 2} y={cy} width={colW - 4} height={rowH - 6} rx="2"
                      fill={c} opacity={cell === 'I' ? 0.05 : 0.15} />
                    <rect x={labelW + ci * colW + 2} y={cy} width={colW - 4} height={rowH - 6} rx="2"
                      fill="none" stroke={c} strokeWidth="0.7" opacity={cell === 'I' ? 0.3 : 0.8} />
                    <text x={cx} y={cy + 11} textAnchor="middle" fill={c} fontSize="9" fontFamily="monospace" fontWeight="bold"
                      style={{ filter: cell !== 'I' ? `drop-shadow(0 0 3px ${c})` : undefined }}>{cell}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T6 — Risk Register
// ═══════════════════════════════════════════════════════════════════════════════
export function RiskRegisterDiagram() {
  const risks = [
    { label: 'SUPPLIER DELAY', prob: 3, impact: 4, color: LINE3 },
    { label: 'SCOPE CREEP', prob: 4, impact: 3, color: LINE3 },
    { label: 'BUDGET OVERRUN', prob: 2, impact: 5, color: LINE3 },
    { label: 'RESOURCE LOSS', prob: 2, impact: 3, color: LINE },
    { label: 'TECH FAILURE', prob: 1, impact: 4, color: LINE },
    { label: 'COMMS GAP', prob: 3, impact: 2, color: LINE2 },
  ];
  const svgW = 320;
  const svgH = 200;
  const pad = 36;
  const scale = (v: number) => pad + (v - 1) * ((svgW - pad * 2) / 4);
  const scaleY = (v: number) => svgH - pad - (v - 1) * ((svgH - pad * 2) / 4);

  return (
    <DiagramWrapper label="RISK REGISTER // T6">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Quadrant zones */}
        <rect x={pad} y={pad} width={(svgW - pad * 2) / 2} height={(svgH - pad * 2) / 2} fill={LINE2} opacity="0.03" />
        <rect x={pad + (svgW - pad * 2) / 2} y={pad} width={(svgW - pad * 2) / 2} height={(svgH - pad * 2) / 2} fill={LINE3} opacity="0.06" />
        <rect x={pad} y={pad + (svgH - pad * 2) / 2} width={(svgW - pad * 2) / 2} height={(svgH - pad * 2) / 2} fill={LINE2} opacity="0.03" />
        <rect x={pad + (svgW - pad * 2) / 2} y={pad + (svgH - pad * 2) / 2} width={(svgW - pad * 2) / 2} height={(svgH - pad * 2) / 2} fill={LINE3} opacity="0.03" />
        {/* Axes */}
        <line x1={pad} y1={svgH - pad} x2={svgW - pad} y2={svgH - pad} stroke={DIM} strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={svgH - pad} stroke={DIM} strokeWidth="1" />
        {[1, 2, 3, 4, 5].map(v => (
          <g key={v}>
            <text x={scale(v)} y={svgH - pad + 10} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">{v}</text>
            <text x={pad - 8} y={scaleY(v) + 3} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">{v}</text>
          </g>
        ))}
        <text x={svgW / 2} y={svgH - 4} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5">PROBABILITY →</text>
        <text x={10} y={svgH / 2} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5" transform={`rotate(-90, 10, ${svgH / 2})`}>IMPACT →</text>
        {/* Risk dots */}
        {risks.map((r, i) => {
          const cx = scale(r.prob);
          const cy = scaleY(r.impact);
          const score = r.prob * r.impact;
          const radius = 4 + score * 0.5;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={radius} fill={r.color} opacity="0.2" />
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke={r.color} strokeWidth="1"
                style={{ filter: `drop-shadow(0 0 4px ${r.color})` }} />
              <text x={cx} y={cy - radius - 2} textAnchor="middle" fill={r.color} fontSize="5.5" fontFamily="monospace">{r.label.split(' ')[0]}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T7 — MoSCoW Prioritisation
// ═══════════════════════════════════════════════════════════════════════════════
export function MoSCoWDiagram() {
  const categories = [
    { label: 'MUST HAVE', items: ['Core feature A', 'Security', 'Compliance'], color: LINE3, pct: 40 },
    { label: 'SHOULD HAVE', items: ['Reporting', 'Notifications'], color: LINE, pct: 30 },
    { label: 'COULD HAVE', items: ['Dark mode', 'Export PDF'], color: LINE2, pct: 20 },
    { label: "WON'T HAVE", items: ['AI assistant'], color: DIM, pct: 10 },
  ];
  const svgW = 320;
  const svgH = 190;
  const barH = 18;
  const barMaxW = 180;

  return (
    <DiagramWrapper label="MoSCoW PRIORITISATION // T7">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {categories.map((cat, i) => {
          const y = 16 + i * 44;
          const barW = (cat.pct / 100) * barMaxW;
          return (
            <g key={i}>
              <text x={8} y={y + 10} fill={cat.color} fontSize="7.5" fontFamily="monospace" fontWeight="bold"
                style={{ filter: cat.color !== DIM ? `drop-shadow(0 0 3px ${cat.color}88)` : undefined }}>{cat.label}</text>
              {/* Bar */}
              <rect x={8} y={y + 14} width={barMaxW} height={barH} rx="2" fill={cat.color} opacity="0.06" />
              <rect x={8} y={y + 14} width={barW} height={barH} rx="2" fill={cat.color} opacity="0.25" />
              <rect x={8} y={y + 14} width={barW} height={barH} rx="2" fill="none" stroke={cat.color} strokeWidth="0.8" />
              <text x={barW + 12} y={y + 26} fill={cat.color} fontSize="7" fontFamily="monospace">{cat.pct}%</text>
              {/* Items */}
              {cat.items.map((item, ii) => (
                <text key={ii} x={svgW - 8} y={y + 14 + ii * 9 + 7} textAnchor="end" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">· {item}</text>
              ))}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T8 — Fishbone Diagram
// ═══════════════════════════════════════════════════════════════════════════════
export function FishboneDiagram() {
  const svgW = 320;
  const svgH = 190;
  const spineY = svgH / 2;
  const headX = svgW - 30;
  const tailX = 20;
  const bones = [
    { label: 'METHODS', causes: ['Process gap', 'No SOP'], angle: -35, x: 240 },
    { label: 'MATERIALS', causes: ['Bad specs', 'Late supply'], angle: 35, x: 240 },
    { label: 'WORKFORCE', causes: ['Skill gap', 'Turnover'], angle: -35, x: 170 },
    { label: 'MACHINES', causes: ['Calibration', 'Downtime'], angle: 35, x: 170 },
    { label: 'ENVIRONMENT', causes: ['Noise', 'Temperature'], angle: -35, x: 100 },
    { label: 'MEASUREMENT', causes: ['Wrong KPI', 'Lag'], angle: 35, x: 100 },
  ];

  return (
    <DiagramWrapper label="FISHBONE DIAGRAM // T8">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Spine */}
        <line x1={tailX} y1={spineY} x2={headX} y2={spineY} stroke={LINE} strokeWidth="1.5"
          style={{ filter: GLOW }} />
        {/* Head */}
        <polygon points={`${headX},${spineY - 12} ${svgW - 8},${spineY} ${headX},${spineY + 12}`}
          fill={LINE} opacity="0.3" />
        <polygon points={`${headX},${spineY - 12} ${svgW - 8},${spineY} ${headX},${spineY + 12}`}
          fill="none" stroke={LINE} strokeWidth="1" style={{ filter: GLOW }} />
        <text x={svgW - 6} y={spineY + 3} textAnchor="end" fill={LINE} fontSize="7" fontFamily="monospace" fontWeight="bold">DEFECT</text>
        {/* Bones */}
        {bones.map((b, i) => {
          const isTop = b.angle < 0;
          const boneLen = 55;
          const rad = (b.angle * Math.PI) / 180;
          const ex = b.x + boneLen * Math.cos(rad);
          const ey = spineY + boneLen * Math.sin(rad);
          return (
            <g key={i}>
              <line x1={b.x} y1={spineY} x2={ex} y2={ey} stroke={LINE2} strokeWidth="1"
                style={{ filter: GLOW2 }} />
              <GlowDot x={b.x} y={spineY} r={2.5} color={LINE2} />
              <text x={ex + (isTop ? -2 : 2)} y={ey + (isTop ? -4 : 10)} textAnchor={isTop ? 'end' : 'start'}
                fill={LINE2} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{b.label}</text>
              {b.causes.map((c, ci) => {
                const cx2 = ex + (isTop ? -1 : 1) * (ci + 1) * 22 * Math.cos(rad * 0.5);
                const cy2 = ey + (isTop ? -1 : 1) * (ci + 1) * 10;
                return (
                  <g key={ci}>
                    <line x1={ex} y1={ey} x2={cx2} y2={cy2} stroke={DIM} strokeWidth="0.7" strokeDasharray="2,2" />
                    <text x={cx2} y={cy2 + (isTop ? -2 : 8)} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{c}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T9 — Monte Carlo Simulation
// ═══════════════════════════════════════════════════════════════════════════════
export function MonteCarloDiagram() {
  const svgW = 320;
  const svgH = 190;
  // Bell-curve-like distribution data
  const bars = [2, 5, 10, 18, 28, 38, 45, 42, 35, 25, 16, 9, 4, 2];
  const maxBar = 45;
  const barW = (svgW - 60) / bars.length;
  const maxH = 120;

  return (
    <DiagramWrapper label="MONTE CARLO SIMULATION // T9">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* P80 zone */}
        <rect x={30 + 3 * barW} y={30} width={8 * barW} height={maxH} fill={LINE} opacity="0.04" />
        <line x1={30 + 3 * barW} y1={28} x2={30 + 3 * barW} y2={svgH - 30} stroke={LINE2} strokeWidth="0.8" strokeDasharray="3,2" />
        <text x={30 + 3 * barW + 2} y={26} fill={LINE2} fontSize="6" fontFamily="monospace">P20</text>
        <line x1={30 + 11 * barW} y1={28} x2={30 + 11 * barW} y2={svgH - 30} stroke={LINE3} strokeWidth="0.8" strokeDasharray="3,2" />
        <text x={30 + 11 * barW + 2} y={26} fill={LINE3} fontSize="6" fontFamily="monospace">P80</text>
        {/* Bars */}
        {bars.map((v, i) => {
          const bh = (v / maxBar) * maxH;
          const bx = 30 + i * barW;
          const by = svgH - 30 - bh;
          const inRange = i >= 3 && i <= 10;
          const color = inRange ? LINE : DIM;
          return (
            <g key={i}>
              <rect x={bx + 1} y={by} width={barW - 2} height={bh} rx="1"
                fill={color} opacity={inRange ? 0.3 : 0.1} />
              <rect x={bx + 1} y={by} width={barW - 2} height={bh} rx="1"
                fill="none" stroke={color} strokeWidth="0.5" opacity={inRange ? 0.8 : 0.3} />
            </g>
          );
        })}
        {/* Axes */}
        <line x1={28} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={DIM} strokeWidth="1" />
        <text x={svgW / 2} y={svgH - 14} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5">OUTCOME RANGE →</text>
        <text x={14} y={svgH / 2} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5" transform={`rotate(-90, 14, ${svgH / 2})`}>FREQUENCY</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T10 — Decision Tree
// ═══════════════════════════════════════════════════════════════════════════════
export function DecisionTreeDiagram() {
  const svgW = 320;
  const svgH = 200;
  const nodes = [
    { id: 'root', label: 'LAUNCH?', x: 60, y: 100, shape: 'diamond', color: LINE },
    { id: 'q2', label: 'Q2', x: 140, y: 55, shape: 'circle', color: LINE2 },
    { id: 'q3', label: 'Q3', x: 140, y: 145, shape: 'circle', color: LINE3 },
    { id: 'high', label: 'HIGH ROI\n+£2M', x: 230, y: 30, shape: 'rect', color: LINE2 },
    { id: 'med', label: 'MED ROI\n+£0.8M', x: 230, y: 80, shape: 'rect', color: LINE },
    { id: 'med2', label: 'MED ROI\n+£1.2M', x: 230, y: 130, shape: 'rect', color: LINE },
    { id: 'low', label: 'LOW ROI\n+£0.3M', x: 230, y: 175, shape: 'rect', color: LINE3 },
  ];
  const edges = [
    { from: 'root', to: 'q2', label: '60%' },
    { from: 'root', to: 'q3', label: '40%' },
    { from: 'q2', to: 'high', label: '70%' },
    { from: 'q2', to: 'med', label: '30%' },
    { from: 'q3', to: 'med2', label: '55%' },
    { from: 'q3', to: 'low', label: '45%' },
  ];
  const nm = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <DiagramWrapper label="DECISION TREE // T10">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {edges.map((e, i) => {
          const a = nm[e.from], b = nm[e.to];
          const mx = (a.x + b.x) / 2;
          return (
            <g key={i}>
              <path d={`M${a.x + 14},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x - 14},${b.y}`}
                fill="none" stroke={DIM} strokeWidth="1" />
              <text x={mx} y={(a.y + b.y) / 2 - 3} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.7">{e.label}</text>
            </g>
          );
        })}
        {nodes.map(n => {
          if (n.shape === 'diamond') {
            return (
              <g key={n.id}>
                <polygon points={`${n.x},${n.y - 14} ${n.x + 20},${n.y} ${n.x},${n.y + 14} ${n.x - 20},${n.y}`}
                  fill={n.color} opacity="0.15" />
                <polygon points={`${n.x},${n.y - 14} ${n.x + 20},${n.y} ${n.x},${n.y + 14} ${n.x - 20},${n.y}`}
                  fill="none" stroke={n.color} strokeWidth="1" style={{ filter: `drop-shadow(0 0 4px ${n.color})` }} />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fill={n.color} fontSize="7" fontFamily="monospace" fontWeight="bold">{n.label}</text>
              </g>
            );
          }
          if (n.shape === 'circle') {
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={13} fill={n.color} opacity="0.12" />
                <circle cx={n.x} cy={n.y} r={13} fill="none" stroke={n.color} strokeWidth="1"
                  style={{ filter: `drop-shadow(0 0 3px ${n.color})` }} />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fill={n.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{n.label}</text>
              </g>
            );
          }
          return (
            <g key={n.id}>
              <rect x={n.x - 30} y={n.y - 12} width={60} height={24} rx="3" fill={n.color} opacity="0.12" />
              <rect x={n.x - 30} y={n.y - 12} width={60} height={24} rx="3" fill="none" stroke={n.color} strokeWidth="0.8" />
              {n.label.split('\n').map((line, li) => (
                <text key={li} x={n.x} y={n.y + li * 9 - 2} textAnchor="middle" fill={n.color} fontSize="6.5" fontFamily="monospace">{line}</text>
              ))}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T11 — Balanced Scorecard
// ═══════════════════════════════════════════════════════════════════════════════
export function BalancedScorecardDiagram() {
  const svgW = 320;
  const svgH = 200;
  const perspectives = [
    { label: 'FINANCIAL', kpis: ['Revenue +12%', 'Cost -8%'], color: LINE3, x: 160, y: 40 },
    { label: 'CUSTOMER', kpis: ['NPS 72', 'Retention 94%'], color: LINE, x: 80, y: 110 },
    { label: 'INTERNAL', kpis: ['Cycle time -20%', 'Defects -15%'], color: LINE2, x: 240, y: 110 },
    { label: 'LEARNING', kpis: ['Training hrs', 'Innovation'], color: '#A78BFA', x: 160, y: 175 },
  ];
  const center = { x: 160, y: 110 };

  return (
    <DiagramWrapper label="BALANCED SCORECARD // T11">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Center */}
        <circle cx={center.x} cy={center.y} r={20} fill={LINE} opacity="0.08" />
        <circle cx={center.x} cy={center.y} r={20} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="4,3" />
        <text x={center.x} y={center.y + 3} textAnchor="middle" fill={LINE} fontSize="7" fontFamily="monospace" fontWeight="bold">VISION</text>
        {/* Connecting lines */}
        {perspectives.map((p, i) => (
          <line key={i} x1={center.x} y1={center.y} x2={p.x} y2={p.y}
            stroke={p.color} strokeWidth="0.8" strokeDasharray="3,3" opacity="0.5" />
        ))}
        {/* Perspective boxes */}
        {perspectives.map((p, i) => (
          <g key={i}>
            <rect x={p.x - 44} y={p.y - 22} width={88} height={44} rx="4"
              fill={p.color} opacity="0.1" />
            <rect x={p.x - 44} y={p.y - 22} width={88} height={44} rx="4"
              fill="none" stroke={p.color} strokeWidth="0.9"
              style={{ filter: `drop-shadow(0 0 3px ${p.color}66)` }} />
            <text x={p.x} y={p.y - 9} textAnchor="middle" fill={p.color} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{p.label}</text>
            {p.kpis.map((kpi, ki) => (
              <text key={ki} x={p.x} y={p.y + 3 + ki * 9} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{kpi}</text>
            ))}
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T12 — Stakeholder Matrix
// ═══════════════════════════════════════════════════════════════════════════════
export function StakeholderMatrixDiagram() {
  const svgW = 320;
  const svgH = 200;
  const pad = 40;
  const w = svgW - pad * 2;
  const h = svgH - pad * 2;
  const stakeholders = [
    { label: 'SPONSOR', power: 0.9, interest: 0.85, color: LINE3 },
    { label: 'PMO', power: 0.75, interest: 0.9, color: LINE3 },
    { label: 'REGULATOR', power: 0.8, interest: 0.4, color: LINE },
    { label: 'TEAM', power: 0.5, interest: 0.8, color: LINE2 },
    { label: 'VENDOR', power: 0.4, interest: 0.6, color: LINE2 },
    { label: 'PUBLIC', power: 0.2, interest: 0.3, color: DIM },
  ];

  return (
    <DiagramWrapper label="STAKEHOLDER MATRIX // T12">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Quadrant labels */}
        {[
          { label: 'KEEP SATISFIED', x: pad + w * 0.25, y: pad + h * 0.25, color: LINE },
          { label: 'MANAGE CLOSELY', x: pad + w * 0.75, y: pad + h * 0.25, color: LINE3 },
          { label: 'MONITOR', x: pad + w * 0.25, y: pad + h * 0.75, color: DIM },
          { label: 'KEEP INFORMED', x: pad + w * 0.75, y: pad + h * 0.75, color: LINE2 },
        ].map((q, i) => (
          <text key={i} x={q.x} y={q.y} textAnchor="middle" fill={q.color} fontSize="6" fontFamily="monospace" opacity="0.35" fontWeight="bold">{q.label}</text>
        ))}
        {/* Axes */}
        <line x1={pad} y1={svgH - pad} x2={svgW - pad} y2={svgH - pad} stroke={DIM} strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={svgH - pad} stroke={DIM} strokeWidth="1" />
        <line x1={pad + w / 2} y1={pad} x2={pad + w / 2} y2={svgH - pad} stroke={DIM} strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1={pad} y1={pad + h / 2} x2={svgW - pad} y2={pad + h / 2} stroke={DIM} strokeWidth="0.5" strokeDasharray="3,3" />
        <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5">INTEREST →</text>
        <text x={10} y={svgH / 2} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5" transform={`rotate(-90, 10, ${svgH / 2})`}>POWER →</text>
        {/* Stakeholders */}
        {stakeholders.map((s, i) => {
          const cx = pad + s.interest * w;
          const cy = svgH - pad - s.power * h;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={6} fill={s.color} opacity="0.2" />
              <circle cx={cx} cy={cy} r={6} fill="none" stroke={s.color} strokeWidth="1"
                style={{ filter: `drop-shadow(0 0 3px ${s.color})` }} />
              <text x={cx} y={cy - 9} textAnchor="middle" fill={s.color} fontSize="5.5" fontFamily="monospace">{s.label}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T13 — Force Field Analysis
// ═══════════════════════════════════════════════════════════════════════════════
export function ForceFieldDiagram() {
  const svgW = 320;
  const svgH = 200;
  const centerX = svgW / 2;
  const driving = [
    { label: 'EXEC SUPPORT', strength: 5 },
    { label: 'COST SAVINGS', strength: 4 },
    { label: 'TECH READINESS', strength: 3 },
  ];
  const restraining = [
    { label: 'RESISTANCE', strength: 4 },
    { label: 'BUDGET LIMIT', strength: 3 },
    { label: 'SKILL GAP', strength: 2 },
  ];

  return (
    <DiagramWrapper label="FORCE FIELD ANALYSIS // T13">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Center line */}
        <line x1={centerX} y1={10} x2={centerX} y2={svgH - 20}
          stroke={LINE} strokeWidth="1.5" style={{ filter: GLOW }} />
        <text x={centerX} y={8} textAnchor="middle" fill={LINE} fontSize="7" fontFamily="monospace">CHANGE</text>
        {/* Labels */}
        <text x={centerX - 10} y={svgH - 8} textAnchor="end" fill={LINE2} fontSize="7" fontFamily="monospace">DRIVING →</text>
        <text x={centerX + 10} y={svgH - 8} textAnchor="start" fill={LINE3} fontSize="7" fontFamily="monospace">← RESTRAINING</text>
        {/* Driving forces */}
        {driving.map((f, i) => {
          const y = 30 + i * 44;
          const len = f.strength * 22;
          return (
            <g key={i}>
              <line x1={centerX - 4} y1={y + 10} x2={centerX - 4 - len} y2={y + 10}
                stroke={LINE2} strokeWidth="2" style={{ filter: GLOW2 }} />
              <polygon points={`${centerX - 4},${y + 6} ${centerX + 6},${y + 10} ${centerX - 4},${y + 14}`}
                fill={LINE2} style={{ filter: GLOW2 }} />
              <text x={centerX - 8 - len} y={y + 14} textAnchor="end" fill={LINE2} fontSize="6.5" fontFamily="monospace">{f.label}</text>
              <text x={centerX - 8} y={y + 14} textAnchor="end" fill={LINE2} fontSize="8" fontFamily="monospace" fontWeight="bold">{f.strength}</text>
            </g>
          );
        })}
        {/* Restraining forces */}
        {restraining.map((f, i) => {
          const y = 30 + i * 44;
          const len = f.strength * 22;
          return (
            <g key={i}>
              <line x1={centerX + 4} y1={y + 10} x2={centerX + 4 + len} y2={y + 10}
                stroke={LINE3} strokeWidth="2" style={{ filter: GLOW3 }} />
              <polygon points={`${centerX + 4},${y + 6} ${centerX - 6},${y + 10} ${centerX + 4},${y + 14}`}
                fill={LINE3} style={{ filter: GLOW3 }} />
              <text x={centerX + 8 + len} y={y + 14} textAnchor="start" fill={LINE3} fontSize="6.5" fontFamily="monospace">{f.label}</text>
              <text x={centerX + 8} y={y + 14} textAnchor="start" fill={LINE3} fontSize="8" fontFamily="monospace" fontWeight="bold">{f.strength}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T14 — Scope Statement
// ═══════════════════════════════════════════════════════════════════════════════
export function ScopeStatementDiagram() {
  const svgW = 320;
  const svgH = 200;
  const sections = [
    { label: 'OBJECTIVES', items: ['Deliver MVP by Q3', 'Meet compliance'], color: LINE, x: 10, y: 10 },
    { label: 'DELIVERABLES', items: ['Software v1.0', 'User docs', 'Training'], color: LINE2, x: 10, y: 90 },
    { label: 'EXCLUSIONS', items: ['Phase 2 features', 'Legacy migration'], color: LINE3, x: 170, y: 10 },
    { label: 'CONSTRAINTS', items: ['Budget: £500k', 'Timeline: 6mo'], color: '#A78BFA', x: 170, y: 110 },
  ];

  return (
    <DiagramWrapper label="SCOPE STATEMENT // T14">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {sections.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width={140} height={75} rx="4"
              fill={s.color} opacity="0.07" />
            <rect x={s.x} y={s.y} width={140} height={75} rx="4"
              fill="none" stroke={s.color} strokeWidth="0.8"
              style={{ filter: `drop-shadow(0 0 3px ${s.color}44)` }} />
            <text x={s.x + 8} y={s.y + 14} fill={s.color} fontSize="7" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <line x1={s.x + 4} y1={s.y + 18} x2={s.x + 136} y2={s.y + 18} stroke={s.color} strokeWidth="0.5" opacity="0.4" />
            {s.items.map((item, ii) => (
              <text key={ii} x={s.x + 10} y={s.y + 32 + ii * 14} fill={LABEL} fontSize="6.5" fontFamily="monospace" opacity="0.8">· {item}</text>
            ))}
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T15 — Delphi Technique
// ═══════════════════════════════════════════════════════════════════════════════
export function DelphiDiagram() {
  const svgW = 320;
  const svgH = 200;
  const rounds = [
    { label: 'ROUND 1', range: [20, 90], median: 55, color: LINE3 },
    { label: 'ROUND 2', range: [35, 75], median: 52, color: LINE },
    { label: 'ROUND 3', range: [44, 62], median: 50, color: LINE2 },
  ];
  const scaleX = (v: number) => 40 + (v / 100) * 240;

  return (
    <DiagramWrapper label="DELPHI TECHNIQUE // T15">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        <text x={svgW / 2} y={16} textAnchor="middle" fill={LABEL} fontSize="8" fontFamily="monospace" opacity="0.6">EXPERT ESTIMATE CONVERGENCE</text>
        {rounds.map((r, i) => {
          const y = 40 + i * 48;
          const x1 = scaleX(r.range[0]);
          const x2 = scaleX(r.range[1]);
          const mx = scaleX(r.median);
          return (
            <g key={i}>
              <text x={36} y={y + 14} textAnchor="end" fill={r.color} fontSize="7" fontFamily="monospace">{r.label}</text>
              {/* Range bar */}
              <rect x={x1} y={y + 4} width={x2 - x1} height={20} rx="3"
                fill={r.color} opacity="0.15" />
              <rect x={x1} y={y + 4} width={x2 - x1} height={20} rx="3"
                fill="none" stroke={r.color} strokeWidth="0.8" />
              {/* Median line */}
              <line x1={mx} y1={y + 2} x2={mx} y2={y + 26}
                stroke={r.color} strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 4px ${r.color})` }} />
              <text x={mx} y={y + 36} textAnchor="middle" fill={r.color} fontSize="6.5" fontFamily="monospace">μ={r.median}</text>
              {/* Range labels */}
              <text x={x1 - 2} y={y + 18} textAnchor="end" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{r.range[0]}</text>
              <text x={x2 + 2} y={y + 18} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{r.range[1]}</text>
            </g>
          );
        })}
        {/* Convergence arrow */}
        <line x1={scaleX(20)} y1={170} x2={scaleX(44)} y2={170} stroke={LINE2} strokeWidth="1" strokeDasharray="3,2" />
        <polygon points={`${scaleX(44)},${166} ${scaleX(44) + 8},${170} ${scaleX(44)},${174}`} fill={LINE2} />
        <text x={scaleX(32)} y={184} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace">CONVERGING</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T16 — Cost-Benefit Analysis
// ═══════════════════════════════════════════════════════════════════════════════
export function CostBenefitDiagram() {
  const svgW = 320;
  const svgH = 200;
  const years = ['Y0', 'Y1', 'Y2', 'Y3', 'Y4'];
  const costs = [80, 20, 15, 10, 8];
  const benefits = [0, 30, 60, 90, 110];
  const cumCost = costs.reduce((acc: number[], v, i) => [...acc, (acc[i - 1] || 0) + v], []);
  const cumBen = benefits.reduce((acc: number[], v, i) => [...acc, (acc[i - 1] || 0) + v], []);
  const maxVal = Math.max(...cumCost, ...cumBen);
  const barW = 40;
  const barMaxH = 130;
  const baseY = svgH - 30;

  return (
    <DiagramWrapper label="COST-BENEFIT ANALYSIS // T16">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {years.map((yr, i) => {
          const x = 30 + i * 56;
          const costH = (cumCost[i] / maxVal) * barMaxH;
          const benH = (cumBen[i] / maxVal) * barMaxH;
          return (
            <g key={i}>
              {/* Cost bar */}
              <rect x={x} y={baseY - costH} width={barW / 2 - 2} height={costH} rx="1"
                fill={LINE3} opacity="0.3" />
              <rect x={x} y={baseY - costH} width={barW / 2 - 2} height={costH} rx="1"
                fill="none" stroke={LINE3} strokeWidth="0.8" />
              {/* Benefit bar */}
              <rect x={x + barW / 2} y={baseY - benH} width={barW / 2 - 2} height={benH} rx="1"
                fill={LINE2} opacity="0.3" />
              <rect x={x + barW / 2} y={baseY - benH} width={barW / 2 - 2} height={benH} rx="1"
                fill="none" stroke={LINE2} strokeWidth="0.8" />
              <text x={x + barW / 2} y={baseY + 10} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace">{yr}</text>
            </g>
          );
        })}
        {/* Breakeven line */}
        {(() => { const beiX = 30 + 2.5 * 56; return (
          <g>
            <line x1={beiX} y1={baseY - barMaxH * 0.5} x2={beiX} y2={baseY}
              stroke={LINE} strokeWidth="1" strokeDasharray="3,2" style={{ filter: GLOW }} />
            <text x={beiX + 3} y={baseY - barMaxH * 0.5 + 8} fill={LINE} fontSize="6.5" fontFamily="monospace">BREAKEVEN</text>
          </g>
        ); })()}
        {/* Legend */}
        <rect x={svgW - 80} y={10} width={10} height={8} fill={LINE3} opacity="0.4" />
        <text x={svgW - 67} y={18} fill={LINE3} fontSize="6.5" fontFamily="monospace">COSTS</text>
        <rect x={svgW - 80} y={22} width={10} height={8} fill={LINE2} opacity="0.4" />
        <text x={svgW - 67} y={30} fill={LINE2} fontSize="6.5" fontFamily="monospace">BENEFITS</text>
        {/* Axis */}
        <line x1={28} y1={baseY} x2={svgW - 10} y2={baseY} stroke={DIM} strokeWidth="1" />
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// T17 — Burndown Chart
// ═══════════════════════════════════════════════════════════════════════════════
export function BurndownDiagram() {
  const svgW = 320;
  const svgH = 190;
  const ideal = [100, 87, 74, 61, 48, 35, 22, 9, 0];
  const actual = [100, 90, 78, 68, 55, 48, 38, 28, 18];
  const sprints = ideal.length;
  const scaleX = (i: number) => 36 + (i / (sprints - 1)) * (svgW - 56);
  const scaleY = (v: number) => svgH - 24 - (v / 100) * (svgH - 44);

  const toPath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(v)}`).join(' ');

  return (
    <DiagramWrapper label="BURNDOWN CHART // T17">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Axes */}
        <line x1={34} y1={svgH - 24} x2={svgW - 10} y2={svgH - 24} stroke={DIM} strokeWidth="1" />
        <line x1={34} y1={10} x2={34} y2={svgH - 24} stroke={DIM} strokeWidth="1" />
        {/* Sprint labels */}
        {ideal.map((_, i) => (
          <text key={i} x={scaleX(i)} y={svgH - 10} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">S{i + 1}</text>
        ))}
        {/* Y axis labels */}
        {[0, 25, 50, 75, 100].map(v => (
          <text key={v} x={30} y={scaleY(v) + 3} textAnchor="end" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">{v}</text>
        ))}
        {/* Ideal line */}
        <path d={toPath(ideal)} fill="none" stroke={LINE} strokeWidth="1.2" strokeDasharray="5,3"
          style={{ filter: GLOW }} />
        {/* Actual line */}
        <path d={toPath(actual)} fill="none" stroke={LINE3} strokeWidth="1.5"
          style={{ filter: GLOW3 }} />
        {/* Area between */}
        <path d={`${toPath(actual)} L${scaleX(sprints - 1)},${scaleY(ideal[sprints - 1])} ${ideal.map((v, i) => `${i === 0 ? '' : 'L'}${scaleX(sprints - 1 - i)},${scaleY(ideal[sprints - 1 - i])}`).join(' ')} Z`}
          fill={LINE3} opacity="0.05" />
        {/* Dots on actual */}
        {actual.map((v, i) => (
          <GlowDot key={i} x={scaleX(i)} y={scaleY(v)} r={2.5} color={LINE3} />
        ))}
        {/* Legend */}
        <line x1={svgW - 80} y1={18} x2={svgW - 66} y2={18} stroke={LINE} strokeWidth="1.2" strokeDasharray="4,2" />
        <text x={svgW - 63} y={22} fill={LINE} fontSize="6.5" fontFamily="monospace">IDEAL</text>
        <line x1={svgW - 80} y1={30} x2={svgW - 66} y2={30} stroke={LINE3} strokeWidth="1.5" />
        <text x={svgW - 63} y={34} fill={LINE3} fontSize="6.5" fontFamily="monospace">ACTUAL</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// M1 — Waterfall Methodology
// ═══════════════════════════════════════════════════════════════════════════════
export function WaterfallDiagram() {
  const svgW = 320;
  const svgH = 200;
  const phases = ['REQUIREMENTS', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT'];
  const colors = [LINE, LINE2, LINE, LINE3, LINE2];

  return (
    <DiagramWrapper label="WATERFALL METHODOLOGY // M1">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {phases.map((phase, i) => {
          const w = svgW - 40 - i * 20;
          const x = 20 + i * 10;
          const y = 16 + i * 34;
          const c = colors[i];
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={26} rx="3" fill={c} opacity="0.12" />
              <rect x={x} y={y} width={w} height={26} rx="3" fill="none" stroke={c} strokeWidth="0.9"
                style={{ filter: `drop-shadow(0 0 3px ${c}66)` }} />
              <text x={x + 10} y={y + 16} fill={c} fontSize="7.5" fontFamily="monospace" fontWeight="bold">{phase}</text>
              {i < phases.length - 1 && (
                <line x1={x + w / 2} y1={y + 26} x2={x + 10 + w / 2} y2={y + 34}
                  stroke={c} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
              )}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// M2 — Agile / Scrum Sprint
// ═══════════════════════════════════════════════════════════════════════════════
export function AgileSprintDiagram() {
  const svgW = 320;
  const svgH = 200;
  const cx = svgW / 2;
  const cy = svgH / 2;
  const rings = [
    { r: 85, label: 'PRODUCT BACKLOG', color: DIM },
    { r: 65, label: 'SPRINT BACKLOG', color: LINE },
    { r: 45, label: 'SPRINT (2 WKS)', color: LINE2 },
    { r: 22, label: 'DAILY\nSCRUM', color: LINE3 },
  ];

  return (
    <DiagramWrapper label="AGILE / SCRUM // M2">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {rings.map((ring, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={ring.r} fill={ring.color} opacity="0.06" />
            <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.color} strokeWidth="0.9"
              style={{ filter: `drop-shadow(0 0 3px ${ring.color}66)` }} />
            {ring.label.split('\n').map((line, li) => (
              <text key={li} x={cx} y={cy - ring.r + 10 + li * 9} textAnchor="middle"
                fill={ring.color} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{line}</text>
            ))}
          </g>
        ))}
        {/* Arrows around outer ring */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const ax = cx + 90 * Math.cos(rad);
          const ay = cy + 90 * Math.sin(rad);
          return <GlowDot key={i} x={ax} y={ay} r={3} color={LINE} />;
        })}
        <text x={cx} y={svgH - 8} textAnchor="middle" fill={LABEL} fontSize="6.5" fontFamily="monospace" opacity="0.5">INSPECT → ADAPT → REPEAT</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// M3 — Kanban Method
// ═══════════════════════════════════════════════════════════════════════════════
export function KanbanMethodDiagram() {
  // Reuse the Kanban board but with flow metrics overlay
  const svgW = 320;
  const svgH = 200;
  const metrics = [
    { label: 'LEAD TIME', value: '8 days', color: LINE3 },
    { label: 'CYCLE TIME', value: '3 days', color: LINE },
    { label: 'THROUGHPUT', value: '4/wk', color: LINE2 },
    { label: 'WIP LIMIT', value: '3 items', color: '#A78BFA' },
  ];

  return (
    <DiagramWrapper label="KANBAN METHOD // M3">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Flow diagram */}
        {['BACKLOG', 'IN PROGRESS', 'REVIEW', 'DONE'].map((col, i) => {
          const x = 10 + i * 76;
          const c = [DIM, LINE, LINE3, LINE2][i];
          return (
            <g key={i}>
              <rect x={x} y={10} width={68} height={100} rx="3" fill={c} opacity="0.06" />
              <rect x={x} y={10} width={68} height={100} rx="3" fill="none" stroke={c} strokeWidth="0.8" />
              <text x={x + 34} y={22} textAnchor="middle" fill={c} fontSize="6" fontFamily="monospace" fontWeight="bold">{col}</text>
              {i === 1 && <text x={x + 34} y={32} textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace" opacity="0.6">WIP: 3</text>}
              {/* Sample cards */}
              {[0, 1].map(ci => (
                <rect key={ci} x={x + 4} y={36 + ci * 28} width={60} height={22} rx="2"
                  fill={c} opacity="0.12" stroke={c} strokeWidth="0.5" />
              ))}
              {/* Flow arrow */}
              {i < 3 && (
                <polygon points={`${x + 72},${60} ${x + 78},${55} ${x + 78},${65}`} fill={c} opacity="0.5" />
              )}
            </g>
          );
        })}
        {/* Metrics */}
        <text x={svgW / 2} y={126} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily="monospace" opacity="0.5">FLOW METRICS</text>
        {metrics.map((m, i) => {
          const x = 10 + i * 76;
          return (
            <g key={i}>
              <rect x={x} y={132} width={68} height={36} rx="3" fill={m.color} opacity="0.08" />
              <rect x={x} y={132} width={68} height={36} rx="3" fill="none" stroke={m.color} strokeWidth="0.7" />
              <text x={x + 34} y={145} textAnchor="middle" fill={m.color} fontSize="5.5" fontFamily="monospace">{m.label}</text>
              <text x={x + 34} y={158} textAnchor="middle" fill={m.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{m.value}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// M4 — Hybrid Methodology
// ═══════════════════════════════════════════════════════════════════════════════
export function HybridDiagram() {
  const svgW = 320;
  const svgH = 200;

  return (
    <DiagramWrapper label="HYBRID METHODOLOGY // M4">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Waterfall phases on left */}
        {['INITIATE', 'PLAN', 'CLOSE'].map((p, i) => (
          <g key={i}>
            <rect x={10} y={20 + i * 56} width={80} height={40} rx="3" fill={LINE} opacity="0.1" />
            <rect x={10} y={20 + i * 56} width={80} height={40} rx="3" fill="none" stroke={LINE} strokeWidth="0.8" />
            <text x={50} y={44 + i * 56} textAnchor="middle" fill={LINE} fontSize="7" fontFamily="monospace" fontWeight="bold">{p}</text>
          </g>
        ))}
        {/* Agile sprints in middle */}
        <text x={160} y={14} textAnchor="middle" fill={LINE2} fontSize="6.5" fontFamily="monospace">AGILE SPRINTS</text>
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <rect x={110} y={22 + i * 38} width={100} height={30} rx="3" fill={LINE2} opacity="0.1" />
            <rect x={110} y={22 + i * 38} width={100} height={30} rx="3" fill="none" stroke={LINE2} strokeWidth="0.7" />
            <text x={160} y={40 + i * 38} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace">SPRINT {i + 1}</text>
          </g>
        ))}
        {/* Connecting arrows */}
        {[0, 1, 2].map(i => (
          <line key={i} x1={90} y1={40 + i * 56} x2={110} y2={37 + i * 38}
            stroke={DIM} strokeWidth="0.8" strokeDasharray="2,2" />
        ))}
        {/* Governance on right */}
        <text x={270} y={14} textAnchor="middle" fill={LINE3} fontSize="6.5" fontFamily="monospace">GOVERNANCE</text>
        {['STAGE GATE', 'RISK REVIEW', 'STEERING', 'BENEFITS'].map((g, i) => (
          <g key={i}>
            <rect x={226} y={22 + i * 38} width={82} height={30} rx="3" fill={LINE3} opacity="0.08" />
            <rect x={226} y={22 + i * 38} width={82} height={30} rx="3" fill="none" stroke={LINE3} strokeWidth="0.6" />
            <text x={267} y={40 + i * 38} textAnchor="middle" fill={LINE3} fontSize="6" fontFamily="monospace">{g}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Project Phases — Setup / Execution / Closure
// ═══════════════════════════════════════════════════════════════════════════════
export function ProjectPhasesDiagram({ phase }: { phase?: string }) {
  const svgW = 320;
  const svgH = 120;
  const phases = [
    { label: 'SETUP', sub: 'Define · Plan · Align', color: LINE, active: phase === 'phase-setup' },
    { label: 'EXECUTION', sub: 'Build · Monitor · Adapt', color: LINE2, active: phase === 'phase-execution' },
    { label: 'CLOSURE', sub: 'Review · Learn · Close', color: LINE3, active: phase === 'phase-closure' },
  ];
  const w = (svgW - 20) / 3;

  return (
    <DiagramWrapper label="PROJECT LIFECYCLE">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {phases.map((p, i) => {
          const x = 8 + i * (w + 2);
          const alpha = p.active ? 1 : 0.5;
          return (
            <g key={i} opacity={alpha}>
              <rect x={x} y={16} width={w - 4} height={svgH - 32} rx="4"
                fill={p.color} opacity="0.12" />
              <rect x={x} y={16} width={w - 4} height={svgH - 32} rx="4"
                fill="none" stroke={p.color} strokeWidth={p.active ? 1.5 : 0.8}
                style={{ filter: p.active ? `drop-shadow(0 0 6px ${p.color})` : undefined }} />
              <text x={x + (w - 4) / 2} y={46} textAnchor="middle" fill={p.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{p.label}</text>
              <text x={x + (w - 4) / 2} y={62} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{p.sub}</text>
              {i < 2 && (
                <polygon points={`${x + w - 2},${svgH / 2 - 6} ${x + w + 4},${svgH / 2} ${x + w - 2},${svgH / 2 + 6}`}
                  fill={p.color} opacity="0.5" />
              )}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Archetyping — AG1/AG2/AG3
// ═══════════════════════════════════════════════════════════════════════════════
export function ArchetypeDiagram() {
  const svgW = 320;
  const svgH = 200;
  const archetypes = [
    { label: 'PREDICTIVE', sub: 'Waterfall / PMBOK', x: 80, y: 60, color: LINE },
    { label: 'ADAPTIVE', sub: 'Agile / Scrum', x: 240, y: 60, color: LINE2 },
    { label: 'HYBRID', sub: 'Mixed approach', x: 160, y: 150, color: LINE3 },
  ];
  const questions = ['Complexity?', 'Uncertainty?', 'Stakeholders?'];

  return (
    <DiagramWrapper label="ARCHETYPING GUIDE">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Triangle */}
        <polygon points="80,60 240,60 160,150" fill="none" stroke={DIM} strokeWidth="0.8" strokeDasharray="4,3" />
        {/* Center assessment */}
        <circle cx={160} cy={90} r={18} fill={LINE} opacity="0.06" />
        <circle cx={160} cy={90} r={18} fill="none" stroke={LINE} strokeWidth="0.8" strokeDasharray="3,2" />
        <text x={160} y={87} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace">ASSESS</text>
        <text x={160} y={97} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace">PROJECT</text>
        {/* Archetype nodes */}
        {archetypes.map((a, i) => (
          <g key={i}>
            <circle cx={a.x} cy={a.y} r={28} fill={a.color} opacity="0.1" />
            <circle cx={a.x} cy={a.y} r={28} fill="none" stroke={a.color} strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 4px ${a.color}66)` }} />
            <text x={a.x} y={a.y - 4} textAnchor="middle" fill={a.color} fontSize="7" fontFamily="monospace" fontWeight="bold">{a.label}</text>
            <text x={a.x} y={a.y + 8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{a.sub}</text>
          </g>
        ))}
        {/* Questions */}
        {questions.map((q, i) => (
          <text key={i} x={svgW - 8} y={20 + i * 14} textAnchor="end" fill={LABEL} fontSize="6.5" fontFamily="monospace" opacity="0.5">? {q}</text>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// People Domain — generic relationship/network diagram
// ═══════════════════════════════════════════════════════════════════════════════
export function PeopleDiagram({ title }: { title?: string }) {
  const svgW = 320;
  const svgH = 180;
  const cx = svgW / 2;
  const cy = svgH / 2;
  const nodes = [
    { label: 'PM', x: cx, y: cy, r: 18, color: LINE, main: true },
    { label: 'TEAM', x: cx - 80, y: cy - 40, r: 13, color: LINE2 },
    { label: 'SPONSOR', x: cx + 80, y: cy - 40, r: 13, color: LINE3 },
    { label: 'STAKEHOLDERS', x: cx - 70, y: cy + 55, r: 13, color: '#A78BFA' },
    { label: 'VENDORS', x: cx + 70, y: cy + 55, r: 13, color: LINE },
  ];

  return (
    <DiagramWrapper label={title ? `PEOPLE // ${title}` : 'PEOPLE DOMAIN'}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {nodes.slice(1).map((n, i) => (
          <line key={i} x1={cx} y1={cy} x2={n.x} y2={n.y}
            stroke={n.color} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
        ))}
        {nodes.map(n => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={n.main ? 0.15 : 0.1} />
            <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.color} strokeWidth={n.main ? 1.5 : 0.9}
              style={{ filter: `drop-shadow(0 0 ${n.main ? 5 : 3}px ${n.color})` }} />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fill={n.color} fontSize={n.main ? 7.5 : 6} fontFamily="monospace" fontWeight="bold">{n.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Process Domain — generic process flow diagram
// ═══════════════════════════════════════════════════════════════════════════════
export function ProcessDiagram({ title }: { title?: string }) {
  const svgW = 320;
  const svgH = 160;
  const steps = ['INPUT', 'PLAN', 'EXECUTE', 'CONTROL', 'OUTPUT'];
  const colors = [DIM, LINE, LINE2, LINE3, LINE2];
  const stepW = (svgW - 20) / steps.length;

  return (
    <DiagramWrapper label={title ? `PROCESS // ${title}` : 'PROCESS DOMAIN'}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {steps.map((s, i) => {
          const x = 10 + i * stepW;
          const c = colors[i];
          return (
            <g key={i}>
              <rect x={x + 2} y={svgH / 2 - 22} width={stepW - 8} height={44} rx="3"
                fill={c} opacity="0.12" />
              <rect x={x + 2} y={svgH / 2 - 22} width={stepW - 8} height={44} rx="3"
                fill="none" stroke={c} strokeWidth="0.9"
                style={{ filter: `drop-shadow(0 0 3px ${c}66)` }} />
              <text x={x + stepW / 2 - 2} y={svgH / 2 + 4} textAnchor="middle"
                fill={c} fontSize="7" fontFamily="monospace" fontWeight="bold">{s}</text>
              {i < steps.length - 1 && (
                <polygon points={`${x + stepW - 4},${svgH / 2 - 5} ${x + stepW + 2},${svgH / 2} ${x + stepW - 4},${svgH / 2 + 5}`}
                  fill={c} opacity="0.6" />
              )}
            </g>
          );
        })}
        {/* Feedback loop */}
        <path d={`M${10 + 4 * stepW + stepW / 2},${svgH / 2 + 22} Q${svgW / 2},${svgH - 14} ${10 + stepW / 2},${svgH / 2 + 22}`}
          fill="none" stroke={LINE} strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
        <text x={svgW / 2} y={svgH - 4} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace" opacity="0.4">FEEDBACK LOOP</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Business Environment
// ═══════════════════════════════════════════════════════════════════════════════
export function BusinessEnvDiagram() {
  const svgW = 320;
  const svgH = 190;
  const layers = [
    { label: 'MACRO ENVIRONMENT', sub: 'PESTLE · Regulations · Market', r: 90, color: DIM },
    { label: 'INDUSTRY', sub: 'Competitors · Partners', r: 65, color: LINE },
    { label: 'ORGANISATION', sub: 'Strategy · Culture', r: 42, color: LINE2 },
    { label: 'PROJECT', sub: 'Scope · Team', r: 20, color: LINE3 },
  ];
  const cx = svgW / 2;
  const cy = svgH / 2;

  return (
    <DiagramWrapper label="BUSINESS ENVIRONMENT">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {layers.map((l, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={l.r} fill={l.color} opacity="0.06" />
            <circle cx={cx} cy={cy} r={l.r} fill="none" stroke={l.color} strokeWidth="0.9"
              style={{ filter: `drop-shadow(0 0 3px ${l.color}55)` }} />
            <text x={cx} y={cy - l.r + 12} textAnchor="middle" fill={l.color} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{l.label}</text>
            <text x={cx} y={cy - l.r + 22} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{l.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Advanced Techniques — generic technique diagram (radar chart style)
// ═══════════════════════════════════════════════════════════════════════════════
export function TechniqueDiagram({ title, axes }: { title?: string; axes?: string[] }) {
  const svgW = 320;
  const svgH = 200;
  const cx = svgW / 2;
  const cy = svgH / 2 + 5;
  const defaultAxes = ['IMPACT', 'EFFORT', 'RISK', 'VALUE', 'TIME', 'QUALITY'];
  const labels = axes || defaultAxes;
  const n = labels.length;
  const R = 72;
  const r = 45;
  const points = labels.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  });
  const innerPoints = labels.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const scale = 0.4 + Math.random() * 0.5;
    return { x: cx + R * scale * Math.cos(angle), y: cy + R * scale * Math.sin(angle) };
  });
  const outerPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  const innerPath = innerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <DiagramWrapper label={title ? `TECHNIQUE // ${title}` : 'ADVANCED TECHNIQUE'}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Rings */}
        {[0.33, 0.66, 1].map((scale, ri) => (
          <polygon key={ri}
            points={points.map(p => `${cx + (p.x - cx) * scale},${cy + (p.y - cy) * scale}`).join(' ')}
            fill="none" stroke={DIM} strokeWidth="0.6" opacity="0.5" />
        ))}
        {/* Spokes */}
        {points.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={DIM} strokeWidth="0.6" opacity="0.4" />
        ))}
        {/* Data area */}
        <path d={innerPath} fill={LINE} opacity="0.12" />
        <path d={innerPath} fill="none" stroke={LINE} strokeWidth="1.2"
          style={{ filter: GLOW }} />
        {/* Outer polygon */}
        <path d={outerPath} fill="none" stroke={DIM} strokeWidth="0.8" opacity="0.3" />
        {/* Labels */}
        {points.map((p, i) => {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const len = Math.sqrt(dx * dx + dy * dy);
          const lx = cx + (dx / len) * (R + 14);
          const ly = cy + (dy / len) * (R + 14);
          return (
            <text key={i} x={lx} y={ly + 3} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace">{labels[i]}</text>
          );
        })}
        {/* Center dot */}
        <GlowDot x={cx} y={cy} r={3} color={LINE} />
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A1 — Principled Negotiation (Interest vs Position matrix)
// ═══════════════════════════════════════════════════════════════════════════════
export function NegotiationDiagram() {
  const svgW = 320; const svgH = 200;
  return (
    <DiagramWrapper label="PRINCIPLED NEGOTIATION // A1">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Two party boxes */}
        <rect x={10} y={20} width={110} height={50} rx="4" fill={LINE} opacity="0.1" />
        <rect x={10} y={20} width={110} height={50} rx="4" fill="none" stroke={LINE} strokeWidth="1" style={{ filter: GLOW }} />
        <text x={65} y={40} textAnchor="middle" fill={LINE} fontSize="8" fontFamily="monospace" fontWeight="bold">PARTY A</text>
        <text x={65} y={55} textAnchor="middle" fill={LABEL} fontSize="6.5" fontFamily="monospace">Position: Higher price</text>
        <text x={65} y={65} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace">Interest: Cash flow</text>
        <rect x={200} y={20} width={110} height={50} rx="4" fill={LINE3} opacity="0.1" />
        <rect x={200} y={20} width={110} height={50} rx="4" fill="none" stroke={LINE3} strokeWidth="1" style={{ filter: GLOW3 }} />
        <text x={255} y={40} textAnchor="middle" fill={LINE3} fontSize="8" fontFamily="monospace" fontWeight="bold">PARTY B</text>
        <text x={255} y={55} textAnchor="middle" fill={LABEL} fontSize="6.5" fontFamily="monospace">Position: Lower cost</text>
        <text x={255} y={65} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace">Interest: Budget</text>
        {/* Arrow to ZOPA */}
        <line x1={120} y1={45} x2={200} y2={45} stroke={DIM} strokeWidth="1" strokeDasharray="4,3" />
        <polygon points="196,41 204,45 196,49" fill={DIM} />
        {/* ZOPA box */}
        <rect x={100} y={90} width={120} height={40} rx="4" fill={LINE2} opacity="0.12" />
        <rect x={100} y={90} width={120} height={40} rx="4" fill="none" stroke={LINE2} strokeWidth="1.2" style={{ filter: GLOW2 }} />
        <text x={160} y={107} textAnchor="middle" fill={LINE2} fontSize="8" fontFamily="monospace" fontWeight="bold">ZOPA</text>
        <text x={160} y={120} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace">Zone of Possible Agreement</text>
        {/* 4 principles */}
        {['SEPARATE PEOPLE', 'FOCUS INTERESTS', 'INVENT OPTIONS', 'USE CRITERIA'].map((p, i) => (
          <g key={i}>
            <rect x={10 + i * 76} y={148} width={70} height={36} rx="3" fill={LINE} opacity="0.07" />
            <rect x={10 + i * 76} y={148} width={70} height={36} rx="3" fill="none" stroke={LINE} strokeWidth="0.7" opacity="0.5" />
            <text x={45 + i * 76} y={162} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace">{p.split(' ')[0]}</text>
            <text x={45 + i * 76} y={174} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{p.split(' ')[1]}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A2 — Tuckman's Ladder
// ═══════════════════════════════════════════════════════════════════════════════
export function TuckmanDiagram() {
  const svgW = 320; const svgH = 180;
  const stages = [
    { label: 'FORMING', sub: 'Orientation', color: DIM, x: 40 },
    { label: 'STORMING', sub: 'Conflict', color: LINE3, x: 110 },
    { label: 'NORMING', sub: 'Cohesion', color: LINE, x: 180 },
    { label: 'PERFORMING', sub: 'High output', color: LINE2, x: 250 },
  ];
  const perf = [20, 40, 70, 95];
  return (
    <DiagramWrapper label="TUCKMAN'S LADDER // A2">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Performance curve */}
        <polyline points={stages.map((s, i) => `${s.x},${140 - perf[i]}`).join(' ')}
          fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="4,2"
          style={{ filter: GLOW }} />
        {stages.map((s, i) => (
          <g key={i}>
            <line x1={s.x} y1={20} x2={s.x} y2={150} stroke={s.color} strokeWidth="0.6" strokeDasharray="3,3" opacity="0.4" />
            <rect x={s.x - 30} y={152} width={60} height={22} rx="3" fill={s.color} opacity="0.12" />
            <rect x={s.x - 30} y={152} width={60} height={22} rx="3" fill="none" stroke={s.color} strokeWidth="0.8" />
            <text x={s.x} y={162} textAnchor="middle" fill={s.color} fontSize="6" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={s.x} y={170} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
            <GlowDot x={s.x} y={140 - perf[i]} r={3} color={s.color} />
          </g>
        ))}
        <text x={8} y={25} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">PERFORMANCE</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A17/A77 — Risk Matrix (Probability × Impact)
// ═══════════════════════════════════════════════════════════════════════════════
export function RiskMatrixDiagram() {
  const svgW = 320; const svgH = 200;
  const cells = [
    [LINE2, LINE2, LINE3],
    [LINE2, LINE3, LINE3],
    [LINE3, LINE3, '#FF2244'],
  ];
  const risks = [
    { label: 'Supply delay', px: 200, py: 80 },
    { label: 'Reg. rejection', px: 240, py: 50 },
    { label: 'Budget overrun', px: 160, py: 120 },
  ];
  const cellW = 70; const cellH = 50; const ox = 60; const oy = 20;
  return (
    <DiagramWrapper label="PROBABILITY × IMPACT MATRIX">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {cells.map((row, ri) =>
          row.map((c, ci) => (
            <g key={`${ri}-${ci}`}>
              <rect x={ox + ci * cellW} y={oy + ri * cellH} width={cellW} height={cellH}
                fill={c} opacity={0.08 + ri * 0.04 + ci * 0.04} />
              <rect x={ox + ci * cellW} y={oy + ri * cellH} width={cellW} height={cellH}
                fill="none" stroke={c} strokeWidth="0.6" opacity="0.4" />
            </g>
          ))
        )}
        {/* Axis labels */}
        {['LOW', 'MED', 'HIGH'].map((l, i) => (
          <text key={i} x={ox + i * cellW + cellW / 2} y={oy + 3 * cellH + 12}
            textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{l}</text>
        ))}
        {['LOW', 'MED', 'HIGH'].map((l, i) => (
          <text key={i} x={ox - 6} y={oy + (2 - i) * cellH + cellH / 2 + 3}
            textAnchor="end" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{l}</text>
        ))}
        <text x={ox + 105} y={oy + 3 * cellH + 22} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">IMPACT →</text>
        <text x={ox - 18} y={oy + 75} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5"
          transform={`rotate(-90, ${ox - 18}, ${oy + 75})`}>PROBABILITY →</text>
        {/* Risk dots */}
        {risks.map((r, i) => (
          <g key={i}>
            <GlowDot x={r.px} y={r.py} r={4} color={LINE3} />
            <text x={r.px + 7} y={r.py + 3} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{r.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A21 — Six Sigma DMAIC
// ═══════════════════════════════════════════════════════════════════════════════
export function DMAICDiagram() {
  const svgW = 320; const svgH = 160;
  const steps = [
    { label: 'DEFINE', sub: 'Problem', color: LINE3 },
    { label: 'MEASURE', sub: 'Baseline', color: LINE },
    { label: 'ANALYSE', sub: 'Root cause', color: LINE2 },
    { label: 'IMPROVE', sub: 'Solutions', color: LINE },
    { label: 'CONTROL', sub: 'Sustain', color: LINE2 },
  ];
  const w = (svgW - 20) / 5;
  return (
    <DiagramWrapper label="SIX SIGMA DMAIC // A21">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {steps.map((s, i) => {
          const x = 10 + i * (w + 2);
          return (
            <g key={i}>
              <rect x={x} y={30} width={w - 2} height={80} rx="4"
                fill={s.color} opacity="0.1" />
              <rect x={x} y={30} width={w - 2} height={80} rx="4"
                fill="none" stroke={s.color} strokeWidth="1"
                style={{ filter: `drop-shadow(0 0 4px ${s.color}66)` }} />
              <text x={x + (w - 2) / 2} y={56} textAnchor="middle" fill={s.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{s.label[0]}</text>
              <text x={x + (w - 2) / 2} y={80} textAnchor="middle" fill={s.color} fontSize="6" fontFamily="monospace">{s.label}</text>
              <text x={x + (w - 2) / 2} y={96} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
              {i < 4 && <polygon points={`${x + w},${70} ${x + w + 4},${65} ${x + w + 4},${75}`} fill={s.color} opacity="0.6" />}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A35 — Kotter's 8 Steps
// ═══════════════════════════════════════════════════════════════════════════════
export function KotterDiagram() {
  const svgW = 320; const svgH = 200;
  const steps = [
    'CREATE URGENCY', 'FORM COALITION', 'BUILD VISION', 'COMMUNICATE',
    'EMPOWER ACTION', 'SHORT-TERM WINS', 'BUILD ON GAINS', 'ANCHOR CULTURE',
  ];
  const colors = [LINE3, LINE3, LINE, LINE, LINE2, LINE2, LINE, LINE2];
  return (
    <DiagramWrapper label="KOTTER'S 8 STEPS // A35">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {steps.map((s, i) => {
          const col = i % 2; const row = Math.floor(i / 2);
          const x = 10 + col * 154; const y = 14 + row * 44;
          return (
            <g key={i}>
              <rect x={x} y={y} width={144} height={34} rx="3" fill={colors[i]} opacity="0.1" />
              <rect x={x} y={y} width={144} height={34} rx="3" fill="none" stroke={colors[i]} strokeWidth="0.8" />
              <text x={x + 8} y={y + 13} fill={colors[i]} fontSize="7.5" fontFamily="monospace" fontWeight="bold">{i + 1}</text>
              <text x={x + 22} y={y + 13} fill={colors[i]} fontSize="6.5" fontFamily="monospace">{s.split(' ')[0]}</text>
              <text x={x + 22} y={y + 24} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{s.split(' ').slice(1).join(' ')}</text>
              {i < 7 && (
                <polygon
                  points={col === 0
                    ? `${x + 148},${y + 17} ${x + 154},${y + 17} ${x + 151},${y + 21}`
                    : `${x + 72},${y + 34} ${x + 76},${y + 40} ${x + 68},${y + 40}`}
                  fill={colors[i]} opacity="0.5" />
              )}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A39 — SWOT Analysis
// ═══════════════════════════════════════════════════════════════════════════════
export function SWOTDiagram() {
  const svgW = 320; const svgH = 200;
  const quads = [
    { label: 'STRENGTHS', sub: 'Internal · Positive', color: LINE2, x: 10, y: 10 },
    { label: 'WEAKNESSES', sub: 'Internal · Negative', color: LINE3, x: 164, y: 10 },
    { label: 'OPPORTUNITIES', sub: 'External · Positive', color: LINE, x: 10, y: 104 },
    { label: 'THREATS', sub: 'External · Negative', color: '#FF2244', x: 164, y: 104 },
  ];
  return (
    <DiagramWrapper label="SWOT ANALYSIS // A39">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {quads.map((q, i) => (
          <g key={i}>
            <rect x={q.x} y={q.y} width={146} height={88} rx="4" fill={q.color} opacity="0.08" />
            <rect x={q.x} y={q.y} width={146} height={88} rx="4" fill="none" stroke={q.color} strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 4px ${q.color}44)` }} />
            <text x={q.x + 73} y={q.y + 28} textAnchor="middle" fill={q.color} fontSize="9" fontFamily="monospace" fontWeight="bold">{q.label}</text>
            <text x={q.x + 73} y={q.y + 42} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{q.sub}</text>
          </g>
        ))}
        {/* Center cross */}
        <line x1={160} y1={10} x2={160} y2={192} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <line x1={10} y1={100} x2={310} y2={100} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <text x={10} y={8} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">INTERNAL</text>
        <text x={164} y={8} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">EXTERNAL</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A47 — PDCA Cycle
// ═══════════════════════════════════════════════════════════════════════════════
export function PDCADiagram() {
  const svgW = 320; const svgH = 200;
  const cx = 160; const cy = 100; const R = 70;
  const quads = [
    { label: 'PLAN', sub: 'Identify & plan', color: LINE, angle: -135 },
    { label: 'DO', sub: 'Implement', color: LINE2, angle: -45 },
    { label: 'CHECK', sub: 'Measure results', color: LINE3, angle: 45 },
    { label: 'ACT', sub: 'Standardise', color: LINE, angle: 135 },
  ];
  return (
    <DiagramWrapper label="PDCA CYCLE // A47">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={DIM} strokeWidth="1" opacity="0.3" />
        {quads.map((q, i) => {
          const a = (q.angle * Math.PI) / 180;
          const lx = cx + (R + 20) * Math.cos(a);
          const ly = cy + (R + 20) * Math.sin(a);
          const nx = cx + R * Math.cos(a);
          const ny = cy + R * Math.sin(a);
          return (
            <g key={i}>
              <circle cx={nx} cy={ny} r={18} fill={q.color} opacity="0.12" />
              <circle cx={nx} cy={ny} r={18} fill="none" stroke={q.color} strokeWidth="1.2"
                style={{ filter: `drop-shadow(0 0 5px ${q.color})` }} />
              <text x={nx} y={ny + 3} textAnchor="middle" fill={q.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{q.label}</text>
            </g>
          );
        })}
        {/* Rotation arrow */}
        <path d={`M ${cx + R - 10},${cy - 5} A ${R},${R} 0 0 1 ${cx + 5},${cy - R + 10}`}
          fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="4,3"
          style={{ filter: GLOW }} />
        <polygon points={`${cx + 5},${cy - R + 4} ${cx + 10},${cy - R + 14} ${cx - 2},${cy - R + 14}`} fill={LINE} opacity="0.6" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill={LINE} fontSize="7" fontFamily="monospace" opacity="0.5">ITERATE</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A75 — ADKAR Model
// ═══════════════════════════════════════════════════════════════════════════════
export function ADKARDiagram() {
  const svgW = 320; const svgH = 160;
  const steps = [
    { label: 'AWARENESS', sub: 'Why change?', color: LINE3 },
    { label: 'DESIRE', sub: 'Want to?', color: LINE },
    { label: 'KNOWLEDGE', sub: 'How to?', color: LINE2 },
    { label: 'ABILITY', sub: 'Can do?', color: LINE },
    { label: 'REINFORCEMENT', sub: 'Sustain', color: LINE2 },
  ];
  const w = (svgW - 20) / 5;
  return (
    <DiagramWrapper label="ADKAR MODEL // A75">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {steps.map((s, i) => {
          const x = 10 + i * (w + 2);
          return (
            <g key={i}>
              <rect x={x} y={30} width={w - 2} height={80} rx="4"
                fill={s.color} opacity="0.1" />
              <rect x={x} y={30} width={w - 2} height={80} rx="4"
                fill="none" stroke={s.color} strokeWidth="1"
                style={{ filter: `drop-shadow(0 0 4px ${s.color}66)` }} />
              <text x={x + (w - 2) / 2} y={56} textAnchor="middle" fill={s.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{s.label[0]}</text>
              <text x={x + (w - 2) / 2} y={80} textAnchor="middle" fill={s.color} fontSize="5.5" fontFamily="monospace">{s.label}</text>
              <text x={x + (w - 2) / 2} y={96} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
              {i < 4 && <polygon points={`${x + w},${70} ${x + w + 4},${65} ${x + w + 4},${75}`} fill={s.color} opacity="0.6" />}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A29 — 5 Whys (drill-down chain)
// ═══════════════════════════════════════════════════════════════════════════════
export function FiveWhysDiagram() {
  const svgW = 320; const svgH = 200;
  const levels = [
    { label: 'PROBLEM', sub: 'Labels smudge', color: LINE3, y: 18 },
    { label: 'WHY 1', sub: 'Ink not dry', color: LINE3, y: 52 },
    { label: 'WHY 2', sub: 'Speed too high', color: LINE, y: 86 },
    { label: 'WHY 3', sub: 'No speed check', color: LINE, y: 120 },
    { label: 'WHY 4', sub: 'No SOP defined', color: LINE2, y: 154 },
    { label: 'ROOT CAUSE', sub: 'Process gap', color: LINE2, y: 188 },
  ];
  return (
    <DiagramWrapper label="5 WHYS ROOT CAUSE // A29">
      <svg viewBox={`0 0 ${svgW} ${svgH + 10}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH + 10} />
        {levels.map((l, i) => (
          <g key={i}>
            {i > 0 && (
              <line x1={160} y1={levels[i - 1].y + 14} x2={160} y2={l.y - 2}
                stroke={l.color} strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={60} y={l.y - 10} width={200} height={22} rx="3"
              fill={l.color} opacity={i === 0 || i === 5 ? 0.18 : 0.08} />
            <rect x={60} y={l.y - 10} width={200} height={22} rx="3"
              fill="none" stroke={l.color} strokeWidth={i === 5 ? 1.5 : 0.8} />
            <text x={80} y={l.y + 4} fill={l.color} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{l.label}</text>
            <text x={200} y={l.y + 4} textAnchor="end" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.7">{l.sub}</text>
            {i < 5 && <text x={50} y={l.y + 4} textAnchor="end" fill={l.color} fontSize="8" fontFamily="monospace" opacity="0.5">?</text>}
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH + 6} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A38 — Pareto Chart
// ═══════════════════════════════════════════════════════════════════════════════
export function ParetoDiagram() {
  const svgW = 320; const svgH = 200;
  const bars = [
    { label: 'Label error', pct: 38, cum: 38 },
    { label: 'Print smudge', pct: 24, cum: 62 },
    { label: 'Wrong font', pct: 18, cum: 80 },
    { label: 'Colour mismatch', pct: 12, cum: 92 },
    { label: 'Other', pct: 8, cum: 100 },
  ];
  const barW = 44; const maxH = 120; const ox = 40; const oy = 160;
  return (
    <DiagramWrapper label="PARETO CHART // A38">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* 80% line */}
        <line x1={ox} y1={oy - maxH * 0.8} x2={svgW - 20} y2={oy - maxH * 0.8}
          stroke={LINE3} strokeWidth="0.8" strokeDasharray="4,3" opacity="0.6" />
        <text x={svgW - 18} y={oy - maxH * 0.8 + 4} fill={LINE3} fontSize="6" fontFamily="monospace" opacity="0.7">80%</text>
        {bars.map((b, i) => {
          const x = ox + i * (barW + 4);
          const h = (b.pct / 100) * maxH;
          return (
            <g key={i}>
              <rect x={x} y={oy - h} width={barW} height={h} rx="2"
                fill={i < 3 ? LINE3 : DIM} opacity={0.3 - i * 0.04} />
              <rect x={x} y={oy - h} width={barW} height={h} rx="2"
                fill="none" stroke={i < 3 ? LINE3 : DIM} strokeWidth="0.8" />
              <text x={x + barW / 2} y={oy - h - 4} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace">{b.pct}%</text>
              <text x={x + barW / 2} y={oy + 10} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{b.label.split(' ')[0]}</text>
            </g>
          );
        })}
        {/* Cumulative line */}
        <polyline
          points={bars.map((b, i) => `${ox + i * (barW + 4) + barW / 2},${oy - (b.cum / 100) * maxH}`).join(' ')}
          fill="none" stroke={LINE} strokeWidth="1.2" style={{ filter: GLOW }} />
        {bars.map((b, i) => (
          <GlowDot key={i} x={ox + i * (barW + 4) + barW / 2} y={oy - (b.cum / 100) * maxH} r={2.5} color={LINE} />
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A40 — WSJF Prioritisation
// ═══════════════════════════════════════════════════════════════════════════════
export function WSJFDiagram() {
  const svgW = 320; const svgH = 200;
  const items = [
    { label: 'Critical fix', cod: 10, size: 1, wsjf: 10.0, color: LINE2 },
    { label: 'New feature A', cod: 8, size: 3, wsjf: 2.7, color: LINE },
    { label: 'Compliance update', cod: 9, size: 4, wsjf: 2.3, color: LINE },
    { label: 'UI refresh', cod: 4, size: 5, wsjf: 0.8, color: DIM },
    { label: 'Nice-to-have', cod: 2, size: 8, wsjf: 0.3, color: DIM },
  ];
  return (
    <DiagramWrapper label="WSJF PRIORITISATION // A40">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Header */}
        {['FEATURE', 'CoD', 'SIZE', 'WSJF'].map((h, i) => (
          <text key={i} x={[10, 140, 190, 250][i]} y={22} fill={LINE} fontSize="7" fontFamily="monospace" fontWeight="bold" opacity="0.7">{h}</text>
        ))}
        <line x1={8} y1={26} x2={312} y2={26} stroke={LINE} strokeWidth="0.5" opacity="0.3" />
        {items.map((item, i) => (
          <g key={i}>
            <rect x={8} y={30 + i * 30} width={304} height={26} rx="2"
              fill={item.color} opacity={i === 0 ? 0.12 : 0.04} />
            <text x={14} y={47 + i * 30} fill={item.color} fontSize="7" fontFamily="monospace">{item.label}</text>
            <text x={148} y={47 + i * 30} fill={LABEL} fontSize="7" fontFamily="monospace">{item.cod}</text>
            <text x={196} y={47 + i * 30} fill={LABEL} fontSize="7" fontFamily="monospace">{item.size}</text>
            <text x={256} y={47 + i * 30} fill={item.color} fontSize="8" fontFamily="monospace" fontWeight="bold">{item.wsjf}</text>
            {i === 0 && <rect x={8} y={30} width={304} height={26} rx="2" fill="none" stroke={LINE2} strokeWidth="0.8" style={{ filter: GLOW2 }} />}
          </g>
        ))}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A55 — Porter's Five Forces
// ═══════════════════════════════════════════════════════════════════════════════
export function FiveForcesD() {
  const svgW = 320; const svgH = 200;
  const cx = 160; const cy = 100;
  const forces = [
    { label: 'NEW ENTRANTS', sub: 'Threat', color: LINE3, x: cx, y: 20 },
    { label: 'SUPPLIERS', sub: 'Bargaining', color: LINE, x: 30, y: cy },
    { label: 'BUYERS', sub: 'Bargaining', color: LINE, x: 290, y: cy },
    { label: 'SUBSTITUTES', sub: 'Threat', color: LINE3, x: cx, y: 180 },
  ];
  return (
    <DiagramWrapper label="PORTER'S FIVE FORCES // A55">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {/* Center */}
        <rect x={cx - 45} y={cy - 22} width={90} height={44} rx="4" fill={LINE2} opacity="0.12" />
        <rect x={cx - 45} y={cy - 22} width={90} height={44} rx="4" fill="none" stroke={LINE2} strokeWidth="1.2" style={{ filter: GLOW2 }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={LINE2} fontSize="7.5" fontFamily="monospace" fontWeight="bold">COMPETITIVE</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={LINE2} fontSize="7.5" fontFamily="monospace" fontWeight="bold">RIVALRY</text>
        {forces.map((f, i) => {
          const dx = f.x - cx; const dy = f.y - cy;
          const len = Math.sqrt(dx * dx + dy * dy);
          const ex = cx + (dx / len) * 46; const ey = cy + (dy / len) * 22;
          return (
            <g key={i}>
              <line x1={ex} y1={ey} x2={f.x} y2={f.y} stroke={f.color} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
              <rect x={f.x - 38} y={f.y - 14} width={76} height={28} rx="3"
                fill={f.color} opacity="0.1" />
              <rect x={f.x - 38} y={f.y - 14} width={76} height={28} rx="3"
                fill="none" stroke={f.color} strokeWidth="0.8" />
              <text x={f.x} y={f.y - 2} textAnchor="middle" fill={f.color} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{f.label}</text>
              <text x={f.x} y={f.y + 10} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{f.sub}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// A58 — BCG Matrix
// ═══════════════════════════════════════════════════════════════════════════════
export function BCGDiagram() {
  const svgW = 320; const svgH = 200;
  const quads = [
    { label: 'STAR', sub: 'High growth · High share', color: LINE2, x: 164, y: 10 },
    { label: 'QUESTION MARK', sub: 'High growth · Low share', color: LINE, x: 10, y: 10 },
    { label: 'CASH COW', sub: 'Low growth · High share', color: LINE3, x: 164, y: 104 },
    { label: 'DOG', sub: 'Low growth · Low share', color: DIM, x: 10, y: 104 },
  ];
  return (
    <DiagramWrapper label="BCG MATRIX // A58">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={svgW} h={svgH} />
        {quads.map((q, i) => (
          <g key={i}>
            <rect x={q.x} y={q.y} width={146} height={88} rx="4" fill={q.color} opacity="0.08" />
            <rect x={q.x} y={q.y} width={146} height={88} rx="4" fill="none" stroke={q.color} strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 4px ${q.color}44)` }} />
            <text x={q.x + 73} y={q.y + 28} textAnchor="middle" fill={q.color} fontSize="9" fontFamily="monospace" fontWeight="bold">{q.label}</text>
            <text x={q.x + 73} y={q.y + 44} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{q.sub.split(' · ')[0]}</text>
            <text x={q.x + 73} y={q.y + 56} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{q.sub.split(' · ')[1]}</text>
          </g>
        ))}
        <line x1={160} y1={10} x2={160} y2={192} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <line x1={10} y1={100} x2={310} y2={100} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <text x={10} y={8} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">HIGH GROWTH →</text>
        <text x={164} y={8} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">HIGH SHARE →</text>
        <Brackets x={2} y={2} w={svgW - 4} h={svgH - 4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE DIAGRAMS — People Domain (P01-P14)
// ═══════════════════════════════════════════════════════════════════════════════

// P01 — Manage Conflict: Conflict resolution spectrum
export function ConflictDiagram() {
  const W = 320; const H = 180;
  const modes = [
    { label: 'AVOID', sub: 'Low concern', x: 30, y: 90, c: DIM },
    { label: 'ACCOMMODATE', sub: 'Yield', x: 90, y: 140, c: LABEL },
    { label: 'COMPROMISE', sub: 'Middle ground', x: 160, y: 90, c: LINE },
    { label: 'COLLABORATE', sub: 'Win-Win', x: 230, y: 40, c: LINE2 },
    { label: 'COMPETE', sub: 'Assert', x: 290, y: 90, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="CONFLICT RESOLUTION MODES // P01">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={10} y={12} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">CONCERN FOR SELF →</text>
        <text x={10} y={H - 4} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">CONCERN FOR OTHERS ↑</text>
        {modes.map((m, i) => (
          <g key={i}>
            {i > 0 && <line x1={modes[i-1].x} y1={modes[i-1].y} x2={m.x} y2={m.y} stroke={m.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />}
            <circle cx={m.x} cy={m.y} r={18} fill={m.c} opacity="0.1" />
            <circle cx={m.x} cy={m.y} r={18} fill="none" stroke={m.c} strokeWidth="1" style={{ filter: `drop-shadow(0 0 4px ${m.c}66)` }} />
            <text x={m.x} y={m.y - 2} textAnchor="middle" fill={m.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{m.label}</text>
            <text x={m.x} y={m.y + 9} textAnchor="middle" fill={LABEL} fontSize="4.5" fontFamily="monospace" opacity="0.6">{m.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P02 — Lead a Team: Tuckman stages + RACI
export function TeamLeadDiagram() {
  const W = 320; const H = 180;
  const stages = ['FORMING','STORMING','NORMING','PERFORMING','ADJOURNING'];
  const colors = [LABEL, LINE3, LINE, LINE2, DIM];
  const xs = [30, 90, 160, 230, 295];
  const ys = [140, 110, 80, 50, 80];
  return (
    <DiagramWrapper label="TEAM DEVELOPMENT STAGES // P02">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={xs.map((x,i)=>`${x},${ys[i]}`).join(' ')} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="4,2" opacity="0.3" />
        {stages.map((s, i) => (
          <g key={i}>
            <GlowDot x={xs[i]} y={ys[i]} r={5} color={colors[i]} />
            <text x={xs[i]} y={ys[i] - 10} textAnchor="middle" fill={colors[i]} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{s}</text>
            <line x1={xs[i]} y1={ys[i]+5} x2={xs[i]} y2={H-20} stroke={colors[i]} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
          </g>
        ))}
        <text x={10} y={H-6} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.5">RACI: R=Responsible · A=Accountable · C=Consulted · I=Informed</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P03 — Support Team Performance: Impediment removal flow
export function TeamSupportDiagram() {
  const W = 320; const H = 180;
  const steps = [
    { label: 'DETECT', sub: 'Velocity drop', x: 40, c: LINE3 },
    { label: 'DIAGNOSE', sub: 'Root cause', x: 110, c: LINE },
    { label: 'CLEAR', sub: 'Remove blocker', x: 180, c: LINE2 },
    { label: 'COACH', sub: 'Skill gap', x: 250, c: LINE },
    { label: 'RECOGNISE', sub: 'Celebrate win', x: 295, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="PERFORMANCE SUPPORT CYCLE // P03">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={s.x + 28} y1={90} x2={steps[i+1].x - 28} y2={90} stroke={s.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={s.x - 28} y={72} width={56} height={36} rx="4" fill={s.c} opacity="0.1" />
            <rect x={s.x - 28} y={72} width={56} height={36} rx="4" fill="none" stroke={s.c} strokeWidth="1" style={{ filter: `drop-shadow(0 0 3px ${s.c}55)` }} />
            <text x={s.x} y={87} textAnchor="middle" fill={s.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={s.x} y={100} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P04 — Empower Team: Delegation authority spectrum
export function EmpowerDiagram() {
  const W = 320; const H = 180;
  const levels = [
    { label: 'TELL', sub: 'PM decides', x: 30, pct: 10 },
    { label: 'SELL', sub: 'PM explains', x: 90, pct: 25 },
    { label: 'CONSULT', sub: 'Team input', x: 160, pct: 50 },
    { label: 'AGREE', sub: 'Joint decision', x: 230, pct: 75 },
    { label: 'DELEGATE', sub: 'Team decides', x: 290, pct: 95 },
  ];
  return (
    <DiagramWrapper label="DELEGATION AUTHORITY SPECTRUM // P04">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={20} y1={150} x2={310} y2={150} stroke={DIM} strokeWidth="1" />
        <line x1={20} y1={150} x2={20} y2={30} stroke={DIM} strokeWidth="1" />
        <text x={10} y={28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">TEAM AUTHORITY</text>
        <text x={200} y={165} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">PM CONTROL →</text>
        {levels.map((l, i) => {
          const barH = (l.pct / 100) * 110;
          const y = 150 - barH;
          const c = i < 2 ? LINE3 : i === 2 ? LINE : LINE2;
          return (
            <g key={i}>
              <rect x={l.x - 18} y={y} width={36} height={barH} rx="2" fill={c} opacity="0.15" />
              <rect x={l.x - 18} y={y} width={36} height={barH} rx="2" fill="none" stroke={c} strokeWidth="0.8" />
              <text x={l.x} y={y - 4} textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{l.label}</text>
              <text x={l.x} y={H - 4} textAnchor="middle" fill={LABEL} fontSize="4.5" fontFamily="monospace" opacity="0.5">{l.sub}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P05 — Training: Skill gap matrix
export function TrainingDiagram() {
  const W = 320; const H = 180;
  const skills = ['Regulatory','Design','Agile','Risk Mgmt','Stakeholder'];
  const current = [40, 70, 30, 60, 50];
  const required = [90, 80, 70, 80, 75];
  return (
    <DiagramWrapper label="SKILL GAP MATRIX // P05">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {skills.map((s, i) => {
          const y = 25 + i * 28;
          const cW = (current[i] / 100) * 180;
          const rW = (required[i] / 100) * 180;
          return (
            <g key={i}>
              <text x={8} y={y + 8} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{s}</text>
              <rect x={100} y={y} width={rW} height={10} rx="2" fill={LINE3} opacity="0.15" />
              <rect x={100} y={y} width={rW} height={10} rx="2" fill="none" stroke={LINE3} strokeWidth="0.6" opacity="0.5" />
              <rect x={100} y={y} width={cW} height={10} rx="2" fill={LINE2} opacity="0.25" />
              <rect x={100} y={y} width={cW} height={10} rx="2" fill="none" stroke={LINE2} strokeWidth="0.8" />
              <text x={100 + rW + 4} y={y + 8} fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.6">{required[i]}%</text>
            </g>
          );
        })}
        <text x={100} y={H-4} fill={LINE2} fontSize="5" fontFamily="monospace">■ Current</text>
        <text x={155} y={H-4} fill={LINE3} fontSize="5" fontFamily="monospace">■ Required</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P06 — Build a Team: Team charter structure
export function TeamCharterDiagram() {
  const W = 320; const H = 180;
  const sections = [
    { label: 'MISSION', x: 20, y: 20, w: 130, h: 35, c: LINE2 },
    { label: 'ROLES & RACI', x: 165, y: 20, w: 140, h: 35, c: LINE },
    { label: 'NORMS & AGREEMENTS', x: 20, y: 70, w: 130, h: 35, c: LINE },
    { label: 'COMMUNICATION', x: 165, y: 70, w: 140, h: 35, c: LINE2 },
    { label: 'DECISION RIGHTS', x: 20, y: 120, w: 130, h: 35, c: LINE3 },
    { label: 'SUCCESS METRICS', x: 165, y: 120, w: 140, h: 35, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="TEAM CHARTER STRUCTURE // P06">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {sections.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="4" fill={s.c} opacity="0.1" />
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="4" fill="none" stroke={s.c} strokeWidth="0.8" style={{ filter: `drop-shadow(0 0 3px ${s.c}44)` }} />
            <text x={s.x + s.w/2} y={s.y + s.h/2 + 3} textAnchor="middle" fill={s.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{s.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P07 — Address Stakeholder Needs: Stakeholder engagement ladder
export function StakeholderNeedsDiagram() {
  const W = 320; const H = 180;
  const rungs = [
    { label: 'UNAWARE', y: 155, c: DIM },
    { label: 'RESISTANT', y: 125, c: LINE3 },
    { label: 'NEUTRAL', y: 95, c: LABEL },
    { label: 'SUPPORTIVE', y: 65, c: LINE },
    { label: 'CHAMPION', y: 35, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="STAKEHOLDER ENGAGEMENT LADDER // P07">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={60} y1={20} x2={60} y2={165} stroke={DIM} strokeWidth="1.5" />
        <line x1={260} y1={20} x2={260} y2={165} stroke={DIM} strokeWidth="1.5" />
        {rungs.map((r, i) => (
          <g key={i}>
            <line x1={60} y1={r.y} x2={260} y2={r.y} stroke={r.c} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 3px ${r.c}66)` }} />
            <text x={270} y={r.y + 4} fill={r.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{r.label}</text>
            <GlowDot x={60} y={r.y} r={3} color={r.c} />
            <GlowDot x={260} y={r.y} r={3} color={r.c} />
          </g>
        ))}
        <text x={10} y={90} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5" transform="rotate(-90,10,90)">ENGAGEMENT</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P08 — Negotiate: Negotiation preparation canvas
export function NegotiateCanvasDiagram() {
  const W = 320; const H = 180;
  const boxes = [
    { label: 'INTERESTS', sub: 'What we need', x: 10, y: 15, w: 90, h: 60, c: LINE2 },
    { label: 'POSITIONS', sub: 'What we ask', x: 115, y: 15, w: 90, h: 60, c: LINE },
    { label: 'BATNA', sub: 'Walk-away', x: 220, y: 15, w: 90, h: 60, c: LINE3 },
    { label: 'ZOPA', sub: 'Overlap zone', x: 10, y: 95, w: 140, h: 60, c: LINE },
    { label: 'AGREEMENT', sub: 'Target outcome', x: 165, y: 95, w: 145, h: 60, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="NEGOTIATION CANVAS // P08">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {boxes.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.c} opacity="0.1" />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="none" stroke={b.c} strokeWidth="0.8" />
            <text x={b.x + b.w/2} y={b.y + b.h/2 - 4} textAnchor="middle" fill={b.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{b.label}</text>
            <text x={b.x + b.w/2} y={b.y + b.h/2 + 9} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{b.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P09 — Collaborate with Stakeholders: Collaboration model
export function CollaborateDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const nodes = [
    { label: 'PM', x: cx, y: cy, r: 20, c: LINE2 },
    { label: 'SPONSOR', x: cx, y: 30, r: 14, c: LINE },
    { label: 'TEAM', x: cx - 70, y: cy + 40, r: 14, c: LINE },
    { label: 'USERS', x: cx + 70, y: cy + 40, r: 14, c: LINE },
    { label: 'VENDORS', x: cx - 80, y: cy - 30, r: 12, c: LINE3 },
    { label: 'REGULATORS', x: cx + 80, y: cy - 30, r: 12, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="STAKEHOLDER COLLABORATION MODEL // P09">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {nodes.slice(1).map((n, i) => (
          <line key={i} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={n.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity="0.12" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.c} strokeWidth="1" style={{ filter: `drop-shadow(0 0 4px ${n.c}66)` }} />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fill={n.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{n.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P10 — Build Shared Understanding: Communication channels
export function SharedUnderstandingDiagram() {
  const W = 320; const H = 180;
  const layers = [
    { label: 'VISION & GOALS', y: 20, w: 280, c: LINE2 },
    { label: 'SCOPE & DELIVERABLES', y: 55, w: 230, c: LINE },
    { label: 'ROLES & RESPONSIBILITIES', y: 90, w: 180, c: LINE },
    { label: 'PROCESS & TOOLS', y: 125, w: 130, c: LABEL },
    { label: 'NORMS & CULTURE', y: 155, w: 90, c: DIM },
  ];
  return (
    <DiagramWrapper label="SHARED UNDERSTANDING PYRAMID // P10">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {layers.map((l, i) => {
          const x = (W - l.w) / 2;
          return (
            <g key={i}>
              <rect x={x} y={l.y} width={l.w} height={26} rx="3" fill={l.c} opacity="0.12" />
              <rect x={x} y={l.y} width={l.w} height={26} rx="3" fill="none" stroke={l.c} strokeWidth="0.8" />
              <text x={W/2} y={l.y + 15} textAnchor="middle" fill={l.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{l.label}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P11 — Engage & Motivate: Motivation drivers
export function MotivationDiagram() {
  const W = 320; const H = 180;
  const drivers = [
    { label: 'PURPOSE', sub: 'Why it matters', x: 80, y: 45, c: LINE2 },
    { label: 'MASTERY', sub: 'Grow skills', x: 240, y: 45, c: LINE },
    { label: 'AUTONOMY', sub: 'Own decisions', x: 160, y: 140, c: LINE3 },
  ];
  const cx = 160; const cy = 90;
  return (
    <DiagramWrapper label="INTRINSIC MOTIVATION DRIVERS // P11">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {drivers.map((d, i) => (
          <line key={i} x1={cx} y1={cy} x2={d.x} y2={d.y} stroke={d.c} strokeWidth="1" strokeDasharray="4,2" opacity="0.4" />
        ))}
        <circle cx={cx} cy={cy} r={22} fill={LINE} opacity="0.08" />
        <circle cx={cx} cy={cy} r={22} fill="none" stroke={LINE} strokeWidth="1" style={{ filter: GLOW }} />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold">HIGH</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold">PERFORMANCE</text>
        {drivers.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={28} fill={d.c} opacity="0.1" />
            <circle cx={d.x} cy={d.y} r={28} fill="none" stroke={d.c} strokeWidth="1" />
            <text x={d.x} y={d.y - 4} textAnchor="middle" fill={d.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{d.label}</text>
            <text x={d.x} y={d.y + 10} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{d.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P12 — Manage Team Dynamics: Team health radar
export function TeamDynamicsDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90; const R = 65;
  const axes = ['Trust','Conflict','Commitment','Accountability','Results'];
  const scores = [0.8, 0.5, 0.7, 0.6, 0.75];
  const pts = axes.map((_, i) => {
    const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * R * scores[i], y: cy + Math.sin(angle) * R * scores[i] };
  });
  const outerPts = axes.map((_, i) => {
    const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R, label: axes[i] };
  });
  return (
    <DiagramWrapper label="TEAM HEALTH RADAR // P12">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {[0.25, 0.5, 0.75, 1].map(r => (
          <polygon key={r} points={axes.map((_, i) => {
            const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
            return `${cx + Math.cos(angle) * R * r},${cy + Math.sin(angle) * R * r}`;
          }).join(' ')} fill="none" stroke={DIM} strokeWidth="0.5" opacity="0.5" />
        ))}
        {outerPts.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={DIM} strokeWidth="0.5" opacity="0.4" />
        ))}
        <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill={LINE2} opacity="0.15" />
        <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.2" style={{ filter: GLOW2 }} />
        {outerPts.map((p, i) => (
          <text key={i} x={p.x + (p.x > cx ? 4 : p.x < cx ? -4 : 0)} y={p.y + (p.y > cy ? 10 : p.y < cy ? -4 : 4)}
            textAnchor={p.x > cx + 5 ? 'start' : p.x < cx - 5 ? 'end' : 'middle'}
            fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{p.label}</text>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P13 — Manage Virtual Teams: Remote collaboration framework
export function VirtualTeamDiagram() {
  const W = 320; const H = 180;
  const zones = [
    { label: 'ASYNC', sub: 'Docs · Email · Loom', x: 20, y: 20, w: 85, h: 140, c: LINE },
    { label: 'SYNC', sub: 'Video · Standups', x: 120, y: 20, w: 85, h: 140, c: LINE2 },
    { label: 'TOOLS', sub: 'Miro · Jira · Slack', x: 220, y: 20, w: 85, h: 140, c: LINE3 },
  ];
  const overlap = [{ x: 100, y: 60, label: 'OVERLAP\nZONE' }];
  return (
    <DiagramWrapper label="VIRTUAL TEAM COLLABORATION // P13">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {zones.map((z, i) => (
          <g key={i}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="4" fill={z.c} opacity="0.08" />
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="4" fill="none" stroke={z.c} strokeWidth="1" />
            <text x={z.x + z.w/2} y={z.y + 20} textAnchor="middle" fill={z.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{z.label}</text>
            <text x={z.x + z.w/2} y={z.y + 36} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{z.sub.split(' · ')[0]}</text>
            <text x={z.x + z.w/2} y={z.y + 48} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{z.sub.split(' · ')[1]}</text>
            <text x={z.x + z.w/2} y={z.y + 60} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{z.sub.split(' · ')[2]}</text>
          </g>
        ))}
        <text x={160} y={H - 6} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">TIMEZONE OVERLAP WINDOW: 09:00-12:00 UTC</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// P14 — Emotional Intelligence: EI competency model
export function EmotionalIntelligenceDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const quadrants = [
    { label: 'SELF-AWARENESS', sub: 'Know yourself', x: cx - 75, y: cy - 65, c: LINE2 },
    { label: 'SELF-MGMT', sub: 'Regulate self', x: cx + 10, y: cy - 65, c: LINE },
    { label: 'SOCIAL AWARENESS', sub: 'Empathy', x: cx - 75, y: cy + 10, c: LINE },
    { label: 'RELATIONSHIP MGMT', sub: 'Influence others', x: cx + 10, y: cy + 10, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="EMOTIONAL INTELLIGENCE MODEL // P14">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={cx} y1={15} x2={cx} y2={H-15} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <line x1={15} y1={cy} x2={W-15} y2={cy} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <text x={cx - 4} y={12} textAnchor="end" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">SELF</text>
        <text x={cx + 4} y={12} textAnchor="start" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">SOCIAL</text>
        <text x={18} y={cy - 4} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">AWARENESS</text>
        <text x={18} y={cy + 12} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">MANAGEMENT</text>
        {quadrants.map((q, i) => (
          <g key={i}>
            <rect x={q.x} y={q.y} width={80} height={50} rx="3" fill={q.c} opacity="0.1" />
            <rect x={q.x} y={q.y} width={80} height={50} rx="3" fill="none" stroke={q.c} strokeWidth="0.8" />
            <text x={q.x + 40} y={q.y + 18} textAnchor="middle" fill={q.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{q.label}</text>
            <text x={q.x + 40} y={q.y + 32} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{q.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE DIAGRAMS — Process Domain (PR01-PR17)
// ═══════════════════════════════════════════════════════════════════════════════

// PR01 — Manage Schedule: Schedule control loop
export function ScheduleDiagram() {
  const W = 320; const H = 180;
  const steps = ['BASELINE\nSCHEDULE','TRACK\nACTUALS','COMPARE\nSV/SPI','FORECAST\nEAC','CORRECTIVE\nACTION'];
  const xs = [30, 95, 160, 225, 290];
  const colors = [LINE2, LINE, LINE, LINE3, LINE2];
  return (
    <DiagramWrapper label="SCHEDULE CONTROL LOOP // PR01">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={xs[i]+22} y1={90} x2={xs[i+1]-22} y2={90} stroke={colors[i]} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={xs[i]-22} y={70} width={44} height={40} rx="4" fill={colors[i]} opacity="0.1" />
            <rect x={xs[i]-22} y={70} width={44} height={40} rx="4" fill="none" stroke={colors[i]} strokeWidth="0.8" />
            {s.split('\n').map((line, j) => (
              <text key={j} x={xs[i]} y={85 + j*12} textAnchor="middle" fill={colors[i]} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{line}</text>
            ))}
          </g>
        ))}
        <path d="M 290,110 Q 160,155 30,110" fill="none" stroke={LINE3} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.3" />
        <text x={160} y={165} textAnchor="middle" fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.5">← FEEDBACK LOOP</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR02 — Manage Budget: Budget tracking dashboard
export function BudgetDiagram() {
  const W = 320; const H = 180;
  const months = ['M1','M2','M3','M4','M5','M6'];
  const planned = [20, 40, 65, 85, 100, 120];
  const actual = [22, 45, 72, 95, 0, 0];
  const maxV = 130;
  const toY = (v: number) => H - 25 - (v / maxV) * (H - 50);
  const toX = (i: number) => 30 + i * 52;
  return (
    <DiagramWrapper label="BUDGET TRACKING (EVM) // PR02">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={months.map((_, i) => `${toX(i)},${toY(planned[i])}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.5" style={{ filter: GLOW2 }} />
        <polyline points={months.slice(0,4).map((_, i) => `${toX(i)},${toY(actual[i])}`).join(' ')} fill="none" stroke={LINE3} strokeWidth="1.5" style={{ filter: GLOW3 }} />
        {months.map((m, i) => (
          <g key={i}>
            <text x={toX(i)} y={H-8} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{m}</text>
            <GlowDot x={toX(i)} y={toY(planned[i])} r={2.5} color={LINE2} />
            {i < 4 && <GlowDot x={toX(i)} y={toY(actual[i])} r={2.5} color={LINE3} />}
          </g>
        ))}
        <text x={10} y={20} fill={LINE2} fontSize="5.5" fontFamily="monospace">■ PLANNED</text>
        <text x={80} y={20} fill={LINE3} fontSize="5.5" fontFamily="monospace">■ ACTUAL</text>
        <text x={150} y={20} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">CV = AC - PV</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR03 — Manage Risk: Risk response strategies
export function RiskResponseDiagram() {
  const W = 320; const H = 180;
  const strategies = [
    { label: 'AVOID', sub: 'Eliminate threat', x: 40, y: 40, c: LINE3 },
    { label: 'TRANSFER', sub: 'Insurance/contract', x: 160, y: 40, c: LINE },
    { label: 'MITIGATE', sub: 'Reduce probability', x: 280, y: 40, c: LINE },
    { label: 'ACCEPT', sub: 'Contingency reserve', x: 40, y: 130, c: DIM },
    { label: 'EXPLOIT', sub: 'Opportunity', x: 160, y: 130, c: LINE2 },
    { label: 'ENHANCE', sub: 'Increase probability', x: 280, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="RISK RESPONSE STRATEGIES // PR03">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={10} y1={90} x2={310} y2={90} stroke={DIM} strokeWidth="0.8" strokeDasharray="4,2" opacity="0.4" />
        <text x={14} y={86} fill={LINE3} fontSize="5.5" fontFamily="monospace" opacity="0.6">THREATS ↑</text>
        <text x={14} y={100} fill={LINE2} fontSize="5.5" fontFamily="monospace" opacity="0.6">OPPORTUNITIES ↓</text>
        {strategies.map((s, i) => (
          <g key={i}>
            <rect x={s.x - 38} y={s.y - 20} width={76} height={38} rx="3" fill={s.c} opacity="0.1" />
            <rect x={s.x - 38} y={s.y - 20} width={76} height={38} rx="3" fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={s.x} y={s.y - 4} textAnchor="middle" fill={s.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={s.x} y={s.y + 10} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR04 — Engage Stakeholders: Communication plan
export function StakeholderEngageDiagram() {
  const W = 320; const H = 180;
  const rows = [
    { who: 'SPONSOR', what: 'Status Report', how: 'Email', when: 'Weekly', c: LINE2 },
    { who: 'PMO HEAD', what: 'Dashboard', how: 'Meeting', when: 'Bi-weekly', c: LINE },
    { who: 'TEAM', what: 'Stand-up', how: 'Video call', when: 'Daily', c: LINE },
    { who: 'REGULATORS', what: 'Submission', how: 'Portal', when: 'Milestone', c: LINE3 },
    { who: 'END USERS', what: 'Demo', how: 'Workshop', when: 'Sprint end', c: LABEL },
  ];
  return (
    <DiagramWrapper label="STAKEHOLDER COMMUNICATION PLAN // PR04">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {['WHO','WHAT','HOW','WHEN'].map((h, i) => (
          <text key={i} x={10 + i * 78} y={16} fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold" opacity="0.8">{h}</text>
        ))}
        <line x1={5} y1={20} x2={315} y2={20} stroke={LINE} strokeWidth="0.5" opacity="0.4" />
        {rows.map((r, i) => (
          <g key={i}>
            <text x={10} y={34 + i*28} fill={r.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{r.who}</text>
            <text x={88} y={34 + i*28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{r.what}</text>
            <text x={166} y={34 + i*28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{r.how}</text>
            <text x={244} y={34 + i*28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{r.when}</text>
            <line x1={5} y1={38 + i*28} x2={315} y2={38 + i*28} stroke={DIM} strokeWidth="0.3" opacity="0.3" />
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR05 — Manage Quality: Quality control loop
export function QualityDiagram() {
  const W = 320; const H = 180;
  const steps = ['PLAN\nQUALITY','ASSURE\nPROCESS','CONTROL\nOUTPUT','DEFECT\nANALYSIS','IMPROVE\nPROCESS'];
  const xs = [30, 95, 160, 225, 290];
  const ys = [60, 100, 60, 100, 60];
  const colors = [LINE2, LINE, LINE2, LINE3, LINE2];
  return (
    <DiagramWrapper label="QUALITY MANAGEMENT CYCLE // PR05">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={xs[i]+22} y1={ys[i]} x2={xs[i+1]-22} y2={ys[i+1]} stroke={colors[i]} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={xs[i]-22} y={ys[i]-18} width={44} height={36} rx="4" fill={colors[i]} opacity="0.1" />
            <rect x={xs[i]-22} y={ys[i]-18} width={44} height={36} rx="4" fill="none" stroke={colors[i]} strokeWidth="0.8" />
            {s.split('\n').map((line, j) => (
              <text key={j} x={xs[i]} y={ys[i] - 4 + j*12} textAnchor="middle" fill={colors[i]} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{line}</text>
            ))}
          </g>
        ))}
        <text x={160} y={H-6} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">DEFECT RATE TARGET: &lt;2% · SIGMA LEVEL: 4σ</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR06 — Manage Resources: Resource allocation matrix
export function ResourceDiagram() {
  const W = 320; const H = 180;
  const resources = ['Designer','Reg. Analyst','Dev Lead','QA Engineer','PM'];
  const weeks = ['W1','W2','W3','W4','W5','W6'];
  const alloc = [
    [100, 80, 60, 40, 20, 0],
    [20, 40, 80, 100, 80, 40],
    [0, 20, 60, 80, 100, 80],
    [0, 0, 40, 60, 80, 100],
    [60, 60, 60, 60, 60, 60],
  ];
  return (
    <DiagramWrapper label="RESOURCE ALLOCATION MATRIX // PR06">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {weeks.map((w, i) => (
          <text key={i} x={90 + i * 38} y={14} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" opacity="0.7">{w}</text>
        ))}
        {resources.map((r, ri) => (
          <g key={ri}>
            <text x={8} y={28 + ri * 28} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.7">{r}</text>
            {weeks.map((_, wi) => {
              const v = alloc[ri][wi];
              const c = v > 80 ? LINE3 : v > 50 ? LINE : LINE2;
              return (
                <g key={wi}>
                  <rect x={76 + wi * 38} y={18 + ri * 28} width={32} height={18} rx="2" fill={c} opacity={v / 400} />
                  <rect x={76 + wi * 38} y={18 + ri * 28} width={32} height={18} rx="2" fill="none" stroke={c} strokeWidth="0.5" opacity="0.4" />
                  <text x={92 + wi * 38} y={30 + ri * 28} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace">{v}%</text>
                </g>
              );
            })}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR07 — Manage Procurement: Procurement lifecycle
export function ProcurementDiagram() {
  const W = 320; const H = 180;
  const phases = [
    { label: 'PLAN', sub: 'Make/buy', x: 30, c: LINE2 },
    { label: 'SOLICIT', sub: 'RFP/RFQ', x: 95, c: LINE },
    { label: 'SELECT', sub: 'Evaluate', x: 160, c: LINE },
    { label: 'CONTRACT', sub: 'Negotiate', x: 225, c: LINE3 },
    { label: 'CLOSE', sub: 'Handover', x: 290, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="PROCUREMENT LIFECYCLE // PR07">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {phases.map((p, i) => (
          <g key={i}>
            {i < phases.length - 1 && (
              <line x1={p.x + 26} y1={90} x2={phases[i+1].x - 26} y2={90} stroke={p.c} strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
            )}
            <polygon points={`${p.x - 26},70 ${p.x + 20},70 ${p.x + 26},90 ${p.x + 20},110 ${p.x - 26},110`} fill={p.c} opacity="0.1" />
            <polygon points={`${p.x - 26},70 ${p.x + 20},70 ${p.x + 26},90 ${p.x + 20},110 ${p.x - 26},110`} fill="none" stroke={p.c} strokeWidth="0.8" />
            <text x={p.x - 2} y={87} textAnchor="middle" fill={p.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{p.label}</text>
            <text x={p.x - 2} y={100} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{p.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR08 — Manage Scope: Scope baseline triad
export function ScopeManageDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  return (
    <DiagramWrapper label="SCOPE MANAGEMENT TRIAD // PR08">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polygon points={`${cx},20 ${cx+110},155 ${cx-110},155`} fill={LINE} opacity="0.05" />
        <polygon points={`${cx},20 ${cx+110},155 ${cx-110},155`} fill="none" stroke={LINE} strokeWidth="1" style={{ filter: GLOW }} />
        <text x={cx} y={45} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace" fontWeight="bold">SCOPE STATEMENT</text>
        <text x={cx} y={58} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">T14 · Inclusions & Exclusions</text>
        <text x={cx - 60} y={135} textAnchor="middle" fill={LINE} fontSize="7" fontFamily="monospace" fontWeight="bold">WBS</text>
        <text x={cx - 60} y={148} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">T3 · Decomposition</text>
        <text x={cx + 60} y={135} textAnchor="middle" fill={LINE3} fontSize="7" fontFamily="monospace" fontWeight="bold">MoSCoW</text>
        <text x={cx + 60} y={148} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">T7 · Prioritisation</text>
        <circle cx={cx} cy={cy} r={22} fill={LINE2} opacity="0.08" />
        <circle cx={cx} cy={cy} r={22} fill="none" stroke={LINE2} strokeWidth="0.8" strokeDasharray="3,2" />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace" fontWeight="bold">SCOPE</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace" fontWeight="bold">BASELINE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR09 — Manage Project Knowledge: Knowledge management cycle
export function KnowledgeMgmtDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const nodes = [
    { label: 'CAPTURE', x: cx, y: 25, c: LINE2 },
    { label: 'STORE', x: cx + 80, y: cy, c: LINE },
    { label: 'SHARE', x: cx, y: H - 25, c: LINE },
    { label: 'APPLY', x: cx - 80, y: cy, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="KNOWLEDGE MANAGEMENT CYCLE // PR09">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={cx} cy={cy} r={30} fill={LINE} opacity="0.05" />
        <circle cx={cx} cy={cy} r={30} fill="none" stroke={LINE} strokeWidth="0.5" strokeDasharray="3,2" opacity="0.3" />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace" opacity="0.6">LESSONS</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace" opacity="0.6">LEARNED</text>
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length];
          const mx = (n.x + next.x) / 2; const my = (n.y + next.y) / 2;
          return (
            <g key={i}>
              <line x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke={n.c} strokeWidth="0.8" strokeDasharray="4,2" opacity="0.4" />
              <rect x={n.x - 32} y={n.y - 14} width={64} height={28} rx="4" fill={n.c} opacity="0.1" />
              <rect x={n.x - 32} y={n.y - 14} width={64} height={28} rx="4" fill="none" stroke={n.c} strokeWidth="0.8" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{n.label}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR10 — Close Project: Closure checklist
export function ClosureChecklistDiagram() {
  const W = 320; const H = 180;
  const items = [
    { label: 'Deliverables accepted by sponsor', done: true },
    { label: 'Resources released / reassigned', done: true },
    { label: 'Documents archived in DMS', done: true },
    { label: 'Post-Implementation Review held', done: false },
    { label: 'Benefits realisation measured', done: false },
    { label: 'Lessons learned published', done: false },
  ];
  return (
    <DiagramWrapper label="PROJECT CLOSURE CHECKLIST // PR10">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {items.map((item, i) => (
          <g key={i}>
            <rect x={12} y={14 + i * 26} width={12} height={12} rx="2" fill={item.done ? LINE2 : 'none'} stroke={item.done ? LINE2 : DIM} strokeWidth="1" />
            {item.done && <text x={18} y={24 + i * 26} textAnchor="middle" fill={BG} fontSize="8" fontFamily="monospace" fontWeight="bold">✓</text>}
            <text x={32} y={24 + i * 26} fill={item.done ? LINE2 : LABEL} fontSize="6" fontFamily="monospace" opacity={item.done ? 1 : 0.5}>{item.label}</text>
          </g>
        ))}
        <text x={W - 10} y={H - 6} textAnchor="end" fill={LINE3} fontSize="5.5" fontFamily="monospace">3/6 COMPLETE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR11 — Manage Change: Change control workflow
export function ChangeControlDiagram() {
  const W = 320; const H = 180;
  const steps = [
    { label: 'CHANGE\nREQUEST', x: 30, y: 60, c: LINE3 },
    { label: 'IMPACT\nASSESSMENT', x: 100, y: 60, c: LINE },
    { label: 'CCB\nREVIEW', x: 170, y: 60, c: LINE },
    { label: 'APPROVE /\nREJECT', x: 240, y: 60, c: LINE2 },
    { label: 'IMPLEMENT\n& BASELINE', x: 295, y: 110, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="CHANGE CONTROL WORKFLOW // PR11">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={s.x + 28} y1={s.y} x2={steps[i+1].x - 28} y2={steps[i+1].y} stroke={s.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={s.x - 28} y={s.y - 20} width={56} height={40} rx="4" fill={s.c} opacity="0.1" />
            <rect x={s.x - 28} y={s.y - 20} width={56} height={40} rx="4" fill="none" stroke={s.c} strokeWidth="0.8" />
            {s.label.split('\n').map((line, j) => (
              <text key={j} x={s.x} y={s.y - 5 + j * 12} textAnchor="middle" fill={s.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{line}</text>
            ))}
          </g>
        ))}
        <line x1={240} y1={80} x2={240} y2={130} stroke={LINE3} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />
        <text x={248} y={125} fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.6">REJECT →</text>
        <text x={248} y={135} fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.6">ARCHIVE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR12 — Manage Information: Information architecture
export function InformationMgmtDiagram() {
  const W = 320; const H = 180;
  const layers = [
    { label: 'RAW DATA', sub: 'Metrics · Logs · Reports', y: 20, c: DIM },
    { label: 'INFORMATION', sub: 'Processed · Structured', y: 60, c: LABEL },
    { label: 'KNOWLEDGE', sub: 'Interpreted · Contextual', y: 100, c: LINE },
    { label: 'DECISIONS', sub: 'Actionable · Timely', y: 140, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="INFORMATION MANAGEMENT PYRAMID // PR12">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {layers.map((l, i) => {
          const w = 80 + i * 50; const x = (W - w) / 2;
          return (
            <g key={i}>
              {i > 0 && <line x1={W/2} y1={l.y} x2={W/2} y2={l.y} stroke={l.c} strokeWidth="0.5" opacity="0.3" />}
              <rect x={x} y={l.y} width={w} height={28} rx="3" fill={l.c} opacity="0.12" />
              <rect x={x} y={l.y} width={w} height={28} rx="3" fill="none" stroke={l.c} strokeWidth="0.8" />
              <text x={W/2} y={l.y + 11} textAnchor="middle" fill={l.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{l.label}</text>
              <text x={W/2} y={l.y + 23} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{l.sub}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR13 — Manage Methodology: Methodology selection matrix
export function MethodologySelectDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="METHODOLOGY SELECTION MATRIX // PR13">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={160} y1={15} x2={160} y2={H-15} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <line x1={15} y1={95} x2={W-15} y2={95} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <text x={90} y={12} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">LOW COMPLEXITY</text>
        <text x={240} y={12} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.5">HIGH COMPLEXITY</text>
        <text x={90} y={55} textAnchor="middle" fill={LINE2} fontSize="8" fontFamily="monospace" fontWeight="bold">WATERFALL</text>
        <text x={90} y={68} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Stable · Compliance</text>
        <text x={240} y={55} textAnchor="middle" fill={LINE} fontSize="8" fontFamily="monospace" fontWeight="bold">HYBRID</text>
        <text x={240} y={68} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Mixed requirements</text>
        <text x={90} y={130} textAnchor="middle" fill={LINE3} fontSize="8" fontFamily="monospace" fontWeight="bold">KANBAN</text>
        <text x={90} y={143} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Continuous flow</text>
        <text x={240} y={130} textAnchor="middle" fill={LINE2} fontSize="8" fontFamily="monospace" fontWeight="bold">AGILE</text>
        <text x={240} y={143} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Evolving · User-driven</text>
        <text x={12} y={60} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.5" transform="rotate(-90,12,60)">STABLE REQS</text>
        <text x={12} y={140} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.5" transform="rotate(-90,12,140)">CHANGING REQS</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR14 — Manage Governance: Governance structure
export function GovernanceDiagram() {
  const W = 320; const H = 180;
  const levels = [
    { label: 'STEERING COMMITTEE', sub: 'Strategic decisions · Sponsor', y: 15, w: 280, c: LINE2 },
    { label: 'PROJECT BOARD', sub: 'Tactical oversight · PMO Head', y: 60, w: 220, c: LINE },
    { label: 'PROJECT MANAGER', sub: 'Operational decisions', y: 105, w: 160, c: LINE },
    { label: 'TEAM LEADS', sub: 'Task-level authority', y: 145, w: 100, c: LABEL },
  ];
  return (
    <DiagramWrapper label="GOVERNANCE HIERARCHY // PR14">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {levels.map((l, i) => {
          const x = (W - l.w) / 2;
          return (
            <g key={i}>
              {i > 0 && <line x1={W/2} y1={levels[i-1].y + 28} x2={W/2} y2={l.y} stroke={DIM} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.4" />}
              <rect x={x} y={l.y} width={l.w} height={28} rx="3" fill={l.c} opacity="0.1" />
              <rect x={x} y={l.y} width={l.w} height={28} rx="3" fill="none" stroke={l.c} strokeWidth="0.8" />
              <text x={W/2} y={l.y + 11} textAnchor="middle" fill={l.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{l.label}</text>
              <text x={W/2} y={l.y + 23} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{l.sub}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR15 — Manage Defects: Defect lifecycle
export function DefectDiagram() {
  const W = 320; const H = 180;
  const states = [
    { label: 'OPEN', x: 30, y: 90, c: LINE3 },
    { label: 'IN ANALYSIS', x: 100, y: 60, c: LINE },
    { label: 'IN FIX', x: 170, y: 90, c: LINE },
    { label: 'IN TEST', x: 240, y: 60, c: LINE2 },
    { label: 'CLOSED', x: 295, y: 90, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="DEFECT LIFECYCLE // PR15">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {states.map((s, i) => (
          <g key={i}>
            {i < states.length - 1 && (
              <line x1={s.x + 24} y1={s.y} x2={states[i+1].x - 24} y2={states[i+1].y} stroke={s.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={s.x - 24} y={s.y - 16} width={48} height={32} rx="4" fill={s.c} opacity="0.1" />
            <rect x={s.x - 24} y={s.y - 16} width={48} height={32} rx="4" fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={s.x} y={s.y + 4} textAnchor="middle" fill={s.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{s.label}</text>
          </g>
        ))}
        <text x={160} y={H - 6} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">DEFECT DENSITY TARGET: &lt;0.5 per 1000 UNITS</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR16 — Manage Continuous Improvement: CI flywheel
export function ContinuousImproveDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90; const R = 60;
  const steps = ['MEASURE','ANALYSE','IMPROVE','CONTROL','STANDARDISE'];
  return (
    <DiagramWrapper label="CONTINUOUS IMPROVEMENT FLYWHEEL // PR16">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={DIM} strokeWidth="1" strokeDasharray="4,2" opacity="0.3" />
        {steps.map((s, i) => {
          const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * R;
          const y = cy + Math.sin(angle) * R;
          const c = [LINE2, LINE, LINE2, LINE3, LINE2][i];
          return (
            <g key={i}>
              <GlowDot x={x} y={y} r={5} color={c} />
              <text x={x + (x > cx ? 8 : x < cx - 5 ? -8 : 0)} y={y + (y > cy ? 12 : y < cy ? -6 : 4)}
                textAnchor={x > cx + 5 ? 'start' : x < cx - 5 ? 'end' : 'middle'}
                fill={c} fontSize="6" fontFamily="monospace" fontWeight="bold">{s}</text>
            </g>
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={LINE} fontSize="6.5" fontFamily="monospace" fontWeight="bold">KAIZEN</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={LINE} fontSize="6.5" fontFamily="monospace" fontWeight="bold">CULTURE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// PR17 — Manage Lessons Learned: Lessons learned process
export function LessonsLearnedProcessDiagram() {
  const W = 320; const H = 180;
  const steps = [
    { label: 'IDENTIFY', sub: 'During project', x: 30, c: LINE3 },
    { label: 'DOCUMENT', sub: 'Standard format', x: 100, c: LINE },
    { label: 'ANALYSE', sub: 'Root causes', x: 170, c: LINE },
    { label: 'STORE', sub: 'DMS / KCS', x: 240, c: LINE2 },
    { label: 'APPLY', sub: 'Next project', x: 295, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="LESSONS LEARNED PROCESS // PR17">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={s.x + 26} y1={90} x2={steps[i+1].x - 26} y2={90} stroke={s.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={s.x - 26} y={70} width={52} height={40} rx="4" fill={s.c} opacity="0.1" />
            <rect x={s.x - 26} y={70} width={52} height={40} rx="4" fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={s.x} y={87} textAnchor="middle" fill={s.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={s.x} y={101} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE DIAGRAMS — Business Environment (BE01-BE04)
// ═══════════════════════════════════════════════════════════════════════════════

// BE01 — Compliance: Compliance framework
export function ComplianceDiagram() {
  const W = 320; const H = 180;
  const reqs = [
    { label: 'EU MDR', status: 'COMPLIANT', c: LINE2 },
    { label: 'ISO 15223', status: 'COMPLIANT', c: LINE2 },
    { label: 'FDA 21 CFR', status: 'IN REVIEW', c: LINE },
    { label: 'GDPR', status: 'COMPLIANT', c: LINE2 },
    { label: 'GMP', status: 'GAP FOUND', c: LINE3 },
  ];
  return (
    <DiagramWrapper label="COMPLIANCE STATUS TRACKER // BE01">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={10} y={14} fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold" opacity="0.8">REGULATION</text>
        <text x={200} y={14} fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold" opacity="0.8">STATUS</text>
        <line x1={5} y1={18} x2={315} y2={18} stroke={LINE} strokeWidth="0.5" opacity="0.4" />
        {reqs.map((r, i) => (
          <g key={i}>
            <text x={10} y={34 + i * 28} fill={LABEL} fontSize="6.5" fontFamily="monospace" opacity="0.8">{r.label}</text>
            <rect x={180} y={22 + i * 28} width={100} height={16} rx="3" fill={r.c} opacity="0.15" />
            <rect x={180} y={22 + i * 28} width={100} height={16} rx="3" fill="none" stroke={r.c} strokeWidth="0.7" />
            <text x={230} y={33 + i * 28} textAnchor="middle" fill={r.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{r.status}</text>
            <line x1={5} y1={40 + i * 28} x2={315} y2={40 + i * 28} stroke={DIM} strokeWidth="0.3" opacity="0.3" />
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// BE02 — Benefits Delivery: Benefits realisation map
export function BenefitsDeliveryDiagram() {
  const W = 320; const H = 180;
  const chain = [
    { label: 'OUTPUTS', sub: 'Label · Pen · Campaign', x: 30, c: LINE3 },
    { label: 'OUTCOMES', sub: 'Adoption · Compliance', x: 120, c: LINE },
    { label: 'BENEFITS', sub: 'Revenue · Safety', x: 210, c: LINE2 },
    { label: 'STRATEGIC\nGOALS', sub: 'Market share', x: 290, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="BENEFITS REALISATION CHAIN // BE02">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {chain.map((c, i) => (
          <g key={i}>
            {i < chain.length - 1 && (
              <line x1={c.x + 34} y1={90} x2={chain[i+1].x - 34} y2={90} stroke={c.c} strokeWidth="1" strokeDasharray="4,2" opacity="0.5" />
            )}
            <rect x={c.x - 34} y={68} width={68} height={44} rx="4" fill={c.c} opacity="0.1" />
            <rect x={c.x - 34} y={68} width={68} height={44} rx="4" fill="none" stroke={c.c} strokeWidth="0.8" />
            {c.label.split('\n').map((line, j) => (
              <text key={j} x={c.x} y={84 + j * 12} textAnchor="middle" fill={c.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{line}</text>
            ))}
            <text x={c.x} y={104} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{c.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// BE03 — External Environment: PESTLE analysis
export function PESTLEDiagram() {
  const W = 320; const H = 180;
  const factors = [
    { label: 'POLITICAL', sub: 'NHS policy', x: 55, y: 35, c: LINE2 },
    { label: 'ECONOMIC', sub: 'Budget cuts', x: 160, y: 35, c: LINE },
    { label: 'SOCIAL', sub: 'Ageing pop.', x: 265, y: 35, c: LINE },
    { label: 'TECHNOLOGICAL', sub: 'Smart devices', x: 55, y: 130, c: LINE3 },
    { label: 'LEGAL', sub: 'EU MDR', x: 160, y: 130, c: LINE3 },
    { label: 'ENVIRONMENTAL', sub: 'Sustainability', x: 265, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="PESTLE ANALYSIS // BE03">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {factors.map((f, i) => (
          <g key={i}>
            <rect x={f.x - 48} y={f.y - 22} width={96} height={44} rx="4" fill={f.c} opacity="0.1" />
            <rect x={f.x - 48} y={f.y - 22} width={96} height={44} rx="4" fill="none" stroke={f.c} strokeWidth="0.8" />
            <text x={f.x} y={f.y - 4} textAnchor="middle" fill={f.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{f.label}</text>
            <text x={f.x} y={f.y + 10} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{f.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// BE04 — Organisational Change: Change readiness assessment
export function OrgChangeDiagram() {
  const W = 320; const H = 180;
  const dimensions = ['Leadership\nAlignment','Staff\nReadiness','Process\nMaturity','Tool\nReadiness','Culture\nFit'];
  const scores = [0.8, 0.4, 0.6, 0.7, 0.5];
  const barW = 44; const gap = 18;
  const startX = 20;
  return (
    <DiagramWrapper label="CHANGE READINESS ASSESSMENT // BE04">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={15} y1={150} x2={W-15} y2={150} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <line x1={15} y1={20} x2={15} y2={150} stroke={DIM} strokeWidth="1" opacity="0.5" />
        {[0.25, 0.5, 0.75, 1].map(v => (
          <line key={v} x1={15} y1={150 - v * 120} x2={W-15} y2={150 - v * 120} stroke={DIM} strokeWidth="0.3" strokeDasharray="3,2" opacity="0.3" />
        ))}
        {dimensions.map((d, i) => {
          const x = startX + i * (barW + gap);
          const barH = scores[i] * 120;
          const c = scores[i] > 0.65 ? LINE2 : scores[i] > 0.45 ? LINE : LINE3;
          return (
            <g key={i}>
              <rect x={x} y={150 - barH} width={barW} height={barH} rx="2" fill={c} opacity="0.2" />
              <rect x={x} y={150 - barH} width={barW} height={barH} rx="2" fill="none" stroke={c} strokeWidth="0.8" />
              <text x={x + barW/2} y={150 - barH - 4} textAnchor="middle" fill={c} fontSize="6" fontFamily="monospace">{Math.round(scores[i]*100)}%</text>
              {d.split('\n').map((line, j) => (
                <text key={j} x={x + barW/2} y={162 + j * 10} textAnchor="middle" fill={LABEL} fontSize="4.5" fontFamily="monospace" opacity="0.6">{line}</text>
              ))}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE DIAGRAMS — Archetypes (AG1-AG3)
// ═══════════════════════════════════════════════════════════════════════════════

export function AG1Diagram() {
  const W = 320; const H = 180;
  const questions = ['Requirements stable?','Compliance critical?','User feedback needed?','Team Agile-ready?'];
  const answers = [['YES → Waterfall','NO → Agile/Hybrid'],['YES → Waterfall gates','NO → Flexible'],['YES → Agile sprints','NO → Waterfall'],['YES → Agile','NO → Waterfall']];
  return (
    <DiagramWrapper label="SELF-ASSESSMENT QUESTIONS // AG1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {questions.map((q, i) => (
          <g key={i}>
            <rect x={8} y={12 + i * 38} width={140} height={28} rx="3" fill={LINE} opacity="0.1" />
            <rect x={8} y={12 + i * 38} width={140} height={28} rx="3" fill="none" stroke={LINE} strokeWidth="0.7" />
            <text x={78} y={29 + i * 38} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{q}</text>
            <line x1={148} y1={26 + i * 38} x2={162} y2={26 + i * 38} stroke={LINE} strokeWidth="0.7" strokeDasharray="2,2" opacity="0.5" />
            <text x={165} y={24 + i * 38} fill={LINE2} fontSize="5" fontFamily="monospace" opacity="0.8">{answers[i][0]}</text>
            <text x={165} y={36 + i * 38} fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.8">{answers[i][1]}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function AG2Diagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  return (
    <DiagramWrapper label="METHODOLOGY DECISION TREE // AG2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={cx-40} y={10} width={80} height={28} rx="3" fill={LINE} opacity="0.1" />
        <rect x={cx-40} y={10} width={80} height={28} rx="3" fill="none" stroke={LINE} strokeWidth="0.8" />
        <text x={cx} y={27} textAnchor="middle" fill={LINE} fontSize="6.5" fontFamily="monospace" fontWeight="bold">STABLE REQS?</text>
        <line x1={cx-20} y1={38} x2={70} y2={75} stroke={LINE2} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.6" />
        <line x1={cx+20} y1={38} x2={250} y2={75} stroke={LINE3} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.6" />
        <text x={100} y={70} fill={LINE2} fontSize="5.5" fontFamily="monospace" opacity="0.8">YES</text>
        <text x={225} y={70} fill={LINE3} fontSize="5.5" fontFamily="monospace" opacity="0.8">NO</text>
        <rect x={30} y={78} width={80} height={28} rx="3" fill={LINE2} opacity="0.1" />
        <rect x={30} y={78} width={80} height={28} rx="3" fill="none" stroke={LINE2} strokeWidth="0.8" />
        <text x={70} y={95} textAnchor="middle" fill={LINE2} fontSize="6.5" fontFamily="monospace" fontWeight="bold">WATERFALL</text>
        <rect x={210} y={78} width={80} height={28} rx="3" fill={LINE3} opacity="0.1" />
        <rect x={210} y={78} width={80} height={28} rx="3" fill="none" stroke={LINE3} strokeWidth="0.8" />
        <text x={250} y={95} textAnchor="middle" fill={LINE3} fontSize="6.5" fontFamily="monospace" fontWeight="bold">AGILE</text>
        <line x1={70} y1={106} x2={70} y2={130} stroke={LINE} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />
        <line x1={250} y1={106} x2={250} y2={130} stroke={LINE} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />
        <text x={70} y={145} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Compliance-heavy</text>
        <text x={250} y={145} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">User-feedback loop</text>
        <rect x={110} y={130} width={100} height={28} rx="3" fill={LINE} opacity="0.1" />
        <rect x={110} y={130} width={100} height={28} rx="3" fill="none" stroke={LINE} strokeWidth="0.8" />
        <text x={160} y={147} textAnchor="middle" fill={LINE} fontSize="6.5" fontFamily="monospace" fontWeight="bold">HYBRID</text>
        <line x1={70} y1={106} x2={160} y2={130} stroke={LINE} strokeWidth="0.5" strokeDasharray="2,3" opacity="0.3" />
        <line x1={250} y1={106} x2={160} y2={130} stroke={LINE} strokeWidth="0.5" strokeDasharray="2,3" opacity="0.3" />
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function AG3Diagram() {
  const W = 320; const H = 180;
  const options = [
    { label: 'WATERFALL', sub: 'Stable · Compliant · Gated', x: 55, y: 55, c: LINE2, score: 0.85 },
    { label: 'AGILE', sub: 'Evolving · Iterative · Fast', x: 160, y: 55, c: LINE3, score: 0.6 },
    { label: 'HYBRID', sub: 'Best of both worlds', x: 265, y: 55, c: LINE, score: 0.95 },
    { label: 'KANBAN', sub: 'Continuous flow · Ops', x: 55, y: 130, c: LABEL, score: 0.4 },
  ];
  return (
    <DiagramWrapper label="METHODOLOGY COMMITMENT // AG3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {options.map((o, i) => (
          <g key={i}>
            <rect x={o.x - 50} y={o.y - 28} width={100} height={56} rx="4" fill={o.c} opacity={o.score * 0.15} />
            <rect x={o.x - 50} y={o.y - 28} width={100} height={56} rx="4" fill="none" stroke={o.c} strokeWidth={o.score > 0.8 ? 1.5 : 0.8} style={{ filter: o.score > 0.8 ? `drop-shadow(0 0 6px ${o.c}66)` : undefined }} />
            <text x={o.x} y={o.y - 8} textAnchor="middle" fill={o.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{o.label}</text>
            <text x={o.x} y={o.y + 6} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{o.sub}</text>
            <text x={o.x} y={o.y + 20} textAnchor="middle" fill={o.c} fontSize="6" fontFamily="monospace">FIT: {Math.round(o.score * 100)}%</text>
          </g>
        ))}
        <text x={W/2} y={H-6} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" opacity="0.6">★ RECOMMENDED: HYBRID (95% FIT)</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE DIAGRAMS — Advanced Techniques (remaining A-cards)
// ═══════════════════════════════════════════════════════════════════════════════

// A3 — Performance Gap Analysis
export function PerformanceGapDiagram() {
  const W = 320; const H = 180;
  const metrics = ['Velocity','Quality','Engagement','Delivery','Comms'];
  const current = [55, 40, 70, 60, 45];
  const target = [80, 80, 80, 80, 80];
  return (
    <DiagramWrapper label="PERFORMANCE GAP ANALYSIS // A3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {metrics.map((m, i) => {
          const y = 20 + i * 28;
          const cW = (current[i] / 100) * 200;
          const tW = (target[i] / 100) * 200;
          return (
            <g key={i}>
              <text x={8} y={y + 8} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{m}</text>
              <rect x={80} y={y} width={tW} height={12} rx="2" fill={LINE3} opacity="0.12" />
              <rect x={80} y={y} width={tW} height={12} rx="2" fill="none" stroke={LINE3} strokeWidth="0.5" opacity="0.4" />
              <rect x={80} y={y} width={cW} height={12} rx="2" fill={LINE2} opacity="0.3" />
              <rect x={80} y={y} width={cW} height={12} rx="2" fill="none" stroke={LINE2} strokeWidth="0.8" />
              <text x={80 + cW + 4} y={y + 9} fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.7">GAP: {target[i] - current[i]}%</text>
            </g>
          );
        })}
        <text x={80} y={H-4} fill={LINE2} fontSize="5" fontFamily="monospace">■ Current</text>
        <text x={130} y={H-4} fill={LINE3} fontSize="5" fontFamily="monospace">■ Target</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A4 — Situational Leadership
export function SituationalLeadershipDiagram() {
  const W = 320; const H = 180;
  const quadrants = [
    { label: 'DIRECTING', sub: 'High task · Low support', x: 75, y: 45, c: LINE3 },
    { label: 'COACHING', sub: 'High task · High support', x: 245, y: 45, c: LINE },
    { label: 'DELEGATING', sub: 'Low task · Low support', x: 75, y: 135, c: LINE2 },
    { label: 'SUPPORTING', sub: 'Low task · High support', x: 245, y: 135, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="SITUATIONAL LEADERSHIP MODEL // A4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={160} y1={10} x2={160} y2={H-10} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <line x1={10} y1={90} x2={W-10} y2={90} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <text x={85} y={8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">LOW SUPPORT</text>
        <text x={245} y={8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">HIGH SUPPORT</text>
        <text x={18} y={50} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.5" transform="rotate(-90,18,50)">HIGH TASK</text>
        <text x={18} y={140} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.5" transform="rotate(-90,18,140)">LOW TASK</text>
        {quadrants.map((q, i) => (
          <g key={i}>
            <rect x={q.x - 65} y={q.y - 28} width={130} height={56} rx="4" fill={q.c} opacity="0.1" />
            <rect x={q.x - 65} y={q.y - 28} width={130} height={56} rx="4" fill="none" stroke={q.c} strokeWidth="0.8" />
            <text x={q.x} y={q.y - 6} textAnchor="middle" fill={q.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{q.label}</text>
            <text x={q.x} y={q.y + 10} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{q.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A5 — Communities of Practice
export function CoPDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const communities = [
    { label: 'PM CoP', sub: 'Methods · Tools', x: cx, y: 30, r: 28, c: LINE2 },
    { label: 'TECH CoP', sub: 'Engineering', x: cx - 75, y: cy + 30, r: 24, c: LINE },
    { label: 'DESIGN CoP', sub: 'UX · Visual', x: cx + 75, y: cy + 30, r: 24, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="COMMUNITIES OF PRACTICE // A5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {communities.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={c.r} fill={c.c} opacity="0.1" />
            <circle cx={c.x} cy={c.y} r={c.r} fill="none" stroke={c.c} strokeWidth="1" style={{ filter: `drop-shadow(0 0 4px ${c.c}55)` }} />
            <text x={c.x} y={c.y - 4} textAnchor="middle" fill={c.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{c.label}</text>
            <text x={c.x} y={c.y + 9} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{c.sub}</text>
          </g>
        ))}
        <circle cx={cx} cy={cy + 5} r={18} fill={LINE} opacity="0.08" />
        <circle cx={cx} cy={cy + 5} r={18} fill="none" stroke={LINE} strokeWidth="0.8" strokeDasharray="3,2" />
        <text x={cx} y={cy + 2} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" opacity="0.7">SHARED</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" opacity="0.7">KNOWLEDGE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A6 — Team Building
export function TeamBuildingDiagram() {
  const W = 320; const H = 180;
  const activities = [
    { label: 'SOCIAL\nEVENTS', x: 50, y: 50, c: LINE2 },
    { label: 'SHARED\nGOALS', x: 160, y: 30, c: LINE },
    { label: 'SKILL\nSHARING', x: 270, y: 50, c: LINE3 },
    { label: 'RETROSPECTIVES', x: 50, y: 140, c: LINE },
    { label: 'RECOGNITION', x: 160, y: 155, c: LINE2 },
    { label: 'TEAM\nCHARTER', x: 270, y: 140, c: LINE },
  ];
  const cx = 160; const cy = 95;
  return (
    <DiagramWrapper label="TEAM BUILDING ACTIVITIES // A6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={cx} cy={cy} r={28} fill={LINE2} opacity="0.08" />
        <circle cx={cx} cy={cy} r={28} fill="none" stroke={LINE2} strokeWidth="1" style={{ filter: GLOW2 }} />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={LINE2} fontSize="6.5" fontFamily="monospace" fontWeight="bold">HIGH</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={LINE2} fontSize="6.5" fontFamily="monospace" fontWeight="bold">COHESION</text>
        {activities.map((a, i) => (
          <g key={i}>
            <line x1={cx} y1={cy} x2={a.x} y2={a.y} stroke={a.c} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.3" />
            <rect x={a.x - 30} y={a.y - 16} width={60} height={32} rx="3" fill={a.c} opacity="0.1" />
            <rect x={a.x - 30} y={a.y - 16} width={60} height={32} rx="3" fill="none" stroke={a.c} strokeWidth="0.7" />
            {a.label.split('\n').map((l, j) => (
              <text key={j} x={a.x} y={a.y - 3 + j * 11} textAnchor="middle" fill={a.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{l}</text>
            ))}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A7 — Kaizen Blitz
export function KaizenDiagram() {
  const W = 320; const H = 180;
  const days = ['DAY 1\nMAP','DAY 2\nANALYSE','DAY 3\nIMPROVE','DAY 4\nIMPLEMENT','DAY 5\nSUSTAIN'];
  const xs = [30, 95, 160, 225, 290];
  const colors = [LINE, LINE, LINE3, LINE2, LINE2];
  return (
    <DiagramWrapper label="KAIZEN BLITZ (5-DAY SPRINT) // A7">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {days.map((d, i) => (
          <g key={i}>
            {i < days.length - 1 && (
              <line x1={xs[i]+22} y1={90} x2={xs[i+1]-22} y2={90} stroke={colors[i]} strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={xs[i]-22} y={68} width={44} height={44} rx="4" fill={colors[i]} opacity="0.12" />
            <rect x={xs[i]-22} y={68} width={44} height={44} rx="4" fill="none" stroke={colors[i]} strokeWidth="0.8" />
            {d.split('\n').map((line, j) => (
              <text key={j} x={xs[i]} y={85 + j * 14} textAnchor="middle" fill={colors[i]} fontSize="6" fontFamily="monospace" fontWeight="bold">{line}</text>
            ))}
          </g>
        ))}
        <text x={160} y={H - 6} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace" opacity="0.6">TARGET: 30-50% IMPROVEMENT IN 5 DAYS</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}


// A13 — Reverse Mentoring
export function ReverseMentoringDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="REVERSE MENTORING EXCHANGE // A13">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={20} y={40} width={110} height={90} rx="6" fill={LINE2} opacity="0.1" />
        <rect x={20} y={40} width={110} height={90} rx="6" fill="none" stroke={LINE2} strokeWidth="1" />
        <text x={75} y={68} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace" fontWeight="bold">SENIOR</text>
        <text x={75} y={82} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace" fontWeight="bold">LEADER</text>
        <text x={75} y={100} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Strategy · Domain</text>
        <text x={75} y={112} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">expertise</text>
        <rect x={190} y={40} width={110} height={90} rx="6" fill={LINE3} opacity="0.1" />
        <rect x={190} y={40} width={110} height={90} rx="6" fill="none" stroke={LINE3} strokeWidth="1" />
        <text x={245} y={68} textAnchor="middle" fill={LINE3} fontSize="7" fontFamily="monospace" fontWeight="bold">JUNIOR</text>
        <text x={245} y={82} textAnchor="middle" fill={LINE3} fontSize="7" fontFamily="monospace" fontWeight="bold">MEMBER</text>
        <text x={245} y={100} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Digital · Agile</text>
        <text x={245} y={112} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">new methods</text>
        <line x1={130} y1={75} x2={190} y2={75} stroke={LINE2} strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <line x1={190} y1={90} x2={130} y2={90} stroke={LINE3} strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x={160} y={72} textAnchor="middle" fill={LINE2} fontSize="5" fontFamily="monospace">TEACHES →</text>
        <text x={160} y={95} textAnchor="middle" fill={LINE3} fontSize="5" fontFamily="monospace">← TEACHES</text>
        <text x={160} y={H-6} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">MUTUAL GROWTH · PSYCHOLOGICAL SAFETY</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A14 — Design Thinking
export function DesignThinkingDiagram() {
  const W = 320; const H = 180;
  const phases = ['EMPATHISE','DEFINE','IDEATE','PROTOTYPE','TEST'];
  const xs = [30, 95, 160, 225, 290];
  const colors = [LINE2, LINE, LINE3, LINE, LINE2];
  return (
    <DiagramWrapper label="DESIGN THINKING PROCESS // A14">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {phases.map((p, i) => (
          <g key={i}>
            {i < phases.length - 1 && (
              <line x1={xs[i]+22} y1={90} x2={xs[i+1]-22} y2={90} stroke={colors[i]} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <circle cx={xs[i]} cy={90} r={22} fill={colors[i]} opacity="0.1" />
            <circle cx={xs[i]} cy={90} r={22} fill="none" stroke={colors[i]} strokeWidth="1" style={{ filter: `drop-shadow(0 0 4px ${colors[i]}55)` }} />
            <text x={xs[i]} y={87} textAnchor="middle" fill={colors[i]} fontSize="5" fontFamily="monospace" fontWeight="bold">{p.split(' ')[0]}</text>
            <text x={xs[i]} y={99} textAnchor="middle" fill={colors[i]} fontSize="5" fontFamily="monospace" fontWeight="bold">{p.split(' ')[1] || ''}</text>
          </g>
        ))}
        <path d="M 290,112 Q 160,150 30,112" fill="none" stroke={LINE3} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.3" />
        <text x={160} y={165} textAnchor="middle" fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.5">← ITERATE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A15 — Lean Startup
export function LeanStartupDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const steps = ['BUILD','MEASURE','LEARN'];
  return (
    <DiagramWrapper label="LEAN STARTUP BUILD-MEASURE-LEARN // A15">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={cx} cy={cy} r={60} fill="none" stroke={DIM} strokeWidth="0.5" strokeDasharray="4,2" opacity="0.3" />
        {steps.map((s, i) => {
          const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * 60;
          const y = cy + Math.sin(angle) * 60;
          const c = [LINE3, LINE, LINE2][i];
          const nextAngle = ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
          const nx = cx + Math.cos(nextAngle) * 60;
          const ny = cy + Math.sin(nextAngle) * 60;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={nx} y2={ny} stroke={c} strokeWidth="1" strokeDasharray="4,2" opacity="0.4" />
              <circle cx={x} cy={y} r={20} fill={c} opacity="0.1" />
              <circle cx={x} cy={y} r={20} fill="none" stroke={c} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 5px ${c}66)` }} />
              <text x={x} y={y + 4} textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace" fontWeight="bold">{s}</text>
            </g>
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace">MVP</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace">CYCLE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A16 — Agile Scaling
export function AgileScalingDiagram() {
  const W = 320; const H = 180;
  const frameworks = [
    { label: 'SAFe', sub: 'Portfolio · Program · Team', x: 55, y: 50, c: LINE2 },
    { label: 'LeSS', sub: 'Large-Scale Scrum', x: 160, y: 50, c: LINE },
    { label: 'Nexus', sub: 'Scrum of Scrums', x: 265, y: 50, c: LINE3 },
    { label: 'Scrum@Scale', sub: 'Distributed teams', x: 55, y: 130, c: LINE },
    { label: 'Spotify', sub: 'Tribes · Squads', x: 160, y: 130, c: LINE2 },
    { label: 'DA', sub: 'Disciplined Agile', x: 265, y: 130, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="AGILE SCALING FRAMEWORKS // A16">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {frameworks.map((f, i) => (
          <g key={i}>
            <rect x={f.x - 48} y={f.y - 22} width={96} height={44} rx="4" fill={f.c} opacity="0.1" />
            <rect x={f.x - 48} y={f.y - 22} width={96} height={44} rx="4" fill="none" stroke={f.c} strokeWidth="0.8" />
            <text x={f.x} y={f.y - 4} textAnchor="middle" fill={f.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{f.label}</text>
            <text x={f.x} y={f.y + 10} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{f.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A18 — Sprint Planning
export function SprintPlanningDiagram() {
  const W = 320; const H = 180;
  const items = [
    { label: 'PRODUCT BACKLOG', items: ['Feature A','Feature B','Bug fix C'], x: 10, c: LINE3 },
    { label: 'SPRINT BACKLOG', items: ['Story 1 (5pts)','Story 2 (3pts)','Story 3 (8pts)'], x: 120, c: LINE },
    { label: 'SPRINT GOAL', items: ['Deliver MVP','By Friday','Demo ready'], x: 230, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="SPRINT PLANNING BOARD // A18">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {items.map((col, i) => (
          <g key={i}>
            <rect x={col.x} y={10} width={100} height={160} rx="4" fill={col.c} opacity="0.06" />
            <rect x={col.x} y={10} width={100} height={160} rx="4" fill="none" stroke={col.c} strokeWidth="0.8" />
            <text x={col.x + 50} y={26} textAnchor="middle" fill={col.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{col.label}</text>
            <line x1={col.x} y1={30} x2={col.x + 100} y2={30} stroke={col.c} strokeWidth="0.5" opacity="0.4" />
            {col.items.map((item, j) => (
              <g key={j}>
                <rect x={col.x + 6} y={38 + j * 36} width={88} height={28} rx="3" fill={col.c} opacity="0.1" />
                <text x={col.x + 50} y={55 + j * 36} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{item}</text>
              </g>
            ))}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A19 — Retrospective
export function RetrospectiveDiagram() {
  const W = 320; const H = 180;
  const columns = [
    { label: 'WENT WELL ✓', items: ['Daily standups','Clear scope'], c: LINE2 },
    { label: 'IMPROVE △', items: ['Estimation','Risk reviews'], c: LINE3 },
    { label: 'ACTION ▶', items: ['Add buffer','Weekly risk'], c: LINE },
  ];
  return (
    <DiagramWrapper label="RETROSPECTIVE BOARD // A19">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {columns.map((col, i) => (
          <g key={i}>
            <rect x={10 + i * 103} y={10} width={96} height={160} rx="4" fill={col.c} opacity="0.07" />
            <rect x={10 + i * 103} y={10} width={96} height={160} rx="4" fill="none" stroke={col.c} strokeWidth="0.8" />
            <text x={58 + i * 103} y={26} textAnchor="middle" fill={col.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{col.label}</text>
            <line x1={10 + i * 103} y1={30} x2={106 + i * 103} y2={30} stroke={col.c} strokeWidth="0.4" opacity="0.4" />
            {col.items.map((item, j) => (
              <g key={j}>
                <rect x={16 + i * 103} y={38 + j * 38} width={84} height={28} rx="3" fill={col.c} opacity="0.1" />
                <text x={58 + i * 103} y={55 + j * 38} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{item}</text>
              </g>
            ))}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A20 — Velocity Tracking
export function VelocityDiagram() {
  const W = 320; const H = 180;
  const sprints = ['S1','S2','S3','S4','S5','S6'];
  const velocity = [18, 22, 20, 28, 25, 30];
  const avg = Math.round(velocity.reduce((a,b)=>a+b,0)/velocity.length);
  const maxV = 35;
  const toY = (v: number) => H - 30 - (v / maxV) * (H - 55);
  const toX = (i: number) => 30 + i * 50;
  return (
    <DiagramWrapper label="SPRINT VELOCITY CHART // A20">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={20} y1={toY(avg)} x2={W-10} y2={toY(avg)} stroke={LINE3} strokeWidth="0.8" strokeDasharray="4,2" opacity="0.5" />
        <text x={W-8} y={toY(avg)-3} textAnchor="end" fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.7">AVG {avg}</text>
        {sprints.map((s, i) => {
          const x = toX(i); const y = toY(velocity[i]);
          return (
            <g key={i}>
              <rect x={x - 16} y={y} width={32} height={H - 30 - y} rx="2" fill={LINE2} opacity="0.2" />
              <rect x={x - 16} y={y} width={32} height={H - 30 - y} rx="2" fill="none" stroke={LINE2} strokeWidth="0.8" />
              <text x={x} y={y - 4} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace">{velocity[i]}</text>
              <text x={x} y={H - 14} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{s}</text>
            </g>
          );
        })}
        <text x={10} y={H - 4} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">STORY POINTS PER SPRINT</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A22 — Value Stream Mapping
export function ValueStreamDiagram() {
  const W = 320; const H = 180;
  const steps = [
    { label: 'ORDER', va: 0, nva: 2, x: 30 },
    { label: 'DESIGN', va: 5, nva: 3, x: 100 },
    { label: 'BUILD', va: 8, nva: 4, x: 170 },
    { label: 'TEST', va: 3, nva: 2, x: 240 },
    { label: 'SHIP', va: 1, nva: 1, x: 295 },
  ];
  return (
    <DiagramWrapper label="VALUE STREAM MAP // A22">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => (
          <g key={i}>
            {i < steps.length - 1 && (
              <line x1={s.x + 22} y1={70} x2={steps[i+1].x - 22} y2={70} stroke={LINE} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
            )}
            <rect x={s.x - 22} y={50} width={44} height={40} rx="3" fill={LINE} opacity="0.1" />
            <rect x={s.x - 22} y={50} width={44} height={40} rx="3" fill="none" stroke={LINE} strokeWidth="0.8" />
            <text x={s.x} y={67} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={s.x} y={80} textAnchor="middle" fill={LINE2} fontSize="5" fontFamily="monospace">{s.va}d VA</text>
            <rect x={s.x - 18} y={105} width={36} height={s.nva * 8} rx="2" fill={LINE3} opacity="0.3" />
            <text x={s.x} y={118 + s.nva * 4} textAnchor="middle" fill={LINE3} fontSize="5" fontFamily="monospace">{s.nva}d NVA</text>
          </g>
        ))}
        <text x={10} y={H - 4} fill={LINE2} fontSize="5" fontFamily="monospace">VA = Value-Add</text>
        <text x={100} y={H - 4} fill={LINE3} fontSize="5" fontFamily="monospace">NVA = Non-Value-Add (waste)</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A23 — Lean Principles
export function LeanPrinciplesDiagram() {
  const W = 320; const H = 180;
  const principles = ['DEFINE VALUE','MAP VALUE STREAM','CREATE FLOW','ESTABLISH PULL','SEEK PERFECTION'];
  const xs = [30, 95, 160, 225, 290];
  return (
    <DiagramWrapper label="5 LEAN PRINCIPLES // A23">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {principles.map((p, i) => {
          const c = [LINE2, LINE, LINE2, LINE3, LINE2][i];
          return (
            <g key={i}>
              {i < principles.length - 1 && (
                <line x1={xs[i]+22} y1={90} x2={xs[i+1]-22} y2={90} stroke={c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
              )}
              <circle cx={xs[i]} cy={90} r={22} fill={c} opacity="0.1" />
              <circle cx={xs[i]} cy={90} r={22} fill="none" stroke={c} strokeWidth="1" />
              <text x={xs[i]} y={86} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace" fontWeight="bold">{p.split(' ')[0]}</text>
              <text x={xs[i]} y={97} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace" fontWeight="bold">{p.split(' ').slice(1).join(' ')}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A24 — Theory of Constraints
export function TOCDiagram() {
  const W = 320; const H = 180;
  const steps = ['IDENTIFY\\nCONSTRAINT','EXPLOIT\\nCONSTRAINT','SUBORDINATE\\nEVERYTHING','ELEVATE\\nCONSTRAINT','REPEAT'];
  const xs = [30, 95, 160, 225, 290];
  return (
    <DiagramWrapper label="THEORY OF CONSTRAINTS // A24">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => {
          const c = [LINE3, LINE, LINE, LINE2, LINE2][i];
          return (
            <g key={i}>
              {i < steps.length - 1 && (
                <line x1={xs[i]+22} y1={90} x2={xs[i+1]-22} y2={90} stroke={c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
              )}
              <rect x={xs[i]-22} y={68} width={44} height={44} rx="4" fill={c} opacity="0.1" />
              <rect x={xs[i]-22} y={68} width={44} height={44} rx="4" fill="none" stroke={c} strokeWidth="0.8" />
              {s.split('\\n').map((line, j) => (
                <text key={j} x={xs[i]} y={85 + j * 13} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace" fontWeight="bold">{line}</text>
              ))}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A25 — Cynefin Framework
export function CynefinDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const domains = [
    { label: 'OBVIOUS', sub: 'Sense-Categorise-Respond', x: cx - 75, y: cy - 40, c: LINE2 },
    { label: 'COMPLICATED', sub: 'Sense-Analyse-Respond', x: cx + 75, y: cy - 40, c: LINE },
    { label: 'COMPLEX', sub: 'Probe-Sense-Respond', x: cx - 75, y: cy + 40, c: LINE3 },
    { label: 'CHAOTIC', sub: 'Act-Sense-Respond', x: cx + 75, y: cy + 40, c: LINE3 },
    { label: 'DISORDER', sub: 'Unknown domain', x: cx, y: cy, c: LABEL },
  ];
  return (
    <DiagramWrapper label="CYNEFIN FRAMEWORK // A25">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={cx} y1={10} x2={cx} y2={H-10} stroke={DIM} strokeWidth="1" opacity="0.4" />
        <line x1={10} y1={cy} x2={W-10} y2={cy} stroke={DIM} strokeWidth="1" opacity="0.4" />
        {domains.map((d, i) => (
          <g key={i}>
            {i < 4 && (
              <>
                <rect x={d.x - 60} y={d.y - 26} width={120} height={52} rx="4" fill={d.c} opacity="0.1" />
                <rect x={d.x - 60} y={d.y - 26} width={120} height={52} rx="4" fill="none" stroke={d.c} strokeWidth="0.8" />
                <text x={d.x} y={d.y - 6} textAnchor="middle" fill={d.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{d.label}</text>
                <text x={d.x} y={d.y + 10} textAnchor="middle" fill={LABEL} fontSize="4.5" fontFamily="monospace" opacity="0.6">{d.sub}</text>
              </>
            )}
            {i === 4 && (
              <>
                <circle cx={cx} cy={cy} r={18} fill={d.c} opacity="0.15" />
                <circle cx={cx} cy={cy} r={18} fill="none" stroke={d.c} strokeWidth="0.8" />
                <text x={cx} y={cy + 4} textAnchor="middle" fill={d.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{d.label}</text>
              </>
            )}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A26 — Systems Thinking
export function SystemsThinkingDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const nodes = [
    { label: 'INPUTS', x: 40, y: cy, c: LINE3 },
    { label: 'PROCESS', x: cx, y: 40, c: LINE },
    { label: 'OUTPUTS', x: 280, y: cy, c: LINE2 },
    { label: 'FEEDBACK', x: cx, y: 145, c: LINE },
  ];
  return (
    <DiagramWrapper label="SYSTEMS THINKING MODEL // A26">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={70} y1={cy} x2={cx-28} y2={55} stroke={LINE} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
        <line x1={cx+28} y1={55} x2={250} y2={cy} stroke={LINE} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
        <path d="M 250,100 Q 160,160 70,100" fill="none" stroke={LINE3} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 32} y={n.y - 16} width={64} height={32} rx="4" fill={n.c} opacity="0.1" />
            <rect x={n.x - 32} y={n.y - 16} width={64} height={32} rx="4" fill="none" stroke={n.c} strokeWidth="0.8" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{n.label}</text>
          </g>
        ))}
        <text x={cx} y={H-4} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">CAUSAL LOOPS · EMERGENT BEHAVIOUR · LEVERAGE POINTS</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A27 — Complexity Theory
export function ComplexityDiagram() {
  const W = 320; const H = 180;
  const zones = [
    { label: 'SIMPLE', sub: 'Best practice', x: 75, y: 50, c: LINE2 },
    { label: 'COMPLICATED', sub: 'Good practice', x: 245, y: 50, c: LINE },
    { label: 'COMPLEX', sub: 'Emergent practice', x: 75, y: 135, c: LINE3 },
    { label: 'CHAOTIC', sub: 'Novel practice', x: 245, y: 135, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="COMPLEXITY ZONES // A27">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={160} y1={10} x2={160} y2={H-10} stroke={DIM} strokeWidth="1" opacity="0.4" />
        <line x1={10} y1={92} x2={W-10} y2={92} stroke={DIM} strokeWidth="1" opacity="0.4" />
        <text x={85} y={8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.4">LOW UNCERTAINTY</text>
        <text x={245} y={8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.4">HIGH UNCERTAINTY</text>
        {zones.map((z, i) => (
          <g key={i}>
            <rect x={z.x - 65} y={z.y - 28} width={130} height={56} rx="4" fill={z.c} opacity="0.1" />
            <rect x={z.x - 65} y={z.y - 28} width={130} height={56} rx="4" fill="none" stroke={z.c} strokeWidth="0.8" />
            <text x={z.x} y={z.y - 6} textAnchor="middle" fill={z.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{z.label}</text>
            <text x={z.x} y={z.y + 10} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{z.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A28 — Scenario Planning
export function ScenarioPlanningDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const scenarios = [
    { label: 'BEST CASE', sub: 'Launch on time', x: cx, y: 25, c: LINE2 },
    { label: 'BASE CASE', sub: '2-month delay', x: cx + 90, y: cy, c: LINE },
    { label: 'WORST CASE', sub: '6-month delay', x: cx, y: H - 25, c: LINE3 },
    { label: 'WILD CARD', sub: 'Regulatory block', x: cx - 90, y: cy, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="SCENARIO PLANNING // A28">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {scenarios.map((s, i) => (
          <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke={s.c} strokeWidth="0.8" strokeDasharray="4,2" opacity="0.4" />
        ))}
        <circle cx={cx} cy={cy} r={18} fill={LINE} opacity="0.08" />
        <circle cx={cx} cy={cy} r={18} fill="none" stroke={LINE} strokeWidth="1" />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" fontWeight="bold">CURRENT</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" fontWeight="bold">STATE</text>
        {scenarios.map((s, i) => (
          <g key={i}>
            <rect x={s.x - 40} y={s.y - 18} width={80} height={36} rx="3" fill={s.c} opacity="0.1" />
            <rect x={s.x - 40} y={s.y - 18} width={80} height={36} rx="3" fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={s.x} y={s.y - 3} textAnchor="middle" fill={s.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={s.x} y={s.y + 11} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A30 — Affinity Mapping
export function AffinityDiagram() {
  const W = 320; const H = 180;
  const clusters = [
    { label: 'PROCESS', items: ['Slow approvals','Manual steps'], x: 10, c: LINE3 },
    { label: 'PEOPLE', items: ['Skill gaps','Turnover'], x: 115, c: LINE },
    { label: 'TECHNOLOGY', items: ['Legacy tools','No API'], x: 220, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="AFFINITY MAP // A30">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {clusters.map((col, i) => (
          <g key={i}>
            <rect x={col.x} y={10} width={95} height={160} rx="4" fill={col.c} opacity="0.07" />
            <rect x={col.x} y={10} width={95} height={160} rx="4" fill="none" stroke={col.c} strokeWidth="0.8" />
            <text x={col.x + 47} y={26} textAnchor="middle" fill={col.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{col.label}</text>
            <line x1={col.x} y1={30} x2={col.x + 95} y2={30} stroke={col.c} strokeWidth="0.4" opacity="0.4" />
            {col.items.map((item, j) => (
              <g key={j}>
                <rect x={col.x + 6} y={38 + j * 40} width={83} height={28} rx="3" fill={col.c} opacity="0.12" />
                <text x={col.x + 47} y={55 + j * 40} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{item}</text>
              </g>
            ))}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A31 — Nominal Group Technique
export function NGTDiagram() {
  const W = 320; const H = 180;
  const ideas = [
    { label: 'Automate testing', votes: 9, c: LINE2 },
    { label: 'Reduce approval steps', votes: 7, c: LINE },
    { label: 'Hire Reg. specialist', votes: 6, c: LINE },
    { label: 'Upgrade tooling', votes: 4, c: LABEL },
    { label: 'Improve comms', votes: 2, c: DIM },
  ];
  return (
    <DiagramWrapper label="NOMINAL GROUP TECHNIQUE // A31">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {ideas.map((idea, i) => {
          const barW = (idea.votes / 10) * 180;
          return (
            <g key={i}>
              <text x={8} y={22 + i * 30} fill={idea.c} fontSize="5.5" fontFamily="monospace" opacity="0.8">{idea.label}</text>
              <rect x={8} y={26 + i * 30} width={barW} height={12} rx="2" fill={idea.c} opacity="0.2" />
              <rect x={8} y={26 + i * 30} width={barW} height={12} rx="2" fill="none" stroke={idea.c} strokeWidth="0.7" />
              <text x={barW + 14} y={35 + i * 30} fill={idea.c} fontSize="6" fontFamily="monospace">{idea.votes} pts</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A32 — Delphi Technique (Advanced)
export function DelphiAdvancedDiagram() {
  const W = 320; const H = 180;
  const rounds = [
    { round: 'ROUND 1', range: '6-18 months', consensus: 30, c: LINE3 },
    { round: 'ROUND 2', range: '9-15 months', consensus: 60, c: LINE },
    { round: 'ROUND 3', range: '11-13 months', consensus: 85, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="DELPHI CONSENSUS CONVERGENCE // A32">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {rounds.map((r, i) => {
          const y = 30 + i * 48;
          const barW = (r.consensus / 100) * 220;
          return (
            <g key={i}>
              <text x={8} y={y + 8} fill={r.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{r.round}</text>
              <text x={8} y={y + 20} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Range: {r.range}</text>
              <rect x={8} y={y + 24} width={barW} height={14} rx="2" fill={r.c} opacity="0.2" />
              <rect x={8} y={y + 24} width={barW} height={14} rx="2" fill="none" stroke={r.c} strokeWidth="0.8" />
              <text x={barW + 14} y={y + 34} fill={r.c} fontSize="6" fontFamily="monospace">{r.consensus}% consensus</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A33 — TRIZ
export function TRIZDiagram() {
  const W = 320; const H = 180;
  const steps = ['SPECIFIC\\nPROBLEM','ABSTRACT\\nPROBLEM','ABSTRACT\\nSOLUTION','SPECIFIC\\nSOLUTION'];
  const xs = [40, 130, 190, 280];
  const ys = [50, 50, 130, 130];
  return (
    <DiagramWrapper label="TRIZ PROBLEM-SOLVING MODEL // A33">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={xs[0]+28} y1={ys[0]} x2={xs[1]-28} y2={ys[1]} stroke={LINE3} strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
        <line x1={xs[1]} y1={ys[1]+20} x2={xs[2]} y2={ys[2]-20} stroke={LINE} strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
        <line x1={xs[2]+28} y1={ys[2]} x2={xs[3]-28} y2={ys[3]} stroke={LINE2} strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
        <line x1={xs[0]+28} y1={ys[0]+20} x2={xs[3]-28} y2={ys[3]-20} stroke={LINE2} strokeWidth="0.5" strokeDasharray="2,3" opacity="0.2" />
        {steps.map((s, i) => {
          const c = [LINE3, LINE3, LINE2, LINE2][i];
          return (
            <g key={i}>
              <rect x={xs[i]-28} y={ys[i]-20} width={56} height={40} rx="4" fill={c} opacity="0.1" />
              <rect x={xs[i]-28} y={ys[i]-20} width={56} height={40} rx="4" fill="none" stroke={c} strokeWidth="0.8" />
              {s.split('\\n').map((line, j) => (
                <text key={j} x={xs[i]} y={ys[i] - 4 + j * 13} textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{line}</text>
              ))}
            </g>
          );
        })}
        <text x={160} y={92} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" opacity="0.6">TRIZ CONTRADICTION MATRIX</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A34 — Lateral Thinking
export function LateralThinkingDiagram() {
  const W = 320; const H = 180;
  const hats = [
    { label: 'WHITE', sub: 'Facts & Data', x: 40, y: 45, c: LABEL },
    { label: 'RED', sub: 'Emotions', x: 120, y: 45, c: LINE3 },
    { label: 'BLACK', sub: 'Caution', x: 200, y: 45, c: DIM },
    { label: 'YELLOW', sub: 'Optimism', x: 280, y: 45, c: '#FFD700' },
    { label: 'GREEN', sub: 'Creativity', x: 80, y: 135, c: LINE2 },
    { label: 'BLUE', sub: 'Process', x: 240, y: 135, c: LINE },
  ];
  return (
    <DiagramWrapper label="SIX THINKING HATS // A34">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {hats.map((h, i) => (
          <g key={i}>
            <polygon points={`${h.x},${h.y - 22} ${h.x + 22},${h.y + 8} ${h.x - 22},${h.y + 8}`} fill={h.c} opacity="0.2" />
            <polygon points={`${h.x},${h.y - 22} ${h.x + 22},${h.y + 8} ${h.x - 22},${h.y + 8}`} fill="none" stroke={h.c} strokeWidth="1" />
            <text x={h.x} y={h.y + 22} textAnchor="middle" fill={h.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{h.label}</text>
            <text x={h.x} y={h.y + 34} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{h.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A36 — Appreciative Inquiry
export function AppreciativeInquiryDiagram() {
  const W = 320; const H = 180;
  const phases = ['DISCOVER','DREAM','DESIGN','DELIVER'];
  const xs = [40, 120, 200, 280];
  const colors = [LINE, LINE2, LINE2, LINE3];
  return (
    <DiagramWrapper label="APPRECIATIVE INQUIRY 4D MODEL // A36">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {phases.map((p, i) => {
          const c = colors[i];
          return (
            <g key={i}>
              {i < phases.length - 1 && (
                <line x1={xs[i]+28} y1={90} x2={xs[i+1]-28} y2={90} stroke={c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
              )}
              <circle cx={xs[i]} cy={90} r={28} fill={c} opacity="0.1" />
              <circle cx={xs[i]} cy={90} r={28} fill="none" stroke={c} strokeWidth="1" />
              <text x={xs[i]} y={87} textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace" fontWeight="bold">{p}</text>
              <text x={xs[i]} y={100} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">4D</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A37 — Future State Mapping
export function FutureStateDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="CURRENT → FUTURE STATE MAP // A37">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={10} y={30} width={120} height={120} rx="6" fill={LINE3} opacity="0.08" />
        <rect x={10} y={30} width={120} height={120} rx="6" fill="none" stroke={LINE3} strokeWidth="1" />
        <text x={70} y={52} textAnchor="middle" fill={LINE3} fontSize="7" fontFamily="monospace" fontWeight="bold">CURRENT STATE</text>
        <text x={70} y={70} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Manual processes</text>
        <text x={70} y={84} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Siloed teams</text>
        <text x={70} y={98} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">12-week cycle</text>
        <rect x={190} y={30} width={120} height={120} rx="6" fill={LINE2} opacity="0.08" />
        <rect x={190} y={30} width={120} height={120} rx="6" fill="none" stroke={LINE2} strokeWidth="1" style={{ filter: GLOW2 }} />
        <text x={250} y={52} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace" fontWeight="bold">FUTURE STATE</text>
        <text x={250} y={70} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Automated flow</text>
        <text x={250} y={84} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">Cross-functional</text>
        <text x={250} y={98} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">4-week cycle</text>
        <line x1={130} y1={90} x2={190} y2={90} stroke={LINE} strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
        <text x={160} y={86} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace">GAP</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A41 — SAFe PI Planning
export function PIPlanningDiagram() {
  const W = 320; const H = 180;
  const teams = ['Team A','Team B','Team C'];
  const sprints = ['S1','S2','S3','S4','IP'];
  return (
    <DiagramWrapper label="SAFe PI PLANNING BOARD // A41">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {sprints.map((s, i) => (
          <text key={i} x={90 + i * 46} y={14} textAnchor="middle" fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold" opacity="0.8">{s}</text>
        ))}
        {teams.map((t, ti) => (
          <g key={ti}>
            <text x={8} y={38 + ti * 46} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.7">{t}</text>
            {sprints.map((_, si) => {
              const c = si === 4 ? LINE3 : [LINE2, LINE, LINE2, LINE][si];
              return (
                <g key={si}>
                  <rect x={68 + si * 46} y={24 + ti * 46} width={40} height={32} rx="3" fill={c} opacity="0.1" />
                  <rect x={68 + si * 46} y={24 + ti * 46} width={40} height={32} rx="3" fill="none" stroke={c} strokeWidth="0.6" opacity="0.5" />
                  {si < 4 && <text x={88 + si * 46} y={43 + ti * 46} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace">{[3,5,4,3][si]}pts</text>}
                  {si === 4 && <text x={88 + si * 46} y={43 + ti * 46} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace">IP</text>}
                </g>
              );
            })}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A42 — OKR Cascade
export function OKRCascadeDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="OKR CASCADE // A42">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={80} y={10} width={160} height={36} rx="4" fill={LINE2} opacity="0.1" />
        <rect x={80} y={10} width={160} height={36} rx="4" fill="none" stroke={LINE2} strokeWidth="1" style={{ filter: GLOW2 }} />
        <text x={160} y={24} textAnchor="middle" fill={LINE2} fontSize="6.5" fontFamily="monospace" fontWeight="bold">COMPANY OKR</text>
        <text x={160} y={38} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">Launch insulin pen Q3</text>
        <line x1={160} y1={46} x2={80} y2={72} stroke={DIM} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.4" />
        <line x1={160} y1={46} x2={240} y2={72} stroke={DIM} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.4" />
        {[{ label: 'TEAM OKR', sub: 'Regulatory cleared', x: 80, c: LINE }, { label: 'TEAM OKR', sub: 'Launch campaign live', x: 240, c: LINE }].map((t, i) => (
          <g key={i}>
            <rect x={t.x - 55} y={72} width={110} height={36} rx="4" fill={t.c} opacity="0.1" />
            <rect x={t.x - 55} y={72} width={110} height={36} rx="4" fill="none" stroke={t.c} strokeWidth="0.8" />
            <text x={t.x} y={86} textAnchor="middle" fill={t.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{t.label}</text>
            <text x={t.x} y={100} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{t.sub}</text>
          </g>
        ))}
        <line x1={80} y1={108} x2={60} y2={130} stroke={DIM} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.3" />
        <line x1={80} y1={108} x2={100} y2={130} stroke={DIM} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.3" />
        {[{ label: 'KR1', sub: 'Submit by W4', x: 60 }, { label: 'KR2', sub: 'Approved W8', x: 100 }].map((kr, i) => (
          <g key={i}>
            <rect x={kr.x - 30} y={130} width={60} height={36} rx="3" fill={LINE3} opacity="0.08" />
            <rect x={kr.x - 30} y={130} width={60} height={36} rx="3" fill="none" stroke={LINE3} strokeWidth="0.6" />
            <text x={kr.x} y={145} textAnchor="middle" fill={LINE3} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{kr.label}</text>
            <text x={kr.x} y={158} textAnchor="middle" fill={LABEL} fontSize="4.5" fontFamily="monospace" opacity="0.6">{kr.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A43 — Portfolio Management
export function PortfolioDiagram() {
  const W = 320; const H = 180;
  const projects = [
    { label: 'Insulin Pen', value: 85, effort: 60, r: 14, c: LINE2 },
    { label: 'App v2', value: 70, effort: 40, r: 10, c: LINE },
    { label: 'Compliance', value: 90, effort: 80, r: 16, c: LINE3 },
    { label: 'Training', value: 40, effort: 20, r: 8, c: LABEL },
    { label: 'Rebrand', value: 55, effort: 70, r: 11, c: LINE },
  ];
  const toX = (e: number) => 30 + (e / 100) * 260;
  const toY = (v: number) => H - 20 - (v / 100) * (H - 40);
  return (
    <DiagramWrapper label="PORTFOLIO BUBBLE CHART // A43">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={25} y1={H-18} x2={W-10} y2={H-18} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <line x1={25} y1={H-18} x2={25} y2={10} stroke={DIM} strokeWidth="1" opacity="0.5" />
        <text x={160} y={H-4} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">EFFORT →</text>
        <text x={14} y={90} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5" transform="rotate(-90,14,90)">VALUE ↑</text>
        {projects.map((p, i) => (
          <g key={i}>
            <circle cx={toX(p.effort)} cy={toY(p.value)} r={p.r} fill={p.c} opacity="0.2" />
            <circle cx={toX(p.effort)} cy={toY(p.value)} r={p.r} fill="none" stroke={p.c} strokeWidth="1" />
            <text x={toX(p.effort)} y={toY(p.value) + 3} textAnchor="middle" fill={p.c} fontSize="5" fontFamily="monospace">{p.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A44 — Program Management
export function ProgramMgmtDiagram() {
  const W = 320; const H = 180;
  const projects = [
    { label: 'Regulatory', x: 55, y: 50, c: LINE3 },
    { label: 'Manufacturing', x: 160, y: 50, c: LINE },
    { label: 'Marketing', x: 265, y: 50, c: LINE2 },
    { label: 'Clinical', x: 55, y: 130, c: LINE },
    { label: 'IT Systems', x: 160, y: 130, c: LINE },
    { label: 'Training', x: 265, y: 130, c: LINE2 },
  ];
  const cx = 160; const cy = 90;
  return (
    <DiagramWrapper label="PROGRAM MANAGEMENT STRUCTURE // A44">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {projects.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={p.c} strokeWidth="0.7" strokeDasharray="3,2" opacity="0.3" />
        ))}
        <rect x={cx-38} y={cy-18} width={76} height={36} rx="4" fill={LINE2} opacity="0.12" />
        <rect x={cx-38} y={cy-18} width={76} height={36} rx="4" fill="none" stroke={LINE2} strokeWidth="1.2" style={{ filter: GLOW2 }} />
        <text x={cx} y={cy - 2} textAnchor="middle" fill={LINE2} fontSize="6.5" fontFamily="monospace" fontWeight="bold">PROGRAM</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={LINE2} fontSize="6.5" fontFamily="monospace" fontWeight="bold">MANAGER</text>
        {projects.map((p, i) => (
          <g key={i}>
            <rect x={p.x - 32} y={p.y - 16} width={64} height={32} rx="3" fill={p.c} opacity="0.1" />
            <rect x={p.x - 32} y={p.y - 16} width={64} height={32} rx="3" fill="none" stroke={p.c} strokeWidth="0.7" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fill={p.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{p.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A45 — Benefits Realisation
export function BenefitsRealisationDiagram() {
  const W = 320; const H = 180;
  const benefits = [
    { label: 'Revenue +£2M', actual: 75, target: 100, c: LINE2 },
    { label: 'Cost save 15%', actual: 60, target: 100, c: LINE },
    { label: 'NPS +20pts', actual: 90, target: 100, c: LINE2 },
    { label: 'Time-to-mkt -30%', actual: 40, target: 100, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="BENEFITS REALISATION TRACKER // A45">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {benefits.map((b, i) => {
          const y = 20 + i * 36;
          const barW = (b.actual / 100) * 200;
          return (
            <g key={i}>
              <text x={8} y={y + 9} fill={b.c} fontSize="5.5" fontFamily="monospace" opacity="0.8">{b.label}</text>
              <rect x={8} y={y + 14} width={200} height={14} rx="2" fill={DIM} opacity="0.2" />
              <rect x={8} y={y + 14} width={barW} height={14} rx="2" fill={b.c} opacity="0.3" />
              <rect x={8} y={y + 14} width={barW} height={14} rx="2" fill="none" stroke={b.c} strokeWidth="0.8" />
              <text x={barW + 14} y={y + 24} fill={b.c} fontSize="6" fontFamily="monospace">{b.actual}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A46 — Change Impact Assessment
export function ChangeImpactDiagram() {
  const W = 320; const H = 180;
  const areas = [
    { label: 'PEOPLE', impact: 'HIGH', readiness: 'LOW', x: 55, y: 55, c: LINE3 },
    { label: 'PROCESS', impact: 'MED', readiness: 'MED', x: 160, y: 55, c: LINE },
    { label: 'TECHNOLOGY', impact: 'HIGH', readiness: 'MED', x: 265, y: 55, c: LINE },
    { label: 'STRUCTURE', impact: 'LOW', readiness: 'HIGH', x: 55, y: 130, c: LINE2 },
    { label: 'CULTURE', impact: 'HIGH', readiness: 'LOW', x: 160, y: 130, c: LINE3 },
    { label: 'SYSTEMS', impact: 'MED', readiness: 'HIGH', x: 265, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="CHANGE IMPACT ASSESSMENT // A46">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {areas.map((a, i) => (
          <g key={i}>
            <rect x={a.x - 48} y={a.y - 28} width={96} height={56} rx="4" fill={a.c} opacity="0.1" />
            <rect x={a.x - 48} y={a.y - 28} width={96} height={56} rx="4" fill="none" stroke={a.c} strokeWidth="0.8" />
            <text x={a.x} y={a.y - 10} textAnchor="middle" fill={a.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{a.label}</text>
            <text x={a.x} y={a.y + 4} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">Impact: {a.impact}</text>
            <text x={a.x} y={a.y + 16} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">Ready: {a.readiness}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A48 — Earned Schedule
export function EarnedScheduleDiagram() {
  const W = 320; const H = 180;
  const months = ['M1','M2','M3','M4','M5','M6'];
  const pv = [15, 30, 50, 70, 85, 100];
  const ev = [12, 25, 42, 65, 0, 0];
  const toY = (v: number) => H - 25 - (v / 110) * (H - 50);
  const toX = (i: number) => 30 + i * 50;
  return (
    <DiagramWrapper label="EARNED SCHEDULE (ES) // A48">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={months.map((_, i) => `${toX(i)},${toY(pv[i])}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.5" style={{ filter: GLOW2 }} />
        <polyline points={months.slice(0,4).map((_, i) => `${toX(i)},${toY(ev[i])}`).join(' ')} fill="none" stroke={LINE3} strokeWidth="1.5" style={{ filter: GLOW3 }} />
        {months.map((m, i) => (
          <g key={i}>
            <text x={toX(i)} y={H-8} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{m}</text>
            <GlowDot x={toX(i)} y={toY(pv[i])} r={2.5} color={LINE2} />
            {i < 4 && <GlowDot x={toX(i)} y={toY(ev[i])} r={2.5} color={LINE3} />}
          </g>
        ))}
        <line x1={toX(3)} y1={toY(ev[3])} x2={toX(3)} y2={toY(pv[3])} stroke={LINE3} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
        <text x={toX(3)+4} y={toY((ev[3]+pv[3])/2)} fill={LINE3} fontSize="5" fontFamily="monospace">SV(t)</text>
        <text x={10} y={20} fill={LINE2} fontSize="5.5" fontFamily="monospace">▪ PV (Plan)</text>
        <text x={80} y={20} fill={LINE3} fontSize="5.5" fontFamily="monospace">▪ EV (Actual)</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A49 — Critical Path Method
export function CPMDiagram() {
  const W = 320; const H = 180;
  const nodes = [
    { id: 'A', label: 'A\n2d', x: 30, y: 90, c: LINE2 },
    { id: 'B', label: 'B\n3d', x: 100, y: 50, c: LINE },
    { id: 'C', label: 'C\n4d', x: 100, y: 130, c: LINE },
    { id: 'D', label: 'D\n2d', x: 190, y: 50, c: LINE },
    { id: 'E', label: 'E\n5d', x: 190, y: 130, c: LINE3 },
    { id: 'F', label: 'F\n1d', x: 270, y: 90, c: LINE2 },
  ];
  const edges = [
    { from: 0, to: 1, cp: false }, { from: 0, to: 2, cp: false },
    { from: 1, to: 3, cp: false }, { from: 2, to: 4, cp: true },
    { from: 3, to: 5, cp: false }, { from: 4, to: 5, cp: true },
  ];
  return (
    <DiagramWrapper label="CRITICAL PATH METHOD // A49">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {edges.map((e, i) => (
          <line key={i} x1={nodes[e.from].x + 16} y1={nodes[e.from].y} x2={nodes[e.to].x - 16} y2={nodes[e.to].y}
            stroke={e.cp ? LINE3 : DIM} strokeWidth={e.cp ? 1.5 : 0.8} strokeDasharray={e.cp ? undefined : '3,2'}
            style={{ filter: e.cp ? GLOW3 : undefined }} opacity={e.cp ? 1 : 0.5} />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={16} fill={n.c} opacity="0.12" />
            <circle cx={n.x} cy={n.y} r={16} fill="none" stroke={n.c} strokeWidth="1" />
            {n.label.split('\n').map((l, j) => (
              <text key={j} x={n.x} y={n.y - 2 + j * 11} textAnchor="middle" fill={n.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{l}</text>
            ))}
          </g>
        ))}
        <text x={10} y={H-4} fill={LINE3} fontSize="5.5" fontFamily="monospace">— CRITICAL PATH: A→C→E→F = 12 days</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A50 — Resource Levelling
export function ResourceLevellingDiagram() {
  const W = 320; const H = 180;
  const weeks = ['W1','W2','W3','W4','W5','W6'];
  const before = [3, 5, 4, 6, 2, 3];
  const after = [3, 4, 4, 4, 3, 3];
  const capacity = 4;
  const toY = (v: number) => H - 25 - (v / 7) * (H - 50);
  const toX = (i: number) => 30 + i * 46;
  return (
    <DiagramWrapper label="RESOURCE LEVELLING // A50">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={20} y1={toY(capacity)} x2={W-10} y2={toY(capacity)} stroke={LINE3} strokeWidth="0.8" strokeDasharray="4,2" opacity="0.6" />
        <text x={W-8} y={toY(capacity)-3} textAnchor="end" fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.7">CAPACITY {capacity}</text>
        <polyline points={weeks.map((_, i) => `${toX(i)},${toY(before[i])}`).join(' ')} fill="none" stroke={LINE3} strokeWidth="1.2" strokeDasharray="3,2" opacity="0.7" />
        <polyline points={weeks.map((_, i) => `${toX(i)},${toY(after[i])}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.5" style={{ filter: GLOW2 }} />
        {weeks.map((w, i) => (
          <g key={i}>
            <GlowDot x={toX(i)} y={toY(before[i])} r={2.5} color={LINE3} />
            <GlowDot x={toX(i)} y={toY(after[i])} r={2.5} color={LINE2} />
            <text x={toX(i)} y={H-8} textAnchor="middle" fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.6">{w}</text>
          </g>
        ))}
        <text x={10} y={20} fill={LINE3} fontSize="5.5" fontFamily="monospace">▪ Before</text>
        <text x={60} y={20} fill={LINE2} fontSize="5.5" fontFamily="monospace">▪ After levelling</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A51 — Agile Estimation
export function AgileEstimationDiagram() {
  const W = 320; const H = 180;
  const cards = ['1','2','3','5','8','13','21','?'];
  return (
    <DiagramWrapper label="PLANNING POKER // A51">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {cards.map((c, i) => {
          const x = 12 + i * 38;
          const isSelected = c === '5';
          const col = isSelected ? LINE2 : LINE;
          return (
            <g key={i}>
              <rect x={x} y={50} width={28} height={40} rx="4" fill={col} opacity={isSelected ? 0.25 : 0.1} />
              <rect x={x} y={50} width={28} height={40} rx="4" fill="none" stroke={col} strokeWidth={isSelected ? 1.5 : 0.8}
                style={{ filter: isSelected ? GLOW2 : undefined }} />
              <text x={x + 14} y={75} textAnchor="middle" fill={col} fontSize="10" fontFamily="monospace" fontWeight="bold">{c}</text>
            </g>
          );
        })}
        <text x={160} y={110} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">FIBONACCI SEQUENCE · CONSENSUS ESTIMATION</text>
        <text x={160} y={125} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace" opacity="0.8">TEAM CONSENSUS: 5 STORY POINTS</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A52 — Dependency Mapping
export function DependencyMapDiagram() {
  const W = 320; const H = 180;
  const nodes = [
    { label: 'Regulatory', x: 55, y: 50, c: LINE3 },
    { label: 'Design', x: 160, y: 30, c: LINE },
    { label: 'Manufacturing', x: 265, y: 50, c: LINE },
    { label: 'Clinical', x: 55, y: 130, c: LINE },
    { label: 'IT', x: 160, y: 150, c: LINE2 },
    { label: 'Launch', x: 265, y: 130, c: LINE2 },
  ];
  const deps = [[0,1],[0,3],[1,2],[1,4],[2,5],[3,5],[4,5]];
  return (
    <DiagramWrapper label="DEPENDENCY MAP // A52">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {deps.map((d, i) => (
          <line key={i} x1={nodes[d[0]].x} y1={nodes[d[0]].y} x2={nodes[d[1]].x} y2={nodes[d[1]].y}
            stroke={nodes[d[0]].c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={20} fill={n.c} opacity="0.1" />
            <circle cx={n.x} cy={n.y} r={20} fill="none" stroke={n.c} strokeWidth="1" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{n.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A53 — Assumption Log
export function AssumptionLogDiagram() {
  const W = 320; const H = 180;
  const rows = [
    { id: 'A1', assumption: 'Regulatory approval in 6 months', risk: 'HIGH', c: LINE3 },
    { id: 'A2', assumption: 'Supplier delivers on time', risk: 'MED', c: LINE },
    { id: 'A3', assumption: 'Budget unchanged', risk: 'LOW', c: LINE2 },
    { id: 'A4', assumption: 'Team available full-time', risk: 'MED', c: LINE },
    { id: 'A5', assumption: 'Market demand stable', risk: 'LOW', c: LINE2 },
  ];
  return (
    <DiagramWrapper label="ASSUMPTION LOG // A53">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {['ID','ASSUMPTION','RISK'].map((h, i) => (
          <text key={i} x={[8, 40, 260][i]} y={14} fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold" opacity="0.8">{h}</text>
        ))}
        <line x1={5} y1={18} x2={315} y2={18} stroke={LINE} strokeWidth="0.5" opacity="0.4" />
        {rows.map((r, i) => (
          <g key={i}>
            <text x={8} y={32 + i * 28} fill={r.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{r.id}</text>
            <text x={40} y={32 + i * 28} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.7">{r.assumption}</text>
            <rect x={252} y={22 + i * 28} width={56} height={14} rx="2" fill={r.c} opacity="0.15" />
            <text x={280} y={32 + i * 28} textAnchor="middle" fill={r.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{r.risk}</text>
            <line x1={5} y1={36 + i * 28} x2={315} y2={36 + i * 28} stroke={DIM} strokeWidth="0.3" opacity="0.3" />
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A54 — Issue Log
export function IssueLogDiagram() {
  const W = 320; const H = 180;
  const issues = [
    { id: 'I1', title: 'Supplier delay', priority: 'P1', status: 'OPEN', c: LINE3 },
    { id: 'I2', title: 'Scope creep', priority: 'P2', status: 'IN PROGRESS', c: LINE },
    { id: 'I3', title: 'Resource gap', priority: 'P1', status: 'OPEN', c: LINE3 },
    { id: 'I4', title: 'Budget overrun', priority: 'P2', status: 'RESOLVED', c: LINE2 },
    { id: 'I5', title: 'Comms breakdown', priority: 'P3', status: 'RESOLVED', c: LINE2 },
  ];
  return (
    <DiagramWrapper label="ISSUE LOG // A54">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {['ID','ISSUE','PRI','STATUS'].map((h, i) => (
          <text key={i} x={[8, 38, 190, 230][i]} y={14} fill={LINE} fontSize="5.5" fontFamily="monospace" fontWeight="bold" opacity="0.8">{h}</text>
        ))}
        <line x1={5} y1={18} x2={315} y2={18} stroke={LINE} strokeWidth="0.5" opacity="0.4" />
        {issues.map((r, i) => (
          <g key={i}>
            <text x={8} y={32 + i * 28} fill={r.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{r.id}</text>
            <text x={38} y={32 + i * 28} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.7">{r.title}</text>
            <text x={190} y={32 + i * 28} fill={r.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{r.priority}</text>
            <rect x={222} y={22 + i * 28} width={84} height={14} rx="2" fill={r.c} opacity="0.15" />
            <text x={264} y={32 + i * 28} textAnchor="middle" fill={r.c} fontSize="5" fontFamily="monospace" fontWeight="bold">{r.status}</text>
            <line x1={5} y1={36 + i * 28} x2={315} y2={36 + i * 28} stroke={DIM} strokeWidth="0.3" opacity="0.3" />
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A56 — Blue Ocean Strategy
export function BlueOceanDiagram() {
  const W = 320; const H = 180;
  const factors = ['Price','Service','Features','Speed','Support'];
  const redOcean = [80, 60, 70, 50, 65];
  const blueOcean = [40, 90, 85, 90, 80];
  const toX = (i: number) => 30 + i * 62;
  const toY = (v: number) => H - 25 - (v / 100) * (H - 50);
  return (
    <DiagramWrapper label="BLUE OCEAN STRATEGY CANVAS // A56">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={factors.map((_, i) => `${toX(i)},${toY(redOcean[i])}`).join(' ')} fill="none" stroke={LINE3} strokeWidth="1.2" strokeDasharray="3,2" opacity="0.7" />
        <polyline points={factors.map((_, i) => `${toX(i)},${toY(blueOcean[i])}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.5" style={{ filter: GLOW2 }} />
        {factors.map((f, i) => (
          <g key={i}>
            <GlowDot x={toX(i)} y={toY(redOcean[i])} r={2.5} color={LINE3} />
            <GlowDot x={toX(i)} y={toY(blueOcean[i])} r={2.5} color={LINE2} />
            <text x={toX(i)} y={H-8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{f}</text>
          </g>
        ))}
        <text x={10} y={20} fill={LINE3} fontSize="5.5" fontFamily="monospace">▪ Red Ocean</text>
        <text x={90} y={20} fill={LINE2} fontSize="5.5" fontFamily="monospace">▪ Blue Ocean</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A57 — Customer Journey Mapping
export function CustomerJourneyDiagram() {
  const W = 320; const H = 180;
  const stages = ['AWARE','CONSIDER','PURCHASE','USE','ADVOCATE'];
  const sentiment = [0.4, 0.6, 0.7, 0.85, 0.9];
  const xs = [30, 95, 160, 225, 290];
  const toY = (v: number) => H - 30 - v * 100;
  return (
    <DiagramWrapper label="CUSTOMER JOURNEY MAP // A57">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={xs.map((x, i) => `${x},${toY(sentiment[i])}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.5" style={{ filter: GLOW2 }} />
        {stages.map((s, i) => (
          <g key={i}>
            <GlowDot x={xs[i]} y={toY(sentiment[i])} r={4} color={LINE2} />
            <text x={xs[i]} y={toY(sentiment[i]) - 8} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace">{Math.round(sentiment[i]*100)}%</text>
            <text x={xs[i]} y={H - 14} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s}</text>
          </g>
        ))}
        <text x={10} y={20} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">CUSTOMER SENTIMENT SCORE →</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A59 — Ansoff Matrix
export function AnsoffDiagram() {
  const W = 320; const H = 180;
  const quads = [
    { label: 'MARKET PENETRATION', sub: 'Existing prod · Existing mkt', x: 75, y: 50, c: LINE2 },
    { label: 'PRODUCT DEVELOPMENT', sub: 'New prod · Existing mkt', x: 245, y: 50, c: LINE },
    { label: 'MARKET DEVELOPMENT', sub: 'Existing prod · New mkt', x: 75, y: 135, c: LINE },
    { label: 'DIVERSIFICATION', sub: 'New prod · New mkt', x: 245, y: 135, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="ANSOFF GROWTH MATRIX // A59">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={160} y1={10} x2={160} y2={H-10} stroke={DIM} strokeWidth="1" opacity="0.4" />
        <line x1={10} y1={92} x2={W-10} y2={92} stroke={DIM} strokeWidth="1" opacity="0.4" />
        <text x={85} y={8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.4">EXISTING PRODUCTS</text>
        <text x={245} y={8} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.4">NEW PRODUCTS</text>
        {quads.map((q, i) => (
          <g key={i}>
            <rect x={q.x - 70} y={q.y - 30} width={140} height={60} rx="4" fill={q.c} opacity="0.1" />
            <rect x={q.x - 70} y={q.y - 30} width={140} height={60} rx="4" fill="none" stroke={q.c} strokeWidth="0.8" />
            <text x={q.x} y={q.y - 8} textAnchor="middle" fill={q.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{q.label}</text>
            <text x={q.x} y={q.y + 8} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{q.sub.split(' · ')[0]}</text>
            <text x={q.x} y={q.y + 20} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{q.sub.split(' · ')[1]}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A60 — Influence Mapping
export function InfluenceMapDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const stakeholders = [
    { label: 'CEO', influence: 95, interest: 80, x: cx + 70, y: cy - 50, c: LINE2 },
    { label: 'PMO Head', influence: 80, interest: 90, x: cx + 70, y: cy + 50, c: LINE2 },
    { label: 'Regulator', influence: 90, interest: 60, x: cx - 80, y: cy - 40, c: LINE3 },
    { label: 'End User', influence: 40, interest: 95, x: cx - 80, y: cy + 40, c: LINE },
    { label: 'Vendor', influence: 50, interest: 70, x: cx, y: cy - 70, c: LINE },
  ];
  return (
    <DiagramWrapper label="INFLUENCE MAP // A60">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {stakeholders.map((s, i) => (
          <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke={s.c} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.3" />
        ))}
        <circle cx={cx} cy={cy} r={18} fill={LINE} opacity="0.08" />
        <circle cx={cx} cy={cy} r={18} fill="none" stroke={LINE} strokeWidth="1" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" fontWeight="bold">PROJECT</text>
        {stakeholders.map((s, i) => {
          const r = (s.influence / 100) * 16 + 4;
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={r} fill={s.c} opacity="0.15" />
              <circle cx={s.x} cy={s.y} r={r} fill="none" stroke={s.c} strokeWidth="1" />
              <text x={s.x} y={s.y + 3} textAnchor="middle" fill={s.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A61 — Political Mapping
export function PoliticalMapDiagram() {
  const W = 320; const H = 180;
  const stakeholders = [
    { label: 'SPONSOR', pos: 'CHAMPION', x: 240, y: 40, c: LINE2 },
    { label: 'CFO', pos: 'SUPPORTER', x: 240, y: 100, c: LINE },
    { label: 'IT LEAD', pos: 'NEUTRAL', x: 160, y: 90, c: LABEL },
    { label: 'UNION REP', pos: 'BLOCKER', x: 80, y: 100, c: LINE3 },
    { label: 'REGULATOR', pos: 'WATCHDOG', x: 80, y: 40, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="POLITICAL MAP // A61">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={10} y1={H/2} x2={W-10} y2={H/2} stroke={DIM} strokeWidth="0.8" strokeDasharray="4,2" opacity="0.3" />
        <text x={14} y={H/2 - 4} fill={LINE2} fontSize="5.5" fontFamily="monospace" opacity="0.5">SUPPORTIVE →</text>
        <text x={14} y={H/2 + 12} fill={LINE3} fontSize="5.5" fontFamily="monospace" opacity="0.5">RESISTANT →</text>
        {stakeholders.map((s, i) => (
          <g key={i}>
            <rect x={s.x - 38} y={s.y - 20} width={76} height={40} rx="4" fill={s.c} opacity="0.1" />
            <rect x={s.x - 38} y={s.y - 20} width={76} height={40} rx="4" fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={s.x} y={s.y - 4} textAnchor="middle" fill={s.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={s.x} y={s.y + 10} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s.pos}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A62 — Coalition Building
export function CoalitionDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const members = [
    { label: 'SPONSOR', x: cx, y: 25, c: LINE2 },
    { label: 'PMO HEAD', x: cx + 80, y: cy - 20, c: LINE2 },
    { label: 'TECH LEAD', x: cx + 80, y: cy + 40, c: LINE },
    { label: 'FINANCE', x: cx, y: H - 25, c: LINE },
    { label: 'HR', x: cx - 80, y: cy + 40, c: LINE },
    { label: 'COMMS', x: cx - 80, y: cy - 20, c: LINE },
  ];
  return (
    <DiagramWrapper label="COALITION BUILDING // A62">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {members.map((m, i) => {
          const next = members[(i + 1) % members.length];
          return (
            <line key={i} x1={m.x} y1={m.y} x2={next.x} y2={next.y} stroke={m.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.3" />
          );
        })}
        {members.map((m, i) => (
          <g key={i}>
            <rect x={m.x - 30} y={m.y - 14} width={60} height={28} rx="4" fill={m.c} opacity="0.12" />
            <rect x={m.x - 30} y={m.y - 14} width={60} height={28} rx="4" fill="none" stroke={m.c} strokeWidth="0.8" />
            <text x={m.x} y={m.y + 4} textAnchor="middle" fill={m.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{m.label}</text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r={20} fill={LINE2} opacity="0.08" />
        <circle cx={cx} cy={cy} r={20} fill="none" stroke={LINE2} strokeWidth="0.8" strokeDasharray="3,2" />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace">SHARED</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace">VISION</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A63 — Executive Communication
export function ExecCommsDiagram() {
  const W = 320; const H = 180;
  const formats = [
    { label: 'ONE-PAGE BRIEF', sub: 'Status · Risks · Decisions', x: 55, y: 50, c: LINE2 },
    { label: 'DASHBOARD', sub: 'RAG · KPIs · Trends', x: 160, y: 50, c: LINE },
    { label: 'STEERCO DECK', sub: '5 slides max', x: 265, y: 50, c: LINE3 },
    { label: 'VERBAL UPDATE', sub: '3-min elevator pitch', x: 55, y: 130, c: LINE },
    { label: 'EXCEPTION REPORT', sub: 'Issues only', x: 160, y: 130, c: LINE3 },
    { label: 'DECISION LOG', sub: 'Actions & owners', x: 265, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="EXECUTIVE COMMUNICATION FORMATS // A63">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {formats.map((f, i) => (
          <g key={i}>
            <rect x={f.x - 48} y={f.y - 24} width={96} height={48} rx="4" fill={f.c} opacity="0.1" />
            <rect x={f.x - 48} y={f.y - 24} width={96} height={48} rx="4" fill="none" stroke={f.c} strokeWidth="0.8" />
            <text x={f.x} y={f.y - 6} textAnchor="middle" fill={f.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{f.label}</text>
            <text x={f.x} y={f.y + 8} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{f.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A64 — Meeting Facilitation
export function MeetingFacilitationDiagram() {
  const W = 320; const H = 180;
  const phases = [
    { label: 'OPEN', sub: 'Agenda · Context', x: 40, c: LINE2 },
    { label: 'EXPLORE', sub: 'Discussion · Ideas', x: 110, c: LINE },
    { label: 'DECIDE', sub: 'Vote · Consensus', x: 180, c: LINE3 },
    { label: 'CLOSE', sub: 'Actions · Owners', x: 250, c: LINE2 },
    { label: 'FOLLOW-UP', sub: 'Minutes · Track', x: 300, c: LINE },
  ];
  return (
    <DiagramWrapper label="MEETING FACILITATION FLOW // A64">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {phases.map((p, i) => (
          <g key={i}>
            {i < phases.length - 1 && (
              <line x1={p.x + 28} y1={90} x2={phases[i+1].x - 28} y2={90} stroke={p.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
            )}
            <rect x={p.x - 28} y={68} width={56} height={44} rx="4" fill={p.c} opacity="0.1" />
            <rect x={p.x - 28} y={68} width={56} height={44} rx="4" fill="none" stroke={p.c} strokeWidth="0.8" />
            <text x={p.x} y={86} textAnchor="middle" fill={p.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{p.label}</text>
            <text x={p.x} y={100} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{p.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A65 — Presentation Skills
export function PresentationDiagram() {
  const W = 320; const H = 180;
  const elements = [
    { label: 'HOOK', sub: '30-sec opener', x: 55, y: 45, c: LINE3 },
    { label: 'CONTEXT', sub: 'Why it matters', x: 160, y: 45, c: LINE },
    { label: 'CONTENT', sub: '3 key points', x: 265, y: 45, c: LINE },
    { label: 'EVIDENCE', sub: 'Data · Stories', x: 55, y: 130, c: LINE },
    { label: 'CALL TO ACTION', sub: 'Clear ask', x: 160, y: 130, c: LINE2 },
    { label: 'CLOSE', sub: 'Memorable end', x: 265, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="PRESENTATION STRUCTURE // A65">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {elements.map((e, i) => (
          <g key={i}>
            <rect x={e.x - 48} y={e.y - 22} width={96} height={44} rx="4" fill={e.c} opacity="0.1" />
            <rect x={e.x - 48} y={e.y - 22} width={96} height={44} rx="4" fill="none" stroke={e.c} strokeWidth="0.8" />
            <text x={e.x} y={e.y - 4} textAnchor="middle" fill={e.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{e.label}</text>
            <text x={e.x} y={e.y + 10} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{e.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A66 — Storytelling
export function StorytellingDiagram() {
  const W = 320; const H = 180;
  const arc = [
    { label: 'SETUP', sub: 'Context', x: 30, y: 140, c: LINE },
    { label: 'TENSION', sub: 'Problem', x: 100, y: 100, c: LINE3 },
    { label: 'RISING', sub: 'Stakes', x: 160, y: 60, c: LINE3 },
    { label: 'CLIMAX', sub: 'Decision', x: 210, y: 40, c: LINE2 },
    { label: 'RESOLVE', sub: 'Outcome', x: 290, y: 80, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="STORY ARC // A66">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={arc.map(a => `${a.x},${a.y}`).join(' ')} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="4,2" opacity="0.3" />
        {arc.map((a, i) => (
          <g key={i}>
            <GlowDot x={a.x} y={a.y} r={5} color={a.c} />
            <text x={a.x} y={a.y - 10} textAnchor="middle" fill={a.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{a.label}</text>
            <text x={a.x} y={a.y + 18} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{a.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A67 — Data Visualisation
export function DataVizDiagram() {
  const W = 320; const H = 180;
  const charts = [
    { label: 'BAR', sub: 'Compare categories', x: 55, y: 50, c: LINE2 },
    { label: 'LINE', sub: 'Trends over time', x: 160, y: 50, c: LINE },
    { label: 'PIE', sub: 'Part-to-whole', x: 265, y: 50, c: LINE3 },
    { label: 'SCATTER', sub: 'Correlation', x: 55, y: 130, c: LINE },
    { label: 'HEATMAP', sub: 'Density patterns', x: 160, y: 130, c: LINE3 },
    { label: 'WATERFALL', sub: 'Cumulative change', x: 265, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="CHART SELECTION GUIDE // A67">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {charts.map((c, i) => (
          <g key={i}>
            <rect x={c.x - 44} y={c.y - 22} width={88} height={44} rx="4" fill={c.c} opacity="0.1" />
            <rect x={c.x - 44} y={c.y - 22} width={88} height={44} rx="4" fill="none" stroke={c.c} strokeWidth="0.8" />
            <text x={c.x} y={c.y - 4} textAnchor="middle" fill={c.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{c.label}</text>
            <text x={c.x} y={c.y + 10} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{c.sub}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A68 — Dashboard Design
export function DashboardDesignDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="DASHBOARD LAYOUT // A68">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {/* KPI row */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x={8 + i * 76} y={8} width={68} height={36} rx="3" fill={[LINE2,LINE,LINE3,LINE][i]} opacity="0.1" />
            <rect x={8 + i * 76} y={8} width={68} height={36} rx="3" fill="none" stroke={[LINE2,LINE,LINE3,LINE][i]} strokeWidth="0.7" />
            <text x={42 + i * 76} y={22} textAnchor="middle" fill={[LINE2,LINE,LINE3,LINE][i]} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{['SCHEDULE','BUDGET','QUALITY','RISKS'][i]}</text>
            <text x={42 + i * 76} y={36} textAnchor="middle" fill={[LINE2,LINE3,LINE2,LINE3][i]} fontSize="8" fontFamily="monospace" fontWeight="bold">{['GREEN','AMBER','GREEN','RED'][i]}</text>
          </g>
        ))}
        {/* Chart area */}
        <rect x={8} y={52} width={190} height={80} rx="3" fill={LINE} opacity="0.06" />
        <rect x={8} y={52} width={190} height={80} rx="3" fill="none" stroke={LINE} strokeWidth="0.6" />
        <text x={103} y={65} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" opacity="0.6">BURNDOWN CHART</text>
        {/* Side panel */}
        <rect x={206} y={52} width={106} height={80} rx="3" fill={LINE3} opacity="0.06" />
        <rect x={206} y={52} width={106} height={80} rx="3" fill="none" stroke={LINE3} strokeWidth="0.6" />
        <text x={259} y={65} textAnchor="middle" fill={LINE3} fontSize="5.5" fontFamily="monospace" opacity="0.6">TOP RISKS</text>
        {/* Footer */}
        <rect x={8} y={140} width={304} height={32} rx="3" fill={LINE2} opacity="0.06" />
        <rect x={8} y={140} width={304} height={32} rx="3" fill="none" stroke={LINE2} strokeWidth="0.6" />
        <text x={160} y={158} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace" opacity="0.6">UPCOMING MILESTONES</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A69 — Reporting Frameworks
export function ReportingDiagram() {
  const W = 320; const H = 180;
  const sections = [
    { label: 'EXECUTIVE SUMMARY', sub: 'RAG · Key decisions', y: 12, c: LINE2 },
    { label: 'SCHEDULE STATUS', sub: 'SPI · Milestones', y: 50, c: LINE },
    { label: 'BUDGET STATUS', sub: 'CPI · EAC · Forecast', y: 88, c: LINE },
    { label: 'RISKS & ISSUES', sub: 'Top 3 · Mitigations', y: 126, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="PROJECT STATUS REPORT STRUCTURE // A69">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {sections.map((s, i) => (
          <g key={i}>
            <rect x={10} y={s.y} width={300} height={30} rx="3" fill={s.c} opacity="0.1" />
            <rect x={10} y={s.y} width={300} height={30} rx="3" fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={20} y={s.y + 12} fill={s.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{s.label}</text>
            <text x={20} y={s.y + 24} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.6">{s.sub}</text>
            <rect x={270} y={s.y + 6} width={32} height={18} rx="2" fill={[LINE2,LINE2,LINE,LINE3][i]} opacity="0.2" />
            <text x={286} y={s.y + 18} textAnchor="middle" fill={[LINE2,LINE2,LINE,LINE3][i]} fontSize="6" fontFamily="monospace" fontWeight="bold">{['GREEN','GREEN','AMBER','RED'][i]}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}


// A70 — Mind Mapping
export function MindMapDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const branches = [
    { label: 'REGULATORY', x: cx, y: 25, c: LINE3 },
    { label: 'MARKETING', x: cx + 90, y: cy, c: LINE2 },
    { label: 'SUPPLY CHAIN', x: cx, y: H - 25, c: LINE },
    { label: 'CLINICAL', x: cx - 90, y: cy, c: LINE },
  ];
  return (
    <DiagramWrapper label="MIND MAP // A70">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {branches.map((b, i) => (
          <line key={i} x1={cx} y1={cy} x2={b.x} y2={b.y} stroke={b.c} strokeWidth="1" strokeDasharray="4,2" opacity="0.4" />
        ))}
        <circle cx={cx} cy={cy} r={22} fill={LINE2} opacity="0.1" />
        <circle cx={cx} cy={cy} r={22} fill="none" stroke={LINE2} strokeWidth="1.2" style={{ filter: GLOW2 }} />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace" fontWeight="bold">INSULIN</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={LINE2} fontSize="5.5" fontFamily="monospace" fontWeight="bold">PEN LAUNCH</text>
        {branches.map((b, i) => (
          <g key={i}>
            <rect x={b.x - 36} y={b.y - 14} width={72} height={28} rx="3" fill={b.c} opacity="0.1" />
            <rect x={b.x - 36} y={b.y - 14} width={72} height={28} rx="3" fill="none" stroke={b.c} strokeWidth="0.8" />
            <text x={b.x} y={b.y + 4} textAnchor="middle" fill={b.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{b.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A71 — Concept Mapping
export function ConceptMapDiagram() {
  const W = 320; const H = 180;
  const nodes = [
    { label: 'PROJECT GOAL', x: 160, y: 30, c: LINE2 },
    { label: 'SCOPE', x: 60, y: 90, c: LINE },
    { label: 'RESOURCES', x: 160, y: 90, c: LINE },
    { label: 'TIMELINE', x: 260, y: 90, c: LINE },
    { label: 'DELIVERABLES', x: 60, y: 150, c: LINE3 },
    { label: 'RISKS', x: 260, y: 150, c: LINE3 },
  ];
  const edges = [[0,1],[0,2],[0,3],[1,4],[2,4],[3,5],[2,5]];
  return (
    <DiagramWrapper label="CONCEPT MAP // A71">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {edges.map((e, i) => (
          <line key={i} x1={nodes[e[0]].x} y1={nodes[e[0]].y} x2={nodes[e[1]].x} y2={nodes[e[1]].y}
            stroke={DIM} strokeWidth="0.7" strokeDasharray="3,2" opacity="0.4" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 38} y={n.y - 14} width={76} height={28} rx="3" fill={n.c} opacity="0.1" />
            <rect x={n.x - 38} y={n.y - 14} width={76} height={28} rx="3" fill="none" stroke={n.c} strokeWidth="0.8" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{n.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}




// A74 — After Action Review
export function AARDiagram() {
  const W = 320; const H = 180;
  const questions = [
    { q: 'WHAT WAS PLANNED?', a: 'Launch by Q3 with full regulatory clearance', c: LINE },
    { q: 'WHAT HAPPENED?', a: 'Delayed 6 weeks due to supplier issue', c: LINE3 },
    { q: 'WHY THE DIFFERENCE?', a: 'Single-source supplier risk not mitigated', c: LINE3 },
    { q: 'WHAT DO WE DO NOW?', a: 'Dual-source all critical components', c: LINE2 },
  ];
  return (
    <DiagramWrapper label="AFTER ACTION REVIEW // A74">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {questions.map((item, i) => (
          <g key={i}>
            <rect x={8} y={8 + i * 40} width={304} height={34} rx="3" fill={item.c} opacity="0.08" />
            <rect x={8} y={8 + i * 40} width={304} height={34} rx="3" fill="none" stroke={item.c} strokeWidth="0.7" />
            <text x={16} y={22 + i * 40} fill={item.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{item.q}</text>
            <text x={16} y={34 + i * 40} fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.7">{item.a}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A75 — Continuous Improvement (PDCA)
export function ContinuousImprovementDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const steps = ['PLAN','DO','CHECK','ACT'];
  const angles = [-Math.PI/2, 0, Math.PI/2, Math.PI];
  const colors = [LINE2, LINE, LINE3, LINE2];
  return (
    <DiagramWrapper label="PDCA CYCLE // A75">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={cx} cy={cy} r={60} fill="none" stroke={DIM} strokeWidth="0.5" strokeDasharray="4,2" opacity="0.3" />
        {steps.map((s, i) => {
          const angle = angles[i];
          const x = cx + Math.cos(angle) * 60;
          const y = cy + Math.sin(angle) * 60;
          const nextAngle = angles[(i + 1) % 4];
          const nx = cx + Math.cos(nextAngle) * 60;
          const ny = cy + Math.sin(nextAngle) * 60;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={nx} y2={ny} stroke={colors[i]} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
              <circle cx={x} cy={y} r={22} fill={colors[i]} opacity="0.1" />
              <circle cx={x} cy={y} r={22} fill="none" stroke={colors[i]} strokeWidth="1.2" />
              <text x={x} y={y + 4} textAnchor="middle" fill={colors[i]} fontSize="8" fontFamily="monospace" fontWeight="bold">{s}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A77 — Six Sigma DMAIC
export function SixSigmaDiagram() {
  const W = 320; const H = 180;
  const phases = ['DEFINE','MEASURE','ANALYSE','IMPROVE','CONTROL'];
  const xs = [30, 95, 160, 225, 290];
  const colors = [LINE3, LINE, LINE, LINE2, LINE2];
  return (
    <DiagramWrapper label="DMAIC ROADMAP // A77">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {phases.map((p, i) => {
          const c = colors[i];
          return (
            <g key={i}>
              {i < phases.length - 1 && (
                <line x1={xs[i]+22} y1={90} x2={xs[i+1]-22} y2={90} stroke={c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
              )}
              <circle cx={xs[i]} cy={90} r={22} fill={c} opacity="0.1" />
              <circle cx={xs[i]} cy={90} r={22} fill="none" stroke={c} strokeWidth="1" />
              <text x={xs[i]} y={94} textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{p}</text>
            </g>
          );
        })}
        <text x={160} y={H-6} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.5">DMAIC · TARGET: 6σ</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A78 — TQM Pillars
export function TQMDiagram() {
  const W = 320; const H = 180;
  const pillars = [
    { label: 'CUSTOMER FOCUS', x: 55, y: 55, c: LINE2 },
    { label: 'TOTAL INVOLVEMENT', x: 160, y: 55, c: LINE },
    { label: 'PROCESS CENTRED', x: 265, y: 55, c: LINE },
    { label: 'INTEGRATED SYSTEM', x: 55, y: 130, c: LINE },
    { label: 'STRATEGIC APPROACH', x: 160, y: 130, c: LINE3 },
    { label: 'CONTINUAL IMPROVEMENT', x: 265, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="TQM PILLARS // A78">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {pillars.map((p, i) => (
          <g key={i}>
            <rect x={p.x - 48} y={p.y - 22} width={96} height={44} rx="4" fill={p.c} opacity="0.1" />
            <rect x={p.x - 48} y={p.y - 22} width={96} height={44} rx="4" fill="none" stroke={p.c} strokeWidth="0.8" />
            <text x={p.x} y={p.y - 4} textAnchor="middle" fill={p.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{p.label.split(' ')[0]}</text>
            <text x={p.x} y={p.y + 10} textAnchor="middle" fill={p.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{p.label.split(' ').slice(1).join(' ')}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A79 — Benchmarking
export function BenchmarkingDiagram() {
  const W = 320; const H = 180;
  const metrics = ['Cycle Time','Defect Rate','Cost/Unit','NPS','On-Time'];
  const us = [65, 40, 55, 70, 80];
  const best = [90, 15, 80, 85, 95];
  const toX = (i: number) => 30 + i * 62;
  const toY = (v: number) => H - 25 - (v / 100) * (H - 50);
  return (
    <DiagramWrapper label="BENCHMARKING COMPARISON // A79">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={metrics.map((_, i) => `${toX(i)},${toY(us[i])}`).join(' ')} fill="none" stroke={LINE3} strokeWidth="1.2" strokeDasharray="3,2" opacity="0.7" />
        <polyline points={metrics.map((_, i) => `${toX(i)},${toY(best[i])}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.5" style={{ filter: GLOW2 }} />
        {metrics.map((m, i) => (
          <g key={i}>
            <GlowDot x={toX(i)} y={toY(us[i])} r={2.5} color={LINE3} />
            <GlowDot x={toX(i)} y={toY(best[i])} r={2.5} color={LINE2} />
            <text x={toX(i)} y={H - 8} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{m}</text>
          </g>
        ))}
        <text x={10} y={20} fill={LINE3} fontSize="5.5" fontFamily="monospace">▪ Us</text>
        <text x={40} y={20} fill={LINE2} fontSize="5.5" fontFamily="monospace">▪ Best-in-class</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A80 — Process Improvement
export function ProcessImprovementDiagram() {
  const W = 320; const H = 180;
  const steps = ['IDENTIFY\nWASTE','MAP\nCURRENT','DESIGN\nFUTURE','PILOT\nCHANGE','SCALE\n& SUSTAIN'];
  const xs = [30, 95, 160, 225, 290];
  return (
    <DiagramWrapper label="PROCESS IMPROVEMENT ROADMAP // A80">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s, i) => {
          const c = [LINE3, LINE, LINE, LINE2, LINE2][i];
          return (
            <g key={i}>
              {i < steps.length - 1 && (
                <line x1={xs[i]+22} y1={90} x2={xs[i+1]-22} y2={90} stroke={c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
              )}
              <rect x={xs[i]-22} y={68} width={44} height={44} rx="4" fill={c} opacity="0.1" />
              <rect x={xs[i]-22} y={68} width={44} height={44} rx="4" fill="none" stroke={c} strokeWidth="0.8" />
              {s.split('\n').map((line, j) => (
                <text key={j} x={xs[i]} y={85 + j * 13} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace" fontWeight="bold">{line}</text>
              ))}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A81 — Innovation Funnel
export function InnovationDiagram() {
  const W = 320; const H = 180;
  const stages = ['IDEATION','SCREENING','CONCEPT','DEVELOP','LAUNCH'];
  const counts = [20, 8, 4, 2, 1];
  const xs = [30, 95, 160, 225, 290];
  const toH = (v: number) => (v / 20) * 100;
  return (
    <DiagramWrapper label="INNOVATION FUNNEL // A81">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {stages.map((s, i) => {
          const h = toH(counts[i]);
          const y = (H - 30 - h) / 2 + 10;
          const c = [LINE3, LINE, LINE, LINE2, LINE2][i];
          return (
            <g key={i}>
              <rect x={xs[i]-20} y={y} width={40} height={h} rx="3" fill={c} opacity="0.2" />
              <rect x={xs[i]-20} y={y} width={40} height={h} rx="3" fill="none" stroke={c} strokeWidth="0.8" />
              <text x={xs[i]} y={y - 4} textAnchor="middle" fill={c} fontSize="6" fontFamily="monospace">{counts[i]}</text>
              <text x={xs[i]} y={H - 6} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{s}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// A82 — Strategic Alignment
export function StrategicAlignmentDiagram() {
  const W = 320; const H = 180;
  const levels = [
    { label: 'CORPORATE STRATEGY', sub: 'Market leadership · Growth', y: 15, c: LINE2, w: 300 },
    { label: 'BUSINESS UNIT STRATEGY', sub: 'Product portfolio · Revenue', y: 55, c: LINE, w: 240 },
    { label: 'FUNCTIONAL STRATEGY', sub: 'PMO · Operations · Marketing', y: 95, c: LINE, w: 180 },
    { label: 'PROJECT PORTFOLIO', sub: 'Insulin Pen · App v2 · Compliance', y: 135, c: LINE3, w: 120 },
  ];
  return (
    <DiagramWrapper label="STRATEGIC ALIGNMENT CASCADE // A82">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {levels.map((l, i) => {
          const x = (W - l.w) / 2;
          return (
            <g key={i}>
              <rect x={x} y={l.y} width={l.w} height={32} rx="3" fill={l.c} opacity="0.1" />
              <rect x={x} y={l.y} width={l.w} height={32} rx="3" fill="none" stroke={l.c} strokeWidth="0.8" />
              <text x={W/2} y={l.y + 12} textAnchor="middle" fill={l.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{l.label}</text>
              <text x={W/2} y={l.y + 24} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{l.sub}</text>
              {i < levels.length - 1 && (
                <line x1={W/2} y1={l.y + 32} x2={W/2} y2={l.y + 40} stroke={l.c} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
              )}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

// ── Missing diagram functions (inserted before lookup) ─────────────────────

export function MonteCarloSimulationDiagram() {
  const W = 320; const H = 180;
  const bars = [2,5,12,22,30,25,15,8,3,1];
  const maxV = 30;
  const bw = 24; const gap = 6;
  const startX = (W - bars.length*(bw+gap))/2;
  return (
    <DiagramWrapper label="MONTE CARLO DISTRIBUTION // T9">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {bars.map((v,i) => {
          const bh = (v/maxV)*(H-50);
          const x = startX + i*(bw+gap);
          const y = H-25-bh;
          const c = i>=3&&i<=6 ? LINE2 : LINE;
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw} height={bh} rx="2" fill={c} opacity="0.2" />
              <rect x={x} y={y} width={bw} height={bh} rx="2" fill="none" stroke={c} strokeWidth="0.8" />
            </g>
          );
        })}
        <line x1={startX+3*(bw+gap)} y1={15} x2={startX+3*(bw+gap)} y2={H-25} stroke={LINE3} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.6" />
        <line x1={startX+7*(bw+gap)} y1={15} x2={startX+7*(bw+gap)} y2={H-25} stroke={LINE3} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.6" />
        <text x={startX+3*(bw+gap)} y={12} fill={LINE3} fontSize="5" fontFamily="monospace">P10</text>
        <text x={startX+7*(bw+gap)} y={12} fill={LINE3} fontSize="5" fontFamily="monospace">P90</text>
        <text x={W/2} y={H-6} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.5">SIMULATED OUTCOMES · 10,000 RUNS</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function WaterfallMethodologyDiagram() {
  const W = 320; const H = 180;
  const phases = ['INITIATE','PLAN','DESIGN','BUILD','TEST','DEPLOY'];
  const colors = [LINE2,LINE,LINE,LINE,LINE3,LINE2];
  return (
    <DiagramWrapper label="WATERFALL METHODOLOGY // M1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {phases.map((p,i) => {
          const x = 10 + i*50; const y = 20 + i*22; const w = 80; const h = 22;
          const c = colors[i];
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="3" fill={c} opacity="0.15" />
              <rect x={x} y={y} width={w} height={h} rx="3" fill="none" stroke={c} strokeWidth="0.8" />
              <text x={x+w/2} y={y+14} textAnchor="middle" fill={c} fontSize="6" fontFamily="monospace" fontWeight="bold">{p}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function AgileMethodologyDiagram() {
  const W = 320; const H = 180;
  const cx = 160; const cy = 90;
  const sprints = ['SPRINT 1','SPRINT 2','SPRINT 3','SPRINT 4'];
  const angles = [Math.PI*0, Math.PI*0.5, Math.PI*1, Math.PI*1.5];
  return (
    <DiagramWrapper label="AGILE SPRINT CYCLE // M2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={cx} cy={cy} r={55} fill="none" stroke={DIM} strokeWidth="0.5" strokeDasharray="4,2" opacity="0.3" />
        {sprints.map((s,i) => {
          const a = angles[i];
          const x = cx + Math.cos(a)*55; const y = cy + Math.sin(a)*55;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={20} fill={LINE} opacity="0.1" />
              <circle cx={x} cy={y} r={20} fill="none" stroke={LINE} strokeWidth="1" />
              <text x={x} y={y+4} textAnchor="middle" fill={LINE} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{s}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={18} fill={LINE2} opacity="0.1" />
        <circle cx={cx} cy={cy} r={18} fill="none" stroke={LINE2} strokeWidth="1" />
        <text x={cx} y={cy+4} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace" fontWeight="bold">BACKLOG</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function PRINCEMethodologyDiagram() {
  const W = 320; const H = 180;
  const themes = ['Business Case','Organisation','Quality','Plans','Risk','Change','Progress'];
  return (
    <DiagramWrapper label="PRINCE2 THEMES // M3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={10} y={10} width={300} height={30} rx="3" fill={LINE2} opacity="0.15" />
        <rect x={10} y={10} width={300} height={30} rx="3" fill="none" stroke={LINE2} strokeWidth="0.8" />
        <text x={160} y={30} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace" fontWeight="bold">PRINCE2 FRAMEWORK</text>
        {themes.map((t,i) => {
          const col = i%4; const row = Math.floor(i/4);
          const x = 10 + col*76; const y = 55 + row*55;
          const c = [LINE,LINE,LINE,LINE,LINE3,LINE3,LINE2][i];
          return (
            <g key={i}>
              <rect x={x} y={y} width={70} height={40} rx="3" fill={c} opacity="0.1" />
              <rect x={x} y={y} width={70} height={40} rx="3" fill="none" stroke={c} strokeWidth="0.8" />
              <text x={x+35} y={y+24} textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace">{t}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function HybridMethodologyDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="HYBRID METHODOLOGY // M4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={10} y={30} width={130} height={120} rx="4" fill={LINE2} opacity="0.08" />
        <rect x={10} y={30} width={130} height={120} rx="4" fill="none" stroke={LINE2} strokeWidth="0.8" />
        <text x={75} y={50} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace" fontWeight="bold">WATERFALL</text>
        {['Governance','Milestones','Contracts','Reporting'].map((t,i) => (
          <text key={i} x={75} y={68+i*18} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{t}</text>
        ))}
        <rect x={180} y={30} width={130} height={120} rx="4" fill={LINE} opacity="0.08" />
        <rect x={180} y={30} width={130} height={120} rx="4" fill="none" stroke={LINE} strokeWidth="0.8" />
        <text x={245} y={50} textAnchor="middle" fill={LINE} fontSize="7" fontFamily="monospace" fontWeight="bold">AGILE</text>
        {['Sprints','Backlogs','Retrospectives','Velocity'].map((t,i) => (
          <text key={i} x={245} y={68+i*18} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{t}</text>
        ))}
        <text x={160} y={95} textAnchor="middle" fill={LINE3} fontSize="14" fontFamily="monospace" fontWeight="bold">+</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function InitiationPhaseDiagram() {
  const W = 320; const H = 180;
  const items = ['Business Case','Project Charter','Stakeholder Register','Feasibility Study','Sponsor Sign-off'];
  return (
    <DiagramWrapper label="INITIATION PHASE CHECKLIST // PH1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={22} textAnchor="middle" fill={LINE2} fontSize="8" fontFamily="monospace" fontWeight="bold">PHASE 1: INITIATION</text>
        {items.map((item,i) => (
          <g key={i}>
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill={LINE2} opacity="0.08" />
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill="none" stroke={LINE2} strokeWidth="0.6" />
            <circle cx={38} cy={43+i*28} r={5} fill="none" stroke={LINE2} strokeWidth="0.8" />
            <text x={52} y={47+i*28} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.8">{item}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function PlanningPhaseDiagram() {
  const W = 320; const H = 180;
  const items = ['WBS','Schedule Baseline','Budget Baseline','Risk Register','Comms Plan'];
  return (
    <DiagramWrapper label="PLANNING PHASE OUTPUTS // PH2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={22} textAnchor="middle" fill={LINE} fontSize="8" fontFamily="monospace" fontWeight="bold">PHASE 2: PLANNING</text>
        {items.map((item,i) => (
          <g key={i}>
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill={LINE} opacity="0.08" />
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill="none" stroke={LINE} strokeWidth="0.6" />
            <circle cx={38} cy={43+i*28} r={5} fill="none" stroke={LINE} strokeWidth="0.8" />
            <text x={52} y={47+i*28} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.8">{item}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ExecutionPhaseDiagram() {
  const W = 320; const H = 180;
  const items = ['Team Mobilisation','Work Packages','Quality Assurance','Stakeholder Engagement','Issue Resolution'];
  return (
    <DiagramWrapper label="EXECUTION PHASE // PH3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={22} textAnchor="middle" fill={LINE} fontSize="8" fontFamily="monospace" fontWeight="bold">PHASE 3: EXECUTION</text>
        {items.map((item,i) => (
          <g key={i}>
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill={LINE} opacity="0.08" />
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill="none" stroke={LINE} strokeWidth="0.6" />
            <circle cx={38} cy={43+i*28} r={5} fill="none" stroke={LINE} strokeWidth="0.8" />
            <text x={52} y={47+i*28} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.8">{item}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function MonitoringPhaseDiagram() {
  const W = 320; const H = 180;
  const metrics = ['Schedule Variance','Cost Variance','Scope Creep','Risk Status','Quality KPIs'];
  const values = [0.95, 0.88, 0.12, 0.3, 0.92];
  return (
    <DiagramWrapper label="MONITORING & CONTROL // PH4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={18} textAnchor="middle" fill={LINE3} fontSize="8" fontFamily="monospace" fontWeight="bold">PHASE 4: MONITORING</text>
        {metrics.map((m,i) => {
          const barW = values[i]*220;
          const c = values[i] > 0.7 ? LINE2 : LINE3;
          return (
            <g key={i}>
              <text x={20} y={38+i*28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{m}</text>
              <rect x={20} y={42+i*28} width={220} height={10} rx="2" fill={DIM} opacity="0.2" />
              <rect x={20} y={42+i*28} width={barW} height={10} rx="2" fill={c} opacity="0.5" />
              <text x={248} y={52+i*28} fill={c} fontSize="5.5" fontFamily="monospace">{Math.round(values[i]*100)}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ClosurePhaseDiagram() {
  const W = 320; const H = 180;
  const items = ['Deliverable Handover','Lessons Learned','Final Report','Contract Closure','Team Release'];
  return (
    <DiagramWrapper label="CLOSURE PHASE // PH5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={22} textAnchor="middle" fill={LINE2} fontSize="8" fontFamily="monospace" fontWeight="bold">PHASE 5: CLOSURE</text>
        {items.map((item,i) => (
          <g key={i}>
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill={LINE2} opacity="0.08" />
            <rect x={20} y={32+i*28} width={280} height={22} rx="3" fill="none" stroke={LINE2} strokeWidth="0.6" />
            <line x1={32} y1={43+i*28} x2={38} y2={49+i*28} stroke={LINE2} strokeWidth="1" />
            <line x1={38} y1={43+i*28} x2={44} y2={37+i*28} stroke={LINE2} strokeWidth="1" />
            <text x={52} y={47+i*28} fill={LABEL} fontSize="6" fontFamily="monospace" opacity="0.8">{item}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function StrategistArchetypeDiagram() {
  const W = 320; const H = 180;
  const traits = ['Vision','Systems Thinking','Influence','Long-term Focus','Ambiguity Tolerance'];
  const scores = [0.95, 0.88, 0.82, 0.9, 0.85];
  return (
    <DiagramWrapper label="STRATEGIST ARCHETYPE // AG1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={18} textAnchor="middle" fill={LINE2} fontSize="8" fontFamily="monospace" fontWeight="bold">THE STRATEGIST</text>
        {traits.map((t,i) => {
          const barW = scores[i]*200;
          return (
            <g key={i}>
              <text x={20} y={36+i*28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{t}</text>
              <rect x={20} y={40+i*28} width={200} height={10} rx="2" fill={DIM} opacity="0.2" />
              <rect x={20} y={40+i*28} width={barW} height={10} rx="2" fill={LINE2} opacity="0.5" />
              <text x={228} y={50+i*28} fill={LINE2} fontSize="5.5" fontFamily="monospace">{Math.round(scores[i]*100)}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ExecutorArchetypeDiagram() {
  const W = 320; const H = 180;
  const traits = ['Delivery Focus','Risk Management','Detail Orientation','Process Discipline','Accountability'];
  const scores = [0.95, 0.88, 0.9, 0.85, 0.92];
  return (
    <DiagramWrapper label="EXECUTOR ARCHETYPE // AG2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={18} textAnchor="middle" fill={LINE} fontSize="8" fontFamily="monospace" fontWeight="bold">THE EXECUTOR</text>
        {traits.map((t,i) => {
          const barW = scores[i]*200;
          return (
            <g key={i}>
              <text x={20} y={36+i*28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{t}</text>
              <rect x={20} y={40+i*28} width={200} height={10} rx="2" fill={DIM} opacity="0.2" />
              <rect x={20} y={40+i*28} width={barW} height={10} rx="2" fill={LINE} opacity="0.5" />
              <text x={228} y={50+i*28} fill={LINE} fontSize="5.5" fontFamily="monospace">{Math.round(scores[i]*100)}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function FacilitatorArchetypeDiagram() {
  const W = 320; const H = 180;
  const traits = ['Team Cohesion','Communication','Empathy','Conflict Resolution','Collaboration'];
  const scores = [0.95, 0.92, 0.9, 0.88, 0.93];
  return (
    <DiagramWrapper label="FACILITATOR ARCHETYPE // AG3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <text x={160} y={18} textAnchor="middle" fill={LINE3} fontSize="8" fontFamily="monospace" fontWeight="bold">THE FACILITATOR</text>
        {traits.map((t,i) => {
          const barW = scores[i]*200;
          return (
            <g key={i}>
              <text x={20} y={36+i*28} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{t}</text>
              <rect x={20} y={40+i*28} width={200} height={10} rx="2" fill={DIM} opacity="0.2" />
              <rect x={20} y={40+i*28} width={barW} height={10} rx="2" fill={LINE3} opacity="0.5" />
              <text x={228} y={50+i*28} fill={LINE3} fontSize="5.5" fontFamily="monospace">{Math.round(scores[i]*100)}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function StakeholderEngagementDiagram() {
  const W = 320; const H = 180;
  const levels = [
    { label: 'UNAWARE', x: 40, c: LINE3 },
    { label: 'RESISTANT', x: 100, c: LINE3 },
    { label: 'NEUTRAL', x: 160, c: LABEL },
    { label: 'SUPPORTIVE', x: 220, c: LINE2 },
    { label: 'CHAMPION', x: 280, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="STAKEHOLDER ENGAGEMENT SCALE">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={20} y1={90} x2={300} y2={90} stroke={DIM} strokeWidth="1" opacity="0.3" />
        {levels.map((l,i) => (
          <g key={i}>
            <circle cx={l.x} cy={90} r={18} fill={l.c} opacity="0.1" />
            <circle cx={l.x} cy={90} r={18} fill="none" stroke={l.c} strokeWidth="1" />
            <text x={l.x} y={94} textAnchor="middle" fill={l.c} fontSize="5" fontFamily="monospace" fontWeight="bold">{l.label}</text>
          </g>
        ))}
        <text x={160} y={H-8} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.5">ENGAGEMENT CONTINUUM</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function LeadershipStylesDiagram() {
  const W = 320; const H = 180;
  const styles = [
    { s: 'DIRECTIVE', x: 80, y: 50, c: LINE3 },
    { s: 'COACHING', x: 240, y: 50, c: LINE },
    { s: 'SUPPORTING', x: 80, y: 130, c: LINE2 },
    { s: 'DELEGATING', x: 240, y: 130, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="SITUATIONAL LEADERSHIP GRID">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={160} y1={10} x2={160} y2={H-10} stroke={DIM} strokeWidth="0.5" strokeDasharray="4,2" opacity="0.3" />
        <line x1={10} y1={90} x2={W-10} y2={90} stroke={DIM} strokeWidth="0.5" strokeDasharray="4,2" opacity="0.3" />
        {styles.map((s,i) => (
          <g key={i}>
            <rect x={s.x-50} y={s.y-22} width={100} height={44} rx="4" fill={s.c} opacity="0.1" />
            <rect x={s.x-50} y={s.y-22} width={100} height={44} rx="4" fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={s.x} y={s.y+4} textAnchor="middle" fill={s.c} fontSize="7" fontFamily="monospace" fontWeight="bold">{s.s}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ConflictResolutionDiagram() {
  const W = 320; const H = 180;
  const modes = [
    { m: 'COMPETE', x: 240, y: 40, c: LINE3 },
    { m: 'COLLABORATE', x: 240, y: 130, c: LINE2 },
    { m: 'AVOID', x: 80, y: 40, c: LINE3 },
    { m: 'ACCOMMODATE', x: 80, y: 130, c: LINE },
    { m: 'COMPROMISE', x: 160, y: 90, c: LINE },
  ];
  return (
    <DiagramWrapper label="THOMAS-KILMANN CONFLICT MODES">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={160} y1={10} x2={160} y2={H-10} stroke={DIM} strokeWidth="0.5" strokeDasharray="4,2" opacity="0.3" />
        <line x1={10} y1={90} x2={W-10} y2={90} stroke={DIM} strokeWidth="0.5" strokeDasharray="4,2" opacity="0.3" />
        {modes.map((m,i) => (
          <g key={i}>
            <circle cx={m.x} cy={m.y} r={22} fill={m.c} opacity="0.1" />
            <circle cx={m.x} cy={m.y} r={22} fill="none" stroke={m.c} strokeWidth="0.8" />
            <text x={m.x} y={m.y+4} textAnchor="middle" fill={m.c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{m.m}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function CultureDiagram() {
  const W = 320; const H = 180;
  const layers = [
    { label: 'ARTEFACTS', sub: 'Visible symbols, processes, structure', y: 20, w: 280, c: LINE },
    { label: 'ESPOUSED VALUES', sub: 'Stated goals, strategies, philosophies', y: 65, w: 200, c: LINE2 },
    { label: 'BASIC ASSUMPTIONS', sub: 'Unconscious beliefs, perceptions', y: 110, w: 120, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="SCHEIN CULTURE MODEL">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {layers.map((l,i) => {
          const x = (W-l.w)/2;
          return (
            <g key={i}>
              <rect x={x} y={l.y} width={l.w} height={38} rx="3" fill={l.c} opacity="0.1" />
              <rect x={x} y={l.y} width={l.w} height={38} rx="3" fill="none" stroke={l.c} strokeWidth="0.8" />
              <text x={W/2} y={l.y+14} textAnchor="middle" fill={l.c} fontSize="6.5" fontFamily="monospace" fontWeight="bold">{l.label}</text>
              <text x={W/2} y={l.y+28} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{l.sub}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function DiversityDiagram() {
  const W = 320; const H = 180;
  const dims = ['Gender','Ethnicity','Age','Disability','Neurodiversity','Culture','Experience','Thinking Style'];
  const cx = 160; const cy = 90;
  return (
    <DiagramWrapper label="DIVERSITY DIMENSIONS">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={cx} cy={cy} r={55} fill={LINE2} opacity="0.05" />
        <circle cx={cx} cy={cy} r={55} fill="none" stroke={LINE2} strokeWidth="0.8" />
        {dims.map((d,i) => {
          const a = (i/dims.length)*Math.PI*2 - Math.PI/2;
          const x = cx + Math.cos(a)*55; const y = cy + Math.sin(a)*55;
          const lx = cx + Math.cos(a)*72; const ly = cy + Math.sin(a)*72;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={LINE} strokeWidth="0.5" opacity="0.3" />
              <circle cx={x} cy={y} r={3} fill={LINE2} />
              <text x={lx} y={ly+3} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.7">{d}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function WellbeingDiagram() {
  const W = 320; const H = 180;
  const pillars = ['PHYSICAL','MENTAL','SOCIAL','FINANCIAL','PURPOSE'];
  const scores = [0.8, 0.65, 0.75, 0.7, 0.85];
  return (
    <DiagramWrapper label="WELLBEING PILLARS">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {pillars.map((p,i) => {
          const bh = scores[i]*(H-60);
          const x = 30 + i*58;
          const y = H-25-bh;
          const c = scores[i] > 0.75 ? LINE2 : LINE;
          return (
            <g key={i}>
              <rect x={x-18} y={y} width={36} height={bh} rx="3" fill={c} opacity="0.2" />
              <rect x={x-18} y={y} width={36} height={bh} rx="3" fill="none" stroke={c} strokeWidth="0.8" />
              <text x={x} y={H-8} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{p}</text>
              <text x={x} y={y-4} textAnchor="middle" fill={c} fontSize="5.5" fontFamily="monospace">{Math.round(scores[i]*100)}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function RemoteTeamDiagram() {
  const W = 320; const H = 180;
  const nodes = [
    { label: 'PM HUB', x: 160, y: 90, r: 18, c: LINE2 },
    { label: 'LONDON', x: 60, y: 45, r: 12, c: LINE },
    { label: 'DUBAI', x: 260, y: 45, r: 12, c: LINE },
    { label: 'SINGAPORE', x: 60, y: 135, r: 12, c: LINE },
    { label: 'NEW YORK', x: 260, y: 135, r: 12, c: LINE },
  ];
  return (
    <DiagramWrapper label="DISTRIBUTED TEAM NETWORK">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {nodes.slice(1).map((n,i) => (
          <line key={i} x1={160} y1={90} x2={n.x} y2={n.y} stroke={LINE} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
        ))}
        {nodes.map((n,i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity="0.1" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.c} strokeWidth="1" />
            <text x={n.x} y={n.y+4} textAnchor="middle" fill={n.c} fontSize="4.5" fontFamily="monospace" fontWeight="bold">{n.label}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ProjectCharterDiagram() {
  const W = 320; const H = 180;
  const sections = ['PROJECT TITLE','OBJECTIVES','SCOPE','BUDGET','TIMELINE','SPONSOR','PM'];
  return (
    <DiagramWrapper label="PROJECT CHARTER TEMPLATE">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={10} y={8} width={300} height={22} rx="3" fill={LINE2} opacity="0.2" />
        <rect x={10} y={8} width={300} height={22} rx="3" fill="none" stroke={LINE2} strokeWidth="0.8" />
        <text x={160} y={23} textAnchor="middle" fill={LINE2} fontSize="7" fontFamily="monospace" fontWeight="bold">PROJECT CHARTER</text>
        {sections.map((s,i) => {
          const col = i%2; const row = Math.floor(i/2);
          const x = 10 + col*155; const y = 38 + row*40;
          const w = i===6 ? 300 : 148;
          const c = [LINE,LINE,LINE,LINE3,LINE3,LINE2,LINE2][i];
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={32} rx="2" fill={c} opacity="0.08" />
              <rect x={x} y={y} width={w} height={32} rx="2" fill="none" stroke={c} strokeWidth="0.6" />
              <text x={x+8} y={y+14} fill={c} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{s}</text>
              <line x1={x+8} y1={y+20} x2={x+w-8} y2={y+20} stroke={c} strokeWidth="0.5" opacity="0.3" />
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ScopeManagementDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="SCOPE BOUNDARY DIAGRAM">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <circle cx={160} cy={90} r={70} fill={LINE2} opacity="0.05" />
        <circle cx={160} cy={90} r={70} fill="none" stroke={LINE2} strokeWidth="1" strokeDasharray="4,2" />
        <text x={160} y={30} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace">IN SCOPE</text>
        {['Insulin pen device','Packaging design','Regulatory filing','Clinical data'].map((t,i) => (
          <text key={i} x={160} y={68+i*16} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{t}</text>
        ))}
        {['Marketing campaign','Distribution network'].map((t,i) => (
          <text key={i} x={160} y={H-28+i*14} textAnchor="middle" fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.6">✕ {t}</text>
        ))}
        <text x={160} y={H-6} textAnchor="middle" fill={LINE3} fontSize="5" fontFamily="monospace" opacity="0.5">OUT OF SCOPE</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ScheduleManagementDiagram() {
  const W = 320; const H = 180;
  const tasks = ['Regulatory Prep','Device Design','Clinical Trials','Manufacturing','Launch'];
  const starts = [0,1,2,3,4]; const durations = [3,3,4,2,1];
  const total = 6;
  return (
    <DiagramWrapper label="SCHEDULE BASELINE">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {tasks.map((t,i) => {
          const x = 90 + (starts[i]/total)*210;
          const w = (durations[i]/total)*210;
          const y = 20 + i*30;
          const c = [LINE,LINE,LINE3,LINE,LINE2][i];
          return (
            <g key={i}>
              <text x={85} y={y+14} textAnchor="end" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{t}</text>
              <rect x={x} y={y+2} width={w} height={20} rx="3" fill={c} opacity="0.3" />
              <rect x={x} y={y+2} width={w} height={20} rx="3" fill="none" stroke={c} strokeWidth="0.8" />
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function BudgetManagementDiagram() {
  const W = 320; const H = 180;
  const months = ['M1','M2','M3','M4','M5','M6'];
  const planned = [10,22,38,55,70,85];
  const actual = [12,26,42,60,78,0];
  const toX = (i: number) => 40 + i*(240/5);
  const toY = (v: number) => H-25-(v/100)*(H-50);
  return (
    <DiagramWrapper label="BUDGET S-CURVE">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <polyline points={months.map((_,i) => `${toX(i)},${toY(planned[i])}`).join(' ')} fill="none" stroke={LINE2} strokeWidth="1.5" strokeDasharray="4,2" />
        <polyline points={months.slice(0,5).map((_,i) => `${toX(i)},${toY(actual[i])}`).join(' ')} fill="none" stroke={LINE3} strokeWidth="1.5" />
        {months.map((m,i) => (
          <text key={i} x={toX(i)} y={H-8} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{m}</text>
        ))}
        <text x={20} y={20} fill={LINE2} fontSize="5.5" fontFamily="monospace">▪ Planned</text>
        <text x={80} y={20} fill={LINE3} fontSize="5.5" fontFamily="monospace">▪ Actual</text>
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function QualityManagementDiagram() {
  const W = 320; const H = 180;
  const gates = ['PLAN','DESIGN REVIEW','PROTOTYPE TEST','CLINICAL TRIAL','REGULATORY','LAUNCH'];
  return (
    <DiagramWrapper label="QUALITY GATE PROCESS">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {gates.map((g,i) => {
          const x = 15 + i*49;
          const c = [LINE,LINE,LINE,LINE3,LINE3,LINE2][i];
          return (
            <g key={i}>
              {i < gates.length-1 && (
                <line x1={x+22} y1={90} x2={x+49-22} y2={90} stroke={c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
              )}
              <rect x={x} y={70} width={44} height={40} rx="3" fill={c} opacity="0.1" />
              <rect x={x} y={70} width={44} height={40} rx="3" fill="none" stroke={c} strokeWidth="0.8" />
              {g.split(' ').map((w,j) => (
                <text key={j} x={x+22} y={86+j*12} textAnchor="middle" fill={c} fontSize="5" fontFamily="monospace" fontWeight="bold">{w}</text>
              ))}
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function CommunicationPlanDiagram() {
  const W = 320; const H = 180;
  const rows = [
    { who: 'Sponsor', what: 'Status Report', when: 'Weekly', how: 'Email' },
    { who: 'Steering', what: 'Dashboard', when: 'Monthly', how: 'Meeting' },
    { who: 'Team', what: 'Stand-up', when: 'Daily', how: 'Video' },
    { who: 'Regulator', what: 'Submission', when: 'Milestone', how: 'Portal' },
  ];
  return (
    <DiagramWrapper label="COMMUNICATION MATRIX">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {['WHO','WHAT','WHEN','HOW'].map((h,i) => (
          <text key={i} x={20+i*75} y={22} fill={LINE2} fontSize="6" fontFamily="monospace" fontWeight="bold">{h}</text>
        ))}
        <line x1={10} y1={28} x2={W-10} y2={28} stroke={LINE2} strokeWidth="0.5" opacity="0.4" />
        {rows.map((r,i) => {
          const y = 42+i*32;
          const c = [LINE,LINE,LINE3,LINE2][i];
          return (
            <g key={i}>
              <text x={20} y={y} fill={c} fontSize="5.5" fontFamily="monospace">{r.who}</text>
              <text x={95} y={y} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{r.what}</text>
              <text x={170} y={y} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{r.when}</text>
              <text x={245} y={y} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{r.how}</text>
              <line x1={10} y1={y+8} x2={W-10} y2={y+8} stroke={DIM} strokeWidth="0.3" opacity="0.2" />
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function ResourcePlanningDiagram() {
  const W = 320; const H = 180;
  const resources = ['PM','Regulatory','Clinical','Engineering','QA'];
  const alloc = [100, 80, 60, 90, 70];
  return (
    <DiagramWrapper label="RESOURCE ALLOCATION">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {resources.map((r,i) => {
          const barW = (alloc[i]/100)*220;
          const c = alloc[i] > 85 ? LINE3 : LINE2;
          return (
            <g key={i}>
              <text x={85} y={32+i*28} textAnchor="end" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{r}</text>
              <rect x={90} y={20+i*28} width={220} height={14} rx="2" fill={DIM} opacity="0.2" />
              <rect x={90} y={20+i*28} width={barW} height={14} rx="2" fill={c} opacity="0.5" />
              <text x={318} y={32+i*28} fill={c} fontSize="5.5" fontFamily="monospace">{alloc[i]}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function PerformanceMgmtDiagram() {
  const W = 320; const H = 180;
  const kpis = ['Schedule Performance','Cost Performance','Quality Score','Stakeholder Sat.','Risk Exposure'];
  const scores = [0.92, 0.85, 0.88, 0.78, 0.65];
  return (
    <DiagramWrapper label="PERFORMANCE KPI DASHBOARD">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {kpis.map((k,i) => {
          const barW = scores[i]*200;
          const c = scores[i] > 0.8 ? LINE2 : scores[i] > 0.7 ? LINE : LINE3;
          return (
            <g key={i}>
              <text x={20} y={28+i*30} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.8">{k}</text>
              <rect x={20} y={32+i*30} width={200} height={12} rx="2" fill={DIM} opacity="0.2" />
              <rect x={20} y={32+i*30} width={barW} height={12} rx="2" fill={c} opacity="0.5" />
              <text x={228} y={43+i*30} fill={c} fontSize="5.5" fontFamily="monospace">{Math.round(scores[i]*100)}%</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function PortfolioMgmtDiagram() {
  const W = 320; const H = 180;
  const projects = [
    { name: 'Insulin Pen', value: 90, risk: 70, size: 18, c: LINE2 },
    { name: 'App v2', value: 75, risk: 40, size: 12, c: LINE },
    { name: 'Compliance', value: 60, risk: 20, size: 8, c: LINE },
    { name: 'R&D Pilot', value: 50, risk: 80, size: 10, c: LINE3 },
  ];
  const toX = (v: number) => 40 + (v/100)*240;
  const toY = (r: number) => H-25-(r/100)*(H-50);
  return (
    <DiagramWrapper label="PORTFOLIO BUBBLE CHART">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <line x1={40} y1={H-25} x2={280} y2={H-25} stroke={DIM} strokeWidth="0.5" opacity="0.3" />
        <line x1={40} y1={H-25} x2={40} y2={15} stroke={DIM} strokeWidth="0.5" opacity="0.3" />
        {projects.map((p,i) => (
          <g key={i}>
            <circle cx={toX(p.value)} cy={toY(p.risk)} r={p.size} fill={p.c} opacity="0.2" />
            <circle cx={toX(p.value)} cy={toY(p.risk)} r={p.size} fill="none" stroke={p.c} strokeWidth="0.8" />
            <text x={toX(p.value)} y={toY(p.risk)+4} textAnchor="middle" fill={p.c} fontSize="5" fontFamily="monospace">{p.name}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function VendorMgmtDiagram() {
  const W = 320; const H = 180;
  const vendors = [
    { name: 'Supplier A', perf: 0.92, risk: 0.2, c: LINE2 },
    { name: 'Supplier B', perf: 0.78, risk: 0.5, c: LINE },
    { name: 'Supplier C', perf: 0.65, risk: 0.7, c: LINE3 },
    { name: 'Supplier D', perf: 0.88, risk: 0.3, c: LINE2 },
  ];
  return (
    <DiagramWrapper label="VENDOR SCORECARD">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {['VENDOR','PERFORMANCE','RISK LEVEL','STATUS'].map((h,i) => (
          <text key={i} x={15+i*78} y={22} fill={LINE2} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{h}</text>
        ))}
        <line x1={10} y1={28} x2={W-10} y2={28} stroke={LINE2} strokeWidth="0.5" opacity="0.4" />
        {vendors.map((v,i) => {
          const y = 44+i*32;
          const riskColor = v.risk < 0.35 ? LINE2 : v.risk < 0.6 ? LINE : LINE3;
          const status = v.risk < 0.35 ? 'APPROVED' : v.risk < 0.6 ? 'MONITOR' : 'REVIEW';
          return (
            <g key={i}>
              <text x={15} y={y} fill={v.c} fontSize="5.5" fontFamily="monospace">{v.name}</text>
              <text x={93} y={y} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{Math.round(v.perf*100)}%</text>
              <text x={171} y={y} fill={riskColor} fontSize="5.5" fontFamily="monospace">{Math.round(v.risk*100)}%</text>
              <text x={249} y={y} fill={riskColor} fontSize="5.5" fontFamily="monospace">{status}</text>
              <line x1={10} y1={y+8} x2={W-10} y2={y+8} stroke={DIM} strokeWidth="0.3" opacity="0.2" />
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function MarketAnalysisDiagram() {
  const W = 320; const H = 180;
  const segments = [
    { label: 'TAM', value: '$12B', r: 70, c: LINE, opacity: 0.08 },
    { label: 'SAM', value: '$3.2B', r: 48, c: LINE2, opacity: 0.12 },
    { label: 'SOM', value: '$480M', r: 26, c: LINE2, opacity: 0.25 },
  ];
  return (
    <DiagramWrapper label="MARKET SIZING">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {segments.map((s,i) => (
          <g key={i}>
            <circle cx={160} cy={90} r={s.r} fill={s.c} opacity={s.opacity} />
            <circle cx={160} cy={90} r={s.r} fill="none" stroke={s.c} strokeWidth="0.8" />
            <text x={160+s.r+8} y={90-30+i*25} fill={s.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{s.label}: {s.value}</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function CompetitorAnalysisDiagram() {
  const W = 320; const H = 180;
  const metrics = ['Price','UX','Regulatory','Distribution','Innovation'];
  const us = [80,85,90,70,88];
  const them = [75,90,95,95,85];
  const cx = 160; const cy = 90; const r = 60;
  return (
    <DiagramWrapper label="COMPETITIVE RADAR">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {[0.25,0.5,0.75,1].map((f,i) => (
          <polygon key={i} points={metrics.map((_,j) => {
            const a = (j/metrics.length)*Math.PI*2 - Math.PI/2;
            return `${cx+Math.cos(a)*r*f},${cy+Math.sin(a)*r*f}`;
          }).join(' ')} fill="none" stroke={DIM} strokeWidth="0.4" opacity="0.3" />
        ))}
        {metrics.map((_,j) => {
          const a = (j/metrics.length)*Math.PI*2 - Math.PI/2;
          const lx = cx+Math.cos(a)*(r+12); const ly = cy+Math.sin(a)*(r+12);
          return <text key={j} x={lx} y={ly+3} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.6">{metrics[j]}</text>;
        })}
        <polygon points={us.map((v,j) => {
          const a = (j/metrics.length)*Math.PI*2 - Math.PI/2;
          return `${cx+Math.cos(a)*r*(v/100)},${cy+Math.sin(a)*r*(v/100)}`;
        }).join(' ')} fill={LINE2} fillOpacity="0.1" stroke={LINE2} strokeWidth="1.2" />
        <polygon points={them.map((v,j) => {
          const a = (j/metrics.length)*Math.PI*2 - Math.PI/2;
          return `${cx+Math.cos(a)*r*(v/100)},${cy+Math.sin(a)*r*(v/100)}`;
        }).join(' ')} fill={LINE3} fillOpacity="0.08" stroke={LINE3} strokeWidth="1" strokeDasharray="3,2" />
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function RegulatoryDiagram() {
  const W = 320; const H = 180;
  const steps = [
    { label: 'IND\nFILING', status: 'DONE', c: LINE2 },
    { label: 'PHASE I\nTRIAL', status: 'DONE', c: LINE2 },
    { label: 'PHASE II\nTRIAL', status: 'ACTIVE', c: LINE },
    { label: 'NDA\nSUBMIT', status: 'PENDING', c: DIM },
    { label: 'FDA\nREVIEW', status: 'PENDING', c: DIM },
    { label: 'MARKET\nAPPROVAL', status: 'PENDING', c: DIM },
  ];
  return (
    <DiagramWrapper label="REGULATORY PATHWAY">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {steps.map((s,i) => {
          const x = 20 + i*48;
          return (
            <g key={i}>
              {i < steps.length-1 && (
                <line x1={x+22} y1={90} x2={x+48-22} y2={90} stroke={s.c} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5" />
              )}
              <circle cx={x+12} cy={90} r={20} fill={s.c} opacity="0.1" />
              <circle cx={x+12} cy={90} r={20} fill="none" stroke={s.c} strokeWidth="1" />
              {s.label.split('\n').map((l,j) => (
                <text key={j} x={x+12} y={85+j*12} textAnchor="middle" fill={s.c} fontSize="5" fontFamily="monospace" fontWeight="bold">{l}</text>
              ))}
              <text x={x+12} y={H-8} textAnchor="middle" fill={s.c} fontSize="4.5" fontFamily="monospace" opacity="0.7">{s.status}</text>
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function SustainabilityDiagram() {
  const W = 320; const H = 180;
  const pillars = [
    { label: 'ENVIRONMENTAL', items: ['Carbon footprint','Waste reduction','Green packaging'], x: 55, c: LINE2 },
    { label: 'SOCIAL', items: ['Patient access','Fair labour','Community health'], x: 160, c: LINE },
    { label: 'GOVERNANCE', items: ['Transparency','Ethics','Compliance'], x: 265, c: LINE3 },
  ];
  return (
    <DiagramWrapper label="ESG FRAMEWORK">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {pillars.map((p,i) => (
          <g key={i}>
            <rect x={p.x-48} y={15} width={96} height={150} rx="4" fill={p.c} opacity="0.08" />
            <rect x={p.x-48} y={15} width={96} height={150} rx="4" fill="none" stroke={p.c} strokeWidth="0.8" />
            <text x={p.x} y={32} textAnchor="middle" fill={p.c} fontSize="6" fontFamily="monospace" fontWeight="bold">{p.label}</text>
            <line x1={p.x-40} y1={38} x2={p.x+40} y2={38} stroke={p.c} strokeWidth="0.5" opacity="0.3" />
            {p.items.map((item,j) => (
              <text key={j} x={p.x} y={56+j*22} textAnchor="middle" fill={LABEL} fontSize="5" fontFamily="monospace" opacity="0.7">{item}</text>
            ))}
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function OKRDiagram() {
  const W = 320; const H = 180;
  return (
    <DiagramWrapper label="OKR FRAMEWORK">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        <rect x={10} y={10} width={300} height={38} rx="3" fill={LINE2} opacity="0.12" />
        <rect x={10} y={10} width={300} height={38} rx="3" fill="none" stroke={LINE2} strokeWidth="0.8" />
        <text x={160} y={24} textAnchor="middle" fill={LINE2} fontSize="6" fontFamily="monospace" fontWeight="bold">OBJECTIVE</text>
        <text x={160} y={38} textAnchor="middle" fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">Launch insulin pen in 3 markets by Q4</text>
        {[
          { kr: 'KR1', text: 'Regulatory approval in UAE by Aug', pct: 0.7 },
          { kr: 'KR2', text: '500 HCP prescriptions in Month 1', pct: 0.4 },
          { kr: 'KR3', text: 'NPS ≥ 70 from patient pilot', pct: 0.55 },
        ].map((k,i) => (
          <g key={i}>
            <rect x={10} y={58+i*38} width={300} height={30} rx="3" fill={LINE} opacity="0.07" />
            <rect x={10} y={58+i*38} width={300} height={30} rx="3" fill="none" stroke={LINE} strokeWidth="0.6" />
            <text x={22} y={70+i*38} fill={LINE} fontSize="6" fontFamily="monospace" fontWeight="bold">{k.kr}</text>
            <text x={50} y={70+i*38} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{k.text}</text>
            <rect x={22} y={74+i*38} width={200} height={8} rx="2" fill={DIM} opacity="0.2" />
            <rect x={22} y={74+i*38} width={200*k.pct} height={8} rx="2" fill={LINE2} opacity="0.5" />
            <text x={228} y={82+i*38} fill={LINE2} fontSize="5" fontFamily="monospace">{Math.round(k.pct*100)}%</text>
          </g>
        ))}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}

export function WJSFDiagram() {
  const W = 320; const H = 180;
  const items = [
    { name: 'Regulatory Filing', bv: 9, tc: 8, rr: 9, jd: 3, wsjf: 8.7 },
    { name: 'Device UX Design', bv: 8, tc: 6, rr: 5, jd: 5, wsjf: 3.8 },
    { name: 'Packaging Design', bv: 6, tc: 4, rr: 3, jd: 8, wsjf: 1.6 },
    { name: 'Training Materials', bv: 5, tc: 3, rr: 2, jd: 10, wsjf: 1.0 },
  ];
  return (
    <DiagramWrapper label="WSJF PRIORITISATION">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
        <GridBg w={W} h={H} />
        {['FEATURE','BV','TC','RR','JD','WSJF'].map((h,i) => (
          <text key={i} x={[10,130,160,190,220,260][i]} y={20} fill={LINE2} fontSize="5.5" fontFamily="monospace" fontWeight="bold">{h}</text>
        ))}
        <line x1={8} y1={25} x2={W-8} y2={25} stroke={LINE2} strokeWidth="0.5" opacity="0.4" />
        {items.map((item,i) => {
          const y = 38+i*32;
          const c = i===0 ? LINE2 : LINE;
          return (
            <g key={i}>
              <text x={10} y={y} fill={c} fontSize="5.5" fontFamily="monospace">{item.name}</text>
              {[item.bv,item.tc,item.rr,item.jd].map((v,j) => (
                <text key={j} x={[130,160,190,220][j]+4} y={y} fill={LABEL} fontSize="5.5" fontFamily="monospace" opacity="0.7">{v}</text>
              ))}
              <text x={260} y={y} fill={c} fontSize="6" fontFamily="monospace" fontWeight="bold">{item.wsjf}</text>
              <line x1={8} y1={y+8} x2={W-8} y2={y+8} stroke={DIM} strokeWidth="0.3" opacity="0.2" />
            </g>
          );
        })}
        <Brackets x={2} y={2} w={W-4} h={H-4} />
      </svg>
    </DiagramWrapper>
  );
}


// ============================================================
// MASTER LOOKUP — every card gets a unique diagram
// ============================================================

export function getVisualReference(cardId: string): React.ReactElement | null {
  // ── Tools ──────────────────────────────────────────────────
  if (cardId.startsWith('T1-')) return <GanttDiagram />;
  if (cardId.startsWith('T2-')) return <KanbanDiagram />;
  if (cardId.startsWith('T3-')) return <WBSDiagram />;
  if (cardId.startsWith('T4-')) return <EVMDiagram />;
  if (cardId.startsWith('T5-')) return <RACIDiagram />;
  if (cardId.startsWith('T6-')) return <RiskRegisterDiagram />;
  if (cardId.startsWith('T7-')) return <MoSCoWDiagram />;
  if (cardId.startsWith('T8-')) return <FishboneDiagram />;
  if (cardId.startsWith('T9-')) return <MonteCarloSimulationDiagram />;
  if (cardId.startsWith('T10-')) return <DecisionTreeDiagram />;
  if (cardId.startsWith('T11-')) return <BalancedScorecardDiagram />;
  if (cardId.startsWith('T12-')) return <DelphiDiagram />;
  if (cardId.startsWith('T13-')) return <CostBenefitDiagram />;
  if (cardId.startsWith('T14-')) return <BurndownDiagram />;
  if (cardId.startsWith('T15-')) return <ForceFieldDiagram />;
  if (cardId.startsWith('T16-')) return <StakeholderMatrixDiagram />;
  if (cardId.startsWith('T17-')) return <ScopeStatementDiagram />;

  // ── Methodologies ──────────────────────────────────────────
  if (cardId.startsWith('M1-')) return <WaterfallMethodologyDiagram />;
  if (cardId.startsWith('M2-')) return <AgileMethodologyDiagram />;
  if (cardId.startsWith('M3-')) return <PRINCEMethodologyDiagram />;
  if (cardId.startsWith('M4-')) return <HybridMethodologyDiagram />;

  // ── Phases ─────────────────────────────────────────────────
  if (cardId.startsWith('PH1-')) return <InitiationPhaseDiagram />;
  if (cardId.startsWith('PH2-')) return <PlanningPhaseDiagram />;
  if (cardId.startsWith('PH3-')) return <ExecutionPhaseDiagram />;
  if (cardId.startsWith('PH4-')) return <MonitoringPhaseDiagram />;
  if (cardId.startsWith('PH5-')) return <ClosurePhaseDiagram />;

  // ── Archetypes ─────────────────────────────────────────────
  if (cardId.startsWith('AG1-')) return <StrategistArchetypeDiagram />;
  if (cardId.startsWith('AG2-')) return <ExecutorArchetypeDiagram />;
  if (cardId.startsWith('AG3-')) return <FacilitatorArchetypeDiagram />;

  // ── People domain ──────────────────────────────────────────
  if (cardId.startsWith('people-1')) return <StakeholderMatrixDiagram />;
  if (cardId.startsWith('people-2')) return <StakeholderEngagementDiagram />;
  if (cardId.startsWith('people-3')) return <TeamDynamicsDiagram />;
  if (cardId.startsWith('people-4')) return <LeadershipStylesDiagram />;
  if (cardId.startsWith('people-5')) return <ConflictResolutionDiagram />;
  if (cardId.startsWith('people-6')) return <MotivationDiagram />;
  if (cardId.startsWith('people-7')) return <NegotiationDiagram />;
  if (cardId.startsWith('people-8')) return <EmotionalIntelligenceDiagram />;
  if (cardId.startsWith('people-9')) return <CultureDiagram />;
  if (cardId.startsWith('people-10')) return <DiversityDiagram />;
  if (cardId.startsWith('people-11')) return <WellbeingDiagram />;
  if (cardId.startsWith('people-12')) return <RemoteTeamDiagram />;
  if (cardId.startsWith('people-13')) return <RACIDiagram />;
  if (cardId.startsWith('people-14')) return <StakeholderEngagementDiagram />;

  // ── Process domain ─────────────────────────────────────────
  if (cardId.startsWith('process-1')) return <ProjectCharterDiagram />;
  if (cardId.startsWith('process-2')) return <ScopeManagementDiagram />;
  if (cardId.startsWith('process-3')) return <ScheduleManagementDiagram />;
  if (cardId.startsWith('process-4')) return <BudgetManagementDiagram />;
  if (cardId.startsWith('process-5')) return <QualityManagementDiagram />;
  if (cardId.startsWith('process-6')) return <RiskRegisterDiagram />;
  if (cardId.startsWith('process-7')) return <ProcurementDiagram />;
  if (cardId.startsWith('process-8')) return <CommunicationPlanDiagram />;
  if (cardId.startsWith('process-9')) return <ChangeControlDiagram />;
  if (cardId.startsWith('process-10')) return <GovernanceDiagram />;
  if (cardId.startsWith('process-11')) return <ComplianceDiagram />;
  if (cardId.startsWith('process-12')) return <ResourcePlanningDiagram />;
  if (cardId.startsWith('process-13')) return <PerformanceMgmtDiagram />;
  if (cardId.startsWith('process-14')) return <PortfolioMgmtDiagram />;
  if (cardId.startsWith('process-15')) return <VendorMgmtDiagram />;
  if (cardId.startsWith('process-16')) return <KnowledgeMgmtDiagram />;
  if (cardId.startsWith('process-17')) return <LessonsLearnedProcessDiagram />;

  // ── Business Environment domain ────────────────────────────
  if (cardId.startsWith('business-1')) return <PESTLEDiagram />;
  if (cardId.startsWith('business-2')) return <MarketAnalysisDiagram />;
  if (cardId.startsWith('business-3')) return <CompetitorAnalysisDiagram />;
  if (cardId.startsWith('business-4')) return <RegulatoryDiagram />;
  if (cardId.startsWith('business-5')) return <SustainabilityDiagram />;

  // ── Advanced Techniques ────────────────────────────────────
  if (cardId.startsWith('A1-')) return <SWOTDiagram />;
  if (cardId.startsWith('A2-')) return <PESTLEDiagram />;
  if (cardId.startsWith('A3-')) return <FiveWhysDiagram />;
  if (cardId.startsWith('A4-')) return <FishboneDiagram />;
  if (cardId.startsWith('A5-')) return <PDCADiagram />;
  if (cardId.startsWith('A6-')) return <WJSFDiagram />;
  if (cardId.startsWith('A7-')) return <OKRDiagram />;
  if (cardId.startsWith('A8-')) return <EVMDiagram />;
  if (cardId.startsWith('A9-')) return <MonteCarloSimulationDiagram />;
  if (cardId.startsWith('A10-')) return <DecisionTreeDiagram />;
  if (cardId.startsWith('A11-')) return <ADKARDiagram />;
  if (cardId.startsWith('A12-')) return <KotterDiagram />;
  if (cardId.startsWith('A13-')) return <ReverseMentoringDiagram />;
  if (cardId.startsWith('A14-')) return <DesignThinkingDiagram />;
  if (cardId.startsWith('A15-')) return <LeanStartupDiagram />;
  if (cardId.startsWith('A16-')) return <AgileScalingDiagram />;
  if (cardId.startsWith('A17-')) return <KanbanDiagram />;
  if (cardId.startsWith('A18-')) return <SprintPlanningDiagram />;
  if (cardId.startsWith('A19-')) return <RetrospectiveDiagram />;
  if (cardId.startsWith('A20-')) return <VelocityDiagram />;
  if (cardId.startsWith('A21-')) return <BurndownDiagram />;
  if (cardId.startsWith('A22-')) return <ValueStreamDiagram />;
  if (cardId.startsWith('A23-')) return <LeanPrinciplesDiagram />;
  if (cardId.startsWith('A24-')) return <TOCDiagram />;
  if (cardId.startsWith('A25-')) return <CynefinDiagram />;
  if (cardId.startsWith('A26-')) return <SystemsThinkingDiagram />;
  if (cardId.startsWith('A27-')) return <ComplexityDiagram />;
  if (cardId.startsWith('A28-')) return <ScenarioPlanningDiagram />;
  if (cardId.startsWith('A29-')) return <FiveWhysDiagram />;
  if (cardId.startsWith('A30-')) return <AffinityDiagram />;
  if (cardId.startsWith('A31-')) return <NGTDiagram />;
  if (cardId.startsWith('A32-')) return <DelphiAdvancedDiagram />;
  if (cardId.startsWith('A33-')) return <TRIZDiagram />;
  if (cardId.startsWith('A34-')) return <LateralThinkingDiagram />;
  if (cardId.startsWith('A35-')) return <SWOTDiagram />;
  if (cardId.startsWith('A36-')) return <AppreciativeInquiryDiagram />;
  if (cardId.startsWith('A37-')) return <FutureStateDiagram />;
  if (cardId.startsWith('A38-')) return <ForceFieldDiagram />;
  if (cardId.startsWith('A39-')) return <BalancedScorecardDiagram />;
  if (cardId.startsWith('A40-')) return <WJSFDiagram />;
  if (cardId.startsWith('A41-')) return <PIPlanningDiagram />;
  if (cardId.startsWith('A42-')) return <OKRCascadeDiagram />;
  if (cardId.startsWith('A43-')) return <PortfolioDiagram />;
  if (cardId.startsWith('A44-')) return <ProgramMgmtDiagram />;
  if (cardId.startsWith('A45-')) return <BenefitsRealisationDiagram />;
  if (cardId.startsWith('A46-')) return <ChangeImpactDiagram />;
  if (cardId.startsWith('A47-')) return <OKRDiagram />;
  if (cardId.startsWith('A48-')) return <EarnedScheduleDiagram />;
  if (cardId.startsWith('A49-')) return <CPMDiagram />;
  if (cardId.startsWith('A50-')) return <ResourceLevellingDiagram />;
  if (cardId.startsWith('A51-')) return <AgileEstimationDiagram />;
  if (cardId.startsWith('A52-')) return <DependencyMapDiagram />;
  if (cardId.startsWith('A53-')) return <AssumptionLogDiagram />;
  if (cardId.startsWith('A54-')) return <IssueLogDiagram />;
  if (cardId.startsWith('A55-')) return <RiskRegisterDiagram />;
  if (cardId.startsWith('A56-')) return <BlueOceanDiagram />;
  if (cardId.startsWith('A57-')) return <CustomerJourneyDiagram />;
  if (cardId.startsWith('A58-')) return <StakeholderMatrixDiagram />;
  if (cardId.startsWith('A59-')) return <AnsoffDiagram />;
  if (cardId.startsWith('A60-')) return <InfluenceMapDiagram />;
  if (cardId.startsWith('A61-')) return <PoliticalMapDiagram />;
  if (cardId.startsWith('A62-')) return <CoalitionDiagram />;
  if (cardId.startsWith('A63-')) return <ExecCommsDiagram />;
  if (cardId.startsWith('A64-')) return <MeetingFacilitationDiagram />;
  if (cardId.startsWith('A65-')) return <PresentationDiagram />;
  if (cardId.startsWith('A66-')) return <StorytellingDiagram />;
  if (cardId.startsWith('A67-')) return <DataVizDiagram />;
  if (cardId.startsWith('A68-')) return <DashboardDesignDiagram />;
  if (cardId.startsWith('A69-')) return <ReportingDiagram />;
  if (cardId.startsWith('A70-')) return <MindMapDiagram />;
  if (cardId.startsWith('A71-')) return <ConceptMapDiagram />;
  if (cardId.startsWith('A72-')) return <KnowledgeMgmtDiagram />;
  if (cardId.startsWith('A73-')) return <LessonsLearnedProcessDiagram />;
  if (cardId.startsWith('A74-')) return <AARDiagram />;
  if (cardId.startsWith('A75-')) return <ContinuousImprovementDiagram />;
  if (cardId.startsWith('A76-')) return <KaizenDiagram />;
  if (cardId.startsWith('A77-')) return <SixSigmaDiagram />;
  if (cardId.startsWith('A78-')) return <TQMDiagram />;
  if (cardId.startsWith('A79-')) return <BenchmarkingDiagram />;
  if (cardId.startsWith('A80-')) return <ProcessImprovementDiagram />;
  if (cardId.startsWith('A81-')) return <InnovationDiagram />;
  if (cardId.startsWith('A82-')) return <StrategicAlignmentDiagram />;

  return null;
}
