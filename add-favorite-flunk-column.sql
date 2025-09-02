-- Migration: Add favorite_flunk_data column to user_profiles table
-- This will allow favorite flunks to sync across devices for the same wallet

-- Check if column already exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'favorite_flunk_data'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN favorite_flunk_data JSONB DEFAULT NULL;
        RAISE NOTICE 'Added favorite_flunk_data column to user_profiles table';
    ELSE
        RAISE NOTICE 'favorite_flunk_data column already exists in user_profiles table';
    END IF;
END $$;

-- Add comment to explain the column
COMMENT ON COLUMN user_profiles.favorite_flunk_data IS 'JSON data containing users favorite Flunk NFT information including tokenId, serialNumber, name, imageUrl, clique, etc.';

-- Show sample of how the data will be stored
-- favorite_flunk_data example:
-- {
--   "tokenId": "123",
--   "serialNumber": "456", 
--   "name": "Cool Flunk",
--   "imageUrl": "https://...",
--   "pixelUrl": "https://...",
--   "clique": "GEEK",
--   "walletAddress": "0x..."
-- }

-- Show current table structure
\d user_profiles;
