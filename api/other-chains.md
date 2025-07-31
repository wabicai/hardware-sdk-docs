---
icon: link
---

# Other Blockchains

Support for additional blockchain networks including Solana, Cardano, Polkadot, Cosmos, and more.

## Solana Methods

### solanaGetAddress()

Get Solana address for a specific derivation path.

#### Syntax

```javascript
await sdk.solanaGetAddress(params)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `showOnDevice` | `boolean` | No | Show address on device (default: false) |

#### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    address: string;    // Base58-encoded Solana address
    path: string;       // Derivation path used
  } | { error: string; code?: string; }
}>
```

#### Example

```javascript
const result = await sdk.solanaGetAddress({
  path: "m/44'/501'/0'/0/0",
  showOnDevice: true
});

if (result.success) {
  console.log('Solana address:', result.payload.address);
}
```

### solanaSignTransaction()

Sign a Solana transaction.

#### Syntax

```javascript
await sdk.solanaSignTransaction(params)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `rawTx` | `string` | Yes | Hex-encoded transaction |

#### Example

```javascript
const result = await sdk.solanaSignTransaction({
  path: "m/44'/501'/0'/0/0",
  rawTx: "0x..." // Serialized Solana transaction
});

if (result.success) {
  console.log('Signed transaction:', result.payload.signature);
}
```

### solanaSignMessage()

Sign a Solana message.

#### Example

```javascript
const result = await sdk.solanaSignMessage({
  path: "m/44'/501'/0'/0/0",
  messageHex: "0x48656c6c6f20536f6c616e6121" // "Hello Solana!" in hex
});
```

## Cardano Methods

### cardanoGetAddress()

Get Cardano address for a specific derivation path.

#### Syntax

```javascript
await sdk.cardanoGetAddress(params)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path (BIP1852) |
| `showOnDevice` | `boolean` | No | Show address on device (default: false) |
| `addressType` | `number` | No | Address type (0=Base, 1=Pointer, 2=Enterprise, 3=Reward) |
| `networkId` | `number` | No | Network ID (0=Testnet, 1=Mainnet) |

#### Example

```javascript
const result = await sdk.cardanoGetAddress({
  path: "m/1852'/1815'/0'/0/0", // Note: Cardano uses BIP1852
  showOnDevice: true,
  addressType: 0, // Base address
  networkId: 1    // Mainnet
});

if (result.success) {
  console.log('Cardano address:', result.payload.address);
}
```

### cardanoSignTransaction()

Sign a Cardano transaction.

#### Example

```javascript
const result = await sdk.cardanoSignTransaction({
  inputs: [{
    path: "m/1852'/1815'/0'/0/0",
    prev_hash: "...",
    prev_index: 0
  }],
  outputs: [{
    address: "addr1...",
    amount: "1000000" // 1 ADA in lovelace
  }],
  fee: "170000",
  ttl: "12345678"
});
```

## Polkadot Methods

### polkadotGetAddress()

Get Polkadot address for a specific derivation path.

#### Example

```javascript
const result = await sdk.polkadotGetAddress({
  path: "m/44'/354'/0'/0/0",
  prefix: 0, // Polkadot prefix
  network: "polkadot",
  showOnDevice: true
});

if (result.success) {
  console.log('Polkadot address:', result.payload.address);
}
```

### polkadotSignTransaction()

Sign a Polkadot transaction.

#### Example

```javascript
const result = await sdk.polkadotSignTransaction({
  path: "m/44'/354'/0'/0/0",
  rawTx: "0x...", // Encoded transaction
  network: "polkadot"
});
```

## Cosmos Methods

### cosmosGetAddress()

Get Cosmos address for a specific derivation path.

#### Example

```javascript
const result = await sdk.cosmosGetAddress({
  path: "m/44'/118'/0'/0/0",
  hrp: "cosmos", // Human readable part
  showOnDevice: true
});

if (result.success) {
  console.log('Cosmos address:', result.payload.address);
}
```

### cosmosSignTransaction()

Sign a Cosmos transaction.

#### Example

```javascript
const result = await sdk.cosmosSignTransaction({
  path: "m/44'/118'/0'/0/0",
  rawTx: "0x..." // Amino-encoded transaction
});
```

## Near Protocol Methods

### nearGetAddress()

Get Near Protocol address.

#### Example

```javascript
const result = await sdk.nearGetAddress({
  path: "m/44'/397'/0'/0/0",
  showOnDevice: true
});

if (result.success) {
  console.log('Near address:', result.payload.address);
}
```

### nearSignTransaction()

Sign a Near Protocol transaction.

#### Example

```javascript
const result = await sdk.nearSignTransaction({
  path: "m/44'/397'/0'/0/0",
  rawTx: "0x..." // Borsh-encoded transaction
});
```

## Tron Methods

### tronGetAddress()

Get Tron address.

#### Example

```javascript
const result = await sdk.tronGetAddress({
  path: "m/44'/195'/0'/0/0",
  showOnDevice: true
});

if (result.success) {
  console.log('Tron address:', result.payload.address);
}
```

### tronSignTransaction()

Sign a Tron transaction.

#### Example

```javascript
const result = await sdk.tronSignTransaction({
  path: "m/44'/195'/0'/0/0",
  transaction: {
    // Tron transaction object
  }
});
```

## Ripple (XRP) Methods

### rippleGetAddress()

Get Ripple address.

#### Example

```javascript
const result = await sdk.rippleGetAddress({
  path: "m/44'/144'/0'/0/0",
  showOnDevice: true
});

if (result.success) {
  console.log('XRP address:', result.payload.address);
}
```

### rippleSignTransaction()

Sign a Ripple transaction.

#### Example

```javascript
const result = await sdk.rippleSignTransaction({
  path: "m/44'/144'/0'/0/0",
  transaction: {
    fee: "12",
    flags: 0x80000000,
    sequence: 1,
    payment: {
      amount: "100000000", // 100 XRP in drops
      destination: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
    }
  }
});
```

## Stellar (XLM) Methods

### stellarGetAddress()

Get Stellar address.

#### Example

```javascript
const result = await sdk.stellarGetAddress({
  path: "m/44'/148'/0'/0/0",
  showOnDevice: true
});

if (result.success) {
  console.log('Stellar address:', result.payload.address);
}
```

### stellarSignTransaction()

Sign a Stellar transaction.

#### Example

```javascript
const result = await sdk.stellarSignTransaction({
  path: "m/44'/148'/0'/0/0",
  networkPassphrase: "Public Global Stellar Network ; September 2015",
  transaction: {
    // Stellar transaction object
  }
});
```

## Blockchain-Specific Features

### Solana Features
- **SPL Token Support**: Transfer and interact with SPL tokens
- **Program Interaction**: Call Solana programs
- **Associated Token Accounts**: Manage token accounts

```javascript
// SPL Token transfer example
const splTransfer = await sdk.solanaSignTransaction({
  path: "m/44'/501'/0'/0/0",
  rawTx: "..." // SPL token transfer transaction
});
```

### Cardano Features
- **Staking Support**: Delegate to stake pools
- **Multi-Asset Support**: Handle native tokens
- **Metadata Support**: Transaction metadata

```javascript
// Staking delegation example
const stakingTx = await sdk.cardanoSignTransaction({
  inputs: [...],
  outputs: [...],
  certificates: [{
    type: 0, // Stake delegation
    path: "m/1852'/1815'/0'/2/0",
    pool: "pool1..." // Pool ID
  }]
});
```

### Polkadot Features
- **Substrate Support**: Compatible with Substrate-based chains
- **Staking Operations**: Nominate validators
- **Governance**: Participate in governance

### Cosmos Features
- **IBC Support**: Inter-blockchain communication
- **Staking**: Delegate to validators
- **Governance**: Vote on proposals

## Error Handling

```javascript
try {
  const result = await sdk.solanaGetAddress({
    path: "m/44'/501'/0'/0/0",
    showOnDevice: true
  });
  
  if (result.success) {
    console.log('Address:', result.payload.address);
  } else {
    console.error('API Error:', result.payload.error);
  }
} catch (error) {
  switch (error.code) {
    case 'Chain_NotSupported':
      console.error('Blockchain not supported on this device');
      break;
    case 'Invalid_Path':
      console.error('Invalid derivation path for this blockchain');
      break;
    case 'Firmware_OutOfDate':
      console.error('Firmware update required for this blockchain');
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}
```

## Multi-Chain Wallet Example

```javascript
class MultiChainWallet {
  constructor(sdk) {
    this.sdk = sdk;
  }
  
  async getAddresses() {
    const addresses = {};
    
    try {
      // Bitcoin
      const btc = await this.sdk.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        showOnDevice: false,
        coin: 'btc'
      });
      if (btc.success) addresses.bitcoin = btc.payload.address;
      
      // Ethereum
      const eth = await this.sdk.ethereumGetAddress({
        path: "m/44'/60'/0'/0/0",
        showOnDevice: false
      });
      if (eth.success) addresses.ethereum = eth.payload.address;
      
      // Solana
      const sol = await this.sdk.solanaGetAddress({
        path: "m/44'/501'/0'/0/0",
        showOnDevice: false
      });
      if (sol.success) addresses.solana = sol.payload.address;
      
      // Cardano
      const ada = await this.sdk.cardanoGetAddress({
        path: "m/1852'/1815'/0'/0/0",
        showOnDevice: false,
        networkId: 1
      });
      if (ada.success) addresses.cardano = ada.payload.address;
      
      return addresses;
    } catch (error) {
      console.error('Error getting addresses:', error);
      return addresses;
    }
  }
  
  async getBalance(chain, address) {
    // Implement balance checking for each chain
    switch (chain) {
      case 'bitcoin':
        return await this.getBitcoinBalance(address);
      case 'ethereum':
        return await this.getEthereumBalance(address);
      case 'solana':
        return await this.getSolanaBalance(address);
      case 'cardano':
        return await this.getCardanoBalance(address);
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  }
  
  // Implement chain-specific balance methods...
}

// Usage
const wallet = new MultiChainWallet(sdk);
const addresses = await wallet.getAddresses();
console.log('Multi-chain addresses:', addresses);
```

## Supported Coin Types

| Blockchain | Coin Type | Standard Path | Features |
|------------|-----------|---------------|----------|
| Solana | 501 | `m/44'/501'/0'/0/0` | Full support |
| Cardano | 1815 | `m/1852'/1815'/0'/0/0` | Full support (BIP1852) |
| Polkadot | 354 | `m/44'/354'/0'/0/0` | Basic support |
| Cosmos | 118 | `m/44'/118'/0'/0/0` | Basic support |
| Near | 397 | `m/44'/397'/0'/0/0` | Basic support |
| Tron | 195 | `m/44'/195'/0'/0/0` | Basic support |
| Ripple | 144 | `m/44'/144'/0'/0/0` | Basic support |
| Stellar | 148 | `m/44'/148'/0'/0/0` | Basic support |

## Best Practices

### Chain-Specific Considerations
- **Solana**: Use recent blockhash for transactions
- **Cardano**: Handle UTXO model correctly
- **Polkadot**: Consider era and mortality period
- **Cosmos**: Use correct sequence numbers

### Performance
- Cache addresses for frequently used chains
- Batch operations when possible
- Use appropriate timeouts for each chain

### Security
- Verify addresses on device for new chains
- Understand each chain's transaction format
- Test with small amounts first

## Next Steps

- [Bitcoin Methods](bitcoin.md) - Bitcoin-specific operations
- [Ethereum Methods](ethereum.md) - Ethereum-specific operations
- [Supported Coins](../resources/supported-coins.md) - Complete coin list
- [Examples](../examples/basic.md) - Multi-chain examples
