# btcGetPublicKey

## Bitcoin: get public key

Retrieves BIP32 extended public derived by given BIP32 path. User is presented with a description of the requested key and asked to confirm the export.

```typescript
const result = await HardwareSDK.btcGetPublicKey(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

### Exporting single public key

* `path` — _required_ `string | Array<number>` minimum length is `1`. [read more](../path.md)
* `showOnOneKey` — _optional_ `boolean` determines if address will be displayed on device. Default is set to `true`
* `coin` - _optional_ `string` determines network definition specified in coins.json file. Coin `shortcut`, `name` or `label` can be used. If `coin` is not set API will try to get network definition from `path`.
* `scriptType` - _optional_ InputScriptType, address script type

#### Exporting bundle of public keys

* `bundle` - `Array` of Objects with `path`, `coin` fields

### Example

Return public key of fifth bitcoin account:

```typescript
HardwareSDK.btcGetPublicKey(connectId, deviceId, {
    path: "m/49'/0'/4'",
    coin: "btc"
});
```

Return a bundle of public keys for multiple bitcoin accounts:

```typescript
HardwareSDK.btcGetPublicKey(connectId, deviceId, {
    bundle: [
        { path: "m/49'/0'/0'", coin: "btc" }, // account 1
        { path: "m/49'/0'/1'", coin: "btc" }, // account 2
        { path: "m/49'/0'/2'", coin: "btc" }  // account 3
    ]
});
```

#### Result

Result with only one public key

```typescript
{
    success: true,
    payload: {
        path: Array<number>,        // hardened path
        serializedPath: string,     // serialized path
        childNum: number,           // child number
        xpub: string,              // extended public key
        chainCode: string,         // chain code
        publicKey: string,         // public key
        fingerprint: number,       // fingerprint
        depth: number,             // depth
    }
}
```

Result with bundle of public keys

```typescript
{
    success: true,
    payload: [
        { path: Array<number>, serializedPath: string, ... }, // public key 1
        { path: Array<number>, serializedPath: string, ... }, // public key 2
        { path: Array<number>, serializedPath: string, ... }, // public key 3
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
