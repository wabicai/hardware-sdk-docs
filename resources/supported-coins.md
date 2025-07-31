---
icon: coins
---

# Supported Cryptocurrencies

OneKey SDK supports a wide range of cryptocurrencies across different blockchain networks. This page provides a comprehensive list of supported coins and their integration details.

## Bitcoin and Forks

### Bitcoin (BTC)
- **Coin Type**: 0
- **Path**: `m/44'/0'/0'/0/0`
- **Address Types**: Legacy (P2PKH), SegWit (P2WPKH), Wrapped SegWit (P2SH-P2WPKH)
- **Features**: Full support including multisig

```javascript
const result = await sdk.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});
```

### Bitcoin Cash (BCH)
- **Coin Type**: 145
- **Path**: `m/44'/145'/0'/0/0`
- **Address Types**: Legacy, CashAddr format
- **Features**: Transaction signing, message signing

```javascript
const result = await sdk.btcGetAddress({
  path: "m/44'/145'/0'/0/0",
  coin: 'bch'
});
```

### Litecoin (LTC)
- **Coin Type**: 2
- **Path**: `m/44'/2'/0'/0/0`
- **Address Types**: Legacy, SegWit, Wrapped SegWit
- **Features**: Full Bitcoin-compatible features

```javascript
const result = await sdk.btcGetAddress({
  path: "m/44'/2'/0'/0/0",
  coin: 'ltc'
});
```

### Dogecoin (DOGE)
- **Coin Type**: 3
- **Path**: `m/44'/3'/0'/0/0`
- **Address Types**: Legacy (P2PKH)
- **Features**: Transaction signing, message signing

```javascript
const result = await sdk.btcGetAddress({
  path: "m/44'/3'/0'/0/0",
  coin: 'doge'
});
```

### Other Bitcoin Forks

| Coin | Symbol | Coin Type | Path | Features |
|------|--------|-----------|------|----------|
| Bitcoin Gold | BTG | 156 | `m/44'/156'/0'/0/0` | Basic support |
| Zcash | ZEC | 133 | `m/44'/133'/0'/0/0` | Transparent addresses |
| Dash | DASH | 5 | `m/44'/5'/0'/0/0` | Basic support |
| DigiByte | DGB | 20 | `m/44'/20'/0'/0/0` | Basic support |

## Ethereum and EVM Chains

### Ethereum (ETH)
- **Coin Type**: 60
- **Path**: `m/44'/60'/0'/0/0`
- **Features**: Full EVM support, EIP-712 signing, contract interaction

```javascript
const result = await sdk.ethereumGetAddress({
  path: "m/44'/60'/0'/0/0"
});
```

### Ethereum Classic (ETC)
- **Coin Type**: 61
- **Path**: `m/44'/61'/0'/0/0`
- **Features**: Full EVM support

```javascript
const result = await sdk.ethereumGetAddress({
  path: "m/44'/61'/0'/0/0"
});
```

### EVM-Compatible Networks

| Network | Chain ID | RPC URL | Features |
|---------|----------|---------|----------|
| Binance Smart Chain | 56 | https://bsc-dataseed.binance.org/ | Full EVM |
| Polygon | 137 | https://polygon-rpc.com/ | Full EVM |
| Avalanche C-Chain | 43114 | https://api.avax.network/ext/bc/C/rpc | Full EVM |
| Fantom | 250 | https://rpc.ftm.tools/ | Full EVM |
| Arbitrum One | 42161 | https://arb1.arbitrum.io/rpc | Full EVM |
| Optimism | 10 | https://mainnet.optimism.io | Full EVM |

```javascript
// Example for BSC
const result = await sdk.ethereumSignTransaction({
  path: "m/44'/60'/0'/0/0",
  transaction: {
    to: "0x...",
    value: "0x...",
    gasLimit: "0x5208",
    gasPrice: "0x...",
    nonce: "0x...",
    chainId: 56 // BSC chain ID
  }
});
```

## Other Major Blockchains

### Solana (SOL)
- **Coin Type**: 501
- **Path**: `m/44'/501'/0'/0/0`
- **Features**: Address generation, transaction signing, message signing

```javascript
const result = await sdk.solanaGetAddress({
  path: "m/44'/501'/0'/0/0"
});
```

### Cardano (ADA)
- **Coin Type**: 1815
- **Path**: `m/1852'/1815'/0'/0/0` (BIP1852)
- **Features**: Address generation, transaction signing

```javascript
const result = await sdk.cardanoGetAddress({
  path: "m/1852'/1815'/0'/0/0"
});
```

### Polkadot (DOT)
- **Coin Type**: 354
- **Path**: `m/44'/354'/0'/0/0`
- **Features**: Address generation, transaction signing

### Cosmos (ATOM)
- **Coin Type**: 118
- **Path**: `m/44'/118'/0'/0/0`
- **Features**: Address generation, transaction signing

### Near Protocol (NEAR)
- **Coin Type**: 397
- **Path**: `m/44'/397'/0'/0/0`
- **Features**: Address generation, transaction signing

## Testnet Support

### Bitcoin Testnet
- **Coin Type**: 1
- **Path**: `m/44'/1'/0'/0/0`
- **Network**: Bitcoin Testnet

```javascript
const result = await sdk.btcGetAddress({
  path: "m/44'/1'/0'/0/0",
  coin: 'test'
});
```

### Ethereum Testnets

| Network | Chain ID | Features |
|---------|----------|----------|
| Goerli | 5 | Full EVM support |
| Sepolia | 11155111 | Full EVM support |
| Ropsten | 3 | Deprecated |

## Token Support

### ERC-20 Tokens
OneKey SDK supports all ERC-20 tokens on Ethereum and EVM-compatible chains:

```javascript
// ERC-20 token transfer
const result = await sdk.ethereumSignTransaction({
  path: "m/44'/60'/0'/0/0",
  transaction: {
    to: "0x...", // Token contract address
    value: "0x0",
    data: "0xa9059cbb...", // transfer(to, amount) function call
    gasLimit: "0x5208",
    gasPrice: "0x...",
    nonce: "0x...",
    chainId: 1
  }
});
```

### SPL Tokens (Solana)
Support for Solana SPL tokens:

```javascript
const result = await sdk.solanaSignTransaction({
  path: "m/44'/501'/0'/0/0",
  transaction: {
    // SPL token transfer transaction
  }
});
```

### Native Tokens
Support for native tokens on various chains:

| Chain | Native Token | Symbol |
|-------|--------------|--------|
| Ethereum | Ether | ETH |
| Binance Smart Chain | BNB | BNB |
| Polygon | MATIC | MATIC |
| Avalanche | AVAX | AVAX |
| Fantom | FTM | FTM |

## Feature Matrix

| Blockchain | Address Generation | Transaction Signing | Message Signing | Contract Interaction |
|------------|-------------------|-------------------|-----------------|-------------------|
| Bitcoin | ✅ | ✅ | ✅ | ❌ |
| Ethereum | ✅ | ✅ | ✅ | ✅ |
| Solana | ✅ | ✅ | ✅ | ✅ |
| Cardano | ✅ | ✅ | ❌ | ❌ |
| Polkadot | ✅ | ✅ | ❌ | ❌ |
| Cosmos | ✅ | ✅ | ❌ | ❌ |

## Adding New Coins

### Request Support
To request support for a new cryptocurrency:

1. **Check Compatibility**: Ensure the coin follows standard derivation paths
2. **Submit Request**: Create an issue on [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
3. **Provide Details**: Include coin specifications, derivation paths, and use cases

### Custom Implementation
For custom coins, you can extend the SDK:

```javascript
// Example custom coin configuration
const customCoin = {
  name: 'CustomCoin',
  symbol: 'CUSTOM',
  coinType: 9999,
  path: "m/44'/9999'/0'/0/0",
  addressFormat: 'custom'
};
```

## Coin-Specific Notes

### Bitcoin
- Supports all major address formats
- Full multisig support
- RBF (Replace-by-Fee) support

### Ethereum
- Full EVM compatibility
- EIP-712 typed data signing
- Contract interaction support
- Layer 2 solutions supported

### Solana
- Ed25519 signature scheme
- Program interaction support
- Associated token accounts

### Cardano
- Uses BIP1852 instead of BIP44
- Shelley era addresses
- Staking support planned

## Migration Guide

### From Other Wallets
When migrating from other hardware wallets:

1. **Check Derivation Paths**: Ensure paths match your existing wallet
2. **Verify Addresses**: Always verify the first address on device
3. **Test Small Amounts**: Start with small transactions

### Path Compatibility

| Wallet | Bitcoin Path | Ethereum Path |
|--------|--------------|---------------|
| OneKey | `m/44'/0'/0'/0/0` | `m/44'/60'/0'/0/0` |
| Ledger | `m/44'/0'/0'/0/0` | `m/44'/60'/0'/0/0` |
| Trezor | `m/44'/0'/0'/0/0` | `m/44'/60'/0'/0/0` |

## Next Steps

- [Derivation Paths](../concepts/paths.md) - Understanding address generation
- [Bitcoin Methods](../api/bitcoin.md) - Bitcoin-specific operations
- [Ethereum Methods](../api/ethereum.md) - Ethereum-specific operations
- [Device Models](device-models.md) - Supported OneKey devices
