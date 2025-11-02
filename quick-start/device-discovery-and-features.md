# Device Discovery and Features

Discover devices and retrieve their identifiers. Most API calls require both `connectId` and `device_id`.

## WebUSB authorization (browser only)

Use the official filter so the chooser displays OneKey devices only.

```ts
import { ONEKEY_WEBUSB_FILTER } from '@onekeyfe/hd-shared';

export async function authorizeUsb() {
  // @ts-ignore WebUSB is a browser API
  await navigator.usb.requestDevice({ filters: ONEKEY_WEBUSB_FILTER });
}
```

## Enumerate devices

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

export async function search() {
  const result = await HardwareSDK.searchDevices();
  if (!result.success) throw new Error(result.payload.error);
  return result.payload; // [{ connectId, deviceId?, name, deviceType, ... }]
}
```

- WebUSB results typically include `deviceId`.
- BLE results include `connectId` and `name`, then you call `getFeatures` to obtain `device_id`.

## Get features (resolve device_id)

```ts
export async function getDeviceId(connectId: string) {
  const features = await HardwareSDK.getFeatures(connectId);
  if (!features.success) throw new Error(features.payload.error);
  return features.payload.device_id;
}
```

Persist `connectId` and `device_id` for subsequent calls.