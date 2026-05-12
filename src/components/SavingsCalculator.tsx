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
          <p className="text-[18px] font-bold tracking-wider text-[#6E6E73]">Estimated</p>
          <p className="mt-2 text-[38px] font-bold tabular-nums leading-none text-[#1D1D1F]">{fmt(savings)}</p>
        </div>
        <p className="text-[16px] font-normal text-[#6E6E73]">Drag to match your situation</p>
      </div>
      <div className="mt-8">
        <Slider value={[savings]} min={1000} max={10000} step={50} onValueChange={(v) => setSavings(v[0])} />
        <div className="mt-3 flex justify-between text-[16px] font-normal text-[#6E6E73] tabular-nums">
          <span>$1,000</span><span>$10,000</span>
        </div>
      </div>

      <div className="mt-[30px] grid gap-[30px] md:grid-cols-2">
        {/* Contingency firm */}
        <div className="rounded-[18px] border border-border/50 bg-[#F5F5F7]/50 p-[30px]">
          <p className="text-[18px] font-bold text-[#1D1D1F]">Hire a contingency law firm</p>
          <dl className="mt-[1em] space-y-3">
            <Row label="Estimated savings" value={fmt(savings)} />
            <Row label="Their fee (35%)" value={`−${fmt(lawFirmFee)}`} negative />
            <div className="mt-[0.5em] border-t border-border/60 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[18px] font-normal text-[#1D1D1F]">You keep</span>
                <span className="text-[28px] font-bold tabular-nums text-[#1D1D1F]">{fmt(lawFirmKeep)}</span>
              </div>
            </div>
          </dl>
        </div>

        {/* TaxAppeal */}
        <div className="rounded-[18px] border border-[#63c879] bg-[#FAFDFB] p-[30px] shadow-sm">
          <p className="text-[18px] font-bold text-[#1D1D1F]">Use TaxAppeal.app</p>
          <dl className="mt-[1em] space-y-3">
            <Row label="Estimated savings" value={fmt(savings)} />
            <Row label="Flat fee" value={`−${fmt(FLAT_FEE)}`} negative />
            <div className="mt-[0.5em] border-t border-[#63c879]/30 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[18px] font-normal text-[#1D1D1F]">You keep</span>
                <span className="text-[28px] font-bold tabular-nums text-[#1D1D1F]">
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
    <dt className="text-[18px] font-normal text-[#1D1D1F]">{label}</dt>
    <dd className={`text-[18px] font-bold tabular-nums ${negative ? "text-destructive" : "text-[#1D1D1F]"}`}>{value}</dd>
  </div>
);
