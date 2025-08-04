# cardanoGetPublicKey

## Cardano: get public key

Retrieves BIP32 extended public key derived by given BIP32 path for Cardano network.

```typescript
const result = await HardwareSDK.cardanoGetPublicKey(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single public key

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `showOnOneKey` — _optional_ `boolean` determines if public key will be displayed on device. Default is set to `true`

#### Exporting bundle of public keys

* `bundle` - `Array` of Objects with `path` and `showOnOneKey` fields

## Example

Return public key of first Cardano account:

```typescript
HardwareSDK.cardanoGetPublicKey(connectId, deviceId, {
    path: "m/1852'/1815'/0'"
});
```

Return a bundle of public keys for multiple Cardano accounts:

```typescript
HardwareSDK.cardanoGetPublicKey(connectId, deviceId, {
    bundle: [
        { path: "m/1852'/1815'/0'", showOnOneKey: false }, // account 1
        { path: "m/1852'/1815'/1'", showOnOneKey: false }, // account 2
        { path: "m/1852'/1815'/2'", showOnOneKey: false }  // account 3
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

## Cardano Derivation Paths

Cardano uses CIP-1852 derivation paths:

```
m/1852'/1815'/account'/role/index
```

For public key export, typically use account level:
```
m/1852'/1815'/account'
```

Where:
- `1852'` is the CIP-1852 purpose
- `1815'` is Cardano's coin type
- `account'` is the account index (hardened)

## Use Cases

### Account Discovery
```typescript
// Get extended public keys for multiple accounts
const getAccountXpubs = async (accountCount = 5) => {
    const bundle = [];
    
    for (let i = 0; i < accountCount; i++) {
        bundle.push({
            path: `m/1852'/1815'/${i}'`,
            showOnOneKey: false
        });
    }
    
    const result = await HardwareSDK.cardanoGetPublicKey(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            account: index,
            xpub: item.xpub,
            publicKey: item.publicKey,
            chainCode: item.chainCode,
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Staking Key Derivation
```typescript
// Get staking key for an account
const getStakingKey = async (accountIndex = 0) => {
    const result = await HardwareSDK.cardanoGetPublicKey(connectId, deviceId, {
        path: `m/1852'/1815'/${accountIndex}'/2/0`, // Staking key path
        showOnOneKey: true
    });
    
    if (result.success) {
        return {
            stakingPublicKey: result.payload.publicKey,
            stakingChainCode: result.payload.chainCode,
            path: result.payload.serializedPath
        };
    }
    
    throw new Error(result.payload.error);
};
```

### Multi-Signature Setup
```typescript
// Get public keys for multi-signature wallet setup
const getMultisigKeys = async (accounts) => {
    const bundle = accounts.map(accountIndex => ({
        path: `m/1852'/1815'/${accountIndex}'`,
        showOnOneKey: false
    }));
    
    const result = await HardwareSDK.cardanoGetPublicKey(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            account: accounts[index],
            publicKey: item.publicKey,
            xpub: item.xpub,
            chainCode: item.chainCode
        }));
    }
    
    throw new Error(result.payload.error);
};
```

## Integration with Cardano Libraries

```typescript
// Using @emurgo/cardano-serialization-lib-browser
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-browser';

const deriveAddressFromXpub = async (accountIndex = 0, addressIndex = 0) => {
    // Get account extended public key
    const result = await HardwareSDK.cardanoGetPublicKey(connectId, deviceId, {
        path: `m/1852'/1815'/${accountIndex}'`,
        showOnOneKey: false
    });
    
    if (result.success) {
        const xpub = result.payload.xpub;
        
        // Derive child keys using Cardano WASM
        const accountKey = CardanoWasm.Bip32PublicKey.from_bech32(xpub);
        const paymentKey = accountKey
            .derive(0) // External chain
            .derive(addressIndex);
        
        const stakingKey = accountKey
            .derive(2) // Staking chain
            .derive(0);
        
        // Create base address
        const paymentCredential = CardanoWasm.StakeCredential.from_keyhash(
            paymentKey.to_raw_key().hash()
        );
        const stakingCredential = CardanoWasm.StakeCredential.from_keyhash(
            stakingKey.to_raw_key().hash()
        );
        
        const baseAddress = CardanoWasm.BaseAddress.new(
            CardanoWasm.NetworkInfo.mainnet().network_id(),
            paymentCredential,
            stakingCredential
        );
        
        return {
            address: baseAddress.to_address().to_bech32(),
            paymentKey: paymentKey.to_raw_key().to_hex(),
            stakingKey: stakingKey.to_raw_key().to_hex()
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Key Types in Cardano

### Payment Keys
Used for spending UTXOs:
```typescript
// Payment key path: m/1852'/1815'/account'/0/index
const paymentKeyPath = `m/1852'/1815'/0'/0/0`;
```

### Staking Keys
Used for delegation and rewards:
```typescript
// Staking key path: m/1852'/1815'/account'/2/0
const stakingKeyPath = `m/1852'/1815'/0'/2/0`;
```

### Account Keys
Root keys for deriving child keys:
```typescript
// Account key path: m/1852'/1815'/account'
const accountKeyPath = `m/1852'/1815'/0'`;
```

## Extended Public Key Format

Cardano extended public keys are encoded in bech32 format with specific prefixes:

- **Account keys**: `acct_xvk...`
- **Payment keys**: `addr_xvk...`
- **Staking keys**: `stake_xvk...`

## Security Notes

- Use `showOnOneKey: true` when setting up new accounts
- Extended public keys can derive child addresses but not private keys
- Store extended public keys securely as they reveal address relationships
- Validate public key format before using in cryptographic operations
- Be aware of the privacy implications of sharing extended public keys
- Use appropriate derivation paths for different key purposes

## Related Methods

- [cardanoGetAddress](cardanogetaddress.md) - Get Cardano addresses
- [cardanoSignTransaction](cardanosigntransaction.md) - Sign transactions
- [cardanoSignMessage](cardanosignmessage.md) - Sign messages
