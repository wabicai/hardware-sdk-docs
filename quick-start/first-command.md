# Signer (First Signature)

Make your first signing call once `connectId` and `device_id` are known. Example below uses EVM message signing (EIP‑191 personal_sign style).

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

export async function signEvmMessage(connectId: string, deviceId: string) {
  const message = 'Hello OneKey';
  const messageHex = Buffer.from(message).toString('hex');

  const res = await HardwareSDK.evmSignMessage(connectId, deviceId, {
    path: "m/44'/60'/0'",
    messageHex,
    chainId: 1,
  });

  if (!res.success) throw new Error(res.payload.error);
  return {
    address: res.payload.address,
    signature: res.payload.signature,
  };
}
```

- Response shape and error codes: `hardware-sdk/common-params.md`, `hardware-sdk/error-code.md`
- For BTC message signing, see `hardware-sdk/bitcoin-and-bitcoin-forks/btcsignmessage.md`
- For typed data (EIP‑712), see `hardware-sdk/ethereum-and-evm/evmsigntypeddata.md`