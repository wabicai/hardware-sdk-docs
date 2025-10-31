# OneKey Hardware SDK Documentation

This documentation helps you integrate OneKey hardware wallets from prototype to production. Start with the Quick Start to run your first command, then choose the transport recipe that matches your target environment. All examples are backed by working projects in the `hardware-js-sdk` repository.

## Documentation roadmap

| Section | Purpose | When to use it |
| --- | --- | --- |
| [Quick Start](quick-start.md) | Install the SDK, initialize the transport, handle events, run a sample call | First-time setup |
| [Transport Recipes](transport-recipes/README.md) | Platform-specific guidance and example projects | After you know which environment you need to support |
| [References](references/README.md) | API index, chain-specific commands, error catalog | While implementing real signing flows |
| [Concepts](explanations/README.md) | Background on passphrase, message protocol, low-level transport design | When you need deeper theory or to customise behaviour |
| [Troubleshooting](explanations/troubleshooting.md) | Links to support channels and diagnostics tips | When you hit an issue |

## Fast-track flow

1. Complete the [Quick Start](quick-start.md) checklist to install `@onekeyfe/hd-common-connect-sdk`, subscribe to UI events, and execute a first command.
2. Launch the Expo playground (`hardware-js-sdk/packages/connect-examples/expo-playground`) to validate your environment or the hardware emulator.
3. Pick the transport recipe that matches your deployment target (Common Connect or React Native BLE).
4. Implement the required APIs using the [Hardware SDK reference](references/hardware-sdk/README.md).
5. Layer on security messaging with the guidance in [Clear Signing Best Practices](explanations/security/clear-signing.md).

## Transport overview

| Transport | Description | Documentation | Example project |
| --- | --- | --- | --- |
| Common Connect (WebUSB / native host) | Unified SDK surface for browsers, native shells, and mixed USB/BLE flows | [Common Connect](transport-recipes/common-connect.md) | `hardware-js-sdk/packages/connect-examples/expo-playground`, `native-ios-example`, `native-android-example` |
| React Native BLE | Bluetooth communication in React Native apps | [React Native BLE](transport-recipes/react-native-ble.md) | `hardware-js-sdk/packages/connect-examples/native-android-example` |

## Security and UX essentials

- Follow [Clear Signing Best Practices](explanations/security/clear-signing.md) to keep on-screen information aligned with the hardware prompts.
- Review [Passphrase](explanations/hardware-sdk/passphrase.md) and [PIN](explanations/hardware-sdk/pin.md) to understand hidden wallets and secure unlock flows.
- Inspect [Low-level Transport Adapter](explanations/hardware-sdk/low-level-transport-plugin.md) and [OneKey Message Protocol](explanations/hardware-sdk/onekey-message-protocol.md) if you need custom native behaviour.

## Support and community

- GitHub repository: https://github.com/OneKeyHQ/app-monorepo
- Discussions: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
- Issue tracker: https://github.com/OneKeyHQ/hardware-js-sdk/issues
- Help Center: https://help.onekey.so/hc

Use the sidebar to navigate between sections. The Quick Start plus the transport recipes will take you from zero to a working integration in minutes.
