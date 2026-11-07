"use client";
import { useState } from "react";
import runData from "@/data/run.json";
import Terminal, { type TerminalLine } from "./Terminal";

export default function FailureCases() {
  const [active, setActive] = useState<string | null>(null);
  const [lines, setLines]   = useState<TerminalLine[]>([]);
  const [running, setRunning] = useState(false);

  const replay = (name: string) => {
    const f = runData.failures.find(x => x.name === name);
    if (!f) return;
    setActive(name);
    setLines(f.steps as TerminalLine[]);
    setRunning(false);
    setTimeout(() => setRunning(true), 50);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {runData.failures.map(f => (
          <button
            key={f.name}
            onClick={() => replay(f.name)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              active === f.name ? "text-danger bg-[rgba(239,68,68,0.12)]" : "text-muted-2 hover:text-[var(--text)]"
            }`}
            style={{ border: `1px solid ${active === f.name ? "var(--danger)" : "var(--border)"}` }}
          >
            {f.name}
          </button>
        ))}
      </div>
      {active && (
        <Terminal lines={lines} running={running} onDone={() => setRunning(false)} />
      )}
    </div>
  );
}
