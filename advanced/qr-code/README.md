# QR-code (Air Gap) Overview

The Air Gap SDK delivers QR-code based signing for scenarios that require strict isolation.

Recommended uses:

- Cold wallets with no direct network or USB connection.
- Multi-device workflows where one device creates the request, the hardware scans and signs, and another device broadcasts the transaction.
- Secondary approval channels for high-value operations.

Integration steps:

1. Review "Connection Options Overview" to determine when QR-code signing should be the primary or fallback method.
2. Complete the "QR-code Quickstart" for encoding rules, chunking strategy, and signature flow.
3. Follow "QR-code Wallet Integration" to wire request serialization, QR rendering, and result parsing.
4. Apply "Clear Signing Best Practices" so users can verify transaction details before scanning.

QR-code signing often complements WebUSB or Common Connect. Make sure the product copy explains the limitations (no instant broadcast) alongside the benefits (stronger isolation).