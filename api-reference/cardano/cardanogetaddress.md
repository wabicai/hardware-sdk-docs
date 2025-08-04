# cardanoGetAddress

## Cardano: get address

Display requested address derived by given BIP32 path on device and returns it to caller. User is presented with a description of the requested key and asked to confirm the export on OneKey.

```typescript
const result = await HardwareSDK.cardanoGetAddress(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single address

* `path` — _required_ `string | Array<number>` minimum length is `5`. [read more](../path.md)
* `showOnOneKey` — _optional_ `boolean` determines if address will be displayed on device. Default is set to `true`
* `protocolMagic` — _optional_ `number` Cardano protocol magic number (mainnet: 764824073, testnet: 1097911063)
* `networkId` — _optional_ `number` Cardano network ID (mainnet: 1, testnet: 0)
* `addressType` — _optional_ `number` Cardano address type (0: Base, 1: Pointer, 2: Enterprise, 3: Reward, 6: Byron)

#### Exporting bundle of addresses

* `bundle` - `Array` of Objects with `path`, `showOnOneKey`, `protocolMagic`, `networkId`, and `addressType` fields

## Address Types

| Type | Value | Description | Use Case |
|------|-------|-------------|----------|
| Base | 0 | Payment + Staking credentials | Standard wallet addresses |
| Pointer | 1 | Payment + Staking pointer | Compact staking addresses |
| Enterprise | 2 | Payment credential only | Exchanges, no staking |
| Reward | 3 | Staking credential only | Staking rewards |
| Byron | 6 | Legacy Byron addresses | Legacy compatibility |

## Example

Display first Cardano account address:

```typescript
HardwareSDK.cardanoGetAddress(connectId, deviceId, {
    path: "m/1852'/1815'/0'/0/0",
    protocolMagic: 764824073,
    networkId: 1,
    addressType: 0
});
```

Return a bundle of addresses from first Cardano account:

```typescript
HardwareSDK.cardanoGetAddress(connectId, deviceId, {
    bundle: [
        { 
            path: "m/1852'/1815'/0'/0/0", 
            showOnOneKey: false,
            protocolMagic: 764824073,
            networkId: 1,
            addressType: 0
        },
        { 
            path: "m/1852'/1815'/0'/0/1", 
            showOnOneKey: false,
            protocolMagic: 764824073,
            networkId: 1,
            addressType: 0
        }
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
        address: string,           // Cardano address (bech32)
        protocolMagic: number,     // protocol magic used
        networkId: number,         // network ID used
        addressType: number,       // address type used
    }
}
```

Result with bundle of addresses

```typescript
{
    success: true,
    payload: [
        { path: Array<number>, serializedPath: string, address: string, ... }, // address 1
        { path: Array<number>, serializedPath: string, address: string, ... }, // address 2
        { path: Array<number>, serializedPath: string, address: string, ... }, // address 3
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

## Cardano Address Format

Cardano addresses use bech32 encoding and have different prefixes:

- **Mainnet addresses**: Start with `addr1`
- **Testnet addresses**: Start with `addr_test1`
- **Byron legacy**: Start with `Ae2` or similar
- **Stake addresses**: Start with `stake1` (mainnet) or `stake_test1` (testnet)

## Derivation Paths

Cardano uses CIP-1852 derivation paths:

```
m/1852'/1815'/account'/role/index
```

Where:
- `1852'` is the CIP-1852 purpose
- `1815'` is Cardano's coin type
- `account'` is the account index (hardened)
- `role` is 0 for external (receiving) or 1 for internal (change)
- `index` is the address index

## Use Cases

### Account Discovery
```typescript
// Get multiple account addresses
const getAccountAddresses = async (accountIndex = 0, count = 20) => {
    const bundle = [];
    
    for (let i = 0; i < count; i++) {
        bundle.push({
            path: `m/1852'/1815'/${accountIndex}'/0/${i}`,
            showOnOneKey: false,
            protocolMagic: 764824073,
            networkId: 1,
            addressType: 0
        });
    }
    
    const result = await HardwareSDK.cardanoGetAddress(connectId, deviceId, { bundle });
    
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

### Different Address Types
```typescript
// Get different types of addresses for the same account
const getAddressTypes = async (accountIndex = 0) => {
    const addressTypes = [
        { type: 0, name: 'Base Address' },
        { type: 2, name: 'Enterprise Address' },
        { type: 3, name: 'Reward Address' }
    ];
    
    const bundle = addressTypes.map(({ type }) => ({
        path: `m/1852'/1815'/${accountIndex}'/0/0`,
        showOnOneKey: false,
        protocolMagic: 764824073,
        networkId: 1,
        addressType: type
    }));
    
    const result = await HardwareSDK.cardanoGetAddress(connectId, deviceId, { bundle });
    
    if (result.success) {
        return result.payload.map((item, index) => ({
            type: addressTypes[index].name,
            address: item.address,
            addressType: item.addressType
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Testnet Addresses
```typescript
// Get testnet addresses
const getTestnetAddress = async (accountIndex = 0, addressIndex = 0) => {
    return await HardwareSDK.cardanoGetAddress(connectId, deviceId, {
        path: `m/1852'/1815'/${accountIndex}'/0/${addressIndex}`,
        showOnOneKey: true,
        protocolMagic: 1097911063, // Testnet magic
        networkId: 0,              // Testnet network ID
        addressType: 0
    });
};
```

## Address Validation

Validate Cardano addresses before use:

```typescript
const isValidCardanoAddress = (address, networkId = 1) => {
    // Basic format check
    const mainnetPattern = /^addr1[a-z0-9]+$/;
    const testnetPattern = /^addr_test1[a-z0-9]+$/;
    
    if (networkId === 1) {
        return mainnetPattern.test(address);
    } else {
        return testnetPattern.test(address);
    }
};
```

## Integration with Cardano Libraries

```typescript
// Using @emurgo/cardano-serialization-lib-browser
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-browser';

const getAddressDetails = async (accountIndex = 0) => {
    const result = await HardwareSDK.cardanoGetAddress(connectId, deviceId, {
        path: `m/1852'/1815'/${accountIndex}'/0/0`,
        showOnOneKey: false,
        protocolMagic: 764824073,
        networkId: 1,
        addressType: 0
    });
    
    if (result.success) {
        const address = CardanoWasm.Address.from_bech32(result.payload.address);
        
        return {
            address: result.payload.address,
            networkId: address.network_id(),
            addressType: result.payload.addressType,
            isValid: true
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Network Configuration

### Mainnet
```typescript
const mainnetConfig = {
    protocolMagic: 764824073,
    networkId: 1
};
```

### Testnet
```typescript
const testnetConfig = {
    protocolMagic: 1097911063,
    networkId: 0
};
```

## Security Notes

- Always use `showOnOneKey: true` for receiving addresses
- Verify addresses on device screen before sharing
- Use appropriate network configuration (mainnet vs testnet)
- Validate address format before use
- Consider using different address types for different purposes
- Be aware of the implications of each address type

## Related Methods

- [cardanoGetPublicKey](cardanogetpublickey.md) - Get public keys
- [cardanoSignTransaction](cardanosigntransaction.md) - Sign transactions
- [cardanoSignMessage](cardanosignmessage.md) - Sign messages
