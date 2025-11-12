# NFT Catalog Submission Guide

This directory contains the unified NFT Catalog proposal for the Flunks: Semester Zero collection.

## Collection Overview

**File:** `nft-catalog-semester-zero.json`

This single collection contains multiple NFT types:
- **Chapter 5 NFTs** - Upgradeable achievement NFTs
- **Location Pins** - Location-based collectible pins
- **Achievement Patches** - Milestone achievement badges

All NFTs are stored in the same user collection but have different artwork and metadata.

## Collection Details:
- **Contract:** `SemesterZero` at `0xce9dd43888d99574`
- **Storage Path:** `/storage/SemesterZeroChapter5Collection`
- **Public Path:** `/public/SemesterZeroChapter5Collection`
- **Network:** Flow Mainnet

## Submission Process

### Option 1: Manual PR to Flow NFT Catalog
1. Fork the [Flow NFT Catalog repository](https://github.com/dapperlabs/nft-catalog)
2. Add each JSON file to the `catalog/mainnet/` directory
3. Create a Pull Request with all 3 catalog entries
4. Wait for review and approval from Flow team

### Option 2: Use NFT Catalog Tool
1. Visit [NFT Catalog Admin](https://www.flow-nft-catalog.com/)
2. Connect with admin wallet (`0xce9dd43888d99574`)
3. Submit each catalog entry through the UI
4. Propose on-chain for community review

## Important Notes

⚠️ **Before Submitting:**
- Upload banner and logo images to your CDN
- Update image URLs in the JSON files if needed
- Verify contract address is correct (`0xce9dd43888d99574`)
- Test that collection setup works for users

📝 **Image Requirements:**
- Square Image: Recommended 400x400px or larger
- Banner Image: Recommended 1200x400px
- Format: PNG or JPG
- All images should be publicly accessible URLs

🔗 **After Approval:**
- Collections will appear on Flow marketplaces
- Users can discover via Flow NFT Catalog
- Wallets will auto-recognize the collections
- Marketplace indexers will pick up the types

## Testing Collection Setup

Users can set up the collection with this transaction:

\`\`\`cadence
import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&SemesterZero.Chapter5Collection>(
            from: SemesterZero.Chapter5CollectionStoragePath
        ) == nil {
            let collection <- SemesterZero.createEmptyChapter5Collection()
            signer.storage.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
            
            let cap = signer.capabilities.storage.issue<&SemesterZero.Chapter5Collection>(
                SemesterZero.Chapter5CollectionStoragePath
            )
            signer.capabilities.publish(cap, at: SemesterZero.Chapter5CollectionPublicPath)
        }
    }
}
\`\`\`

## Current Status

- [x] SemesterZero contract deployed with all NFT types
- [x] Chapter 5 NFTs functional with upgrade system
- [x] Pin and Patch minting functions deployed
- [ ] Unified catalog proposal submitted
- [ ] Flowty collection indexed and displaying correctly

## Questions?

Contact @flunksnft on Twitter or visit discord.gg/flunks
