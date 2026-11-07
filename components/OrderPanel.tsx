"use client";
import { useState } from "react";
import { config } from "@/lib/config";
import { simulate } from "@/lib/simulate";
import runData from "@/data/run.json";

export type Mode = "recorded" | "playground";

export interface RecordedResult {
  kind: "recorded";
  quoteUsdc: string;
  routeCostUsdc: string;
  makerProceedsUsdc: string;
  takerReceivedWeth: string;
  makerWethBefore: string;
  makerWethAfter: string;
  txHash: string;
  directCostUsdc: string;
}

export interface SimResult {
  kind: "playground";
  quoteUsdc: number;
  routeCostUsdc: number;
  makerProceedsUsdc: number;
  takerReceivedWeth: number;
  directCostUsdc: number;
  savingUsdc: number;
  noQuoteReason?: string;
}

interface Props {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onRun: (lines: import("./Terminal").TerminalLine[]) => void;
  onResult: (r: RecordedResult | SimResult) => void;
}

const PRESETS = config.wethPresets as readonly number[];

function fmtUsdc(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v) || v === 0) return "—";
  return (v / 1e6).toFixed(6);
}

const S: Record<string, React.CSSProperties> = {
  label: { fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#999", display: "block", marginBottom: 8 },
  val:   { fontFamily: "'Courier New', monospace", fontSize: 13, color: "#F5F5F5" },
  muted: { fontFamily: "'Courier New', monospace", fontSize: 11, color: "#999" },
};

export default function OrderPanel({ mode, onModeChange, onRun, onResult }: Props) {
  const [weth, setWeth] = useState<number>(config.wethAmountDefault);

  const handleRun = () => {
    if (mode === "recorded") {
      onResult({ kind: "recorded", ...runData });
      onRun(runData.steps as import("./Terminal").TerminalLine[]);
    } else {
      const sim = simulate(weth);
      onResult({ kind: "playground", takerReceivedWeth: weth, ...sim });
      if (!sim.ok) {
        onRun([{ kind: "warn", label: "quote", text: sim.noQuoteReason ?? "No quote" }]);
        return;
      }
      onRun([
        { kind: "info", label: "order",  text: `buy ${weth} WETH — computed from pool snapshot` },
        { kind: "info", label: "unlock", text: "PoolManager.unlock()" },
        ...sim.legs.map((l, i) => ({ kind: "info" as const, label: `swap ${String.fromCharCode(65+i)}`, text: `${l.pool} → ${l.wethOut.toFixed(6)} WETH` })),
        { kind: "ok",   label: "take",   text: `${weth} WETH → taker` },
        { kind: "ok",   label: "settle", text: `USDC to pools: ${(sim.routeCostUsdc/1e6).toFixed(6)}` },
        { kind: "ok",   label: "pay",    text: `maker proceeds: ${(sim.makerProceedsUsdc/1e6).toFixed(6)} USDC` },
        { kind: "ok",   label: "done",   text: "computed — not broadcast to chain" },
      ]);
    }
  };

  const sim = mode === "playground" ? simulate(weth) : null;
  const recQuote  = parseFloat(runData.quoteUsdc) || 0;
  const recDirect = parseFloat(runData.directCostUsdc) || 0;

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Mode toggle */}
      <div style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: 28 }}>
        {(["recorded", "playground"] as Mode[]).map(m => (
          <button key={m} onClick={() => onModeChange(m)}
            style={{
              flex: 1, padding: "10px 0", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: mode === m ? "#FFF" : "#444",
              background: "transparent", border: "none",
              borderBottom: mode === m ? "2px solid #FFF" : "2px solid transparent",
              cursor: "pointer", marginBottom: -1, transition: "all 0.1s",
            }}>
            {m === "recorded" ? "Recorded run" : "Playground"}
          </button>
        ))}
      </div>

      {mode === "playground" && (
        <p style={{ ...S.muted, marginBottom: 20, color: "#F59E0B" }}>
          ⚠ Computed from pool snapshot. Not a live quote.
        </p>
      )}

      {/* Direction */}
      <div style={{ marginBottom: 24 }}>
        <span style={S.label}>Direction</span>
        <div style={{ padding: "10px 14px", background: "#111", border: "1px solid #222" }}>
          <span style={S.val}>Buy WETH with USDC</span>
        </div>
      </div>

      {/* Size */}
      <div style={{ marginBottom: 24 }}>
        <span style={S.label}>Size</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <input type="range"
            min={config.wethAmountMin} max={config.wethAmountMax} step={0.0001}
            value={weth} onChange={e => setWeth(parseFloat(e.target.value))}
            disabled={mode === "recorded"}
            style={{ flex: 1, accentColor: "#FFF", cursor: mode === "recorded" ? "not-allowed" : "pointer" }}
          />
          <span style={{ ...S.val, width: 90, textAlign: "right" }}>{weth.toFixed(4)} WETH</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {PRESETS.map(p => (
            <button key={p} onClick={() => setWeth(p)} disabled={mode === "recorded"}
              style={{
                fontFamily: "'Courier New', monospace", fontSize: 10,
                letterSpacing: "0.1em", padding: "4px 10px",
                background: weth === p ? "#FFF" : "transparent",
                color: weth === p ? "#000" : "#444",
                border: "1px solid #333", cursor: "pointer",
                transition: "all 0.1s",
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Quote comparison */}
      <div style={{ background: "#111", border: "1px solid #222", padding: 16, marginBottom: 24 }}>
        <span style={{ ...S.label, marginBottom: 14 }}>Quote comparison</span>

        {mode === "playground" && sim && !sim.ok ? (
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#F59E0B", lineHeight: 1.5 }}>{sim.noQuoteReason}</p>
        ) : (
          <>
            <Row label="Direct route" value={mode === "recorded" ? (recDirect ? fmtUsdc(recDirect) + " USDC" : "—") : (sim?.directCostUsdc ? fmtUsdc(sim.directCostUsdc) + " USDC" : "—")} dim />
            <Row label="CAPITLESS quote" value={mode === "recorded" ? fmtUsdc(recQuote) + " USDC" : (sim?.ok ? fmtUsdc(sim.quoteUsdc) + " USDC" : "—")} highlight />
            <Row label="Maker proceeds" value={mode === "recorded" ? fmtUsdc(runData.makerProceedsUsdc) + " USDC" : (sim?.ok ? fmtUsdc(sim.makerProceedsUsdc) + " USDC" : "—")} ok />
          </>
        )}
      </div>

      {/* Run button */}
      <button onClick={handleRun}
        style={{
          width: "100%", padding: "16px", background: "#FFF", color: "#000",
          fontFamily: "'Arial Black', sans-serif", fontWeight: 900,
          fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase",
          border: "none", cursor: "pointer", transition: "opacity 0.1s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Run order →
      </button>
    </div>
  );
}

function Row({ label, value, dim, highlight, ok }: { label: string; value: string; dim?: boolean; highlight?: boolean; ok?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1A1A1A" }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#999", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: ok ? "#22C55E" : highlight ? "#FFF" : "#555", fontWeight: highlight ? 700 : 400 }}>{value}</span>
    </div>
  );
}
