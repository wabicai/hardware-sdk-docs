# Air‑Gap Quick Start (Solana)

## Step 1. Install and setup

- Ensure camera streaming to feed animated QR frames to the decoder.

## Step 2. Decode an incoming animated QR

```ts
import { airGapUrUtils } from '@keystonehq/keystone-sdk';
const { receivePart, promiseResultUR } = airGapUrUtils.createAnimatedURDecoder();
receivePart?.(frameString);
const ur = await promiseResultUR; // complete UR object
```

## Step 3. Build a sign request

- Construct a Solana sign request UR (e.g., `sol-sign-request`) with transaction/message bytes and BIP‑44 path.
- Render as animated QR frames for the device to scan.

## Step 4. Scan device response

- Decode the device response (`sol-signature`) and extract the signature.

## Step 5. Submit/broadcast

Submit the signed transaction/message to the Solana network.

