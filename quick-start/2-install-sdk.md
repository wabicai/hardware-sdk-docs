# Step 2 · Install SDK Dependencies

This step adds the Common Connect SDK and a minimal project wrapper so you can interact with the device from the browser console.

## 2.1 Initialise a project

If you do not have a project yet, generate one with Vite or your preferred React setup:

```bash
npm create vite@latest onekey-webusb-demo -- --template react-ts
cd onekey-webusb-demo
```

Any bundler that supports ES modules works. React + Vite keeps the example close to the sample code used across OneKey guides.

## 2.2 Install packages

Install the Common Connect SDK together with the event constants exposed by `@onekeyfe/hd-core`:

```bash
npm install @onekeyfe/hd-common-connect-sdk @onekeyfe/hd-core
```

If you use Yarn:

```bash
yarn add @onekeyfe/hd-common-connect-sdk @onekeyfe/hd-core
```

## 2.3 Add environment helpers

Create `.env.local` with the following line so you can toggle verbose logs during development:

```bash
VITE_ONEKEY_DEBUG=true
```

In `src/main.tsx`, wire the debug flag to the SDK initialisation later in the tutorial.

Continue with [Step 3](3-basic-initialisation.md) to wire up the SDK initialisation flow.
