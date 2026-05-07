// Illustrative (not live) — color-coded grid of nearby parcels.
// Subject parcel highlighted in the center.
const grid = Array.from({ length: 25 }, (_, i) => i);

// Pseudo-random but stable color band per cell.
const tones = [
  "hsl(var(--score-good) / 0.85)",
  "hsl(var(--score-good) / 0.55)",
  "hsl(var(--score-mid) / 0.7)",
  "hsl(var(--score-mid) / 0.45)",
  "hsl(var(--score-poor) / 0.55)",
];
const seed = [2,1,0,3,1,1,2,0,4,1,3,0,99,0,2,1,4,3,2,0,2,1,3,1,2];

export const UniformityHeatmap = () => (
  <div className="rounded-2xl border border-border bg-card p-6">
    <div className="grid grid-cols-5 gap-1.5">
      {grid.map((i) => {
        const isSubject = seed[i] === 99;
        return (
          <div
            key={i}
            className={`aspect-square rounded ${isSubject ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}
            style={{ background: isSubject ? "hsl(var(--score-poor))" : tones[seed[i]] }}
          />
        );
      })}
    </div>
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <Legend swatch="hsl(var(--score-good))" label="Lower assessment vs comps" />
      <Legend swatch="hsl(var(--score-mid))" label="In line with comps" />
      <Legend swatch="hsl(var(--score-poor))" label="Higher than comps" />
      <span className="ml-auto">Illustrative only</span>
    </div>
  </div>
);

const Legend = ({ swatch, label }: { swatch: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="inline-block h-3 w-3 rounded" style={{ background: swatch }} />
    {label}
  </span>
);
