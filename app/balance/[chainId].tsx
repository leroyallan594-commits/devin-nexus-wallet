import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWallet } from '../../src/context/WalletContext';
import { getChainConfig } from '../../src/constants/chains';

export default function BalanceScreen() {
  const { chainId } = useLocalSearchParams<{ chainId: string }>();
  const router = useRouter();
  const { walletData, refreshBalances, isLoading } = useWallet();

  useEffect(() => {
    refreshBalances();
  }, [chainId]);

  const config = getChainConfig(chainId);
  const address = walletData.addresses[chainId];
  const balance = walletData.balances[chainId];
  const tokens = walletData.tokens[chainId] || [];

  const handleSend = () => {
    router.push('/send');
  };

  const handleSwap = () => {
    router.push('/swap');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{config.name}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceValue}>
            {isLoading ? 'Loading...' : balance}
          </Text>
          <Text style={styles.balanceSymbol}>{config.symbol}</Text>
        </View>

        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Address</Text>
          <Text style={styles.addressValue}>
            {address || 'N/A'}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <Text style={styles.actionIcon}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSwap}>
            <Text style={styles.actionIcon}>Swap</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Tokens</Text>
        
        {tokens.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No custom tokens added</Text>
          </View>
        ) : (
          tokens.map((token, index) => (
            <View key={index} style={styles.tokenCard}>
              <View style={styles.tokenHeader}>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>
              <Text style={styles.tokenBalance}>
                {token.balance || '0'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 50,
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
  balanceSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 5,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  addressValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
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
    width: 100,
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
  emptyState: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  tokenCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tokenName: {
    fontSize: 14,
    color: '#666',
  },
  tokenBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
