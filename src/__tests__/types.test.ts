import { describe, it, expect } from 'vitest';
import type { Token, Transaction, SwapQuote, WalletData } from '../types';

describe('Type Definitions', () => {
  describe('Token Interface', () => {
    it('should create valid token object', () => {
      const token: Token = {
        address: '0x1234567890123456789012345678901234567890',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        chainId: 'ethereum',
        balance: '1000000000',
        isCustom: true,
      };

      expect(token.address).toBe('0x1234567890123456789012345678901234567890');
      expect(token.symbol).toBe('USDT');
      expect(token.decimals).toBe(6);
      expect(token.chainId).toBe('ethereum');
    });
  });

  describe('Transaction Interface', () => {
    it('should create valid transaction object', () => {
      const transaction: Transaction = {
        hash: '0xabcdef1234567890',
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        value: '1000000000000000000',
        timestamp: Date.now(),
        status: 'confirmed',
        chainId: 'ethereum',
        type: 'send',
        tokenSymbol: 'ETH',
        gasUsed: '21000',
        gasPrice: '20000000000',
      };

      expect(transaction.hash).toBe('0xabcdef1234567890');
      expect(transaction.status).toBe('confirmed');
      expect(transaction.type).toBe('send');
    });
  });

  describe('SwapQuote Interface', () => {
    it('should create valid swap quote object', () => {
      const fromToken: Token = {
        address: '0x1234567890123456789012345678901234567890',
        symbol: 'ETH',
        name: 'Ether',
        decimals: 18,
        chainId: 'ethereum',
      };

      const toToken: Token = {
        address: '0x0987654321098765432109876543210987654321',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        chainId: 'ethereum',
      };

      const swapQuote: SwapQuote = {
        fromToken,
        toToken,
        fromAmount: '1000000000000000000',
        toAmount: '2000000000',
        estimatedGas: '150000',
        priceImpact: '0.5',
        slippage: 0.5,
        route: ['ETH', 'USDC', 'USDT'],
        validUntil: Date.now() + 300000,
      };

      expect(swapQuote.fromToken.symbol).toBe('ETH');
      expect(swapQuote.toToken.symbol).toBe('USDT');
      expect(swapQuote.slippage).toBe(0.5);
    });
  });

  describe('WalletData Interface', () => {
    it('should create valid wallet data object', () => {
      const walletData: WalletData = {
        isWalletCreated: true,
        mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        addresses: {
          ethereum: '0x1234567890123456789012345678901234567890',
          solana: '5xK3UB9d8y7g5E8y5g8E5y8g5E8y5g8E5y8g5E8y5g8E',
        },
        balances: {
          ethereum: '1000000000000000000',
          solana: '5000000000',
        },
        tokens: {
          ethereum: [
            {
              address: '0x0987654321098765432109876543210987654321',
              symbol: 'USDT',
              name: 'Tether USD',
              decimals: 6,
              chainId: 'ethereum',
            },
          ],
        },
        isLoading: false,
      };

      expect(walletData.isWalletCreated).toBe(true);
      expect(walletData.addresses.ethereum).toBeTruthy();
      expect(walletData.balances.ethereum).toBe('1000000000000000000');
      expect(walletData.tokens.ethereum).toHaveLength(1);
    });
  });
});
