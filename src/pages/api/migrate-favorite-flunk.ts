import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Add favorite_flunk_data column to user_profiles table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (error) {
      console.error('❌ Migration error:', error);
      return res.status(500).json({ error: 'Migration failed', details: error.message });
    }

    console.log('✅ Migration completed successfully');
    return res.status(200).json({ 
      success: true, 
      message: 'favorite_flunk_data column added to user_profiles table' 
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return res.status(500).json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
