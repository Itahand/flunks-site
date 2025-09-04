-- Add footballer_flunk_bonus gum source
-- This enables the one-time 100 GUM reward for Footballer Flunk NFT holders

INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active) 
VALUES ('footballer_flunk_bonus', 100, 0, 1, 'One-time 100 GUM bonus for owning Footballer Flunk NFT (Home or Away)', true)
ON CONFLICT (source_name) DO UPDATE SET
  base_reward = EXCLUDED.base_reward,
  cooldown_minutes = EXCLUDED.cooldown_minutes,
  daily_limit = EXCLUDED.daily_limit,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;

-- Verify the source was added
SELECT * FROM gum_sources WHERE source_name = 'footballer_flunk_bonus';
