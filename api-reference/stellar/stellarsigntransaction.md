# stellarSignTransaction

## Stellar: sign transaction

Sign a Stellar transaction using the private key derived by given BIP32 path.

```typescript
const result = await HardwareSDK.stellarSignTransaction(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `networkPassphrase` — _required_ `string` Stellar network passphrase
* `transaction` — _required_ `object` Stellar transaction object

## Example

Sign a simple XLM payment transaction:

```typescript
HardwareSDK.stellarSignTransaction(connectId, deviceId, {
    path: "m/44'/148'/0'",
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    transaction: {
        source: "GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A",
        fee: 100,
        sequence: "123456789",
        timeBounds: {
            minTime: 0,
            maxTime: 0
        },
        memo: {
            type: 0 // MEMO_NONE
        },
        operations: [
            {
                type: 1, // payment
                destination: "GDQNY3PBOJOKYZSRMK2S7LHHGWZIUISD4QORETLMXEWXBI7KFZZMKTL3",
                asset: {
                    type: 0 // native XLM
                },
                amount: "10.0000000"
            }
        ]
    }
});
```

## Result

```typescript
{
    success: true,
    payload: {
        publicKey: string,  // public key used for signing
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

## Network Passphrases

### Mainnet
```typescript
const MAINNET_PASSPHRASE = "Public Global Stellar Network ; September 2015";
```

### Testnet
```typescript
const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";
```

## Use Cases

### XLM Payment
```typescript
// Using stellar-sdk
import { 
    Server, 
    Keypair, 
    TransactionBuilder, 
    Networks, 
    Operation, 
    Asset 
} from 'stellar-sdk';

const createXlmPayment = async (fromAddress, toAddress, amount) => {
    const server = new Server('https://horizon.stellar.org');
    
    // Load source account
    const sourceAccount = await server.loadAccount(fromAddress);
    
    // Build transaction
    const transaction = new TransactionBuilder(sourceAccount, {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.PUBLIC
    })
    .addOperation(Operation.payment({
        destination: toAddress,
        asset: Asset.native(),
        amount: amount.toString()
    }))
    .setTimeout(300)
    .build();
    
    // Convert to OneKey format
    const txObject = {
        source: transaction.source,
        fee: parseInt(transaction.fee),
        sequence: transaction.sequence,
        timeBounds: transaction.timeBounds ? {
            minTime: transaction.timeBounds.minTime,
            maxTime: transaction.timeBounds.maxTime
        } : { minTime: 0, maxTime: 0 },
        memo: {
            type: transaction.memo.type === 'none' ? 0 : 
                  transaction.memo.type === 'text' ? 1 :
                  transaction.memo.type === 'id' ? 2 :
                  transaction.memo.type === 'hash' ? 3 : 4,
            value: transaction.memo.value
        },
        operations: transaction.operations.map(op => ({
            type: op.type === 'payment' ? 1 :
                  op.type === 'createAccount' ? 0 :
                  op.type === 'pathPayment' ? 2 : 1,
            destination: op.destination,
            asset: op.asset.isNative() ? { type: 0 } : {
                type: 1,
                code: op.asset.code,
                issuer: op.asset.issuer
            },
            amount: op.amount
        }))
    };
    
    // Sign with hardware wallet
    const result = await HardwareSDK.stellarSignTransaction(connectId, deviceId, {
        path: "m/44'/148'/0'",
        networkPassphrase: Networks.PUBLIC,
        transaction: txObject
    });
    
    return result;
};
```

### Asset Transfer
```typescript
// Transfer custom asset
const createAssetTransfer = async (fromAddress, toAddress, assetCode, assetIssuer, amount) => {
    const server = new Server('https://horizon.stellar.org');
    const sourceAccount = await server.loadAccount(fromAddress);
    
    const transaction = new TransactionBuilder(sourceAccount, {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.PUBLIC
    })
    .addOperation(Operation.payment({
        destination: toAddress,
        asset: new Asset(assetCode, assetIssuer),
        amount: amount.toString()
    }))
    .setTimeout(300)
    .build();
    
    const txObject = {
        source: transaction.source,
        fee: parseInt(transaction.fee),
        sequence: transaction.sequence,
        timeBounds: {
            minTime: transaction.timeBounds.minTime,
            maxTime: transaction.timeBounds.maxTime
        },
        memo: { type: 0 },
        operations: [{
            type: 1, // payment
            destination: toAddress,
            asset: {
                type: 1, // custom asset
                code: assetCode,
                issuer: assetIssuer
            },
            amount: amount.toString()
        }]
    };
    
    return await HardwareSDK.stellarSignTransaction(connectId, deviceId, {
        path: "m/44'/148'/0'",
        networkPassphrase: Networks.PUBLIC,
        transaction: txObject
    });
};
```

### Multi-Operation Transaction
```typescript
// Transaction with multiple operations
const createMultiOpTransaction = async (fromAddress, operations) => {
    const server = new Server('https://horizon.stellar.org');
    const sourceAccount = await server.loadAccount(fromAddress);
    
    let txBuilder = new TransactionBuilder(sourceAccount, {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.PUBLIC
    });
    
    // Add multiple operations
    operations.forEach(op => {
        txBuilder = txBuilder.addOperation(op);
    });
    
    const transaction = txBuilder.setTimeout(300).build();
    
    // Convert operations to OneKey format
    const txObject = {
        source: transaction.source,
        fee: parseInt(transaction.fee),
        sequence: transaction.sequence,
        timeBounds: {
            minTime: transaction.timeBounds.minTime,
            maxTime: transaction.timeBounds.maxTime
        },
        memo: { type: 0 },
        operations: transaction.operations.map(op => {
            switch (op.type) {
                case 'payment':
                    return {
                        type: 1,
                        destination: op.destination,
                        asset: op.asset.isNative() ? { type: 0 } : {
                            type: 1,
                            code: op.asset.code,
                            issuer: op.asset.issuer
                        },
                        amount: op.amount
                    };
                case 'createAccount':
                    return {
                        type: 0,
                        destination: op.destination,
                        startingBalance: op.startingBalance
                    };
                default:
                    throw new Error(`Unsupported operation type: ${op.type}`);
            }
        })
    };
    
    return await HardwareSDK.stellarSignTransaction(connectId, deviceId, {
        path: "m/44'/148'/0'",
        networkPassphrase: Networks.PUBLIC,
        transaction: txObject
    });
};
```

## Transaction Broadcasting

After signing, broadcast the transaction to the Stellar network:

```typescript
const signAndBroadcast = async (transactionData) => {
    // Sign transaction
    const signResult = await HardwareSDK.stellarSignTransaction(connectId, deviceId, transactionData);
    
    if (signResult.success) {
        const server = new Server('https://horizon.stellar.org');
        
        // Reconstruct transaction with signature
        const sourceKeypair = Keypair.fromPublicKey(signResult.payload.publicKey);
        const transaction = new TransactionBuilder(
            await server.loadAccount(transactionData.transaction.source),
            {
                fee: transactionData.transaction.fee,
                networkPassphrase: transactionData.networkPassphrase
            }
        );
        
        // Add operations and build
        // ... (add operations based on transactionData.transaction.operations)
        
        const builtTx = transaction.build();
        
        // Add signature
        builtTx.addSignature(sourceKeypair, signResult.payload.signature);
        
        // Submit transaction
        const result = await server.submitTransaction(builtTx);
        return result.hash;
    }
    
    throw new Error(signResult.payload.error);
};
```

## Security Notes

- Always verify transaction details on the device screen
- Check recipient addresses and amounts carefully
- Verify the network passphrase matches the intended network
- Be cautious with transaction fees
- Understand the implications of each operation
- Validate asset codes and issuers for custom assets

## Related Methods

- [stellarGetAddress](stellargetaddress.md) - Get Stellar addresses
