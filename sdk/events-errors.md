---
icon: exclamation-triangle
---

# Events & Error Handling

OneKey SDK uses an event-driven architecture for handling device interactions and provides comprehensive error handling to help you build robust applications.

## Event System

### Event Types

The SDK emits various types of events to keep your application informed about device state and user interactions:

| Event Category | Purpose | Examples |
|----------------|---------|----------|
| **Device Events** | Device connection state | `device-connect`, `device-disconnect` |
| **UI Events** | User interaction requests | `ui-button`, `ui-request_pin` |
| **Transport Events** | Communication layer | `transport-connect`, `transport-error` |
| **Firmware Events** | Device updates | `firmware-progress`, `firmware-complete` |

### Event Listener Setup

```javascript
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

// Basic event listener
HardwareSDK.on('device-connect', (device) => {
    console.log('Device connected:', device);
});

// Multiple event listeners
HardwareSDK.on('device-disconnect', handleDisconnect);
HardwareSDK.on('ui-button', handleButtonRequest);
HardwareSDK.on('transport-error', handleTransportError);

// Remove event listener
HardwareSDK.off('device-connect', handleConnect);

// One-time event listener
HardwareSDK.once('device-connect', (device) => {
    console.log('First device connected:', device);
});
```

## Device Events

### Connection Events

```javascript
// Device connected
HardwareSDK.on('device-connect', (device) => {
    console.log('Device connected:', {
        path: device.path,
        label: device.label,
        model: device.features.model,
        firmware: `${device.features.major_version}.${device.features.minor_version}.${device.features.patch_version}`
    });
    
    // Update UI state
    updateConnectionStatus(true, device);
});

// Device disconnected
HardwareSDK.on('device-disconnect', (device) => {
    console.log('Device disconnected:', device.path);
    
    // Update UI state
    updateConnectionStatus(false);
    
    // Attempt reconnection
    setTimeout(attemptReconnection, 5000);
});

// Device changed (firmware update, settings change, etc.)
HardwareSDK.on('device-changed', (device) => {
    console.log('Device state changed:', device);
    
    // Refresh device information
    refreshDeviceInfo(device);
});
```

### Device Discovery Events

```javascript
// Device found during search
HardwareSDK.on('device-found', (device) => {
    console.log('Device found:', device.label);
    
    // Add to device list
    addToDeviceList(device);
});

// Device search completed
HardwareSDK.on('device-search-complete', (devices) => {
    console.log(`Search complete. Found ${devices.length} devices`);
    
    // Update device selection UI
    updateDeviceSelection(devices);
});
```

## UI Events

### Button Confirmation

```javascript
// User needs to confirm action on device
HardwareSDK.on('ui-button', (event) => {
    console.log('Button confirmation required:', event);
    
    // Show user instruction
    showMessage('Please confirm the action on your OneKey device');
    
    // Optional: Show device animation
    showDeviceAnimation('button-press');
});
```

### PIN Entry

```javascript
// Device requests PIN entry
HardwareSDK.on('ui-request_pin', (event) => {
    console.log('PIN required:', event);
    
    // Show PIN input dialog
    const pin = await showPinDialog(event.type);
    
    // Send PIN to device
    HardwareSDK.uiResponse({
        type: 'ui-receive_pin',
        payload: pin
    });
});

// PIN input dialog implementation
const showPinDialog = (pinType) => {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="pin-dialog">
                <h3>Enter ${pinType === 'PinMatrixRequestType_Current' ? 'Current' : 'New'} PIN</h3>
                <div class="pin-matrix">
                    <button data-pin="7">•</button>
                    <button data-pin="8">•</button>
                    <button data-pin="9">•</button>
                    <button data-pin="4">•</button>
                    <button data-pin="5">•</button>
                    <button data-pin="6">•</button>
                    <button data-pin="1">•</button>
                    <button data-pin="2">•</button>
                    <button data-pin="3">•</button>
                </div>
                <div class="pin-display"></div>
                <button class="confirm-btn">Confirm</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;
        
        // Handle PIN input logic
        // ... implementation details ...
        
        document.body.appendChild(modal);
    });
};
```

### Passphrase Entry

```javascript
// Device requests passphrase
HardwareSDK.on('ui-request_passphrase', (event) => {
    console.log('Passphrase required:', event);
    
    // Show passphrase input
    const passphrase = await showPassphraseDialog();
    
    // Send passphrase to device
    HardwareSDK.uiResponse({
        type: 'ui-receive_passphrase',
        payload: {
            value: passphrase,
            save: false  // Don't save on device
        }
    });
});

// Passphrase dialog
const showPassphraseDialog = () => {
    return new Promise((resolve) => {
        const passphrase = prompt('Enter passphrase (leave empty for no passphrase):');
        resolve(passphrase || '');
    });
};
```

### Word Entry (Recovery)

```javascript
// Device requests recovery word
HardwareSDK.on('ui-request_word', (event) => {
    console.log('Recovery word required:', event);
    
    const word = await showWordDialog(event.type);
    
    HardwareSDK.uiResponse({
        type: 'ui-receive_word',
        payload: word
    });
});
```

## Transport Events

### Connection Events

```javascript
// Transport layer connected
HardwareSDK.on('transport-connect', () => {
    console.log('Transport connected');
    updateTransportStatus('connected');
});

// Transport layer disconnected
HardwareSDK.on('transport-disconnect', () => {
    console.log('Transport disconnected');
    updateTransportStatus('disconnected');
});

// Transport error
HardwareSDK.on('transport-error', (error) => {
    console.error('Transport error:', error);
    handleTransportError(error);
});
```

### Communication Events

```javascript
// Message sent to device
HardwareSDK.on('transport-send', (message) => {
    console.log('Sent to device:', message.type);
});

// Message received from device
HardwareSDK.on('transport-receive', (message) => {
    console.log('Received from device:', message.type);
});
```

## Error Handling

### Error Response Format

All SDK methods return a consistent response format:

```javascript
// Success response
{
    success: true,
    payload: {
        // Method-specific data
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        path: "m/44'/0'/0'/0/0"
    }
}

// Error response
{
    success: false,
    payload: {
        error: "Device_NotFound",
        code: "DEVICE_NOT_FOUND",
        message: "Device not found or disconnected"
    }
}
```

### Error Categories

#### Device Errors

```javascript
const handleDeviceError = (error) => {
    switch (error.code) {
        case 'DEVICE_NOT_FOUND':
            showError('Device not found. Please connect your OneKey device.');
            break;
            
        case 'DEVICE_DISCONNECTED':
            showError('Device disconnected. Please reconnect your device.');
            break;
            
        case 'DEVICE_CALL_IN_PROGRESS':
            showError('Another operation is in progress. Please wait.');
            break;
            
        case 'DEVICE_INITIALIZATION_FAILED':
            showError('Failed to initialize device. Please try again.');
            break;
            
        default:
            showError(`Device error: ${error.message}`);
    }
};
```

#### User Errors

```javascript
const handleUserError = (error) => {
    switch (error.code) {
        case 'RUNTIME_CALL_EXCEPTION':
            showError('Operation cancelled by user.');
            break;
            
        case 'PIN_INVALID':
            showError('Invalid PIN. Please try again.');
            break;
            
        case 'PIN_CANCELLED':
            showError('PIN entry cancelled.');
            break;
            
        case 'PASSPHRASE_CANCELLED':
            showError('Passphrase entry cancelled.');
            break;
            
        default:
            showError(`User error: ${error.message}`);
    }
};
```

#### Transport Errors

```javascript
const handleTransportError = (error) => {
    switch (error.code) {
        case 'TRANSPORT_NOT_CONFIGURED':
            showError('Transport not configured. Please initialize the SDK.');
            break;
            
        case 'WEBUSB_NOT_SUPPORTED':
            showError('WebUSB not supported. Please use a compatible browser.');
            break;
            
        case 'BLUETOOTH_NOT_AVAILABLE':
            showError('Bluetooth not available. Please enable Bluetooth.');
            break;
            
        case 'BRIDGE_NOT_RUNNING':
            showError('OneKey Bridge not running. Please install and start the Bridge.');
            break;
            
        default:
            showError(`Transport error: ${error.message}`);
    }
};
```

### Comprehensive Error Handler

```javascript
class ErrorHandler {
    constructor() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Handle all SDK errors
        HardwareSDK.on('error', this.handleError.bind(this));
        
        // Handle specific error types
        HardwareSDK.on('device-error', this.handleDeviceError.bind(this));
        HardwareSDK.on('transport-error', this.handleTransportError.bind(this));
    }
    
    handleError(error) {
        console.error('SDK Error:', error);
        
        // Log error for debugging
        this.logError(error);
        
        // Show user-friendly message
        this.showUserMessage(error);
        
        // Attempt recovery if possible
        this.attemptRecovery(error);
    }
    
    logError(error) {
        // Send to logging service
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }
    
    showUserMessage(error) {
        const userMessage = this.getUserFriendlyMessage(error);
        
        // Show in UI
        this.showNotification(userMessage, 'error');
    }
    
    getUserFriendlyMessage(error) {
        const messages = {
            'DEVICE_NOT_FOUND': 'Please connect your OneKey device and try again.',
            'WEBUSB_NOT_SUPPORTED': 'Please use Chrome, Edge, or Opera browser.',
            'BLUETOOTH_NOT_AVAILABLE': 'Please enable Bluetooth and grant permissions.',
            'PIN_INVALID': 'Incorrect PIN. Please try again.',
            'RUNTIME_CALL_EXCEPTION': 'Operation cancelled. Please try again if needed.'
        };
        
        return messages[error.code] || 'An unexpected error occurred. Please try again.';
    }
    
    attemptRecovery(error) {
        switch (error.code) {
            case 'DEVICE_DISCONNECTED':
                setTimeout(() => this.attemptReconnection(), 2000);
                break;
                
            case 'TRANSPORT_ERROR':
                setTimeout(() => this.reinitializeTransport(), 1000);
                break;
        }
    }
    
    async attemptReconnection() {
        try {
            const devices = await HardwareSDK.searchDevices();
            if (devices.length > 0) {
                await HardwareSDK.connectDevice(devices[0].path);
                this.showNotification('Device reconnected successfully', 'success');
            }
        } catch (error) {
            console.log('Reconnection failed:', error);
        }
    }
    
    async reinitializeTransport() {
        try {
            await HardwareSDK.dispose();
            await HardwareSDK.init({ /* config */ });
            this.showNotification('Connection restored', 'success');
        } catch (error) {
            console.log('Transport reinitialization failed:', error);
        }
    }
    
    showNotification(message, type) {
        // Implement your notification system
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();
```

### Retry Logic

```javascript
const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await operation();
            
            if (result.success) {
                return result;
            } else {
                // Check if error is retryable
                if (!isRetryableError(result.payload.error) || attempt === maxRetries) {
                    throw new Error(result.payload.error);
                }
            }
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
};

const isRetryableError = (errorCode) => {
    const retryableErrors = [
        'DEVICE_CALL_IN_PROGRESS',
        'TRANSPORT_ERROR',
        'DEVICE_DISCONNECTED'
    ];
    
    return retryableErrors.includes(errorCode);
};

// Usage
try {
    const result = await withRetry(() => 
        HardwareSDK.btcGetAddress({
            path: "m/44'/0'/0'/0/0",
            coin: 'btc'
        })
    );
    
    console.log('Address:', result.payload.address);
} catch (error) {
    console.error('Operation failed after retries:', error);
}
```

## Best Practices

### Event Management

```javascript
class EventManager {
    constructor() {
        this.listeners = new Map();
    }
    
    addListener(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event).push(handler);
        HardwareSDK.on(event, handler);
    }
    
    removeAllListeners() {
        for (const [event, handlers] of this.listeners) {
            handlers.forEach(handler => {
                HardwareSDK.off(event, handler);
            });
        }
        
        this.listeners.clear();
    }
    
    cleanup() {
        this.removeAllListeners();
    }
}

// Use in React components
useEffect(() => {
    const eventManager = new EventManager();
    
    eventManager.addListener('device-connect', handleConnect);
    eventManager.addListener('device-disconnect', handleDisconnect);
    
    return () => eventManager.cleanup();
}, []);
```

### Error Boundaries

```jsx
// React Error Boundary for OneKey operations
class OneKeyErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('OneKey Error:', error, errorInfo);
        
        // Log to error reporting service
        this.logError(error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback">
                    <h2>OneKey Connection Error</h2>
                    <p>Please check your device connection and try again.</p>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Retry
                    </button>
                </div>
            );
        }
        
        return this.props.children;
    }
}
```

## Next Steps

- [Integration Guides](../integration/web-browser.md) - Platform-specific integration
- [API Reference](../api/device.md) - Complete API documentation
- [Troubleshooting](../resources/troubleshooting.md) - Common issues and solutions
- [Best Practices](../integration/best-practices.md) - Production-ready patterns
