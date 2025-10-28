-- Check Chapter 5 NFT Airdrop Eligibility
-- Identifies users who have completed Slacker and/or Overachiever objectives

-- =============================================
-- SLACKER COMPLETION (Paradise Motel Room 7)
-- =============================================
-- Users who visited Room 7 at night
SELECT 
  'SLACKER' as completion_type,
  r7.wallet_address,
  p.username,
  r7.visited_at as completion_time,
  'Visited Room 7 at night' as achievement
FROM paradise_motel_room7_visits r7
LEFT JOIN user_profiles p ON r7.wallet_address = p.wallet_address
WHERE r7.visit_type = 'night'
ORDER BY r7.visited_at DESC;

-- =============================================
-- OVERACHIEVER COMPLETION (Hidden Riff)
-- =============================================
-- Users who completed the Hidden Riff guitar game
SELECT 
  'OVERACHIEVER' as completion_type,
  gt.wallet_address,
  p.username,
  gt.created_at as completion_time,
  'Completed Hidden Riff guitar game' as achievement
FROM gum_transactions gt
LEFT JOIN user_profiles p ON gt.wallet_address = p.wallet_address
WHERE gt.source = 'hidden_riff'
ORDER BY gt.created_at DESC;

-- =============================================
-- FULL COMPLETION (Both Slacker + Overachiever)
-- =============================================
-- Users eligible for BOTH NFTs
SELECT 
  'FULL_COMPLETION' as completion_type,
  slacker.wallet_address,
  p.username,
  slacker.visited_at as slacker_completed,
  overachiever.created_at as overachiever_completed,
  'Eligible for BOTH Chapter 5 NFTs' as status
FROM paradise_motel_room7_visits slacker
INNER JOIN gum_transactions overachiever 
  ON slacker.wallet_address = overachiever.wallet_address 
  AND overachiever.source = 'hidden_riff'
LEFT JOIN user_profiles p ON slacker.wallet_address = p.wallet_address
WHERE slacker.visit_type = 'night'
ORDER BY slacker.visited_at DESC;

-- =============================================
-- SUMMARY COUNTS
-- =============================================
SELECT 
  'SUMMARY' as report_type,
  (SELECT COUNT(DISTINCT wallet_address) 
   FROM paradise_motel_room7_visits 
   WHERE visit_type = 'night') as slacker_count,
  (SELECT COUNT(DISTINCT wallet_address) 
   FROM gum_transactions 
   WHERE source = 'hidden_riff') as overachiever_count,
  (SELECT COUNT(DISTINCT slacker.wallet_address)
   FROM paradise_motel_room7_visits slacker
   INNER JOIN gum_transactions overachiever 
     ON slacker.wallet_address = overachiever.wallet_address 
     AND overachiever.source = 'hidden_riff'
   WHERE slacker.visit_type = 'night') as full_completion_count;
