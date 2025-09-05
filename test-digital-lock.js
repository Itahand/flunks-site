// Quick test script to verify Supabase connection and digital lock tracking
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidSupabaseConfig = !!(supabaseUrl && supabaseKey && 
  supabaseUrl !== 'placeholder_url' && 
  supabaseKey !== 'placeholder_key');

const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  if (!supabase) {
    console.log('❌ Supabase client not available - check your environment variables');
    return;
  }
  
  try {
    // Test if the digital_lock_attempts table exists
    const { data, error } = await supabase
      .from('digital_lock_attempts')
      .select('count(*)', { count: 'exact' });
      
    if (error) {
      console.log('❌ Error accessing digital_lock_attempts table:', error.message);
      console.log('🔧 You may need to run the SQL script: supabase/digital_lock_attempts.sql');
    } else {
      console.log('✅ Digital lock attempts table exists!');
      console.log(`📊 Current record count: ${data?.length || 0}`);
    }
    
    // Test inserting a dummy record
    console.log('Testing insert...');
    const { error: insertError } = await supabase
      .from('digital_lock_attempts')
      .insert([
        {
          wallet_address: 'test_wallet_123',
          username: 'test_user',
          code_entered: '1234',
          success: false
        }
      ]);
      
    if (insertError) {
      console.log('❌ Error inserting test record:', insertError.message);
    } else {
      console.log('✅ Test insert successful!');
      
      // Clean up test record
      await supabase
        .from('digital_lock_attempts')
        .delete()
        .eq('wallet_address', 'test_wallet_123');
      console.log('🧹 Test record cleaned up');
    }
    
  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

testSupabaseConnection().then(() => {
  console.log('Test complete!');
  process.exit(0);
});
