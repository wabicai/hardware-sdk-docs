# Config Event

Once the SDK is initialized, HardwareSDK emits events for device state, UI requests, and device requests.

Reference: https://developer.onekey.so/connect-to-hardware/page-1/config-event

## Subscribe

```ts
HardwareSDK.on(event, callback);
```

- `event` — required `string`. See the list below.
- `callback` — required `function` to handle the event payload.

Typical event object:

```ts
{
  event: string;
  type: string;
  payload: any;
}
```

`event` is a high‑level channel, while `type` is the specific subtype. You can import all constants from `@onekeyfe/hd-core`.

## uiResponse

Some UI requests require a response. Use the UI Response API to send results back to the device:

- [Response UI Event](../../../hardware-sdk/basic-api/response-ui-event.md)

```ts
HardwareSDK.uiResponse({
  type: string,
  payload: any,
});
```

Common cases: request PIN, request passphrase.

## Example

```ts
import { HardwareWebSdk as HardwareSDK } from '@onekeyfe/hd-web-sdk';
import { UI_EVENT, UI_RESPONSE, UI_REQUEST, CoreMessage } from '@onekeyfe/hd-core';

HardwareSDK.on(UI_EVENT, (message: CoreMessage) => {
  // Handle PIN request
  if (message.type === UI_REQUEST.REQUEST_PIN) {
    // Option A: enter PIN on device
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
    });

    // Option B: collect PIN in your UI (pseudo)
    showPrompt((pin: string) => {
      HardwareSDK.uiResponse({
        type: UI_RESPONSE.RECEIVE_PIN,
        payload: pin,
      });
    });
  }

  // Handle passphrase request
  if (message.type === UI_REQUEST.REQUEST_PASSPHRASE) {
    // Option A: enter on device
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: { value: '', passphraseOnDevice: true },
    });

    // Option B: collect in your UI (pseudo)
    showPrompt((passphrase: string) => {
      HardwareSDK.uiResponse({
        type: UI_RESPONSE.RECEIVE_PASSPHRASE,
        payload: { value: passphrase },
      });
    });
  }

  if (message.type === UI_REQUEST.REQUEST_BUTTON) {
    // Ask user to confirm on device
  }
  if (message.type === UI_REQUEST.CLOSE_UI_WINDOW) {
    // Close any prompts; call finished
  }
});
```

## Subscribable events

- `UI_EVENT`
  - `ui-request_pin` enter PIN
  - `ui-receive_pin`
  - `ui-request_passphrase` enter passphrase
  - `ui-request_passphrase_on_device` enter on device
  - `ui-button` confirm on device
  - `ui-close_window` call finished
  - `ui-bluetooth_permission`
  - `ui-location_permission`
  - `ui-firmware-progress`
  - `ui-device_not_in_bootloader_mode`
- `UI_RESPONSE`
  - `ui-receive_pin` return PIN value
  - `ui-receive_passphrase` return passphrase value
- `DEVICE_EVENT`
  - `button`, `pin`, `support_features`, `features`
- `FIRMWARE_EVENT`
  - `firmware-release-info`, `ble-firmware-release-info`
