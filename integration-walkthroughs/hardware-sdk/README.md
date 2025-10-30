# Hardware SDK Walkthrough Overview

This section focuses on the primary integration route for web and desktop applications using WebUSB. The goal is to provide a concise, Ledger-style walkthrough that gets you from first connection to a working signing flow with minimal detours.

Before you start make sure that:

- The target device firmware is up to date and initialized.
- You have HTTPS hosting and a WebUSB-compatible browser (Chrome, Edge, Opera).
- You reviewed "Device Events and UI Interaction" so that PIN, passphrase, and confirmation prompts are handled correctly in your UI.

For specialized transports-React Native BLE, Common Connect low-level adapters, or QR-code signing-refer to the Advanced section. Those topics are intentionally separated to keep the main guide streamlined.