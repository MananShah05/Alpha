import { Strategy, GraveyardTrade } from './types';

export const presetStrategies: Strategy[] = [
  {
    id: 'sol-mev-backrunning',
    name: 'Solana Dex Jito Backrun',
    sector: 'Crypto',
    description: 'Listen to public transaction broadcasts and execute atomic DEX backrunning arbitrage immediately following large retail meme pool purchases, utilizing the Jito bundle validator auctions.',
    initialAlphaBps: 280,
    currentAlphaBps: 184.2281,
    currentCapital: 12.5,
    competitorsCount: 18,
    decayHalfLifeWeeks: 4,
    capacityLimitMillions: 30,
    replicabilityScore: 82,
    autopsyRating: 'D',
    safeguards: [
      'Implement private validator direct channels (Firedancer subnets).',
      'Optimize Web3 WebSocket latency below 12ms from block coordinators.',
      'Deploy localized co-located Tokyo and Amsterdam validator endpoints.',
      'Establish dynamic capital-sizing based on rolling mempool volatility bounds.'
    ],
    created: '2026-01-10T12:00:00.000Z',
    isCustom: false
  },
  {
    id: 'us-treasury-basis',
    name: 'US Treasury Cash-vs-Futures Basis',
    sector: 'Fixed Income',
    description: 'Exploit yield differentials between Treasury bonds and their respective CME futures contracts, using high-leverage repo agreements to amplify thin spreads.',
    initialAlphaBps: 38,
    currentAlphaBps: 34.6192,
    currentCapital: 850.0,
    competitorsCount: 45,
    decayHalfLifeWeeks: 22,
    capacityLimitMillions: 12000,
    replicabilityScore: 48,
    autopsyRating: 'B',
    safeguards: [
      'Negogiate direct bilateral repo rate locks to lock financing cost.',
      'Apply dynamic stop-outs aligned with Treasury liquidity shocks.',
      'Incorporate multi-deal counterparty distribution to mask net spot exposures.',
      'Maintain real-time margin buffers capable of absorbing 12-standard-deviation selloffs.'
    ],
    created: '2025-11-20T12:00:00.000Z',
    isCustom: false
  },
  {
    id: 'sp500-reconstitution',
    name: 'S&P 500 Entry Front-Running',
    sector: 'Equities',
    description: 'Predict next quarterly S&P 500 entry tickers based on free-float market cap rules, acquiring components pre-announcement and passing the inventory to passive index funds.',
    initialAlphaBps: 140,
    currentAlphaBps: 92.4045,
    currentCapital: 320.0,
    competitorsCount: 64,
    decayHalfLifeWeeks: 12,
    capacityLimitMillions: 1500,
    replicabilityScore: 68,
    autopsyRating: 'C',
    safeguards: [
      'Spread buys across a 15-day pre-balancing window using dark pool liquidity.',
      'Hedge broader market beta using Sector ETF put options during the accumulation phase.',
      'Establish automated order cancellation immediately upon unexpected SEC filing revisions.',
      'Diversify into Nasdaq-100 and FTSE-100 index methodologies to spread risk density.'
    ],
    created: '2025-08-15T12:00:00.000Z',
    isCustom: false
  },
  {
    id: 'cey-dex-triangular',
    name: 'CEX-DEX Latency Arbitrage (Arbitrum-Binance)',
    sector: 'Crypto',
    description: 'Arbitrage instantaneous liquidity pool deviations on Uniswap v3 Arbitrum against Binance spot order books, using private RPC submission routes.',
    initialAlphaBps: 110,
    currentAlphaBps: 58.0093,
    currentCapital: 6.2,
    competitorsCount: 29,
    decayHalfLifeWeeks: 3,
    capacityLimitMillions: 15,
    replicabilityScore: 94,
    autopsyRating: 'F',
    safeguards: [
      'Bridge custom dedicated microwave fiber-links between validator centers.',
      'Deploy sub-millisecond custom rust client nodes with dedicated private gas buffers.',
      'Route transactions through multi-address proxy contracts to hide searcher wallet tags.',
      'Activate localized delta-hedging algorithms directly within the centralized exchange pool.'
    ],
    created: '2026-03-01T12:00:00.000Z',
    isCustom: false
  }
];

export const graveyardTrades: GraveyardTrade[] = [
  {
    id: 'gbtc-discount-arb',
    name: 'Grayscale GBTC Net Asset Value (NAV) Arbitrage',
    sector: 'Crypto / Trust Securities',
    peakAlpha: '+35% to +40% Premium',
    era: '2019 - 2021',
    collapseSpeed: '3 Weeks (reversal)',
    mechanics: 'Borrow Bitcoin to subscribe to GBTC trust shares at NAV, wait out the 6-month lockup, and sell shares on the secondary market at the historic highly inflated premium.',
    postMortem: 'The alpha decayed permanently when the SEC approved competing liquid Spot Bitcoin ETFs, eliminating trust model lockups. When the massive premium flipped to a severe -40% discount, levered funds became trapped inside the illiquid trust, resulting in catastrophic billion-dollar liquidations of Three Arrows Capital (3AC) and BlockFi.'
  },
  {
    id: 'kimchi-premium',
    name: 'The Korean Kimchi Premium Loop',
    sector: 'Cross-Border FX / Crypto',
    peakAlpha: 'Up to +45% Premium',
    era: '2017 - 2018, 2021',
    collapseSpeed: 'Continuous compression',
    mechanics: 'Purchase Bitcoin on global USD/EUR exchanges, transfer to Korean exchange Upbit, liquidate at KRW premium, and cycle KRW back to USD/EUR via complex cross-border trade invoices.',
    postMortem: 'Sustained only by South Korea\'s ultra-strict foreign currency transfer regulations (Foreign Exchange Transactions Act). Institutional scale-up collapsed as banks flags flagged transactions, matching KYC audits. Smaller retail copycats eventually bid down the spread, and liquidity providers expanded bulk institutional routing channels.'
  },
  {
    id: 'uniswap-v2-sandwiching',
    name: 'Mempool Sandwich Front-running (Public Gas Wars)',
    sector: 'Decentralized Finance',
    peakAlpha: '$300,000 / Day (Cumulative)',
    era: '2020 - 2022',
    collapseSpeed: '6 Months',
    mechanics: 'Sniff public mempools for high-slippage decentralized swaps, pay higher gas fees to execute a buy order before the target, and immediately liquidate at the inflated price right after them.',
    postMortem: 'Defeated by architectural evolutions: the massive migration of DEX volume to private transaction coordinators like Flashbots MEV-Geth and validator protected bundles (Jito protected nodes). Public sandwich attempts now get systemically backrun or trapped by smart honeypot contracts designed to drain sandwich bot gas reserves.'
  },
  {
    id: 'citadel-muni-arb',
    name: 'Municipal Bond Tax-Exempt Arbitrage',
    sector: 'Fixed Income / Municipals',
    peakAlpha: 'Atypical Interest Spreads',
    era: 'Early 2000s',
    collapseSpeed: '12 Months',
    mechanics: 'Identify pricing deviations in US municipal bonds versus general interest-rate swaps, packaging the yield with tax exemptions to receive risk-free arbitrage spreads.',
    postMortem: 'Decayed because major investment banking desks in Wall Street standardized programmatic scrapers to sweep the municipal bond registries. The spread condensed from several hundred basis points to sub-clearing costs as systematic algorithms bid up the underlying assets, transferring the Alpha strictly to premium liquidity routers.'
  }
];

export const simulationTimeline = Array.from({ length: 52 }, (_, i) => ({
  week: i + 1,
  label: `W${i + 1}`
}));

export const sampleScanLogs = [
  'INFO [Mempool Sniffer] Searched public RPC: found 22 parallel backruns on SOL DEX contracts.',
  'WARN [GitHub Monitor] Repository keyword search "CEX-DEX Triangular" commits hiked by 140%.',
  'ALERT [Competitor Intelligence] Top-tier multi-strategy desk allocated $45M into high-frequency Arb pools.',
  'INFO [L2 Network Explorer] Base gas cost surged by 1.8x; sandwich-bot transaction failure rates hit 34%.',
  'WARN [Macro Signal] Fed overnight repo yields increased; repo-basis leverage financing is turning expensive.',
  'ALERT [Forum Scraper] Quantitative subreddit thread detailing "MEME Listing drift" went viral (1,800 upvotes).',
  'INFO [HR Intelligence] Millennium Management posted senior quant developer listing matching specific Arbitrum parameters.',
  'WARN [API Watch] Centralized exchange reduced rate-limits on WebSocket order routing from 40ms to 80ms.',
  'INFO [Hedge Fund Filing] 13F filing shows 3 additional funds initiated substantial basis futures- arbitrage positions.',
  'ALERT [DEX Upgrade] Uniswap v4 hook architecture announced, reducing liquidity lockup slippage by up to 30%.'
];
