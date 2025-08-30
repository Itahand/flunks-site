-- Add arcade snack section gum source
-- This allows users to get 20 gum once per day (24 hour cooldown) from the arcade snack section

INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active)
VALUES ('arcade_snack', 20, 1440, 1, 'Daily gum reward from visiting the arcade snack section', true)
ON CONFLICT (source_name) DO UPDATE SET
    base_reward = 20,
    cooldown_minutes = 1440,  -- 24 hours = 1440 minutes
    daily_limit = 1,
    description = 'Daily gum reward from visiting the arcade snack section',
    is_active = true,
    updated_at = NOW();
