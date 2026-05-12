import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const FLAT_FEE = 149;
const CONTINGENCY = 0.35;

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const SavingsCalculator = () => {
  const [savings, setSavings] = useState(3400);
  const lawFirmKeep = savings * (1 - CONTINGENCY);
  const lawFirmFee = savings * CONTINGENCY;
  const ourKeep = Math.max(0, savings - FLAT_FEE);

  return (
    <div className="rounded-[30px] bg-white p-[30px] shadow-[0_0_20px_0_rgba(29,29,31,0.08)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-eyebrow-sm">Estimated</p>
          <p className="mt-2 type-h3 tabular-nums leading-none">{fmt(savings)}</p>
        </div>
        <p className="type-utility">Drag to match your situation</p>
      </div>
      <div className="mt-8">
        <Slider value={[savings]} min={1000} max={10000} step={50} onValueChange={(v) => setSavings(v[0])} />
        <div className="mt-3 flex justify-between type-utility tabular-nums">
          <span>$1,000</span><span>$10,000</span>
        </div>
      </div>

      <div className="mt-[30px] grid gap-[30px] md:grid-cols-2">
        {/* Contingency firm */}
        <div className="rounded-[18px] border border-border/50 bg-[#F5F5F7]/50 p-[30px]">
          <p className="type-body-lg-emph">Hire a contingency law firm</p>
          <dl className="mt-[1em] space-y-3">
            <Row label="Estimated savings" value={fmt(savings)} />
            <Row label="Their fee (35%)" value={`−${fmt(lawFirmFee)}`} />
            <div className="mt-[0.5em] border-t border-border/60 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="type-body-sm">You keep</span>
                <span className="type-h4 tabular-nums">{fmt(lawFirmKeep)}</span>
              </div>
            </div>
          </dl>
        </div>

        {/* TaxAppeal */}
        <div className="rounded-[18px] border border-[#63c879] bg-[#FAFDFB] p-[30px] shadow-sm">
          <p className="type-body-lg-emph">Use TaxAppeal.app</p>
          <dl className="mt-[1em] space-y-3">
            <Row label="Estimated savings" value={fmt(savings)} />
            <Row label="Flat fee" value={`−${fmt(FLAT_FEE)}`} />
            <div className="mt-[0.5em] border-t border-[#63c879]/30 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="type-body-sm">You keep</span>
                <span className="type-h4 tabular-nums !text-success">
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

const Row = ({ label, value }: { label: string; value: string }) => {
  const isNegative = value.startsWith("−") || value.startsWith("-");
  return (
    <div className="flex items-baseline justify-between">
      <dt className="type-body-sm">{label}</dt>
      <dd className={`type-body-lg-emph tabular-nums ${isNegative ? "!text-destructive" : ""}`}>{value}</dd>
    </div>
  );
};
