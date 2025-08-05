# Advanced Topics

Deep dive into OneKey Hardware SDK's advanced features, security mechanisms, and low-level protocols.

## Security & Authentication

### [PIN Management](pin.md)
Device PIN handling and security:
- PIN entry and validation
- PIN change procedures
- Security timeouts and lockouts
- PIN-related error handling

### [Passphrase Handling](passphrase.md)
Advanced passphrase features:
- Passphrase-protected wallets
- Multiple wallet access
- Passphrase state management
- Security considerations

## SDK Architecture

### [Common SDK Guide](common-sdk-guide.md)
Shared SDK concepts and patterns:
- Cross-platform compatibility
- Common interfaces and abstractions
- Best practices for integration
- Performance optimization

### [Low-level Transport Plugin](low-level-transport-plugin.md)
Communication layer details:
- Transport protocol implementation
- Custom transport plugins
- Connection management
- Protocol debugging

### [OneKey Message Protocol](onekey-message-protocol.md)
Core communication protocol:
- Message format specification
- Protocol versioning
- Command and response structure
- Error handling mechanisms

## Integration Patterns

These advanced topics work together with core SDK features:

- **Device Management** - See [Device API](../device-api/README.md) for basic device operations
- **Blockchain Operations** - See [Blockchain APIs](../coin-api/README.md) for transaction signing
- **Air Gap Security** - See [Air Gap SDK](../air-gap-sdk/README.md) for offline signing

## When to Use Advanced Features

- **PIN Management** - Required for production applications
- **Passphrase** - For users requiring multiple wallets on one device
- **Custom Transports** - For specialized hardware or network configurations
- **Protocol Details** - For debugging or custom implementations

