# Advanced Topics

Deep dive into OneKey Hardware SDK's advanced features, alternative SDKs, security mechanisms, and low-level protocols.

## Alternative SDK Options

For specialized use cases beyond the recommended Web SDK:

### [Mobile & React Native Integration](common-sdk-guide.md)
**@onekeyfe/hd-ble-sdk** - For React Native mobile applications:
- Bluetooth Low Energy (BLE) communication
- iOS and Android support
- Mobile-specific optimizations
- Background connection handling

### [Desktop & Native Applications](common-sdk-guide.md)
**@onekeyfe/hd-common-connect-sdk** - For native desktop applications:
- Cross-platform desktop support
- USB and Bluetooth connectivity
- Native app integration patterns
- Electron compatibility

### [Server-side Integration](common-sdk-guide.md)
**@onekeyfe/hd-core** - For Node.js server environments:
- Server-side transaction signing
- Batch operations
- Enterprise integrations
- Headless device management

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

## When to Use Advanced Options

### Alternative SDKs
- **BLE SDK** - When building React Native mobile apps
- **Common Connect SDK** - For desktop applications or when WebUSB isn't available
- **Core SDK** - For server-side or Node.js applications

### Advanced Features
- **PIN Management** - Required for production applications
- **Passphrase** - For users requiring multiple wallets on one device
- **Custom Transports** - For specialized hardware or network configurations
- **Protocol Details** - For debugging or custom implementations

## Migration from Web SDK

If you need to migrate from Web SDK to an advanced SDK:

1. **Identify Requirements** - Determine why Web SDK doesn't meet your needs
2. **Choose Alternative** - Select the appropriate SDK for your platform
3. **Update Dependencies** - Install the new SDK package
4. **Modify Initialization** - Update SDK initialization code
5. **Handle Parameters** - Advanced SDKs may require connectId/deviceId parameters

For most use cases, the **Web SDK remains the recommended choice** due to its simplicity and direct WebUSB communication.

