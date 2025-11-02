# Hardware SDK API Navigation

Use this directory to locate chain-specific API references and shared metadata.

- `common-params.md`, `path.md`, `error-code.md`, `init.md` - Common parameters, derivation rules, error catalog, and initialization helpers.
- `basic-api/` - Device enumeration, feature retrieval, and UI response utilities.
- `device-api/` - Firmware upgrades, verification, wipes, and other management calls.
- Chain directories (for example `bitcoin-and-bitcoin-forks`, `ethereum-and-evm`) - Address, public key, and signing examples for each protocol.

Suggested reading order:

1. Start with `common-params.md` so every request shares the same baseline arguments.
2. Jump to the chain directory that matches your product surface.
3. When an error occurs, consult `error-code.md` together with the troubleshooting article in the Explanations section.

Reminder: If you rely on Common Connect or custom transports, the API signatures remain the same-just supply the appropriate `connectId` and `deviceId` values.