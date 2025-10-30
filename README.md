# OneKey Hardware SDK Documentation

This repository hosts the developer documentation for integrating OneKey hardware wallets. It follows the same layered approach as Ledger’s device-interaction and clear-signing guides: start with the essential WebUSB journey, then opt in to advanced transports or security enhancements as needed.

## Who should use this documentation

- Product engineers building WebUSB experiences on desktop browsers.
- Mobile, native, or cross-platform teams planning to reuse the Common Connect transport core.
- Integrators that require QR-code (Air Gap) signing or advanced security flows such as Clear Signing and Passphrase management.

## Documentation roadmap

| Section | Purpose | Read if you need |
| --- | --- | --- |
| [Getting Started](getting-started/README.md) | Core setup, transport choice, first API call | You are new to the hardware SDK and want a working prototype quickly |
| [Beginner Guides](beginner-guides/README.md) | Decision support, architectural guidance, common pitfalls | You need help choosing the right integration model or planning delivery |
| [Integration Walkthroughs](integration-walkthroughs/README.md) | Step-by-step WebUSB runbook | You are ready to execute the standard device-interaction flow |
| [Advanced Topics](advanced/README.md) | Specialized transports and QR-code signing | You require BLE, native low-level plugins, or offline signing |
| [References](references/README.md) | API index, chain-specific commands, error catalog | You are implementing signing flows or troubleshooting responses |
| [Explanations](explanations/README.md) | Security concepts, message protocol, passphrase handling | You want the theory behind the APIs or need to harden UX patterns |

## Quick start flow (mirrors Ledger’s device-interaction guide)

1. **Choose a transport** – Review [Connection Options Overview](getting-started/connection-options.md) to decide between WebUSB, Common Connect, BLE, or QR-code.
2. **Install and initialize** – Follow the snippets in [Environment Setup and Initialization](getting-started/installation.md) for your platform.
3. **Run the quickstart** – Complete [Hardware SDK Quickstart](getting-started/hardware-sdk-quickstart.md) to enumerate a device, fetch features, and execute the first signing command.
4. **Handle UI events** – Implement the event loop described in [Device Events and UI Interaction](getting-started/device-events.md) so PIN, passphrase, and approval prompts are surfaced properly.
5. **Extend as needed** – After the baseline flow works, move to the WebUSB walkthrough or the Advanced transports.

## Integration choices

| Path | Description | Documentation |
| --- | --- | --- |
| WebUSB (recommended first path) | Browser-based device interaction over USB with no bridge software | [WebUSB Integration Walkthrough](integration-walkthroughs/hardware-sdk/web-usb.md) |
| Common Connect transports | Unified USB/BLE implementation for React Native, Electron, Flutter, or native shells | [Common Connect Transport Guide](advanced/transports/common-connect.md) |
| React Native BLE | Bluetooth-only flow for mobile wallets | [React Native BLE Transport](advanced/transports/react-native-ble.md) |
| QR-code signing (Air Gap) | Offline approval channel with UR-encoded payloads | [QR-code Overview](advanced/qr-code/README.md) |

## Security and UX best practices

- **Clear Signing** – Present transaction details clearly and synchronize prompts with hardware events following [Clear Signing Best Practices](explanations/security/clear-signing.md).
- **Hidden wallets** – Understand Passphrase workflows and user expectations in [Passphrase](explanations/hardware-sdk/passphrase.md).
- **Protocol details** – Inspect packet structure and custom transport guidance in [Low-level Transport Plugin](explanations/hardware-sdk/low-level-transport-plugin.md) and [OneKey Message Protocol](explanations/hardware-sdk/onekey-message-protocol.md).

## Support and community

- GitHub repository: https://github.com/OneKeyHQ/app-monorepo
- Discussions: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
- Issue tracker: https://github.com/OneKeyHQ/hardware-js-sdk/issues
- Help Center: https://help.onekey.so/hc

Use the sidebar to navigate between sections. For a workflow-driven introduction, follow the quick start steps above; for specific API references or advanced integrations, jump directly to the corresponding sections.