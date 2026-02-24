// MindMap — Snowflake Force-Directed Graph of PM Tool Relationships
// Pure SVG + requestAnimationFrame physics simulation (no external library)
// Click a node to expand/collapse its neighbours; tap a node to navigate to card

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  X,
  Info,
} from 'lucide-react';
import { CARDS, DECKS, getDeckById, getCardById, type PMOCard } from '@/lib/pmoData';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── GRAPH DATA TYPES ─────────────────────────────────────────────────────────
interface GraphNode {
  id: string;
  code: string;
  title: string;
  deckId: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  visible: boolean;
  expanded: boolean;
  pinned: boolean;
}

interface GraphEdge {
  source: string;
  target: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const NODE_RADIUS_DEFAULT = 22;
const NODE_RADIUS_ROOT = 30;
const MAX_VISIBLE_NODES = 60;

// Build a lookup map: cardCode → cardId
function buildCodeToIdMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of CARDS) {
    map.set(c.code, c.id);
    map.set(c.id, c.id); // also accept id directly
  }
  return map;
}

const CODE_TO_ID = buildCodeToIdMap();

function resolveId(codeOrId: string): string | null {
  return CODE_TO_ID.get(codeOrId) ?? null;
}

// ─── FORCE SIMULATION ─────────────────────────────────────────────────────────
const REPULSION = 4000;
const ATTRACTION = 0.04;
const DAMPING = 0.82;
const CENTER_PULL = 0.015;

function runSimulationStep(
  nodes: GraphNode[],
  edges: GraphEdge[],
  cx: number,
  cy: number
) {
  const visibleNodes = nodes.filter(n => n.visible);
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Repulsion between all visible nodes
  for (let i = 0; i < visibleNodes.length; i++) {
    for (let j = i + 1; j < visibleNodes.length; j++) {
      const a = visibleNodes[i];
      const b = visibleNodes[j];
      if (a.pinned && b.pinned) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist2 = dx * dx + dy * dy + 1;
      const dist = Math.sqrt(dist2);
      const force = REPULSION / dist2;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      if (!a.pinned) { a.vx -= fx; a.vy -= fy; }
      if (!b.pinned) { b.vx += fx; b.vy += fy; }
    }
  }

  // Attraction along edges
  for (const edge of edges) {
    const a = nodeMap.get(edge.source);
    const b = nodeMap.get(edge.target);
    if (!a || !b || !a.visible || !b.visible) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 1;
    const idealDist = (a.radius + b.radius) * 3.5;
    const force = (dist - idealDist) * ATTRACTION;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    if (!a.pinned) { a.vx += fx; a.vy += fy; }
    if (!b.pinned) { b.vx -= fx; b.vy -= fy; }
  }

  // Center pull
  for (const n of visibleNodes) {
    if (n.pinned) continue;
    n.vx += (cx - n.x) * CENTER_PULL;
    n.vy += (cy - n.y) * CENTER_PULL;
  }

  // Apply velocity + damping
  for (const n of visibleNodes) {
    if (n.pinned) continue;
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.x += n.vx;
    n.y += n.vy;
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MindMap() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const [renderTick, setRenderTick] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const W = 360;
  const H = 500;
  const CX = W / 2;
  const CY = H / 2;

  // ── Build initial graph (root = first card in each deck) ──
  function buildInitialGraph() {
    const initialCards = DECKS.map(d => CARDS.find(c => c.deckId === d.id)).filter(Boolean) as PMOCard[];

    const nodes: GraphNode[] = initialCards.map((card, i) => {
      const deck = getDeckById(card.deckId);
      const angle = (Math.PI * 2 * i) / initialCards.length - Math.PI / 2;
      const r = 100;
      return {
        id: card.id,
        code: card.code,
        title: card.title,
        deckId: card.deckId,
        color: deck?.color ?? '#6366f1',
        x: CX + r * Math.cos(angle),
        y: CY + r * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: NODE_RADIUS_ROOT,
        visible: true,
        expanded: false,
        pinned: false,
      };
    });

    nodesRef.current = nodes;
    edgesRef.current = [];
  }

  // ── Expand a node: add its related cards as visible neighbours ──
  const expandNode = useCallback((nodeId: string) => {
    const card = getCardById(nodeId);
    if (!card) return;

    const existingIds = new Set(nodesRef.current.map(n => n.id));
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];

    const parentNode = nodesRef.current.find(n => n.id === nodeId);
    const px = parentNode?.x ?? CX;
    const py = parentNode?.y ?? CY;

    for (const relCode of card.relatedCards) {
      const relId = resolveId(relCode);
      if (!relId) continue;

      // Add edge regardless
      const edgeExists = edgesRef.current.some(
        e => (e.source === nodeId && e.target === relId) || (e.source === relId && e.target === nodeId)
      );
      if (!edgeExists) {
        newEdges.push({ source: nodeId, target: relId });
      }

      if (existingIds.has(relId)) {
        // Make visible if hidden
        const existing = nodesRef.current.find(n => n.id === relId);
        if (existing && !existing.visible) existing.visible = true;
        continue;
      }

      const relCard = getCardById(relId);
      if (!relCard) continue;
      const deck = getDeckById(relCard.deckId);

      // Spread around parent
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 40;
      newNodes.push({
        id: relId,
        code: relCard.code,
        title: relCard.title,
        deckId: relCard.deckId,
        color: deck?.color ?? '#6366f1',
        x: px + dist * Math.cos(angle),
        y: py + dist * Math.sin(angle),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: NODE_RADIUS_DEFAULT,
        visible: true,
        expanded: false,
        pinned: false,
      });
      existingIds.add(relId);
    }

    // Mark node as expanded
    const node = nodesRef.current.find(n => n.id === nodeId);
    if (node) node.expanded = true;

    // Limit total visible nodes
    const visibleCount = nodesRef.current.filter(n => n.visible).length + newNodes.length;
    if (visibleCount > MAX_VISIBLE_NODES) {
      // Hide oldest non-expanded non-root nodes
      const toHide = nodesRef.current
        .filter(n => n.visible && !n.expanded && n.id !== nodeId)
        .slice(0, visibleCount - MAX_VISIBLE_NODES);
      for (const n of toHide) n.visible = false;
    }

    nodesRef.current = [...nodesRef.current, ...newNodes];
    edgesRef.current = [...edgesRef.current, ...newEdges];
  }, [CX, CY]);

  // ── Collapse a node: hide its exclusive neighbours ──
  const collapseNode = useCallback((nodeId: string) => {
    const node = nodesRef.current.find(n => n.id === nodeId);
    if (!node) return;
    node.expanded = false;

    // Find edges from this node
    const neighbourIds = edgesRef.current
      .filter(e => e.source === nodeId || e.target === nodeId)
      .map(e => e.source === nodeId ? e.target : e.source);

    // Hide neighbours that have no other expanded parent
    for (const nId of neighbourIds) {
      const otherParents = edgesRef.current.filter(
        e => (e.source === nId || e.target === nId) &&
          e.source !== nodeId && e.target !== nodeId
      ).map(e => e.source === nId ? e.target : e.source);

      const hasExpandedParent = otherParents.some(pid => {
        const pNode = nodesRef.current.find(n => n.id === pid);
        return pNode?.expanded;
      });

      if (!hasExpandedParent) {
        const neighbour = nodesRef.current.find(n => n.id === nId);
        if (neighbour) {
          neighbour.visible = false;
          neighbour.expanded = false;
        }
      }
    }
  }, []);

  // ── Animation loop ──
  useEffect(() => {
    buildInitialGraph();

    let tick = 0;
    function loop() {
      runSimulationStep(nodesRef.current, edgesRef.current, CX, CY);
      tick++;
      if (tick % 2 === 0) {
        setRenderTick(t => t + 1);
      }
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ── Node click handler ──
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(prev => {
      if (prev === nodeId) return null;
      return nodeId;
    });
    setShowHint(false);

    const node = nodesRef.current.find(n => n.id === nodeId);
    if (!node) return;

    if (node.expanded) {
      collapseNode(nodeId);
    } else {
      expandNode(nodeId);
    }
  }, [expandNode, collapseNode]);

  // ── Pan handlers ──
  function handleSvgPointerDown(e: React.PointerEvent) {
    if ((e.target as SVGElement).closest('[data-node]')) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
  }

  function handleSvgPointerMove(e: React.PointerEvent) {
    if (!isPanning) return;
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    });
  }

  function handleSvgPointerUp() {
    setIsPanning(false);
  }

  // ── Reset ──
  function handleReset() {
    buildInitialGraph();
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  }

  // ── Search ──
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return CARDS.filter(c =>
      c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  function focusCard(cardId: string) {
    // Make sure the card is visible
    const existing = nodesRef.current.find(n => n.id === cardId);
    if (!existing) {
      const card = getCardById(cardId);
      if (!card) return;
      const deck = getDeckById(card.deckId);
      nodesRef.current.push({
        id: cardId,
        code: card.code,
        title: card.title,
        deckId: card.deckId,
        color: deck?.color ?? '#6366f1',
        x: CX,
        y: CY,
        vx: 0,
        vy: 0,
        radius: NODE_RADIUS_ROOT,
        visible: true,
        expanded: false,
        pinned: true,
      });
    } else {
      existing.visible = true;
      existing.x = CX;
      existing.y = CY;
      existing.pinned = true;
    }
    expandNode(cardId);
    setSelectedNode(cardId);
    setShowSearch(false);
    setSearchQuery('');
  }

  const visibleNodes = nodesRef.current.filter(n => n.visible);
  const visibleEdges = edgesRef.current.filter(e => {
    const src = nodesRef.current.find(n => n.id === e.source);
    const tgt = nodesRef.current.find(n => n.id === e.target);
    return src?.visible && tgt?.visible;
  });

  const selectedCard = selectedNode ? getCardById(selectedNode) : null;
  const selectedDeck = selectedCard ? getDeckById(selectedCard.deckId) : null;

  const bg = isDark
    ? '#0a1628'
    : '#f1f5f9';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 shrink-0"
        style={{
          background: isDark ? 'rgba(10,22,40,0.92)' : 'rgba(241,245,249,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <ArrowLeft size={16} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Network size={16} className="text-indigo-400" />
          <h1 className="text-base font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Mind Map
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(s => !s)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
          >
            <Search size={14} className="text-foreground" />
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
          >
            <RotateCcw size={14} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            style={{ background: isDark ? 'rgba(10,22,40,0.98)' : 'rgba(241,245,249,0.98)' }}
          >
            <div className="px-4 py-2">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
              >
                <Search size={13} className="text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Find a card to focus on..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X size={12} className="text-muted-foreground" />
                  </button>
                )}
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {searchResults.map(card => {
                    const deck = getDeckById(card.deckId);
                    return (
                      <button
                        key={card.id}
                        onClick={() => focusCard(card.id)}
                        className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 transition-colors"
                        style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                      >
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{ background: (deck?.color ?? '#6366f1') + '20', color: deck?.color ?? '#6366f1' }}
                        >
                          {card.code}
                        </span>
                        <span className="text-xs font-semibold text-foreground truncate">{card.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph canvas */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: '400px' }}>
        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#818cf8',
                pointerEvents: 'none',
              }}
            >
              <Info size={11} />
              Tap a node to expand its connections
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom controls */}
        <div
          className="absolute bottom-4 right-4 z-10 flex flex-col gap-2"
        >
          <button
            onClick={() => setZoom(z => Math.min(3, z + 0.25))}
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: isDark ? 'rgba(15,28,48,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}
          >
            <ZoomIn size={14} className="text-foreground" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.3, z - 0.25))}
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: isDark ? 'rgba(15,28,48,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}
          >
            <ZoomOut size={14} className="text-foreground" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: isDark ? 'rgba(15,28,48,0.95)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}
          >
            <Maximize2 size={14} className="text-foreground" />
          </button>
        </div>

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${W / zoom} ${H / zoom}`}
          style={{ cursor: isPanning ? 'grabbing' : 'grab', touchAction: 'none' }}
          onPointerDown={handleSvgPointerDown}
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handleSvgPointerUp}
          onPointerCancel={handleSvgPointerUp}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#grid)" />

          {/* Edges */}
          {visibleEdges.map((edge, i) => {
            const src = nodesRef.current.find(n => n.id === edge.source);
            const tgt = nodesRef.current.find(n => n.id === edge.target);
            if (!src || !tgt) return null;
            const isHighlighted =
              selectedNode === edge.source || selectedNode === edge.target;
            return (
              <line
                key={i}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={isHighlighted
                  ? (src.color)
                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}
                strokeWidth={isHighlighted ? 1.5 : 0.8}
                strokeOpacity={isHighlighted ? 0.7 : 0.4}
              />
            );
          })}

          {/* Nodes */}
          {visibleNodes.map(node => {
            const isSelected = selectedNode === node.id;
            const isNeighbour = selectedNode
              ? edgesRef.current.some(
                  e =>
                    (e.source === selectedNode && e.target === node.id) ||
                    (e.target === selectedNode && e.source === node.id)
                )
              : false;
            const dimmed = selectedNode && !isSelected && !isNeighbour;

            return (
              <g
                key={node.id}
                data-node="true"
                transform={`translate(${node.x}, ${node.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleNodeClick(node.id)}
              >
                {/* Glow ring for selected */}
                {isSelected && (
                  <circle
                    r={node.radius + 8}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="2"
                    strokeOpacity="0.4"
                  />
                )}
                {/* Node circle */}
                <circle
                  r={node.radius}
                  fill={node.color + (dimmed ? '30' : (isSelected ? 'FF' : '88'))}
                  stroke={node.color}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={dimmed ? 0.2 : 0.8}
                />
                {/* Expand indicator */}
                {node.expanded && (
                  <circle
                    r={node.radius + 4}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    strokeOpacity="0.5"
                  />
                )}
                {/* Code label */}
                <text
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize={node.radius > 25 ? 8 : 7}
                  fontWeight="800"
                  fill={dimmed ? 'rgba(255,255,255,0.2)' : 'white'}
                  style={{ pointerEvents: 'none', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {node.code.length > 6 ? node.code.slice(0, 5) + '…' : node.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected node info panel */}
      <AnimatePresence>
        {selectedCard && selectedDeck && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="shrink-0 px-4 pb-4 pt-3"
            style={{
              background: isDark ? 'rgba(10,22,40,0.98)' : 'rgba(241,245,249,0.98)',
              borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: selectedDeck.color + '20' }}
              >
                {selectedDeck.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ background: selectedDeck.color + '20', color: selectedDeck.color }}
                  >
                    {selectedCard.code}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {selectedCard.relatedCards.length} connections
                  </span>
                </div>
                <div
                  className="text-sm font-black text-foreground leading-tight"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {selectedCard.title}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {selectedCard.tagline}
                </div>
              </div>
              <button
                onClick={() => navigate(`/card/${selectedCard.id}`)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                style={{
                  background: selectedDeck.color + '18',
                  border: `1px solid ${selectedDeck.color}30`,
                  color: selectedDeck.color,
                }}
              >
                Open
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageFooter />
    </div>
  );
}
