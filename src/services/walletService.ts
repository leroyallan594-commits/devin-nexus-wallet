import { generateMnemonic as generateBip39Mnemonic, validateMnemonic as validateBip39Mnemonic, mnemonicToSeedSync } from 'bip39';
import { ethers } from 'ethers';
import { derivePath } from 'ed25519-hd-key';
import { PublicKey, Keypair } from '@solana/web3.js';
import { getChainConfig, isEVMChain, isSolanaChain, isBitcoinChain } from '../constants/chains';
import { secureStorage, STORAGE_KEYS, StorageError } from '../utils/storage';

export interface WalletDerivation {
  address: string;
  privateKey?: string; // Only used internally, never exposed to UI
}

export class WalletService {
  private static instance: WalletService;

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Generate a new BIP39 mnemonic (12 words)
   * @returns 12-word mnemonic phrase
   */
  generateMnemonic(): string {
    try {
      const mnemonic = generateBip39Mnemonic();
      return mnemonic;
    } catch (error) {
      throw new StorageError('Failed to generate mnemonic: ' + (error as Error).message);
    }
  }

  /**
   * Validate a BIP39 mnemonic
   * @param mnemonic Mnemonic phrase to validate
   * @returns true if valid
   */
  validateMnemonic(mnemonic: string): boolean {
    try {
      return validateBip39Mnemonic(mnemonic);
    } catch (error) {
      return false;
    }
  }

  /**
   * Derive wallet address and private key for a specific chain
   * @param mnemonic BIP39 mnemonic phrase
   * @param chainId Chain identifier
   * @returns Wallet derivation with address (private key kept internal)
   */
  deriveWallet(mnemonic: string, chainId: string): WalletDerivation {
    try {
      if (!this.validateMnemonic(mnemonic)) {
        throw new StorageError('Invalid mnemonic');
      }

      const chainConfig = getChainConfig(chainId);

      if (isEVMChain(chainId)) {
        return this.deriveEVMWallet(mnemonic, chainConfig);
      } else if (isSolanaChain(chainId)) {
        return this.deriveSolanaWallet(mnemonic);
      } else if (isBitcoinChain(chainId)) {
        return this.deriveBitcoinWallet(mnemonic);
      } else {
        throw new StorageError('Unsupported chain type');
      }
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to derive wallet: ' + (error as Error).message);
    }
  }

  /**
   * Derive EVM wallet (Ethereum, BSC, Polygon)
   */
  private deriveEVMWallet(mnemonic: string, chainConfig: any): WalletDerivation {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey, // Keep for internal use
      };
    } catch (error) {
      throw new StorageError('Failed to derive EVM wallet: ' + (error as Error).message);
    }
  }

  /**
   * Derive Solana wallet
   */
  private deriveSolanaWallet(mnemonic: string): WalletDerivation {
    try {
      const seed = mnemonicToSeedSync(mnemonic);
      const derivationPath = "m/44'/501'/0'/0'"; // Solana BIP44 path
      const derivedKey = derivePath(derivationPath, seed.toString('hex'));
      
      const keypair = Keypair.fromSeed(derivedKey.key);
      const address = keypair.publicKey.toBase58();
      const privateKey = Buffer.from(keypair.secretKey).toString('hex');

      return {
        address,
        privateKey, // Keep for internal use
      };
    } catch (error) {
      throw new StorageError('Failed to derive Solana wallet: ' + (error as Error).message);
    }
  }

  /**
   * Derive Bitcoin wallet
   */
  private deriveBitcoinWallet(mnemonic: string): WalletDerivation {
    try {
      // For now, return a placeholder Bitcoin address
      // Bitcoin derivation will be implemented properly in a later phase
      // when we have proper BIP32 support with bitcoinjs-lib v7
      return {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Placeholder Bitcoin address
        privateKey: undefined, // Will be implemented properly later
      };
    } catch (error) {
      throw new StorageError('Failed to derive Bitcoin wallet: ' + (error as Error).message);
    }
  }

  /**
   * Save mnemonic securely with biometric protection
   * @param mnemonic Mnemonic phrase to save
   */
  async saveMnemonic(mnemonic: string): Promise<void> {
    try {
      if (!this.validateMnemonic(mnemonic)) {
        throw new StorageError('Invalid mnemonic');
      }

      await secureStorage.setItem(STORAGE_KEYS.MNEMONIC, mnemonic, true);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to save mnemonic: ' + (error as Error).message);
    }
  }

  /**
   * Retrieve mnemonic with biometric authentication
   * @returns Mnemonic phrase or null if not found
   */
  async getMnemonic(): Promise<string | null> {
    try {
      const mnemonic = await secureStorage.getItem(STORAGE_KEYS.MNEMONIC, true);
      return mnemonic;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to retrieve mnemonic: ' + (error as Error).message);
    }
  }

  /**
   * Delete mnemonic from secure storage
   */
  async deleteMnemonic(): Promise<void> {
    try {
      await secureStorage.deleteItem(STORAGE_KEYS.MNEMONIC, true);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to delete mnemonic: ' + (error as Error).message);
    }
  }

  /**
   * Check if wallet exists
   * @returns true if wallet exists
   */
  async hasWallet(): Promise<boolean> {
    try {
      return await secureStorage.hasItem(STORAGE_KEYS.MNEMONIC);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to check wallet existence: ' + (error as Error).message);
    }
  }

  /**
   * Derive addresses for all supported chains from mnemonic
   * @param mnemonic Mnemonic phrase
   * @returns Record of chainId to address
   */
  deriveAllAddresses(mnemonic: string): Record<string, string> {
    try {
      const addresses: Record<string, string> = {};
      const chainIds = ['ethereum', 'bsc', 'polygon', 'solana', 'bitcoin'];

      for (const chainId of chainIds) {
        try {
          const derivation = this.deriveWallet(mnemonic, chainId);
          addresses[chainId] = derivation.address;
        } catch (error) {
          // Skip chains that fail to derive silently
        }
      }

      return addresses;
    } catch (error) {
      throw new StorageError('Failed to derive all addresses: ' + (error as Error).message);
    }
  }
}

// Export singleton instance
export const walletService = WalletService.getInstance();
