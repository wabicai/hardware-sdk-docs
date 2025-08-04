# Error Codes

## Error Format

```typescript
{
    success: false,
    payload: {
        error: string,
        code: number
    }
}
```

## Common Errors

| Code | Error | Description |
|------|-------|-------------|
| 1001 | Device_NotFound | No device detected |
| 1002 | Device_Disconnected | Device disconnected |
| 2001 | User_Cancelled | User cancelled operation |
| 2002 | User_Timeout | User timeout |
| 3001 | Invalid_Parameter | Invalid parameter |
| 3002 | Invalid_Path | Invalid BIP-44 path |
| 4001 | Firmware_NotCompatible | Firmware incompatible |
| 5001 | Network_Error | Network error |
## Error Handling

```typescript
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, params);

if (result.success) {
    console.log('Address:', result.payload.address);
} else {
    console.error('Error:', result.payload.error);
    console.error('Code:', result.payload.code);
}
```
