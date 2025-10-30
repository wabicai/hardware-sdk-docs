# Device Events and UI Interaction

After initialization the SDK emits events that describe device status and UI requests. Subscribe to them before issuing any command that might require user attention.

## Subscribe to events

```typescript
HardwareSDK.on(eventName, callback);
```

- `eventName`: The name of the channel (`UI_EVENT`, `DEVICE_EVENT`, `FIRMWARE_EVENT`).
- `callback`: Receives an object containing `event`, `type`, and `payload`.

Example structure:

```typescript
{
  event: string;
  type: string;
  payload: unknown;
}
```

Use `type` to distinguish the exact request and respond appropriately.

## Responding to UI requests

Certain events expect a follow-up call to `HardwareSDK.uiResponse()`.

```typescript
HardwareSDK.uiResponse({
  type: UI_RESPONSE.RECEIVE_PIN,
  payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
});
```

Typical flow:

1. Receive `UI_REQUEST.REQUEST_PIN` or `UI_REQUEST.REQUEST_PASSPHRASE`.
2. Show guidance in your UI (e.g., prompt the user to enter the value on the device or in your app).
3. Call `HardwareSDK.uiResponse()` with the selected input strategy.

## Practical example

```typescript
import { HardwareWebSdk as HardwareSDK } from '@onekeyfe/hd-web-sdk';
import { UI_EVENT, UI_REQUEST, UI_RESPONSE, CoreMessage } from '@onekeyfe/hd-core';

HardwareSDK.on(UI_EVENT, (message: CoreMessage) => {
  if (message.type === UI_REQUEST.REQUEST_PIN) {
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
    });
  }

  if (message.type === UI_REQUEST.REQUEST_PASSPHRASE) {
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: {
        value: '',
        passphraseOnDevice: true,
        save: false,
      },
    });
  }

  if (message.type === UI_REQUEST.REQUEST_BUTTON) {
    // Update the application UI to inform the user that the device requires confirmation.
  }

  if (message.type === UI_REQUEST.CLOSE_UI_WINDOW) {
    // Dismiss any modal or overlay that was displayed while waiting for the device.
  }
});
```

## Event catalog

- `UI_EVENT`
  - `ui-request_pin`
  - `ui-receive_pin`
  - `ui-request_passphrase`
  - `ui-request_passphrase_on_device`
  - `ui-button`
  - `ui-close_window`
  - `ui-bluetooth_permission`
  - `ui-location_permission`
  - `ui-firmware-progress`
  - `ui-device_not_in_bootloader_mode`
- `UI_RESPONSE`
  - `ui-receive_pin`
  - `ui-receive_passphrase`
- `DEVICE_EVENT`
  - `button`
  - `pin`
  - `support_features`
  - `features`
- `FIRMWARE_EVENT`
  - `firmware-release-info`
  - `ble-firmware-release-info`

Keep this cheat sheet nearby while you wire up the UI so that every device request has a predictable UX response.