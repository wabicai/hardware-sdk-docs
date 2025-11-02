# Common Connect (USB/BLE)

`@onekeyfe/hd-common-connect-sdk` powers WebUSB in the browser and the low-level adapter used by native shells. Think of it as the universal transport surface for USB and BLE. Use this page to wire the transport before you call any chain-specific APIs.

## SDK initialization

```typescript
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

await HardwareSDK.init({
  env: 'webusb',                     // use 'webusb', 'webble', 'lowlevel', etc.
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
});
```

The setup mirrors [Quick Start · Step 3](../quick-start/3-basic-initialisation.md). Centralise the helper (for example in `src/lib/hardware.ts`) so it can be shared between the browser quick start and native shells.

Switch transports at runtime when needed:

```typescript
await HardwareSDK.switchTransport('webusb');
await HardwareSDK.switchTransport('webble');
```

For native shells, pass a low-level adapter as the third argument—see the "Native hosts" section below.

## WebUSB in browsers

1. **User gesture requirement** – Call `navigator.usb.requestDevice` directly inside the click handler that opens the chooser.

```tsx
<Button
  onClick={async () => {
    const device = await navigator.usb.requestDevice({ filters: ONEKEY_WEBUSB_FILTER });
    await HardwareSDK.switchTransport('webusb');
  }}
>
  Select Device
</Button>
```

2. **Example** – Review `hardware-js-sdk/packages/connect-examples/expo-playground`. `WebUsbAuthorizeDialog.tsx` implements the chooser modal, retry prompts, and device filtering. Replicate that component when wiring WebUSB into your own UI.
3. **Hosting** – Serve the application over HTTPS; WebUSB is blocked on insecure origins.
## Native hosts (iOS / Android)

When running in a WebView or JavaScriptCore, provide a low-level adapter that forwards transport calls to native code.

### Adapter contract

```typescript
const adapter = {
  enumerate: () => Promise<LowLevelDevice[]>,
  connect: (id: string) => Promise<void>,
  disconnect: (id: string) => Promise<void>,
  send: (id: string, data: string) => Promise<void>,
  receive: () => Promise<string>,
  init: () => Promise<void>,
  version: 'OneKey-1.0',
};

await HardwareSDK.init({ env: 'lowlevel', debug: true, fetchConfig: true }, undefined, adapter);
```

### iOS example (`hardware-js-sdk/packages/connect-examples/native-ios-example`)

- Bundled under `hardware-js-sdk/packages/connect-examples/native-ios-example`.
- Registers WebKit message handlers (via `WKWebViewJavascriptBridge`) such as `enumerate`, `connect`, `send`, and `monitorCharacteristic`.
- BLE notifications arrive in 64-byte packets; `monitorCharacteristic` buffers them until a full payload is assembled, then resolves the deferred promise created in `receive`.
- PIN and confirmation prompts call native handlers (`requestPinInput`, `requestButtonConfirmation`, `closeUIWindow`). Implement these before loading the WebView bundle.
- Rebuild the JavaScript assets (`yarn && yarn build` inside `web/`) whenever you modify the messaging layer.

### Android example (`hardware-js-sdk/packages/connect-examples/native-android-example`)

- Located at `hardware-js-sdk/packages/connect-examples/native-android-example`.
- Uses SmallBuer message handlers (`WebViewJavascriptBridge`) to expose identical functions from `MainActivity.kt`.
- BLE scanning relies on Nordic’s library; request `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, and location permissions on Android 12+ before scanning.
- USB enumeration filters VID/PID via `UsbManager` so only OneKey devices appear in the chooser.
- Notifications are buffered just like the iOS demo to satisfy the SDK’s packet expectations.

## Shared tips

- Persist `connectId` and `deviceId` between calls (see the [Quick Start](../quick-start.md) for the sample flow).
- Subscribe to `UI_EVENT` immediately after initialization so PIN, passphrase, and button prompts surface correctly.
- Combine Common Connect with the guidance in [Clear Signing Best Practices](../explanations/security/clear-signing.md) to align UI prompts with the hardware display.

With the transport established, continue using the same API calls documented in the [Hardware SDK Reference](../references/hardware-sdk/README.md).
