---
icon: bitcoin
---

# Bitcoin Methods

Bitcoin and Bitcoin-fork cryptocurrency operations including address generation, transaction signing, and message signing.

## btcGetAddress()

Get Bitcoin address for a specific derivation path.

### Syntax

```javascript
await sdk.btcGetAddress(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `showOnDevice` | `boolean` | No | Show address on device (default: false) |
| `coin` | `string` | No | Coin name (default: 'btc') |
| `scriptType` | `string` | No | Script type: 'SPENDADDRESS', 'SPENDMULTISIG', 'SPENDWITNESS', 'SPENDP2SHWITNESS' |

### Supported Coins

| Coin | Name | Script Types |
|------|------|--------------|
| Bitcoin | `btc` | All |
| Bitcoin Cash | `bch` | Legacy, P2SH |
| Litecoin | `ltc` | All |
| Dogecoin | `doge` | Legacy, P2SH |
| Bitcoin Testnet | `test` | All |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    address: string;    // Generated address
    path: string;       // Derivation path used
  } | { error: string; code?: string; }
}>
```

### Examples

```javascript
// Basic Bitcoin address
const result = await sdk.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true,
  coin: 'btc'
});

if (result.success) {
  console.log('Bitcoin address:', result.payload.address);
}

// SegWit address
const segwitResult = await sdk.btcGetAddress({
  path: "m/84'/0'/0'/0/0",
  showOnDevice: true,
  coin: 'btc',
  scriptType: 'SPENDWITNESS'
});

// Litecoin address
const ltcResult = await sdk.btcGetAddress({
  path: "m/44'/2'/0'/0/0",
  showOnDevice: true,
  coin: 'ltc'
});
```

## btcGetPublicKey()

Get public key for a specific derivation path.

### Syntax

```javascript
await sdk.btcGetPublicKey(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `showOnDevice` | `boolean` | No | Show on device (default: false) |
| `coin` | `string` | No | Coin name (default: 'btc') |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    publicKey: string;     // Hex-encoded public key
    chainCode: string;     // Hex-encoded chain code
    path: string;          // Derivation path used
    xpub: string;          // Extended public key
  } | { error: string; code?: string; }
}>
```

### Example

```javascript
const result = await sdk.btcGetPublicKey({
  path: "m/44'/0'/0'",
  showOnDevice: false,
  coin: 'btc'
});

if (result.success) {
  console.log('Public key:', result.payload.publicKey);
  console.log('Extended public key:', result.payload.xpub);
}
```

## btcSignTransaction()

Sign a Bitcoin transaction.

### Syntax

```javascript
await sdk.btcSignTransaction(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `inputs` | `Array<TxInput>` | Yes | Transaction inputs |
| `outputs` | `Array<TxOutput>` | Yes | Transaction outputs |
| `coin` | `string` | No | Coin name (default: 'btc') |
| `locktime` | `number` | No | Transaction locktime |
| `version` | `number` | No | Transaction version |

### TxInput Object

```typescript
interface TxInput {
  address_n: number[];           // Derivation path as array
  prev_hash: string;             // Previous transaction hash
  prev_index: number;            // Previous output index
  amount: string;                // Input amount in satoshis
  script_type?: string;          // Script type
  sequence?: number;             // Sequence number
}
```

### TxOutput Object

```typescript
interface TxOutput {
  address?: string;              // Output address
  address_n?: number[];          // Derivation path for change
  amount: string;                // Output amount in satoshis
  script_type?: string;          // Script type
  op_return_data?: string;       // OP_RETURN data
}
```

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    signatures: string[];         // Transaction signatures
    serializedTx: string;         // Serialized transaction
  } | { error: string; code?: string; }
}>
```

### Example

```javascript
const result = await sdk.btcSignTransaction({
  inputs: [{
    address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
    prev_hash: 'a1b2c3d4e5f6...',
    prev_index: 0,
    amount: '100000', // 0.001 BTC in satoshis
    script_type: 'SPENDADDRESS'
  }],
  outputs: [{
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    amount: '90000', // 0.0009 BTC
    script_type: 'PAYTOADDRESS'
  }, {
    address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 1, 0],
    amount: '9000', // Change output
    script_type: 'PAYTOADDRESS'
  }],
  coin: 'btc'
});

if (result.success) {
  console.log('Transaction signed:', result.payload.serializedTx);
}
```

## btcSignMessage()

Sign a message with Bitcoin private key.

### Syntax

```javascript
await sdk.btcSignMessage(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `message` | `string` | Yes | Message to sign |
| `coin` | `string` | No | Coin name (default: 'btc') |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    signature: string;            // Base64-encoded signature
    address: string;              // Address used for signing
  } | { error: string; code?: string; }
}>
```

### Example

```javascript
const result = await sdk.btcSignMessage({
  path: "m/44'/0'/0'/0/0",
  message: 'Hello OneKey!',
  coin: 'btc'
});

if (result.success) {
  console.log('Message signature:', result.payload.signature);
  console.log('Signing address:', result.payload.address);
}
```

## Address Types and Script Types

### Legacy Addresses (P2PKH)
```javascript
const result = await sdk.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  scriptType: 'SPENDADDRESS',
  coin: 'btc'
});
// Returns: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

### SegWit Addresses (P2WPKH)
```javascript
const result = await sdk.btcGetAddress({
  path: "m/84'/0'/0'/0/0",
  scriptType: 'SPENDWITNESS',
  coin: 'btc'
});
// Returns: bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4
```

### Wrapped SegWit (P2SH-P2WPKH)
```javascript
const result = await sdk.btcGetAddress({
  path: "m/49'/0'/0'/0/0",
  scriptType: 'SPENDP2SHWITNESS',
  coin: 'btc'
});
// Returns: 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
```

## Multi-Signature Support

### Get Multisig Address

```javascript
const result = await sdk.btcGetAddress({
  path: "m/48'/0'/0'/2'/0/0",
  scriptType: 'SPENDMULTISIG',
  multisig: {
    pubkeys: [
      { node: xpub1, address_n: [0, 0] },
      { node: xpub2, address_n: [0, 0] },
      { node: xpub3, address_n: [0, 0] }
    ],
    signatures: ['', '', ''],
    m: 2 // 2-of-3 multisig
  },
  coin: 'btc'
});
```

## Error Handling

```javascript
try {
  const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true,
    coin: 'btc'
  });
  
  if (result.success) {
    console.log('Address:', result.payload.address);
  } else {
    console.error('API Error:', result.payload.error);
  }
} catch (error) {
  switch (error.code) {
    case 'User_Cancelled':
      console.error('User cancelled the operation');
      break;
    case 'Device_NotFound':
      console.error('Device not connected');
      break;
    case 'Invalid_Path':
      console.error('Invalid derivation path');
      break;
    case 'Coin_NotSupported':
      console.error('Coin not supported');
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}
```

## Best Practices

### Address Generation
- Always use `showOnDevice: true` for the first address to verify
- Use appropriate script types for your use case
- Validate derivation paths before use

### Transaction Signing
- Verify all transaction details before signing
- Use proper fee calculation
- Handle change outputs correctly
- Test with small amounts first

### Security
- Never log private keys or sensitive data
- Verify addresses on device display
- Use hardware confirmation for all operations
- Validate all inputs before sending to device

## Complete Example

```javascript
class BitcoinWallet {
  constructor(sdk) {
    this.sdk = sdk;
  }
  
  async getAddress(index = 0, change = 0, account = 0) {
    const path = `m/44'/0'/${account}'/${change}/${index}`;
    
    const result = await this.sdk.btcGetAddress({
      path,
      showOnDevice: index === 0, // Show first address on device
      coin: 'btc'
    });
    
    if (result.success) {
      return {
        address: result.payload.address,
        path: path
      };
    } else {
      throw new Error(result.payload.error);
    }
  }
  
  async signTransaction(inputs, outputs) {
    // Convert inputs to proper format
    const formattedInputs = inputs.map(input => ({
      address_n: this.pathToArray(input.path),
      prev_hash: input.txHash,
      prev_index: input.outputIndex,
      amount: input.amount.toString(),
      script_type: 'SPENDADDRESS'
    }));
    
    // Convert outputs to proper format
    const formattedOutputs = outputs.map(output => ({
      address: output.address,
      amount: output.amount.toString(),
      script_type: 'PAYTOADDRESS'
    }));
    
    const result = await this.sdk.btcSignTransaction({
      inputs: formattedInputs,
      outputs: formattedOutputs,
      coin: 'btc'
    });
    
    if (result.success) {
      return result.payload.serializedTx;
    } else {
      throw new Error(result.payload.error);
    }
  }
  
  pathToArray(path) {
    return path.split('/').slice(1).map(component => {
      const hardened = component.endsWith("'");
      const index = parseInt(component.replace("'", ""));
      return hardened ? index | 0x80000000 : index;
    });
  }
}

// Usage
const wallet = new BitcoinWallet(sdk);

// Get first address
const address = await wallet.getAddress(0);
console.log('Bitcoin address:', address.address);

// Sign transaction
const signedTx = await wallet.signTransaction(inputs, outputs);
console.log('Signed transaction:', signedTx);
```

## Next Steps

- [Ethereum Methods](ethereum.md) - Ethereum-specific operations
- [Device Management](device.md) - Device connection and settings
- [Derivation Paths](../concepts/paths.md) - Understanding address paths
- [Best Practices](../guides/best-practices.md) - Security and performance tips
