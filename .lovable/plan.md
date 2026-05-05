## Goal

Make the homepage's primary input PIN-aware. Users can submit either a PIN or an address; if they don't know their PIN, they get clear, county-specific links to look it up on the official county site.

This is the "B only — manual PIN with helper links" path you picked. No geocoding, no scraping, no per-county integrations yet. Ships today, honest about the data flow, and leaves the door open to add automated address→PIN later without breaking the contract.

## Changes

### 1. `src/pages/Index.tsx` — Hero form

- Replace the single "address" input with a smarter input labeled **"Enter your PIN or property address"**.
- Autodetect on submit:
  - If the value matches a PIN-like pattern (e.g. mostly digits, 10–18 chars, optional dashes) → treat as PIN, route to `/r/sample-token?pin=<normalized>`.
  - Otherwise → treat as address, route to `/r/sample-token?address=<encoded>` (Result page will prompt for PIN if needed; out of scope for this change).
- Update the helper text under the form to clarify: address-only lookups currently require entering your PIN to generate the report.

### 2. New component `src/components/PinHelper.tsx`

Small disclosure that lives directly under the hero form. Default collapsed:

> **Don't know your PIN?** It's on your most recent property tax bill or assessment notice. You can also look it up on your county's official site:

Followed by a row of 6 chips, each linking out (new tab, `rel="noopener"`) to the county's official PIN-lookup page:

| County | URL |
|---|---|
| Cook | `https://www.cookcountyassessor.com/address-search` |
| DuPage | `https://www.dupagecounty.gov/government/elected_officials/treasurer/property_tax_lookup.php` |
| Lake | `https://assessor.lakecountyil.gov/Search/Disclaimer.aspx?FromUrl=../search/commonsearch.aspx?mode=address` |
| Will | `https://willcountysoa.com/PropertySearch` |
| Kane | `https://www.kaneassessor.org/PropertySearch.aspx` |
| McHenry | `https://www.mchenrycountyil.gov/county-government/departments-a-i/assessments/property-information` |

(I'll verify each URL resolves before shipping; if any have moved, I'll use the assessor's homepage as fallback.)

Styled with existing design tokens — small `border bg-card` chips matching the county chips already on the page.

### 3. `src/pages/Result.tsx` — accept PIN from query

Read `?pin=` and `?address=` from the URL. Display whichever was provided in the report header. If only an address came through, show a short "Enter your PIN to continue" inline prompt. (Stub-level; the real backend integration comes with the report API later.)

### 4. Validation

PIN normalization helper in `src/lib/pin.ts`:
- Strip whitespace and dashes
- Validate length 10–18 digits
- Reformat for display (Cook PINs are conventionally `xx-xx-xxx-xxx-xxxx`); other counties keep raw digits for now
- Pure function, easy to unit test later

## Out of scope (intentional)

- Automated address → PIN resolution (geocoding + ArcGIS parcel lookup). You picked Google Geocoding for *if/when* we do this — we'll wire it county-by-county later, starting with Cook.
- Backend `address-lookup` edge function. Not needed until automated lookup ships.
- Per-county PIN format validation beyond length. Each county has its own format; over-validating now risks rejecting valid PINs.

## Files touched

- `src/pages/Index.tsx` — edit form + label + submit logic
- `src/pages/Result.tsx` — read query params, conditional PIN prompt
- `src/components/PinHelper.tsx` — new
- `src/lib/pin.ts` — new (tiny utility)
