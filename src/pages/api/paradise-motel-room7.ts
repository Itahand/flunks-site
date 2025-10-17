import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Room7Response {
  success: boolean;
  message: string;
  gumAwarded?: number;
  alreadyCompleted?: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room7Response>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { walletAddress, username } = req.body;

    // Validate required fields
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    console.log('🌙 Processing Paradise Motel Room 7 night visit:', {
      wallet: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6),
      username
    });

    // Get IP address and user agent
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     'unknown';

    // Check if user has already visited Room 7
    const { data: existingVisit, error: checkError } = await supabase
      .from('paradise_motel_room7_visits')
      .select('id, visit_timestamp, gum_amount')
      .eq('wallet_address', walletAddress)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing visit:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error while checking visit',
        error: checkError.message
      });
    }

    if (existingVisit) {
      console.log('✅ User already visited Room 7:', walletAddress.slice(0, 8) + '...');
      // Return success since they already earned their reward
      return res.status(200).json({
        success: true,
        message: `You already earned ${existingVisit.gum_amount || 50} GUM as a Chapter 5 Slacker!`,
        gumAwarded: existingVisit.gum_amount || 50,
        alreadyCompleted: true
      });
    }

    // Record visit and award 50 GUM
    const gumAmount = 50;
    
    const { data: insertData, error: insertError } = await supabase
      .from('paradise_motel_room7_visits')
      .insert({
        wallet_address: walletAddress,
        username: username || 'Anonymous',
        gum_amount: gumAmount,
        user_agent: userAgent,
        ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        visit_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error recording Room 7 visit:', insertError);
      return res.status(500).json({
        success: false,
        message: 'Failed to record Room 7 visit',
        error: insertError.message
      });
    }

    // Award GUM using the proper gumAPI utility
    console.log('🌙 Attempting to award Room 7 GUM...');
    const gumResult = await awardGum(
      walletAddress, 
      'chapter5_paradise_motel_room7',
      {
        description: 'Chapter 5 Slacker - Paradise Motel Room 7 night visit',
        username: username || null
      }
    );

    console.log('🌙 Room 7 GUM result:', gumResult);

    if (!gumResult.success) {
      console.warn('⚠️ GUM award failed but visit recorded:', gumResult.error);
    }

    const actualGumAwarded = gumResult.success ? gumResult.earned : 0;

    console.log('✅ Room 7 visit recorded successfully:', {
      id: insertData.id,
      wallet: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6),
      gumAwarded: actualGumAwarded
    });

    return res.status(200).json({
      success: true,
      message: `🌙 Chapter 5 Slacker objective completed! You earned ${actualGumAwarded} GUM!`,
      gumAwarded: actualGumAwarded
    });

  } catch (error) {
    console.error('❌ Room 7 API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
