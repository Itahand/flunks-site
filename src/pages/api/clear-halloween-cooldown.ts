import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
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

    console.log('🗑️ [CLEAR-COOLDOWN] Clearing Halloween GumDrop cooldown for wallet:', walletAddress);

    // Delete the gum transaction record for halloween_pumpkin_button
    const { error } = await supabase
      .from('gum_transactions')
      .delete()
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('source', 'halloween_pumpkin_button');

    if (error) {
      console.error('❌ [CLEAR-COOLDOWN] Database error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to clear cooldown',
        details: error.message 
      });
    }

    console.log('✅ [CLEAR-COOLDOWN] Successfully cleared cooldown for:', walletAddress);

    return res.status(200).json({
      success: true,
      message: 'Halloween GumDrop cooldown cleared - you can claim again!',
    });

  } catch (error: any) {
    console.error('💥 [CLEAR-COOLDOWN] Unexpected error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
