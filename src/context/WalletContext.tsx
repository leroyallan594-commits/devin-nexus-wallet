import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { walletService } from '../services/walletService';
import { EvmService } from '../services/chainService/evm';
import { SolanaService } from '../services/chainService/solana';
import { BitcoinService } from '../services/chainService/bitcoin';
import { SUPPORTED_CHAINS } from '../constants/chains';
import type { WalletData, Token, ChainBalance } from '../types';

const WALLET_STATE_KEY = '@nexus_wallet_state';

interface WalletContextType {
  walletData: WalletData;
  createWallet: (mnemonic?: string) => Promise<void>;
  importWallet: (mnemonic: string) => Promise<void>;
  lockWallet: () => Promise<void>;
  unlockWallet: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  addCustomToken: (chainId: string, token: Token) => Promise<void>;
  removeCustomToken: (chainId: string, tokenAddress: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const initialWalletData: WalletData = {
  isWalletCreated: false,
  addresses: {},
  balances: {},
  tokens: {},
  isLoading: false,
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletData, setWalletData] = useState<WalletData>(initialWalletData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallet state from AsyncStorage on mount
  useEffect(() => {
    loadWalletState();
  }, []);

  const loadWalletState = async () => {
    try {
      setIsLoading(true);
      const stateJson = await AsyncStorage.getItem(WALLET_STATE_KEY);
      if (stateJson) {
        const state = JSON.parse(stateJson);
        setWalletData({ ...initialWalletData, ...state, isLoading: false });
      }
    } catch (err) {
      setError('Failed to load wallet state');
      console.error('Failed to load wallet state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWalletState = async (data: WalletData) => {
    try {
      const stateToSave = { ...data, isLoading: false };
      await AsyncStorage.setItem(WALLET_STATE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      setError('Failed to save wallet state');
      console.error('Failed to save wallet state:', err);
    }
  };

  const createWallet = async (mnemonic?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const walletMnemonic = mnemonic || walletService.generateMnemonic();
      
      if (!walletService.validateMnemonic(walletMnemonic)) {
        throw new Error('Invalid mnemonic');
      }

      await walletService.saveMnemonic(walletMnemonic);

      const addresses = walletService.deriveAllAddresses(walletMnemonic);

      const balances: Record<string, string> = {};
      const tokens: Record<string, Token[]> = {};

      SUPPORTED_CHAINS.forEach(chainId => {
        balances[chainId] = '0';
        tokens[chainId] = [];
      });

      const newWalletData: WalletData = {
        isWalletCreated: true,
        addresses,
        balances,
        tokens,
        isLoading: false,
      };

      setWalletData(newWalletData);
      await saveWalletState(newWalletData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const importWallet = async (mnemonic: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!walletService.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic');
      }

      await walletService.saveMnemonic(mnemonic);

      const addresses = walletService.deriveAllAddresses(mnemonic);

      const balances: Record<string, string> = {};
      const tokens: Record<string, Token[]> = {};

      SUPPORTED_CHAINS.forEach(chainId => {
        balances[chainId] = '0';
        tokens[chainId] = [];
      });

      const newWalletData: WalletData = {
        isWalletCreated: true,
        addresses,
        balances,
        tokens,
        isLoading: false,
      };

      setWalletData(newWalletData);
      await saveWalletState(newWalletData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const lockWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await walletService.deleteMnemonic();

      const lockedData: WalletData = {
        isWalletCreated: true,
        addresses: walletData.addresses,
        balances: walletData.balances,
        tokens: walletData.tokens,
        isLoading: false,
      };

      setWalletData(lockedData);
      await saveWalletState(lockedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lock wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unlockWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const mnemonic = await walletService.getMnemonic();
      if (!mnemonic) {
        throw new Error('Wallet not found or locked');
      }

      const addresses = walletData.addresses;
      const balances: Record<string, string> = {};
      const tokens: Record<string, Token[]> = {};

      SUPPORTED_CHAINS.forEach(chainId => {
        balances[chainId] = '0';
        tokens[chainId] = [];
      });

      const unlockedData: WalletData = {
        isWalletCreated: true,
        addresses,
        balances,
        tokens,
        isLoading: false,
      };

      setWalletData(unlockedData);
      await saveWalletState(unlockedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlock wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const mnemonic = await walletService.getMnemonic();
      if (!mnemonic) {
        throw new Error('Wallet not unlocked');
      }

      const balances: Record<string, string> = {};
      const chainBalances: ChainBalance[] = [];

      for (const chainId of SUPPORTED_CHAINS) {
        try {
          const address = walletData.addresses[chainId];
          if (!address) continue;

          let balance = '0';
          
          if (chainId === 'ethereum' || chainId === 'bsc' || chainId === 'polygon') {
            const evmService = new EvmService(chainId);
            balance = await evmService.getBalance(address);
          } else if (chainId === 'solana') {
            const solanaService = new SolanaService(chainId);
            balance = await solanaService.getBalance(address);
          } else if (chainId === 'bitcoin') {
            const bitcoinService = new BitcoinService(chainId);
            balance = await bitcoinService.getBalance(address);
          }

          balances[chainId] = balance;
        } catch (err) {
          console.error(`Failed to get balance for ${chainId}:`, err);
          balances[chainId] = '0';
        }
      }

      const updatedData: WalletData = {
        ...walletData,
        balances,
        isLoading: false,
      };

      setWalletData(updatedData);
      await saveWalletState(updatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh balances';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomToken = async (chainId: string, token: Token) => {
    try {
      setIsLoading(true);
      setError(null);

      const existingTokens = walletData.tokens[chainId] || [];
      const updatedTokens = [...existingTokens, token];

      const updatedData: WalletData = {
        ...walletData,
        tokens: {
          ...walletData.tokens,
          [chainId]: updatedTokens,
        },
        isLoading: false,
      };

      setWalletData(updatedData);
      await saveWalletState(updatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add custom token';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCustomToken = async (chainId: string, tokenAddress: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const existingTokens = walletData.tokens[chainId] || [];
      const updatedTokens = existingTokens.filter(t => t.address !== tokenAddress);

      const updatedData: WalletData = {
        ...walletData,
        tokens: {
          ...walletData.tokens,
          [chainId]: updatedTokens,
        },
        isLoading: false,
      };

      setWalletData(updatedData);
      await saveWalletState(updatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove custom token';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: WalletContextType = {
    walletData,
    createWallet,
    importWallet,
    lockWallet,
    unlockWallet,
    refreshBalances,
    addCustomToken,
    removeCustomToken,
    isLoading,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
