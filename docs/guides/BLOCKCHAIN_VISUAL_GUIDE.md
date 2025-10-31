# Blockchain Integration - Visual Guide

## The Big Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE (What You Have)                     │
│  ✅ Tracks all user actions                                      │
│  ✅ Awards GUM                                                   │
│  ✅ Shows green checkmarks in myLocker                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                            👇 ADD 👇                             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                 BLOCKCHAIN (What You're Adding)                  │
│  🆕 Tracks SAME completions on Flow blockchain                  │
│  🆕 Emits events when both objectives complete                  │
│  🆕 Enables NFT airdrops for eligible users                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current Flow (What's Working)

```mermaid
graph TD
    A[User visits Room 7 at night] -->|POST| B[/api/paradise-motel-room7]
    B --> C{Already visited?}
    C -->|Yes| D[Return: Already earned GUM]
    C -->|No| E[Save to paradise_motel_room7_visits]
    E --> F[Award 50 GUM]
    F --> G[Return: Success + GUM amount]
    G --> H[myLocker shows green checkmark ✅]
```

---

## New Flow (With Blockchain)

```mermaid
graph TD
    A[User visits Room 7 at night] -->|POST| B[/api/paradise-motel-room7]
    B --> C{Already visited?}
    C -->|Yes| D[Return: Already earned GUM]
    C -->|No| E[Save to paradise_motel_room7_visits]
    E --> F[Award 50 GUM]
    F --> G[🆕 Call registerSlackerOnBlockchain]
    G --> H{Blockchain call succeeds?}
    H -->|Yes| I[✅ Blockchain marks slacker complete]
    H -->|No| J[⚠️ Log warning, continue anyway]
    I --> K[Return: Success + GUM amount]
    J --> K
    K --> L[myLocker shows green checkmark ✅]
    
    style G fill:#667eea,color:#fff
    style I fill:#48bb78,color:#fff
```

---

## What Happens on the Blockchain

```
┌──────────────────────────────────────────────────────────────┐
│  SemesterZero Smart Contract (flunks.flow)                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. registerSlackerCompletion(userAddress)                   │
│     └─> Sets slackerComplete = true                         │
│     └─> Records timestamp                                    │
│     └─> Emits: Chapter5SlackerCompleted                     │
│                                                               │
│  2. checkFullCompletion()                                    │
│     └─> If slacker ✅ AND overachiever ✅                   │
│     └─> Emits: Chapter5FullCompletion 🎉                    │
│     └─> User is now NFT eligible!                           │
│                                                               │
│  3. isEligibleForChapter5NFT(userAddress)                   │
│     └─> Returns: true if both complete                      │
│     └─> Returns: false if already got NFT                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Side-by-Side Comparison

### Supabase (Source of Truth for UI)
```typescript
// Check: Does user have green checkmark?
const { data } = await supabase
  .from('paradise_motel_room7_visits')
  .select('*')
  .eq('wallet_address', userAddress);

const completed = data && data.length > 0;
// ✅ Green checkmark if completed === true
```

### Blockchain (Source of Truth for NFT)
```typescript
// Check: Is user eligible for NFT?
const status = await SemesterZero.getChapter5Status(userAddress);

const nftEligible = status.slackerComplete && 
                    status.overachieverComplete && 
                    !status.nftAirdropped;
// 🎁 Can airdrop NFT if nftEligible === true
```

---

## Data Flow Diagram

```
USER ACTION: Visit Room 7 at night
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
   ┌─────────┐        ┌─────────┐       ┌─────────┐
   │ Supabase│        │   GUM   │       │Blockchain│
   │ Database│        │  Award  │       │ Registry │
   └─────────┘        └─────────┘       └─────────┘
         │                  │                  │
         ▼                  ▼                  ▼
   paradise_motel    user_gum_balance    Chapter5Status
   _room7_visits     + 50 GUM           slackerComplete
                                        = true
         │                  │                  │
         └──────────────────┴──────────────────┘
                            │
                            ▼
                    myLocker UI Updates
                    ✅ Green checkmark
                    🎁 NFT eligibility (if both complete)
```

---

## Timeline: When Things Happen

```
┌─────────────────────────────────────────────────────────────┐
│                      IMMEDIATELY                             │
│  (When user visits Room 7 at night)                         │
├─────────────────────────────────────────────────────────────┤
│  ✅ Supabase: paradise_motel_room7_visits insert            │
│  ✅ GUM: user_gum_balance +50                               │
│  🆕 Blockchain: registerSlackerCompletion() transaction     │
│  ✅ UI: Green checkmark appears in myLocker                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  WHEN BOTH OBJECTIVES COMPLETE               │
│  (Slacker + Overachiever both done)                         │
├─────────────────────────────────────────────────────────────┤
│  🆕 Blockchain: Chapter5FullCompletion event emitted        │
│  🆕 UI: NFT eligibility banner appears                      │
│  📊 Contract: isEligibleForChapter5NFT() returns true       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     LATER (Manual Admin Action)              │
│  (Admin decides to airdrop NFTs)                            │
├─────────────────────────────────────────────────────────────┤
│  🆕 Admin: Calls airdropChapter5NFT(userAddress)            │
│  🆕 Blockchain: Mints NFT and sends to user's wallet        │
│  🆕 Contract: nftAirdropped = true (can't claim twice)      │
│  🎁 User: Receives Chapter 5 NFT in wallet                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Code Location Map

```
flunks-site/
│
├── src/
│   ├── pages/api/
│   │   └── paradise-motel-room7.ts  ← 🎯 ADD BLOCKCHAIN CALL HERE
│   │       Line ~4:  import { registerSlackerOnBlockchain }
│   │       Line ~115: await registerSlackerOnBlockchain(walletAddress)
│   │
│   ├── utils/
│   │   └── blockchainRegistration.ts  ← ✅ ALREADY CREATED
│   │       registerSlackerOnBlockchain()
│   │       registerOverachieverOnBlockchain()
│   │       checkNFTEligibility()
│   │
│   └── components/
│       └── WeeklyObjectives.tsx  ← 🎯 ADD NFT BANNER HERE
│           Show banner when isNFTEligible === true
│
└── semesterzero.cdc  ← 📋 COPY TO flunks.flow ACCOUNT
    Deploy this contract to Flow blockchain
```

---

## What You Need to Do

### Option 1: Deploy Now (Recommended)
```bash
# 1. Add the blockchain call (won't actually execute until configured)
#    - It logs a message but returns true immediately
#    - Won't break anything
#    - User still gets GUM and green checkmark

# 2. Test that nothing breaks
#    - Visit Room 7 at night
#    - Check console: "⚠️ Slacker registration not yet implemented"
#    - Verify GUM still awarded
#    - Verify green checkmark still appears

# 3. Deploy semesterzero.cdc when ready
#    - Copy contract to flunks.flow account
#    - Configure admin wallet
#    - Update blockchainRegistration.ts with contract address
#    - Test on Flow Testnet first
```

### Option 2: Deploy Later (Wait until blockchain ready)
```bash
# 1. Keep your current code as-is
#    - Everything works perfectly

# 2. When you're ready for blockchain:
#    - Deploy semesterzero.cdc to flunks.flow
#    - Add the blockchain call to paradise-motel-room7.ts
#    - Configure admin wallet
#    - Deploy all at once
```

---

## Safety Features

### Graceful Degradation ✅
```typescript
try {
  await registerSlackerOnBlockchain(walletAddress);
} catch (error) {
  // User still gets GUM ✅
  // User still gets green checkmark ✅
  // Just logs an error ⚠️
}
```

### Idempotency ✅
```typescript
// Supabase: Can't visit twice (unique wallet constraint)
// Blockchain: Can call registerSlackerCompletion() multiple times
//             (just updates timestamp, doesn't break)
```

### No Breaking Changes ✅
```typescript
// Old flow: Supabase → GUM → Green checkmark
// New flow: Supabase → GUM → Blockchain → Green checkmark
//           └─────────────────────┘
//           If blockchain fails, flow still completes
```

---

## Summary

**What's changing:**
- 🆕 1 import line
- 🆕 12 lines of blockchain registration code
- 🆕 Blockchain tracks same completions as Supabase

**What's staying the same:**
- ✅ Supabase is still the source of truth for UI
- ✅ GUM awards work exactly the same
- ✅ Green checkmarks work exactly the same
- ✅ User experience is identical

**What's new:**
- 🎁 Users who complete both objectives are NFT eligible
- 🎁 Admin can airdrop Chapter 5 NFTs to eligible users
- 🎁 Blockchain provides immutable proof of completion
