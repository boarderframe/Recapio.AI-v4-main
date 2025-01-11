# AI Agent Instructions
Before proceeding with development tasks, AI agents should:
1. Read and analyze all files in the `app_overview` directory to understand:
   - System architecture and design decisions
   - Database schema and relationships
   - API structure and endpoints
   - Authentication and authorization flow
   - Business logic and requirements
2. After gaining full context, review this plan document to:
   - Determine completed phases and tasks
   - Identify current focus and priorities
   - Plan next implementation steps

# Recapio.AI Development Execution Plan

## Phase 1: Database and API Layer ✓
### 1. Database Connection and Validation ✓
#### Initial Setup ✓
1. **Database Connection Setup** ✓
   - Configure Supabase client with proper credentials ✓
   - Setup environment variables for database connection ✓
   - Implement connection pooling for optimal performance ✓
   - Create connection test utilities ✓

2. **Database Health Check** ✓
   - Create health check endpoints ✓
   - Implement connection monitoring ✓
   - Setup automatic reconnection handling ✓
   - Add logging for connection events ✓

#### Table Validation and Setup ✓
1. **Core Tables Verification** ✓
   - Verify existence and structure of all tables ✓
     - `ai_providers` ✓
     - `ai_models` ✓
     - `api_costs` ✓
     - `billing_records` ✓
     - `output_types` ✓
     - `output_files` ✓
     - `playlists` ✓
     - `playlist_items` ✓
     - `service_tiers` ✓
     - `user_subscriptions` ✓
     - `teams` ✓
     - `user_roles` ✓
     - `transcripts` ✓
     - `transcript_types` ✓
     - `user_credits` ✓
     - `user_model_preferences` ✓
     - `output_ai_constraints` ✓

2. **Index Verification** ✓
   - Verify primary keys ✓
   - Check foreign key constraints ✓
   - Validate index optimization for common queries ✓
   - Ensure proper multi-tenant isolation via `tenant_id` ✓

### 2. Core Database Operations ✓
#### Basic CRUD Operations ✓
1. **Read Operations** ✓
   - Implement paginated queries for all tables ✓
   - Create filtered query builders ✓
   - Setup efficient join operations ✓
   - Implement search functionality ✓

2. **Insert Operations** ✓
   - Create validation middleware ✓
   - Implement transaction handling ✓
   - Setup automatic timestamp handling ✓
   - Add tenant isolation middleware ✓

3. **Update Operations** ✓
   - Implement optimistic locking ✓
   - Create partial update handlers ✓
   - Setup audit logging ✓
   - Add validation checks ✓

4. **Delete Operations** ✓
   - Implement soft delete functionality ✓
   - Create cascade delete handlers ✓
   - Setup archive procedures ✓
   - Add deletion validation ✓

### 3. API Layer Development ✓
1. **Core API Infrastructure** ✓
   - Setup Express application ✓
   - Implement middleware stack ✓
   - Create error handling system ✓
   - Add request validation ✓

2. **Resource Endpoints** ✓
   - Implement transcript endpoints ✓
   - Create team endpoints ✓
   - Add user endpoints ✓
   - Setup role endpoints ✓

3. **API Security** ✓
   - Implement authentication middleware ✓
   - Setup authorization guards ✓
   - Add rate limiting ✓
   - Configure CORS ✓

## Phase 2: Authentication and Authorization ✓
1. **User Authentication** ✓
   - Implement JWT authentication ✓
   - Setup OAuth providers ✓
   - Create login/signup flows ✓
   - Add password reset functionality ✓

2. **Authorization System** ✓
   - Implement role-based access control ✓
   - Setup permission system ✓
   - Create tenant isolation ✓
   - Add audit logging ✓

3. **User Management** ✓
   - User profile endpoints ✓
   - User settings management ✓
   - User roles and permissions ✓
   - Team membership management ✓

## Phase 3: Core Business Logic (Current Focus)
1. **File Upload System** (Next Priority)
   - Setup S3 bucket configuration
   - Implement file upload endpoints
   - Add file validation and processing
   - Create file management system

2. **Transcript Processing**
   - Setup processing queue
   - Implement job scheduler
   - Add error recovery
   - Create progress tracking

3. **AI Integration**
   - Setup AI provider connections
   - Implement model selection
   - Create cost tracking
   - Add performance monitoring

4. **Output Generation**
   - Implement format converters
   - Setup export system
   - Create template engine
   - Add batch processing

## Phase 4: Billing and Credits
1. **Payment Processing**
   - Integrate Stripe
   - Setup subscription plans
   - Implement usage tracking
   - Add invoicing system

2. **Credit System**
   - Implement credit allocation
   - Setup credit usage tracking
   - Add credit purchase flow
   - Create credit reports

## Next Immediate Steps
1. **File Upload System**
   - Configure S3 bucket and policies
   - Create upload endpoints with presigned URLs
   - Implement file type validation
   - Add progress tracking

2. **Processing Queue**
   - Setup Redis for job queue
   - Implement job processor
   - Add retry mechanism
   - Create monitoring dashboard

3. **Error Handling**
   - Implement comprehensive error tracking
   - Setup error reporting
   - Add recovery mechanisms
   - Create error notifications 