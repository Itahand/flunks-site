# FlunksGraduation Cadence 1.0 Migration

## Problem
The **FlunksGraduation** contract deployed at `0x807c3d470888cc48` is using old Cadence 0.x syntax (`pub` keyword) which causes the Flow Token List scanner to fail when trying to register SemesterZero.

## Solution
Update the FlunksGraduation contract to Cadence 1.0 syntax.

## Key Changes Made

### 1. Access Modifiers
```cadence
// OLD (Cadence 0.x)
pub contract FlunksGraduation {
pub event ContractInitialized()
pub fun graduateFlunk(owner: AuthAccount, tokenID: UInt64)

// NEW (Cadence 1.0)
access(all) contract FlunksGraduation {
access(all) event ContractInitialized()
access(all) fun graduateFlunk(owner: auth(Storage, Capabilities) &Account, tokenID: UInt64)
```

### 2. Account Type
```cadence
// OLD
AuthAccount

// NEW  
auth(Storage, Capabilities, BorrowValue) &Account
```

### 3. Restricted Types
```cadence
// OLD
&Flunks.Collection{NonFungibleToken.CollectionPublic}

// NEW
&{NonFungibleToken.CollectionPublic}
```

## Migration Steps

1. **Review the migrated contract:**
   ```bash
   cat contracts/FlunksGraduation_Cadence1.0.cdc
   ```

2. **Run the update script:**
   ```bash
   ./update-flunks-graduation.sh
   ```
   
   This will:
   - Copy the migrated contract to your flunks.flow folder
   - Update the contract on mainnet using Flow CLI
   - Preserve all existing functionality

3. **Verify the update:**
   ```bash
   ./check-deployed-contracts.sh
   ```

4. **Test Token List registration:**
   - Visit https://token-list.fixes.world/
   - Connect wallet (0x807c3d470888cc48)
   - Search for contracts - should no longer error
   - Register SemesterZero

## Safety Notes

- ✅ Contract update is **safe** - only changes syntax, not logic
- ✅ All existing data and state is preserved
- ✅ FlunksGraduationV2 remains unchanged
- ✅ Transaction requires signing with your mainnet private key

## What Contracts Need Migration?

From `0x807c3d470888cc48`:
- ❌ **FlunksGraduation** - NEEDS UPDATE (old syntax)
- ✅ **FlunksGraduationV2** - Already Cadence 1.0
- ✅ **Flunks** - Already Cadence 1.0
- ✅ **SemesterZero** - Already Cadence 1.0
- ✅ **FlunksGumDrop** - Already Cadence 1.0
- ⚠️  Other contracts - Need to verify (GUM, Staking, etc.)

## After Migration

Once FlunksGraduation is updated:
1. Token List scanner should work
2. You can register SemesterZero
3. Users can search for "Flunks: Semester Zero" in Flow Wallet
4. NFT airdrops will work smoothly

## Rollback Plan

If something goes wrong:
- You can update the contract again with a fixed version
- Contracts cannot be deleted on Flow, only updated
- The old FlunksGraduationV2 contract is untouched as backup
