---
icon: download
---

# 安装指南

{% hint style="info" %}
本指南将帮助你在不同环境中正确安装 OneKey SDK。请根据你的开发环境选择对应的安装方法。
{% endhint %}

## 📦 包管理器安装

### Node.js/Electron Main

```bash
# 使用 npm
npm install @onekey/hardware-js-sdk

# 使用 yarn
yarn add @onekey/hardware-js-sdk

# 使用 pnpm
pnpm add @onekey/hardware-js-sdk
```

### Web Browser

```bash
# 使用 npm
npm install @onekey/hardware-web-sdk

# 使用 yarn
yarn add @onekey/hardware-web-sdk

# 使用 pnpm
pnpm add @onekey/hardware-web-sdk
```

### React Native

```bash
# 使用 npm
npm install @onekey/hardware-react-native-sdk

# 使用 yarn
yarn add @onekey/hardware-react-native-sdk

# 使用 pnpm
pnpm add @onekey/hardware-react-native-sdk
```

## 🌐 CDN 安装 (仅 Web)

### 通过 CDN 直接引入

```html
<!-- 最新版本 -->
<script src="https://unpkg.com/@onekey/hardware-web-sdk"></script>

<!-- 指定版本 -->
<script src="https://unpkg.com/@onekey/hardware-web-sdk@1.0.0"></script>

<!-- 从 jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@onekey/hardware-web-sdk"></script>
```

### ES 模块方式

```html
<script type="module">
  import OneKeySDK from 'https://unpkg.com/@onekey/hardware-web-sdk/dist/onekey-sdk.esm.js';
  
  // 使用 SDK
  const sdk = new OneKeySDK({
    // 配置选项
  });
</script>
```

## 🔧 环境特定配置

### Node.js 环境

**系统要求**：
- Node.js >= 14.0.0
- 支持的操作系统：Windows, macOS, Linux

**额外依赖**：
```bash
# 如果使用 USB 连接，可能需要安装 libusb
# macOS (使用 Homebrew)
brew install libusb

# Ubuntu/Debian
sudo apt-get install libusb-1.0-0-dev

# Windows (通常不需要额外安装)
```

**权限配置**：

**Linux 用户**需要配置 udev 规则：
```bash
# 创建 udev 规则文件
sudo nano /etc/udev/rules.d/51-onekey.rules

# 添加以下内容
SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c1", MODE="0666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c0", MODE="0666", GROUP="plugdev"

# 重新加载 udev 规则
sudo udevadm control --reload-rules
sudo udevadm trigger
```

### Web Browser 环境

**浏览器要求**：
- Chrome >= 61 (推荐)
- Firefox >= 55
- Safari >= 11
- Edge >= 79

**HTTPS 要求**：
{% hint style="warning" %}
WebUSB 功能需要 HTTPS 环境。在开发环境中，`localhost` 被视为安全上下文。
{% endhint %}

**Content Security Policy (CSP)**：
```html
<meta http-equiv="Content-Security-Policy" 
      content="connect-src 'self' https://connect.onekey.so; 
               frame-src https://connect.onekey.so;">
```

### React Native 环境

**React Native 版本要求**：
- React Native >= 0.60.0

**iOS 配置** (`ios/YourApp/Info.plist`):
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey devices</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey devices</string>
```

**Android 配置** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Android 12+ -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```

**Metro 配置** (`metro.config.js`):
```javascript
module.exports = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json'],
  },
};
```

### Browser Extension 环境

**Manifest V3 配置** (`manifest.json`):
```json
{
  "manifest_version": 3,
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "https://connect.onekey.so/*"
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';"
  }
}
```

**Manifest V2 配置** (`manifest.json`):
```json
{
  "manifest_version": 2,
  "permissions": [
    "storage",
    "https://connect.onekey.so/*"
  ],
  "content_security_policy": "script-src 'self'; object-src 'self';"
}
```

## ✅ 安装验证

### 基础验证

创建一个简单的测试文件来验证安装：

**Node.js**:
```javascript
// test.js
const OneKeySDK = require('@onekey/hardware-js-sdk');

console.log('OneKey SDK version:', OneKeySDK.version);
console.log('Installation successful!');
```

**Web Browser**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>OneKey SDK Test</title>
</head>
<body>
    <script src="https://unpkg.com/@onekey/hardware-web-sdk"></script>
    <script>
        console.log('OneKey SDK loaded:', typeof OneKeySDK !== 'undefined');
        console.log('Installation successful!');
    </script>
</body>
</html>
```

**React Native**:
```javascript
// App.js
import OneKeySDK from '@onekey/hardware-react-native-sdk';

console.log('OneKey SDK loaded:', OneKeySDK);
```

### 功能验证

```javascript
// 创建 SDK 实例
const sdk = new OneKeySDK({
    debug: true,
    manifest: {
        email: 'test@example.com',
        appName: 'Test App',
        appUrl: 'https://test.com'
    }
});

// 验证 SDK 初始化
console.log('SDK initialized:', sdk);
```

## 🚨 常见安装问题

### 权限错误

**问题**：`EACCES: permission denied`

**解决方案**：
```bash
# 使用 sudo (不推荐)
sudo npm install @onekey/hardware-js-sdk

# 推荐：配置 npm 全局目录
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### 网络问题

**问题**：下载超时或失败

**解决方案**：
```bash
# 使用国内镜像
npm install @onekey/hardware-js-sdk --registry=https://registry.npmmirror.com

# 或配置 .npmrc
echo "registry=https://registry.npmmirror.com" > ~/.npmrc
```

### 版本冲突

**问题**：依赖版本冲突

**解决方案**：
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

## 🔄 更新 SDK

### 检查当前版本

```bash
npm list @onekey/hardware-js-sdk
```

### 更新到最新版本

```bash
# npm
npm update @onekey/hardware-js-sdk

# yarn
yarn upgrade @onekey/hardware-js-sdk

# pnpm
pnpm update @onekey/hardware-js-sdk
```

### 更新到指定版本

```bash
npm install @onekey/hardware-js-sdk@1.2.0
```

## 🚀 下一步

安装完成后，继续阅读：

- [5分钟快速集成](quick-start.md) - 快速上手指南
- [环境特定指南](../environments/) - 详细的环境配置
- [API 参考](../api-reference/) - 完整的 API 文档

{% hint style="success" %}
**安装成功！** 现在你可以开始使用 OneKey SDK 了。如果遇到问题，请查看 [故障排除指南](../guides/troubleshooting.md)。
{% endhint %}
