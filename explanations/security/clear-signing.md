# Clear Signing Best Practices

Ledger's "Clear Signing for Wallets" highlights the importance of presenting signature requests in a transparent way. The same principles apply to OneKey integrations.

## Core principles

1. **Consistent context** - Display the same amount, address, and fee information in your UI that appears on the hardware screen.
2. **Risk awareness** - Highlight contract approvals, unlimited allowances, or other high-impact actions with clear warnings.
3. **Event-driven prompts** - Tie UI updates to SDK events (`REQUEST_BUTTON`, `REQUEST_PASSPHRASE`, etc.) so the user always knows what the device is requesting.

## Implementation steps

1. **Prepare structured data** - Before calling a signing method, extract the critical fields into a data model that can feed both UI rendering and risk checks.
2. **Use templates per action** - Provide tailored layouts:
   - Transfers: chain name, amount, recipient, network fee.
   - Approvals: contract name, allowance, expiration.
   - Message signatures: raw message plus verification tools.
3. **Sync with hardware confirmations** - When `REQUEST_BUTTON` fires, show a prominent reminder to review the device; dismiss the prompt when `CLOSE_UI_WINDOW` arrives.
4. **Log decisions** - Persist key parameters and user confirmations for audits and customer support.

## Related resources

- WebUSB walkthrough: see "WebUSB Integration Walkthrough" for event handling examples.
- BLE and Common Connect: refer to the Advanced transports guides for platform-specific UI patterns.
- QR-code signing: pair these best practices with "QR-code Wallet Integration" in the Advanced section.

Following these steps keeps the on-screen story aligned with the hardware view, reduces phishing risk, and builds user confidence.