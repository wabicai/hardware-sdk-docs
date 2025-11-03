# Tron (TRX)

Tron Air‑Gap helpers are provided by our `qr-wallet-sdk`, matching the same UR/QR patterns as other chains.

Supported operations
- Transaction signing (`Transaction`)
- Message signing (`Message` / `MessageV2`)

Minimal example
```ts
import { AirGapTronSDK } from '@onekeyhq/qr-wallet-sdk';

const tron = new AirGapTronSDK();
const ur = tron.generateSignRequest({
  requestId: uuidv4(),
  signData: txOrMessageHex,           // hex string
  signType: AirGapTronSDK.DataType.Transaction, // or Message / MessageV2
  path: account.path,
  xfp: device.xfp,
  origin: 'AirGap Demo',
});
```

Parsing signatures
```ts
// When a UR is received from the device:
const { requestId, signature } = tron.parseSignature(ur);
```

Notes
- Keep the derivation path consistent with the imported account.
- Ensure payloads are properly hex‑encoded without `0x`.
