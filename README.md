# Introduction

This documentation helps you integrate OneKey hardware wallets from prototype to production. Start with the Quick Start to learn the essential device lifecycle (init → discover → identify → UI events → first command). Then choose the transport guide that matches your platform.

## Getting started

- Quick Start (step-by-step)
  - Overview: `quick-start.md`
  - Sub-guides: setup/init, device discovery, PIN, passphrase, first command, communication flow (linked from the Quick Start index)
- Choose your transport
  - WebUSB (browser): `transport-recipes/web-usb.md`
  - Native BLE (iOS): `transport-recipes/common-connect-1/ios-ble.md`
  - Native BLE (Android): `transport-recipes/common-connect-1/android-ble.md`
  - React Native BLE (pure RN stack): `transport-recipes/react-native-ble.md`
- API reference (per-chain): `hardware-sdk/README.md`

## Demo projects (reference implementations)

- iOS native (WKWebView + CoreBluetooth):
  - https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/native-ios-example
- Android native (WebView + JSBridge + Nordic BLE):
  - https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/native-android-example
- React Native / Expo (BLE & Air-Gap showcase):
  - https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples/react-native-demo

## Device and transport compatibility

- USB (WebUSB): OneKey Classic / Touch / Mini Pro — works over HTTPS in desktop Chrome/Edge with a user gesture.
- BLE (iOS/Android): OneKey Touch / Mini Pro — use native BLE transports after validating USB flows.
- Air-Gap (QR devices): Use the Air-Gap signing guide instead of transports.

## Core packages

| Package                               | Purpose                                                             |
| ------------------------------------- | ------------------------------------------------------------------- |
| `@onekeyfe/hd-common-connect-sdk`     | Unified SDK surface (WebUSB, low-level adapter hooks)               |
| `@onekeyfe/hd-core`                   | Events, shared types, and core message wiring                       |
| `@onekeyfe/hd-transport-react-native` | React Native transport provider (BLE/USB integration for RN)        |
| `@onekeyfe/hd-ble-sdk`                | Pure React Native BLE stack                                         |

## Concepts and advanced topics

- PIN and Passphrase UX and flows: `explanations/hardware-sdk/pin.md`, `explanations/hardware-sdk/passphrase.md`
- Message protocol (for debugging low-level transports): `transport-recipes/common-connect-1/onekey-message-protocol.md`
- Notes:
  - The legacy "Common SDK Guide" content has been consolidated into per-platform transport guides (iOS/Android/Flutter). Use the transport recipes for up-to-date integration steps.

## Support

- Discussions: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
- Issues: https://github.com/OneKeyHQ/hardware-js-sdk/issues
- Help Center: https://help.onekey.so/hc

Work through the Quick Start, pick your transport, and keep iterating with the demos to validate permissions, UI events, and first commands end-to-end.