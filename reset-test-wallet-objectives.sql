-- Reset Chapter 5 objectives for test wallet 0x50b39b127236f46a
-- This allows re-testing the Halloween GumDrop flow

-- Reset Slacker (Room 7) completion - delete night visits
DELETE FROM paradise_motel_room7_visits 
WHERE wallet_address = '0x50b39b127236f46a'
AND visit_type = 'night';

-- Reset Overachiever - delete completed objectives
DELETE FROM weekly_objectives
WHERE wallet_address = '0x50b39b127236f46a'
AND completed = true;

-- Also reset Room 7 key
DELETE FROM paradise_motel_room7_keys
WHERE wallet_address = '0x50b39b127236f46a';

-- Verify reset
SELECT 'Room 7 night visits:' as check, COUNT(*) as count 
FROM paradise_motel_room7_visits 
WHERE wallet_address = '0x50b39b127236f46a' AND visit_type = 'night'
UNION ALL
SELECT 'Completed objectives:', COUNT(*) 
FROM weekly_objectives
WHERE wallet_address = '0x50b39b127236f46a' AND completed = true
UNION ALL
SELECT 'Room 7 keys:', COUNT(*)
FROM paradise_motel_room7_keys
WHERE wallet_address = '0x50b39b127236f46a';
