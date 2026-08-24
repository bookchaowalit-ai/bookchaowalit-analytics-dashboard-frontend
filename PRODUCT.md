# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Inferred from the repository name and current scaffold; user confirmation pending.
The likely visitor is evaluating an analytics dashboard concept and needs to
understand whether the dashboard is connected to real data.

## Product Purpose

This repository is intended to present an analytics dashboard surface. The
current implementation is only a Next.js scaffold, so the actual data source,
audience, and decision workflow remain open.

## Positioning

Undecided. No analytics provider, event schema, dataset, or connected dashboard
workflow is present in the inspected repository.

## Operating Context

The app is a standalone Next.js page with a shared `/api/mcp` route and a
portfolio cross-link. It currently has no verified remote data connection.

## Capabilities and Constraints

- The current homepage is a generic scaffold and does not expose real metrics.
- No event ingestion, filters, charts, authentication, or persistence are
  confirmed in the current app.
- Any demonstration values added to the UI must be labeled synthetic/demo.

## Brand Commitments

The product name is `bookchaowalit-analytics-dashboard-frontend`. No additional
visual or brand commitment is confirmed.

## Evidence on Hand

The evidence is the current `app/page.tsx`, `app/globals.css`, Next.js metadata,
and the shared MCP route. There is no verified production dataset or analytics
provider contract.

## Product Principles

- Make data provenance visible.
- Prioritize decisions over decorative metrics.
- Use honest empty and disconnected states.
- Keep the dashboard legible under pressure.

## Accessibility & Inclusion

Use semantic landmarks, keyboard-visible focus, readable contrast, tabular
numerals where appropriate, and reduced motion support. Product-specific
accessibility requirements are not yet known.
