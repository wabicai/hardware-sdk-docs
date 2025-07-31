---
icon: circle-dot
---

# Polkadot

Polkadot and Substrate-based blockchain operations including address generation, transaction signing, and message signing.

## Overview

Polkadot is a multi-chain blockchain platform that enables different blockchains to transfer messages and value in a trust-free fashion. OneKey supports Polkadot and many Substrate-based chains including:

- Polkadot (DOT)
- Kusama (KSM)
- Westend (WND)
- And other Substrate-based parachains

## polkadotGetAddress()

Get Polkadot address from device.

### Syntax

```javascript
await HardwareSDK.polkadotGetAddress(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `prefix` | `number` | Yes | SS58 address prefix (0=Polkadot, 2=Kusama, 42=Westend) |
| `network` | `string` | Yes | Network name ('polkadot', 'kusama', 'westend') |
| `showOnDevice` | `boolean` | No | Show address on device screen (default: false) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    address: string;
    publicKey: string;
    path: string;
  }
}>
```

### Examples

```javascript
// Get Polkadot address
const result = await HardwareSDK.polkadotGetAddress({
  path: "m/44'/354'/0'/0'/0'",
  prefix: 0,
  network: 'polkadot',
  showOnDevice: true
});

if (result.success) {
  console.log('Polkadot address:', result.payload.address);
  console.log('Public key:', result.payload.publicKey);
}

// Get Kusama address
const kusamaResult = await HardwareSDK.polkadotGetAddress({
  path: "m/44'/434'/0'/0'/0'",
  prefix: 2,
  network: 'kusama',
  showOnDevice: true
});

// Get Westend testnet address
const westendResult = await HardwareSDK.polkadotGetAddress({
  path: "m/44'/354'/0'/0'/0'",
  prefix: 42,
  network: 'westend',
  showOnDevice: true
});
```

## polkadotSignTransaction()

Sign Polkadot transaction.

### Syntax

```javascript
await HardwareSDK.polkadotSignTransaction(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `rawTx` | `string` | Yes | Raw transaction data (hex) |
| `network` | `string` | Yes | Network name |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    signature: string;
  }
}>
```

### Examples

```javascript
// Simple DOT transfer
const transferTx = await HardwareSDK.polkadotSignTransaction({
  path: "m/44'/354'/0'/0'/0'",
  rawTx: "0x4502840..." // Raw transaction hex
  network: 'polkadot'
});

if (transferTx.success) {
  console.log('Transaction signature:', transferTx.payload.signature);
}

// Staking transaction
const stakingTx = await HardwareSDK.polkadotSignTransaction({
  path: "m/44'/354'/0'/0'/0'",
  rawTx: "0x5502840..." // Staking transaction hex
  network: 'polkadot'
});

// Governance vote
const voteTx = await HardwareSDK.polkadotSignTransaction({
  path: "m/44'/354'/0'/0'/0'",
  rawTx: "0x6502840..." // Vote transaction hex
  network: 'polkadot'
});
```

## Supported Networks

### Network Configuration

```javascript
const PolkadotNetworks = {
  polkadot: {
    name: 'Polkadot',
    prefix: 0,
    coinType: 354,
    decimals: 10,
    symbol: 'DOT'
  },
  kusama: {
    name: 'Kusama',
    prefix: 2,
    coinType: 434,
    decimals: 12,
    symbol: 'KSM'
  },
  westend: {
    name: 'Westend',
    prefix: 42,
    coinType: 354,
    decimals: 12,
    symbol: 'WND'
  }
};

// Helper function to get network config
const getNetworkConfig = (network) => {
  return PolkadotNetworks[network];
};
```

## Derivation Paths

### Standard Polkadot Paths

```javascript
// Polkadot derivation paths
const polkadotPaths = {
  polkadot: {
    account0: "m/44'/354'/0'/0'/0'",
    account1: "m/44'/354'/1'/0'/0'",
    stash0: "m/44'/354'/0'/0'/0'",
    controller0: "m/44'/354'/0'/1'/0'"
  },
  kusama: {
    account0: "m/44'/434'/0'/0'/0'",
    account1: "m/44'/434'/1'/0'/0'",
    stash0: "m/44'/434'/0'/0'/0'",
    controller0: "m/44'/434'/0'/1'/0'"
  }
};

// Helper functions
const getPolkadotPath = (network, account = 0, change = 0, index = 0) => {
  const coinType = network === 'kusama' ? 434 : 354;
  return `m/44'/${coinType}'/${account}'/${change}'/${index}'`;
};
```

## Transaction Types

### Balance Transfer

```javascript
// Build balance transfer transaction
const buildTransfer = async (from, to, amount, network = 'polkadot') => {
  // Use @polkadot/api to build transaction
  const { ApiPromise, WsProvider } = require('@polkadot/api');
  
  const wsProvider = new WsProvider(`wss://rpc.polkadot.io`);
  const api = await ApiPromise.create({ provider: wsProvider });
  
  // Create transfer extrinsic
  const transfer = api.tx.balances.transfer(to, amount);
  
  // Get transaction info
  const nonce = await api.rpc.system.accountNextIndex(from);
  const blockHash = await api.rpc.chain.getBlockHash();
  const blockHeader = await api.rpc.chain.getHeader(blockHash);
  const era = api.createType('ExtrinsicEra', {
    current: blockHeader.number,
    period: 64
  });
  
  // Build raw transaction
  const rawTx = transfer.method.toHex();
  
  return await HardwareSDK.polkadotSignTransaction({
    path: "m/44'/354'/0'/0'/0'",
    rawTx,
    network
  });
};
```

### Staking Operations

```javascript
// Bond tokens for staking
const buildBond = async (controller, value, payee, network = 'polkadot') => {
  const { ApiPromise, WsProvider } = require('@polkadot/api');
  
  const wsProvider = new WsProvider(`wss://rpc.polkadot.io`);
  const api = await ApiPromise.create({ provider: wsProvider });
  
  // Create bond extrinsic
  const bond = api.tx.staking.bond(controller, value, payee);
  const rawTx = bond.method.toHex();
  
  return await HardwareSDK.polkadotSignTransaction({
    path: "m/44'/354'/0'/0'/0'",
    rawTx,
    network
  });
};

// Nominate validators
const buildNominate = async (validators, network = 'polkadot') => {
  const { ApiPromise, WsProvider } = require('@polkadot/api');
  
  const wsProvider = new WsProvider(`wss://rpc.polkadot.io`);
  const api = await ApiPromise.create({ provider: wsProvider });
  
  // Create nominate extrinsic
  const nominate = api.tx.staking.nominate(validators);
  const rawTx = nominate.method.toHex();
  
  return await HardwareSDK.polkadotSignTransaction({
    path: "m/44'/354'/0'/1'/0'", // Controller account
    rawTx,
    network
  });
};

// Unbond tokens
const buildUnbond = async (value, network = 'polkadot') => {
  const { ApiPromise, WsProvider } = require('@polkadot/api');
  
  const wsProvider = new WsProvider(`wss://rpc.polkadot.io`);
  const api = await ApiPromise.create({ provider: wsProvider });
  
  // Create unbond extrinsic
  const unbond = api.tx.staking.unbond(value);
  const rawTx = unbond.method.toHex();
  
  return await HardwareSDK.polkadotSignTransaction({
    path: "m/44'/354'/0'/1'/0'", // Controller account
    rawTx,
    network
  });
};
```

### Governance

```javascript
// Vote on referendum
const buildVote = async (referendumIndex, vote, network = 'polkadot') => {
  const { ApiPromise, WsProvider } = require('@polkadot/api');
  
  const wsProvider = new WsProvider(`wss://rpc.polkadot.io`);
  const api = await ApiPromise.create({ provider: wsProvider });
  
  // Create vote extrinsic
  const voteExtrinsic = api.tx.democracy.vote(referendumIndex, vote);
  const rawTx = voteExtrinsic.method.toHex();
  
  return await HardwareSDK.polkadotSignTransaction({
    path: "m/44'/354'/0'/0'/0'",
    rawTx,
    network
  });
};

// Propose referendum
const buildProposal = async (proposal, value, network = 'polkadot') => {
  const { ApiPromise, WsProvider } = require('@polkadot/api');
  
  const wsProvider = new WsProvider(`wss://rpc.polkadot.io`);
  const api = await ApiPromise.create({ provider: wsProvider });
  
  // Create proposal extrinsic
  const propose = api.tx.democracy.propose(proposal, value);
  const rawTx = propose.method.toHex();
  
  return await HardwareSDK.polkadotSignTransaction({
    path: "m/44'/354'/0'/0'/0'",
    rawTx,
    network
  });
};
```

## Utility Functions

### Address Validation

```javascript
// Validate Polkadot address format
const isValidPolkadotAddress = (address, expectedPrefix = null) => {
  try {
    const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
    const { isHex } = require('@polkadot/util');
    
    // Decode address to get public key
    const publicKey = decodeAddress(address);
    
    // Check if it's a valid hex string
    if (!isHex(publicKey)) {
      return false;
    }
    
    // If expected prefix is provided, check it
    if (expectedPrefix !== null) {
      const reencoded = encodeAddress(publicKey, expectedPrefix);
      return reencoded === address;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Convert address between networks
const convertAddress = (address, targetPrefix) => {
  const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
  
  try {
    const publicKey = decodeAddress(address);
    return encodeAddress(publicKey, targetPrefix);
  } catch (error) {
    throw new Error('Invalid address format');
  }
};
```

### Amount Conversion

```javascript
// Convert DOT to Planck (smallest unit)
const dotToPlanck = (dot, network = 'polkadot') => {
  const decimals = PolkadotNetworks[network].decimals;
  return dot * Math.pow(10, decimals);
};

// Convert Planck to DOT
const planckToDot = (planck, network = 'polkadot') => {
  const decimals = PolkadotNetworks[network].decimals;
  return planck / Math.pow(10, decimals);
};

// Format amount for display
const formatAmount = (amount, network = 'polkadot') => {
  const config = PolkadotNetworks[network];
  const formatted = planckToDot(amount, network);
  return `${formatted.toFixed(4)} ${config.symbol}`;
};
```

## Error Handling

### Common Polkadot Errors

```javascript
try {
  const result = await HardwareSDK.polkadotGetAddress({
    path: "m/44'/354'/0'/0'/0'",
    prefix: 0,
    network: 'polkadot'
  });
  
  if (!result.success) {
    switch (result.payload.error) {
      case 'Invalid_Path':
        console.error('Invalid Polkadot derivation path');
        break;
      case 'Invalid_Network':
        console.error('Unsupported network');
        break;
      case 'User_Cancelled':
        console.error('User cancelled operation');
        break;
      default:
        console.error('Polkadot operation failed:', result.payload.error);
    }
  }
} catch (error) {
  console.error('SDK error:', error.message);
}
```

## Best Practices

### Address Verification

```javascript
// Always verify addresses on device for receiving funds
const getReceiveAddress = async (network = 'polkadot', account = 0) => {
  const config = PolkadotNetworks[network];
  const path = getPolkadotPath(network, account);
  
  const result = await HardwareSDK.polkadotGetAddress({
    path,
    prefix: config.prefix,
    network,
    showOnDevice: true // Important: show on device
  });
  
  if (result.success) {
    return result.payload.address;
  }
  
  throw new Error('Failed to get verified address');
};
```

### Transaction Building

```javascript
// Polkadot transaction builder
class PolkadotTransactionBuilder {
  constructor(network = 'polkadot') {
    this.network = network;
    this.config = PolkadotNetworks[network];
  }
  
  async buildTransfer(fromPath, toAddress, amount) {
    const { ApiPromise, WsProvider } = require('@polkadot/api');
    
    // Connect to network
    const wsProvider = new WsProvider(this.getWsEndpoint());
    const api = await ApiPromise.create({ provider: wsProvider });
    
    // Create transfer extrinsic
    const transfer = api.tx.balances.transfer(toAddress, amount);
    
    // Get raw transaction
    const rawTx = transfer.method.toHex();
    
    return await HardwareSDK.polkadotSignTransaction({
      path: fromPath,
      rawTx,
      network: this.network
    });
  }
  
  getWsEndpoint() {
    const endpoints = {
      polkadot: 'wss://rpc.polkadot.io',
      kusama: 'wss://kusama-rpc.polkadot.io',
      westend: 'wss://westend-rpc.polkadot.io'
    };
    
    return endpoints[this.network];
  }
  
  async getBalance(address) {
    const { ApiPromise, WsProvider } = require('@polkadot/api');
    
    const wsProvider = new WsProvider(this.getWsEndpoint());
    const api = await ApiPromise.create({ provider: wsProvider });
    
    const account = await api.query.system.account(address);
    return account.data.free.toString();
  }
}
```

## Next Steps

- [Cosmos](cosmos.md) - Cosmos ecosystem chains
- [Solana](solana.md) - Solana blockchain operations
- [Cardano](cardano.md) - Cardano blockchain operations
- [Device Management](device.md) - Device connection and management
