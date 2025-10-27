-- Reset Chapter 5 objectives for wallet 0xe327216d843357f1
-- This allows re-testing the Halloween GumDrop flow

-- Reset Slacker (Room 7) completion - delete night visit record
DELETE FROM paradise_motel_room7_visits 
WHERE wallet_address = '0xe327216d843357f1';

-- Reset Room 7 key
DELETE FROM paradise_motel_room7_keys
WHERE wallet_address = '0xe327216d843357f1';

-- Reset achievement tracking tables
DELETE FROM digital_lock_attempts
WHERE wallet_address = '0xe327216d843357f1';

DELETE FROM picture_day_votes
WHERE user_wallet = '0xe327216d843357f1';

-- Clear Halloween GumDrop cooldown
DELETE FROM gum_transactions 
WHERE wallet_address = '0xe327216d843357f1' 
AND source = 'halloween_pumpkin_button';

-- Verify reset
SELECT 'Room 7 visits:' as check, COUNT(*) as count 
FROM paradise_motel_room7_visits 
WHERE wallet_address = '0xe327216d843357f1'
UNION ALL
SELECT 'Room 7 keys:', COUNT(*)
FROM paradise_motel_room7_keys
WHERE wallet_address = '0xe327216d843357f1'
UNION ALL
SELECT 'Digital lock attempts:', COUNT(*)
FROM digital_lock_attempts
WHERE wallet_address = '0xe327216d843357f1'
UNION ALL
SELECT 'Picture day votes:', COUNT(*)
FROM picture_day_votes
WHERE user_wallet = '0xe327216d843357f1'
UNION ALL
SELECT 'Halloween claims:', COUNT(*)
FROM gum_transactions
WHERE wallet_address = '0xe327216d843357f1'
AND source = 'halloween_pumpkin_button';
