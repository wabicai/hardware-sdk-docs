# btcSignMessage

## Bitcoin: sign message

Sign a message using the private key derived by given BIP32 path.

```typescript
const result = await HardwareSDK.btcSignMessage(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `messageHex` — _required_ `string` message to sign in hexadecimal format
* `coin` - _optional_ `string` determines network definition specified in coins.json file. Coin `shortcut`, `name` or `label` can be used. If `coin` is not set API will try to get network definition from `path`.
* `noScriptType` - _optional_ `boolean` use BIP-322 simple signature format (default: false)
* `dAppSignType` - _optional_ `string` signature type for dApp compatibility ('ecdsa' | 'bip322-simple')

## Example

Sign message with first Bitcoin account:

```typescript
HardwareSDK.btcSignMessage(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    messageHex: "48656c6c6f20576f726c64", // "Hello World" in hex
    coin: "btc"
});
```

Sign message using BIP-322 simple format:

```typescript
HardwareSDK.btcSignMessage(connectId, deviceId, {
    path: "m/84'/0'/0'/0/0", // Native SegWit
    messageHex: "48656c6c6f20576f726c64",
    coin: "btc",
    noScriptType: true
});
```

## Result

```typescript
{
    success: true,
    payload: {
        address: string,    // address used to sign the message
        signature: string,  // signature in base64 format
    }
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

## Message Format

The message is signed using Bitcoin's standard message signing format:

```
"\x18Bitcoin Signed Message:\n" + message_length + message
```

For BIP-322 simple signatures (`noScriptType: true`), the message is signed using the BIP-322 specification which provides better compatibility with modern Bitcoin script types.

## Signature Verification

The returned signature can be verified using standard Bitcoin message verification tools or libraries. The signature format depends on the signing method:

- **Standard format**: Base64-encoded signature compatible with Bitcoin Core
- **BIP-322 simple**: Base64-encoded signature following BIP-322 specification

## Supported Networks

This method supports all Bitcoin-based networks:

- Bitcoin (BTC)
- Litecoin (LTC) 
- Dogecoin (DOGE)
- Bitcoin Cash (BCH)
- Dash (DASH)
- And other Bitcoin forks

## Security Notes

- Always verify the message content before signing
- Use appropriate derivation paths for your use case
- Consider using BIP-322 for modern applications
- The signature proves ownership of the private key for the given address
