# Air Gap SDK API Navigation

- `basic-api/` - Definitions for `CryptoHDKey`, `CryptoCoinInfo`, and `CryptoKeypath`, used when decoding QR payloads.
- `ethereum-and-evm/` - Examples for `EthSignRequest`, `EthSignature`, and other EVM-centric offline signing flows.

Usage tips:

1. Study the `basic-api` directory before implementing your QR-code scanner so decoding logic is correct.
2. Combine these references with the Advanced "QR-code Wallet Integration" guide to assemble requests and parse signatures.
3. Extend the structure with additional chains when needed-follow the same directory layout.

For clear user communication during QR-code signing, see "Clear Signing Best Practices".
