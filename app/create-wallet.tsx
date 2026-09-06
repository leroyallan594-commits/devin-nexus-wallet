import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '../src/context/WalletContext';

export default function CreateWalletScreen() {
  const router = useRouter();
  const { createWallet, importWallet, isLoading } = useWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [isImport, setIsImport] = useState(false);

  const handleCreateNew = async () => {
    try {
      await createWallet();
      Alert.alert('Success', 'Wallet created successfully!');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet');
    }
  };

  const handleImport = async () => {
    try {
      if (!mnemonic.trim()) {
        Alert.alert('Error', 'Please enter a mnemonic phrase');
        return;
      }
      await importWallet(mnemonic.trim());
      Alert.alert('Success', 'Wallet imported successfully!');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to import wallet. Please check your mnemonic.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isImport ? 'Import Wallet' : 'Create New Wallet'}
        </Text>
        
        <Text style={styles.description}>
          {isImport 
            ? 'Enter your 12-word mnemonic phrase to import your existing wallet.'
            : 'Create a new wallet with a randomly generated 12-word mnemonic phrase. Keep it safe!'
          }
        </Text>

        {isImport && (
          <TextInput
            style={styles.input}
            placeholder="Enter 12-word mnemonic phrase"
            value={mnemonic}
            onChangeText={setMnemonic}
            multiline
            numberOfLines={3}
            autoCapitalize="none"
          />
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={isImport ? handleImport : handleCreateNew}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : (isImport ? 'Import Wallet' : 'Create Wallet')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            setIsImport(!isImport);
            setMnemonic('');
          }}
        >
          <Text style={styles.toggleButtonText}>
            {isImport ? 'Create New Wallet Instead' : 'Import Existing Wallet Instead'}
          </Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleButton: {
    paddingVertical: 10,
  },
  toggleButtonText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
