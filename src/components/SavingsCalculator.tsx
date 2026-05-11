import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const FLAT_FEE = 149;
const CONTINGENCY = 0.35;

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const SavingsCalculator = () => {
  const [savings, setSavings] = useState(3850);
  const lawFirmKeep = savings * (1 - CONTINGENCY);
  const lawFirmFee = savings * CONTINGENCY;
  const ourKeep = Math.max(0, savings - FLAT_FEE);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Estimated annual savings</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-primary">{fmt(savings)}</p>
        </div>
        <p className="text-sm text-muted-foreground">Drag to match your situation</p>
      </div>
      <div className="mt-4">
        <Slider value={[savings]} min={1000} max={10000} step={50} onValueChange={(v) => setSavings(v[0])} />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>$1,000</span><span>$10,000</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Contingency firm */}
        <div className="rounded-xl border border-border bg-secondary/40 p-5">
          <p className="text-sm font-semibold text-primary">Hire a contingency law firm</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Estimated savings" value={fmt(savings)} />
            <Row label="Their fee (35%)" value={`−${fmt(lawFirmFee)}`} negative />
            <div className="border-t border-border pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">You keep</span>
                <span className="text-2xl font-semibold tabular-nums text-primary">{fmt(lawFirmKeep)}</span>
              </div>
            </div>
          </dl>
        </div>

        {/* TaxAppeal */}
        <div className="rounded-xl border-2 border-success bg-card p-5">
          <p className="text-sm font-semibold text-primary">Use TaxAppeal.app</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Estimated savings" value={fmt(savings)} />
            <Row label="Flat fee" value={`−${fmt(FLAT_FEE)}`} negative />
            <div className="border-t border-border pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">You keep</span>
                <span className="text-3xl font-bold tabular-nums text-success">
                  {fmt(ourKeep)}
                </span>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, negative }: { label: string; value: string; negative?: boolean }) => (
  <div className="flex items-baseline justify-between">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className={`tabular-nums ${negative ? "text-destructive" : "text-foreground"}`}>{value}</dd>
  </div>
);
