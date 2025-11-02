# Step 6 · Where to Go Next

You can now enumerate a device, respond to UI events, and execute your first API call. Use the following resources to expand beyond the quick start prototype.

## Choose another transport

- [Common Connect (USB/BLE)](../transport-recipes/common-connect.md) – switch between WebUSB, WebBLE, and low-level adapters at runtime.
- [React Native BLE recipe](../transport-recipes/react-native-ble.md) – embed the SDK inside a React Native or Expo shell.
- [Low-level transport plugin](../explanations/hardware-sdk/low-level-transport-plugin.md) – implement custom adapters for embedded environments.

## Explore the API surface

- [Hardware SDK reference](../references/hardware-sdk/README.md) – browse all coin-specific methods.
- [Basic API](../references/hardware-sdk/api-reference/basic-api/README.md) – device discovery, feature negotiation, cancellation, and UI responses.
- [Device API](../references/hardware-sdk/api-reference/device-api/README.md) – firmware checks, configuration, and lifecycle operations.

## Harden your integration

- [Clear signing best practices](../explanations/security/clear-signing.md) – align on-screen messages with hardware confirmations.
- [Passphrase and PIN guidance](../explanations/hardware-sdk/passphrase.md) – design UX for hidden wallets and secure unlock flows.
- [Troubleshooting guide](../explanations/troubleshooting.md) – collect logs, resolve connection issues, and escalate to support.

Keep iterating on the sample project as you move towards production. The playground remains a reliable baseline for verifying regressions and firmware updates.
