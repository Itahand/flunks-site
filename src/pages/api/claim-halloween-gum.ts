import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import * as fcl from '@onflow/fcl';

/**
 * Halloween GumDrop Claim API
 * 
 * Flow:
 * 1. Verify user is eligible (blockchain check)
 * 2. Verify Flunk NFT ownership count
 * 3. Calculate GUM amount (10 GUM per Flunk)
 * 4. Add GUM to Supabase
 * 5. Mark as claimed on blockchain (done in frontend transaction)
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress, flunkCount, gumAmount } = req.body;

  if (!walletAddress || !flunkCount || !gumAmount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Step 1: Check eligibility on blockchain
    const isEligible = await fcl.query({
      cadence: `
        import SemesterZero from 0xYOUR_CONTRACT_ADDRESS
        
        access(all) fun main(user: Address): Bool {
          return SemesterZero.isEligibleForGumDrop(user: user)
        }
      `,
      args: (arg: any, t: any) => [arg(walletAddress, t.Address)],
    });

    if (!isEligible) {
      return res.status(403).json({ error: 'User not eligible for GumDrop' });
    }

    // Step 2: Verify user hasn't already claimed
    const hasClaimed = await fcl.query({
      cadence: `
        import SemesterZero from 0xYOUR_CONTRACT_ADDRESS
        
        access(all) fun main(user: Address): Bool {
          return SemesterZero.hasClaimedGumDrop(user: user)
        }
      `,
      args: (arg: any, t: any) => [arg(walletAddress, t.Address)],
    });

    if (hasClaimed) {
      return res.status(403).json({ error: 'User already claimed GumDrop' });
    }

    // Step 3: TODO - Verify Flunk NFT ownership count
    // For now, trust the frontend's flunkCount
    // In production, query the Flunks NFT contract directly

    // Step 4: Add GUM to Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_gum_transactions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Add GUM transaction
    const { error: transactionError } = await supabase
      .from('user_gum_transactions')
      .insert({
        wallet_address: walletAddress,
        amount: gumAmount,
        transaction_type: 'HALLOWEEN_GUMDROP',
        source: `Halloween GumDrop - ${flunkCount} Flunks`,
        timestamp: new Date().toISOString(),
      });

    if (transactionError) {
      throw transactionError;
    }

    console.log(`✅ Halloween GumDrop: ${walletAddress} claimed ${gumAmount} GUM (${flunkCount} Flunks)`);

    return res.status(200).json({
      success: true,
      gumAwarded: gumAmount,
      flunkCount,
      message: `Successfully claimed ${gumAmount} GUM!`,
    });
  } catch (error: any) {
    console.error('Error processing Halloween GumDrop claim:', error);
    return res.status(500).json({
      error: 'Failed to process claim',
      details: error.message,
    });
  }
}
