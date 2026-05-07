# TaxAppeal.app — Restructure for Conversion

Reframes the site around fairness-vs-neighbors instead of AI. Keeps the PIN-only backend honest while delivering the conversion-focused UX in the brief. Score and overpayment numbers are derived client-side from data the existing `/api/comparables` endpoint already returns.

## Decisions locked in from clarifiers

- Hero stays **PIN-only**, restyled as the "Fairness Check." No address autocomplete.
- **Fairness Score (0–100)** and **estimated annual overpayment** are computed in the browser from the comparables payload. Documented formula, labeled as a preliminary estimate.
- **$399 AI Premium tier** renders in pricing with an **email waitlist** CTA (no checkout).
- **Tax Watch $29/yr** renders as a marketing card with **email waitlist** CTA. Code is structured so a real Stripe subscription can drop in later without rewriting the UI.

---

## Visual system updates

`src/index.css` + `tailwind.config.ts`:
- Primary → dark slate `#0F172A`, background → white, single accent (amber `#F59E0B`) for CTAs and gauge.
- Drop the cream/forest palette for the new pages. Keep Inter; remove Fraunces from the hero (kept available for legal/secondary pages so we don't churn every page).
- Add fairness-score color tokens: `score-poor` (red), `score-mid` (amber), `score-good` (green).
- Add a `blur-comp` utility for the redacted comp rows.

---

## New + changed pages

### 1. Homepage — `src/pages/Index.tsx` (rewrite)

Sections in order:

1. **Hero** — single CTA. Headline: *"Your home may be assessed unfairly. Find out in 60 seconds."* Subhead emphasizes "keep 100% of the savings — not 35% to a law firm." PIN input + "Check My Property" button. Trust strip beneath: "No legal knowledge required • County-ready editable forms • Flat fee, no contingency cut • Built for Illinois homeowners." Helper link "Where do I find my PIN?" opens existing `PinHelper`.
2. **Keep your savings calculator** — slider $1k–$10k, two columns (contingency 35% vs flat $149), "You keep $X,XXX" rendered large in accent color. Pure client-side.
3. **How it works** — 3 steps (PIN → Fairness Score → County-ready packet).
4. **Uniformity Score, explained** — plain-language section + illustrative block-level heatmap (static SVG, color-coded squares with the subject highlighted).
5. **Real-world Winnetka example** — comparison block, $3,701 kept emphasized.
6. **Pricing teaser** — 3 tier cards + Tax Watch upsell card, links to `/pricing`.
7. **Coverage** — "Available now" (Cook + collar + select downstate placeholder) and "Coming 2027" (GA, TX, FL).
8. **Trust signals** — "X homes checked this week" placeholder counter, dashboard screenshot placeholder, sample report screenshot placeholder, 3 testimonial slots.
9. **FAQ** — 7 Q&As inline, accordion.

Sticky bottom CTA bar on mobile with PIN entry that scrolls to hero.

### 2. Fairness Check flow — replaces current `Comparables.tsx`

New file `src/pages/FairnessCheck.tsx` (or reskin `Comparables.tsx`).

Step A — **Email gate** (modal/inline). Required before score reveals. Email is stored in `lookupCache` and sent with `/api/consent` later so we don't double-collect.

Step B — **Animated analysis** (~16s total). Four sequential lines fade in/out:
- "Pulling assessor records…"
- "Identifying comparable properties…"
- "Calculating uniformity…"
- "Comparing to township median…"

Step C — **Result screen**:
- Large **Fairness Score gauge** (SVG, 0–100, color band per score). Mobile: vertical layout, gauge stays dominant.
- "Your score: X — Neighborhood average: 78" (78 is a fixed reference baseline).
- **Estimated annual overpayment** rendered large.
- "We found N comparable homes assessed lower than yours" → list of comp rows with addresses/values **CSS-blurred** (`filter: blur(6px)`).
- Confidence indicator (reuse existing confidence pill tokens).
- Primary CTA: **"Unlock my full appeal packet — $149"** → `/signup/:lookupId`.
- Secondary CTA: "Want the AI Premium review? Join the waitlist" → opens email waitlist modal.

### 3. Pricing — `src/pages/Pricing.tsx` (rewrite)

Three tiers + Tax Watch:
- **Free — Fairness Check** → "Get my free score" → scrolls/links to PIN entry.
- **$149 — Pro Se Toolkit** (Most Popular, accent-bordered) → "Start my appeal."
- **$399 — AI Premium Review** → "Join the waitlist" (email modal, stored).
- **Tax Watch — $29/yr** separate card → "Get notified when Tax Watch launches" (email modal).

### 4. FAQ — `src/pages/FAQ.tsx`

Replace current Q&As with the 7 from the brief. Keep schema.org FAQPage JSON-LD.

### 5. Footer — `src/components/SiteFooter.tsx`

Compact disclaimer paragraph + links: About • Pricing • Coverage • FAQ • Terms • Privacy • Contact.

---

## New shared modules

- `src/lib/fairness.ts` — pure functions:
  - `computeFairnessScore(subject, comps, townshipMedian)` → 0–100 (lower assessed-vs-comp-median = higher score; clamped).
  - `estimateAnnualOverpayment(subjectAV, compMedianAV, effectiveTaxRate = 0.025)` → dollars.
  - `countCompsBelow(subject, comps)`.
  - Constants in one place; documented as preliminary estimates.
- `src/components/FairnessGauge.tsx` — SVG semicircle gauge, responsive, accent color bands.
- `src/components/SavingsCalculator.tsx` — slider + two-column comparison.
- `src/components/UniformityHeatmap.tsx` — static illustrative SVG grid.
- `src/components/WaitlistModal.tsx` — generic email capture; `tier` prop ("premium" | "tax_watch"). Stores to a Supabase `waitlist` table.
- `src/components/StickyPinCTA.tsx` — mobile sticky bar.

---

## Backend (Lovable Cloud)

One small migration, no edge functions:

- New table `public.waitlist` — `id`, `email`, `tier` (text: 'premium' | 'tax_watch'), `pin` nullable, `lookup_id` nullable, `created_at`. RLS: anon `INSERT` allowed, no `SELECT` for anon.
- New table `public.fairness_emails` — captures the email gate before score reveal: `id`, `email`, `lookup_id`, `pin`, `created_at`. Same RLS pattern.

Tax Watch Stripe wiring is **not** built now, but the waitlist table + `tier` enum value lets us migrate captured emails into real subscribers later. UI components accept a `mode: "waitlist" | "checkout"` prop so swapping in Stripe is a one-line change per CTA.

---

## What gets removed

- AI-forward framing in the hero and any section above the fold.
- Legal disclaimers above the fold (move to footer + FAQ + checkout, already there).
- Cream/forest palette on the homepage and pricing.
- Current `Result.tsx`-era copy still hanging on in pricing/index ("Comparison preview is free…" rephrased to fairness language).

## What stays untouched

- `/api/*` integration in `src/lib/api.ts`, the signup → consent → checkout → success → report flow.
- `Methodology.tsx`, `HowItWorks.tsx`, `Counties.tsx`, `SignIn.tsx`, `ComingSoon.tsx`, `NotFound.tsx` — minor copy alignment only (slate palette, "Fairness Score" terminology where relevant).
- `PinHelper` component (used inside the new hero).

---

## Technical notes

- Fairness Score formula (initial): `score = clamp(50 + 50 * (medianAV - subjectAV) / medianAV, 0, 100)` rounded. Subject equal to median = 50; subject 50% below median = 100; subject 50% above = 0.
- Overpayment formula: `max(0, subjectAV - medianAV) * effectiveTaxRate`. Effective rate constant 2.5% with a tooltip noting it varies by township.
- Animation timing uses `setTimeout` chain; respects `prefers-reduced-motion` (skips delays).
- Comp blur is CSS-only (`filter: blur()` + `select-none`) — no real PII leaks because the underlying comp data is already what the API returns publicly.
- Mobile gauge: gauge first, then score number, then overpayment, then comp list, stacked. Tested at 375px.
- All waitlist + email-gate writes use the existing supabase client; no edge functions needed.

## Files touched

Create: `src/pages/FairnessCheck.tsx`, `src/lib/fairness.ts`, `src/components/FairnessGauge.tsx`, `src/components/SavingsCalculator.tsx`, `src/components/UniformityHeatmap.tsx`, `src/components/WaitlistModal.tsx`, `src/components/StickyPinCTA.tsx`.

Rewrite: `src/pages/Index.tsx`, `src/pages/Pricing.tsx`, `src/pages/FAQ.tsx`, `src/components/SiteFooter.tsx`, `src/index.css`, `tailwind.config.ts`.

Update routing: `src/App.tsx` (point `/comparables/:lookupId` at the new FairnessCheck page; keep old route name to avoid breaking links).

Light copy/palette pass: `Methodology.tsx`, `HowItWorks.tsx`, `Counties.tsx`, `SiteHeader.tsx`.

Migration: create `waitlist` and `fairness_emails` tables with RLS.