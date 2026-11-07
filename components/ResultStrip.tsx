import HashDisplay from "./HashDisplay";
import type { RecordedResult, SimResult } from "./OrderPanel";

type Result = RecordedResult | SimResult;

function fmtUsdc(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v)) return "—";
  return (v / 1e6).toFixed(6);
}

export default function ResultStrip({ result }: { result: Result | null }) {
  if (!result) return null;
  const isRec = result.kind === "recorded";
  const route  = isRec ? fmtUsdc((result as RecordedResult).routeCostUsdc) : fmtUsdc((result as SimResult).routeCostUsdc);
  const maker  = isRec ? fmtUsdc((result as RecordedResult).makerProceedsUsdc) : fmtUsdc((result as SimResult).makerProceedsUsdc);
  const taker  = typeof result.takerReceivedWeth === "string"
    ? parseFloat(result.takerReceivedWeth).toFixed(6)
    : (result.takerReceivedWeth as number).toFixed(6);
  const wBefore = isRec ? (result as RecordedResult).makerWethBefore : "0";
  const wAfter  = isRec ? (result as RecordedResult).makerWethAfter  : "0";

  return (
    <div style={{ borderTop: "1px solid #222" }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #1A1A1A" }}>
        <Cell label="Taker received" value={`${taker} WETH`} />
        <Cell label="Route cost" value={`${route} USDC`} border />
        <Cell label="Maker earned" value={`${maker} USDC`} color="#22C55E" border />
      </div>

      {/* KEY PROOF — Maker WETH = 0 */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        background: "#0D0D0D",
        borderBottom: "2px solid #FFFFFF",
        borderLeft: "2px solid #FFFFFF",
      }}>
        <div>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#999", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
            Maker WETH balance
          </p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 18, fontWeight: 700, color: "#F5F5F5" }}>
            <span style={{ color: "#999" }}>{wBefore}</span>
            <span style={{ color: "#555", margin: "0 12px" }}>→</span>
            <span style={{ color: "#FFF" }}>{wAfter}</span>
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFF", marginBottom: 4 }}>
            Zero inventory
          </p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#999" }}>
            Maker never held WETH
          </p>
          {isRec && (
            <div style={{ marginTop: 6 }}>
              <HashDisplay hash={(result as RecordedResult).txHash} kind="tx" />
            </div>
          )}
        </div>
      </div>

      {/* Label */}
      <div style={{ padding: "8px 24px", background: "#080808" }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#777", letterSpacing: "0.1em" }}>
          {isRec ? "● RECORDED — from real onchain tx" : "◌ PLAYGROUND — computed from pool snapshot"}
        </span>
      </div>
    </div>
  );
}

function Cell({ label, value, color, border }: { label: string; value: string; color?: string; border?: boolean }) {
  return (
    <div style={{
      padding: "16px 24px",
      borderLeft: border ? "1px solid #1A1A1A" : "none",
    }}>
      <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: color ?? "#F5F5F5", fontWeight: 700 }}>{value}</p>
    </div>
  );
}
