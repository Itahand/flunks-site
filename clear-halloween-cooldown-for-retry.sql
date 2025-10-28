-- Clear Halloween GumDrop cooldown for wallet 0xaf4c98dc8d1d0698 to allow retry

-- Delete the cooldown record (allows immediate re-claim)
DELETE FROM user_gum_cooldowns
WHERE wallet_address = '0xaf4c98dc8d1d0698'
AND source_name = 'HALLOWEEN_GUMDROP';

-- Delete the previous claim transaction
DELETE FROM user_gum_transactions
WHERE wallet_address = '0xaf4c98dc8d1d0698'
AND source = 'HALLOWEEN_GUMDROP';

-- Reset GUM balance (subtract the 100 that was awarded)
UPDATE user_gum_balances
SET total_gum = GREATEST(0, total_gum - 100)
WHERE wallet_address = '0xaf4c98dc8d1d0698';

-- Verify the changes
SELECT 
  p.wallet_address, 
  p.username, 
  b.total_gum as gum_balance, 
  p.timezone_offset
FROM user_profiles p
LEFT JOIN user_gum_balances b ON p.wallet_address = b.wallet_address
WHERE p.wallet_address = '0xaf4c98dc8d1d0698';
