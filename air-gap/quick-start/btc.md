# Air‑Gap Quick Start (Bitcoin / PSBT)

## Step 1. Install and setup

- Demo reference: https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/react-native-demo/air-gap
- Ensure camera streaming to feed animated QR frames to the decoder.

## Step 2. Decode an incoming animated QR

```ts
import { airGapUrUtils } from '@keystonehq/keystone-sdk';
const { receivePart, promiseResultUR } = airGapUrUtils.createAnimatedURDecoder();
receivePart?.(frameString);
const ur = await promiseResultUR; // a complete UR object
```

## Step 3. Build a PSBT request

- Produce an unsigned PSBT (hex/base64) from your wallet backend.
- Encode as a UR for display as animated QR frames (type: `crypto-psbt`).

```ts
// Pseudocode: convert PSBT → UR → animated QR frames
// const ur = airGapUrUtils.psbtToUR(unsignedPsbt);
// const frames = airGapUrUtils.urToQrcode(ur);
```

Reference: [Basic API](../../air-gap/reference/basic-api/README.md)

## Step 4. Scan device response

- Decode the device response (also `crypto-psbt`) using the same decoder.
- Extract the signed PSBT and finalize/broadcast via your backend.

## Step 5. Submit/broadcast

Submit the finalized transaction to the network.

