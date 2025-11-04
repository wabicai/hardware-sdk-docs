# UI Events: PIN (overview)

{% hint style="warning" %}
On OneKey Pro and OneKey Touch devices, PIN can only be entered on the hardware device. Software PIN entry is not supported on these models.
{% endhint %}

- When a protected call is made (e.g., `btcGetAddress`) and the device is locked, the SDK emits `UI_REQUEST.REQUEST_PIN`.
- Respond with one of the following:
  - Enter on device (recommended;):
    ```ts
    await HardwareSDK.uiResponse({ 
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE' 
    });
    ```
  - Software Blind PIN (not supported on Pro/Touch): show a fixed 3×3 keypad and send the transformed PIN string.
    ```ts
    let inputValue = '1111'
    await HardwareSDK.uiResponse({ 
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: value 
    });
    ```
- Close your prompt when receiving `UI_REQUEST.CLOSE_UI_WINDOW`.

Learn more:
- [Config Event](../hardware-sdk/config-event.md)
- PIN deep‑dive (mapping, UX, retries): [PIN](../explanations/hardware-sdk/pin.md)
- WebUSB connection prompts and UX: [WebUSB Connection Guide](../transport-recipes/web-usb.md)
