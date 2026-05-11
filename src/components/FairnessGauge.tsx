import { useEffect, useRef, useState } from "react";
import { scoreBand } from "@/lib/fairness";
import { TrendingUp } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface GaugeBaseProps {
  score: number;
  size?: number;
}

interface CompareModeProps extends GaugeBaseProps {
  mode: "compare";
  /** Subject assessed value (dollars) */
  subjectAV: number;
  /** Subject square footage */
  subjectSqft: number;
  /** Cohort median assessed value per sq ft */
  cohortMedianAVPerSqft: number;
  /** Estimated annual overpayment in dollars */
  overpayment: number;
}

interface GaugeModeProps extends GaugeBaseProps {
  mode?: "gauge";
}

type FairnessGaugeProps = CompareModeProps | GaugeModeProps;

// ─── Classic semicircle gauge (preserved) ────────────────────────────────────

const ClassicGauge = ({ score, size = 280 }: { score: number; size?: number }) => {
  const band = scoreBand(score);
  const colorVar =
    band === "poor"
      ? "var(--score-poor)"
      : band === "mid"
      ? "var(--score-mid)"
      : "var(--score-good)";

  const w = size;
  const h = size / 1.7;
  const cx = w / 2;
  const cy = h - 12;
  const r = w / 2 - 18;
  const stroke = 18;

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
        <path d={arcPath(180, 360)} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} strokeLinecap="round" />
        <path d={arcPath(180, filledEnd)} fill="none" stroke={`hsl(${colorVar})`} strokeWidth={stroke} strokeLinecap="round" />
        <circle cx={needle.x} cy={needle.y} r={8} fill={`hsl(${colorVar})`} />
        <circle cx={needle.x} cy={needle.y} r={3} fill="hsl(var(--background))" />
      </svg>
      <div className="-mt-6 text-center">
        <div className="font-sans text-6xl font-bold tabular-nums text-primary">{score}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Fairness Score &middot; 0&ndash;100</div>
      </div>
    </div>
  );
};

// ─── Animated bar row ─────────────────────────────────────────────────────────

const Bar = ({
  label,
  value,
  maxValue,
  formatted,
  color,
  delayMs,
  animate,
}: {
  label: string;
  value: number;
  maxValue: number;
  formatted: string;
  color: "poor" | "good";
  delayMs: number;
  animate: boolean;
}) => {
  const pct = Math.min(100, (value / maxValue) * 100);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current;
    // Start at 0, then transition to pct after delayMs
    el.style.width = "0%";
    const t = setTimeout(() => {
      if (animate) el.style.width = `${pct}%`;
    }, delayMs);
    return () => clearTimeout(t);
  }, [pct, delayMs, animate]);

  const barColor =
    color === "poor"
      ? "bg-[hsl(var(--score-poor))]"
      : "bg-success";

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums font-semibold text-foreground">{formatted}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          ref={barRef}
          className={`h-full rounded-full bar-animate ${barColor}`}
          style={{ width: animate ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
};

// ─── Compare mode component ───────────────────────────────────────────────────

const CompareView = ({
  score,
  subjectAV,
  subjectSqft,
  cohortMedianAVPerSqft,
  overpayment,
}: Omit<CompareModeProps, "mode" | "size">) => {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const subjectAVPerSqft = subjectSqft > 0 ? subjectAV / subjectSqft : 0;
  const diffPerSqft = subjectAVPerSqft - cohortMedianAVPerSqft;
  const diffPct = cohortMedianAVPerSqft > 0
    ? Math.round((diffPerSqft / cohortMedianAVPerSqft) * 100)
    : 0;
  const maxVal = Math.max(subjectAVPerSqft, cohortMedianAVPerSqft) * 1.15;

  const fmt = (n: number) => `$${n.toFixed(2)}/sf`;
  const fmtDollars = (n: number) =>
    n >= 0 ? `+$${Math.round(n).toLocaleString()}` : `-$${Math.round(Math.abs(n)).toLocaleString()}`;

  const band = scoreBand(score);
  const isUnfair = band === "poor";

  // Intersection observer — trigger animation when card enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-5" role="img" aria-label={`Assessment comparison: your home ${fmt(subjectAVPerSqft)} vs comparable homes ${fmt(cohortMedianAVPerSqft)}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Assessed Value per Sq Ft
        </p>
        {isUnfair && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--score-poor)/0.1)] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--score-poor))]">
            <TrendingUp className="h-3 w-3" />
            Assessed higher than neighbors
          </span>
        )}
      </div>

      {/* Bars */}
      <div className="space-y-4">
        <Bar
          label="Your Home"
          value={subjectAVPerSqft}
          maxValue={maxVal}
          formatted={fmt(subjectAVPerSqft)}
          color="poor"
          delayMs={300}
          animate={animate}
        />
        <Bar
          label="Comparable Homes (median)"
          value={cohortMedianAVPerSqft}
          maxValue={maxVal}
          formatted={fmt(cohortMedianAVPerSqft)}
          color="good"
          delayMs={500}
          animate={animate}
        />
      </div>

      {/* Divider + difference callout */}
      <div
        className={`rounded-xl border-l-4 p-4 transition-opacity duration-700 ${
          animate ? "opacity-100" : "opacity-0"
        } ${isUnfair ? "border-[hsl(var(--score-poor))] bg-[hsl(var(--score-poor)/0.06)]" : "border-success bg-success/5"}`}
        style={{ transitionDelay: animate ? "800ms" : "0ms" }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-muted-foreground">Difference per sq ft</p>
          <p
            className={`text-2xl font-bold tabular-nums ${
              isUnfair ? "text-[hsl(var(--score-poor))]" : "text-success"
            }`}
          >
            {fmtDollars(diffPerSqft)}/sf
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({diffPct > 0 ? "+" : ""}{diffPct}%)
            </span>
          </p>
        </div>
        {overpayment > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Estimated annual overpayment:{" "}
            <span className="font-semibold text-foreground">${overpayment.toLocaleString()}</span>
          </p>
        )}
      </div>

      {/* Footnote */}
      <p className="text-xs text-muted-foreground">
        Fairness Score: <span className="font-medium text-foreground">{score}</span> &middot; Based on {" "}
        public county assessment records. Preliminary estimate.
      </p>
    </div>
  );
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const FairnessGauge = (props: FairnessGaugeProps) => {
  if (props.mode === "compare") {
    const { score, subjectAV, subjectSqft, cohortMedianAVPerSqft, overpayment } = props;
    return (
      <CompareView
        score={score}
        subjectAV={subjectAV}
        subjectSqft={subjectSqft}
        cohortMedianAVPerSqft={cohortMedianAVPerSqft}
        overpayment={overpayment}
      />
    );
  }
  return <ClassicGauge score={props.score} size={props.size} />;
};
