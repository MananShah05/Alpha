export interface Strategy {
  id: string;
  name: string;
  sector: 'Crypto' | 'Equities' | 'FX' | 'Fixed Income' | 'Commodities' | 'Cross-Asset';
  description: string;
  initialAlphaBps: number;
  currentAlphaBps: number;
  currentCapital: number; // in USD Millions
  competitorsCount: number;
  decayHalfLifeWeeks: number;
  capacityLimitMillions: number;
  replicabilityScore: number; // 0-100
  autopsyRating: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  safeguards: string[];
  created: string;
  isCustom: boolean;
}

export interface GraveyardTrade {
  id: string;
  name: string;
  sector: string;
  peakAlpha: string;
  era: string;
  collapseSpeed: string;
  mechanics: string;
  postMortem: string;
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}
