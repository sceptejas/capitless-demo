"use client";
import { useState } from "react";
import HashDisplay from "./HashDisplay";
import runData from "@/data/run.json";

const cre = runData.cre;

export default function CRETab() {
  const [requoted, setRequoted] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1A1A1A" }}>
        <div style={{ padding: 24, background: "#111" }}>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#999", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Before CRE update</p>
          <p style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 36, fontWeight: 900, color: "#999", lineHeight: 1, marginBottom: 8 }}>{cre.feeBeforeBps / 100}<span style={{ fontSize: 16 }}> bps</span></p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#777" }}>policyVersion {cre.policyVersion - 1}</p>
        </div>
        <div style={{ padding: 24, background: "#111", borderLeft: "2px solid #FFF" }}>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#999", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>After CRE update</p>
          <p style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 36, fontWeight: 900, color: "#FFF", lineHeight: 1, marginBottom: 8 }}>{cre.feeAfterBps / 100}<span style={{ fontSize: 16 }}> bps</span></p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#888" }}>policyVersion {cre.policyVersion}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#999" }}>CRE report tx:</span>
        <HashDisplay hash={cre.reportTx} kind="tx" />
      </div>

      <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#888", lineHeight: 1.7, maxWidth: 560 }}>
        A Chainlink CRE workflow pushed a signed policy report on-chain.
        The CapitallessHook read the new fee from StrategyPolicy and applied
        it on the next beforeSwap. Makers must re-sign with policyVersion = {cre.policyVersion}.
      </p>

      <button onClick={() => setRequoted(true)}
        style={{ alignSelf: "flex-start", fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", background: "transparent", color: "#FFF", border: "1px solid #FFF", cursor: "pointer", transition: "all 0.1s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FFF"; (e.currentTarget as HTMLElement).style.color = "#000"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#FFF"; }}
      >
        Re-quote with new fee →
      </button>

      {requoted && (
        <div style={{ padding: 20, background: "#111", border: "1px solid #333" }}>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#999", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>New quote (recorded)</p>
          <p style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 28, fontWeight: 900, color: "#F59E0B" }}>
            {(parseInt(cre.requoteQuoteUsdc) / 1e6).toFixed(6)} USDC
          </p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#999", marginTop: 8 }}>
            Fee {cre.feeBeforeBps/100} bps → {cre.feeAfterBps/100} bps. Route cost increased.
          </p>
        </div>
      )}
    </div>
  );
}
