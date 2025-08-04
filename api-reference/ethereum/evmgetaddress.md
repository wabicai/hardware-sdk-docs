# evmGetAddress

Get Ethereum address for a derivation path.

```typescript
const result = await HardwareSDK.evmGetAddress(connectId, deviceId, params);
```

## Parameters

* `path` — `string | number[]` — BIP32 derivation path
* `showOnOneKey` — `boolean` — Show on device (default: true)
* `chainId` — `number` — Chain ID (optional)

**Bundle mode:**
* `bundle` — `Array` — Multiple address requests

## Examples

```typescript
// Single address
const result = await HardwareSDK.evmGetAddress(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    chainId: 1
});

// Multiple addresses
const result = await HardwareSDK.evmGetAddress(connectId, deviceId, {
    bundle: [
        { path: "m/44'/60'/0'/0/0", chainId: 1, showOnOneKey: false },
        { path: "m/44'/60'/0'/0/1", chainId: 1, showOnOneKey: false }
    ]
});
```

## Chain IDs

| Network | Chain ID |
|---------|----------|
| Ethereum | 1 |
| Polygon | 137 |
| BSC | 56 |
| Arbitrum | 42161 |
| Optimism | 10 |

## Response

```typescript
{
    success: true,
    payload: {
        path: string,
        address: string
    }
}
```
