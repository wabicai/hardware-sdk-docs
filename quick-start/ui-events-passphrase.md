# UI Events: Passphrase (overview)

- When a hidden wallet is needed, the SDK emits `UI_REQUEST.REQUEST_PASSPHRASE`.
- Two options:
  - Enter on device (most secure):
    ```ts
    await HardwareSDK.uiResponse({ 
      type: UI_RESPONSE.RECEIVE_PASSPHRASE, 
      payload: { 
        passphraseOnDevice: true, 
        value: '' 
      } 
    });
    ```
  - Software input (optionally cache for session):
    ```ts
    await HardwareSDK.uiResponse({ 
      type: UI_RESPONSE.RECEIVE_PASSPHRASE, 
      payload: {
        value, 
        passphraseOnDevice: false, 
        save: true 
      } 
    });
    ```
- Force Standard Wallet for a call: add `useEmptyPassphrase: true` in method params.

Example (force standard wallet for this call only):
```ts
const res = await HardwareSDK.btcGetAddress(connectId, deviceId, {
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: false,
  useEmptyPassphrase: true,
});
```

- Full, copy‑paste dialogs for WebUSB are in [WebUSB Connection Guide](../transport-recipes/web-usb.md).
- Event wiring and responses: [Config Event](../hardware-sdk/config-event.md).
- Deep‑dive UX and security notes: [Passphrase](../explanations/hardware-sdk/passphrase.md).
