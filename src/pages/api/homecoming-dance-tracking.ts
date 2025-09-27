import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HomecomingDanceTrackingRequest {
  walletAddress: string;
  username?: string;
}

interface HomecomingDanceTrackingResponse {
  success: boolean;
  message: string;
  gumAwarded?: number;
  alreadyCompleted?: boolean;
  outsideWindow?: boolean;
}

// Check if current time is Saturday 12 PM to Sunday 12 PM (24-hour window)
function isHomecomingTime(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours(); // 0-23

  // Saturday from 12 PM onwards (12:00-23:59)
  if (dayOfWeek === 6 && hour >= 12) {
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
  res: NextApiResponse<HomecomingDanceTrackingResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { walletAddress, username }: HomecomingDanceTrackingRequest = req.body;

    // Validate required fields
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    // Check if it's currently homecoming time (Saturday 12 PM to Sunday 12 PM)
    if (!isHomecomingTime()) {
      return res.status(400).json({
        success: false,
        message: 'Homecoming Dance attendance can only be recorded Saturday 12 PM to Sunday 12 PM',
        outsideWindow: true
      });
    }

    // Get user agent and IP for analytics
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'Unknown';

    // Check if user has already attended homecoming dance (one time ever)
    const { data: existingEntry, error: checkError } = await supabase
      .from('user_gum_transactions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('source', 'chapter4_homecoming_dance')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing homecoming dance entry:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    // If user already attended, don't award again
    if (existingEntry && existingEntry.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Homecoming Dance already attended',
        alreadyCompleted: true,
        gumAwarded: 0
      });
    }

    // Award GUM for attending homecoming dance
    const gumAmount = 50; // Chapter 4 Slacker reward
    const { data: gumData, error: gumError } = await supabase
      .from('user_gum_transactions')
      .insert([
        {
          wallet_address: walletAddress,
          username: username || null,
          amount: gumAmount,
          source: 'chapter4_homecoming_dance',
          description: 'Chapter 4 Slacker - Homecoming Dance attendance',
          user_agent: userAgent,
          ip_address: ipAddress
        }
      ])
      .select('*');

    if (gumError) {
      console.error('❌ Error awarding GUM for homecoming dance:', gumError);
      return res.status(500).json({
        success: false,
        message: 'Failed to award GUM'
      });
    }

    console.log('✅ Homecoming Dance GUM awarded:', {
      walletAddress: walletAddress.slice(0, 10) + '...',
      username,
      amount: gumAmount
    });

    return res.status(200).json({
      success: true,
      message: `Homecoming Dance attendance recorded! Awarded ${gumAmount} GUM for Chapter 4 Slacker!`,
      gumAwarded: gumAmount,
      alreadyCompleted: false
    });

  } catch (error) {
    console.error('❌ Homecoming Dance tracking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}