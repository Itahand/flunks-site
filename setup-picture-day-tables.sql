-- Picture Day Voting System Tables

-- Table for candidates
CREATE TABLE IF NOT EXISTS picture_day_candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clique VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for votes
CREATE TABLE IF NOT EXISTS picture_day_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet VARCHAR(255) NOT NULL,
  clique VARCHAR(50) NOT NULL,
  candidate_id UUID REFERENCES picture_day_candidates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- Removed UNIQUE constraint to allow multiple votes per user per clique
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_picture_day_candidates_clique ON picture_day_candidates(clique);
CREATE INDEX IF NOT EXISTS idx_picture_day_votes_clique ON picture_day_votes(clique);
CREATE INDEX IF NOT EXISTS idx_picture_day_votes_candidate ON picture_day_votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_picture_day_votes_user ON picture_day_votes(user_wallet);

-- RLS Policies
ALTER TABLE picture_day_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE picture_day_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Allow read access to candidates" ON picture_day_candidates;
DROP POLICY IF EXISTS "Allow read access to votes" ON picture_day_votes;
DROP POLICY IF EXISTS "Allow users to vote" ON picture_day_votes;
DROP POLICY IF EXISTS "Prevent vote updates" ON picture_day_votes;
DROP POLICY IF EXISTS "Prevent vote deletes" ON picture_day_votes;

-- Allow read access to candidates for everyone
CREATE POLICY "Allow read access to candidates" ON picture_day_candidates
  FOR SELECT USING (true);

-- Allow read access to votes for everyone (for vote counting)
CREATE POLICY "Allow read access to votes" ON picture_day_votes
  FOR SELECT USING (true);

-- Allow users to insert their own votes
CREATE POLICY "Allow users to vote" ON picture_day_votes
  FOR INSERT WITH CHECK (true);

-- Prevent vote updates/deletes (one vote only)
CREATE POLICY "Prevent vote updates" ON picture_day_votes
  FOR UPDATE USING (false);
  
CREATE POLICY "Prevent vote deletes" ON picture_day_votes
  FOR DELETE USING (false);
