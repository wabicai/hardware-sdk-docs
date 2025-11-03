# UI Patterns (Scan / Playback / Progress / Errors)

This page summarizes resilient UI patterns for Air‑Gap flows on mobile.

## Scanning (Camera → Decoder)

- Use a QR‑only camera mode (e.g., Expo `CameraView` with `barcodeTypes: ['qr']`).
- Debounce high‑frequency scan callbacks; push each scanned string to the animated UR decoder.
- Show progress (e.g., `2/10 frames`) when sequence hints like `.../2OF10` are present.
- Provide controls: `Reset`, `Abort`, `Retry`.

Example
```tsx
// React Native + Expo example
const decoderRef = useRef(airGapUrUtils.createAnimatedURDecoder());

function onBarcodeScanned(data: string) {
  // Basic debouncing omitted for brevity
  decoderRef.current.receivePart?.(data.trim());
}

useEffect(() => {
  let mounted = true;
  decoderRef.current.promiseResultUR
    .then(ur => mounted && handleComplete(ur))
    .catch(() => {/* aborted */});
  return () => { mounted = false; decoderRef.current.abort?.(); };
}, []);
```

Recommended UX
- State machine: `idle → scanning → decoding → complete | error`.
- During `scanning`, display the last frame preview and a textual counter (`received / total`).
- If no progress in N seconds, hint to slow down or increase QR size.

## Playback (Render Animated Frames)

- Use `airGapUrUtils.createAnimatedUREncoder({ ur, maxFragmentLength: 100 })`.
- Frame interval: 150–250ms works well across devices; start with 200ms.
- Provide `Play/Pause/Restart` and a loop toggle.

Example
```ts
const { encodeWhole } = airGapUrUtils.createAnimatedUREncoder({ ur, maxFragmentLength: 100 });
const frames = encodeWhole();
let i = 0;
const timer = setInterval(() => {
  renderQR(frames[i]);
  i = (i + 1) % frames.length; // loop
}, 200);
```

## Progress Indicators

- Parse `.../2OF10` from UR frames when available and map to `received/total`.
- When not available, show an activity indicator and elapsed time.

## Error Handling Patterns

- Camera permissions denied → show a blocking prompt with a deep link to system settings.
- Sequence stalled (no new frames) → suggest increasing QR size, reducing density, or slowing playback.
- Wrong request type or `requestId` mismatch → auto‑abort current decoder and prompt user to restart.
- Wallet mismatch (BTC PSBT) → surface a clear reason and point to Troubleshooting.
- Generic parse error → allow `Retry` and provide a copyable raw frame for support.

## Visual/Accessibility Tips

- Prefer dark‑on‑light QR, sufficient quiet zone, and minimum size ≥ 240px.
- Use uppercase frames and avoid condensed fonts in QR label overlays.
- Keep 60 FPS animations off the main thread; a simple interval loop is sufficient.
