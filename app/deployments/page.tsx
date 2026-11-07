import GlassPanel from "@/components/GlassPanel";
import HashDisplay from "@/components/HashDisplay";
import CopyButton from "@/components/CopyButton";
import { config } from "@/lib/config";
import runData from "@/data/run.json";

export const metadata = { title: "Deployments — CAPITLESS" };

function shorten(h: string) {
  if (!h || h.length < 12) return h;
  return `${h.slice(0, 6)}…${h.slice(-4)}`;
}

export default function DeploymentsPage() {
  const contracts = Object.entries(config.contracts) as [string, string][];

  return (
    <div className="mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <h1 className="text-3xl font-bold mb-2">Deployments</h1>
      <p className="text-muted-2 mb-8">
        All contracts live on <span className="text-accent font-mono">{config.networkName}</span> (chainId {config.chainId}).
      </p>

      {/* Contracts */}
      <GlassPanel className="mb-8 overflow-x-auto">
        <table className="w-full text-sm" aria-label="Deployed contracts">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 text-xs text-muted-2 uppercase tracking-wider font-medium">Contract</th>
              <th className="text-left px-5 py-3 text-xs text-muted-2 uppercase tracking-wider font-medium">Address</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(([name, addr]) => (
              <tr key={name} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[.02]">
                <td className="px-5 py-3 font-mono text-xs text-[var(--text)]">{name}</td>
                <td className="px-5 py-3 font-mono text-xs">
                  <a
                    href={`${config.explorerBaseUrl}/address/${addr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={addr}
                    className="text-accent hover:underline"
                  >
                    {shorten(addr)}
                  </a>
                </td>
                <td className="px-5 py-3">
                  <CopyButton value={addr} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>

      {/* Key txs */}
      <GlassPanel className="p-6 mb-8">
        <h2 className="text-base font-semibold mb-4">Key transactions</h2>
        <div className="flex flex-col gap-3">
          <Row label="Demo RFQ execution">
            <HashDisplay hash={runData.txHash} kind="tx" />
          </Row>
          <Row label="CRE policy report">
            <HashDisplay hash={runData.cre.reportTx} kind="tx" />
          </Row>
          <Row label="Strategy ID">
            <span className="font-mono text-xs text-accent" title={config.demoStrategyId}>{shorten(config.demoStrategyId)}</span>
            <CopyButton value={config.demoStrategyId} />
          </Row>
        </div>
      </GlassPanel>

      {/* Test commands */}
      <GlassPanel className="p-6 mb-8">
        <h2 className="text-base font-semibold mb-4">Run tests</h2>
        <div className="flex flex-col gap-2">
          {[
            "cd capitless && forge test",
            "forge test -v  # verbose",
            "forge test --match-test test_1_balancesReconcile",
          ].map(cmd => (
            <div key={cmd} className="flex items-center justify-between gap-4 px-4 py-2 rounded font-mono text-xs" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="text-accent">$</span>
              <span className="flex-1 text-[var(--text)]">{cmd}</span>
              <CopyButton value={cmd} />
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Links */}
      <GlassPanel className="p-6 mb-8">
        <h2 className="text-base font-semibold mb-4">Links</h2>
        <div className="flex flex-wrap gap-3">
          <LinkBtn href={config.links.github} label="GitHub" />
          {config.links.demoVideo && <LinkBtn href={config.links.demoVideo} label="Demo video" />}
          <LinkBtn href={`${config.explorerBaseUrl}/address/${config.contracts.RFQExecutor}`} label="RFQExecutor on Etherscan" />
        </div>
      </GlassPanel>

      {/* Status legend */}
      <GlassPanel className="p-6">
        <h2 className="text-base font-semibold mb-4">What is deployed vs mocked</h2>
        <div className="flex flex-col gap-2 text-sm">
          <Status ok label="StrategyPolicy, RFQExecutor, UniswapV4Adapter, CapitallessHook, CREPolicyConsumer">
            Deployed live on Ethereum Sepolia
          </Status>
          <Status ok label="Two USDC/WETH pools">
            Initialised and seeded with test liquidity
          </Status>
          <Status warn label="CRE workflow">
            Deployed to Chainlink CRE testnet environment; policy update executed and recorded
          </Status>
          <Status warn label="Pool liquidity">
            Seeded with small test amounts — sufficient to prove the mechanism
          </Status>
        </div>
      </GlassPanel>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-muted-2 w-44 shrink-0">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function LinkBtn({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 rounded text-sm text-muted-2 hover:text-[var(--text)] transition-colors"
      style={{ border: "1px solid var(--border)" }}
    >
      {label} ↗
    </a>
  );
}

function Status({ ok, warn, label, children }: { ok?: boolean; warn?: boolean; label: string; children: React.ReactNode }) {
  const dot = ok ? "var(--ok)" : warn ? "var(--warn)" : "var(--danger)";
  return (
    <div className="flex gap-3 items-start">
      <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: dot }} aria-hidden="true" />
      <div>
        <span className="text-[var(--text)] font-medium">{label}</span>
        <span className="text-muted-2"> — {children}</span>
      </div>
    </div>
  );
}
