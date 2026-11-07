"use client";
import CopyButton from "@/components/CopyButton";
import HashDisplay from "@/components/HashDisplay";
import { config } from "@/lib/config";
import runData from "@/data/run.json";
function shorten(h: string) {
  if (!h || h.length < 12) return h;
  return `${h.slice(0, 6)}…${h.slice(-4)}`;
}

const M = { fontFamily: "'Courier New', monospace" } as const;
const B = { fontFamily: "'Arial Black', sans-serif", fontWeight: 900 } as const;

export default function DeploymentsPage() {
  const contracts = Object.entries(config.contracts) as [string, string][];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <section style={{ padding: "64px 0 48px", borderBottom: "1px solid #222" }}>
        <p style={{ ...M, fontSize: 11, letterSpacing: "0.2em", color: "#999", textTransform: "uppercase", marginBottom: 16 }}>Ethereum Sepolia · Chain {config.chainId}</p>
        <h1 style={{ ...B, fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#F5F5F5" }}>
          Deploy<br /><span style={{ color: "#555" }}>ments.</span>
        </h1>
      </section>

      {/* Contracts table */}
      <section style={{ marginTop: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", ...M, fontSize: 12 }} aria-label="Deployed contracts">
          <thead>
            <tr style={{ borderBottom: "1px solid #333" }}>
              <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 10, color: "#999", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 400 }}>Contract</th>
              <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 10, color: "#999", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 400 }}>Address</th>
              <th style={{ padding: "12px 20px" }}></th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(([name, addr]) => (
              <tr key={name} style={{ borderBottom: "1px solid #1A1A1A" }}>
                <td style={{ padding: "14px 20px", color: "#888" }}>{name}</td>
                <td style={{ padding: "14px 20px" }}>
                  <a href={`${config.explorerBaseUrl}/address/${addr}`} target="_blank" rel="noopener noreferrer"
                    title={addr} style={{ color: "#FFF", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
                    {shorten(addr)}
                  </a>
                </td>
                <td style={{ padding: "14px 20px" }}><CopyButton value={addr} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Key txs */}
      <section style={{ background: "#111", border: "1px solid #222", borderTop: "none", padding: "28px 20px", marginBottom: 1 }}>
        <h2 style={{ ...B, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "#FFF", marginBottom: 20 }}>Key transactions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Demo RFQ execution", el: <HashDisplay hash={runData.txHash} kind="tx" /> },
            { label: "CRE policy report",  el: <HashDisplay hash={runData.cre.reportTx} kind="tx" /> },
          ].map(({ label, el }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 0", borderBottom: "1px solid #1A1A1A" }}>
              <span style={{ ...M, fontSize: 11, color: "#999", width: 180, flexShrink: 0 }}>{label}</span>
              {el}
            </div>
          ))}
        </div>
      </section>

      {/* Test commands */}
      <section style={{ background: "#0D0D0D", border: "1px solid #222", borderTop: "none", padding: "28px 20px", marginBottom: 1 }}>
        <h2 style={{ ...B, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "#FFF", marginBottom: 16 }}>Run tests</h2>
        {["cd capitless && forge test", "forge test -v", "forge test --match-test test_1_balancesReconcile"].map(cmd => (
          <div key={cmd} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#080808", border: "1px solid #1A1A1A", marginBottom: 6 }}>
            <span style={{ ...M, fontSize: 12, color: "#999" }}>$</span>
            <span style={{ ...M, fontSize: 12, color: "#F5F5F5", flex: 1 }}>{cmd}</span>
            <CopyButton value={cmd} />
          </div>
        ))}
      </section>

      {/* Links */}
      <section style={{ padding: "32px 0 80px", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={config.links.github} target="_blank" rel="noopener noreferrer"
          style={{ ...M, fontSize: 11, color: "#FFF", padding: "10px 20px", border: "1px solid #FFF", textDecoration: "none", letterSpacing: "0.1em", transition: "all 0.1s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FFF"; (e.currentTarget as HTMLElement).style.color = "#000"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#FFF"; }}>
          GitHub ↗
        </a>
        <a href={`${config.explorerBaseUrl}/address/${config.contracts.RFQExecutor}`} target="_blank" rel="noopener noreferrer"
          style={{ ...M, fontSize: 11, color: "#999", padding: "10px 20px", border: "1px solid #333", textDecoration: "none", letterSpacing: "0.1em", transition: "all 0.1s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#FFF"; (e.currentTarget as HTMLElement).style.borderColor = "#FFF"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.borderColor = "#333"; }}>
          RFQExecutor on Etherscan ↗
        </a>
      </section>
    </div>
  );
}
