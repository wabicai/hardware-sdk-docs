# GitBook 交互式文档示例

## 1. Tabs (选项卡)
{% tabs %}
{% tab title="Node.js" %}
```bash
npm install @onekeyfe/hd-core
```

Node.js 环境下的 SDK 使用方式...
{% endtab %}

{% tab title="Web" %}
```bash
npm install @onekeyfe/hd-web-sdk
```

Web 环境下的 SDK 使用方式...
{% endtab %}

{% tab title="Mobile" %}
```bash
npm install @onekeyfe/hd-ble-sdk
```

移动端环境下的 SDK 使用方式...
{% endtab %}
{% endtabs %}

## 2. Expandable (可折叠内容)
{% details title="快速开始指南" %}
### 安装步骤

1. 安装 SDK 包
```bash
npm install @onekeyfe/hd-core
```

2. 初始化 SDK
```javascript
await HardwareSDK.init({
    debug: false,
    fetchConfig: true
});
```

3. 连接设备
```javascript
const devices = await HardwareSDK.searchDevices();
```
{% enddetails %}

## 3. Hint (提示框)
{% hint style="info" %}
💡 **提示**: 选择合适的 SDK 包很重要，请根据你的开发环境选择对应的包。
{% endhint %}

{% hint style="warning" %}
⚠️ **注意**: Web 环境需要用户手动确认设备连接权限。
{% endhint %}

{% hint style="success" %}
✅ **成功**: 按照上述步骤，你就可以成功集成 OneKey SDK 了！
{% endhint %}

## 4. Code Groups (代码分组)
{% code-group %}
```javascript [JavaScript]
import HardwareSDK from '@onekeyfe/hd-core';

const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```

```typescript [TypeScript]
import HardwareSDK from '@onekeyfe/hd-core';
import type { BtcGetAddressParams } from '@onekeyfe/hd-core';

const params: BtcGetAddressParams = {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
};

const result = await HardwareSDK.btcGetAddress(connectId, deviceId, params);
```

```python [Python]
# Python SDK example (if available)
from onekey_hardware import HardwareSDK

result = HardwareSDK.btc_get_address(
    connect_id=connect_id,
    device_id=device_id,
    path="m/44'/0'/0'/0/0",
    coin="btc"
)
```
{% endcode-group %}

## 5. Embed (嵌入式内容)
{% embed url="https://hardware-example.onekeytest.com/expo-playground/" %}
OneKey SDK 交互式测试工具
{% endembed %}

## 6. Cards Layout (卡片布局)
<div class="grid grid-cols-2 gap-4">

**🖥️ Node.js**
适用于服务器应用、CLI 工具、Electron 主进程
[了解更多 →](configuration/installation.md)

**🌐 Web**  
适用于 Web 应用和浏览器扩展
[了解更多 →](configuration/installation.md)

**📱 Mobile**
适用于 React Native 和移动应用
[了解更多 →](configuration/installation.md)

**🔧 Air Gap**
适用于离线签名和二维码交互
[了解更多 →](air-gap-sdk/README.md)

</div>

## 7. Interactive Elements
### 环境对比表

| 环境 | 包名 | 用途 | 连接方式 |
|------|------|------|----------|
| Node.js | `@onekeyfe/hd-core` | 服务器应用、CLI 工具 | USB/桥接 |
| Web | `@onekeyfe/hd-web-sdk` | Web 应用、浏览器扩展 | USB/桥接/WebUSB |
| Mobile | `@onekeyfe/hd-ble-sdk` | React Native、移动应用 | 蓝牙 LE |

### 快速选择指南
{% hint style="info" %}
**还不确定选哪个？**

- 🖥️ 如果你在开发 **桌面应用** 或 **服务器应用** → 选择 Node.js
- 🌐 如果你在开发 **网站** 或 **浏览器扩展** → 选择 Web  
- 📱 如果你在开发 **手机应用** → 选择 Mobile
{% endhint %}