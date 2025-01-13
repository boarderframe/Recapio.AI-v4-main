# Recapio.AI Documentation

## Development Workflow Guide

### Version Control System

#### Branch Structure
- `main` (Production)
  - Protected branch
  - Requires signed commits
  - Requires PR and reviews
  - No direct pushes allowed

- `develop` (Development)
  - Main development branch
  - Protected branch
  - Requires PR and reviews
  - Source for feature branches

- `staging` (Pre-production)
  - Testing environment
  - Protected branch
  - Deployment validation
  - Pre-release testing

#### Feature Development
1. **Starting New Features**
   ```bash
   # For general features
   ./scripts/git-helpers.sh feature "feature-description"
   
   # For UI/UX features
   ./scripts/git-helpers.sh ui "feature-description"
   ```

2. **Development Process**
   - Write code following standards
   - Add tests
   - Update documentation
   - Use conventional commits

3. **Publishing Changes**
   ```bash
   ./scripts/git-helpers.sh publish
   ```
   This will:
   - Run tests
   - Check linting
   - Verify types
   - Push to remote
   - Provide PR link

#### Release Process
1. **Prepare Release**
   ```bash
   ./scripts/git-helpers.sh release "version-number"
   ```

2. **Release Steps**
   - Update version numbers
   - Update changelog
   - Run final tests
   - Create PR to main

#### Hotfix Process
1. **Create Hotfix**
   ```bash
   ./scripts/git-helpers.sh hotfix "issue-description"
   ```

2. **Follow Hotfix Workflow**
   - See `docs/planning/hotfix-workflow.md`
   - Emergency review process
   - Quick deployment path

### Code Quality

#### Commit Standards
- Use conventional commits
- Sign all commits (GPG)
- Clear, concise messages
- Reference issues/PRs

#### Pull Requests
- Use PR template
- Link related issues
- Complete checklist
- Get required reviews

#### Automated Checks
- Build validation
- Test coverage
- Code linting
- Type checking
- Security scanning
- Dependency audit

### Security Measures

#### Branch Protection
- Protected branches
- Required reviews
- Signed commits
- Status checks

#### Code Scanning
- CodeQL analysis
- Dependency scanning
- Security updates
- Vulnerability checks

### Directory Structure

#### Core Systems (`/core-systems`)
- Authentication
- Database
- Navigation
- Permissions
- Profile Management

#### Technical Docs (`/technical`)
- Architecture
- State Management
- API Integration
- Performance

#### Planning (`/planning`)
- Version Control
- Feature Planning
- Release Strategy
- Hotfix Procedures

#### UI/UX (`/ui-ux`)
- Design Guidelines
- Component Library
- Style Guide
- Examples

### Quick Reference

#### Common Commands
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

#### Useful Links
- [Branch Protection Rules](planning/branch-protection.md)
- [Hotfix Workflow](planning/hotfix-workflow.md)
- [GPG Signing Setup](setup/gpg-signing.md)
- [Troubleshooting](troubleshooting/fixes.md)

### Best Practices

#### Code Development
1. Always work in feature branches
2. Keep changes focused
3. Write meaningful commits
4. Update documentation
5. Add proper tests

#### Review Process
1. Self-review first
2. Address all comments
3. Keep PR size manageable
4. Update based on feedback
5. Verify all checks pass

#### Documentation
1. Update relevant docs
2. Keep README current
3. Document breaking changes
4. Include examples
5. Update quick start guide

### Support and Help

#### Issue Creation
- Use templates
- Provide clear steps
- Include environment info
- Add relevant logs

#### Getting Help
1. Check documentation
2. Search existing issues
3. Ask team members
4. Create detailed issue

### Maintenance

#### Regular Tasks
- Update dependencies
- Review security alerts
- Clean stale branches
- Update documentation
- Verify protection rules 