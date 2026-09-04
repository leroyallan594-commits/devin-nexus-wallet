# Nexus – Non‑KYC Crypto Wallet & DEX

A secure, self‑custodial mobile wallet and decentralized exchange (DEX) aggregator built with Expo React Native.

## Features

- **Multi‑chain support**: Ethereum, BSC, Polygon, Solana, Bitcoin
- **Self‑custody**: BIP39 mnemonic secured with biometric authentication
- **DEX aggregation**: 1inch for EVM chains, Jupiter for Solana
- **Custom tokens**: Add any ERC‑20 / BEP‑20 / SPL token by contract address
- **Swap**: Get quotes and execute swaps with slippage control
- **Portfolio**: Aggregate view of balances across all chains
- **Activity**: Transaction history

## Tech Stack

- **Expo** (SDK ~57) with React Native, Expo Router
- **TypeScript**
- **Blockchain libraries**: `ethers` v6, `@solana/web3.js`, `bitcoinjs-lib`, `bip39`, `ed25519-hd-key`
- **Secure storage**: `expo-secure-store`, `expo-local-authentication`
- **HTTP client**: `axios`
- **Testing**: `vitest`, `@testing-library/react-native`
- **Code quality**: `eslint`, `prettier`

## Security

- Private keys and mnemonics are never stored in plaintext
- All sensitive data is secured with `expo-secure-store` and biometric authentication
- Transaction signing happens securely without exposing keys to the UI
- All user inputs are validated before blockchain interactions

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file with:
   ```
   INFURA_PROJECT_ID=your_infura_project_id
   ONEINCH_API_KEY=your_1inch_api_key
   ```

3. Run the app:
   ```bash
   npm start
   ```

## Build

For iOS:
```bash
eas build --platform ios
```

For Android:
```bash
eas build --platform android
```

## License

MIT
