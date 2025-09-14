// Quick script to check what tables exist
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  // Get list of tables
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Available tables:')
  data?.forEach(table => console.log('-', table.table_name))

  // Check for objective/completion related tables
  const objectiveTables = data?.filter(table => 
    table.table_name.includes('objective') || 
    table.table_name.includes('complete') || 
    table.table_name.includes('weekly')
  )

  console.log('\nObjective-related tables:')
  objectiveTables?.forEach(table => console.log('-', table.table_name))
}

checkTables().catch(console.error)
