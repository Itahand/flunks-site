# Paradise Motel Key → Unlock Reveal System

## Concept

Users earn a "Paradise Motel Key" NFT, then go to your website and click an interactive keyhole to **transform** their key into something special (Room 7 Access Pass, exclusive item, etc.)

## Flow Diagram

```
User earns key in Paradise Motel
           ↓
Mint "Paradise Motel Key" NFT (placeholder image)
           ↓
User sees key in their wallet/collection
           ↓
User visits website keyhole interface
           ↓
Clicks keyhole to "insert" key
           ↓
🔑 Key animates into keyhole
           ↓
NFT metadata transforms via reveal()
           ↓
✨ New image & traits appear!
           ↓
User now has unlocked item/pass
```

## Implementation

### 1. Mint Initial Key NFT

When user completes the Paradise Motel objective:

```cadence
// Backend mints this
{
  "name": "Paradise Motel Key",
  "description": "A mysterious key found in the Paradise Motel. What does it unlock?",
  "image": "https://cdn.flunks.net/items/paradise-key.png",  // 🔑 Key image
  "revealed": "false",
  "type": "key",
  "location": "paradise_motel",
  "rarity": "rare",
  "unlock_ready": "true",
  "hint": "Try the keyhole at Paradise Motel..."
}
```

### 2. Website Keyhole Interface

Add to Paradise Motel window or create dedicated unlock window:

```tsx
import KeyholeReveal from 'components/KeyholeReveal';

// In your windows system:
openWindow({
  key: WINDOW_IDS.PARADISE_KEYHOLE,
  window: (
    <DraggableResizeableWindow
      windowsId={WINDOW_IDS.PARADISE_KEYHOLE}
      headerTitle="🔑 Paradise Motel - Mystery Keyhole"
      onClose={() => closeWindow(WINDOW_IDS.PARADISE_KEYHOLE)}
    >
      <KeyholeReveal 
        onUnlock={() => {
          // Optional: Show success animation, confetti, etc.
          console.log('🎉 Key unlocked!');
        }}
      />
    </DraggableResizeableWindow>
  )
});
```

### 3. Reveal Transformation

When user clicks the keyhole, their NFT transforms to:

```cadence
{
  "name": "Paradise Motel - Room 7 Access Pass",
  "description": "Exclusive access to the mysterious Room 7. Holder can enter the forbidden room.",
  "image": "https://cdn.flunks.net/items/room7-pass.png",  // ✨ New image
  "revealed": "true",
  "type": "access_pass",
  "location": "paradise_motel_room7",
  "rarity": "legendary",  // Upgraded!
  "original_item": "paradise_motel_key",
  "unlock_type": "interactive_keyhole",
  "unlocked_at": "2025-11-10T15:30:00Z",
  "special_ability": "room7_access",
  "glow": "golden",
  "animated": "true"
}
```

## Visual Experience

### Before Unlock:
```
┌─────────────────────────┐
│   🔒 Mystery Keyhole    │
│                         │
│         🔑              │
│    (Key hovers above)   │
│                         │
│       ⚫ ←─── Keyhole   │
│       │                 │
│      ╱│╲                │
│                         │
│  [Insert Key & Unlock]  │
└─────────────────────────┘
```

### During Unlock (Animation):
```
┌─────────────────────────┐
│   🔓 Unlocking...       │
│                         │
│         🔑              │
│         ↓  (inserting)  │
│         ⚫              │
│         │               │
│        ╱│╲              │
│   ✨   Glowing   ✨     │
│                         │
│   [⏳ Unlocking...]     │
└─────────────────────────┘
```

### After Unlock:
```
┌─────────────────────────┐
│   ✨ UNLOCKED! ✨       │
│                         │
│   [New NFT Image]       │
│  Room 7 Access Pass     │
│                         │
│   🎉 Legendary Item!    │
│   Special Abilities:    │
│   • Room 7 Access       │
│   • Golden Glow Effect  │
│                         │
└─────────────────────────┘
```

## Database Setup

Add these columns to `nft_reveal_requests`:

```sql
ALTER TABLE nft_reveal_requests ADD COLUMN IF NOT EXISTS nft_id TEXT;
ALTER TABLE nft_reveal_requests ADD COLUMN IF NOT EXISTS reveal_type TEXT;
ALTER TABLE nft_reveal_requests ADD COLUMN IF NOT EXISTS new_metadata JSONB;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reveal_type ON nft_reveal_requests(reveal_type);
```

## Components Created

1. **`KeyholeReveal.tsx`** - Interactive keyhole UI
   - Animated key insertion
   - Glowing effects when key is detected
   - Click to unlock
   - Shows before/after NFT

2. **`/api/unlock-key-nft`** - Backend unlock handler
   - Validates user has key NFT
   - Creates reveal request
   - Returns new metadata

## Use Cases

### 🔑 Key → Access Pass
```
Paradise Motel Key → Room 7 Access Pass
```

### 🎁 Mystery Box → Revealed Item
```
Mystery Gift Box → Legendary Paradise Motel Patch
```

### 🗝️ Fragment Collection → Complete Item
```
Key Fragment 1 + 2 + 3 → Complete Master Key
```

### 🎭 Disguised Item → True Form
```
Plain Motel Keycard → Enchanted Access Pass
```

## Admin Processing

When users unlock keys, admin processes requests:

```tsx
// In admin panel
<NFTRevealer />

// Shows pending unlock requests
// Admin reviews and executes reveal transaction
// NFT transforms on-chain
```

## Gamification Ideas

### Time-Limited Unlocks
```typescript
// Add expiry to key NFT
"unlock_expires": "2025-12-31",
"urgent": "true"
```

### Conditional Unlocks
```typescript
// Require multiple items
if (hasKey && hasMapPiece && completedQuest) {
  allowUnlock();
}
```

### Rarity Boost
```typescript
// Early unlocks get better rarity
const unlockTime = Date.now() - keyMintTime;
const rarity = unlockTime < 24hours ? "legendary" : "rare";
```

### Achievement Tracking
```typescript
{
  "unlock_achievement": "early_unlocker",
  "unlock_rank": "5",  // 5th person to unlock
  "unlock_speed": "fast"
}
```

## Integration with Existing System

You already have the maid quest that gives users a key! Just:

1. **Change the reward** from Supabase flag to NFT mint
2. **Mint "Paradise Motel Key" NFT** instead of just database flag
3. **Add keyhole** to Paradise Motel window
4. **User clicks keyhole** to transform their key NFT
5. **Revealed NFT** gives them Room 7 access or special item

## Example: Full Integration

```tsx
// In ParadiseMotelMain.tsx
const openKeyhole = () => {
  openWindow({
    key: 'paradise-keyhole',
    window: (
      <DraggableResizeableWindow
        windowsId="paradise-keyhole"
        headerTitle="🔑 Paradise Motel - Mystery Door"
        initialWidth="600px"
        initialHeight="700px"
      >
        <KeyholeReveal 
          onUnlock={async () => {
            // Play sound effect
            playSound('/sounds/unlock.mp3');
            
            // Show success message
            alert('🎉 You unlocked Room 7 Access Pass!');
            
            // Maybe grant in-game access
            await grantRoom7Access(wallet);
            
            // Confetti effect
            triggerConfetti();
          }}
        />
      </DraggableResizeableWindow>
    )
  });
};

// Add button to Paradise Motel
<button onClick={openKeyhole}>
  🔑 Mysterious Keyhole
</button>
```

## Testing Checklist

- [ ] Mint test key NFT to your wallet
- [ ] Visit keyhole interface
- [ ] Verify key is detected
- [ ] Click to unlock
- [ ] Check animation plays
- [ ] Confirm reveal request created
- [ ] Admin processes reveal
- [ ] Verify NFT transformed
- [ ] Check new image on Flowty
- [ ] Test with wallet that has no key

## Next Level Features

### Multi-Stage Reveals
```
Bronze Key → Silver Key → Gold Key → Master Key
```

### Combine Items
```
Key + Map + Compass → Treasure Location NFT
```

### Dynamic Unlocks
```
// Different reveal based on time/location
if (unlockedAtNight) {
  revealTo("Night Access Pass");
} else {
  revealTo("Day Access Pass");
}
```

### Social Unlocks
```
// Require multiple users to unlock together
if (usersAtKeyhole.length >= 3) {
  unlockCollaborativeReward();
}
```

This is EXACTLY like the maid quest key mechanic but with NFTs! 🔑✨
