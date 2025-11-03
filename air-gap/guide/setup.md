# Setup

This page lists the minimal runtime and dependencies to reproduce the demo’s Air‑Gap flow.

- Packages
  - `@keystonehq/keystone-sdk`, `@keystonehq/bc-ur-registry`
  - `@keystonehq/bc-ur-registry-eth`, `@keystonehq/bc-ur-registry-btc`, `@keystonehq/bc-ur-registry-sol`
  - `@ngraveio/bc-ur`, `uuid`, `expo-camera`

```bash
npm install --save @keystonehq/keystone-sdk @keystonehq/bc-ur-registry \
  @keystonehq/bc-ur-registry-eth @keystonehq/bc-ur-registry-btc @keystonehq/bc-ur-registry-sol
npm install --save @ngraveio/bc-ur uuid expo-camera
```

- Metro polyfills (RN/Expo)
  - `buffer`, `crypto-browserify`, `stream-browserify`, `http-browserify`, `https-browserify`, `url`, `events`, `util`, `path-browserify`, `process`
  - Keep this list in sync with dependency upgrades (Node built‑ins may reappear transitively).

- Camera permissions
  - Configure `app.json` → `ios.infoPlist.NSCameraUsageDescription`, `android.permissions`.

- Demo repo
  - https://github.com/OneKeyHQ/hardware-js-sdk/tree/onekey/packages/connect-examples/react-native-demo
  - Reference: `packages/connect-examples/react-native-demo/air-gap`
