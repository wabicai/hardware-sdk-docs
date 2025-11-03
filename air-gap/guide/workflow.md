# Air‑Gap Workflow

Step‑by‑step outline matching the demo’s flow.

1) Import device context
- Scan animated `crypto-multi-accounts` QR from the hardware wallet.
- Aggregate frames with `qrcodeToUr()` and parse via `getAirGapSdk().parseMultiAccounts()`.
- Persist device fingerprint (xfp), xpubs, public keys and derivation paths.

2) Build a request (per chain)
- EVM: `getAirGapSdk().eth.generateSignRequest({ requestId, signData, dataType, path, xfp, chainId, origin })`
- BTC: `getAirGapSdk().btc.generatePSBT(Buffer.from(psbtHex, 'hex'))`
- SOL: `getAirGapSdk().sol.generateSignRequest({ requestId, signData, dataType, path, xfp, origin })`
- TRON: `new AirGapTronSDK().generateSignRequest({ requestId, signData, signType, path, xfp, origin })`
- Optionally wrap with `OneKeyRequestDeviceQR` to include app/device metadata.

3) Display the request as animated QR
- Use `createAnimatedUREncoder({ ur, maxFragmentLength: 100 })` and render frames in sequence.

4) Scan device response
- Feed device frames to `createAnimatedURDecoder()`; when complete, parse with `parseAirGapUr(ur)`.
- Handle typed results such as `eth-signature`, `crypto-psbt`, `sol-signature`, `tron-signature`.

5) Broadcast or hand off
- Submit signed payloads using your network stack or return to the host app for verification.
