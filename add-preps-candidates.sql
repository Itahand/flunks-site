-- Add Preps candidates to the picture_day_candidates table
INSERT INTO picture_day_candidates (clique, name, image_url, description) VALUES
('preps', 'Class President', '/images/picture-day/preps/prep-1.png', 'Popular student council leader with perfect grades and designer clothes'),
('preps', 'Tennis Champion', '/images/picture-day/preps/prep-2.png', 'Country club tennis star with impeccable style and social connections'),
('preps', 'Debate Captain', '/images/picture-day/preps/prep-3.png', 'Eloquent debate team captain destined for Ivy League success');

-- Verify the candidates were added
SELECT clique, name, image_url, id 
FROM picture_day_candidates 
WHERE clique = 'preps' 
ORDER BY name;