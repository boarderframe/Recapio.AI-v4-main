#!/bin/bash

# Navigate to project root
cd "$(dirname "$0")/.."

# Run the schema generator
echo "Running schema generator..."
node scripts/generate_schema.js

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo "Schema documentation updated successfully!"
else
    echo "Error: Failed to update schema documentation"
    exit 1
fi 