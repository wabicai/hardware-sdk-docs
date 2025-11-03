# EthSignRequest

The `EthSignRequest` class handles Ethereum signing requests.

Used to send a signing request to the device.



```
enum DataType {
    transaction = 1, // For the legacy transaction, the rlp encoding of the unsigned data.
    typedData = 2, // For the EIP-712 typed data. Bytes of the json string.
    personalMessage = 3, // For the personal message signing. 
    typedTransaction = 4 // For the typed transaction, like the EIP-1559 transaction.
}
```

### Parameters

* `requestId`: `Buffer` The request ID.  uuid random
* `signData`: `Buffer` The data to be signed.
* `dataType`: `DataType` The type of signing data.
* `chainId`: `number` The chain ID. optional
* `derivationPath`: [`CryptoKeypath`](../basic-api/cryptokeypath.md) The derivation path.
* `address`: `Buffer` The address for request this signing. optional
* `origin`: `string` Source of the request. optional



### URL Example

```
UR:ETH-SIGN-REQUEST/ONADTPDAGDSWNNYAHGTOKPFPIAPANNROLNSAVYDTHHAOHDECAOWFLYLDLFAAUELPATAEGWSOLALPBAVYGUYTHNLFGMAYMWSGBYZOIYHTRDCFBANBFPBNDSPRJPNSDLGLBYIMJELTCNLNWZJLSEAEAELARTAXAAAACSLDAHTAADDYOEADLECSDWYKCSFNYKAEYKAEWKADWKAOCYTIZSYLCNSSDKGOCA
```

### EIP‑1559 transaction (high‑level)

```ts
import { KeystoneEthereumSDK } from '@keystonehq/keystone-sdk';

const eth = new KeystoneEthereumSDK();
const ur = eth.generateSignRequest({
  requestId,                // uuid string
  signData: unsignedTxHex,  // hex without 0x
  dataType: 4,              // typedTransaction
  path: "m/44'/60'/0'/0/0",
  xfp: '12345678',
  chainId: 1,
  origin: 'your-app',
});
// Encode UR into animated QR frames and display
```

### Legacy transaction (high‑level)

```ts
const ur = eth.generateSignRequest({
  requestId,
  signData: unsignedLegacyHex,
  dataType: 1,              // transaction
  path: "m/44'/60'/0'/0/0",
  xfp: '12345678',
  chainId: 1,
  origin: 'your-app',
});
```

### EIP‑712 TypedData (high‑level)

```ts
const dataHex = Buffer.from(typedDataJson, 'utf8').toString('hex');
const ur = eth.generateSignRequest({
  requestId,
  signData: dataHex,
  dataType: 2,              // typedData
  path: "m/44'/60'/0'/0/0",
  xfp: '12345678',
  origin: 'your-app',
});
```

### Message sign (high‑level)

```ts
const dataHex = Buffer.from(message, 'utf8').toString('hex');
const ur = eth.generateSignRequest({
  requestId,
  signData: dataHex,
  dataType: 3,              // personalMessage
  path: "m/44'/60'/0'/0/0",
  xfp: '12345678',
  origin: 'your-app',
});
```



Obtaining a signature requires viewing.

{% content-ref url="ethsignature.md" %}
[ethsignature.md](ethsignature.md)
{% endcontent-ref %}
