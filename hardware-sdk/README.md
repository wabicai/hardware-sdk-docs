# Hardware SDK API References

Use this page as a concise index to jump into each module. Links point to the canonical docs under this folder.

## Core Modules

- Common Params: [common-params.md](./common-params.md)
- Path Params (derivation rules): [path.md](path.md)
- Error Codes: [error-code.md](error-code.md)
- Init SDK: [init.md](init.md)
- Config Event (UI/config events): [Config Event](config-event.md)
- Basic API (device discovery & UI flow): [basic-api](basic-api/README.md)
- Device API (settings, update, verify): [device-api](device-api/README.md)

## Per‑chain APIs

- Bitcoin and Bitcoin Forks: [bitcoin-and-bitcoin-forks/README.md](bitcoin-and-bitcoin-forks/README.md)
- Ethereum and EVM: [ethereum-and-evm/README.md](ethereum-and-evm/README.md)
- Algorand: [algorand/README.md](algorand/README.md)
- Alephium: [alephium/README.md](alephium/README.md)
- Aptos: [aptos/README.md](aptos/README.md)
- Benfen: [benfen/README.md](benfen/README.md)
- Cardano: [cardano/README.md](cardano/README.md)
- Conflux: [conflux/README.md](conflux/README.md)
- Cosmos: [cosmos/README.md](cosmos/README.md)
- Dynex: [dynex/README.md](dynex/README.md)
- Filecoin: [filecoin/README.md](filecoin/README.md)
- Kaspa: [kaspa/README.md](kaspa/README.md)
- NEAR: [near/README.md](near/README.md)
- NEM: [nem/README.md](nem/README.md)
- Nervos: [nervos/README.md](nervos/README.md)
- Nexa: [nexa/README.md](nexa/README.md)
- Nostr: [nostr/README.md](nostr/README.md)
- Polkadot: [polkadot/README.md](polkadot/README.md)
- Ripple: [ripple/README.md](ripple/README.md)
- SCDO: [scdo/README.md](scdo/README.md)
- Solana: [solana/README.md](solana/README.md)
- Starcoin: [starcoin/README.md](starcoin/README.md)
- Stellar: [stellar/README.md](stellar/README.md)
- Sui: [sui/README.md](sui/README.md)
- TON: [ton/README.md](ton/README.md)
- Tron: [tron/README.md](tron/README.md)

## Notes

- All requests share the same base arguments; start with Common Params and Path.
- API signatures are transport‑agnostic; provide the right `connectId` / `deviceId` if you use custom transports.
- See Error Codes for troubleshooting during development.
