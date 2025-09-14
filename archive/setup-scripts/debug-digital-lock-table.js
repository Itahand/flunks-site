const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function debugDigitalLockTable() {
  console.log('🔍 Debugging digital_lock_attempts table...');
  
  // First check if table exists
  const { data: tables, error: tableError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_name', 'digital_lock_attempts');
    
  if (tableError) {
    console.error('❌ Error checking table existence:', tableError);
    return;
  }
  
  console.log('📋 Table exists:', tables?.length > 0);
  
  if (tables?.length === 0) {
    console.log('❌ digital_lock_attempts table does not exist!');
    return;
  }
  
  // Check table structure
  const { data: columns, error: colError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type')
    .eq('table_name', 'digital_lock_attempts');
    
  if (!colError && columns) {
    console.log('📊 Table columns:', columns.map(c => `${c.column_name} (${c.data_type})`));
  }
  
  // Check all entries in the table
  const { data: allData, error: allError } = await supabase
    .from('digital_lock_attempts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (allError) {
    console.error('❌ Error fetching data:', allError);
    return;
  }
  
  console.log('\n📈 Total entries in digital_lock_attempts:', allData?.length || 0);
  
  if (allData && allData.length > 0) {
    console.log('\n🔍 Recent entries:');
    allData.forEach((entry, i) => {
      console.log(`${i+1}. Code: ${entry.code_entered}, Success: ${entry.success}, User: ${entry.username || 'No username'}, Wallet: ${entry.wallet_address?.slice(0,8)}...`);
    });
    
    // Check specifically for 8004 entries
    const code8004 = allData.filter(entry => entry.code_entered === '8004');
    console.log(`\n🎯 8004 entries: ${code8004.length}`);
    console.log(`   ✅ Successful: ${code8004.filter(e => e.success).length}`);
    console.log(`   ❌ Failed: ${code8004.filter(e => !e.success).length}`);
  } else {
    console.log('📭 No entries found in digital_lock_attempts table');
  }
}

debugDigitalLockTable().catch(console.error);
