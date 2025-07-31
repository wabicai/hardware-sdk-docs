---
icon: coins
---

# Supported Coins

Complete list of cryptocurrencies and blockchain networks supported by OneKey Hardware SDK.

## Overview

OneKey Hardware SDK supports over 50 cryptocurrencies across multiple blockchain ecosystems. This comprehensive support enables developers to build applications that work with a wide range of digital assets.

### Support Categories

- ✅ **Full Support** - Complete address generation, transaction signing, and message signing
- 🔄 **Partial Support** - Address generation and basic transaction signing
- 🚧 **In Development** - Coming soon in future releases

## Bitcoin & Bitcoin Forks

### Fully Supported

| Coin | Symbol | Coin Type | Network | Status |
|------|--------|-----------|---------|---------|
| Bitcoin | BTC | 0 | Mainnet | ✅ Full |
| Bitcoin Testnet | TEST | 1 | Testnet | ✅ Full |
| Litecoin | LTC | 2 | Mainnet | ✅ Full |
| Dogecoin | DOGE | 3 | Mainnet | ✅ Full |
| Dash | DASH | 5 | Mainnet | ✅ Full |
| Bitcoin Cash | BCH | 145 | Mainnet | ✅ Full |
| Zcash | ZEC | 133 | Mainnet | ✅ Full |
| Digibyte | DGB | 20 | Mainnet | ✅ Full |
| Vertcoin | VTC | 28 | Mainnet | ✅ Full |
| Peercoin | PPC | 6 | Mainnet | ✅ Full |

### Script Types Supported

| Script Type | Description | Address Format | Support |
|-------------|-------------|----------------|---------|
| P2PKH | Pay to Public Key Hash | 1... (Bitcoin) | ✅ Full |
| P2SH | Pay to Script Hash | 3... (Bitcoin) | ✅ Full |
| P2WPKH | Pay to Witness PubKey Hash | bc1q... (Bitcoin) | ✅ Full |
| P2WSH | Pay to Witness Script Hash | bc1q... (Bitcoin) | ✅ Full |
| P2TR | Pay to Taproot | bc1p... (Bitcoin) | 🚧 Coming Soon |

## Ethereum & EVM Chains

### Fully Supported Networks

| Network | Symbol | Chain ID | RPC Endpoint | Status |
|---------|--------|----------|--------------|---------|
| Ethereum | ETH | 1 | https://mainnet.infura.io | ✅ Full |
| Ethereum Goerli | ETH | 5 | https://goerli.infura.io | ✅ Full |
| Ethereum Sepolia | ETH | 11155111 | https://sepolia.infura.io | ✅ Full |
| Polygon | MATIC | 137 | https://polygon-rpc.com | ✅ Full |
| Polygon Mumbai | MATIC | 80001 | https://rpc-mumbai.matic.today | ✅ Full |
| Binance Smart Chain | BNB | 56 | https://bsc-dataseed.binance.org | ✅ Full |
| BSC Testnet | BNB | 97 | https://data-seed-prebsc-1-s1.binance.org | ✅ Full |
| Avalanche C-Chain | AVAX | 43114 | https://api.avax.network | ✅ Full |
| Avalanche Fuji | AVAX | 43113 | https://api.avax-test.network | ✅ Full |
| Fantom | FTM | 250 | https://rpc.ftm.tools | ✅ Full |
| Fantom Testnet | FTM | 4002 | https://rpc.testnet.fantom.network | ✅ Full |
| Arbitrum One | ETH | 42161 | https://arb1.arbitrum.io/rpc | ✅ Full |
| Arbitrum Goerli | ETH | 421613 | https://goerli-rollup.arbitrum.io/rpc | ✅ Full |
| Optimism | ETH | 10 | https://mainnet.optimism.io | ✅ Full |
| Optimism Goerli | ETH | 420 | https://goerli.optimism.io | ✅ Full |

### ERC Token Standards

| Standard | Description | Support |
|----------|-------------|---------|
| ERC-20 | Fungible Tokens | ✅ Full |
| ERC-721 | Non-Fungible Tokens (NFTs) | ✅ Full |
| ERC-1155 | Multi-Token Standard | ✅ Full |
| ERC-777 | Advanced Token Standard | 🔄 Partial |

### Layer 2 Solutions

| Network | Type | Base Chain | Status |
|---------|------|------------|---------|
| Polygon | Sidechain | Ethereum | ✅ Full |
| Arbitrum | Optimistic Rollup | Ethereum | ✅ Full |
| Optimism | Optimistic Rollup | Ethereum | ✅ Full |
| zkSync Era | ZK Rollup | Ethereum | 🚧 Coming Soon |
| StarkNet | ZK Rollup | Ethereum | 🚧 Coming Soon |

## Solana Ecosystem

### Supported Networks

| Network | Cluster | RPC Endpoint | Status |
|---------|---------|--------------|---------|
| Solana Mainnet | mainnet-beta | https://api.mainnet-beta.solana.com | ✅ Full |
| Solana Devnet | devnet | https://api.devnet.solana.com | ✅ Full |
| Solana Testnet | testnet | https://api.testnet.solana.com | ✅ Full |

### Token Standards

| Standard | Description | Support |
|----------|-------------|---------|
| SPL Token | Solana Program Library Tokens | ✅ Full |
| SPL NFT | Non-Fungible Tokens | ✅ Full |
| Metaplex | NFT Metadata Standard | ✅ Full |

## Cardano Ecosystem

### Supported Networks

| Network | Magic | Era | Status |
|---------|-------|-----|---------|
| Cardano Mainnet | 764824073 | Shelley | ✅ Full |
| Cardano Testnet | 1097911063 | Shelley | ✅ Full |
| Cardano Preview | 2 | Shelley | ✅ Full |
| Cardano Preprod | 1 | Shelley | ✅ Full |

### Address Types

| Type | Description | Support |
|------|-------------|---------|
| Byron | Legacy addresses | ✅ Full |
| Shelley Base | Payment + Staking | ✅ Full |
| Shelley Enterprise | Payment only | ✅ Full |
| Shelley Pointer | Pointer to staking | ✅ Full |
| Shelley Reward | Staking rewards | ✅ Full |

### Native Assets

| Feature | Description | Support |
|---------|-------------|---------|
| ADA | Native currency | ✅ Full |
| Native Tokens | Multi-asset support | ✅ Full |
| NFTs | Non-Fungible Tokens | ✅ Full |
| Metadata | Transaction metadata | ✅ Full |

## Polkadot Ecosystem

### Supported Networks

| Network | Symbol | SS58 Prefix | Coin Type | Status |
|---------|--------|-------------|-----------|---------|
| Polkadot | DOT | 0 | 354 | ✅ Full |
| Kusama | KSM | 2 | 434 | ✅ Full |
| Westend | WND | 42 | 354 | ✅ Full |

### Parachains (Coming Soon)

| Parachain | Symbol | Status |
|-----------|--------|---------|
| Acala | ACA | 🚧 Coming Soon |
| Moonbeam | GLMR | 🚧 Coming Soon |
| Astar | ASTR | 🚧 Coming Soon |
| Parallel | PARA | 🚧 Coming Soon |

## Cosmos Ecosystem

### Supported Networks

| Network | Symbol | Bech32 Prefix | Coin Type | Status |
|---------|--------|---------------|-----------|---------|
| Cosmos Hub | ATOM | cosmos | 118 | ✅ Full |
| Osmosis | OSMO | osmo | 118 | ✅ Full |
| Juno | JUNO | juno | 118 | ✅ Full |
| Secret Network | SCRT | secret | 529 | ✅ Full |
| Terra | LUNA | terra | 330 | ✅ Full |
| Kava | KAVA | kava | 459 | ✅ Full |
| Akash | AKT | akash | 118 | ✅ Full |
| Crypto.org | CRO | cro | 394 | ✅ Full |
| Band Protocol | BAND | band | 494 | ✅ Full |
| IRISnet | IRIS | iaa | 566 | ✅ Full |

### IBC Support

| Feature | Description | Support |
|---------|-------------|---------|
| IBC Transfers | Cross-chain transfers | ✅ Full |
| IBC Tokens | Wrapped tokens | ✅ Full |
| Packet Forwarding | Multi-hop transfers | 🔄 Partial |

## Other Blockchains

### Layer 1 Blockchains

| Blockchain | Symbol | Coin Type | Status |
|------------|--------|-----------|---------|
| Near Protocol | NEAR | 397 | 🚧 Coming Soon |
| Algorand | ALGO | 283 | 🚧 Coming Soon |
| Tezos | XTZ | 1729 | 🚧 Coming Soon |
| Stellar | XLM | 148 | 🚧 Coming Soon |
| Monero | XMR | 128 | 🚧 Coming Soon |

### Stablecoins

| Stablecoin | Networks | Standard | Status |
|------------|----------|----------|---------|
| USDT | Ethereum, BSC, Polygon, Tron | ERC-20, BEP-20 | ✅ Full |
| USDC | Ethereum, BSC, Polygon, Solana | ERC-20, SPL | ✅ Full |
| DAI | Ethereum, BSC, Polygon | ERC-20 | ✅ Full |
| BUSD | Ethereum, BSC | ERC-20, BEP-20 | ✅ Full |
| UST | Terra, Ethereum | Native, ERC-20 | ✅ Full |

## Development Roadmap

### Q1 2024

- ✅ Enhanced Bitcoin Taproot support
- ✅ Solana program interactions
- ✅ Cardano smart contracts
- ✅ Cosmos IBC improvements

### Q2 2024

- 🚧 zkSync Era support
- 🚧 StarkNet integration
- 🚧 Polkadot parachains
- 🚧 Near Protocol support

### Q3 2024

- 🚧 Algorand support
- 🚧 Tezos integration
- 🚧 Enhanced NFT support
- 🚧 Multi-signature wallets

### Q4 2024

- 🚧 Monero support
- 🚧 Lightning Network
- 🚧 Cross-chain bridges
- 🚧 DeFi protocol integrations

## Integration Examples

### Multi-Chain Wallet

```javascript
// Example: Multi-chain address generation
const generateAddresses = async () => {
  const addresses = {};
  
  // Bitcoin
  const btcResult = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
  });
  addresses.bitcoin = btcResult.payload.address;
  
  // Ethereum
  const ethResult = await HardwareSDK.evmGetAddress({
    path: "m/44'/60'/0'/0/0"
  });
  addresses.ethereum = ethResult.payload.address;
  
  // Solana
  const solResult = await HardwareSDK.solGetAddress({
    path: "m/44'/501'/0'/0'"
  });
  addresses.solana = solResult.payload.address;
  
  // Cosmos
  const atomResult = await HardwareSDK.cosmosGetAddress({
    path: "m/44'/118'/0'/0/0",
    hrp: 'cosmos'
  });
  addresses.cosmos = atomResult.payload.address;
  
  return addresses;
};
```

### Cross-Chain Portfolio

```javascript
// Example: Portfolio balance tracking
const getPortfolioBalances = async (addresses) => {
  const balances = {};
  
  // Bitcoin balance
  balances.btc = await getBitcoinBalance(addresses.bitcoin);
  
  // Ethereum balance
  balances.eth = await getEthereumBalance(addresses.ethereum);
  
  // ERC-20 tokens
  balances.usdc = await getERC20Balance(addresses.ethereum, USDC_CONTRACT);
  
  // Solana balance
  balances.sol = await getSolanaBalance(addresses.solana);
  
  // Cosmos balance
  balances.atom = await getCosmosBalance(addresses.cosmos);
  
  return balances;
};
```

## Support Matrix

### By Platform

| Platform | Bitcoin | Ethereum | Solana | Cardano | Polkadot | Cosmos |
|----------|---------|----------|---------|---------|----------|---------|
| Web Browser | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Node.js | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Electron | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| React Native | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### By Feature

| Feature | Bitcoin | Ethereum | Solana | Cardano | Polkadot | Cosmos |
|---------|---------|----------|---------|---------|----------|---------|
| Address Generation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Transaction Signing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Message Signing | ✅ | ✅ | 🔄 | ✅ | 🔄 | 🔄 |
| Multi-Signature | ✅ | ✅ | 🚧 | 🚧 | 🚧 | 🚧 |
| Smart Contracts | N/A | ✅ | ✅ | ✅ | ✅ | ✅ |
| Staking | N/A | ✅ | ✅ | ✅ | ✅ | ✅ |
| NFTs | N/A | ✅ | ✅ | ✅ | 🚧 | 🚧 |

## Getting Help

### Documentation

- [Bitcoin API](../api/bitcoin.md) - Bitcoin and Bitcoin forks
- [Ethereum API](../api/ethereum.md) - Ethereum and EVM chains
- [Solana API](../api/solana.md) - Solana ecosystem
- [Cardano API](../api/cardano.md) - Cardano ecosystem
- [Polkadot API](../api/polkadot.md) - Polkadot ecosystem
- [Cosmos API](../api/cosmos.md) - Cosmos ecosystem

### Community

- **GitHub**: [OneKey Hardware SDK](https://github.com/OneKeyHQ/hardware-js-sdk)
- **Discord**: [OneKey Community](https://discord.gg/onekey)
- **Email**: developer@onekey.so

## Next Steps

- [Device Models](device-models.md) - Supported OneKey devices
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
- [Migration Guide](migration.md) - Upgrading from older versions
- [FAQ](faq.md) - Frequently asked questions
