-- Create digital lock claims tracking table
CREATE TABLE IF NOT EXISTS digital_lock_claims (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  successfully_unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_digital_lock_claims_wallet_address ON digital_lock_claims(wallet_address);
CREATE INDEX IF NOT EXISTS idx_digital_lock_claims_wallet_success ON digital_lock_claims(wallet_address, successfully_unlocked);
CREATE INDEX IF NOT EXISTS idx_digital_lock_claims_unlocked_at ON digital_lock_claims(unlocked_at);

-- Add some helpful comments
COMMENT ON TABLE digital_lock_claims IS 'Track which wallets have successfully unlocked the digital lock (0730 code) to prevent farming';
COMMENT ON COLUMN digital_lock_claims.wallet_address IS 'The wallet address that unlocked the lock';
COMMENT ON COLUMN digital_lock_claims.successfully_unlocked IS 'Whether this was a successful unlock (should always be true for records in this table)';
COMMENT ON COLUMN digital_lock_claims.unlocked_at IS 'When the lock was successfully unlocked';

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT ON digital_lock_claims TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE digital_lock_claims_id_seq TO your_app_user;
