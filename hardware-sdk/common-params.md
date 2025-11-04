# Common Params

In SDK method calls, you typically pass `connectId`, `deviceId`, and an optional `commonParams` object.

```ts
function call(connectId: string, deviceId: string, commonParams?: CommonParams)
```

How to obtain identifiers:

- `connectId`: From `searchDevices()` result (`connectId` field). It is stable across sessions.
- `deviceId`: From `getFeatures(connectId)` (`device_id` field). It changes when the device is reset (e.g., wipe).

CommonParams

- `keepSession?: boolean` — Keep the session after the method completes (reuse cached state where applicable).
- `retryCount?: number` — Polling connect max retry count (default: 6).
- `pollIntervalTime?: number` — Polling interval in ms (default: 1000; backoff ×1.5 each round).
- `timeout?: number` — Timeout in ms for a single polling attempt.
- `passphraseState?: string` — Passphrase wallet state. Obtain via [Get Passphrase State](basic-api/get-passphrase-state.md). Used to validate/cache passphrase.
- `useEmptyPassphrase?: boolean` — Force standard wallet (empty passphrase) for this call.
- `initSession?: boolean` — Initialize session and cache `passphraseState` at call start.
- `deriveCardano?: boolean` — Derive Cardano seed for current session (true by default for Cardano methods; false otherwise). Cardano derivation may take longer.
- `detectBootloaderDevice?: boolean` — Detect if hardware is in bootloader mode and return an error (useful to fail early when a method requires normal mode).
- `skipWebDevicePrompt?: boolean` — Skip Web device chooser prompt (advanced flows or when an external prompt is already shown).

Tips

- For WebUSB, ensure your site is served over HTTPS and that the device is authorized before discovery.
- Prefer on-device PIN/Passphrase entry on Pro/Touch models (software input is not supported on these).
- For passphrase wallets, combine `passphraseState` + `keepSession` to reduce repeated prompts, and consider `useEmptyPassphrase` for standard wallet scenarios.
