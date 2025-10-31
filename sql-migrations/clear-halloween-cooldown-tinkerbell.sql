-- Clear Halloween GumDrop cooldown for testing wallet
-- This allows re-claiming the Halloween GumDrop for testing
-- Wallet: 0xe327216d843357f1

DELETE FROM user_gum_transactions
WHERE wallet_address = '0xe327216d843357f1'
AND source = 'HALLOWEEN_GUMDROP';

-- Verify deletion
SELECT * FROM user_gum_transactions
WHERE wallet_address = '0xe327216d843357f1'
AND source = 'HALLOWEEN_GUMDROP';

-- Should return 0 rows if successful
