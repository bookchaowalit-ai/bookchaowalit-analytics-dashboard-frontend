# Signal Ledger — analytics dashboard

A browser-only analytics console. Attach a CSV export of events and the page
summarises it per window (24H / 7D / 30D) without uploading anything. With no
file attached, the chart is explicitly labelled illustrative; the "Load
synthetic demo" sample is labelled synthetic everywhere it appears.

## CSV contract
- Header row with `timestamp` (ISO 8601, epoch seconds, or epoch ms).
- Optional `segment` (string) and `value` (number, default 1).
- Up to 10 MB / 100,000 rows; invalid rows are skipped and reported.
- The window ends at the newest event in the file, so historical exports work.

## Features
- Events in window, total value, distinct segments, last observation, and a
  per-bucket trace computed by `lib/analytics.ts`.
- `/api/mcp` JSON-RPC endpoint with a stateless `summarize_events_csv` tool.
- `robots.txt` / `sitemap.xml` generated from `lib/site.ts`
  (override with `NEXT_PUBLIC_SITE_URL`).

## Run
```bash
npm ci
npm run dev
```

## Checks (same as CI)
```bash
npm run lint
npm run typecheck
npm test
npm run build
```
