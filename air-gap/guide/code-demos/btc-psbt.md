# Code Demo · BTC PSBT Request

Use `KeystoneBitcoinSDK` to generate a PSBT signing request UR.

```ts
import { KeystoneBitcoinSDK } from '@keystonehq/keystone-sdk';
import { UR, UREncoder } from '@ngraveio/bc-ur';

export function genBtcPsbt(psbtHex: string): UR {
  const sdk = new KeystoneBitcoinSDK();
  const clean = psbtHex.replace(/\s+/g, '');
  return sdk.generatePSBT(Buffer.from(clean, 'hex'));
}

export function urToFrames(ur: UR) {
  return [UREncoder.encodeSinglePart(ur).toUpperCase()];
}
```

PSBT validation tips
- Include `bip32_derivations` (xfp/path) for own inputs/outputs.
- Provide `nonWitnessUtxo` for legacy inputs and `witnessUtxo` for SegWit inputs.
- Ensure network and script type match (mainnet/testnet, legacy/segwit/taproot).
- Verify change outputs and derivation paths.
