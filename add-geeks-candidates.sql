-- First, add the missing columns to the table if they don't exist
ALTER TABLE picture_day_candidates 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add Geeks candidates to the picture_day_candidates table
INSERT INTO picture_day_candidates (clique, name, image_url, description) VALUES
('geeks', 'Tech Wizard', '/images/picture-day/geeks/geek-1.png', 'The ultimate coding mastermind with infinite knowledge of programming languages'),
('geeks', 'Science Ace', '/images/picture-day/geeks/geek-2.png', 'Laboratory genius who can solve any equation and build amazing inventions'),
('geeks', 'Gaming Legend', '/images/picture-day/geeks/geek-3.png', 'Champion gamer with unbeatable skills in every console and PC game');

-- Verify the candidates were added
SELECT * FROM picture_day_candidates WHERE clique = 'geeks' ORDER BY name;