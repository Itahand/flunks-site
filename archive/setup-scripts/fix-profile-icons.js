// Fix profile icons for existing users
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load build environment
require('dotenv').config({ path: '.env.build' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// The 25 emoji collection from ProfileIconSelector
const PROFILE_ICONS = [
  // Row 1 - Face Characters
  '🤓', '🥸', '🥶', '🤡', '😈',
  // Row 2 - Creatures  
  '👻', '👽', '💩', '👾', '🤖',
  // Row 3 - Professionals
  '🕵🏼‍♂️', '👨🏽‍⚕️', '👨🏽‍🍳', '👨🏽‍🌾', '👨🏼‍🎤',
  // Row 4 - More Professionals
  '👨🏽‍🏫', '👨🏽‍🎨', '🧑🏽‍🚀', '🥷', '🧙🏼‍♂️',
  // Row 5 - Fantasy Characters
  '🧌', '🧛', '🧞‍♂️', '🧜🏽‍♂️', '🎮'
];

async function fixProfileIcons() {
  console.log('🔧 FIXING PROFILE ICONS...');
  
  // Get all profiles that have default icon (👤)
  const { data: defaultProfiles, error } = await supabase
    .from('user_profiles')
    .select('id, username, wallet_address, profile_icon')
    .eq('profile_icon', '👤');
    
  if (error) {
    console.error('Error fetching default profiles:', error);
    return;
  }
  
  console.log(`Found ${defaultProfiles.length} profiles with default icon (👤)`);
  console.log('');
  
  // Assign random icons from our collection
  for (let i = 0; i < defaultProfiles.length; i++) {
    const profile = defaultProfiles[i];
    
    // Pick a random icon from our collection
    const randomIcon = PROFILE_ICONS[Math.floor(Math.random() * PROFILE_ICONS.length)];
    
    console.log(`${i + 1}. Updating ${profile.username}: 👤 → ${randomIcon}`);
    
    // Update the profile with the new icon
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ profile_icon: randomIcon })
      .eq('id', profile.id);
      
    if (updateError) {
      console.error(`❌ Failed to update ${profile.username}:`, updateError);
    } else {
      console.log(`✅ Updated ${profile.username} successfully`);
    }
  }
  
  console.log('');
  console.log('🎉 Profile icon fix complete!');
  
  // Show updated stats
  const { data: updatedProfiles } = await supabase
    .from('user_profiles')
    .select('profile_icon')
    .order('created_at', { ascending: false });
    
  const iconCounts = {};
  updatedProfiles?.forEach(p => {
    const icon = p.profile_icon || 'NULL';
    iconCounts[icon] = (iconCounts[icon] || 0) + 1;
  });
  
  console.log('=== UPDATED ICON DISTRIBUTION ===');
  Object.entries(iconCounts).forEach(([icon, count]) => {
    console.log(`Icon '${icon}': ${count} users`);
  });
}

// Run the fix
fixProfileIcons().catch(console.error);
