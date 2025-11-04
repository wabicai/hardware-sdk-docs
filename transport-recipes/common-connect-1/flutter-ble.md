# Flutter: Connect via Bluetooth (Native)

For Flutter apps that load a JS bundle via WebView or a JS engine and bridge to `@onekeyfe/hd-common-connect-sdk` using a low-level adapter.

## Step 1. Choose a runtime

- WebView: stable and broadly supported; bridge API identical to iOS/Android native shells
- JS engine: e.g. `flutter_js`, run the built JS bundle directly in Dart

## Step 2. Build the JS bundle

Build in the native examples under the hardware-js-sdk repository (see `web/` directories) and produce `web_dist/` assets.

## Step 3. Load the JS bundle

Load the `web_dist/` assets in Flutter (either via WebView or a JS engine).

## Step 4. Implement the messaging bridge

Expose `enumerate/connect/disconnect/send/receive` from native to JS, keeping the same signatures. Forward 64‑byte BLE notification chunks and reassemble hex payloads for `receive()` on JS.

## Step 5. Handle UI events

Show native dialogs for PIN/Passphrase/confirmations and respond via `HardwareSDK.uiResponse`.

## BLE UUIDs

- `serviceUuid = 00000001-0000-1000-8000-00805f9b34fb`
- `writeCharacteristic = 00000002-0000-1000-8000-00805f9b34fb`
- `notifyCharacteristic = 00000003-0000-1000-8000-00805f9b34fb`

## References

- Protocol framing: [OneKey Message Protocol](./onekey-message-protocol.md)
- UI events: [Config Event](../../hardware-sdk/config-event.md), [PIN](../../quick-start/ui-events-pin.md), [Passphrase](../../quick-start/ui-events-passphrase.md)
- Platform details: [iOS BLE](./ios-ble.md), [Android BLE](./android-ble.md)

Once wired, the chain API usage is identical to WebUSB: provide `connectId` and (when required) `deviceId`. 
