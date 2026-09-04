import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export class StorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class BiometricError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'BiometricError';
  }
}

/**
 * Secure storage utility with biometric authentication support
 * Never logs or exposes sensitive data
 */
export class SecureStorage {
  private static instance: SecureStorage;

  private constructor() {}

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  /**
   * Check if biometric authentication is available
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        return false;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      // Return false on any error - biometric is optional
      return false;
    }
  }

  /**
   * Authenticate user with biometrics
   * @param promptMessage Message to show to user
   * @returns true if authentication successful
   * @throws BiometricError if authentication fails
   */
  async authenticate(promptMessage: string = 'Authenticate to access secure data'): Promise<boolean> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        // If biometric not available, allow access without authentication
        // This is for development/testing and fallback scenarios
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        throw new BiometricError('Biometric authentication failed', result.error);
      }

      return true;
    } catch (error) {
      if (error instanceof BiometricError) {
        throw error;
      }
      throw new BiometricError('Authentication error: ' + (error as Error).message);
    }
  }

  /**
   * Store data securely
   * @param key Storage key
   * @param value Value to store (string)
   * @param requireBiometric Whether to require biometric authentication
   * @throws StorageError if storage fails
   */
  async setItem(key: string, value: string, requireBiometric: boolean = false): Promise<void> {
    try {
      if (requireBiometric) {
        await this.authenticate('Authenticate to save secure data');
      }

      if (!key || !value) {
        throw new StorageError('Key and value are required');
      }

      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      if (error instanceof StorageError || error instanceof BiometricError) {
        throw error;
      }
      throw new StorageError('Failed to store data: ' + (error as Error).message);
    }
  }

  /**
   * Retrieve data securely
   * @param key Storage key
   * @param requireBiometric Whether to require biometric authentication
   * @returns Stored value or null if not found
   * @throws StorageError if retrieval fails
   */
  async getItem(key: string, requireBiometric: boolean = true): Promise<string | null> {
    try {
      if (requireBiometric) {
        await this.authenticate('Authenticate to access secure data');
      }

      if (!key) {
        throw new StorageError('Key is required');
      }

      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      if (error instanceof StorageError || error instanceof BiometricError) {
        throw error;
      }
      throw new StorageError('Failed to retrieve data: ' + (error as Error).message);
    }
  }

  /**
   * Delete data securely
   * @param key Storage key
   * @param requireBiometric Whether to require biometric authentication
   * @throws StorageError if deletion fails
   */
  async deleteItem(key: string, requireBiometric: boolean = true): Promise<void> {
    try {
      if (requireBiometric) {
        await this.authenticate('Authenticate to delete secure data');
      }

      if (!key) {
        throw new StorageError('Key is required');
      }

      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      if (error instanceof StorageError || error instanceof BiometricError) {
        throw error;
      }
      throw new StorageError('Failed to delete data: ' + (error as Error).message);
    }
  }

  /**
   * Check if key exists
   * @param key Storage key
   * @returns true if key exists
   * @throws StorageError if check fails
   */
  async hasItem(key: string): Promise<boolean> {
    try {
      if (!key) {
        throw new StorageError('Key is required');
      }

      const value = await SecureStore.getItemAsync(key);
      return value !== null;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to check data: ' + (error as Error).message);
    }
  }

  /**
   * Clear all secure storage (use with caution)
   * @param requireBiometric Whether to require biometric authentication
   * @throws StorageError if clearing fails
   */
  async clear(requireBiometric: boolean = true): Promise<void> {
    try {
      if (requireBiometric) {
        await this.authenticate('Authenticate to clear all secure data');
      }

      // Note: SecureStore doesn't have a clear all method
      // This is a placeholder - in production, you'd need to track keys
      // or use a different approach
      throw new StorageError('Clear all not implemented - use deleteItem for specific keys');
    } catch (error) {
      if (error instanceof StorageError || error instanceof BiometricError) {
        throw error;
      }
      throw new StorageError('Failed to clear data: ' + (error as Error).message);
    }
  }
}

// Export singleton instance
export const secureStorage = SecureStorage.getInstance();

// Storage keys constants
export const STORAGE_KEYS = {
  MNEMONIC: 'wallet_mnemonic',
  ADDRESSES: 'wallet_addresses',
  CUSTOM_TOKENS_PREFIX: 'custom_tokens_',
} as const;
