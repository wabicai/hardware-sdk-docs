# Flutter BLE (Native, low-level adapter)

For Flutter apps that load a JS bundle via WebView or a JS engine and bridge to `@onekeyfe/hd-common-connect-sdk` using a low-level adapter.

## Runtime options

- WebView: stable and broadly supported; bridge API identical to iOS/Android native shells
- JS engine: e.g. `flutter_js`, run the built JS bundle directly in Dart

## Integration steps

1. Build the JS bundle (see the `web/` directories in the native examples)
2. Load the JS bundle in Flutter (WebView or JS engine)
3. Implement a messaging bridge exposing `enumerate/connect/disconnect/send/receive` to the JS side
4. Follow the protocol: forward 64-byte BLE notification chunks, reassemble hex payloads for `receive()` on JS
5. Handle UI events: show native dialogs for PIN/Passphrase/confirmations and respond via `HardwareSDK.uiResponse`

## BLE UUIDs

- `serviceUuid = 00000001-0000-1000-8000-00805f9b34fb`
- `writeCharacteristic = 00000002-0000-1000-8000-00805f9b34fb`
- `notifyCharacteristic = 00000003-0000-1000-8000-00805f9b34fb`

## References

- Protocol framing: `./onekey-message-protocol.md`
- UI events (PIN/Passphrase): `../../quick-start/ui-events-pin.md`, `../../quick-start/ui-events-passphrase.md`
- Platform details: iOS `./ios-ble.md`, Android `./android-ble.md`

Once wired, the chain API usage is identical to WebUSB: provide `connectId` and (when required) `deviceId`.