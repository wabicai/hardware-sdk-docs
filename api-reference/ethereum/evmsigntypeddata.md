# evmSignTypedData

## Ethereum: sign typed data (EIP-712)

Sign structured data using EIP-712 standard for Ethereum and EVM-compatible networks.

```typescript
const result = await HardwareSDK.evmSignTypedData(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `5`. [read more](../path.md)
* `data` — _required_ `object` EIP-712 structured data object
* `metamaskV4Compat` — _optional_ `boolean` use MetaMask v4 compatibility mode (default: true)
* `domainHash` — _optional_ `string` pre-computed domain hash (advanced usage)
* `messageHash` — _optional_ `string` pre-computed message hash (advanced usage)
* `chainId` - _optional_ `number` The ChainId for the specific Ethereum network

## EIP-712 Data Structure

The `data` parameter must follow the EIP-712 standard:

```typescript
{
    types: {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" }
        ],
        // Custom types...
    },
    primaryType: "CustomType",
    domain: {
        name: "App Name",
        version: "1",
        chainId: 1,
        verifyingContract: "0x..."
    },
    message: {
        // Message data...
    }
}
```

## Example

Sign a simple EIP-712 message:

```typescript
HardwareSDK.evmSignTypedData(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    data: {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" }
            ],
            Person: [
                { name: "name", type: "string" },
                { name: "wallet", type: "address" }
            ],
            Mail: [
                { name: "from", type: "Person" },
                { name: "to", type: "Person" },
                { name: "contents", type: "string" }
            ]
        },
        primaryType: "Mail",
        domain: {
            name: "Ether Mail",
            version: "1",
            chainId: 1,
            verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
        },
        message: {
            from: {
                name: "Cow",
                wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
            },
            to: {
                name: "Bob",
                wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
            },
            contents: "Hello, Bob!"
        }
    },
    metamaskV4Compat: true,
    chainId: 1
});
```

## Result

```typescript
{
    success: true,
    payload: {
        address: string,    // address used to sign the data
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

## Common Use Cases

### DeFi Protocol Permits
```typescript
// EIP-2612 permit signature for token approvals
const signPermit = async (tokenAddress, spender, value, deadline) => {
    const data = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" }
            ],
            Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" }
            ]
        },
        primaryType: "Permit",
        domain: {
            name: "Token Name",
            version: "1",
            chainId: 1,
            verifyingContract: tokenAddress
        },
        message: {
            owner: "0x...", // user address
            spender,
            value,
            nonce: 0, // get from contract
            deadline
        }
    };

    return await HardwareSDK.evmSignTypedData(connectId, deviceId, {
        path: "m/44'/60'/0'/0/0",
        data,
        chainId: 1
    });
};
```

### NFT Marketplace Orders
```typescript
// OpenSea-style marketplace order
const signMarketplaceOrder = async (orderData) => {
    const data = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" }
            ],
            Order: [
                { name: "trader", type: "address" },
                { name: "collection", type: "address" },
                { name: "tokenId", type: "uint256" },
                { name: "price", type: "uint256" },
                { name: "expiry", type: "uint256" }
            ]
        },
        primaryType: "Order",
        domain: {
            name: "NFT Marketplace",
            version: "1",
            chainId: 1,
            verifyingContract: "0x..." // marketplace contract
        },
        message: orderData
    };

    return await HardwareSDK.evmSignTypedData(connectId, deviceId, {
        path: "m/44'/60'/0'/0/0",
        data,
        chainId: 1
    });
};
```

### DAO Voting
```typescript
// Governance proposal voting
const signVote = async (proposalId, support) => {
    const data = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" }
            ],
            Ballot: [
                { name: "proposalId", type: "uint256" },
                { name: "support", type: "uint8" }
            ]
        },
        primaryType: "Ballot",
        domain: {
            name: "DAO Governor",
            chainId: 1,
            verifyingContract: "0x..." // governor contract
        },
        message: {
            proposalId,
            support // 0 = against, 1 = for, 2 = abstain
        }
    };

    return await HardwareSDK.evmSignTypedData(connectId, deviceId, {
        path: "m/44'/60'/0'/0/0",
        data,
        chainId: 1
    });
};
```

## Advanced Usage

### Pre-computed Hashes
For performance optimization, you can provide pre-computed hashes:

```typescript
HardwareSDK.evmSignTypedData(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    data: typedData,
    domainHash: "0x...", // pre-computed domain separator hash
    messageHash: "0x...", // pre-computed message hash
    chainId: 1
});
```

## Supported Networks

This method works with all EVM-compatible networks that support EIP-712:

- Ethereum (chainId: 1)
- Polygon (chainId: 137)
- BSC (chainId: 56)
- Avalanche (chainId: 43114)
- Arbitrum (chainId: 42161)
- Optimism (chainId: 10)

## Security Notes

- Always verify the structured data content on the device screen
- Understand the implications of signing structured data
- Validate domain information matches the expected dApp
- Check contract addresses in the domain
- Be cautious with permit signatures that grant token approvals
- Verify expiry times and nonces in time-sensitive signatures

## Related Methods

- [evmSignMessage](evmsignmessage.md) - Sign plain text messages
- [evmGetAddress](evmgetaddress.md) - Get Ethereum addresses
- [evmVerifyMessage](evmverifymessage.md) - Verify message signatures
