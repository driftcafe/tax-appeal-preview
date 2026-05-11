# TaxAppeal.app — Visual Refresh Sprint Plan
### Conversation: 18fe100a · Sprint Week: May 12–16, 2026

---

## Audit Summary

> What the codebase looks like today, and what stands in the way of the "high-trust FinTech" goal.

| Area | Current State | Gap |
|---|---|---|
| **Color palette** | White `bg-background`, Amber `--accent` (`#F59E0B`), dark slate `--primary` | Reads "legal/government". Amber = caution, not success. No Deep Navy hero. |
| **Typography** | Inter + Fraunces loaded. Tailwind config maps `font-sans → Inter`. | Fraunces is a serif display face — has a "law firm editorial" feel. Remove or limit to pull-quotes only. |
| **Hero section** (`Index.tsx` L95–120) | Light background, large `h1`, then `<PropertySearch />` below the fold on mobile. | CTA bar is buried. Address bar must dominate. No urgency visual. |
| **FairnessGauge** (`FairnessGauge.tsx`) | SVG semicircle, single score 0–100, no comparison context. No animation. | Score alone is abstract. Users need to see *their home vs. neighbors* — not a mystery number. |
| **UniformityHeatmap** (`UniformityHeatmap.tsx`) | 5×5 color grid, illustrative-only. | Too abstract. Not connected to a dollar figure. Positioned below fold. |
| **SavingsCalculator** (`SavingsCalculator.tsx`) | Slider + two side-by-side cards. Works well. | Amber accent on highlight card doesn't read as "success." Success Green needed. |
| **How It Works** (`Index.tsx` L139–154) | Simple `grid-cols-3` with icon, label, paragraph. Plain. | No step connectors, no deliverable visual for Step 3. Doesn't emphasize the "editable packet." |
| **CTA buttons** | `bg-accent` = amber. Used everywhere uniformly. | FinTech CTAs should be Electric Blue for primary actions; amber reserved for savings/money callouts. |
| **Header** (`SiteHeader.tsx`) | Light border, white bg. "Check my property" is amber nav pill. | Needs dark mode compatibility and a stronger brand signal. |
| **Comparables page** | `FairnessGauge` placed in a card grid next to text. Good bones. | Gauge gives a score — it needs to show **comparison bars** to make unfairness *visceral*. |

---

## Work Streams

---

### Stream 1 — The 'Instant Savings' Hero
**Goal:** Make the address bar the visual centerpiece. Deep Navy background, Success Green for money outcomes. Users should feel urgency and possibility before they scroll.

**Files touched:**
- `src/index.css` — new CSS token layer
- `tailwind.config.ts` — palette extension
- `src/pages/Index.tsx` — hero section (L84–120)
- `src/components/PropertySearch.tsx` — input + button styling

**Design spec:**

```
HERO BACKGROUND: #0A1A2F (Deep Navy)
HERO HEADLINE: White, Inter, 700, ~60px
HERO SUB-COPY: Muted blue-white, ~20px
ADDRESS BAR: Semi-transparent white card, rounded-xl, full-width on mobile
CTA BUTTON: Electric Blue (#1D6AFF) → hover: #1558E0
SAVINGS BADGE: Pill below CTA — "Avg. homeowner saves $3,701 · 100% yours, not 35% to a law firm"
  └─ Badge bg: rgba(46,204,113,0.15), text: #2ECC71 (Success Green)
TRUST STRIP: Inline below badge. Check icons in Success Green. White text.
```

**Key changes:**
1. Add new CSS tokens: `--navy`, `--success`, `--electric-blue` to `index.css`
2. Extend `tailwind.config.ts` with `navy`, `success`, `electric` color aliases
3. Wrap hero `<section>` in `bg-navy` dark background
4. Restyle `PropertySearch` input: dark-mode variant — white/translucent bg, navy text, Electric Blue submit button
5. Add animated savings pill with subtle `animate-pulse` on the dollar amount
6. Trust strip check icons switch from `text-accent` (amber) to `text-success`

> [!IMPORTANT]
> `PropertySearch.tsx` contains live API logic. **Only touch classNames.** Do not alter any state, handlers, or API calls.

---

### Stream 2 — The 'Unfairness Visual' (Comparison Meter)
**Goal:** Replace the abstract 0–100 score with a side-by-side bar chart showing "Your Home" vs. "Comparable Homes" assessed value per sq ft. Unfairness becomes *immediately quantified and visible.*

**Files touched:**
- `src/components/FairnessGauge.tsx` — full visual rebuild (logic layer stays)
- `src/pages/Comparables.tsx` — layout update for the result card (L147–168)

**New component design — `FairnessGauge` v2:**

```
┌─────────────────────────────────────────────┐
│  Assessed Value per Sq Ft                   │
│                                             │
│  YOUR HOME     ████████████████  $18.40/sf  │  ← accent-red bar
│  COMPARABLE    ████████          $11.20/sf  │  ← success-green bar
│                                             │
│  DIFFERENCE    +$7.20/sf (64% higher)       │  ← large, bold, amber
│  Est. overpayment: $3,700/yr                │
└─────────────────────────────────────────────┘
```

**Props interface (no breaking changes):**
```ts
// Existing: { score: number; size?: number }
// New additional props (all optional, backward-compatible):
{
  subjectAV?: number;       // subject assessed value
  subjectSqft?: number;     // subject square footage
  cohortMedianAVPerSqft?: number; // from data.cohort
  overpayment?: number;
  mode?: "gauge" | "compare"; // default: "gauge" (keeps old behavior)
}
```

**Animation spec:**
- Bars animate width from `0` → final value on mount (`transition-all duration-700 ease-out`)
- Stagger: Subject bar first (300ms delay), Comp bar second (500ms delay)
- Difference line fades in at 900ms

**Comparables page update:**
- Switch the result card layout from `[gauge, text]` grid to a full-width `compare` mode gauge
- Move the overpayment dollar figure *into* the gauge component for tighter data storytelling
- Add a "What this means" one-liner beneath: *"Your home is assessed 64% higher per sq ft than comparable homes in your township."*

> [!NOTE]
> The existing `computeFairnessScore`, `estimateAnnualOverpayment` functions in `src/lib/fairness.ts` are not touched. New display data is derived from `data.subject` and `data.cohort` already available in `Comparables.tsx`.

---

### Stream 3 — The 3-Step Process Visual
**Goal:** Transform the current plain grid into a visually connected step-flow with a strong deliverable emphasis on Step 3: the "Editable Appeal Package."

**Files touched:**
- `src/pages/Index.tsx` — How It Works section (L139–154)

**New layout design:**

```
STEP 1          STEP 2          STEP 3
[🏠 icon]  →  [📊 icon]  →  [📄 icon]
Enter your      See your        Download your
PIN             Fairness Score  Editable Appeal
                & Overpayment   Package

                                ┌───────────────┐
                                │ ✓ Pre-filled  │
                                │ ✓ County-     │
                                │   ready forms │
                                │ ✓ File in     │
                                │   minutes     │
                                └───────────────┘
                                   [Start — $149]
```

**Design details:**
- Horizontal connector line between steps (desktop) — `border-t-2 border-dashed border-electric/30`
- Step numbers in Electric Blue circles (`bg-electric text-white`)
- Step 3 card gets an elevated treatment: `border-2 border-success`, slight `shadow-lg`
- "Editable Appeal Package" rendered as a mini document card within Step 3, showing 3 bullet checkmarks in Success Green
- Step 3 CTA button inline: Electric Blue, "Start my appeal — $149"

**Copy update to `steps` array:**
```ts
// Step 3 copy change:
{ h: "Download your Editable Appeal Package.", 
  p: "Pre-filled forms, county-specific filing instructions. Submit online in minutes. Flat $149, no contingency cut." }
```

---

### Stream 4 — Global UI Polish (Tokens + Typography)
**Goal:** Purge the amber-as-primary-CTA pattern and "law firm" aesthetic. Implement a clean FinTech palette with proper semantic color roles.

**Files touched:**
- `src/index.css` — full `:root` token audit
- `tailwind.config.ts` — palette + animation keyframes
- `src/components/SiteHeader.tsx` — nav CTA button
- `src/components/SavingsCalculator.tsx` — highlight card border + "you keep" value color

#### 4a. Token Audit & New Palette

| Token | Current Value | New Value | Semantic Role |
|---|---|---|---|
| `--accent` | `38 92% 50%` (amber) | **unchanged** | Money / savings callouts only |
| `--electric-blue` | *(new)* | `221 100% 56%` (#1D6AFF) | Primary CTA actions |
| `--success` | `--score-good` alias | `145 63% 49%` (#2ECC71) | Confirmed savings, positive outcomes |
| `--navy` | *(new)* | `211 67% 11%` (#0A1A2F) | Hero background |
| `--navy-card` | *(new)* | `213 50% 16%` (#162035) | Cards on navy bg |
| `--primary` | `222 47% 11%` | **unchanged** | Body text, headings |
| `--background` | `0 0% 100%` | **unchanged** | Page body stays white |

**Semantic role enforcement:**
- Amber (`--accent`): *Only* for savings dollar figures and money callouts. Remove from CTA buttons.
- Electric Blue: All primary action buttons site-wide (header CTA, hero submit, How It Works CTA)
- Success Green: Trust strip checkmarks, "you keep" figures in SavingsCalculator, confirmation states

#### 4b. Typography Cleanup
- **Remove Fraunces** from the font import in `index.css` (L6) and from `tailwind.config.ts` (L18)
- **Add Poppins** as display/heading weight alternative: `family=Poppins:wght@600;700;800`
- Map: `font-sans → Inter` (body), `font-display → Poppins` (hero h1, section h2 headings)
- Update `h1, h2, h3` base layer to use `font-display` for the hero heading specifically

#### 4c. Animation Keyframes (add to `tailwind.config.ts`)
```ts
keyframes: {
  "fade-up": {
    from: { opacity: "0", transform: "translateY(12px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "bar-grow": {
    from: { width: "0%" },
    to: { width: "var(--bar-target)" },
  },
  "pulse-green": {
    "0%, 100%": { opacity: "1" },
    "50%": { opacity: "0.6" },
  },
}
animation: {
  "fade-up": "fade-up 0.5s ease-out both",
  "bar-grow": "bar-grow 0.7s ease-out both",
  "pulse-green": "pulse-green 2s ease-in-out infinite",
}
```

#### 4d. SiteHeader CTA
- Change `bg-accent` → `bg-electric` (Electric Blue)
- Update hover: `hover:bg-electric-hover`

#### 4e. SavingsCalculator Highlight Card
- Change `border-2 border-accent` → `border-2 border-success`
- The "You keep" figure: change inline style from `accent-hover` to `text-success`

---

## Task List — Sprint Order

> Execute in this order. Each task is a discrete, non-destructive PR.

```
DAY 1 — Foundation
  [T-01] CSS token additions (--navy, --success, --electric-blue, --navy-card)
  [T-02] Tailwind config: color aliases, Poppins font import, animation keyframes
  [T-03] Remove Fraunces from font stack; add Poppins; set font-display class

DAY 2 — Hero Section
  [T-04] Hero section: bg-navy wrapper, white headline, copy edits
  [T-05] PropertySearch: dark-mode variant classes (input + CTA button → Electric Blue)
  [T-06] Savings badge pill + animated dollar amount below search bar
  [T-07] Trust strip: icons → Success Green

DAY 3 — Gauge Rebuild
  [T-08] FairnessGauge v2: new "compare" mode bar chart (backward-compatible props)
  [T-09] Comparables.tsx: switch result card to compare mode, layout update

DAY 4 — 3-Step Visual
  [T-10] How It Works: step connector line + Electric Blue step circles
  [T-11] Step 3 elevated card: Success Green border, deliverable bullets, inline CTA

DAY 5 — Global Polish + QA
  [T-12] SiteHeader CTA → Electric Blue
  [T-13] SavingsCalculator: Success Green highlight card + "you keep" figure
  [T-14] Audit all remaining amber CTA buttons site-wide; reclassify by semantic role
  [T-15] QA pass: mobile responsiveness, reduced-motion check, contrast ratios
```

---

## Constraints Confirmed

- ✅ No new pricing tiers introduced. $149 base is the only transaction referenced.
- ✅ No Supabase / backend logic touched in any task.
- ✅ No reference to multi-state expansion (the "Coming 2027" section stays unchanged).
- ✅ All tasks are non-destructive — no existing component APIs are broken.
- ✅ `PropertySearch.tsx` API handlers are style-only changes.

---

## Open Questions for Review

> [!NOTE]
> Please confirm before we start Day 1:

1. **Fraunces removal** — It's used for `font-serif` but I see no active usages in component files. Safe to remove outright, or keep it as an unused token?
2. **Hero dark section boundary** — Should the Deep Navy background extend into the SiteHeader (full dark nav), or should the header stay white/light and only the hero body go dark?
3. **Gauge "compare" mode on homepage** — Currently `FairnessGauge` is only rendered on `Comparables.tsx`. Should the homepage also show a *static illustrative* comparison bar in the Uniformity section, or keep the heatmap?
4. **Electric Blue brand approval** — `#1D6AFF` is a strong choice. Want to confirm before global rollout, or should I generate a quick mockup of the hero with this palette applied?
