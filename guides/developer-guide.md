# Developer Guide

This guide helps you choose the right integration path with OneKey and jump to the detailed docs quickly.

## Who is this for
- DApp / Web app developers integrating wallet connectivity
- Native or cross‑platform app developers integrating with OneKey hardware

## Quick decision tree

- I am building a web DApp
  - Use OneKey Provider (EIP‑1193 style) → see Web App Integration Guide
  - Use a wallet aggregator (Web3 Onboard / RainbowKit / Web3Modal) → see Web App Integration Guide
  - Use WalletConnect to connect to OneKey mobile/desktop → see Web App Integration Guide
- I need to talk to OneKey hardware directly
  - Use Hardware SDK (USB / BLE) → see Hardware Integration Guide
  - Need fully offline signing via QR → use Air Gap SDK → see Hardware Integration Guide

## Where to go next
- Web App Integration → ../guides/web-app-integration-developer.md
- Hardware Integration → ../guides/hardware-integration-developer.md

## Tools & playground
- Hardware Bridge (USB transport helper): https://onekey.so/download?client=bridge
- Hardware SDK Playground: https://hardware-example.onekeytest.com/expo-playground/

## Troubleshooting
- If you cannot find a specific API, navigate via:
  - Web provider APIs by chain: connect-to-software/webapp-connect-onekey/
  - Hardware SDK APIs by chain: connect-to-hardware/hardware-sdk/api-reference/
  - Air Gap SDK reference: connect-to-hardware/air-gap-sdk/api-reference/

