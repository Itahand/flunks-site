import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { walletAddress } = req.method === 'DELETE' ? req.query : req.body;

    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }

    console.log('🗑️ [DELETE-KEY] Deleting Room 7 key for wallet:', walletAddress);

    const { error } = await supabase
      .from('paradise_motel_room7_keys')
      .delete()
      .eq('wallet_address', walletAddress.toLowerCase());

    if (error) {
      console.error('❌ [DELETE-KEY] Database error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to delete key',
        details: error.message 
      });
    }

    console.log('✅ [DELETE-KEY] Successfully deleted key for:', walletAddress);

    return res.status(200).json({
      success: true,
      message: 'Room 7 key deleted successfully',
    });

  } catch (error: any) {
    console.error('💥 [DELETE-KEY] Unexpected error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
