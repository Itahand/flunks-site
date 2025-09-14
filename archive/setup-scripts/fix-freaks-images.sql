-- Update Freaks candidates to have proper image URLs
UPDATE picture_day_candidates 
SET image_url = '/images/picture-day/freaks/freak-1.png'
WHERE clique = 'freaks' AND name = 'Cool Geek';

UPDATE picture_day_candidates 
SET image_url = '/images/picture-day/freaks/freak-2.png'
WHERE clique = 'freaks' AND name = 'Pink Punk';

UPDATE picture_day_candidates 
SET image_url = '/images/picture-day/freaks/freak-3.png'
WHERE clique = 'freaks' AND name = 'Rebel Skull';

-- Verify the updates
SELECT clique, name, image_url FROM picture_day_candidates WHERE clique = 'freaks' ORDER BY name;