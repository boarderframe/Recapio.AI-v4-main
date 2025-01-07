import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Initialize with some default models since Anthropic doesn't have a public models endpoint
        const defaultModels = [
            {
                id: 'claude-3-opus-20240229',
                created: Math.floor(new Date('2024-02-29').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Trained on diverse data through 2023',
                status: 'Active'
            },
            {
                id: 'claude-3-sonnet-20240229',
                created: Math.floor(new Date('2024-02-29').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Trained on diverse data through 2023',
                status: 'Active'
            },
            {
                id: 'claude-2.1',
                created: Math.floor(new Date('2023-11-21').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Trained on diverse data through early 2023',
                status: 'Active'
            },
            {
                id: 'claude-2.0',
                created: Math.floor(new Date('2023-07-11').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 100000,
                training_data: 'Trained on diverse data through late 2022',
                status: 'Active'
            },
            {
                id: 'claude-instant-1.2',
                created: Math.floor(new Date('2023-03-14').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 100000,
                training_data: 'Faster, more affordable version of Claude',
                status: 'Active'
            }
        ];

        res.status(200).json(defaultModels);
    } catch (error) {
        console.error('Error handling Anthropic models:', error);
        res.status(500).json({ 
            message: 'Error handling models',
            error: error.message 
        });
    }
} 