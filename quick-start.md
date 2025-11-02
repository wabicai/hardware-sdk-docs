# Quick Start

This quick start takes you from an empty workspace to a fully working WebUSB integration with the OneKey Hardware SDK. It mirrors the onboarding flow used by our internal tooling and highlights the minimum number of actions required to talk to a device.

> This guide focuses on the Common Connect SDK with WebUSB. Once you can enumerate and call an API over USB, continue with the transport-specific guides for BLE or native shells.

## Step map

| Step                              | Goal                                                                 | Link                                      |
| --------------------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| 1. Prepare your environment       | Install the required tooling and confirm firmware requirements       | [Environment checklist](broken-reference) |
| 2. Install SDK dependencies       | Add the Common Connect SDK and supporting packages to your project   | [Install dependencies](broken-reference)  |
| 3. Wire the basic initialisation  | Set up the SDK module and UI event logging                           | [Initialise the SDK](broken-reference)    |
| 4. Connect and authorise a device | Confirm that the browser can discover and trust your hardware wallet | [Connect your device](broken-reference)   |
| 5. Run your first command         | Execute `btcGetAddress` end-to-end and capture the response          | [Run first command](broken-reference)     |
| 6. Where to go next               | Move on to production transports, APIs, and hardening                | [Next steps](broken-reference)            |

Keep the developer console open while following these steps. All examples log their status messages so you can cross-check your implementation against the playground output.
