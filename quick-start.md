# Quick Start

{% hint style="info" %}
**Explore OneKey Hardware SDKs**

OneKey Hardware SDK enables seamless integration of OneKey hardware wallets with third-party applications. Built with a developer-friendly interface, it ensures secure interactions for OneKey users within your applications.

This page walks you through installation and lets you explore SDK API for different environments.
{% endhint %}

## Quick start

### Choose your environment

Depending on your environment you need to choose the right package and follow the particular guide:

{% tabs %}
{% tab title="🌐 Web" %}
**For web applications and browser extensions**

* Iframe-based security isolation
* WebUSB and Bridge transport support
* Cross-origin communication
* Built-in UI for device interactions

**Use cases:** Web apps, browser extensions
{% endtab %}

{% tab title="📱 Mobile" %}
**For React Native and mobile applications**

* Bluetooth LE communication
* Native mobile integration
* Permission management
* Device discovery and pairing

**Use cases:** React Native, mobile apps
{% endtab %}
{% endtabs %}

***

## 🌐 Web

{% hint style="success" %}
**Perfect for:** Web applications and browser extensions
{% endhint %}

### Architecture

{% tabs %}
{% tab title="Connect with web-usb" %}
![OneKey Web SDK Architecture](images/onekey-web-sdk-architecture.png)

The SDK automatically selects the best mode based on your environment. Iframe mode is preferred for persistent connections, but popup mode is automatically used when iframe doesn't allow WebUSB communication and OneKey Bridge is not running.
{% endtab %}
{% endtabs %}

### About

`@onekeyfe/hd-web-sdk` imports only a thin layer with API description into your 3rd party application. It has two modes of operation: core SDK logic can be either injected into **iframe** or opened in **popup**. However iframe doesn't allow WebUSB communication, so popup is automatically preferred if OneKey Bridge is not running.

**Key Features:**

* Iframe-based security isolation
* WebUSB and Bridge transport support
* Cross-origin communication
* Built-in UI for device interactions

### Quick Start Guide

***

## 📱 Mobile

{% hint style="success" %}
**Perfect for:** React Native and mobile applications
{% endhint %}

### Architecture

{% tabs %}
{% tab title="Bluetooth LE" %}
![OneKey BLE SDK Architecture](images/onekey-ble-sdk-architecture.png)

`@onekeyfe/hd-ble-sdk` enables React Native applications to communicate with OneKey hardware wallets via Bluetooth Low Energy (BLE). It uses native BLE transport for wireless device communication while maintaining the same API as other OneKey SDKs.
{% endtab %}

{% tab title="Permission Flow" %}
The Mobile SDK requires specific Bluetooth permissions to function properly:

1. **Android**: `BLUETOOTH`, `BLUETOOTH_ADMIN`, `ACCESS_FINE_LOCATION`
2. **iOS**: `NSBluetoothAlwaysUsageDescription`
3. **Runtime Permissions**: The app must request these permissions at runtime
4. **Device Discovery**: BLE scan requires location permissions on Android
{% endtab %}
{% endtabs %}

### About

The Mobile SDK enables React Native applications to communicate with OneKey hardware wallets via Bluetooth Low Energy (BLE). It provides the same API as other OneKey SDKs but uses native BLE transport for wireless device communication.

**Key Features:**

* Bluetooth LE communication
* Native mobile integration
* Permission management
* Device discovery and pairing

### Quick Start Guide

***

## Universal Integration Pattern

All OneKey SDKs follow the same integration pattern:

{% hint style="success" %}
**Key Advantage:** Once you learn one SDK, you know them all! The API is identical across Node.js, Web, and Mobile environments.
{% endhint %}

## Multi-Chain Support

OneKey SDK supports 25+ blockchains with consistent API:

{% tabs %}
{% tab title="Bitcoin & Forks" %}
**Supported:** BTC, BCH, LTC, DOGE, DASH

```typescript
// Bitcoin
await HardwareSDK.btcGetAddress(connectId, deviceId, { path: "m/44'/0'/0'/0/0", coin: 'btc' });
await HardwareSDK.btcSignTransaction(connectId, deviceId, { inputs, outputs });

// Litecoin  
await HardwareSDK.btcGetAddress(connectId, deviceId, { path: "m/44'/2'/0'/0/0", coin: 'ltc' });

// Dogecoin
await HardwareSDK.btcGetAddress(connectId, deviceId, { path: "m/44'/3'/0'/0/0", coin: 'doge' });
```
{% endtab %}

{% tab title="EVM Chains" %}
**Supported:** Ethereum, BSC, Polygon, Avalanche, Arbitrum, Optimism

```typescript
// Ethereum
await HardwareSDK.evmGetAddress(connectId, deviceId, { path: "m/44'/60'/0'/0/0" });
await HardwareSDK.evmSignTransaction(connectId, deviceId, { to, value, data });

// Polygon (same API, different chainId)
await HardwareSDK.evmSignTransaction(connectId, deviceId, { 
    to, value, data, chainId: 137 
});

// BSC (same API, different chainId)
await HardwareSDK.evmSignTransaction(connectId, deviceId, { 
    to, value, data, chainId: 56 
});
```
{% endtab %}

{% tab title="Layer 1s" %}
**Supported:** Solana, Cardano, Polkadot, Cosmos, Near, Aptos, Sui

```typescript
// Solana
await HardwareSDK.solGetAddress(connectId, deviceId, { path: "m/44'/501'/0'/0'" });
await HardwareSDK.solSignTransaction(connectId, deviceId, { rawTx });

// Cardano
await HardwareSDK.cardanoGetAddress(connectId, deviceId, { 
    addressParameters: { addressType: 0, path: "m/44'/1815'/0'/0/0" }
});

// Aptos
await HardwareSDK.aptosGetAddress(connectId, deviceId, { path: "m/44'/637'/0'/0'/0'" });
```
{% endtab %}

{% tab title="Others" %}
**Supported:** Ripple, Stellar, Tron, Algorand, Filecoin, TON, Kaspa

```typescript
// Ripple (XRP)
await HardwareSDK.xrpGetAddress(connectId, deviceId, { path: "m/44'/144'/0'/0/0" });

// Stellar (XLM)
await HardwareSDK.stellarGetAddress(connectId, deviceId, { path: "m/44'/148'/0'" });

// Tron (TRX)
await HardwareSDK.tronGetAddress(connectId, deviceId, { path: "m/44'/195'/0'/0/0" });
```
{% endtab %}
{% endtabs %}

### Consistent API Pattern

All blockchain methods follow the same naming convention:

```typescript
// Address methods
const address = await HardwareSDK.{blockchain}GetAddress(connectId, deviceId, params);

// Transaction signing  
const signed = await HardwareSDK.{blockchain}SignTransaction(connectId, deviceId, params);

// Public key methods (where supported)
const pubkey = await HardwareSDK.{blockchain}GetPublicKey(connectId, deviceId, params);

// Message signing (where supported)
const signature = await HardwareSDK.{blockchain}SignMessage(connectId, deviceId, params);
```

## What's Next?

{% tabs %}
{% tab title="🚀 Core Integration" %}
Start building with OneKey SDK:

* [**Blockchain APIs**](coin-api/) - Bitcoin, Ethereum, Solana, and 25+ blockchains
* [**Device Management**](device-api/) - Hardware wallet discovery and control
* [**Configuration Guide**](configuration/) - Complete setup and configuration reference

{% hint style="info" %}
**Recommended path:** Start with [Configuration Guide](configuration/) to understand common parameters and setup, then explore the [Blockchain APIs](coin-api/) for your specific use case.
{% endhint %}
{% endtab %}

{% tab title="🔧 Advanced Features" %}
Unlock powerful capabilities:

* [**Air Gap SDK**](air-gap-sdk/) - Offline signing with QR codes for maximum security
* [**PIN Management**](advanced/pin.md) - Device PIN handling and security features
* [**Passphrase Support**](advanced/passphrase.md) - Multiple wallets on a single device
* [**Protocol Details**](advanced/onekey-message-protocol.md) - Low-level communication protocols

{% hint style="success" %}
**For production apps:** Implement [PIN Management](advanced/pin.md) and [Passphrase Support](advanced/passphrase.md) to provide a complete user experience.
{% endhint %}
{% endtab %}

{% tab title="📚 Resources & Examples" %}
Learn by example and test your integration:

**🎮 Interactive Tools**

* [**SDK Playground**](https://hardware-example.onekeytest.com/expo-playground/) - Test all SDK methods in your browser
* [**Method Tester**](api-explorer/) - Interactive API explorer with live device testing

**📁 Code Examples**

* [**Node.js Examples**](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/node) - Server applications and CLI tools
* [**Web Examples**](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/browser-inline-script) - Browser applications
* [**React Native Examples**](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/expo-example) - Mobile applications

**📖 References**

* [**Error Codes**](configuration/error-codes.md) - Complete error handling reference
* [**Derivation Paths**](configuration/paths.md) - BIP32/BIP44 path specifications
* [**Common Parameters**](configuration/common-params.md) - Shared configuration parameters

{% hint style="info" %}
**Quick tip:** Use the [SDK Playground](https://hardware-example.onekeytest.com/expo-playground/) to experiment with different methods and parameters before implementing them in your application.
{% endhint %}
{% endtab %}
{% endtabs %}

***

## Try It Out

{% embed url="https://hardware-example.onekeytest.com/expo-playground/" %}
OneKey SDK Interactive Testing Tool - Test hardware wallet interactions directly in your browser
{% endembed %}

## Need Help?

{% hint style="info" %}
**Having trouble getting started?**

* 📖 Check our [Configuration Guide](configuration/) for detailed setup instructions
* 🔍 Browse [Common Issues](configuration/error-codes.md) for troubleshooting tips
* 💬 Ask questions in our [GitHub Discussions](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/discussions)
* 🐛 Report bugs via [GitHub Issues](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/issues)
{% endhint %}
