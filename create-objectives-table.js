// Create weekly objectives completion table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS weekly_objectives_completed (
        id BIGSERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        username TEXT,
        semester_week TEXT NOT NULL DEFAULT 'semester_zero_week1',
        objectives_completed TEXT[] NOT NULL DEFAULT '{}',
        all_completed BOOLEAN NOT NULL DEFAULT FALSE,
        completion_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(wallet_address, semester_week)
    );
  `;

  const { data, error } = await supabase.rpc('exec', { sql });
  
  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('✅ Table created successfully');
  }
}

createTable();
