export interface RadialTarget {
  symbol: string;
  effect: "activates" | "represses" | "binds";
  category?: "curated" | "predicted" | "ht";
}

export interface RegulonRadialProps {
  tf: string;
  targets: RadialTarget[];
  size?: number;
}

const COLOR = { curated: "#C93A1D", predicted: "#C98528", ht: "#7C5295" } as const;

export const RegulonRadial = ({ tf, targets, size = 380 }: RegulonRadialProps) => {
  const cx = size / 2, cy = size / 2;
  const radius = Math.min(cx, cy) - 40;
  return (
    <svg viewBox={`0 0 ${size} ${size}`}
         role="img" aria-label={`${tf} regulon radial: ${targets.length} targets`}
         style={{ width: "100%", maxWidth: size, height: size, display: "block", margin: "0 auto" }}>
      <title>{tf} regulon</title>
      <defs>
        <marker id="rep" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <line x1="0" y1="2" x2="0" y2="8" stroke="currentColor" strokeWidth="2"/>
        </marker>
        <marker id="act" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
        </marker>
      </defs>
      <circle cx={cx} cy={cy} r={34} fill="#1F3D4E"/>
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="700" fontSize="14">{tf}</text>
      {targets.map((t, i) => {
        const angle = (i / targets.length) * 2 * Math.PI - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const cat = t.category ?? "curated";
        const color = COLOR[cat];
        const dash = cat === "predicted" ? "4 3" : cat === "ht" ? "1 3" : undefined;
        const marker = t.effect === "activates" ? "url(#act)" : "url(#rep)";
        return (
          <g key={t.symbol} style={{ color }}>
            <circle cx={x} cy={y} r={22} fill="#D5E2EA" stroke="#32617D"/>
            <text x={x} y={y + 4} textAnchor="middle" fontFamily="Arial" fontStyle="italic" fontSize="12" fill="#1F3D4E">{t.symbol}</text>
            <line x1={cx + Math.cos(angle) * 36}
                  y1={cy + Math.sin(angle) * 36}
                  x2={x - Math.cos(angle) * 22}
                  y2={y - Math.sin(angle) * 22}
                  stroke={color} strokeWidth="1.5" strokeDasharray={dash} markerEnd={marker}/>
          </g>
        );
      })}
    </svg>
  );
};
