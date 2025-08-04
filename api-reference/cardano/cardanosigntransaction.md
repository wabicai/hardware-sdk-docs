# cardanoSignTransaction

## Cardano: sign transaction

Sign a Cardano transaction using the private key derived by given BIP32 path.

```typescript
const result = await HardwareSDK.cardanoSignTransaction(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `inputs` — _required_ `Array` transaction inputs with UTXOs and derivation paths
* `outputs` — _required_ `Array` transaction outputs with addresses and amounts
* `fee` — _required_ `string` transaction fee in lovelace
* `ttl` — _optional_ `string` time-to-live slot number
* `certificates` — _optional_ `Array` staking certificates
* `withdrawals` — _optional_ `Array` reward withdrawals
* `auxiliaryData` — _optional_ `object` metadata and auxiliary data
* `validityIntervalStart` — _optional_ `string` validity interval start slot
* `protocolMagic` — _required_ `number` Cardano protocol magic number
* `networkId` — _required_ `number` Cardano network ID

## Example

Sign a simple ADA transfer transaction:

```typescript
HardwareSDK.cardanoSignTransaction(connectId, deviceId, {
    inputs: [
        {
            path: "m/1852'/1815'/0'/0/0",
            prev_hash: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
            prev_index: 0
        }
    ],
    outputs: [
        {
            address: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x",
            amount: "1000000" // 1 ADA in lovelace
        },
        {
            addressParameters: {
                addressType: 0,
                path: "m/1852'/1815'/0'/0/1",
                stakingPath: "m/1852'/1815'/0'/2/0"
            },
            amount: "4000000" // Change output
        }
    ],
    fee: "200000", // 0.2 ADA
    ttl: "500000",
    protocolMagic: 764824073,
    networkId: 1
});
```

## Result

```typescript
{
    success: true,
    payload: {
        hash: string,           // transaction hash
        witnesses: Array<{      // transaction witnesses
            type: number,
            pubKey: string,
            signature: string,
            chainCode?: string
        }>,
        auxiliaryDataSupplement?: object // auxiliary data supplement
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

## Transaction Components

### Inputs
```typescript
{
    path: "m/1852'/1815'/0'/0/0",     // derivation path
    prev_hash: "abc123...",           // previous transaction hash
    prev_index: 0                     // output index in previous transaction
}
```

### Outputs
```typescript
// External address output
{
    address: "addr1...",              // bech32 address
    amount: "1000000"                 // amount in lovelace
}

// Change output (own address)
{
    addressParameters: {
        addressType: 0,               // address type
        path: "m/1852'/1815'/0'/0/1", // payment key path
        stakingPath: "m/1852'/1815'/0'/2/0" // staking key path
    },
    amount: "4000000"
}
```

## Use Cases

### Simple ADA Transfer
```typescript
// Using @emurgo/cardano-serialization-lib-browser
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-browser';

const createAdaTransfer = async (fromUtxos, toAddress, amount, changeAddress) => {
    // Calculate total input amount
    const totalInput = fromUtxos.reduce((sum, utxo) => sum + parseInt(utxo.amount), 0);
    const fee = 200000; // 0.2 ADA
    const changeAmount = totalInput - amount - fee;
    
    const inputs = fromUtxos.map(utxo => ({
        path: "m/1852'/1815'/0'/0/0",
        prev_hash: utxo.txHash,
        prev_index: utxo.outputIndex
    }));
    
    const outputs = [
        {
            address: toAddress,
            amount: amount.toString()
        },
        {
            addressParameters: {
                addressType: 0,
                path: "m/1852'/1815'/0'/0/1",
                stakingPath: "m/1852'/1815'/0'/2/0"
            },
            amount: changeAmount.toString()
        }
    ];
    
    return await HardwareSDK.cardanoSignTransaction(connectId, deviceId, {
        inputs,
        outputs,
        fee: fee.toString(),
        protocolMagic: 764824073,
        networkId: 1
    });
};
```

### Staking Operations
```typescript
// Delegate to stake pool
const createDelegationTransaction = async (stakePoolId, utxos) => {
    const inputs = utxos.map(utxo => ({
        path: "m/1852'/1815'/0'/0/0",
        prev_hash: utxo.txHash,
        prev_index: utxo.outputIndex
    }));
    
    const totalInput = utxos.reduce((sum, utxo) => sum + parseInt(utxo.amount), 0);
    const fee = 200000;
    const keyDeposit = 2000000; // 2 ADA key deposit
    const changeAmount = totalInput - fee - keyDeposit;
    
    const certificates = [
        {
            type: 0, // Stake registration
            path: "m/1852'/1815'/0'/2/0"
        },
        {
            type: 2, // Stake delegation
            path: "m/1852'/1815'/0'/2/0",
            pool: stakePoolId
        }
    ];
    
    const outputs = [
        {
            addressParameters: {
                addressType: 0,
                path: "m/1852'/1815'/0'/0/0",
                stakingPath: "m/1852'/1815'/0'/2/0"
            },
            amount: changeAmount.toString()
        }
    ];
    
    return await HardwareSDK.cardanoSignTransaction(connectId, deviceId, {
        inputs,
        outputs,
        certificates,
        fee: fee.toString(),
        protocolMagic: 764824073,
        networkId: 1
    });
};
```

### Reward Withdrawal
```typescript
// Withdraw staking rewards
const createWithdrawalTransaction = async (rewardAmount, utxos) => {
    const inputs = utxos.map(utxo => ({
        path: "m/1852'/1815'/0'/0/0",
        prev_hash: utxo.txHash,
        prev_index: utxo.outputIndex
    }));
    
    const totalInput = utxos.reduce((sum, utxo) => sum + parseInt(utxo.amount), 0);
    const fee = 200000;
    const totalOutput = totalInput + rewardAmount - fee;
    
    const withdrawals = [
        {
            path: "m/1852'/1815'/0'/2/0",
            amount: rewardAmount.toString()
        }
    ];
    
    const outputs = [
        {
            addressParameters: {
                addressType: 0,
                path: "m/1852'/1815'/0'/0/0",
                stakingPath: "m/1852'/1815'/0'/2/0"
            },
            amount: totalOutput.toString()
        }
    ];
    
    return await HardwareSDK.cardanoSignTransaction(connectId, deviceId, {
        inputs,
        outputs,
        withdrawals,
        fee: fee.toString(),
        protocolMagic: 764824073,
        networkId: 1
    });
};
```

### Transaction with Metadata
```typescript
// Transaction with metadata
const createTransactionWithMetadata = async (toAddress, amount, metadata, utxos) => {
    const inputs = utxos.map(utxo => ({
        path: "m/1852'/1815'/0'/0/0",
        prev_hash: utxo.txHash,
        prev_index: utxo.outputIndex
    }));
    
    const totalInput = utxos.reduce((sum, utxo) => sum + parseInt(utxo.amount), 0);
    const fee = 250000; // Higher fee for metadata
    const changeAmount = totalInput - amount - fee;
    
    const outputs = [
        {
            address: toAddress,
            amount: amount.toString()
        },
        {
            addressParameters: {
                addressType: 0,
                path: "m/1852'/1815'/0'/0/1",
                stakingPath: "m/1852'/1815'/0'/2/0"
            },
            amount: changeAmount.toString()
        }
    ];
    
    const auxiliaryData = {
        hash: "a1b2c3d4e5f6...", // Metadata hash
        body: metadata
    };
    
    return await HardwareSDK.cardanoSignTransaction(connectId, deviceId, {
        inputs,
        outputs,
        auxiliaryData,
        fee: fee.toString(),
        protocolMagic: 764824073,
        networkId: 1
    });
};
```

## Transaction Broadcasting

After signing, broadcast the transaction to the Cardano network:

```typescript
const signAndBroadcast = async (transactionData) => {
    // Sign transaction
    const signResult = await HardwareSDK.cardanoSignTransaction(connectId, deviceId, transactionData);
    
    if (signResult.success) {
        // Reconstruct transaction with witnesses
        const txBuilder = CardanoWasm.TransactionBuilder.new(
            CardanoWasm.LinearFee.new(
                CardanoWasm.BigNum.from_str('44'),
                CardanoWasm.BigNum.from_str('155381')
            ),
            CardanoWasm.BigNum.from_str('1000000'),
            CardanoWasm.BigNum.from_str('500000000'),
            CardanoWasm.BigNum.from_str('2000000')
        );
        
        // Add inputs, outputs, etc.
        // Add witnesses from signResult.payload.witnesses
        
        const signedTx = txBuilder.build_tx();
        
        // Submit to Cardano node
        const response = await fetch('https://cardano-mainnet.blockfrost.io/api/v0/tx/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/cbor',
                'project_id': 'your-blockfrost-project-id'
            },
            body: signedTx.to_bytes()
        });
        
        const txHash = await response.text();
        return txHash;
    }
    
    throw new Error(signResult.payload.error);
};
```

## Security Notes

- Always verify transaction details on the device screen
- Check recipient addresses and amounts carefully
- Verify the network ID and protocol magic
- Be cautious with transaction fees
- Understand the implications of certificates and withdrawals
- Validate UTXOs before signing

## Related Methods

- [cardanoGetAddress](cardanogetaddress.md) - Get Cardano addresses
- [cardanoGetPublicKey](cardanogetpublickey.md) - Get public keys
