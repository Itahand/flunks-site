# Chapter 5 NFT Reveal Mechanism

## How It Works

The SemesterZero contract now includes a **reveal mechanism** that allows you to:

1. **Mint NFTs with a placeholder image** (https://storage.googleapis.com/flunks_public/images/1.png)
2. **Wait until you're ready** (finish creating the final artwork)
3. **Reveal all NFTs at once** by calling one admin function
4. **All existing and future NFTs instantly show the revealed image**

## Technical Details

### Contract State Variables
- `chapter5Revealed: Bool` - Whether NFTs have been revealed (starts as `false`)
- `chapter5RevealedImageURL: String` - The final revealed image URL (starts empty)

### How NFTs Display Images
When someone views a Chapter 5 NFT, the contract checks:
```cadence
let imageURL = SemesterZero.chapter5Revealed 
    ? SemesterZero.chapter5RevealedImageURL  // Use revealed image if revealed
    : (self.metadata["image"] ?? "placeholder.png")  // Use placeholder if not revealed
```

This means:
- **Before reveal**: All NFTs show the placeholder image (1.png)
- **After reveal**: All NFTs automatically show the revealed image
- **No re-minting needed** - existing NFTs update automatically

## Deployment Steps

### Step 1: Deploy Updated Contract

Deploy the contract with reveal mechanism:

```bash
./deployment-scripts/update-semesterzero.sh
```

This deploys the contract with:
- `chapter5Revealed = false`
- `chapter5RevealedImageURL = ""`
- All NFTs will show placeholder image (1.png)

### Step 2: Mint NFTs (Current State)

Airdrop Chapter 5 NFTs to eligible users:

```bash
flow transactions send ./cadence/transactions/airdrop-chapter5-nft.cdc 0x4ab2327b5e1f3ca1 --network mainnet --signer flunks-admin
flow transactions send ./cadence/transactions/airdrop-chapter5-nft.cdc 0x6e5d12b1735caa83 --network mainnet --signer flunks-admin
flow transactions send ./cadence/transactions/airdrop-chapter5-nft.cdc 0xc4ab4a06ade1fd0f --network mainnet --signer flunks-admin
```

Users will see the placeholder image on Flowty.

### Step 3: Check Reveal Status (Anytime)

```bash
flow scripts execute ./cadence/scripts/check-chapter5-reveal-status.cdc --network mainnet
```

Output:
```json
{
  "revealed": "false",
  "revealedImageURL": "",
  "totalNFTs": "5"
}
```

### Step 4: Reveal When Ready

When your final artwork is ready and uploaded, reveal all NFTs:

```bash
# Example: Reveal with final artwork
flow transactions send ./cadence/transactions/reveal-chapter5-nfts.cdc \
  "https://storage.googleapis.com/flunks_public/nfts/chapter5-revealed.png" \
  --network mainnet \
  --signer flunks-admin
```

**Instant Effect:**
- ✅ All existing NFTs now display the revealed image
- ✅ All future NFTs will display the revealed image
- ✅ Marketplaces (Flowty) will update automatically
- ✅ Users see the reveal happen in real-time

### Step 5: Verify Reveal

```bash
flow scripts execute ./cadence/scripts/check-chapter5-reveal-status.cdc --network mainnet
```

Output after reveal:
```json
{
  "revealed": "true",
  "revealedImageURL": "https://storage.googleapis.com/flunks_public/nfts/chapter5-revealed.png",
  "totalNFTs": "5"
}
```

## Benefits

- ✅ **No re-minting** - Existing NFTs update automatically
- ✅ **Instant reveal** - All NFTs change at the same time
- ✅ **Simple process** - One transaction reveals everything
- ✅ **Permanent** - Once revealed, cannot be un-revealed
- ✅ **Works on marketplaces** - Flowty/Flow Wallet see the change immediately

## Example Timeline

1. **Today**: Deploy contract with reveal mechanism
2. **This week**: Airdrop NFTs to users (they see placeholder)
3. **Next week**: Finish final artwork, upload to storage
4. **Reveal day**: Run reveal transaction - instant update fobir all users!
5. **Forever**: All NFTs show revealed image

## Notes

- The reveal can only happen ONCE (protected by `pre` condition)
- You cannot revert a reveal
- Make sure your revealed image URL is correct before revealing!
- Test the image URL is accessible before running reveal transaction
