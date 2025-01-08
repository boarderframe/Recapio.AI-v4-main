#!/bin/bash

# Load environment variables from .env.local
export $(cat ../.env.local | grep -v '^#' | xargs)

# Run the population script
node populateTranscriptTypes.js 