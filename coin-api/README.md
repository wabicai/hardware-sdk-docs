# Details

Essential concepts and configurations for working with OneKey Hardware SDK.

## Key Concepts

### Connection Flow
1. **Initialize** - Configure SDK for your environment
2. **Search** - Discover OneKey hardware wallets
3. **Execute** - Call blockchain or device methods

### Parameters
All methods use consistent parameters:
- `connectId` - Device connection identifier
- `deviceId` - Device-specific identifier
- `commonParams` - Shared configuration options

### Response Format
```typescript
{
  success: boolean;
  payload: T | { error: string; code?: number };
}
```

## Configuration

- **[Installation & Setup](init.md)** - SDK initialization and environment setup
- **[Common Parameters](common-params.md)** - Shared parameters across all blockchain methods
- **[Path Parameters](path.md)** - BIP32/BIP44 derivation paths and standards
- **[Error Codes](error-code.md)** - Complete error handling reference

## Popular Blockchains

Start with the most commonly used blockchain integrations:

- **[Bitcoin & Bitcoin Forks](btc/README.md)** - BTC, BCH, LTC, DASH and 50+ Bitcoin-based networks
- **[Ethereum & EVM](evm/README.md)** - ETH, Polygon, BSC, Arbitrum and all EVM-compatible chains
- **[Solana](solana/README.md)** - High-performance blockchain with low fees
- **[Cardano](cardano/README.md)** - Proof-of-stake blockchain with formal verification

## Additional Resources

- **[Device Management](../device-api/README.md)** - Hardware wallet control and features
- **[Air Gap SDK](../air-gap-sdk/README.md)** - Offline signing for maximum security
- **[Advanced Topics](../advanced/README.md)** - PIN management, passphrase, and protocols

