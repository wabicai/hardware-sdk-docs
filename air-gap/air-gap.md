# Air‑Gap (Offline QR Signing) Overview

Minimal, accurate overview of building a “device stays offline” signing loop using UR‑encoded QR codes.

## How it works
- Build a sign request UR payload (per chain), then render as animated QR frames.
- Device scans QR, verifies details on‑device, and signs offline.
- Device displays a signature/result UR as animated QR.
- App scans the response, verifies, and submits/broadcasts via your network stack.

See Quick Start and API Reference below for concrete types and examples.

- Demo (React Native) → [GitHub Air‑Gap Demo](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/react-native-demo/air-gap)


## Where to Look in the Demo

- RN Scanner (camera + animated UR decode) → [AirGapScanner.tsx](https://github.com/OneKeyHQ/hardware-js-sdk/blob/onekey/packages/connect-examples/react-native-demo/air-gap/src/components/AirGapScanner.tsx)
- Chain helpers → [sdk/](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/react-native-demo/air-gap/sdk)
- Result rendering → [DecodedResultCard.tsx](https://github.com/OneKeyHQ/hardware-js-sdk/blob/onekey/packages/connect-examples/react-native-demo/air-gap/src/components/DecodedResultCard.tsx)

For protocol data structures and UR types, see [Reference](reference/README.md).
