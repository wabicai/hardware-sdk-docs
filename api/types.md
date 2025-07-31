---
icon: code
---

# TypeScript Type Definitions

Complete TypeScript type definitions for OneKey Hardware SDK.

## Core Types

### Response Types

```typescript
interface BaseResponse<T = any> {
  success: boolean;
  payload: T;
  error?: string;
}

interface DeviceResponse<T> extends BaseResponse<T> {
  device?: {
    path: string;
    model: string;
    features: DeviceFeatures;
  };
}

interface DeviceFeatures {
  vendor: string;
  major_version: number;
  minor_version: number;
  patch_version: number;
  bootloader_mode: boolean;
  device_id: string;
  pin_protection: boolean;
  passphrase_protection: boolean;
  language: string;
  label: string;
  initialized: boolean;
  revision: string;
  bootloader_hash: string;
  imported: boolean;
  unlocked: boolean;
  firmware_present: boolean;
  needs_backup: boolean;
  flags: number;
  model: 'T' | 'mini' | 'touch';
  fw_major: number;
  fw_minor: number;
  fw_patch: number;
  fw_vendor: string;
  fw_vendor_keys: string;
  unfinished_backup: boolean;
  no_backup: boolean;
}
```

### Device Management Types

```typescript
interface InitOptions {
  debug?: boolean;
  connectSrc?: string;
  manifest: {
    email: string;
    appName: string;
    appUrl: string;
  };
  timeout?: number;
  webusb?: boolean;
  pendingTransportEvent?: boolean;
}

interface SearchDevicesOptions {
  timeout?: number;
  enumeration?: boolean;
}

interface Device {
  path: string;
  session?: string;
  debugSession?: string;
  features: DeviceFeatures;
  name?: string;
  id?: string;
  type?: 'acquired' | 'unacquired';
  mode?: 'normal' | 'bootloader' | 'initialize' | 'seedless';
  state?: string;
  firmware?: 'valid' | 'outdated' | 'required' | 'unknown' | 'none';
  status?: 'available' | 'occupied' | 'used';
  error?: string;
}
```

## Bitcoin Types

### Address Generation

```typescript
interface BtcGetAddressParams {
  path: string | number[];
  coin: string;
  showOnDevice?: boolean;
  multisig?: MultisigRedeemScriptType;
  scriptType?: 'SPENDADDRESS' | 'SPENDMULTISIG' | 'SPENDWITNESS' | 'SPENDP2SHWITNESS' | 'SPENDTAPROOT';
  chunkify?: boolean;
}

interface BtcGetAddressResponse {
  address: string;
  path: number[];
  serializedPath: string;
  publicKey?: string;
  chainCode?: string;
}

interface MultisigRedeemScriptType {
  pubkeys: Array<{
    node: HDNodeType;
    address_n: number[];
  }>;
  signatures: string[];
  m: number;
}

interface HDNodeType {
  depth: number;
  fingerprint: number;
  child_num: number;
  chain_code: string;
  private_key?: string;
  public_key: string;
}
```

### Transaction Signing

```typescript
interface BtcSignTransactionParams {
  coin: string;
  inputs: TxInputType[];
  outputs: TxOutputType[];
  refTxs?: RefTransaction[];
  account?: {
    addresses: AccountAddresses;
  };
  coinName?: string;
  push?: boolean;
  preauthorized?: boolean;
  serialize?: boolean;
  chunkify?: boolean;
}

interface TxInputType {
  address_n?: number[];
  prev_hash: string;
  prev_index: number;
  script_sig?: string;
  sequence?: number;
  script_type?: InputScriptType;
  multisig?: MultisigRedeemScriptType;
  amount?: string;
  decred_tree?: number;
  witness?: string;
  ownership_proof?: string;
  commitment_data?: string;
  orig_hash?: string;
  orig_index?: number;
  decred_staking_spend?: DecredStakingSpendType;
}

interface TxOutputType {
  address?: string;
  address_n?: number[];
  amount: string;
  script_type: OutputScriptType;
  multisig?: MultisigRedeemScriptType;
  op_return_data?: string;
  orig_hash?: string;
  orig_index?: number;
}

type InputScriptType = 
  | 'SPENDADDRESS'
  | 'SPENDMULTISIG'
  | 'EXTERNAL'
  | 'SPENDWITNESS'
  | 'SPENDP2SHWITNESS'
  | 'SPENDTAPROOT';

type OutputScriptType = 
  | 'PAYTOADDRESS'
  | 'PAYTOSCRIPTHASH'
  | 'PAYTOMULTISIG'
  | 'PAYTOOPRETURN'
  | 'PAYTOWITNESS'
  | 'PAYTOP2SHWITNESS'
  | 'PAYTOTAPROOT';

interface BtcSignTransactionResponse {
  signatures: string[];
  serializedTx: string;
  txid?: string;
}
```

## Ethereum Types

### Address Generation

```typescript
interface EvmGetAddressParams {
  path: string | number[];
  showOnDevice?: boolean;
  chainId?: number;
  chunkify?: boolean;
}

interface EvmGetAddressResponse {
  address: string;
  path: number[];
  serializedPath: string;
  publicKey?: string;
  chainCode?: string;
}
```

### Transaction Signing

```typescript
interface EvmSignTransactionParams {
  path: string | number[];
  transaction: {
    to: string;
    value: string;
    gasPrice?: string;
    gasLimit: string;
    nonce: string;
    data?: string;
    chainId?: number;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    accessList?: AccessListItem[];
  };
  chunkify?: boolean;
}

interface AccessListItem {
  address: string;
  storageKeys: string[];
}

interface EvmSignTransactionResponse {
  v: string;
  r: string;
  s: string;
  serializedTx?: string;
}

interface EvmSignMessageParams {
  path: string | number[];
  message: string;
  hex?: boolean;
  chunkify?: boolean;
}

interface EvmSignMessageResponse {
  address: string;
  signature: string;
}

interface EvmSignTypedDataParams {
  path: string | number[];
  data: any;
  metamask_v4_compat?: boolean;
  chunkify?: boolean;
}
```

## Solana Types

```typescript
interface SolGetAddressParams {
  path: string | number[];
  showOnDevice?: boolean;
  chunkify?: boolean;
}

interface SolGetAddressResponse {
  address: string;
  path: number[];
  publicKey?: string;
}

interface SolSignTransactionParams {
  path: string | number[];
  rawTx: string;
  chunkify?: boolean;
}

interface SolSignTransactionResponse {
  signature: string;
  publicKey: string;
}
```

## Cardano Types

```typescript
interface CardanoGetAddressParams {
  addressParameters: CardanoAddressParameters;
  protocolMagic: number;
  networkId: number;
  showOnDevice?: boolean;
  derivationType?: CardanoDerivationType;
  chunkify?: boolean;
}

interface CardanoAddressParameters {
  addressType: CardanoAddressType;
  path?: string | number[];
  stakingPath?: string | number[];
  stakingKeyHash?: string;
  certificatePointer?: CardanoBlockchainPointerType;
  paymentScriptHash?: string;
  stakingScriptHash?: string;
}

type CardanoAddressType = 
  | 'Base'
  | 'Pointer'
  | 'Enterprise'
  | 'Reward'
  | 'Byron';

type CardanoDerivationType = 'LEDGER' | 'ICARUS' | 'ICARUS_TREZOR';

interface CardanoGetAddressResponse {
  address: string;
  path: number[];
  serializedPath: string;
  publicKey?: string;
  stakingPublicKey?: string;
}
```

## Polkadot Types

```typescript
interface PolkadotGetAddressParams {
  path: string | number[];
  prefix: number;
  network: string;
  showOnDevice?: boolean;
  chunkify?: boolean;
}

interface PolkadotGetAddressResponse {
  address: string;
  path: number[];
  publicKey: string;
}

interface PolkadotSignTransactionParams {
  path: string | number[];
  rawTx: string;
  network: string;
  chunkify?: boolean;
}

interface PolkadotSignTransactionResponse {
  signature: string;
  publicKey: string;
}
```

## Cosmos Types

```typescript
interface CosmosGetAddressParams {
  path: string | number[];
  hrp: string;
  showOnDevice?: boolean;
  chunkify?: boolean;
}

interface CosmosGetAddressResponse {
  address: string;
  path: number[];
  publicKey: string;
}

interface CosmosSignTransactionParams {
  path: string | number[];
  rawTx: string;
  chunkify?: boolean;
}

interface CosmosSignTransactionResponse {
  signature: string;
  publicKey: string;
}
```

## Error Types

```typescript
interface OneKeyError extends Error {
  code: ErrorCode;
  message: string;
  stack?: string;
}

type ErrorCode = 
  | 'Device_NotFound'
  | 'Device_Disconnected'
  | 'Device_NotSupported'
  | 'Device_InBootloaderMode'
  | 'Device_Locked'
  | 'User_Cancelled'
  | 'Permission_Denied'
  | 'Invalid_Path'
  | 'Invalid_Parameter'
  | 'Firmware_NotCompatible'
  | 'Network_Error'
  | 'Timeout'
  | 'Unknown_Error';
```

## Rate Limiting Types

```typescript
interface RateLimitConfig {
  maxRequestsPerSecond: number;
  maxConcurrentRequests: number;
  retryDelay: number;
  maxRetries: number;
}

interface PerformanceMetrics {
  operationType: string;
  duration: number;
  success: boolean;
  timestamp: number;
  deviceModel: string;
  firmwareVersion: string;
}
```

## Usage Examples

### Type-Safe API Calls

```typescript
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

// Type-safe Bitcoin address generation
const getBitcoinAddress = async (): Promise<string> => {
  const params: BtcGetAddressParams = {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnDevice: true
  };
  
  const result: DeviceResponse<BtcGetAddressResponse> = 
    await HardwareSDK.btcGetAddress(params);
  
  if (result.success) {
    return result.payload.address;
  }
  
  throw new OneKeyError(result.error || 'Unknown error');
};

// Type-safe Ethereum transaction signing
const signEthereumTransaction = async (
  to: string, 
  value: string, 
  gasLimit: string, 
  gasPrice: string, 
  nonce: string
): Promise<EvmSignTransactionResponse> => {
  const params: EvmSignTransactionParams = {
    path: "m/44'/60'/0'/0/0",
    transaction: {
      to,
      value,
      gasLimit,
      gasPrice,
      nonce
    }
  };
  
  const result: DeviceResponse<EvmSignTransactionResponse> = 
    await HardwareSDK.evmSignTransaction(params);
  
  if (result.success) {
    return result.payload;
  }
  
  throw new OneKeyError(result.error || 'Transaction signing failed');
};
```

## Next Steps

- [Bitcoin API](bitcoin.md) - Bitcoin-specific operations
- [Ethereum API](ethereum.md) - Ethereum-specific operations
- [Device Management](device.md) - Device connection and management
- [Error Handling](../integration/best-practices.md#error-handling) - Error handling patterns
