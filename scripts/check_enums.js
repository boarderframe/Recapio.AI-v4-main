import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkEnums() {
    console.log('Checking enum types...')
    
    const { data, error } = await supabase
        .rpc('check_enum_types')
        .select('*')
    
    if (error) {
        console.error('Error checking enum types:', error)
    } else {
        console.log('\nEnum types found:', data)
    }
}

checkEnums() 