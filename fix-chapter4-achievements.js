const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyChapter4SlackerAchievements() {
  console.log('🏆 Verifying Chapter 4 Slacker achievements...');
  
  try {
    // Get all users who attended homecoming dance
    const { data: attendees, error: attendanceError } = await supabase
      .from('homecoming_dance_attendance')
      .select('wallet_address, username, gum_amount, created_at')
      .order('created_at', { ascending: false });

    if (attendanceError) {
      console.error('❌ Error fetching attendance:', attendanceError);
      return;
    }

    console.log('📊 Found', attendees.length, 'homecoming dance attendees:');
    
    for (const attendee of attendees) {
      console.log(`\n🕺 Checking ${attendee.username || 'Unknown'} (${attendee.wallet_address.slice(0,10)}...)`);
      
      // Check if they have corresponding GUM transaction
      const { data: gumTx, error: gumError } = await supabase
        .from('gum_transactions')
        .select('*')
        .eq('wallet_address', attendee.wallet_address)
        .eq('source', 'chapter4_homecoming_dance')
        .limit(1);

      if (gumError) {
        console.error('❌ Error checking GUM transaction:', gumError);
        continue;
      }

      if (gumTx && gumTx.length > 0) {
        console.log('✅ Has GUM transaction record - achievement should be lit!');
      } else {
        console.log('⚠️  Missing GUM transaction record');
        
        // Create missing GUM transaction record
        console.log('🔧 Creating missing GUM transaction...');
        const { error: insertError } = await supabase
          .from('gum_transactions')
          .insert({
            wallet_address: attendee.wallet_address,
            transaction_type: 'earned',
            amount: 50,
            source: 'chapter4_homecoming_dance',
            description: 'Chapter 4 Slacker - Homecoming Dance attendance (retroactive)',
            metadata: {
              retroactive: true,
              original_date: attendee.created_at
            }
          });

        if (insertError) {
          console.error('❌ Error creating GUM transaction:', insertError);
        } else {
          console.log('✅ Created missing GUM transaction record');
        }
      }
    }

    console.log('\n🎉 Verification complete! All users should now have their achievements lit up.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyChapter4SlackerAchievements();