# Code Demo · Tron Requests (optional via qr-wallet-sdk)

If you integrate `@onekeyhq/qr-wallet-sdk`, you can generate Tron UR requests similarly.

```ts
import { v4 as uuidv4 } from 'uuid';
import { AirGapTronSDK } from '@onekeyhq/qr-wallet-sdk';
import { UR, UREncoder } from '@ngraveio/bc-ur';

const xfp = '12345678';
const path = "m/44'/195'/0'/0/0";

export function genTronTx(txHex: string) {
  const tron = new AirGapTronSDK();
  return tron.generateSignRequest({
    requestId: uuidv4(),
    signData: txHex,
    signType: AirGapTronSDK.DataType.Transaction, // 1=Tx, 2=Message, 3=MessageV2
    path,
    xfp,
    origin: 'AirGap Demo',
  });
}

export function urToFrames(ur: UR) {
  return [UREncoder.encodeSinglePart(ur).toUpperCase()];
}
```

Parsing signatures
```ts
import { URDecoder } from '@ngraveio/bc-ur';
import { AirGapTronSDK } from '@onekeyhq/qr-wallet-sdk';

export function parseTronSignature(frames: string[]) {
  const dec = new URDecoder();
  frames.forEach(f => dec.receivePart(f));
  if (!dec.isComplete()) throw new Error('Incomplete frames');
  const ur = dec.resultUR();
  const tron = new AirGapTronSDK();
  return tron.parseSignature(ur); // { requestId?: string; signature: string; raw: string }
}
```

Notes
- Tron support is provided by qr-wallet-sdk, not by the Keystone SDK package.
