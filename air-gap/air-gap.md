# Air‑Gap (Offline QR Signing) Overview

Minimal, accurate overview of building a “device stays offline” signing loop using UR‑encoded QR codes. See the Guide for full details.

- Demo (React Native): https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/react-native-demo/air-gap


## Documentation Map

- Quick Start: [quick-start.md](quick-start.md)
- Reference
  - Basic API: [reference/basic-api/README.md](reference/basic-api/README.md)
  - Ethereum & EVM: [reference/ethereum-and-evm/README.md](reference/ethereum-and-evm/README.md)

## Where to Look in the Demo

- RN Scanner (camera + animated UR decode): hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap/src/components/AirGapScanner.tsx
- Chain helpers: hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap/sdk/*
- Result rendering: hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap/src/components/DecodedResultCard.tsx

For protocol data structures and UR types, see [Reference](reference/README.md).
