import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface FlunkyUppyEntryRequest {
  walletAddress: string;
  username?: string;
  userAgent?: string;
  referrer?: string;
}

interface FlunkyUppyEntryResponse {
  success: boolean;
  message: string;
  entryId?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlunkyUppyEntryResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { walletAddress, username, userAgent, referrer }: FlunkyUppyEntryRequest = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required',
      error: 'MISSING_WALLET_ADDRESS'
    });
  }

  console.log('🦘 Flunky Uppy entry tracking request:', {
    walletAddress,
    username,
    userAgent: userAgent?.substring(0, 100), // Truncate for logging
    referrer,
    timestamp: new Date().toISOString()
  });

  try {
    // Record the entry attempt
    const { data: entryData, error: entryError } = await supabase
      .from('flunky_uppy_entries')
      .insert([
        {
          wallet_address: walletAddress,
          username: username || 'Anonymous',
          user_agent: userAgent || 'Unknown',
          referrer_url: referrer || 'Direct',
          entry_timestamp: new Date().toISOString(),
          ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown'
        }
      ])
      .select()
      .single();

    if (entryError) {
      console.error('❌ Error recording Flunky Uppy entry:', entryError);
      return res.status(500).json({
        success: false,
        message: 'Failed to record entry',
        error: 'DATABASE_ERROR'
      });
    }

    console.log('✅ Flunky Uppy entry recorded:', entryData);

    return res.status(200).json({
      success: true,
      message: 'Entry recorded successfully',
      entryId: entryData.id
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
}