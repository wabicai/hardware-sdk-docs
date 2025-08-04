# evmVerifyMessage

## Ethereum: verify message

Verify a message signature against an Ethereum address for EVM-compatible networks.

```typescript
const result = await HardwareSDK.evmVerifyMessage(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `address` — _required_ `string` Ethereum address that allegedly signed the message
* `messageHex` — _required_ `string` original message in hexadecimal format
* `signature` — _required_ `string` signature in hex format (0x...)
* `chainId` - _optional_ `number` The ChainId for the specific Ethereum network

## Example

Verify a message signature:

```typescript
HardwareSDK.evmVerifyMessage(connectId, deviceId, {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    messageHex: "48656c6c6f20576f726c64", // "Hello World" in hex
    signature: "0x1234567890abcdef...", // 65-byte signature
    chainId: 1
});
```

Verify signature for different networks:

```typescript
// Polygon network
HardwareSDK.evmVerifyMessage(connectId, deviceId, {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    messageHex: "48656c6c6f20576f726c64",
    signature: "0x1234567890abcdef...",
    chainId: 137
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

The verification follows Ethereum's EIP-191 standard:

1. **Message Reconstruction**: The original message is reconstructed using Ethereum's format:
   ```
   "\x19Ethereum Signed Message:\n" + message_length + message
   ```

2. **Hash Calculation**: The message is hashed using Keccak-256

3. **Signature Recovery**: The public key is recovered from the signature using ECDSA recovery

4. **Address Derivation**: The Ethereum address is derived from the recovered public key

5. **Address Comparison**: The derived address is compared with the provided address

## Signature Format

The signature must be in the standard Ethereum format:
- **Length**: 65 bytes (130 hex characters + 0x prefix)
- **Format**: `0x` + `r` (32 bytes) + `s` (32 bytes) + `v` (1 byte)
- **Recovery Parameter**: The `v` value should be 27, 28, or adjusted for EIP-155

## Use Cases

### Authentication Verification
```typescript
// Verify user authentication signature
const verifyUserAuth = async (userAddress, challenge, signature) => {
    const messageHex = Buffer.from(challenge, 'utf8').toString('hex');
    
    const result = await HardwareSDK.evmVerifyMessage(connectId, deviceId, {
        address: userAddress,
        messageHex,
        signature,
        chainId: 1
    });
    
    return result.success;
};
```

### Ownership Proof Verification
```typescript
// Verify proof of address ownership
const verifyOwnership = async (address, timestamp, signature) => {
    const message = `I own this address ${address} at ${timestamp}`;
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    const result = await HardwareSDK.evmVerifyMessage(connectId, deviceId, {
        address,
        messageHex,
        signature,
        chainId: 1
    });
    
    if (result.success) {
        // Check if timestamp is recent enough
        const now = Date.now();
        const signTime = parseInt(timestamp);
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        return (now - signTime) < maxAge;
    }
    
    return false;
};
```

### dApp Message Verification
```typescript
// Verify dApp login signature
const verifyDAppLogin = async (address, domain, nonce, signature) => {
    const message = `Sign in to ${domain}\nNonce: ${nonce}`;
    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    
    return await HardwareSDK.evmVerifyMessage(connectId, deviceId, {
        address,
        messageHex,
        signature,
        chainId: 1
    });
};
```

## Alternative Verification Methods

You can also verify signatures using standard Ethereum libraries:

### Using ethers.js
```javascript
import { ethers } from 'ethers';

const verifyWithEthers = (message, signature, expectedAddress) => {
    try {
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
        return false;
    }
};
```

### Using web3.js
```javascript
import Web3 from 'web3';

const web3 = new Web3();

const verifyWithWeb3 = (message, signature, expectedAddress) => {
    try {
        const recoveredAddress = web3.eth.accounts.recover(message, signature);
        return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
        return false;
    }
};
```

## Error Handling

Common verification errors:

- **Invalid signature format**: Signature is not properly formatted or wrong length
- **Invalid recovery parameter**: The `v` value in the signature is invalid
- **Message mismatch**: The message doesn't match the signed content
- **Address mismatch**: The signature doesn't correspond to the provided address
- **Invalid address format**: The provided address is not a valid Ethereum address

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

- Always verify the complete message content
- Check that the address format is valid for the expected network
- Be aware of potential replay attacks with reused signatures
- Validate the signature format and length before verification
- Consider the context and purpose of the signed message
- Verify timestamps in time-sensitive messages to prevent replay attacks

## Related Methods

- [evmSignMessage](evmsignmessage.md) - Sign messages
- [evmSignTypedData](evmsigntypeddata.md) - Sign structured data (EIP-712)
- [evmGetAddress](evmgetaddress.md) - Get Ethereum addresses
