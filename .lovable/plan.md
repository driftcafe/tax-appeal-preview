## Goal
Add a Privacy Policy page covering data security, collection, and retention, and wire it into the site nav.

## What changes

### New page: `src/pages/Privacy.tsx`
Create a Privacy Policy page matching the existing Terms page layout (same header/footer/container styling, same `Legal` badge, date/version stamp). Sections, in order:
1. **Overview** — brief intro stating this is the Privacy Policy for TaxAppeal.app.
2. **Data Collection and Retention** — verbatim from user:
   - Scope: only email and physical property address collected/stored.
   - No collection of SSN, DOB, or bank account numbers.
   - Minimal data retention framework.
3. **Third-Party Payment Processing** — verbatim from user:
   - Transactions off-site via PCI-DSS compliant gateway (e.g., Stripe).
   - We never see or retain credit card info, CVV, or billing data.
4. **Security Measures** — verbatim from user:
   - Industry-standard admin/tech controls.
   - Cloud storage access restricted via MFA and HTTPS/SSL.
   - Data used only to compile public database info for property tax assessment evaluation.

Version label: `v1-2026-05-13-privacy`.

### Update `src/App.tsx`
Add route `<Route path="/privacy" element={<Privacy />} />`.

### Update `src/components/SiteFooter.tsx`
Change Privacy link from `/coming-soon` to `/privacy`.

## Out of scope
- No Terms page edits needed — data section stays on its own Privacy page.
- No design system changes; reuse existing tokens, cards, accent.

## Verification
- Build/type-check passes.
- Footer Privacy link navigates to `/privacy`.
- Page renders all four sections with the exact text provided.