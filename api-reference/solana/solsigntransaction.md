# solSignTransaction

## Solana: sign transaction

Sign a Solana transaction using the private key derived by given BIP32 path.

```typescript
const result = await HardwareSDK.solSignTransaction(connectId, deviceId, params);
```

## Params

[**Optional common params**](../common-params.md)

* `path` — _required_ `string | Array<number>` minimum length is `3`. [read more](../path.md)
* `rawTx` — _required_ `string` raw transaction data in hexadecimal format

## Example

Sign a simple SOL transfer transaction:

```typescript
HardwareSDK.solSignTransaction(connectId, deviceId, {
    path: "m/44'/501'/0'/0'",
    rawTx: "01000103c8d842a2f17fd7aab608ce2ea535a6e958dffa20caf669b347b911c4171965530f9c05a17e776e4e4a492b2b5f4d1e3c3e2a1b0a4b5c6d7e8f9a0b1c2d3e4f5..."
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

Solana transactions must be properly formatted before signing:

1. **Serialized Transaction**: The transaction must be serialized according to Solana's wire format
2. **Message Format**: Includes headers, account keys, recent blockhash, and instructions
3. **Instruction Data**: Program instructions with proper account references

## Use Cases

### SOL Transfer
```typescript
import { Transaction, SystemProgram, PublicKey, Connection } from '@solana/web3.js';

const createSolTransfer = async (fromAddress, toAddress, amount) => {
    const connection = new Connection('https://api.mainnet-beta.solana.com');

    // Create transaction
    const transaction = new Transaction();
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(fromAddress),
            toPubkey: new PublicKey(toAddress),
            lamports: amount * 1e9 // Convert SOL to lamports
        })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(fromAddress);

    // Serialize transaction
    const rawTx = transaction.serializeMessage().toString('hex');

    // Sign with hardware wallet
    const result = await HardwareSDK.solSignTransaction(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        rawTx
    });

    if (result.success) {
        // Add signature to transaction
        transaction.addSignature(
            new PublicKey(fromAddress),
            Buffer.from(result.payload.signature, 'hex')
        );

        return transaction;
    }

    throw new Error(result.payload.error);
};
```

### SPL Token Transfer
```typescript
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const createTokenTransfer = async (fromAddress, toAddress, tokenMint, amount, decimals) => {
    const connection = new Connection('https://api.mainnet-beta.solana.com');

    // Get token accounts
    const fromTokenAccount = await Token.getAssociatedTokenAddress(
        TOKEN_PROGRAM_ID,
        new PublicKey(tokenMint),
        new PublicKey(fromAddress)
    );

    const toTokenAccount = await Token.getAssociatedTokenAddress(
        TOKEN_PROGRAM_ID,
        new PublicKey(tokenMint),
        new PublicKey(toAddress)
    );

    // Create transaction
    const transaction = new Transaction();

    // Add transfer instruction
    transaction.add(
        Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            fromTokenAccount,
            toTokenAccount,
            new PublicKey(fromAddress),
            [],
            amount * Math.pow(10, decimals)
        )
    );

    // Set recent blockhash and fee payer
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(fromAddress);

    // Serialize and sign
    const rawTx = transaction.serializeMessage().toString('hex');

    return await HardwareSDK.solSignTransaction(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        rawTx
    });
};
```

### DeFi Interaction
```typescript
// Example: Interact with a DeFi protocol
const createDeFiTransaction = async (userAddress, programId, instructionData) => {
    const connection = new Connection('https://api.mainnet-beta.solana.com');

    const transaction = new Transaction();

    // Add custom program instruction
    transaction.add({
        keys: [
            { pubkey: new PublicKey(userAddress), isSigner: true, isWritable: true },
            // Add other required accounts
        ],
        programId: new PublicKey(programId),
        data: Buffer.from(instructionData, 'hex')
    });

    // Set transaction metadata
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(userAddress);

    // Serialize and sign
    const rawTx = transaction.serializeMessage().toString('hex');

    return await HardwareSDK.solSignTransaction(connectId, deviceId, {
        path: "m/44'/501'/0'/0'",
        rawTx
    });
};
```

## Transaction Broadcasting

After signing, broadcast the transaction to the Solana network:

```typescript
const signAndBroadcast = async (transactionData) => {
    // Sign transaction
    const signResult = await HardwareSDK.solSignTransaction(connectId, deviceId, transactionData);

    if (signResult.success) {
        const connection = new Connection('https://api.mainnet-beta.solana.com');

        // Reconstruct transaction with signature
        const transaction = Transaction.from(Buffer.from(transactionData.rawTx, 'hex'));
        transaction.addSignature(
            new PublicKey(userAddress),
            Buffer.from(signResult.payload.signature, 'hex')
        );

        // Broadcast transaction
        const txid = await connection.sendRawTransaction(transaction.serialize());

        // Wait for confirmation
        await connection.confirmTransaction(txid);

        return txid;
    }

    throw new Error(signResult.payload.error);
};
```

## Security Notes

- Always verify transaction details on the device screen
- Check recipient addresses and amounts carefully
- Verify program IDs for DeFi interactions
- Be cautious with transaction fees
- Validate the recent blockhash is current
- Understand the implications of each instruction in the transaction

## Error Handling

Common transaction signing errors:

- **Invalid transaction format**: Malformed transaction data
- **Invalid path**: Incorrect derivation path for Solana
- **User cancellation**: User rejected the transaction on device
- **Device timeout**: Transaction signing timed out
- **Insufficient permissions**: Path not accessible by the device

## Related Methods

- [solGetAddress](solgetaddress.md) - Get Solana addresses
- [solGetPublicKey](solgetpublickey.md) - Get public keys (if available)