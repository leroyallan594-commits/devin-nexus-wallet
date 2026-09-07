import {
  CHAIN_CONFIGS,
  SUPPORTED_CHAINS,
  getChainConfig,
  isEVMChain,
  isSolanaChain,
  isBitcoinChain,
} from '../constants/chains';

describe('Chain Constants', () => {
  describe('CHAIN_CONFIGS', () => {
    it('should have all required chains', () => {
      expect(CHAIN_CONFIGS).toHaveProperty('ethereum');
      expect(CHAIN_CONFIGS).toHaveProperty('bsc');
      expect(CHAIN_CONFIGS).toHaveProperty('polygon');
      expect(CHAIN_CONFIGS).toHaveProperty('solana');
      expect(CHAIN_CONFIGS).toHaveProperty('bitcoin');
    });

    it('should have correct structure for each chain', () => {
      Object.values(CHAIN_CONFIGS).forEach(config => {
        expect(config).toHaveProperty('id');
        expect(config).toHaveProperty('name');
        expect(config).toHaveProperty('symbol');
        expect(config).toHaveProperty('type');
        expect(config).toHaveProperty('rpcUrl');
        expect(config).toHaveProperty('explorerUrl');
        expect(config).toHaveProperty('nativeToken');
        expect(config.nativeToken).toHaveProperty('symbol');
        expect(config.nativeToken).toHaveProperty('name');
        expect(config.nativeToken).toHaveProperty('decimals');
      });
    });

    it('should have chainId for EVM chains', () => {
      expect(CHAIN_CONFIGS.ethereum.chainId).toBe(1);
      expect(CHAIN_CONFIGS.bsc.chainId).toBe(56);
      expect(CHAIN_CONFIGS.polygon.chainId).toBe(137);
    });

    it('should not have chainId for non-EVM chains', () => {
      expect(CHAIN_CONFIGS.solana.chainId).toBeUndefined();
      expect(CHAIN_CONFIGS.bitcoin.chainId).toBeUndefined();
    });
  });

  describe('SUPPORTED_CHAINS', () => {
    it('should contain all chain IDs', () => {
      expect(SUPPORTED_CHAINS).toEqual([
        'ethereum',
        'bsc',
        'polygon',
        'solana',
        'bitcoin',
      ]);
    });
  });

  describe('getChainConfig', () => {
    it('should return correct config for valid chain ID', () => {
      const ethConfig = getChainConfig('ethereum');
      expect(ethConfig.id).toBe('ethereum');
      expect(ethConfig.name).toBe('Ethereum');
    });

    it('should throw error for invalid chain ID', () => {
      expect(() => getChainConfig('invalid-chain')).toThrow('Chain config not found');
    });
  });

  describe('Chain Type Checkers', () => {
    it('should correctly identify EVM chains', () => {
      expect(isEVMChain('ethereum')).toBe(true);
      expect(isEVMChain('bsc')).toBe(true);
      expect(isEVMChain('polygon')).toBe(true);
      expect(isEVMChain('solana')).toBe(false);
      expect(isEVMChain('bitcoin')).toBe(false);
    });

    it('should correctly identify Solana chain', () => {
      expect(isSolanaChain('solana')).toBe(true);
      expect(isSolanaChain('ethereum')).toBe(false);
      expect(isSolanaChain('bitcoin')).toBe(false);
    });

    it('should correctly identify Bitcoin chain', () => {
      expect(isBitcoinChain('bitcoin')).toBe(true);
      expect(isBitcoinChain('ethereum')).toBe(false);
      expect(isBitcoinChain('solana')).toBe(false);
    });
  });
});
