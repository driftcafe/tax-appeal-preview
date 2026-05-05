
# Reposition site to match Revised Company Plan v2.0

The attached plan reframes the company as a **scrivener-only data analysis & document preparation service** — not legal services, not contingency-based, not "AI-powered" in consumer copy. The current site contains multiple things the plan now prohibits. This is primarily a **copy/positioning rewrite**, not a redesign.

## What's wrong with the current site (must fix)

**Prohibited language currently on the site:**
- "AI-powered" appears throughout hero, footer, meta, schema (banned in consumer-facing contexts per §2.2)
- "AI-powered comparable analysis", "ML-powered", "AI-generated evidence packets" (banned)
- "30% contingency", "$0 upfront", "pay only if we save you money", "Pay nothing unless we save you money" (banned — service is flat fee only, no contingency)
- "AppealManaged / AppealPremium" with contingency tiers (entire pricing model is wrong)
- "PTAB-stage representation through partner attorneys" (the plan does not represent anyone — Stream B is a referral channel only, no fee splitting)
- "Sub-3% valuation error rate", "10%+ error rate typical" (unsubstantiated specific claims, banned by §2.2)
- "Save thousands", "Estimated year-one tax savings: ~$1,420" (banned specific savings claims)
- "successful appeals typically reduce assessed value by 5–15%" in JSON-LD FAQ (banned)
- "We compare", "we'll fight" tone — needs to shift to "you review, edit, and file"

**Wrong positioning:**
- Brand name everywhere is "TaxAppeal AI" — plan uses "Property Tax Appeal AI LLC", domain `propertytaxappealai.com`
- Counties: site lists Cook + 5 collar counties as live; plan says **launch is Cook + collar counties in June 2026**, Midwest expansion later — keep but soften ("launching June 2026")
- Missing required disclaimers (footer disclaimers 1, 2, 5; full block on key pages)

## Proposed changes

### 1. Brand & metadata
- Rename to **Property Tax Appeal AI** across header, footer, SEO, JSON-LD, `index.html`, sitemap, OG tags
- Update tagline to: "Compare your property tax assessment to similar homes — using public data."
- Remove all instances of "AI-powered" / "ML-powered" from consumer copy (keep technical terms like "regression analysis", "comparable property data" instead)

### 2. Home page (`src/pages/Index.tsx`) — rewrite copy
- **Hero headline**: "Is Your Property Tax Assessment Higher Than It Should Be?"
- **Subhead**: "Compare your home's assessed value to similar properties using public data. Get a detailed comparison report and an editable appeal template — ready for you to review, edit, and file yourself."
- **CTA**: "Enter Your Address to Get Started"
- **Trust strip**: replace "Sub-3% valuation error" with claims that match the plan: "Built on public county records", "Flat $149 — no percentage of savings", "You review, edit, and file"
- **Problem section**: keep "most homeowners overpay" but remove specific 30–60% figure (unsubstantiated); reframe softly
- **"How TaxAppeal AI is different" → "How it works"**: replace 5 pillars with the plan's 3-step model (Enter address → Get comparison report → Review, edit, and file)
- **Evidence packet mockup**: keep the visual but
  - Re-label as "Data Report — For Informational Purposes Only" (matching plan's required label)
  - Remove the "Estimated year-one tax savings: ~$1,420" line (banned specific savings claim)
  - Replace "We believe the subject is over-assessed by approximately $18,200" with neutral data language: "Subject property's assessed value is $X above the median of comparable properties"
- **Pricing**: replace 3 tiers with the plan's actual model:
  - **Assessment Comparison Report + Appeal Template — $149 flat fee** (one-time, no percentage of savings)
  - **Annual Tax Watch — $19–$29/year** (monitoring + alerts)
  - Note "$199 in high-value markets" as a footnote
  - Remove all contingency tiers
- **FAQ teaser**: replace with plan's FAQs ("Is this legal advice?", "Do you file the appeal for me?", "Do you guarantee my taxes will be reduced?")
- **Counties**: reframe as "Launching in Illinois — Cook County and DuPage, Lake, Will, Kane, McHenry — June 2026. Midwest expansion to follow."

### 3. JSON-LD / SEO
- Remove FAQ schema entries that imply outcomes ("typically reduce 5–15%", "several hundred to a few thousand dollars")
- Replace with plan-aligned answers ("No tax reduction guaranteed"; "We do not file on your behalf"; "We use regression analysis on public data")
- Update Organization description to "Data analysis and document preparation service for residential property tax assessments. Not a law firm."

### 4. Result page (`src/pages/Result.tsx`)
- Re-label as "Data Report — For Informational Purposes Only"
- Strip any contingency / guaranteed-savings language
- Add the required disclaimer block at top of report (disclaimers 1, 4, 5 per §1.5)
- Keep Wheaton sample address but neutralize claims to "comparable assessed values" rather than "$X you'll save"

### 5. Footer (`src/components/SiteFooter.tsx`)
- Replace current disclaimer with the plan's required footer disclaimers (1, 2, 5):
  > "Property Tax Appeal AI LLC provides data analysis and document preparation services only. We do not provide legal advice, legal representation, or tax consulting. Use of this service does not create an attorney-client relationship. Homeowners are solely responsible for reviewing, editing, and filing all appeal documents."
- Remove "PTAB-stage representation is provided through our partner attorneys" line
- Keep nav structure

### 6. Coming-soon stubbed pages
- Update copy to match new brand name and disclaimer
- Keep current set of routes (Pricing, How it works, Methodology, Counties, FAQ, About)

### 7. Robots / sitemap
- Update canonical domain references; keep `noindex` on `/r/`

## Out of scope (not in this plan)
- Building out full Pricing, FAQ, How-it-works, Methodology, Counties pages (they remain coming-soon stubs unless you ask)
- Stripe checkout integration ($149 payment flow)
- Actual PIN lookup / data report generation
- Stream B law firm portal
- Tax Watch subscription signup

If you want any of those built in this same pass, tell me and I'll add them.

## Files that will change
- `index.html` (title, meta, OG)
- `src/pages/Index.tsx` (full copy rewrite, pricing, JSON-LD)
- `src/pages/Result.tsx` (relabel + disclaimers + neutralize savings)
- `src/components/SiteHeader.tsx` (brand name)
- `src/components/SiteFooter.tsx` (brand name + new disclaimer block)
- `src/pages/ComingSoon.tsx` (brand name)
- `src/pages/NotFound.tsx` (brand name)
- `src/components/SEO.tsx` (default title suffix)
- `public/sitemap.xml`, `public/robots.txt` (if domain references change)

Approve and I'll implement.
