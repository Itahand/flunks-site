import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface FlowDrawingEntryResponse {
  success: boolean;
  message: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlowDrawingEntryResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'Only POST requests are allowed'
    });
  }

  try {
    const { walletAddress, username, userAgent, referrer } = req.body;

    // Validate required fields
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
        error: 'Missing wallet address'
      });
    }

    // Get IP address
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     'unknown';

    console.log('🎯 Recording Flow Drawing entry:', {
      walletAddress: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6),
      username,
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress
    });

    // Check if user has already entered the drawing
    const { data: existingEntry, error: checkError } = await supabase
      .from('flow_drawing_entries')
      .select('id, created_at')
      .eq('wallet_address', walletAddress)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing entry:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error while checking existing entry',
        error: checkError.message
      });
    }

    if (existingEntry) {
      console.log('⚠️ User already entered drawing:', walletAddress.slice(0, 8) + '...');
      return res.status(409).json({
        success: false,
        message: 'You have already entered the Flow Drawing!',
        error: 'Duplicate entry'
      });
    }

    // Insert new drawing entry
    const { data: insertData, error: insertError } = await supabase
      .from('flow_drawing_entries')
      .insert({
        wallet_address: walletAddress,
        username: username || 'Anonymous',
        user_agent: userAgent,
        referrer_url: referrer,
        ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        entry_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting drawing entry:', insertError);
      return res.status(500).json({
        success: false,
        message: 'Failed to record drawing entry',
        error: insertError.message
      });
    }

    console.log('✅ Flow Drawing entry recorded successfully:', {
      id: insertData.id,
      wallet: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6),
      username
    });

    return res.status(200).json({
      success: true,
      message: 'Flow Drawing entry recorded successfully!'
    });

  } catch (error: any) {
    console.error('❌ Unexpected error in Flow Drawing entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
}