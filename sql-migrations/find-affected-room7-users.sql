-- Find users who have Room 7 key but no Room 7 visit record
-- These are likely affected by the ParadiseMotelMainSimple bug

SELECT 
    k.wallet_address,
    k.obtained_at as key_obtained_date,
    k.method as how_obtained,
    v.visit_timestamp as visit_recorded,
    CASE 
        WHEN v.wallet_address IS NULL THEN '❌ MISSING - Needs manual award'
        ELSE '✅ Already recorded'
    END as status
FROM paradise_motel_room7_keys k
LEFT JOIN paradise_motel_room7_visits v 
    ON k.wallet_address = v.wallet_address
ORDER BY k.obtained_at DESC;

-- Summary
SELECT 
    COUNT(*) FILTER (WHERE v.wallet_address IS NULL) as affected_users,
    COUNT(*) FILTER (WHERE v.wallet_address IS NOT NULL) as properly_credited,
    COUNT(*) as total_key_holders
FROM paradise_motel_room7_keys k
LEFT JOIN paradise_motel_room7_visits v 
    ON k.wallet_address = v.wallet_address;
