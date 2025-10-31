# Chapter 5 NFT Collection Setup Guide

## ✅ Good News!
You **DON'T need the Flow Token List** to receive Chapter 5 NFTs! We've built a custom collection setup button directly into the Paradise Motel.

## 🎯 How to Enable Your Chapter 5 Collection

### Step 1: Connect Your Wallet
1. Visit **flunks.net**
2. Click "Connect Wallet"
3. Choose your Flow wallet (Flow Wallet, Blocto, etc.)
4. Approve the connection

### Step 2: Go to Paradise Motel
1. Click on the **Paradise Motel** location
2. Enter the **Lobby**

### Step 3: Enable Collection
1. In the lobby, you'll see 5 buttons at the bottom
2. Click the **"👁️ Flunks: Semester Zero Collection"** button (green/teal color)
3. Enter your username when prompted
4. Sign the transaction in your wallet

### Step 4: Wait for Confirmation
- Transaction takes ~2-3 seconds to process
- You'll see a success message: **"🎉 Chapter 5 collection enabled! You're ready to receive NFTs!"**

## ✅ What This Does

The collection setup creates TWO things in your wallet:

1. **UserProfile** - Stores your username and timezone (for day/night features)
2. **Chapter5Collection** - NFT collection to receive your Slacker and/or Overachiever NFTs

## 🏆 NFT Eligibility

After enabling your collection, you can earn Chapter 5 NFTs by completing objectives:

### Slacker NFT
- Visit Paradise Motel Room 7 **at night** (6 PM - 6 AM local time)
- Check your local time in the app - it shows day/night automatically

### Overachiever NFT
- Find and click the **Hidden Riff** Easter egg
- Earn 100+ GUM from it
- Location: Hidden somewhere in the game 🤫

## 📊 Check Your Status

Run this command to check if your collection is set up:
```bash
node test-collection-setup.mjs YOUR_WALLET_ADDRESS
```

## ❓ Troubleshooting

### "Please connect your wallet first"
- Make sure you've connected your Flow wallet
- Try refreshing the page and reconnecting

### "Transaction failed"
- Make sure you have enough FLOW for gas (usually < 0.001 FLOW)
- Try again - sometimes network congestion causes timeouts

### "Already have Chapter 5 collection enabled"
- Great! You're all set
- You can now receive NFTs when you complete objectives

## 🎁 When Will I Get My NFTs?

NFTs are airdropped by the admin when you complete objectives. The system tracks:
- Room 7 night visits (Slacker)
- Hidden Riff GUM earnings (Overachiever)

Check your eligibility:
```bash
NEXT_PUBLIC_SUPABASE_URL="..." NEXT_PUBLIC_SUPABASE_ANON_KEY="..." node check-chapter5-nft-eligibility.mjs
```

## 💡 Benefits of Direct Integration

**Why our button is better than Token List:**
- ✅ No waiting for indexing
- ✅ Works immediately
- ✅ Sets up profile AND collection in one transaction
- ✅ Captures your timezone for day/night features
- ✅ Custom username for your profile

## 🔗 Technical Details

**Contract:** `SemesterZero` at `0x807c3d470888cc48`

**Collections Created:**
- Storage: `/storage/SemesterZeroChapter5Collection`
- Public: `/public/SemesterZeroChapter5Collection`

**Profile Created:**
- Storage: `/storage/SemesterZeroProfile`
- Public: `/public/SemesterZeroProfile`

## 📝 Next Steps

1. Enable your collection (5 minutes)
2. Complete Chapter 5 objectives (ongoing)
3. Wait for NFT airdrop notification
4. Check your Flow wallet to see your NFTs!

---

**Need Help?** Join our Discord or reach out to @flunks_nft on Twitter!
