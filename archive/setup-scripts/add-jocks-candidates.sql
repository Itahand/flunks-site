-- Add Jocks candidates to the picture_day_candidates table
-- Run this SQL in your Supabase SQL Editor

INSERT INTO picture_day_candidates (clique, name, image_url, description) VALUES
('jocks', 'Star Quarterback', '/images/picture-day/jocks/jock-1.png', 'Team captain with incredible arm strength and natural leadership on the field'),
('jocks', 'Wrestling Champion', '/images/picture-day/jocks/jock-2.png', 'Undefeated wrestling legend with unstoppable moves and fierce determination'),
('jocks', 'Track Speedster', '/images/picture-day/jocks/jock-3.png', 'Lightning-fast runner who breaks records and leaves competitors in the dust');

-- Verify the candidates were added
SELECT * FROM picture_day_candidates WHERE clique = 'jocks' ORDER BY name;