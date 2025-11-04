# UI Events: PIN (overview)

{% hint style="warning" %}
On OneKey Pro and OneKey Touch devices, PIN can only be entered on the hardware device. Software PIN entry is not supported on these models.
{% endhint %}

- When a protected call is made (e.g., `btcGetAddress`) and the device is locked, the SDK emits `UI_REQUEST.REQUEST_PIN`.
- PIN entry options:
  - Enter on device (recommended for all models; required on Pro/Touch):
    ```ts
    await HardwareSDK.uiResponse({ 
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE' 
    });
    ```
  - Software input with blind keypad (not available on Pro/Touch): positions mapping → `['7','8','9','4','5','6','1','2','3']`; send the transformed PIN string.

- Full, copy‑paste dialogs for WebUSB are in [WebUSB Connection Guide](../transport-recipes/web-usb.md).
- Deep‑dive UX and security notes: [PIN](../explanations/hardware-sdk/pin.md).
