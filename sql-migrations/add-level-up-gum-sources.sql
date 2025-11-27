-- Add Level Up Evolution GUM sources
-- These track GUM spent on evolving Paradise Motel NFTs

-- Insert the main spend source for evolution
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, is_active, description)
VALUES 
  ('level_up_evolution', 0, 0, NULL, true, 'GUM spent to evolve Paradise Motel NFTs')
ON CONFLICT (source_name) DO UPDATE SET
  is_active = true,
  description = 'GUM spent to evolve Paradise Motel NFTs',
  updated_at = NOW();

-- Insert refund source (for failed transactions)
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, is_active, description)
VALUES 
  ('level_up_evolution_refund', 0, 0, NULL, true, 'GUM refunded when evolution fails')
ON CONFLICT (source_name) DO UPDATE SET
  is_active = true,
  description = 'GUM refunded when evolution fails',
  updated_at = NOW();

-- Insert failed refund source (for critical failures needing manual intervention)
INSERT INTO gum_sources (source_name, base_reward, cooldown_minutes, daily_limit, is_active, description)
VALUES 
  ('level_up_evolution_refund_failed', 0, 0, NULL, true, 'CRITICAL: GUM refund failed - needs manual intervention')
ON CONFLICT (source_name) DO UPDATE SET
  is_active = true,
  description = 'CRITICAL: GUM refund failed - needs manual intervention',
  updated_at = NOW();

-- Verify sources were added
SELECT source_name, base_reward, is_active, description 
FROM gum_sources 
WHERE source_name LIKE 'level_up%'
ORDER BY source_name;
