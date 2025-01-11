# Database Schema Documentation

This document is automatically generated. Do not edit manually.

Last Updated: 2025-01-11T04:50:00.221Z

## Overview

Total Tables: 19
Total Relationships: 32

## Tables

### Table of Contents

- [ai_models](#ai_models)
- [ai_providers](#ai_providers)
- [api_costs](#api_costs)
- [billing_records](#billing_records)
- [output_ai_constraints](#output_ai_constraints)
- [output_files](#output_files)
- [output_pricing](#output_pricing)
- [output_queue](#output_queue)
- [output_types](#output_types)
- [playlist_items](#playlist_items)
- [playlists](#playlists)
- [service_tiers](#service_tiers)
- [teams](#teams)
- [transcript_types](#transcript_types)
- [transcripts](#transcripts)
- [user_credits](#user_credits)
- [user_model_preferences](#user_model_preferences)
- [user_roles](#user_roles)
- [user_subscriptions](#user_subscriptions)

### ai_models

Stores information about AI models available in the system

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| capabilities | jsonb |  |  | YES |  |  |  | - |
| cost_per_token | numeric |  |  | YES |  |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| model_name | character varying | 100 |  | YES |  |  |  | - |
| provider_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `ai_providers.id`. |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| token_limit | integer |  |  | YES |  |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| version | text |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | provider_id | ai_providers(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | ai_models(id) | NO ACTION | NO ACTION | NO |

---

### ai_providers

Stores information about AI service providers (e.g., OpenAI, Anthropic)

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| description | text |  |  | YES |  |  |  | - |
| name | character varying | 100 |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | ai_providers(id) | NO ACTION | NO ACTION | NO |

---

### api_costs

Tracks API usage costs for each model interaction

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| api_type | text |  |  | YES |  |  |  | - |
| cost_per_call | numeric |  |  | YES |  |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| token_cost_multiplier | numeric |  |  | YES | 1 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | api_costs(id) | NO ACTION | NO ACTION | NO |

---

### billing_records

Records all billing transactions in the system

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| amount | numeric |  |  | YES |  |  |  | - |
| billing_date | timestamp with time zone |  |  | YES | now() |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| description | text |  |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| user_id | uuid |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | billing_records(id) | NO ACTION | NO ACTION | NO |

---

### output_ai_constraints

Defines constraints and prompts for AI model outputs

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| ai_provider_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `ai_providers.id`. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| default_model_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `ai_models.id`. |
| output_type_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `output_types.id`. |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| user_selectable | boolean |  |  | YES | true |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | output_type_id | output_types(id) | NO ACTION | NO ACTION | NO |
| FOREIGN KEY | ai_provider_id | ai_providers(id) | NO ACTION | NO ACTION | NO |
| FOREIGN KEY | default_model_id | ai_models(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | output_ai_constraints(id) | NO ACTION | NO ACTION | NO |

---

### output_files

Stores generated output files from transcripts

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| file_metadata | jsonb |  |  | YES |  |  |  | - |
| file_type | text |  |  | YES |  |  |  | - |
| file_url | text |  |  | YES |  |  |  | - |
| output_queue_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `output_queue.id`. |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | output_queue_id | output_queue(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | output_files(id) | NO ACTION | NO ACTION | NO |

---

### output_pricing

Defines credit costs for different output types

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| cost | numeric |  |  | YES |  |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| included_in_tiers | text[] |  |  | YES |  |  |  | - |
| output_type_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `output_types.id`. |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | output_type_id | output_types(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | output_pricing(id) | NO ACTION | NO ACTION | NO |

---

### output_queue

Manages the queue of outputs to be generated

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| output_type_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `output_types.id`. |
| result | jsonb |  |  | YES |  |  |  | - |
| status | text |  |  | YES | pending |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| transcript_id | uuid |  |  | YES |  |  |  | This is a Foreign Key to `transcripts.id`. |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | transcript_id | transcripts(id) | NO ACTION | NO ACTION | NO |
| FOREIGN KEY | output_type_id | output_types(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | output_queue(id) | NO ACTION | NO ACTION | NO |

---

### output_types

Defines different types of outputs that can be generated

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| component_name | text |  |  | YES |  |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| description | text |  |  | YES |  |  |  | - |
| name | character varying | 100 |  | YES |  |  |  | - |
| props | jsonb |  |  | YES |  |  |  | - |
| style | jsonb |  |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | output_types(id) | NO ACTION | NO ACTION | NO |

---

### playlist_items

Stores items within playlists

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| order_index | integer |  |  | YES |  |  |  | - |
| output_file_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `output_files.id`. |
| playlist_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `playlists.id`. |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | playlist_id | playlists(id) | NO ACTION | NO ACTION | NO |
| FOREIGN KEY | output_file_id | output_files(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | playlist_items(id) | NO ACTION | NO ACTION | NO |

---

### playlists

Manages collections of outputs

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| name | text |  |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| user_id | uuid |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | playlists(id) | NO ACTION | NO ACTION | NO |

---

### service_tiers

Defines different service tiers available

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| api_limit | integer |  |  | YES |  |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| credit_limit | integer |  |  | YES |  |  |  | - |
| description | text |  |  | YES |  |  |  | - |
| features | jsonb |  |  | YES |  |  |  | - |
| monthly_price | numeric |  |  | YES |  |  |  | - |
| name | character varying | 100 |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | service_tiers(id) | NO ACTION | NO ACTION | NO |

---

### teams

Manages team information

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| name | text |  |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | teams(id) | NO ACTION | NO ACTION | NO |

---

### transcript_types

Defines different types of transcripts

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| analysis_instructions | text |  |  | YES |  |  |  | - |
| api_parameters | jsonb |  |  | YES |  |  |  | - |
| category | character varying | 100 |  | YES |  |  |  | - |
| category_color | character varying | 50 |  | YES |  |  |  | - |
| category_icon | character varying | 50 |  | YES |  |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| json_schema | jsonb |  |  | YES |  |  |  | - |
| json_structure | jsonb |  |  | YES |  |  |  | - |
| schema_version | integer |  |  | YES | 1 |  |  | - |
| sub_type | text |  |  | YES |  |  |  | - |
| summary_prompt | text |  |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| type | character varying | 100 |  | YES |  |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | transcript_types(id) | NO ACTION | NO ACTION | NO |

---

### transcripts

Stores transcript content and metadata

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | uuid |  |  | YES |  |  | ✓ | This is a Primary Key. |
| category | text |  |  | YES |  |  |  | - |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| date_time_context | text[] |  |  | YES |  |  |  | - |
| hashtags | text[] |  |  | YES |  |  |  | - |
| key_themes | text[] |  |  | YES |  |  |  | - |
| language | text |  |  | YES |  |  |  | - |
| named_entities | text[] |  |  | YES |  |  |  | - |
| organization_id | uuid |  |  | YES |  |  |  | - |
| overall_sentiment | text |  |  | YES |  |  |  | - |
| readability_score | numeric |  |  | YES |  |  |  | - |
| schema_version | integer |  |  | YES |  |  |  | - |
| sentiment_confidence | numeric |  |  | YES |  |  |  | - |
| source_type | text |  |  | YES |  |  |  | - |
| status | text |  |  | YES |  |  |  | - |
| sub_type | text |  |  | YES |  |  |  | - |
| sub_type_specific_metadata | jsonb |  |  | YES |  |  |  | - |
| summary | text |  |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| timeline | jsonb |  |  | YES |  |  |  | - |
| title | text |  |  | YES |  |  |  | - |
| transcript_length_sentences | integer |  |  | YES |  |  |  | - |
| transcript_length_words | integer |  |  | YES |  |  |  | - |
| type | text |  |  | YES |  |  |  | - |
| universal_metadata | jsonb |  |  | YES |  |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| user_id | uuid |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | transcripts(id) | NO ACTION | NO ACTION | NO |

---

### user_credits

Tracks user credit balances

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| total_credits | integer |  |  | YES |  |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| used_credits | integer |  |  | YES |  |  |  | - |
| user_id | uuid |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| PRIMARY KEY | id | user_credits(id) | NO ACTION | NO ACTION | NO |

---

### user_model_preferences

Stores user preferences for AI models

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| preferred_model_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `ai_models.id`. |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| use_for_output_types | text[] |  |  | YES |  |  |  | - |
| user_id | uuid |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | preferred_model_id | ai_models(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | user_model_preferences(id) | NO ACTION | NO ACTION | NO |

---

### user_roles

Defines user roles in the system

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| role | text |  |  | YES |  |  |  | - |
| team_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `teams.id`. |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| user_id | uuid |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | team_id | teams(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | user_roles(id) | NO ACTION | NO ACTION | NO |

---

### user_subscriptions

Tracks user subscriptions to service tiers

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
| id | bigint |  |  | YES |  |  | ✓ | This is a Primary Key. |
| created_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| end_date | timestamp with time zone |  |  | YES |  |  |  | - |
| is_active | boolean |  |  | YES | true |  |  | - |
| start_date | timestamp with time zone |  |  | YES |  |  |  | - |
| tenant_id | uuid |  |  | YES | 00000000-0000-0000-0000-000000000000 |  |  | - |
| tier_id | bigint |  |  | YES |  |  |  | This is a Foreign Key to `service_tiers.id`. |
| updated_at | timestamp with time zone |  |  | YES | now() |  |  | - |
| user_id | uuid |  |  | YES |  |  |  | - |

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
| FOREIGN KEY | tier_id | service_tiers(id) | NO ACTION | NO ACTION | NO |
| PRIMARY KEY | id | user_subscriptions(id) | NO ACTION | NO ACTION | NO |

---

## All Relationships

### Primary Keys

- `ai_providers`: Primary key on column `id`
- `user_credits`: Primary key on column `id`
- `output_files`: Primary key on column `id`
- `user_model_preferences`: Primary key on column `id`
- `transcript_types`: Primary key on column `id`
- `service_tiers`: Primary key on column `id`
- `user_subscriptions`: Primary key on column `id`
- `output_queue`: Primary key on column `id`
- `api_costs`: Primary key on column `id`
- `ai_models`: Primary key on column `id`
- `teams`: Primary key on column `id`
- `output_pricing`: Primary key on column `id`
- `output_types`: Primary key on column `id`
- `user_roles`: Primary key on column `id`
- `output_ai_constraints`: Primary key on column `id`
- `transcripts`: Primary key on column `id`
- `playlists`: Primary key on column `id`
- `playlist_items`: Primary key on column `id`
- `billing_records`: Primary key on column `id`

### Foreign Keys

- `output_files.output_queue_id` → `output_queue.id`
- `user_model_preferences.preferred_model_id` → `ai_models.id`
- `user_subscriptions.tier_id` → `service_tiers.id`
- `output_queue.transcript_id` → `transcripts.id`
- `output_queue.output_type_id` → `output_types.id`
- `ai_models.provider_id` → `ai_providers.id`
- `output_pricing.output_type_id` → `output_types.id`
- `user_roles.team_id` → `teams.id`
- `output_ai_constraints.output_type_id` → `output_types.id`
- `output_ai_constraints.ai_provider_id` → `ai_providers.id`
- `output_ai_constraints.default_model_id` → `ai_models.id`
- `playlist_items.playlist_id` → `playlists.id`
- `playlist_items.output_file_id` → `output_files.id`

