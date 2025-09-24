-- Add Chapter 3 Overachiever gum source for clicking Flunko's profile
-- This allows users to earn 100 GUM by clicking Flunko from any clique's top 6 friends

INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active) 
VALUES ('chapter3_overachiever', 100, 0, 0, 'One-time only gum reward from discovering Flunko in any cliques top 6 friends and clicking his profile', true)
ON CONFLICT (source_name) DO UPDATE SET
  base_reward = EXCLUDED.base_reward,
  cooldown_minutes = EXCLUDED.cooldown_minutes,
  daily_limit = EXCLUDED.daily_limit,
  description = EXCLUDED.description,
  updated_at = CURRENT_TIMESTAMP;

-- Show the result
SELECT 
  source_name,
  base_reward,
  cooldown_minutes,
  daily_limit,
  description
FROM gum_sources 
WHERE source_name = 'chapter3_overachiever';