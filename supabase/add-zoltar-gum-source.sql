-- Add Zoltar Fortune Machine Gum Source
-- This ensures that Zoltar winnings are properly tracked in the gum system

-- Insert Zoltar gum source for winnings
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description) 
VALUES ('zoltar_fortune_machine_win', 250, 0, 999, 'Winnings from Mystical Zoltar fortune machine (1/30 chance)')
ON CONFLICT (source_name) 
DO UPDATE SET 
  base_reward = 250,
  cooldown_minutes = 0,
  daily_limit = 999,
  description = 'Winnings from Mystical Zoltar fortune machine (1/30 chance)',
  updated_at = CURRENT_TIMESTAMP;

-- Also add the Zoltar play cost source (for tracking spending)
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description) 
VALUES ('zoltar_fortune_machine', -10, 0, 999, 'Cost to play Mystical Zoltar fortune machine')
ON CONFLICT (source_name) 
DO UPDATE SET 
  base_reward = -10,
  cooldown_minutes = 0,
  daily_limit = 999,
  description = 'Cost to play Mystical Zoltar fortune machine',
  updated_at = CURRENT_TIMESTAMP;

-- Verify the Zoltar sources were added
SELECT source_name, base_reward, cooldown_minutes, daily_limit, description, created_at, updated_at 
FROM gum_sources 
WHERE source_name LIKE '%zoltar%'
ORDER BY source_name;

-- Check recent Zoltar transactions (if any exist)
SELECT 
  wallet_address,
  amount,
  source,
  metadata,
  created_at
FROM user_gum_transactions
WHERE source LIKE '%zoltar%'
ORDER BY created_at DESC
LIMIT 10;
