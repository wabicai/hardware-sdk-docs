# xrpGetAddress

## Ripple: get address

Display requested address derived by given BIP32 path on device and returns it to caller.

```typescript
const result = await HardwareSDK.xrpGetAddress(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single address

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `showOnOneKey` — _optional_ `boolean` determines if address will be displayed on device. Default is set to `true`

#### Exporting bundle of addresses

* `bundle` - `Array` of Objects with `path` and `showOnOneKey` fields

## Example

Display first XRP account address:

```typescript
HardwareSDK.xrpGetAddress(connectId, deviceId, {
    path: "m/44'/144'/0'/0/0"
});
```

Return a bundle of addresses from first XRP account:

```typescript
HardwareSDK.xrpGetAddress(connectId, deviceId, {
    bundle: [
        { path: "m/44'/144'/0'/0/0", showOnOneKey: false }, // address 1
        { path: "m/44'/144'/0'/0/1", showOnOneKey: false }, // address 2
        { path: "m/44'/144'/0'/0/2", showOnOneKey: false }  // address 3
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
        address: string,           // XRP address
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

## XRP Address Format

XRP addresses use Base58Check encoding:

- **Classic format**: Start with 'r' followed by 24-34 characters
- **X-Address format**: Start with 'X' (includes destination tag)
- **Length**: Typically 25-34 characters
- **Example**: `rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH`

## Derivation Path

XRP uses BIP-44 derivation path:
```
m/44'/144'/account'/change/address_index
```

Where:
- `44'` is the BIP-44 purpose
- `144'` is XRP's coin type
- `account'` is the account index (hardened)
- `change` is 0 for external, 1 for internal
- `address_index` is the address index

## Use Cases

### Account Discovery
```typescript
// Get multiple addresses for the same account
const getAccountAddresses = async (accountIndex = 0, count = 10) => {
    const bundle = [];
    
    for (let i = 0; i < count; i++) {
        bundle.push({
            path: `m/44'/144'/${accountIndex}'/0/${i}`,
            showOnOneKey: false
        });
    }
    
    const result = await HardwareSDK.xrpGetAddress(connectId, deviceId, { bundle });
    
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

### Address Validation
```typescript
// Validate and get address for receiving funds
const getReceiveAddress = async (accountIndex = 0, addressIndex = 0) => {
    const result = await HardwareSDK.xrpGetAddress(connectId, deviceId, {
        path: `m/44'/144'/${accountIndex}'/0/${addressIndex}`,
        showOnOneKey: true // Always show for receiving addresses
    });
    
    if (result.success) {
        // Validate XRP address format
        const address = result.payload.address;
        if (!/^r[1-9A-HJ-NP-Za-km-z]{24,33}$/.test(address)) {
            throw new Error('Invalid XRP address format');
        }
        
        return {
            address,
            publicKey: result.payload.publicKey
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Integration with XRPL Libraries

```typescript
// Using xrpl library
import { Client, Wallet } from 'xrpl';

const getAddressWithBalance = async (accountIndex = 0, addressIndex = 0) => {
    const result = await HardwareSDK.xrpGetAddress(connectId, deviceId, {
        path: `m/44'/144'/${accountIndex}'/0/${addressIndex}`,
        showOnOneKey: false
    });
    
    if (result.success) {
        const address = result.payload.address;
        
        // Connect to XRP Ledger
        const client = new Client('wss://xrplcluster.com');
        await client.connect();
        
        try {
            const accountInfo = await client.request({
                command: 'account_info',
                account: address,
                ledger_index: 'validated'
            });
            
            const balance = accountInfo.result.account_data.Balance;
            const sequence = accountInfo.result.account_data.Sequence;
            
            await client.disconnect();
            
            return {
                address,
                publicKey: result.payload.publicKey,
                balance: parseInt(balance) / 1000000, // Convert drops to XRP
                sequence,
                exists: true
            };
        } catch (error) {
            await client.disconnect();
            
            if (error.data?.error === 'actNotFound') {
                return {
                    address,
                    publicKey: result.payload.publicKey,
                    balance: 0,
                    sequence: 0,
                    exists: false
                };
            }
            throw error;
        }
    }
    
    throw new Error(result.payload.error);
};
```

## Address Verification

Always verify XRP addresses before use:

```typescript
const isValidXrpAddress = (address) => {
    // Basic format check for classic addresses
    const classicPattern = /^r[1-9A-HJ-NP-Za-km-z]{24,33}$/;
    // X-Address format
    const xAddressPattern = /^X[1-9A-HJ-NP-Za-km-z]{46,47}$/;
    
    return classicPattern.test(address) || xAddressPattern.test(address);
};

// More comprehensive validation using xrpl library
import { isValidClassicAddress, isValidXAddress } from 'xrpl';

const validateXrpAddress = (address) => {
    return isValidClassicAddress(address) || isValidXAddress(address);
};
```

## Address Conversion

```typescript
// Convert between classic and X-Address formats
import { classicAddressToXAddress, xAddressToClassicAddress } from 'xrpl';

const convertAddressFormats = (address, destinationTag = null) => {
    if (isValidClassicAddress(address)) {
        // Convert classic to X-Address
        return {
            classic: address,
            xAddress: classicAddressToXAddress(address, destinationTag, false)
        };
    } else if (isValidXAddress(address)) {
        // Convert X-Address to classic
        const { classicAddress, tag } = xAddressToClassicAddress(address);
        return {
            classic: classicAddress,
            xAddress: address,
            destinationTag: tag
        };
    }
    
    throw new Error('Invalid XRP address format');
};
```

## Multi-Account Management
```typescript
// Get addresses for multiple accounts
const getMultipleAccounts = async (accountCount = 3) => {
    const accounts = [];
    
    for (let i = 0; i < accountCount; i++) {
        const result = await HardwareSDK.xrpGetAddress(connectId, deviceId, {
            path: `m/44'/144'/${i}'/0/0`,
            showOnOneKey: false
        });
        
        if (result.success) {
            accounts.push({
                account: i,
                address: result.payload.address,
                publicKey: result.payload.publicKey,
                path: result.payload.serializedPath
            });
        }
    }
    
    return accounts;
};
```

## Destination Tags

XRP supports destination tags for exchanges and services:

```typescript
// Generate X-Address with destination tag
const generateXAddressWithTag = async (accountIndex = 0, destinationTag = 12345) => {
    const result = await HardwareSDK.xrpGetAddress(connectId, deviceId, {
        path: `m/44'/144'/${accountIndex}'/0/0`,
        showOnOneKey: false
    });
    
    if (result.success) {
        const classicAddress = result.payload.address;
        const xAddress = classicAddressToXAddress(classicAddress, destinationTag, false);
        
        return {
            classicAddress,
            xAddress,
            destinationTag,
            publicKey: result.payload.publicKey
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Account Activation

XRP accounts require a minimum balance to be activated:

```typescript
// Check if account needs activation
const checkAccountActivation = async (address) => {
    const client = new Client('wss://xrplcluster.com');
    await client.connect();
    
    try {
        await client.request({
            command: 'account_info',
            account: address,
            ledger_index: 'validated'
        });
        
        await client.disconnect();
        return { activated: true };
    } catch (error) {
        await client.disconnect();
        
        if (error.data?.error === 'actNotFound') {
            return { 
                activated: false, 
                minimumReserve: 10000000 // 10 XRP in drops
            };
        }
        throw error;
    }
};
```

## Security Notes

- Always use `showOnOneKey: true` for receiving addresses
- Verify addresses on device screen before sharing
- XRP addresses are case-sensitive
- Store addresses securely and validate format before use
- Be aware of destination tag requirements for exchanges
- Consider account activation requirements (minimum balance)
- Validate both classic and X-Address formats

## Related Methods

- [xrpSignTransaction](xrpsigntransaction.md) - Sign XRP transactions
