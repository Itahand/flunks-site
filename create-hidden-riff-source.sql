-- Create GUM source for Hidden Riff achievement
-- Awards 100 GUM once per user for completing the guitar chord sequence

INSERT INTO gum_sources (
  source_name,
  base_reward,
  cooldown_minutes,
  daily_limit,
  description,
  is_active
) VALUES (
  'hidden_riff',
  100,
  NULL,  -- No cooldown - once per user ever
  NULL,  -- No daily limit - once per user ever
  'Complete the Hidden Riff guitar sequence (C, G, A, F) to unlock the Overachiever achievement',
  true
)
ON CONFLICT (source_name) 
DO UPDATE SET
  base_reward = EXCLUDED.base_reward,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;
