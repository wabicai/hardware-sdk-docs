# Quick Start

## Basic Example

```typescript
import HardwareSDK from '@onekeyfe/hd-core';

async function main() {
    // 1. Initialize SDK
    await HardwareSDK.init({ debug: false });
    
    // 2. Find devices
    const devices = await HardwareSDK.searchDevices();
    if (devices.payload.length === 0) {
        throw new Error('No device found');
    }
    
    const { connectId, deviceId } = devices.payload[0];
    
    // 3. Get Bitcoin address
    const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
        path: "m/44'/0'/0'/0/0",
        coin: 'btc',
        showOnOneKey: true
    });
    
    if (result.success) {
        console.log('Address:', result.payload.address);
    } else {
        console.error('Error:', result.payload.error);
    }
}

main().catch(console.error);
```

## Multi-Chain Example

```typescript
async function getMultiChainAddresses(connectId: string, deviceId: string) {
    // Bitcoin
    const btc = await HardwareSDK.btcGetAddress(connectId, deviceId, {
        path: "m/44'/0'/0'/0/0",
        coin: 'btc'
    });
    
    // Ethereum
    const eth = await HardwareSDK.evmGetAddress(connectId, deviceId, {
        path: "m/44'/60'/0'/0/0",
        chainId: 1
    });
    
    // Solana
    const sol = await HardwareSDK.solGetAddress(connectId, deviceId, {
        path: "m/44'/501'/0'/0'"
    });
    
    return {
        bitcoin: btc.success ? btc.payload.address : null,
        ethereum: eth.success ? eth.payload.address : null,
        solana: sol.success ? sol.payload.address : null
    };
}
```

## Transaction Signing

```typescript
async function signBitcoinTransaction(connectId: string, deviceId: string) {
    const result = await HardwareSDK.btcSignTransaction(connectId, deviceId, {
        coin: 'btc',
        inputs: [{
            address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
            prev_hash: 'abc123...',
            prev_index: 0,
            amount: '100000'
        }],
        outputs: [{
            address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            amount: '90000',
            script_type: 'PAYTOADDRESS'
        }]
    });
    
    if (result.success) {
        console.log('Signed transaction:', result.payload.serializedTx);
    }
}
```

## Error Handling

```typescript
async function handleErrors(connectId: string, deviceId: string) {
    try {
        const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
            path: "m/44'/0'/0'/0/0",
            coin: 'btc'
        });
        
        if (result.success) {
            return result.payload.address;
        } else {
            // Handle specific errors
            switch (result.payload.code) {
                case 1001:
                    throw new Error('Device not found');
                case 2001:
                    throw new Error('User cancelled');
                default:
                    throw new Error(result.payload.error);
            }
        }
    } catch (error) {
        console.error('SDK Error:', error.message);
        throw error;
    }
}
```

## Next Steps

- [API Reference](api-reference/README.md) - Complete method documentation
- [Bitcoin Methods](api-reference/bitcoin/) - Bitcoin-specific methods
- [Ethereum Methods](api-reference/ethereum/) - Ethereum-specific methods
- [Error Codes](api-reference/error-code.md) - Error handling reference
