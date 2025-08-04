# btcVerifyMessage

## Bitcoin: verify message

Verify a message signature against a Bitcoin address.

```typescript
const result = await HardwareSDK.btcVerifyMessage(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `address` — _required_ `string` Bitcoin address that allegedly signed the message
* `messageHex` — _required_ `string` original message in hexadecimal format
* `signature` — _required_ `string` signature in base64 format
* `coin` — _required_ `string` coin identifier (btc, ltc, doge, etc.)

## Example

Verify a message signature:

```typescript
HardwareSDK.btcVerifyMessage(connectId, deviceId, {
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    messageHex: "48656c6c6f20576f726c64", // "Hello World" in hex
    signature: "H/DIn8uA1scAuKLlCx+/9LnAcJtwQQ0PmcPrJUq90aboLv3fH5fFvY+vmbM2u0U/dS/H1cQ+7Qz0CVb5+SoU+VY=",
    coin: "btc"
});
```

## Result

```typescript
{
    success: true,
    payload: {
        message: "Message verified"
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

## Verification Process

The verification process follows Bitcoin's standard message verification:

1. **Message Reconstruction**: The original message is reconstructed using Bitcoin's message format:
   ```
   "\x18Bitcoin Signed Message:\n" + message_length + message
   ```

2. **Signature Validation**: The signature is validated against the message hash using the public key associated with the provided address.

3. **Address Matching**: The recovered public key is verified to match the provided Bitcoin address.

## Supported Signature Formats

- **Standard Bitcoin signatures**: Base64-encoded signatures from Bitcoin Core and compatible wallets
- **BIP-322 signatures**: Modern signature format for advanced script types
- **Legacy formats**: Older signature formats for backward compatibility

## Use Cases

### Message Authentication
```typescript
// Verify a signed message from a user
const verifyUserMessage = async (userAddress, message, signature) => {
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    const result = await HardwareSDK.btcVerifyMessage(connectId, deviceId, {
        address: userAddress,
        messageHex,
        signature,
        coin: "btc"
    });
    
    return result.success;
};
```

### Proof of Ownership
```typescript
// Verify proof of address ownership
const verifyAddressOwnership = async (address, proofSignature) => {
    const challengeMessage = `Proof of ownership for ${address} at ${Date.now()}`;
    const messageHex = Buffer.from(challengeMessage, 'utf8').toString('hex');
    
    return await HardwareSDK.btcVerifyMessage(connectId, deviceId, {
        address,
        messageHex,
        signature: proofSignature,
        coin: "btc"
    });
};
```

## Error Handling

Common verification errors:

- **Invalid signature format**: Signature is not properly base64 encoded
- **Message mismatch**: The message doesn't match the signed content
- **Address mismatch**: The signature doesn't correspond to the provided address
- **Invalid address**: The provided address is not a valid Bitcoin address

## Security Notes

- Always verify the complete message content
- Check that the address format matches the expected network
- Be aware of potential replay attacks with reused signatures
- Validate the signature format before verification
- Consider the context and purpose of the signed message
