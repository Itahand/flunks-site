import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;
let hasValidSupabaseConfig = false;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  hasValidSupabaseConfig = true;
  console.log('✅ Repeat Offender tracking: Supabase initialized');
} else {
  console.warn('⚠️ Repeat Offender tracking: Supabase environment variables not found');
}

export const trackRepeatOffenderClaim = async (walletAddress: string): Promise<boolean> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Repeat Offender tracking disabled: Supabase not configured');
    return false;
  }

  try {
    console.log('🏈 Tracking Repeat Offender claim for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('repeat_offender_claims')
      .insert([
        {
          wallet_address: walletAddress,
          claimed_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      console.error('Error tracking Repeat Offender claim:', error);
      return false;
    }

    console.log('✅ Repeat Offender claim tracked successfully');
    return true;
  } catch (err) {
    console.error('Failed to track Repeat Offender claim:', err);
    return false;
  }
};

export const checkRepeatOffenderEligibility = async (walletAddress: string): Promise<{
  canClaim: boolean;
  timeRemaining?: number;
  lastClaimTime?: string;
}> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Repeat Offender check disabled: Supabase not configured');
    return { canClaim: false };
  }

  try {
    console.log('🔍 Checking Repeat Offender eligibility for wallet:', walletAddress);
    
    // Get the most recent claim for this wallet
    const { data, error } = await supabase
      .from('repeat_offender_claims')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('claimed_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error checking Repeat Offender eligibility:', error);
      return { canClaim: false };
    }

    if (!data || data.length === 0) {
      // No previous claims, can claim
      console.log('🏈 No previous Repeat Offender claims found - eligible to claim');
      return { canClaim: true };
    }

    const lastClaim = data[0];
    const lastClaimTime = new Date(lastClaim.claimed_at);
    const now = new Date();
    const timeDiff = now.getTime() - lastClaimTime.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const canClaim = timeDiff >= twentyFourHours;
    const timeRemaining = canClaim ? 0 : twentyFourHours - timeDiff;

    console.log('🏈 Repeat Offender eligibility check:', {
      canClaim,
      timeSinceLastClaim: timeDiff,
      timeRemaining: timeRemaining
    });

    return {
      canClaim,
      timeRemaining: timeRemaining > 0 ? timeRemaining : undefined,
      lastClaimTime: lastClaim.claimed_at
    };
  } catch (err) {
    console.error('Failed to check Repeat Offender eligibility:', err);
    return { canClaim: false };
  }
};

export const formatTimeRemaining = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};