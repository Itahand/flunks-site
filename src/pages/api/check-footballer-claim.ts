import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    console.log('🏈 Checking footballer claim status for wallet:', walletAddress.slice(0, 10) + '...');
    
    // Check if this wallet has already claimed the footballer reward
    const { data, error } = await supabase
      .from('footballer_gum_claims')
      .select('*')
      .eq('wallet_address', walletAddress)
      .limit(1);

    if (error) {
      console.error('❌ Error checking footballer claim:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    const alreadyClaimed = data && data.length > 0 && data[0].gum_transaction_successful === true;
    
    console.log('🔍 Footballer claim check result:', { 
      walletAddress, 
      alreadyClaimed,
      hasFailedClaim: data && data.length > 0 && data[0].gum_transaction_successful === false
    });

    return res.status(200).json({ 
      alreadyClaimed,
      claimData: alreadyClaimed ? data[0] : null
    });
    
  } catch (error) {
    console.error('❌ Failed to check footballer claim:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
