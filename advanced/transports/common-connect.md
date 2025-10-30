# Common Connect Transport Guide

`@onekeyfe/hd-common-connect-sdk` lets you reuse the same USB/BLE code across native applications, Electron, and cross-platform frameworks. Compared with building separate WebUSB or BLE wrappers, Common Connect offers:

- A unified API for both USB and Bluetooth transports.
- A hook point for custom drivers or additional security checks.
- Seamless collaboration with other fallback mechanisms such as QR-code signing.

## Quick validation steps

1. Install dependencies:
   ```bash
   npm install --save @onekeyfe/hd-common-connect-sdk
   npm install --save @noble/hashes ripple-keypairs
   ```
2. Implement a low-level plugin and initialize:
   ```typescript
   import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
   import { createBridgePlugin } from './bridge-plugin';

   HardwareSDK.init({
     env: 'lowlevel',
     debug: process.env.NODE_ENV !== 'production',
     fetchConfig: true,
   }, undefined, createBridgePlugin());
   ```
3. Bridge to native APIs - `createBridgePlugin` should connect to your platform's USB/BLE stack and forward hex-encoded payloads back to JavaScript. See "Low-level Transport Plugin" for the contract.
4. Reuse the event model from "Device Events and UI Interaction" so PIN, passphrase, and confirmation prompts behave consistently.

## Example scenarios

| Scenario | Recommendation | Notes |
| --- | --- | --- |
| Electron desktop apps | Common Connect + native module | Use a Node addon to reach USB while keeping the business code identical to WebUSB. |
| Native Android or iOS | Common Connect + JS bridge | Run the SDK inside WebView/JSCore; native code only handles transport. |
| Flutter | Common Connect + platform channel | Flutter renders UI while the platform channel relays messages to native code. |
| Redundant transports (USB + BLE + QR) | Common Connect + Air Gap | Make Common Connect the primary path and add QR-code signing for offline fallback. |

## Debugging tips

- Enable `debug: true` and log raw packets on the native side to diagnose chunking issues.
- Persist `connectId` and `deviceId` exactly as described in "Hardware SDK Quickstart".
- Apply "Clear Signing Best Practices" so the UI reflects what the hardware shows.

Once the transport bridge is stable, call the same APIs documented in the References section-`btcGetAddress`, `evmSignTransaction`, and others work without modification.