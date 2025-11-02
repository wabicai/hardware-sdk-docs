# Step 1 · Prepare Your Environment

Before installing packages, make sure that your development machine, browser, and hardware are ready for WebUSB testing.

## System requirements

- **Node.js 18 LTS or later** – manage versions with `nvm` or `fnm` so CI and local builds stay aligned.
- **Package manager** – either `npm` ≥ 9 or `yarn` ≥ 1.22. Install both if your team uses mixed tooling.
- **Compatible browser** – Chrome 89+, Edge 89+, or any Chromium-based desktop browser with WebUSB support. Safari and Firefox currently do not expose the required APIs.
- **USB access** – ensure you can install device drivers. Windows developers need administrator rights to configure WinUSB.

## Platform support snapshot

- **Desktop** – WebUSB is available on Windows, macOS, and most Linux distributions when using the latest Chrome or Edge.
- **Browser-based BLE** – Chromium browsers that expose the Web Bluetooth API (Chrome, Edge, Samsung Internet) can connect over BLE once you switch transports in later steps.
- **Mobile & native shells** – Use React Native, native iOS/Android WebViews, or low-level adapters for mobile apps. Refer to the transport recipes listed in Step 6 when you move past WebUSB.

## Hardware checklist

- **Supported devices** – USB-capable models (OneKey Classic, OneKey Touch, OneKey Mini Pro) work out of the box with the Common Connect SDK. Bluetooth-enabled models (Touch, Mini Pro) can extend into WebBLE and mobile flows later in the guide. Air-gapped products such as OneKey Lite require the [Air-Gap signing workflow](../air-gap/README.md) instead of WebUSB.
- **Reliable cable** – use the bundled USB-C cable or a known good data cable. Charging-only cables prevent enumeration.
- **Unlocked device** – finish onboarding on the hardware wallet and temporarily turn off auto-lock while testing to avoid disconnects.

When all the above items are satisfied, continue with [Step 2](2-install-sdk.md).
