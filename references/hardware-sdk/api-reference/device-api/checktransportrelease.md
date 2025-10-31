# checkTransportRelease

> **DEPRECATED**: Common Connect handles WebUSB and native transports directly. This helper is only relevant for legacy desktop setups that relied on the OneKey Bridge background service.

## Legacy transport release info

Check the version update status of the legacy hardware connection tool.

```typescript
const response = await HardwareSDK.checkTransportRelease();
```

### Params

* empty

### Example

```typescript
const response = await HardwareSDK.checkTransportRelease();
```

Result

```typescript
{
  success: true,
  payload: string, // legacy desktop status, 'valid' or 'outdated'
}
```

Error

```typescript
{
    success: false,
    payload: {
        error: string, // error message
        code: number // error code
    }
}
```
