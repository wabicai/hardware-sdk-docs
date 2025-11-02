# UI Events: PIN (overview)

- When a protected call is made (e.g., `btcGetAddress`) and the device is locked, the SDK emits `UI_REQUEST.REQUEST_PIN`.
- Two options:
  - Enter on device (recommended):
    ```ts
    await HardwareSDK.uiResponse({ type: UI_RESPONSE.RECEIVE_PIN, payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE' });
    ```
  - Software input with blind keypad (positions → `['7','8','9','4','5','6','1','2','3']`): send the transformed PIN string.

- Full, copy‑paste dialogs for WebUSB are in `transport-recipes/web-usb.md`.
- Deep-dive UX and security notes: `explanations/hardware-sdk/pin.md`.
