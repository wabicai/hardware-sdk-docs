---
icon: globe
---

# Web Browser

{% hint style="info" %}
`@onekey/hardware-web-sdk` 专为 Web 浏览器环境设计，提供安全、兼容的硬件钱包集成方案。
{% endhint %}

## 🏗️ 架构概览

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

## ✨ 特点

- 🔄 **自动检测**：智能选择最佳连接方式
- 🌐 **跨浏览器**：支持主流浏览器
- 📱 **移动友好**：自动回退到移动端方案
- 🔒 **安全隔离**：iframe/popup 安全模式
- 🚀 **轻量级**：优化的包大小
- ⚡ **即插即用**：无需复杂配置

## 📋 浏览器支持

| 浏览器 | 版本要求 | WebUSB 支持 | 备注 |
|--------|----------|-------------|------|
| **Chrome** | >= 61 | ✅ | 推荐使用 |
| **Edge** | >= 79 | ✅ | 基于 Chromium |
| **Opera** | >= 48 | ✅ | 基于 Chromium |
| **Firefox** | >= 55 | ❌ | 通过 Bridge |
| **Safari** | >= 11 | ❌ | 通过 Bridge |

{% hint style="info" %}
**WebUSB 说明**：WebUSB 需要 HTTPS 环境，开发环境中 `localhost` 被视为安全上下文。
{% endhint %}

## 📦 安装方式

### NPM 安装

```bash
# 使用 npm
npm install @onekey/hardware-web-sdk

# 使用 yarn
yarn add @onekey/hardware-web-sdk

# 使用 pnpm
pnpm add @onekey/hardware-web-sdk
```

### CDN 引入

```html
<!-- 最新版本 -->
<script src="https://unpkg.com/@onekey/hardware-web-sdk"></script>

<!-- 指定版本 -->
<script src="https://unpkg.com/@onekey/hardware-web-sdk@1.0.0"></script>

<!-- ES 模块 -->
<script type="module">
  import OneKeySDK from 'https://unpkg.com/@onekey/hardware-web-sdk/dist/onekey-sdk.esm.js';
</script>
```

## 🔧 环境配置

### HTTPS 要求

WebUSB 功能需要 HTTPS 环境：

```bash
# 开发环境使用 localhost (自动视为安全上下文)
http://localhost:3000  ✅
https://localhost:3000 ✅

# 生产环境必须使用 HTTPS
https://yourapp.com    ✅
http://yourapp.com     ❌
```

### Content Security Policy (CSP)

如果你的网站使用 CSP，需要添加以下配置：

```html
<meta http-equiv="Content-Security-Policy" 
      content="connect-src 'self' https://connect.onekey.so; 
               frame-src https://connect.onekey.so;
               script-src 'self' 'unsafe-inline';">
```

### 跨域配置

如果需要自定义 Connect 服务地址：

```javascript
const sdk = new OneKeySDK({
    connectSrc: 'https://your-custom-connect.com',
    // 其他配置...
});
```

## 🚀 快速开始

### 基础初始化

```javascript
// ES6 模块
import OneKeySDK from '@onekey/hardware-web-sdk';

// 或 CommonJS
const OneKeySDK = require('@onekey/hardware-web-sdk');

// 或全局变量 (CDN)
const OneKeySDK = window.OneKeySDK;

// 创建 SDK 实例
const sdk = new OneKeySDK({
    debug: true,
    connectSrc: 'https://connect.onekey.so/',
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Web App',
        appUrl: window.location.origin
    }
});
```

### 连接模式配置

```javascript
// iframe 模式 (默认，推荐)
const sdk = new OneKeySDK({
    mode: 'iframe',
    manifest: { /* ... */ }
});

// popup 模式
const sdk = new OneKeySDK({
    mode: 'popup',
    manifest: { /* ... */ }
});

// 自动模式 (根据环境自动选择)
const sdk = new OneKeySDK({
    mode: 'auto',
    manifest: { /* ... */ }
});
```

## 🔌 连接方式详解

### WebUSB 直连

支持 WebUSB 的浏览器可以直接连接设备：

```javascript
// 检查 WebUSB 支持
if (navigator.usb) {
    console.log('支持 WebUSB 直连');
} else {
    console.log('不支持 WebUSB，将使用 Bridge');
}

// SDK 会自动检测并使用最佳方式
const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true
});
```

### Bridge 连接

通过 OneKey Bridge 连接设备：

```javascript
// 检查 Bridge 状态
const bridgeStatus = await sdk.checkBridgeStatus();
console.log('Bridge 状态:', bridgeStatus);

// 如果 Bridge 未运行，引导用户安装
if (!bridgeStatus.available) {
    console.log('请安装 OneKey Bridge');
    // 显示安装指南
}
```

### 移动端 Deep Link

移动设备自动使用 Deep Link 方式：

```javascript
// 移动端检测
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    console.log('移动端环境，将使用 Deep Link');
}

// SDK 自动处理移动端连接
const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true
});
```

## 🎨 UI 集成

### 基础 HTML 示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OneKey Web Demo</title>
    <style>
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .result { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
        .error { background: #f8d7da; color: #721c24; }
        .success { background: #d4edda; color: #155724; }
    </style>
</head>
<body>
    <div class="container">
        <h1>OneKey Web SDK Demo</h1>
        
        <button class="button" onclick="connectDevice()">连接设备</button>
        <button class="button" onclick="getAddress()">获取地址</button>
        <button class="button" onclick="signMessage()">签名消息</button>
        
        <div id="result" class="result"></div>
    </div>

    <script src="https://unpkg.com/@onekey/hardware-web-sdk"></script>
    <script>
        // SDK 初始化
        const sdk = new OneKeySDK({
            debug: true,
            manifest: {
                email: 'developer@example.com',
                appName: 'OneKey Web Demo',
                appUrl: window.location.origin
            }
        });

        // 显示结果
        function showResult(message, isError = false) {
            const resultDiv = document.getElementById('result');
            resultDiv.className = `result ${isError ? 'error' : 'success'}`;
            resultDiv.innerHTML = message;
        }

        // 连接设备
        async function connectDevice() {
            try {
                showResult('正在连接设备...');
                const features = await sdk.getFeatures();
                showResult(`设备连接成功！<br>设备型号: ${features.model}<br>固件版本: ${features.major_version}.${features.minor_version}.${features.patch_version}`);
            } catch (error) {
                showResult(`连接失败: ${error.message}`, true);
            }
        }

        // 获取地址
        async function getAddress() {
            try {
                showResult('正在获取地址...');
                const result = await sdk.btcGetAddress({
                    path: "m/44'/0'/0'/0/0",
                    showOnDevice: true,
                    coin: 'btc'
                });
                
                if (result.success) {
                    showResult(`地址获取成功！<br>地址: ${result.payload.address}<br>路径: ${result.payload.path}`);
                } else {
                    showResult(`获取地址失败: ${result.payload.error}`, true);
                }
            } catch (error) {
                showResult(`获取地址出错: ${error.message}`, true);
            }
        }

        // 签名消息
        async function signMessage() {
            try {
                showResult('正在签名消息...');
                const result = await sdk.btcSignMessage({
                    path: "m/44'/0'/0'/0/0",
                    message: 'Hello OneKey!',
                    coin: 'btc'
                });
                
                if (result.success) {
                    showResult(`消息签名成功！<br>签名: ${result.payload.signature}`);
                } else {
                    showResult(`签名失败: ${result.payload.error}`, true);
                }
            } catch (error) {
                showResult(`签名出错: ${error.message}`, true);
            }
        }
    </script>
</body>
</html>
```

### React 集成示例

```jsx
import React, { useState, useEffect } from 'react';
import OneKeySDK from '@onekey/hardware-web-sdk';

const OneKeyDemo = () => {
    const [sdk, setSdk] = useState(null);
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // 初始化 SDK
        const sdkInstance = new OneKeySDK({
            debug: true,
            manifest: {
                email: 'developer@example.com',
                appName: 'OneKey React Demo',
                appUrl: window.location.origin
            }
        });
        
        setSdk(sdkInstance);
    }, []);

    const connectDevice = async () => {
        if (!sdk) return;
        
        setLoading(true);
        setError('');
        
        try {
            const features = await sdk.getFeatures();
            setConnected(true);
            console.log('设备连接成功:', features);
        } catch (err) {
            setError(`连接失败: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getAddress = async () => {
        if (!sdk) return;
        
        setLoading(true);
        setError('');
        
        try {
            const result = await sdk.btcGetAddress({
                path: "m/44'/0'/0'/0/0",
                showOnDevice: true,
                coin: 'btc'
            });
            
            if (result.success) {
                setAddress(result.payload.address);
            } else {
                setError(`获取地址失败: ${result.payload.error}`);
            }
        } catch (err) {
            setError(`获取地址出错: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>OneKey React Demo</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={connectDevice} 
                    disabled={loading || connected}
                    style={{ 
                        padding: '10px 20px', 
                        marginRight: '10px',
                        backgroundColor: connected ? '#28a745' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '连接中...' : connected ? '已连接' : '连接设备'}
                </button>
                
                <button 
                    onClick={getAddress} 
                    disabled={loading || !connected}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading || !connected ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '获取中...' : '获取地址'}
                </button>
            </div>

            {error && (
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            {address && (
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '5px',
                    wordBreak: 'break-all'
                }}>
                    <strong>地址:</strong> {address}
                </div>
            )}
        </div>
    );
};

export default OneKeyDemo;
```

### Vue 集成示例

```vue
<template>
  <div class="onekey-demo">
    <h1>OneKey Vue Demo</h1>
    
    <div class="buttons">
      <button 
        @click="connectDevice" 
        :disabled="loading || connected"
        :class="{ connected: connected }"
      >
        {{ loading ? '连接中...' : connected ? '已连接' : '连接设备' }}
      </button>
      
      <button 
        @click="getAddress" 
        :disabled="loading || !connected"
      >
        {{ loading ? '获取中...' : '获取地址' }}
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="address" class="success">
      <strong>地址:</strong> {{ address }}
    </div>
  </div>
</template>

<script>
import OneKeySDK from '@onekey/hardware-web-sdk';

export default {
  name: 'OneKeyDemo',
  data() {
    return {
      sdk: null,
      connected: false,
      address: '',
      loading: false,
      error: ''
    };
  },
  mounted() {
    this.initSDK();
  },
  methods: {
    initSDK() {
      this.sdk = new OneKeySDK({
        debug: true,
        manifest: {
          email: 'developer@example.com',
          appName: 'OneKey Vue Demo',
          appUrl: window.location.origin
        }
      });
    },
    
    async connectDevice() {
      if (!this.sdk) return;
      
      this.loading = true;
      this.error = '';
      
      try {
        const features = await this.sdk.getFeatures();
        this.connected = true;
        console.log('设备连接成功:', features);
      } catch (err) {
        this.error = `连接失败: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    
    async getAddress() {
      if (!this.sdk) return;
      
      this.loading = true;
      this.error = '';
      
      try {
        const result = await this.sdk.btcGetAddress({
          path: "m/44'/0'/0'/0/0",
          showOnDevice: true,
          coin: 'btc'
        });
        
        if (result.success) {
          this.address = result.payload.address;
        } else {
          this.error = `获取地址失败: ${result.payload.error}`;
        }
      } catch (err) {
        this.error = `获取地址出错: ${err.message}`;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.onekey-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.buttons {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button.connected {
  background-color: #28a745;
}

.error {
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 5px;
  margin-bottom: 20px;
}

.success {
  padding: 15px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 5px;
  word-break: break-all;
}
</style>
```

## 🔧 高级配置

### 自定义 Connect 服务

```javascript
const sdk = new OneKeySDK({
    connectSrc: 'https://your-custom-connect.com',
    iframeSrc: 'https://your-custom-connect.com/iframe.html',
    popupSrc: 'https://your-custom-connect.com/popup.html',
    manifest: { /* ... */ }
});
```

### 事件监听

```javascript
// 监听连接状态
sdk.on('device-connect', (device) => {
    console.log('设备已连接:', device);
});

sdk.on('device-disconnect', () => {
    console.log('设备已断开');
});

// 监听用户交互
sdk.on('ui-request_pin', () => {
    console.log('需要输入 PIN');
});

sdk.on('ui-request_passphrase', () => {
    console.log('需要输入密码短语');
});
```

### 错误处理

```javascript
try {
    const result = await sdk.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        showOnDevice: true
    });
} catch (error) {
    switch (error.code) {
        case 'Device_NotFound':
            // 引导用户连接设备
            break;
        case 'Method_Interrupted':
            // 用户取消操作
            break;
        case 'Transport_Missing':
            // 引导用户安装 Bridge
            break;
        default:
            console.error('未知错误:', error);
    }
}
```

## 📚 完整示例

查看更多 Web 集成示例：

- [基础 Web 示例](../examples/web-app.md)
- [React 应用示例](../examples/react-app.md)
- [Vue 应用示例](../examples/vue-app.md)
- [Angular 应用示例](../examples/angular-app.md)

## 🔗 相关链接

- [API 参考文档](../api-reference/)
- [浏览器扩展集成](browser-extension.md)
- [错误处理指南](../advanced/error-handling.md)
- [最佳实践](../guides/best-practices.md)

{% hint style="success" %}
**Web 环境配置完成！** 现在你可以在 Web 应用中使用 OneKey SDK 了。
{% endhint %}
