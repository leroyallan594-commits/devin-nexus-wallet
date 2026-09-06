import axios from 'axios';
import { getChainConfig, isEVMChain, isSolanaChain } from '../constants/chains';
import { StorageError } from '../utils/storage';
import type { SwapQuote, SwapTransactionData, SolanaSwapTransactionData } from '../types';

export class SwapService {
  private static instance: SwapService;
  private oneInchApiKey: string;
  private jupiterApiKey: string;

  private constructor() {
    this.oneInchApiKey = process.env.ONEINCH_API_KEY || '';
    this.jupiterApiKey = process.env.JUPITER_API_KEY || '';
  }

  static getInstance(): SwapService {
    if (!SwapService.instance) {
      SwapService.instance = new SwapService();
    }
    return SwapService.instance;
  }

  /**
   * Get swap quote from 1inch for EVM chains
   * @param chainId Chain identifier
   * @param fromTokenAddress Source token address (or native token address)
   * @param toTokenAddress Destination token address (or native token address)
   * @param amount Amount to swap (in smallest unit)
   * @returns Swap quote
   */
  async getEvmQuote(
    chainId: string,
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string
  ): Promise<SwapQuote> {
    try {
      if (!isEVMChain(chainId)) {
        throw new StorageError('Chain does not support 1inch API');
      }

      const config = getChainConfig(chainId);
      if (!config.chainId) {
        throw new StorageError('Chain does not have chainId for 1inch API');
      }

      if (!this.oneInchApiKey) {
        throw new StorageError('1inch API key not configured');
      }

      const url = `https://api.1inch.dev/swap/v5.2/${config.chainId}/quote`;
      
      const response = await axios.get(url, {
        params: {
          from: fromTokenAddress,
          to: toTokenAddress,
          amount: amount,
        },
        headers: {
          'Authorization': `Bearer ${this.oneInchApiKey}`,
        },
      });

      const data = response.data;

      return {
        fromToken: {
          address: fromTokenAddress,
          symbol: data.fromSymbol || '',
          name: data.fromSymbol || '',
          decimals: data.fromDecimals || 18,
          chainId,
        },
        toToken: {
          address: toTokenAddress,
          symbol: data.toSymbol || '',
          name: data.toSymbol || '',
          decimals: data.toDecimals || 18,
          chainId,
        },
        fromAmount: amount,
        toAmount: data.toAmount || '0',
        estimatedGas: data.estimateGas?.toString(),
        priceImpact: data.priceImpact ? (parseFloat(data.priceImpact) * 100).toString() + '%' : undefined,
        slippage: 0.5, // Default slippage tolerance
        route: data.routes?.map((r: any) => r[0]?.name || r[0]?.fromTokenSymbol) || [],
        validUntil: data.validUntil ? Date.now() + 300000 : undefined, // 5 minutes from now
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get EVM quote: ' + errorMessage);
    }
  }

  /**
   * Get swap transaction data from 1inch for EVM chains
   * @param chainId Chain identifier
   * @param fromTokenAddress Source token address
   * @param toTokenAddress Destination token address
   * @param amount Amount to swap (in smallest unit)
   * @param fromAddress Sender address
   * @param slippage Slippage tolerance in percentage (default 0.5)
   * @returns Swap transaction data
   */
  async getEvmSwapTransaction(
    chainId: string,
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string,
    fromAddress: string,
    slippage: number = 0.5
  ): Promise<SwapTransactionData> {
    try {
      if (!isEVMChain(chainId)) {
        throw new StorageError('Chain does not support 1inch API');
      }

      const config = getChainConfig(chainId);
      if (!config.chainId) {
        throw new StorageError('Chain does not have chainId for 1inch API');
      }

      if (!this.oneInchApiKey) {
        throw new StorageError('1inch API key not configured');
      }

      const url = `https://api.1inch.dev/swap/v5.2/${config.chainId}/swap`;
      
      const response = await axios.get(url, {
        params: {
          from: fromAddress,
          src: fromTokenAddress,
          dst: toTokenAddress,
          amount: amount,
          slippage: slippage,
        },
        headers: {
          'Authorization': `Bearer ${this.oneInchApiKey}`,
        },
      });

      const data = response.data;

      return {
        to: data.to,
        data: data.data,
        value: data.value || '0',
        gasLimit: data.gasLimit?.toString(),
        gasPrice: data.gasPrice?.toString(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get EVM swap transaction: ' + errorMessage);
    }
  }

  /**
   * Get swap quote from Jupiter for Solana
   * @param fromTokenAddress Source token mint address
   * @param toTokenAddress Destination token mint address
   * @param amount Amount to swap (in smallest unit)
   * @returns Swap quote
   */
  async getSolanaQuote(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string
  ): Promise<SwapQuote> {
    try {
      // Using Jupiter Quote API
      const url = 'https://quote-api.jup.ag/v6/quote';
      
      const headers: Record<string, string> = {};
      if (this.jupiterApiKey) {
        headers['Authorization'] = `Bearer ${this.jupiterApiKey}`;
      }
      
      const response = await axios.get(url, {
        params: {
          inputMint: fromTokenAddress,
          outputMint: toTokenAddress,
          amount: amount,
        },
        headers,
      });

      const data = response.data;

      return {
        fromToken: {
          address: fromTokenAddress,
          symbol: data.inputMint || '',
          name: data.inputMint || '',
          decimals: 9, // Solana typically uses 9 decimals
          chainId: 'solana',
        },
        toToken: {
          address: toTokenAddress,
          symbol: data.outputMint || '',
          name: data.outputMint || '',
          decimals: 9,
          chainId: 'solana',
        },
        fromAmount: amount,
        toAmount: data.outAmount || '0',
        estimatedGas: undefined,
        priceImpact: data.priceImpactPct ? data.priceImpactPct + '%' : undefined,
        slippage: 0.5, // Default slippage tolerance
        route: data.routePlan?.map((r: any) => r.swapInfo?.ammIn?.toString()) || [],
        validUntil: Date.now() + 300000, // 5 minutes from now
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get Solana quote: ' + errorMessage);
    }
  }

  /**
   * Get swap transaction data from Jupiter for Solana
   * @param fromTokenAddress Source token mint address
   * @param toTokenAddress Destination token mint address
   * @param amount Amount to swap (in smallest unit)
   * @param userPublicKey User's public key
   * @param slippage Slippage tolerance in percentage (default 0.5)
   * @returns Swap transaction data
   */
  async getSolanaSwapTransaction(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string,
    userPublicKey: string,
    slippage: number = 0.5
  ): Promise<SolanaSwapTransactionData> {
    try {
      // Using Jupiter Swap API
      const url = 'https://quote-api.jup.ag/v6/swap';
      
      const headers: Record<string, string> = {};
      if (this.jupiterApiKey) {
        headers['Authorization'] = `Bearer ${this.jupiterApiKey}`;
      }
      
      const response = await axios.get(url, {
        params: {
          inputMint: fromTokenAddress,
          outputMint: toTokenAddress,
          amount: amount,
          userPublicKey: userPublicKey,
          slippageBps: Math.floor(slippage * 100), // Convert percentage to basis points
        },
        headers,
      });

      const data = response.data;

      return {
        transaction: data.swapTransaction || '',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get Solana swap transaction: ' + errorMessage);
    }
  }

  /**
   * Check if DEX aggregation is available for a chain
   * @param chainId Chain identifier
   * @returns true if DEX aggregation is available
   */
  isSwapAvailable(chainId: string): boolean {
    try {
      return isEVMChain(chainId) || isSolanaChain(chainId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get supported tokens for a chain (placeholder)
   * @param chainId Chain identifier
   * @returns List of supported token addresses
   */
  async getSupportedTokens(chainId: string): Promise<string[]> {
    try {
      if (isEVMChain(chainId)) {
        // For EVM chains, we could get supported tokens from 1inch
        // For now, return empty array as placeholder
        return [];
      } else if (isSolanaChain(chainId)) {
        // For Solana, we could get supported tokens from Jupiter
        // For now, return empty array as placeholder
        return [];
      }
      return [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get supported tokens: ' + errorMessage);
    }
  }

  /**
   * Calculate minimum output amount based on slippage
   * @param outputAmount Expected output amount
   * @param slippage Slippage tolerance in percentage
   * @returns Minimum output amount
   */
  calculateMinOutput(outputAmount: string, slippage: number): string {
    try {
      const amount = BigInt(outputAmount);
      const slippageDecimal = slippage / 100;
      const minAmount = amount - (amount * BigInt(Math.floor(slippageDecimal * 10000)) / BigInt(10000));
      return minAmount.toString();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to calculate minimum output: ' + errorMessage);
    }
  }

  /**
   * Validate swap parameters
   * @param fromTokenAddress Source token address
   * @param toTokenAddress Destination token address
   * @param amount Amount to swap
   * @returns true if parameters are valid
   */
  validateSwapParameters(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string
  ): boolean {
    try {
      if (!fromTokenAddress || !toTokenAddress) {
        return false;
      }

      if (!amount || BigInt(amount) <= 0) {
        return false;
      }

      if (fromTokenAddress === toTokenAddress) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const swapService = SwapService.getInstance();
