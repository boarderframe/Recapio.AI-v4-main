# Version Control Quick Start Guide

## Initial Setup

1. **Configure GPG Signing**
   ```bash
   # Generate GPG key if you don't have one
   gpg --full-generate-key
   
   # List your keys
   gpg --list-secret-keys --keyid-format LONG
   
   # Configure Git with your key
   git config --global user.signingkey YOUR_KEY_ID
   git config --global commit.gpgsign true
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/boarderframe/Recapio.AI-v4-main.git
   cd Recapio.AI-v4-main
   ```

3. **Set Up Helper Script**
   ```bash
   chmod +x scripts/git-helpers.sh
   ```

## Daily Development Workflow

### 1. Starting New Work

#### For Features
```bash
# Create feature branch
./scripts/git-helpers.sh feature "your-feature-description"

# Example:
./scripts/git-helpers.sh feature "add-user-dashboard"
```

#### For UI Changes
```bash
# Create UI branch
./scripts/git-helpers.sh ui "your-ui-description"

# Example:
./scripts/git-helpers.sh ui "redesign-login-page"
```

### 2. Making Changes

#### Commit Guidelines
```bash
# Format:
type(scope): subject

# Examples:
feat(auth): add Google OAuth login
fix(dashboard): resolve data loading issue
docs(readme): update installation steps
style(ui): improve button alignment
refactor(api): optimize user queries
test(auth): add login test cases
chore(deps): update dependencies
```

#### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### 3. Publishing Changes
```bash
# Before publishing:
1. Review your changes
2. Run local tests
3. Update documentation

# Publish:
./scripts/git-helpers.sh publish
```

### 4. Pull Request Process
1. Click the PR link provided after publishing
2. Fill out the PR template
3. Request reviews
4. Address feedback
5. Await approval and merge

## Release Process

### 1. Prepare Release
```bash
./scripts/git-helpers.sh release "4.1.0"
```

### 2. Release Steps
1. Update version in package.json
2. Update CHANGELOG.md
3. Run full test suite
4. Create PR to main
5. Get approvals
6. Merge and tag

## Emergency Fixes

### Creating Hotfix
```bash
./scripts/git-helpers.sh hotfix "critical-auth-fix"
```

### Hotfix Process
1. Make minimal required changes
2. Test thoroughly
3. Get emergency review
4. Merge to main
5. Backport to develop

## Common Issues

### 1. GPG Signing
```bash
# If commits fail with GPG error:
git commit -S -m "your message"

# Verify GPG is working:
echo "test" | gpg --clearsign
```

### 2. Branch Protection
- Can't push directly to protected branches
- Create PR instead
- Ensure all checks pass
- Get required reviews

### 3. Merge Conflicts
```bash
# Update your branch
git checkout your-branch
git pull origin develop

# Resolve conflicts
git merge develop
# Fix conflicts in your editor
git add .
git commit -S -m "merge: resolve conflicts"
```

## Best Practices

### 1. Branch Management
- Keep branches focused
- Delete after merging
- Regular rebasing
- Clear naming

### 2. Commits
- Sign all commits
- Clear messages
- Logical grouping
- Reference issues

### 3. Code Quality
- Write tests
- Update docs
- Follow standards
- Self-review

### 4. Communication
- Clear PR descriptions
- Responsive to reviews
- Document decisions
- Update status

## Quick Reference

### Common Commands
```bash
# New feature
./scripts/git-helpers.sh feature "description"

# New UI feature
./scripts/git-helpers.sh ui "description"

# Prepare release
./scripts/git-helpers.sh release "version"

# Emergency hotfix
./scripts/git-helpers.sh hotfix "description"

# Publish changes
./scripts/git-helpers.sh publish

# Show help
./scripts/git-helpers.sh help
```

### Important Links
- [Full Documentation](../README.md)
- [Branch Protection](../planning/branch-protection.md)
- [Hotfix Workflow](../planning/hotfix-workflow.md)
- [Troubleshooting](../troubleshooting/fixes.md) 