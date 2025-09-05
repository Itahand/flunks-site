-- Create table for tracking Friday Night Lights button clicks
CREATE TABLE IF NOT EXISTS friday_night_lights_clicks (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster wallet address lookups
CREATE INDEX IF NOT EXISTS idx_friday_night_lights_wallet_address ON friday_night_lights_clicks(wallet_address);

-- Add some helpful comments
COMMENT ON TABLE friday_night_lights_clicks IS 'Tracks when users click the Friday Night Lights button on the football field';
COMMENT ON COLUMN friday_night_lights_clicks.wallet_address IS 'Flow wallet address of the user who clicked the button';
COMMENT ON COLUMN friday_night_lights_clicks.clicked_at IS 'Timestamp when the button was clicked';

-- Show success message
SELECT 'Friday Night Lights tracking table created successfully!' as status;
