-- Debug Room 7 API 500 error
-- Check table structure and data

-- 1. Verify table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'paradise_motel_room7_keys'
) as table_exists;

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'paradise_motel_room7_keys'
ORDER BY ordinal_position;

-- 3. Check if wallet has any record
SELECT *
FROM paradise_motel_room7_keys
WHERE wallet_address = '0x807c3d470888cc48';

-- 4. Check if OLD wallet had any record (before transfer)
SELECT *
FROM paradise_motel_room7_keys
WHERE wallet_address = '0xbfffec679fff3a94';

-- 5. Count all records in table
SELECT COUNT(*) as total_keys
FROM paradise_motel_room7_keys;

-- 6. Show sample records
SELECT wallet_address, obtained_at
FROM paradise_motel_room7_keys
ORDER BY obtained_at DESC
LIMIT 5;
