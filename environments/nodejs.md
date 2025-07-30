---
icon: terminal
---

# Node.js/Electron Main

{% hint style="info" %}
`@onekey/hardware-js-sdk` 是 OneKey SDK 的核心包，专为 Node.js 环境和 Electron 主进程设计，提供完整的硬件钱包功能。
{% endhint %}

## 🏗️ 架构概览

```mermaid
graph LR
    A[Your Node.js App] --> B[@onekey/hardware-js-sdk]
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

## ✨ 特点

- ✅ **完整功能**：支持所有 OneKey 硬件钱包功能
- ✅ **直接通信**：无需中间层，直接与设备通信
- ✅ **多种连接**：支持 USB、Bluetooth、Bridge 连接
- ✅ **最佳性能**：原生性能，无浏览器限制
- ✅ **事件支持**：完整的设备事件监听
- ⚠️ **系统权限**：需要适当的系统权限配置

## 📋 系统要求

### Node.js 版本
- **最低要求**：Node.js >= 14.0.0
- **推荐版本**：Node.js >= 16.0.0
- **TypeScript**：>= 4.0.0 (可选)

### 操作系统支持
| 操作系统 | 支持状态 | 备注 |
|----------|----------|------|
| **Windows** | ✅ 完全支持 | Windows 10+ |
| **macOS** | ✅ 完全支持 | macOS 10.14+ |
| **Linux** | ✅ 完全支持 | 需要 udev 规则配置 |

## 📦 安装

### 基础安装

```bash
# 使用 npm
npm install @onekey/hardware-js-sdk

# 使用 yarn
yarn add @onekey/hardware-js-sdk

# 使用 pnpm
pnpm add @onekey/hardware-js-sdk
```

### TypeScript 支持

```bash
# 类型定义已包含在包中，无需额外安装
npm install @onekey/hardware-js-sdk

# 如果使用 TypeScript，确保安装了类型支持
npm install --save-dev @types/node
```

## 🔧 环境配置

### Linux 权限配置

Linux 用户需要配置 udev 规则以允许访问 USB 设备：

```bash
# 创建 udev 规则文件
sudo nano /etc/udev/rules.d/51-onekey.rules
```

添加以下内容：
```bash
# OneKey Classic
SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c1", MODE="0666", GROUP="plugdev"
# OneKey Touch
SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c0", MODE="0666", GROUP="plugdev"
# OneKey Pro
SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c2", MODE="0666", GROUP="plugdev"
```

重新加载规则：
```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

### macOS 权限配置

macOS 通常不需要额外配置，但如果使用 Bluetooth，需要授权：

```bash
# 如果使用 Homebrew 安装的 Node.js，可能需要
brew install libusb
```

### Windows 权限配置

Windows 通常不需要额外配置，驱动会自动安装。

## 🚀 快速开始

### 基础初始化

```javascript
const OneKeySDK = require('@onekey/hardware-js-sdk');

// 创建 SDK 实例
const sdk = new OneKeySDK({
    debug: true, // 开发环境启用调试
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Application',
        appUrl: 'https://yourapp.com'
    }
});
```

### TypeScript 使用

```typescript
import OneKeySDK, { 
    OneKeySDKOptions, 
    SearchDevicesResponse,
    BtcGetAddressParams 
} from '@onekey/hardware-js-sdk';

const options: OneKeySDKOptions = {
    debug: true,
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Application',
        appUrl: 'https://yourapp.com'
    }
};

const sdk = new OneKeySDK(options);
```

### 设备连接

```javascript
async function connectDevice() {
    try {
        // 搜索设备
        const devices = await sdk.searchDevices();
        console.log('找到设备:', devices);
        
        if (devices.length === 0) {
            throw new Error('未找到设备');
        }
        
        // 连接第一个设备
        const device = devices[0];
        await sdk.connectDevice(device.path);
        
        console.log('设备连接成功');
        return device;
        
    } catch (error) {
        console.error('连接失败:', error);
        throw error;
    }
}
```

## 🔌 Transport 配置

Node.js 环境支持多种 Transport 方式：

### USB/HID Transport (默认)

```javascript
const sdk = new OneKeySDK({
    transport: {
        type: 'usb',
        // USB 特定配置
    },
    manifest: { /* ... */ }
});
```

### Bluetooth Transport

```javascript
const sdk = new OneKeySDK({
    transport: {
        type: 'bluetooth',
        // Bluetooth 特定配置
    },
    manifest: { /* ... */ }
});
```

### Bridge Transport

```javascript
const sdk = new OneKeySDK({
    transport: {
        type: 'bridge',
        bridgeUrl: 'http://localhost:21325', // OneKey Bridge 地址
    },
    manifest: { /* ... */ }
});
```

### 自动检测 Transport

```javascript
const sdk = new OneKeySDK({
    transport: {
        type: 'auto', // 自动选择最佳 Transport
    },
    manifest: { /* ... */ }
});
```

## 📱 设备管理

### 搜索设备

```javascript
// 搜索所有可用设备
const devices = await sdk.searchDevices();

// 搜索特定类型设备
const devices = await sdk.searchDevices({
    transport: 'usb' // 'usb' | 'bluetooth' | 'bridge'
});
```

### 连接设备

```javascript
// 连接指定设备
await sdk.connectDevice(devicePath);

// 连接并获取设备信息
const features = await sdk.getFeatures();
console.log('设备信息:', features);
```

### 设备事件监听

```javascript
// 监听设备连接
sdk.on('device-connect', (device) => {
    console.log('设备已连接:', device);
});

// 监听设备断开
sdk.on('device-disconnect', (device) => {
    console.log('设备已断开:', device);
});

// 监听设备状态变化
sdk.on('device-changed', (device) => {
    console.log('设备状态变化:', device);
});
```

## 💰 基础操作示例

### 获取地址

```javascript
// 获取比特币地址
const btcAddress = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true,
    coin: 'btc'
});

// 获取以太坊地址
const ethAddress = await sdk.ethereumGetAddress({
    path: "m/44'/60'/0'/0/0",
    showOnDevice: true
});
```

### 签名交易

```javascript
// 比特币签名
const btcSignResult = await sdk.btcSignTransaction({
    inputs: [/* ... */],
    outputs: [/* ... */],
    coin: 'btc'
});

// 以太坊签名
const ethSignResult = await sdk.ethereumSignTransaction({
    path: "m/44'/60'/0'/0/0",
    transaction: {
        to: '0x...',
        value: '0x...',
        gasLimit: '0x5208',
        gasPrice: '0x...'
    }
});
```

## 🔧 高级配置

### 自定义日志

```javascript
const sdk = new OneKeySDK({
    debug: true,
    logger: {
        log: (message) => console.log(`[OneKey] ${message}`),
        error: (message) => console.error(`[OneKey Error] ${message}`),
        warn: (message) => console.warn(`[OneKey Warning] ${message}`)
    },
    manifest: { /* ... */ }
});
```

### 超时配置

```javascript
const sdk = new OneKeySDK({
    timeout: {
        call: 30000,      // 方法调用超时 (30秒)
        transport: 5000,  // Transport 连接超时 (5秒)
        device: 10000     // 设备响应超时 (10秒)
    },
    manifest: { /* ... */ }
});
```

### 重试配置

```javascript
const sdk = new OneKeySDK({
    retry: {
        count: 3,         // 重试次数
        delay: 1000       // 重试延迟 (毫秒)
    },
    manifest: { /* ... */ }
});
```

## 🛠️ Electron 集成

### 主进程中使用

```javascript
// main.js
const { app, BrowserWindow } = require('electron');
const OneKeySDK = require('@onekey/hardware-js-sdk');

let mainWindow;
let sdk;

app.whenReady().then(() => {
    // 初始化 SDK
    sdk = new OneKeySDK({
        manifest: {
            email: 'developer@yourapp.com',
            appName: 'Your Electron App',
            appUrl: 'https://yourapp.com'
        }
    });
    
    createWindow();
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
}
```

### IPC 通信

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('onekey', {
    getAddress: (params) => ipcRenderer.invoke('onekey-get-address', params),
    signTransaction: (params) => ipcRenderer.invoke('onekey-sign-transaction', params)
});

// main.js 中处理 IPC
const { ipcMain } = require('electron');

ipcMain.handle('onekey-get-address', async (event, params) => {
    try {
        const result = await sdk.btcGetAddress(params);
        return result;
    } catch (error) {
        throw error;
    }
});
```

## 📊 性能优化

### 连接池管理

```javascript
class OneKeyManager {
    constructor() {
        this.sdk = null;
        this.connected = false;
    }
    
    async initialize() {
        if (!this.sdk) {
            this.sdk = new OneKeySDK({
                manifest: { /* ... */ }
            });
        }
        
        if (!this.connected) {
            const devices = await this.sdk.searchDevices();
            if (devices.length > 0) {
                await this.sdk.connectDevice(devices[0].path);
                this.connected = true;
            }
        }
        
        return this.sdk;
    }
    
    async cleanup() {
        if (this.sdk && this.connected) {
            await this.sdk.disconnect();
            this.connected = false;
        }
    }
}
```

### 批量操作

```javascript
// 批量获取地址
async function getBatchAddresses(paths) {
    const addresses = [];
    
    for (const path of paths) {
        try {
            const result = await sdk.btcGetAddress({
                path,
                showOnDevice: false // 批量操作时不在设备上显示
            });
            addresses.push(result);
        } catch (error) {
            console.error(`获取地址失败 ${path}:`, error);
        }
    }
    
    return addresses;
}
```

## 🚨 错误处理

### 常见错误类型

```javascript
try {
    const result = await sdk.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        showOnDevice: true
    });
} catch (error) {
    switch (error.code) {
        case 'Device_NotFound':
            console.error('设备未找到');
            break;
        case 'Device_Disconnected':
            console.error('设备已断开连接');
            break;
        case 'User_Cancelled':
            console.error('用户取消操作');
            break;
        case 'Permission_Denied':
            console.error('权限被拒绝');
            break;
        default:
            console.error('未知错误:', error);
    }
}
```

## 📚 完整示例

查看完整的 Node.js 示例：

- [基础 Node.js 示例](../examples/nodejs.md)
- [Electron 应用示例](../examples/electron.md)
- [CLI 工具示例](../examples/cli-tool.md)

## 🔗 相关链接

- [API 参考文档](../api-reference/)
- [Transport 层详解](../advanced/transport-layer.md)
- [错误处理指南](../advanced/error-handling.md)
- [最佳实践](../guides/best-practices.md)

{% hint style="success" %}
**Node.js 环境配置完成！** 现在你可以在 Node.js 应用中使用 OneKey SDK 的完整功能了。
{% endhint %}
