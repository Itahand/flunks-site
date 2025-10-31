-- Clear Halloween GumDrop cooldown for wallet 0xe327216d843357f1
-- This allows re-testing the Halloween pumpkin button claim

DELETE FROM gum_transactions 
WHERE wallet_address = '0xe327216d843357f1' 
AND source = 'halloween_pumpkin_button';

-- Verify deletion
SELECT 'Halloween claims deleted:' as result, COUNT(*) as count
FROM gum_transactions
WHERE wallet_address = '0xe327216d843357f1'
AND source = 'halloween_pumpkin_button';
