# Sprint 02 — Fairness Meter Refactor: Credit Score Mental Model
### Conversation: 44bd33cb · Target: FairnessGauge.tsx

---

## Audit Summary

> What exists today, what's broken about it, and what must change.

### Existing Component: `src/components/FairnessGauge.tsx`

| Aspect | Current State | Problem |
|---|---|---|
| **Shape** | SVG semicircle arc (`ClassicGauge`) + animated bar chart (`CompareView`) | Two disconnected UIs. The semicircle is the "hero" but the bars are the real data. |
| **Score directionality** | No label. Score `72` renders without context. | A user cannot tell if 72 is good or bad. Ambiguous. |
| **Neighborhood Average** | `NEIGHBORHOOD_BASELINE = 78` — defined in `fairness.ts`, **not displayed anywhere in the gauge** | The single most trust-building data point is invisible. |
| **Overpayment callout** | Rendered as `text-sm text-muted-foreground` inside a bordered div | Completely undersized. A $3,700 figure buried in body copy is a conversion killer. |
| **Animation** | `ClassicGauge` has zero animation. `CompareView` bars use `transition-width` via `useRef`. | No needle sweep. Bars are functional but not premium. |
| **Band thresholds** | `< 50` = poor, `< 75` = mid, `≥ 75` = good | Does not match the requested 0–40 / 41–70 / 71–100 Credit Score model. |
| **Mode routing** | `mode="compare"` renders `CompareView` (bars). `mode="gauge"` renders `ClassicGauge`. | The gauge mode is what's displayed as the visual hero — and it needs the full refactor. |

### Existing Call Site: `src/pages/Comparables.tsx` (L167–174)

```tsx
<FairnessGauge
  mode="compare"
  score={metrics.score}
  subjectAV={data.subject.assessed_value}
  subjectSqft={data.subject.sqft}
  cohortMedianAVPerSqft={data.cohort.median_av_per_sqft}
  overpayment={metrics.overpayment}
/>
```

**Props are already wired correctly.** All required data is available. No prop changes needed on `Comparables.tsx`.

### Available Data in `fairness.ts`

```ts
export const NEIGHBORHOOD_BASELINE = 78;  // ← The notch value. Currently unused in UI.
export const EFFECTIVE_TAX_RATE = 0.025;
// computeFairnessScore: returns 0–100
// scoreBand: currently <50 poor | <75 mid | ≥75 good  ← needs update
```

### Dependency Constraint

> [!WARNING]
> **Framer Motion is NOT installed** (`package.json` confirmed). The plan uses **CSS `@keyframes` + SVG `stroke-dashoffset` animation** — identical visual quality with zero new dependencies. If Framer Motion is explicitly desired, flag it as a prerequisite install step.

---

## What We're Building

A single, unified **Credit Score Gauge** that replaces both `ClassicGauge` and `CompareView` with one coherent visual. The component keeps the same props interface — the call site on `Comparables.tsx` needs zero edits.

### Visual Blueprint

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         ▲ Neighborhood                                      │
│           Average (78)  ← notch marker on arc              │
│        ╱                                                    │
│  ██ ██ ▲ ████ ████ ████ ████ ████ ██                       │
│ RED   YEL          GREEN                                    │
│  0    40   50      70          100                          │
│                                                             │
│              ◉  42                                          │
│          Fairness Score                                     │
│           Likely Overpaying                                 │
│                                                             │
│  ─────────────────────────────────────────────────         │
│                                                             │
│   💸 Estimated Annual Overpayment                           │
│                  $3,701          ← SUCCESS GREEN #2ECC71   │
│            (large, animated)       ~70px bold              │
│                                                             │
│   Your home: $18.40/sqft                                    │
│   Neighborhood avg: $11.20/sqft   ← contextual text        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Task Breakdown

---

### Task T-A: Update `scoreBand` in `src/lib/fairness.ts`

**File:** `src/lib/fairness.ts`
**Type:** Non-destructive logic change

Remap the score thresholds to match the Credit Score mental model:

```ts
// BEFORE
export function scoreBand(score: number): "poor" | "mid" | "good" {
  if (score < 50) return "poor";
  if (score < 75) return "mid";
  return "good";
}

// AFTER
export function scoreBand(score: number): "poor" | "mid" | "good" {
  if (score <= 40) return "poor";   // Red zone: 0–40 — Unfair/Overpaying
  if (score <= 70) return "mid";    // Yellow zone: 41–70 — Borderline
  return "good";                    // Green zone: 71–100 — Fair/Safe
}
```

Update `scoreBandLabel` to match the new model language:

```ts
// AFTER
export function scoreBandLabel(score: number): string {
  const b = scoreBand(score);
  if (b === "poor") return "Likely Overpaying";
  if (b === "mid") return "Borderline — Worth Checking";
  return "Looks Fair";
}
```

**Impact:** `scoreBand` is consumed by:
1. `FairnessGauge.tsx` — color logic (updates automatically)
2. `Comparables.tsx` L153–158 — label color (updates automatically)

No other files import `scoreBand`.

---

### Task T-B: Full Refactor of `src/components/FairnessGauge.tsx`

**File:** `src/components/FairnessGauge.tsx`
**Type:** Full visual rebuild — props interface preserved

#### New Architecture

Replace both `ClassicGauge` and `CompareView` with a single `CreditScoreGauge` component. The `FairnessGauge` export function remains the routing switch.

#### SVG Gauge Geometry

The gauge is a **180° semicircular arc** (left = 180°, right = 360°). The arc is divided into three colored segments:

| Zone | Score Range | Angular Range | Color |
|---|---|---|---|
| Red | 0–40 | 180°–252° (40% of 180°) | `hsl(var(--score-poor))` = `#E02020` |
| Yellow | 41–70 | 252°–306° (30% of 180°) | `hsl(var(--score-mid))` = `#F59E0B` |
| Green | 71–100 | 306°–360° (30% of 180°) | `hsl(var(--score-good))` = `#2ECC71` |

SVG coordinate system:
- `cx = w/2`, `cy = h` (bottom of SVG viewport — arc appears as top-half dome)
- `r = w/2 - 24` (outer radius, accounting for stroke half-width)
- `stroke-width = 22`
- SVG width defaults to `320`, height to `width / 2 + 32`

#### Animated Needle

A needle rendered as an SVG `<line>` from center `(cx, cy)` outward. Rotation via a `<g>` wrapper with CSS class `.gauge-needle`. On mount:
- **Initial state:** pointing straight left (0° rotation relative to center)
- **Final state:** `rotate(score / 100 * 180 deg)` around `(cx, cy)`
- **Mechanism:** CSS `@keyframes needle-sweep` (see T-C)
- **Duration:** 1200ms, spring easing
- **Trigger:** `IntersectionObserver` (threshold 0.4, same pattern as current `CompareView`)

Needle design:
- `<line>` from `(cx, cy)` to `(cx + r * 0.75, cy)` — points left initially
- Width: `3px`, color: white with a 2px navy outline (drop shadow effect)
- Hub: `<circle cx={cx} cy={cy} r={8}` filled with band color

#### Neighborhood Average Notch

A **physical tick mark** on the outside edge of the arc. Rendered as:
- A `<polygon>` triangle (small downward-pointing arrow) at the angular position of `NEIGHBORHOOD_BASELINE`
- A `<text>` element above the notch: `"Nbhd Avg"` in `hsl(var(--navy-muted))`
- Color: `hsl(var(--navy-muted))` — subtle, does not compete with user score

Notch angle: `180 + (NEIGHBORHOOD_BASELINE / 100) * 180` degrees.

#### Score Display (Center of Gauge)

```
     [score number]       ← 72px Inter 800, color = band color
   ["Fairness Score"]     ← 11px uppercase tracking-widest muted
   ["Likely Overpaying"]  ← 13px medium, band-colored
```

Fades in at 600ms after needle starts (CSS animation-delay).

#### Overpayment Block (Below Gauge Divider)

Conditional on `overpayment > 0`:

```tsx
<div className="flex flex-col items-center gap-1 mt-5 border-t border-border pt-5">
  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
    Est. Annual Overpayment
  </p>
  <p
    className="text-6xl font-extrabold tabular-nums text-success"
    style={{ animationDelay: "900ms" }}
  >
    ${overpayment.toLocaleString()}
  </p>
  <p className="text-xs text-muted-foreground">
    Based on uniformity gap vs. comparable homes
  </p>
</div>
```

`text-success` = `hsl(145 63% 49%)` — Success Green as defined in `index.css`. The overpayment figure also gets `animate-pulse-green` (defined in Sprint 01 keyframes).

When `overpayment === 0`:
```tsx
<p className="text-sm text-success mt-5 text-center font-medium">
  ✓ Your home appears fairly assessed relative to your neighborhood.
</p>
```

#### AV Per Sqft Comparison Row

Below the overpayment block, a clean two-row table replaces the full bar chart:

```
Your home:         $18.40/sqft  ← text-[hsl(var(--score-poor))] if unfair
Neighborhood avg:  $11.20/sqft  ← text-muted-foreground
```

This preserves the key data while de-cluttering the visual hierarchy.

#### Accessibility

- Outer `<div>` has `role="img"` with descriptive `aria-label`
- SVG contains `<title>` element with score + band label
- Overpayment block has `aria-live="polite"`
- Needle animation respects `prefers-reduced-motion` (see T-C)

---

### Task T-C: Add CSS Keyframe in `src/index.css`

**File:** `src/index.css`
**Type:** Additive only

```css
/* Gauge needle sweep animation */
@keyframes needle-sweep {
  from { transform: rotate(0deg); }
  to   { transform: rotate(var(--needle-target-angle)); }
}

.gauge-needle {
  transform-box: fill-box;
  transform-origin: var(--gauge-cx) var(--gauge-cy);
  animation: needle-sweep 1200ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-play-state: paused;  /* activated by JS when IntersectionObserver fires */
}

.gauge-needle.is-visible {
  animation-play-state: running;
}

/* Score + overpayment fade-in */
@keyframes gauge-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.gauge-score-appear {
  opacity: 0;
  animation: gauge-fade-up 400ms ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .gauge-needle {
    animation: none !important;
    transform: rotate(var(--needle-target-angle));
  }
  .gauge-score-appear {
    animation: none !important;
    opacity: 1;
  }
}
```

---

### Task T-D: Minor Update to `Comparables.tsx`

**File:** `src/pages/Comparables.tsx`
**Lines:** L233–238 only (the overpayment footnote inside the gauge card)
**Type:** One-line removal

The overpayment dollar figure now lives inside the gauge component (T-B). Remove the now-duplicate `{overpayment > 0 && ...}` callout in `CompareView` to avoid showing the number twice.

Also update the "analyzing" spinner (L130) from `text-accent` (amber) → `text-electric` to match the FinTech palette established in Sprint 01.

> [!IMPORTANT]
> Do not touch any Supabase logic, email handling, blurred comparables table (L196–213), or the CTA section (L216–235). Style-layer changes only.

---

## Prop Interface — No Breaking Changes

The public API of `<FairnessGauge />` is unchanged. The call site on `Comparables.tsx` (L167–174) needs **zero edits**.

```ts
// mode="compare" — renders new CreditScoreGauge with full features
interface CompareModeProps {
  mode: "compare";
  score: number;
  subjectAV: number;
  subjectSqft: number;
  cohortMedianAVPerSqft: number;
  overpayment: number;
  size?: number;  // defaults to 320
}

// mode="gauge" (or omitted) — simplified gauge, no compare data
interface GaugeModeProps {
  mode?: "gauge";
  score: number;
  size?: number;
}
```

---

## Color Reference

| Token | Hex | Use in Gauge |
|---|---|---|
| `--score-poor` | `#E02020` | Red arc segment, score number + needle hub when unfair |
| `--score-mid` | `#F59E0B` | Yellow arc segment |
| `--score-good` | `#2ECC71` | Green arc segment |
| `--success` | `#2ECC71` | Overpayment dollar figure (large) |
| `--navy-muted` | `hsl(213 30% 65%)` | Notch label text |
| `--muted-foreground` | — | Arc track background, secondary text |

---

## Animation Timing

| Element | Delay | Duration | Easing |
|---|---|---|---|
| Needle sweep | 0ms (on intersection) | 1200ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring |
| Score number fade-in | 600ms | 400ms | ease-out |
| Band label fade-in | 700ms | 300ms | ease-out |
| Overpayment figure | 900ms | 500ms | ease-out |
| Overpayment pulse-green | continuous | 2s | ease-in-out |

---

## File Risk Matrix

| File | Change Type | Risk | Notes |
|---|---|---|---|
| `src/lib/fairness.ts` | Threshold remapping | 🟡 Low | Affects labels + colors only; no data mutation |
| `src/components/FairnessGauge.tsx` | Full visual rebuild | 🟡 Medium | Same props, new SVG structure; no backend touch |
| `src/index.css` | Add keyframes | 🟢 Minimal | Purely additive |
| `src/pages/Comparables.tsx` | Remove 1 duplicate line, 1 class swap | 🟢 Minimal | Surgical |

---

## Out of Scope

- No Framer Motion installation (not in `package.json`)
- No Supabase / backend logic changes
- No changes to `PropertySearch.tsx`, `ChatWidget.tsx`, or pricing pages
- `NEIGHBORHOOD_BASELINE` value stays at 78 — only its *visual display* is added
- The homepage does not get a gauge (per Sprint 01 scope)

---

## Open Questions (Need Sign-off Before Implementation)

> [!NOTE]
> Please confirm these 5 points before implementation begins:

1. **Framer Motion** — Plan uses CSS keyframes (no install needed, zero risk). Do you want to install `framer-motion` explicitly for the `motion.` API? If yes, I'll add an install step first.
2. **Arc sweep direction** — Plan uses a standard left-to-right semicircle (like a speedometer). Should it instead use a 270° sweep (like Apple Watch rings) for a more premium look?
3. **Gauge-only mode** — `mode="gauge"` (no compare data) is not used anywhere in the current live flow. Fully rebuild it to match the new style, or leave `ClassicGauge` as-is and only update it in a future sprint?
4. **Fair property copy** — When `overpayment === 0`, confirm copy: *"✓ Your home appears fairly assessed relative to your neighborhood."* — or different message?
5. **Mobile minimum width** — The SVG will use `width="100%"` with `viewBox` for fluid scaling. Any hard minimum (e.g., 280px) below which we should cap it, or fully fluid down to 320px container?
