# OneKey Hardware SDK Documentation

This site helps you integrate OneKey hardware wallets from prototype to production. Start with the multi-step WebUSB quick start and then branch into the transport recipe that matches your deployment target.

## Onboarding flow

- Follow the [Quick Start overview](quick-start/README.md) to complete the six-step WebUSB journey.
- Use the [communication matrix](#communication-matrix) to jump to transport-specific demos and references.
- Implement business logic with the [Hardware SDK reference](references/hardware-sdk/README.md).
- Deep dive into transport internals and security guidance under [Concepts & best practices](explanations/README.md).

## Communication matrix

| Transport | Typical platforms | Quick start entry | Demo project | Primary docs | Notes |
| --- | --- | --- | --- | --- | --- |
| WebUSB | Chrome / Edge desktop browsers | [Step 3 · Initialise the SDK](quick-start/3-basic-initialisation.md) | [hardware-js-sdk/packages/connect-examples](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples) | [Common Connect guide](transport-recipes/common-connect.md) | Requires a user gesture; Windows needs WinUSB drivers |
| WebBLE | Chromium browsers with Web Bluetooth | [Next steps](quick-start/6-next-steps.md) → WebBLE | [hardware-js-sdk/packages/connect-examples](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples) | [Common Connect guide](transport-recipes/common-connect.md) | First pairing prompts Bluetooth authorisation dialogs |
| React Native BLE | React Native iOS / Android apps | [React Native recipe](transport-recipes/react-native-ble.md) | [hardware-js-sdk/packages/connect-examples](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples) | [React Native BLE guide](transport-recipes/react-native-ble.md) | Configure platform permissions; Android recommends SDK ≥ 1.1.0 |
| Native shells (USB) | Electron, Flutter, native desktop shells | [Next steps](quick-start/6-next-steps.md) → native shells | [hardware-js-sdk/packages/connect-examples](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples) | [Common SDK guide](explanations/hardware-sdk/common-sdk-guide.md) | Inject a low-level transport adapter and manage lifecycle threads |
| Custom low-level transport | Gateways, embedded hosts, bespoke runtimes | [Next steps](quick-start/6-next-steps.md) → custom transports | [hardware-js-sdk/packages/connect-examples](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples) | [Low-level transport plugin](explanations/hardware-sdk/low-level-transport-plugin.md) | Follow the [OneKey Message Protocol](explanations/hardware-sdk/onekey-message-protocol.md) and enforce timeouts/retries |

## Device compatibility

- **USB transports** – OneKey Classic, OneKey Touch, and OneKey Mini Pro expose a unified USB interface and work directly with the Common Connect WebUSB flow described in the quick start.
- **Bluetooth transports** – OneKey Touch and OneKey Mini Pro ship with Bluetooth Low Energy, enabling WebBLE, React Native, and native mobile integrations once the USB path is validated.
- **Air-gapped products** – OneKey Lite and other QR-based devices require the [Air-Gap signing guide](air-gap/README.md) instead of Common Connect.

## Packages

| Package | Description | Version | Source |
| --- | --- | --- | --- |
| `@onekeyfe/hd-common-connect-sdk` | Universal transport layer for WebUSB, WebBLE, and low-level adapters | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-common-connect-sdk.svg)](https://www.npmjs.com/package/@onekeyfe/hd-common-connect-sdk) | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect) |
| `@onekeyfe/hd-core` | Event constants, message formatting, and shared types | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-core.svg)](https://www.npmjs.com/package/@onekeyfe/hd-core) | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/core) |
| `@onekeyfe/hd-transport-react-native` | React Native bridge for BLE and USB transports | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-transport-react-native.svg)](https://www.npmjs.com/package/@onekeyfe/hd-transport-react-native) | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/transport-react-native) |
| `@onekeyfe/hd-ble-sdk` | JavaScript BLE implementation for React Native and Expo | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-ble-sdk.svg)](https://www.npmjs.com/package/@onekeyfe/hd-ble-sdk) | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/ble-sdk) |

## Extended modules

- **Security & UX** – [Clear signing best practices](explanations/security/clear-signing.md), [Passphrase](explanations/hardware-sdk/passphrase.md), [PIN](explanations/hardware-sdk/pin.md)
- **Troubleshooting** – [Diagnostics playbook](explanations/troubleshooting.md) with log collection tips and common error codes
- **Reference catalog** – [Reference index](references/README.md) for every chain, error code, and parameter schema

## Support & community

- GitHub repository: https://github.com/OneKeyHQ/app-monorepo
- Discussions: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
- Issue tracker: https://github.com/OneKeyHQ/hardware-js-sdk/issues
- Help Center: https://help.onekey.so/hc

Work through the quick start, pick the transport that matches your platform, and keep iterating with the playground to catch regressions early.\n*** End Patch
