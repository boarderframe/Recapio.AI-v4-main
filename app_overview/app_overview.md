## Application Overview for AI Coding Agent

### Purpose of the Application
This application is a transcript processing and insights generation tool designed to provide users with powerful AI-driven outputs. Users can generate transcripts, analyze content, and obtain structured outputs like one-pagers, slides, bytes, anchors, and playlists. The application also integrates robust team management, billing, and subscription functionalities to cater to various user tiers and needs.

### Core Functionalities

#### 1. **AI Models and Providers**
- **Purpose**: Manage available AI models and their configurations.
- **How it works**:
  - AI Providers represent external services like OpenAI, Anthropic, or Google.
  - AI Models are tied to providers and define specifics like token limits, costs, and capabilities.
  - Users can set preferences for AI providers and models.

#### 2. **Cost Management**
- **Purpose**: Track API usage costs for transparency and billing.
- **How it works**:
  - Each API call’s cost is calculated based on the model used, token limits, and output type.
  - Costs are tracked per tenant and user.

#### 3. **Billing Records**
- **Purpose**: Manage user billing history.
- **How it works**:
  - Logs billing events such as credit purchases or overages.
  - Associated with user subscriptions and service tiers.

#### 4. **Outputs**
- **Purpose**: Generate structured content like one-pagers, slides, bytes, and anchors.
- **How it works**:
  - Outputs are linked to specific transcript processing tasks.
  - Users can organize outputs into playlists for easy retrieval.

#### 5. **Playlists**
- **Purpose**: Organize outputs into reusable collections.
- **How it works**:
  - Each playlist can include multiple outputs, with metadata like order and type.

#### 6. **Service Tiers**
- **Purpose**: Define access levels and pricing for users.
- **How it works**:
  - Each tier has features, credit limits, and API call allowances.
  - Users subscribe to a tier to gain access to features.

#### 7. **Teams**
- **Purpose**: Enable collaborative work environments.
- **How it works**:
  - Teams are tied to tenants, and each team can have multiple members with roles.
  - Roles include admin, viewer, or custom roles as defined by the tenant.

#### 8. **Transcripts and Transcript Types**
- **Purpose**: Handle input content and define processing schemas.
- **How it works**:
  - Transcripts are the primary input processed by AI.
  - Transcript types define schema and instructions for specialized processing.

#### 9. **User Credits**
- **Purpose**: Manage usage and API access limits.
- **How it works**:
  - Tracks available and used credits per user.
  - Ensures API usage stays within subscription limits.

#### 10. **User Model Preferences**
- **Purpose**: Allow users to customize AI settings.
- **How it works**:
  - Users can define preferred models for specific output types.
  - Preferences are saved per user and tenant.

#### 11. **User Roles**
- **Purpose**: Manage permissions and access.
- **How it works**:
  - Defines roles like admin or viewer within a team.
  - Role determines access to features and data.

#### 12. **User Subscriptions**
- **Purpose**: Manage access to service tiers.
- **How it works**:
  - Tracks active subscriptions, start and end dates, and tier details.
  - Ensures access aligns with subscription level.

---

## Database Overview for AI Coding Agent

### Core Tables and Relationships

#### 1. **AI Models and Providers**
- **Tables**:
  - `ai_providers`: Stores provider details (e.g., name, description).
  - `ai_models`: Stores model configurations (e.g., token limit, cost, provider).
- **Relationships**:
  - `ai_models.provider_id` references `ai_providers.id`.

#### 2. **Cost Management and Billing**
- **Tables**:
  - `api_costs`: Tracks costs per API type.
  - `billing_records`: Logs user billing events.
- **Relationships**:
  - `billing_records.user_id` references `auth.users.id`.

#### 3. **Outputs and Playlists**
- **Tables**:
  - `output_types`: Stores available output types.
  - `output_files`: Links processed outputs to file metadata.
  - `playlists`: Stores playlists.
  - `playlist_items`: Links playlists to outputs.
- **Relationships**:
  - `playlist_items.playlist_id` references `playlists.id`.
  - `playlist_items.output_file_id` references `output_files.id`.

#### 4. **Service Tiers and Subscriptions**
- **Tables**:
  - `service_tiers`: Stores tier details.
  - `user_subscriptions`: Tracks user subscriptions.
- **Relationships**:
  - `user_subscriptions.tier_id` references `service_tiers.id`.
  - `user_subscriptions.user_id` references `auth.users.id`.

#### 5. **Teams and Roles**
- **Tables**:
  - `teams`: Stores team details.
  - `user_roles`: Tracks user roles within teams.
- **Relationships**:
  - `user_roles.team_id` references `teams.id`.
  - `user_roles.user_id` references `auth.users.id`.

#### 6. **Transcripts and Metadata**
- **Tables**:
  - `transcripts`: Stores transcript data.
  - `transcript_types`: Defines processing schemas.
- **Relationships**:
  - `transcripts.type` references `transcript_types.type`.
  - `transcripts.sub_type` references `transcript_types.sub_type`.

#### 7. **User Credits**
- **Tables**:
  - `user_credits`: Tracks credit balances per user.
- **Relationships**:
  - `user_credits.user_id` references `auth.users.id`.

#### 8. **User Preferences and Constraints**
- **Tables**:
  - `user_model_preferences`: Stores user AI model preferences.
  - `output_ai_constraints`: Restricts AI model usage per output type.
- **Relationships**:
  - `user_model_preferences.preferred_model_id` references `ai_models.id`.
  - `output_ai_constraints.output_type_id` references `output_types.id`.

### General Guidelines
1. Ensure `tenant_id` is consistently used across tables for multi-tenancy.
2. Foreign key constraints enforce relationships and cascading deletions.
3. Index columns like `tenant_id` and `user_id` for performance optimization.
4. Use JSONB fields (e.g., for metadata) for flexible data storage where schema may vary.

This comprehensive setup aligns database structure with application needs, ensuring robust functionality and scalability.

