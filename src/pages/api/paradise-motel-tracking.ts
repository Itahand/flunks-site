import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ParadiseMotelTrackingRequest {
  walletAddress: string;
  username?: string;
}

interface ParadiseMotelTrackingResponse {
  success: boolean;
  message: string;
  gumAwarded?: number;
  alreadyCompleted?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParadiseMotelTrackingResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { walletAddress, username }: ParadiseMotelTrackingRequest = req.body;

    // Validate required fields
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    // Get user agent and IP for analytics
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'Unknown';

    // Check if user has already entered this code
    const { data: existingEntry, error: checkError } = await supabase
      .from('user_gum_transactions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('source', 'chapter4_paradise_motel_code')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing paradise motel entry:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    // If user already completed this, don't award again
    if (existingEntry && existingEntry.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Paradise Motel code already entered',
        alreadyCompleted: true,
        gumAwarded: 0
      });
    }

    // Award GUM for entering the paradise motel code
    const gumAmount = 100; // Chapter 4 Overachiever reward
    const { data: gumData, error: gumError } = await supabase
      .from('user_gum_transactions')
      .insert([
        {
          wallet_address: walletAddress,
          username: username || null,
          amount: gumAmount,
          source: 'chapter4_paradise_motel_code',
          description: 'Chapter 4 Overachiever - Paradise Motel terminal code',
          user_agent: userAgent,
          ip_address: ipAddress
        }
      ])
      .select('*');

    if (gumError) {
      console.error('❌ Error awarding GUM for paradise motel code:', gumError);
      return res.status(500).json({
        success: false,
        message: 'Failed to award GUM'
      });
    }

    console.log('✅ Paradise Motel code GUM awarded:', {
      walletAddress: walletAddress.slice(0, 10) + '...',
      username,
      amount: gumAmount
    });

    return res.status(200).json({
      success: true,
      message: `Paradise Motel code entered successfully! Awarded ${gumAmount} GUM for Chapter 4 Overachiever!`,
      gumAwarded: gumAmount,
      alreadyCompleted: false
    });

  } catch (error) {
    console.error('❌ Paradise Motel tracking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}