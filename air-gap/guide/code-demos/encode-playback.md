# Code Demo · Encode & Playback (Animated UR)

Generate animated QR frames from a UR and play them back in your UI.

```ts
import { UR, UREncoder } from '@ngraveio/bc-ur';

export function urToFrames(ur: UR, maxFragmentLength = 100): string[] {
  const encoder = new UREncoder(ur, maxFragmentLength);
  // For demo simplicity, encode single or whole. Production can loop encoder.nextPart()
  const single = UREncoder.encodeSinglePart(ur).toUpperCase();
  return [single];
}

export function playFrames(frames: string[], render: (text: string) => void, intervalMs = 200) {
  let i = 0;
  const timer = setInterval(() => {
    render(frames[i]);
    i = (i + 1) % frames.length;
  }, intervalMs);
  return () => clearInterval(timer);
}
```

Tips
- Start with 150–250ms per frame; adjust by device performance.
- Keep QR high-contrast and size ≥ 240px, prefer uppercase frames.
- Use `encoder.nextPart()` if you need precise sequencing instead of prebuilding.
