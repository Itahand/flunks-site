# 🎃 Semester Zero - Forte Hackathon Implementation Guide

## Overview

Three blockchain-powered features for your hackathon:

1. **Halloween GumDrop** (72-hour claim window, 10 GUM per Flunk NFT)
2. **Day/Night Display** (per-user timezone, 6 AM-6 PM = day, 6 PM-6 AM = night)
3. **Chapter 5 NFT Airdrop** (reward for completing both objectives)

---

## 🚀 Quick Start

### 1. Deploy Smart Contract

```bash
# Deploy semesterzero.cdc to flunks.flow account
flow accounts add-contract SemesterZero ./contracts/semesterzero.cdc
```

### 2. Update Contract Address

Find all instances of `0xYOUR_CONTRACT_ADDRESS` and replace with deployed address:

- `src/components/HalloweenGumDrop.tsx`
- `src/components/DayNightDisplay.tsx`
- `src/components/Chapter5Airdrop.tsx`
- `src/pages/api/*.ts` (all API files)

### 3. Add Environment Variables

Add to `.env.production`:

```bash
# Flow Admin Account (for blockchain writes)
FLOW_ADMIN_ADDRESS=0xYOUR_ADMIN_ADDRESS
FLOW_ADMIN_PRIVATE_KEY=your_private_key_here

# Supabase (if not already present)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Use Components

```tsx
import HalloweenGumDrop from '@/components/HalloweenGumDrop';
import DayNightDisplay from '@/components/DayNightDisplay';
import Chapter5Airdrop from '@/components/Chapter5Airdrop';

// In your page:
<HalloweenGumDrop />

<DayNightDisplay
  locationName="Paradise Motel"
  dayImage="/images/paradise-motel-day.png"
  nightImage="/images/paradise-motel-night.png"
/>

<Chapter5Airdrop />
```

---

## 📋 Feature Details

### 1. Halloween GumDrop (72-hour window)

**Smart Contract Functions:**
- `createGumDrop(dropId, eligibleAddresses, gumPerFlunk, durationSeconds)`
- `markGumClaimed(user, flunkCount)`
- `closeGumDrop()`
- `isEligibleForGumDrop(user): Bool`
- `hasClaimedGumDrop(user): Bool`
- `getGumDropInfo(): {String: AnyStruct}`

**Flow:**
1. Admin creates GumDrop on Halloween (October 31, 6pm)
2. Users click "Claim" button
3. Frontend queries Flunk NFT count
4. Backend adds GUM to Supabase
5. Blockchain marks as claimed
6. GumDrop auto-closes after 72 hours

**Admin Commands:**

```bash
# Start Halloween GumDrop (October 31, 6pm EST)
flow transactions send ./transactions/create-gumdrop.cdc \
  --arg String:"HALLOWEEN_2025" \
  --arg Array:[Address1,Address2,...] \
  --arg UFix64:10.0 \
  --arg UFix64:259200.0  # 72 hours in seconds

# Close GumDrop (manual override)
flow transactions send ./transactions/close-gumdrop.cdc
```

**Reward Calculation:**
- 10 GUM per Flunk NFT owned
- Example: User owns 3 Flunks = 30 GUM

---

### 2. Day/Night Display (Per-User Timezone)

**Smart Contract Functions:**
- `createUserProfile(username, timezone): @UserProfile`
- `getUserDayNightStatus(userAddress): {String: AnyStruct}`
- `UserProfile.isDaytime(): Bool`
- `UserProfile.getLocalHour(): Int`

**Flow:**
1. User creates profile (one-time setup)
2. Browser detects timezone offset
3. Blockchain calculates local hour
4. Component shows day/night image based on 6 AM-6 PM window
5. Updates every minute

**User Experience:**
- 6 AM - 6 PM local time = Daytime image
- 6 PM - 6 AM local time = Nighttime image
- Each user sees their own day/night cycle
- Smooth transitions with fade animation

**Images:**
- Day: `/images/paradise-motel-day.png`
- Night: `/images/paradise-motel-night.png`

---

### 3. Chapter 5 NFT Airdrop

**Smart Contract Functions:**
- `registerSlackerCompletion(userAddress)`
- `registerOverachieverCompletion(userAddress)`
- `airdropChapter5NFT(userAddress)`
- `getChapter5Status(userAddress): Chapter5Status`
- `isEligibleForChapter5NFT(userAddress): Bool`

**Requirements:**
- **Slacker:** Visit Paradise Motel Room 7 at night
- **Overachiever:** Complete all weekly objectives

**Flow:**
1. User completes objectives in Supabase
2. Backend auto-registers completions on blockchain
3. User sees progress (0/2, 1/2, 2/2)
4. When both complete, "Claim NFT" button appears
5. User clicks claim
6. Backend airdrops NFT to wallet

**NFT Metadata:**
```json
{
  "name": "Chapter 5 Completion",
  "description": "Awarded for completing both Slacker and Overachiever objectives",
  "achievement": "SLACKER_AND_OVERACHIEVER",
  "chapter": "5",
  "rarity": "Legendary",
  "image": "https://storage.googleapis.com/flunks_public/nfts/chapter5-completion.png"
}
```

---

## 🔧 API Endpoints

### Halloween GumDrop

**POST `/api/claim-halloween-gum`**
```json
{
  "walletAddress": "0x...",
  "flunkCount": 3,
  "gumAmount": 30
}
```

**GET `/api/get-flunk-count?address=0x...`**
```json
{
  "success": true,
  "flunkCount": 3
}
```

### Chapter 5 Airdrop

**GET `/api/check-chapter5-completion?address=0x...`**
```json
{
  "success": true,
  "slackerComplete": true,
  "overachieverComplete": false,
  "isFullyComplete": false
}
```

**POST `/api/register-slacker-completion`**
```json
{
  "walletAddress": "0x..."
}
```

**POST `/api/register-overachiever-completion`**
```json
{
  "walletAddress": "0x..."
}
```

**POST `/api/airdrop-chapter5-nft`**
```json
{
  "walletAddress": "0x..."
}
```

---

## 📅 Halloween GumDrop Timeline

**October 31, 2025 - 6:00 PM EST**
- GumDrop starts
- 72-hour claim window begins
- Users can claim 10 GUM per Flunk NFT

**November 3, 2025 - 6:00 PM EST**
- GumDrop auto-closes
- No more claims accepted
- Contract emits `GumDropClosed` event

---

## 🎯 Hackathon Demo Flow

### Demo Script:

1. **Show Day/Night Display**
   - "Each user sees day or night based on their timezone"
   - "It's 2 PM in New York = daytime, but 8 PM in London = nighttime"
   - "Updates automatically every minute"

2. **Show Halloween GumDrop**
   - "72-hour claim window starting Halloween"
   - "10 GUM per Flunk NFT owned"
   - "User owns 3 Flunks = 30 GUM reward"
   - "Blockchain verifies eligibility, Supabase adds GUM"
   - "Auto-closes after 72 hours - no manual intervention!"

3. **Show Chapter 5 Airdrop**
   - "Two objectives: Slacker + Overachiever"
   - "Slacker: Visit Room 7 at night (tracked in Supabase)"
   - "Overachiever: Complete all objectives (tracked in Supabase)"
   - "When both complete → NFT airdrop"
   - "Shows progress: 1/2 objectives complete"

---

## 🔒 Security Checklist

- [ ] Replace all `0xYOUR_CONTRACT_ADDRESS` with actual deployed address
- [ ] Add `FLOW_ADMIN_PRIVATE_KEY` to `.env.production` (keep secret!)
- [ ] Implement proper signing in API endpoints (currently placeholder)
- [ ] Verify Flunk NFT ownership on-chain (currently mock data)
- [ ] Add rate limiting to API endpoints
- [ ] Test on Flow Testnet before Mainnet deployment
- [ ] Audit smart contract before deploying

---

## 🧪 Testing

### Local Testing:

```bash
# Test smart contract
flow test ./contracts/semesterzero.cdc

# Start dev server
npm run dev

# Test components
# 1. Connect wallet
# 2. Navigate to page with components
# 3. Check browser console for logs
```

### Testnet Deployment:

```bash
# Deploy to Flow Testnet
flow accounts add-contract SemesterZero ./contracts/semesterzero.cdc --network testnet

# Update FCL config to testnet
# src/config/fcl.ts
config({
  "flow.network": "testnet",
  "accessNode.api": "https://rest-testnet.onflow.org"
})
```

---

## 📦 Files Created

### Smart Contract:
- `contracts/semesterzero.cdc` - Main contract

### React Components:
- `src/components/HalloweenGumDrop.tsx` - 72-hour claim window
- `src/components/DayNightDisplay.tsx` - Per-user day/night
- `src/components/Chapter5Airdrop.tsx` - NFT airdrop

### API Endpoints:
- `src/pages/api/claim-halloween-gum.ts` - Process GUM claims
- `src/pages/api/get-flunk-count.ts` - Get Flunk NFT count
- `src/pages/api/check-chapter5-completion.ts` - Check objectives
- `src/pages/api/register-slacker-completion.ts` - Register slacker
- `src/pages/api/register-overachiever-completion.ts` - Register overachiever
- `src/pages/api/airdrop-chapter5-nft.ts` - Airdrop NFT

---

## 🎨 Customization

### Change GumDrop Duration:
```typescript
// 48 hours instead of 72
const durationSeconds = 48 * 60 * 60; // 172800 seconds
```

### Change Day/Night Hours:
```cadence
// Day = 8 AM to 8 PM (instead of 6 AM to 6 PM)
access(all) fun isDaytime(): Bool {
  let hour = self.getLocalHour()
  return hour >= 8 && hour < 20  // Changed from 6 and 18
}
```

### Change GUM per Flunk:
```typescript
// 20 GUM per Flunk instead of 10
const gumPerFlunk = 20;
```

---

## 🐛 Troubleshooting

### "User not eligible for GumDrop"
- Check if user's address is in `eligibleAddresses` array
- Verify GumDrop is active (within 72-hour window)
- Check if user already claimed

### "Could not borrow Admin reference"
- Verify admin account is signing transactions
- Check `FLOW_ADMIN_PRIVATE_KEY` is correct
- Ensure admin resource exists at storage path

### Day/Night not updating
- User needs to create profile first
- Check timezone detection in browser
- Verify FCL query is returning data

### NFT airdrop fails
- User must have Chapter 5 collection set up
- Both objectives must be complete
- Check transaction limit (may need to increase from 100)

---

## 📚 Resources

- **Flow Documentation:** https://developers.flow.com/
- **FCL Documentation:** https://developers.flow.com/tools/clients/fcl-js
- **Cadence Language:** https://cadence-lang.org/
- **Flow Playground:** https://play.flow.com/
- **Flow Block Explorer:** https://flowscan.org/

---

## 🎉 Next Steps

1. Deploy contract to Flow
2. Replace contract addresses
3. Add environment variables
4. Test on testnet
5. Test components locally
6. Deploy to production
7. Create Halloween GumDrop (October 31)
8. Monitor blockchain events
9. Airdrop Chapter 5 NFTs as users complete objectives
10. Win hackathon! 🏆
