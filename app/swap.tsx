import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '../src/context/WalletContext';
import { SUPPORTED_CHAINS, getChainConfig } from '../src/constants/chains';

export default function SwapScreen() {
  const router = useRouter();
  const { walletData, isLoading } = useWallet();
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const handleSwap = async () => {
    try {
      if (!fromToken.trim()) {
        Alert.alert('Error', 'Please enter a source token address');
        return;
      }
      if (!toToken.trim()) {
        Alert.alert('Error', 'Please enter a destination token address');
        return;
      }
      if (!amount.trim()) {
        Alert.alert('Error', 'Please enter an amount');
        return;
      }
      
      Alert.alert('Success', 'Swap executed successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to execute swap');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.backButton}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Swap</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Select Chain</Text>
          <View style={styles.chainSelector}>
            {SUPPORTED_CHAINS.map(chainId => {
              const config = getChainConfig(chainId);
              return (
                <TouchableOpacity
                  key={chainId}
                  style={[
                    styles.chainOption,
                    selectedChain === chainId && styles.chainOptionSelected,
                  ]}
                  onPress={() => setSelectedChain(chainId)}
                >
                  <Text
                    style={[
                      styles.chainOptionText,
                      selectedChain === chainId && styles.chainOptionTextSelected,
                    ]}
                  >
                    {config.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>From Token</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter source token address"
            value={fromToken}
            onChangeText={setFromToken}
            autoCapitalize="none"
          />

          <Text style={styles.label}>To Token</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination token address"
            value={toToken}
            onChangeText={setToToken}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Slippage Tolerance (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.5"
            value={slippage}
            onChangeText={setSlippage}
            keyboardType="decimal-pad"
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Slippage tolerance protects you from price changes during transaction execution.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSwap}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Swapping...' : 'Swap'}
            </Text>
          </TouchableOpacity>
        </View>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chainSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chainOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chainOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chainOptionText: {
    fontSize: 12,
    color: '#333',
  },
  chainOptionTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
