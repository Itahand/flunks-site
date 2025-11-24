-- Transfer wallet address from old to new
-- Old: 0xecffd6718379ba44
-- New: 0x39bd8fa7414207cb
-- Date: 2025-11-24

BEGIN;

-- Store old and new addresses for safety
DO $$
DECLARE
  v_old_wallet TEXT := '0xecffd6718379ba44';
  v_new_wallet TEXT := '0x39bd8fa7414207cb';
  v_profile_count INTEGER;
  v_gum_balance BIGINT;
BEGIN
  -- Verify old wallet exists
  SELECT COUNT(*) INTO v_profile_count
  FROM user_profiles
  WHERE wallet_address = v_old_wallet;
  
  IF v_profile_count = 0 THEN
    RAISE EXCEPTION 'Old wallet address not found in user_profiles';
  END IF;
  
  -- Check if new wallet already exists (will be deleted if found)
  SELECT COUNT(*) INTO v_profile_count
  FROM user_profiles
  WHERE wallet_address = v_new_wallet;
  
  IF v_profile_count > 0 THEN
    RAISE NOTICE '⚠️  New wallet address already exists - will be replaced with old wallet data';
  END IF;
  
  -- Get current GUM balance for logging
  SELECT total_gum INTO v_gum_balance
  FROM user_gum_balances
  WHERE wallet_address = v_old_wallet;
  
  RAISE NOTICE '✅ Validation passed';
  RAISE NOTICE '   Old wallet: % (GUM balance: %)', v_old_wallet, COALESCE(v_gum_balance, 0);
  RAISE NOTICE '   New wallet: %', v_new_wallet;
END $$;

-- 1. Handle existing data in new wallet (if any exists, delete it first)
DELETE FROM user_gum_balances WHERE wallet_address = '0x39bd8fa7414207cb';
DELETE FROM gum_transactions WHERE wallet_address = '0x39bd8fa7414207cb';
DELETE FROM user_gum_cooldowns WHERE wallet_address = '0x39bd8fa7414207cb';
DELETE FROM user_profiles WHERE wallet_address = '0x39bd8fa7414207cb';

-- 2. Update the main profile (this updates locker_assignments view automatically)
UPDATE user_profiles 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

-- 3. Update GUM system tables (have foreign keys but no ON UPDATE CASCADE)
UPDATE user_gum_balances 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE gum_transactions 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE user_gum_cooldowns 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

-- 4. Delete any existing data in objective tables for new wallet (if tables exist)
DO $$
BEGIN
  DELETE FROM paradise_motel_room7_visits WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM crack_the_code WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM flunko_clicks WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM homecoming_dance_attendance WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM paradise_motel_entries WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM paradise_motel_room7_keys WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM cafeteria_button_clicks WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM friday_night_lights_clicks WHERE wallet_address = '0x39bd8fa7414207cb';
  DELETE FROM picture_day_votes WHERE user_wallet = '0x39bd8fa7414207cb';
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'flow_drawing_entries') THEN
    DELETE FROM flow_drawing_entries WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'digital_lock_attempts') THEN
    DELETE FROM digital_lock_attempts WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'terminal_activities') THEN
    DELETE FROM terminal_activities WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'magic_carpet_logs') THEN
    DELETE FROM magic_carpet_logs WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'flow_logs') THEN
    DELETE FROM flow_logs WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'semester_zero_allowlist') THEN
    DELETE FROM semester_zero_allowlist WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'weekly_objectives_completed') THEN
    DELETE FROM weekly_objectives_completed WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
    DELETE FROM chat_messages WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'feedback_reports') THEN
    DELETE FROM feedback_reports WHERE wallet_address = '0x39bd8fa7414207cb';
  END IF;
END $$;

-- 5. Update Chapter/Objective tracking tables
UPDATE paradise_motel_room7_visits 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE crack_the_code 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE flunko_clicks 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE homecoming_dance_attendance 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE paradise_motel_entries 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE paradise_motel_room7_keys 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE cafeteria_button_clicks 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE friday_night_lights_clicks 
SET wallet_address = '0x39bd8fa7414207cb'
WHERE wallet_address = '0xecffd6718379ba44';

UPDATE picture_day_votes 
SET user_wallet = '0x39bd8fa7414207cb'
WHERE user_wallet = '0xecffd6718379ba44';

-- 6. Update optional tracking tables (only if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'flow_drawing_entries') THEN
    UPDATE flow_drawing_entries 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'digital_lock_attempts') THEN
    UPDATE digital_lock_attempts 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'terminal_activities') THEN
    UPDATE terminal_activities 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'magic_carpet_logs') THEN
    UPDATE magic_carpet_logs 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'flow_logs') THEN
    UPDATE flow_logs 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'semester_zero_allowlist') THEN
    UPDATE semester_zero_allowlist 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'weekly_objectives_completed') THEN
    UPDATE weekly_objectives_completed 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
    UPDATE chat_messages 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'feedback_reports') THEN
    UPDATE feedback_reports 
    SET wallet_address = '0x39bd8fa7414207cb'
    WHERE wallet_address = '0xecffd6718379ba44';
  END IF;
END $$;

-- Show summary of changes
DO $$
DECLARE
  v_new_wallet TEXT := '0x39bd8fa7414207cb';
  v_profile RECORD;
  v_gum_balance BIGINT;
  v_transaction_count INTEGER;
BEGIN
  -- Get profile info
  SELECT * INTO v_profile
  FROM user_profiles
  WHERE wallet_address = v_new_wallet;
  
  -- Get GUM info
  SELECT total_gum INTO v_gum_balance
  FROM user_gum_balances
  WHERE wallet_address = v_new_wallet;
  
  SELECT COUNT(*) INTO v_transaction_count
  FROM gum_transactions
  WHERE wallet_address = v_new_wallet;
  
  RAISE NOTICE '';
  RAISE NOTICE '======================================';
  RAISE NOTICE '✅ WALLET TRANSFER COMPLETE';
  RAISE NOTICE '======================================';
  RAISE NOTICE 'Username: %', v_profile.username;
  RAISE NOTICE 'Locker #: %', v_profile.locker_number;
  RAISE NOTICE 'New Wallet: %', v_new_wallet;
  RAISE NOTICE 'GUM Balance: %', COALESCE(v_gum_balance, 0);
  RAISE NOTICE 'GUM Transactions: %', v_transaction_count;
  RAISE NOTICE '======================================';
END $$;

COMMIT;

-- Verify the transfer
SELECT 
  'Verification: Profile transferred successfully' as status,
  username,
  locker_number,
  wallet_address as new_wallet_address,
  created_at,
  updated_at
FROM user_profiles
WHERE wallet_address = '0x39bd8fa7414207cb';
