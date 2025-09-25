import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;
let hasValidSupabaseConfig = false;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  hasValidSupabaseConfig = true;
  console.log('✅ Paradise Motel tracking: Supabase initialized');
} else {
  console.warn('⚠️ Paradise Motel tracking: Supabase environment variables not found');
}

export const trackParadiseMotelEntry = async (walletAddress: string): Promise<boolean> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Paradise Motel tracking disabled: Supabase not configured');
    return false;
  }

  try {
    console.log('🏨 Tracking Paradise Motel entry for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('paradise_motel_entries')
      .insert([
        {
          wallet_address: walletAddress,
          entered_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      // If it's a duplicate key error (user already entered), that's actually success
      if (error.code === '23505') {
        console.log('✅ Paradise Motel already entered by this wallet - achievement already completed');
        return true;
      }
      console.error('Error tracking Paradise Motel entry:', error);
      return false;
    }

    console.log('✅ Paradise Motel entry tracked successfully');
    return true;
  } catch (err) {
    console.error('Failed to track Paradise Motel entry:', err);
    return false;
  }
};

export const checkParadiseMotelEntered = async (walletAddress: string): Promise<boolean> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Paradise Motel check disabled: Supabase not configured');
    return false;
  }

  try {
    console.log('🔍 Checking Paradise Motel entry for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('paradise_motel_entries')
      .select('*')
      .eq('wallet_address', walletAddress)
      .limit(1);

    if (error) {
      console.error('Error checking Paradise Motel entry:', error);
      return false;
    }

    const hasEntered = data && data.length > 0;
    console.log('🏨 Paradise Motel entered status:', hasEntered);
    return hasEntered;
  } catch (err) {
    console.error('Failed to check Paradise Motel entry:', err);
    return false;
  }
};