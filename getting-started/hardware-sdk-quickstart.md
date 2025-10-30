# Hardware SDK Quickstart

Use this checklist to reach your first successful API call. Read "Connection Options Overview" before starting so you know which transport to use.

## Step 0: Experiment in the browser

Use the online playground to validate that your device and host environment meet the WebUSB requirements.

- HTTPS origin (WebUSB only works on secure contexts)
- Chrome, Edge, or Opera
- Device connected over USB and unlocked
- User grants access when the browser prompt appears

Playground: https://hardware-example.onekeytest.com/

## Step 1: Install the SDK

Follow "Environment Setup and Initialization" and choose the package that matches your platform. Web projects should install `@onekeyfe/hd-web-sdk`.

## Step 2: Initialize the transport

Call `HardwareSDK.init()` with the settings returned by the guide above. For WebUSB you typically set:

```typescript
HardwareSDK.init({
  env: 'webusb',
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
});
```

## Step 3: Register global events

Events drive the user interface for PIN prompts, passphrase entry, and confirmation dialogs. Register listeners before making any API call.

```typescript
HardwareSDK.on(UI_EVENT, message => {
  // Inspect message.type and route to your UI components
});
```

See "Device Events and UI Interaction" for the full matrix of event types and example responses.

## Step 4: Make your first API call

1. Execute `HardwareSDK.searchDevices()` and store the returned `connectId`.
2. Execute `HardwareSDK.getFeatures(connectId)` to retrieve `deviceId` and firmware information.
3. Call a signing API such as `btcGetAddress(connectId, deviceId, params)` and handle the response.
4. Check `response.success` to determine whether the call succeeded, and read `response.payload.error` plus `response.payload.code` on failure.

```typescript
const response = await HardwareSDK.btcGetAddress(connectId, deviceId, {
  path: "m/84'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: true,
});

if (response.success) {
  console.log('Address:', response.payload.address);
} else {
  console.error(response.payload.error);
}
```

## Step 5: Prepare for production

- Persist `connectId` and `deviceId` associated with the user session.
- Reference "Error Code" in the References section to map error codes to user-friendly messages.
- When ready, move deeper into specific walkthroughs or Advanced topics for BLE, QR-code, or native transports.