"use client";
import { useState } from "react";
import GlassPanel from "./GlassPanel";
import { config } from "@/lib/config";
import { simulate } from "@/lib/simulate";
import runData from "@/data/run.json";

export type Mode = "recorded" | "playground";

interface Props {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onRun: (lines: import("./Terminal").TerminalLine[]) => void;
  onResult: (r: RecordedResult | SimResult) => void;
}

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
  kind: "simulated";
  quoteUsdc: number;
  routeCostUsdc: number;
  makerProceedsUsdc: number;
  takerReceivedWeth: number;
  directCostUsdc: number;
  savingUsdc: number;
  noQuoteReason?: string;
}

const PRESETS = config.wethPresets as readonly number[];

function fmtUsdc(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v)) return "—";
  return (v / 1e6).toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function bar(a: number, b: number) {
  if (!a || !b) return 50;
  return Math.round((a / (a + b)) * 100);
}

export default function OrderPanel({ mode, onModeChange, onRun, onResult }: Props) {
  const [weth, setWeth] = useState<number>(config.wethAmountDefault);

  const handleRun = () => {
    if (mode === "recorded") {
      onResult({ kind: "recorded", ...runData });
      onRun(runData.steps as import("./Terminal").TerminalLine[]);
    } else {
      const sim = simulate(weth);
      const simResult: SimResult = { kind: "simulated", takerReceivedWeth: weth, ...sim };
      onResult(simResult);
      if (!sim.ok) {
        onRun([{ kind: "warn", label: "quote", text: sim.noQuoteReason ?? "No quote" }]);
        return;
      }
      const lines: import("./Terminal").TerminalLine[] = [
        { kind: "info", label: "order",  text: `buy ${weth} WETH  simulated from pool snapshot` },
        { kind: "info", label: "unlock", text: "PoolManager.unlock() — flash accounting session" },
        ...sim.legs.map((l, i) => ({
          kind: "info" as const,
          label: `swap ${String.fromCharCode(65 + i)}`,
          text: `${l.pool}  → ${l.wethOut.toFixed(6)} WETH  cost ${(l.usdcIn).toFixed(2)} USDC`,
        })),
        { kind: "ok",   label: "take",   text: `${weth} WETH → taker  (Maker never touched WETH)` },
        { kind: "ok",   label: "settle", text: `USDC owed to pools: ${(sim.routeCostUsdc / 1e6).toFixed(6)}` },
        { kind: "ok",   label: "pay",    text: `maker proceeds: ${(sim.makerProceedsUsdc / 1e6).toFixed(6)} USDC` },
        { kind: "ok",   label: "done",   text: "simulated — not broadcast" },
      ];
      onRun(lines);
    }
  };

  const sim = mode === "playground" ? simulate(weth) : null;
  const recDirect = parseFloat(runData.directCostUsdc) || 0;
  const recQuote  = parseFloat(runData.quoteUsdc) || 0;

  return (
    <GlassPanel className="flex flex-col gap-5 p-5">
      {/* Segmented control */}
      <div className="flex rounded-sm overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {(["recorded", "playground"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${
              mode === m
                ? "text-[var(--text)]"
                : "text-muted-2 hover:text-[var(--text)]"
            }`}
            style={{ background: mode === m ? "var(--accent-dim)" : "transparent" }}
          >
            {m === "recorded" ? "Recorded run" : "Playground"}
          </button>
        ))}
      </div>

      {/* Playground disclaimer */}
      {mode === "playground" && (
        <p className="text-xs text-warn px-1">
          Simulated from a snapshot of the seeded pools. Not a live market.
        </p>
      )}

      {/* Size */}
      <div className="flex flex-col gap-2">
        <label htmlFor="weth-slider" className="text-xs text-muted-2 uppercase tracking-wider">
          Buy WETH with USDC
        </label>
        <div className="flex items-center gap-3">
          <input
            id="weth-slider"
            type="range"
            min={config.wethAmountMin}
            max={config.wethAmountMax}
            step={0.0001}
            value={weth}
            onChange={e => setWeth(parseFloat(e.target.value))}
            className="flex-1 accent-[var(--accent)]"
            disabled={mode === "recorded"}
          />
          <span className="font-mono text-sm text-[var(--text)] w-20 text-right">{weth.toFixed(4)} WETH</span>
        </div>
        {/* Presets */}
        <div className="flex gap-2">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => setWeth(p)}
              disabled={mode === "recorded"}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                weth === p ? "text-accent bg-accent-dim" : "text-muted-2 hover:text-[var(--text)]"
              }`}
              style={{ border: "1px solid var(--border)" }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Quote comparison */}
      <div className="rounded-sm p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
        <p className="text-xs text-muted-2 uppercase tracking-wider">Quote comparison</p>

        {mode === "playground" && sim && !sim.ok ? (
          <p className="text-sm text-warn">{sim.noQuoteReason}</p>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-2">Direct route</span>
              <span className="font-mono">
                {mode === "recorded"
                  ? (recDirect ? fmtUsdc(runData.directCostUsdc) + " USDC" : "—")
                  : (sim?.directCostUsdc ? fmtUsdc(sim.directCostUsdc) + " USDC" : "—")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-accent font-medium">CAPITLESS quote</span>
              <span className="font-mono text-accent">
                {mode === "recorded"
                  ? fmtUsdc(runData.quoteUsdc) + " USDC"
                  : (sim?.ok ? fmtUsdc(sim.quoteUsdc) + " USDC" : "—")}
              </span>
            </div>

            {/* Bar */}
            {(mode === "recorded" ? recDirect && recQuote : sim?.ok) && (
              <div className="flex gap-1 items-center h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${bar(
                      mode === "recorded" ? recQuote : sim!.quoteUsdc,
                      mode === "recorded" ? recDirect : sim!.directCostUsdc
                    )}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>
            )}

            <div className="flex justify-between text-xs text-muted-2">
              <span>Maker proceeds</span>
              <span className="font-mono text-ok">
                {mode === "recorded"
                  ? fmtUsdc(runData.makerProceedsUsdc) + " USDC"
                  : (sim?.ok ? fmtUsdc(sim.makerProceedsUsdc) + " USDC" : "—")}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Run button */}
      <button
        onClick={handleRun}
        className="w-full py-3 rounded font-semibold text-sm transition-all hover:opacity-90 active:scale-[.98]"
        style={{ background: "var(--accent)", color: "#0B1220" }}
      >
        Run order
      </button>

      {/* Badge */}
      <p className="text-center text-xs text-muted-2 italic">
        Seeded test pools. Proves the mechanism, not the market.
      </p>
    </GlassPanel>
  );
}
