## Key Functions and API Calls for Recapio.ai

This document outlines the key functions, API calls, and tracking mechanisms that need to be developed to support Recapio.ai’s features, ensuring smooth user experiences, comprehensive functionality, and efficient tracking.

### 1. **API Call Framework**
- **Purpose**: Enable dynamic interaction between the frontend and backend, facilitating various application functionalities.
- **Key Functions**:
  - **Universal Metadata API**: Processes transcripts to extract universal metadata.
    - Input: Transcript ID, type.
    - Output: JSON containing universal metadata.
  - **Sub-Type Specific Processing API**: Processes transcripts with sub-type-specific schemas.
    - Input: Transcript ID, sub-type.
    - Output: JSON with detailed sub-type-specific metadata.
  - **Output Generation API**:
    - Types: One-pagers, slides, bytes, anchors.
    - Input: Metadata, user-selected parameters.
    - Output: Generated output file or link.
  - **AI Model Selection API**:
    - Enables users to select and set preferred AI models for specific tasks.
    - Tracks token usage and cost by AI provider and model.

### 2. **Tracking and Status Management**
- **Purpose**: Track progress, ensure transparency, and maintain user trust.
- **Key Functions**:
  - **Output Queue Management**:
    - Tracks processing status: `pending`, `in_progress`, `completed`, `failed`.
    - Logs timestamps for each status change.
  - **API Call Logs**:
    - Tracks API call type, cost, tokens used, and response status.
    - Stores logs for audit purposes and analytics.
  - **User Activity Logs**:
    - Tracks user actions such as transcript uploads, model changes, and output generation.
    - Provides insights into usage patterns.

### 3. **User Credit System**
- **Purpose**: Manage and monitor user credits for API usage.
- **Key Functions**:
  - **Credit Deduction**:
    - Deducts credits based on API call cost.
    - Updates `user_credits` table.
  - **Credit Top-Up**:
    - Allows users to purchase credits.
    - Logs billing records and updates credit balance.
  - **Credit Monitoring**:
    - Tracks credit usage by user and tenant.
    - Alerts users when credit balance is low.

### 4. **Service Tier Management**
- **Purpose**: Define and enforce user access levels.
- **Key Functions**:
  - **Tier Assignment**:
    - Assigns service tiers to users based on subscription.
    - Enforces tier limits (e.g., API calls, credit thresholds).
  - **Tier Upgrade/Downgrade**:
    - Handles subscription changes and updates user access.
  - **Feature Access Control**:
    - Enables/disables features based on the user's tier.

### 5. **AI Model Management**
- **Purpose**: Manage AI providers, models, and user preferences.
- **Key Functions**:
  - **Model Registry**:
    - Stores available AI models and their metadata (e.g., token limits, cost).
    - Tracks versions for model updates.
  - **Provider Constraints**:
    - Defines allowable models for specific output types.
    - Implements default models where user selection isn’t allowed.
  - **User Preferences**:
    - Saves user-selected models for specific tasks.
    - Overrides default models where applicable.

### 6. **Output Management**
- **Purpose**: Process and store user outputs.
- **Key Functions**:
  - **Output File Storage**:
    - Saves generated outputs with metadata.
    - Stores URLs for easy retrieval.
  - **Playlists**:
    - Organizes outputs into playlists.
    - Allows users to reorder and categorize outputs.
  - **File Metadata**:
    - Tracks file type, size, creation date, and associated transcript.

### 7. **Dashboard and Analytics**
- **Purpose**: Provide actionable insights to users and admins.
- **Key Functions**:
  - **User Dashboards**:
    - Displays usage statistics, credit balance, and recent activity.
  - **Admin Dashboards**:
    - Tracks system-wide API costs, user activity, and usage trends.
    - Provides tenant-level insights for multi-tenancy.

### 8. **Playlist and Library Management**
- **Purpose**: Enhance user experience by organizing outputs.
- **Key Functions**:
  - **Playlist Creation**:
    - Users can create, name, and manage playlists.
  - **File Addition/Removal**:
    - Allows adding or removing outputs from playlists.
  - **Playback Integration**:
    - Enables sequential playback for outputs like bytes and anchors.

### 9. **Billing and Reporting**
- **Purpose**: Track financial transactions and generate reports.
- **Key Functions**:
  - **Billing Records**:
    - Logs all transactions, including credit purchases and overages.
    - Links to user subscriptions and API usage.
  - **Reports**:
    - Generates detailed reports on user activity, API costs, and subscription revenue.
  - **Notifications**:
    - Sends alerts for overdue payments or subscription expirations.

### 10. **Notification and Alert System**
- **Purpose**: Keep users informed about important events.
- **Key Functions**:
  - **Email and In-App Notifications**:
    - Alerts for completed outputs, low credits, or failed tasks.
  - **Admin Alerts**:
    - Flags issues like high API costs or service outages.

### Relationships Across Functions
1. **Integration with User Subscriptions**:
   - Ensures API calls and outputs align with subscription limits.
   - Tracks tier-based feature access.
2. **Multi-Tenancy Management**:
   - Uses `tenant_id` to isolate data between clients.
   - Implements role-based access for teams.
3. **End-to-End Output Workflow**:
   - Combines transcript processing, metadata generation, and output storage.
   - Links outputs to playlists for enhanced user organization.

This structure supports robust application functionality, ensuring scalability and seamless user interactions.

