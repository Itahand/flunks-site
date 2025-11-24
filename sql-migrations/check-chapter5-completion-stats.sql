-- Check Chapter 5 completion stats
-- Slacker: Room 7 key (paradise_motel_room7_keys)
-- Overachiever: Hidden Riff (gum_transactions with source = 'hidden_riff')

-- 1. Count users who completed SLACKER (have Room 7 key)
SELECT COUNT(DISTINCT wallet_address) as slacker_completions
FROM paradise_motel_room7_keys;

-- 2. Count users who completed OVERACHIEVER (found hidden riff)
SELECT COUNT(DISTINCT wallet_address) as overachiever_completions
FROM gum_transactions
WHERE source = 'hidden_riff';

-- 3. Count users who completed BOTH objectives
SELECT COUNT(DISTINCT k.wallet_address) as both_objectives_completed
FROM paradise_motel_room7_keys k
INNER JOIN gum_transactions g ON k.wallet_address = g.wallet_address
WHERE g.source = 'hidden_riff';

-- 4. Show breakdown
SELECT 
  'Total Slacker (Room 7 Key)' as objective,
  COUNT(DISTINCT wallet_address) as completions
FROM paradise_motel_room7_keys
UNION ALL
SELECT 
  'Total Overachiever (Hidden Riff)' as objective,
  COUNT(DISTINCT wallet_address) as completions
FROM gum_transactions
WHERE source = 'hidden_riff'
UNION ALL
SELECT 
  'Both Objectives Complete' as objective,
  COUNT(DISTINCT k.wallet_address) as completions
FROM paradise_motel_room7_keys k
INNER JOIN gum_transactions g ON k.wallet_address = g.wallet_address
WHERE g.source = 'hidden_riff';

-- 5. List users who completed BOTH (for verification)
SELECT 
  k.wallet_address,
  k.obtained_at as room7_key_date,
  g.created_at as hidden_riff_date
FROM paradise_motel_room7_keys k
INNER JOIN gum_transactions g ON k.wallet_address = g.wallet_address
WHERE g.source = 'hidden_riff'
ORDER BY k.obtained_at DESC;
