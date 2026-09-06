import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '../src/context/WalletContext';
import { SUPPORTED_CHAINS, getChainConfig } from '../src/constants/chains';

export default function IndexScreen() {
  const router = useRouter();
  const { walletData, isLoading, refreshBalances } = useWallet();

  useEffect(() => {
    if (walletData.isWalletCreated) {
      refreshBalances();
    }
  }, [walletData.isWalletCreated]);

  const handleCreateWallet = () => {
    router.push('/create-wallet');
  };

  const handleUnlock = () => {
    router.push('/unlock');
  };

  const handleChainPress = (chainId: string) => {
    router.push(`/balance/${chainId}`);
  };

  const handleSend = () => {
    router.push('/send');
  };

  const handleSwap = () => {
    router.push('/swap');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  if (!walletData.isWalletCreated) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Nexus Wallet</Text>
          <Text style={styles.subtitle}>Secure, Self-Custodial Crypto Wallet</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleCreateWallet}>
            <Text style={styles.buttonText}>Create New Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleUnlock}>
            <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nexus Wallet</Text>
          <TouchableOpacity onPress={handleSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>
            {isLoading ? 'Loading...' : 'Calculating...'}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <Text style={styles.actionIcon}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSwap}>
            <Text style={styles.actionIcon}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Text style={styles.actionIcon}>Settings</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Balances</Text>
        
        {SUPPORTED_CHAINS.map(chainId => {
          const config = getChainConfig(chainId);
          const address = walletData.addresses[chainId];
          const balance = walletData.balances[chainId];
          
          return (
            <TouchableOpacity
              key={chainId}
              style={styles.chainCard}
              onPress={() => handleChainPress(chainId)}
            >
              <View style={styles.chainHeader}>
                <Text style={styles.chainName}>{config.name}</Text>
                <Text style={styles.chainSymbol}>{config.symbol}</Text>
              </View>
              <Text style={styles.chainBalance}>
                {isLoading ? 'Loading...' : balance}
              </Text>
              <Text style={styles.chainAddress}>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsIcon: {
    fontSize: 24,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    width: 80,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
    color: '#333',
  },
  chainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },
  chainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chainName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chainSymbol: {
    fontSize: 14,
    color: '#666',
  },
  chainBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  chainAddress: {
    fontSize: 12,
    color: '#999',
  },
});
