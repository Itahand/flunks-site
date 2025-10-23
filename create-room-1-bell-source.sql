-- Add Lobby Bell GUM source to the database
-- This allows users to claim 100 GUM once per 24 hours after ringing the bell 10 times

INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active)
VALUES ('lobby_bell', 100, 1440, 1, 'Ring the lobby bell 10 times at Paradise Motel to claim 100 GUM', true)
ON CONFLICT (source_name) DO UPDATE SET
  base_reward = 100,
  cooldown_minutes = 1440,  -- 24 hours
  daily_limit = 1,
  description = 'Ring the lobby bell 10 times at Paradise Motel to claim 100 GUM',
  is_active = true;
