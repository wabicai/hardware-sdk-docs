# Introduction

Developer‑focused documentation for integrating OneKey hardware in Web and Native apps. Start with Quick Start (Web), then pick your transport guide, wire events, and call chain APIs.

## Quick Start

For Web developers getting started quickly: a compact path from init to first call, with copy‑pastable code snippets. See [Quick Start](quick-start.md).
## Choose Your Transport

| Platform (Stack)     | Transport  | SDK Package                                                                                           | Guide                                                     |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Web (Browser)        | WebUSB     | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [WebUSB Connection Guide](transport-recipes/web-usb.md)   |
| React Native         | BLE        | [@onekeyfe/hd-ble-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/blob/onekey/packages/hd-ble-sdk)    | [React Native BLE](transport-recipes/react-native-ble.md) |
| Android (Native)     | BLE        | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [Android BLE](transport-recipes/common-connect-1/android-ble.md) |
| iOS (Native)         | BLE        | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [iOS BLE](transport-recipes/common-connect-1/ios-ble.md)  |
| Flutter              | BLE        | [@onekeyfe/hd-common-connect-sdk](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/hd-common-connect-sdk) | [Flutter BLE](transport-recipes/common-connect-1/flutter-ble.md) |

- Playground: [hardware-example.onekey.so](https://hardware-example.onekey.so/) — Try WebUSB connection, call sample APIs, and test with the built‑in emulator device.
  - Features:
    - Live hardware wallet simulation
    - Real-time API testing
    - Multi-chain protocol support
    - No hardware device required for testing (you can use the emulator device)

## API References

- Per‑chain APIs: [Hardware SDK API References](hardware-sdk/README.md)
- Events and UI responses: [Config Event](hardware-sdk/config-event.md)
- How to unlock the device: [PIN Code](explanations/hardware-sdk/pin.md)
- Need support for passphraes? [What is Passphrase](explanations/hardware-sdk/passphrase.md)

## Device and transport compatibility

The support status for Bluetooth and USB on different devices.

| Device            | Bluetooth            | USB                  |
| ----------------- | -------------------- | -------------------- |
| OneKey Classic    | :white_check_mark:   | :white_check_mark:   |
| OneKey Classic 1s | :white_check_mark:   | :white_check_mark:   |
| OneKey Classic 1s Pure | :white_check_mark:   | :white_check_mark:   |
| OneKey Mini       | :x:                  | :white_check_mark:   |
| OneKey Touch      | :white_check_mark:   | :white_check_mark:   |
| OneKey Pro        | :white_check_mark:   | :white_check_mark:   |

## Core packages

| Package                               | Purpose                                                             | NPM | Version |
| ------------------------------------- | ------------------------------------------------------------------- | --- | ------- |
| `@onekeyfe/hd-common-connect-sdk`     | Unified SDK surface for Web/Native; recommended entry for transports | [npm](https://www.npmjs.com/package/@onekeyfe/hd-common-connect-sdk) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-common-connect-sdk.svg)](https://www.npmjs.com/package/@onekeyfe/hd-common-connect-sdk) |
| `@onekeyfe/hd-ble-sdk`                | Pure React Native BLE stack (recommended for RN projects)           | [npm](https://www.npmjs.com/package/@onekeyfe/hd-ble-sdk) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-ble-sdk.svg)](https://www.npmjs.com/package/@onekeyfe/hd-ble-sdk) |
| `@onekeyfe/hd-transport-react-native` | React Native transport side‑effects/bridge                          | [npm](https://www.npmjs.com/package/@onekeyfe/hd-transport-react-native) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-transport-react-native.svg)](https://www.npmjs.com/package/@onekeyfe/hd-transport-react-native) |
| `@onekeyfe/hd-transport-web-device`   | Web transport for device access in web contexts                     | [npm](https://www.npmjs.com/package/@onekeyfe/hd-transport-web-device) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-transport-web-device.svg)](https://www.npmjs.com/package/@onekeyfe/hd-transport-web-device) |
| `@onekeyfe/hd-transport-emulator`     | Emulator transport (develop and test without a physical device)     | [npm](https://www.npmjs.com/package/@onekeyfe/hd-transport-emulator) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-transport-emulator.svg)](https://www.npmjs.com/package/@onekeyfe/hd-transport-emulator) |
| `@onekeyfe/hd-transport-http`         | HTTP bridge transport                                               | [npm](https://www.npmjs.com/package/@onekeyfe/hd-transport-http) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-transport-http.svg)](https://www.npmjs.com/package/@onekeyfe/hd-transport-http) |
| `@onekeyfe/hd-transport-lowlevel`     | Low‑level host adapter contract (for native integrations)           | [npm](https://www.npmjs.com/package/@onekeyfe/hd-transport-lowlevel) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-transport-lowlevel.svg)](https://www.npmjs.com/package/@onekeyfe/hd-transport-lowlevel) |
| `@onekeyfe/hd-core`                   | Core events, constants, message wiring                              | [npm](https://www.npmjs.com/package/@onekeyfe/hd-core) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-core.svg)](https://www.npmjs.com/package/@onekeyfe/hd-core) |
| `@onekeyfe/hd-shared`                 | Shared utilities and types                                          | [npm](https://www.npmjs.com/package/@onekeyfe/hd-shared) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-shared.svg)](https://www.npmjs.com/package/@onekeyfe/hd-shared) |
| `@onekeyfe/hd-web-sdk`                | Web SDK wrapper (not recommended; prefer hd-common-connect-sdk)     | [npm](https://www.npmjs.com/package/@onekeyfe/hd-web-sdk) | [![npm](https://img.shields.io/npm/v/%40onekeyfe%2Fhd-web-sdk.svg)](https://www.npmjs.com/package/@onekeyfe/hd-web-sdk) |

- Changelog: [releases](https://github.com/OneKeyHQ/hardware-js-sdk/releases)

## Concepts and advanced topics

- Message protocol (for debugging low-level transports): [OneKey Message Protocol](transport-recipes/common-connect-1/onekey-message-protocol.md)

## Support

For users: This documentation is primarily for developers. If you encounter issues while using our products, please consult our Help Center or submit a support ticket.

- [Help Center](https://help.onekey.so)
- [Discussions](https://github.com/OneKeyHQ/hardware-js-sdk/discussions)
- [Issues](https://github.com/OneKeyHQ/hardware-js-sdk/issues)

## Related Repositories

- [OneKey App (app-monorepo)](https://github.com/OneKeyHQ/app-monorepo)
- [OneKey Firmware](https://github.com/OneKeyHQ/firmware)
- [OneKey Hardware JS SDK](https://github.com/OneKeyHQ/hardware-js-sdk)
