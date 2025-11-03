# QR & UR Basics

Air‑Gap uses UR‑encoded QR codes to exchange data between the app and the hardware wallet. Animated UR splits large payloads into short frames that scan reliably on mobile.

- Key helpers (from the demo `air-gap/sdk/airGapUrUtils.ts`)
  - `createAnimatedURDecoder()` → Feed scanned strings, resolve when a full UR is assembled
  - `createAnimatedUREncoder({ ur, maxFragmentLength })` → Produce animated frames to render
  - `urToQrcode(ur)` / `qrcodeToUr(payload)` → Convert between UR and QR strings
  - `urToJson(ur)` / `jsonToUr(json)` → Serialize/restore UR without losing type information

```ts
// Decode: aggregate frames from camera into a UR
const { receivePart, promiseResultUR, abort } = airGapUrUtils.createAnimatedURDecoder();
receivePart?.(frame); // push each scanned string
const ur = await promiseResultUR; // resolves when complete

// Encode: animate a UR into frames for display
const { encodeWhole } = airGapUrUtils.createAnimatedUREncoder({ ur, maxFragmentLength: 100 });
const frames = encodeWhole();
```

- Fragment length
  - 80–120 characters is a good balance; the demo uses `100` and uppercases frames for camera stability.
- Progress & ordering
  - UR encoders embed sequence hints (e.g., `.../2OF10`). Display them to give users feedback while scanning.
- Resilience
  - Ignore duplicate frames, allow abort/retry, and clear the decoder before a new request.
