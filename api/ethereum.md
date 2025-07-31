---
icon: ethereum
---

# Ethereum Methods

Ethereum and EVM-compatible blockchain operations including address generation, transaction signing, message signing, and typed data signing.

## ethereumGetAddress()

Get Ethereum address for a specific derivation path.

### Syntax

```javascript
await sdk.ethereumGetAddress(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `showOnDevice` | `boolean` | No | Show address on device (default: false) |
| `chainId` | `number` | No | Chain ID for specific network |

### Supported Networks

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Ethereum Mainnet | 1 | https://mainnet.infura.io/v3/YOUR-PROJECT-ID |
| Goerli Testnet | 5 | https://goerli.infura.io/v3/YOUR-PROJECT-ID |
| Sepolia Testnet | 11155111 | https://sepolia.infura.io/v3/YOUR-PROJECT-ID |
| Binance Smart Chain | 56 | https://bsc-dataseed.binance.org/ |
| Polygon | 137 | https://polygon-rpc.com/ |
| Avalanche C-Chain | 43114 | https://api.avax.network/ext/bc/C/rpc |
| Arbitrum One | 42161 | https://arb1.arbitrum.io/rpc |
| Optimism | 10 | https://mainnet.optimism.io |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    address: string;    // Ethereum address (0x...)
    path: string;       // Derivation path used
  } | { error: string; code?: string; }
}>
```

### Examples

```javascript
// Basic Ethereum address
const result = await sdk.ethereumGetAddress({
  path: "m/44'/60'/0'/0/0",
  showOnDevice: true
});

if (result.success) {
  console.log('Ethereum address:', result.payload.address);
}

// Polygon address (same derivation, different chain)
const polygonResult = await sdk.ethereumGetAddress({
  path: "m/44'/60'/0'/0/0",
  showOnDevice: true,
  chainId: 137
});

// Multiple addresses (bundle)
const bundle = await sdk.ethereumGetAddress({
  bundle: [
    { path: "m/44'/60'/0'/0/0", showOnDevice: false },
    { path: "m/44'/60'/0'/0/1", showOnDevice: false },
    { path: "m/44'/60'/0'/0/2", showOnDevice: false }
  ]
});
```

## ethereumGetPublicKey()

Get public key for Ethereum address derivation.

### Syntax

```javascript
await sdk.ethereumGetPublicKey(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `showOnDevice` | `boolean` | No | Show on device (default: false) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    publicKey: string;     // Hex-encoded public key
    chainCode: string;     // Hex-encoded chain code
    path: string;          // Derivation path used
  } | { error: string; code?: string; }
}>
```

### Example

```javascript
const result = await sdk.ethereumGetPublicKey({
  path: "m/44'/60'/0'/0/0",
  showOnDevice: false
});

if (result.success) {
  console.log('Public key:', result.payload.publicKey);
}
```

## ethereumSignTransaction()

Sign an Ethereum transaction.

### Syntax

```javascript
await sdk.ethereumSignTransaction(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `transaction` | `EthereumTransaction` | Yes | Transaction object |

### EthereumTransaction Object

```typescript
interface EthereumTransaction {
  to: string;              // Recipient address
  value: string;           // Amount in wei (hex string)
  gasLimit: string;        // Gas limit (hex string)
  gasPrice?: string;       // Gas price (hex string, legacy)
  maxFeePerGas?: string;   // Max fee per gas (hex string, EIP-1559)
  maxPriorityFeePerGas?: string; // Max priority fee (hex string, EIP-1559)
  nonce: string;           // Transaction nonce (hex string)
  data?: string;           // Transaction data (hex string)
  chainId: number;         // Chain ID
}
```

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    r: string;             // Signature r component
    s: string;             // Signature s component
    v: string;             // Signature v component
    serializedTx: string;  // Serialized transaction
  } | { error: string; code?: string; }
}>
```

### Examples

```javascript
// Legacy transaction
const legacyTx = await sdk.ethereumSignTransaction({
  path: "m/44'/60'/0'/0/0",
  transaction: {
    to: "0x742d35Cc6634C0532925a3b8D400E4C3f8c8C9C8",
    value: "0xde0b6b3a7640000", // 1 ETH in wei
    gasLimit: "0x5208",          // 21000
    gasPrice: "0x4a817c800",     // 20 Gwei
    nonce: "0x0",
    chainId: 1
  }
});

// EIP-1559 transaction
const eip1559Tx = await sdk.ethereumSignTransaction({
  path: "m/44'/60'/0'/0/0",
  transaction: {
    to: "0x742d35Cc6634C0532925a3b8D400E4C3f8c8C9C8",
    value: "0xde0b6b3a7640000",
    gasLimit: "0x5208",
    maxFeePerGas: "0x4a817c800",        // 20 Gwei
    maxPriorityFeePerGas: "0x3b9aca00", // 1 Gwei
    nonce: "0x0",
    chainId: 1
  }
});

// Contract interaction
const contractTx = await sdk.ethereumSignTransaction({
  path: "m/44'/60'/0'/0/0",
  transaction: {
    to: "0xA0b86a33E6417c8f2c8B758B2d7D2E8E8E8E8E8E", // Contract address
    value: "0x0",
    gasLimit: "0x7530", // 30000
    gasPrice: "0x4a817c800",
    nonce: "0x1",
    data: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b8d400e4c3f8c8c9c8000000000000000000000000000000000000000000000000de0b6b3a7640000", // transfer(to, amount)
    chainId: 1
  }
});
```

## ethereumSignMessage()

Sign an Ethereum message.

### Syntax

```javascript
await sdk.ethereumSignMessage(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `message` | `string` | Yes | Message to sign |
| `hex` | `boolean` | No | Message is hex-encoded (default: false) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    signature: string;        // Hex-encoded signature
    address: string;          // Address used for signing
  } | { error: string; code?: string; }
}>
```

### Example

```javascript
// Sign text message
const result = await sdk.ethereumSignMessage({
  path: "m/44'/60'/0'/0/0",
  message: "Hello OneKey!"
});

// Sign hex message
const hexResult = await sdk.ethereumSignMessage({
  path: "m/44'/60'/0'/0/0",
  message: "0x48656c6c6f204f6e654b657921", // "Hello OneKey!" in hex
  hex: true
});

if (result.success) {
  console.log('Message signature:', result.payload.signature);
  console.log('Signing address:', result.payload.address);
}
```

## ethereumSignTypedData()

Sign EIP-712 typed data.

### Syntax

```javascript
await sdk.ethereumSignTypedData(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP32 derivation path |
| `data` | `TypedData` | Yes | EIP-712 typed data object |
| `metamaskV4Compat` | `boolean` | No | MetaMask v4 compatibility (default: true) |

### TypedData Object

```typescript
interface TypedData {
  types: {
    [typeName: string]: Array<{
      name: string;
      type: string;
    }>;
  };
  primaryType: string;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: string;
  };
  message: {
    [key: string]: any;
  };
}
```

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    signature: string;        // Hex-encoded signature
    address: string;          // Address used for signing
  } | { error: string; code?: string; }
}>
```

### Example

```javascript
const typedData = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' }
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' }
    ]
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    contents: 'Hello, Bob!'
  }
};

const result = await sdk.ethereumSignTypedData({
  path: "m/44'/60'/0'/0/0",
  data: typedData
});

if (result.success) {
  console.log('Typed data signature:', result.payload.signature);
}
```

## ethereumVerifyMessage()

Verify an Ethereum message signature.

### Syntax

```javascript
await sdk.ethereumVerifyMessage(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | Ethereum address |
| `message` | `string` | Yes | Original message |
| `signature` | `string` | Yes | Message signature |
| `hex` | `boolean` | No | Message is hex-encoded (default: false) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    message: string;          // Original message
    address: string;          // Verified address
    signature: string;        // Signature
  } | { error: string; code?: string; }
}>
```

### Example

```javascript
const result = await sdk.ethereumVerifyMessage({
  address: "0x742d35Cc6634C0532925a3b8D400E4C3f8c8C9C8",
  message: "Hello OneKey!",
  signature: "0x..."
});

if (result.success) {
  console.log('Message verification successful');
}
```

## ERC-20 Token Operations

### Transfer ERC-20 Tokens

```javascript
// ERC-20 transfer function signature
function encodeERC20Transfer(to, amount) {
  // transfer(address,uint256)
  const functionSelector = '0xa9059cbb';
  const toAddress = to.slice(2).padStart(64, '0');
  const amountHex = amount.toString(16).padStart(64, '0');
  
  return functionSelector + toAddress + amountHex;
}

// Sign ERC-20 transfer transaction
const tokenTransfer = await sdk.ethereumSignTransaction({
  path: "m/44'/60'/0'/0/0",
  transaction: {
    to: "0xA0b86a33E6417c8f2c8B758B2d7D2E8E8E8E8E8E", // Token contract
    value: "0x0",
    gasLimit: "0xc350", // 50000
    gasPrice: "0x4a817c800",
    nonce: "0x1",
    data: encodeERC20Transfer(
      "0x742d35Cc6634C0532925a3b8D400E4C3f8c8C9C8", // Recipient
      "1000000000000000000" // 1 token (18 decimals)
    ),
    chainId: 1
  }
});
```

## Error Handling

```javascript
try {
  const result = await sdk.ethereumGetAddress({
    path: "m/44'/60'/0'/0/0",
    showOnDevice: true
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
    case 'Chain_NotSupported':
      console.error('Chain not supported');
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}
```

## Best Practices

### Gas Estimation
- Always estimate gas before signing transactions
- Use appropriate gas prices for network conditions
- Consider EIP-1559 for better fee management

### Security
- Verify all transaction details before signing
- Use `showOnDevice: true` for address verification
- Validate contract addresses and function calls

### Performance
- Batch address generation when possible
- Cache addresses to avoid repeated device calls
- Use appropriate timeouts for network operations

## Complete Example

```javascript
class EthereumWallet {
  constructor(sdk) {
    this.sdk = sdk;
  }
  
  async getAddress(index = 0, chainId = 1) {
    const path = `m/44'/60'/0'/0/${index}`;
    
    const result = await this.sdk.ethereumGetAddress({
      path,
      showOnDevice: index === 0,
      chainId
    });
    
    if (result.success) {
      return result.payload.address;
    } else {
      throw new Error(result.payload.error);
    }
  }
  
  async sendEther(to, amount, gasPrice, nonce) {
    const result = await this.sdk.ethereumSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction: {
        to,
        value: `0x${amount.toString(16)}`,
        gasLimit: "0x5208",
        gasPrice: `0x${gasPrice.toString(16)}`,
        nonce: `0x${nonce.toString(16)}`,
        chainId: 1
      }
    });
    
    if (result.success) {
      return result.payload.serializedTx;
    } else {
      throw new Error(result.payload.error);
    }
  }
  
  async signMessage(message) {
    const result = await this.sdk.ethereumSignMessage({
      path: "m/44'/60'/0'/0/0",
      message
    });
    
    if (result.success) {
      return result.payload.signature;
    } else {
      throw new Error(result.payload.error);
    }
  }
}

// Usage
const wallet = new EthereumWallet(sdk);

// Get address
const address = await wallet.getAddress(0);
console.log('Ethereum address:', address);

// Send transaction
const txHash = await wallet.sendEther(
  "0x742d35Cc6634C0532925a3b8D400E4C3f8c8C9C8",
  "1000000000000000000", // 1 ETH in wei
  "20000000000",          // 20 Gwei
  0                       // nonce
);
console.log('Transaction:', txHash);
```

## Next Steps

- [Other Blockchains](other-chains.md) - Solana, Cardano, and more
- [Device Management](device.md) - Device operations
- [Best Practices](../guides/best-practices.md) - Security and performance tips
- [Examples](../examples/basic.md) - Complete integration examples
