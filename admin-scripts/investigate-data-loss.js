// Investigate potential Supabase data loss issues
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function investigateDataLoss() {
  console.log('🔍 INVESTIGATING POTENTIAL SUPABASE DATA LOSS');
  console.log('=' .repeat(70));
  
  // 1. Check 8004 code submission patterns
  console.log('\n1️⃣ DIGITAL LOCK ATTEMPTS ANALYSIS:');
  
  const { data: allAttempts, error: attemptsError } = await supabase
    .from('digital_lock_attempts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
    
  if (attemptsError) {
    console.error('❌ Error fetching digital lock attempts:', attemptsError);
  } else {
    console.log(`📊 Total recent attempts: ${allAttempts?.length || 0}`);
    
    // Group by code entered
    const attemptsByCode = {};
    const attemptsBySuccess = { true: 0, false: 0 };
    
    allAttempts?.forEach(attempt => {
      attemptsByCode[attempt.code_entered] = (attemptsByCode[attempt.code_entered] || 0) + 1;
      attemptsBySuccess[attempt.success] = (attemptsBySuccess[attempt.success] || 0) + 1;
    });
    
    console.log('\n📋 Attempts by code:');
    Object.entries(attemptsByCode)
      .sort(([,a], [,b]) => b - a)
      .forEach(([code, count]) => {
        console.log(`  ${code}: ${count} attempts`);
      });
      
    console.log('\n✅ Success/Failure breakdown:');
    console.log(`  Successful: ${attemptsBySuccess.true || 0}`);
    console.log(`  Failed: ${attemptsBySuccess.false || 0}`);
    
    // Check specifically for 8004 attempts
    const code8004Attempts = allAttempts?.filter(a => a.code_entered === '8004') || [];
    const code8004Success = code8004Attempts.filter(a => a.success === true);
    const code8004Fail = code8004Attempts.filter(a => a.success === false);
    
    console.log(`\n🎯 8004 CODE SPECIFIC ANALYSIS:`);
    console.log(`  Total 8004 attempts: ${code8004Attempts.length}`);
    console.log(`  Successful 8004: ${code8004Success.length}`);
    console.log(`  Failed 8004: ${code8004Fail.length}`);
    console.log(`  Success rate: ${Math.round((code8004Success.length / code8004Attempts.length) * 100) || 0}%`);
    
    if (code8004Success.length > 0) {
      console.log(`\n✅ Recent 8004 successes:`);
      code8004Success.slice(0, 10).forEach((attempt, index) => {
        console.log(`  ${index + 1}. ${attempt.wallet_address?.slice(0, 12)}... at ${new Date(attempt.created_at).toLocaleString()}`);
      });
    }
    
    if (code8004Fail.length > 0) {
      console.log(`\n❌ Recent 8004 failures (might indicate submission issues):`);
      code8004Fail.slice(0, 5).forEach((attempt, index) => {
        console.log(`  ${index + 1}. ${attempt.wallet_address?.slice(0, 12)}... tried "${attempt.code_entered}" at ${new Date(attempt.created_at).toLocaleString()}`);
      });
    }
  }
  
  // 2. Check Flappy Flunk score patterns
  console.log('\n\n2️⃣ FLAPPY FLUNK SCORES ANALYSIS:');
  
  const { data: flappyScores, error: flappyError } = await supabase
    .from('flappy_scores')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
    
  if (flappyError) {
    console.error('❌ Error fetching Flappy scores:', flappyError);
  } else {
    console.log(`📊 Total recent Flappy scores: ${flappyScores?.length || 0}`);
    
    if (flappyScores?.length > 0) {
      const uniquePlayers = new Set(flappyScores.map(s => s.wallet_address)).size;
      const avgScore = Math.round(flappyScores.reduce((sum, s) => sum + s.score, 0) / flappyScores.length);
      const highScore = Math.max(...flappyScores.map(s => s.score));
      
      console.log(`👤 Unique players: ${uniquePlayers}`);
      console.log(`📈 Average score: ${avgScore}`);
      console.log(`🏆 High score: ${highScore}`);
      
      console.log(`\n🕒 Recent score submissions:`);
      flappyScores.slice(0, 10).forEach((score, index) => {
        console.log(`  ${index + 1}. ${score.wallet_address?.slice(0, 12)}... scored ${score.score} at ${new Date(score.created_at).toLocaleString()}`);
      });
    } else {
      console.log('🚨 NO FLAPPY SCORES FOUND - This indicates a submission problem!');
    }
  }
  
  // 3. Check for recent API errors or timeouts
  console.log('\n\n3️⃣ CHECKING SUPABASE CONNECTION HEALTH:');
  
  const startTime = Date.now();
  try {
    const { data: healthCheck, error: healthError } = await supabase
      .from('cafeteria_button_clicks')
      .select('count(*)')
      .limit(1);
      
    const responseTime = Date.now() - startTime;
    
    if (healthError) {
      console.error('❌ Supabase connection error:', healthError);
    } else {
      console.log(`✅ Supabase responding in ${responseTime}ms`);
      if (responseTime > 2000) {
        console.log('⚠️ Slow response time detected - might cause submission timeouts');
      }
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
  }
}

investigateDataLoss().catch(console.error);
