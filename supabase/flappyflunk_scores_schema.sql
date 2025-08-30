-- Flappy Flunk Scores Table
-- Create the table for storing Flappy Flunk game scores

CREATE TABLE IF NOT EXISTS flappyflunk_scores (
    id BIGSERIAL PRIMARY KEY,
    wallet TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_flappyflunk_scores_wallet ON flappyflunk_scores(wallet);
CREATE INDEX IF NOT EXISTS idx_flappyflunk_scores_score ON flappyflunk_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_flappyflunk_scores_created_at ON flappyflunk_scores(created_at DESC);

-- Enable Row Level Security
ALTER TABLE flappyflunk_scores ENABLE ROW LEVEL SECURITY;

-- Allow public read access to scores
CREATE POLICY IF NOT EXISTS "Allow public read access to flappyflunk_scores" ON flappyflunk_scores
    FOR SELECT USING (true);

-- Allow anyone to insert their own scores
CREATE POLICY IF NOT EXISTS "Allow public insert to flappyflunk_scores" ON flappyflunk_scores
    FOR INSERT WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE flappyflunk_scores IS 'Stores high scores from the Flappy Flunk game';
COMMENT ON COLUMN flappyflunk_scores.wallet IS 'Flow blockchain wallet address of the player';
COMMENT ON COLUMN flappyflunk_scores.score IS 'The score achieved in the game';
COMMENT ON COLUMN flappyflunk_scores.created_at IS 'When the score was recorded';
