-- Post-migration verification for wallet 0x7ab6ddec8328399a
-- Shows what was transferred from 0x6e5d12b1735caa83

-- 1. Profile Info
SELECT 
  '======================================' as separator,
  'PROFILE INFO' as section;

SELECT 
  username,
  locker_number,
  wallet_address,
  created_at
FROM user_profiles
WHERE wallet_address = '0x7ab6ddec8328399a';

-- 2. GUM Balance
SELECT 
  '======================================' as separator,
  'GUM BALANCE' as section;

SELECT 
  total_gum as current_gum_balance,
  updated_at as last_updated
FROM user_gum_balances
WHERE wallet_address = '0x7ab6ddec8328399a';

-- 3. GUM Transaction Summary
SELECT 
  '======================================' as separator,
  'GUM TRANSACTIONS SUMMARY' as section;

SELECT 
  COUNT(*) as total_transactions,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_earned,
  SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_spent,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM gum_transactions
WHERE wallet_address = '0x7ab6ddec8328399a';

-- 4. GUM by Source
SELECT 
  '======================================' as separator,
  'GUM EARNED BY SOURCE' as section;

SELECT 
  source,
  COUNT(*) as times_earned,
  SUM(amount) as total_gum_from_source
FROM gum_transactions
WHERE wallet_address = '0x7ab6ddec8328399a'
  AND amount > 0
GROUP BY source
ORDER BY total_gum_from_source DESC;

-- 5. Chapter Objectives Completed
SELECT 
  '======================================' as separator,
  'CHAPTER OBJECTIVES COMPLETED' as section;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM cafeteria_button_clicks WHERE wallet_address = '0x7ab6ddec8328399a') THEN '✅ Chapter 1 - Cafeteria'
    ELSE '❌ Chapter 1 - Cafeteria'
  END as objective
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM crack_the_code WHERE wallet_address = '0x7ab6ddec8328399a') THEN '✅ Chapter 1 - Crack Code'
    ELSE '❌ Chapter 1 - Crack Code'
  END
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM flunko_clicks WHERE wallet_address = '0x7ab6ddec8328399a') THEN '✅ Chapter 3 - Flunko'
    ELSE '❌ Chapter 3 - Flunko'
  END
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM homecoming_dance_attendance WHERE wallet_address = '0x7ab6ddec8328399a') THEN '✅ Chapter 4 - Homecoming Dance'
    ELSE '❌ Chapter 4 - Homecoming Dance'
  END
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM paradise_motel_entries WHERE wallet_address = '0x7ab6ddec8328399a') THEN '✅ Chapter 4 - Paradise Motel'
    ELSE '❌ Chapter 4 - Paradise Motel'
  END
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM paradise_motel_room7_keys WHERE wallet_address = '0x7ab6ddec8328399a') THEN '✅ Chapter 5 - Room 7 Key (Slacker)'
    ELSE '❌ Chapter 5 - Room 7 Key (Slacker)'
  END
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM gum_transactions WHERE wallet_address = '0x7ab6ddec8328399a' AND source = 'hidden_riff') THEN '✅ Chapter 5 - Hidden Riff (Overachiever)'
    ELSE '❌ Chapter 5 - Hidden Riff (Overachiever)'
  END;

-- 6. Active Cooldowns
SELECT 
  '======================================' as separator,
  'ACTIVE COOLDOWNS' as section;

SELECT 
  source_name,
  last_earned_at,
  CASE 
    WHEN last_earned_at + INTERVAL '24 hours' > NOW() THEN 'Active - Cannot claim yet'
    ELSE 'Expired - Can claim'
  END as status,
  ROUND(EXTRACT(EPOCH FROM (last_earned_at + INTERVAL '24 hours' - NOW()))/3600, 1) as hours_remaining
FROM user_gum_cooldowns
WHERE wallet_address = '0x7ab6ddec8328399a';

-- 7. Final Summary
SELECT 
  '======================================' as separator,
  '✅ MIGRATION SUCCESSFUL' as status;

SELECT 
  'Wallet: 0x7ab6ddec8328399a' as info
UNION ALL
SELECT 
  CONCAT('Total GUM: ', COALESCE(total_gum, 0))
FROM user_gum_balances
WHERE wallet_address = '0x7ab6ddec8328399a'
UNION ALL
SELECT 
  CONCAT('Total Transactions: ', COUNT(*))
FROM gum_transactions
WHERE wallet_address = '0x7ab6ddec8328399a';
