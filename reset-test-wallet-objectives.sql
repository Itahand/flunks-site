-- Reset Chapter 5 objectives for test wallet 0x50b39b127236f46a
-- This allows re-testing the Halloween GumDrop flow

-- Reset Slacker (Room 7) completion - delete night visit record
DELETE FROM paradise_motel_room7_visits 
WHERE wallet_address = '0x50b39b127236f46a';

-- Reset Room 7 key
DELETE FROM paradise_motel_room7_keys
WHERE wallet_address = '0x50b39b127236f46a';

-- Reset achievement tracking tables (only ones that exist)
DELETE FROM digital_lock_attempts
WHERE wallet_address = '0x50b39b127236f46a';

DELETE FROM picture_day_votes
WHERE wallet_address = '0x50b39b127236f46a';

-- Verify reset
SELECT 'Room 7 visits:' as check, COUNT(*) as count 
FROM paradise_motel_room7_visits 
WHERE wallet_address = '0x50b39b127236f46a'
UNION ALL
SELECT 'Room 7 keys:', COUNT(*)
FROM paradise_motel_room7_keys
WHERE wallet_address = '0x50b39b127236f46a'
UNION ALL
SELECT 'Digital lock attempts:', COUNT(*)
FROM digital_lock_attempts
WHERE wallet_address = '0x50b39b127236f46a'
UNION ALL
SELECT 'Picture day votes:', COUNT(*)
FROM picture_day_votes
WHERE wallet_address = '0x50b39b127236f46a';
