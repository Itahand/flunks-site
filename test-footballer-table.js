// Test script to check if the footballer_gum_claims table exists
const { createClient } = require('@supabase/supabase-js');

// Using your actual Supabase credentials
const supabaseUrl = 'https://jejycbxxdsrcsobmvbbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplanljYnh4ZHNyY3NvYm12YmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTk1NjksImV4cCI6MjA2NTY3NTU2OX0.J14zg5h4W_d7SjTN97RbDqCmdAYS9q7x7ZoSxLz0dkE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTable() {
    try {
        console.log('Testing footballer_gum_claims table...');
        
        // Try to query the table structure
        const { data, error } = await supabase
            .from('footballer_gum_claims')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('Table check failed:', error.message);
            if (error.message.includes('relation "public.footballer_gum_claims" does not exist')) {
                console.log('❌ Table does not exist. Please run the SQL script in your Supabase dashboard.');
            }
        } else {
            console.log('✅ Table exists and is accessible!');
            console.log('Current records:', data.length);
        }
    } catch (err) {
        console.error('Connection error:', err);
    }
}

testTable();
