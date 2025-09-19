-- Create repeat_offender_claims table to track 24-hour cooldown claims
-- This should be run in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS repeat_offender_claims (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for efficient wallet address lookups
CREATE INDEX IF NOT EXISTS idx_repeat_offender_claims_wallet_address 
ON repeat_offender_claims(wallet_address);

-- Create index for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_repeat_offender_claims_claimed_at 
ON repeat_offender_claims(claimed_at DESC);

-- Add row level security (RLS) if needed
-- ALTER TABLE repeat_offender_claims ENABLE ROW LEVEL SECURITY;

-- Optional: Add a policy to allow users to only see their own claims
-- CREATE POLICY "Users can view own claims" ON repeat_offender_claims
--     FOR SELECT USING (auth.uid()::text = wallet_address);

-- Comment explaining the table purpose
COMMENT ON TABLE repeat_offender_claims IS 
'Tracks repeat offender claims for users who have already claimed Friday Night Lights. Allows one claim per wallet every 24 hours, awarding 50 GUM each time.';