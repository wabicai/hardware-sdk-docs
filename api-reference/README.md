# API Reference

## Quick Start

```typescript
import HardwareSDK from '@onekeyfe/hd-core';

// Initialize
await HardwareSDK.init({ debug: false });

// Find device
const devices = await HardwareSDK.searchDevices();
const { connectId, deviceId } = devices.payload[0];

// Get address
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```

## Method Pattern

```typescript
const result = await HardwareSDK.methodName(connectId, deviceId, params);

// Response format
{
    success: boolean,
    payload: any
}
```

## Core Methods

- [init](init.md) - Initialize SDK
- [searchDevices](device/searchdevices.md) - Find devices

## Bitcoin

- [btcGetAddress](bitcoin/btcgetaddress.md) - Get addresses
- [btcGetPublicKey](bitcoin/btcgetpublickey.md) - Get public keys
- [btcSignTransaction](bitcoin/btcsigntransaction.md) - Sign transactions
- [btcSignMessage](bitcoin/btcsignmessage.md) - Sign messages
- [btcSignPsbt](bitcoin/btcsignpsbt.md) - Sign PSBTs

## Ethereum

- [evmGetAddress](ethereum/evmgetaddress.md) - Get addresses
- [evmGetPublicKey](ethereum/evmgetpublickey.md) - Get public keys
- [evmSignTransaction](ethereum/evmsigntransaction.md) - Sign transactions
- [evmSignMessage](ethereum/evmsignmessage.md) - Sign messages
- [evmSignTypedData](ethereum/evmsigntypeddata.md) - Sign EIP-712 data

## Other Networks

- [Solana](solana/) - solGetAddress, solSignTransaction, solSignMessage
- [Cardano](cardano/) - cardanoGetAddress, cardanoGetPublicKey, cardanoSignTransaction
- [Polkadot](polkadot/) - polkadotGetAddress, polkadotSignTransaction
- [Cosmos](cosmos/) - cosmosGetAddress, cosmosGetPublicKey, cosmosSignTransaction
- [Stellar](stellar/) - stellarGetAddress, stellarSignTransaction
- [Ripple](ripple/) - xrpGetAddress, xrpSignTransaction

## Reference

- [Common Parameters](common-params.md)
- [Path Format](path.md)
- [Error Codes](error-code.md)
