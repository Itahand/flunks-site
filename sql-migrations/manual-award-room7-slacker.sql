-- Manual award for users who completed Room 7 cutscene but didn't get credited
-- Due to bug where ParadiseMotelMainSimple.tsx didn't call the API endpoint

-- Replace 'USER_WALLET_ADDRESS' with the actual wallet address
-- Run this in Supabase SQL Editor

BEGIN;

-- Insert the Room 7 visit record
INSERT INTO paradise_motel_room7_visits (
    wallet_address,
    username,
    gum_amount,
    visit_timestamp,
    created_at,
    user_agent,
    ip_address
)
VALUES (
    'USER_WALLET_ADDRESS',  -- Replace with actual wallet
    'Manual Award (Bug Fix)',
    50,
    NOW(),
    NOW(),
    'Manual SQL Award',
    'manual'
)
ON CONFLICT (wallet_address) DO NOTHING;  -- Don't duplicate if already exists

-- Award the GUM transaction
INSERT INTO gum_transactions (
    wallet_address,
    transaction_type,
    amount,
    source,
    description,
    created_at
)
VALUES (
    'USER_WALLET_ADDRESS',  -- Replace with actual wallet
    'earned',
    50,
    'paradise_motel_room7',
    'Chapter 5 Slacker - Paradise Motel Room 7 night visit (Manual Award)',
    NOW()
);

-- Verify the award
SELECT 
    'Room 7 Visit' as record_type,
    wallet_address,
    gum_amount,
    visit_timestamp
FROM paradise_motel_room7_visits
WHERE wallet_address = 'USER_WALLET_ADDRESS'

UNION ALL

SELECT 
    'GUM Transaction' as record_type,
    wallet_address,
    amount as gum_amount,
    created_at as visit_timestamp
FROM gum_transactions
WHERE wallet_address = 'USER_WALLET_ADDRESS'
  AND source = 'paradise_motel_room7'
ORDER BY visit_timestamp DESC;

COMMIT;

-- After running this:
-- 1. User will see +50 GUM in their balance
-- 2. User will show as having completed Slacker objective
-- 3. User can now earn the Chapter 5 NFT if they also complete Overachiever (Hidden Riff)
