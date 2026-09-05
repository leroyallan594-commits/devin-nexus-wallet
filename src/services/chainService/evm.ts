import { ethers, Contract, parseUnits, formatUnits } from 'ethers';
import { getChainConfig } from '../../constants/chains';
import { StorageError } from '../../utils/storage';

// ERC-20 ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

export class EvmService {
  private provider: ethers.JsonRpcProvider | null = null;
  private chainId: string;

  constructor(chainId: string) {
    this.chainId = chainId;
    const config = getChainConfig(chainId);
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
  }

  /**
   * Get native token balance for an address
   * @param address Wallet address
   * @returns Balance in wei as string
   */
  async getBalance(address: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const balance = await this.provider.getBalance(address);
      return balance.toString();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get balance: ' + errorMessage);
    }
  }

  /**
   * Get ERC-20 token balance
   * @param tokenAddress Token contract address
   * @param ownerAddress Wallet address
   * @returns Token balance as string
   */
  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const contract = new Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(ownerAddress);
      return balance.toString();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get token balance: ' + errorMessage);
    }
  }

  /**
   * Get token decimals
   * @param tokenAddress Token contract address
   * @returns Number of decimals
   */
  async getTokenDecimals(tokenAddress: string): Promise<number> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const contract = new Contract(tokenAddress, ERC20_ABI, this.provider);
      const decimals = await contract.decimals();
      return Number(decimals);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get token decimals: ' + errorMessage);
    }
  }

  /**
   * Get token symbol
   * @param tokenAddress Token contract address
   * @returns Token symbol
   */
  async getTokenSymbol(tokenAddress: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const contract = new Contract(tokenAddress, ERC20_ABI, this.provider);
      const symbol = await contract.symbol();
      return symbol;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get token symbol: ' + errorMessage);
    }
  }

  /**
   * Get token name
   * @param tokenAddress Token contract address
   * @returns Token name
   */
  async getTokenName(tokenAddress: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const contract = new Contract(tokenAddress, ERC20_ABI, this.provider);
      const name = await contract.name();
      return name;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get token name: ' + errorMessage);
    }
  }

  /**
   * Send native token transaction
   * @param privateKey Private key for signing
   * @param toAddress Recipient address
   * @param amount Amount to send in wei
   * @returns Transaction hash
   */
  async sendTransaction(privateKey: string, toAddress: string, amount: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: amount,
      });

      return tx.hash;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to send transaction: ' + errorMessage);
    }
  }

  /**
   * Send ERC-20 token
   * @param privateKey Private key for signing
   * @param tokenAddress Token contract address
   * @param toAddress Recipient address
   * @param amount Amount to send (in smallest unit)
   * @returns Transaction hash
   */
  async sendToken(
    privateKey: string,
    tokenAddress: string,
    toAddress: string,
    amount: string
  ): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contract = new Contract(tokenAddress, ERC20_ABI, wallet);
      
      const tx = await contract.transfer(toAddress, amount);
      return tx.hash;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to send token: ' + errorMessage);
    }
  }

  /**
   * Get transaction receipt
   * @param txHash Transaction hash
   * @returns Transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get transaction receipt: ' + errorMessage);
    }
  }

  /**
   * Format balance from wei to human-readable format
   * @param balance Balance in wei
   * @param decimals Number of decimals (default 18)
   * @returns Formatted balance
   */
  formatBalance(balance: string, decimals: number = 18): string {
    try {
      return formatUnits(balance, decimals);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to format balance: ' + errorMessage);
    }
  }

  /**
   * Parse amount to wei
   * @param amount Human-readable amount
   * @param decimals Number of decimals (default 18)
   * @returns Amount in wei
   */
  parseAmount(amount: string, decimals: number = 18): string {
    try {
      return parseUnits(amount, decimals).toString();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to parse amount: ' + errorMessage);
    }
  }

  /**
   * Estimate gas for a transaction
   * @param fromAddress Sender address
   * @param toAddress Recipient address
   * @param amount Amount in wei
   * @returns Estimated gas limit
   */
  async estimateGas(fromAddress: string, toAddress: string, amount: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const gasLimit = await this.provider.estimateGas({
        from: fromAddress,
        to: toAddress,
        value: amount,
      });

      return gasLimit.toString();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to estimate gas: ' + errorMessage);
    }
  }

  /**
   * Get current gas price
   * @returns Current gas price in wei
   */
  async getGasPrice(): Promise<string> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      const gasPrice = await this.provider.getFeeData();
      return gasPrice.gasPrice?.toString() || '0';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get gas price: ' + errorMessage);
    }
  }

  /**
   * Get current block number
   * @returns Current block number
   */
  async getBlockNumber(): Promise<number> {
    try {
      if (!this.provider) {
        throw new StorageError('Provider not initialized');
      }

      return await this.provider.getBlockNumber();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get block number: ' + errorMessage);
    }
  }
}
