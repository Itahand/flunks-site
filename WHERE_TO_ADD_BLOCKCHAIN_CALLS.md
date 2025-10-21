# Where to Add Blockchain Calls - Step by Step Guide

## Overview
This guide shows you **exactly where** to add blockchain registration calls in your existing working code.

The pattern is simple:
1. ✅ User completes objective → Supabase records it
2. ✅ Award GUM (existing working code)
3. **🆕 NEW: Call blockchain to register completion**
4. ✅ myLocker shows green checkmark (existing working code)

---

## Step 1: Slacker Objective (Room 7 Night Visit)

### File: `/src/pages/api/paradise-motel-room7.ts`

**Add the import at the top:**
```typescript
import { registerSlackerOnBlockchain } from '../../utils/blockchainRegistration';
```

**Add blockchain call AFTER GUM is awarded (around line 115):**

```typescript
// Award GUM using the proper gumAPI utility
console.log('🌙 Attempting to award Room 7 GUM...');
const gumResult = await awardGum(
  walletAddress, 
  'chapter5_paradise_motel_room7',
  {
    description: 'Chapter 5 Slacker - Paradise Motel Room 7 night visit',
    username: username || null
  }
);

console.log('🌙 Room 7 GUM result:', gumResult);

// 🆕 ADD THIS: Register on blockchain for NFT eligibility
console.log('🔗 Registering slacker completion on blockchain...');
const blockchainRegistered = await registerSlackerOnBlockchain(walletAddress);
if (blockchainRegistered) {
  console.log('✅ Slacker completion registered on blockchain!');
} else {
  console.warn('⚠️ Blockchain registration failed, but Supabase/GUM succeeded');
}
// END NEW CODE

if (!gumResult.success) {
  console.warn('⚠️ GUM award failed but visit recorded:', gumResult.error);
}
```

**What this does:**
- After Supabase records the visit ✅
- After GUM is awarded ✅  
- **Calls the blockchain to mark user as "slacker complete"** 🆕
- If blockchain fails, user still gets GUM and green checkmark (graceful degradation)

---

## Step 2: Overachiever Objective (When You Define It)

### Example: If it's "Crack the Code"

**File:** `/src/pages/api/crack-code.ts` (or wherever you handle code cracking)

```typescript
import { registerOverachieverOnBlockchain } from '../../utils/blockchainRegistration';

// ... existing code that validates the code ...

// After successful code crack and GUM award:
console.log('🔗 Registering overachiever completion on blockchain...');
const blockchainRegistered = await registerOverachieverOnBlockchain(walletAddress);
if (blockchainRegistered) {
  console.log('✅ Overachiever completion registered on blockchain!');
}
```

---

## Step 3: Frontend - Show NFT Eligibility Banner

### File: `/src/components/WeeklyObjectives.tsx` (or wherever you show objectives)

**Add a check for NFT eligibility:**

```typescript
import { checkNFTEligibility } from '../utils/blockchainRegistration';

function WeeklyObjectives() {
  const [isNFTEligible, setIsNFTEligible] = useState(false);

  useEffect(() => {
    async function checkEligibility() {
      if (walletAddress && progress === 100) {
        const eligible = await checkNFTEligibility(walletAddress);
        setIsNFTEligible(eligible);
      }
    }
    checkEligibility();
  }, [walletAddress, progress]);

  return (
    <div>
      {/* Existing objectives UI */}
      
      {isNFTEligible && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          textAlign: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <h3>🎉 NFT ELIGIBLE! 🎉</h3>
          <p>You completed both objectives! Check back soon for your Chapter 5 NFT airdrop.</p>
        </div>
      )}
    </div>
  );
}
```

---

## Visual Flow Diagram

```
USER VISITS ROOM 7 AT NIGHT
         ↓
    POST /api/paradise-motel-room7
         ↓
┌─────────────────────────────────────┐
│  1. Check Supabase                  │  ← Existing ✅
│     - Already visited?              │
│     - If yes, return early          │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  2. Save to Supabase                │  ← Existing ✅
│     paradise_motel_room7_visits     │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  3. Award 50 GUM                    │  ← Existing ✅
│     via awardGum() API              │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  4. Register on Blockchain 🆕       │  ← ADD THIS
│     registerSlackerOnBlockchain()   │
│     - Calls SemesterZero contract   │
│     - Marks user as slacker         │
│     - Checks if both complete       │
│     - Emits Chapter5FullCompletion  │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  5. Frontend Checks Eligibility 🆕  │  ← ADD THIS
│     checkNFTEligibility()           │
│     - Shows NFT banner if eligible  │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  6. Admin Airdrops NFT (Manual) 🆕  │
│     - Admin dashboard               │
│     - Calls airdropChapter5NFT()    │
│     - NFT sent to user's wallet     │
└─────────────────────────────────────┘
```

---

## Example: Full Modified paradise-motel-room7.ts

```typescript
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';
import { registerSlackerOnBlockchain } from '../../utils/blockchainRegistration'; // 🆕 ADD THIS

// ... rest of existing code ...

export default async function handler(req: NextApiRequest, res: NextApiResponse<Room7Response>) {
  // ... validation code ...
  
  // Award GUM using the proper gumAPI utility
  console.log('🌙 Attempting to award Room 7 GUM...');
  const gumResult = await awardGum(
    walletAddress, 
    'chapter5_paradise_motel_room7',
    {
      description: 'Chapter 5 Slacker - Paradise Motel Room 7 night visit',
      username: username || null
    }
  );

  console.log('🌙 Room 7 GUM result:', gumResult);

  // 🆕 NEW: Register on blockchain for NFT eligibility
  console.log('🔗 Registering slacker completion on blockchain...');
  try {
    const blockchainRegistered = await registerSlackerOnBlockchain(walletAddress);
    if (blockchainRegistered) {
      console.log('✅ Slacker completion registered on blockchain!');
    } else {
      console.warn('⚠️ Blockchain registration failed, but Supabase/GUM succeeded');
    }
  } catch (blockchainError) {
    console.error('❌ Blockchain registration error:', blockchainError);
    // Continue anyway - user still gets GUM and green checkmark
  }
  // END NEW CODE

  if (!gumResult.success) {
    console.warn('⚠️ GUM award failed but visit recorded:', gumResult.error);
  }

  const actualGumAwarded = gumResult.success ? gumResult.earned : 0;

  console.log('✅ Room 7 visit recorded successfully:', {
    id: insertData.id,
    wallet: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6),
    gumAwarded: actualGumAwarded
  });

  return res.status(200).json({
    success: true,
    message: `🌙 Chapter 5 Slacker objective completed! You earned ${actualGumAwarded} GUM!`,
    gumAwarded: actualGumAwarded
  });
}
```

---

## Testing Checklist

### After adding blockchain calls:

1. **Test Room 7 Visit:**
   - [ ] Visit Room 7 at night
   - [ ] Check console logs for "🔗 Registering slacker completion on blockchain..."
   - [ ] Verify "✅ Slacker completion registered on blockchain!" appears
   - [ ] Confirm GUM still awarded
   - [ ] Confirm myLocker shows green checkmark

2. **Test Blockchain Query:**
   - [ ] Open browser console
   - [ ] Run: `await checkNFTEligibility('YOUR_WALLET_ADDRESS')`
   - [ ] Should return `true` if both objectives complete

3. **Test NFT Eligibility Banner:**
   - [ ] Complete both slacker + overachiever
   - [ ] myLocker should show 100% + NFT eligible banner

4. **Test Graceful Degradation:**
   - [ ] If blockchain call fails, user still gets GUM ✅
   - [ ] Green checkmark still appears ✅
   - [ ] No errors break the flow ✅

---

## Configuration Notes

### Before Deploying to Production:

1. **Deploy semesterzero.cdc to Flow:**
   - Copy contract to flunks.flow account
   - Note the deployed contract address
   - Update `0xYOUR_CONTRACT_ADDRESS` in blockchainRegistration.ts

2. **Configure FCL (Flow Client Library):**
   - Set up admin wallet for signing transactions
   - Configure in your environment variables
   - Test on Flow Testnet first

3. **Set Up Admin Dashboard:**
   - Create UI for admins to see eligible users
   - Button to trigger `airdropChapter5NFT()`
   - Show NFT airdrop history

---

## Summary

**What to add:**
1. ✅ Import `registerSlackerOnBlockchain` in paradise-motel-room7.ts
2. ✅ Call it after GUM is awarded (1 line of code)
3. ✅ Import `checkNFTEligibility` in WeeklyObjectives.tsx
4. ✅ Show NFT eligibility banner when both complete

**What stays the same:**
- ✅ Supabase tracking (no changes)
- ✅ GUM awards (no changes)  
- ✅ Green checkmarks (no changes)
- ✅ User experience (seamless)

**What's new:**
- 🆕 Blockchain tracks completions for NFT eligibility
- 🆕 Users see NFT eligibility banner
- 🆕 Admin can airdrop NFTs to eligible users
