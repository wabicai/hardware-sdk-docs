# Trouble Shooting

When making requests to OneKey in [Establishing a Connection](../integrating/establishing-a-connection.md), [Sending Transactions](../integrating/sending-transactions/README.md), [Signing Messages](../integrating/signing-messages.md), or [RPC API Calling](../integrating/rpc-api-calling.md), OneKey may respond with an error. Here are the error codes and their meanings. These are inspired the corresponding by [EIP-1474](https://eips.ethereum.org/EIPS/eip-1474#error-codes) and [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193#provider-errors) on Ethereum.

| **Code** | **Title**             | **Description**                                                          |
| -------- | --------------------- | ------------------------------------------------------------------------ |
| 4001     | User Rejected Request | User rejected the request through OneKey.                                |
| 4100     | Unauthorized          | The requested method and/or account has not been authorized by the user. |
| 4500     | Request Timeout       | The request by this Web3 provider is timeout.                            |
| -32603   | Internal Error        | Something went wrong within OneKey.                                      |
| -32000   | Invalid Input         | Missing or invalid parameters.                                           |
| -32601   | Method Not Found      | OneKey does not recognize the method.                                    |

Typically, these errors will be easily parseable and have both a code and an explanation. For example:

```javascript
try {
  await provider.requestSignTransactions({ transactions: [...] });
} catch (err) {
  //  {code: 4100, message: 'The requested method and/or account has not been authorized by the user.'}
}

```
