# btcSignPsbt

## Bitcoin: sign PSBT

Sign a Partially Signed Bitcoin Transaction (PSBT) using the OneKey hardware device.

```typescript
const result = await HardwareSDK.btcSignPsbt(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `psbt` — _required_ `string` PSBT in hexadecimal format
* `coin` - _optional_ `string` determines network definition specified in coins.json file. Coin `shortcut`, `name` or `label` can be used. Default is 'btc'.

## Example

Sign a PSBT:

```typescript
HardwareSDK.btcSignPsbt(connectId, deviceId, {
    psbt: "70736274ff01007d020000000...", // PSBT in hex format
    coin: "btc"
});
```

Sign a PSBT for Litecoin:

```typescript
HardwareSDK.btcSignPsbt(connectId, deviceId, {
    psbt: "70736274ff01007d020000000...",
    coin: "ltc"
});
```

## Result

```typescript
{
    success: true,
    payload: {
        psbt: string,  // signed PSBT in hexadecimal format
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

## PSBT Overview

Partially Signed Bitcoin Transactions (PSBTs) are a standardized format for Bitcoin transactions that:

- Allow multiple parties to collaboratively sign a transaction
- Support complex multi-signature scenarios
- Provide a standard way to pass transaction data between wallets
- Enable hardware wallets to sign without exposing private keys

## PSBT Workflow

1. **Create PSBT**: A coordinator creates an unsigned PSBT with inputs and outputs
2. **Add Metadata**: Include necessary information like UTXOs, derivation paths, and scripts
3. **Sign PSBT**: Each required signer signs their inputs using their hardware wallet
4. **Finalize PSBT**: Once all signatures are collected, finalize the transaction
5. **Extract Transaction**: Extract the final signed transaction for broadcast

## Use Cases

### Multi-Signature Wallets
```typescript
// Sign a multisig PSBT
const signMultisigPsbt = async (psbtHex) => {
    const result = await HardwareSDK.btcSignPsbt(connectId, deviceId, {
        psbt: psbtHex,
        coin: "btc"
    });
    
    if (result.success) {
        console.log('Signed PSBT:', result.payload.psbt);
        return result.payload.psbt;
    }
    
    throw new Error(result.payload.error);
};
```

### CoinJoin Transactions
```typescript
// Sign a CoinJoin PSBT
const signCoinJoinPsbt = async (psbtHex) => {
    return await HardwareSDK.btcSignPsbt(connectId, deviceId, {
        psbt: psbtHex,
        coin: "btc"
    });
};
```

### Lightning Network Channel Operations
```typescript
// Sign Lightning channel funding transaction
const signChannelFunding = async (fundingPsbt) => {
    return await HardwareSDK.btcSignPsbt(connectId, deviceId, {
        psbt: fundingPsbt,
        coin: "btc"
    });
};
```

## PSBT Requirements

For successful signing, the PSBT must include:

- **UTXO Information**: Complete previous transaction data or witness UTXO
- **Derivation Paths**: BIP32 paths for keys controlled by the hardware wallet
- **Script Information**: Redeem scripts for P2SH inputs, witness scripts for P2WSH
- **Sighash Types**: Appropriate sighash flags for each input

## Supported Networks

This method supports PSBT signing for all Bitcoin-based networks:

- Bitcoin (BTC)
- Litecoin (LTC)
- Dogecoin (DOGE)
- Bitcoin Cash (BCH)
- Dash (DASH)
- And other Bitcoin forks

## Security Notes

- Always verify PSBT contents on the device screen
- Check input and output amounts carefully
- Verify recipient addresses before signing
- Be cautious with PSBTs from untrusted sources
- Understand the transaction purpose before signing
- Consider the fee amount and rate

## Error Handling

Common PSBT signing errors:

- **Invalid PSBT format**: Malformed PSBT data
- **Missing UTXO data**: Required previous transaction information not provided
- **Unknown inputs**: PSBT contains inputs not controlled by the device
- **Invalid derivation paths**: Incorrect or unsupported BIP32 paths
- **Insufficient data**: Missing required metadata for signing
