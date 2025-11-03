# Ethereum & EVM

To obtain an ETH account, you can use the basic API [`CryptoHDkey`](../basic-api/cryptohdkey.md) to acquire the account.



When integrating ETH, you can request a signature from the hardware using `EthSignRequest`. Currently supported are:

* EIP1559 Transaction
* Legacy Transaction
* EIP-712 TypedData
* Sign Message

For details on how to construct the corresponding UR payloads, see:
- [EthSignRequest](ethsignrequest.md)




Regardless of the request type, the result is parsed as `EthSignature`:
- [EthSignature](ethsignature.md)

