import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }

    console.log('🔑 [ROOM7-KEY] Recording key obtainment for wallet:', walletAddress);

    // Get user agent and IP for tracking
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                      req.socket.remoteAddress || 
                      'unknown';

    // Insert or update the key record
    const { data, error } = await supabase
      .from('paradise_motel_room7_keys')
      .upsert(
        {
          wallet_address: walletAddress.toLowerCase(),
          obtained_at: new Date().toISOString(),
          user_agent: userAgent,
          ip_address: ipAddress,
        },
        {
          onConflict: 'wallet_address',
          ignoreDuplicates: false, // Update the timestamp if they get it again
        }
      )
      .select()
      .single();

    if (error) {
      console.error('❌ [ROOM7-KEY] Database error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to record key obtainment',
        details: error.message 
      });
    }

    console.log('✅ [ROOM7-KEY] Successfully recorded key for:', walletAddress);

    return res.status(200).json({
      success: true,
      message: 'Room 7 key obtainment recorded',
      data: {
        wallet_address: data.wallet_address,
        obtained_at: data.obtained_at,
      }
    });

  } catch (error: any) {
    console.error('💥 [ROOM7-KEY] Unexpected error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
