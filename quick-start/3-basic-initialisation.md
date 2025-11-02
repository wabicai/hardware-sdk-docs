# Step 3 · Wire the Basic Initialisation

Before connecting to a device, set up the Common Connect SDK inside your project along with minimal UI for status logging.

## 3.1 Create an initialisation module

Inside `src/lib/hardware.ts`, export a helper similar to the snippet below:

```typescript
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
import { UI_EVENT, UI_REQUEST, CoreMessage } from '@onekeyfe/hd-core';

let initialised = false;

export async function ensureSDK() {
  if (initialised) return;

  await HardwareSDK.init({
    env: 'webusb',
    debug: import.meta.env.VITE_ONEKEY_DEBUG === 'true',
    fetchConfig: true,
  });

  HardwareSDK.on(UI_EVENT, (message: CoreMessage) => {
    switch (message.type) {
      case UI_REQUEST.REQUEST_PIN:
        console.info('[OneKey] PIN requested');
        break;
      case UI_REQUEST.REQUEST_PASSPHRASE:
        console.info('[OneKey] Passphrase requested');
        break;
      case UI_REQUEST.REQUEST_BUTTON:
        console.info('[OneKey] Confirm action on the device');
        break;
      case UI_REQUEST.CLOSE_UI_WINDOW:
        console.info('[OneKey] Close UI window');
        break;
      default:
        break;
    }
  });

  initialised = true;
}
```

## 3.2 Hook the helper into your app

Call `ensureSDK()` when your root component mounts. If you prefer manual control, invoke it inside the handler that will search for devices.

```typescript
useEffect(() => {
  ensureSDK().catch(error => {
    console.error('Failed to initialise Hardware SDK', error);
  });
}, []);
```

Ensure that developer tools are open so you can observe the log output. Proceed to [Step 4](4-connect-device.md) to request WebUSB authorisation and store the identifiers needed for later API calls.
