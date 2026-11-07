"use client";
import { useState } from "react";
import runData from "@/data/run.json";
import Terminal, { type TerminalLine } from "./Terminal";

export default function FailureCases() {
  const [active, setActive]   = useState<string | null>(null);
  const [lines, setLines]     = useState<TerminalLine[]>([]);
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {runData.failures.map(f => (
          <button key={f.name} onClick={() => replay(f.name)}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11, letterSpacing: "0.1em", padding: "8px 16px",
              background: active === f.name ? "#EF4444" : "transparent",
              color: active === f.name ? "#FFF" : "#555",
              border: `1px solid ${active === f.name ? "#EF4444" : "#333"}`,
              cursor: "pointer", transition: "all 0.1s",
            }}>
            {f.name}
          </button>
        ))}
      </div>
      {active && <Terminal lines={lines} running={running} onDone={() => setRunning(false)} />}
    </div>
  );
}
