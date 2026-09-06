import 'react-native-get-random-values';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WalletProvider } from './src/context/WalletContext';

export default function App() {
  return (
    <WalletProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Nexus Wallet' }} />
        <Stack.Screen name="create-wallet" options={{ title: 'Create Wallet' }} />
        <Stack.Screen name="unlock" options={{ title: 'Unlock Wallet' }} />
        <Stack.Screen name="balance/[chainId]" options={{ title: 'Balance' }} />
        <Stack.Screen name="send" options={{ title: 'Send' }} />
        <Stack.Screen name="swap" options={{ title: 'Swap' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </WalletProvider>
  );
}
