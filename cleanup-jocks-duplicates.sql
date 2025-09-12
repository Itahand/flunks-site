-- Remove duplicate Jocks candidates (keep only one of each)
-- This will delete the duplicates and keep the first occurrence of each candidate

DELETE FROM picture_day_candidates 
WHERE clique = 'jocks' 
AND id NOT IN (
  SELECT MIN(id::text)::uuid 
  FROM picture_day_candidates 
  WHERE clique = 'jocks' 
  GROUP BY name
);

-- Verify we now have exactly 3 Jocks candidates
SELECT clique, name, image_url, id 
FROM picture_day_candidates 
WHERE clique = 'jocks' 
ORDER BY name;