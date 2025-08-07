# NEAR Protocol Integration

## Overview

OneKey provides comprehensive NEAR Protocol support through the `window.$onekey.near` provider. This includes support for NEAR mainnet, testnet, and all standard NEAR operations including token transfers, smart contract interactions, and staking.

## Supported Networks

- **NEAR Mainnet** (mainnet)
- **NEAR Testnet** (testnet)

## Supported Features

- **NEAR Token Transfers** - Send and receive NEAR tokens
- **Smart Contract Calls** - Interact with NEAR smart contracts
- **Account Management** - Create and manage NEAR accounts
- **Staking Operations** - Stake and unstake NEAR tokens
- **Message Signing** - Sign arbitrary messages
- **Transaction Signing** - Sign NEAR transactions
- **Access Key Management** - Manage function call access keys

## Quick Start

### 1. Provider Detection

```javascript
// Check if OneKey NEAR provider is available
function getNearProvider() {
  if (window.$onekey?.near) {
    return window.$onekey.near;
  }

  throw new Error('OneKey NEAR provider not found. Please install OneKey wallet.');
}

// Verify it's OneKey provider
function isOneKeyNearProvider(provider) {
  return provider.isOneKey === true;
}
```

### 2. Connect to Wallet

```javascript
async function connectNearWallet() {
  try {
    const provider = getNearProvider();

    // Request account access
    const response = await provider.requestSignIn({
      contractId: 'your-contract.near', // Optional: specific contract
      methodNames: [], // Optional: specific methods
      successUrl: window.location.href,
      failureUrl: window.location.href
    });

    console.log('Connected to NEAR wallet:', response);
    return response;
  } catch (error) {
    console.error('Failed to connect to NEAR wallet:', error);
    throw error;
  }
}
```

### 3. Get Account Information

```javascript
async function getNearAccountInfo() {
  const provider = getNearProvider();

  // Check if signed in
  if (!provider.isSignedIn()) {
    throw new Error('Not signed in to NEAR wallet');
  }

  // Get account ID
  const accountId = provider.getAccountId();

  // Get account state
  const account = await provider.account();
  const accountState = await account.state();

  return {
    accountId,
    balance: accountState.amount,
    storage: accountState.storage_usage,
    codeHash: accountState.code_hash
  };
}
```

## Core Features

### 1. Account Management

```javascript
// Check if signed in
const isSignedIn = provider.isSignedIn();

// Get current account ID
const accountId = provider.getAccountId();

// Sign out
await provider.signOut();

// Request sign in with specific permissions
await provider.requestSignIn({
  contractId: 'example.near',
  methodNames: ['transfer', 'deposit'],
  successUrl: 'https://yourapp.com/success',
  failureUrl: 'https://yourapp.com/failure'
});
```

### 2. Token Transfers

```javascript
// Send NEAR tokens
async function sendNear(receiverId, amount) {
  try {
    const provider = getNearProvider();

    if (!provider.isSignedIn()) {
      throw new Error('Not signed in');
    }

    const account = await provider.account();

    // Send NEAR tokens (amount in yoctoNEAR)
    const result = await account.sendMoney(
      receiverId,
      amount // Amount in yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
    );

    console.log('Transfer successful:', result);
    return result;
  } catch (error) {
    console.error('Failed to send NEAR:', error);
    throw error;
  }
}

// Example: Send 1 NEAR
await sendNear('recipient.near', '1000000000000000000000000'); // 1 NEAR in yoctoNEAR
```

### 3. Smart Contract Interactions

```javascript
// Call a smart contract method
async function callContract(contractId, methodName, args, gas = '30000000000000', deposit = '0') {
  try {
    const provider = getNearProvider();

    if (!provider.isSignedIn()) {
      throw new Error('Not signed in');
    }

    const account = await provider.account();

    // Call contract method
    const result = await account.functionCall({
      contractId: contractId,
      methodName: methodName,
      args: args,
      gas: gas,
      attachedDeposit: deposit
    });

    console.log('Contract call successful:', result);
    return result;
  } catch (error) {
    console.error('Contract call failed:', error);
    throw error;
  }
}

// Example: Call a contract method
await callContract(
  'example.near',
  'transfer',
  {
    receiver_id: 'recipient.near',
    amount: '1000000000000000000000000'
  },
  '30000000000000', // 30 TGas
  '1' // 1 yoctoNEAR deposit
);
```

### 4. View Contract State

```javascript
// View contract state (read-only)
async function viewContract(contractId, methodName, args = {}) {
  try {
    const provider = getNearProvider();
    const account = await provider.account();

    // View contract state
    const result = await account.viewFunction(
      contractId,
      methodName,
      args
    );

    console.log('Contract view result:', result);
    return result;
  } catch (error) {
    console.error('Contract view failed:', error);
    throw error;
  }
}

// Example: Get token balance
const balance = await viewContract(
  'token.near',
  'ft_balance_of',
  { account_id: 'user.near' }
);
```

### 5. Transaction Signing

```javascript
// Sign a transaction
async function signTransaction(transaction) {
  try {
    const provider = getNearProvider();

    if (!provider.isSignedIn()) {
      throw new Error('Not signed in');
    }

    // Sign transaction
    const signedTx = await provider.signTransaction(transaction);

    console.log('Transaction signed:', signedTx);
    return signedTx;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
}
```

### 6. Message Signing

```javascript
// Sign a message
async function signMessage(message, recipient, nonce) {
  try {
    const provider = getNearProvider();

    if (!provider.isSignedIn()) {
      throw new Error('Not signed in');
    }

    // Sign message
    const signature = await provider.signMessage({
      message: message,
      recipient: recipient,
      nonce: nonce
    });

    console.log('Message signed:', signature);
    return signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
}

// Example usage
const signature = await signMessage(
  'Hello OneKey NEAR!',
  'recipient.near',
  Buffer.from('unique-nonce')
);
```

## Advanced Features

### 1. Access Key Management

```javascript
// Add function call access key
async function addAccessKey(contractId, methodNames, allowance) {
  try {
    const provider = getNearProvider();
    const account = await provider.account();

    // Generate new key pair
    const keyPair = nearAPI.utils.KeyPair.fromRandom('ed25519');

    // Add access key
    const result = await account.addKey(
      keyPair.getPublicKey(),
      contractId,
      methodNames,
      allowance
    );

    console.log('Access key added:', result);
    return { keyPair, result };
  } catch (error) {
    console.error('Failed to add access key:', error);
    throw error;
  }
}

// Delete access key
async function deleteAccessKey(publicKey) {
  try {
    const provider = getNearProvider();
    const account = await provider.account();

    const result = await account.deleteKey(publicKey);

    console.log('Access key deleted:', result);
    return result;
  } catch (error) {
    console.error('Failed to delete access key:', error);
    throw error;
  }
}
```

### 2. Staking Operations

```javascript
// Stake NEAR tokens
async function stakeNear(validatorId, amount) {
  try {
    const provider = getNearProvider();
    const account = await provider.account();

    // Stake tokens
    const result = await account.functionCall({
      contractId: validatorId,
      methodName: 'deposit_and_stake',
      args: {},
      gas: '30000000000000',
      attachedDeposit: amount
    });

    console.log('Staking successful:', result);
    return result;
  } catch (error) {
    console.error('Staking failed:', error);
    throw error;
  }
}

// Unstake NEAR tokens
async function unstakeNear(validatorId, amount) {
  try {
    const provider = getNearProvider();
    const account = await provider.account();

    // Unstake tokens
    const result = await account.functionCall({
      contractId: validatorId,
      methodName: 'unstake',
      args: { amount: amount },
      gas: '30000000000000',
      attachedDeposit: '0'
    });

    console.log('Unstaking successful:', result);
    return result;
  } catch (error) {
    console.error('Unstaking failed:', error);
    throw error;
  }
}
```

### 3. Complete Integration Example

```javascript
class NearWalletIntegration {
  constructor() {
    this.provider = null;
    this.accountId = null;
    this.isSignedIn = false;
  }

  async connect(contractId = null) {
    try {
      this.provider = getNearProvider();

      // Request sign in
      await this.provider.requestSignIn({
        contractId: contractId,
        successUrl: window.location.href,
        failureUrl: window.location.href
      });

      // Check if signed in after redirect
      this.isSignedIn = this.provider.isSignedIn();
      if (this.isSignedIn) {
        this.accountId = this.provider.getAccountId();
      }

      console.log('NEAR wallet connected:', this.accountId);
      return this.accountId;
    } catch (error) {
      this.isSignedIn = false;
      throw error;
    }
  }

  async getBalance() {
    if (!this.isSignedIn) throw new Error('Not signed in');

    const account = await this.provider.account();
    const accountState = await account.state();

    return accountState.amount;
  }

  async sendNear(receiverId, amount) {
    if (!this.isSignedIn) throw new Error('Not signed in');

    const account = await this.provider.account();
    return await account.sendMoney(receiverId, amount);
  }

  async callContract(contractId, methodName, args, gas = '30000000000000', deposit = '0') {
    if (!this.isSignedIn) throw new Error('Not signed in');

    const account = await this.provider.account();
    return await account.functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit: deposit
    });
  }

  async signOut() {
    if (this.provider && this.isSignedIn) {
      await this.provider.signOut();
    }
    this.accountId = null;
    this.isSignedIn = false;
  }
}

// Usage
const nearWallet = new NearWalletIntegration();
await nearWallet.connect('example.near');
const balance = await nearWallet.getBalance();
console.log('NEAR balance:', balance);
```

## Integration Guides

### Detailed Documentation
- [Introduction](introduction.md) - NEAR Protocol overview
- [Integrating](integrating/README.md) - Step-by-step integration guides
  - [Detecting the Provider](integrating/detecting-the-provider.md)
  - [Establishing a Connection](integrating/establishing-a-connection.md)
  - [Accessing Accounts](integrating/accessing-accounts.md)
  - [Sending Transactions](integrating/sending-transactions/README.md)
  - [Signing Messages](integrating/signing-messages.md)
  - [RPC API Calling](integrating/rpc-api-calling.md)
- [API Reference](reference/api-reference.md) - Complete API documentation
- [Resources](resources/README.md) - Examples and additional resources

## Best Practices

### 1. Error Handling

```javascript
async function safeNearCall(operation) {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    console.error('NEAR operation failed:', error);

    // Handle specific error types
    if (error.message?.includes('Not signed in')) {
      return { success: false, error: 'Please sign in to NEAR wallet' };
    } else if (error.message?.includes('Insufficient funds')) {
      return { success: false, error: 'Insufficient NEAR balance' };
    } else {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
}
```

### 2. Amount Handling

```javascript
// Always work with yoctoNEAR (smallest NEAR unit)
const YOCTO_NEAR = '1000000000000000000000000'; // 1 NEAR in yoctoNEAR

function nearToYocto(near) {
  return (parseFloat(near) * parseFloat(YOCTO_NEAR)).toString();
}

function yoctoToNear(yocto) {
  return (parseFloat(yocto) / parseFloat(YOCTO_NEAR)).toString();
}

// Send 1 NEAR
await sendNear('recipient.near', nearToYocto('1'));
```

### 3. Gas Management

```javascript
// Standard gas amounts for different operations
const GAS_AMOUNTS = {
  simple_call: '30000000000000',      // 30 TGas
  complex_call: '100000000000000',    // 100 TGas
  contract_deploy: '300000000000000'  // 300 TGas
};

// Use appropriate gas for operations
await callContract(
  'contract.near',
  'complex_method',
  args,
  GAS_AMOUNTS.complex_call
);
```

## Live Examples

- **[Interactive Demo](https://dapp-example.onekeytest.com/near)** - Try NEAR features live
- **[GitHub Source](https://github.com/OneKeyHQ/cross-inpage-provider/tree/main/packages/providers/onekey-near-provider)** - Complete provider source code

## Troubleshooting

### Common Issues

1. **Provider not found**
   ```javascript
   if (!window.$onekey?.near) {
     alert('Please install OneKey wallet and enable NEAR support');
   }
   ```

2. **Not signed in**
   ```javascript
   if (!provider.isSignedIn()) {
     await provider.requestSignIn({
       successUrl: window.location.href,
       failureUrl: window.location.href
     });
   }
   ```

3. **Insufficient gas**
   ```javascript
   // Always provide adequate gas for contract calls
   const gas = '100000000000000'; // 100 TGas
   ```

### Getting Help

- [GitHub Issues](https://github.com/OneKeyHQ/cross-inpage-provider/issues)
- [Discord Community](https://discord.gg/onekey)
- [NEAR Documentation](https://docs.near.org/)
- [Developer Documentation](https://developer.onekey.so/)

