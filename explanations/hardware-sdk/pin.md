# PIN (Core Guide)

Minimal rules for handling PIN with OneKey devices.

## What matters

- Device lock gate: Protected calls emit `UI_REQUEST.REQUEST_PIN` when the device is locked.
- Pro/Touch: PIN can only be entered on the hardware device (no software input).
- Other models: Support Blind PIN (position‑based) software input, but prefer on‑device for security.

## Support Matrix (software PIN entry)

Use this table to quickly identify whether a model supports software‑side Blind PIN entry. For best security, prefer entering PIN on the device for all models; enable software Blind PIN only when truly necessary and only on supported models.

| Device | Software Blind PIN | Device‑only Input |
| --- | --- | --- |
| OneKey Classic | Supported | No |
| OneKey Classic 1s | Supported | No |
| OneKey Classic 1s Pure | Supported | No |
| OneKey Mini | Supported | No |
| OneKey Touch | Not supported | Yes |
| OneKey Pro | Not supported | Yes |

## UI expectations

- Show a single PIN prompt with two actions:
  - Enter on Device (recommended; required on Pro/Touch)
  - Enter on This Screen (Blind PIN) — fixed 3×3 keypad (1‑9), mask input (•), never echo real digits
- Close the dialog when you receive `UI_REQUEST.CLOSE_UI_WINDOW`.

### Blind PIN mapping (software keypad)

Fixed keypad layout (software UI):

```
7 8 9
4 5 6
1 2 3
```

Mapping array (index 0..8 maps software label 1..9 → transformed digit):

```ts
const BLIND_KEYBOARD_MAP = ['7','8','9','4','5','6','1','2','3'];

function onSoftwareKey(label: number) {
  // label is 1..9 from the fixed keypad
  transformedPin += BLIND_KEYBOARD_MAP[label - 1];
}
```

Example: If the user clicks software keys “1, 9”, the transformed becomes `7` (from index 0) then `3` (from index 8) → `73`. Send this transformed string via `uiResponse`.


## Event → Response

```ts
import { UI_EVENT, UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-core';

HardwareSDK.on(UI_EVENT, (msg) => {
  if (msg.type === UI_REQUEST.REQUEST_PIN) {
    // Option A: on‑device input
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
    });

    // Option B: Blind PIN (Pro/Touch devices is not supported)
    // const transformed = '73'; // derived from keypad positions
    // HardwareSDK.uiResponse({ type: UI_RESPONSE.RECEIVE_PIN, payload: transformed });

  }
});
```
