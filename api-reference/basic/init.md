---
icon: play
---

# 初始化 SDK

{% hint style="info" %}
`init()` 方法用于初始化 OneKey SDK，这是使用 SDK 的第一步。不同环境的初始化方式略有不同。
{% endhint %}

## 📋 方法签名

```typescript
constructor(options: OneKeySDKOptions)
```

## 🔧 参数说明

### OneKeySDKOptions

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `manifest` | `Manifest` | ✅ | 应用信息配置 |
| `debug` | `boolean` | ❌ | 是否启用调试模式 |
| `connectSrc` | `string` | ❌ | Connect 服务地址 (Web 环境) |
| `transport` | `TransportOptions` | ❌ | Transport 配置 (Node.js 环境) |
| `timeout` | `TimeoutOptions` | ❌ | 超时配置 |
| `retry` | `RetryOptions` | ❌ | 重试配置 |

### Manifest (必需)

```typescript
interface Manifest {
    email: string;      // 开发者邮箱
    appName: string;    // 应用名称
    appUrl: string;     // 应用网址
}
```

{% hint style="warning" %}
**重要**：Manifest 信息用于在设备上显示应用信息，并帮助我们在需要时联系开发者。请提供真实有效的信息。
{% endhint %}

### TransportOptions (Node.js)

```typescript
interface TransportOptions {
    type?: 'auto' | 'usb' | 'bluetooth' | 'bridge';
    bridgeUrl?: string;     // Bridge 服务地址
    usbTimeout?: number;    // USB 连接超时
    bluetoothTimeout?: number; // Bluetooth 连接超时
}
```

### TimeoutOptions

```typescript
interface TimeoutOptions {
    call?: number;      // 方法调用超时 (默认: 30000ms)
    transport?: number; // Transport 连接超时 (默认: 5000ms)
    device?: number;    // 设备响应超时 (默认: 10000ms)
}
```

### RetryOptions

```typescript
interface RetryOptions {
    count?: number;     // 重试次数 (默认: 3)
    delay?: number;     // 重试延迟 (默认: 1000ms)
}
```

## 🌍 环境特定配置

### Node.js/Electron Main

```javascript
const OneKeySDK = require('@onekey/hardware-js-sdk');

const sdk = new OneKeySDK({
    debug: true,
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Node.js App',
        appUrl: 'https://yourapp.com'
    },
    transport: {
        type: 'auto', // 自动选择最佳 Transport
    },
    timeout: {
        call: 30000,
        transport: 5000,
        device: 10000
    }
});
```

### Web Browser

```javascript
import OneKeySDK from '@onekey/hardware-web-sdk';

const sdk = new OneKeySDK({
    debug: true,
    connectSrc: 'https://connect.onekey.so/', // Connect 服务地址
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Web App',
        appUrl: window.location.origin
    }
});
```

### React Native

```javascript
import OneKeySDK from '@onekey/hardware-react-native-sdk';
import { Linking } from 'react-native';

const sdk = new OneKeySDK({
    debug: true,
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Mobile App',
        appUrl: 'https://yourapp.com'
    },
    deeplinkOpen: (url) => {
        Linking.openURL(url);
    },
    deeplinkCallbackUrl: 'yourapp://onekey-callback'
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

### 自定义 Transport (Node.js)

```javascript
const sdk = new OneKeySDK({
    transport: {
        type: 'usb',        // 强制使用 USB
        usbTimeout: 3000    // USB 连接超时 3 秒
    },
    manifest: { /* ... */ }
});

// 或使用 Bridge
const sdk = new OneKeySDK({
    transport: {
        type: 'bridge',
        bridgeUrl: 'http://localhost:21325'
    },
    manifest: { /* ... */ }
});
```

### 自定义超时和重试

```javascript
const sdk = new OneKeySDK({
    timeout: {
        call: 60000,      // 方法调用超时 60 秒
        transport: 3000,  // Transport 连接超时 3 秒
        device: 15000     // 设备响应超时 15 秒
    },
    retry: {
        count: 5,         // 重试 5 次
        delay: 2000       // 重试延迟 2 秒
    },
    manifest: { /* ... */ }
});
```

## 📱 环境检测

### 自动环境适配

```javascript
// 检测当前环境并自动配置
function createSDK() {
    const isNode = typeof window === 'undefined';
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
    
    if (isNode) {
        // Node.js 环境
        const OneKeySDK = require('@onekey/hardware-js-sdk');
        return new OneKeySDK({
            transport: { type: 'auto' },
            manifest: { /* ... */ }
        });
    } else if (isReactNative) {
        // React Native 环境
        const OneKeySDK = require('@onekey/hardware-react-native-sdk');
        return new OneKeySDK({
            deeplinkOpen: (url) => Linking.openURL(url),
            deeplinkCallbackUrl: 'yourapp://onekey-callback',
            manifest: { /* ... */ }
        });
    } else if (isBrowser) {
        // Web 浏览器环境
        const OneKeySDK = require('@onekey/hardware-web-sdk');
        return new OneKeySDK({
            connectSrc: 'https://connect.onekey.so/',
            manifest: { /* ... */ }
        });
    }
}

const sdk = createSDK();
```

## ✅ 初始化验证

### 检查初始化状态

```javascript
// 创建 SDK 实例
const sdk = new OneKeySDK({
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Test App',
        appUrl: 'https://test.com'
    }
});

// 验证 SDK 是否正确初始化
console.log('SDK 版本:', sdk.version);
console.log('SDK 初始化完成');

// 可选：测试基础功能
try {
    const features = await sdk.getFeatures();
    console.log('SDK 功能正常，设备信息:', features);
} catch (error) {
    console.log('SDK 初始化成功，等待设备连接');
}
```

### 初始化错误处理

```javascript
try {
    const sdk = new OneKeySDK({
        manifest: {
            email: 'invalid-email', // 无效邮箱
            appName: '',            // 空应用名
            appUrl: 'invalid-url'   // 无效 URL
        }
    });
} catch (error) {
    switch (error.code) {
        case 'Invalid_Manifest':
            console.error('Manifest 配置无效:', error.message);
            break;
        case 'Invalid_Email':
            console.error('邮箱格式无效');
            break;
        case 'Invalid_AppName':
            console.error('应用名称不能为空');
            break;
        case 'Invalid_AppUrl':
            console.error('应用 URL 格式无效');
            break;
        default:
            console.error('初始化失败:', error.message);
    }
}
```

## 🔄 重新初始化

### 更新配置

```javascript
// 如果需要更新配置，需要重新创建实例
let sdk = new OneKeySDK({
    debug: false,
    manifest: { /* ... */ }
});

// 更新为调试模式
sdk = new OneKeySDK({
    debug: true,  // 启用调试
    manifest: { /* ... */ }
});
```

### 清理资源

```javascript
// 在应用退出时清理资源 (Node.js)
process.on('exit', async () => {
    if (sdk) {
        await sdk.disconnect();
    }
});

// 在页面卸载时清理资源 (Web)
window.addEventListener('beforeunload', async () => {
    if (sdk) {
        await sdk.disconnect();
    }
});
```

## 📚 相关文档

- [搜索设备](search-devices.md) - 搜索可用的 OneKey 设备
- [连接设备](connect-device.md) - 连接到指定设备
- [获取设备信息](get-features.md) - 获取设备基本信息
- [环境配置指南](../../environments/) - 各环境的详细配置

## 💡 最佳实践

1. **总是提供真实的 Manifest 信息**
2. **在生产环境中关闭调试模式**
3. **根据环境选择合适的 Transport**
4. **设置合理的超时时间**
5. **在应用退出时清理资源**

{% hint style="success" %}
**初始化完成！** 现在你可以开始使用 OneKey SDK 的其他功能了。
{% endhint %}
