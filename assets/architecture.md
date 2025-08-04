# OneKey SDK Architecture

## Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your App      │    │  OneKey SDK     │    │ OneKey Device   │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   UI/UX     │ │    │ │   Methods   │ │    │ │  Firmware   │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Business   │◄────►│ │  Transport  │◄────►│ │   Crypto    │ │
│ │   Logic     │ │    │ │   Layer     │ │    │ │  Hardware   │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Transport Layer

### WebUSB (Browser)
- Direct USB communication
- Requires HTTPS
- Chrome, Edge, Opera support

### Bridge (Desktop)
- OneKey Bridge application
- Cross-platform compatibility
- Node.js, Electron support

### Bluetooth (Mobile)
- React Native support
- iOS/Android compatibility
- Wireless communication

## Method Flow

```
1. App calls SDK method
   ↓
2. SDK validates parameters
   ↓
3. Transport sends to device
   ↓
4. Device processes request
   ↓
5. User confirms on device
   ↓
6. Device returns response
   ↓
7. SDK formats response
   ↓
8. App receives result
```

## Security Model

- **Private keys never leave device**
- **All operations require user confirmation**
- **Hardware-based cryptography**
- **Secure element protection**

## Supported Platforms

| Platform | Transport | Status |
|----------|-----------|--------|
| Web Browser | WebUSB | ✅ |
| Node.js | Bridge | ✅ |
| Electron | Bridge/WebUSB | ✅ |
| React Native | Bluetooth | ✅ |
| iOS | Bluetooth | ✅ |
| Android | Bluetooth | ✅ |
