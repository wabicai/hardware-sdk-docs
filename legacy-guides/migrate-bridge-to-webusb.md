# Migration Guide: Bridge → WebUSB (using `@onekeyfe/hd-web-sdk`)

This short guide helps you replace the legacy Bridge transport with native WebUSB, while keeping `@onekeyfe/hd-web-sdk` as your SDK entry.



---

## Requirements

- Chromium browsers (Chrome/Edge desktop)
- Node.js 18+ (LTS recommended)

---

## What changes (at a glance)

- Initialize the SDK with `env: 'webusb'` 
  - (Bridge (env: `web`) → WebUSB (env: `webusb`).)
- Update hd-web-sdk `connectSrc` to the latest iframe host version (e.g., `https://jssdk.onekey.so/1.1.16/`)
- Ask for user authorization via `navigator.usb.requestDevice()` with official OneKey filters — must be triggered by a user gesture (e.g., a button click) due to Chrome security restrictions; automatic device discovery is not allowed before permission
- Bridge‑specific checks are deprecated (e.g., `checkBridgeStatus()`)
- All other SDK usage remains the same

---

## Initialize (use hd-web-sdk and latest connectSrc)

```ts
import HdWebSdk from '@onekeyfe/hd-web-sdk';

// Same pattern as expo-example: default export → .HardwareWebSdk
const HardwareSDK = HdWebSdk.HardwareWebSdk;

await HardwareSDK.init({
  env: 'webusb',
  // hd-web-sdk uses an iframe host; keep connectSrc configured
  connectSrc: 'https://jssdk.onekey.so/1.1.16/',
  debug: true,
  fetchConfig: true,
});
```

---

## Authorize (WebUSB chooser with OneKey filter)

```ts
import { ONEKEY_WEBUSB_FILTER } from '@onekeyfe/hd-shared';

// IMPORTANT: Must be triggered by a user gesture (e.g., button click)
// Chrome security policy disallows automatic USB device discovery before permission.
await navigator.usb.requestDevice({ filters: ONEKEY_WEBUSB_FILTER });
```

---

## Discover and run your first call

```ts
// 1) Enumerate
const list = await HardwareSDK.searchDevices();
if (!list.success) throw new Error(list.payload.error);
const { connectId, deviceId } = list.payload[0] ?? {};

// 2) (Optional) Get features to resolve device_id
const features = await HardwareSDK.getFeatures(connectId);
if (!features.success) throw new Error(features.payload.error);
const resolvedDeviceId = features.payload.device_id ?? deviceId;

// 3) Example: BTC address
const r = await HardwareSDK.btcGetAddress(connectId, resolvedDeviceId, {
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: false,
});

if (r.success) {
  console.log('BTC address:', r.payload.address);
} else {
  console.error('Error:', r.payload.error, r.payload.code);
}
```

---

## Cleanup checklist

- Remove Bridge‑specific checks/CTAs (e.g., `checkBridgeStatus()`)
- Keep latest `connectSrc` in hd-web-sdk init (the iframe host)
- Feature‑detect `navigator.usb` and show a friendly notice if unsupported
- All other SDK methods and UI flows are unchanged
---
