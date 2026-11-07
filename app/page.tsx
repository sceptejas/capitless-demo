"use client";
import { useState } from "react";
import OrderPanel, { type Mode, type RecordedResult, type SimResult } from "@/components/OrderPanel";
import Terminal, { type TerminalLine } from "@/components/Terminal";
import ResultStrip from "@/components/ResultStrip";
import FailureCases from "@/components/FailureCases";
import CRETab from "@/components/CRETab";
import EnforcementChecklist from "@/components/EnforcementChecklist";
import GlassPanel from "@/components/GlassPanel";
import { config } from "@/lib/config";

type Tab = "failures" | "cre" | "enforcement";

export default function DemoPage() {
  const [mode, setMode]     = useState<Mode>("recorded");
  const [lines, setLines]   = useState<TerminalLine[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RecordedResult | SimResult | null>(null);
  const [tab, setTab]       = useState<Tab>("failures");

  const handleRun = (newLines: TerminalLine[]) => {
    setLines(newLines);
    setRunning(false);
    setTimeout(() => setRunning(true), 30);
  };

  return (
    <div className="mx-auto px-4 py-10" style={{ maxWidth: 1100 }}>
      {/* Hero */}
      <section className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Pricing skill without the inventory.
        </h1>
        <p className="text-base text-muted-2 max-w-xl">
          Watch a maker fill an order with zero inventory, settled in one transaction.
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge>{config.networkName}</Badge>
          <Badge accent>Seeded test pools</Badge>
          <Badge warn>Seeded test pools. Proves the mechanism, not the market.</Badge>
        </div>
      </section>

      {/* Workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-5 mb-12" aria-label="Order workspace">
        <OrderPanel
          mode={mode}
          onModeChange={setMode}
          onRun={handleRun}
          onResult={setResult}
        />

        <div className="flex flex-col gap-0">
          <Terminal
            lines={lines}
            running={running}
            onDone={() => setRunning(false)}
          />
          <ResultStrip result={result} />
        </div>
      </section>

      {/* Tabs */}
      <section aria-label="Additional details">
        <div className="flex gap-1 mb-4 flex-wrap">
          {([
            ["failures",    "Failure cases"],
            ["cre",         "CRE fee update"],
            ["enforcement", "What the contract enforces"],
          ] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                tab === id ? "text-accent bg-accent-dim" : "text-muted-2 hover:text-[var(--text)]"
              }`}
              style={{ border: "1px solid var(--border)" }}
            >
              {label}
            </button>
          ))}
        </div>

        <GlassPanel className="p-6">
          {tab === "failures"    && <FailureCases />}
          {tab === "cre"         && <CRETab />}
          {tab === "enforcement" && <EnforcementChecklist />}
        </GlassPanel>
      </section>
    </div>
  );
}

function Badge({ children, accent, warn }: { children: React.ReactNode; accent?: boolean; warn?: boolean }) {
  const color = accent ? "var(--accent)" : warn ? "var(--warn)" : "var(--muted-2)";
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono"
      style={{ background: color + "18", color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  );
}
