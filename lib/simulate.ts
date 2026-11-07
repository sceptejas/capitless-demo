import poolsData from "@/data/pools.json";

export interface SimResult {
  ok: boolean;
  quoteUsdc: number;
  routeCostUsdc: number;
  makerProceedsUsdc: number;
  directCostUsdc: number;
  savingUsdc: number;
  legs: { pool: string; wethOut: number; usdcIn: number }[];
  noQuoteReason?: string;
}

const POOLS = poolsData.pools;
const USDC_PER_WETH = poolsData.usdcPerWeth;

/**
 * Naive pool simulation: constant-product approximation.
 * For small sizes vs liquidity, price ≈ spot.
 * Documents: this is intentionally simple — it shows the mechanism, not a real AMM.
 */
function poolCostUsdc(wethOut: number, feeBps: number, hookFeeBps: number, maxWethOut: number): number | null {
  if (wethOut > maxWethOut) return null; // pool too shallow
  const totalFeeBps = feeBps + hookFeeBps;
  const feeMultiplier = 1 + totalFeeBps / 10_000;
  return wethOut * USDC_PER_WETH * feeMultiplier;
}

export function simulate(wethAmount: number, makerMarginBps = 50): SimResult {
  // Try single pool (cheapest fee)
  const sorted = [...POOLS].sort((a, b) => (a.feeBps + a.hookFeeBps) - (b.feeBps + b.hookFeeBps));

  // Single pool: all from cheapest
  const single = sorted[0];
  const singleCost = poolCostUsdc(wethAmount, single.feeBps, single.hookFeeBps, single.maxWethOut);

  // Split: half and half across both pools
  let splitCost: number | null = null;
  if (POOLS.length >= 2) {
    const half = wethAmount / 2;
    const c0 = poolCostUsdc(half, POOLS[0].feeBps, POOLS[0].hookFeeBps, POOLS[0].maxWethOut);
    const c1 = poolCostUsdc(half, POOLS[1].feeBps, POOLS[1].hookFeeBps, POOLS[1].maxWethOut);
    if (c0 !== null && c1 !== null) splitCost = c0 + c1;
  }

  if (singleCost === null && splitCost === null) {
    return {
      ok: false,
      quoteUsdc: 0, routeCostUsdc: 0, makerProceedsUsdc: 0, directCostUsdc: 0, savingUsdc: 0,
      legs: [],
      noQuoteReason: "No quote: route cost exceeds price (pool too shallow for this size)",
    };
  }

  const routeCost = Math.min(
    singleCost ?? Infinity,
    splitCost ?? Infinity,
  );

  // Direct route: hypothetical uniswap v2 spot + standard 30bps
  const directCost = wethAmount * USDC_PER_WETH * (1 + 30 / 10_000);

  // Maker margin
  const makerProceeds = routeCost * makerMarginBps / 10_000;
  const quoteUsdc = routeCost + makerProceeds;

  if (quoteUsdc > directCost * 1.01) {
    return {
      ok: false,
      quoteUsdc: 0, routeCostUsdc: 0, makerProceedsUsdc: 0, directCostUsdc: Math.round(directCost),
      savingUsdc: 0,
      legs: [],
      noQuoteReason: "No quote: route cost exceeds price (would be worse than direct)",
    };
  }

  const legs = splitCost !== null && splitCost <= (singleCost ?? Infinity)
    ? [
        { pool: "hooked pool (dynamic fee)", wethOut: wethAmount / 2, usdcIn: splitCost / 2 },
        { pool: "plain pool (fixed fee)", wethOut: wethAmount / 2, usdcIn: splitCost / 2 },
      ]
    : [{ pool: sorted[0].id, wethOut: wethAmount, usdcIn: singleCost! }];

  return {
    ok: true,
    quoteUsdc: Math.round(quoteUsdc * 1e6),
    routeCostUsdc: Math.round(routeCost * 1e6),
    makerProceedsUsdc: Math.round(makerProceeds * 1e6),
    directCostUsdc: Math.round(directCost * 1e6),
    savingUsdc: Math.round((directCost - quoteUsdc) * 1e6),
    legs,
  };
}
