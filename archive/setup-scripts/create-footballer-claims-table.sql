-- Create footballer_gum_claims table for tracking one-time GUM rewards
-- This table ensures each wallet can only claim the footballer bonus once

CREATE TABLE IF NOT EXISTS footballer_gum_claims (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL UNIQUE,
    gum_awarded INTEGER NOT NULL DEFAULT 100,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gum_transaction_successful BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast wallet lookups
CREATE INDEX IF NOT EXISTS idx_footballer_claims_wallet 
ON footballer_gum_claims(wallet_address);

-- Add comment explaining the table's purpose
COMMENT ON TABLE footballer_gum_claims IS 'Tracks one-time GUM rewards for wallets holding Footballer Flunk NFTs (Home or Away variants)';
COMMENT ON COLUMN footballer_gum_claims.wallet_address IS 'Flow wallet address that claimed the reward';
COMMENT ON COLUMN footballer_gum_claims.gum_awarded IS 'Amount of GUM awarded (default 100)';
COMMENT ON COLUMN footballer_gum_claims.gum_transaction_successful IS 'Whether the GUM transaction completed successfully';
COMMENT ON COLUMN footballer_gum_claims.claimed_at IS 'When the user clicked the claim button';
