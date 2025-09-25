import { supabase } from '../../lib/supabase';
import { awardGum } from '../../utils/gumAPI';
import { trackParadiseMotelEntry } from '../../utils/paradiseMotelTracking';
import type { NextApiRequest, NextApiResponse } from 'next';

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

    // Check if Supabase is configured
    if (!supabase) {
      console.error('❌ Supabase not configured');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

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
      .from('gum_transactions')
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

    // Track the entry for objectives (like Friday Night Lights)
    console.log('🏨 Tracking Paradise Motel entry for objectives...');
    const tracked = await trackParadiseMotelEntry(walletAddress);

    // Award GUM for entering the paradise motel code
    console.log('🏨 Attempting to award Paradise Motel GUM...');
    const gumResult = await awardGum(
      walletAddress, 
      'chapter4_paradise_motel_code',
      {
        user_agent: userAgent,
        ip_address: ipAddress,
        username: username || null,
        description: 'Chapter 4 Overachiever - Paradise Motel terminal code'
      }
    );

    console.log('🏨 Paradise Motel GUM result:', gumResult);

    if (!gumResult.success) {
      console.error('❌ Error awarding GUM for paradise motel code:', gumResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to award GUM: ' + (gumResult.error || 'Unknown error')
      });
    }

    console.log('✅ Paradise Motel code GUM awarded:', {
      walletAddress: walletAddress.slice(0, 10) + '...',
      username,
      amount: gumResult.earned
    });

    return res.status(200).json({
      success: true,
      message: `Paradise Motel code entered successfully! Awarded ${gumResult.earned} GUM for Chapter 4 Overachiever!`,
      gumAwarded: gumResult.earned,
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