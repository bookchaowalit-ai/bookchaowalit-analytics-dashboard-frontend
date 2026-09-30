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
- Replace `public/og-image.svg` (generic purple gradient, SVG is ignored by
  most social cards) with an `app/opengraph-image.tsx` in the Signal Ledger palette.
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
