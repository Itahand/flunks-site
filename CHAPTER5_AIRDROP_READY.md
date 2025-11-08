# Chapter 5 NFT Airdrop - Ready to Deploy

## 🎯 Summary

**3 eligible users** will receive a beautiful popup notification when they log in to flunks.net, prompting them to enable their Chapter 5 collection and receive their NFT airdrop.

---

## ✅ What's Been Set Up

### 1. **Popup Notification Component** 
- **File**: `src/components/Chapter5NFTNotification.tsx`
- **Features**:
  - Cyberpunk-styled glowing notification
  - Shows automatically when eligible users log in
  - One-time popup (stores in localStorage after viewing)
  - Direct link to enable collection on Flowty
  - Instructions for setup

### 2. **Eligible Users** (Excluding tinkerbell test account)
1. **roto_flow** (`0x4ab2327b5e1f3ca1`)
   - Email: rj2ktoy@gmail.com
   - Very active user
   
2. **CityofDreams** (`0x6e5d12b1735caa83`)
   - Email: Armandoburgos1@gmail.com
   - Very active user
   
3. **Flunkster** (`0xc4ab4a06ade1fd0f`)
   - Active daily user

### 3. **NFT Collection Details**
- **Contract**: FlunksSemesterZero (wrapper) + SemesterZero (underlying)
- **Address**: `0xce9dd43888d99574`
- **Flowty Page**: https://www.flowty.io/collection/0xce9dd43888d99574/FlunksSemesterZero
- **Royalties**: 10% creator fee configured ✓
- **Description**: "Flunks: Semester Zero is a standalone collection that rewards users for exploring flunks.net and participating in events, challenges and completing objectives."

---

## 🚀 Deployment Steps

### Step 1: Deploy the Code
```bash
# Push the changes to production
git add .
git commit -m "Add Chapter 5 NFT eligibility notification"
git push origin main
```

### Step 2: Wait for Users to Enable Collection
Once deployed, when the 3 users log in:
1. They'll see the glowing notification popup
2. They click "Enable Collection"
3. They enable it on Flowty or via Paradise Motel button

### Step 3: Check Collection Status
Run this to see who has enabled their collection:
```bash
node admin-scripts/check-chapter5-collections-ready.js
```

### Step 4: Airdrop NFTs
Once users have enabled their collections, run:
```bash
flow transactions send ./cadence/transactions/airdrop-chapter5-nft.cdc 0x4ab2327b5e1f3ca1 --network mainnet --signer flunks-admin
flow transactions send ./cadence/transactions/airdrop-chapter5-nft.cdc 0x6e5d12b1735caa83 --network mainnet --signer flunks-admin
flow transactions send ./cadence/transactions/airdrop-chapter5-nft.cdc 0xc4ab4a06ade1fd0f --network mainnet --signer flunks-admin
```

### Step 5: NFTs Appear on Flowty!
The NFTs will immediately be visible at:
https://www.flowty.io/collection/0xce9dd43888d99574/FlunksSemesterZero

---

## 📋 Scripts Available

### Check Eligibility
```bash
node admin-scripts/airdrop-chapter5-nfts.js
```

### Lookup User Info
```bash
node admin-scripts/lookup-chapter5-recipients.js
```

### Check Collection Setup Status
```bash
node admin-scripts/check-chapter5-collections-ready.js
```

---

## 🎨 What Users Will See

When eligible users log in, they'll see a stunning cyberpunk-styled notification with:
- Glowing animated borders
- Pulsing title: "🎉 CONGRATULATIONS! 🎉"
- NFT badge showing "CHAPTER 5 NFT - FLUNKS: SEMESTER ZERO"
- Clear 3-step instructions
- Two buttons: "Maybe Later" and "Enable Collection"
- One-time display (won't annoy them repeatedly)

---

## ⚡ Ready to Deploy?

Everything is set up and ready to go! Just:
1. Push the code to production
2. Wait for users to enable collections
3. Run the airdrop commands
4. Celebrate! 🎉

---

**Created**: November 7, 2025
**Status**: Ready for Production Deployment
