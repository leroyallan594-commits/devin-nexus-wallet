export type ChainType = 'EVM' | 'Solana' | 'Bitcoin';

export interface NativeToken {
  symbol: string;
  name: string;
  decimals: number;
}

export interface ChainConfig {
  id: string;
  name: string;
  symbol: string;
  type: ChainType;
  rpcUrl: string;
  explorerUrl: string;
  nativeToken: NativeToken;
  chainId?: number; // For EVM chains
}

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'EVM',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    nativeToken: {
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
    },
    chainId: 1,
  },
  bsc: {
    id: 'bsc',
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    type: 'EVM',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    nativeToken: {
      symbol: 'BNB',
      name: 'BNB',
      decimals: 18,
    },
    chainId: 56,
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    type: 'EVM',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeToken: {
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: 18,
    },
    chainId: 137,
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    type: 'Solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    nativeToken: {
      symbol: 'SOL',
      name: 'Solana',
      decimals: 9,
    },
  },
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'Bitcoin',
    rpcUrl: 'https://blockstream.info/api',
    explorerUrl: 'https://blockstream.info',
    nativeToken: {
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 8,
    },
  },
};

export const SUPPORTED_CHAINS = Object.keys(CHAIN_CONFIGS);

export const getChainConfig = (chainId: string): ChainConfig => {
  const config = CHAIN_CONFIGS[chainId];
  if (!config) {
    throw new Error(`Chain config not found for: ${chainId}`);
  }
  return config;
};

export const isEVMChain = (chainId: string): boolean => {
  return CHAIN_CONFIGS[chainId]?.type === 'EVM';
};

export const isSolanaChain = (chainId: string): boolean => {
  return CHAIN_CONFIGS[chainId]?.type === 'Solana';
};

export const isBitcoinChain = (chainId: string): boolean => {
  return CHAIN_CONFIGS[chainId]?.type === 'Bitcoin';
};
