-- Add Friday Night Lights as a GUM source
INSERT INTO gum_sources (
    source_name,
    base_reward,
    cooldown_minutes,
    daily_limit,
    description,
    is_active,
    created_at,
    updated_at
) VALUES (
    'friday_night_lights',
    50,
    NULL, -- No cooldown, can only be claimed once
    1, -- Max 1 earning per day (effectively once per user)
    'Click the Friday Night Lights button on the football field',
    true,
    NOW(),
    NOW()
) ON CONFLICT (source_name) DO UPDATE SET
    base_reward = EXCLUDED.base_reward,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Show success message
SELECT 'Friday Night Lights GUM source added successfully!' as status;
