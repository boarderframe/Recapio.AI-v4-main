const OpenAI = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testOpenAI() {
    if (!process.env.OPENAI_API_KEY) {
        console.error('Error: OPENAI_API_KEY is not set in environment variables');
        process.exit(1);
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        console.log('Fetching OpenAI models...');
        const models = await openai.models.list();
        console.log('Success! Available models:', models.data.length);
        console.log('\nFirst few models:');
        models.data.slice(0, 5).forEach(model => {
            console.log(`- ${model.id} (owned by ${model.owned_by})`);
        });
    } catch (error) {
        console.error('Error fetching models:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testOpenAI(); 