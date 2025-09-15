# Web App Integration Guide

This page helps you quickly integrate a web DApp with OneKey.

## Quick Start
1) Install OneKey on your dev machine (browser extension / desktop / mobile). [Download](https://onekey.so/download?client=browserExtension)
2) Detect the provider in your app (EIP‑1193 style)
3) Request accounts and permissions
4) Call chain‑specific provider methods (e.g. ETH, Solana, NEAR)
5) Handle errors and events (account/network changes)

Once OneKey is installed and running, you should find a `window.$onekey` object in DevTools. This is how your site interacts with OneKey.

## Choose your integration path
- Use OneKey Provider (recommended)
  - Cross‑chain provider APIs by chain → ../connect-to-software/webapp-connect-onekey/
- Use a wallet aggregator
  - Web3 Onboard → ../connect-to-software/support-wallet-kit/web3-onboard.md
  - RainbowKit → ../connect-to-software/support-wallet-kit/rainbowkit.md
  - Web3Modal → ../connect-to-software/support-wallet-kit/web3modal.md
- Use WalletConnect
  - Overview → ../connect-to-software/using-walletconnect/README.md

## Minimal example (ETH)
```js
// 1) Detect OneKey provider
const provider = window?.$onekey?.ethereum;
if (!provider) {
  alert('Please install or open OneKey to continue');
  throw new Error('OneKey provider not found');
}

// 2) Request accounts
await provider.request({ method: 'eth_requestAccounts' });

// 3) Read current account
const [account] = await provider.request({ method: 'eth_accounts' });
console.log('Connected account:', account);

// 4) Listen to changes
provider.on('accountsChanged', (accounts) => console.log('accountsChanged', accounts));
provider.on('chainChanged', (chainId) => console.log('chainChanged', chainId));

// 5) Send a read RPC (example: chain id)
const chainId = await provider.request({ method: 'eth_chainId' });
console.log('chainId:', chainId);
```


## Supported clients
| Client | DApp support |
| --- | --- |
| OneKey Chrome plugin | Connect in Chrome |
| OneKey Edge plugin | Connect in Edge |
| OneKey Desktop（Windows、macOS、Linux） | Connect in the built‑in browser |
| OneKey Mobile（iOS、Android） | Connect in the built‑in browser |

## Troubleshooting
- If provider is not detected, ensure OneKey is installed and unlocked
- For chain‑specific APIs, follow the docs under WebApp Connect OneKey by chain
- For WalletConnect, follow WalletConnect docs for QR flow

