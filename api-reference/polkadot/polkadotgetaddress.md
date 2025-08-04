# polkadotGetAddress

## Polkadot: get address

Display requested address derived by given BIP32 path on device and returns it to caller. User is presented with a description of the requested key and asked to confirm the export on OneKey.

```typescript
const result = await HardwareSDK.polkadotGetAddress(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single address

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `prefix` — _required_ `number` SS58 address format prefix for the target network
* `network` — _optional_ `string` network name for display purposes
* `showOnOneKey` — _optional_ `boolean` determines if address will be displayed on device. Default is set to `true`

#### Exporting bundle of addresses

* `bundle` - `Array` of Objects with `path`, `prefix`, `network`, and `showOnOneKey` fields

## Supported Networks

| Network | Prefix | Example Address |
|---------|--------|-----------------|
| Polkadot | 0 | `1...` |
| Kusama | 2 | `C...`, `D...`, `F...`, `G...`, `H...`, `J...` |
| Westend | 42 | `5...` |
| Rococo | 42 | `5...` |
| Acala | 10 | `2...` |
| Karura | 8 | `r...`, `s...`, `t...`, `u...`, `v...`, `w...`, `x...`, `y...`, `z...` |
| Moonbeam | 1284 | `1...` |
| Moonriver | 1285 | `1...` |

## Example

Display first Polkadot account address:

```typescript
HardwareSDK.polkadotGetAddress(connectId, deviceId, {
    path: "m/44'/354'/0'/0'/0'",
    prefix: 0,
    network: "polkadot"
});
```

Return a bundle of addresses for different Polkadot networks:

```typescript
HardwareSDK.polkadotGetAddress(connectId, deviceId, {
    bundle: [
        { path: "m/44'/354'/0'/0'/0'", prefix: 0, network: "polkadot", showOnOneKey: false },  // Polkadot
        { path: "m/44'/354'/0'/0'/0'", prefix: 2, network: "kusama", showOnOneKey: false },    // Kusama
        { path: "m/44'/354'/0'/0'/0'", prefix: 42, network: "westend", showOnOneKey: false },  // Westend
        { path: "m/44'/354'/0'/0'/0'", prefix: 10, network: "acala", showOnOneKey: false }     // Acala
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
        address: string,           // Polkadot address (SS58)
        publicKey: string,         // public key in hex format
        prefix: number,            // SS58 prefix used
    }
}
```

Result with bundle of addresses

```typescript
{
    success: true,
    payload: [
        { path: Array<number>, serializedPath: string, address: string, publicKey: string, prefix: number }, // address 1
        { path: Array<number>, serializedPath: string, address: string, publicKey: string, prefix: number }, // address 2
        { path: Array<number>, serializedPath: string, address: string, publicKey: string, prefix: number }, // address 3
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

## Polkadot Address Format

Polkadot addresses use SS58 encoding with network-specific prefixes:

- **Encoding**: SS58 (Substrate's address format)
- **Length**: Typically 47-48 characters
- **Format**: Base58 encoding with checksum
- **Prefix**: Determines the network and address appearance

## Derivation Paths

Polkadot uses fully hardened derivation paths:

```
m/44'/354'/account'/change'/address_index'
```

Where:
- `44'` is the BIP-44 purpose
- `354'` is Polkadot's coin type
- All levels are hardened (include `'`)

## Use Cases

### Multi-Network Address Generation
```typescript
// Get addresses for multiple Polkadot ecosystem networks
const getPolkadotAddresses = async (accountIndex = 0, addressIndex = 0) => {
    const networks = [
        { name: 'Polkadot', prefix: 0 },
        { name: 'Kusama', prefix: 2 },
        { name: 'Westend', prefix: 42 },
        { name: 'Acala', prefix: 10 },
        { name: 'Karura', prefix: 8 },
        { name: 'Moonbeam', prefix: 1284 }
    ];
    
    const bundle = networks.map(network => ({
        path: `m/44'/354'/${accountIndex}'/0'/${addressIndex}'`,
        prefix: network.prefix,
        network: network.name.toLowerCase(),
        showOnOneKey: false
    }));
    
    const result = await HardwareSDK.polkadotGetAddress(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            network: networks[index].name,
            address: item.address,
            publicKey: item.publicKey,
            prefix: item.prefix,
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Account Discovery
```typescript
// Get multiple addresses for the same network
const getAccountAddresses = async (prefix = 0, accountIndex = 0, count = 10) => {
    const bundle = [];
    
    for (let i = 0; i < count; i++) {
        bundle.push({
            path: `m/44'/354'/${accountIndex}'/0'/${i}'`,
            prefix,
            network: "polkadot",
            showOnOneKey: false
        });
    }
    
    const result = await HardwareSDK.polkadotGetAddress(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            index,
            address: item.address,
            publicKey: item.publicKey,
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Stash and Controller Addresses
```typescript
// Get stash and controller addresses for staking
const getStakingAddresses = async (accountIndex = 0) => {
    const bundle = [
        { 
            path: `m/44'/354'/${accountIndex}'/0'/0'`, // Stash account
            prefix: 0,
            network: "polkadot",
            showOnOneKey: false
        },
        { 
            path: `m/44'/354'/${accountIndex}'/1'/0'`, // Controller account
            prefix: 0,
            network: "polkadot",
            showOnOneKey: false
        }
    ];
    
    const result = await HardwareSDK.polkadotGetAddress(connectId, deviceId, { bundle });
    
    if (result.success) {
        return {
            stash: {
                address: result.payload[0].address,
                publicKey: result.payload[0].publicKey,
                path: result.payload[0].serializedPath
            },
            controller: {
                address: result.payload[1].address,
                publicKey: result.payload[1].publicKey,
                path: result.payload[1].serializedPath
            }
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Address Validation

Validate Polkadot addresses before use:

```typescript
// Using @polkadot/util-crypto
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';

const isValidPolkadotAddress = (address, expectedPrefix = null) => {
    try {
        const decoded = decodeAddress(address);
        
        // Check if it's a valid 32-byte public key
        if (decoded.length !== 32) {
            return false;
        }
        
        // If prefix is specified, check if address matches
        if (expectedPrefix !== null) {
            const reencoded = encodeAddress(decoded, expectedPrefix);
            return reencoded === address;
        }
        
        return true;
    } catch {
        return false;
    }
};
```

## Integration with Polkadot Libraries

```typescript
// Using @polkadot/api
import { ApiPromise, WsProvider } from '@polkadot/api';

const getAddressWithBalance = async (accountIndex = 0, prefix = 0) => {
    const result = await HardwareSDK.polkadotGetAddress(connectId, deviceId, {
        path: `m/44'/354'/${accountIndex}'/0'/0'`,
        prefix,
        network: "polkadot",
        showOnOneKey: false
    });
    
    if (result.success) {
        const address = result.payload.address;
        
        // Connect to Polkadot node
        const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        const api = await ApiPromise.create({ provider: wsProvider });
        
        // Get account balance
        const { data: balance } = await api.query.system.account(address);
        
        return {
            address,
            publicKey: result.payload.publicKey,
            balance: {
                free: balance.free.toString(),
                reserved: balance.reserved.toString(),
                frozen: balance.frozen.toString()
            }
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Network-Specific Examples

### Polkadot Mainnet
```typescript
const getPolkadotAddress = async () => {
    return await HardwareSDK.polkadotGetAddress(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'",
        prefix: 0,
        network: "polkadot",
        showOnOneKey: true
    });
};
```

### Kusama
```typescript
const getKusamaAddress = async () => {
    return await HardwareSDK.polkadotGetAddress(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'",
        prefix: 2,
        network: "kusama",
        showOnOneKey: true
    });
};
```

### Acala
```typescript
const getAcalaAddress = async () => {
    return await HardwareSDK.polkadotGetAddress(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'",
        prefix: 10,
        network: "acala",
        showOnOneKey: true
    });
};
```

## SS58 Prefix Reference

Common SS58 prefixes in the Polkadot ecosystem:

```typescript
const SS58_PREFIXES = {
    polkadot: 0,
    kusama: 2,
    westend: 42,
    rococo: 42,
    acala: 10,
    karura: 8,
    moonbeam: 1284,
    moonriver: 1285,
    astar: 5,
    shiden: 5,
    parallel: 172,
    heiko: 110
};
```

## Security Notes

- Always use `showOnOneKey: true` for receiving addresses
- Verify addresses on device screen before sharing
- Use correct SS58 prefix for the target network
- Validate address format before use
- Be aware that the same private key generates different addresses for different networks
- Store addresses securely and validate format before transactions
- Polkadot uses fully hardened derivation paths for security

## Related Methods

- [polkadotSignTransaction](polkadotsigntransaction.md) - Sign transactions
- [polkadotGetPublicKey](polkadotgetpublickey.md) - Get public keys (if available)
