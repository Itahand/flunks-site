import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ResetAttendanceRequest {
  walletAddress: string;
}

interface ResetAttendanceResponse {
  success: boolean;
  message: string;
  recordsDeleted?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResetAttendanceResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  // Only allow in development environment for safety
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Reset endpoint only available in development'
    });
  }

  const { walletAddress }: ResetAttendanceRequest = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required'
    });
  }

  console.log('🔄 Resetting homecoming attendance for:', walletAddress);

  try {
    // Delete attendance records for this wallet
    const { data: deletedAttendance, error: attendanceError } = await supabase
      .from('homecoming_dance_tracking')
      .delete()
      .eq('wallet_address', walletAddress)
      .select();

    if (attendanceError) {
      console.error('❌ Error deleting attendance records:', attendanceError);
      return res.status(500).json({
        success: false,
        message: 'Failed to reset attendance records'
      });
    }

    // Also delete test GUM transactions (optional - keeps balance accurate)
    const { data: deletedGum, error: gumError } = await supabase
      .from('gum_transactions')
      .delete()
      .eq('wallet_address', walletAddress)
      .in('source', ['homecoming_dance_test', 'homecoming_dance'])
      .select();

    if (gumError) {
      console.error('⚠️ Warning: Could not delete GUM transactions:', gumError);
      // Don't fail the request if GUM deletion fails
    }

    const attendanceCount = deletedAttendance?.length || 0;
    const gumCount = deletedGum?.length || 0;

    console.log('✅ Reset complete:', {
      attendanceRecordsDeleted: attendanceCount,
      gumTransactionsDeleted: gumCount
    });

    return res.status(200).json({
      success: true,
      message: `Reset complete! Deleted ${attendanceCount} attendance records and ${gumCount} GUM transactions.`,
      recordsDeleted: attendanceCount
    });

  } catch (error) {
    console.error('❌ Unexpected error during reset:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}