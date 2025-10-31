// Add mysterious snugglebug message to chat
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addSnugglebugMessage() {
  console.log('🔮 Adding mysterious message from snugglebug...');
  
  const mysteriousMessages = [
    "is it true?",
    "did he really not show up to school or the game?",
    "flunko are you in here?",
    "where did flunko go?",
    "has anyone actually seen him since the incident?",
    "they're saying he just vanished... is that real?",
    "flunko if you're reading this, we need to talk",
    "does anyone know what really happened that night?",
    "the rumors can't all be true... right?",
    "someone has to know where he is"
  ];
  
  // Pick a random mysterious message
  const selectedMessage = mysteriousMessages[Math.floor(Math.random() * mysteriousMessages.length)];
  
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_name: '💬 General Chat',  // Post to General Chat room
        username: 'snugglebug',       // Mysterious username
        wallet_address: null,         // No wallet address for mystery
        message_text: selectedMessage,
        is_ai: false,                 // Not an AI message
        ai_agent_id: null
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error posting mysterious message:', error);
      throw error;
    }

    console.log('✅ Mysterious message posted successfully!');
    console.log('👻 Message:', selectedMessage);
    console.log('📊 Database record:', data);
    
    return data;

  } catch (error) {
    console.error('🔥 Failed to add snugglebug message:', error);
    throw error;
  }
}

// Run the function
if (require.main === module) {
  addSnugglebugMessage()
    .then(() => {
      console.log('🎉 Snugglebug has left their mysterious mark on the chat!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addSnugglebugMessage };