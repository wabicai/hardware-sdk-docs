# OneKey Hardware SDK

Secure blockchain interactions through OneKey hardware wallets.

## Installation

```bash
npm install @onekeyfe/hd-core
```

## Quick Start

```typescript
import HardwareSDK from '@onekeyfe/hd-core';

// Initialize
await HardwareSDK.init({ debug: false });

// Find device
const devices = await HardwareSDK.searchDevices();
const { connectId, deviceId } = devices.payload[0];

// Get Bitcoin address
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```

## Supported Networks

- **Bitcoin** - BTC, LTC, DOGE, BCH + 40+ forks
- **Ethereum** - ETH, Polygon, BSC, Arbitrum, Optimism
- **Solana** - SOL and SPL tokens
- **Cardano** - ADA and native tokens
- **Polkadot** - DOT and parachains
- **Cosmos** - ATOM and IBC tokens
- **Stellar** - XLM and assets
- **Ripple** - XRP

## Documentation

- [Installation Guide](installation.md)
- [API Reference](api-reference/README.md)
- [Quick Start](quick-start.md)

## Response Format

```typescript
{
    success: boolean,
    payload: any
}
```
