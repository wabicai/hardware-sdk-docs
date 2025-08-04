# stellarGetAddress

## Stellar: get address

Display requested address derived by given BIP32 path on device and returns it to caller.

```typescript
const result = await HardwareSDK.stellarGetAddress(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single address

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `showOnOneKey` — _optional_ `boolean` determines if address will be displayed on device. Default is set to `true`

#### Exporting bundle of addresses

* `bundle` - `Array` of Objects with `path` and `showOnOneKey` fields

## Example

Display first Stellar account address:

```typescript
HardwareSDK.stellarGetAddress(connectId, deviceId, {
    path: "m/44'/148'/0'"
});
```

Return a bundle of addresses from first Stellar account:

```typescript
HardwareSDK.stellarGetAddress(connectId, deviceId, {
    bundle: [
        { path: "m/44'/148'/0'", showOnOneKey: false }, // account 1
        { path: "m/44'/148'/1'", showOnOneKey: false }, // account 2
        { path: "m/44'/148'/2'", showOnOneKey: false }  // account 3
    ]
});
```

## Result

Result with only one address

```typescript
{
    success: true,
    payload: {
        path: Array<number>,        // hardened path
        serializedPath: string,     // serialized path
        address: string,           // Stellar address
        publicKey: string,         // public key in hex format
    }
}
```

Result with bundle of addresses

```typescript
{
    success: true,
    payload: [
        { path: Array<number>, serializedPath: string, address: string, publicKey: string }, // address 1
        { path: Array<number>, serializedPath: string, address: string, publicKey: string }, // address 2
        { path: Array<number>, serializedPath: string, address: string, publicKey: string }, // address 3
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

## Stellar Address Format

Stellar addresses are:
- **56 characters** in length
- **Base32 encoded** with checksum
- Start with **'G'** for account addresses
- Example: `GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A`

## Derivation Path

Stellar uses BIP-44 derivation path:
```
m/44'/148'/account'
```

Where:
- `44'` is the BIP-44 purpose
- `148'` is Stellar's coin type
- `account'` is the account index (hardened)

Note: Stellar uses account-level derivation, not address-level.

## Use Cases

### Account Discovery
```typescript
// Get multiple account addresses
const getAccountAddresses = async (accountCount = 5) => {
    const bundle = [];
    
    for (let i = 0; i < accountCount; i++) {
        bundle.push({
            path: `m/44'/148'/${i}'`,
            showOnOneKey: false
        });
    }
    
    const result = await HardwareSDK.stellarGetAddress(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            account: index,
            address: item.address,
            publicKey: item.publicKey,
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Address Validation
```typescript
// Validate and get address for receiving funds
const getReceiveAddress = async (accountIndex = 0) => {
    const result = await HardwareSDK.stellarGetAddress(connectId, deviceId, {
        path: `m/44'/148'/${accountIndex}'`,
        showOnOneKey: true // Always show for receiving addresses
    });
    
    if (result.success) {
        // Validate Stellar address format
        const address = result.payload.address;
        if (!/^G[A-Z2-7]{55}$/.test(address)) {
            throw new Error('Invalid Stellar address format');
        }
        
        return {
            address,
            publicKey: result.payload.publicKey
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Integration with Stellar SDK

```typescript
// Using stellar-sdk
import { Keypair, Networks, Server } from 'stellar-sdk';

const getAddressWithBalance = async (accountIndex = 0) => {
    const result = await HardwareSDK.stellarGetAddress(connectId, deviceId, {
        path: `m/44'/148'/${accountIndex}'`,
        showOnOneKey: false
    });
    
    if (result.success) {
        const address = result.payload.address;
        
        // Connect to Stellar network
        const server = new Server('https://horizon.stellar.org');
        
        try {
            const account = await server.loadAccount(address);
            
            return {
                address,
                publicKey: result.payload.publicKey,
                balances: account.balances,
                sequence: account.sequence
            };
        } catch (error) {
            if (error.response?.status === 404) {
                return {
                    address,
                    publicKey: result.payload.publicKey,
                    balances: [],
                    sequence: '0',
                    funded: false
                };
            }
            throw error;
        }
    }
    
    throw new Error(result.payload.error);
};
```

## Address Verification

Always verify Stellar addresses before use:

```typescript
const isValidStellarAddress = (address) => {
    // Basic format check
    if (!/^G[A-Z2-7]{55}$/.test(address)) {
        return false;
    }
    
    // Additional validation using stellar-sdk
    try {
        const keypair = Keypair.fromPublicKey(address);
        return keypair.publicKey() === address;
    } catch {
        return false;
    }
};
```

## Security Notes

- Always use `showOnOneKey: true` for receiving addresses
- Verify addresses on device screen before sharing
- Stellar addresses are case-sensitive
- Store addresses securely and validate format before use
- Stellar uses account-level derivation, not individual address derivation
- Consider account funding requirements (minimum balance)

## Related Methods

- [stellarSignTransaction](stellarsigntransaction.md) - Sign Stellar transactions
