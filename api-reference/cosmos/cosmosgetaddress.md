# cosmosGetAddress

## Cosmos: get address

Display requested address derived by given BIP32 path on device and returns it to caller. User is presented with a description of the requested key and asked to confirm the export on OneKey.

```typescript
const result = await HardwareSDK.cosmosGetAddress(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single address

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `hrp` — _required_ `string` Human-readable part for bech32 address encoding
* `showOnOneKey` — _optional_ `boolean` determines if address will be displayed on device. Default is set to `true`

#### Exporting bundle of addresses

* `bundle` - `Array` of Objects with `path`, `hrp`, and `showOnOneKey` fields

## Supported Networks

| Network | HRP | Coin Type | Example Address |
|---------|-----|-----------|-----------------|
| Cosmos Hub | `cosmos` | 118 | `cosmos1...` |
| Osmosis | `osmo` | 118 | `osmo1...` |
| Juno | `juno` | 118 | `juno1...` |
| Stargaze | `stars` | 118 | `stars1...` |
| Akash | `akash` | 118 | `akash1...` |
| Kava | `kava` | 459 | `kava1...` |
| Secret | `secret` | 529 | `secret1...` |

## Example

Display first Cosmos Hub account address:

```typescript
HardwareSDK.cosmosGetAddress(connectId, deviceId, {
    path: "m/44'/118'/0'/0/0",
    hrp: "cosmos"
});
```

Return a bundle of addresses for different Cosmos networks:

```typescript
HardwareSDK.cosmosGetAddress(connectId, deviceId, {
    bundle: [
        { path: "m/44'/118'/0'/0/0", hrp: "cosmos", showOnOneKey: false }, // Cosmos Hub
        { path: "m/44'/118'/0'/0/0", hrp: "osmo", showOnOneKey: false },   // Osmosis
        { path: "m/44'/118'/0'/0/0", hrp: "juno", showOnOneKey: false },   // Juno
        { path: "m/44'/459'/0'/0/0", hrp: "kava", showOnOneKey: false }    // Kava
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
        address: string,           // Cosmos address (bech32)
        hrp: string,              // human-readable part used
    }
}
```

Result with bundle of addresses

```typescript
{
    success: true,
    payload: [
        { path: Array<number>, serializedPath: string, address: string, hrp: string }, // address 1
        { path: Array<number>, serializedPath: string, address: string, hrp: string }, // address 2
        { path: Array<number>, serializedPath: string, address: string, hrp: string }, // address 3
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

## Cosmos Address Format

Cosmos addresses use bech32 encoding with network-specific prefixes:

- **Format**: `{hrp}1{encoded_data}`
- **Length**: Typically 39-59 characters
- **Encoding**: bech32 with 20-byte address data
- **Case**: Lowercase only

## Derivation Paths

Cosmos networks typically use BIP-44 derivation paths:

```
m/44'/coin_type'/account'/change/address_index
```

Common coin types:
- **118**: Most Cosmos SDK chains (ATOM, OSMO, JUNO, etc.)
- **459**: Kava
- **529**: Secret Network
- **564**: IOV

## Use Cases

### Multi-Network Address Generation
```typescript
// Get addresses for multiple Cosmos networks
const getCosmosAddresses = async (accountIndex = 0, addressIndex = 0) => {
    const networks = [
        { name: 'Cosmos Hub', hrp: 'cosmos', coinType: 118 },
        { name: 'Osmosis', hrp: 'osmo', coinType: 118 },
        { name: 'Juno', hrp: 'juno', coinType: 118 },
        { name: 'Stargaze', hrp: 'stars', coinType: 118 },
        { name: 'Kava', hrp: 'kava', coinType: 459 },
        { name: 'Secret', hrp: 'secret', coinType: 529 }
    ];
    
    const bundle = networks.map(network => ({
        path: `m/44'/${network.coinType}'/${accountIndex}'/0/${addressIndex}`,
        hrp: network.hrp,
        showOnOneKey: false
    }));
    
    const result = await HardwareSDK.cosmosGetAddress(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            network: networks[index].name,
            address: item.address,
            hrp: item.hrp,
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Account Discovery
```typescript
// Get multiple addresses for the same network
const getAccountAddresses = async (hrp = 'cosmos', accountIndex = 0, count = 10) => {
    const bundle = [];
    
    for (let i = 0; i < count; i++) {
        bundle.push({
            path: `m/44'/118'/${accountIndex}'/0/${i}`,
            hrp,
            showOnOneKey: false
        });
    }
    
    const result = await HardwareSDK.cosmosGetAddress(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            index,
            address: item.address,
            path: item.serializedPath
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Validator Address Generation
```typescript
// Get validator address (different derivation)
const getValidatorAddress = async (accountIndex = 0) => {
    // Validator addresses typically use a different HRP
    return await HardwareSDK.cosmosGetAddress(connectId, deviceId, {
        path: `m/44'/118'/${accountIndex}'/0/0`,
        hrp: "cosmosvaloper", // Validator prefix
        showOnOneKey: true
    });
};
```

## Address Validation

Validate Cosmos addresses before use:

```typescript
const isValidCosmosAddress = (address, expectedHrp) => {
    // Basic format check
    const pattern = new RegExp(`^${expectedHrp}1[a-z0-9]{38,58}$`);
    return pattern.test(address);
};

// More comprehensive validation using bech32 library
import { bech32 } from 'bech32';

const validateCosmosAddress = (address, expectedHrp) => {
    try {
        const decoded = bech32.decode(address);
        
        // Check HRP matches
        if (decoded.prefix !== expectedHrp) {
            return false;
        }
        
        // Check data length (should be 20 bytes for standard addresses)
        const data = bech32.fromWords(decoded.words);
        return data.length === 20;
    } catch {
        return false;
    }
};
```

## Integration with Cosmos Libraries

```typescript
// Using @cosmjs/stargate
import { StargateClient } from '@cosmjs/stargate';

const getAddressWithBalance = async (hrp = 'cosmos', accountIndex = 0) => {
    const result = await HardwareSDK.cosmosGetAddress(connectId, deviceId, {
        path: `m/44'/118'/${accountIndex}'/0/0`,
        hrp,
        showOnOneKey: false
    });
    
    if (result.success) {
        const address = result.payload.address;
        
        // Connect to RPC endpoint
        const rpcEndpoint = hrp === 'cosmos' 
            ? 'https://rpc-cosmoshub.blockapsis.com'
            : `https://rpc-${hrp}.blockapsis.com`;
            
        const client = await StargateClient.connect(rpcEndpoint);
        const balance = await client.getAllBalances(address);
        
        return {
            address,
            balance,
            network: hrp
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Network-Specific Examples

### Cosmos Hub (ATOM)
```typescript
const getCosmosHubAddress = async () => {
    return await HardwareSDK.cosmosGetAddress(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        hrp: "cosmos",
        showOnOneKey: true
    });
};
```

### Osmosis (OSMO)
```typescript
const getOsmosisAddress = async () => {
    return await HardwareSDK.cosmosGetAddress(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        hrp: "osmo",
        showOnOneKey: true
    });
};
```

### Kava (KAVA)
```typescript
const getKavaAddress = async () => {
    return await HardwareSDK.cosmosGetAddress(connectId, deviceId, {
        path: "m/44'/459'/0'/0/0", // Different coin type
        hrp: "kava",
        showOnOneKey: true
    });
};
```

## Security Notes

- Always use `showOnOneKey: true` for receiving addresses
- Verify addresses on device screen before sharing
- Use correct HRP for the target network
- Validate address format before use
- Be aware that the same private key generates different addresses for different networks
- Store addresses securely and validate format before transactions

## Related Methods

- [cosmosGetPublicKey](cosmosgetpublickey.md) - Get public keys
- [cosmosSignTransaction](cosmossigntransaction.md) - Sign transactions
