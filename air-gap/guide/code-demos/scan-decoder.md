# Code Demo · Scan & Decoder

This snippet shows how to capture QR frames from the camera and aggregate them into a complete UR using `@ngraveio/bc-ur`.

Expo Camera (React Native)
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView } from 'expo-camera';
import { UR, URDecoder } from '@ngraveio/bc-ur';

export function UseAnimatedURDecoder() {
  const decoderRef = useRef(new URDecoder());
  const [complete, setComplete] = useState<UR | null>(null);
  const [error, setError] = useState<string | null>(null);

  const push = (frame: string) => {
    try {
      const data = frame.trim();
      if (!data) return;
      decoderRef.current.receivePart(data);
      if (decoderRef.current.isComplete()) {
        setComplete(decoderRef.current.resultUR());
      }
    } catch (e: any) {
      setError(e?.message ?? 'Decode failed');
    }
  };

  const reset = () => {
    decoderRef.current = new URDecoder();
    setComplete(null);
    setError(null);
  };

  return { complete, error, push, reset };
}

export default function ScanDemo() {
  const { complete, error, push, reset } = UseAnimatedURDecoder();
  return (
    <View>
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        style={{ width: '100%', height: 220, borderRadius: 8 }}
        onBarcodeScanned={({ data }) => push(data)}
      />
      <Text>{error ? `Error: ${error}` : complete ? `UR: ${complete.type}` : 'Waiting for frames...'}</Text>
      <Pressable onPress={reset}><Text>Reset</Text></Pressable>
    </View>
  );
}
```

Notes
- If progress hints like `.../2OF10` are present, parse and show `received/total` in UI.
- Debounce the scan callback if camera is noisy; ignore duplicates and support abort/retry.
- See also: `guide/ui-patterns.md` and the full demo repository for production UX.
