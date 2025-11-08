# Semester Zero Genesis NFTs

## The First Two

The first two NFTs ever minted in the Semester Zero collection are **Genesis NFTs** - test mints that became legendary.

### NFT #0 - Genesis Token
- **ID**: 0
- **Type**: Chapter5NFT
- **Status**: Genesis (First Ever Minted)
- **Rarity**: Legendary (Only 1 exists)
- **Note**: The very first token in the Semester Zero collection

### NFT #1 - Genesis Token  
- **ID**: 1
- **Type**: Chapter5NFT
- **Status**: Genesis (Second Ever Minted)
- **Rarity**: Legendary (Only 1 exists)
- **Note**: The second token in the Semester Zero collection

## Verification

You can verify Genesis status by checking the NFT ID:
- IDs 0-1 = Genesis NFTs (the original test mints)
- IDs 2+ = Regular collection items

## Current Holders

To find who owns these Genesis NFTs:

```bash
# Check the on-chain state
flow scripts execute ./cadence/scripts/check-semesterzero-state.cdc --network mainnet

# Or check individual wallets
flow scripts execute ./cadence/scripts/check-chapter5-nft-owners.cdc --network mainnet
```

## Collector Value

These Genesis NFTs have special significance:
- **First in Collection**: Started the entire Semester Zero NFT collection
- **Test Artifacts**: Originally minting tests that became part of the permanent collection
- **Unique History**: Can never be replicated (IDs 0 and 1 are taken forever)
- **Limited Supply**: Only 2 Genesis tokens will ever exist

## Trading Notes

If these Genesis NFTs appear on secondary markets:
- They're identifiable by ID (0 or 1)
- Consider them rare collectibles with historical significance
- They have the same metadata as regular Chapter5NFTs but with Genesis provenance

---

*Genesis status is tracked by NFT ID. All IDs are immutably recorded on the Flow blockchain.*
