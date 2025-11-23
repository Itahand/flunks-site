-- Check Room 7 key status for wallet 0x807c3d470888cc48
-- Run this in Supabase SQL Editor to verify the key exists

-- Check if key exists
SELECT 
  'Room 7 Key Status' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ KEY FOUND'
    ELSE '❌ KEY NOT FOUND'
  END as status,
  COUNT(*) as key_count,
  MAX(obtained_at) as obtained_at,
  MAX(created_at) as created_at
FROM paradise_motel_room7_keys
WHERE wallet_address = '0x807c3d470888cc48';

-- Show the actual key record if it exists
SELECT 
  id,
  wallet_address,
  obtained_at,
  created_at,
  updated_at
FROM paradise_motel_room7_keys
WHERE wallet_address = '0x807c3d470888cc48';

-- Also check old wallet (should be 0)
SELECT 
  'Old Wallet Check' as check_type,
  COUNT(*) as should_be_zero
FROM paradise_motel_room7_keys
WHERE wallet_address = '0xbfffec679fff3a94';
