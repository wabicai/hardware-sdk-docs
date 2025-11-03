# Quick Start (Web, hd-common-connect-sdk)

This page gives a concise mental model for integrating OneKey hardware in the browser: initialize the SDK, discover devices, handle UI prompts, and make your first call. Code details live in the sub‑pages.

Scope: Web (browser) using WebUSB with `@onekeyfe/hd-common-connect-sdk`.

1. Setup & Init — Install the SDK, initialize early, and enable debug when needed.
2. Discover Devices — Authorize (WebUSB), enumerate with `searchDevices`, understand identifiers (`connectId`, `device_id`), and resolve `device_id` via `getFeatures`.
3. PIN — Listen for `UI_EVENT` and answer `REQUEST_PIN` via `uiResponse` (prefer on‑device entry).
4. Passphrase — Handle hidden wallet passphrase (on‑device or software entry, optional session caching).
5. First Command — Call a chain API (e.g., `btcGetAddress`) using `connectId` + `device_id`.

Next: choose a transport for your platform
- WebUSB (browser) → [WebUSB Connection Guide](transport-recipes/web-usb.md)
- iOS BLE (native) → [iOS BLE](transport-recipes/common-connect-1/ios-ble.md)
- Android BLE (native) → [Android BLE](transport-recipes/common-connect-1/android-ble.md)
- React Native BLE (pure RN) → [React Native BLE](transport-recipes/react-native-ble.md)
