# AI Prompt Management

## Overview

This document details Recapio's prompt management system, including prompt templates, versioning, optimization, and testing.

## Prompt Structure

### Base Prompt Template
```typescript
interface PromptTemplate {
    id: string;
    version: string;
    name: string;
    description: string;
    template: string;
    variables: string[];
    defaultValues?: Record<string, string>;
    maxTokens?: number;
    temperature?: number;
    provider?: string;
    model?: string;
    category: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
```

### Example Templates

#### Transcript Analysis
```typescript
const transcriptAnalysisPrompt: PromptTemplate = {
    id: 'transcript-analysis-v1',
    version: '1.0.0',
    name: 'Transcript Analysis',
    description: 'Analyzes meeting transcripts for key points and action items',
    template: `
        Analyze the following meeting transcript and extract:
        1. Key Discussion Points
        2. Action Items
        3. Decisions Made
        4. Follow-up Tasks
        
        Transcript:
        {{transcript}}
        
        Please format the response as follows:
        # Key Discussion Points
        - Point 1
        - Point 2
        
        # Action Items
        - [ ] Action 1 (Assignee: {{assignee}})
        - [ ] Action 2 (Assignee: TBD)
        
        # Decisions Made
        - Decision 1
        - Decision 2
        
        # Follow-up Tasks
        - Task 1 (Due: {{dueDate}})
        - Task 2 (Due: TBD)
    `,
    variables: ['transcript', 'assignee', 'dueDate'],
    defaultValues: {
        assignee: 'Unassigned',
        dueDate: 'Next Meeting'
    },
    maxTokens: 1000,
    temperature: 0.3,
    provider: 'anthropic',
    model: 'claude-3-opus-20240229',
    category: 'analysis',
    tags: ['meeting', 'transcript', 'analysis'],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
};
```

#### Content Summary
```typescript
const contentSummaryPrompt: PromptTemplate = {
    id: 'content-summary-v1',
    version: '1.0.0',
    name: 'Content Summary',
    description: 'Generates concise summaries of content',
    template: `
        Summarize the following content in {{format}} format:
        
        Content:
        {{content}}
        
        Length: {{length}} words
        Style: {{style}}
        
        Additional Instructions:
        {{instructions}}
    `,
    variables: ['content', 'format', 'length', 'style', 'instructions'],
    defaultValues: {
        format: 'bullet points',
        length: '200',
        style: 'professional',
        instructions: 'Focus on key points'
    },
    maxTokens: 500,
    temperature: 0.5,
    provider: 'openai',
    model: 'gpt-4',
    category: 'summary',
    tags: ['summary', 'content', 'analysis'],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
};
```

## Prompt Management System

### Template Storage
```typescript
interface PromptTemplateStore {
    getTemplate(id: string, version?: string): Promise<PromptTemplate>;
    saveTemplate(template: PromptTemplate): Promise<void>;
    listTemplates(category?: string): Promise<PromptTemplate[]>;
    deleteTemplate(id: string, version: string): Promise<void>;
}

class DatabasePromptStore implements PromptTemplateStore {
    async getTemplate(id: string, version?: string): Promise<PromptTemplate> {
        const query = supabase
            .from('prompt_templates')
            .select('*')
            .eq('id', id);
            
        if (version) {
            query.eq('version', version);
        } else {
            query.order('version', { ascending: false }).limit(1);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data[0];
    }
    
    // Implementation of other methods...
}
```

### Template Rendering
```typescript
class PromptRenderer {
    static render(
        template: PromptTemplate,
        variables: Record<string, string>
    ): string {
        let rendered = template.template;
        const missingVars: string[] = [];
        
        template.variables.forEach(varName => {
            const value = variables[varName] || template.defaultValues?.[varName];
            if (!value) {
                missingVars.push(varName);
            } else {
                rendered = rendered.replace(
                    new RegExp(`{{${varName}}}`, 'g'),
                    value
                );
            }
        });
        
        if (missingVars.length > 0) {
            throw new Error(
                `Missing required variables: ${missingVars.join(', ')}`
            );
        }
        
        return rendered;
    }
}
```

## Prompt Versioning

### Version Control
```typescript
interface PromptVersion {
    id: string;
    version: string;
    changes: string[];
    author: string;
    timestamp: Date;
    template: PromptTemplate;
}

class PromptVersionControl {
    async createVersion(
        template: PromptTemplate,
        changes: string[]
    ): Promise<void> {
        const version: PromptVersion = {
            id: template.id,
            version: this.incrementVersion(template.version),
            changes,
            author: getCurrentUser(),
            timestamp: new Date(),
            template
        };
        
        await this.saveVersion(version);
    }
    
    private incrementVersion(version: string): string {
        const [major, minor, patch] = version.split('.').map(Number);
        return `${major}.${minor}.${patch + 1}`;
    }
}
```

## Prompt Testing

### Test Cases
```typescript
interface PromptTestCase {
    id: string;
    templateId: string;
    version: string;
    variables: Record<string, string>;
    expectedOutput: string;
    actualOutput?: string;
    passed?: boolean;
    executionTime?: number;
    timestamp: Date;
}

class PromptTester {
    async runTest(testCase: PromptTestCase): Promise<void> {
        const template = await promptStore.getTemplate(
            testCase.templateId,
            testCase.version
        );
        
        const startTime = Date.now();
        const rendered = PromptRenderer.render(template, testCase.variables);
        const response = await this.getAIResponse(rendered, template);
        const endTime = Date.now();
        
        testCase.actualOutput = response;
        testCase.executionTime = endTime - startTime;
        testCase.passed = this.compareOutputs(
            response,
            testCase.expectedOutput
        );
        
        await this.saveTestResult(testCase);
    }
}
```

## Prompt Optimization

### Token Usage Analysis
```typescript
interface TokenAnalysis {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
}

class PromptOptimizer {
    async analyzeTokenUsage(
        template: PromptTemplate,
        variables: Record<string, string>
    ): Promise<TokenAnalysis> {
        const rendered = PromptRenderer.render(template, variables);
        const tokenCount = await this.countTokens(rendered);
        const cost = this.calculateCost(tokenCount, template.provider, template.model);
        
        return {
            promptTokens: tokenCount,
            completionTokens: 0, // Updated after completion
            totalTokens: tokenCount,
            cost
        };
    }
}
```

### Performance Tracking
```typescript
interface PromptPerformance {
    templateId: string;
    version: string;
    averageTokens: number;
    averageLatency: number;
    successRate: number;
    costPerUse: number;
    usageCount: number;
}

class PerformanceTracker {
    async trackExecution(
        template: PromptTemplate,
        startTime: number,
        tokenUsage: TokenAnalysis
    ): Promise<void> {
        const duration = Date.now() - startTime;
        
        await db.insert('prompt_executions').values({
            templateId: template.id,
            version: template.version,
            duration,
            tokenUsage,
            timestamp: new Date()
        });
    }
}
```

## Best Practices

1. **Template Design**
   - Keep prompts focused and specific
   - Use clear, consistent formatting
   - Include example responses
   - Document expected outputs

2. **Version Control**
   - Track all changes
   - Document improvements
   - Maintain backwards compatibility
   - Test new versions thoroughly

3. **Testing**
   - Create comprehensive test cases
   - Validate outputs automatically
   - Monitor performance metrics
   - Test edge cases

4. **Optimization**
   - Monitor token usage
   - Track response quality
   - Optimize for cost
   - Regular performance reviews 