-- Verify and fix Zoltar GUM sources
-- Run this to ensure winners get their 250 GUM

-- 1. Check current Zoltar sources
SELECT 
  source_name,
  base_reward,
  cooldown_minutes,
  daily_limit,
  is_active,
  created_at,
  updated_at
FROM gum_sources
WHERE source_name LIKE '%zoltar%'
ORDER BY source_name;

-- 2. Ensure Zoltar win source exists with correct configuration
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active) 
VALUES (
  'zoltar_fortune_machine_win',
  250,                    -- 250 GUM reward
  0,                      -- No cooldown (can win multiple times if lucky)
  999,                    -- High daily limit (essentially unlimited)
  'Winnings from Mystical Zoltar fortune machine (1/30 chance)',
  true                    -- Active
)
ON CONFLICT (source_name) 
DO UPDATE SET 
  base_reward = 250,
  cooldown_minutes = 0,
  daily_limit = 999,
  is_active = true,
  description = 'Winnings from Mystical Zoltar fortune machine (1/30 chance)',
  updated_at = CURRENT_TIMESTAMP;

-- 3. Ensure Zoltar play cost source exists
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active) 
VALUES (
  'zoltar_fortune_machine',
  -10,                    -- Costs 10 GUM to play
  0,                      -- No cooldown (can play repeatedly)
  999,                    -- High daily limit
  'Cost to play Mystical Zoltar fortune machine',
  true                    -- Active
)
ON CONFLICT (source_name) 
DO UPDATE SET 
  base_reward = -10,
  cooldown_minutes = 0,
  daily_limit = 999,
  is_active = true,
  description = 'Cost to play Mystical Zoltar fortune machine',
  updated_at = CURRENT_TIMESTAMP;

-- 4. Check recent Zoltar transactions to see if winners got paid
SELECT 
  wallet_address,
  transaction_type,
  amount,
  source,
  description,
  created_at
FROM user_gum_transactions
WHERE source LIKE '%zoltar%'
ORDER BY created_at DESC
LIMIT 20;

-- 5. Check win/loss ratio
SELECT 
  source,
  COUNT(*) as transaction_count,
  SUM(amount) as total_gum_amount
FROM user_gum_transactions
WHERE source LIKE '%zoltar%'
GROUP BY source
ORDER BY source;

-- 6. Find any users who won but didn't receive GUM (debugging)
WITH zoltar_plays AS (
  SELECT DISTINCT wallet_address
  FROM user_gum_transactions
  WHERE source = 'zoltar_fortune_machine'
),
zoltar_wins AS (
  SELECT DISTINCT wallet_address
  FROM user_gum_transactions
  WHERE source = 'zoltar_fortune_machine_win'
)
SELECT 
  p.wallet_address,
  CASE 
    WHEN w.wallet_address IS NOT NULL THEN 'Has wins ✅'
    ELSE 'No wins recorded ⚠️'
  END as status
FROM zoltar_plays p
LEFT JOIN zoltar_wins w ON p.wallet_address = w.wallet_address
ORDER BY status DESC;

-- 7. Manually award 250 GUM to any winner who was missed (if needed)
-- UNCOMMENT AND REPLACE WALLET ADDRESS IF YOU FIND SOMEONE WHO WON BUT DIDN'T GET PAID:
-- 
-- SELECT award_gum(
--   '0xWALLET_ADDRESS_HERE',
--   'zoltar_fortune_machine_win',
--   '{"reason": "Manual correction for missed payout", "admin": true}'::jsonb
-- );
