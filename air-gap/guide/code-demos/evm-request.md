# Code Demo · EVM Requests (EIP-1559 / Legacy / TypedData / Message)

Use `KeystoneEthereumSDK` to generate UR requests for EVM flows. Use `@ngraveio/bc-ur` to animate frames.

```ts
import { v4 as uuidv4 } from 'uuid';
import { KeystoneEthereumSDK } from '@keystonehq/keystone-sdk';
import { UR, UREncoder } from '@ngraveio/bc-ur';

// Common
const xfp = '12345678'; // device fingerprint from crypto-multi-accounts
const path = "m/44'/60'/0'/0/0"; // example path

// EIP-1559 typed transaction
export function genEvmEip1559(unsignedTxHex: string, chainId = 1) {
  const sdk = new KeystoneEthereumSDK();
  return sdk.generateSignRequest({
    requestId: uuidv4(),
    signData: unsignedTxHex.replace(/^0x/i, ''),
    dataType: 4, // typedTransaction
    path,
    xfp,
    chainId,
    origin: 'AirGap Demo',
  });
}

// Legacy transaction
export function genEvmLegacy(unsignedLegacyHex: string, chainId = 1) {
  const sdk = new KeystoneEthereumSDK();
  return sdk.generateSignRequest({
    requestId: uuidv4(),
    signData: unsignedLegacyHex.replace(/^0x/i, ''),
    dataType: 1, // transaction
    path,
    xfp,
    chainId,
    origin: 'AirGap Demo',
  });
}

// EIP-712 typed data (pass full JSON bytes as hex)
export function genEvmTypedData(typedDataJson: string) {
  const sdk = new KeystoneEthereumSDK();
  const dataHex = Buffer.from(typedDataJson, 'utf8').toString('hex');
  return sdk.generateSignRequest({
    requestId: uuidv4(),
    signData: dataHex,
    dataType: 2, // typedData
    path,
    xfp,
    origin: 'AirGap Demo',
  });
}

// Personal message
export function genEvmMessage(message: string) {
  const sdk = new KeystoneEthereumSDK();
  const dataHex = Buffer.from(message, 'utf8').toString('hex');
  return sdk.generateSignRequest({
    requestId: uuidv4(),
    signData: dataHex,
    dataType: 3, // personalMessage
    path,
    xfp,
    origin: 'AirGap Demo',
  });
}

// Animate frames
export function urToFrames(ur: UR, maxFragmentLength = 100) {
  const single = UREncoder.encodeSinglePart(ur).toUpperCase();
  return [single];
}
```

Decoding ETH signature
```ts
import { URDecoder } from '@ngraveio/bc-ur';
import { EthSignature } from '@keystonehq/bc-ur-registry-eth';

export function parseEthSignatureFromFrames(frames: string[]) {
  const dec = new URDecoder();
  frames.forEach(f => dec.receivePart(f));
  if (!dec.isComplete()) throw new Error('Incomplete frames');
  const ur = dec.resultUR();
  if (ur.type !== 'eth-signature') throw new Error('Not eth-signature');
  const sig = EthSignature.fromCBOR(ur.cbor);
  return {
    requestId: sig.getRequestId(),
    signature: sig.getSignature(),
  };
}
```

Notes
- Keep path/xfp in sync with the exported account from the target device.
- Provide `chainId` for transactions (typed/legacy). Omit for messages if not required.
