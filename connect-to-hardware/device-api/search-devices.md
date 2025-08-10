# Search Devices

## Overview

Searches for connected devices and returns the search results to the developer as an array. \
\
In the case of USB connections, the returned data already contains device details. \
\
In the case of Bluetooth device search, the data returned contains only the device name and device connectId, and the developer selects the device that needs to be paired before getting the device information.

```typescript
// 1) Ask for WebUSB permission inside a user gesture
await window?.navigator?.usb?.requestDevice({ filters: ONEKEY_WEBUSB_FILTER });

// 2) Then query devices via SDK
const response = await HardwareSDK.searchDevice();
```

### Parameters

None

### Example (WebUSB flow)

```typescript
import HardwareSDK from '@onekeyfe/hd-web-sdk';
import { ONEKEY_WEBUSB_FILTER } from '@onekeyfe/hd-shared';

const button = document.getElementById('connect');
button?.addEventListener('click', async () => {
  try {
    await window?.navigator?.usb?.requestDevice({ filters: ONEKEY_WEBUSB_FILTER });
    const result = await HardwareSDK.searchDevice();
    if (result.success) console.log('device list:', result.payload);
  } catch (e) {
    console.error('Permission/search error:', e);
  }
});
```

Result

```typescript
{
    success: true,
    payload: [
        {
            "connectId": string, // device connection id
            "uuid": string, // device unique id 
            "deviceType": string, // device id, this id may change with device erasure, only returned when using the @onekeyfe/hd-web-sdk library.
            "deviceId": string, // device type, 'classic' | 'mini' | 'touch' | 'pro'
            "path": string, // Advanced SDKs only; Web SDK uses WebUSB and does not expose a bridge path
            "name": string, // bluetooth name for the device
        },
    ]
}
```

Error

```typescript
{
    success: false,
    payload: {
        error: string, // error message
        code: number // error code
    }
}
```

