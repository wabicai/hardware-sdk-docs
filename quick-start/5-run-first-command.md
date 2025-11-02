# Step 5 · Run Your First Command

With the device authorised and `connectId` stored, you can call any API exposed by the Hardware SDK. Start with `btcGetAddress` to verify message signing, UI prompts, and response parsing.

## 5.1 Execute the call

Create a helper that wraps the SDK call and handles errors consistently.

```typescript
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

export async function fetchFirstAddress() {
  const connectId = sessionStorage.getItem('ONEKEY_CONNECT_ID');
  const deviceId = sessionStorage.getItem('ONEKEY_DEVICE_ID');

  if (!connectId || !deviceId) {
    throw new Error('Missing connectId or deviceId. Run the device discovery step first.');
  }

  const response = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/84'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true,
  });

  if (!response.success) {
    throw new Error(response.payload.error ?? 'btcGetAddress failed');
  }

  return response.payload.address;
}
```

Trigger the helper from your UI. The device will prompt you to confirm the path and address.

## 5.2 Validate the output

- Check the browser console for `HardwareSDK` logs. You should see the request and response payloads.
- Confirm that the hardware wallet displays the same address as the response.
- If the call fails, compare the returned `error` and `code` with the [Error Code table](../references/hardware-sdk/api-reference/error-code.md) to determine the fix.

## 5.3 Persist successful runs

Store the derived address alongside the timestamp. This helps when you open support tickets or reproduce a bug later.

You now have a working WebUSB integration. Continue to [Step 6](6-next-steps.md) to expand into additional transports and production hardening.
