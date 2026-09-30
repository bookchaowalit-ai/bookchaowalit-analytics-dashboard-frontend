/**
 * Local-only event analytics: parse a CSV export in the browser and summarise
 * it per time window. Nothing is uploaded; the page keeps data in memory.
 *
 * CSV contract: a header row containing `timestamp` (ISO 8601 or epoch ms),
 * and optionally `segment` and `value` (number, defaults to 1).
 */

export interface AnalyticsEvent {
  timestamp: number;
  segment: string;
  value: number;
}

export interface ParseResult {
  events: AnalyticsEvent[];
  errors: string[];
}

export const WINDOWS = {
  "24H": { label: "last 24 hours", mark: "01", durationMs: 24 * 60 * 60 * 1000, buckets: 24 },
  "7D": { label: "last 7 days", mark: "07", durationMs: 7 * 24 * 60 * 60 * 1000, buckets: 7 },
  "30D": { label: "last 30 days", mark: "30", durationMs: 30 * 24 * 60 * 60 * 1000, buckets: 30 },
} as const;

export type WindowKey = keyof typeof WINDOWS;

const MAX_ROWS = 100_000;

/** Split one CSV line, honouring double-quoted fields with escaped quotes. */
export function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseTimestamp(raw: string): number | null {
  if (/^\d{10,13}$/.test(raw)) {
    const numeric = Number(raw);
    return raw.length === 10 ? numeric * 1000 : numeric;
  }
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export function parseEventsCsv(text: string): ParseResult {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return { events: [], errors: ["The file is empty."] };

  const header = splitCsvLine(lines[0]).map((cell) => cell.toLowerCase());
  const tsIndex = header.indexOf("timestamp");
  if (tsIndex === -1) return { events: [], errors: ['Header row must include a "timestamp" column.'] };
  const segmentIndex = header.indexOf("segment");
  const valueIndex = header.indexOf("value");

  const events: AnalyticsEvent[] = [];
  const errors: string[] = [];
  const rows = lines.slice(1, MAX_ROWS + 1);
  if (lines.length - 1 > MAX_ROWS) errors.push(`Only the first ${MAX_ROWS} rows were read.`);

  rows.forEach((line, index) => {
    const cells = splitCsvLine(line);
    const rowNumber = index + 2;
    const timestamp = parseTimestamp(cells[tsIndex] ?? "");
    if (timestamp === null) {
      if (errors.length < 20) errors.push(`Row ${rowNumber}: invalid timestamp.`);
      return;
    }
    let value = 1;
    if (valueIndex !== -1 && (cells[valueIndex] ?? "") !== "") {
      value = Number(cells[valueIndex]);
      if (!Number.isFinite(value)) {
        if (errors.length < 20) errors.push(`Row ${rowNumber}: value is not a number.`);
        return;
      }
    }
    const segment = segmentIndex === -1 ? "" : (cells[segmentIndex] ?? "");
    events.push({ timestamp, segment, value });
  });

  return { events, errors };
}

export interface WindowSummary {
  total: number;
  eventCount: number;
  segments: number;
  lastObservation: number | null;
  buckets: number[];
}

/**
 * Summarise events inside the window ending at `now` (defaults to the newest
 * event so historical exports still show a meaningful window).
 */
export function summarizeWindow(events: readonly AnalyticsEvent[], key: WindowKey, now?: number): WindowSummary {
  const { durationMs, buckets: bucketCount } = WINDOWS[key];
  const end = now ?? events.reduce((max, event) => Math.max(max, event.timestamp), 0);
  const start = end - durationMs;
  const bucketSize = durationMs / bucketCount;
  const buckets = new Array<number>(bucketCount).fill(0);
  const segments = new Set<string>();
  let total = 0;
  let eventCount = 0;
  let lastObservation: number | null = null;

  for (const event of events) {
    if (event.timestamp <= start || event.timestamp > end) continue;
    const index = Math.min(bucketCount - 1, Math.floor((event.timestamp - start) / bucketSize));
    buckets[index] += event.value;
    total += event.value;
    eventCount += 1;
    if (event.segment) segments.add(event.segment);
    if (lastObservation === null || event.timestamp > lastObservation) lastObservation = event.timestamp;
  }

  return { total, eventCount, segments: segments.size, lastObservation, buckets };
}

/** Build an SVG polyline path for bucket values inside the chart viewBox. */
export function tracePath(buckets: readonly number[], box = { left: 12, right: 418, top: 20, bottom: 125 }): string {
  if (buckets.length === 0) return "";
  const max = Math.max(...buckets);
  const min = Math.min(0, ...buckets);
  const range = max - min || 1;
  const step = buckets.length === 1 ? 0 : (box.right - box.left) / (buckets.length - 1);
  return buckets
    .map((value, index) => {
      const x = box.left + step * index;
      const y = box.bottom - ((value - min) / range) * (box.bottom - box.top);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Deterministic synthetic sample for the "load demo" action (clearly labelled in UI). */
export function sampleCsv(now: number, count = 400): string {
  const segments = ["organic", "referral", "direct"];
  const rows = ["timestamp,segment,value"];
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < count; i += 1) {
    const age = Math.floor(random() * 30 * 24 * 60 * 60 * 1000);
    rows.push(`${new Date(now - age).toISOString()},${segments[i % segments.length]},1`);
  }
  return rows.join("\n");
}
