# Ethereum & EVM

Ethereum and EVM-compatible blockchain support for OneKey Air Gap SDK. This module provides secure, offline signing for Ethereum transactions and messages.

## Account Management

To obtain an ETH account, use the basic API [`CryptoHDKey`](../basic-api/cryptohdkey.md) with Ethereum-specific derivation paths:

```typescript
// Standard Ethereum derivation path: m/44'/60'/0'/0/0
const keypath = new CryptoKeypath([44, 60, 0, 0, 0]);
const coinInfo = new CryptoCoinInfo({ type: 60 }); // ETH coin type
const hdkey = new CryptoHDKey({ keypath, coinInfo });
```

## Signing Requests

Use `EthSignRequest` to request signatures from the hardware device. Currently supported transaction types:

### Transaction Types
- **EIP-1559 Transactions** - Modern fee market transactions
- **Legacy Transactions** - Traditional Ethereum transactions  
- **EIP-712 TypedData** - Structured data signing
- **Personal Messages** - Plain text message signing

### Creating Sign Requests

**[EthSignRequest](ethsignrequest.md)** - Complete signing request specification:
- Transaction data encoding
- Message formatting
- QR code generation
- Request validation

## Signature Results

All signing operations return standardized signature data:

**[EthSignature](ethsignature.md)** - Signature response format:
- ECDSA signature components (r, s, v)
- Recovery ID handling
- Signature verification
- Result processing

## Supported Networks

The Ethereum module supports all EVM-compatible networks:
- **Ethereum Mainnet** - Primary Ethereum network
- **Ethereum Testnets** - Goerli, Sepolia, Holesky
- **Layer 2 Solutions** - Polygon, Arbitrum, Optimism
- **EVM Sidechains** - BSC, Avalanche, Fantom
- **Custom Networks** - Any EVM-compatible blockchain

## Security Features

- **Offline Signing** - Private keys never leave the device
- **Transaction Verification** - Full transaction details displayed
- **Address Validation** - Recipient address confirmation
- **Amount Verification** - Transaction value confirmation
- **Gas Limit Protection** - Prevent excessive gas usage
