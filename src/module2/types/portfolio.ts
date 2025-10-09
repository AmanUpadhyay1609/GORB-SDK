// Types only - no runtime imports

export interface SimpleTokenAccount {
  tokenAccount: string;
  mint: string;
  owner: string;
  decimals: number;
  balanceRaw: string;
  balanceUi: number;
  balanceFormatted: string;
  programId: string;
  isFrozen: boolean;
}

export interface TokenBalanceSummary {
  totalAccounts: number;
  nonZeroAccounts: number;
  uniqueMints: number;
}

export interface TokenBalanceResponse {
  holdings: SimpleTokenAccount[];
  summary: TokenBalanceSummary;
}

export interface PortfolioOptions {
  includePrograms?: string[]; // program IDs to scan (defaults to Gorbchain token-2022)
}


