# Quick Start (hd-common-connect-sdk, no Bridge)

This guide takes you from an empty project to a working integration with `@onekeyfe/hd-common-connect-sdk`. You will initialize the SDK, subscribe to UI/device events, discover and identify a device, and run your first chain API (BTC address) — all without the legacy Bridge.

The same request shape applies across transports. For Quick Start, we’ll focus on Web (WebUSB). Native hosts and BLE are covered under Transport Recipes.

## Prerequisites

- Node.js and a package manager (npm / yarn / pnpm)
- For WebUSB: serve your app over HTTPS (e.g. `https://localhost` during development)
- A connected and unlocked device (PIN/Passphrase flows are handled via events)

## Install

```bash
npm i @onekeyfe/hd-common-connect-sdk
```

## Initialize and subscribe to events

Initialize the SDK as early as possible and wire UI/device events so PIN/Passphrase and confirmations work end-to-end.

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
// Optional event constants come from @onekeyfe/hd-core
// import { UI_EVENT, UI_REQUEST, UI_RESPONSE, DEVICE } from '@onekeyfe/hd-core';

export async function setupHardware() {
  await HardwareSDK.init({
    env: 'webusb',                    // Web: WebUSB. See Transport Recipes for native/BLE.
    debug: process.env.NODE_ENV !== 'production',
    fetchConfig: true,               // Recommended to get firmware capability hints
  });

  // Example: subscribe to UI events (PIN / Passphrase / confirmations)
  // See detailed patterns in:
  // - explanations/hardware-sdk/pin.md
  // - explanations/hardware-sdk/passphrase.md
  // HardwareSDK.on(UI_EVENT, (message) => { /* open dialogs, respond via HardwareSDK.uiResponse(...) */ });

  // Example: subscribe to device events
  // HardwareSDK.on(DEVICE.CONNECT,  (e) => { /* cache connectId/deviceId */ });
  // HardwareSDK.on(DEVICE.DISCONNECT, (e) => { /* cleanup / notify users */ });
}
```

## WebUSB: user authorization and discovery

WebUSB requires a user gesture to show the chooser. Trigger it from a click handler.

```tsx
export function ConnectUsbButton() {
  return (
    <button
      onClick={async () => {
        // Requires HTTPS. Add USB filters to show only OneKey devices if needed.
        // @ts-ignore WebUSB is provided by the browser
        await navigator.usb.requestDevice({ filters: [] });
        // After authorization, the SDK can enumerate the device via searchDevices
      }}
    >
      Choose and Connect (WebUSB)
    </button>
  );
}
```

Then query devices from the SDK and cache identifiers:

```ts
const search = await HardwareSDK.searchDevices();
if (search.success && search.payload.length > 0) {
  const { connectId, deviceId } = search.payload[0];
  // USB typically includes deviceId in search results.
}
```

## Read device features (obtain deviceId when needed)

Most APIs require both `connectId` and `deviceId`. For BLE you must fetch `deviceId` via `getFeatures`.

```ts
const features = await HardwareSDK.getFeatures(connectId);
if (features.success) {
  const deviceId = features.payload.device_id;
  // Persist connectId/deviceId for subsequent calls
}
```

See details in: `hardware-sdk/basic-api/get-features.md`.

## First API call: get a BTC address

Once initialized and identifiers are known, call any chain API. Example:

```ts
const res = await HardwareSDK.btcGetAddress(connectId, deviceId, {
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: false,
});

if (res.success) {
  console.log('BTC address:', res.payload.address);
} else {
  console.error('Failed:', res.payload.error, res.payload.code);
}
```

- Response/error shape: `hardware-sdk/common-params.md`, `hardware-sdk/error-code.md`
- UI events and best practices: `explanations/hardware-sdk/pin.md`, `explanations/hardware-sdk/passphrase.md`

## Where to go next

- WebUSB transport details and end-to-end flow: `transport-recipes/web-usb.md`
- Native BLE (low-level adapter) for iOS/Android: `transport-recipes/common-connect-1/README.md`
- React Native BLE: `transport-recipes/react-native-ble.md`
- Protocol packets (64-byte framing): `explanations/hardware-sdk/onekey-message-protocol.md`

Keep DevTools open while integrating to verify logs and event flows against the reference examples.