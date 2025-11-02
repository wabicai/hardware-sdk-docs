# Quick Start (hd-common-connect-sdk)

Use this index to learn the complete device interaction model from init to first command. Each sub-guide contains code you can paste into your app.

- Setup and Init – `quick-start/setup-and-init.md`
  - Install the SDK and initialize early; bind global UI/DEVICE events.
- Device Discovery and Features – `quick-start/device-discovery-and-features.md`
  - Authorize (WebUSB), discover devices, and obtain `device_id` via `getFeatures`.
- UI Events: PIN – `quick-start/ui-events-pin.md`
  - Handle `UI_REQUEST.REQUEST_PIN` with either on-device input or a blind keypad.
- UI Events: Passphrase – `quick-start/ui-events-passphrase.md`
  - Handle hidden wallet access with on-device or software input; caching and `useEmptyPassphrase` tips.
- First Command – `quick-start/first-command.md`
  - Run `btcGetAddress` end-to-end once identifiers are known.
- Communication Flow – `quick-start/communication-flow.md`
  - The full call lifecycle and how responses resume the original request.

Next: choose your transport for platform-specific details
- WebUSB (browser) – `transport-recipes/web-usb.md`
- iOS BLE (native) – `transport-recipes/common-connect-1/ios-ble.md`
- Android BLE (native) – `transport-recipes/common-connect-1/android-ble.md`
- React Native BLE (pure RN) – `transport-recipes/react-native-ble.md`