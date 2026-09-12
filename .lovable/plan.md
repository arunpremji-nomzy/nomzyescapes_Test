## Scope

Make the **Signature experiences** section on the `/destinations` page (the eyebrow "More Than A Place To Stay", headline "Signature experiences.", and the three per-destination cards — image, destination eyebrow, "Three signature moments." heading, 3-item list, and Discover link) editable from admin.

## Changes

### 1. `src/lib/site-content.ts`
Add a `signatureExperiences` entry to `defaultContent` + type:
- `eyebrow` (e.g. "More Than A Place To Stay")
- `heading` + `headingItalic` ("Signature" / "experiences.")
- `cardHeading` + `cardHeadingItalic` ("Three signature" / "moments.")
- `discoverLabel` ("Discover")
- `items`: array of `{ slug, dest, image, moments: [string, string, string] }` — seeded with the current Fort Kochi / Varkala / Alleppey values.

### 2. `src/routes/destinations.index.tsx`
- Read `useSiteContent("signatureExperiences")` and use it (with fallback to the existing `experiencesByDest` constant) for the section heading and cards.
- Card image becomes `item.image || fallback`. Moments come from `item.moments`. Discover link still uses `to="/destinations/$slug"` with `params={{ slug: item.slug }}`.

### 3. `src/routes/_authenticated/admin.content.tsx`
- Add a new tab `signatureExp` labeled "signature · experiences".
- Editor form:
  - eyebrow, heading, heading (italic), card heading, card heading (italic), discover label
  - List of 3 cards (add/remove/reorder): slug, destination label, image (via `ImageUploader`), and three moment inputs.

### 4. No DB / RLS changes
Uses the existing `site_content` table (key/value JSON).

## Out of scope
- Other sections on the destinations page.
- The single-destination pages under `/destinations/:slug`.
