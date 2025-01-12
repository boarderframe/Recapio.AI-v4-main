# AI Model Management

## Overview

Recapio integrates with multiple AI providers to offer a comprehensive set of AI capabilities. This document details the model management system, including supported providers, model configuration, and integration details.

## Supported Providers

### OpenAI
- **Chat Completion**: GPT-4, GPT-3.5-turbo
- **Image Generation**: DALL-E 2, DALL-E 3
- **Text Embedding**: text-embedding-3-small, text-embedding-3-large
- **Speech to Text**: whisper-1
- **Text to Speech**: tts-1, tts-1-hd
- **Moderation**: omni-moderation-latest

### Google Gemini
- **Chat Completion**: gemini-pro, gemini-pro-vision
- **Vision**: gemini-pro-vision

### Anthropic
- **Chat Completion**: claude-3-opus-20240229, claude-3-sonnet-20240229

## Model Configuration

### Default Model Settings
```json
{
  "Chat Completion": {
    "provider": "anthropic",
    "modelId": "claude-3-opus-20240229"
  },
  "Text Embedding": {
    "provider": "openai",
    "modelId": "text-embedding-3-large"
  },
  "Image Generation": {
    "provider": "openai",
    "modelId": "dall-e-2"
  },
  "Speech to Text": {
    "provider": "openai",
    "modelId": "whisper-1"
  },
  "Text to Speech": {
    "provider": "openai",
    "modelId": "tts-1"
  },
  "Moderation": {
    "provider": "openai",
    "modelId": "omni-moderation-latest"
  }
}
```

## Model Management System

### Model Refresh Process
1. Periodic refresh of available models
2. Cache management for model lists
3. Fallback mechanisms for API failures
4. Model status monitoring

### Model Information Tracking
- Model ID
- Creation date
- Provider
- Type/Capability
- Context length
- Training data cutoff
- Status (Active/Deprecated)

## Integration Implementation

### OpenAI Integration
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Model listing and caching
export async function fetchAndCacheModels() {
    const models = await openai.models.list();
    const formattedModels = models.data.map(model => ({
        id: model.id,
        created: model.created,
        owned_by: model.owned_by,
        type: determineModelType(model.id),
        context_length: getContextLength(model.id),
        training_data: getTrainingData(model.id),
        status: getModelStatus(model.id)
    }));
    // Cache models...
    return formattedModels;
}
```

### Gemini Integration
```typescript
// Gemini model configuration
const defaultGeminiModels = [
    {
        id: "gemini-pro",
        type: "Chat Completion",
        context_length: 32768,
        training_data: "Up to 2023",
        status: "Active"
    },
    {
        id: "gemini-pro-vision",
        type: "Chat Completion",
        context_length: 32768,
        training_data: "Up to 2023",
        status: "Active"
    }
];
```

## Model Selection Logic

### Context Length Detection
```typescript
function getContextLength(modelId: string): number | null {
    if (modelId.includes('gpt-4')) {
        if (modelId.includes('32k')) return 32768;
        if (modelId.includes('preview')) return 128000;
        return 8192;
    }
    if (modelId.includes('gpt-3.5')) {
        return modelId.includes('16k') ? 16384 : 4096;
    }
    if (modelId.includes('embedding')) return 8191;
    return null;
}
```

### Training Data Detection
```typescript
function getTrainingData(modelId: string): string | null {
    if (modelId.includes('gpt-4')) {
        return modelId.includes('0314') ? 'Up to Sep 2021' : 'Up to 2023';
    }
    if (modelId.includes('gpt-3.5')) return 'Up to Sep 2021';
    if (modelId.includes('embedding-3')) return 'Up to 2023';
    return null;
}
```

## Admin Interface

### Model Management UI
- Model listing and filtering
- Default model selection
- Model status monitoring
- Usage statistics
- Cost tracking

### Configuration Options
- Provider selection
- Model defaults
- API key management
- Usage limits
- Cost controls

## Error Handling

### API Failures
```typescript
try {
    const models = await fetchModels();
} catch (error) {
    console.error('Model fetch error:', error);
    // Fall back to cached models
    return getCachedModels();
}
```

### Fallback Strategy
1. Attempt API call
2. Check cached models
3. Use default configuration
4. Log failure for monitoring

## Monitoring and Logging

### Metrics Tracked
- Model availability
- API response times
- Usage patterns
- Error rates
- Cost per model

### Logging Implementation
```typescript
function logModelUsage(modelId: string, usage: ModelUsage) {
    console.log('Model usage:', {
        modelId,
        timestamp: new Date().toISOString(),
        tokens: usage.total_tokens,
        cost: calculateCost(modelId, usage)
    });
}
```

## Best Practices

1. **Model Selection**
   - Choose appropriate models for tasks
   - Consider cost vs. capability
   - Monitor context length limits
   - Track model deprecation

2. **Performance**
   - Cache model lists
   - Implement rate limiting
   - Monitor response times
   - Optimize prompt design

3. **Security**
   - Secure API key storage
   - Implement usage limits
   - Monitor for abuse
   - Regular security audits

4. **Maintenance**
   - Regular model updates
   - Cache refreshes
   - Configuration reviews
   - Cost optimization 