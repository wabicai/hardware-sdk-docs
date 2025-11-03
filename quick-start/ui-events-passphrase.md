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

- Full, copy‑paste dialogs for WebUSB are in `transport-recipes/web-usb.md`.
- Deep-dive UX and security notes: `explanations/hardware-sdk/passphrase.md`.
