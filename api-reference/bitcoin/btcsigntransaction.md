# btcSignTransaction

Sign Bitcoin transaction.

```typescript
const result = await HardwareSDK.btcSignTransaction(connectId, deviceId, params);
```

## Parameters

* `coin` — `string` — Coin name (default: 'btc')
* `inputs` — `Array` — Transaction inputs
* `outputs` — `Array` — Transaction outputs
* `refTxs` — `Array` — Referenced transactions (optional)
* `locktime` — `number` — Lock time (optional)

## Input Format

```typescript
{
    address_n: number[],     // derivation path
    prev_hash: string,       // previous tx hash
    prev_index: number,      // output index
    amount: string,          // input amount
    script_type?: string     // script type
}
```

## Output Format

```typescript
{
    address?: string,        // destination address
    address_n?: number[],    // change output path
    amount: string,          // output amount
    script_type: string      // script type
}
```

## Example

```typescript
const result = await HardwareSDK.btcSignTransaction(connectId, deviceId, {
    coin: "btc",
    inputs: [{
        address_n: [84 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
        prev_hash: "abc123...",
        prev_index: 0,
        amount: "100000"
    }],
    outputs: [{
        address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
        amount: "90000",
        script_type: "PAYTOWITNESS"
    }]
});
```

## Response

```typescript
{
    success: true,
    payload: {
        signatures: string[],
        serializedTx: string
    }
}
```
