# Chapter 5 NFT Airdrop Eligibility Tracking

## Overview
Chapter 5 (Paradise Motel) has **two NFT airdrops** that users can earn:

### 1. 🏨 Slacker NFT
**Requirement**: Visit Paradise Motel Room 7 at night (8 PM - 6 AM local time)
- **Tracked in**: `paradise_motel_room7_visits` table
- **Reward**: 50 GUM + eligible for Slacker NFT airdrop
- **One-time only**: Wallet address is UNIQUE in the table

### 2. 🎸 Overachiever NFT  
**Requirement**: Complete the Hidden Riff guitar game (play C-G-A-F sequence)
- **Tracked in**: `gum_transactions` table (source = 'hidden_riff')
- **Reward**: 50 GUM + eligible for Overachiever NFT airdrop
- **One-time only**: Cooldown prevents multiple claims

### 3. 🏆 Full Completion
Users who complete **BOTH** objectives are eligible for **BOTH** NFTs.

---

## How to Check Eligibility

### Option 1: Run the Node.js Script
```bash
node check-chapter5-nft-eligibility.mjs
```

This will show:
- List of users who completed Slacker objective
- List of users who completed Overachiever objective  
- List of users eligible for both NFTs
- Summary counts

### Option 2: Run SQL in Supabase
Open the SQL file in Supabase SQL Editor:
```sql
-- File: check-chapter5-nft-eligibility.sql
```

This provides 4 result sets:
1. Slacker completions
2. Overachiever completions
3. Full completions (both)
4. Summary counts

### Option 3: Use the API Endpoint
```bash
curl "https://www.flunks.net/api/check-chapter5-completion?address=0x..."
```

Returns JSON:
```json
{
  "success": true,
  "slackerComplete": true,
  "overachieverComplete": true,
  "isFullyComplete": true,
  "details": {
    "room7Visits": 1,
    "hiddenRiffCompleted": 1
  }
}
```

---

## Database Schema

### `paradise_motel_room7_visits`
```sql
wallet_address TEXT UNIQUE  -- Flow wallet address
username TEXT               -- Display name
gum_amount INTEGER          -- 50 GUM reward
visit_timestamp TIMESTAMPTZ -- When they visited
```

### `gum_transactions` (for Overachiever)
```sql
wallet_address TEXT
source TEXT                 -- 'hidden_riff'
amount INTEGER              -- 50 GUM
created_at TIMESTAMPTZ
```

---

## Blockchain Integration

The SemesterZero contract (`0x807c3d470888cc48`) has admin functions to register completions:

### Register Slacker Completion
```cadence
admin.registerSlackerCompletion(userAddress: Address)
```

### Register Overachiever Completion  
```cadence
admin.registerOverachieverCompletion(userAddress: Address)
```

### Check Blockchain Status
```bash
node check-chapter5-collection.js <wallet_address>
```

---

## Current Status

As of October 27, 2025:
- **Slacker completions**: 0 users
- **Overachiever completions**: 0 users  
- **Full completions**: 0 users

---

## How Users Earn These

### Slacker Path:
1. Visit https://www.flunks.net
2. Go to Paradise Motel location
3. Wait for night time (8 PM - 6 AM local time based on browser timezone)
4. Enter Room 7 (door will be unlocked at night)
5. Automatic: 50 GUM awarded + added to `paradise_motel_room7_visits`

### Overachiever Path:
1. Visit https://www.flunks.net
2. Find the Hidden Riff game (guitar in Paradise Motel)
3. Play the correct sequence: C - G - A - F (Let It Be by The Beatles)
4. Automatic: 50 GUM awarded + added to `gum_transactions` with source='hidden_riff'

---

## NFT Distribution (When Ready)

When you're ready to airdrop the NFTs:

1. **Export eligible wallets**:
```bash
node check-chapter5-nft-eligibility.mjs > eligible-wallets.txt
```

2. **Use Flow CLI or admin transaction** to mint and distribute NFTs to those addresses

3. **Track in blockchain** using:
```cadence
admin.registerSlackerCompletion(user: 0x...)
admin.registerOverachieverCompletion(user: 0x...)
```

---

## Files Created

- `check-chapter5-nft-eligibility.sql` - SQL queries for Supabase
- `check-chapter5-nft-eligibility.mjs` - Node.js script to check eligibility
- This guide

---

## Next Steps

1. ✅ Tracking system is live and working
2. ⏳ Wait for users to complete objectives
3. ⏳ Design and prepare Chapter 5 NFT artwork
4. ⏳ Deploy NFT minting contract/logic
5. ⏳ Airdrop NFTs to eligible wallets
