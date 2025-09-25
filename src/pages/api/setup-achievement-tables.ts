import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ message: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔧 Setting up achievement tracking tables...');

    // Set up flunko_clicks table for Chapter 3
    const { error: flunkoError } = await supabase.rpc('execute_sql', {
      sql: `
        -- Create flunko_clicks table for Chapter 3 tracking
        CREATE TABLE IF NOT EXISTS flunko_clicks (
          id SERIAL PRIMARY KEY,
          wallet_address VARCHAR(50) NOT NULL,
          clicked_from_clique VARCHAR(50) NOT NULL,
          target_clique VARCHAR(50) NOT NULL,
          clicked_at TIMESTAMP DEFAULT NOW(),
          ip_address INET,
          user_agent TEXT,
          metadata JSONB,
          UNIQUE(wallet_address)
        );
        
        CREATE INDEX IF NOT EXISTS idx_flunko_clicks_wallet ON flunko_clicks(wallet_address);
      `
    });

    if (flunkoError) {
      console.error('Error creating flunko_clicks table:', flunkoError);
    }

    // Set up paradise_motel_entries table for Chapter 4  
    const { error: paradiseError } = await supabase.rpc('execute_sql', {
      sql: `
        -- Create paradise_motel_entries table for Chapter 4 tracking
        CREATE TABLE IF NOT EXISTS paradise_motel_entries (
          id SERIAL PRIMARY KEY,
          wallet_address VARCHAR(50) NOT NULL,
          command_entered VARCHAR(100) NOT NULL DEFAULT 'paradise motel',
          entered_at TIMESTAMP DEFAULT NOW(),
          ip_address INET,
          user_agent TEXT,
          username VARCHAR(50),
          metadata JSONB,
          UNIQUE(wallet_address)
        );
        
        CREATE INDEX IF NOT EXISTS idx_paradise_motel_wallet ON paradise_motel_entries(wallet_address);
      `
    });

    if (paradiseError) {
      console.error('Error creating paradise_motel_entries table:', paradiseError);
    }

    return res.status(200).json({
      success: true,
      message: 'Achievement tracking tables setup complete!',
      tables: ['flunko_clicks', 'paradise_motel_entries']
    });

  } catch (error) {
    console.error('Error setting up tables:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to setup tables',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}