# Changelog

All notable changes to the Recapio.AI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New transcript creation page with multiple input methods:
  - Text input with direct paste functionality
  - Document upload (DOC, DOCX, TXT, PDF)
  - Live audio recording
  - Media file upload (Audio/Video)
- Advanced transcript processing options:
  - Multiple output format selection
  - Cost estimation
  - Token usage tracking
- Dynamic category, type, and sub-type selection system
- Multi-language support with 12 languages
- Real-time validation for required fields
- Success/Error notification system using Material-UI Snackbar
- Database integration with Supabase for:
  - Transcript metadata
  - Content storage
  - Output request tracking

### Enhanced
- User interface improvements:
  - Modern card-based layout
  - Intuitive input method selection
  - Real-time preview functionality
  - Progress tracking
  - Responsive design
- Processing modal with:
  - Step-by-step workflow
  - Visual output type selection
  - Cost and token estimation
  - Preview capabilities

### Technical Updates
- Implemented Material-UI components throughout
- Added real-time form validation
- Enhanced error handling with user feedback
- Improved state management for form data
- Added support for multiple file formats
- Integrated Supabase for backend operations
- Added automatic redirect after successful submission

### Database Schema Updates
- Created new tables:
  - `transcripts` for main transcript data
  - `transcript_contents` for content storage
  - `transcript_types` for categorization
  - `transcript_output_requests` for processing tracking

### Security
- Implemented secure file upload handling
- Added user authentication checks
- Secured database operations with proper permissions

## [1.0.0] - 2024-XX-XX
- Initial release of Recapio.AI v4 