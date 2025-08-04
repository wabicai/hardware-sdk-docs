# TypeScript Types

## Response Format

```typescript
interface Response<T> {
  success: boolean;
  payload: T;
}
```

## Common Parameters

```typescript
interface CommonParams {
  retryCount?: number;
  timeout?: number;
  keepSession?: boolean;
  passphraseState?: string;
}
```

## Method Parameters

```typescript
// Bitcoin
interface BtcGetAddressParams {
  path: string | number[];
  coin?: string;
  showOnOneKey?: boolean;
}

// Ethereum
interface EvmGetAddressParams {
  path: string | number[];
  showOnOneKey?: boolean;
  chainId?: number;
}

// Solana
interface SolGetAddressParams {
  path: string | number[];
  showOnOneKey?: boolean;
}
```

