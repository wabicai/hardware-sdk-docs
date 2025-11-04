# Air‑Gap Quick Start (EVM)

## Step 1. Install and setup

- Ensure your camera stream can feed animated QR frames to the decoder.

## Step 2. Decode an incoming animated QR

```ts
import { airGapUrUtils } from '@keystonehq/keystone-sdk';

const { receivePart, promiseResultUR } = airGapUrUtils.createAnimatedURDecoder();
// Push each scanned frame (string) from the camera to the decoder
receivePart?.(frameString);
// Wait until all parts are received
const ur = await promiseResultUR; // a complete UR object
```

## Step 3. Build a sign request

```ts
import { getAirGapSdk, EAirGapDataTypeEvm } from '@keystonehq/keystone-sdk';
import { v4 as uuidv4 } from 'uuid';

const ur = getAirGapSdk().eth.generateSignRequest({
  requestId: uuidv4(),
  signData: unsignedTxHex, // hex without 0x
  dataType: EAirGapDataTypeEvm.typedTransaction,
  path: "m/44'/60'/0'/0/0",
  xfp: device.xfp,
  chainId: 1,
  origin: 'AirGap App',
});

// Render as animated QR frames
const frames = airGapUrUtils.urToQrcode(ur);
```

Reference: [EthSignRequest](../reference/ethereum-and-evm/ethsignrequest.md)

## Step 4. Scan device response

Use the same decoder as in Step 2. Parse the typed result `eth-signature` and extract the signed payload.

Reference: [EthSignature](../reference/ethereum-and-evm/ethsignature.md)

## Step 5. Submit/broadcast

Submit the signed payload (transaction/message) to your network stack.

