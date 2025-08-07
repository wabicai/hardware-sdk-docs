# Ethereum & EVM Integration

## Overview

OneKey provides comprehensive support for Ethereum and all EVM-compatible chains through the `window.$onekey.ethereum` provider. This provider follows the [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) standard and is compatible with MetaMask's API.

## Supported Networks

OneKey supports all major EVM-compatible networks including:

- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Binance Smart Chain** (Chain ID: 56)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Avalanche** (Chain ID: 43114)
- **Fantom** (Chain ID: 250)
- And many more...

## Quick Start

### 1. Provider Detection

```javascript
// Check if OneKey is installed
function getEthereumProvider() {
  // Prefer OneKey-specific provider
  if (window.$onekey?.ethereum) {
    return window.$onekey.ethereum;
  }

  // Fallback to generic ethereum provider
  if (window.ethereum) {
    return window.ethereum;
  }

  throw new Error('No Ethereum provider found. Please install OneKey wallet.');
}

// Verify it's OneKey provider
function isOneKeyProvider(provider) {
  return provider.isOneKey && provider.isOneKey();
}
```

### 2. Basic Connection

```javascript
async function connectWallet() {
  try {
    const provider = getEthereumProvider();

    // Request account access
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    });

    console.log('Connected accounts:', accounts);
    return accounts[0]; // Return primary account
  } catch (error) {
    if (error.code === 4001) {
      console.log('User rejected the request');
    } else {
      console.error('Error connecting to wallet:', error);
    }
    throw error;
  }
}
```

### 3. Get Account Information

```javascript
async function getAccountInfo() {
  const provider = getEthereumProvider();

  // Get accounts
  const accounts = await provider.request({
    method: 'eth_accounts'
  });

  // Get current chain ID
  const chainId = await provider.request({
    method: 'eth_chainId'
  });

  // Get balance
  const balance = await provider.request({
    method: 'eth_getBalance',
    params: [accounts[0], 'latest']
  });

  return {
    account: accounts[0],
    chainId: parseInt(chainId, 16),
    balance: parseInt(balance, 16) / Math.pow(10, 18) // Convert to ETH
  };
}
```

## Advanced Features

### 1. Network Management

```javascript
// Switch to a specific network
async function switchNetwork(chainId) {
  const provider = getEthereumProvider();

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }]
    });
  } catch (error) {
    // Network not added to wallet
    if (error.code === 4902) {
      await addNetwork(chainId);
    } else {
      throw error;
    }
  }
}

// Add a new network
async function addNetwork(chainId) {
  const networkConfigs = {
    137: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/']
    },
    // Add more network configurations as needed
  };

  const config = networkConfigs[chainId];
  if (!config) {
    throw new Error(`Network configuration not found for chain ID: ${chainId}`);
  }

  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [config]
  });
}
```

### 2. Event Handling

```javascript
function setupEventListeners() {
  const provider = getEthereumProvider();

  // Account changes
  provider.on('accountsChanged', (accounts) => {
    console.log('Accounts changed:', accounts);
    if (accounts.length === 0) {
      // User disconnected
      handleDisconnect();
    } else {
      // Update UI with new account
      updateAccount(accounts[0]);
    }
  });

  // Chain changes
  provider.on('chainChanged', (chainId) => {
    console.log('Chain changed:', chainId);
    const numericChainId = parseInt(chainId, 16);
    updateChain(numericChainId);
    // Reload the page to avoid stale state
    window.location.reload();
  });

  // Connection status
  provider.on('connect', (connectInfo) => {
    console.log('Connected:', connectInfo);
  });

  provider.on('disconnect', (error) => {
    console.log('Disconnected:', error);
    handleDisconnect();
  });
}

function handleDisconnect() {
  // Clear user data
  // Update UI to disconnected state
  console.log('Wallet disconnected');
}

function updateAccount(account) {
  // Update UI with new account
  console.log('Account updated:', account);
}

function updateChain(chainId) {
  // Update UI with new chain
  console.log('Chain updated:', chainId);
}
```

## Integration Guides

### Step-by-Step Guides
- [Accessing Accounts](accessing-accounts.md) - Connect and manage user accounts
- [Sending Transactions](sending-transactions.md) - Send ETH and token transactions
- [Signing Data](signing-data.md) - Sign messages and typed data
- [Provider API](provider-api.md) - Complete provider API reference
- [RPC API](rpc-api.md) - Ethereum JSON-RPC methods

### Common Use Cases
- [Basic Wallet Connection](#basic-connection)
- [Token Transfers](sending-transactions.md#token-transfers)
- [Smart Contract Interaction](sending-transactions.md#smart-contracts)
- [Message Signing](signing-data.md#personal-sign)
- [Typed Data Signing](signing-data.md#typed-data)

## Best Practices

### 1. Error Handling

```javascript
async function safeProviderCall(method, params = []) {
  try {
    const provider = getEthereumProvider();
    const result = await provider.request({ method, params });
    return { success: true, data: result };
  } catch (error) {
    console.error(`Provider call failed: ${method}`, error);

    // Handle specific error codes
    switch (error.code) {
      case 4001:
        return { success: false, error: 'User rejected the request' };
      case 4100:
        return { success: false, error: 'Unauthorized' };
      case 4200:
        return { success: false, error: 'Unsupported method' };
      case 4900:
        return { success: false, error: 'Disconnected' };
      case 4901:
        return { success: false, error: 'Chain disconnected' };
      default:
        return { success: false, error: error.message || 'Unknown error' };
    }
  }
}
```

### 2. Connection State Management

```javascript
class WalletConnection {
  constructor() {
    this.provider = null;
    this.account = null;
    this.chainId = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.provider = getEthereumProvider();
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      });

      this.account = accounts[0];
      this.chainId = await this.provider.request({
        method: 'eth_chainId'
      });
      this.isConnected = true;

      this.setupEventListeners();
      return this.account;
    } catch (error) {
      this.isConnected = false;
      throw error;
    }
  }

  setupEventListeners() {
    this.provider.on('accountsChanged', (accounts) => {
      this.account = accounts[0] || null;
      this.isConnected = !!this.account;
    });

    this.provider.on('chainChanged', (chainId) => {
      this.chainId = chainId;
    });
  }

  disconnect() {
    this.account = null;
    this.chainId = null;
    this.isConnected = false;
    // Remove event listeners if needed
  }
}
```

## Live Examples

- **[Interactive Demo](https://dapp-example.onekeytest.com/ethereum)** - Try all features live
- **[GitHub Source](https://github.com/OneKeyHQ/cross-inpage-provider/tree/main/packages/example/components/chains/ethereum)** - Complete example code

## Troubleshooting

### Common Issues

1. **Provider not found**
   ```javascript
   if (!window.$onekey?.ethereum) {
     alert('Please install OneKey wallet');
     window.open('https://onekey.so/download', '_blank');
   }
   ```

2. **User rejection**
   ```javascript
   if (error.code === 4001) {
     console.log('User rejected the connection request');
     // Show user-friendly message
   }
   ```

3. **Network mismatch**
   ```javascript
   const expectedChainId = 1; // Ethereum mainnet
   const currentChainId = await provider.request({ method: 'eth_chainId' });

   if (parseInt(currentChainId, 16) !== expectedChainId) {
     await switchNetwork(expectedChainId);
   }
   ```

### Getting Help

- [GitHub Issues](https://github.com/OneKeyHQ/cross-inpage-provider/issues)
- [Discord Community](https://discord.gg/onekey)
- [Developer Documentation](https://developer.onekey.so/)

