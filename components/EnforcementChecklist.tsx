const items = [
  { label: "Max order size",             desc: "Enforced by StrategyPolicy.maxOrderSizeWeth — orders above this revert." },
  { label: "Order expiry",               desc: "block.timestamp > expiry → OrderExpired. No grace period." },
  { label: "Minimum maker proceeds",     desc: "quoteAmountIn − routeCost must exceed minMakerProceeds or it reverts." },
  { label: "Approved tokens + routes",   desc: "tokenIn, tokenOut, adapter, and every poolKey hash must be pre-approved." },
  { label: "Nonce replay protection",    desc: "Bitmap model: each nonce bit flips once. Replaying the same nonce reverts." },
  { label: "Signer revocation",          desc: "Maker can revoke a signer at any time. Revoked signers are rejected immediately." },
  { label: "Policy version staleness",   desc: "Order must carry the current policyVersion. Stale orders revert." },
  { label: "Zero executor balance",      desc: "Assert after every execution: executor holds zero USDC and zero WETH." },
];

export default function EnforcementChecklist() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1A1A1A" }}>
      {items.map((item, i) => (
        <div key={item.label} style={{ padding: "20px 24px", background: "#111", borderBottom: "1px solid #1A1A1A" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#22C55E", marginTop: 2, flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 12, fontWeight: 900, color: "#F5F5F5", letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 6 }}>
                {item.label}
              </p>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#999", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
