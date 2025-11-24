-- Fix missing Chapter 2 & 3 data transfer
-- Transfer friday_night_lights_clicks and picture_day_votes
-- Old: 0x6e5d12b1735caa83
-- New: 0x7ab6ddec8328399a
-- Date: 2025-11-23

BEGIN;

-- 1. Delete any existing data in new wallet (if any)
DELETE FROM friday_night_lights_clicks WHERE wallet_address = '0x7ab6ddec8328399a';
DELETE FROM picture_day_votes WHERE user_wallet = '0x7ab6ddec8328399a';

-- 2. Update Chapter 2: Friday Night Lights
UPDATE friday_night_lights_clicks 
SET wallet_address = '0x7ab6ddec8328399a'
WHERE wallet_address = '0x6e5d12b1735caa83';

-- 3. Update Chapter 3: Picture Day Votes
UPDATE picture_day_votes 
SET user_wallet = '0x7ab6ddec8328399a'
WHERE user_wallet = '0x6e5d12b1735caa83';

-- Verification
SELECT 
  '======================================' as summary,
  'TRANSFER COMPLETE' as status;

-- Show Chapter 2 status
SELECT 
  'Chapter 2 - Friday Night Lights' as objective,
  CASE 
    WHEN EXISTS (SELECT 1 FROM friday_night_lights_clicks WHERE wallet_address = '0x7ab6ddec8328399a')
    THEN '✅ TRANSFERRED'
    ELSE '❌ NOT FOUND'
  END as status;

-- Show Chapter 3 status  
SELECT 
  'Chapter 3 - Picture Day Voting' as objective,
  CASE 
    WHEN EXISTS (SELECT 1 FROM picture_day_votes WHERE user_wallet = '0x7ab6ddec8328399a')
    THEN '✅ TRANSFERRED'
    ELSE '❌ NOT FOUND'
  END as status;

COMMIT;
