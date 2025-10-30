# Hardware Integration Guide

This guide targets developers who integrate directly with OneKey hardware using USB or BLE transports.

## Quick start (five minutes)

### USB and Bluetooth flow

1. Connect a device over USB or BLE.
2. Test the connection using the SDK Playground.
3. Install the SDK and initialize the transport.
4. Implement event handling and run a sample API call.

```typescript
import { HardwareBleSdk as HardwareSDK } from '@onekeyfe/hd-ble-sdk';
import { UI_EVENT, UI_REQUEST } from '@onekeyfe/hd-core';

HardwareSDK.init({
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
});

HardwareSDK.on(UI_EVENT, message => {
  if (message.type === UI_REQUEST.REQUEST_PIN) {
    // Display your PIN entry flow here.
  }
});
```

### Verify with the SDK Playground

https://hardware-example.onekeytest.com/

## Choose your integration path

| Option | Use when | Next steps |
| --- | --- | --- |
| WebUSB | Web or desktop browser wallets | Follow the WebUSB walkthrough in Integration Walkthroughs. |
| React Native BLE | Mobile apps built with React Native | Read "React Native BLE Transport" in Advanced topics. |
| Common Connect | Desktop shells, native wrappers, or mixed transports | Combine this guide with "Common Connect Quickstart" and the Advanced transports articles. |
| QR-code (Air Gap) | Offline or multi-device approval | See the QR-code articles in Advanced topics. |

## Important requirements

- Firmware must meet the minimum version supported by the SDK.
- Secure contexts are mandatory for WebUSB (HTTPS).
- BLE integrations must request runtime permissions (Bluetooth and location on Android, usage descriptions on iOS).

## API reference by blockchain

### Core APIs
- [Device Management](../references/hardware-sdk/api-reference/basic-api/README.md)
- [Common Parameters](../references/hardware-sdk/api-reference/common-params.md)
- [Error Codes](../references/hardware-sdk/api-reference/error-code.md)

### Protocol-specific guides

| Blockchain | Capabilities | Link |
| --- | --- | --- |
| Bitcoin and forks | Address, PSBT, message signing | [Guide](../references/hardware-sdk/api-reference/bitcoin-and-bitcoin-forks/) |
| Ethereum and EVM | Transactions, typed data, messages | [Guide](../references/hardware-sdk/api-reference/ethereum-and-evm/) |
| Solana | Address, transaction signing | [Guide](../references/hardware-sdk/api-reference/solana/) |
| NEAR | Address, transaction signing | [Guide](../references/hardware-sdk/api-reference/near/) |
| More chains | Cosmos, Cardano, Algorand, and others | [Complete list](../references/hardware-sdk/api-reference/) |

## Related integration methods

- Web-facing integrations: [OneKey dApp documentation](https://github.com/OneKeyHQ/hardware-js-sdk/tree/main/dapp-docs)

### Platform and device support

Check the transport compatibility matrix in "Environment Setup and Initialization".

## Need additional help?

- Getting started walkthrough: [WebUSB Integration Walkthrough](../integration-walkthroughs/hardware-sdk/web-usb.md)
- Advanced configuration: [Hardware Security and Advanced Capabilities](../explanations/hardware-sdk/README.md)
- Community discussions: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
- Issue tracker: https://github.com/OneKeyHQ/hardware-js-sdk/issues