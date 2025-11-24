-- Pre-migration check for wallet 0x6e5d12b1735caa83
-- Shows what will be transferred to 0x7ab6ddec8328399a

-- 1. Profile Info
SELECT 
  'PROFILE INFO' as section,
  username,
  locker_number,
  wallet_address,
  created_at
FROM user_profiles
WHERE wallet_address = '0x6e5d12b1735caa83';

-- 2. GUM Balance
SELECT 
  'GUM BALANCE' as section,
  total_gum,
  last_updated
FROM user_gum_balances
WHERE wallet_address = '0x6e5d12b1735caa83';

-- 3. GUM Transaction History
SELECT 
  'GUM TRANSACTIONS' as section,
  COUNT(*) as total_transactions,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_earned,
  SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as total_spent,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM gum_transactions
WHERE wallet_address = '0x6e5d12b1735caa83';

-- 4. GUM Sources Breakdown
SELECT 
  'GUM BY SOURCE' as section,
  source,
  COUNT(*) as count,
  SUM(amount) as total_gum
FROM gum_transactions
WHERE wallet_address = '0x6e5d12b1735caa83'
GROUP BY source
ORDER BY total_gum DESC;

-- 5. Chapter Progress
SELECT 
  'CHAPTER PROGRESS' as section,
  CASE 
    WHEN EXISTS (SELECT 1 FROM cafeteria_button_clicks WHERE wallet_address = '0x6e5d12b1735caa83') THEN '✅'
    ELSE '❌'
  END as chapter1_cafeteria,
  CASE 
    WHEN EXISTS (SELECT 1 FROM crack_the_code WHERE wallet_address = '0x6e5d12b1735caa83') THEN '✅'
    ELSE '❌'
  END as chapter1_code,
  CASE 
    WHEN EXISTS (SELECT 1 FROM flunko_clicks WHERE wallet_address = '0x6e5d12b1735caa83') THEN '✅'
    ELSE '❌'
  END as chapter3_flunko,
  CASE 
    WHEN EXISTS (SELECT 1 FROM homecoming_dance_attendance WHERE wallet_address = '0x6e5d12b1735caa83') THEN '✅'
    ELSE '❌'
  END as chapter4_dance,
  CASE 
    WHEN EXISTS (SELECT 1 FROM paradise_motel_entries WHERE wallet_address = '0x6e5d12b1735caa83') THEN '✅'
    ELSE '❌'
  END as chapter4_paradise,
  CASE 
    WHEN EXISTS (SELECT 1 FROM paradise_motel_room7_keys WHERE wallet_address = '0x6e5d12b1735caa83') THEN '✅'
    ELSE '❌'
  END as chapter5_room7_key,
  CASE 
    WHEN EXISTS (SELECT 1 FROM gum_transactions WHERE wallet_address = '0x6e5d12b1735caa83' AND source = 'hidden_riff') THEN '✅'
    ELSE '❌'
  END as chapter5_hidden_riff;

-- 6. Cooldowns Status
SELECT 
  'COOLDOWNS' as section,
  action_type,
  last_action_time,
  CASE 
    WHEN last_action_time + INTERVAL '24 hours' > NOW() THEN 'Active'
    ELSE 'Expired'
  END as cooldown_status,
  EXTRACT(EPOCH FROM (last_action_time + INTERVAL '24 hours' - NOW()))/3600 as hours_remaining
FROM user_gum_cooldowns
WHERE wallet_address = '0x6e5d12b1735caa83';

-- 7. Check if NEW wallet has any existing data (will be deleted)
SELECT 
  'NEW WALLET CHECK' as section,
  CASE 
    WHEN EXISTS (SELECT 1 FROM user_profiles WHERE wallet_address = '0x7ab6ddec8328399a') THEN 'EXISTS - WILL BE REPLACED'
    ELSE 'Empty - Ready'
  END as new_wallet_status;

-- 8. Summary
SELECT 
  '========================================' as summary,
  'READY TO MIGRATE' as status,
  '0x6e5d12b1735caa83 → 0x7ab6ddec8328399a' as transfer;
