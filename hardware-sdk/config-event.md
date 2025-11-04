# Config Event

After initialization, the SDK emits events for UI requests, device state, and firmware information. You can subscribe on high‑level channels (for full `CoreMessage`) or directly on specific event types (to receive payload only).

## Subscribe

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
import {
  UI_EVENT,
  UI_REQUEST,
  UI_RESPONSE,
  DEVICE_EVENT,
  DEVICE,
  FIRMWARE_EVENT,
  CoreMessage,
} from '@onekeyfe/hd-core';

// High-level subscription: get CoreMessage { event, type, payload }
HardwareSDK.on(UI_EVENT, (message: CoreMessage) => {
  if (message.type === UI_REQUEST.REQUEST_PIN) {
    // show your PIN UI or guide user to input on device
  }
});

// Shortcut subscription: listen to a specific type and get payload directly
HardwareSDK.on(UI_REQUEST.REQUEST_PIN, payload => {
  // payload.device, payload.type (PinMatrixRequestType), etc.
});

// Device events
HardwareSDK.on(DEVICE_EVENT, (message: CoreMessage) => {
  if (message.type === DEVICE.CONNECT) {
    // device connected
  }
});
// Shortcut for selected device types (payload only)
HardwareSDK.on(DEVICE.CONNECT, payload => {
  // { device }
});
```

High‑level message shape:

```ts
type CoreMessage = {
  event: string; // e.g., 'UI_EVENT'
  type: string;  // e.g., 'ui-request_pin'
  payload: any;
};
```

## Respond to UI requests

Some UI requests require a response from your app. Use `uiResponse`:

- See: [Response UI Event](basic-api/response-ui-event.md)

```ts
// Provide PIN from your UI (or instruct input on device)
HardwareSDK.uiResponse({ type: UI_RESPONSE.RECEIVE_PIN, payload: '1234' });

// Provide passphrase (enter on device with passphraseOnDevice = true)
HardwareSDK.uiResponse({
  type: UI_RESPONSE.RECEIVE_PASSPHRASE,
  payload: { value: '', passphraseOnDevice: true },
});

// Select a device shown by the browser’s WebUSB bootloader picker
HardwareSDK.uiResponse({
  type: UI_RESPONSE.SELECT_DEVICE_IN_BOOTLOADER_FOR_WEB_DEVICE,
  payload: { deviceId: 'bootloader-device-id' },
});
```

## UI_EVENT types (UI_REQUEST)

- PIN & confirmation
  - `ui-request_pin`, `ui-invalid_pin`, `ui-button`, `ui-close_pin_window`
- Passphrase
  - `ui-request_passphrase`, `ui-request_passphrase_on_device`
- Bootloader (WebUSB)
  - `ui-request_select_device_in_bootloader_for_web_device`
- Permissions & platform state
  - `ui-bluetooth_permission`, `ui-bluetooth_unsupported`, `ui-bluetooth_powered_off`
  - `ui-location_permission`, `ui-location_service_permission`
  - `ui-bluetooth_characteristic_notify_change_failure`
- Firmware & progress
  - `ui-firmware-processing`, `ui-firmware-progress`, `ui-firmware-tip`
  - `ui-device_progress`, `ui-previous_address_result`
- Device mode & status
  - `ui-device_bootloader_mode`, `ui-device_not_in_bootloader_mode`, `ui-device_require_mode`
  - `ui-device_not_initialized`, `ui-device_seedless`
  - `ui-device_firmware_old`, `ui-device_firmware_unsupported`, `ui-device_firmware_not_compatible`, `ui-device_firmware_not_installed`
  - `ui-device_please_use_onekey_device`
- General
  - `ui-close_window`, `ui-web_device_prompt_access_permission`

## UI_RESPONSE types

- `ui-receive_pin`
- `ui-receive_passphrase`
- `ui-receive_select-device-in-bootloader-for-web-device`

## DEVICE_EVENT types

- Device lifecycle
  - `device-connect`, `device-connect_unacquired`, `device-disconnect`, `device-changed`
  - `device-acquire`, `device-release`, `device-acquired`, `device-released`, `device-used_elsewhere`, `unreadable-device`, `device-loading`
- Device requests & info
  - `button`, `pin`, `passphrase`, `passphrase_on_device`, `word`
  - `support_features`, `select_device_in_bootloader_for_web_device`, `features`

Note: `device-connect`, `device-disconnect`, `features`, `support_features` also expose payload‑only shortcuts via `HardwareSDK.on(<type>, cb)`.

## FIRMWARE_EVENT types

- `firmware-release-info`
- `ble-firmware-release-info`
