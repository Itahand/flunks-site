-- Check what candidates exist in the database for all cliques
SELECT clique, name, image_url, id 
FROM picture_day_candidates 
ORDER BY clique, name;