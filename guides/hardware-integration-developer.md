---
description: Third-Party Wallet and App Developer
---

# Hardware Integration Guide

For apps that need to communicate with OneKey hardware directly.

## Quick Start (USB / BLE)
1) Install Hardware Bridge (for browser/desktop to talk to device)
   - https://onekey.so/download?client=bridge
2) Connect a device via USB or Bluetooth
3) Open the SDK Playground and run a basic call
   - https://hardware-example.onekeytest.com/expo-playground/
4) Add the Hardware SDK to your app and initialize
5) Handle UI prompts / events and verify results

## Choose your integration path
- Hardware SDK (full device control)
  - Start here → ../connect-to-hardware/hardware-sdk/started.md
- Air Gap SDK (QR / offline signing)
  - Start here → ../connect-to-hardware/air-gap-sdk/started.md

## Notes
- Bridge is required for browser/desktop transports
- BLE support depends on platform capabilities
- See API Reference by chain under Hardware SDK → API Reference

## Related
- Web App integrations (Provider / aggregators / WalletConnect) are documented under Connect to Software.
