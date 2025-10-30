# Connection Options Overview

Choose the transport before you commit to an SDK. The table below compares the supported paths.

| Option | SDK | Platforms | Highlights | Typical Use Cases |
| --- | --- | --- | --- | --- |
| WebUSB | `@onekeyfe/hd-web-sdk` | Desktop browsers (HTTPS) | No bridge process, direct device access | Browser-based wallets, desktop web apps |
| Web BLE | `@onekeyfe/hd-common-connect-sdk` (Web BLE transport) | Desktop browsers with BLE support | Wireless experience without a native runtime | Companion desktop apps that prefer Bluetooth |
| Common Connect (USB/BLE) | `@onekeyfe/hd-common-connect-sdk` | React Native, Electron, Flutter, native wrappers | Unified API for both USB and BLE, customizable plugins | Cross-platform apps and embedded integrations |
| QR-code (Air Gap) | `@onekeyfe/hd-air-gap-sdk` | Any device with camera or display | Fully offline, strongest isolation | Cold wallets, transaction approvals in restricted environments |

### Selection Guide

1. **Security and compliance** - Use WebUSB for online workflows. Reserve QR-code signing for air-gapped policies or audits that require isolation.
2. **Runtime support** - Web projects should stay with WebUSB. Native or hybrid stacks typically start with Common Connect so they can share code across platforms.
3. **Hardware capability** - Confirm the transport matrix in "Environment Setup and Initialization" to see which device models support USB or BLE.
4. **Fallback strategy** - If you plan to offer multiple redundancy paths, treat WebUSB as the primary experience and document Air Gap or BLE in the Advanced section.

After choosing a transport, proceed to:

- "Environment Setup and Initialization" for package installation and initialization snippets.
- "Hardware SDK Quickstart" for the first working flow.
- The Advanced section if you need native low-level plugins, QR-code signing, or React Native BLE guidance.