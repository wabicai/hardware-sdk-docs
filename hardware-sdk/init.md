# Init SDK

## initialization

Initialize the SDK and returns the initialization result to the caller.

```typescript
HardwareSDK.init(params);
```

### Params

* `debug` - _optional_ `boolean` print debug log option
* `fetchConfig`- _optional_ `boolean` Allows querying for updated device version information over the network, used for prompting device updates and informing which version is needed for older hardware to use new features.
* `env` - _optional_ `'webusb' | 'react-native' | 'lowlevel'` the environment to use the SDK
  - `'webusb'` - Use WebUSB protocol for direct browser-to-device USB communication (requires HTTPS)
  - `'react-native'` - Use for React Native applications with Bluetooth
  - `'lowlevel'` - Use for custom low-level transport implementations

### Example

**Web with WebUSB:**
```typescript
HardwareSDK.init({
    debug: false,
    fetchConfig: true,
    env: 'webusb', // Use WebUSB for direct USB communication
});
```

**React Native:**
```typescript
HardwareSDK.init({
    debug: false,
    fetchConfig: true,
    env: 'react-native',
});
```
