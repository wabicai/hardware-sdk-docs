# Common Parameters

All SDK methods follow this pattern:

```typescript
HardwareSDK.methodName(connectId: string, deviceId: string, params: object)
```

## Required Parameters

* `connectId` — Device connection ID from `searchDevices()`
* `deviceId` — Device ID from `getFeatures()`

## Optional Parameters

* `retryCount` — Connection retries (default: 6)
* `timeout` — Connection timeout in ms
* `keepSession` — Persist session (default: false)
* `passphraseState` — Passphrase wallet state

