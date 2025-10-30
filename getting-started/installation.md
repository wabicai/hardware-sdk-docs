# Environment Setup and Initialization

After selecting a transport (see "Connection Options Overview"), install the appropriate SDK and initialize it for your platform.

## Device transport matrix

| Device model | USB | BLE | Notes |
| --- | --- | --- | --- |
| OneKey Classic | Yes | Yes | |
| OneKey Classic 1s | Yes | Yes | |
| OneKey Mini | Yes | No | |
| OneKey Touch | Yes | Yes | |
| OneKey Pro | Yes | Yes | |

## Platform to SDK mapping

| Platform | USB transport | BLE transport | Package |
| --- | --- | --- | --- |
| Web (desktop browsers) | WebUSB | - | `@onekeyfe/hd-web-sdk` |
| React Native (iOS/Android) | - | React Native BLE | `@onekeyfe/hd-ble-sdk` |
| Android, iOS, Flutter, Electron | Common Connect USB | Common Connect BLE | `@onekeyfe/hd-common-connect-sdk` |

## Installation snippets

### Web (WebUSB)

```bash
npm install --save @onekeyfe/hd-web-sdk
```

```typescript
import { HardwareWebSdk as HardwareSDK } from '@onekeyfe/hd-web-sdk';

HardwareSDK.init({
  env: 'webusb',
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
});
```

### React Native (BLE)

```bash
npm install --save @onekeyfe/hd-ble-sdk
```

```typescript
import { HardwareBleSdk as HardwareSDK } from '@onekeyfe/hd-ble-sdk';

HardwareSDK.init({
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
});
```

### Native wrappers and cross-platform shells (Common Connect)

```bash
npm install --save @onekeyfe/hd-common-connect-sdk
```

```typescript
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
import { createPlugin } from './lowlevel-plugin';

HardwareSDK.init({
  env: 'lowlevel',
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
}, undefined, createPlugin());
```

Refer to "Common Connect Quickstart" and "Low-level Transport Plugin" for examples of `createPlugin` implementations.

## Next steps

- Proceed to "Hardware SDK Quickstart" to run your first signing command.
- Review "Device Events and UI Interaction" to capture the event-handling boilerplate.
- Visit the Advanced section when you need platform-specific transports such as React Native BLE or QR-code signing.

Appendix: The transport compatibility table above is mirrored in the References section for quick lookup during testing.