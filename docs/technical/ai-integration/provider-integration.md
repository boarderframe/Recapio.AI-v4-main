# AI Provider Integration

## Overview

This document details how Recapio integrates with various AI providers, including authentication, API usage, rate limiting, and error handling.

## Provider Setup

### OpenAI Setup
```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID, // Optional
    maxRetries: 3,
    timeout: 30000
});
```

### Google Gemini Setup
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
```

### Anthropic Setup
```typescript
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
```

## API Integration

### Chat Completion
```typescript
async function getChatCompletion(
    provider: string,
    messages: Message[],
    options: CompletionOptions
): Promise<string> {
    switch (provider) {
        case 'openai':
            return await getOpenAIChatCompletion(messages, options);
        case 'gemini':
            return await getGeminiChatCompletion(messages, options);
        case 'anthropic':
            return await getAnthropicChatCompletion(messages, options);
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

// OpenAI Implementation
async function getOpenAIChatCompletion(
    messages: Message[],
    options: CompletionOptions
): Promise<string> {
    const completion = await openai.chat.completions.create({
        model: options.model || 'gpt-4',
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens,
        stream: options.stream || false
    });
    return completion.choices[0].message.content;
}

// Gemini Implementation
async function getGeminiChatCompletion(
    messages: Message[],
    options: CompletionOptions
): Promise<string> {
    const model = genAI.getGenerativeModel({ model: options.model || 'gemini-pro' });
    const chat = model.startChat({
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens
    });
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    return result.response.text();
}

// Anthropic Implementation
async function getAnthropicChatCompletion(
    messages: Message[],
    options: CompletionOptions
): Promise<string> {
    const completion = await anthropic.messages.create({
        model: options.model || 'claude-3-opus-20240229',
        max_tokens: options.maxTokens,
        temperature: options.temperature || 0.7,
        messages: messages.map(m => ({
            role: m.role,
            content: m.content
        }))
    });
    return completion.content[0].text;
}
```

## Rate Limiting

### Implementation
```typescript
import { RateLimiter } from 'limiter';

// Configure rate limiters for each provider
const rateLimiters = {
    openai: new RateLimiter({
        tokensPerInterval: 3000,
        interval: 'minute'
    }),
    gemini: new RateLimiter({
        tokensPerInterval: 60,
        interval: 'minute'
    }),
    anthropic: new RateLimiter({
        tokensPerInterval: 100,
        interval: 'minute'
    })
};

// Rate limiting middleware
async function checkRateLimit(provider: string): Promise<void> {
    const limiter = rateLimiters[provider];
    if (!limiter) {
        throw new Error(`No rate limiter configured for provider: ${provider}`);
    }
    
    const hasToken = await limiter.tryRemoveTokens(1);
    if (!hasToken) {
        throw new Error(`Rate limit exceeded for provider: ${provider}`);
    }
}
```

## Error Handling

### Error Types
```typescript
enum AIProviderErrorType {
    RATE_LIMIT = 'RATE_LIMIT',
    AUTHENTICATION = 'AUTHENTICATION',
    INVALID_REQUEST = 'INVALID_REQUEST',
    SERVER_ERROR = 'SERVER_ERROR',
    TIMEOUT = 'TIMEOUT',
    UNKNOWN = 'UNKNOWN'
}

interface AIProviderError extends Error {
    type: AIProviderErrorType;
    provider: string;
    statusCode?: number;
    retryAfter?: number;
}
```

### Error Handler
```typescript
function handleProviderError(error: any, provider: string): AIProviderError {
    if (error.response?.status === 429) {
        return {
            name: 'AIProviderError',
            message: 'Rate limit exceeded',
            type: AIProviderErrorType.RATE_LIMIT,
            provider,
            statusCode: 429,
            retryAfter: parseInt(error.response.headers['retry-after'] || '60')
        };
    }
    
    // Handle other error types...
    return {
        name: 'AIProviderError',
        message: error.message || 'Unknown error',
        type: AIProviderErrorType.UNKNOWN,
        provider
    };
}
```

## Cost Management

### Cost Tracking
```typescript
interface TokenUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

function calculateCost(
    provider: string,
    model: string,
    usage: TokenUsage
): number {
    const rates = getCostRates(provider, model);
    return (
        usage.prompt_tokens * rates.prompt +
        usage.completion_tokens * rates.completion
    );
}

// Track usage in database
async function logUsage(
    provider: string,
    model: string,
    usage: TokenUsage,
    cost: number
): Promise<void> {
    await db.insert('usage_logs').values({
        provider,
        model,
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        cost,
        timestamp: new Date()
    });
}
```

## Security

### API Key Management
- Store API keys in environment variables
- Rotate keys regularly
- Use different keys for development/production
- Monitor key usage for suspicious activity

### Request Validation
```typescript
function validateRequest(request: AIRequest): void {
    // Check for required fields
    if (!request.provider || !request.model) {
        throw new Error('Missing required fields');
    }
    
    // Validate content length
    if (request.content.length > MAX_CONTENT_LENGTH) {
        throw new Error('Content exceeds maximum length');
    }
    
    // Check for prohibited content
    if (containsProhibitedContent(request.content)) {
        throw new Error('Request contains prohibited content');
    }
}
```

## Monitoring

### Health Checks
```typescript
async function checkProviderHealth(provider: string): Promise<boolean> {
    try {
        switch (provider) {
            case 'openai':
                await openai.models.list();
                break;
            case 'gemini':
                await genAI.getGenerativeModel({ model: 'gemini-pro' });
                break;
            case 'anthropic':
                await anthropic.messages.create({
                    model: 'claude-3-opus-20240229',
                    max_tokens: 1,
                    messages: [{ role: 'user', content: 'test' }]
                });
                break;
        }
        return true;
    } catch (error) {
        console.error(`Health check failed for ${provider}:`, error);
        return false;
    }
}
```

### Performance Monitoring
```typescript
async function trackAPIPerformance(
    provider: string,
    operation: string,
    startTime: number
): Promise<void> {
    const duration = Date.now() - startTime;
    await db.insert('api_metrics').values({
        provider,
        operation,
        duration,
        timestamp: new Date()
    });
}
```

## Best Practices

1. **API Usage**
   - Implement retry logic with exponential backoff
   - Use streaming for long responses
   - Cache responses when appropriate
   - Monitor token usage

2. **Error Handling**
   - Implement comprehensive error types
   - Log errors with context
   - Provide meaningful error messages
   - Handle rate limits gracefully

3. **Security**
   - Validate all inputs
   - Sanitize outputs
   - Monitor for abuse
   - Regular security audits

4. **Performance**
   - Implement request queuing
   - Use connection pooling
   - Monitor response times
   - Optimize prompt design 