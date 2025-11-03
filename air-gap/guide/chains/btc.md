# Bitcoin (BTC)

Supported operations
- PSBT offline signing (`crypto-psbt`)
- Address verification

Minimal examples
```ts
// PSBT signing request
const psbtHex = '70736274...';
const ur = getAirGapSdk().btc.generatePSBT(Buffer.from(psbtHex, 'hex'));

// Address verification (wrap your request as needed)
// Use exported xpub/paths to derive and verify addresses on device
```

PSBT validation tips
- Include `bip32_derivations` (xfp + path) for inputs/outputs belonging to the wallet.
- Provide `nonWitnessUtxo` for legacy inputs and `witnessUtxo` for SegWit inputs.
- Ensure network (mainnet/testnet) and script types (legacy/segwit/taproot) match your PSBT.
- Verify change outputs and their derivation paths carefully.

Troubleshooting
- Device rejects with wallet mismatch → xpub/path/xfp do not match the scanned device.
- Missing UTXO data → add the correct `nonWitnessUtxo`/`witnessUtxo` per input type.
