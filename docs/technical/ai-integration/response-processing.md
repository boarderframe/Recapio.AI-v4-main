# AI Response Processing

## Overview

This document details how Recapio processes and handles AI responses, including validation, formatting, error handling, and response optimization.

## Response Structure

### Base Response Interface
```typescript
interface AIResponse {
    id: string;
    requestId: string;
    provider: string;
    model: string;
    prompt: string;
    response: string;
    rawResponse: any;
    usage: TokenUsage;
    metadata: ResponseMetadata;
    status: ResponseStatus;
    createdAt: Date;
}

interface ResponseMetadata {
    duration: number;
    temperature: number;
    maxTokens: number;
    stopSequences?: string[];
    responseFormat?: string;
    additionalParams?: Record<string, any>;
}

enum ResponseStatus {
    SUCCESS = 'success',
    PARTIAL = 'partial',
    FAILED = 'failed',
    FILTERED = 'filtered'
}
```

## Response Processing Pipeline

### Pipeline Implementation
```typescript
class ResponseProcessor {
    async processResponse(
        rawResponse: any,
        requestContext: RequestContext
    ): Promise<AIResponse> {
        // 1. Initial validation
        this.validateRawResponse(rawResponse);
        
        // 2. Extract content
        const content = this.extractContent(rawResponse);
        
        // 3. Format response
        const formatted = await this.formatResponse(content, requestContext);
        
        // 4. Validate content
        await this.validateContent(formatted);
        
        // 5. Apply post-processing
        const processed = await this.applyPostProcessing(formatted);
        
        // 6. Create response object
        return this.createResponseObject(processed, requestContext);
    }
    
    private validateRawResponse(rawResponse: any): void {
        if (!rawResponse) {
            throw new Error('Empty response received');
        }
        // Additional validation...
    }
    
    private extractContent(rawResponse: any): string {
        // Extract based on provider
        switch (rawResponse.provider) {
            case 'openai':
                return rawResponse.choices[0].message.content;
            case 'anthropic':
                return rawResponse.content[0].text;
            case 'gemini':
                return rawResponse.response.text();
            default:
                throw new Error(`Unsupported provider: ${rawResponse.provider}`);
        }
    }
}
```

## Response Validation

### Content Validation
```typescript
class ResponseValidator {
    async validateContent(
        content: string,
        context: ValidationContext
    ): Promise<ValidationResult> {
        const results: ValidationCheck[] = [];
        
        // 1. Length check
        results.push(await this.checkLength(content, context));
        
        // 2. Format check
        results.push(await this.checkFormat(content, context));
        
        // 3. Content safety check
        results.push(await this.checkContentSafety(content));
        
        // 4. Custom validation rules
        results.push(...await this.runCustomValidations(content, context));
        
        return {
            isValid: results.every(r => r.passed),
            checks: results
        };
    }
    
    private async checkContentSafety(content: string): Promise<ValidationCheck> {
        const moderation = await openai.moderations.create({
            input: content
        });
        
        return {
            name: 'content-safety',
            passed: !moderation.results[0].flagged,
            details: moderation.results[0]
        };
    }
}

interface ValidationCheck {
    name: string;
    passed: boolean;
    details?: any;
}

interface ValidationResult {
    isValid: boolean;
    checks: ValidationCheck[];
}
```

## Response Formatting

### Format Handlers
```typescript
interface FormatHandler {
    canHandle(format: string): boolean;
    format(content: string, options: FormatOptions): Promise<string>;
}

class MarkdownFormatHandler implements FormatHandler {
    canHandle(format: string): boolean {
        return format.toLowerCase() === 'markdown';
    }
    
    async format(content: string, options: FormatOptions): Promise<string> {
        // Clean and standardize markdown
        let formatted = content
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
            
        // Apply consistent heading levels
        if (options.adjustHeadings) {
            formatted = this.adjustHeadingLevels(formatted, options.baseLevel || 1);
        }
        
        return formatted;
    }
}

class JSONFormatHandler implements FormatHandler {
    canHandle(format: string): boolean {
        return format.toLowerCase() === 'json';
    }
    
    async format(content: string, options: FormatOptions): Promise<string> {
        try {
            // Parse and re-stringify to validate and format
            const parsed = JSON.parse(content);
            return JSON.stringify(parsed, null, options.indent || 2);
        } catch (error) {
            throw new Error(`Invalid JSON content: ${error.message}`);
        }
    }
}
```

## Response Optimization

### Content Optimization
```typescript
class ResponseOptimizer {
    async optimize(
        response: AIResponse,
        options: OptimizationOptions
    ): Promise<AIResponse> {
        let optimized = response.response;
        
        // 1. Remove redundant whitespace
        optimized = this.cleanWhitespace(optimized);
        
        // 2. Optimize formatting
        optimized = await this.optimizeFormatting(optimized, options);
        
        // 3. Compress if needed
        if (options.compress) {
            optimized = await this.compressContent(optimized);
        }
        
        return {
            ...response,
            response: optimized,
            metadata: {
                ...response.metadata,
                optimized: true
            }
        };
    }
    
    private cleanWhitespace(content: string): string {
        return content
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();
    }
}
```

## Response Storage

### Storage Implementation
```typescript
class ResponseStorage {
    async saveResponse(response: AIResponse): Promise<void> {
        // 1. Prepare response for storage
        const storageObject = this.prepareForStorage(response);
        
        // 2. Store in database
        const { error } = await supabase
            .from('ai_responses')
            .insert(storageObject);
            
        if (error) throw error;
        
        // 3. Store large content separately if needed
        if (this.shouldStoreContentSeparately(response)) {
            await this.storeLargeContent(response);
        }
    }
    
    private shouldStoreContentSeparately(response: AIResponse): boolean {
        // Check if content exceeds database column size limits
        return response.response.length > 10000;
    }
    
    private async storeLargeContent(response: AIResponse): Promise<void> {
        const { error } = await supabase
            .storage
            .from('ai-responses')
            .upload(
                `${response.id}/response.txt`,
                response.response,
                {
                    contentType: 'text/plain',
                    cacheControl: '3600'
                }
            );
            
        if (error) throw error;
    }
}
```

## Response Caching

### Cache Implementation
```typescript
interface CacheConfig {
    ttl: number;
    maxSize: number;
    allowStale: boolean;
}

class ResponseCache {
    private cache: Map<string, CachedResponse>;
    private config: CacheConfig;
    
    constructor(config: CacheConfig) {
        this.cache = new Map();
        this.config = config;
    }
    
    async get(key: string): Promise<AIResponse | null> {
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        if (this.isExpired(cached)) {
            if (!this.config.allowStale) {
                this.cache.delete(key);
                return null;
            }
            // Return stale data but trigger refresh
            this.refreshCache(key, cached.response);
        }
        
        return cached.response;
    }
    
    private isExpired(cached: CachedResponse): boolean {
        return Date.now() - cached.timestamp > this.config.ttl;
    }
    
    private async refreshCache(
        key: string,
        staleResponse: AIResponse
    ): Promise<void> {
        try {
            // Fetch fresh data in background
            const fresh = await this.fetchFresh(key, staleResponse);
            this.set(key, fresh);
        } catch (error) {
            console.error('Cache refresh failed:', error);
        }
    }
}
```

## Best Practices

1. **Response Processing**
   - Validate all responses thoroughly
   - Handle provider-specific formats
   - Implement robust error handling
   - Log processing steps

2. **Content Validation**
   - Check for expected formats
   - Validate content safety
   - Implement custom rules
   - Monitor validation metrics

3. **Optimization**
   - Remove redundant content
   - Optimize for storage
   - Cache frequently used responses
   - Monitor performance impact

4. **Storage**
   - Implement efficient storage
   - Handle large responses
   - Maintain data consistency
   - Regular cleanup 