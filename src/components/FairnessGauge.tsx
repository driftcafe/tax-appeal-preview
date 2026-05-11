import { useEffect, useRef, useState } from "react";
import { scoreBand, scoreBandLabel, NEIGHBORHOOD_BASELINE } from "@/lib/fairness";

// ─── Types ───────────────────────────────────────────────────────────────────

interface GaugeBaseProps {
  score: number;
  size?: number;
}

interface CompareModeProps extends GaugeBaseProps {
  mode: "compare";
  subjectAV: number;
  subjectSqft: number;
  cohortMedianAVPerSqft: number;
  overpayment: number;
}

interface GaugeModeProps extends GaugeBaseProps {
  mode?: "gauge";
}

type FairnessGaugeProps = CompareModeProps | GaugeModeProps;

// ─── Geometry helpers ────────────────────────────────────────────────────────

const scoreToAngle = (score: number) => 180 + (score / 100) * 180;

const polarToXY = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = (Math.PI * angleDeg) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arcPath = (
  cx: number, cy: number, r: number, startDeg: number, endDeg: number
) => {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

// ─── Band tokens ─────────────────────────────────────────────────────────────

const BAND_COLOR = {
  poor: "hsl(var(--score-poor))",
  mid: "hsl(var(--score-mid))",
  good: "hsl(var(--score-good))",
} as const;

const BAND_BG = {
  poor: "hsl(var(--score-poor) / 0.10)",
  mid: "hsl(var(--score-mid) / 0.10)",
  good: "hsl(var(--score-good) / 0.10)",
} as const;

// ─── Credit Score Gauge ───────────────────────────────────────────────────────

interface CreditScoreGaugeProps {
  score: number;
  subjectAVPerSqft?: number;
  cohortMedianAVPerSqft?: number;
  overpayment?: number;
  size?: number;
}

const CreditScoreGauge = ({
  score,
  subjectAVPerSqft,
  cohortMedianAVPerSqft,
  overpayment = 0,
  size = 320,
}: CreditScoreGaugeProps) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGGElement>(null);

  // ── Geometry ────────────────────────────────────────────────────────────────
  // The arc center (cx, cy) is at the BOTTOM of the SVG viewport.
  // We make the SVG tall enough that the 3-item text stack (number + label + pill)
  // sits comfortably in the upper dome, well above the needle hub.
  const w = size * 1.5;             // widen SVG to 480px for horizontal label breathing room
  const strokeW = 20;
  const r = size / 2 - 36;          // arc radius remains constant based on original size
  const cy = r + 70;                // extended headroom above for leader line text
  const cx = w / 2;
  const h = cy + strokeW / 2 + 30;  // clearance below hub for scale labels

  // Score / band
  const band = scoreBand(score);
  const label = scoreBandLabel(score);
  const scoreColor = BAND_COLOR[band];

  // Arc segment angles: Red 0-40, Yellow 41-70, Green 71-100
  const A_RED_END = 180 + 0.40 * 180; // 252°
  const A_YELLOW_END = 180 + 0.70 * 180; // 306°

  // Needle rotation (degrees from pointing-left baseline)
  const needleRotation = (score / 100) * 180;

  // Neighbourhood leader line
  const notchAngle = scoreToAngle(NEIGHBORHOOD_BASELINE);
  const leaderStart = polarToXY(cx, cy, r + strokeW / 2 + 4, notchAngle);
  const leaderEnd = polarToXY(cx, cy, r + strokeW / 2 + 20, notchAngle);
  
  let lblAnchor: "start" | "middle" | "end" = "middle";
  if (notchAngle > 280) lblAnchor = "start";
  else if (notchAngle < 260) lblAnchor = "end";

  const padX = lblAnchor === "start" ? 6 : lblAnchor === "end" ? -6 : 0;
  const padY = lblAnchor === "middle" ? -12 : 0;

  const notchLblPos = {
    x: leaderEnd.x + padX,
    y: leaderEnd.y + padY
  };

  // HTML overlay: anchored lower in the dome to clear the inner track arrow.
  const overlayTopPct = ((cy - r * 0.25) / h) * 100;

  // IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = needleRef.current;
    if (!el || !visible) return;
    el.classList.add("is-visible");
  }, [visible]);

  const fmtSqft = (n: number | null | undefined) => {
    if (n == null) return "N/A";
    return `$${n.toFixed(2)}/sqft`;
  };
  const showCompare = subjectAVPerSqft != null && cohortMedianAVPerSqft != null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full"
      role="img"
      aria-label={`Fairness Score ${score} out of 100 — ${label}`}
    >
      {/* ── Gauge: SVG arc + HTML score overlay ─────────────────────────── */}
      <div className="relative w-full" style={{ maxWidth: w }}>

        {/* SVG: only geometry — no score text inside SVG */}
        <svg
          width="100%"
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden="true"
          className="overflow-visible block"
        >
          <title>{`Fairness Score: ${score}/100 — ${label}`}</title>

          {/* Track */}
          <path d={arcPath(cx, cy, r, 180, 360)} fill="none"
            stroke="hsl(var(--secondary))" strokeWidth={strokeW} strokeLinecap="round" />

          {/* Caps to fill the rounded track ends perfectly without opacity overlaps */}
          <circle cx={polarToXY(cx, cy, r, 180).x} cy={polarToXY(cx, cy, r, 180).y} r={strokeW / 2} fill={BAND_COLOR.poor} />
          <circle cx={polarToXY(cx, cy, r, 360).x} cy={polarToXY(cx, cy, r, 360).y} r={strokeW / 2} fill={BAND_COLOR.good} />

          {/* Red 0–40 */}
          <path d={arcPath(cx, cy, r, 180, A_RED_END)} fill="none"
            stroke={BAND_COLOR.poor} strokeWidth={strokeW} strokeLinecap="butt" />

          {/* Yellow 41–70 */}
          <path d={arcPath(cx, cy, r, A_RED_END, A_YELLOW_END)} fill="none"
            stroke={BAND_COLOR.mid} strokeWidth={strokeW} strokeLinecap="butt" />

          {/* Green 71–100 */}
          <path d={arcPath(cx, cy, r, A_YELLOW_END, 360)} fill="none"
            stroke={BAND_COLOR.good} strokeWidth={strokeW} strokeLinecap="butt" />

          {/* Segment divider ticks */}
          {[A_RED_END, A_YELLOW_END].map((angle) => {
            const inner = polarToXY(cx, cy, r - strokeW / 2 - 1, angle);
            const outer = polarToXY(cx, cy, r + strokeW / 2 + 1, angle);
            return (
              <line key={angle} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="hsl(var(--card))" strokeWidth={2.5} />
            );
          })}

          {/* Neighbourhood Average Leader Line */}
          <line
            x1={leaderStart.x} y1={leaderStart.y}
            x2={leaderEnd.x} y2={leaderEnd.y}
            stroke="#94A3B8" strokeWidth={1} strokeDasharray="2,2"
          />
          <text x={notchLblPos.x} y={notchLblPos.y} textAnchor={lblAnchor} dominantBaseline="middle"
            fill={
              NEIGHBORHOOD_BASELINE <= 40 ? "#B91C1C" : // red-700
              NEIGHBORHOOD_BASELINE <= 70 ? "#B45309" : // amber-700
              "#15803D" // green-700
            } 
            fontSize={14}
            fontFamily="Inter, sans-serif" fontWeight={500} letterSpacing="0.02em">
            NBHD AVG: {NEIGHBORHOOD_BASELINE}
          </text>

          {/* Scale tick labels */}
          {([
            { s: 0, l: "0", a: "end" },
            { s: 40, l: "40", a: "middle" },
            { s: 70, l: "70", a: "middle" },
            { s: 100, l: "100", a: "start" },
          ] as const).map(({ s, l, a }) => {
            // Hide scale number if it's too close to the neighborhood average
            if (Math.abs(s - NEIGHBORHOOD_BASELINE) <= 4) return null;

            // Nudge 0 and 100 slightly further out and down
            const isEdge = s === 0 || s === 100;
            const offset = isEdge ? 18 : 14;
            const pt = polarToXY(cx, cy, r + strokeW / 2 + offset, scoreToAngle(s));
            const dy = isEdge ? 2 : 0;
            
            return (
              <text key={s} x={pt.x} y={pt.y + dy} textAnchor={a} dominantBaseline="middle"
                fill="hsl(var(--muted-foreground))" fontSize={14} fontWeight={600}
                fontFamily="Inter, sans-serif" letterSpacing="-0.02em">
                {l}
              </text>
            );
          })}

          {/* Inner Track Pointer (Replaces full needle and hub) */}
          <g
            ref={needleRef}
            className="gauge-needle"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              ["--needle-target-angle" as string]: `${needleRotation}deg`,
            }}
          >
            <polygon 
              points={`${cx - r + 12},${cy} ${cx - r + 26},${cy - 8} ${cx - r + 26},${cy + 8}`}
              fill={scoreColor}
              stroke="hsl(var(--card))"
              strokeWidth={1.5}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />
          </g>
        </svg>

        {/* ── HTML score overlay ── */}
        <div
          className="absolute inset-x-0 flex flex-col items-center pointer-events-none select-none"
          style={{
            top: `${overlayTopPct}%`,
            transform: "translateY(-50%)",
          }}
        >
          {/* Score number */}
          <span
            className={`text-[4.5rem] font-black tabular-nums leading-none tracking-tight
              ${visible ? "gauge-score-appear" : "opacity-0"}`}
            style={{ 
              color: scoreColor,
              animationDelay: visible ? "580ms" : undefined,
            }}
          >
            {score}
          </span>
        </div>
      </div>

      {/* ── Overpayment hero card ─────────────────────────────────────────── */}
      <div
        className={`w-full mt-5 ${visible ? "gauge-score-appear" : "opacity-0"}`}
        style={visible ? { animationDelay: "880ms" } : {}}
        aria-live="polite"
      >
        {overpayment > 0 ? (
          <div className="rounded-3xl bg-[hsl(145_63%_49%_/_0.07)] border border-[hsl(145_63%_49%_/_0.20)] px-6 py-10 flex flex-col items-center gap-3 text-center shadow-sm">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#229954]">
              Est. Annual Overpayment
            </p>
            <p className="text-[4rem] font-extrabold tabular-nums leading-none tracking-tight text-[#1D8348] animate-pulse-green my-2">
              ${overpayment.toLocaleString()}
            </p>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
              Based on your uniformity gap vs. comparable homes in your township
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[hsl(145_63%_49%_/_0.07)] border border-[hsl(145_63%_49%_/_0.25)] px-6 py-5 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success font-bold text-lg">
              ✓
            </div>
            <p className="text-sm font-medium text-success leading-snug">
              Your home appears fairly assessed relative to your neighborhood.
            </p>
          </div>
        )}
      </div>

      {/* ── AV / sqft comparison row ─────────────────────────────────────── */}
      {showCompare && (
        <div
          className={`w-full mt-3 rounded-xl border border-border bg-secondary/25 overflow-hidden
            ${visible ? "gauge-score-appear" : "opacity-0"}`}
          style={visible ? { animationDelay: "1080ms" } : {}}
        >
          <div className="flex items-center justify-between px-5 py-3 text-sm">
            <span className="text-foreground font-semibold">Your Home</span>
            <span className="font-bold tabular-nums text-base" style={{ color: scoreColor }}>
              {fmtSqft(subjectAVPerSqft!)}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between px-5 py-3 text-sm">
            <span className="flex items-center gap-1.5 text-foreground font-semibold">
              Neighborhood Avg
              <span className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider ml-1">(▲ on gauge)</span>
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {fmtSqft(cohortMedianAVPerSqft!)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const FairnessGauge = (props: FairnessGaugeProps) => {
  if (props.mode === "compare") {
    const { score, subjectAV, subjectSqft, cohortMedianAVPerSqft, overpayment, size } = props;
    const subjectAVPerSqft = subjectSqft > 0 ? subjectAV / subjectSqft : undefined;
    return (
      <CreditScoreGauge
        score={score}
        subjectAVPerSqft={subjectAVPerSqft}
        cohortMedianAVPerSqft={cohortMedianAVPerSqft}
        overpayment={overpayment}
        size={size}
      />
    );
  }
  return <CreditScoreGauge score={props.score} size={props.size} />;
};
