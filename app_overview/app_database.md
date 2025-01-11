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
1. **Multi-Tenancy**:
   - Use `tenant_id` consistently across tables for tenant isolation.
2. **Foreign Keys**:
   - Enforce relationships and enable cascading deletions where applicable.
3. **Indexing**:
   - Index key columns like `tenant_id` and `user_id` for optimized queries.
4. **JSONB Fields**:
   - Use for flexible data storage where schema may vary, such as `metadata` and `api_parameters`.
5. **Auditing and Tracking**:
   - Tables like `billing_records` and `user_credits` ensure tracking of usage and costs.

### Relationships Overview

#### High-Level ER Diagram Summary

- **Users**:
  - Linked to `user_roles` for team roles.
  - Linked to `user_credits` and `user_subscriptions` for tracking resources and subscriptions.

- **Teams**:
  - Connected to users via `user_roles`.

- **Transcripts**:
  - Linked to `transcript_types` for schema definitions.
  - Outputs generated from transcripts are linked via `output_files`.

- **Outputs and Playlists**:
  - Outputs categorized by `output_types`.
  - Playlists provide organization and ordering of outputs.

- **AI Models and Preferences**:
  - `ai_models` linked to `ai_providers`.
  - `user_model_preferences` capture user-specific settings for models.

- **Service Tiers and Billing**:
  - `service_tiers` define features and limits.
  - `user_subscriptions` track active tiers per user.
  - `billing_records` log financial transactions and overages.

This schema ensures scalability, traceability, and flexibility in integrating new features or AI models while maintaining efficient performance.

