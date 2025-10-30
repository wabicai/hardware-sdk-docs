# React Native BLE Transport

Use this guide when you need a Bluetooth workflow for React Native or other mobile runtimes built on top of `@onekeyfe/hd-common-connect-sdk`.

## Prerequisites

- Install the correct package:
  - React Native projects: `@onekeyfe/hd-ble-sdk`
  - Custom native or cross-platform shells: `@onekeyfe/hd-common-connect-sdk`
- Ensure the device firmware meets the minimum supported version.
- Gather runtime permissions:
  - Android: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, and location access at runtime.
  - iOS: Declare `NSBluetoothAlwaysUsageDescription` in `Info.plist`.
- Finish the "Hardware SDK Quickstart" so you understand device discovery and event handling.

## React Native example

```bash
npm install --save @onekeyfe/hd-ble-sdk
```

```typescript
import { HardwareBleSdk as HardwareSDK } from '@onekeyfe/hd-ble-sdk';
import { UI_EVENT, UI_REQUEST } from '@onekeyfe/hd-core';

HardwareSDK.init({
  debug: __DEV__,
  fetchConfig: true,
});

HardwareSDK.on(UI_EVENT, message => {
  if (message.type === UI_REQUEST.REQUEST_PIN) {
    // Display your PIN entry UI or instruct the user to enter it on the device.
  }
});
```

### Scanning and connecting

```typescript
const scan = await HardwareSDK.searchDevices();
if (scan.success && scan.payload.length > 0) {
  const device = scan.payload[0];
  await HardwareSDK.connect(device.connectId);
}
```

- Pause scanning when the app goes into the background to satisfy app-store policies.
- Reconnect automatically by listening for `DEVICE_EVENT` with type `disconnect`.

## Common Connect (native or cross-platform)

When you rely on `@onekeyfe/hd-common-connect-sdk`, implement a BLE-aware low-level plugin:

```typescript
HardwareSDK.init({ env: 'lowlevel', debug: true }, undefined, createBlePlugin());
```

Your plugin should provide:

- `enumerate` - return nearby devices with `connectId` and metadata.
- `connect` / `disconnect` - handle lifecycle and timeouts.
- `send` / `receive` - manage packet chunking and reassembly.
- `init` - configure permissions and start the Bluetooth stack.

See "Common Connect Quickstart" and "Low-level Transport Plugin" for full implementations.

## Debugging checklist

1. **Firmware prompts** - Subscribe to `FIRMWARE_EVENT` (`firmware-release-info`) and surface upgrades to the user.
2. **Bluetooth state** - On Android monitor `BluetoothAdapter.ACTION_STATE_CHANGED`; on iOS use `CBCentralManagerDelegate`.
3. **Security messaging** - Combine this guide with "Clear Signing Best Practices" so end users always see the transaction context while confirming on the device.

Once BLE connectivity is stable, continue with the chain-specific APIs in the References section to implement signing operations.