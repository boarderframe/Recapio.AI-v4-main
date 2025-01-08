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

async function checkTables() {
    console.log('Checking transcript tables...')
    
    // Check transcript_types table
    const { data: types, error: typesError } = await supabase
        .from('transcript_types')
        .select('*')
    
    if (typesError) {
        console.error('Error fetching transcript_types:', typesError)
    } else {
        console.log('\nTranscript Types:', types.length, 'records found')
        console.log(types)
    }

    // Check transcripts table
    const { data: transcripts, error: transcriptsError } = await supabase
        .from('transcripts')
        .select('*')
    
    if (transcriptsError) {
        console.error('Error fetching transcripts:', transcriptsError)
    } else {
        console.log('\nTranscripts:', transcripts.length, 'records found')
        console.log(transcripts)
    }

    // Check transcript_contents table
    const { data: contents, error: contentsError } = await supabase
        .from('transcript_contents')
        .select('*')
    
    if (contentsError) {
        console.error('Error fetching transcript_contents:', contentsError)
    } else {
        console.log('\nTranscript Contents:', contents.length, 'records found')
        console.log(contents)
    }

    // Check transcript_processing table
    const { data: processing, error: processingError } = await supabase
        .from('transcript_processing')
        .select('*')
    
    if (processingError) {
        console.error('Error fetching transcript_processing:', processingError)
    } else {
        console.log('\nTranscript Processing:', processing.length, 'records found')
        console.log(processing)
    }

    // Check transcript_outputs table
    const { data: outputs, error: outputsError } = await supabase
        .from('transcript_outputs')
        .select('*')
    
    if (outputsError) {
        console.error('Error fetching transcript_outputs:', outputsError)
    } else {
        console.log('\nTranscript Outputs:', outputs.length, 'records found')
        console.log(outputs)
    }

    // Check transcript_output_requests table
    const { data: outputRequests, error: outputRequestsError } = await supabase
        .from('transcript_output_requests')
        .select('*')
    
    if (outputRequestsError) {
        console.error('Error fetching transcript_output_requests:', outputRequestsError)
    } else {
        console.log('\nTranscript Output Requests:', outputRequests.length, 'records found')
        console.log(outputRequests)
    }
}

checkTables() 