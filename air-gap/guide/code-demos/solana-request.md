# Code Demo · Solana Requests (Tx / Message)

Use `KeystoneSolanaSDK` to generate UR requests for Solana.

```ts
import { v4 as uuidv4 } from 'uuid';
import { KeystoneSolanaSDK } from '@keystonehq/keystone-sdk';
import { UR, UREncoder } from '@ngraveio/bc-ur';

const xfp = '12345678';
const path = "m/44'/501'/0'";

export function genSolTx(txHex: string) {
  const sdk = new KeystoneSolanaSDK();
  return sdk.generateSignRequest({
    requestId: uuidv4(),
    signData: txHex,
    dataType: 1, // 1=Transaction, 2=Message, 3/4=Off_Chain_* 
    path,
    xfp,
    origin: 'AirGap Demo',
  });
}

export function urToFrames(ur: UR) {
  return [UREncoder.encodeSinglePart(ur).toUpperCase()];
}
```

Notes
- Ensure the payload is a hex string without `0x` and matches the Solana format.
- Use the same derivation path you imported from the device multi-accounts export.
