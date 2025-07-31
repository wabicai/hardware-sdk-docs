---
icon: route
---

# Derivation Paths

Derivation paths define how cryptocurrency addresses are generated from a master seed. Understanding paths is essential for proper address management and wallet compatibility.

## What are Derivation Paths?

Derivation paths are hierarchical deterministic (HD) wallet paths that specify how to derive specific keys from a master seed. They follow the BIP32 standard and are commonly formatted according to BIP44.

### Path Format

```
m / purpose' / coin_type' / account' / change / address_index
```

**Components**:
- `m` - Master key
- `purpose'` - Purpose (usually 44' for BIP44)
- `coin_type'` - Cryptocurrency type (hardened)
- `account'` - Account index (hardened)
- `change` - Change addresses (0 = external, 1 = internal)
- `address_index` - Address index within account

**Hardened Derivation**: The `'` symbol indicates hardened derivation, providing additional security.

## Common Path Examples

### Bitcoin (BTC)
```javascript
"m/44'/0'/0'/0/0"    // First external address
"m/44'/0'/0'/0/1"    // Second external address
"m/44'/0'/0'/1/0"    // First change address
"m/44'/0'/1'/0/0"    // Second account, first address
```

### Ethereum (ETH)
```javascript
"m/44'/60'/0'/0/0"   // First Ethereum address
"m/44'/60'/0'/0/1"   // Second Ethereum address
```

### Other Cryptocurrencies
```javascript
"m/44'/2'/0'/0/0"    // Litecoin (LTC)
"m/44'/3'/0'/0/0"    // Dogecoin (DOGE)
"m/44'/501'/0'/0/0"  // Solana (SOL)
"m/1852'/1815'/0'/0/0" // Cardano (ADA) - uses BIP1852
```

## Coin Types

Common coin type values according to [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md):

| Cryptocurrency | Coin Type | Example Path |
|----------------|-----------|--------------|
| Bitcoin | 0 | `m/44'/0'/0'/0/0` |
| Testnet | 1 | `m/44'/1'/0'/0/0` |
| Litecoin | 2 | `m/44'/2'/0'/0/0` |
| Dogecoin | 3 | `m/44'/3'/0'/0/0` |
| Ethereum | 60 | `m/44'/60'/0'/0/0` |
| Ethereum Classic | 61 | `m/44'/61'/0'/0/0` |
| Bitcoin Cash | 145 | `m/44'/145'/0'/0/0` |
| Solana | 501 | `m/44'/501'/0'/0/0` |
| Cardano | 1815 | `m/1852'/1815'/0'/0/0` |

## Path Standards

### BIP44 (Most Common)
```
m/44'/coin_type'/account'/change/address_index
```

**Usage**: Most cryptocurrencies  
**Features**: Multi-account, change addresses

### BIP49 (P2SH-P2WPKH)
```
m/49'/coin_type'/account'/change/address_index
```

**Usage**: Bitcoin SegWit wrapped addresses  
**Features**: Backward compatibility with legacy systems

### BIP84 (P2WPKH)
```
m/84'/coin_type'/account'/change/address_index
```

**Usage**: Bitcoin native SegWit addresses  
**Features**: Lower transaction fees

### BIP1852 (Cardano)
```
m/1852'/1815'/account'/change/address_index
```

**Usage**: Cardano (ADA)  
**Features**: Cardano-specific derivation

## Using Paths in OneKey SDK

### Basic Address Generation

```javascript
// Get Bitcoin address
const result = await sdk.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true,
  coin: 'btc'
});

// Get Ethereum address
const result = await sdk.ethereumGetAddress({
  path: "m/44'/60'/0'/0/0",
  showOnDevice: true
});
```

### Multiple Addresses

```javascript
// Generate multiple Bitcoin addresses
const paths = [
  "m/44'/0'/0'/0/0",
  "m/44'/0'/0'/0/1",
  "m/44'/0'/0'/0/2",
  "m/44'/0'/0'/0/3",
  "m/44'/0'/0'/0/4"
];

const addresses = [];
for (const path of paths) {
  const result = await sdk.btcGetAddress({
    path,
    showOnDevice: false, // Don't show each address on device
    coin: 'btc'
  });
  
  if (result.success) {
    addresses.push({
      path,
      address: result.payload.address
    });
  }
}
```

### Account Management

```javascript
// Different accounts for the same user
const accounts = [
  { name: 'Main Account', path: "m/44'/0'/0'/0/0" },
  { name: 'Savings Account', path: "m/44'/0'/1'/0/0" },
  { name: 'Trading Account', path: "m/44'/0'/2'/0/0" }
];

for (const account of accounts) {
  const result = await sdk.btcGetAddress({
    path: account.path,
    showOnDevice: false,
    coin: 'btc'
  });
  
  if (result.success) {
    console.log(`${account.name}: ${result.payload.address}`);
  }
}
```

## Path Validation

### Valid Path Format

```javascript
function isValidPath(path) {
  // Basic BIP32 path validation
  const pathRegex = /^m(\/\d+'?)*$/;
  return pathRegex.test(path);
}

// Examples
console.log(isValidPath("m/44'/0'/0'/0/0"));     // true
console.log(isValidPath("m/44'/60'/0'/0/0"));    // true
console.log(isValidPath("m/invalid/path"));      // false
```

### Path Components Validation

```javascript
function validateBIP44Path(path) {
  const parts = path.split('/');
  
  if (parts.length !== 6) {
    throw new Error('BIP44 path must have 6 components');
  }
  
  if (parts[0] !== 'm') {
    throw new Error('Path must start with m');
  }
  
  if (!parts[1].endsWith("'") || parseInt(parts[1]) !== 44) {
    throw new Error('Purpose must be 44\'');
  }
  
  if (!parts[2].endsWith("'")) {
    throw new Error('Coin type must be hardened');
  }
  
  if (!parts[3].endsWith("'")) {
    throw new Error('Account must be hardened');
  }
  
  const change = parseInt(parts[4]);
  if (change !== 0 && change !== 1) {
    throw new Error('Change must be 0 or 1');
  }
  
  return true;
}
```

## Best Practices

### Address Generation
- **Start with index 0**: Always begin address generation from index 0
- **Sequential generation**: Generate addresses sequentially to avoid gaps
- **Verify on device**: Use `showOnDevice: true` for the first address to verify

### Account Management
- **Use account 0**: Start with account 0 for most users
- **Separate accounts**: Use different accounts for different purposes
- **Document paths**: Keep track of which paths are used for what purpose

### Security
- **Hardened derivation**: Use hardened derivation for sensitive components
- **Path validation**: Always validate paths before use
- **Limited exposure**: Don't expose derivation paths in logs or UI

## Common Patterns

### Wallet Address Discovery

```javascript
async function discoverAddresses(sdk, coinType, account = 0) {
  const addresses = [];
  let index = 0;
  let emptyCount = 0;
  
  while (emptyCount < 20) { // Stop after 20 empty addresses
    const path = `m/44'/${coinType}'/${account}'/0/${index}`;
    
    const result = await sdk.btcGetAddress({
      path,
      showOnDevice: false,
      coin: 'btc'
    });
    
    if (result.success) {
      const address = result.payload.address;
      
      // Check if address has been used (implement your own logic)
      const hasTransactions = await checkAddressUsage(address);
      
      if (hasTransactions) {
        addresses.push({ path, address, index });
        emptyCount = 0;
      } else {
        emptyCount++;
      }
    }
    
    index++;
  }
  
  return addresses;
}
```

### Multi-Coin Wallet

```javascript
const supportedCoins = [
  { name: 'Bitcoin', coinType: 0, symbol: 'BTC' },
  { name: 'Ethereum', coinType: 60, symbol: 'ETH' },
  { name: 'Litecoin', coinType: 2, symbol: 'LTC' }
];

async function generateWalletAddresses(sdk) {
  const wallet = {};
  
  for (const coin of supportedCoins) {
    const path = `m/44'/${coin.coinType}'/0'/0/0`;
    
    let result;
    if (coin.symbol === 'ETH') {
      result = await sdk.ethereumGetAddress({ path, showOnDevice: false });
    } else {
      result = await sdk.btcGetAddress({ 
        path, 
        showOnDevice: false, 
        coin: coin.symbol.toLowerCase() 
      });
    }
    
    if (result.success) {
      wallet[coin.symbol] = {
        address: result.payload.address,
        path: path
      };
    }
  }
  
  return wallet;
}
```

## Troubleshooting

### Invalid Path Errors
- **Check format**: Ensure path follows BIP32 format
- **Verify hardening**: Use `'` for hardened derivation where required
- **Validate components**: Check each path component is valid

### Unsupported Coin Types
- **Check support**: Verify coin type is supported by OneKey
- **Use correct standard**: Some coins use different derivation standards
- **Consult documentation**: Check coin-specific requirements

### Address Mismatch
- **Verify path**: Ensure path matches expected format
- **Check coin parameter**: Verify correct coin type is specified
- **Test with known paths**: Use well-known paths for testing

## Next Steps

- [Events System](events.md) - Handling device events
- [Error Handling](errors.md) - Managing errors and exceptions
- [Bitcoin Methods](../api/bitcoin.md) - Bitcoin-specific operations
- [Ethereum Methods](../api/ethereum.md) - Ethereum-specific operations
