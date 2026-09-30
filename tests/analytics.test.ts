import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEventsCsv, sampleCsv, splitCsvLine, summarizeWindow, tracePath } from "../lib/analytics.ts";

const HOUR = 60 * 60 * 1000;

describe("parseEventsCsv", () => {
  it("parses timestamps, segments, and values", () => {
    const { events, errors } = parseEventsCsv(
      "Timestamp,Segment,Value\n2026-09-01T00:00:00Z,organic,2\n1756684800000,direct,\n1756684800,\"ref, paid\",3",
    );
    assert.deepEqual(errors, []);
    assert.equal(events.length, 3);
    assert.equal(events[0].value, 2);
    assert.equal(events[1].value, 1);
    assert.equal(events[2].timestamp, 1756684800000);
    assert.equal(events[2].segment, "ref, paid");
  });

  it("reports missing header and bad rows without throwing", () => {
    assert.match(parseEventsCsv("when,value\n1,2").errors[0], /timestamp/);
    const result = parseEventsCsv("timestamp,value\nnot-a-date,1\n2026-09-01T00:00:00Z,abc\n2026-09-01T00:00:00Z,4");
    assert.equal(result.events.length, 1);
    assert.equal(result.errors.length, 2);
    assert.deepEqual(parseEventsCsv("").errors, ["The file is empty."]);
  });

  it("handles escaped quotes", () => {
    assert.deepEqual(splitCsvLine('a,"b ""q"" c",d'), ["a", 'b "q" c', "d"]);
  });
});

describe("summarizeWindow", () => {
  const now = Date.UTC(2026, 8, 30, 12);
  const events = [
    { timestamp: now - 1 * HOUR, segment: "a", value: 1 },
    { timestamp: now - 2 * HOUR, segment: "b", value: 2 },
    { timestamp: now - 3 * 24 * HOUR, segment: "a", value: 5 },
    { timestamp: now - 40 * 24 * HOUR, segment: "c", value: 9 },
  ];

  it("counts only events inside the window", () => {
    const day = summarizeWindow(events, "24H", now);
    assert.equal(day.total, 3);
    assert.equal(day.eventCount, 2);
    assert.equal(day.segments, 2);
    assert.equal(day.lastObservation, now - HOUR);
    assert.equal(day.buckets.length, 24);
    assert.equal(day.buckets.reduce((a, b) => a + b, 0), 3);
    assert.equal(summarizeWindow(events, "7D", now).total, 8);
    assert.equal(summarizeWindow(events, "30D", now).eventCount, 3);
  });

  it("anchors to the newest event when now is omitted", () => {
    assert.equal(summarizeWindow(events, "24H").lastObservation, now - HOUR);
  });

  it("returns an empty summary for no events", () => {
    const empty = summarizeWindow([], "7D", now);
    assert.equal(empty.total, 0);
    assert.equal(empty.lastObservation, null);
  });
});

describe("tracePath and sample", () => {
  it("draws a path within the chart box", () => {
    const path = tracePath([0, 5, 10]);
    assert.equal(path, "M12.0 125.0 L215.0 72.5 L418.0 20.0");
    assert.equal(tracePath([]), "");
    assert.match(tracePath([0, 0]), /^M12\.0 125\.0 L418\.0 125\.0$/);
  });

  it("produces a deterministic parseable sample", () => {
    const now = Date.UTC(2026, 8, 30);
    const sample = sampleCsv(now, 30);
    assert.equal(sample, sampleCsv(now, 30));
    assert.equal(parseEventsCsv(sample).events.length, 30);
  });
});
