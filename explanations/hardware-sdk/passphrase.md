# Passphrase (Core Guide)

Minimal rules for handling Passphrase (hidden wallets) with OneKey devices.

## What matters

- Standard vs Hidden wallets:
  - Standard wallet = seed + empty passphrase
  - Hidden wallet = seed + non‑empty passphrase (case‑sensitive; any change → different wallet)
- Responsibility: Not recoverable. Back up securely; exact match required.
- Related: To force Standard wallet in a call, set `useEmptyPassphrase: true`


## App behavior

Two ways to work with passphrase:

1) Proactive intent (recommended)
- Force Standard wallet for a single call:
```ts
await HardwareSDK.evmGetAddress(connectId, deviceId, {
  path: "m/44'/60'/0'",
  useEmptyPassphrase: true,
});
```

2) Reactive event handling
- On `UI_REQUEST.REQUEST_PASSPHRASE`, show a single prompt with two actions:
  - Enter on Device (preferred):
    ```ts
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: { passphraseOnDevice: true, value: '' },
    });
    ```
  - Enter on This Screen (software input; optionally cache for session):
    ```ts
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: { value, passphraseOnDevice: false, save: true },
    });
    ```

## Caching & sessions

- `passphraseState`: Obtain once via [Get Passphrase State](../../hardware-sdk/basic-api/get-passphrase-state.md) and pass in [Common Params](../../hardware-sdk/common-params.md) to reduce repeated prompts.
- Combine with `keepSession` / `initSession` for fewer interactions during a flow.

## Notes

- Don’t log or persist passphrase; mask input.
- Prefer on‑device entry for better security.
- Pro/Touch: PIN must be entered on device; passphrase can still be entered on device or in software (prefer device).

See also: [UI Events: Passphrase](../../quick-start/ui-events-passphrase.md), [Common Params](../../hardware-sdk/common-params.md).