## Goal

Bring the homeowner flow into compliance with `LOVABLE_API_BRIEF.md` while keeping the existing visual system. The four pages and routes already exist; this plan fills the gaps and removes copy that violates the brief's legal-load-bearing rules.

## What changes, page by page

### `src/lib/api.ts` — API client
- Switch `API_BASE` to `import.meta.env.VITE_API_BASE ?? "https://taxappeal.app"`.
- Add `api.reportByConsent(consent_id)` calling `GET /api/reports/by-consent/:consent_id`. Return type is a discriminated union on `status`: `awaiting_payment` | `generating` | `payment_failed` (with `reason`) | `ready` (with `report` matching `ReportResponse`).

### Homepage (`src/pages/Index.tsx`) — minor copy pass only
- Keep layout. Audit + fix any forbidden-phrase risk:
  - `"Estimated annual reduction"` row in Winnetka example → reword to `"Comp-supported assessment gap"` (avoid "Estimated…" pattern that brushes against forbidden valuation language).
  - Testimonial copy `"Saved us $2,840 the first year"` → soften to `"My assessment came down meaningfully"` (testimonials that quote dollar outcomes read like guarantees).
  - `"keep $3,701"` hero stat + Winnetka "Homeowner kept $3,701" → reframe as illustrative ("In one Winnetka case…") so it isn't read as a guarantee of savings.
- Tax Watch / waitlist tiers stay; brand "Fairness Score" stays (not on the forbidden list).

### Comparables (`src/pages/Comparables.tsx`) — rebuild to brief spec
The brief is explicit about what step 1 must show. Replace the email-gate + 16s fake animation + blurred comps with the brief's required view, but keep the existing visual system (cards, accent color, typography):

- Remove the `phase: "email" | "analyzing" | "result"` state, the `STEPS` animation, the `fairness_emails` Supabase write, and the `blur-comp` treatment on comparable rows.
- Keep the `loadLookup` cache + 404-redirect-to-`/` behavior.
- Render directly:
  1. **Subject headline strip** — assessed value, sqft, year built, AV per sqft (from `data.subject`).
  2. **Big over-assessment signal** — when `cohort.appears_over_assessed === true`, render exactly: "You appear to be over-assessed by {Math.round(cohort.uniformity_gap_pct * 100)}% compared to {cohort.size} similar properties in your township." When `false`, swap CTA for "Your assessment looks fair — no charge" and disable the Continue button.
  3. **Comparables grid** — all 8 entries unblurred. Each row: address, sqft, year built, assessed value, `av_gap_dollars` ("$X less than yours"), and a 0–100% similarity bar from `similarity_score`.
  4. **CTA** — "Get my appeal packet — ${price_cents/100}" linking to `/signup/:lookupId`. Premium waitlist link stays.
- Keep the `FairnessGauge` only as a small visual sidebar of the headline section (it's a brand asset, not a brief violation), but the brief's required signal text is the primary hero.
- Drop forbidden words audit: nothing in this page should say "Fair Market Value", "Estimated Value", "Property Worth", "Our Valuation", etc. The current "Estimated annual overpayment" copy is borderline — replace with "Annual assessment gap (at 2.5% effective rate)".

### Signup (`src/pages/Signup.tsx`) — small fixes
- No structural change. Disclaimer text already matches the brief verbatim; keep as-is.
- Pass through unchanged: `api.consent` → `api.checkout` → redirect or scaffold.

### Success (`src/pages/Success.tsx`) — wire polling + inline render
- Read `consent_id` from query string. If missing, show error + link back to `/`.
- Show `simulated=true` banner when present.
- Poll `api.reportByConsent(consent_id)` every 1500 ms, max ~60 attempts, abortable on unmount:
  - `awaiting_payment` / `generating` → "Payment received — preparing your appeal packet (usually under a minute)" with a spinner.
  - `payment_failed` → show `reason`, button to re-POST `/api/checkout` with the same `consent_id` (need to persist the consent → success URL pair; simplest is rebuild via origin).
  - `ready` → stop polling, render the same report layout as `/r/:token` inline (extract a shared `<ReportView>` component — see below).
  - 404 from API → "We couldn't find that order — please look up your PIN again" + link to `/`.
  - Timeout after ~90 s → friendly retry + email-arriving fallback.
- Add the brief's email confirmation line above the downloads using the email persisted from Signup (extend `lookupCache` to also stash `customer_email` keyed by `consent_id`, written in Signup.tsx right before the `api.consent` call).

### Report view — extract `src/components/ReportView.tsx`
- Pull the rendered report markup out of `src/pages/Report.tsx` so both Success (post-payment, polled) and `/r/:token` (share link) render identical UI.
- Adds the brief's required bits currently missing:
  - **Email confirmation line** — "We've also sent this packet to {email}. Reply to that email any time if you have questions." (Email is optional prop — Report.tsx won't have it, Success will.)
  - **"Need help?" footer** — "Questions? Reply to your packet email, or write to support@taxappeal.app." (`mailto:` link). Replaces no-op contact references.
  - Existing scaffold-URL-aware download button stays.
- Report.tsx becomes a thin wrapper that fetches by token and renders `<ReportView>`.

### `SiteFooter.tsx` — copy fix
- Replace `mailto:hello@taxappeal.app` "Contact" link with `mailto:support@taxappeal.app` "Support" — brief mandates support@taxappeal.app as the only support channel and forbids contact forms / phone numbers.

### Forbidden-phrase sweep
Search the whole repo for the brief's blacklist and fix any hit:

```
Fair Market Value | Appraised Value | Estimated Value | Property Worth |
Our Valuation | We believe your home is worth |
Guaranteed | We will win | 100% success | Guaranteed reduction |
Our attorneys | Our lawyers | Legal counsel |
Tax relief program | Government program | You are legally entitled |
IRS | Federal tax | Tax debt |
PTAB | Property Tax Appeal Board | Tax sale | Redemption
```

Known-likely hits to triage in this pass: Index hero/Winnetka stats, Comparables "Estimated annual overpayment", any FAQ entries.

### Open question to flag, not fix in this PR
The brief says: *"Customers should not see a contact form, a live chat widget, or a phone number anywhere in the product."* The repo has `src/components/ChatWidget.tsx`. **Not removing it in this plan** — flagging for confirmation since you previously asked for it. If you want the chat widget gone to comply with the brief, say so and I'll unmount it.

## Out of scope
- No new routes; `App.tsx` route table is already correct.
- No backend / Supabase changes (`fairness_emails` write is dropped from Comparables but the table can stay).
- No design system changes; reuse existing tokens, cards, accent.
- No env changes beyond reading `VITE_API_BASE` with a fallback (no `.env` edit required).

## Verification after implementation
- Type-check passes (build runs automatically).
- Manually walk the test PIN `16-19-213-035-0000` through `/` → `/comparables/:id` → `/signup/:id`. Confirm the over-assessment banner reads "over-assessed by 125%", all 8 comps render, CTA leads to signup.
- On Success page with `?simulated=true&consent_id=…`, confirm polling cycles through `awaiting_payment`/`generating` and renders inline once `ready`.
- `rg` for forbidden phrases returns no matches in `src/`, `index.html`, `public/`.
