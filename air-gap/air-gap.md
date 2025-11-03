# Air‑Gap (Offline QR Signing) Overview

Minimal, accurate overview of building a “device stays offline” signing loop using UR‑encoded QR codes. See the Guide for full details.

- Demo repository (React Native): https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/react-native-demo
- Reference directory: `packages/connect-examples/react-native-demo/air-gap`

## Quick Start

1) Setup
- Follow `guide/setup.md` to install packages and Metro polyfills.

2) Decode an incoming animated QR (generic)
```ts
const { receivePart, promiseResultUR } = airGapUrUtils.createAnimatedURDecoder();
receivePart?.(frame); // push each scanned string from camera
const ur = await promiseResultUR; // a complete UR object
```

3) Build and display a request (EVM EIP‑1559)
```ts
const ur = getAirGapSdk().eth.generateSignRequest({
  requestId: uuidv4(),
  signData: unsignedTxHex, // hex without 0x
  dataType: EAirGapDataTypeEvm.typedTransaction,
  path: "m/44'/60'/0'/0/0",
  xfp: device.xfp,
  chainId: 1,
  origin: 'AirGap Demo',
});
// Use airGapUrUtils.urToQrcode(ur) to render animated QR frames
```

4) Scan device response
- Feed device frames to the same decoder; inspect the typed result (e.g., `eth-signature`, `crypto-psbt`, `sol-signature`).

5) Broadcast/hand off
- Submit signed payloads using your network stack or return them to the host app.

Supported chains (high‑level)
- EVM (transactions & messages), BTC (PSBT), Solana (transactions & messages), Tron (transactions & messages via qr‑wallet‑sdk).
See chain details in `guide/chains/*`.

## Documentation Map

- Guide
  - Setup: `guide/setup.md`
  - QR & UR Basics: `guide/qr-ur.md`
  - Air‑Gap Workflow: `guide/workflow.md`
  - UI Patterns: `guide/ui-patterns.md`
  - Chains
    - EVM: `guide/chains/evm.md`
    - BTC: `guide/chains/btc.md`
    - Solana: `guide/chains/solana.md`
    - Tron: `guide/chains/tron.md`
  - Troubleshooting: `guide/troubleshooting.md`
- API Reference
  - Basic API: `reference/basic-api/README.md`
  - Ethereum & EVM: `reference/ethereum-and-evm/README.md`

## Where to Look in the Demo

- `hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap/src/components/AirGapScanner.tsx` (camera integration + animated UR decode)
- `hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap/sdk/*` (multi‑chain helpers and utils)
- `hardware-js-sdk/packages/connect-examples/react-native-demo/air-gap/src/components/DecodedResultCard.tsx` (result rendering)

For protocol data structures and UR types, see `reference/*`.
