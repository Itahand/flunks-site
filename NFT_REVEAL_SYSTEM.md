# NFT Reveal System for Chapter 5

## Overview

Your SemesterZero contract **already has a built-in reveal mechanism**! Users can transform their NFTs from an unrevealed placeholder to a permanent revealed image through a simple click.

## How It Works

### 1. **Contract Feature**
- NFTs start with `"revealed": "false"` and a placeholder image
- Admin function `revealChapter5NFT()` updates the metadata
- **Same NFT ID** - only metadata changes
- Permanent transformation (can't be reverted)

### 2. **User Flow**
```
User clicks "Reveal NFT" 
  → Request stored in database
  → Admin processes request
  → NFT metadata updated
  → New image appears on marketplaces
```

### 3. **Admin Flow**
```
Admin opens NFTRevealer component
  → Checks wallet address
  → Views current NFT state
  → Sets new metadata (name, description, image)
  → Executes reveal transaction
  → NFT permanently transformed
```

## Components Created

### For Users:
- **`/src/components/NFTReveal.tsx`** - User-facing reveal interface
  - Shows current NFT
  - "Click to Reveal" button
  - Displays reveal status
  - Beautiful gradient UI

### For Admins:
- **`/src/components/admin/NFTRevealer.tsx`** - Admin reveal tool
  - Check any wallet's NFTs
  - View current metadata
  - Update all metadata fields
  - Execute reveal transactions

### Backend APIs:
- **`/api/request-nft-reveal`** - Users submit reveal requests
- **`/api/reveal-chapter5-nft`** - Admin executes reveals

## Database Schema

Create this table in Supabase:

```sql
CREATE TABLE nft_reveal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  notes TEXT,
  UNIQUE(wallet_address, status) -- One pending request per wallet
);

-- Index for faster lookups
CREATE INDEX idx_reveal_status ON nft_reveal_requests(status);
CREATE INDEX idx_reveal_wallet ON nft_reveal_requests(wallet_address);
```

## Contract Functions

### Already Deployed:
```cadence
// In Chapter5NFT resource
access(contract) fun reveal(newMetadata: {String: String})

// In Admin resource
access(all) fun revealChapter5NFT(
  userAddress: Address, 
  newMetadata: {String: String}
)
```

## Metadata Structure

### Unrevealed (Default):
```json
{
  "name": "Paradise Motel",
  "description": "Awarded for completing Chapter 5...",
  "image": "https://storage.googleapis.com/flunks_public/images/1.png",
  "revealed": "false",
  "achievement": "SLACKER_AND_OVERACHIEVER",
  "chapter": "5",
  "collection": "Flunks: Semester Zero",
  "serialNumber": "1"
}
```

### Revealed (After Transform):
```json
{
  "name": "Paradise Motel - Revealed",
  "description": "The true form of the Paradise Motel...",
  "image": "https://your-cdn.com/revealed-image.png",
  "revealed": "true",
  "achievement": "SLACKER_AND_OVERACHIEVER",
  "chapter": "5",
  "collection": "Flunks: Semester Zero",
  "serialNumber": "1"
}
```

## Usage

### Add to Homepage:
```tsx
import NFTReveal from 'components/NFTReveal';

// In your windows/desktop system:
{
  id: WINDOW_IDS.NFT_REVEAL,
  icon: '/images/icons/reveal-nft.png',
  title: '🎭 Reveal NFT',
  window: <NFTReveal onClose={() => closeWindow(WINDOW_IDS.NFT_REVEAL)} />
}
```

### Add to Admin Panel:
```tsx
import NFTRevealer from 'components/admin/NFTRevealer';

// In your admin page:
<NFTRevealer />
```

## Advantages Over Burning

| Feature | Reveal | Burn & Mint |
|---------|--------|-------------|
| Keep NFT ID | ✅ Yes | ❌ No (new ID) |
| Marketplace history | ✅ Preserved | ❌ Lost |
| Gas cost | ✅ Lower | ❌ Higher |
| Complexity | ✅ Simple | ❌ Complex |
| Reversible | ❌ No | ❌ No |

## Reveal Image Strategy

### Option A: CDN Hosted
- Upload revealed images to Google Cloud Storage
- Use permanent URLs
- Best for high-quality images

### Option B: IPFS
- Upload to IPFS via Pinata/NFT.Storage
- Decentralized hosting
- Use `ipfs://` URLs

### Option C: On-Chain SVG
- Generate SVG art on-chain
- No external hosting needed
- More complex but fully decentralized

## Example Reveal Transaction

```cadence
import SemesterZero from 0x807c3d470888cc48

transaction(userAddress: Address) {
  let adminRef: auth(SemesterZero.AdminCapability) &SemesterZero.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.adminRef = signer.storage.borrow<auth(SemesterZero.AdminCapability) &SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    let newMetadata: {String: String} = {
      "name": "Paradise Motel - Revealed",
      "description": "The true form revealed!",
      "image": "https://cdn.flunks.net/revealed/paradise-motel.png",
      "revealed": "true",
      "achievement": "SLACKER_AND_OVERACHIEVER",
      "chapter": "5",
      "collection": "Flunks: Semester Zero",
      "serialNumber": "1"
    }
    
    self.adminRef.revealChapter5NFT(
      userAddress: userAddress,
      newMetadata: newMetadata
    )
    
    log("✨ NFT revealed!")
  }
}
```

## Testing

1. **Check Current State:**
   ```bash
   flow scripts execute cadence/scripts/check-nft-metadata.cdc 0xUSER_ADDRESS
   ```

2. **Reveal NFT:**
   ```bash
   flow transactions send cadence/transactions/reveal-nft.cdc 0xUSER_ADDRESS
   ```

3. **Verify Reveal:**
   - Check Flowty marketplace
   - View in wallet
   - Query metadata script

## Future Enhancements

- [ ] Batch reveal (multiple NFTs at once)
- [ ] Scheduled reveals (time-based)
- [ ] Reveal animations/effects
- [ ] Reveal conditions (achievements, quests)
- [ ] Partial reveals (reveal in stages)

## Notes

- ✅ **No contract changes needed** - already deployed!
- ✅ **Same NFT ID preserved** - marketplace history intact
- ✅ **One-way transformation** - can't unrealz
- ✅ **Gas efficient** - just metadata update
- ⚠️ Server-side signing needs implementation (or use Flow CLI)
