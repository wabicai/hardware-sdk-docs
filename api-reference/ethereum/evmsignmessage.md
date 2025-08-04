# evmSignMessage

## Ethereum: sign message

Sign a message using the private key derived by given BIP32 path for Ethereum and EVM-compatible networks.

```typescript
const result = await HardwareSDK.evmSignMessage(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `5`. [read more](../path.md)
* `messageHex` — _required_ `string` message to sign in hexadecimal format
* `chainId` - _optional_ `number` The ChainId for the specific Ethereum network

## Example

Sign a message with first Ethereum account:

```typescript
HardwareSDK.evmSignMessage(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    messageHex: "48656c6c6f20576f726c64", // "Hello World" in hex
    chainId: 1
});
```

Sign a message for different networks:

```typescript
// Polygon network
HardwareSDK.evmSignMessage(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    messageHex: "48656c6c6f20576f726c64",
    chainId: 137
});

// BSC network
HardwareSDK.evmSignMessage(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    messageHex: "48656c6c6f20576f726c64",
    chainId: 56
});
```

## Result

```typescript
{
    success: true,
    payload: {
        address: string,    // address used to sign the message
        signature: string,  // signature in hex format (0x...)
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

Ethereum message signing follows the EIP-191 standard with the format:

```
"\x19Ethereum Signed Message:\n" + message_length + message
```

The message is hashed using Keccak-256 before signing, and the signature includes the recovery parameter.

## Signature Format

The returned signature is in the format:
- **Length**: 65 bytes (130 hex characters + 0x prefix)
- **Format**: `0x` + `r` (32 bytes) + `s` (32 bytes) + `v` (1 byte)
- **Recovery**: The `v` parameter allows recovery of the public key from the signature

## Use Cases

### Message Authentication
```typescript
// Sign a login challenge
const signLoginChallenge = async (challenge) => {
    const messageHex = Buffer.from(challenge, 'utf8').toString('hex');
    
    const result = await HardwareSDK.evmSignMessage(connectId, deviceId, {
        path: "m/44'/60'/0'/0/0",
        messageHex,
        chainId: 1
    });
    
    if (result.success) {
        return {
            address: result.payload.address,
            signature: result.payload.signature,
            message: challenge
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
    const message = `I own this address ${address} at ${timestamp}`;
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    return await HardwareSDK.evmSignMessage(connectId, deviceId, {
        path: "m/44'/60'/0'/0/0",
        messageHex,
        chainId: 1
    });
};
```

### dApp Integration
```typescript
// Sign message for dApp authentication
const signDAppMessage = async (domain, nonce) => {
    const message = `Sign in to ${domain}\nNonce: ${nonce}`;
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    return await HardwareSDK.evmSignMessage(connectId, deviceId, {
        path: "m/44'/60'/0'/0/0",
        messageHex,
        chainId: 1
    });
};
```

## Signature Verification

The signature can be verified using standard Ethereum libraries:

```javascript
// Using ethers.js
import { ethers } from 'ethers';

const verifySignature = (message, signature, expectedAddress) => {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
};

// Using web3.js
import Web3 from 'web3';

const web3 = new Web3();
const verifyWithWeb3 = (message, signature, expectedAddress) => {
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
};
```

## Supported Networks

This method works with all EVM-compatible networks:

- Ethereum (chainId: 1)
- Polygon (chainId: 137)
- BSC (chainId: 56)
- Avalanche (chainId: 43114)
- Arbitrum (chainId: 42161)
- Optimism (chainId: 10)
- And other EVM networks

## Security Notes

- Always verify the message content before signing
- Be cautious with messages from untrusted sources
- Understand the implications of the message being signed
- Consider replay attack protection with nonces or timestamps
- Validate the signature format and recovery parameter
- Use appropriate chain IDs for the target network

## Related Methods

- [evmSignTypedData](evmsigntypeddata.md) - Sign structured data (EIP-712)
- [evmGetAddress](evmgetaddress.md) - Get Ethereum addresses
- [evmVerifyMessage](evmverifymessage.md) - Verify message signatures
