import axios from 'axios';
import { getChainConfig } from '../../constants/chains';
import { StorageError } from '../../utils/storage';

export class BitcoinService {
  private chainId: string;
  private apiUrl: string;

  constructor(chainId: string) {
    this.chainId = chainId;
    const config = getChainConfig(chainId);
    this.apiUrl = config.rpcUrl;
  }

  /**
   * Get BTC balance for an address using external API
   * @param address Bitcoin address
   * @returns Balance in satoshis as string
   */
  async getBalance(address: string): Promise<string> {
    try {
      // Using Blockstream API for Bitcoin balance
      const response = await axios.get(`${this.apiUrl}/address/${address}`);
      
      if (response.data && response.data.chain_stats) {
        const balance = response.data.chain_stats.funded_txo_sum + response.data.chain_stats.spent_txo_sum;
        return balance.toString();
      }
      
      return '0';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get Bitcoin balance: ' + errorMessage);
    }
  }

  /**
   * Send Bitcoin transaction
   * @param privateKey Private key for signing
   * @param toAddress Recipient address
   * @param amount Amount to send in satoshis
   * @returns Transaction hash
   */
  async send(privateKey: string, toAddress: string, amount: string): Promise<string> {
    try {
      // Note: This is a placeholder implementation
      // In production, you would use bitcoinjs-lib to create and sign transactions
      // For now, this will be implemented properly in a later phase
      throw new StorageError('Bitcoin transaction sending not yet implemented');
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to send Bitcoin: ' + (error as Error).message);
    }
  }

  /**
   * Get transaction details
   * @param txHash Transaction hash
   * @returns Transaction details
   */
  async getTransaction(txHash: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/tx/${txHash}`);
      return response.data;
    } catch (error) {
      throw new StorageError('Failed to get transaction: ' + (error as Error).message);
    }
  }

  /**
   * Get address details
   * @param address Bitcoin address
   * @returns Address details
   */
  async getAddressDetails(address: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/address/${address}`);
      return response.data;
    } catch (error) {
      throw new StorageError('Failed to get address details: ' + (error as Error).message);
    }
  }

  /**
   * Format balance from satoshis to BTC
   * @param balance Balance in satoshis
   * @returns Formatted balance in BTC
   */
  formatBalance(balance: string): string {
    try {
      const satoshis = BigInt(balance);
      const btc = Number(satoshis) / 100000000; // 1 BTC = 100,000,000 satoshis
      return btc.toString();
    } catch (error) {
      throw new StorageError('Failed to format balance: ' + (error as Error).message);
    }
  }

  /**
   * Parse amount to satoshis
   * @param amount Amount in BTC
   * @returns Amount in satoshis
   */
  parseAmount(amount: string): string {
    try {
      const btc = parseFloat(amount);
      const satoshis = Math.floor(btc * 100000000);
      return satoshis.toString();
    } catch (error) {
      throw new StorageError('Failed to parse amount: ' + (error as Error).message);
    }
  }

  /**
   * Estimate transaction fee
   * @returns Estimated fee in satoshis
   */
  async estimateFee(): Promise<string> {
    try {
      // Using Blockstream API for fee estimation
      const response = await axios.get(`${this.apiUrl}/fee-estimates`);
      
      if (response.data) {
        // Get the fastest fee estimate
        const fastestFee = response.data[Object.keys(response.data)[0]] || 1;
        // Assume standard transaction size (approx 250 bytes)
        const estimatedFee = Math.ceil(fastestFee * 250);
        return estimatedFee.toString();
      }
      
      return '1000'; // Default fallback fee
    } catch (error) {
      throw new StorageError('Failed to estimate fee: ' + (error as Error).message);
    }
  }

  /**
   * Get current block height
   * @returns Current block height
   */
  async getBlockHeight(): Promise<number> {
    try {
      const response = await axios.get(`${this.apiUrl}/blocks/tip/height`);
      return parseInt(response.data);
    } catch (error) {
      throw new StorageError('Failed to get block height: ' + (error as Error).message);
    }
  }

  /**
   * Validate Bitcoin address
   * @param address Bitcoin address to validate
   * @returns true if valid
   */
  validateAddress(address: string): boolean {
    try {
      // Basic Bitcoin address validation
      // Bitcoin addresses are 26-35 characters and start with 1, 3, or bc1
      const btcAddressRegex = /^(1|3)[a-zA-Z0-9]{25,34}$|^bc1[a-zA-Z0-9]{39,59}$/;
      return btcAddressRegex.test(address);
    } catch (error) {
      return false;
    }
  }
}
