---
icon: star
---

# 最佳实践

{% hint style="info" %}
本指南汇总了使用 OneKey SDK 的最佳实践，帮助你构建安全、稳定、用户友好的硬件钱包集成。
{% endhint %}

## 🔒 安全最佳实践

### 1. Manifest 信息安全

```javascript
// ✅ 正确：提供真实有效的信息
const sdk = new OneKeySDK({
    manifest: {
        email: 'security@yourcompany.com',  // 真实的安全联系邮箱
        appName: 'YourApp Official',        // 官方应用名称
        appUrl: 'https://yourapp.com'       // 官方网站地址
    }
});

// ❌ 错误：使用虚假或测试信息
const sdk = new OneKeySDK({
    manifest: {
        email: 'test@test.com',
        appName: 'Test App',
        appUrl: 'http://localhost'
    }
});
```

### 2. 敏感信息处理

```javascript
// ✅ 正确：不在日志中输出敏感信息
const result = await sdk.btcSignTransaction(params);
if (result.success) {
    console.log('交易签名成功');
    // 不要输出完整的签名结果
} else {
    console.error('签名失败:', result.payload.error);
}

// ❌ 错误：在日志中暴露敏感信息
console.log('签名结果:', result); // 可能包含私钥相关信息
```

### 3. 用户确认机制

```javascript
// ✅ 正确：重要操作要求设备确认
const result = await sdk.btcSignTransaction({
    inputs: [...],
    outputs: [...],
    coin: 'btc',
    // 重要：要求在设备上确认
    showOnDevice: true
});

// ✅ 正确：地址验证也要求设备显示
const addressResult = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true  // 让用户在设备上验证地址
});
```

## 🚀 性能最佳实践

### 1. 连接管理

```javascript
// ✅ 正确：复用 SDK 实例
class OneKeyManager {
    constructor() {
        this.sdk = null;
        this.isConnected = false;
    }
    
    async initialize() {
        if (!this.sdk) {
            this.sdk = new OneKeySDK({
                manifest: { /* ... */ }
            });
        }
        return this.sdk;
    }
    
    async ensureConnection() {
        if (!this.isConnected) {
            const devices = await this.sdk.searchDevices();
            if (devices.length > 0) {
                await this.sdk.connectDevice(devices[0].path);
                this.isConnected = true;
            }
        }
    }
    
    async cleanup() {
        if (this.sdk && this.isConnected) {
            await this.sdk.disconnect();
            this.isConnected = false;
        }
    }
}

// ❌ 错误：每次都创建新实例
async function getAddress() {
    const sdk = new OneKeySDK({ /* ... */ }); // 性能浪费
    return await sdk.btcGetAddress({ /* ... */ });
}
```

### 2. 批量操作优化

```javascript
// ✅ 正确：批量获取地址时优化用户体验
async function getBatchAddresses(paths) {
    const addresses = [];
    
    // 第一个地址在设备上显示，让用户确认
    const firstResult = await sdk.btcGetAddress({
        path: paths[0],
        showOnDevice: true
    });
    addresses.push(firstResult);
    
    // 后续地址不在设备上显示，提高效率
    for (let i = 1; i < paths.length; i++) {
        const result = await sdk.btcGetAddress({
            path: paths[i],
            showOnDevice: false
        });
        addresses.push(result);
    }
    
    return addresses;
}

// ❌ 错误：每个地址都要求设备确认
async function getBatchAddressesSlow(paths) {
    const addresses = [];
    for (const path of paths) {
        const result = await sdk.btcGetAddress({
            path,
            showOnDevice: true  // 用户体验差
        });
        addresses.push(result);
    }
    return addresses;
}
```

### 3. 缓存策略

```javascript
// ✅ 正确：缓存设备信息
class OneKeyCache {
    constructor() {
        this.deviceFeatures = null;
        this.addressCache = new Map();
    }
    
    async getDeviceFeatures(sdk) {
        if (!this.deviceFeatures) {
            this.deviceFeatures = await sdk.getFeatures();
        }
        return this.deviceFeatures;
    }
    
    async getAddress(sdk, path, coin) {
        const cacheKey = `${path}-${coin}`;
        
        if (this.addressCache.has(cacheKey)) {
            return this.addressCache.get(cacheKey);
        }
        
        const result = await sdk.btcGetAddress({
            path,
            coin,
            showOnDevice: false  // 缓存的地址不需要显示
        });
        
        if (result.success) {
            this.addressCache.set(cacheKey, result.payload.address);
        }
        
        return result;
    }
}
```

## 🎨 用户体验最佳实践

### 1. 状态管理

```javascript
// ✅ 正确：清晰的状态管理
class OneKeyUI {
    constructor() {
        this.state = {
            status: 'disconnected', // disconnected, connecting, connected, busy
            currentOperation: null,
            error: null
        };
    }
    
    async connectDevice() {
        this.updateState({ status: 'connecting' });
        
        try {
            const devices = await sdk.searchDevices();
            if (devices.length === 0) {
                throw new Error('未找到设备，请检查连接');
            }
            
            await sdk.connectDevice(devices[0].path);
            this.updateState({ status: 'connected', error: null });
            
        } catch (error) {
            this.updateState({ 
                status: 'disconnected', 
                error: error.message 
            });
        }
    }
    
    async performOperation(operation, params) {
        this.updateState({ 
            status: 'busy', 
            currentOperation: operation 
        });
        
        try {
            const result = await sdk[operation](params);
            this.updateState({ 
                status: 'connected', 
                currentOperation: null 
            });
            return result;
        } catch (error) {
            this.updateState({ 
                status: 'connected', 
                currentOperation: null,
                error: error.message 
            });
            throw error;
        }
    }
    
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.renderUI();
    }
}
```

### 2. 错误处理和用户提示

```javascript
// ✅ 正确：用户友好的错误处理
async function handleOneKeyOperation(operation) {
    try {
        const result = await operation();
        
        if (result.success) {
            showSuccessMessage('操作成功完成');
            return result.payload;
        } else {
            showErrorMessage(getErrorMessage(result.payload.error));
            return null;
        }
        
    } catch (error) {
        const userMessage = getUserFriendlyError(error);
        showErrorMessage(userMessage);
        return null;
    }
}

function getUserFriendlyError(error) {
    switch (error.code) {
        case 'Device_NotFound':
            return '请连接 OneKey 设备并解锁';
        case 'User_Cancelled':
            return '操作已取消';
        case 'Device_Disconnected':
            return '设备连接已断开，请重新连接';
        case 'Permission_Denied':
            return '设备访问权限被拒绝';
        case 'Transport_Missing':
            return '请安装 OneKey Bridge 或使用支持 WebUSB 的浏览器';
        default:
            return `操作失败：${error.message}`;
    }
}
```

### 3. 进度指示

```javascript
// ✅ 正确：提供操作进度反馈
async function signTransactionWithProgress(transactionData) {
    const progressSteps = [
        '准备交易数据...',
        '连接设备...',
        '请在设备上确认交易...',
        '正在签名...',
        '完成'
    ];
    
    let currentStep = 0;
    
    function updateProgress(step) {
        currentStep = step;
        showProgress(progressSteps[step], (step + 1) / progressSteps.length * 100);
    }
    
    try {
        updateProgress(0);
        
        // 准备交易数据
        const preparedTx = prepareTransaction(transactionData);
        updateProgress(1);
        
        // 确保设备连接
        await ensureDeviceConnection();
        updateProgress(2);
        
        // 签名交易
        const result = await sdk.btcSignTransaction(preparedTx);
        updateProgress(3);
        
        if (result.success) {
            updateProgress(4);
            hideProgress();
            return result.payload;
        } else {
            throw new Error(result.payload.error);
        }
        
    } catch (error) {
        hideProgress();
        throw error;
    }
}
```

## 🔧 开发最佳实践

### 1. 环境配置

```javascript
// ✅ 正确：环境特定配置
const config = {
    development: {
        debug: true,
        connectSrc: 'https://connect-dev.onekey.so/',
        timeout: { call: 60000 } // 开发环境延长超时
    },
    production: {
        debug: false,
        connectSrc: 'https://connect.onekey.so/',
        timeout: { call: 30000 }
    }
};

const env = process.env.NODE_ENV || 'development';
const sdk = new OneKeySDK({
    ...config[env],
    manifest: {
        email: process.env.ONEKEY_EMAIL,
        appName: process.env.APP_NAME,
        appUrl: process.env.APP_URL
    }
});
```

### 2. 测试策略

```javascript
// ✅ 正确：模拟 SDK 进行测试
class MockOneKeySDK {
    constructor(options) {
        this.options = options;
        this.mockResponses = new Map();
    }
    
    setMockResponse(method, response) {
        this.mockResponses.set(method, response);
    }
    
    async btcGetAddress(params) {
        const mockResponse = this.mockResponses.get('btcGetAddress');
        if (mockResponse) {
            return mockResponse;
        }
        
        // 默认模拟响应
        return {
            success: true,
            payload: {
                address: 'bc1qmock...',
                path: params.path
            }
        };
    }
}

// 测试用例
describe('OneKey Integration', () => {
    let sdk;
    
    beforeEach(() => {
        sdk = new MockOneKeySDK({
            manifest: { /* test manifest */ }
        });
    });
    
    it('should get bitcoin address', async () => {
        const result = await sdk.btcGetAddress({
            path: "m/44'/0'/0'/0/0",
            showOnDevice: false
        });
        
        expect(result.success).toBe(true);
        expect(result.payload.address).toMatch(/^bc1q/);
    });
});
```

### 3. 日志和监控

```javascript
// ✅ 正确：结构化日志
class OneKeyLogger {
    constructor(level = 'info') {
        this.level = level;
    }
    
    log(level, message, data = {}) {
        if (this.shouldLog(level)) {
            console.log(JSON.stringify({
                timestamp: new Date().toISOString(),
                level,
                message,
                data,
                source: 'onekey-sdk'
            }));
        }
    }
    
    info(message, data) {
        this.log('info', message, data);
    }
    
    error(message, error) {
        this.log('error', message, {
            error: error.message,
            code: error.code,
            stack: error.stack
        });
    }
    
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }
}

const logger = new OneKeyLogger('info');

// 使用示例
try {
    const result = await sdk.btcGetAddress(params);
    logger.info('Address retrieved successfully', {
        path: params.path,
        coin: params.coin
    });
} catch (error) {
    logger.error('Failed to get address', error);
}
```

## 📱 移动端最佳实践

### 1. React Native 权限处理

```javascript
// ✅ 正确：优雅的权限请求
import { PermissionsAndroid, Platform } from 'react-native';

async function requestBluetoothPermissions() {
    if (Platform.OS === 'android') {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];
        
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        const allGranted = permissions.every(
            permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED
        );
        
        if (!allGranted) {
            throw new Error('需要蓝牙权限才能连接 OneKey 设备');
        }
    }
}

// 在使用 SDK 前请求权限
async function initializeOneKey() {
    await requestBluetoothPermissions();
    
    const sdk = new OneKeySDK({
        manifest: { /* ... */ },
        deeplinkOpen: (url) => Linking.openURL(url),
        deeplinkCallbackUrl: 'yourapp://onekey-callback'
    });
    
    return sdk;
}
```

### 2. Deep Link 处理

```javascript
// ✅ 正确：完整的 Deep Link 处理
import { Linking } from 'react-native';

class OneKeyDeepLinkHandler {
    constructor(sdk) {
        this.sdk = sdk;
        this.subscription = null;
    }
    
    start() {
        // 监听 Deep Link
        this.subscription = Linking.addEventListener('url', this.handleDeepLink);
        
        // 处理应用启动时的 Deep Link
        Linking.getInitialURL().then(url => {
            if (url) {
                this.handleDeepLink({ url });
            }
        });
    }
    
    stop() {
        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
        }
    }
    
    handleDeepLink = ({ url }) => {
        if (url && url.includes('onekey-callback')) {
            this.sdk.handleDeeplink(url);
        }
    }
}

// 使用示例
const deepLinkHandler = new OneKeyDeepLinkHandler(sdk);
deepLinkHandler.start();

// 在组件卸载时清理
useEffect(() => {
    return () => {
        deepLinkHandler.stop();
    };
}, []);
```

## 🔗 相关文档

- [错误处理指南](../advanced/error-handling.md)
- [安全考虑](../advanced/security.md)
- [性能优化](../advanced/performance.md)
- [故障排除](troubleshooting.md)

{% hint style="success" %}
**遵循最佳实践！** 这些建议将帮助你构建更安全、更稳定、用户体验更好的 OneKey 集成。
{% endhint %}
