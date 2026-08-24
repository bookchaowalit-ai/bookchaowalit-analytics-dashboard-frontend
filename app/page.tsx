"use client";

import Link from "next/link";
import { useState } from "react";

const windows = {
  "24H": { label: "last 24 hours", trace: "M12 118 C52 104 72 112 103 88 S150 90 181 74 S225 79 257 52 S307 71 338 38 S386 58 418 30", mark: "01" },
  "7D": { label: "last 7 days", trace: "M12 111 C47 110 62 79 91 92 S136 58 167 80 S213 57 247 62 S288 22 322 48 S377 33 418 40", mark: "07" },
  "30D": { label: "last 30 days", trace: "M12 112 C43 95 60 102 91 70 S138 91 169 54 S211 82 242 42 S279 65 314 28 S360 63 418 20", mark: "30" },
} as const;

type WindowKey = keyof typeof windows;

export default function Home() {
  const [windowKey, setWindowKey] = useState<WindowKey>("24H");
  const active = windows[windowKey];

  return (
    <main className="signal-shell">
      <header className="signal-header">
        <Link href="/" className="signal-brand"><span>SL</span> SIGNAL LEDGER</Link>
        <nav aria-label="Dashboard navigation"><Link href="/more-projects">More projects</Link><a href="https://github.com/bookchaowalit-ai/book-ai" target="_blank" rel="noreferrer">Source ↗</a></nav>
      </header>

      <section className="signal-hero">
        <div>
          <p className="signal-eyebrow">OPERATE / DEMO FRAME</p>
          <h1>Read the signal before it becomes a story.</h1>
          <p className="signal-intro">A quiet dashboard shell for looking at change. There is no connected analytics source in this repository yet, so every trace below is explicitly illustrative.</p>
        </div>
        <div className="connection-stamp" role="status"><span aria-hidden="true">●</span><div><b>CONNECTION / OPEN</b><small>Source not configured</small></div></div>
      </section>

      <section className="signal-workbench" aria-labelledby="telemetry-title">
        <div className="workbench-head">
          <div><p className="signal-eyebrow">WINDOW / {active.mark}</p><h2 id="telemetry-title">Telemetry window</h2></div>
          <div className="window-switcher" role="group" aria-label="Illustrative time window">
            {(Object.keys(windows) as WindowKey[]).map((key) => <button key={key} type="button" aria-pressed={windowKey === key} className={windowKey === key ? "is-active" : ""} onClick={() => setWindowKey(key)}>{key}</button>)}
          </div>
        </div>

        <div className="workbench-grid">
          <div className="chart-panel">
            <div className="chart-meta"><span>ILLUSTRATIVE TRACE</span><strong>{active.label}</strong></div>
            <svg className="signal-chart" viewBox="0 0 430 150" role="img" aria-label={`Illustrative trace for ${active.label}`}>
              <line x1="12" y1="20" x2="418" y2="20" /><line x1="12" y1="55" x2="418" y2="55" /><line x1="12" y1="90" x2="418" y2="90" /><line x1="12" y1="125" x2="418" y2="125" />
              <path className="trace-shadow" d={active.trace} /><path className="trace-line" d={active.trace} />
              <circle cx="418" cy={windowKey === "24H" ? "30" : windowKey === "7D" ? "40" : "20"} r="4" />
            </svg>
            <div className="chart-axis"><span>START</span><span>DEMO DATA / NOT LIVE</span><span>NOW</span></div>
          </div>

          <aside className="ledger-panel">
            <p className="signal-eyebrow">READING NOTES</p>
            <h3>Nothing is being measured yet.</h3>
            <p>The window control is a visual prototype. Connect an event source before treating a number or trend as evidence.</p>
            <dl><div><dt>Source</dt><dd>NOT ON FILE</dd></div><div><dt>Refresh</dt><dd>MANUAL / TBD</dd></div><div><dt>Confidence</dt><dd>WITHHELD</dd></div></dl>
          </aside>
        </div>
      </section>

      <section className="metric-strip" aria-label="Connection facts">
        <div><span>Events ingested</span><strong>—</strong><small>awaiting contract</small></div>
        <div><span>Active segments</span><strong>—</strong><small>awaiting schema</small></div>
        <div><span>Last observation</span><strong>—</strong><small>no source attached</small></div>
      </section>

      <footer className="signal-footer"><span>bookchaowalit / AI domain</span><span>Data provenance before decoration</span><Link href="https://bookchaowalit.com">Portfolio ↗</Link></footer>
    </main>
  );
}
