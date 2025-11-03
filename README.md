# Introduction

Integrate OneKey hardware wallets from prototype to production with a clean path: start with Quick Start, choose a transport by your platform, wire events, and call chain APIs.

## Quick Start

- Overview: [Quick Start](quick-start.md)
- Sub‑guides:
  - [Setup and Init](quick-start/setup-and-init.md)
  - [Device Discovery and Features](quick-start/device-discovery-and-features.md)
  - [UI Events: PIN](quick-start/ui-events-pin.md)
  - [UI Events: Passphrase](quick-start/ui-events-passphrase.md)
  - [First Command](quick-start/first-command.md)

## Choose Your Transport

| Platform (Stack)     | Transport  | SDK Package                                                                                           | Guide                                                     |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Web (Browser)        | WebUSB     | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [WebUSB Connection Guide](transport-recipes/web-usb.md)   |
| React Native         | BLE        | [@onekeyfe/hd-ble-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/blob/onekey/packages/hd-ble-sdk)    | [React Native BLE](transport-recipes/react-native-ble.md) |
| Android (Native)     | BLE        | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [Android BLE](transport-recipes/common-connect-1/android-ble.md) |
| iOS (Native)         | BLE        | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [iOS BLE](transport-recipes/common-connect-1/ios-ble.md)  |
| Flutter              | BLE        | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [Flutter BLE](transport-recipes/common-connect-1/flutter-ble.md) |

- Playground: [hardware-example.onekey.so](https://hardware-example.onekey.so/) — Try WebUSB connection, call sample APIs, and test with the built‑in emulator device.

## API References

- Per‑chain APIs: [Hardware SDK API References](hardware-sdk/README.md)
- Events and UI responses: [Config Event](references/hardware-sdk/api-reference/config-event.md)

## Device and transport compatibility

The support status for Bluetooth and USB on different devices.

| Device            | Bluetooth            | USB                  |
| ----------------- | -------------------- | -------------------- |
| OneKey Classic    | :white_check_mark:   | :white_check_mark:   |
| OneKey Classic 1s | :white_check_mark:   | :white_check_mark:   |
| OneKey Classic 1s Pure | :white_check_mark:   | :white_check_mark:   |
| OneKey Mini       | :x:                  | :white_check_mark:   |
| OneKey Touch      | :white_check_mark:   | :white_check_mark:   |
| Onekey Pro        | :white_check_mark:   | :white_check_mark:   |

## Core packages

| Package                               | Purpose                                                             |
| ------------------------------------- | ------------------------------------------------------------------- |
| `@onekeyfe/hd-common-connect-sdk`     | Unified SDK surface for Web/Native; recommended entry for transports |
| `@onekeyfe/hd-ble-sdk`                | Pure React Native BLE stack (recommended for RN projects)           |
| `@onekeyfe/hd-transport-react-native` | React Native transport side‑effects/bridge                          |
| `@onekeyfe/hd-transport-web-device`   | Web transport for device access in web contexts                     |
| `@onekeyfe/hd-transport-emulator`     | Emulator transport (develop and test without a physical device)     |
| `@onekeyfe/hd-transport-http`         | HTTP bridge transport                                               |
| `@onekeyfe/hd-transport-lowlevel`     | Low‑level host adapter contract (for native integrations)           |
| `@onekeyfe/hd-core`                   | Core events, constants, message wiring                              |
| `@onekeyfe/hd-shared`                 | Shared utilities and types                                          |
| `@onekeyfe/hd-web-sdk`                | Web SDK wrapper (not recommended; prefer hd-common-connect-sdk)     |

## Concepts and advanced topics

- PIN and Passphrase UX and flows: `explanations/hardware-sdk/pin.md`, `explanations/hardware-sdk/passphrase.md`
- Message protocol (for debugging low-level transports): `transport-recipes/common-connect-1/onekey-message-protocol.md`
- Notes:
  - The legacy "Common SDK Guide" content has been consolidated into per-platform transport guides (iOS/Android/Flutter). Use the transport recipes for up-to-date integration steps.

## Support

- Discussions: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
- Issues: https://github.com/OneKeyHQ/hardware-js-sdk/issues
- Help Center: https://help.onekey.so/hc
