# evmGetPublicKey

## Ethereum: get public key

Retrieves BIP32 extended public key derived by given BIP32 path for Ethereum and EVM-compatible networks.

```typescript
const result = await HardwareSDK.evmGetPublicKey(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single public key

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `showOnOneKey` — _optional_ `boolean` determines if public key will be displayed on device. Default is set to `true`
* `chainId` - _optional_ `number` The ChainId in ETH is a unique identifier for a specific Ethereum network

#### Exporting bundle of public keys

* `bundle` - `Array` of Objects with `path`, `showOnOneKey`, and `chainId` fields

## Example

Return public key of first ethereum account:

```typescript
HardwareSDK.evmGetPublicKey(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    chainId: 1
});
```

Return a bundle of public keys for multiple ethereum accounts:

```typescript
HardwareSDK.evmGetPublicKey(connectId, deviceId, {
    bundle: [
        { path: "m/44'/60'/0'/0/0", chainId: 1 }, // account 1
        { path: "m/44'/60'/1'/0/0", chainId: 1 }, // account 2
        { path: "m/44'/60'/2'/0/0", chainId: 1 }  // account 3
    ]
});
```

Get public key for different EVM networks:

```typescript
// Polygon network
HardwareSDK.evmGetPublicKey(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    chainId: 137
});

// BSC network
HardwareSDK.evmGetPublicKey(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    chainId: 56
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
        chainCode: string,          // chain code for HD wallets
        xpub: string,              // extended public key
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

## Supported Networks

This method works with all EVM-compatible networks:

| Network | Chain ID | Description |
|---------|----------|-------------|
| Ethereum | 1 | Main Ethereum network |
| Polygon | 137 | Polygon PoS network |
| BSC | 56 | Binance Smart Chain |
| Avalanche | 43114 | Avalanche C-Chain |
| Arbitrum | 42161 | Arbitrum One |
| Optimism | 10 | Optimism network |
| Fantom | 250 | Fantom Opera |

## Use Cases

### Account Discovery
```typescript
// Get extended public key for account-level operations
const getAccountXpub = async (accountIndex = 0, chainId = 1) => {
    const result = await HardwareSDK.evmGetPublicKey(connectId, deviceId, {
        path: `m/44'/60'/${accountIndex}'`,
        chainId,
        showOnOneKey: true
    });
    
    if (result.success) {
        return result.payload.xpub;
    }
    
    throw new Error('Failed to get account xpub');
};
```

### Multi-Network Public Keys
```typescript
// Get public keys for multiple networks
const getMultiNetworkKeys = async (path) => {
    const networks = [
        { name: 'Ethereum', chainId: 1 },
        { name: 'Polygon', chainId: 137 },
        { name: 'BSC', chainId: 56 }
    ];
    
    const keys = {};
    
    for (const network of networks) {
        const result = await HardwareSDK.evmGetPublicKey(connectId, deviceId, {
            path,
            chainId: network.chainId,
            showOnOneKey: false
        });
        
        if (result.success) {
            keys[network.name] = result.payload.publicKey;
        }
    }
    
    return keys;
};
```

## Security Notes

- Use `showOnOneKey: true` when setting up new accounts
- Extended public keys can derive child addresses but not private keys
- Store extended public keys securely as they reveal address relationships
- Validate public key format before using in cryptographic operations
- Consider the privacy implications of sharing extended public keys
