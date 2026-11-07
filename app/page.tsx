"use client";
import { useState } from "react";
import OrderPanel, { type Mode, type RecordedResult, type SimResult } from "@/components/OrderPanel";
import Terminal, { type TerminalLine } from "@/components/Terminal";
import ResultStrip from "@/components/ResultStrip";
import FailureCases from "@/components/FailureCases";
import CRETab from "@/components/CRETab";
import EnforcementChecklist from "@/components/EnforcementChecklist";
import { config } from "@/lib/config";

type Tab = "failures" | "cre" | "enforcement";

export default function DemoPage() {
  const [mode, setMode]       = useState<Mode>("recorded");
  const [lines, setLines]     = useState<TerminalLine[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult]   = useState<RecordedResult | SimResult | null>(null);
  const [tab, setTab]         = useState<Tab>("failures");

  const handleRun = (newLines: TerminalLine[]) => {
    setLines(newLines);
    setRunning(false);
    setTimeout(() => setRunning(true), 30);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ padding: "64px 0 48px", borderBottom: "1px solid #222" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.2em", color: "#999", textTransform: "uppercase", marginBottom: 20 }}>
              {config.networkName} · Seeded test pools
            </p>
            <h1 style={{
              fontFamily: "'Arial Black', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(42px, 7vw, 80px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#F5F5F5",
              marginBottom: 24,
            }}>
              Pricing skill<br />
              <span style={{ color: "#555" }}>without the</span><br />
              inventory.
            </h1>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "#888", maxWidth: 480, lineHeight: 1.6 }}>
              Watch a maker fill an order with zero inventory, settled in one transaction using Uniswap v4 flash accounting.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignSelf: "flex-end" }}>
            <Tag>Zero inventory</Tag>
            <Tag>One transaction</Tag>
            <Tag>Atomic settlement</Tag>
          </div>
        </div>
      </section>

      {/* ── WORKSPACE ────────────────────────────────────────────── */}
      <section style={{ paddingTop: 40, paddingBottom: 40, display: "grid", gridTemplateColumns: "350px 1fr", gap: 1, borderBottom: "1px solid #222" }}>
        <div style={{ borderRight: "1px solid #222" }}>
          <OrderPanel mode={mode} onModeChange={setMode} onRun={handleRun} onResult={setResult} />
        </div>
        <div style={{ paddingLeft: 1 }}>
          <Terminal lines={lines} running={running} onDone={() => setRunning(false)} />
          <ResultStrip result={result} />
        </div>
      </section>

      {/* ── TABS ─────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: 0 }}>
          {([
            ["failures",    "Failure cases"],
            ["cre",         "CRE fee update"],
            ["enforcement", "Contract enforcement"],
          ] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "14px 20px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: tab === id ? "#FFF" : "#555",
                background: "transparent",
                border: "none",
                borderBottom: tab === id ? "2px solid #FFF" : "2px solid transparent",
                cursor: "pointer",
                transition: "color 0.1s",
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ background: "#111", border: "1px solid #222", borderTop: "none", padding: 32 }}>
          {tab === "failures"    && <FailureCases />}
          {tab === "cre"         && <CRETab />}
          {tab === "enforcement" && <EnforcementChecklist />}
        </div>
      </section>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'Courier New', monospace",
      fontSize: 10,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#777",
      border: "1px solid #333",
      padding: "4px 10px",
      display: "inline-block",
    }}>
      {children}
    </span>
  );
}
