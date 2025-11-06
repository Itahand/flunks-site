-- Batch award Room 7 Slacker objective to multiple users
-- For users who completed the cutscene but didn't get credited due to bug

-- INSTRUCTIONS:
-- 1. Replace the wallet addresses in the VALUES list below
-- 2. Add or remove rows as needed
-- 3. Run this in Supabase SQL Editor

BEGIN;

-- Create temporary table with affected wallet addresses
CREATE TEMP TABLE temp_affected_wallets (
    wallet_address TEXT PRIMARY KEY
);

-- INSERT YOUR WALLET ADDRESSES HERE
-- Add one row per affected user
INSERT INTO temp_affected_wallets (wallet_address) VALUES
    ('0xEXAMPLE1111111111'),  -- Replace with actual wallet
    ('0xEXAMPLE2222222222'),  -- Replace with actual wallet
    ('0xEXAMPLE3333333333');  -- Add more rows as needed

-- Award Room 7 visits for all affected users
INSERT INTO paradise_motel_room7_visits (
    wallet_address,
    username,
    gum_amount,
    visit_timestamp,
    created_at,
    user_agent,
    ip_address
)
SELECT 
    wallet_address,
    'Manual Award (Bug Fix Batch)',
    50,
    NOW(),
    NOW(),
    'Batch SQL Award - ParadiseMotelMainSimple Bug',
    'batch_award'
FROM temp_affected_wallets
ON CONFLICT (wallet_address) DO NOTHING;  -- Skip if already exists

-- Award GUM transactions for all affected users
INSERT INTO gum_transactions (
    wallet_address,
    transaction_type,
    amount,
    source,
    description,
    created_at
)
SELECT 
    wallet_address,
    'earned',
    50,
    'paradise_motel_room7',
    'Chapter 5 Slacker - Paradise Motel Room 7 night visit (Batch Manual Award)',
    NOW()
FROM temp_affected_wallets
WHERE wallet_address NOT IN (
    -- Don't duplicate if they already have a GUM transaction
    SELECT wallet_address 
    FROM gum_transactions 
    WHERE source = 'paradise_motel_room7'
);

-- Show summary of what was awarded
SELECT 
    'Summary' as info,
    COUNT(*) as total_users_processed,
    SUM(50) as total_gum_awarded
FROM temp_affected_wallets;

-- Show detailed results
SELECT 
    t.wallet_address,
    CASE 
        WHEN v.wallet_address IS NOT NULL THEN '✅ Room 7 Visit Recorded'
        ELSE '❌ Room 7 Visit FAILED'
    END as visit_status,
    CASE 
        WHEN g.wallet_address IS NOT NULL THEN '✅ GUM Transaction Recorded'
        ELSE '❌ GUM Transaction FAILED'
    END as gum_status,
    v.gum_amount,
    v.visit_timestamp
FROM temp_affected_wallets t
LEFT JOIN paradise_motel_room7_visits v ON t.wallet_address = v.wallet_address
LEFT JOIN gum_transactions g ON t.wallet_address = g.wallet_address 
    AND g.source = 'paradise_motel_room7'
ORDER BY t.wallet_address;

COMMIT;

-- Verify all users got their awards
SELECT 
    wallet_address,
    gum_amount,
    visit_timestamp,
    created_at
FROM paradise_motel_room7_visits
WHERE wallet_address IN (
    -- List your wallets again here to verify
    '0xEXAMPLE1111111111',
    '0xEXAMPLE2222222222',
    '0xEXAMPLE3333333333'
)
ORDER BY created_at DESC;
