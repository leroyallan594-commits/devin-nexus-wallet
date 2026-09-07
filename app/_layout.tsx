import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WalletProvider } from '../src/context/WalletContext';

export default function RootLayout() {
  return (
    <WalletProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-wallet" />
        <Stack.Screen name="unlock" />
        <Stack.Screen name="balance/[chainId]" />
        <Stack.Screen name="send" />
        <Stack.Screen name="swap" />
        <Stack.Screen name="settings" />
      </Stack>
    </WalletProvider>
  );
}
