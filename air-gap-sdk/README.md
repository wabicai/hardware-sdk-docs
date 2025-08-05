# Air Gap SDK

The OneKey Air Gap SDK enables secure, offline transaction signing using QR codes for maximum security. Perfect for cold storage scenarios where network connectivity is not available or desired.

## Key Features

- **Complete Air Gap Security** - No network connectivity required
- **QR Code Communication** - Secure data transfer via QR codes
- **Multi-Blockchain Support** - Bitcoin, Ethereum, and more
- **Standardized Protocols** - Based on industry standards (UR, CBOR)

## How It Works

1. **Generate Transaction** - Create unsigned transaction on online device
2. **Transfer via QR** - Scan QR code with offline OneKey device
3. **Sign Offline** - Transaction signed securely on air-gapped device
4. **Return Signature** - Signed transaction returned via QR code
5. **Broadcast** - Submit signed transaction to network

## Use Cases

- **Cold Storage Wallets** - Maximum security for large holdings
- **Enterprise Solutions** - Institutional-grade security requirements
- **High-Value Transactions** - Extra security for significant transfers
- **Compliance Requirements** - Meet strict security standards

## Getting Started

- **[Quick Start Guide](started.md)** - Set up your first air gap integration
- **[Wallet Integration](tutorial-wallet-integration.md)** - Complete integration tutorial
- **[API Reference](api-reference/README.md)** - Detailed API documentation

## Security Benefits

The Air Gap SDK provides the highest level of security by ensuring:
- Private keys never touch network-connected devices
- Transaction signing happens in isolated environment
- QR codes provide tamper-evident data transfer
- No attack surface for remote exploits
