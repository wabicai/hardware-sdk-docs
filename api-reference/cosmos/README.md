---
icon: atom
---

# Cosmos

Cosmos ecosystem blockchain operations including address generation, transaction signing, and message signing.

## Overview

Cosmos is an ecosystem of interconnected blockchains built using the Cosmos SDK. OneKey supports many Cosmos-based chains including:

- Cosmos Hub (ATOM)
- Osmosis (OSMO)
- Juno (JUNO)
- Secret Network (SCRT)
- Terra (LUNA)
- Kava (KAVA)
- And many other IBC-enabled chains

## cosmosGetAddress()

Get Cosmos address from device.

### Syntax

```javascript
await HardwareSDK.cosmosGetAddress(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `hrp` | `string` | Yes | Human-readable part (bech32 prefix) |
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
// Get Cosmos Hub address
const result = await HardwareSDK.cosmosGetAddress({
  path: "m/44'/118'/0'/0/0",
  hrp: 'cosmos',
  showOnDevice: true
});

if (result.success) {
  console.log('Cosmos address:', result.payload.address);
  console.log('Public key:', result.payload.publicKey);
}

// Get Osmosis address
const osmosisResult = await HardwareSDK.cosmosGetAddress({
  path: "m/44'/118'/0'/0/0",
  hrp: 'osmo',
  showOnDevice: true
});

// Get Juno address
const junoResult = await HardwareSDK.cosmosGetAddress({
  path: "m/44'/118'/0'/0/0",
  hrp: 'juno',
  showOnDevice: true
});

// Get Secret Network address
const secretResult = await HardwareSDK.cosmosGetAddress({
  path: "m/44'/529'/0'/0/0",
  hrp: 'secret',
  showOnDevice: true
});
```

## cosmosSignTransaction()

Sign Cosmos transaction.

### Syntax

```javascript
await HardwareSDK.cosmosSignTransaction(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `rawTx` | `string` | Yes | Raw transaction data (hex) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    signature: string;
    publicKey: string;
  }
}>
```

### Examples

```javascript
// Simple ATOM transfer
const transferTx = await HardwareSDK.cosmosSignTransaction({
  path: "m/44'/118'/0'/0/0",
  rawTx: "0a94010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e64..." // Raw transaction hex
});

if (transferTx.success) {
  console.log('Transaction signature:', transferTx.payload.signature);
  console.log('Public key:', transferTx.payload.publicKey);
}

// Staking transaction
const stakingTx = await HardwareSDK.cosmosSignTransaction({
  path: "m/44'/118'/0'/0/0",
  rawTx: "0a9e010a232f636f736d6f732e7374616b696e672e763162657461312e4d736744656c6567617465..." // Staking transaction hex
});

// IBC transfer
const ibcTx = await HardwareSDK.cosmosSignTransaction({
  path: "m/44'/118'/0'/0/0",
  rawTx: "0ab2010a2f2f6962632e6170706c69636174696f6e732e7472616e736665722e763..." // IBC transaction hex
});
```

## Supported Networks

### Network Configuration

```javascript
const CosmosNetworks = {
  cosmos: {
    name: 'Cosmos Hub',
    hrp: 'cosmos',
    coinType: 118,
    decimals: 6,
    symbol: 'ATOM',
    chainId: 'cosmoshub-4'
  },
  osmosis: {
    name: 'Osmosis',
    hrp: 'osmo',
    coinType: 118,
    decimals: 6,
    symbol: 'OSMO',
    chainId: 'osmosis-1'
  },
  juno: {
    name: 'Juno',
    hrp: 'juno',
    coinType: 118,
    decimals: 6,
    symbol: 'JUNO',
    chainId: 'juno-1'
  },
  secret: {
    name: 'Secret Network',
    hrp: 'secret',
    coinType: 529,
    decimals: 6,
    symbol: 'SCRT',
    chainId: 'secret-4'
  },
  terra: {
    name: 'Terra',
    hrp: 'terra',
    coinType: 330,
    decimals: 6,
    symbol: 'LUNA',
    chainId: 'phoenix-1'
  },
  kava: {
    name: 'Kava',
    hrp: 'kava',
    coinType: 459,
    decimals: 6,
    symbol: 'KAVA',
    chainId: 'kava_2222-10'
  }
};

// Helper function to get network config
const getNetworkConfig = (network) => {
  return CosmosNetworks[network];
};
```

## Derivation Paths

### Standard Cosmos Paths

```javascript
// Cosmos derivation paths
const cosmosPaths = {
  cosmos: {
    account0: "m/44'/118'/0'/0/0",
    account1: "m/44'/118'/1'/0/0"
  },
  secret: {
    account0: "m/44'/529'/0'/0/0",
    account1: "m/44'/529'/1'/0/0"
  },
  terra: {
    account0: "m/44'/330'/0'/0/0",
    account1: "m/44'/330'/1'/0/0"
  },
  kava: {
    account0: "m/44'/459'/0'/0/0",
    account1: "m/44'/459'/1'/0/0"
  }
};

// Helper function
const getCosmosPath = (network, account = 0, index = 0) => {
  const config = CosmosNetworks[network];
  return `m/44'/${config.coinType}'/${account}'/0/${index}`;
};
```

## Transaction Types

### Bank Transfer

```javascript
// Build bank transfer transaction
const buildTransfer = async (from, to, amount, denom, network = 'cosmos') => {
  // Use @cosmjs/stargate to build transaction
  const { SigningStargateClient, GasPrice } = require('@cosmjs/stargate');
  const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
  
  const config = CosmosNetworks[network];
  
  // Create transfer message
  const transferMsg = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: from,
      toAddress: to,
      amount: [{
        denom,
        amount: amount.toString()
      }]
    }
  };
  
  // Build transaction
  const fee = {
    amount: [{ denom, amount: '5000' }],
    gas: '200000'
  };
  
  // Serialize transaction for signing
  const rawTx = serializeTransaction(transferMsg, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};
```

### Staking Operations

```javascript
// Delegate tokens
const buildDelegate = async (delegator, validator, amount, denom, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  
  const delegateMsg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: {
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: {
        denom,
        amount: amount.toString()
      }
    }
  };
  
  const fee = {
    amount: [{ denom, amount: '5000' }],
    gas: '200000'
  };
  
  const rawTx = serializeTransaction(delegateMsg, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};

// Undelegate tokens
const buildUndelegate = async (delegator, validator, amount, denom, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  
  const undelegateMsg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: {
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: {
        denom,
        amount: amount.toString()
      }
    }
  };
  
  const fee = {
    amount: [{ denom, amount: '5000' }],
    gas: '200000'
  };
  
  const rawTx = serializeTransaction(undelegateMsg, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};

// Redelegate tokens
const buildRedelegate = async (delegator, srcValidator, dstValidator, amount, denom, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  
  const redelegateMsg = {
    typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    value: {
      delegatorAddress: delegator,
      validatorSrcAddress: srcValidator,
      validatorDstAddress: dstValidator,
      amount: {
        denom,
        amount: amount.toString()
      }
    }
  };
  
  const fee = {
    amount: [{ denom, amount: '5000' }],
    gas: '200000'
  };
  
  const rawTx = serializeTransaction(redelegateMsg, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};

// Claim rewards
const buildClaimRewards = async (delegator, validators, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  
  const claimMsgs = validators.map(validator => ({
    typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    value: {
      delegatorAddress: delegator,
      validatorAddress: validator
    }
  }));
  
  const fee = {
    amount: [{ denom: config.symbol.toLowerCase(), amount: '5000' }],
    gas: '200000'
  };
  
  const rawTx = serializeTransaction(claimMsgs, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};
```

### IBC Transfer

```javascript
// Build IBC transfer transaction
const buildIBCTransfer = async (sender, receiver, amount, denom, sourceChannel, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  
  // Calculate timeout timestamp (1 hour from now)
  const timeoutTimestamp = (Date.now() + 3600000) * 1000000; // nanoseconds
  
  const ibcTransferMsg = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: {
      sourcePort: 'transfer',
      sourceChannel,
      token: {
        denom,
        amount: amount.toString()
      },
      sender,
      receiver,
      timeoutHeight: {
        revisionNumber: 0,
        revisionHeight: 0
      },
      timeoutTimestamp
    }
  };
  
  const fee = {
    amount: [{ denom, amount: '5000' }],
    gas: '200000'
  };
  
  const rawTx = serializeTransaction(ibcTransferMsg, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};
```

### Governance

```javascript
// Vote on proposal
const buildVote = async (voter, proposalId, option, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  
  const voteMsg = {
    typeUrl: '/cosmos.gov.v1beta1.MsgVote',
    value: {
      proposalId: proposalId.toString(),
      voter,
      option // 1=Yes, 2=Abstain, 3=No, 4=NoWithVeto
    }
  };
  
  const fee = {
    amount: [{ denom: config.symbol.toLowerCase(), amount: '5000' }],
    gas: '200000'
  };
  
  const rawTx = serializeTransaction(voteMsg, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};

// Submit proposal
const buildSubmitProposal = async (proposer, content, initialDeposit, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  
  const submitProposalMsg = {
    typeUrl: '/cosmos.gov.v1beta1.MsgSubmitProposal',
    value: {
      content,
      initialDeposit,
      proposer
    }
  };
  
  const fee = {
    amount: [{ denom: config.symbol.toLowerCase(), amount: '5000' }],
    gas: '200000'
  };
  
  const rawTx = serializeTransaction(submitProposalMsg, fee, config.chainId);
  
  return await HardwareSDK.cosmosSignTransaction({
    path: getCosmosPath(network),
    rawTx
  });
};
```

## Utility Functions

### Address Validation

```javascript
// Validate Cosmos address format
const isValidCosmosAddress = (address, expectedHrp = null) => {
  try {
    const { fromBech32 } = require('@cosmjs/encoding');
    
    const decoded = fromBech32(address);
    
    // Check if expected HRP matches
    if (expectedHrp && decoded.prefix !== expectedHrp) {
      return false;
    }
    
    // Check address length (20 bytes for most Cosmos addresses)
    return decoded.data.length === 20;
  } catch (error) {
    return false;
  }
};

// Convert address between networks
const convertCosmosAddress = (address, targetHrp) => {
  const { fromBech32, toBech32 } = require('@cosmjs/encoding');
  
  try {
    const decoded = fromBech32(address);
    return toBech32(targetHrp, decoded.data);
  } catch (error) {
    throw new Error('Invalid address format');
  }
};
```

### Amount Conversion

```javascript
// Convert tokens to micro units
const toMicroUnits = (amount, decimals = 6) => {
  return amount * Math.pow(10, decimals);
};

// Convert micro units to tokens
const fromMicroUnits = (amount, decimals = 6) => {
  return amount / Math.pow(10, decimals);
};

// Format amount for display
const formatCosmosAmount = (amount, denom, network = 'cosmos') => {
  const config = CosmosNetworks[network];
  const formatted = fromMicroUnits(amount, config.decimals);
  return `${formatted.toFixed(6)} ${config.symbol}`;
};
```

## Error Handling

### Common Cosmos Errors

```javascript
try {
  const result = await HardwareSDK.cosmosGetAddress({
    path: "m/44'/118'/0'/0/0",
    hrp: 'cosmos'
  });
  
  if (!result.success) {
    switch (result.payload.error) {
      case 'Invalid_Path':
        console.error('Invalid Cosmos derivation path');
        break;
      case 'Invalid_HRP':
        console.error('Invalid bech32 prefix');
        break;
      case 'User_Cancelled':
        console.error('User cancelled operation');
        break;
      default:
        console.error('Cosmos operation failed:', result.payload.error);
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
const getReceiveAddress = async (network = 'cosmos', account = 0) => {
  const config = CosmosNetworks[network];
  const path = getCosmosPath(network, account);
  
  const result = await HardwareSDK.cosmosGetAddress({
    path,
    hrp: config.hrp,
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
// Cosmos transaction builder
class CosmosTransactionBuilder {
  constructor(network = 'cosmos') {
    this.network = network;
    this.config = CosmosNetworks[network];
    this.messages = [];
    this.fee = null;
    this.memo = '';
  }
  
  addMessage(message) {
    this.messages.push(message);
    return this;
  }
  
  setFee(amount, gas, denom = null) {
    this.fee = {
      amount: [{
        denom: denom || this.config.symbol.toLowerCase(),
        amount: amount.toString()
      }],
      gas: gas.toString()
    };
    return this;
  }
  
  setMemo(memo) {
    this.memo = memo;
    return this;
  }
  
  async sign(path) {
    const rawTx = this.serializeTransaction();
    
    return await HardwareSDK.cosmosSignTransaction({
      path,
      rawTx
    });
  }
  
  serializeTransaction() {
    // Implementation depends on the specific serialization format
    // This would typically use @cosmjs/proto-signing or similar
    return serializeCosmosTransaction(this.messages, this.fee, this.config.chainId, this.memo);
  }
}
```

## Next Steps

- [Solana](solana.md) - Solana blockchain operations
- [Cardano](cardano.md) - Cardano blockchain operations
- [Polkadot](polkadot.md) - Polkadot and Substrate chains
- [Device Management](device.md) - Device connection and management
