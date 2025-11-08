# Semester Zero NFT Expansion: Pins & Patches

## Overview

The SemesterZero contract has been updated to support **multiple NFT types** within a single collection:

1. **Chapter5NFT** - Original completion token (2 already minted)
2. **PinNFT** - Location-based collectibles
3. **PatchNFT** - Achievement-based collectibles

All three NFT types live in the same `Chapter5Collection` and will appear together on Flowty at:
`https://flowty.io/collection/0xce9dd43888d99574/SemesterZero`

## Architecture

### PinNFT Structure
```cadence
resource PinNFT: NonFungibleToken.NFT {
    let id: UInt64
    let location: String        // "Paradise Motel", "Crystal Springs", "Arcade"
    let recipient: Address
    let mintedAt: UFix64
    let metadata: {String: String}
    // Metadata includes: name, description, location (trait), type: "Pin", rarity, image
}
```

### PatchNFT Structure
```cadence
resource PatchNFT: NonFungibleToken.NFT {
    let id: UInt64
    let location: String        // Where achievement was earned
    let achievement: String     // "Room 7 Explorer", "Gum Master", etc
    let recipient: Address
    let mintedAt: UFix64
    let metadata: {String: String}
    // Metadata includes: name, description, location (trait), achievement (trait), type: "Patch", rarity, image
}
```

## Minting Functions

### Admin.mintPin()
```cadence
access(all) fun mintPin(
    userAddress: Address,
    location: String,
    name: String,
    description: String,
    rarity: String,
    image: String
)
```

**Example Usage:**
```bash
flow transactions send ./cadence/transactions/airdrop-pin.cdc \
  0x4ab2327b5e1f3ca1 \
  "Paradise Motel" \
  "Paradise Motel Pin" \
  "Collectible pin from Paradise Motel during Semester Zero" \
  "uncommon" \
  "https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png" \
  --network mainnet \
  --signer flunks-admin
```

### Admin.mintPatch()
```cadence
access(all) fun mintPatch(
    userAddress: Address,
    location: String,
    achievement: String,
    name: String,
    description: String,
    rarity: String,
    image: String
)
```

**Example Usage:**
```bash
flow transactions send ./cadence/transactions/airdrop-patch.cdc \
  0x4ab2327b5e1f3ca1 \
  "Paradise Motel" \
  "Room 7 Explorer" \
  "Room 7 Explorer Patch" \
  "Awarded for discovering all secrets of Room 7" \
  "rare" \
  "https://storage.googleapis.com/flunks_public/images/room7-patch.png" \
  --network mainnet \
  --signer flunks-admin
```

## Planned Locations

### Paradise Motel
- **Pins**: General visit commemorative pin
- **Patches**: Room 7 Explorer, Secret Finder, etc

### Crystal Springs
- **Pins**: Crystal Springs commemorative pin
- **Patches**: Water sports achievements, exploration achievements

### Arcade
- **Pins**: Arcade visit pin
- **Patches**: High score achievements, game completion patches

## Traits & Filtering

Each NFT has metadata traits that marketplaces can use for filtering:

### Common Traits (All NFTs)
- `name` - Display name
- `description` - Detailed description
- `type` - "Token" (Chapter5), "Pin", or "Patch"
- `rarity` - "common", "uncommon", "rare", "legendary"
- `image` - Full URL to image

### Location Traits
- `location` - "Paradise Motel", "Crystal Springs", "Arcade", etc

### Achievement Traits (Patches only)
- `achievement` - Specific achievement name

## Deployment Steps

### 1. Deploy Contract Update
```bash
./deployment-scripts/deploy-pins-patches.sh
```

This updates the existing SemesterZero contract at `0xce9dd43888d99574` with:
- PinNFT resource
- PatchNFT resource
- Admin minting functions

### 2. Test Pin Minting
```bash
./deployment-scripts/test-mint-pin.sh
```

Mints a test Paradise Motel pin to verify functionality.

### 3. Test Patch Minting
```bash
./deployment-scripts/test-mint-patch.sh
```

Mints a test Room 7 Explorer patch to verify achievements work.

### 4. Verify on Flowty
Visit: `https://flowty.io/collection/0xce9dd43888d99574/SemesterZero`

You should see all NFT types in the same collection with proper traits for filtering.

## Website Integration

### Call from Next.js/React

You can call these functions from your website using the Flow Client Library:

```typescript
import * as fcl from "@onflow/fcl"

// Mint a Pin to a user
async function mintPin(userAddress: string, location: string) {
  const txId = await fcl.mutate({
    cadence: `
      import SemesterZero from 0xce9dd43888d99574
      
      transaction(userAddress: Address, location: String, name: String, description: String, rarity: String, image: String) {
        let admin: &SemesterZero.Admin
        
        prepare(signer: auth(BorrowValue) &Account) {
          self.admin = signer.storage.borrow<&SemesterZero.Admin>(
            from: SemesterZero.AdminStoragePath
          ) ?? panic("Not an admin")
        }
        
        execute {
          self.admin.mintPin(
            userAddress: userAddress,
            location: location,
            name: name,
            description: description,
            rarity: rarity,
            image: image
          )
        }
      }
    `,
    args: (arg, t) => [
      arg(userAddress, t.Address),
      arg(location, t.String),
      arg("Paradise Motel Pin", t.String),
      arg("Collectible pin from Paradise Motel", t.String),
      arg("uncommon", t.String),
      arg("https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png", t.String)
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    authorizations: [fcl.currentUser]
  })
  
  return await fcl.tx(txId).onceSealed()
}

// Mint a Patch to a user
async function mintPatch(userAddress: string, location: string, achievement: string) {
  // Similar structure to mintPin, but calls admin.mintPatch()
}
```

## Distribution Strategy

### Initial Rollout
1. **Paradise Motel Pin** - Give to all users who completed Chapter 5
2. **Room 7 Explorer Patch** - Give to users who visited Room 7 multiple times

### Future Campaigns
1. **Crystal Springs Pin** - When Crystal Springs location launches
2. **Arcade Pin** - When Arcade location launches
3. **Achievement Patches** - Award for specific in-game accomplishments

## Notes

- All NFTs share the same `totalChapter5NFTs` counter (currently at 2)
- Users only need ONE collection setup (Chapter5Collection holds all types)
- The 2 existing Chapter5NFT tokens remain in collection (cannot hide them)
- Flowty will show all types together with filterable traits
- Rarity tiers help create collection hierarchy and trading value

## Image Assets

Upload images to Google Cloud Storage before minting:

```bash
# Pin images
gs://flunks_public/images/paradise-motel-pin.png
gs://flunks_public/images/crystal-springs-pin.png
gs://flunks_public/images/arcade-pin.png

# Patch images
gs://flunks_public/images/room7-patch.png
gs://flunks_public/images/gum-master-patch.png
gs://flunks_public/images/high-scorer-patch.png
```

Make sure images are public-readable:
```bash
gsutil acl ch -u AllUsers:R gs://flunks_public/images/*.png
```

## Support

**Contract Address**: `0xce9dd43888d99574`  
**Collection Name**: `SemesterZero`  
**Flowty URL**: https://flowty.io/collection/0xce9dd43888d99574/SemesterZero  
**Flow Diver**: https://flowdiver.io/contract?a=0xce9dd43888d99574&c=SemesterZero

---

Ready to expand your Semester Zero collection with location-based collectibles! 🎯
