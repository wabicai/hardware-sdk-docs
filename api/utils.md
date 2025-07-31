---
icon: tools
---

# Utility Methods

Helper functions and utility methods for working with OneKey hardware devices, including path conversion, data formatting, and common operations.

## Path Utilities

### pathToArray()

Convert BIP-44 derivation path string to array format.

```javascript
// Helper function (not part of SDK, but commonly used)
const pathToArray = (path) => {
  return path.split('/').slice(1).map(component => {
    const hardened = component.endsWith("'");
    const index = parseInt(component.replace("'", ""));
    return hardened ? index | 0x80000000 : index;
  });
};

// Usage
const pathArray = pathToArray("m/44'/0'/0'/0/0");
console.log(pathArray); // [2147483692, 2147483648, 2147483648, 0, 0]
```

### arrayToPath()

Convert derivation path array back to string format.

```javascript
// Helper function
const arrayToPath = (pathArray) => {
  return 'm/' + pathArray.map(component => {
    const hardened = (component & 0x80000000) !== 0;
    const index = component & 0x7fffffff;
    return hardened ? `${index}'` : `${index}`;
  }).join('/');
};

// Usage
const pathString = arrayToPath([2147483692, 2147483648, 2147483648, 0, 0]);
console.log(pathString); // "m/44'/0'/0'/0/0"
```

## Data Formatting

### hexToBytes()

Convert hex string to byte array.

```javascript
const hexToBytes = (hex) => {
  const cleanHex = hex.replace(/^0x/, '');
  const bytes = [];
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.substr(i, 2), 16));
  }
  return bytes;
};

// Usage
const bytes = hexToBytes('0x48656c6c6f');
console.log(bytes); // [72, 101, 108, 108, 111]
```

### bytesToHex()

Convert byte array to hex string.

```javascript
const bytesToHex = (bytes) => {
  return '0x' + bytes.map(byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
};

// Usage
const hex = bytesToHex([72, 101, 108, 108, 111]);
console.log(hex); // "0x48656c6c6f"
```

### stringToHex()

Convert string to hex representation.

```javascript
const stringToHex = (str) => {
  return '0x' + Array.from(str)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

// Usage
const hex = stringToHex('Hello');
console.log(hex); // "0x48656c6c6f"
```

### hexToString()

Convert hex string back to readable string.

```javascript
const hexToString = (hex) => {
  const cleanHex = hex.replace(/^0x/, '');
  let str = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
  }
  return str;
};

// Usage
const str = hexToString('0x48656c6c6f');
console.log(str); // "Hello"
```

## Address Validation

### isValidBitcoinAddress()

Validate Bitcoin address format.

```javascript
const isValidBitcoinAddress = (address) => {
  // Legacy P2PKH (starts with 1)
  const p2pkhRegex = /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // P2SH (starts with 3)
  const p2shRegex = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // Bech32 (starts with bc1)
  const bech32Regex = /^bc1[a-z0-9]{39,59}$/;
  
  return p2pkhRegex.test(address) || 
         p2shRegex.test(address) || 
         bech32Regex.test(address);
};

// Usage
console.log(isValidBitcoinAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')); // true
console.log(isValidBitcoinAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')); // true
console.log(isValidBitcoinAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')); // true
```

### isValidEthereumAddress()

Validate Ethereum address format.

```javascript
const isValidEthereumAddress = (address) => {
  // Check if it's a valid hex string with 0x prefix and 40 characters
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethRegex.test(address);
};

// Usage
console.log(isValidEthereumAddress('0x742d35Cc6634C0532925a3b8D400E4C3f8c8C9C8')); // true
console.log(isValidEthereumAddress('0xinvalid')); // false
```

## Amount Conversion

### satoshiToBTC()

Convert satoshi to BTC.

```javascript
const satoshiToBTC = (satoshi) => {
  return satoshi / 100000000;
};

// Usage
console.log(satoshiToBTC(100000000)); // 1
console.log(satoshiToBTC(50000)); // 0.0005
```

### btcToSatoshi()

Convert BTC to satoshi.

```javascript
const btcToSatoshi = (btc) => {
  return Math.round(btc * 100000000);
};

// Usage
console.log(btcToSatoshi(1)); // 100000000
console.log(btcToSatoshi(0.0005)); // 50000
```

### weiToEther()

Convert wei to ether.

```javascript
const weiToEther = (wei) => {
  return wei / Math.pow(10, 18);
};

// Usage
console.log(weiToEther('1000000000000000000')); // 1
```

### etherToWei()

Convert ether to wei.

```javascript
const etherToWei = (ether) => {
  return (ether * Math.pow(10, 18)).toString();
};

// Usage
console.log(etherToWei(1)); // "1000000000000000000"
```

## Error Handling Utilities

### isOneKeyError()

Check if error is from OneKey SDK.

```javascript
const isOneKeyError = (error) => {
  return error && typeof error === 'object' && 
         ('success' in error || 'payload' in error);
};

// Usage
try {
  const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
  });
  
  if (!result.success) {
    if (isOneKeyError(result)) {
      console.log('OneKey error:', result.payload.error);
    }
  }
} catch (error) {
  console.log('General error:', error.message);
}
```

### getErrorMessage()

Extract user-friendly error message.

```javascript
const getErrorMessage = (error) => {
  if (isOneKeyError(error)) {
    return error.payload.error || error.payload.message || 'Unknown OneKey error';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
};

// Usage
const errorMessage = getErrorMessage(result);
console.log('Error:', errorMessage);
```

## Device Utilities

### getDeviceModel()

Get device model from features.

```javascript
const getDeviceModel = (features) => {
  const models = {
    '1': 'OneKey Classic',
    'T': 'OneKey Touch',
    'Mini': 'OneKey Mini'
  };
  
  return models[features.model] || `Unknown (${features.model})`;
};

// Usage
const features = await HardwareSDK.getFeatures();
if (features.success) {
  console.log('Device model:', getDeviceModel(features.payload));
}
```

### getFirmwareVersion()

Get formatted firmware version.

```javascript
const getFirmwareVersion = (features) => {
  return `${features.major_version}.${features.minor_version}.${features.patch_version}`;
};

// Usage
const features = await HardwareSDK.getFeatures();
if (features.success) {
  console.log('Firmware version:', getFirmwareVersion(features.payload));
}
```

### isDeviceReady()

Check if device is ready for operations.

```javascript
const isDeviceReady = (features) => {
  return features.initialized && 
         !features.bootloader_mode && 
         features.pin_protection;
};

// Usage
const features = await HardwareSDK.getFeatures();
if (features.success) {
  if (isDeviceReady(features.payload)) {
    console.log('Device is ready');
  } else {
    console.log('Device needs setup');
  }
}
```

## Coin Utilities

### getCoinType()

Get BIP-44 coin type for supported coins.

```javascript
const getCoinType = (coin) => {
  const coinTypes = {
    'btc': 0,
    'test': 1,
    'ltc': 2,
    'doge': 3,
    'dash': 5,
    'eth': 60,
    'bch': 145,
    'zec': 133
  };
  
  return coinTypes[coin.toLowerCase()];
};

// Usage
console.log(getCoinType('btc')); // 0
console.log(getCoinType('eth')); // 60
```

### getStandardPath()

Generate standard BIP-44 path for coin.

```javascript
const getStandardPath = (coin, account = 0, change = 0, index = 0) => {
  const coinType = getCoinType(coin);
  if (coinType === undefined) {
    throw new Error(`Unsupported coin: ${coin}`);
  }
  
  return `m/44'/${coinType}'/${account}'/${change}/${index}`;
};

// Usage
console.log(getStandardPath('btc')); // "m/44'/0'/0'/0/0"
console.log(getStandardPath('eth', 0, 0, 1)); // "m/44'/60'/0'/0/1"
```

## Validation Utilities

### validatePath()

Validate BIP-44 derivation path format.

```javascript
const validatePath = (path) => {
  const pathRegex = /^m(\/\d+'?)*$/;
  
  if (!pathRegex.test(path)) {
    return false;
  }
  
  const components = path.split('/').slice(1);
  
  // Check depth (should be 5 for BIP-44: purpose/coin/account/change/index)
  if (components.length !== 5) {
    return false;
  }
  
  // Check if first component is 44' (BIP-44)
  if (components[0] !== "44'") {
    return false;
  }
  
  return true;
};

// Usage
console.log(validatePath("m/44'/0'/0'/0/0")); // true
console.log(validatePath("m/44'/0'/0'")); // false (too short)
console.log(validatePath("m/45'/0'/0'/0/0")); // false (not BIP-44)
```

### validateAmount()

Validate amount format and range.

```javascript
const validateAmount = (amount, decimals = 8) => {
  const num = parseFloat(amount);
  
  if (isNaN(num) || num <= 0) {
    return false;
  }
  
  // Check decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > decimals) {
    return false;
  }
  
  return true;
};

// Usage
console.log(validateAmount('1.5')); // true
console.log(validateAmount('1.123456789')); // false (too many decimals)
console.log(validateAmount('0')); // false (zero amount)
```

## Next Steps

- [Device Management](device.md) - Device connection and management
- [Bitcoin & Bitcoin Forks](bitcoin.md) - Bitcoin-specific operations
- [Ethereum & EVM Chains](ethereum.md) - Ethereum-specific operations
- [Solana](solana.md) - Solana blockchain operations
- [Cardano](cardano.md) - Cardano blockchain operations
- [Polkadot](polkadot.md) - Polkadot and Substrate chains
- [Cosmos](cosmos.md) - Cosmos ecosystem chains
