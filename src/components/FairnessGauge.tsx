import { scoreBand } from "@/lib/fairness";

// Semicircular gauge, 0–100. Responsive via parent width.
export const FairnessGauge = ({ score, size = 280 }: { score: number; size?: number }) => {
  const band = scoreBand(score);
  const colorVar =
    band === "poor" ? "var(--score-poor)" : band === "mid" ? "var(--score-mid)" : "var(--score-good)";

  // Geometry
  const w = size;
  const h = size / 1.7;
  const cx = w / 2;
  const cy = h - 12;
  const r = w / 2 - 18;
  const stroke = 18;

  // Arc helpers (semicircle from 180° to 360°)
  const polar = (angleDeg: number) => {
    const a = (Math.PI * angleDeg) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const arcPath = (startAngle: number, endAngle: number) => {
    const s = polar(startAngle);
    const e = polar(endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const filledEnd = 180 + (score / 100) * 180;
  const needle = polar(filledEnd);

  return (
    <div className="flex flex-col items-center" role="img" aria-label={`Fairness Score ${score} out of 100`}>
      <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`}>
        {/* Track */}
        <path d={arcPath(180, 360)} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} strokeLinecap="round" />
        {/* Filled */}
        <path
          d={arcPath(180, filledEnd)}
          fill="none"
          stroke={`hsl(${colorVar})`}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Needle dot */}
        <circle cx={needle.x} cy={needle.y} r={8} fill={`hsl(${colorVar})`} />
        <circle cx={needle.x} cy={needle.y} r={3} fill="hsl(var(--background))" />
      </svg>
      <div className="-mt-6 text-center">
        <div className="font-sans text-6xl font-bold tabular-nums text-primary">{score}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Fairness Score · 0–100</div>
      </div>
    </div>
  );
};
