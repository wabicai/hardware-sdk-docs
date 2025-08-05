# Basic API

Core data structures and utilities for OneKey Air Gap SDK. These fundamental types are used across all blockchain implementations.

## Core Types

### [CryptoCoinInfo](cryptocoininfo.md)
Cryptocurrency metadata and network information:
- Network identification (mainnet, testnet)
- Coin type and symbol
- Derivation path standards
- Network-specific parameters

### [CryptoHDKey](cryptohdkey.md)
Hierarchical Deterministic (HD) key representation:
- Extended public/private keys
- Chain codes and key derivation
- BIP32 compliance
- Multi-level key hierarchies

### [CryptoKeypath](cryptokeypath.md)
BIP32 derivation path specification:
- Path component encoding
- Hardened/non-hardened derivation
- Path validation and parsing
- Standard derivation patterns

## Usage Patterns

These basic types are typically used together:

```typescript
// Example: Creating a signing request
const coinInfo = new CryptoCoinInfo({
  type: 0, // Bitcoin
  network: 0 // Mainnet
});

const keypath = new CryptoKeypath([
  44, // BIP44
  0,  // Bitcoin
  0,  // Account 0
  0,  // External chain
  0   // Address index 0
]);

const hdkey = new CryptoHDKey({
  keypath: keypath,
  coinInfo: coinInfo
});
```

## Standards Compliance

All basic API types follow established standards:
- **BIP32** - Hierarchical Deterministic Wallets
- **BIP44** - Multi-Account Hierarchy
- **SLIP-44** - Registered Coin Types
- **UR/CBOR** - Data encoding standards

