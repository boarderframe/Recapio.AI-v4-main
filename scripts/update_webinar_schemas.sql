-- Update Platform Tour sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['features_highlighted', 'user_feedback', 'integration_options'],
            'properties', jsonb_build_object(
                'features_highlighted', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object('type', 'string'),
                    'description', 'Key features demonstrated during the platform tour'
                ),
                'user_feedback', jsonb_build_object(
                    'type', 'string',
                    'description', 'Aggregated feedback from users during the demo'
                ),
                'integration_options', jsonb_build_object(
                    'type', 'string',
                    'description', 'Available integration options discussed'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Product Demo' AND sub_type = 'Platform Tour';

-- Update Technical Walkthrough sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['features_demonstrated', 'technical_requirements', 'target_audience'],
            'properties', jsonb_build_object(
                'features_demonstrated', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object('type', 'string'),
                    'description', 'Technical features demonstrated in detail'
                ),
                'technical_requirements', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object('type', 'string'),
                    'description', 'Technical prerequisites and system requirements'
                ),
                'target_audience', jsonb_build_object(
                    'type', 'string',
                    'description', 'Intended audience for the technical walkthrough'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Product Demo' AND sub_type = 'Technical Walkthrough';

-- Update Use Case Demonstration sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['use_case_description', 'product_features', 'audience_reactions'],
            'properties', jsonb_build_object(
                'use_case_description', jsonb_build_object(
                    'type', 'string',
                    'description', 'Detailed description of the use case scenario'
                ),
                'product_features', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object('type', 'string'),
                    'description', 'Product features relevant to the use case'
                ),
                'audience_reactions', jsonb_build_object(
                    'type', 'string',
                    'description', 'Audience response and engagement during the demonstration'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Product Demo' AND sub_type = 'Use Case Demonstration';

-- Update Group Exercise sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['exercise_topics', 'participant_feedback', 'facilitator_notes'],
            'properties', jsonb_build_object(
                'exercise_topics', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object('type', 'string'),
                    'description', 'Topics covered in the group exercise'
                ),
                'participant_feedback', jsonb_build_object(
                    'type', 'string',
                    'description', 'Feedback and insights from exercise participants'
                ),
                'facilitator_notes', jsonb_build_object(
                    'type', 'string',
                    'description', 'Notes and observations from the exercise facilitator'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Workshop' AND sub_type = 'Group Exercise';

-- Update Hands-on Training sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['skills_practiced', 'tools_used', 'trainer_feedback'],
            'properties', jsonb_build_object(
                'skills_practiced', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object('type', 'string'),
                    'description', 'Skills practiced during the training session'
                ),
                'tools_used', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object('type', 'string'),
                    'description', 'Tools and technologies used in the training'
                ),
                'trainer_feedback', jsonb_build_object(
                    'type', 'string',
                    'description', 'Feedback and assessment from the trainer'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Workshop' AND sub_type = 'Hands-on Training';

-- Update Interactive Session sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['participant_engagement', 'learning_outcomes', 'tools_used'],
            'properties', jsonb_build_object(
                'participant_engagement', jsonb_build_object(
                    'type', 'string',
                    'description', 'Level and quality of participant engagement'
                ),
                'learning_outcomes', jsonb_build_object(
                    'type', 'string',
                    'description', 'Achieved learning objectives and outcomes'
                ),
                'tools_used', jsonb_build_object(
                    'type', 'string',
                    'description', 'Interactive tools and methods used in the session'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Workshop' AND sub_type = 'Interactive Session';

-- Update Practical Application sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['techniques_used', 'real_world_examples', 'participant_feedback'],
            'properties', jsonb_build_object(
                'techniques_used', jsonb_build_object(
                    'type', 'string',
                    'description', 'Techniques and methodologies applied'
                ),
                'real_world_examples', jsonb_build_object(
                    'type', 'string',
                    'description', 'Real-world examples and case studies discussed'
                ),
                'participant_feedback', jsonb_build_object(
                    'type', 'string',
                    'description', 'Feedback from participants on practical applications'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Workshop' AND sub_type = 'Practical Application';

-- Update Skill Building sub-type
UPDATE transcript_types
SET json_schema = jsonb_build_object(
    'type', 'object',
    'required', ARRAY['ai_title', 'summary', 'themes', 'hashtags', 'sentiment_analysis', 'category_specific_data'],
    'properties', jsonb_build_object(
        'ai_title', jsonb_build_object(
            'type', 'string',
            'description', 'Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)'
        ),
        'summary', jsonb_build_object(
            'type', 'string',
            'description', 'Concise overview highlighting key points and main takeaways (200-300 chars)'
        ),
        'themes', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 3,
            'maxItems', 7,
            'description', 'Main topics, concepts, and areas of discussion'
        ),
        'hashtags', jsonb_build_object(
            'type', 'array',
            'items', jsonb_build_object('type', 'string'),
            'minItems', 5,
            'maxItems', 10,
            'description', 'Relevant hashtags for social media and categorization'
        ),
        'sentiment_analysis', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['overall', 'sections'],
            'properties', jsonb_build_object(
                'overall', jsonb_build_object(
                    'type', 'string',
                    'description', 'General sentiment (positive/negative/neutral) with confidence score'
                ),
                'sections', jsonb_build_object(
                    'type', 'array',
                    'items', jsonb_build_object(
                        'type', 'object',
                        'required', ARRAY['section', 'sentiment', 'confidence'],
                        'properties', jsonb_build_object(
                            'section', jsonb_build_object('type', 'string'),
                            'sentiment', jsonb_build_object('type', 'string'),
                            'confidence', jsonb_build_object(
                                'type', 'number',
                                'minimum', 0,
                                'maximum', 1
                            )
                        )
                    )
                )
            )
        ),
        'category_specific_data', jsonb_build_object(
            'type', 'object',
            'required', ARRAY['skills_taught', 'duration', 'target_audience'],
            'properties', jsonb_build_object(
                'skills_taught', jsonb_build_object(
                    'type', 'string',
                    'description', 'Skills and competencies taught in the session'
                ),
                'duration', jsonb_build_object(
                    'type', 'string',
                    'description', 'Duration of the skill-building session'
                ),
                'target_audience', jsonb_build_object(
                    'type', 'string',
                    'description', 'Target audience and skill level'
                )
            )
        )
    )
)
WHERE category = 'Webinars & Events' AND type = 'Workshop' AND sub_type = 'Skill Building'; 