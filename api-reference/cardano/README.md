---
icon: heart
---

# Cardano

Cardano blockchain operations including address generation, transaction signing, and message signing.

## Overview

Cardano is a proof-of-stake blockchain platform that supports smart contracts and native tokens. OneKey provides comprehensive support for Cardano operations including:

- Address generation for different address types
- Transaction signing with UTXOs
- Message signing for authentication
- Support for native tokens and metadata

## cardanoGetAddress()

Get Cardano address from device.

### Syntax

```javascript
await HardwareSDK.cardanoGetAddress(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `showOnDevice` | `boolean` | No | Show address on device screen (default: false) |
| `addressType` | `number` | No | Address type (0=Byron, 1=Shelley base, 2=Shelley pointer, 3=Shelley enterprise, 4=Shelley reward) |
| `stakingPath` | `string` | No | Staking key derivation path (for base addresses) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    address: string;
    path: string;
  }
}>
```

### Examples

```javascript
// Get Shelley base address (most common)
const result = await HardwareSDK.cardanoGetAddress({
  path: "m/1852'/1815'/0'/0/0",
  showOnDevice: true,
  addressType: 1,
  stakingPath: "m/1852'/1815'/0'/2/0"
});

if (result.success) {
  console.log('Cardano address:', result.payload.address);
}

// Get enterprise address (no staking)
const enterpriseResult = await HardwareSDK.cardanoGetAddress({
  path: "m/1852'/1815'/0'/0/0",
  showOnDevice: true,
  addressType: 3
});

// Get reward address (for staking)
const rewardResult = await HardwareSDK.cardanoGetAddress({
  path: "m/1852'/1815'/0'/2/0",
  showOnDevice: true,
  addressType: 4
});
```

## cardanoGetPublicKey()

Get Cardano public key from device.

### Syntax

```javascript
await HardwareSDK.cardanoGetPublicKey(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `showOnDevice` | `boolean` | No | Show on device (default: false) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    publicKey: string;
    path: string;
    chainCode: string;
  }
}>
```

### Example

```javascript
const result = await HardwareSDK.cardanoGetPublicKey({
  path: "m/1852'/1815'/0'",
  showOnDevice: false
});

if (result.success) {
  console.log('Public key:', result.payload.publicKey);
  console.log('Chain code:', result.payload.chainCode);
}
```

## cardanoSignTransaction()

Sign Cardano transaction.

### Syntax

```javascript
await HardwareSDK.cardanoSignTransaction(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `inputs` | `Array` | Yes | Transaction inputs (UTXOs) |
| `outputs` | `Array` | Yes | Transaction outputs |
| `fee` | `string` | Yes | Transaction fee in lovelace |
| `ttl` | `string` | No | Time to live (slot number) |
| `certificates` | `Array` | No | Staking certificates |
| `withdrawals` | `Array` | No | Reward withdrawals |
| `metadata` | `string` | No | Transaction metadata (hex) |

### Input Object

```typescript
interface CardanoInput {
  path: string;              // Derivation path
  prev_hash: string;         // Previous transaction hash
  prev_index: number;        // Previous output index
}
```

### Output Object

```typescript
interface CardanoOutput {
  address?: string;          // Output address
  addressParameters?: {      // Or address parameters for change
    addressType: number;
    path: string;
    stakingPath?: string;
  };
  amount: string;           // Amount in lovelace
  tokenBundle?: Array<{     // Native tokens
    policyId: string;
    tokens: Array<{
      assetName: string;
      amount: string;
    }>;
  }>;
}
```

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    hash: string;
    witnesses: Array<{
      type: number;
      pubKey: string;
      signature: string;
      chainCode?: string;
    }>;
  }
}>
```

### Examples

```javascript
// Simple ADA transfer
const result = await HardwareSDK.cardanoSignTransaction({
  inputs: [{
    path: "m/1852'/1815'/0'/0/0",
    prev_hash: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
    prev_index: 0
  }],
  outputs: [{
    address: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp",
    amount: "1000000" // 1 ADA
  }, {
    // Change output
    addressParameters: {
      addressType: 1,
      path: "m/1852'/1815'/0'/1/0",
      stakingPath: "m/1852'/1815'/0'/2/0"
    },
    amount: "8000000" // Change amount
  }],
  fee: "200000", // 0.2 ADA fee
  ttl: "50000000"
});

if (result.success) {
  console.log('Transaction hash:', result.payload.hash);
  console.log('Witnesses:', result.payload.witnesses);
}

// Transaction with native tokens
const tokenResult = await HardwareSDK.cardanoSignTransaction({
  inputs: [{
    path: "m/1852'/1815'/0'/0/0",
    prev_hash: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
    prev_index: 0
  }],
  outputs: [{
    address: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp",
    amount: "1500000",
    tokenBundle: [{
      policyId: "b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7",
      tokens: [{
        assetName: "4e7574636f696e",
        amount: "1000"
      }]
    }]
  }],
  fee: "200000"
});

// Staking transaction
const stakingResult = await HardwareSDK.cardanoSignTransaction({
  inputs: [{
    path: "m/1852'/1815'/0'/0/0",
    prev_hash: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
    prev_index: 0
  }],
  outputs: [{
    addressParameters: {
      addressType: 1,
      path: "m/1852'/1815'/0'/0/0",
      stakingPath: "m/1852'/1815'/0'/2/0"
    },
    amount: "9800000"
  }],
  fee: "200000",
  certificates: [{
    type: 0, // Stake registration
    path: "m/1852'/1815'/0'/2/0"
  }, {
    type: 2, // Stake delegation
    path: "m/1852'/1815'/0'/2/0",
    pool: "pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy"
  }]
});
```

## cardanoSignMessage()

Sign message with Cardano private key.

### Syntax

```javascript
await HardwareSDK.cardanoSignMessage(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `message` | `string` | Yes | Message to sign (hex) |
| `hashPayload` | `boolean` | No | Whether to hash the payload (default: true) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    publicKey: string;
    signature: string;
  }
}>
```

### Example

```javascript
const result = await HardwareSDK.cardanoSignMessage({
  path: "m/1852'/1815'/0'/0/0",
  message: "48656c6c6f20436172646162", // "Hello Cardano" in hex
  hashPayload: true
});

if (result.success) {
  console.log('Public key:', result.payload.publicKey);
  console.log('Signature:', result.payload.signature);
}
```

## Derivation Paths

### Cardano CIP-1852 Paths

```javascript
// Cardano uses coin type 1815 and CIP-1852 standard
const cardanoPaths = {
  // Payment addresses
  payment: {
    account0: "m/1852'/1815'/0'/0/0",
    account1: "m/1852'/1815'/1'/0/0",
    change0: "m/1852'/1815'/0'/1/0"
  },
  
  // Staking addresses
  staking: {
    account0: "m/1852'/1815'/0'/2/0",
    account1: "m/1852'/1815'/1'/2/0"
  }
};

// Helper functions
const getPaymentPath = (account = 0, change = 0, index = 0) => {
  return `m/1852'/1815'/${account}'/${change}/${index}`;
};

const getStakingPath = (account = 0) => {
  return `m/1852'/1815'/${account}'/2/0`;
};
```

### Address Types

```javascript
const AddressType = {
  BYRON: 0,           // Legacy Byron addresses
  BASE: 1,            // Shelley base addresses (payment + staking)
  POINTER: 2,         // Shelley pointer addresses
  ENTERPRISE: 3,      // Shelley enterprise addresses (payment only)
  REWARD: 4           // Shelley reward addresses (staking only)
};
```

## Transaction Building

### UTXO Management

```javascript
class CardanoUTXOManager {
  constructor() {
    this.utxos = [];
  }
  
  addUTXO(txHash, outputIndex, amount, address, tokens = []) {
    this.utxos.push({
      txHash,
      outputIndex,
      amount,
      address,
      tokens
    });
  }
  
  selectUTXOs(targetAmount, targetTokens = []) {
    // Simple UTXO selection algorithm
    let selectedAmount = 0;
    const selectedUTXOs = [];
    
    // Sort UTXOs by amount (largest first)
    const sortedUTXOs = this.utxos.sort((a, b) => parseInt(b.amount) - parseInt(a.amount));
    
    for (const utxo of sortedUTXOs) {
      selectedUTXOs.push(utxo);
      selectedAmount += parseInt(utxo.amount);
      
      if (selectedAmount >= targetAmount) {
        break;
      }
    }
    
    return selectedUTXOs;
  }
}
```

### Transaction Builder

```javascript
class CardanoTransactionBuilder {
  constructor() {
    this.inputs = [];
    this.outputs = [];
    this.fee = "0";
    this.ttl = null;
  }
  
  addInput(path, txHash, outputIndex) {
    this.inputs.push({
      path,
      prev_hash: txHash,
      prev_index: outputIndex
    });
    return this;
  }
  
  addOutput(address, amount, tokens = null) {
    const output = { address, amount };
    if (tokens) {
      output.tokenBundle = tokens;
    }
    this.outputs.push(output);
    return this;
  }
  
  addChangeOutput(path, stakingPath, amount) {
    this.outputs.push({
      addressParameters: {
        addressType: 1,
        path,
        stakingPath
      },
      amount
    });
    return this;
  }
  
  setFee(fee) {
    this.fee = fee;
    return this;
  }
  
  setTTL(ttl) {
    this.ttl = ttl;
    return this;
  }
  
  async sign() {
    const params = {
      inputs: this.inputs,
      outputs: this.outputs,
      fee: this.fee
    };
    
    if (this.ttl) {
      params.ttl = this.ttl;
    }
    
    return await HardwareSDK.cardanoSignTransaction(params);
  }
}

// Usage
const tx = new CardanoTransactionBuilder()
  .addInput("m/1852'/1815'/0'/0/0", "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7", 0)
  .addOutput("addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp", "1000000")
  .addChangeOutput("m/1852'/1815'/0'/1/0", "m/1852'/1815'/0'/2/0", "8000000")
  .setFee("200000")
  .setTTL("50000000");

const result = await tx.sign();
```

## Error Handling

### Common Cardano Errors

```javascript
try {
  const result = await HardwareSDK.cardanoGetAddress({
    path: "m/1852'/1815'/0'/0/0",
    addressType: 1,
    stakingPath: "m/1852'/1815'/0'/2/0"
  });
  
  if (!result.success) {
    switch (result.payload.error) {
      case 'Invalid_Path':
        console.error('Invalid Cardano derivation path');
        break;
      case 'Invalid_AddressType':
        console.error('Invalid address type');
        break;
      case 'User_Cancelled':
        console.error('User cancelled operation');
        break;
      default:
        console.error('Cardano operation failed:', result.payload.error);
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
const getReceiveAddress = async (account = 0, index = 0) => {
  const result = await HardwareSDK.cardanoGetAddress({
    path: `m/1852'/1815'/${account}'/0/${index}`,
    showOnDevice: true, // Important: show on device
    addressType: 1,
    stakingPath: `m/1852'/1815'/${account}'/2/0`
  });
  
  if (result.success) {
    return result.payload.address;
  }
  
  throw new Error('Failed to get verified address');
};
```

### Fee Calculation

```javascript
const calculateMinFee = (inputs, outputs, hasMetadata = false) => {
  // Cardano minimum fee calculation
  const baseFee = 155381; // Base fee in lovelace
  const perInputFee = 43946; // Per input fee
  const perOutputFee = 43946; // Per output fee
  const metadataFee = hasMetadata ? 43946 : 0;
  
  return baseFee + (inputs.length * perInputFee) + (outputs.length * perOutputFee) + metadataFee;
};
```

## Next Steps

- [Polkadot](polkadot.md) - Polkadot and Substrate chains
- [Cosmos](cosmos.md) - Cosmos ecosystem chains
- [Solana](solana.md) - Solana blockchain operations
- [Device Management](device.md) - Device connection and management
