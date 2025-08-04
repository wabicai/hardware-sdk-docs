# Path Format

BIP-44 derivation path format:

```
m / purpose' / coin_type' / account' / change / address_index
```

## Common Paths

| Network | Path | Address Type |
|---------|------|--------------|
| Bitcoin Legacy | `m/44'/0'/0'/0/0` | 1... |
| Bitcoin SegWit | `m/49'/0'/0'/0/0` | 3... |
| Bitcoin Native SegWit | `m/84'/0'/0'/0/0` | bc1... |
| Bitcoin Taproot | `m/86'/0'/0'/0/0` | bc1p... |
| Ethereum | `m/44'/60'/0'/0/0` | 0x... |
| Solana | `m/44'/501'/0'/0'` | (fully hardened) |

## Examples


```typescript
// String format
"m/44'/0'/0'/0/0"

// Array format
[44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0]
```
