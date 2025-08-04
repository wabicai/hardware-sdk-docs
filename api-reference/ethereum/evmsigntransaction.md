# evmSignTransaction

Sign Ethereum transaction.

```typescript
const result = await HardwareSDK.evmSignTransaction(connectId, deviceId, params);
```

## Parameters

* `path` — `string | number[]` — BIP32 derivation path
* `transaction` — `object` — Transaction data
* `chainId` — `number` — Chain ID (optional)

## Transaction Format

```typescript
{
    to: string,              // recipient address
    value: string,           // amount in wei
    gasPrice: string,        // gas price
    gasLimit: string,        // gas limit
    nonce: string,           // nonce
    data?: string,           // contract data
    chainId?: number         // chain ID
}
```

## Examples

```typescript
// ETH transfer
const result = await HardwareSDK.evmSignTransaction(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    transaction: {
        to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        value: "0x0de0b6b3a7640000", // 1 ETH
        gasPrice: "0x4a817c800",
        gasLimit: "0x5208",
        nonce: "0x0"
    },
    chainId: 1
});

// ERC-20 transfer
const result = await HardwareSDK.evmSignTransaction(connectId, deviceId, {
    path: "m/44'/60'/0'/0/0",
    transaction: {
        to: "0xA0b86a33E6417c8f2c8B758628E6C8f8f8f8f8f8", // token contract
        value: "0x0",
        gasPrice: "0x4a817c800",
        gasLimit: "0xc350",
        nonce: "0x1",
        data: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b8d4c9db96c4b4d8b60000000000000000000000000000000000000000000000000de0b6b3a7640000"
    },
    chainId: 1
});
```

## Response

```typescript
{
    success: true,
    payload: {
        v: string,
        r: string,
        s: string,
        serializedTx: string
    }
}
```
