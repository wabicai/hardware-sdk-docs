# btcGetAddress

Get Bitcoin address for a derivation path.

```typescript
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, params);
```

## Parameters

* `path` — `string | number[]` — BIP32 derivation path
* `coin` — `string` — Coin name (default: 'btc')
* `showOnOneKey` — `boolean` — Show on device (default: true)
* `scriptType` — `string` — Address type (optional)
* `multisig` — `object` — Multisig config (optional)

**Bundle mode:**
* `bundle` — `Array` — Multiple address requests

## Examples

```typescript
// Single address
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/84'/0'/0'/0/0",
    coin: "btc"
});

// Multiple addresses
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    bundle: [
        { path: "m/84'/0'/0'/0/0", coin: "btc", showOnOneKey: false },
        { path: "m/84'/0'/0'/0/1", coin: "btc", showOnOneKey: false }
    ]
});
```

## Address Types

| Path | Type | Format |
|------|------|--------|
| `m/44'/0'/x'/x/x` | Legacy | 1... |
| `m/49'/0'/x'/x/x` | SegWit | 3... |
| `m/84'/0'/x'/x/x` | Native SegWit | bc1... |
| `m/86'/0'/x'/x/x` | Taproot | bc1p... |

## Response

```typescript
{
    success: true,
    payload: {
        address: string,
        path: string
    }
}
```
