# checkBridgeStatus

> **DEPRECATED**: This API is deprecated when using WebUSB transport mode. With the current SDK using WebUSB for direct browser-to-device communication, OneKey Bridge is no longer required or used.

## Legacy helper status

Checks the operational status of the legacy desktop helper application.

**Note:** This method is only relevant for legacy implementations using Bridge. Modern implementations should use `env: 'webusb'` for initialization, which eliminates the need for Bridge software.

```typescript
const response = await HardwareSDK.checkBridgeStatus();
```

### Params

* empty

### Example

```typescript
const response = await HardwareSDK.checkBridgeStatus();
```

Result

```typescript
{
    success: true,
    payload: boolean
}
```

Error

```
{
    success: false,
    payload: {
        error: string, // error message
        code: number // error code
    }
}
```
