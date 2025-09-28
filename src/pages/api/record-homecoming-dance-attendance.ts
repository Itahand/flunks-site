import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HomecomingDanceResponse {
  success: boolean;
  message: string;
  gumAwarded?: number;
  alreadyCompleted?: boolean;
  outsideWindow?: boolean;
  error?: string;
}

// Check if it's currently Saturday 5 PM to Sunday 12 PM
function isHomecomingTime(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours(); // 0-23

  // Saturday from 5 PM onwards (17:00-23:59)
  if (dayOfWeek === 6 && hour >= 17) {
    return true;
  }
  
  // Sunday from midnight to 11:59 AM (00:00-11:59)
  if (dayOfWeek === 0 && hour < 12) {
    return true;
  }
  
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HomecomingDanceResponse>
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

    // Note: Removed time restriction - homecoming dance now available anytime

    console.log('🕺 Processing homecoming dance attendance:', {
      wallet: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6),
      username
    });

    // Get IP address and user agent
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     'unknown';

    // Check if user has already attended
    const { data: existingAttendance, error: checkError } = await supabase
      .from('homecoming_dance_attendance')
      .select('id, attendance_timestamp, gum_amount')
      .eq('wallet_address', walletAddress)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing attendance:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error while checking attendance',
        error: checkError.message
      });
    }

    if (existingAttendance) {
      console.log('✅ User already attended homecoming dance:', walletAddress.slice(0, 8) + '...');
      // Return success since they already earned their reward
      return res.status(200).json({
        success: true,
        message: `Welcome back! You already earned ${existingAttendance.gum_amount || 50} GUM as a Chapter 4 Slacker!`,
        gumAwarded: existingAttendance.gum_amount || 50,
        alreadyCompleted: true
      });
    }

    // Record attendance and award 50 GUM
    const gumAmount = 50;
    
    const { data: insertData, error: insertError } = await supabase
      .from('homecoming_dance_attendance')
      .insert({
        wallet_address: walletAddress,
        username: username || 'Anonymous',
        gum_amount: gumAmount,
        user_agent: userAgent,
        ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        attendance_timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error recording homecoming attendance:', insertError);
      return res.status(500).json({
        success: false,
        message: 'Failed to record homecoming dance attendance',
        error: insertError.message
      });
    }

    // Award GUM using the proper gumAPI utility
    console.log('🕺 Attempting to award Homecoming Dance GUM...');
    const gumResult = await awardGum(
      walletAddress, 
      'chapter4_homecoming_dance',
      {
        description: 'Chapter 4 Slacker - Homecoming Dance attendance',
        username: username || null
      }
    );

    console.log('🕺 Homecoming Dance GUM result:', gumResult);

    if (!gumResult.success) {
      console.warn('⚠️ GUM award failed but attendance recorded:', gumResult.error);
    }

    const actualGumAwarded = gumResult.success ? gumResult.earned : 0;

    console.log('✅ Homecoming dance attendance recorded successfully:', {
      id: insertData.id,
      wallet: walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6),
      gumAwarded: actualGumAwarded
    });

    return res.status(200).json({
      success: true,
      message: `Welcome to homecoming! You've earned ${actualGumAwarded} GUM as a Chapter 4 Slacker!`,
      gumAwarded: actualGumAwarded
    });

  } catch (error: any) {
    console.error('❌ Unexpected error in homecoming dance attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error occurred'
    });
  }
}