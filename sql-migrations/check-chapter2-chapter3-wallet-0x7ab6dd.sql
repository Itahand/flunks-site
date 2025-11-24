-- Check Chapter 2 and Chapter 3 completion for wallet 0x7ab6ddec8328399a

-- Chapter 2 Mission 1: Friday Night Lights (Slacker)
-- Tracked in: friday_night_lights_clicks table
SELECT 
  '======================================' as separator,
  'CHAPTER 2 - MISSION 1 (SLACKER)' as section,
  'Friday Night Lights Button Click' as objective;

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM friday_night_lights_clicks 
      WHERE wallet_address = '0x7ab6ddec8328399a'
    ) THEN '✅ COMPLETED'
    ELSE '❌ NOT COMPLETED'
  END as status;

SELECT 
  wallet_address,
  clicked_at,
  created_at
FROM friday_night_lights_clicks
WHERE wallet_address = '0x7ab6ddec8328399a';

-- Chapter 3 Mission 1: Picture Day Voting (Slacker)  
-- Tracked in: picture_day_votes table
SELECT 
  '======================================' as separator,
  'CHAPTER 3 - MISSION 1 (SLACKER)' as section,
  'Vote in Picture Day' as objective;

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM picture_day_votes 
      WHERE user_wallet = '0x7ab6ddec8328399a'
    ) THEN '✅ COMPLETED'
    ELSE '❌ NOT COMPLETED'
  END as status;

SELECT 
  user_wallet,
  clique,
  candidate_id,
  created_at
FROM picture_day_votes
WHERE user_wallet = '0x7ab6ddec8328399a'
LIMIT 5;

-- Check if OLD wallet completed these
SELECT 
  '======================================' as separator,
  'OLD WALLET CHECK (0x6e5d12b1735caa83)' as section;

-- Chapter 2 for old wallet
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM friday_night_lights_clicks 
      WHERE wallet_address = '0x6e5d12b1735caa83'
    ) THEN '✅ Old wallet HAD Chapter 2 data'
    ELSE '❌ Old wallet MISSING Chapter 2 data'
  END as chapter2_old_status;

-- Chapter 3 for old wallet
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM picture_day_votes 
      WHERE user_wallet = '0x6e5d12b1735caa83'
    ) THEN '✅ Old wallet HAD Chapter 3 data'
    ELSE '❌ Old wallet MISSING Chapter 3 data'
  END as chapter3_old_status;
