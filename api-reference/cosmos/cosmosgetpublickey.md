# cosmosGetPublicKey

## Cosmos: get public key

Retrieves BIP32 extended public key derived by given BIP32 path for Cosmos networks.

```typescript
const result = await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single public key

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `showOnOneKey` — _optional_ `boolean` determines if public key will be displayed on device. Default is set to `true`
* `curve` — _optional_ `string` elliptic curve to use ('secp256k1' or 'ed25519'). Default is 'secp256k1'

#### Exporting bundle of public keys

* `bundle` - `Array` of Objects with `path`, `showOnOneKey`, and `curve` fields

## Example

Return public key of first Cosmos account:

```typescript
HardwareSDK.cosmosGetPublicKey(connectId, deviceId, {
    path: "m/44'/118'/0'/0/0",
    curve: "secp256k1"
});
```

Return a bundle of public keys for multiple Cosmos accounts:

```typescript
HardwareSDK.cosmosGetPublicKey(connectId, deviceId, {
    bundle: [
        { path: "m/44'/118'/0'/0/0", curve: "secp256k1", showOnOneKey: false }, // account 1
        { path: "m/44'/118'/1'/0/0", curve: "secp256k1", showOnOneKey: false }, // account 2
        { path: "m/44'/118'/2'/0/0", curve: "secp256k1", showOnOneKey: false }  // account 3
    ]
});
```

## Result

Result with only one public key

```typescript
{
    success: true,
    payload: {
        path: Array<number>,        // hardened path
        serializedPath: string,     // serialized path
        publicKey: string,          // public key in hex format
        chainCode?: string,         // chain code for HD wallets (if available)
        xpub?: string,             // extended public key (if available)
    }
}
```

Result with bundle of public keys

```typescript
{
    success: true,
    payload: [
        { path: Array<number>, serializedPath: string, publicKey: string, ... }, // public key 1
        { path: Array<number>, serializedPath: string, publicKey: string, ... }, // public key 2
        { path: Array<number>, serializedPath: string, publicKey: string, ... }, // public key 3
    ]
}
```

Error

```typescript
{
    success: false,
    payload: {
        error: string, // error message
        code: number // error code
    }
}
```

## Supported Curves

### secp256k1
- **Default curve** for most Cosmos networks
- **33-byte compressed** public keys
- **Compatible with** Bitcoin-style cryptography
- **Used by**: Cosmos Hub, Osmosis, Juno, etc.

### ed25519
- **Alternative curve** for some networks
- **32-byte** public keys
- **Higher performance** for signature verification
- **Used by**: Some newer Cosmos chains

## Derivation Paths

Cosmos networks use BIP-44 derivation paths:

```
m/44'/coin_type'/account'/change/address_index
```

Common patterns:
- **Account level**: `m/44'/118'/0'` (for extended keys)
- **Address level**: `m/44'/118'/0'/0/0` (for specific addresses)

## Use Cases

### Account Discovery
```typescript
// Get public keys for multiple accounts
const getAccountPublicKeys = async (accountCount = 5) => {
    const bundle = [];
    
    for (let i = 0; i < accountCount; i++) {
        bundle.push({
            path: `m/44'/118'/${i}'/0/0`,
            curve: "secp256k1",
            showOnOneKey: false
        });
    }
    
    const result = await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            account: index,
            publicKey: item.publicKey,
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Multi-Signature Setup
```typescript
// Get public keys for multi-signature wallet
const getMultisigPublicKeys = async (accounts) => {
    const bundle = accounts.map(accountIndex => ({
        path: `m/44'/118'/${accountIndex}'/0/0`,
        curve: "secp256k1",
        showOnOneKey: false
    }));
    
    const result = await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            account: accounts[index],
            publicKey: item.publicKey,
            compressed: item.publicKey.length === 66, // 33 bytes * 2 hex chars
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Validator Key Generation
```typescript
// Get validator consensus public key
const getValidatorKey = async (accountIndex = 0) => {
    const result = await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, {
        path: `m/44'/118'/${accountIndex}'/0/0`,
        curve: "ed25519", // Some validators use ed25519
        showOnOneKey: true
    });
    
    if (result.success) {
        return {
            consensusPublicKey: result.payload.publicKey,
            path: result.payload.serializedPath,
            curve: "ed25519"
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Integration with Cosmos Libraries

```typescript
// Using @cosmjs/crypto
import { Secp256k1, pubkeyToAddress } from '@cosmjs/crypto';
import { toBech32 } from '@cosmjs/encoding';

const deriveAddressFromPublicKey = async (accountIndex = 0, hrp = 'cosmos') => {
    const result = await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, {
        path: `m/44'/118'/${accountIndex}'/0/0`,
        curve: "secp256k1",
        showOnOneKey: false
    });
    
    if (result.success) {
        const publicKeyBytes = Buffer.from(result.payload.publicKey, 'hex');
        
        // Derive address from public key
        const address = pubkeyToAddress(
            {
                type: 'tendermint/PubKeySecp256k1',
                value: publicKeyBytes
            },
            hrp
        );
        
        return {
            publicKey: result.payload.publicKey,
            address: toBech32(hrp, address),
            path: result.payload.serializedPath
        };
    }
    
    throw new Error(result.payload.error);
};
```

### Creating Amino Public Key
```typescript
// Create Amino-encoded public key for Cosmos SDK
const createAminoPublicKey = async (accountIndex = 0) => {
    const result = await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, {
        path: `m/44'/118'/${accountIndex}'/0/0`,
        curve: "secp256k1",
        showOnOneKey: false
    });
    
    if (result.success) {
        const publicKeyBytes = Buffer.from(result.payload.publicKey, 'hex');
        
        return {
            type: 'tendermint/PubKeySecp256k1',
            value: publicKeyBytes.toString('base64')
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Public Key Formats

### Compressed secp256k1
```typescript
// 33-byte compressed public key (most common)
const compressedKey = "03a1b2c3d4e5f6..."; // 66 hex characters
```

### Uncompressed secp256k1
```typescript
// 65-byte uncompressed public key (rare)
const uncompressedKey = "04a1b2c3d4e5f6..."; // 130 hex characters
```

### ed25519
```typescript
// 32-byte ed25519 public key
const ed25519Key = "a1b2c3d4e5f6..."; // 64 hex characters
```

## Network-Specific Usage

### Cosmos Hub
```typescript
const getCosmosHubPublicKey = async () => {
    return await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        curve: "secp256k1"
    });
};
```

### Kava (different coin type)
```typescript
const getKavaPublicKey = async () => {
    return await HardwareSDK.cosmosGetPublicKey(connectId, deviceId, {
        path: "m/44'/459'/0'/0/0", // Kava coin type
        curve: "secp256k1"
    });
};
```

## Security Notes

- Use `showOnOneKey: true` when setting up new accounts
- Public keys can be used to derive addresses but not private keys
- Store public keys securely as they can reveal transaction patterns
- Validate public key format before using in cryptographic operations
- Choose appropriate curve based on network requirements
- Be aware that public keys can be used to track transactions

## Related Methods

- [cosmosGetAddress](cosmosgetaddress.md) - Get Cosmos addresses
- [cosmosSignTransaction](cosmossigntransaction.md) - Sign transactions
