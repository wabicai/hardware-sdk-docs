# Air‑Gap Workflow (Sequence Diagram)

The diagram below uses Mermaid to show the complete offline signing (Air‑Gap) flow. GitBook and GitHub both natively render Mermaid code blocks.

```mermaid
sequenceDiagram
    participant App as Host App
    participant SDK as Air‑Gap SDK
    participant Wallet as Hardware Wallet
    participant Net as Blockchain Network

    Note over Wallet: Show animated multi-accounts QR (crypto-multi-accounts)
    App->>Wallet: Scan animated QR frames
    App->>SDK: qrcodeToUr(frames)
    SDK-->>App: parseMultiAccounts() → xfp/xpubs/paths
    App->>App: Persist device fingerprint, public keys, and paths

    rect rgba(0,0,0,0.03)
    Note over App,SDK: Build a signing request for a specific chain
    alt EVM request
        App->>SDK: eth.generateSignRequest({ requestId, signData, dataType, path, xfp, chainId, origin })
    else BTC (PSBT)
        App->>SDK: btc.generatePSBT(Buffer.from(psbtHex, 'hex'))
    else Solana request
        App->>SDK: sol.generateSignRequest({ requestId, signData, dataType, path, xfp, origin })
    else Tron request
        App->>SDK: new AirGapTronSDK().generateSignRequest({ requestId, signData, signType, path, xfp, origin })
    end
    SDK-->>App: Optional OneKeyRequestDeviceQR (include app/device metadata)
    end

    App->>App: Encode to animated QR frames (see encode-playback)
    App-->>Wallet: Display request QR

    Wallet-->>App: Scan device response (eth-signature/crypto-psbt/sol-signature/tron-signature)
    App->>SDK: Decode and validate response (scan-decoder)
    SDK-->>App: Return signature / signed PSBT

    App->>Net: Broadcast transaction or hand off to upper layer
```

---

Appendix: Step list aligned with the demo flow (for quick textual recap).

1) Import device context
- Scan the animated `crypto-multi-accounts` QR from the hardware wallet.
- Aggregate frames with `qrcodeToUr()` and parse via `getAirGapSdk().parseMultiAccounts()`.
- Persist device fingerprint (xfp), xpubs, public keys, and derivation paths.

2) Build a signing request (per chain)
- EVM: `getAirGapSdk().eth.generateSignRequest({ requestId, signData, dataType, path, xfp, chainId, origin })`
- BTC: `getAirGapSdk().btc.generatePSBT(Buffer.from(psbtHex, 'hex'))`
- SOL: `getAirGapSdk().sol.generateSignRequest({ requestId, signData, dataType, path, xfp, origin })`
- TRON: `new AirGapTronSDK().generateSignRequest({ requestId, signData, signType, path, xfp, origin })`
- Optional: wrap with `OneKeyRequestDeviceQR` to include app/device metadata.

3) Display the request as animated QR
- See: `guide/code-demos/encode-playback.md` for frame generation and playback.

4) Scan device response
- See: `guide/code-demos/scan-decoder.md` for camera + decoder setup.
- Handle typed results such as `eth-signature`, `crypto-psbt`, `sol-signature`, `tron-signature`.

5) Broadcast or hand off
- Submit signed payloads using your network stack, or return to the host app for verification.
