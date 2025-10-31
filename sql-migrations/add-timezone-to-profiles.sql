-- Add timezone column to user_profiles table
-- This will store the user's timezone offset for day/night functionality

-- Add timezone column (integer representing hours offset from UTC, e.g. -5, +8)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS timezone_offset INTEGER DEFAULT 0;

-- Add comment to explain the column
COMMENT ON COLUMN user_profiles.timezone_offset IS 'User timezone offset in hours from UTC (e.g. -5 for EST, +8 for China)';

-- Create index for timezone queries (optional, for future timezone-based features)
CREATE INDEX IF NOT EXISTS idx_user_profiles_timezone ON user_profiles(timezone_offset);

SELECT 'Timezone column added successfully!' as status;
