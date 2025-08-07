# Device Management

Essential functions for managing OneKey hardware wallets.

## Methods

* [Get Features](get-features.md) - Device capabilities and information
* [Search Devices](search-devices.md) - Discover connected devices
* [Get Passphrase State](get-passphrase-state.md) - Manage passphrase states
* [Cancel Request](cancel-request.md) - Cancel ongoing operations
* [Response UI Event](response-ui-event.md) - Handle user interface events

## Usage Flow

1. **Search** - Discover available devices using [Search Devices](search-devices.md)
2. **Get Features** - Retrieve device capabilities with [Get Features](get-features.md)
3. **Execute** - Perform blockchain operations (see [Blockchain APIs](../coin-api/README.md))
4. **Handle Events** - Respond to user interactions via [Response UI Event](response-ui-event.md)

## Related Topics

- **[Common Parameters](../configuration/common-params.md)** - Device connection parameters
- **[PIN Management](../advanced/pin.md)** - Device PIN handling
- **[Passphrase Handling](../advanced/passphrase.md)** - Advanced passphrase features
- **[Error Codes](../configuration/error-codes.md)** - Device error troubleshooting

## Security Features

Device management includes several security features:
- **Device Authentication** - Verify genuine OneKey hardware
- **Firmware Validation** - Ensure device runs authentic firmware
- **Session Management** - Secure communication sessions
- **User Confirmation** - Physical device confirmation for operations

