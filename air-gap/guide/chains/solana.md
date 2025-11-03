# Solana (SOL)

Supported operations
- Transaction signing (`Transaction`)
- Message signing (`Message` / `Off_Chain_Message_Legacy` / `Off_Chain_Message_Standard`)

Minimal example
```ts
const ur = getAirGapSdk().sol.generateSignRequest({
  requestId: uuidv4(),
  signData: txOrMessageHex,           // hex string
  dataType: EAirGapDataTypeSol.Transaction, // or Message / Off_Chain_*
  path: account.path,
  xfp: device.xfp,
  origin: 'AirGap Demo',
});
```

Notes
- Use the same derivation path you imported from the device `crypto-multi-accounts` export.
- Ensure your hex payload matches the expected transaction/message format.
