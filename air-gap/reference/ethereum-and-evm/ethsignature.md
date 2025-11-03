# EthSignature

The `ETHSignature` class represents an Ethereum signature.

Used to parse the signed result returned by the device.



#### Parameters

* `signature`: `Buffer` The signature data.
* `requestId`: `Buffer` The request ID, optional.
* `origin`: `string` The origin information, optional.



### URL Example

```
UR:ETH-SIGNATURE/OTADTPDAGDSWNNYAHGTOKPFPIAPANNROLNSAVYDTHHAOHDFPCATKCPPFYLENGAGLMKMUCAYKFPFSDREOMENTPKBGEONDCHFDNBKOSSTPDWETSGBZDNCMCHKPNYDMKIDPTDRYJSDRTKCTIOFPQZHFLNSKVACLMNIYTKLGISFRWLKTZTREAEAXIYGWJTIHGRIHKKPLGDEEDS
```



### Example (decoding)

```ts
import { URDecoder } from '@ngraveio/bc-ur';
import { EthSignature } from '@keystonehq/bc-ur-registry-eth';

const dec = new URDecoder();
// push each scanned frame string into the decoder
// dec.receivePart(frame)

if (dec.isComplete()) {
  const ur = dec.resultUR(); // ur.type should be 'eth-signature'
  const sig = EthSignature.fromCBOR(ur.cbor);
  const requestId = sig.getRequestId();
  const signature = sig.getSignature();
  const r = signature.slice(0, 32);
  const s = signature.slice(32, 64);
  const v = signature.slice(64, 65);
}
```
