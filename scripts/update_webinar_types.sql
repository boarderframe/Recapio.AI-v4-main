-- Update Platform Tour sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this platform tour demo transcript focusing on key features, user experience, and integration capabilities. Extract the following information:
- Key features demonstrated and their benefits
- User interface elements and navigation flow
- Integration points and compatibility
- Audience questions and responses
- Technical specifications mentioned
- Presenter''s emphasis points

Provide insights on:
- Most highlighted features
- User feedback and reactions
- Integration possibilities discussed
- Overall demo effectiveness',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["features_highlighted", "user_feedback", "integration_options"],
          "properties": {
            "features_highlighted": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Key features demonstrated during the platform tour"
            },
            "user_feedback": {
              "type": "string",
              "description": "Aggregated feedback from users during the demo"
            },
            "integration_options": {
              "type": "string",
              "description": "Available integration options discussed"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Product Demo' 
AND sub_type = 'Platform Tour';

-- Update Technical Walkthrough sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this technical walkthrough transcript focusing on technical details, implementation steps, and system requirements. Extract the following information:
- Technical features and capabilities demonstrated
- Implementation requirements and prerequisites
- Step-by-step processes explained
- Technical specifications and limitations
- Integration points and APIs discussed
- Common technical challenges addressed

Provide insights on:
- Key technical features
- System requirements
- Target technical audience
- Technical complexity level',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["features_demonstrated", "technical_requirements", "target_audience"],
          "properties": {
            "features_demonstrated": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Technical features demonstrated in detail"
            },
            "technical_requirements": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Technical prerequisites and system requirements"
            },
            "target_audience": {
              "type": "string",
              "description": "Intended audience for the technical walkthrough"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Product Demo' 
AND sub_type = 'Technical Walkthrough';

-- Update Use Case Demonstration sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this use case demonstration transcript focusing on practical applications, business value, and implementation scenarios. Extract the following information:
- Specific use case scenario presented
- Business problems addressed
- Solution implementation details
- Benefits and outcomes demonstrated
- Customer feedback or reactions
- ROI or success metrics mentioned

Provide insights on:
- Use case applicability
- Solution effectiveness
- Audience engagement
- Business value demonstrated',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["use_case_description", "product_features", "audience_reactions"],
          "properties": {
            "use_case_description": {
              "type": "string",
              "description": "Detailed description of the use case scenario"
            },
            "product_features": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Product features relevant to the use case"
            },
            "audience_reactions": {
              "type": "string",
              "description": "Audience response and engagement during the demonstration"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Product Demo' 
AND sub_type = 'Use Case Demonstration';

-- Update Group Exercise sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this group exercise workshop transcript focusing on collaborative activities, participant engagement, and learning outcomes. Extract the following information:
- Exercise objectives and structure
- Group dynamics and interactions
- Participant contributions and insights
- Facilitator guidance and interventions
- Learning outcomes achieved
- Group challenges and solutions

Provide insights on:
- Exercise effectiveness
- Participant engagement levels
- Key learning moments
- Facilitator effectiveness',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["exercise_topics", "participant_feedback", "facilitator_notes"],
          "properties": {
            "exercise_topics": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Topics covered in the group exercise"
            },
            "participant_feedback": {
              "type": "string",
              "description": "Feedback and insights from exercise participants"
            },
            "facilitator_notes": {
              "type": "string",
              "description": "Notes and observations from the exercise facilitator"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Workshop' 
AND sub_type = 'Group Exercise';

-- Update Hands-on Training sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this hands-on training workshop transcript focusing on skill development, practical exercises, and learning progression. Extract the following information:
- Skills being taught and practiced
- Training methodology and approach
- Practical exercises and their outcomes
- Common challenges and solutions
- Trainer guidance and feedback
- Participant progress and mastery

Provide insights on:
- Skill acquisition effectiveness
- Training methodology success
- Participant progress
- Areas needing reinforcement',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["skills_practiced", "tools_used", "trainer_feedback"],
          "properties": {
            "skills_practiced": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Skills practiced during the training session"
            },
            "tools_used": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Tools and technologies used in the training"
            },
            "trainer_feedback": {
              "type": "string",
              "description": "Feedback and assessment from the trainer"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Workshop' 
AND sub_type = 'Hands-on Training';

-- Update Interactive Session sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this interactive session workshop transcript focusing on participant engagement, discussion dynamics, and knowledge exchange. Extract the following information:
- Session structure and flow
- Participant interactions and contributions
- Discussion topics and themes
- Questions raised and answers provided
- Key insights and takeaways
- Group dynamics and engagement patterns

Provide insights on:
- Engagement effectiveness
- Learning outcomes achieved
- Discussion quality
- Session impact',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["participant_engagement", "learning_outcomes", "tools_used"],
          "properties": {
            "participant_engagement": {
              "type": "string",
              "description": "Level and quality of participant engagement"
            },
            "learning_outcomes": {
              "type": "string",
              "description": "Achieved learning objectives and outcomes"
            },
            "tools_used": {
              "type": "string",
              "description": "Interactive tools and methods used in the session"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Workshop' 
AND sub_type = 'Interactive Session';

-- Update Practical Application sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this practical application workshop transcript focusing on real-world implementation, hands-on practice, and applied learning. Extract the following information:
- Practical techniques demonstrated
- Real-world examples discussed
- Implementation challenges and solutions
- Best practices shared
- Participant attempts and results
- Application scenarios covered

Provide insights on:
- Practical value delivered
- Implementation readiness
- Knowledge application success
- Real-world relevance',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["techniques_used", "real_world_examples", "participant_feedback"],
          "properties": {
            "techniques_used": {
              "type": "string",
              "description": "Techniques and methodologies applied"
            },
            "real_world_examples": {
              "type": "string",
              "description": "Real-world examples and case studies discussed"
            },
            "participant_feedback": {
              "type": "string",
              "description": "Feedback from participants on practical applications"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Workshop' 
AND sub_type = 'Practical Application';

-- Update Skill Building sub-type
UPDATE transcript_types
SET 
    analysis_instructions = 'Analyze this skill building workshop transcript focusing on competency development, learning progression, and skill mastery. Extract the following information:
- Skills being developed
- Learning methodology used
- Practice exercises and drills
- Skill progression stages
- Common challenges and solutions
- Success indicators and metrics

Provide insights on:
- Skill development effectiveness
- Learning progression
- Competency achievement
- Areas for reinforcement',
    json_schema = '{
      "type": "object",
      "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis", "category_specific_data"],
      "properties": {
        "ai_title": {
          "type": "string",
          "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        "summary": {
          "type": "string",
          "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        "themes": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 3,
          "maxItems": 7,
          "description": "Main topics, concepts, and areas of discussion"
        },
        "hashtags": {
          "type": "array",
          "items": {"type": "string"},
          "minItems": 5,
          "maxItems": 10,
          "description": "Relevant hashtags for social media and categorization"
        },
        "sentiment_analysis": {
          "type": "object",
          "required": ["overall", "sections"],
          "properties": {
            "overall": {
              "type": "string",
              "description": "General sentiment (positive/negative/neutral) with confidence score"
            },
            "sections": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["section", "sentiment", "confidence"],
                "properties": {
                  "section": {"type": "string"},
                  "sentiment": {"type": "string"},
                  "confidence": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                }
              }
            }
          }
        },
        "category_specific_data": {
          "type": "object",
          "required": ["skills_taught", "duration", "target_audience"],
          "properties": {
            "skills_taught": {
              "type": "string",
              "description": "Skills and competencies taught in the session"
            },
            "duration": {
              "type": "string",
              "description": "Duration of the skill-building session"
            },
            "target_audience": {
              "type": "string",
              "description": "Target audience and skill level"
            }
          }
        }
      }
    }'::jsonb,
    api_parameters = '{
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 1000,
      "top_p": 0.95,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }'::jsonb
WHERE category = 'Webinars & Events' 
AND type = 'Workshop' 
AND sub_type = 'Skill Building';

-- Verify the updates
SELECT id, category, type, sub_type, 
       analysis_instructions IS NOT NULL as has_instructions,
       json_schema IS NOT NULL as has_schema,
       api_parameters IS NOT NULL as has_params
FROM transcript_types
WHERE category = 'Webinars & Events'
ORDER BY type, sub_type; 