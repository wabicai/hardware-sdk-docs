# Air-Gap Signing

The Air-Gap flow keeps the hardware wallet offline and exchanges data exclusively through UR-encoded QR codes. The reference implementation lives in `hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap`. This page condenses the essentials so you can replicate the same behaviour in your own application.

## Dependencies

Add the following packages (they match the demo project):

```bash
npm install --save @keystonehq/keystone-sdk @keystonehq/bc-ur-registry @keystonehq/bc-ur-registry-eth @keystonehq/bc-ur-registry-btc @keystonehq/bc-ur-registry-sol
npm install --save @ngraveio/bc-ur uuid expo-camera
```

Because the Keystone SDK depends on Node built-ins, include these polyfills in Metro (see `packages/connect-examples/react-native-demo/air-gap/sdk/polyfills.ts`): `buffer`, `crypto-browserify`, `stream-browserify`, `http-browserify`, `https-browserify`, `url`, `events`, `util`, `path-browserify`, `process`.

## Workflow overview

1. **Capture the device context**  
   `AirGapScanner` reads the wallet’s *crypto-multi-accounts* export, converts the frames into a UR object with `airGapUrUtils.qrcodeToUr()`, and parses the payload via `getAirGapSdk().parseMultiAccounts()`. Store the resulting fingerprint, xpubs, and derivation paths for later requests.

2. **Build outbound requests**  
   Chain helpers (`getAirGapSdk().eth`, `.btc`, `.sol`) assemble UR payloads for address verification, signing, and PSBT creation. The helper `OneKeyRequestDeviceQR` wraps the payload in the `onekey-app-call-device` envelope expected by the hardware.

3. **Scan hardware responses**  
   When the device displays a QR response, `AirGapScanner` feeds each frame into `airGapUrUtils.createAnimatedURDecoder()`. Once all parts are received, `parseAirGapUr()` converts the UR back into a typed object (`eth-signature`, `crypto-psbt`, etc.), and the UI renders the result (`DecodedResultCard`).

## Camera integration

The demo uses Expo SDK 54’s `CameraView` with QR-only scanning:

```tsx
import { CameraView } from 'expo-camera';

<CameraView
  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
  onBarcodeScanned={({ data }) => handleQrFrame(data)}
/>
```

`handleQrFrame` pushes every string into the animated decoder:

```ts
const decoder = airGapUrUtils.createAnimatedURDecoder();

decoder.push(frame); // frame is the scanned QR string

if (decoder.isComplete()) {
  const ur = decoder.resultUR();
  const payload = parseAirGapUr(ur);
  // handle eth-signature, crypto-psbt, etc.
}
```

Progress hints such as `UR:.../2OF10` are parsed to update the UI so operators know how many frames remain.

## Implementation notes

- Request camera permissions in `app.json` (`ios.infoPlist.NSCameraUsageDescription`, `android.permissions`).
- Seed your app with the genuine hardware export (`crypto-multi-accounts` QR) so the stored fingerprint and xpubs match the device you test with.
- The PSBT builder relies on the captured master fingerprint and xpub to avoid “wallet mismatch” prompts.
- If the hardware returns plain text, wrap it in `new UR(Buffer.from(value, 'utf8'), 'plain-text')` to keep downstream code consistent.

## Example project

Refer to the following files in `hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap`:

- `src/components/AirGapScanner.tsx` – camera integration, animated UR decoding, and progress feedback.
- `sdk/index.ts` – lazy initialisation of the Keystone SDK and chain-specific helpers (`getAirGapSdk().eth`, `.btc`, `.sol`).
- `src/components/DecodedResultCard.tsx` – rendering of decoded UR payloads for operators.

Once you complete the Air-Gap exchange, broadcast the signed payload through your existing network stack or hand it back to the host application for verification.