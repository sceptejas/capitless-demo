import GlassPanel from "@/components/GlassPanel";

export const metadata = { title: "How it works — CAPITLESS" };

const steps = [
  {
    n: "01",
    title: "Maker signs a quote",
    body: "Off-chain, a maker's pricing engine reads pool state, computes a route cost, adds a margin, and produces a signed EIP-712 RFQOrder: exact WETH out, exact USDC in, expiry, nonce, adapter address, and a hash of the exact route.",
  },
  {
    n: "02",
    title: "One transaction fills it",
    body: "The taker submits the order and signature. RFQExecutor validates everything — signature, expiry, nonce, approved tokens, policy version — then transfers USDC to the adapter and calls PoolManager.unlock(). Inside the unlock session, exact-output swaps pull WETH from LP liquidity and send it directly to the taker. The net USDC debt is settled back to the pools. Unused USDC returns to the executor, which pays the maker the spread.",
  },
  {
    n: "03",
    title: "Settled or fully reverted",
    body: "Uniswap v4 can net everything at the end of one transaction. It is deferred settlement, not a loan. Every currency delta must be zero when the unlock session closes — if any check fails (bad sig, stale policy, shallow pool, insufficient proceeds) the entire transaction reverts. Nothing is partially applied.",
  },
];

const proves = [
  "Atomic zero-inventory settlement in a single transaction",
  "Bounded and pluggable pricing engines (any adapter that passes the delta check)",
  "A CRE-driven fee change on a live Uniswap v4 hook",
  "Nonce replay protection and signer revocation",
  "policyVersion binding: stale quotes revert on-chain",
];

const doesNotProve = [
  "A durable market edge — the maker's margin is a parameter, not a moat",
  "Organic liquidity — pools are seeded with test tokens",
  "Order flow — there is no matching engine or public RFQ API yet",
  "Margins that survive competition from other makers or aggregators",
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <h1 className="text-3xl font-bold mb-2">How it works</h1>
      <p className="text-muted-2 mb-10">A 15-year-old can follow this. No jargon.</p>

      {/* Three step diagram */}
      <section aria-label="Flow diagram" className="mb-14">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {steps.map((s, i) => (
            <GlassPanel key={s.n} className="flex-1 p-6 flex flex-col gap-3 relative">
              <span className="font-mono text-xs text-muted-2">{s.n}</span>
              <h2 className="text-base font-semibold">{s.title}</h2>
              <p className="text-sm text-muted-2 leading-relaxed">{s.body}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-2 text-lg" aria-hidden="true">→</div>
              )}
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* CRE side flow */}
      <section className="mb-14">
        <GlassPanel className="p-6">
          <h2 className="text-base font-semibold mb-4">CRE fee update flow</h2>
          <div className="flex flex-col sm:flex-row gap-3 items-center text-sm text-muted-2">
            {["Chainlink CRE workflow", "Signed report → KeystoneForwarder", "CREPolicyConsumer.onReport()", "StrategyPolicy.currentDynamicFee updated", "CapitallessHook reads fee on next beforeSwap"].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-3">
                <span className="px-3 py-2 rounded text-xs text-center" style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--border-accent)", minWidth: 130 }}>
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-muted-2 hidden sm:block" aria-hidden="true">→</span>}
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      {/* Plain language */}
      <section className="mb-14">
        <GlassPanel className="p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold">In plain language</h2>
          <p className="text-sm text-muted-2 leading-relaxed">
            A <strong className="text-[var(--text)]">maker</strong> is like a currency exchange booth. Normally it needs to stock both currencies (inventory). CAPITLESS removes that requirement: the maker only needs to <em>know the price</em>. When a taker arrives, the swap happens through public Uniswap v4 pools — the LPs supply the WETH, the taker's USDC pays for it, and the maker earns the difference between what the taker paid and what the pools charged.
          </p>
          <p className="text-sm text-muted-2 leading-relaxed">
            The settlement is deferred netting inside a single Ethereum transaction. Uniswap v4 keeps a running balance sheet. At the end, every line must be zero. If it is not, the whole transaction reverts. This is not a flash loan — nothing is borrowed. Tokens move directly: USDC from taker to pools, WETH from pools to taker, spread to maker.
          </p>
          <p className="text-sm text-muted-2 leading-relaxed">
            A <strong className="text-[var(--text)]">Chainlink CRE workflow</strong> runs in the background. It reads market data and pushes a signed fee update to the hook. The hook applies the new fee on the very next swap. Makers must sign new orders with the updated policy version — stale orders are rejected on-chain.
          </p>
        </GlassPanel>
      </section>

      {/* Limits */}
      <section id="limits">
        <h2 className="text-xl font-semibold mb-5">What this proves, and what it does not</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GlassPanel accentBorder className="p-6">
            <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">Proves</h3>
            <ul className="flex flex-col gap-2">
              {proves.map(p => (
                <li key={p} className="flex gap-2 text-sm text-muted-2">
                  <span className="text-ok mt-0.5">✓</span>{p}
                </li>
              ))}
            </ul>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h3 className="text-sm font-semibold text-muted-2 mb-4 uppercase tracking-wider">Does not prove</h3>
            <ul className="flex flex-col gap-2">
              {doesNotProve.map(p => (
                <li key={p} className="flex gap-2 text-sm text-muted-2">
                  <span className="text-warn mt-0.5">—</span>{p}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
