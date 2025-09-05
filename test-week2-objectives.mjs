// Test script for Week 2 objectives
// Run with: node test-week2-objectives.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Testing Week 2 Objectives System');
console.log('=====================================');

// Test wallet address
const testWallet = '0x1234567890abcdef1234567890abcdef12345678';

console.log(`📋 Testing with wallet: ${testWallet}`);

// Test the API endpoints
const testEndpoint = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ ${url}:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`❌ ${url}:`, error.message);
  }
};

console.log('\n📊 Testing Week 2 completion stats API...');
await testEndpoint('http://localhost:3000/api/week2-completion-stats');

console.log('\n📊 Testing digital lock stats API...');
await testEndpoint('http://localhost:3000/api/digital-lock-stats');

console.log('\n🎯 Week 2 objectives test completed!');
console.log('=====================================');
console.log('Next steps:');
console.log('1. Go to My Locker and check Section 2');
console.log('2. Enter "0730" in Jock\'s House digital lock');
console.log('3. Refresh My Locker to see objective completion');
