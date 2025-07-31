---
icon: rocket
---

# Advanced Examples

Complex integration patterns and real-world use cases for OneKey SDK.

## Multi-Chain DeFi Wallet

Complete wallet implementation supporting multiple blockchains and DeFi protocols.

### Wallet Architecture

```javascript
class OneKeyDeFiWallet {
  constructor() {
    this.sdk = null;
    this.chains = new Map();
    this.connected = false;
    this.addresses = new Map();
  }

  async initialize() {
    // Initialize SDK with proper configuration
    this.sdk = new OneKeySDK({
      debug: process.env.NODE_ENV === 'development',
      manifest: {
        email: 'developer@defi-app.com',
        appName: 'DeFi Wallet Pro',
        appUrl: 'https://defi-app.com'
      }
    });

    // Setup supported chains
    this.setupChains();
    
    // Connect to device
    await this.connectDevice();
    
    // Initialize addresses
    await this.initializeAddresses();
  }

  setupChains() {
    this.chains.set('ethereum', {
      name: 'Ethereum',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
      path: "m/44'/60'/0'/0/0",
      nativeCurrency: { symbol: 'ETH', decimals: 18 }
    });

    this.chains.set('polygon', {
      name: 'Polygon',
      chainId: 137,
      rpcUrl: 'https://polygon-rpc.com',
      path: "m/44'/60'/0'/0/0", // Same as Ethereum
      nativeCurrency: { symbol: 'MATIC', decimals: 18 }
    });

    this.chains.set('bsc', {
      name: 'Binance Smart Chain',
      chainId: 56,
      rpcUrl: 'https://bsc-dataseed.binance.org',
      path: "m/44'/60'/0'/0/0", // Same as Ethereum
      nativeCurrency: { symbol: 'BNB', decimals: 18 }
    });

    this.chains.set('bitcoin', {
      name: 'Bitcoin',
      path: "m/44'/0'/0'/0/0",
      nativeCurrency: { symbol: 'BTC', decimals: 8 }
    });

    this.chains.set('solana', {
      name: 'Solana',
      path: "m/44'/501'/0'/0/0",
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      nativeCurrency: { symbol: 'SOL', decimals: 9 }
    });
  }

  async connectDevice() {
    try {
      // For Node.js environments
      if (typeof window === 'undefined') {
        const devices = await this.sdk.searchDevices();
        if (devices.length === 0) {
          throw new Error('No OneKey device found');
        }
        await this.sdk.connectDevice(devices[0].path);
      }

      // Get device info
      const features = await this.sdk.getFeatures();
      this.connected = true;
      
      console.log(`Connected to ${features.model}`);
      return features;
    } catch (error) {
      console.error('Device connection failed:', error);
      throw error;
    }
  }

  async initializeAddresses() {
    for (const [chainKey, chain] of this.chains) {
      try {
        let address;
        
        if (chainKey === 'bitcoin') {
          const result = await this.sdk.btcGetAddress({
            path: chain.path,
            showOnDevice: false,
            coin: 'btc'
          });
          address = result.success ? result.payload.address : null;
        } else if (chainKey === 'solana') {
          const result = await this.sdk.solanaGetAddress({
            path: chain.path,
            showOnDevice: false
          });
          address = result.success ? result.payload.address : null;
        } else {
          // EVM chains
          const result = await this.sdk.ethereumGetAddress({
            path: chain.path,
            showOnDevice: false,
            chainId: chain.chainId
          });
          address = result.success ? result.payload.address : null;
        }

        if (address) {
          this.addresses.set(chainKey, address);
          console.log(`${chain.name} address: ${address}`);
        }
      } catch (error) {
        console.error(`Failed to get ${chain.name} address:`, error);
      }
    }
  }

  // Get portfolio balances across all chains
  async getPortfolio() {
    const portfolio = {
      totalValueUSD: 0,
      chains: {}
    };

    for (const [chainKey, chain] of this.chains) {
      const address = this.addresses.get(chainKey);
      if (!address) continue;

      try {
        const balance = await this.getChainBalance(chainKey, address);
        const valueUSD = await this.getUSDValue(chainKey, balance);
        
        portfolio.chains[chainKey] = {
          name: chain.name,
          address,
          balance,
          valueUSD,
          currency: chain.nativeCurrency
        };
        
        portfolio.totalValueUSD += valueUSD;
      } catch (error) {
        console.error(`Failed to get ${chain.name} balance:`, error);
      }
    }

    return portfolio;
  }

  // Swap tokens using 1inch API
  async swapTokens(fromChain, fromToken, toToken, amount) {
    if (!this.addresses.has(fromChain)) {
      throw new Error(`No address for chain: ${fromChain}`);
    }

    const chain = this.chains.get(fromChain);
    const fromAddress = this.addresses.get(fromChain);

    // Get swap quote from 1inch
    const quote = await this.get1inchQuote(
      chain.chainId,
      fromToken,
      toToken,
      amount
    );

    // Build transaction
    const swapTx = await this.build1inchTransaction(
      chain.chainId,
      fromAddress,
      quote
    );

    // Sign transaction with OneKey
    const result = await this.sdk.ethereumSignTransaction({
      path: chain.path,
      transaction: {
        to: swapTx.to,
        value: swapTx.value || '0x0',
        data: swapTx.data,
        gasLimit: `0x${swapTx.gas.toString(16)}`,
        gasPrice: `0x${swapTx.gasPrice.toString(16)}`,
        nonce: `0x${swapTx.nonce.toString(16)}`,
        chainId: chain.chainId
      }
    });

    if (result.success) {
      return {
        signedTx: result.payload.serializedTx,
        txHash: await this.broadcastTransaction(fromChain, result.payload.serializedTx)
      };
    } else {
      throw new Error(result.payload.error);
    }
  }

  // Stake ETH 2.0
  async stakeETH(amount) {
    const ethChain = this.chains.get('ethereum');
    const ethAddress = this.addresses.get('ethereum');

    // Lido staking contract
    const lidoContract = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
    
    // submit() function call data
    const submitData = '0xa1903eab'; // submit(address _referral)
    const referralAddress = '0x0000000000000000000000000000000000000000';
    const callData = submitData + referralAddress.slice(2).padStart(64, '0');

    const result = await this.sdk.ethereumSignTransaction({
      path: ethChain.path,
      transaction: {
        to: lidoContract,
        value: `0x${amount.toString(16)}`,
        data: callData,
        gasLimit: '0x30d40', // 200000
        gasPrice: await this.getGasPrice('ethereum'),
        nonce: await this.getNonce('ethereum', ethAddress),
        chainId: 1
      }
    });

    if (result.success) {
      return await this.broadcastTransaction('ethereum', result.payload.serializedTx);
    } else {
      throw new Error(result.payload.error);
    }
  }

  // Cross-chain bridge using Multichain
  async bridgeTokens(fromChain, toChain, token, amount) {
    // Implementation for cross-chain bridging
    // This would integrate with bridge protocols like Multichain, Hop, etc.
    
    const fromChainConfig = this.chains.get(fromChain);
    const fromAddress = this.addresses.get(fromChain);
    
    // Get bridge contract and build transaction
    const bridgeContract = await this.getBridgeContract(fromChain, toChain, token);
    const bridgeTx = await this.buildBridgeTransaction(
      bridgeContract,
      fromAddress,
      toChain,
      token,
      amount
    );

    // Sign with OneKey
    const result = await this.sdk.ethereumSignTransaction({
      path: fromChainConfig.path,
      transaction: bridgeTx
    });

    if (result.success) {
      return await this.broadcastTransaction(fromChain, result.payload.serializedTx);
    } else {
      throw new Error(result.payload.error);
    }
  }

  // Helper methods
  async getChainBalance(chainKey, address) {
    // Implement balance checking for each chain
    // This would use appropriate RPC calls or APIs
  }

  async getUSDValue(chainKey, balance) {
    // Get USD value from price APIs like CoinGecko
  }

  async get1inchQuote(chainId, fromToken, toToken, amount) {
    // Call 1inch API for swap quote
  }

  async build1inchTransaction(chainId, fromAddress, quote) {
    // Build transaction from 1inch quote
  }

  async broadcastTransaction(chainKey, signedTx) {
    // Broadcast transaction to appropriate network
  }

  async getGasPrice(chainKey) {
    // Get current gas price for chain
  }

  async getNonce(chainKey, address) {
    // Get current nonce for address
  }
}

// Usage
const wallet = new OneKeyDeFiWallet();
await wallet.initialize();

// Get portfolio
const portfolio = await wallet.getPortfolio();
console.log('Portfolio:', portfolio);

// Perform swap
const swapResult = await wallet.swapTokens(
  'ethereum',
  '0xA0b86a33E6417c8f2c8B758B2d7D2E8E8E8E8E8E', // USDC
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '1000000000' // 1000 USDC
);
```

## NFT Marketplace Integration

Complete NFT marketplace with OneKey integration for minting, buying, and selling.

### NFT Wallet Manager

```javascript
class OneKeyNFTWallet {
  constructor() {
    this.sdk = null;
    this.web3 = null;
    this.contracts = new Map();
  }

  async initialize() {
    // Initialize OneKey SDK
    this.sdk = new OneKeySDK({
      manifest: {
        email: 'developer@nft-marketplace.com',
        appName: 'NFT Marketplace Pro',
        appUrl: 'https://nft-marketplace.com'
      }
    });

    // Initialize Web3 with OneKey provider
    this.web3 = new Web3(new OneKeyProvider(this.sdk));
    
    // Setup NFT contracts
    this.setupContracts();
  }

  setupContracts() {
    // OpenSea Seaport contract
    this.contracts.set('seaport', {
      address: '0x00000000006c3852cbEf3e08E8dF289169EdE581',
      abi: SEAPORT_ABI
    });

    // ERC-721 standard
    this.contracts.set('erc721', {
      abi: ERC721_ABI
    });

    // ERC-1155 standard
    this.contracts.set('erc1155', {
      abi: ERC1155_ABI
    });
  }

  // Get user's NFT collection
  async getNFTCollection(address) {
    const collections = [];
    
    // Get NFTs from OpenSea API
    const response = await fetch(
      `https://api.opensea.io/api/v1/assets?owner=${address}&limit=200`
    );
    const data = await response.json();

    for (const asset of data.assets) {
      collections.push({
        tokenId: asset.token_id,
        contractAddress: asset.asset_contract.address,
        name: asset.name,
        description: asset.description,
        imageUrl: asset.image_url,
        collection: asset.collection.name,
        standard: asset.asset_contract.schema_name // ERC721 or ERC1155
      });
    }

    return collections;
  }

  // Mint NFT
  async mintNFT(contractAddress, to, tokenURI, price = 0) {
    const contract = new this.web3.eth.Contract(
      this.contracts.get('erc721').abi,
      contractAddress
    );

    // Build mint transaction
    const mintData = contract.methods.mint(to, tokenURI).encodeABI();
    
    const gasEstimate = await contract.methods.mint(to, tokenURI).estimateGas({
      from: to,
      value: price
    });

    // Sign with OneKey
    const result = await this.sdk.ethereumSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction: {
        to: contractAddress,
        value: `0x${price.toString(16)}`,
        data: mintData,
        gasLimit: `0x${Math.ceil(gasEstimate * 1.2).toString(16)}`,
        gasPrice: await this.getGasPrice(),
        nonce: await this.getNonce(to),
        chainId: 1
      }
    });

    if (result.success) {
      return await this.broadcastTransaction(result.payload.serializedTx);
    } else {
      throw new Error(result.payload.error);
    }
  }

  // Buy NFT using OpenSea Seaport
  async buyNFT(order, fulfiller) {
    const seaportContract = new this.web3.eth.Contract(
      this.contracts.get('seaport').abi,
      this.contracts.get('seaport').address
    );

    // Fulfill order
    const fulfillData = seaportContract.methods.fulfillOrder(
      order,
      '0x0000000000000000000000000000000000000000' // conduitKey
    ).encodeABI();

    const gasEstimate = await seaportContract.methods.fulfillOrder(
      order,
      '0x0000000000000000000000000000000000000000'
    ).estimateGas({
      from: fulfiller,
      value: order.consideration[0].startAmount // Payment amount
    });

    // Sign with OneKey
    const result = await this.sdk.ethereumSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction: {
        to: this.contracts.get('seaport').address,
        value: order.consideration[0].startAmount,
        data: fulfillData,
        gasLimit: `0x${Math.ceil(gasEstimate * 1.2).toString(16)}`,
        gasPrice: await this.getGasPrice(),
        nonce: await this.getNonce(fulfiller),
        chainId: 1
      }
    });

    if (result.success) {
      return await this.broadcastTransaction(result.payload.serializedTx);
    } else {
      throw new Error(result.payload.error);
    }
  }

  // List NFT for sale
  async listNFT(tokenContract, tokenId, price, duration = 86400) {
    const seller = await this.getAddress();
    
    // Create OpenSea order
    const order = {
      offerer: seller,
      zone: '0x0000000000000000000000000000000000000000',
      orderType: 0, // FULL_OPEN
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + duration,
      zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      salt: this.generateSalt(),
      conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
      offer: [{
        itemType: 2, // ERC721
        token: tokenContract,
        identifierOrCriteria: tokenId,
        startAmount: '1',
        endAmount: '1'
      }],
      consideration: [{
        itemType: 0, // ETH
        token: '0x0000000000000000000000000000000000000000',
        identifierOrCriteria: '0',
        startAmount: price,
        endAmount: price,
        recipient: seller
      }]
    };

    // Sign order with OneKey
    const orderHash = this.getOrderHash(order);
    const signature = await this.sdk.ethereumSignMessage({
      path: "m/44'/60'/0'/0/0",
      message: orderHash,
      hex: true
    });

    if (signature.success) {
      // Submit to OpenSea
      return await this.submitOrderToOpenSea(order, signature.payload.signature);
    } else {
      throw new Error(signature.payload.error);
    }
  }

  // Transfer NFT
  async transferNFT(contractAddress, from, to, tokenId, standard = 'ERC721') {
    const contract = new this.web3.eth.Contract(
      this.contracts.get(standard.toLowerCase()).abi,
      contractAddress
    );

    let transferData;
    if (standard === 'ERC721') {
      transferData = contract.methods.transferFrom(from, to, tokenId).encodeABI();
    } else if (standard === 'ERC1155') {
      transferData = contract.methods.safeTransferFrom(
        from, to, tokenId, 1, '0x'
      ).encodeABI();
    }

    const gasEstimate = await this.web3.eth.estimateGas({
      from,
      to: contractAddress,
      data: transferData
    });

    // Sign with OneKey
    const result = await this.sdk.ethereumSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction: {
        to: contractAddress,
        value: '0x0',
        data: transferData,
        gasLimit: `0x${Math.ceil(gasEstimate * 1.2).toString(16)}`,
        gasPrice: await this.getGasPrice(),
        nonce: await this.getNonce(from),
        chainId: 1
      }
    });

    if (result.success) {
      return await this.broadcastTransaction(result.payload.serializedTx);
    } else {
      throw new Error(result.payload.error);
    }
  }

  // Helper methods
  async getAddress() {
    const result = await this.sdk.ethereumGetAddress({
      path: "m/44'/60'/0'/0/0",
      showOnDevice: false
    });
    return result.success ? result.payload.address : null;
  }

  generateSalt() {
    return '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  getOrderHash(order) {
    // Implement OpenSea order hash calculation
    // This would use the Seaport order hash algorithm
  }

  async submitOrderToOpenSea(order, signature) {
    // Submit signed order to OpenSea API
  }

  async getGasPrice() {
    return await this.web3.eth.getGasPrice();
  }

  async getNonce(address) {
    return await this.web3.eth.getTransactionCount(address);
  }

  async broadcastTransaction(signedTx) {
    return await this.web3.eth.sendSignedTransaction(signedTx);
  }
}

// Usage
const nftWallet = new OneKeyNFTWallet();
await nftWallet.initialize();

// Get user's NFT collection
const userAddress = await nftWallet.getAddress();
const collection = await nftWallet.getNFTCollection(userAddress);
console.log('NFT Collection:', collection);

// Mint new NFT
const mintTx = await nftWallet.mintNFT(
  '0x...', // Contract address
  userAddress,
  'https://metadata.example.com/token/1',
  '100000000000000000' // 0.1 ETH mint price
);

// List NFT for sale
const listingTx = await nftWallet.listNFT(
  '0x...', // Token contract
  '1',     // Token ID
  '1000000000000000000' // 1 ETH price
);
```

## DApp Browser Integration

Complete DApp browser with OneKey wallet integration.

### DApp Provider

```javascript
class OneKeyDAppProvider {
  constructor(sdk) {
    this.sdk = sdk;
    this.chainId = 1;
    this.accounts = [];
    this.connected = false;
    this.eventListeners = new Map();
  }

  // EIP-1193 Provider Interface
  async request({ method, params = [] }) {
    switch (method) {
      case 'eth_requestAccounts':
        return await this.connect();
      
      case 'eth_accounts':
        return this.accounts;
      
      case 'eth_chainId':
        return `0x${this.chainId.toString(16)}`;
      
      case 'eth_getBalance':
        return await this.getBalance(params[0], params[1]);
      
      case 'eth_sendTransaction':
        return await this.sendTransaction(params[0]);
      
      case 'eth_signTransaction':
        return await this.signTransaction(params[0]);
      
      case 'eth_sign':
        return await this.sign(params[0], params[1]);
      
      case 'personal_sign':
        return await this.personalSign(params[0], params[1]);
      
      case 'eth_signTypedData':
      case 'eth_signTypedData_v4':
        return await this.signTypedData(params[0], params[1]);
      
      case 'wallet_switchEthereumChain':
        return await this.switchChain(params[0].chainId);
      
      case 'wallet_addEthereumChain':
        return await this.addChain(params[0]);
      
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  async connect() {
    if (!this.connected) {
      const result = await this.sdk.ethereumGetAddress({
        path: "m/44'/60'/0'/0/0",
        showOnDevice: true
      });
      
      if (result.success) {
        this.accounts = [result.payload.address];
        this.connected = true;
        this.emit('connect', { chainId: `0x${this.chainId.toString(16)}` });
        this.emit('accountsChanged', this.accounts);
      } else {
        throw new Error(result.payload.error);
      }
    }
    
    return this.accounts;
  }

  async sendTransaction(txParams) {
    const result = await this.sdk.ethereumSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction: {
        to: txParams.to,
        value: txParams.value || '0x0',
        data: txParams.data || '0x',
        gasLimit: txParams.gas || txParams.gasLimit,
        gasPrice: txParams.gasPrice,
        maxFeePerGas: txParams.maxFeePerGas,
        maxPriorityFeePerGas: txParams.maxPriorityFeePerGas,
        nonce: txParams.nonce,
        chainId: this.chainId
      }
    });

    if (result.success) {
      // Broadcast transaction
      const txHash = await this.broadcastTransaction(result.payload.serializedTx);
      return txHash;
    } else {
      throw new Error(result.payload.error);
    }
  }

  async personalSign(message, address) {
    const result = await this.sdk.ethereumSignMessage({
      path: "m/44'/60'/0'/0/0",
      message: message
    });

    if (result.success) {
      return result.payload.signature;
    } else {
      throw new Error(result.payload.error);
    }
  }

  async signTypedData(address, typedData) {
    const result = await this.sdk.ethereumSignTypedData({
      path: "m/44'/60'/0'/0/0",
      data: JSON.parse(typedData)
    });

    if (result.success) {
      return result.payload.signature;
    } else {
      throw new Error(result.payload.error);
    }
  }

  async switchChain(chainId) {
    const newChainId = parseInt(chainId, 16);
    
    // Validate chain ID
    const supportedChains = [1, 5, 56, 137, 43114, 42161, 10];
    if (!supportedChains.includes(newChainId)) {
      throw new Error(`Unsupported chain ID: ${newChainId}`);
    }
    
    this.chainId = newChainId;
    this.emit('chainChanged', chainId);
  }

  // Event emitter methods
  on(event, listener) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(listener);
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  removeListener(event, listener) {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }
}

// DApp Browser Implementation
class OneKeyDAppBrowser {
  constructor() {
    this.sdk = null;
    this.provider = null;
    this.currentUrl = '';
    this.webview = null;
  }

  async initialize() {
    // Initialize OneKey SDK
    this.sdk = new OneKeySDK({
      manifest: {
        email: 'developer@dapp-browser.com',
        appName: 'OneKey DApp Browser',
        appUrl: 'https://dapp-browser.com'
      }
    });

    // Create provider
    this.provider = new OneKeyDAppProvider(this.sdk);
    
    // Setup webview
    this.setupWebview();
  }

  setupWebview() {
    this.webview = document.createElement('webview');
    this.webview.style.width = '100%';
    this.webview.style.height = '100%';
    
    // Inject OneKey provider
    this.webview.addEventListener('dom-ready', () => {
      this.injectProvider();
    });
    
    document.body.appendChild(this.webview);
  }

  injectProvider() {
    const providerScript = `
      window.ethereum = {
        isOneKey: true,
        isMetaMask: false,
        request: ${this.provider.request.toString()},
        on: ${this.provider.on.toString()},
        removeListener: ${this.provider.removeListener.toString()},
        // ... other provider methods
      };
      
      window.dispatchEvent(new Event('ethereum#initialized'));
    `;
    
    this.webview.executeJavaScript(providerScript);
  }

  navigateTo(url) {
    this.currentUrl = url;
    this.webview.src = url;
  }

  // Handle DApp interactions
  async handleDAppRequest(request) {
    try {
      const response = await this.provider.request(request);
      return { success: true, result: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Usage
const dappBrowser = new OneKeyDAppBrowser();
await dappBrowser.initialize();

// Navigate to DApp
dappBrowser.navigateTo('https://uniswap.org');
```

## Interactive Playground

You can test these advanced examples in our interactive playground:

🚀 **[OneKey SDK Playground](https://hardware-example.onekeytest.com/expo-playground/)**

The playground provides:
- Live code editing
- Real device testing
- Multiple blockchain examples
- DeFi protocol integrations
- NFT marketplace demos

## Next Steps

- [Integration Examples](integrations.md) - Real-world application patterns
- [Best Practices](../guides/best-practices.md) - Advanced development tips
- [API Reference](../api/init.md) - Complete method documentation
- [Troubleshooting](../guides/troubleshooting.md) - Advanced debugging
