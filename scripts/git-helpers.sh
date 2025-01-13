#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create a new feature branch
create_feature() {
    if [ -z "$1" ]; then
        echo -e "${RED}Please provide a feature description${NC}"
        echo "Usage: ./git-helpers.sh feature 'feature-description'"
        return 1
    fi

    # Convert description to kebab case and clean it
    FEATURE_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-zA-Z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$//')
    
    # Create feature branch from develop
    git checkout develop
    git pull origin develop
    git checkout -b "feature/${FEATURE_NAME}"
    
    echo -e "${GREEN}Created and switched to feature branch: feature/${FEATURE_NAME}${NC}"
}

# Function to create a new UI feature branch
create_ui_feature() {
    if [ -z "$1" ]; then
        echo -e "${RED}Please provide a UI feature description${NC}"
        echo "Usage: ./git-helpers.sh ui 'feature-description'"
        return 1
    }

    # Convert description to kebab case and clean it
    FEATURE_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-zA-Z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$//')
    
    # Create UI feature branch from develop
    git checkout develop
    git pull origin develop
    git checkout -b "ui/${FEATURE_NAME}"
    
    echo -e "${GREEN}Created and switched to UI feature branch: ui/${FEATURE_NAME}${NC}"
}

# Function to prepare for release
prepare_release() {
    if [ -z "$1" ]; then
        echo -e "${RED}Please provide a version number${NC}"
        echo "Usage: ./git-helpers.sh release 'version-number'"
        return 1
    }

    VERSION=$1
    
    # Create release branch from develop
    git checkout develop
    git pull origin develop
    git checkout -b "release/v${VERSION}"
    
    echo -e "${GREEN}Created release branch: release/v${VERSION}${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Make any final adjustments"
    echo "2. Run tests: npm test"
    echo "3. Update version in package.json"
    echo "4. Create pull request to main"
}

# Function to create a hotfix
create_hotfix() {
    if [ -z "$1" ]; then
        echo -e "${RED}Please provide a hotfix description${NC}"
        echo "Usage: ./git-helpers.sh hotfix 'description'"
        return 1
    }

    # Convert description to kebab case and clean it
    HOTFIX_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-zA-Z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$//')
    
    # Create hotfix branch from main
    git checkout main
    git pull origin main
    git checkout -b "hotfix/${HOTFIX_NAME}"
    
    echo -e "${GREEN}Created hotfix branch: hotfix/${HOTFIX_NAME}${NC}"
    echo -e "${YELLOW}Remember to follow the hotfix workflow in docs/planning/hotfix-workflow.md${NC}"
}

# Function to publish changes
publish_changes() {
    CURRENT_BRANCH=$(git branch --show-current)
    
    echo -e "${YELLOW}Publishing changes on branch: ${CURRENT_BRANCH}${NC}"
    
    # Run pre-publish checks
    echo "Running tests..."
    npm test
    
    echo "Running linting..."
    npm run lint
    
    echo "Running type checking..."
    npm run type-check || npm run tsc
    
    # If all checks pass, push changes
    if [ $? -eq 0 ]; then
        git push origin "${CURRENT_BRANCH}"
        echo -e "${GREEN}Changes published successfully${NC}"
        echo -e "${YELLOW}Create a pull request at:${NC}"
        echo "https://github.com/boarderframe/Recapio.AI-v4-main/pull/new/${CURRENT_BRANCH}"
    else
        echo -e "${RED}Pre-publish checks failed. Please fix issues before publishing.${NC}"
    fi
}

# Function to show help
show_help() {
    echo "Git Helper Commands:"
    echo "-------------------"
    echo "feature 'description'  : Create a new feature branch"
    echo "ui 'description'       : Create a new UI feature branch"
    echo "release 'version'      : Prepare a release"
    echo "hotfix 'description'   : Create a hotfix branch"
    echo "publish               : Publish current branch changes"
    echo "help                  : Show this help message"
}

# Main command handler
case "$1" in
    "feature")
        create_feature "$2"
        ;;
    "ui")
        create_ui_feature "$2"
        ;;
    "release")
        prepare_release "$2"
        ;;
    "hotfix")
        create_hotfix "$2"
        ;;
    "publish")
        publish_changes
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac 