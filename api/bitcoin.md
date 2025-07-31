---
icon: bitcoin
---

# Bitcoin & Bitcoin Forks

Bitcoin and Bitcoin fork operations including address generation, transaction signing, and message signing for Bitcoin, Litecoin, Bitcoin Cash, and other UTXO-based cryptocurrencies.

## Overview

OneKey supports a wide range of Bitcoin-based cryptocurrencies through a unified API. All Bitcoin fork operations use the same methods with different coin parameters.

### Supported Coins

| Coin | Code | Coin Type | Description |
|------|------|-----------|-------------|
| Bitcoin | `btc` | 0 | Bitcoin mainnet |
| Bitcoin Testnet | `test` | 1 | Bitcoin testnet |
| Litecoin | `ltc` | 2 | Litecoin |
| Dogecoin | `doge` | 3 | Dogecoin |
| Dash | `dash` | 5 | Dash |
| Bitcoin Cash | `bch` | 145 | Bitcoin Cash |
| Zcash | `zec` | 133 | Zcash |

## btcGetAddress()

Get Bitcoin or Bitcoin fork address from device.

### Syntax

```javascript
await HardwareSDK.btcGetAddress(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string \| number[]` | ✅ | BIP-44 derivation path |
| `coin` | `string` | ✅ | Coin identifier (btc, ltc, doge, etc.) |
| `showOnDevice` | `boolean` | ❌ | Display address on device screen (default: false) |
| `scriptType` | `InputScriptType` | ❌ | Address script type (see below) |
| `multisig` | `MultisigRedeemScriptType` | ❌ | Multisig configuration |
| `chunkify` | `boolean` | ❌ | Split large requests into chunks |

#### Script Types

| Script Type | Description | Address Format | BIP |
|-------------|-------------|----------------|-----|
| `SPENDADDRESS` | Legacy P2PKH | 1... (Bitcoin) | BIP-44 |
| `SPENDP2SHWITNESS` | Wrapped SegWit | 3... (Bitcoin) | BIP-49 |
| `SPENDWITNESS` | Native SegWit | bc1q... (Bitcoin) | BIP-84 |
| `SPENDTAPROOT` | Taproot | bc1p... (Bitcoin) | BIP-86 |
| `SPENDMULTISIG` | Multisig | Various | BIP-45 |

### Returns

```typescript
Promise<DeviceResponse<{
  address: string;        // Generated Bitcoin address
  path: number[];         // Derivation path as array
  serializedPath: string; // Derivation path as string
  publicKey?: string;     // Public key (hex)
  chainCode?: string;     // Chain code for HD wallets
}>>
```

### Rate Limiting

- **Maximum requests per second**: 10
- **Recommended batch size**: 5 addresses
- **Timeout**: 30 seconds per request
- **Concurrent requests**: 3 maximum

### Examples

#### Basic Address Generation

```javascript
// Get Bitcoin address (Legacy P2PKH)
const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true,
  coin: 'btc'
});

if (result.success) {
  console.log('Bitcoin address:', result.payload.address);
  console.log('Public key:', result.payload.publicKey);
}
```

#### All Script Types

```javascript
// Legacy P2PKH address (1...)
const legacyAddress = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  scriptType: 'SPENDADDRESS',
  showOnDevice: true
});

// Wrapped SegWit P2SH-P2WPKH address (3...)
const wrappedSegwitAddress = await HardwareSDK.btcGetAddress({
  path: "m/49'/0'/0'/0/0",
  coin: 'btc',
  scriptType: 'SPENDP2SHWITNESS',
  showOnDevice: true
});

// Native SegWit P2WPKH address (bc1q...)
const nativeSegwitAddress = await HardwareSDK.btcGetAddress({
  path: "m/84'/0'/0'/0/0",
  coin: 'btc',
  scriptType: 'SPENDWITNESS',
  showOnDevice: true
});

// Taproot P2TR address (bc1p...)
const taprootAddress = await HardwareSDK.btcGetAddress({
  path: "m/86'/0'/0'/0/0",
  coin: 'btc',
  scriptType: 'SPENDTAPROOT',
  showOnDevice: true
});
```

#### Multi-Signature Addresses

```javascript
// 2-of-3 multisig address
const multisigAddress = await HardwareSDK.btcGetAddress({
  path: "m/45'/0'/0/0",
  coin: 'btc',
  scriptType: 'SPENDMULTISIG',
  multisig: {
    pubkeys: [
      {
        node: {
          depth: 4,
          fingerprint: 0,
          child_num: 0,
          chain_code: 'chain_code_1_hex',
          public_key: 'public_key_1_hex'
        },
        address_n: [45 | 0x80000000, 0, 0, 0]
      },
      {
        node: {
          depth: 4,
          fingerprint: 0,
          child_num: 0,
          chain_code: 'chain_code_2_hex',
          public_key: 'public_key_2_hex'
        },
        address_n: [45 | 0x80000000, 0, 0, 0]
      },
      {
        node: {
          depth: 4,
          fingerprint: 0,
          child_num: 0,
          chain_code: 'chain_code_3_hex',
          public_key: 'public_key_3_hex'
        },
        address_n: [45 | 0x80000000, 0, 0, 0]
      }
    ],
    signatures: ['', '', ''],
    m: 2 // 2-of-3 multisig
  },
  showOnDevice: true
});
```

#### Batch Address Generation

```javascript
// Generate multiple addresses efficiently
const generateAddressBatch = async (count = 10) => {
  const addresses = [];
  const batchSize = 5;

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];
    const end = Math.min(i + batchSize, count);

    for (let j = i; j < end; j++) {
      batch.push(
        HardwareSDK.btcGetAddress({
          path: `m/44'/0'/0'/0/${j}`,
          coin: 'btc',
          showOnDevice: false // Don't show for batch generation
        })
      );
    }

    const results = await Promise.all(batch);
    addresses.push(...results.map(r => r.payload.address));

    // Small delay between batches to respect rate limits
    if (i + batchSize < count) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return addresses;
};
```

#### Different Cryptocurrencies

```javascript
// Bitcoin forks and altcoins
const coins = [
  { name: 'Bitcoin', coin: 'btc', path: "m/44'/0'/0'/0/0" },
  { name: 'Litecoin', coin: 'ltc', path: "m/44'/2'/0'/0/0" },
  { name: 'Dogecoin', coin: 'doge', path: "m/44'/3'/0'/0/0" },
  { name: 'Bitcoin Cash', coin: 'bch', path: "m/44'/145'/0'/0/0" },
  { name: 'Dash', coin: 'dash', path: "m/44'/5'/0'/0/0" }
];

for (const { name, coin, path } of coins) {
  const result = await HardwareSDK.btcGetAddress({
    path,
    coin,
    showOnDevice: false
  });

  if (result.success) {
    console.log(`${name} address:`, result.payload.address);
  }
}
```

## btcGetPublicKey()

Get Bitcoin public key from device.

### Syntax

```javascript
await HardwareSDK.btcGetPublicKey(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `coin` | `string` | No | Coin type (default: 'btc') |
| `showOnDevice` | `boolean` | No | Show on device (default: false) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    publicKey: string;
    path: string;
    xpub: string;
    chainCode: string;
  }
}>
```

### Example

```javascript
const result = await HardwareSDK.btcGetPublicKey({
  path: "m/44'/0'/0'",
  coin: 'btc',
  showOnDevice: false
});

if (result.success) {
  console.log('Public key:', result.payload.publicKey);
  console.log('Extended public key:', result.payload.xpub);
}
```

## btcSignTransaction

Sign Bitcoin transactions with comprehensive support for all script types and advanced features.

### Method Signature

```typescript
btcSignTransaction(params: BtcSignTransactionParams): Promise<DeviceResponse<BtcSignTransactionResponse>>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `coin` | `string` | ✅ | Coin identifier (btc, ltc, doge, etc.) |
| `inputs` | `TxInputType[]` | ✅ | Transaction inputs |
| `outputs` | `TxOutputType[]` | ✅ | Transaction outputs |
| `refTxs` | `RefTransaction[]` | ❌ | Referenced transactions (for older firmware) |
| `account` | `AccountAddresses` | ❌ | Account addresses for validation |
| `preauthorized` | `boolean` | ❌ | Use preauthorized signing |
| `serialize` | `boolean` | ❌ | Return serialized transaction |
| `chunkify` | `boolean` | ❌ | Split large requests into chunks |

### Input Object (TxInputType)

```typescript
interface TxInputType {
  address_n?: number[];           // Derivation path as array
  prev_hash: string;              // Previous transaction hash (hex)
  prev_index: number;             // Previous output index
  script_sig?: string;            // Script signature (hex)
  sequence?: number;              // Sequence number (default: 0xffffffff)
  script_type?: InputScriptType;  // Input script type
  multisig?: MultisigRedeemScriptType; // Multisig configuration
  amount?: string;                // Input amount in satoshis (required for SegWit)
  witness?: string;               // Witness data (hex)
  ownership_proof?: string;       // Ownership proof for external inputs
  commitment_data?: string;       // Commitment data for CoinJoin
  orig_hash?: string;             // Original transaction hash (for RBF)
  orig_index?: number;            // Original output index (for RBF)
}
```

### Output Object (TxOutputType)

```typescript
interface TxOutputType {
  address?: string;               // Output address
  address_n?: number[];           // Derivation path (for change outputs)
  amount: string;                 // Output amount in satoshis
  script_type: OutputScriptType;  // Output script type
  multisig?: MultisigRedeemScriptType; // Multisig configuration
  op_return_data?: string;        // OP_RETURN data (hex)
  orig_hash?: string;             // Original transaction hash (for RBF)
  orig_index?: number;            // Original output index (for RBF)
}
### Response

```typescript
interface BtcSignTransactionResponse {
  serializedTx: string;       // Signed transaction hex
  signatures: string[];       // Transaction signatures
  txid?: string;              // Transaction ID (if computed)
}
```

### Rate Limiting

- **Maximum requests per second**: 1
- **Recommended timeout**: 60 seconds
- **Concurrent requests**: 1 (sequential only)
- **Maximum inputs**: 100 per transaction
- **Maximum outputs**: 100 per transaction

### Examples

#### Simple P2PKH Transaction

```javascript
// Simple Bitcoin transaction (Legacy)
const result = await HardwareSDK.btcSignTransaction({
  coin: 'btc',
  inputs: [{
    address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
    prev_hash: 'abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    prev_index: 0,
    amount: '100000', // 0.001 BTC in satoshis
    script_type: 'SPENDADDRESS'
  }],
  outputs: [{
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    amount: '90000', // 0.0009 BTC (minus fee)
    script_type: 'PAYTOADDRESS'
  }]
});

if (result.success) {
  console.log('Signed transaction:', result.payload.serializedTx);
  console.log('Transaction ID:', result.payload.txid);
}
```

#### SegWit Transaction (P2WPKH)

```javascript
// Native SegWit transaction
const segwitTx = await HardwareSDK.btcSignTransaction({
  coin: 'btc',
  inputs: [{
    address_n: [84 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
    prev_hash: 'def567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    prev_index: 1,
    amount: '200000', // 0.002 BTC
    script_type: 'SPENDWITNESS'
  }],
  outputs: [
    {
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      amount: '150000', // 0.0015 BTC
      script_type: 'PAYTOWITNESS'
    },
    {
      // Change output
      address_n: [84 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 1, 0],
      amount: '45000', // 0.00045 BTC (change)
      script_type: 'PAYTOWITNESS'
    }
  ]
});
```

#### Multi-Input Transaction

```javascript
// Transaction with multiple inputs
const multiInputTx = await HardwareSDK.btcSignTransaction({
  coin: 'btc',
  inputs: [
    {
      address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
      prev_hash: 'hash1...',
      prev_index: 0,
      amount: '50000',
      script_type: 'SPENDADDRESS'
    },
    {
      address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 1],
      prev_hash: 'hash2...',
      prev_index: 1,
      amount: '75000',
      script_type: 'SPENDADDRESS'
    }
  ],
  outputs: [{
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    amount: '120000', // Combined minus fee
    script_type: 'PAYTOADDRESS'
  }]
});
```

#### Multisig Transaction (2-of-3)

```javascript
// 2-of-3 multisig transaction
const multisigTx = await HardwareSDK.btcSignTransaction({
  coin: 'btc',
  inputs: [{
    address_n: [45 | 0x80000000, 0, 0, 0],
    prev_hash: 'multisig_prev_hash...',
    prev_index: 0,
    amount: '300000',
    script_type: 'SPENDMULTISIG',
    multisig: {
      pubkeys: [
        {
          node: {
            depth: 4,
            fingerprint: 0,
            child_num: 0,
            chain_code: 'chain_code_1_hex',
            public_key: 'public_key_1_hex'
          },
          address_n: [45 | 0x80000000, 0, 0, 0]
        },
        {
          node: {
            depth: 4,
            fingerprint: 0,
            child_num: 0,
            chain_code: 'chain_code_2_hex',
            public_key: 'public_key_2_hex'
          },
          address_n: [45 | 0x80000000, 0, 0, 0]
        },
        {
          node: {
            depth: 4,
            fingerprint: 0,
            child_num: 0,
            chain_code: 'chain_code_3_hex',
            public_key: 'public_key_3_hex'
          },
          address_n: [45 | 0x80000000, 0, 0, 0]
        }
      ],
      signatures: ['', '', ''], // Will be filled by device
      m: 2 // 2-of-3 multisig
    }
  }],
  outputs: [{
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    amount: '290000', // Minus fee
    script_type: 'PAYTOSCRIPTHASH'
  }]
});
```

#### Replace-by-Fee (RBF) Transaction

```javascript
// RBF transaction with higher fee
const rbfTx = await HardwareSDK.btcSignTransaction({
  coin: 'btc',
  inputs: [{
    address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
    prev_hash: 'original_tx_hash...',
    prev_index: 0,
    amount: '100000',
    script_type: 'SPENDADDRESS',
    sequence: 0xfffffffd, // Enable RBF
    orig_hash: 'original_tx_hash_to_replace...',
    orig_index: 0
  }],
  outputs: [{
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    amount: '85000', // Lower amount due to higher fee
    script_type: 'PAYTOADDRESS'
  }]
});
```
}
```

## btcSignMessage()

Sign message with Bitcoin private key.

### Syntax

```javascript
await HardwareSDK.btcSignMessage(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `message` | `string` | Yes | Message to sign |
| `coin` | `string` | No | Coin type (default: 'btc') |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    address: string;
    signature: string;
  }
}>
```

### Example

```javascript
const result = await HardwareSDK.btcSignMessage({
  path: "m/44'/0'/0'/0/0",
  message: 'Hello OneKey!',
  coin: 'btc'
});

if (result.success) {
  console.log('Address:', result.payload.address);
  console.log('Signature:', result.payload.signature);
}
```

## btcVerifyMessage()

Verify message signature.

### Syntax

```javascript
await HardwareSDK.btcVerifyMessage(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | Bitcoin address |
| `message` | `string` | Yes | Original message |
| `signature` | `string` | Yes | Message signature |
| `coin` | `string` | No | Coin type (default: 'btc') |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    message: string;
  }
}>
```

### Example

```javascript
const result = await HardwareSDK.btcVerifyMessage({
  address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  message: 'Hello OneKey!',
  signature: 'H1234567890abcdef...',
  coin: 'btc'
});

if (result.success) {
  console.log('Message verification successful');
} else {
  console.log('Message verification failed');
}
```

## Derivation Paths

### Standard BIP-44 Paths

```javascript
// Bitcoin paths
const bitcoinPaths = {
  account0: "m/44'/0'/0'",      // Account 0
  receive0: "m/44'/0'/0'/0/0",  // First receiving address
  change0: "m/44'/0'/0'/1/0",   // First change address
};

// Other coin paths
const coinPaths = {
  litecoin: "m/44'/2'/0'/0/0",
  bitcoinCash: "m/44'/145'/0'/0/0",
  dogecoin: "m/44'/3'/0'/0/0",
  dash: "m/44'/5'/0'/0/0",
  zcash: "m/44'/133'/0'/0/0"
};
```

### Legacy and SegWit Paths

```javascript
// Legacy P2PKH
const legacyPath = "m/44'/0'/0'/0/0";

// SegWit P2SH-P2WPKH
const segwitPath = "m/49'/0'/0'/0/0";

// Native SegWit P2WPKH
const nativeSegwitPath = "m/84'/0'/0'/0/0";
```

## Next Steps

- [Ethereum & EVM Chains](ethereum.md) - Ethereum-specific operations
- [Solana](solana.md) - Solana blockchain operations
- [Cardano](cardano.md) - Cardano blockchain operations
- [Polkadot](polkadot.md) - Polkadot and Substrate chains
- [Cosmos](cosmos.md) - Cosmos ecosystem chains
- [Device Management](device.md) - Device connection and management
- [Utility Methods](utils.md) - Helper functions and utilities
