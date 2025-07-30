---
icon: microchip
layout:
  width: default
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
---

# OneKey Hardware SDK

{% hint style="info" %}
OneKey SDK 是一套用于与 OneKey 硬件钱包无缝集成的开发工具包。支持多种环境和区块链，提供安全可靠的硬件钱包功能。
{% endhint %}

## 🚀 选择你的集成方式

{% hint style="info" %}
根据你的开发环境选择合适的 SDK 包：
{% endhint %}

{% tabs %}
{% tab title="🖥️ Node.js" %}
**适用场景**：Node.js 应用、Electron 主进程、CLI 工具

**包名**：`@onekey/hardware-js-sdk`

**特点**：
- ✅ 直接设备通信
- ✅ 支持所有 Transport (USB/Bluetooth/Bridge)
- ✅ 最佳性能
- ✅ 完整功能支持

[查看详细指南 →](environments/nodejs.md)
{% endtab %}

{% tab title="🌐 Web Browser" %}
**适用场景**：Web 应用、SPA、PWA

**包名**：`@onekey/hardware-web-sdk`

**特点**：
- 🔄 自动检测最佳连接方式
- 🌐 浏览器兼容性好
- 📱 支持移动端回退
- 🔒 安全的 iframe/popup 模式

[查看详细指南 →](environments/web-browser.md)
{% endtab %}

{% tab title="📱 React Native" %}
**适用场景**：移动应用、跨平台应用

**包名**：`@onekey/hardware-react-native-sdk`

**特点**：
- 📱 移动端优化
- 🔗 Deep Link 支持
- 🔵 Bluetooth 连接
- ⚡ 原生性能

[查看详细指南 →](environments/react-native.md)
{% endtab %}

{% tab title="🔌 Browser Extension" %}
**适用场景**：浏览器扩展、Web Extension

**包名**：`@onekey/hardware-web-sdk`

**特点**：
- 🔌 扩展环境优化
- 🔒 安全隔离
- 📦 轻量级集成
- 🌐 跨浏览器兼容

[查看详细指南 →](environments/browser-extension.md)
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
**还不确定选择哪个？** 查看下面的决策表：

| 环境 | 推荐包 | 原因 |
|------|--------|------|
| Node.js 服务器 | `@onekey/hardware-js-sdk` | 直接设备访问 |
| React/Vue Web 应用 | `@onekey/hardware-web-sdk` | 浏览器兼容性 |
| React Native 应用 | `@onekey/hardware-react-native-sdk` | 移动端优化 |
| Electron 主进程 | `@onekey/hardware-js-sdk` | 完整功能 |
| Electron 渲染进程 | `@onekey/hardware-web-sdk` | 安全隔离 |
| 浏览器扩展 | `@onekey/hardware-web-sdk` | 扩展兼容 |
{% endhint %}

## 📊 架构概览

{% tabs %}
{% tab title="Node.js 架构" %}
```mermaid
graph LR
    A[Your App] --> B[@onekey/hardware-js-sdk]
    B --> C[Transport Layer]
    C --> D[OneKey Device]

    subgraph "Transport Options"
        E[USB/HID]
        F[Bluetooth]
        G[Bridge]
    end

    C --> E
    C --> F
    C --> G

    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style B fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style D fill:#4caf50,stroke:#2e7d32,stroke-width:2px
    style E fill:#fff3e0,stroke:#ef6c00,stroke-width:1px
    style F fill:#fff3e0,stroke:#ef6c00,stroke-width:1px
    style G fill:#fff3e0,stroke:#ef6c00,stroke-width:1px
```

**数据流**：
1. 应用调用 SDK API
2. SDK 选择最佳 Transport
3. 通过 Transport 与设备通信
4. 返回结果给应用
{% endtab %}

{% tab title="Web Browser 架构" %}
```mermaid
graph LR
    A[Web App] --> B[@onekey/hardware-web-sdk]
    B --> C{Auto Detection}

    C -->|WebUSB Available| D[Direct WebUSB]
    C -->|Bridge Available| E[OneKey Bridge]
    C -->|Mobile Device| F[Deep Link]

    D --> G[OneKey Device]
    E --> G
    F --> H[OneKey Mobile App] --> G

    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style B fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    style G fill:#4caf50,stroke:#2e7d32,stroke-width:2px
    style H fill:#ff9800,stroke:#e65100,stroke-width:2px
```

**自动检测逻辑**：
1. 检测 WebUSB 支持
2. 检测 OneKey Bridge
3. 移动端回退到 Deep Link
{% endtab %}

{% tab title="React Native 架构" %}
```mermaid
graph LR
    A[React Native App] --> B[@onekey/hardware-react-native-sdk]
    B --> C[Bluetooth Transport]
    C --> D[OneKey Device]

    B --> E[Deep Link]
    E --> F[OneKey Mobile App]
    F --> D

    style A fill:#f9f9f9,stroke:#333,stroke-width:2px
    style B fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style D fill:#4caf50,stroke:#2e7d32,stroke-width:2px
    style F fill:#ff9800,stroke:#e65100,stroke-width:2px
```

**连接方式**：
- 优先使用 Bluetooth 直连
- 回退到 OneKey App 中转
{% endtab %}
{% endtabs %}

## ⚡ 5分钟快速开始

<details>
<summary>🖥️ <strong>Node.js 快速开始</strong></summary>

### 1️⃣ 安装包

```bash
npm install @onekey/hardware-js-sdk
# 或
yarn add @onekey/hardware-js-sdk
```

### 2️⃣ 导入 SDK

```javascript
import OneKeySDK from '@onekey/hardware-js-sdk';
```

### 3️⃣ 初始化项目

```javascript
const sdk = new OneKeySDK({
    debug: true,
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your App Name',
        appUrl: 'https://yourapp.com'
    }
});
```

{% hint style="info" %}
**Manifest 说明**：OneKey SDK 需要你提供邮箱和应用信息，这有助于我们在需要维护时联系你。
{% endhint %}

### 4️⃣ 连接设备

```javascript
// 搜索设备
const devices = await sdk.searchDevices();

// 连接第一个设备
const device = devices[0];
await sdk.connectDevice(device.path);
```

### 5️⃣ 调用方法

```javascript
// 获取比特币地址
const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true
});

console.log('Address:', result.address);
```

{% hint style="success" %}
**完成！** 你已经成功集成了 OneKey SDK。查看 [API 参考文档](api-reference/) 了解更多方法。
{% endhint %}

</details>

<details>
<summary>🌐 <strong>Web Browser 快速开始</strong></summary>

### 1️⃣ 安装包

```bash
npm install @onekey/hardware-web-sdk
```

或使用 CDN：

```html
<script src="https://unpkg.com/@onekey/hardware-web-sdk"></script>
```

### 2️⃣ 导入 SDK

```javascript
import OneKeySDK from '@onekey/hardware-web-sdk';
```

或使用全局变量：

```javascript
const OneKeySDK = window.OneKeySDK;
```

### 3️⃣ 初始化项目

```javascript
const sdk = new OneKeySDK({
    connectSrc: 'https://connect.onekey.so/',
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your App Name',
        appUrl: 'https://yourapp.com'
    }
});
```

### 4️⃣ 调用方法

```javascript
// SDK 会自动检测最佳连接方式
const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true
});

console.log('Address:', result.address);
```

{% hint style="warning" %}
**注意**：Web 环境下 SDK 会自动选择最佳的连接方式（WebUSB、Bridge 或 Deep Link）。
{% endhint %}

</details>

<details>
<summary>📱 <strong>React Native 快速开始</strong></summary>

### 1️⃣ 安装包

```bash
npm install @onekey/hardware-react-native-sdk
```

### 2️⃣ 配置权限

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
```

**iOS** (`ios/YourApp/Info.plist`):
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey devices</string>
```

### 3️⃣ 初始化 SDK

```javascript
import OneKeySDK from '@onekey/hardware-react-native-sdk';
import { Linking } from 'react-native';

const sdk = new OneKeySDK({
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your App Name',
        appUrl: 'https://yourapp.com'
    },
    deeplinkOpen: (url) => {
        Linking.openURL(url);
    },
    deeplinkCallbackUrl: 'yourapp://onekey-callback'
});
```

### 4️⃣ 处理回调

```javascript
useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
        sdk.handleDeeplink(event.url);
    });

    return () => subscription?.remove();
}, []);
```

### 5️⃣ 调用方法

```javascript
const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true
});
```

</details>

## 📚 下一步

{% hint style="success" %}
**恭喜！** 你已经了解了 OneKey SDK 的基本使用方法。
{% endhint %}

<table data-view="cards"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-cover data-type="files"></th><th data-hidden></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>📖 API 参考</strong></td><td>完整的 API 文档和方法说明</td><td></td><td></td><td></td><td><a href="api-reference/">api-reference</a></td></tr><tr><td><strong>🔧 完整示例</strong></td><td>各种场景的完整代码示例</td><td></td><td></td><td></td><td><a href="examples/">examples</a></td></tr><tr><td><strong>💡 最佳实践</strong></td><td>开发建议和安全指南</td><td></td><td></td><td></td><td><a href="guides/best-practices.md">best-practices.md</a></td></tr><tr><td><strong>❓ 常见问题</strong></td><td>常见问题解答和故障排除</td><td></td><td></td><td></td><td><a href="guides/troubleshooting.md">troubleshooting.md</a></td></tr></tbody></table>

**需要帮助？**
- [GitHub Issues](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
- [Discord 社区](https://discord.gg/onekey)
- [开发者邮箱](mailto:developer@onekey.so)
