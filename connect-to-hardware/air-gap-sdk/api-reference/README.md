# API Reference

Complete API documentation for OneKey Air Gap SDK. The Air Gap SDK uses standardized data formats and protocols for secure, offline transaction signing.

## Core Concepts

### Uniform Resources (UR)
The Air Gap SDK uses the UR (Uniform Resources) standard for encoding data in QR codes. This ensures:
- Efficient QR code encoding
- Error correction capabilities
- Standardized data formats
- Cross-platform compatibility

### CBOR Encoding
All data structures use CBOR (Concise Binary Object Representation) for:
- Compact binary encoding
- Type safety
- Deterministic serialization
- Wide language support

## API Categories

### [Basic API](basic-api/README.md)
Core data structures and utilities:
- **[CryptoCoinInfo](basic-api/cryptocoininfo.md)** - Cryptocurrency metadata
- **[CryptoHDKey](basic-api/cryptohdkey.md)** - Hierarchical deterministic keys
- **[CryptoKeypath](basic-api/cryptokeypath.md)** - BIP32 derivation paths

### [Ethereum & EVM](ethereum-and-evm/README.md)
Ethereum-specific implementations:
- **[EthSignature](ethereum-and-evm/ethsignature.md)** - Ethereum signature format
- **[EthSignRequest](ethereum-and-evm/ethsignrequest.md)** - Ethereum signing requests

## Data Flow

1. **Request Creation** - Generate signing request with transaction data
2. **QR Encoding** - Encode request as UR-formatted QR code
3. **Device Processing** - OneKey device decodes and processes request
4. **Signature Generation** - Device signs transaction offline
5. **Response Encoding** - Signature encoded as UR-formatted QR code
6. **Result Processing** - Application decodes signature for broadcast

## Standards Compliance

The Air Gap SDK implements these industry standards:
- **[BIP-174](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki)** - Partially Signed Bitcoin Transactions
- **[UR Specification](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-005-ur.md)** - Uniform Resources
- **[CBOR](https://tools.ietf.org/html/rfc7049)** - Concise Binary Object Representation
