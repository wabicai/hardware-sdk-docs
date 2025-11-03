# CryptoHDKey

The `CryptoHDKey` class represents hierarchical deterministic key information

This is an instruction provided by the OneKey hardware, which includes the extened public key information.

### Parameters

* `isMaster`: `boolean` Whether it is a master key.
* `isPrivateKey`: `boolean`  Whether it is a private key.
* `key`: `Buffer`  The key data.
* `chainCode`: `Buffer` The chain code.
* `useInfo`:[`CryptoCoinInfo`](cryptocoininfo.md)  Usage information.
* `origin`: [`CryptoKeypath`](cryptokeypath.md) The origin path.
* `children`:[`CryptoKeypath`](cryptokeypath.md)  The children path.
* `parentFingerprint`:`Buffer`  The parent fingerprint.
* `name`: `string`  The name. optional
* `note`:`Note(string)`  The note. optional
  * 'account.standard' : BIP44 Standard account
  * "account.ledger_live" : Ledger Live account
  * "account.ledger_legacy" : Ledger Legacy account



### URL Example

```
UR:CRYPTO-HDKEY/PDAXHDCLAOZTRDKBTKFPRFKBCWVEWYBGDPNTCPVLEOENJSWMBKFTLTRESNWTNLTLMKJYVYMWBSAAHDCXCSBNNLLNBZIAJZTPKPPKJOSTCEZSJEKGYKJOCSKNHFTPSWTIGHVABDIEGTBWWLTEAHTAADEHOYADCSFNAMTAADDYOYADLNCSDWYKCSFNYKAEYKATTAADDYOYADLRAEWKLAWKAYAEASINFPIAIAJLKPJTJYCXEHBKKOGHISINJKCXINJKCXHSC
```



## Decoding flow (outline)

- Aggregate QR frames into a UR object (e.g., using `@ngraveio/bc-ur`'s `URDecoder`).
- Inspect `ur.type === 'crypto-hdkey'` and parse `CryptoHDKey` from CBOR bytes using the registry helper.
- Extract fields such as name, note, chainCode, bip32 xpub, origin/children paths, and source fingerprint (xfp).
