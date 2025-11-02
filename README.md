# Introduction

This site helps you integrate OneKey hardware wallets from prototype to production. Start with the multi-step WebUSB quick start and then branch into the transport recipe that matches your deployment target.

## Onboarding flow

* Follow the [Quick Start overview](quick-start.md) to complete the six-step WebUSB journey.
* Use the [communication matrix](./#communication-matrix) to jump to transport-specific demos and references.
* Implement business logic with the [Hardware SDK reference](hardware-sdk/).
* Deep dive into transport internals and security guidance under [Concepts & best practices](broken-reference).

## Communication matrix

<table><thead><tr><th width="128">Transport</th><th>Typical platforms</th><th>Quick start entry</th><th>Demo project</th><th>Primary docs</th><th>Notes</th></tr></thead><tbody><tr><td>WebUSB</td><td>Chrome / Edge desktop browsers</td><td></td><td></td><td></td><td>Requires a user gesture; Windows needs WinUSB drivers</td></tr><tr><td>React Native BLE</td><td>iOS / Android Natvie apps</td><td><a href="transport-recipes/react-native-ble.md">React Native recipe</a></td><td><a href="https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples">hardware-js-sdk/packages/connect-examples</a></td><td><a href="transport-recipes/react-native-ble.md">React Native BLE guide</a></td><td>Configure platform permissions; Android recommends SDK ≥ 1.1.0</td></tr><tr><td>Native BLE</td><td>React Native</td><td></td><td></td><td></td><td>Inject a low-level transport adapter and manage lifecycle threads</td></tr><tr><td>Air-GAP</td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>

## Device compatibility

* **USB transports** – OneKey Classic, OneKey Touch, and OneKey Mini Pro expose a unified USB interface and work directly with the Common Connect WebUSB flow described in the quick start.
* **Bluetooth transports** – OneKey Touch and OneKey Mini Pro ship with Bluetooth Low Energy, enabling WebBLE, React Native, and native mobile integrations once the USB path is validated.
* **Air-gapped products** – OneKey Lite and other QR-based devices require the [Air-Gap signing guide](air-gap/air-gap.md) instead of Common Connect.

## Packages

| Package                               | Description                                                          | Version                                                                                                                                                   | Source                                                                                             |
| ------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `@onekeyfe/hd-common-connect-sdk`     | Universal transport layer for WebUSB, WebBLE, and low-level adapters | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-common-connect-sdk.svg)](https://www.npmjs.com/package/@onekeyfe/hd-common-connect-sdk)         | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect)                |
| `@onekeyfe/hd-core`                   | Event constants, message formatting, and shared types                | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-core.svg)](https://www.npmjs.com/package/@onekeyfe/hd-core)                                     | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/core)                   |
| `@onekeyfe/hd-transport-react-native` | React Native bridge for BLE and USB transports                       | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-transport-react-native.svg)](https://www.npmjs.com/package/@onekeyfe/hd-transport-react-native) | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/transport-react-native) |
| `@onekeyfe/hd-ble-sdk`                | JavaScript BLE implementation for React Native and Expo              | [![npm version](https://img.shields.io/npm/v/@onekeyfe/hd-ble-sdk.svg)](https://www.npmjs.com/package/@onekeyfe/hd-ble-sdk)                               | [GitHub](https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/ble-sdk)                |

## Extended modules

* **Security & UX** – [Clear signing best practices](broken-reference), [Passphrase](explanations/hardware-sdk/passphrase.md), [PIN](explanations/hardware-sdk/pin.md)
* **Troubleshooting** – [Diagnostics playbook](broken-reference) with log collection tips and common error codes
* **Reference catalog** – [Reference index](broken-reference) for every chain, error code, and parameter schema

## Support & community

* GitHub repository: https://github.com/OneKeyHQ/app-monorepo
* Discussions: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
* Issue tracker: https://github.com/OneKeyHQ/hardware-js-sdk/issues
* Help Center: https://help.onekey.so/hc

Work through the quick start, pick the transport that matches your platform, and keep iterating with the playground to catch regressions early.\n\*\*\* End Patch
