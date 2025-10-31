-- Add HALLOWEEN_GUMDROP source to gum_sources table
-- This enables the awardGum() utility to handle Halloween claims properly

INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, is_active)
VALUES ('HALLOWEEN_GUMDROP', 100, 4320, 1, true)
ON CONFLICT (source_name) DO UPDATE SET
  base_reward = 100,
  cooldown_minutes = 4320,  -- 72 hours (3 days)
  daily_limit = 1,
  is_active = true;

-- Explanation:
-- source_name: 'HALLOWEEN_GUMDROP' matches the API call
-- base_reward: 100 GUM flat reward
-- cooldown_minutes: 4320 = 72 hours (matches blockchain drop window)
-- daily_limit: 1 claim per user
-- is_active: true (event is active)
