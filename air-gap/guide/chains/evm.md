# EVM (Ethereum & EVM‑compatible)

Supported operations
- Transactions: EIP‑1559 (`typedTransaction`), Legacy (`transaction`)
- Messages: EIP‑712 (`typedData`), Personal Message (`personalMessage`)

Minimal examples
```ts
// EIP‑1559 transaction (typed)
const ur = getAirGapSdk().eth.generateSignRequest({
  requestId: uuidv4(),
  signData: unsignedTxHex, // hex without 0x
  dataType: EAirGapDataTypeEvm.typedTransaction,
  path: "m/44'/60'/0'/0/0",
  xfp: device.xfp,
  chainId: 1,
  origin: 'AirGap Demo',
});

// Legacy transaction
const ur = getAirGapSdk().eth.generateSignRequest({
  requestId: uuidv4(),
  signData: unsignedLegacyHex,
  dataType: EAirGapDataTypeEvm.transaction,
  path, xfp, chainId: 1, origin: 'AirGap Demo',
});

// EIP‑712 typed data
const ur = getAirGapSdk().eth.generateSignRequest({
  requestId: uuidv4(),
  signData: Buffer.from(typedDataJson, 'utf8').toString('hex'),
  dataType: EAirGapDataTypeEvm.typedData,
  path, xfp, origin: 'AirGap Demo',
});

// Personal message
const ur = getAirGapSdk().eth.generateSignRequest({
  requestId: uuidv4(),
  signData: messageHex,
  dataType: EAirGapDataTypeEvm.personalMessage,
  path, xfp, origin: 'AirGap Demo',
});
```

Notes
- Provide `chainId` for transactions; omit for messages if not needed.
- Keep the derivation path consistent with the exported account to avoid mismatch prompts.

API Reference
- `reference/ethereum-and-evm/ethsignrequest.md`
- `reference/ethereum-and-evm/ethsignature.md`
