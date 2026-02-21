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
// Master lookup — returns the right diagram for a given card ID
// ═══════════════════════════════════════════════════════════════════════════════
export function getVisualReference(cardId: string, cardTitle?: string): React.ReactNode | null {
  // Tools deck
  if (cardId === 'T1') return <GanttDiagram />;
  if (cardId === 'T2') return <KanbanDiagram />;
  if (cardId === 'T3') return <WBSDiagram />;
  if (cardId === 'T4') return <EVMDiagram />;
  if (cardId === 'T5') return <RACIDiagram />;
  if (cardId === 'T6') return <RiskRegisterDiagram />;
  if (cardId === 'T7') return <MoSCoWDiagram />;
  if (cardId === 'T8') return <FishboneDiagram />;
  if (cardId === 'T9') return <MonteCarloDiagram />;
  if (cardId === 'T10') return <DecisionTreeDiagram />;
  if (cardId === 'T11') return <BalancedScorecardDiagram />;
  if (cardId === 'T12') return <StakeholderMatrixDiagram />;
  if (cardId === 'T13') return <ForceFieldDiagram />;
  if (cardId === 'T14') return <ScopeStatementDiagram />;
  if (cardId === 'T15') return <DelphiDiagram />;
  if (cardId === 'T16') return <CostBenefitDiagram />;
  if (cardId === 'T17') return <BurndownDiagram />;
  // Methodologies
  if (cardId === 'M1') return <WaterfallDiagram />;
  if (cardId === 'M2') return <AgileSprintDiagram />;
  if (cardId === 'M3') return <KanbanMethodDiagram />;
  if (cardId === 'M4') return <HybridDiagram />;
  // Project Phases
  if (cardId === 'phase-setup' || cardId === 'phase-execution' || cardId === 'phase-closure')
    return <ProjectPhasesDiagram phase={cardId} />;
  // Archetypes
  if (cardId === 'AG1' || cardId === 'AG2' || cardId === 'AG3') return <ArchetypeDiagram />;
  // People domain
  if (cardId.startsWith('people-')) return <PeopleDiagram title={cardTitle} />;
  // Process domain
  if (cardId.startsWith('process-')) return <ProcessDiagram title={cardTitle} />;
  // Business environment
  if (cardId.startsWith('business-')) return <BusinessEnvDiagram />;
  // Advanced techniques — show radar chart for all A* cards
  if (cardId.startsWith('A')) return <TechniqueDiagram title={cardTitle} />;
  return null;
}
