-- Create Semester Zero allowlist table
-- This table stores wallet addresses that are allowed to setup Chapter 5 collections

CREATE TABLE IF NOT EXISTS semester_zero_allowlist (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  added_by VARCHAR(100) NOT NULL DEFAULT 'admin',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_semester_zero_allowlist_wallet 
ON semester_zero_allowlist(wallet_address);

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_semester_zero_allowlist_added_at 
ON semester_zero_allowlist(added_at DESC);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE semester_zero_allowlist ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users to check their own status
CREATE POLICY "Allow users to check their own allowlist status" 
ON semester_zero_allowlist 
FOR SELECT 
USING (true); -- Allow all reads since we'll handle auth in API

-- Only allow admin operations through API (no direct inserts/updates)
CREATE POLICY "Restrict direct modifications" 
ON semester_zero_allowlist 
FOR ALL 
USING (false);

-- Add comments for documentation
COMMENT ON TABLE semester_zero_allowlist IS 'Stores wallet addresses allowed to setup Semester Zero Chapter 5 NFT collections';
COMMENT ON COLUMN semester_zero_allowlist.wallet_address IS 'Flow wallet address (lowercase)';
COMMENT ON COLUMN semester_zero_allowlist.added_by IS 'Admin username who added this address';
COMMENT ON COLUMN semester_zero_allowlist.reason IS 'Reason for adding to allowlist';