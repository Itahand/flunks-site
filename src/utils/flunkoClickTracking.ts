import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;
let hasValidSupabaseConfig = false;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  hasValidSupabaseConfig = true;
  console.log('✅ Flunko click tracking: Supabase initialized');
} else {
  console.warn('⚠️ Flunko click tracking: Supabase environment variables not found');
}

export const trackFlunkoClick = async (walletAddress: string, cliqueFrom: string): Promise<boolean> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Flunko click tracking disabled: Supabase not configured');
    return false;
  }

  try {
    console.log('🎯 Tracking Flunko click for wallet:', walletAddress, 'from clique:', cliqueFrom);
    
    const { data, error } = await supabase
      .from('flunko_clicks')
      .insert([
        {
          wallet_address: walletAddress,
          clicked_from_clique: cliqueFrom,
          clicked_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      // If it's a duplicate key error (user already clicked), that's actually success
      if (error.code === '23505') {
        console.log('✅ Flunko already clicked by this wallet - achievement already completed');
        return true;
      }
      console.error('Error tracking Flunko click:', error);
      return false;
    }

    console.log('✅ Flunko click tracked successfully');
    return true;
  } catch (err) {
    console.error('Failed to track Flunko click:', err);
    return false;
  }
};

export const checkFlunkoClicked = async (walletAddress: string): Promise<boolean> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Flunko click check disabled: Supabase not configured');
    return false;
  }

  try {
    console.log('🔍 Checking Flunko click for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('flunko_clicks')
      .select('*')
      .eq('wallet_address', walletAddress)
      .limit(1);

    if (error) {
      console.error('Error checking Flunko click:', error);
      return false;
    }

    const hasClicked = data && data.length > 0;
    console.log('🎯 Flunko clicked status:', hasClicked);
    return hasClicked;
  } catch (err) {
    console.error('Failed to check Flunko click:', err);
    return false;
  }
};