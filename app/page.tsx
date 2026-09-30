"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { WINDOWS, parseEventsCsv, sampleCsv, summarizeWindow, tracePath } from "@/lib/analytics";
import type { AnalyticsEvent, WindowKey } from "@/lib/analytics";

const ILLUSTRATIVE_TRACES: Record<WindowKey, string> = {
  "24H": "M12 118 C52 104 72 112 103 88 S150 90 181 74 S225 79 257 52 S307 71 338 38 S386 58 418 30",
  "7D": "M12 111 C47 110 62 79 91 92 S136 58 167 80 S213 57 247 62 S288 22 322 48 S377 33 418 40",
  "30D": "M12 112 C43 95 60 102 91 70 S138 91 169 54 S211 82 242 42 S279 65 314 28 S360 63 418 20",
};

type Source = { kind: "file"; name: string } | { kind: "demo" };

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const numberFormat = new Intl.NumberFormat("en-US");

function formatObservation(timestamp: number | null) {
  if (timestamp === null) return "—";
  return new Date(timestamp).toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

export default function Home() {
  const [windowKey, setWindowKey] = useState<WindowKey>("24H");
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [source, setSource] = useState<Source | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const active = WINDOWS[windowKey];

  const summary = useMemo(() => (source ? summarizeWindow(events, windowKey) : null), [events, source, windowKey]);
  const trace = summary ? tracePath(summary.buckets) : ILLUSTRATIVE_TRACES[windowKey];
  const endY = trace.match(/(\d+(?:\.\d+)?)\s*$/)?.[1] ?? "20";

  const load = (text: string, next: Source) => {
    const result = parseEventsCsv(text);
    setIssues(result.errors);
    if (result.events.length === 0) {
      setEvents([]);
      setSource(null);
      return;
    }
    setEvents(result.events);
    setSource(next);
  };

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setIssues(["File is larger than 10 MB; export a smaller range."]);
      return;
    }
    load(await file.text(), { kind: "file", name: file.name });
  };

  const clear = () => {
    setEvents([]);
    setSource(null);
    setIssues([]);
  };

  const isDemo = source?.kind === "demo";
  const sourceLabel = source === null ? "Source not configured" : source.kind === "demo" ? "Synthetic demo sample" : source.name;

  return (
    <main className="signal-shell">
      <header className="signal-header">
        <Link href="/" className="signal-brand"><span>SL</span> SIGNAL LEDGER</Link>
        <nav aria-label="Dashboard navigation"><Link href="/more-projects">More projects</Link><a href="https://github.com/bookchaowalit-ai/bookchaowalit-analytics-dashboard-frontend" target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></nav>
      </header>

      <section className="signal-hero">
        <div>
          <p className="signal-eyebrow">OPERATE / {source ? (isDemo ? "DEMO DATA" : "LOCAL FILE") : "DEMO FRAME"}</p>
          <h1>Read the signal before it becomes a story.</h1>
          <p className="signal-intro">A quiet dashboard for looking at change. Load a CSV export of events and it is summarised in this browser only; nothing is uploaded. Until then every trace below is explicitly illustrative.</p>
        </div>
        <div className="connection-stamp" role="status"><span aria-hidden="true">●</span><div><b>CONNECTION / {source ? (isDemo ? "SYNTHETIC" : "LOCAL") : "OPEN"}</b><small>{sourceLabel}</small></div></div>
      </section>

      <section className="source-panel" aria-labelledby="source-title">
        <div>
          <p className="signal-eyebrow">SOURCE / CSV</p>
          <h2 id="source-title">Attach an event export</h2>
          <p className="source-help">Header row with <code>timestamp</code> (ISO 8601 or epoch), optional <code>segment</code> and <code>value</code>. Processed locally, up to 10 MB.</p>
        </div>
        <div className="source-actions">
          <label className="source-file">
            <span>Choose CSV file</span>
            <input type="file" accept=".csv,text/csv" onChange={onFile} />
          </label>
          <button type="button" onClick={() => load(sampleCsv(Date.now()), { kind: "demo" })}>Load synthetic demo</button>
          <button type="button" onClick={clear} disabled={!source && issues.length === 0}>Clear</button>
        </div>
        {issues.length > 0 ? (
          <ul className="source-issues" role="alert">
            {issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : null}
      </section>

      <section className="signal-workbench" aria-labelledby="telemetry-title">
        <div className="workbench-head">
          <div><p className="signal-eyebrow">WINDOW / {active.mark}</p><h2 id="telemetry-title">Telemetry window</h2></div>
          <div className="window-switcher" role="group" aria-label="Time window">
            {(Object.keys(WINDOWS) as WindowKey[]).map((key) => <button key={key} type="button" aria-pressed={windowKey === key} className={windowKey === key ? "is-active" : ""} onClick={() => setWindowKey(key)}>{key}</button>)}
          </div>
        </div>

        <div className="workbench-grid">
          <div className="chart-panel">
            <div className="chart-meta"><span>{summary ? (isDemo ? "SYNTHETIC TRACE" : "OBSERVED TRACE") : "ILLUSTRATIVE TRACE"}</span><strong>{active.label}</strong></div>
            <svg className="signal-chart" viewBox="0 0 430 150" role="img" aria-label={summary ? `${isDemo ? "Synthetic" : "Observed"} totals per bucket for the ${active.label}: ${summary.buckets.join(", ")}` : `Illustrative trace for ${active.label}`}>
              <line x1="12" y1="20" x2="418" y2="20" /><line x1="12" y1="55" x2="418" y2="55" /><line x1="12" y1="90" x2="418" y2="90" /><line x1="12" y1="125" x2="418" y2="125" />
              <path className="trace-shadow" d={trace} /><path className="trace-line" d={trace} />
              <circle cx="418" cy={endY} r="4" />
            </svg>
            <div className="chart-axis"><span>START</span><span>{summary ? (isDemo ? "SYNTHETIC / NOT LIVE" : "WINDOW ENDS AT NEWEST EVENT") : "DEMO DATA / NOT LIVE"}</span><span>{summary ? "NEWEST" : "NOW"}</span></div>
          </div>

          <aside className="ledger-panel">
            <p className="signal-eyebrow">READING NOTES</p>
            <h3>{summary ? (isDemo ? "Synthetic sample, not evidence." : "Measured from your file.") : "Nothing is being measured yet."}</h3>
            <p>{summary ? (isDemo ? "The demo sample is generated in the browser to show the mechanics. Do not read the trend as real behaviour." : "Figures are computed in this browser from the attached export. Reload the page to discard them.") : "Attach a CSV export before treating a number or trend as evidence."}</p>
            <dl>
              <div><dt>Source</dt><dd>{source ? (isDemo ? "SYNTHETIC" : "LOCAL CSV") : "NOT ON FILE"}</dd></div>
              <div><dt>Rows read</dt><dd>{source ? numberFormat.format(events.length) : "—"}</dd></div>
              <div><dt>Confidence</dt><dd>{source && !isDemo ? "AS GOOD AS THE EXPORT" : "WITHHELD"}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="metric-strip" aria-label="Window metrics">
        <div><span>Events in window</span><strong>{summary ? numberFormat.format(summary.eventCount) : "—"}</strong><small>{summary ? `total value ${numberFormat.format(summary.total)}` : "awaiting data"}</small></div>
        <div><span>Active segments</span><strong>{summary ? numberFormat.format(summary.segments) : "—"}</strong><small>{summary ? "distinct segment values" : "awaiting schema"}</small></div>
        <div><span>Last observation</span><strong className="metric-time">{summary ? formatObservation(summary.lastObservation) : "—"}</strong><small>{summary ? "newest event in window" : "no source attached"}</small></div>
      </section>

      <footer className="signal-footer"><span>bookchaowalit / AI domain</span><span>Data provenance before decoration</span><a href="https://bookchaowalit.com">Portfolio <span aria-hidden="true">↗</span></a></footer>
    </main>
  );
}
