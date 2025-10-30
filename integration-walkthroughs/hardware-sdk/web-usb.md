# WebUSB Integration Walkthrough

This guide covers the canonical WebUSB flow for browsers on desktop operating systems. It mirrors the Ledger-style walkthrough: keep the steps short, highlight prerequisites, and defer specialized transports to the Advanced section.

## Prerequisites

- HTTPS hosting (WebUSB requires a secure context).
- Chrome, Edge, or Opera with WebUSB enabled.
- OneKey hardware wallet connected over USB and unlocked.
- Familiarity with the event model described in "Device Events and UI Interaction".

## 1. Install the SDK

```bash
npm install --save @onekeyfe/hd-web-sdk
```

## 2. Initialize WebUSB transport

```typescript
import { HardwareWebSdk as HardwareSDK } from '@onekeyfe/hd-web-sdk';

HardwareSDK.init({
  env: 'webusb',
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
});
```

- `env: 'webusb'` activates the browser transport.
- `fetchConfig` retrieves firmware metadata so you can notify the user about required upgrades.

## 3. Subscribe to UI events

```typescript
import { UI_EVENT, UI_REQUEST, UI_RESPONSE, CoreMessage } from '@onekeyfe/hd-core';

HardwareSDK.on(UI_EVENT, (message: CoreMessage) => {
  if (message.type === UI_REQUEST.REQUEST_PIN) {
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
    });
  }

  if (message.type === UI_REQUEST.REQUEST_PASSPHRASE) {
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: {
        value: '',
        passphraseOnDevice: true,
        save: false,
      },
    });
  }

  if (message.type === UI_REQUEST.REQUEST_BUTTON) {
    // Update your UI to remind the user to confirm on the device.
  }

  if (message.type === UI_REQUEST.CLOSE_UI_WINDOW) {
    // Clear any modal or snackbar you displayed while waiting for confirmation.
  }
});
```

Map these events to your own interface elements so the user understands when to unlock the device, enter a passphrase, or approve a transaction.

## 4. Discover devices and cache identifiers

```typescript
const searchResult = await HardwareSDK.searchDevices();
if (!searchResult.success || searchResult.payload.length === 0) {
  throw new Error('No devices found');
}

const device = searchResult.payload[0];
```

Persist `connectId` (session identifier) and `deviceId` (persistent identifier returned by `getFeatures`) in your application state. Most API calls require both values.

## 5. Fetch device features

```typescript
const featureResponse = await HardwareSDK.getFeatures(device.connectId);
if (!featureResponse.success) {
  throw new Error(featureResponse.payload.error);
}

const features = featureResponse.payload;
```

Use the firmware version in `features` to enforce minimum requirements or to show upgrade prompts.

## 6. Request a Bitcoin address (example)

```typescript
const addressResponse = await HardwareSDK.btcGetAddress(
  device.connectId,
  device.deviceId,
  {
    path: "m/84'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true,
  },
);

if (!addressResponse.success) {
  throw new Error(addressResponse.payload.error ?? 'Failed to fetch address');
}

console.log('Native SegWit address:', addressResponse.payload.address);
```

Adjust the derivation path and coin information for your protocol. Every signing method follows the same pattern: pass `connectId`, `deviceId`, and command-specific parameters.

## 7. Handle errors consistently

All SDK calls resolve to `{ success: boolean, payload: {...} }`. When `success` is `false`, inspect `payload.error` and `payload.code`. Cross-reference "Error Code" in the References section for troubleshooting guidance.

## What's next?

- Need BLE, QR-code, or native low-level transports? See the Advanced section.
- Looking for chain-specific APIs? Visit "Hardware SDK API Navigation" in References.
- Want to enforce clear signing? Combine this walkthrough with the recommendations in "Clear Signing Best Practices".

By finishing this flow you now have a minimal WebUSB integration that lists devices, handles UI prompts, and signs real transactions.