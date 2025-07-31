---
icon: shield-check
---

# Best Practices

Production-ready guidelines for implementing OneKey Hardware SDK securely and efficiently.

## Security Best Practices

### Address Verification

**Always verify addresses on device screen for receiving funds:**

```javascript
// ✅ GOOD: Show address on device for verification
const getReceiveAddress = async () => {
  const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnDevice: true // Critical for security
  });
  
  if (result.success) {
    // User has verified address on device screen
    return result.payload.address;
  }
  
  throw new Error('Failed to get verified address');
};

// ❌ AVOID: Not showing address for receiving funds
const getAddressUnsafe = async () => {
  const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnDevice: false // Dangerous for receiving addresses
  });
  
  return result.payload.address;
};
```

### Transaction Verification

**Ensure users can verify transaction details on device:**

```javascript
const signTransactionSecurely = async (transactionData) => {
  try {
    // Build transaction with clear, verifiable data
    const transaction = {
      to: transactionData.recipient,
      value: transactionData.amount,
      gasPrice: transactionData.gasPrice,
      gasLimit: transactionData.gasLimit,
      nonce: transactionData.nonce
    };
    
    // Sign with device verification
    const result = await HardwareSDK.evmSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction
    });
    
    if (result.success) {
      return result.payload;
    }
    
    throw new Error(result.payload.error);
  } catch (error) {
    // Handle user cancellation gracefully
    if (error.code === 'User_Cancelled') {
      console.log('User cancelled transaction on device');
      return null;
    }
    
    throw error;
  }
};
```

### Sensitive Data Handling

```javascript
// ✅ GOOD: Never store private keys or seeds
class SecureWalletManager {
  constructor() {
    // Only store public information
    this.addresses = new Map();
    this.publicKeys = new Map();
    // Never store: private keys, seeds, passphrases
  }
  
  async getAddress(path, coin) {
    const cacheKey = `${path}-${coin}`;
    
    if (this.addresses.has(cacheKey)) {
      return this.addresses.get(cacheKey);
    }
    
    const result = await HardwareSDK.btcGetAddress({
      path,
      coin,
      showOnDevice: false
    });
    
    if (result.success) {
      // Safe to cache public address
      this.addresses.set(cacheKey, result.payload.address);
      return result.payload.address;
    }
    
    throw new Error(result.payload.error);
  }
  
  clearCache() {
    this.addresses.clear();
    this.publicKeys.clear();
  }
}
```

## Error Handling

### Comprehensive Error Management

```javascript
class OneKeyErrorHandler {
  static handleError(error) {
    const errorMap = {
      'Device_NotFound': {
        message: 'OneKey device not found. Please connect your device and try again.',
        action: 'reconnect',
        severity: 'warning'
      },
      'User_Cancelled': {
        message: 'Operation was cancelled on the device.',
        action: 'retry',
        severity: 'info'
      },
      'Invalid_Path': {
        message: 'Invalid derivation path. Please check the path format.',
        action: 'fix_path',
        severity: 'error'
      },
      'Firmware_NotCompatible': {
        message: 'Device firmware is outdated. Please update your OneKey device.',
        action: 'update_firmware',
        severity: 'error'
      },
      'Permission_Denied': {
        message: 'Permission denied. Please allow device access in your browser.',
        action: 'grant_permission',
        severity: 'warning'
      },
      'Device_Disconnected': {
        message: 'Device was disconnected. Please reconnect and try again.',
        action: 'reconnect',
        severity: 'warning'
      }
    };
    
    const errorInfo = errorMap[error.code] || {
      message: `Unexpected error: ${error.message}`,
      action: 'contact_support',
      severity: 'error'
    };
    
    return {
      ...errorInfo,
      originalError: error
    };
  }
  
  static async retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const errorInfo = this.handleError(error);
        
        if (attempt === maxRetries || errorInfo.severity === 'error') {
          throw error;
        }
        
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
}

// Usage
try {
  const result = await OneKeyErrorHandler.retryOperation(async () => {
    return await HardwareSDK.btcGetAddress({
      path: "m/44'/0'/0'/0/0",
      coin: 'btc'
    });
  });
} catch (error) {
  const errorInfo = OneKeyErrorHandler.handleError(error);
  console.error('Operation failed:', errorInfo.message);
}
```

### User-Friendly Error Messages

```javascript
const showUserError = (error) => {
  const errorInfo = OneKeyErrorHandler.handleError(error);
  
  // Show appropriate UI based on error type
  switch (errorInfo.action) {
    case 'reconnect':
      showReconnectDialog();
      break;
    case 'retry':
      showRetryDialog();
      break;
    case 'grant_permission':
      showPermissionDialog();
      break;
    case 'update_firmware':
      showFirmwareUpdateDialog();
      break;
    default:
      showGenericErrorDialog(errorInfo.message);
  }
};
```

## Performance Optimization

### Connection Management

```javascript
class OneKeyConnectionManager {
  constructor() {
    this.isConnected = false;
    this.deviceFeatures = null;
    this.connectionPromise = null;
  }
  
  async connect() {
    // Prevent multiple simultaneous connection attempts
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    
    this.connectionPromise = this._doConnect();
    
    try {
      const result = await this.connectionPromise;
      this.isConnected = true;
      return result;
    } finally {
      this.connectionPromise = null;
    }
  }
  
  async _doConnect() {
    const devices = await HardwareSDK.searchDevices();
    
    if (devices.length === 0) {
      throw new Error('No OneKey devices found');
    }
    
    await HardwareSDK.connectDevice(devices[0].path);
    
    // Cache device features
    this.deviceFeatures = await HardwareSDK.getFeatures();
    
    // Set up disconnect handler
    HardwareSDK.on('device-disconnect', () => {
      this.isConnected = false;
      this.deviceFeatures = null;
    });
    
    return this.deviceFeatures;
  }
  
  async getFeatures() {
    if (!this.deviceFeatures) {
      await this.connect();
    }
    
    return this.deviceFeatures;
  }
  
  async disconnect() {
    if (this.isConnected) {
      await HardwareSDK.disconnectDevice();
      this.isConnected = false;
      this.deviceFeatures = null;
    }
  }
}
```

### Efficient Address Generation

```javascript
class AddressManager {
  constructor() {
    this.addressCache = new Map();
    this.batchSize = 5;
  }
  
  // Generate multiple addresses efficiently
  async generateAddressBatch(basePath, coin, count = 10) {
    const addresses = [];
    const batches = Math.ceil(count / this.batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
      const batchPromises = [];
      const startIndex = batch * this.batchSize;
      const endIndex = Math.min(startIndex + this.batchSize, count);
      
      for (let i = startIndex; i < endIndex; i++) {
        const path = basePath.replace('/0/0', `/0/${i}`);
        batchPromises.push(this.getAddress(path, coin));
      }
      
      const batchResults = await Promise.all(batchPromises);
      addresses.push(...batchResults);
      
      // Small delay between batches to avoid overwhelming device
      if (batch < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return addresses;
  }
  
  async getAddress(path, coin) {
    const cacheKey = `${path}-${coin}`;
    
    if (this.addressCache.has(cacheKey)) {
      return this.addressCache.get(cacheKey);
    }
    
    const result = await HardwareSDK.btcGetAddress({
      path,
      coin,
      showOnDevice: false
    });
    
    if (result.success) {
      this.addressCache.set(cacheKey, result.payload.address);
      return result.payload.address;
    }
    
    throw new Error(result.payload.error);
  }
  
  clearCache() {
    this.addressCache.clear();
  }
}
```

## User Experience

### Loading States and Feedback

```javascript
const TransactionSigner = () => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  
  const signTransaction = async (transactionData) => {
    try {
      setStatus('connecting');
      setProgress(20);
      
      // Connect to device
      await connectionManager.connect();
      
      setStatus('preparing');
      setProgress(40);
      
      // Prepare transaction
      const transaction = await prepareTransaction(transactionData);
      
      setStatus('signing');
      setProgress(60);
      
      // Show user instruction
      showDeviceInstruction('Please confirm the transaction on your OneKey device');
      
      // Sign transaction
      const result = await HardwareSDK.evmSignTransaction({
        path: "m/44'/60'/0'/0/0",
        transaction
      });
      
      setStatus('broadcasting');
      setProgress(80);
      
      // Broadcast transaction
      const txHash = await broadcastTransaction(result.payload);
      
      setStatus('complete');
      setProgress(100);
      
      return txHash;
    } catch (error) {
      setStatus('error');
      throw error;
    }
  };
  
  const getStatusMessage = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting to OneKey device...';
      case 'preparing':
        return 'Preparing transaction...';
      case 'signing':
        return 'Please confirm on your OneKey device';
      case 'broadcasting':
        return 'Broadcasting transaction...';
      case 'complete':
        return 'Transaction completed successfully!';
      case 'error':
        return 'Transaction failed';
      default:
        return 'Ready to sign';
    }
  };
  
  return (
    <div>
      <div>{getStatusMessage()}</div>
      <ProgressBar value={progress} />
    </div>
  );
};
```

### Device Instructions

```javascript
const DeviceInstructionManager = {
  show: (instruction) => {
    // Show modal or overlay with device instruction
    const modal = document.createElement('div');
    modal.className = 'device-instruction-modal';
    modal.innerHTML = `
      <div class="instruction-content">
        <div class="device-icon">📱</div>
        <h3>OneKey Device Required</h3>
        <p>${instruction}</p>
        <div class="loading-spinner"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    return {
      hide: () => {
        document.body.removeChild(modal);
      }
    };
  }
};
```

## Testing and Development

### Test Environment Setup

```javascript
// Test configuration
const testConfig = {
  development: {
    debug: true,
    connectSrc: 'https://localhost:8092/',
    networks: {
      bitcoin: 'testnet',
      ethereum: 'goerli'
    }
  },
  production: {
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/',
    networks: {
      bitcoin: 'mainnet',
      ethereum: 'mainnet'
    }
  }
};

const initSDK = async (environment = 'development') => {
  const config = testConfig[environment];
  
  await HardwareSDK.init({
    debug: config.debug,
    connectSrc: config.connectSrc,
    manifest: {
      email: 'developer@yourapp.com',
      appName: 'Your App Name',
      appUrl: 'https://yourapp.com'
    }
  });
};
```

### Mock Testing

```javascript
// Mock SDK for testing without hardware
class MockHardwareSDK {
  static async init(config) {
    console.log('Mock SDK initialized');
  }
  
  static async searchDevices() {
    return [{
      path: 'mock-device',
      name: 'Mock OneKey',
      features: { model: 'T' }
    }];
  }
  
  static async btcGetAddress(params) {
    // Return mock address for testing
    return {
      success: true,
      payload: {
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        path: params.path
      }
    };
  }
  
  static async evmSignTransaction(params) {
    // Return mock signature
    return {
      success: true,
      payload: {
        v: '0x1c',
        r: '0x...',
        s: '0x...'
      }
    };
  }
}

// Use mock in tests
const SDK = process.env.NODE_ENV === 'test' ? MockHardwareSDK : HardwareSDK;
```

## Production Deployment

### Environment Configuration

```javascript
// Production checklist
const productionChecklist = {
  security: [
    'Use HTTPS in production',
    'Validate all user inputs',
    'Implement proper error handling',
    'Never log sensitive data',
    'Use secure random number generation'
  ],
  performance: [
    'Enable connection pooling',
    'Implement address caching',
    'Use batch operations where possible',
    'Set appropriate timeouts',
    'Monitor device response times'
  ],
  userExperience: [
    'Provide clear device instructions',
    'Show loading states',
    'Handle disconnections gracefully',
    'Implement retry mechanisms',
    'Test with different device models'
  ]
};

// Production initialization
const initProductionSDK = async () => {
  await HardwareSDK.init({
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/',
    manifest: {
      email: 'support@yourcompany.com',
      appName: 'Your Production App',
      appUrl: 'https://yourapp.com'
    }
  });
};
```

### Monitoring and Analytics

```javascript
class SDKAnalytics {
  static trackOperation(operation, success, duration, error = null) {
    const event = {
      operation,
      success,
      duration,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      error: error ? {
        code: error.code,
        message: error.message
      } : null
    };
    
    // Send to your analytics service
    this.sendAnalytics(event);
  }
  
  static sendAnalytics(event) {
    // Implement your analytics tracking
    console.log('Analytics:', event);
  }
}

// Usage
const trackableOperation = async (operation, operationName) => {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    
    SDKAnalytics.trackOperation(operationName, true, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    SDKAnalytics.trackOperation(operationName, false, duration, error);
    throw error;
  }
};
```

## Next Steps

- [Troubleshooting](../resources/troubleshooting.md) - Common issues and solutions
- [API Reference](../api/device.md) - Complete API documentation
- [Examples](../quick-start/examples.md) - More code examples
- [FAQ](../resources/faq.md) - Frequently asked questions
