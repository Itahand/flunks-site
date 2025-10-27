-- Reset Chapter 5 objectives for test wallet 0x50b39b127236f46a
-- This allows re-testing the Halloween GumDrop flow

-- Reset Slacker (Room 7) completion
DELETE FROM chapter5_slacker_completions 
WHERE wallet_address = '0x50b39b127236f46a';

-- Reset Overachiever (Hidden Riff) completion  
DELETE FROM chapter5_overachiever_completions
WHERE wallet_address = '0x50b39b127236f46a';

-- Verify reset
SELECT 'Slacker completions:' as check, COUNT(*) as count 
FROM chapter5_slacker_completions 
WHERE wallet_address = '0x50b39b127236f46a'
UNION ALL
SELECT 'Overachiever completions:', COUNT(*) 
FROM chapter5_overachiever_completions
WHERE wallet_address = '0x50b39b127236f46a';
