export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: string;
  balance?: string;
  isCustom?: boolean;
}

export interface Transaction {
  hash: string;
  from: string;
  to?: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  chainId: string;
  type?: 'send' | 'receive' | 'swap' | 'approve';
  tokenSymbol?: string;
  tokenAddress?: string;
  gasUsed?: string;
  gasPrice?: string;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  estimatedGas?: string;
  priceImpact?: string;
  slippage: number;
  route?: string[];
  validUntil?: number;
}

export interface WalletData {
  isWalletCreated: boolean;
  mnemonic?: string;
  addresses: Record<string, string>; // chainId -> address
  balances: Record<string, string>; // chainId -> native balance
  tokens: Record<string, Token[]>; // chainId -> array of tokens
  isLoading: boolean;
}

export interface SwapTransactionData {
  to: string;
  data: string;
  value: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface SolanaSwapTransactionData {
  transaction: string; // base64 encoded transaction
}

export interface ChainBalance {
  chainId: string;
  nativeBalance: string;
  tokens: Token[];
}
