import runData from "@/data/run.json";

export default function PlaceholderWarning() {
  const hasPlaceholder =
    runData.txHash.includes("PLACEHOLDER") ||
    runData.cre.reportTx.includes("PLACEHOLDER");

  if (!hasPlaceholder) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded text-sm font-mono"
      style={{ background: "var(--warn)", color: "#0B1220", boxShadow: "var(--shadow)" }}
    >
      <span>⚠</span>
      <span>Dev: placeholder values in run.json — fill before submitting.</span>
    </div>
  );
}
