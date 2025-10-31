-- Add Lobby Bell GUM source to the database
-- This is a ONE-TIME ONLY claim - users can only claim once ever

INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, description, is_active)
VALUES ('lobby_bell', 100, 52560000, 1, 'Ring the lobby bell 10 times at Paradise Motel to claim 100 GUM (one-time only)', true)
ON CONFLICT (source_name) DO UPDATE SET
  base_reward = 100,
  cooldown_minutes = 52560000,  -- 100 years (effectively permanent)
  daily_limit = 1,
  description = 'Ring the lobby bell 10 times at Paradise Motel to claim 100 GUM (one-time only)',
  is_active = true;
