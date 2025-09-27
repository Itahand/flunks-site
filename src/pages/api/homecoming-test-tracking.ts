import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HomecomingTestTrackingRequest {
  walletAddress: string;
  username?: string;
  testMode?: boolean;
}

interface HomecomingTestTrackingResponse {
  success: boolean;
  message: string;
  gumAwarded?: number;
  alreadyCompleted?: boolean;
  outsideWindow?: boolean;
  testMode?: boolean;
}

// Check if current time is Saturday 5 PM to Sunday 12 PM (19-hour window)
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
  res: NextApiResponse<HomecomingTestTrackingResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { walletAddress, username, testMode }: HomecomingTestTrackingRequest = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required'
    });
  }

  console.log('🎭 Test Homecoming Dance tracking request:', {
    walletAddress,
    username,
    testMode,
    currentTime: new Date().toISOString(),
    isHomecomingTime: isHomecomingTime()
  });

  // Get user agent and IP for analytics
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.socket.remoteAddress || 
                   'Unknown';

  try {
    // Check time window (bypass in test mode)
    if (!testMode && !isHomecomingTime()) {
      console.log('⏰ Outside homecoming time window');
      return res.status(400).json({
        success: false,
        message: 'Homecoming dance is only available Saturday 5 PM to Sunday 12 PM',
        outsideWindow: true,
        testMode
      });
    }

    // Check if user already attended this week
    const { data: existingRecord, error: checkError } = await supabase
      .from('homecoming_dance_tracking')
      .select('*')
      .eq('wallet_address', walletAddress)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Database check error:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error while checking attendance'
      });
    }

    if (existingRecord) {
      console.log('👤 User already attended this week:', existingRecord);
      return res.status(400).json({
        success: false,
        message: 'You have already attended the homecoming dance this week!',
        alreadyCompleted: true,
        testMode
      });
    }

    // Record the attendance
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('homecoming_dance_tracking')
      .insert([
        {
          wallet_address: walletAddress,
          username: username || 'Anonymous',
          attended_at: new Date().toISOString(),
          test_mode: testMode || false
        }
      ])
      .select()
      .single();

    if (attendanceError) {
      console.error('❌ Error recording attendance:', attendanceError);
      return res.status(500).json({
        success: false,
        message: 'Failed to record homecoming dance attendance'
      });
    }

    console.log('✅ Attendance recorded:', attendanceData);

    // Award 50 GUM for attending the homecoming dance  
    const gumAmount = 50;
    const { data: gumData, error: gumError } = await supabase
      .from('user_gum_transactions')
      .insert([
        {
          wallet_address: walletAddress,
          username: username || null,
          amount: gumAmount,
          source: testMode ? 'chapter4_homecoming_dance_test' : 'chapter4_homecoming_dance',
          description: testMode ? 'TEST: Chapter 4 Slacker - Homecoming Dance attendance' : 'Chapter 4 Slacker - Homecoming Dance attendance',
          user_agent: userAgent,
          ip_address: ipAddress
        }
      ])
      .select()
      .single();

    if (gumError) {
      console.error('❌ Error awarding GUM:', gumError);
      // Don't fail the whole request if GUM award fails, but log it
      return res.status(200).json({
        success: true,
        message: `Attendance recorded but failed to award GUM. Please contact support.`,
        gumAwarded: 0,
        testMode
      });
    }

    console.log('✅ GUM awarded:', gumData);

    return res.status(200).json({
      success: true,
      message: testMode 
        ? `TEST: Successfully attended homecoming dance! Awarded ${gumAmount} GUM.`
        : `Successfully attended homecoming dance! Awarded ${gumAmount} GUM.`,
      gumAwarded: gumAmount,
      testMode
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}