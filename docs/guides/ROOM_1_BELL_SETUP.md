# Room 1 Bell Ringing Feature - Setup Guide

## Overview
The Tiki Bar in Paradise Motel has been converted to **Room 1** with an interactive bell ringing mechanic. Users can ring a bell, and after 10 rings, they can claim 100 GUM (once per 24 hours).

## What Was Changed

### 1. WINDOW_IDS Updated
- **File**: `src/fixed.ts`
- **Change**: `PARADISE_MOTEL_TIKI_BAR` → `PARADISE_MOTEL_ROOM_1`

### 2. Room 1 Component Created
- **File**: `src/windows/Locations/ParadiseMotelMain.tsx`
- **New Component**: `Room1BellComponent`
  - Tracks bell ring count (0-10+)
  - Displays progressive messages:
    - Rings 1-3: "Please ring only once, thanks management"
    - Rings 4-9: "Seriously, stop"
    - Ring 10+: "Fine! Here's your reward. Happy now?"
  - Shows claim button at 10 rings
  - Plays bell sound on each ring
  - Claims 100 GUM via API

### 3. API Endpoint Created
- **File**: `src/pages/api/claim-room-1-bell.ts`
- Uses `awardGum()` utility with source ID `'room_1_bell'`
- Returns success/failure with cooldown messages

### 4. Database Source SQL
- **File**: `create-room-1-bell-source.sql`
- Source ID: `room_1_bell`
- Amount: 100 GUM
- Cooldown: 24 hours

### 5. Paradise Motel Button Updated
- Changed from "🍹 Tiki Bar" to "🔔 Room 1"
- Calls `openRoom1()` function

## Setup Steps

### Step 1: Add Bell Sound File
**⚠️ REQUIRED - You need to do this!**

1. Upload your bell sound file to: `/public/sounds/bell.mp3`
2. The component expects this exact path
3. Supported formats: MP3 (recommended), WAV, OGG

### Step 2: Create Database Source
Run this SQL in your Supabase SQL Editor:

```sql
INSERT INTO gum_sources (
  source_id,
  source_name,
  gum_amount,
  cooldown_hours,
  description,
  is_active
) VALUES (
  'room_1_bell',
  'Paradise Motel Room 1 Bell',
  100,
  24,
  'Ring the bell 10 times in Room 1 of Paradise Motel to claim 100 GUM',
  true
)
ON CONFLICT (source_id) 
DO UPDATE SET
  source_name = EXCLUDED.source_name,
  gum_amount = EXCLUDED.gum_amount,
  cooldown_hours = EXCLUDED.cooldown_hours,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;
```

Or run the file: `create-room-1-bell-source.sql`

### Step 3: Test the Feature
1. Start your dev server: `npm run dev`
2. Navigate to Paradise Motel
3. Click "🔔 Room 1" button
4. Ring the bell and verify:
   - Sound plays on each ring
   - Ring counter increments
   - Messages change at rings 1, 4, and 10
   - Claim button appears at 10 rings
   - GUM is awarded when claimed (check wallet balance)

## Feature Behavior

### Bell Ringing Flow
1. User clicks "Ring Bell" button
2. Bell sound plays (bell.mp3)
3. Ring count increases
4. Message updates based on count:
   - 0: "There's a bell on the desk. Maybe you should ring it?"
   - 1-3: "Please ring only once, thanks management"
   - 4-9: "Seriously, stop"
   - 10+: "Fine! Here's your reward. Happy now?"

### GUM Claiming Flow
1. At 10 rings, "💰 Claim 100 GUM" button appears
2. User must have wallet connected
3. Click to claim → API call to `/api/claim-room-1-bell`
4. Success: 100 GUM added to wallet
5. Cooldown: 24 hours before next claim

### Reset Behavior
- Ring count resets when window closes
- Users can ring bell again to reach 10 and claim
- Database tracks cooldown per wallet address

## Customization Options

### Change GUM Amount
Edit `create-room-1-bell-source.sql`:
```sql
gum_amount = 100  -- Change to desired amount
```

### Change Cooldown
Edit `create-room-1-bell-source.sql`:
```sql
cooldown_hours = 24  -- Change to desired hours
```

### Change Messages
Edit `ParadiseMotelMain.tsx`, find `getMessage()` function:
```typescript
const getMessage = () => {
  if (ringCount === 0) return "Your message here";
  if (ringCount >= 1 && ringCount <= 3) return "Your message here";
  // etc...
};
```

### Change Required Rings
Edit the claim button condition in `Room1BellComponent`:
```typescript
{ringCount >= 10 && !claimed && (  // Change 10 to desired number
```

## Files Modified
- ✅ `src/fixed.ts` - Updated WINDOW_IDS
- ✅ `src/windows/Locations/ParadiseMotelMain.tsx` - Added Room 1 component and button
- ✅ `src/pages/api/claim-room-1-bell.ts` - Created API endpoint
- ✅ `create-room-1-bell-source.sql` - Database source configuration

## Next Steps
1. **Upload bell.mp3** to `/public/sounds/`
2. **Run SQL** to create the gum_source
3. **Test** the feature in development
4. **Deploy** when ready!

## Troubleshooting

### Bell Sound Not Playing
- Check that `bell.mp3` exists at `/public/sounds/bell.mp3`
- Check browser console for audio errors
- Some browsers block autoplay - user interaction (clicking) should work

### GUM Not Awarded
- Check that `gum_sources` table has `room_1_bell` entry
- Verify `is_active = true` in database
- Check API response in browser Network tab
- Verify wallet is connected

### Button Not Showing
- Ensure 10 rings reached
- Check wallet connection
- Verify not already claimed (check cooldown)

## Design Notes
- Room uses amber/orange gradient theme (desert motel vibe)
- Large animated bell emoji (🔔)
- Ring counter with yellow badge
- Messages display in semi-transparent black box
- Claim button is green gradient when available
- Responsive layout works on mobile/desktop
