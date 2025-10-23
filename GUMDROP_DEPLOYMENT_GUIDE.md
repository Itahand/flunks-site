# FlunksGumDrop Contract - Deployment & Usage Guide

## Overview
This contract enables special limited-time GUM reward events for Flunk NFT holders. It's **production-ready** and removes the test allowlist requirement.

## Key Features
✅ **No Allowlist Required** - Any Flunk holder can claim when drop is active  
✅ **Admin Controls** - Start/stop drops, set rewards, emergency resets  
✅ **Blockchain Verification** - On-chain claim tracking prevents double-claiming  
✅ **Time Windows** - Set start/end times for automatic event management  

## How It Works

### For Users:
1. When drop is active, users with Flunk NFTs see the claim button
2. They click to claim → blockchain transaction records their claim
3. Backend API credits GUM to their Supabase account
4. **No pre-approval needed** - automatic if they own a Flunk!

### For Admins:
The contract owner can:
- **Start drops** with custom timeframes and reward amounts
- **End drops** manually before scheduled end time
- **Reset claims** in emergency situations (user support)

## Deployment Steps

### 1. Deploy Contract to Flow Mainnet
```bash
# Using Flow CLI
flow accounts add-contract FlunksGumDrop ./contracts/FlunksGumDrop.cdc --network mainnet
```

### 2. Update Frontend Config
Update `src/config/fcl.ts`:
```typescript
config({
  // ... existing config ...
  "0xFlunksGumDrop": "0xYOUR_CONTRACT_ADDRESS_HERE",
});
```

### 3. Update Frontend Code
Replace all instances of `TestPumpkinDrop420` with `FlunksGumDrop`:
- `src/windows/LockerSystemNew.tsx`
- `src/components/HalloweenGumDrop.tsx` (if used)
- Any other files referencing the test contract

### 4. Test Before Launch
```bash
# Query drop status
flow scripts execute ./scripts/check-drop-status.cdc --network mainnet

# Test with your wallet first
# Enable the UI (change `false &&` to just the condition)
# Try claiming to verify full flow
```

## Starting Your First Drop

### Option A: Using Flow CLI (Recommended)
Create `scripts/start-drop.cdc`:
```cadence
import FlunksGumDrop from 0xFlunksGumDrop

transaction(startTime: UFix64, endTime: UFix64, gumPerFlunk: UInt64) {
    prepare(signer: &Account) {
        let admin = signer.storage.borrow<&FlunksGumDrop.Admin>(
            from: FlunksGumDrop.AdminStoragePath
        ) ?? panic("No admin resource found")
        
        admin.startDrop(
            startTime: startTime,
            endTime: endTime,
            gumPerFlunk: gumPerFlunk
        )
    }
}
```

Run it:
```bash
# Start 72-hour drop with 100 GUM reward
# Times are in Unix timestamp format
flow transactions send ./scripts/start-drop.cdc \
  --arg UFix64:1729713600.0 \  # Start time
  --arg UFix64:1729972800.0 \  # End time (72 hours later)
  --arg UInt64:100 \            # GUM per Flunk
  --network mainnet \
  --signer your-account
```

### Option B: Create Admin Script
Add to your project:
```javascript
// start-gumdrop.js
const fcl = require("@onflow/fcl");

async function startDrop() {
  const startTime = Math.floor(Date.now() / 1000); // Now
  const endTime = startTime + (72 * 60 * 60); // 72 hours from now
  
  const txId = await fcl.mutate({
    cadence: `
      import FlunksGumDrop from 0xFlunksGumDrop
      
      transaction(start: UFix64, end: UFix64, amount: UInt64) {
        prepare(signer: &Account) {
          let admin = signer.storage.borrow<&FlunksGumDrop.Admin>(
            from: FlunksGumDrop.AdminStoragePath
          )!
          admin.startDrop(startTime: start, endTime: end, gumPerFlunk: amount)
        }
      }
    `,
    args: (arg, t) => [
      arg(startTime.toFixed(1), t.UFix64),
      arg(endTime.toFixed(1), t.UFix64),
      arg("100", t.UInt64)
    ],
    proposer: fcl.authz,
    payer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 999
  });
  
  console.log("Drop started! TX:", txId);
}
```

## Frontend Integration

### Update LockerSystemNew.tsx
When ready to go live, change:
```typescript
// FROM:
{false && halloweenDropActive && !halloweenClaimed && flunkCount > 0 && (

// TO:
{halloweenDropActive && !halloweenClaimed && flunkCount > 0 && (
```

And update the import:
```typescript
// FROM:
import TestPumpkinDrop420 from 0xTestPumpkinDrop420

// TO:
import FlunksGumDrop from 0xFlunksGumDrop
```

### Update API Endpoint
The backend API (`/api/claim-halloween-gum.ts`) already works! Just ensure the `HALLOWEEN_GUMDROP` source exists in your Supabase `gum_sources` table.

## Key Differences from Test Contract

| Feature | TestPumpkinDrop420 | FlunksGumDrop |
|---------|-------------------|---------------|
| Allowlist | ✅ Required | ❌ No allowlist |
| Claim Check | Manual approval | Automatic for Flunk holders |
| Admin Setup | Pre-configured | Dynamic via transactions |
| Production Ready | Test only | ✅ Production ready |

## Security Notes

1. **Admin Access**: Only the contract deployer has admin powers
2. **Double-Claim Prevention**: Blockchain records prevent duplicate claims
3. **Time Validation**: Contract enforces start/end windows
4. **Flunk Verification**: Frontend/API should verify Flunk ownership before allowing claims

## Monitoring

Check drop status anytime:
```javascript
const dropInfo = await fcl.query({
  cadence: `
    import FlunksGumDrop from 0xFlunksGumDrop
    
    access(all) fun main(): {String: AnyStruct} {
      return FlunksGumDrop.getGumDropInfo()
    }
  `
});

console.log("Active:", dropInfo.isActive);
console.log("Time left:", dropInfo.timeRemaining, "seconds");
```

## Questions Answered

**Q: Do users need to be on an allowlist?**  
A: No! Anyone with a Flunk NFT can claim during active drops.

**Q: Can I run multiple drops?**  
A: Yes! End the current drop and start a new one anytime.

**Q: What if someone claims twice?**  
A: Impossible - the blockchain tracks claims and prevents duplicates.

**Q: How do I verify Flunk ownership?**  
A: Query the Flunks NFT collection on-chain or use your existing backend tracking.

---

**Ready to launch?** Deploy the contract, start your first drop, and enable the UI! 🎃
