"use client";
import { useState } from "react";
import GlassPanel from "./GlassPanel";
import HashDisplay from "./HashDisplay";
import runData from "@/data/run.json";

export default function CRETab() {
  const cre = runData.cre;
  const [requoted, setRequoted] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Before / After */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassPanel className="p-4 flex flex-col gap-2">
          <p className="text-xs text-muted-2 uppercase tracking-wider">Before CRE update</p>
          <p className="font-mono text-2xl font-semibold" style={{ color: "var(--muted-2)" }}>{cre.feeBeforeBps / 100} bps</p>
          <p className="text-xs text-muted-2">Policy version {cre.policyVersion - 1}</p>
        </GlassPanel>
        <GlassPanel accentBorder className="p-4 flex flex-col gap-2">
          <p className="text-xs text-muted-2 uppercase tracking-wider">After CRE update</p>
          <p className="font-mono text-2xl font-semibold text-accent">{cre.feeAfterBps / 100} bps</p>
          <p className="text-xs text-muted-2">Policy version {cre.policyVersion}</p>
        </GlassPanel>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-2">CRE report tx:</span>
        <HashDisplay hash={cre.reportTx} kind="tx" />
      </div>

      <p className="text-sm text-muted-2">
        A Chainlink CRE workflow pushed a signed policy report on-chain.{" "}
        The <span className="text-accent">CapitallessHook</span> read the new fee from{" "}
        <span className="text-accent">StrategyPolicy</span> and applied it to the next{" "}
        <code className="font-mono text-xs">beforeSwap</code>.{" "}
        Makers must re-sign orders with <code className="font-mono text-xs">policyVersion = {cre.policyVersion}</code>.
      </p>

      <button
        onClick={() => setRequoted(true)}
        className="self-start px-4 py-2 rounded text-sm font-medium transition-colors hover:opacity-90"
        style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}
      >
        Re-quote with new fee
      </button>

      {requoted && (
        <GlassPanel className="p-4 flex flex-col gap-2">
          <p className="text-xs text-muted-2 uppercase tracking-wider">New quote (Recorded)</p>
          <p className="font-mono text-lg text-warn">
            {(parseInt(cre.requoteQuoteUsdc) / 1e6).toFixed(6)} USDC
          </p>
          <p className="text-xs text-muted-2">
            Fee rose from {cre.feeBeforeBps / 100} → {cre.feeAfterBps / 100} bps.
            Route cost increased, maker quote is higher.
          </p>
        </GlassPanel>
      )}
    </div>
  );
}
