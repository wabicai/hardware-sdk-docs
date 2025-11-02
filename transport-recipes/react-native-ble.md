# React Native BLE

Use this recipe when your React Native or Expo application needs to talk to OneKey hardware over Bluetooth. The flow mirrors the native demos bundled in `hardware-js-sdk` and builds on the same Common Connect surface (`env: 'lowlevel'`) so the rest of your code can stay identical to the browser/WebUSB path.

## Demo projects to copy

* `hardware-js-sdk/packages/connect-examples/native-android-example` – Kotlin WebView container with Nordic BLE stack.
* `hardware-js-sdk/packages/connect-examples/native-ios-example` – Swift WebView container backed by CoreBluetooth.
* `hardware-js-sdk/packages/connect-examples/react-native-demo` – Expo project that exercises BLE, Air-Gap, and deep-link flows side by side.

Run each project once to verify permissions, message wiring, and UI prompts before writing your own glue code.

## JavaScript bundle

Both native examples reuse the same JavaScript transport bundle located under their `web/` directories. Key points:

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

await HardwareSDK.init(
  { env: 'lowlevel', debug: __DEV__, fetchConfig: true },
  undefined,
  createLowlevelPlugin(),
);
```

`createLowlevelPlugin()` forwards `enumerate`, `connect`, `disconnect`, `send`, and `receive` to the host platform. Review `hardware-js-sdk/packages/connect-examples/native-android-example/web/index.js` for the canonical implementation, including the packet buffering logic for 64-byte BLE frames.

Whenever you tweak the bundle:

```bash
cd hardware-js-sdk/packages/connect-examples/native-android-example/web
yarn
yarn build        # emits web_dist/ for Android and iOS containers
```

Copy the generated `web_dist/` assets into your application (Android `app/src/main/assets`, iOS application bundle, or your own WebView loader).

## Android checklist

Reference `hardware-js-sdk/packages/connect-examples/native-android-example/app/src/main/java/com/onekey/hardware/hardwareexample/MainActivity.kt`.

* **Permissions** – Request `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, and `ACCESS_FINE_LOCATION` on Android 12+. Call `checkBluetoothPermissions()` before scanning so the JS layer receives predictable results.
* **Scanning** – Use Nordic’s `BleScanner` with a service filter `00000001-0000-1000-8000-00805f9b34fb` to reduce noise. The demo debounces results via `BleScanResultAggregator` and returns `{ id, name }` pairs back to JS.
* **Connection** – Persist the `ClientBleGatt` instance and expose `connect`, `disconnect`, and `send` handlers through `BridgeWebView`. The JS side handles request routing based on `connectId`.
* **Notifications** – Forward 64-byte packets through the `monitorCharacteristic` handler. The web bundle reassembles multi-chunk payloads before resolving the pending `receive()` promise.
* **UI prompts** – Implement `requestPinInput`, `requestButtonConfirmation`, and `closeUIWindow` so PIN, passphrase, and confirmation messages surface in native UI instead of staying silent.
* **USB fallback** – The same adapter supports WebUSB when you expose `enumerate` with an optional `{ transport: 'usb' }` parameter. See the whitelist in `MainActivity.kt` for accepted VID/PID pairs.

## iOS checklist

Reference `hardware-js-sdk/packages/connect-examples/native-ios-example/native-ios-example/ViewController.swift`.

* **CoreBluetooth** – Use `CBCentralManager` to scan for the service UUID `00000001-0000-1000-8000-00805f9b34fb`. Cache `CBPeripheral`, write (`00000002-…`) and notify (`00000003-…`) characteristics after connecting.
* **WebView messaging** – Initialise `WKWebViewJavascriptBridge` before loading `index.html` so handlers (`enumerate`, `connect`, `send`, `monitorCharacteristic`) are registered in time.
* **Notifications** – Accumulate `Data` fragments until you have an entire payload, then convert to hex and pass it to the JS handler. The helper `readDataInChunks` in the demo shows the pattern.
* **User prompts** – Surface PIN/passphrase/button requests via native alert controllers. Map JS callbacks to the appropriate UI actions and call `SDK.uiResponse` once the user acts.
* **State restore** – Persist the last successful `connectId` to reconnect automatically when the peripheral is available again (see `loadLastConnectedDevice()` in the sample).

## Using `@onekeyfe/hd-ble-sdk` directly

If you prefer a pure React Native stack without embedding a WebView, import `@onekeyfe/hd-ble-sdk` alongside `@onekeyfe/hd-transport-react-native` and reuse the same event wiring from the Quick Start. The Expo demo under `react-native-demo/src/features` shows how to hydrate transports in a JavaScript-only environment after polyfilling `Buffer`, `process`, and crypto primitives.

Core steps:

1. `npm install @onekeyfe/hd-ble-sdk @onekeyfe/hd-transport-react-native`.
2. Initialise the transport: `await HardwareSDK.init({ env: 'webble', fetchConfig: true });`.
3. Call `HardwareSDK.switchTransport('webble')` after the user opts into BLE, then follow the standard device search / getFeatures flow.

Use the same UI event subscriptions as the browser path so PIN and confirmation prompts remain consistent across platforms.

## Testing workflow

1. Launch the Expo playground (`hardware-js-sdk/packages/connect-examples/expo-playground`) to validate that firmware, emulator, and Common Connect behave as expected.
2. Run the Android and iOS native examples on physical devices to confirm permissions, Bluetooth stability, and UI hooks.
3. Bring the validated adapter into your production app, keeping the JavaScript bundle and native handlers in sync.

Once BLE transport is stable, continue with the [Hardware SDK API Navigation](../hardware-sdk/) for chain-specific commands or jump to the [Air-Gap overview](../air-gap/air-gap.md) for offline scenarios.
