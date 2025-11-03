# Troubleshooting & Compatibility

QR fragment length & density
- Keep fragments short: 80–120 characters work well; the demo uses 100 and uppercase frames.
- Use high‑contrast (dark on light) QR and throttle rendering if cameras struggle to keep up.

Frame sequencing & resume
- Show progress hints (e.g., `UR:.../2OF10`) to set user expectations.
- UR frames may arrive out of order; the animated decoder handles sequencing.
- Allow abort/retry and clear the decoder before starting a new request.
- Ignore duplicate frames and cap retention to avoid memory growth.

PSBT validation (BTC)
- Wallet mismatch: xfp/path/xpub must match the scanned device; include `bip32_derivations` for own inputs/outputs.
- UTXO data: `nonWitnessUtxo` for legacy inputs, `witnessUtxo` for SegWit inputs; mixed inputs require correct descriptors per input.
- Network & script type: testnet/mainnet and legacy/segwit/taproot must match.
- Change outputs: double‑check derivation paths for change.

EVM request shape
- `typedTransaction`: unsigned bytes for EIP‑1559; `transaction`: legacy.
- `typedData`: UTF‑8 bytes of full EIP‑712 JSON; `personalMessage`: raw message bytes.
- Provide `chainId` for transactions.

Solana & Tron
- Choose the correct `dataType`/`signType` for transaction vs message.
- Ensure payloads are hex‑encoded without `0x` and align to expected formats.

Common runtime issues
- Metro polyfills missing → add Node built‑ins: `buffer`, `crypto-browserify`, `stream-browserify`, `http-browserify`, `https-browserify`, `url`, `events`, `util`, `path-browserify`, `process`.
- Camera permissions missing → configure `app.json` (`ios.infoPlist.NSCameraUsageDescription`, `android.permissions`).
- Decoder stalls at the last frames → reduce fragment length, increase QR size, or slow down frame playback.
