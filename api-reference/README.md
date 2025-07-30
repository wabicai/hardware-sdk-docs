---
icon: code
---

# API 参考

{% hint style="info" %}
OneKey SDK 提供了完整的 API 来与 OneKey 硬件钱包进行交互。本节包含所有可用方法的详细文档。
{% endhint %}

## 📋 API 概览

OneKey SDK 的 API 按功能分为以下几个主要类别：

### 🔧 基础 API
核心的 SDK 初始化和设备管理功能：

| 方法 | 描述 | 支持环境 |
|------|------|----------|
| [`init()`](basic/init.md) | 初始化 SDK | 全部 |
| [`searchDevices()`](basic/search-devices.md) | 搜索可用设备 | Node.js |
| [`connectDevice()`](basic/connect-device.md) | 连接指定设备 | Node.js |
| [`getFeatures()`](basic/get-features.md) | 获取设备信息 | 全部 |

### 🔧 设备管理
设备配置和管理相关功能：

| 方法 | 描述 | 支持环境 |
|------|------|----------|
| [`deviceSettings()`](device-management/device-settings.md) | 设备设置管理 | 全部 |
| [`firmwareUpdate()`](device-management/firmware-update.md) | 固件更新 | 全部 |
| [`deviceVerification()`](device-management/device-verification.md) | 设备验证 | 全部 |

### ⛓️ 区块链方法
各种区块链的地址获取和交易签名：

#### Bitcoin & Forks
| 方法 | 描述 |
|------|------|
| [`btcGetAddress()`](blockchain/bitcoin.md#btcgetaddress) | 获取比特币地址 |
| [`btcGetPublicKey()`](blockchain/bitcoin.md#btcgetpublickey) | 获取比特币公钥 |
| [`btcSignTransaction()`](blockchain/bitcoin.md#btcsigntransaction) | 签名比特币交易 |
| [`btcSignMessage()`](blockchain/bitcoin.md#btcsignmessage) | 签名比特币消息 |

#### Ethereum & EVM
| 方法 | 描述 |
|------|------|
| [`ethereumGetAddress()`](blockchain/ethereum.md#ethereumgetaddress) | 获取以太坊地址 |
| [`ethereumGetPublicKey()`](blockchain/ethereum.md#ethereumgetpublickey) | 获取以太坊公钥 |
| [`ethereumSignTransaction()`](blockchain/ethereum.md#ethereumsigntransaction) | 签名以太坊交易 |
| [`ethereumSignMessage()`](blockchain/ethereum.md#ethereumsignmessage) | 签名以太坊消息 |

#### 其他区块链
| 区块链 | 支持方法 |
|--------|----------|
| [Solana](blockchain/solana.md) | 地址获取、交易签名、消息签名 |
| [Cardano](blockchain/cardano.md) | 地址获取、交易签名 |
| [更多链](blockchain/other-chains.md) | Cosmos、Near、Polkadot 等 |

## 🔄 通用响应格式

所有 OneKey SDK 方法都返回统一的响应格式：

```typescript
interface OneKeyResponse<T> {
    success: boolean;
    payload: T | { error: string; code?: string };
}
```

### 成功响应

```javascript
{
    success: true,
    payload: {
        // 具体的返回数据
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        path: "m/44'/0'/0'/0/0"
    }
}
```

### 错误响应

```javascript
{
    success: false,
    payload: {
        error: "Device not found",
        code: "Device_NotFound"
    }
}
```

## 🛠️ 通用参数

### 路径格式 (Path)

OneKey SDK 使用 BIP32 标准的派生路径：

```javascript
// BIP44 标准格式
"m/44'/coin_type'/account'/change/address_index"

// 示例
"m/44'/0'/0'/0/0"     // 比特币第一个地址
"m/44'/60'/0'/0/0"    // 以太坊第一个地址
"m/44'/501'/0'/0/0"   // Solana 第一个地址
```

### 常用币种类型

| 币种 | coin_type | 示例路径 |
|------|-----------|----------|
| Bitcoin | 0 | `m/44'/0'/0'/0/0` |
| Ethereum | 60 | `m/44'/60'/0'/0/0` |
| Solana | 501 | `m/44'/501'/0'/0/0` |
| Cardano | 1815 | `m/1852'/1815'/0'/0/0` |

### Manifest 配置

所有环境都需要提供 Manifest 信息：

```javascript
{
    email: 'developer@yourapp.com',    // 开发者邮箱 (必需)
    appName: 'Your Application',       // 应用名称 (必需)
    appUrl: 'https://yourapp.com'      // 应用网址 (必需)
}
```

## 🔍 方法查找

### 按功能查找

{% tabs %}
{% tab title="地址获取" %}
- [Bitcoin 地址](blockchain/bitcoin.md#btcgetaddress)
- [Ethereum 地址](blockchain/ethereum.md#ethereumgetaddress)
- [Solana 地址](blockchain/solana.md#solanagetaddress)
- [Cardano 地址](blockchain/cardano.md#cardanogetaddress)
{% endtab %}

{% tab title="交易签名" %}
- [Bitcoin 交易](blockchain/bitcoin.md#btcsigntransaction)
- [Ethereum 交易](blockchain/ethereum.md#ethereumsigntransaction)
- [Solana 交易](blockchain/solana.md#solanasigntransaction)
- [Cardano 交易](blockchain/cardano.md#cardanosigntransaction)
{% endtab %}

{% tab title="消息签名" %}
- [Bitcoin 消息](blockchain/bitcoin.md#btcsignmessage)
- [Ethereum 消息](blockchain/ethereum.md#ethereumsignmessage)
- [Solana 消息](blockchain/solana.md#solanasignmessage)
{% endtab %}

{% tab title="设备管理" %}
- [获取设备信息](basic/get-features.md)
- [设备设置](device-management/device-settings.md)
- [固件更新](device-management/firmware-update.md)
{% endtab %}
{% endtabs %}

### 按区块链查找

<table data-view="cards"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>🟠 Bitcoin</strong></td><td>比特币及其分叉币</td><td>BTC, BCH, LTC, DOGE 等</td><td><a href="blockchain/bitcoin.md">bitcoin.md</a></td></tr><tr><td><strong>🔷 Ethereum</strong></td><td>以太坊及 EVM 兼容链</td><td>ETH, BSC, Polygon 等</td><td><a href="blockchain/ethereum.md">ethereum.md</a></td></tr><tr><td><strong>🟣 Solana</strong></td><td>Solana 生态</td><td>SOL, SPL Token</td><td><a href="blockchain/solana.md">solana.md</a></td></tr><tr><td><strong>🔵 Cardano</strong></td><td>Cardano 生态</td><td>ADA</td><td><a href="blockchain/cardano.md">cardano.md</a></td></tr></tbody></table>

## 📖 使用示例

### 基础使用流程

```javascript
// 1. 初始化 SDK
const sdk = new OneKeySDK({
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your App',
        appUrl: 'https://yourapp.com'
    }
});

// 2. 连接设备 (Node.js 环境)
const devices = await sdk.searchDevices();
await sdk.connectDevice(devices[0].path);

// 3. 获取设备信息
const features = await sdk.getFeatures();
console.log('设备型号:', features.model);

// 4. 获取地址
const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true
});

if (result.success) {
    console.log('地址:', result.payload.address);
} else {
    console.error('错误:', result.payload.error);
}
```

### 错误处理示例

```javascript
try {
    const result = await sdk.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        showOnDevice: true
    });
    
    if (result.success) {
        // 处理成功结果
        console.log('地址:', result.payload.address);
    } else {
        // 处理业务错误
        console.error('业务错误:', result.payload.error);
    }
} catch (error) {
    // 处理系统错误
    switch (error.code) {
        case 'Device_NotFound':
            console.error('设备未找到');
            break;
        case 'User_Cancelled':
            console.error('用户取消操作');
            break;
        default:
            console.error('未知错误:', error.message);
    }
}
```

## 🔗 相关链接

- [快速开始指南](../getting-started/quick-start.md)
- [环境配置指南](../environments/)
- [错误处理指南](../advanced/error-handling.md)
- [最佳实践](../guides/best-practices.md)

{% hint style="success" %}
**开始探索 API！** 选择你需要的功能类别，查看详细的方法文档。
{% endhint %}
