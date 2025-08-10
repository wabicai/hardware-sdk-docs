# Quick Start (WebUSB)

This guide helps you integrate OneKey hardware wallets into a web app using @onekeyfe/hd-web-sdk. It follows the structure and depth of the legacy docs while modernizing the flow and keeping the content lean and accurate.

## Overview

- Package: @onekeyfe/hd-web-sdk
- Transport: WebUSB 
- Best for: Web apps and browser extensions
- Security: Device confirmation screens and isolated connect iframe

## Requirements

- Browser with WebUSB support (Chrome/Edge/Opera and other Chromium-based)
- HTTPS in production (WebUSB requires secure context)
- A user gesture (e.g., click) is required to show the device chooser

## 1) Install

```bash
npm install @onekeyfe/hd-web-sdk
# or
yarn add @onekeyfe/hd-web-sdk
```

## 2) Initialize

Initialize once before calling any API methods.

```typescript
import HardwareSDK from '@onekeyfe/hd-web-sdk';

await HardwareSDK.init({
  connectSrc: 'https://connect.onekey.so/',
  debug: false,
});
```

Notes:
- connectSrc points to the OneKey Connect iframe host
- Keep debug: false for production

## 3) WebUSB permission model (critical)

The browser requires a user gesture to display the WebUSB device chooser (navigator.usb.requestDevice). In your click/tap handler, first call requestDevice with OneKey filters, then call HardwareSDK.searchDevice().

```typescript
import HardwareSDK from '@onekeyfe/hd-web-sdk';
import { ONEKEY_WEBUSB_FILTER } from '@onekeyfe/hd-shared';

const connectButton = document.getElementById('connect');

connectButton?.addEventListener('click', async () => {
  try {
    // 1) Ask for WebUSB permission first
    await window?.navigator?.usb?.requestDevice({ filters: ONEKEY_WEBUSB_FILTER });

    // 2) Then search devices via SDK
    const result = await HardwareSDK.searchDevice();
    if (result.success) {
      console.log('devices:', result.payload);
    } else {
      console.error('searchDevice error:', result.payload.error);
    }
  } catch (e) {
    console.error('Permission/search error:', e);
  }
});
```

## 4) Discover devices

searchDevice returns authorized devices. If no prior permission exists, the browser will show the device chooser during requestDevice in your click handler.

Typical returned item fields include:
- connectId: string
- uuid: string (unique id; may change after device reset)
- deviceId: 'classic' | 'mini' | 'touch' | 'pro'
- deviceType: string (model code when available)
- name: string (bluetooth name for the device)

## 5) First API call (Bitcoin address)

After initialization and device selection, call a blockchain method such as btcGetAddress. The device will ask the user to confirm on-screen if showOnOneKey is true.

```typescript
const addressResp = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: true,
});

if (addressResp.success) {
  console.log('BTC address:', addressResp.payload.address);
} else {
  console.error('btcGetAddress error:', addressResp.payload.error);
}
```

## 6) Handling events (optional but recommended)

Listen for device connect/disconnect to give users better feedback.

```typescript
HardwareSDK.on('device-connect', (device) => {
  console.log('Device connected:', device);
});

HardwareSDK.on('device-disconnect', (device) => {
  console.log('Device disconnected:', device);
});
```

## 7) Error handling pattern

Most methods resolve to { success, payload }. Use try/catch for runtime errors and check success for SDK-level results.

```typescript
try {
  const resp = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
  });
  if (!resp.success) {
    console.error('SDK error:', resp.payload.error);
  }
} catch (e) {
  console.error('Unexpected error:', e);
}
```

## 8) Common issues

- WebUSB not supported: Use a Chromium-based browser
- HTTPS required: Use https in production and localhost in dev
- Permission denied: Ask user to re-connect and select the device again
- Iframe blocked: Ensure connectSrc is reachable and not restricted by CSP

## 9) What’s next?

- Installation & Setup details: connect-to-hardware/configuration/installation.md
- Device discovery deep dive: connect-to-hardware/device-api/search-devices.md
- Your first blockchain calls:
  - Bitcoin: connect-to-hardware/coin-api/btc/btcgetaddress.md
  - EVM: connect-to-hardware/coin-api/evm/README.md
  - Solana: connect-to-hardware/coin-api/solana/README.md

---

This Quick Start follows the old documentation’s logical flow (install → init → permission → discover → first call → events → troubleshooting) while keeping the WebUSB-only approach and ensuring code samples match the @onekeyfe/hd-web-sdk usage pattern.
