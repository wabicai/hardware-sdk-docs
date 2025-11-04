# Low-level transport plugin

Our Bluetooth SDK is developed using React Native. You may not be using React Native to develop your application, for example, you may be using Swift, Kotlin, or Flutter.At this point, adding a dependency on React Native to your project may not be a good choice.

We provide a new communication method where you can use the LowlevelTransportSharedPlugin to communicate with the hardware. You are free to use any technology stack of your choice. You will need to finish the protocol for device connect, disconnect, send data, and receive data.

Transport uses 64‑byte frames. Your plugin should send and receive one 64‑byte hex frame at a time; the JS SDK is responsible for assembling/disassembling full messages across frames. Refer to the protocol for padding of the final frame when needed.

Refer to the [Message protocol](onekey-message-protocol.md).

### LowlevelTransportSharedPlugin

```typescript
export type LowLevelDevice = { id: string; name: string };
export type LowlevelTransportSharedPlugin = {
  enumerate: () => Promise<LowLevelDevice[]>;
  send: (uuid: string, data: string) => Promise<void>;
  receive: () => Promise<string>;
  connect: (uuid: string) => Promise<void>;
  disconnect: (uuid: string) => Promise<void>;

  init: () => Promise<void>;
  version: string;
};
```

### Example

Here is an [iOS demo](https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/native-ios-example) written in Swift. Bridging native side and SDK through a WebView. Handling connections and data transmission using CoreBluetooth.

```typescript
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk'

function createLowlevelPlugin() {
  const plugin = {
    enumerate: () => {
      return Promise.resolve([{id: 'foo', name: 'bar'}])
    },
    send: (uuid, data) => {
      // TODO: send data
    },
    receive: () => {
      // Return ONE 64-byte hex frame; the SDK reassembles the full message
      return Promise.resolve('a1b2c3...');
    },
    connect: (uuid) => {
      // TODO: connect device
    },
    disconnect: (uuid)  => {
      // TODO: disconnect device
    },

    init: () => {
      // TODO: do some init work
    },

    version: 'OneKey-1.0'
  }
  return plugin
}

const plugin = createLowlevelPlugin()

const settings = {
  env: 'lowlevel', // LowlevelTransport requires the use of a lowlevel environment to be enabled.
  debug: true 
}

HardwareSDK.init(settings, undefined, plugin)
```

## Next

- iOS BLE (Native, low-level adapter) → [iOS Guide](./ios-ble.md)
- Android BLE (Native, low-level adapter) → [Android Guide](./android-ble.md)
- Flutter BLE (Native, low-level adapter) → [Flutter Guide](./flutter-ble.md)
