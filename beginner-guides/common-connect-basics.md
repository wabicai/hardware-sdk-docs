# Common Connect Quickstart

`@onekeyfe/hd-common-connect-sdk` is the shared transport core that powers both USB and BLE communication. Choose it when you need a single runtime that serves multiple platforms (React Native, native mobile, Electron, Flutter) or when you plan to build custom low-level adapters.

## When to Choose Common Connect

- **Multi-platform delivery**: You want identical signing logic across React Native, Flutter, and desktop applications.
- **Custom transport requirements**: You must integrate with proprietary drivers or implement offline fallback channels.
- **Layered security**: You intend to combine standard transports with QR-code flows for contingency use.

## Integration Checklist

1. **Provision a JavaScript runtime** - Use WebView, JavaScriptCore, or the equivalent mechanism provided by your host platform.
2. **Install dependencies**:
   ```bash
   npm install --save @onekeyfe/hd-common-connect-sdk
   npm install --save @noble/hashes ripple-keypairs
   ```
3. **Implement a low-level plugin** - Provide `enumerate`, `connect`, `send`, `receive`, and related hooks that forward traffic between the SDK and your native transport. See the Advanced guide "Low-level Transport Plugin".
4. **Initialize the SDK**:
   ```typescript
   import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
   import { createPlugin } from './lowlevel-plugin';

   HardwareSDK.init({
     env: 'lowlevel',
     debug: process.env.NODE_ENV !== 'production',
     fetchConfig: true,
   }, undefined, createPlugin());
   ```
5. **Subscribe to events** - Reuse the event handling patterns described in "Device Events and UI Interaction".

## Next Steps

- Need a BLE walkthrough? Read "React Native BLE Transport" in the Advanced section.
- Want to inspect the packet protocol? See "Low-level Transport Plugin" and "OneKey Message Protocol".
- Planning to add QR-code fallback? Review "QR-code (Air Gap) Signing" in Advanced.

Common Connect allows you to hide transport diversity behind a single API surface, reducing maintenance and creating a consistent user experience across form factors.