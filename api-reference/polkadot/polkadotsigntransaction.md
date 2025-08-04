# polkadotSignTransaction

## Polkadot: sign transaction

Sign a Polkadot transaction using the private key derived by given BIP32 path.

```typescript
const result = await HardwareSDK.polkadotSignTransaction(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `rawTx` — _required_ `string` raw transaction data in hexadecimal format
* `network` — _optional_ `string` network name for display purposes

## Example

Sign a simple DOT transfer transaction:

```typescript
HardwareSDK.polkadotSignTransaction(connectId, deviceId, {
    path: "m/44'/354'/0'/0'/0'",
    rawTx: "0x4502840011...", // Encoded transaction
    network: "polkadot"
});
```

## Result

```typescript
{
    success: true,
    payload: {
        signature: string,  // transaction signature in hex format
    }
}
```

Error

```typescript
{
    success: false,
    payload: {
        error: string, // error message
        code: number // error code
    }
}
```

## Transaction Format

Polkadot transactions must be properly encoded before signing:

1. **SCALE Encoding**: Transactions use SCALE (Simple Concatenated Aggregate Little-Endian) encoding
2. **Extrinsic Format**: Includes version, signature, and call data
3. **Runtime Metadata**: Transaction structure depends on runtime version

## Use Cases

### DOT Transfer
```typescript
// Using @polkadot/api
import { ApiPromise, WsProvider } from '@polkadot/api';

const createDotTransfer = async (fromAddress, toAddress, amount) => {
    // Connect to Polkadot node
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    
    // Create transfer call
    const transfer = api.tx.balances.transfer(toAddress, amount);
    
    // Get account info for nonce
    const { nonce } = await api.query.system.account(fromAddress);
    
    // Create transaction
    const transaction = {
        method: transfer.method,
        era: api.createType('ExtrinsicEra', { current: await api.query.system.number(), period: 64 }),
        nonce,
        tip: 0,
        specVersion: api.runtimeVersion.specVersion,
        transactionVersion: api.runtimeVersion.transactionVersion,
        genesisHash: api.genesisHash,
        blockHash: api.genesisHash
    };
    
    // Encode transaction
    const payload = api.createType('ExtrinsicPayload', transaction);
    const rawTx = payload.toHex();
    
    // Sign with hardware wallet
    const result = await HardwareSDK.polkadotSignTransaction(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'",
        rawTx,
        network: "polkadot"
    });
    
    if (result.success) {
        // Create signed extrinsic
        const signature = api.createType('ExtrinsicSignature', {
            signature: result.payload.signature,
            signedExtensions: api.registry.signedExtensions
        });
        
        const extrinsic = api.createType('Extrinsic', {
            method: transfer.method,
            signature
        });
        
        return extrinsic;
    }
    
    throw new Error(result.payload.error);
};
```

### Staking Operations
```typescript
// Nominate validators
const createNominateTransaction = async (stashAddress, validatorAddresses) => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    
    // Create nominate call
    const nominate = api.tx.staking.nominate(validatorAddresses);
    
    // Get account info
    const { nonce } = await api.query.system.account(stashAddress);
    
    // Create transaction payload
    const transaction = {
        method: nominate.method,
        era: api.createType('ExtrinsicEra', { current: await api.query.system.number(), period: 64 }),
        nonce,
        tip: 0,
        specVersion: api.runtimeVersion.specVersion,
        transactionVersion: api.runtimeVersion.transactionVersion,
        genesisHash: api.genesisHash,
        blockHash: api.genesisHash
    };
    
    const payload = api.createType('ExtrinsicPayload', transaction);
    const rawTx = payload.toHex();
    
    return await HardwareSDK.polkadotSignTransaction(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'", // Stash account path
        rawTx,
        network: "polkadot"
    });
};

// Bond additional funds
const createBondExtraTransaction = async (stashAddress, additionalAmount) => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    
    const bondExtra = api.tx.staking.bondExtra(additionalAmount);
    
    // Similar transaction creation process...
    const { nonce } = await api.query.system.account(stashAddress);
    
    const transaction = {
        method: bondExtra.method,
        era: api.createType('ExtrinsicEra', { current: await api.query.system.number(), period: 64 }),
        nonce,
        tip: 0,
        specVersion: api.runtimeVersion.specVersion,
        transactionVersion: api.runtimeVersion.transactionVersion,
        genesisHash: api.genesisHash,
        blockHash: api.genesisHash
    };
    
    const payload = api.createType('ExtrinsicPayload', transaction);
    const rawTx = payload.toHex();
    
    return await HardwareSDK.polkadotSignTransaction(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'",
        rawTx,
        network: "polkadot"
    });
};
```

### Governance Voting
```typescript
// Vote on referendum
const createVoteTransaction = async (voterAddress, referendumIndex, vote) => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    
    // Create vote call
    const voteCall = api.tx.democracy.vote(referendumIndex, vote);
    
    const { nonce } = await api.query.system.account(voterAddress);
    
    const transaction = {
        method: voteCall.method,
        era: api.createType('ExtrinsicEra', { current: await api.query.system.number(), period: 64 }),
        nonce,
        tip: 0,
        specVersion: api.runtimeVersion.specVersion,
        transactionVersion: api.runtimeVersion.transactionVersion,
        genesisHash: api.genesisHash,
        blockHash: api.genesisHash
    };
    
    const payload = api.createType('ExtrinsicPayload', transaction);
    const rawTx = payload.toHex();
    
    return await HardwareSDK.polkadotSignTransaction(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'",
        rawTx,
        network: "polkadot"
    });
};
```

### Cross-Chain Transfer (XCM)
```typescript
// Transfer to parachain
const createXcmTransfer = async (fromAddress, destinationChain, beneficiary, amount) => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    
    // Create XCM transfer call
    const xcmTransfer = api.tx.xcmPallet.reserveTransferAssets(
        { V1: { parents: 0, interior: { X1: { Parachain: destinationChain } } } },
        { V1: { parents: 0, interior: { X1: { AccountId32: { network: 'Any', id: beneficiary } } } } },
        [{ Concrete: { parents: 0, interior: 'Here' }, Fungible: amount }],
        0
    );
    
    const { nonce } = await api.query.system.account(fromAddress);
    
    const transaction = {
        method: xcmTransfer.method,
        era: api.createType('ExtrinsicEra', { current: await api.query.system.number(), period: 64 }),
        nonce,
        tip: 0,
        specVersion: api.runtimeVersion.specVersion,
        transactionVersion: api.runtimeVersion.transactionVersion,
        genesisHash: api.genesisHash,
        blockHash: api.genesisHash
    };
    
    const payload = api.createType('ExtrinsicPayload', transaction);
    const rawTx = payload.toHex();
    
    return await HardwareSDK.polkadotSignTransaction(connectId, deviceId, {
        path: "m/44'/354'/0'/0'/0'",
        rawTx,
        network: "polkadot"
    });
};
```

## Transaction Broadcasting

After signing, broadcast the transaction to the network:

```typescript
const signAndBroadcast = async (transactionData) => {
    // Sign transaction
    const signResult = await HardwareSDK.polkadotSignTransaction(connectId, deviceId, transactionData);
    
    if (signResult.success) {
        const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        const api = await ApiPromise.create({ provider: wsProvider });
        
        // Reconstruct signed extrinsic
        const signature = api.createType('ExtrinsicSignature', {
            signature: signResult.payload.signature,
            signedExtensions: api.registry.signedExtensions
        });
        
        const extrinsic = api.createType('Extrinsic', {
            method: transactionData.method,
            signature
        });
        
        // Submit transaction
        const hash = await api.rpc.author.submitExtrinsic(extrinsic);
        
        // Wait for inclusion
        const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
            console.log(`Transaction included in block ${header.number}`);
            unsubscribe();
        });
        
        return hash.toHex();
    }
    
    throw new Error(signResult.payload.error);
};
```

## Network-Specific Considerations

### Polkadot Mainnet
- **Genesis Hash**: `0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3`
- **SS58 Prefix**: 0
- **Decimals**: 10 (1 DOT = 10^10 Planck)

### Kusama
- **Genesis Hash**: `0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe`
- **SS58 Prefix**: 2
- **Decimals**: 12 (1 KSM = 10^12 Planck)

## Security Notes

- Always verify transaction details on the device screen
- Check recipient addresses and amounts carefully
- Verify the network and genesis hash
- Be cautious with transaction fees and tips
- Understand the implications of each extrinsic call
- Validate the runtime version and spec version

## Error Handling

Common transaction signing errors:

- **Invalid transaction format**: Malformed SCALE encoding
- **Invalid path**: Incorrect derivation path for Polkadot
- **User cancellation**: User rejected the transaction on device
- **Runtime mismatch**: Transaction incompatible with current runtime
- **Insufficient balance**: Not enough funds for transaction and fees

## Related Methods

- [polkadotGetAddress](polkadotgetaddress.md) - Get Polkadot addresses
- [polkadotGetPublicKey](polkadotgetpublickey.md) - Get public keys (if available)
