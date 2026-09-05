import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { getChainConfig } from '../../constants/chains';
import { StorageError } from '../../utils/storage';

export class SolanaService {
  private connection: Connection | null = null;
  private chainId: string;

  constructor(chainId: string) {
    this.chainId = chainId;
    const config = getChainConfig(chainId);
    this.connection = new Connection(config.rpcUrl, 'confirmed');
  }

  /**
   * Get SOL balance for an address
   * @param address Wallet address (base58)
   * @returns Balance in lamports as string
   */
  async getBalance(address: string): Promise<string> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance.toString();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to get balance: ' + errorMessage);
    }
  }

  /**
   * Get SPL token balance
   * @param tokenAddress Token mint address
   * @param ownerAddress Wallet address
   * @returns Token balance as string
   */
  async getTokenBalance(tokenAddress: string, ownerAddress: string): Promise<string> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      // Note: This is a simplified implementation
      // In production, you would use the SPL Token program to get token accounts
      // For now, return a placeholder value
      return '0';
    } catch (error) {
      throw new StorageError('Failed to get token balance: ' + (error as Error).message);
    }
  }

  /**
   * Send native SOL
   * @param privateKey Private key for signing (hex string)
   * @param toAddress Recipient address
   * @param amount Amount to send in lamports
   * @returns Transaction signature
   */
  async sendNative(privateKey: string, toAddress: string, amount: string): Promise<string> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      // Convert hex private key to Uint8Array
      const privateKeyBytes = Buffer.from(privateKey, 'hex');
      const keypair = Keypair.fromSecretKey(privateKeyBytes);
      
      const toPublicKey = new PublicKey(toAddress);
      const amountLamports = BigInt(amount);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: toPublicKey,
          lamports: amountLamports,
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [keypair]
      );

      return signature;
    } catch (error) {
      throw new StorageError('Failed to send SOL: ' + (error as Error).message);
    }
  }

  /**
   * Send SPL token
   * @param privateKey Private key for signing (hex string)
   * @param tokenAddress Token mint address
   * @param toAddress Recipient address
   * @param amount Amount to send (in smallest unit)
   * @returns Transaction signature
   */
  async sendToken(
    privateKey: string,
    tokenAddress: string,
    toAddress: string,
    amount: string
  ): Promise<string> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      // Note: This is a simplified implementation
      // In production, you would use the SPL Token program to send tokens
      // For now, this is a placeholder that will be implemented properly later
      throw new StorageError('SPL token transfers not yet implemented');
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to send token: ' + (error as Error).message);
    }
  }

  /**
   * Get recent blockhash
   * @returns Recent blockhash
   */
  async getRecentBlockhash(): Promise<string> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      const { blockhash } = await this.connection.getLatestBlockhash();
      return blockhash;
    } catch (error) {
      throw new StorageError('Failed to get recent blockhash: ' + (error as Error).message);
    }
  }

  /**
   * Get account info
   * @param address Account address
   * @returns Account info
   */
  async getAccountInfo(address: string): Promise<any> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      const publicKey = new PublicKey(address);
      const accountInfo = await this.connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      throw new StorageError('Failed to get account info: ' + (error as Error).message);
    }
  }

  /**
   * Format balance from lamports to SOL
   * @param balance Balance in lamports
   * @returns Formatted balance in SOL
   */
  formatBalance(balance: string): string {
    try {
      const lamports = BigInt(balance);
      const sol = Number(lamports) / LAMPORTS_PER_SOL;
      return sol.toString();
    } catch (error) {
      throw new StorageError('Failed to format balance: ' + (error as Error).message);
    }
  }

  /**
   * Parse amount to lamports
   * @param amount Amount in SOL
   * @returns Amount in lamports
   */
  parseAmount(amount: string): string {
    try {
      const sol = parseFloat(amount);
      const lamports = Math.floor(sol * LAMPORTS_PER_SOL);
      return lamports.toString();
    } catch (error) {
      throw new StorageError('Failed to parse amount: ' + (error as Error).message);
    }
  }

  /**
   * Estimate transaction fee
   * @param transaction Transaction to estimate
   * @returns Estimated fee in lamports
   */
  async estimateTransactionFee(transaction: Transaction): Promise<string> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      // Note: getEstimatedFee is not available in @solana/web3.js v1
      // For now, return a default fee estimate
      // In production, you would use a different method to estimate fees
      return '5000'; // Default fee estimate in lamports
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StorageError('Failed to estimate transaction fee: ' + errorMessage);
    }
  }

  /**
   * Get current slot
   * @returns Current slot
   */
  async getSlot(): Promise<number> {
    try {
      if (!this.connection) {
        throw new StorageError('Connection not initialized');
      }

      return await this.connection.getSlot();
    } catch (error) {
      throw new StorageError('Failed to get slot: ' + (error as Error).message);
    }
  }
}
