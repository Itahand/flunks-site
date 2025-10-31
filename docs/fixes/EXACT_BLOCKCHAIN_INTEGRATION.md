# EXACT CODE CHANGE - paradise-motel-room7.ts

## What to Change

### 1. Add Import at Top of File (Line ~4)

**BEFORE:**
```typescript
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';
```

**AFTER:**
```typescript
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';
import { registerSlackerOnBlockchain } from '../../utils/blockchainRegistration'; // 🆕 ADD THIS LINE
```

---

### 2. Add Blockchain Call After GUM Award (Line ~115)

**BEFORE:**
```typescript
    console.log('🌙 Room 7 GUM result:', gumResult);

    if (!gumResult.success) {
      console.warn('⚠️ GUM award failed but visit recorded:', gumResult.error);
    }

    const actualGumAwarded = gumResult.success ? gumResult.earned : 0;
```

**AFTER:**
```typescript
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
```

---

## That's It! Just 2 Changes:

1. ✅ Add 1 import line
2. ✅ Add blockchain registration block (12 lines)

## What This Does:

```
User visits Room 7 at night
         ↓
Supabase records visit ✅ (existing)
         ↓
Award 50 GUM ✅ (existing)
         ↓
🆕 Call blockchain to mark "slacker complete"
         ↓
myLocker shows green ✅ (existing)
```

## What Happens If Blockchain Fails?

**The try/catch ensures graceful degradation:**
- ✅ User still gets GUM
- ✅ User still gets green checkmark  
- ✅ Supabase still records completion
- ⚠️ Just logs a warning
- ✅ Flow continues normally

## When Does Blockchain Actually Execute?

**Right now:** It logs a message but doesn't actually call the blockchain (returns `true` immediately)

**After you deploy semesterzero.cdc:** You'll configure the admin wallet in `blockchainRegistration.ts` and it will actually submit transactions

**This means:** You can deploy this code NOW and it won't break anything. The blockchain integration is "stubbed out" until you're ready to configure it.

---

## Copy/Paste Ready Code Block

If you want to just copy/paste the blockchain registration block:

```typescript
// 🆕 Register on blockchain for NFT eligibility
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
```

Place this block **right after** the GUM award result logging, **before** checking if GUM succeeded.
