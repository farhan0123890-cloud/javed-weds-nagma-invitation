/**
 * Botanical ornaments, drawn procedurally as SVG so they stay crisp at any size.
 * Everything is deterministic (no Math.random) so server and client markup match.
 * The "embossed paper" look comes from a cream→blush gradient fill, hairline
 * strokes and paired light/dark drop-shadows (see .emboss in globals.css).
 */
import type { ReactElement } from "react";

type Pt = [number, number];

const bez = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ];
};

const angleAt = (p: Pt[], t: number) => {
  const a = bez(p, Math.max(0, t - 0.01));
  const b = bez(p, Math.min(1, t + 0.01));
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
};

const leafPath = (len: number, w: number) =>
  `M0 0C${len * 0.3} ${-w} ${len * 0.72} ${-w} ${len} 0C${len * 0.72} ${w} ${len * 0.3} ${w} 0 0Z`;

function Leaf({ x, y, a, len, w = len * 0.28 }: { x: number; y: number; a: number; len: number; w?: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})`}>
      <path d={leafPath(len, w)} className="petal" />
      <path d={`M0 0L${len * 0.82} 0`} className="vein" />
    </g>
  );
}

function Rosette({ cx, cy, r, layers = 4, rot = 0 }: { cx: number; cy: number; r: number; layers?: number; rot?: number }) {
  const rings: ReactElement[] = [];
  for (let i = 0; i < layers; i++) {
    const k = 1 - i / (layers + 0.6);
    const n = 6 + (layers - i) * 0; // constant petal count reads cleaner
    const d = r * 0.5 * k;
    for (let j = 0; j < n; j++) {
      rings.push(
        <ellipse
          key={`${i}-${j}`}
          cx={0}
          cy={-d}
          rx={r * 0.34 * k}
          ry={r * 0.52 * k}
          className="petal"
          transform={`rotate(${(j * 360) / n + i * 28})`}
        />,
      );
    }
  }
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      {rings}
      <circle r={r * 0.1} className="petal" />
      <circle r={r * 0.04} className="vein-dot" />
    </g>
  );
}

function Stem({ pts, leaves, side = 1, berries = false }: { pts: Pt[]; leaves: number; side?: 1 | -1; berries?: boolean }) {
  const els: ReactElement[] = [];
  for (let i = 0; i < leaves; i++) {
    const t = 0.12 + (0.82 * i) / Math.max(1, leaves - 1);
    const [x, y] = bez(pts, t);
    const base = angleAt(pts, t);
    const s = i % 2 === 0 ? side : -side;
    const len = 20 - i * (9 / leaves) + (i % 3) * 2;
    els.push(<Leaf key={i} x={x} y={y} a={base + s * 42} len={len} />);
  }
  const [ex, ey] = bez(pts, 1);
  const ea = angleAt(pts, 1);
  els.push(<Leaf key="tip" x={ex} y={ey} a={ea} len={15} />);
  const b: ReactElement[] = [];
  if (berries) {
    for (let i = 0; i < 5; i++) {
      const t = 0.3 + i * 0.14;
      const [x, y] = bez(pts, t);
      const a = ((angleAt(pts, t) + (i % 2 ? 90 : -90)) * Math.PI) / 180;
      b.push(
        <g key={`b${i}`}>
          <path d={`M${x} ${y}L${x + Math.cos(a) * 9} ${y + Math.sin(a) * 9}`} className="vein" />
          <circle cx={x + Math.cos(a) * 11} cy={y + Math.sin(a) * 11} r={2.1} className="petal" />
        </g>,
      );
    }
  }
  const d = `M${pts[0][0]} ${pts[0][1]}C${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]} ${pts[3][0]} ${pts[3][1]}`;
  return (
    <g>
      <path d={d} className="stem" />
      {els}
      {b}
    </g>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFF9F4" />
        <stop offset="0.55" stopColor="#F3E3DA" />
        <stop offset="1" stopColor="#E6CDC2" />
      </linearGradient>
    </defs>
  );
}

/** Large lace-like corner spray, anchored to the top-left of its box. */
export function FloralCorner({ id = "fc", className = "" }: { id?: string; className?: string }) {
  return (
    <svg viewBox="0 0 230 270" className={`floral emboss ${className}`} aria-hidden="true" focusable="false" style={{ ["--fill" as string]: `url(#${id}-g)` }}>
      <Defs id={id} />
      <Stem pts={[[-4, 250], [34, 196], [96, 168], [176, 92]]} leaves={7} berries />
      <Stem pts={[[168, -4], [150, 42], [182, 74], [226, 128]]} leaves={5} side={-1} />
      <Stem pts={[[-4, 118], [30, 96], [50, 52], [104, 8]]} leaves={5} side={-1} berries />
      <Rosette cx={66} cy={74} r={38} layers={4} rot={8} />
      <Rosette cx={134} cy={34} r={23} layers={3} rot={30} />
      <Rosette cx={30} cy={152} r={21} layers={3} rot={14} />
      <Rosette cx={118} cy={122} r={15} layers={3} rot={40} />
    </svg>
  );
}

/** Smaller spray used on the venue cards and closing slide. */
export function FloralSprig({ id = "fs", className = "" }: { id?: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 70" className={`floral emboss ${className}`} aria-hidden="true" focusable="false" style={{ ["--fill" as string]: `url(#${id}-g)` }}>
      <Defs id={id} />
      <Stem pts={[[78, 56], [60, 46], [40, 44], [8, 30]]} leaves={4} berries />
      <Stem pts={[[82, 56], [100, 46], [120, 44], [152, 30]]} leaves={4} side={-1} berries />
      <Rosette cx={80} cy={34} r={18} layers={3} rot={12} />
    </svg>
  );
}

/** The wax-style medallion seal: double oval rim with a botanical sprig. */
export function Medallion({ id = "md", className = "" }: { id?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={`floral emboss ${className}`} aria-hidden="true" focusable="false" style={{ ["--fill" as string]: `url(#${id}-g)` }}>
      <Defs id={id} />
      <ellipse cx="60" cy="75" rx="52" ry="68" className="petal" />
      <ellipse cx="60" cy="75" rx="45" ry="61" className="rim" />
      <ellipse cx="60" cy="75" rx="40" ry="56" className="rim" />
      <g transform="translate(60 118)">
        <path d="M0 0C-2 -22 2 -50 0 -88" className="stem" />
        <Leaf x={0} y={-18} a={-142} len={22} />
        <Leaf x={0} y={-30} a={-38} len={22} />
        <Leaf x={0} y={-44} a={-146} len={19} />
        <Leaf x={0} y={-56} a={-34} len={19} />
        <Leaf x={0} y={-68} a={-140} len={15} />
        <Leaf x={0} y={-76} a={-40} len={15} />
        <Leaf x={0} y={-88} a={-90} len={13} />
        <circle cx={-14} cy={-6} r={2.4} className="petal" />
        <circle cx={14} cy={-4} r={2.4} className="petal" />
      </g>
    </svg>
  );
}

/** Small ornaments that give each event card its own identity. */
export function Motif({ kind, className = "" }: { kind: "sprig" | "crescent" | "rosette"; className?: string }) {
  return (
    <svg viewBox="0 0 60 36" className={`motif ${className}`} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {kind === "sprig" && (
          <>
            <path d="M6 18H54" opacity=".5" />
            <path d="M30 28C30 22 30 14 30 8" />
            <path d="M30 22C24 22 21 18 21 14C26 14 30 17 30 22Z" />
            <path d="M30 17C36 17 39 13 39 9C34 9 30 12 30 17Z" />
          </>
        )}
        {kind === "crescent" && (
          <>
            <path d="M6 18H20M40 18H54" opacity=".5" />
            <path d="M33 8A10 10 0 1 0 33 28A8 8 0 1 1 33 8Z" />
            <path d="M39 15l1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9 2.8-.3z" strokeWidth=".8" />
          </>
        )}
        {kind === "rosette" && (
          <>
            <path d="M6 18H20M40 18H54" opacity=".5" />
            <circle cx="30" cy="18" r="2" />
            {[0, 60, 120, 180, 240, 300].map((r) => (
              <ellipse key={r} cx="30" cy="10.5" rx="3.6" ry="6.2" transform={`rotate(${r} 30 18)`} />
            ))}
          </>
        )}
      </g>
    </svg>
  );
}

/** Hairline divider with a small diamond, as seen under the names in the reference. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 10" className={`divider ${className}`} aria-hidden="true" focusable="false">
      <path d="M0 5H50M70 5H120" stroke="currentColor" strokeWidth=".8" opacity=".55" />
      <path d="M60 1.5L63.5 5L60 8.5L56.5 5Z" fill="none" stroke="currentColor" strokeWidth=".9" />
    </svg>
  );
}
