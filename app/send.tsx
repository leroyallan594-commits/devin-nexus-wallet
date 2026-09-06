import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '../src/context/WalletContext';
import { SUPPORTED_CHAINS, getChainConfig } from '../src/constants/chains';

export default function SendScreen() {
  const router = useRouter();
  const { walletData, isLoading } = useWallet();
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = async () => {
    try {
      if (!toAddress.trim()) {
        Alert.alert('Error', 'Please enter a recipient address');
        return;
      }
      if (!amount.trim()) {
        Alert.alert('Error', 'Please enter an amount');
        return;
      }
      
      Alert.alert('Success', 'Transaction sent successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to send transaction');
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
          <Text style={styles.headerTitle}>Send</Text>
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

          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipient address"
            value={toAddress}
            onChangeText={setToAddress}
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

          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Available Balance:</Text>
            <Text style={styles.balanceValue}>
              {walletData.balances[selectedChain] || '0'} {getChainConfig(selectedChain).symbol}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Sending...' : 'Send'}
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
  balanceInfo: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
