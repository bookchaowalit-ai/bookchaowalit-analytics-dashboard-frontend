# Upgrade plan

## Current state: 7/10 (was 3/10)

The dashboard now measures real data (local CSV) with tested parsing and
windowing, a working MCP tool, and CI; no live event source yet.

## Backlog

### P0
- (none open)

### P1
- Decide on a live source (e.g. Vercel Analytics export or the data lake) and
  add a typed, read-only loader; keep the local CSV path.
- Confirm canonical domain; set `NEXT_PUBLIC_SITE_URL`.

### P2
- Per-segment breakdown table and CSV column mapping UI.
- Parse large files in a Web Worker.
- Remove unused starter SVGs from `public/`.

## Done in this pass
- `lib/analytics.ts`: quoted-CSV parser, window summaries, SVG trace, and a
  deterministic synthetic sample, all unit-tested (`npm test`).
- Page: attach CSV / load synthetic demo / clear; metrics and trace switch
  from illustrative to observed with provenance labels; errors announced.
- Replaced stub `/api/mcp` with `summarize_events_csv`.
- CI (lint, typecheck, test, build); fixed lint errors; removed stray
  `disable_protection.sh`; fixed Source link (pointed at another repo).
- Metadata canonical/og url no longer point at the portfolio root; robots and
  sitemap generated in-app; data-driven accessible `more-projects` page.

## Done in this pass (pass 2)
- Generated `app/opengraph-image.tsx` social card (1200×630 PNG at build time, site palette) replacing the generic purple `public/og-image.svg` (SVG cards are ignored by most platforms); explicit image refs removed from layout.
- `/more-projects` no longer links to this app itself.
