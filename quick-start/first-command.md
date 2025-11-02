# First Command (BTC Address)

Run your first chain API call once `connectId` and `device_id` are known.

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

export async function getBtcAddress(connectId: string, deviceId: string) {
  const res = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: false,
  });

  if (!res.success) throw new Error(res.payload.error);
  return res.payload.address;
}
```

- Response shape and error codes: `hardware-sdk/common-params.md`, `hardware-sdk/error-code.md`
- For EVM, see `hardware-sdk/ethereum-and-evm/`