# Installation

## Package Installation

```bash
npm install @onekeyfe/hd-core
```

## Browser Setup

```html
<!DOCTYPE html>
<html>
<head>
    <title>OneKey SDK</title>
</head>
<body>
    <script type="module">
        import HardwareSDK from '@onekeyfe/hd-core';
        
        // Initialize SDK
        await HardwareSDK.init({
            debug: false,
            connectSrc: 'https://connect.onekey.so/'
        });
        
        console.log('OneKey SDK initialized');
    </script>
</body>
</html>
```

## Node.js Setup

```javascript
const HardwareSDK = require('@onekeyfe/hd-core');

async function main() {
    // Initialize SDK
    await HardwareSDK.init({
        debug: false,
        env: 'node'
    });
    
    console.log('OneKey SDK initialized');
}

main().catch(console.error);
```

## TypeScript Setup

```typescript
import HardwareSDK from '@onekeyfe/hd-core';

async function initializeSDK(): Promise<void> {
    await HardwareSDK.init({
        debug: process.env.NODE_ENV === 'development',
        connectSrc: 'https://connect.onekey.so/'
    });
}
```

## Requirements

### Browser
- Chrome 61+
- Edge 79+
- Opera 48+
- WebUSB support required

### Node.js
- Node.js 14+
- USB drivers (Windows/Linux)

### React Native
- React Native 0.60+
- Bluetooth permissions

## Next Steps

- [Quick Start](quick-start.md) - Basic usage examples
- [API Reference](api-reference/README.md) - Complete documentation
