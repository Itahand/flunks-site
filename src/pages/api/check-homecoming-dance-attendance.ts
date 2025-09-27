import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HomecomingAttendanceResponse {
  success: boolean;
  hasAttended: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HomecomingAttendanceResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      hasAttended: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({
        success: false,
        hasAttended: false,
        message: 'Valid wallet address is required'
      });
    }

    console.log('🔍 Checking homecoming attendance for:', walletAddress.slice(0, 8) + '...');

    // Check if user has already attended homecoming dance
    const { data: existingAttendance, error: checkError } = await supabase
      .from('homecoming_dance_attendance')
      .select('id, attendance_timestamp')
      .eq('wallet_address', walletAddress)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Database error checking attendance:', checkError);
      return res.status(500).json({
        success: false,
        hasAttended: false,
        message: 'Database error while checking attendance'
      });
    }

    const hasAttended = !!existingAttendance;
    
    console.log('📊 Attendance check result:', {
      wallet: walletAddress.slice(0, 8) + '...',
      hasAttended,
      attendedAt: existingAttendance?.attendance_timestamp
    });

    return res.status(200).json({
      success: true,
      hasAttended,
      message: hasAttended 
        ? 'User has already attended homecoming dance' 
        : 'User has not attended homecoming dance yet'
    });

  } catch (error: any) {
    console.error('❌ Unexpected error checking homecoming attendance:', error);
    return res.status(500).json({
      success: false,
      hasAttended: false,
      message: 'Internal server error'
    });
  }
}