export const metadata = { title: "How it works — CAPITLESS" };

const steps = [
  { n: "01", title: "Maker signs a quote", body: "Off-chain, the maker's engine reads pool state, computes route cost, adds a margin, and produces a signed EIP-712 order: exact WETH out, exact USDC in, expiry, nonce, adapter, route hash." },
  { n: "02", title: "One transaction fills it", body: "Taker submits. RFQExecutor validates — sig, expiry, nonce, approved tokens, policy version — then sends USDC to the adapter and calls PoolManager.unlock(). Inside the unlock session, exact-output swaps pull WETH from LP liquidity to the taker. Net USDC debt is settled to the pools. Spread goes to the maker." },
  { n: "03", title: "Settled or fully reverted", body: "Uniswap v4 nets everything at the end of one transaction. Deferred settlement, not a loan. Every currency delta must be zero. If any check fails — bad sig, stale policy, shallow pool, insufficient proceeds — the entire transaction reverts. Nothing is partially applied." },
];

const proves = [
  "Atomic zero-inventory settlement in a single transaction",
  "Bounded and pluggable pricing engines (any adapter that passes the delta check)",
  "A CRE-driven fee change on a live Uniswap v4 hook",
  "Nonce replay protection and signer revocation",
  "policyVersion binding: stale quotes revert on-chain",
];

const doesNotProve = [
  "A durable market edge — the margin is a parameter, not a moat",
  "Organic liquidity — pools are seeded with test tokens",
  "Order flow — no matching engine or public RFQ API yet",
  "Margins that survive competition",
];

const M = { fontFamily: "'Courier New', monospace" } as const;
const B = { fontFamily: "'Arial Black', sans-serif", fontWeight: 900 } as const;

export default function HowItWorksPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

      {/* Header */}
      <section style={{ padding: "64px 0 48px", borderBottom: "1px solid #222" }}>
        <p style={{ ...M, fontSize: 11, letterSpacing: "0.2em", color: "#999", textTransform: "uppercase", marginBottom: 16 }}>Documentation</p>
        <h1 style={{ ...B, fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#F5F5F5" }}>
          How it<br /><span style={{ color: "#555" }}>works.</span>
        </h1>
      </section>

      {/* Steps */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1A1A1A", margin: "0 0 1px 0" }}>
        {steps.map(s => (
          <div key={s.n} style={{ background: "#111", padding: "32px 28px", borderBottom: "1px solid #1A1A1A" }}>
            <p style={{ ...M, fontSize: 11, color: "#555", letterSpacing: "0.1em", marginBottom: 20 }}>{s.n}</p>
            <h2 style={{ ...B, fontSize: 16, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#FFF", marginBottom: 16, lineHeight: 1.1 }}>{s.title}</h2>
            <p style={{ ...M, fontSize: 12, color: "#666", lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
      </section>

      {/* CRE flow */}
      <section style={{ background: "#111", border: "1px solid #222", padding: "32px 28px", marginTop: 1 }}>
        <h2 style={{ ...B, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "#FFF", marginBottom: 24 }}>CRE Fee Update Flow</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {["Chainlink CRE workflow", "Signed report", "KeystoneForwarder", "CREPolicyConsumer", "StrategyPolicy.fee updated", "Hook applies on next swap"].map((step, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ ...M, fontSize: 11, color: "#888", padding: "6px 12px", border: "1px solid #333", display: "inline-block" }}>{step}</span>
              {i < arr.length - 1 && <span style={{ color: "#555", fontSize: 14 }}>→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Explainer */}
      <section style={{ background: "#0D0D0D", border: "1px solid #222", borderTop: "none", padding: "32px 28px" }}>
        <h2 style={{ ...B, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "#FFF", marginBottom: 20 }}>Plain language</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
          <p style={{ ...M, fontSize: 12, color: "#888", lineHeight: 1.8 }}>
            A maker is like a currency exchange booth. Normally it needs to stock both currencies. CAPITLESS removes that: the maker only needs to <em style={{ color: "#AAA" }}>know the price</em>. Swap happens through Uniswap v4 pools — LPs supply the WETH, the taker's USDC pays, maker earns the difference.
          </p>
          <p style={{ ...M, fontSize: 12, color: "#888", lineHeight: 1.8 }}>
            Settlement is deferred netting inside a single transaction. Uniswap v4 keeps a running balance sheet. At the end, every line must be zero. <em style={{ color: "#AAA" }}>Not a flash loan — nothing is borrowed.</em> Tokens move directly: USDC from taker to pools, WETH from pools to taker, spread to maker.
          </p>
        </div>
      </section>

      {/* Limits */}
      <section id="limits" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <h2 style={{ ...B, fontSize: "clamp(24px, 4vw, 40px)", textTransform: "uppercase", letterSpacing: "-0.03em", color: "#F5F5F5", marginBottom: 32, lineHeight: 1 }}>
          What this proves.<br /><span style={{ color: "#555" }}>What it doesn&apos;t.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1A1A1A" }}>
          <div style={{ background: "#111", padding: "28px 24px", borderLeft: "2px solid #FFF" }}>
            <h3 style={{ ...M, fontSize: 10, color: "#FFF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Proves</h3>
            {proves.map(p => (
              <div key={p} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <span style={{ ...M, fontSize: 11, color: "#22C55E", flexShrink: 0, marginTop: 1 }}>✓</span>
                <p style={{ ...M, fontSize: 12, color: "#888", lineHeight: 1.6 }}>{p}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#111", padding: "28px 24px" }}>
            <h3 style={{ ...M, fontSize: 10, color: "#999", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Doesn&apos;t prove</h3>
            {doesNotProve.map(p => (
              <div key={p} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <span style={{ ...M, fontSize: 11, color: "#777", flexShrink: 0, marginTop: 1 }}>—</span>
                <p style={{ ...M, fontSize: 12, color: "#999", lineHeight: 1.6 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
