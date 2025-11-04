# Native Bluetooth (low-level adapter and protocol)

On iOS/Android/Flutter native hosts, we recommend using the `lowlevel` adapter of `@onekeyfe/hd-common-connect-sdk` so you can reuse the exact same SDK API as the Web path. JS stays identical; only the transport adapter forwards calls to the native layer for BLE/USB I/O.

## Adapter contract (JS ↔ Native)

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

type LowLevelAdapter = {
  enumerate: () => Promise<Array<{ id: string; name: string }>>; // scan and return device list
  connect: (id: string) => Promise<void>;                         // open connection and set up listeners
  disconnect: (id: string) => Promise<void>;                      // close connection and cleanup
  send: (id: string, data: string) => Promise<void>;              // send hex-encoded payload
  receive: () => Promise<string>;                                 // receive one frame (hex); JS reassembles full message
  init?: () => Promise<void>;                                     // optional adapter init
  version: string;
};

const adapter: LowLevelAdapter = { /* ... */ };
await HardwareSDK.init({ env: 'lowlevel', debug: true, fetchConfig: true }, undefined, adapter);
```

- JS assembles/disassembles 64-byte frames (see Protocol).
- The `id` returned from `enumerate` is used by `connect/send/disconnect` as the connection key.

## Protocol (must read)

- Transport uses 64-byte packets: [OneKey Message Protocol](./onekey-message-protocol.md)
- Default BLE UUIDs (filter and bind):
  - `serviceUuid`: `00000001-0000-1000-8000-00805f9b34fb`
  - `writeCharacteristic`: `00000002-0000-1000-8000-00805f9b34fb`
  - `notifyCharacteristic`: `00000003-0000-1000-8000-00805f9b34fb`

## Platform notes

### iOS (CoreBluetooth + WKWebView)
- Initialize the bridge (e.g., `WKWebViewJavascriptBridge`) before loading `index.html`.
- Register `enumerate/connect/send/monitorCharacteristic` handlers.
- Filter scans by `serviceUuid`; cache `CBPeripheral` and characteristics after connect.
- Forward 64-byte notifications to JS as hex; JS reassembles full payload for `receive()`.
- Present PIN/confirmation prompts via native UI and respond with `HardwareSDK.uiResponse`.

### Android (WebView + Nordic BLE)
- Use `com.smallbuer:jsbridge` for the messaging bridge; JS Engine is optional on newer systems.
- Request `BLUETOOTH_SCAN/BLUETOOTH_CONNECT` and location permissions on Android 12+.
- Filter scans by `serviceUuid`; persist `Gatt` and map `connect/disconnect/send`.
- Buffer notification chunks then forward to JS receiver.
- Optional USB support: filter by a whitelist in `enumerate`.

### Flutter
- Choose `flutter_js` or WebView; reuse the same bridge + framing logic.
- Follow the demo bundling process for web assets.

Working examples (this documentation):
- iOS: [iOS — Connect via Bluetooth](./ios-ble.md)
- Android: [Android — Connect via Bluetooth](./android-ble.md)
- React Native (BLE): [React Native BLE](../react-native-ble.md)
  - and [Config Event](../../hardware-sdk/config-event.md)


## Shared tips

- Subscribe to `UI_EVENT` early so PIN/Passphrase/confirmation flows are not missed.
- After the first connection, call `getFeatures(connectId)` and persist `device_id`.
