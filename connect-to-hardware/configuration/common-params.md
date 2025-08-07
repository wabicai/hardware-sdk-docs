# Common Parameters

## Web SDK (Recommended)

The **Web SDK** simplifies parameter management by handling device connection automatically:

```typescript
// Web SDK - No connectId/deviceId needed
const result = await OneKeyConnect.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true
});
```

**Advantages:**
- ✅ **Simplified API** - No need to manage connectId/deviceId
- ✅ **Automatic Device Management** - SDK handles device discovery and connection
- ✅ **Better UX** - Users don't need to understand technical parameters

## Advanced SDKs Parameters

For **Advanced SDKs** (BLE, Common Connect, Core), you need to manage three parameters:

```typescript
function call(connectId: string, deviceId: string, commonParams: CommonParams)
```

### Required Parameters

* **`connectId`**: Obtained from the `connectId` field returned by `searchDevices()`
  * The connect ID never changes for a device
  * Used to establish communication with the specific device
* **`deviceId`**: Obtained from the `deviceId` field returned by `getFeatures()`
  * Changes when the hardware is reset or wiped
  * Used for device identification and session management

### Getting Parameters for Advanced SDKs

```typescript
// 1. Search for devices
const devices = await HardwareSDK.searchDevices();
const { connectId } = devices.payload[0];

// 2. Get device features
const features = await HardwareSDK.getFeatures(connectId);
const { deviceId } = features.payload;

// 3. Use in API calls
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```
### Common Parameters (Advanced SDKs)

The `commonParams` object provides additional configuration options:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `retryCount` | `number` | 6 | Number of connection retries |
| `pollIntervalTime` | `number` | 1000 | Polling interval in ms (increases by 1.5x each retry) |
| `timeout` | `number` | - | Connection timeout in ms |
| `keepSession` | `boolean` | false | Persist session after API call |
| `passphraseState` | `string` | - | Passphrase state for passphrase wallets |
| `useEmptyPassphrase` | `boolean` | false | Allow empty passphrase |
| `initSession` | `boolean` | false | Initialize session with passphrase state |
| `deriveCardano` | `boolean` | true* | Derive Cardano seed (*true for Cardano methods only) |

### Example with Common Parameters

```typescript
// Advanced SDK with common parameters
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true
}, {
    retryCount: 3,
    timeout: 30000,
    keepSession: true
});
```

## Migration Recommendation

**For new projects:** Use the **Web SDK** to avoid parameter complexity.

**For existing projects:** Consider migrating to Web SDK for simplified integration:

```typescript
// Before (Advanced SDK)
const devices = await HardwareSDK.searchDevices();
const { connectId } = devices.payload[0];
const features = await HardwareSDK.getFeatures(connectId);
const { deviceId } = features.payload;
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, params);

// After (Web SDK)
const result = await OneKeyConnect.btcGetAddress(params);
```
