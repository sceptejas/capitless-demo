// ============================================================
// CAPITLESS demo — single source of truth for all addresses,
// links, and chain settings. Fill in real values before deploy.
// ============================================================

export const config = {
  chainId: 11155111,
  networkName: "Ethereum Sepolia",
  explorerBaseUrl: "https://sepolia.etherscan.io",

  contracts: {
    StrategyPolicy:   "0x0983eAd76B0A2db9B7Af15132EbC82f69D037d4a",
    RFQExecutor:      "0x75213f4e604c39249690560cC6b4E2f0a566F269",
    UniswapV4Adapter: "0xc9d6395707C43bFA2301eAC76fFbFdA73dC96b79",
    CapitallessHook:  "0xe2060833d28A004402D5A973b78C8e078B94C080",
    CREPolicyConsumer:"0xA4CD56392377D420F908DFA71028a1ac07FB27F1",
  },

  poolIds: {
    hookedPool: "0xfaec5d539497efc39f6bb6df51492d07a1723d28caa35fbae40b486510f738e6",
    plainPool:  "0x0c5089eb2863310ecab41eb94f2705ce37ce455a0f64a9ee627c7470b43161e8",
  },

  demoStrategyId: "0x90742d7d905464117a9f5753ba0f0f183110254868ea9f89ef0c045e2a57d866",

  links: {
    github:    "https://github.com/PLACEHOLDER/capitless",
    demoVideo: "",
  },

  wethAmountMin:     0.0001,
  wethAmountMax:     0.01,
  wethAmountDefault: 0.001,
  wethPresets:       [0.0001, 0.001, 0.005],
} as const;

export type ContractName = keyof typeof config.contracts;
