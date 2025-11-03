# Air‑Gap SDK API Reference

- `basic-api/` – Definitions for `CryptoHDKey`, `CryptoCoinInfo`, and `CryptoKeypath` used when decoding QR payloads.
- `ethereum-and-evm/` – Examples for `EthSignRequest`, `EthSignature`, and other EVM‑centric offline signing flows.

Pair this reference with the Guide for end‑to‑end integration:
- Setup: `../guide/setup.md`
- QR & UR Basics: `../guide/qr-ur.md`
- Workflow: `../guide/workflow.md`
- UI Patterns: `../guide/ui-patterns.md`
- Chains: `../guide/chains/*`
- Troubleshooting: `../guide/troubleshooting.md`

Tip: Study `basic-api` before implementing scanning/decoding to ensure correct parsing.

Note on Tron: Tron Air‑Gap helpers live in our qr‑wallet‑sdk and follow the same UR patterns; see `../guide/chains/tron.md` for usage.

Packages
- Use Keystone official packages: `@keystonehq/keystone-sdk`, `@keystonehq/bc-ur-registry*`
- UR primitives: `@ngraveio/bc-ur`
