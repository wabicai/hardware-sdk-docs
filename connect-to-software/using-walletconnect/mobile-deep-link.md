# Mobile Deep Link Integration

## Overview

OneKey supports two URL schemes for mobile DApp connections (Telegram Mini Apps, mobile web DApps, etc.).

| Type | URL | Use Case |
|------|-----|----------|
| **Deep Link (Recommended)** | `onekey-wallet://` | Directly opens OneKey app |
| **Universal Link** | `https://app.onekey.so/wc/connect` | Fallback when Deep Link unavailable |

## Quick Start

### Basic Usage

```javascript
const wcUri = 'wc:xxxxx@2?relay-protocol=irn&symKey=...';

// Method 1: Deep Link (Recommended)
const deepLink = `onekey-wallet://wc?uri=${encodeURIComponent(wcUri)}`;
window.open(deepLink, '_blank');

// Method 2: Universal Link (Fallback)
const universalLink = `https://app.onekey.so/wc/connect/wc?uri=${encodeURIComponent(wcUri)}`;
window.open(universalLink, '_blank');
```

### Telegram Mini App

```javascript
import { openLink } from '@telegram-apps/sdk';
import { SignClient } from '@walletconnect/sign-client';

// Initialize WalletConnect
const client = await SignClient.init({
  projectId: 'YOUR_PROJECT_ID',
  metadata: {
    name: 'My Telegram DApp',
    description: 'Telegram Mini App',
    url: 'https://t.me/your_bot',
    icons: ['https://your-icon.png']
  }
});

// Connect to OneKey
const { uri, approval } = await client.connect({
  requiredNamespaces: {
    eip155: {
      methods: ['eth_sendTransaction', 'personal_sign'],
      chains: ['eip155:1'],
      events: ['chainChanged', 'accountsChanged']
    }
  }
});

// Open OneKey with Deep Link
if (uri) {
  const deepLink = `onekey-wallet://wc?uri=${encodeURIComponent(uri)}`;
  openLink(deepLink);

  const session = await approval();
  console.log('Connected:', session);
}
```

## WalletConnect Configuration

```javascript
import { createWeb3Modal } from '@web3modal/wagmi';

createWeb3Modal({
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet],

  mobileWallets: [{
    id: 'onekey',
    name: 'OneKey',
    links: {
      native: 'onekey-wallet://',              // Primary
      universal: 'https://app.onekey.so/wc/connect'  // Fallback
    }
  }]
});
```

## Platform Configuration

### iOS (Info.plist)

```xml
<key>CFBundleURLSchemes</key>
<array>
  <string>onekey-wallet</string>
  <string>wc</string>
</array>

<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:app.onekey.so</string>
</array>
```

### Android (AndroidManifest.xml)

```xml
<activity android:name=".MainActivity">
  <!-- Deep Link -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="onekey-wallet" />
  </intent-filter>

  <!-- Universal Link -->
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="app.onekey.so" android:pathPrefix="/wc" />
  </intent-filter>
</activity>
```

## React Native / Expo

```javascript
import { Linking } from 'react-native';

async function connectOneKey(wcUri) {
  const deepLink = `onekey-wallet://wc?uri=${encodeURIComponent(wcUri)}`;

  const canOpen = await Linking.canOpenURL(deepLink);
  if (canOpen) {
    await Linking.openURL(deepLink);
  } else {
    // Fallback to Universal Link
    const universalLink = `https://app.onekey.so/wc/connect/wc?uri=${encodeURIComponent(wcUri)}`;
    await Linking.openURL(universalLink);
  }
}
```

## Demo Project

Complete working example with iOS/Android configurations:

**GitHub**: https://github.com/wabicai?tab=repositories

## Key Points

1. **Always encode WalletConnect URI**: Use `encodeURIComponent(wcUri)`
2. **Priority**: Deep Link first, Universal Link as fallback
3. **URL Format**:
   - Deep Link: `onekey-wallet://wc?uri={encoded_wc_uri}`
   - Universal Link: `https://app.onekey.so/wc/connect/wc?uri={encoded_wc_uri}`
4. **Testing**: Test on real devices for best results

## Support

- [GitHub Issues](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/issues)
