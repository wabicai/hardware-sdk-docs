# solSignMessage

## Solana: sign message

Sign a message using the private key derived by given BIP32 path for Solana network.

```typescript
const result = await HardwareSDK.solSignMessage(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `messageHex` — _required_ `string` message to sign in hexadecimal format

## Example

Sign a message with first Solana account:

```typescript
HardwareSDK.solSignMessage(connectId, deviceId, {
    path: "m/44'/501'/0'/0'",
    messageHex: "48656c6c6f20576f726c64" // "Hello World" in hex
});
```

Sign a dApp authentication message:

```typescript
HardwareSDK.solSignMessage(connectId, deviceId, {
    path: "m/44'/501'/0'/0'",
    messageHex: Buffer.from("Sign in to MyDApp", 'utf8').toString('hex')
});
```

## Result

```typescript
{
    success: true,
    payload: {
        signature: string,  // signature in hex format
        publicKey: string,  // public key used for signing
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

Solana message signing follows a simple format:
- The message is signed directly without additional prefixes
- Uses Ed25519 signature scheme
- Returns 64-byte signature

## Use Cases

### dApp Authentication
```typescript
// Sign authentication challenge for dApp
const signDAppAuth = async (challenge, domain) => {
    const message = `${domain} wants you to sign in with your Solana account:\n${challenge}`;
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    const result = await HardwareSDK.solSignMessage(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        messageHex
    });
    
    if (result.success) {
        return {
            message,
            signature: result.payload.signature,
            publicKey: result.payload.publicKey
        };
    }
    
    throw new Error(result.payload.error);
};
```

### Proof of Ownership
```typescript
// Sign proof of address ownership
const signOwnershipProof = async (address) => {
    const timestamp = Date.now();
    const message = `I own this Solana address ${address} at ${timestamp}`;
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    return await HardwareSDK.solSignMessage(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        messageHex
    });
};
```

### NFT Verification
```typescript
// Sign message for NFT ownership verification
const signNftOwnership = async (nftMint, collection) => {
    const message = `Verify ownership of NFT ${nftMint} in collection ${collection}`;
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    return await HardwareSDK.solSignMessage(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        messageHex
    });
};
```

## Signature Verification

The signature can be verified using Solana libraries:

```typescript
// Using @solana/web3.js
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

const verifySignature = (message, signature, publicKey) => {
    try {
        const messageBytes = Buffer.from(message, 'utf8');
        const signatureBytes = Buffer.from(signature, 'hex');
        const publicKeyBytes = new PublicKey(publicKey).toBytes();
        
        return nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
        );
    } catch {
        return false;
    }
};

// Usage
const isValid = verifySignature(
    "Hello World",
    signResult.payload.signature,
    signResult.payload.publicKey
);
```

## Integration with Wallet Adapters

```typescript
// Create wallet adapter compatible signature
const createWalletSignature = async (message) => {
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    const result = await HardwareSDK.solSignMessage(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        messageHex
    });
    
    if (result.success) {
        return {
            signature: new Uint8Array(Buffer.from(result.payload.signature, 'hex')),
            publicKey: new PublicKey(result.payload.publicKey)
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Message Standards

### SIWS (Sign In With Solana)
```typescript
// Sign In With Solana standard message
const signSIWS = async (domain, address, nonce) => {
    const message = `${domain} wants you to sign in with your Solana account:
${address}

URI: https://${domain}
Version: 1
Chain ID: mainnet
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`;
    
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    return await HardwareSDK.solSignMessage(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        messageHex
    });
};
```

### Custom Protocol Messages
```typescript
// Sign custom protocol message
const signProtocolMessage = async (protocol, action, params) => {
    const message = JSON.stringify({
        protocol,
        action,
        params,
        timestamp: Date.now()
    });
    
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    return await HardwareSDK.solSignMessage(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        messageHex
    });
};
```

## Security Considerations

### Message Validation
```typescript
// Validate message before signing
const validateMessage = (message) => {
    // Check message length
    if (message.length > 1000) {
        throw new Error('Message too long');
    }
    
    // Check for suspicious content
    const suspiciousPatterns = [
        /private.*key/i,
        /seed.*phrase/i,
        /mnemonic/i,
        /transfer.*all/i
    ];
    
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(message)) {
            throw new Error('Suspicious message content detected');
        }
    }
    
    return true;
};
```

### Replay Attack Prevention
```typescript
// Add timestamp and nonce to prevent replay attacks
const signSecureMessage = async (baseMessage) => {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(2);
    
    const secureMessage = `${baseMessage}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
    const messageHex = Buffer.from(secureMessage, 'utf8').toString('hex');
    
    const result = await HardwareSDK.solSignMessage(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        messageHex
    });
    
    if (result.success) {
        return {
            ...result.payload,
            timestamp,
            nonce,
            originalMessage: baseMessage
        };
    }
    
    throw new Error(result.payload.error);
};
```

## Error Handling

Common message signing errors:

- **Invalid message format**: Message contains invalid characters
- **Message too long**: Message exceeds maximum length
- **User cancellation**: User rejected signing on device
- **Invalid path**: Incorrect derivation path for Solana
- **Device timeout**: Signing operation timed out

## Best Practices

1. **Always validate message content** before signing
2. **Use timestamps and nonces** to prevent replay attacks
3. **Display clear message content** to users
4. **Verify signatures** after signing
5. **Store signatures securely** if needed for later verification
6. **Use appropriate message formats** for different use cases

## Related Methods

- [solGetAddress](solgetaddress.md) - Get Solana addresses
- [solSignTransaction](solsigntransaction.md) - Sign Solana transactions
