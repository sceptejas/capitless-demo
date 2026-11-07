const items = [
  { label: "Max order size",            desc: "Enforced by StrategyPolicy.maxOrderSizeWeth — orders above this revert." },
  { label: "Order expiry",              desc: "block.timestamp > expiry → OrderExpired. No grace period." },
  { label: "Minimum maker proceeds",    desc: "quoteAmountIn − routeCost must exceed minMakerProceeds or it reverts." },
  { label: "Approved tokens and routes",desc: "tokenIn, tokenOut, adapter, and every poolKey hash must be pre-approved per strategy." },
  { label: "Nonce replay protection",   desc: "Bitmap model: each nonce bit flips once. Replaying the same nonce reverts." },
  { label: "Signer revocation",         desc: "Maker can revoke a signer at any time. Revoked signers are rejected immediately." },
  { label: "Policy version staleness",  desc: "Order must carry the current policyVersion. Stale orders revert with StalePolicyVersion." },
  { label: "Zero executor balance",     desc: "Assert after every execution: executor holds zero USDC and zero WETH." },
];

export default function EnforcementChecklist() {
  return (
    <ul className="flex flex-col gap-3" role="list">
      {items.map(item => (
        <li key={item.label} className="flex gap-3">
          <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
            ✓
          </span>
          <div>
            <span className="text-sm font-medium text-[var(--text)]">{item.label}</span>
            <p className="text-xs text-muted-2 mt-0.5">{item.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
