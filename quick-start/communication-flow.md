# Communication Flow

This section summarizes the end-to-end flow for a protected call (e.g. `btcGetAddress`).

1) Initialize and bind events
- Call `HardwareSDK.init({ env, debug, fetchConfig: true })` as early as possible.
- Bind `UI_EVENT` and `DEVICE.CONNECT/DISCONNECT` globally.

2) Discover and identify
- WebUSB: authorize via chooser (official filter), then `searchDevices()` returns `{ connectId, deviceId, ... }`.
- BLE: `searchDevices()` returns `{ connectId, name }`, then `getFeatures(connectId)` returns `device_id`.

3) Handle UI prompts (reactive)
- PIN: SDK emits `UI_REQUEST.REQUEST_PIN` → respond with `@@ONEKEY_INPUT_PIN_IN_DEVICE` or a blind-keypad transformed PIN.
- Passphrase: SDK emits `UI_REQUEST.REQUEST_PASSPHRASE` → respond with on-device or software value; optionally `save`.

4) Call and resume
- The original API resumes automatically once the UI response is accepted by the device.
- For standard wallet access regardless of device settings, pass `useEmptyPassphrase: true` in the method params.

5) Persist identifiers
- Cache `connectId` and `device_id` for subsequent calls.
- Consider persisting last-good device metadata for UX (auto-select, recent list, etc.).

6) Transport specifics
- Browser: see `transport-recipes/web-usb.md`.
- iOS/Android native: see `transport-recipes/common-connect-1/ios-ble.md`, `transport-recipes/common-connect-1/android-ble.md`.
- React Native BLE: see `transport-recipes/react-native-ble.md`.

Keep DevTools or native logs open to trace UI events and responses during development.