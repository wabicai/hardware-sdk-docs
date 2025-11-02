# Hardware Security and Advanced Capabilities

Use these articles when designing PIN/Passphrase UX and debugging low-level transports. Platform-specific integration steps now live under Transport Recipes.

- PIN: `explanations/hardware-sdk/pin.md`
- Passphrase: `explanations/hardware-sdk/passphrase.md`
- Message Protocol (64-byte framing, for low-level debugging): `transport-recipes/common-connect-1/onekey-message-protocol.md`

Notes:
- The former "Common SDK Guide" and low-level adapter materials have been consolidated into platform-specific transport guides:
  - iOS BLE (WKWebView + CoreBluetooth): `transport-recipes/common-connect-1/ios-ble.md`
  - Android BLE (WebView + JSBridge + Nordic BLE): `transport-recipes/common-connect-1/android-ble.md`
  - Flutter BLE (JS engine/WebView): `transport-recipes/common-connect-1/flutter-ble.md`
- For end-to-end event flows (PIN/Passphrase), start with Quick Start sub-guides (UI Events: PIN / Passphrase) and wire the same responses in your chosen transport.
