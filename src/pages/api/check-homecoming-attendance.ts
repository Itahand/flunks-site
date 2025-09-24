import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HomecomingAttendanceCheckResponse {
  success: boolean;
  hasAttended: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HomecomingAttendanceCheckResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      hasAttended: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { walletAddress } = req.query;

    // Validate required fields
    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({
        success: false,
        hasAttended: false,
        message: 'Wallet address is required'
      });
    }

    // Check if user has already attended homecoming dance (one time ever)
    const { data: existingEntry, error: checkError } = await supabase
      .from('user_gum_transactions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('source', 'chapter4_homecoming_dance')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking homecoming dance attendance:', checkError);
      return res.status(500).json({
        success: false,
        hasAttended: false,
        message: 'Database error occurred'
      });
    }

    const hasAttended = existingEntry && existingEntry.length > 0;

    return res.status(200).json({
      success: true,
      hasAttended,
      message: hasAttended ? 'User has already attended homecoming dance' : 'User has not attended homecoming dance'
    });

  } catch (error) {
    console.error('❌ Homecoming attendance check error:', error);
    return res.status(500).json({
      success: false,
      hasAttended: false,
      message: 'Internal server error'
    });
  }
}