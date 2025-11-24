-- Verify Chapter 2 data for old wallet 0x6e5d12b1735caa83

SELECT 
  'Checking old wallet for Friday Night Lights click' as check_type;

-- Check if old wallet has Chapter 2 data
SELECT 
  wallet_address,
  clicked_at,
  created_at
FROM friday_night_lights_clicks
WHERE wallet_address = '0x6e5d12b1735caa83';

-- Summary
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM friday_night_lights_clicks 
      WHERE wallet_address = '0x6e5d12b1735caa83'
    ) THEN '✅ OLD WALLET HAS CHAPTER 2 DATA - NEEDS TRANSFER'
    ELSE '❌ OLD WALLET NEVER COMPLETED CHAPTER 2'
  END as result;
