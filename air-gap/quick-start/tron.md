# Air‑Gap Quick Start (Tron)

## Step 1. Install and setup

- Tron helpers live in our QR wallet SDK and follow standard UR patterns.

## Step 2. Decode an incoming animated QR

```ts
import { airGapUrUtils } from '@keystonehq/keystone-sdk';
const { receivePart, promiseResultUR } = airGapUrUtils.createAnimatedURDecoder();
receivePart?.(frameString);
const ur = await promiseResultUR;
```

## Step 3. Build a sign request

- Construct a Tron sign‑request UR with transaction/message payload and BIP‑44 path.
- Render as animated QR frames for the device to scan.

## Step 4. Scan device response

- Decode the device response UR and extract the signature.

## Step 5. Submit/broadcast

Broadcast the signed payload to the Tron network.

