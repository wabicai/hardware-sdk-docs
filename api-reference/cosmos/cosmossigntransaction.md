# cosmosSignTransaction

## Cosmos: sign transaction

Sign a Cosmos transaction using the private key derived by given BIP32 path.

```typescript
const result = await HardwareSDK.cosmosSignTransaction(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `rawTx` — _required_ `string` raw transaction data in JSON format

## Example

Sign a simple ATOM transfer transaction:

```typescript
HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
    path: "m/44'/118'/0'/0/0",
    rawTx: JSON.stringify({
        account_number: "1234",
        chain_id: "cosmoshub-4",
        fee: {
            amount: [{ denom: "uatom", amount: "5000" }],
            gas: "200000"
        },
        memo: "",
        msgs: [
            {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: "cosmos1...",
                    to_address: "cosmos1...",
                    amount: [{ denom: "uatom", amount: "1000000" }]
                }
            }
        ],
        sequence: "0"
    })
});
```

## Result

```typescript
{
    success: true,
    payload: {
        signature: string,  // transaction signature in hex format
        publicKey: string,  // public key used for signing
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

Cosmos transactions use JSON format with specific structure:

```typescript
{
    account_number: string,    // account number on chain
    chain_id: string,         // chain identifier
    fee: {
        amount: Array<{denom: string, amount: string}>,
        gas: string
    },
    memo: string,             // optional memo
    msgs: Array<object>,      // transaction messages
    sequence: string          // account sequence number
}
```

## Use Cases

### ATOM Transfer
```typescript
// Using @cosmjs/stargate
import { StargateClient, SigningStargateClient } from '@cosmjs/stargate';

const createAtomTransfer = async (fromAddress, toAddress, amount) => {
    // Connect to Cosmos Hub
    const client = await StargateClient.connect('https://rpc-cosmoshub.blockapsis.com');
    
    // Get account info
    const account = await client.getAccount(fromAddress);
    const chainId = await client.getChainId();
    
    // Create transaction
    const tx = {
        account_number: account.accountNumber.toString(),
        chain_id: chainId,
        fee: {
            amount: [{ denom: "uatom", amount: "5000" }],
            gas: "200000"
        },
        memo: "",
        msgs: [
            {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: fromAddress,
                    to_address: toAddress,
                    amount: [{ denom: "uatom", amount: amount.toString() }]
                }
            }
        ],
        sequence: account.sequence.toString()
    };
    
    // Sign with hardware wallet
    const result = await HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        rawTx: JSON.stringify(tx)
    });
    
    return result;
};
```

### Staking Operations
```typescript
// Delegate to validator
const createDelegateTransaction = async (delegatorAddress, validatorAddress, amount) => {
    const client = await StargateClient.connect('https://rpc-cosmoshub.blockapsis.com');
    const account = await client.getAccount(delegatorAddress);
    const chainId = await client.getChainId();
    
    const tx = {
        account_number: account.accountNumber.toString(),
        chain_id: chainId,
        fee: {
            amount: [{ denom: "uatom", amount: "5000" }],
            gas: "200000"
        },
        memo: "",
        msgs: [
            {
                type: "cosmos-sdk/MsgDelegate",
                value: {
                    delegator_address: delegatorAddress,
                    validator_address: validatorAddress,
                    amount: { denom: "uatom", amount: amount.toString() }
                }
            }
        ],
        sequence: account.sequence.toString()
    };
    
    return await HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        rawTx: JSON.stringify(tx)
    });
};

// Undelegate from validator
const createUndelegateTransaction = async (delegatorAddress, validatorAddress, amount) => {
    const client = await StargateClient.connect('https://rpc-cosmoshub.blockapsis.com');
    const account = await client.getAccount(delegatorAddress);
    const chainId = await client.getChainId();
    
    const tx = {
        account_number: account.accountNumber.toString(),
        chain_id: chainId,
        fee: {
            amount: [{ denom: "uatom", amount: "5000" }],
            gas: "250000"
        },
        memo: "",
        msgs: [
            {
                type: "cosmos-sdk/MsgUndelegate",
                value: {
                    delegator_address: delegatorAddress,
                    validator_address: validatorAddress,
                    amount: { denom: "uatom", amount: amount.toString() }
                }
            }
        ],
        sequence: account.sequence.toString()
    };
    
    return await HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        rawTx: JSON.stringify(tx)
    });
};
```

### Governance Voting
```typescript
// Vote on governance proposal
const createVoteTransaction = async (voterAddress, proposalId, option) => {
    const client = await StargateClient.connect('https://rpc-cosmoshub.blockapsis.com');
    const account = await client.getAccount(voterAddress);
    const chainId = await client.getChainId();
    
    const tx = {
        account_number: account.accountNumber.toString(),
        chain_id: chainId,
        fee: {
            amount: [{ denom: "uatom", amount: "5000" }],
            gas: "200000"
        },
        memo: "",
        msgs: [
            {
                type: "cosmos-sdk/MsgVote",
                value: {
                    proposal_id: proposalId.toString(),
                    voter: voterAddress,
                    option: option // "Yes", "No", "NoWithVeto", "Abstain"
                }
            }
        ],
        sequence: account.sequence.toString()
    };
    
    return await HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        rawTx: JSON.stringify(tx)
    });
};
```

### IBC Transfer
```typescript
// Inter-Blockchain Communication transfer
const createIbcTransfer = async (fromAddress, toAddress, amount, sourceChannel) => {
    const client = await StargateClient.connect('https://rpc-cosmoshub.blockapsis.com');
    const account = await client.getAccount(fromAddress);
    const chainId = await client.getChainId();
    
    // Calculate timeout timestamp (current time + 10 minutes)
    const timeoutTimestamp = Math.floor(Date.now() / 1000) + 600;
    
    const tx = {
        account_number: account.accountNumber.toString(),
        chain_id: chainId,
        fee: {
            amount: [{ denom: "uatom", amount: "5000" }],
            gas: "200000"
        },
        memo: "",
        msgs: [
            {
                type: "cosmos-sdk/MsgTransfer",
                value: {
                    source_port: "transfer",
                    source_channel: sourceChannel,
                    token: { denom: "uatom", amount: amount.toString() },
                    sender: fromAddress,
                    receiver: toAddress,
                    timeout_height: {
                        revision_number: "0",
                        revision_height: "0"
                    },
                    timeout_timestamp: timeoutTimestamp.toString()
                }
            }
        ],
        sequence: account.sequence.toString()
    };
    
    return await HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        rawTx: JSON.stringify(tx)
    });
};
```

### Multi-Message Transaction
```typescript
// Transaction with multiple messages
const createMultiMsgTransaction = async (address, messages) => {
    const client = await StargateClient.connect('https://rpc-cosmoshub.blockapsis.com');
    const account = await client.getAccount(address);
    const chainId = await client.getChainId();
    
    const tx = {
        account_number: account.accountNumber.toString(),
        chain_id: chainId,
        fee: {
            amount: [{ denom: "uatom", amount: "10000" }], // Higher fee for multiple messages
            gas: "400000"
        },
        memo: "",
        msgs: messages, // Array of message objects
        sequence: account.sequence.toString()
    };
    
    return await HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        rawTx: JSON.stringify(tx)
    });
};
```

## Transaction Broadcasting

After signing, broadcast the transaction to the network:

```typescript
const signAndBroadcast = async (transactionData) => {
    // Sign transaction
    const signResult = await HardwareSDK.cosmosSignTransaction(connectId, deviceId, transactionData);
    
    if (signResult.success) {
        const client = await StargateClient.connect('https://rpc-cosmoshub.blockapsis.com');
        
        // Create signed transaction
        const signedTx = {
            tx: {
                ...JSON.parse(transactionData.rawTx),
                signatures: [
                    {
                        pub_key: {
                            type: "tendermint/PubKeySecp256k1",
                            value: Buffer.from(signResult.payload.publicKey, 'hex').toString('base64')
                        },
                        signature: Buffer.from(signResult.payload.signature, 'hex').toString('base64')
                    }
                ]
            },
            mode: "sync"
        };
        
        // Broadcast transaction
        const response = await fetch(`${client.tmClient.client.url}/broadcast_tx_sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signedTx)
        });
        
        const result = await response.json();
        return result.result.hash;
    }
    
    throw new Error(signResult.payload.error);
};
```

## Network-Specific Examples

### Osmosis (OSMO)
```typescript
const createOsmosisTransaction = async (fromAddress, toAddress, amount) => {
    // Use Osmosis RPC endpoint
    const client = await StargateClient.connect('https://rpc-osmosis.blockapsis.com');
    
    // Same transaction structure, different chain_id
    const account = await client.getAccount(fromAddress);
    const chainId = "osmosis-1";
    
    const tx = {
        account_number: account.accountNumber.toString(),
        chain_id: chainId,
        fee: {
            amount: [{ denom: "uosmo", amount: "5000" }],
            gas: "200000"
        },
        memo: "",
        msgs: [
            {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: fromAddress,
                    to_address: toAddress,
                    amount: [{ denom: "uosmo", amount: amount.toString() }]
                }
            }
        ],
        sequence: account.sequence.toString()
    };
    
    return await HardwareSDK.cosmosSignTransaction(connectId, deviceId, {
        path: "m/44'/118'/0'/0/0",
        rawTx: JSON.stringify(tx)
    });
};
```

## Security Notes

- Always verify transaction details on the device screen
- Check recipient addresses and amounts carefully
- Verify the chain ID matches the intended network
- Be cautious with transaction fees and gas limits
- Understand the implications of each message type
- Validate account numbers and sequence numbers

## Related Methods

- [cosmosGetAddress](cosmosgetaddress.md) - Get Cosmos addresses
- [cosmosGetPublicKey](cosmosgetpublickey.md) - Get public keys
