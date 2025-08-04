# solGetAddress

Get Solana address for a derivation path.

```typescript
const result = await HardwareSDK.solGetAddress(connectId, deviceId, params);
```

## Parameters

* `path` — `string | number[]` — BIP32 derivation path
* `showOnOneKey` — `boolean` — Show on device (default: true)

**Bundle mode:**
* `bundle` — `Array` — Multiple address requests

## Examples

```typescript
// Single address
const result = await HardwareSDK.solGetAddress(connectId, deviceId, {
    path: "m/44'/501'/0'/0'"
});

// Multiple addresses
const result = await HardwareSDK.solGetAddress(connectId, deviceId, {
    bundle: [
        { path: "m/44'/501'/0'/0'", showOnOneKey: false },
        { path: "m/44'/501'/1'/0'", showOnOneKey: false }
    ]
});
```

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
