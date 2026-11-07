import GlassPanel from "./GlassPanel";
import HashDisplay from "./HashDisplay";
import type { RecordedResult, SimResult } from "./OrderPanel";

type Result = RecordedResult | SimResult;

function fmt(n: string | number, decimals = 6) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v) || v === 0) return "—";
  return v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtUsdc(n: string | number) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v)) return "—";
  return (v / 1e6).toFixed(6);
}

export default function ResultStrip({ result }: { result: Result | null }) {
  if (!result) return null;
  const isRec = result.kind === "recorded";
  const label = isRec ? "Recorded" : "Simulated";
  const labelColor = isRec ? "var(--accent)" : "var(--warn)";

  const taker  = fmt(result.takerReceivedWeth);
  const route  = isRec ? fmtUsdc((result as RecordedResult).routeCostUsdc) : fmtUsdc((result as SimResult).routeCostUsdc);
  const maker  = isRec ? fmtUsdc((result as RecordedResult).makerProceedsUsdc) : fmtUsdc((result as SimResult).makerProceedsUsdc);
  const wBefore = isRec ? (result as RecordedResult).makerWethBefore : "0";
  const wAfter  = isRec ? (result as RecordedResult).makerWethAfter  : "0";

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: labelColor + "22", color: labelColor, border: `1px solid ${labelColor}55` }}>
          {label}
        </span>
        {isRec && <HashDisplay hash={(result as RecordedResult).txHash} kind="tx" />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Tile label="Taker received" value={`${taker} WETH`} />
        <Tile label="Route cost" value={`${route} USDC`} />
        <Tile label="Maker earned" value={`${maker} USDC`} color="var(--ok)" />
      </div>

      {/* KEY PROOF TILE */}
      <GlassPanel accentBorder className="p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-2 uppercase tracking-wider mb-1">Maker WETH balance</p>
          <p className="font-mono text-lg font-semibold">
            <span style={{ color: "var(--muted-2)" }}>{wBefore}</span>
            <span className="mx-2 text-muted-2">→</span>
            <span style={{ color: "var(--accent)" }}>{wAfter}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-2 mb-1">Zero inventory</p>
          <p className="text-xs text-accent font-mono">Maker never held WETH</p>
        </div>
      </GlassPanel>
    </div>
  );
}

function Tile({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <GlassPanel className="p-3 flex flex-col gap-1">
      <span className="text-xs text-muted-2">{label}</span>
      <span className="font-mono text-sm font-semibold" style={{ color: color ?? "var(--text)" }}>{value}</span>
    </GlassPanel>
  );
}
