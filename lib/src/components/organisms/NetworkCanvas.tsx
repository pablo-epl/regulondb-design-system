import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

/* ============================================================================
   NetworkCanvas
   ----------------------------------------------------------------------------
   A small force-directed graph layout, hand-rolled (no d3 dep). Works for the
   ~50-200 node regulons typical in this database; if you need 1k+ nodes, swap
   in d3-force or cytoscape.js — the prop shape stays the same.

   Forces in play (per tick):
     - Coulomb-style repulsion between every pair of nodes.
     - Hooke-style spring on every edge to its `length`.
     - Gentle centering force toward the canvas center.
     - Velocity damping ("alpha decay").

   Iteration runs in a useEffect loop with requestAnimationFrame, capped at
   ~600 ticks then frozen. Drag is supported on a node — the user can shake
   the layout out of a local minimum.
   ============================================================================ */

export type EdgeKind = "curated" | "predicted" | "ht";
export type NodeKind = "tf" | "gene" | "regulator" | "other";

export interface NetworkNode {
  id: string;
  label: string;
  kind?: NodeKind;
  /** Pin the node at a fixed (x, y); the simulation won't move it. */
  fx?: number;
  fy?: number;
}
export interface NetworkEdge {
  source: string;
  target: string;
  kind?: EdgeKind;
  /** "activates" → arrow head; "represses" → bar; default arrow. */
  effect?: "activates" | "represses" | "binds";
  /** Preferred resting length (px). Default 90. */
  length?: number;
}

export interface NetworkCanvasProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  width?: number;
  height?: number;
  onSelect?: (id: string | null) => void;
  /** Iterations before the simulation freezes. */
  maxTicks?: number;
}

interface SimNode extends NetworkNode {
  x: number; y: number;
  vx: number; vy: number;
}
interface SimEdge extends NetworkEdge {
  s: SimNode; t: SimNode;
  length: number;
}

const NODE_FILL: Record<NonNullable<NetworkNode["kind"]>, string> = {
  tf:        "var(--blue-1)",
  regulator: "var(--blue-2)",
  gene:      "var(--blue-5)",
  other:     "var(--surface-sunken)",
};
const EDGE_COLOR: Record<NonNullable<NetworkEdge["kind"]>, string> = {
  curated:   "var(--evidence-curated)",
  predicted: "var(--evidence-predicted)",
  ht:        "var(--evidence-ht)",
};
const EDGE_DASH: Record<NonNullable<NetworkEdge["kind"]>, string | undefined> = {
  curated:   undefined,
  predicted: "5 3",
  ht:        "1 3",
};

export const NetworkCanvas = ({
  nodes, edges, width = 720, height = 480, onSelect, maxTicks = 600,
}: NetworkCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [, force] = useState(0);                  // rerender pump
  const drag = useRef<{ id: string } | null>(null);

  // Initialise simulation state once per node-set identity.
  const sim = useMemo(() => {
    const map = new Map<string, SimNode>();
    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const r = Math.min(width, height) * 0.35;
      map.set(n.id, {
        ...n,
        x: n.fx ?? width / 2 + Math.cos(angle) * r,
        y: n.fy ?? height / 2 + Math.sin(angle) * r,
        vx: 0, vy: 0,
      });
    });
    const simEdges: SimEdge[] = edges
      .map((e) => {
        const s = map.get(e.source); const t = map.get(e.target);
        if (!s || !t) return null;
        return { ...e, s, t, length: e.length ?? 90 };
      })
      .filter((x): x is SimEdge => !!x);
    return { nodes: Array.from(map.values()), edges: simEdges, byId: map };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  // Run a fixed-iteration simulation with rAF.
  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const REPULSE = 1100;
    const SPRING = 0.04;
    const CENTER = 0.005;
    const DAMP = 0.85;

    const tick = () => {
      const list = sim.nodes;
      const cx = width / 2, cy = height / 2;

      // Repulsion
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i], b = list[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy + 0.01;
          const force = REPULSE / d2;
          const d = Math.sqrt(d2);
          a.vx += (dx / d) * force;
          a.vy += (dy / d) * force;
          b.vx -= (dx / d) * force;
          b.vy -= (dy / d) * force;
        }
      }
      // Springs
      for (const e of sim.edges) {
        const dx = e.t.x - e.s.x, dy = e.t.y - e.s.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - e.length) * SPRING;
        e.s.vx += (dx / d) * f;
        e.s.vy += (dy / d) * f;
        e.t.vx -= (dx / d) * f;
        e.t.vy -= (dy / d) * f;
      }
      // Centering + integrate
      for (const n of list) {
        n.vx += (cx - n.x) * CENTER;
        n.vy += (cy - n.y) * CENTER;
        n.vx *= DAMP; n.vy *= DAMP;
        if (n.fx == null) n.x += n.vx;
        if (n.fy == null) n.y += n.vy;
        // Clamp inside viewport
        n.x = Math.max(20, Math.min(width - 20, n.x));
        n.y = Math.max(20, Math.min(height - 20, n.y));
      }
      frame++;
      force((x) => x + 1);                        // pump rerender
      if (frame < maxTicks) raf = requestAnimationFrame(tick);
    };
    if (typeof window !== "undefined" && !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      raf = requestAnimationFrame(tick);
    } else {
      // Reduced motion — run synchronously to a settled state, then render once.
      for (let k = 0; k < maxTicks; k++) tick();
    }
    return () => cancelAnimationFrame(raf);
  }, [sim, width, height, maxTicks]);

  // Drag handlers (pointer events).
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return;
      const node = sim.byId.get(drag.current.id);
      if (!node) return;
      const rect = svg.getBoundingClientRect();
      node.x = ((e.clientX - rect.left) / rect.width) * width;
      node.y = ((e.clientY - rect.top) / rect.height) * height;
      node.vx = 0; node.vy = 0;
      force((x) => x + 1);
    };
    const onUp = () => { drag.current = null; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [sim, width, height]);

  const select = (id: string | null) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Network graph with ${nodes.length} nodes and ${edges.length} edges`}
      style={{ width: "100%", height, background: "var(--surface-canvas)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" } as CSSProperties}
      onClick={(e) => { if (e.target === svgRef.current) select(null); }}>
      <defs>
        <marker id="nc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
        </marker>
        <marker id="nc-bar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <line x1="0" y1="2" x2="0" y2="8" stroke="currentColor" strokeWidth="2"/>
        </marker>
      </defs>

      {sim.edges.map((e, i) => {
        const k = e.kind ?? "curated";
        const color = EDGE_COLOR[k];
        const dash = EDGE_DASH[k];
        const marker = e.effect === "represses" ? "url(#nc-bar)" : "url(#nc-arrow)";
        const dim = (selected || hovered) && ![e.s.id, e.t.id].includes(selected ?? hovered ?? "");
        return (
          <line key={i}
                x1={e.s.x} y1={e.s.y} x2={e.t.x} y2={e.t.y}
                stroke={color} strokeWidth={dim ? 0.6 : 1.5} strokeDasharray={dash}
                opacity={dim ? 0.25 : 1}
                style={{ color }}
                markerEnd={marker} />
        );
      })}

      {sim.nodes.map((n) => {
        const isSel = selected === n.id || hovered === n.id;
        return (
          <g key={n.id}
             transform={`translate(${n.x}, ${n.y})`}
             tabIndex={0}
             role="button"
             aria-pressed={selected === n.id}
             aria-label={`${n.label} (${n.kind ?? "node"})`}
             onPointerDown={(e) => { drag.current = { id: n.id }; (e.target as Element).setPointerCapture?.(e.pointerId); }}
             onClick={() => select(n.id)}
             onMouseEnter={() => setHovered(n.id)}
             onMouseLeave={() => setHovered(null)}
             onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(n.id); } }}
             style={{ cursor: "grab" }}>
            <circle r={n.kind === "tf" ? 22 : 16}
                    fill={NODE_FILL[n.kind ?? "other"]}
                    stroke={isSel ? "var(--accent)" : "var(--blue-3)"}
                    strokeWidth={isSel ? 3 : 1.5} />
            <text textAnchor="middle" dy="4" fontFamily="Arial"
                  fontSize={n.kind === "tf" ? 12 : 11}
                  fontStyle={n.kind === "gene" ? "italic" : "normal"}
                  fill={n.kind === "tf" || n.kind === "regulator" ? "#fff" : "var(--text-primary)"}>
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
