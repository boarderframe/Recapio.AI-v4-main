# Branch Protection Configuration

This document outlines the branch protection rules and configurations implemented in the Recapio.AI repository.

## Branch Structure

### Protected Branches

#### 1. `main` Branch
- **Protection Level:** Highest
- **Rules:**
  - ✅ Requires pull request reviews
  - ✅ Requires status checks
  - ✅ Requires signed commits
  - ✅ Requires linear history
  - ✅ Includes administrators in rules
  - ✅ Block force pushes
  - ✅ Requires conversation resolution
  - ✅ Requires up-to-date branches

#### 2. `develop` Branch
- **Protection Level:** High
- **Rules:**
  - ✅ Requires pull request reviews
  - ✅ Requires status checks
  - ✅ Requires signed commits
  - ✅ Block force pushes
  - ✅ Requires conversation resolution
  - ✅ Copilot review enabled
  - ✅ Requires linear history
  - ✅ Requires up-to-date branches

#### 3. `staging` Branch
- **Protection Level:** High
- **Rules:**
  - ✅ Requires pull request reviews
  - ✅ Requires deployment status
  - ✅ Requires signed commits
  - ✅ Block force pushes
  - ✅ Requires status checks
  - ✅ Requires up-to-date branches
  - ✅ Requires conversation resolution
  - ✅ Copilot review enabled

### Branch Patterns

#### 4. `features/*` Pattern
- **Protection Level:** Moderate
- **Rules:**
  - ✅ Allows creation and updates
  - ✅ Requires pull request for merging
  - ✅ Requires signed commits
  - ✅ Requires code scanning
  - ✅ Linear history enforced
  - ✅ Copilot review enabled
  - ✅ Requires conversation resolution

#### 5. `ui/*` Pattern
- **Protection Level:** Moderate
- **Rules:**
  - ✅ Allows creation and updates
  - ✅ Requires pull request for merging
  - ✅ Requires signed commits
  - ✅ Requires code scanning
  - ✅ Linear history enforced
  - ✅ Copilot review enabled
  - ✅ Requires conversation resolution

## Pull Request Requirements

### For Protected Branches (`main`, `develop`, `staging`)
- Required approvals: 1
- Dismiss stale pull request approvals when new commits are pushed
- Require conversation resolution before merging
- Request Copilot review
- Require up-to-date branches before merging

### For Pattern Branches (`features/*`, `ui/*`)
- Required approvals: 1
- Dismiss stale approvals on new commits
- Require conversation resolution
- Request Copilot review

## Security Features

### Commit Signing
- Required for all protected branches
- Required for feature and UI branches
- GPG signing enforced

### Code Scanning
- Enabled for all branches
- Required for merging into protected branches
- Automated security scanning via CodeQL

## Workflow Guidelines

### Creating New Features
1. Create branch from `develop` using pattern:
   - `features/*` for general features
   - `ui/*` for UI/UX changes
2. Make changes and commit with signed commits
3. Create pull request to `develop`
4. Address review comments and pass checks
5. Merge after approval

### Release Process
1. Merge `develop` to `staging` for testing
2. Run deployment checks on `staging`
3. Create release branch if needed
4. Merge to `main` after all checks pass

## Maintenance

### Regular Tasks
- Review and update branch protection rules quarterly
- Verify security scanning configurations
- Update required status checks as needed
- Review and clean up stale branches

### Emergency Procedures
- Hotfix process documented in separate workflow
- Emergency access procedures for critical fixes
- Temporary protection override procedures 