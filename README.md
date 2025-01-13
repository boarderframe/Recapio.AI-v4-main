# Recapio.AI

## Quick Start Guide

### Prerequisites
- Node.js 18.x or higher
- Git with GPG signing configured
- npm or yarn

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/boarderframe/Recapio.AI-v4-main.git
   cd Recapio.AI-v4-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up GPG signing:
   - Follow instructions in `docs/setup/gpg-signing.md`

### Development Workflow

We use a structured workflow with helper commands to maintain code quality and consistency.

#### Helper Script
We provide a git helper script for common operations:
```bash
# Make the script executable (first time only)
chmod +x scripts/git-helpers.sh

# Show available commands
./scripts/git-helpers.sh help
```

#### Creating New Features
1. Start a new feature:
   ```bash
   ./scripts/git-helpers.sh feature "your-feature-description"
   # or for UI features:
   ./scripts/git-helpers.sh ui "your-ui-feature-description"
   ```

2. Make your changes and commit with conventional commits:
   ```bash
   git commit -m "feat: add new feature"
   ```

3. Publish your changes:
   ```bash
   ./scripts/git-helpers.sh publish
   ```

4. Create a pull request using the provided link

#### Branch Structure
- `main`: Production code
- `develop`: Development branch
- `staging`: Pre-production testing
- `feature/*`: New features
- `ui/*`: UI/UX changes
- `hotfix/*`: Emergency fixes
- `release/*`: Release preparation

### Pull Requests
- Use the PR template
- Ensure all checks pass
- Get required reviews
- Resolve all conversations
- Keep changes focused

### Documentation
Comprehensive documentation available in `docs/`:
- Setup guides
- Core systems
- UI/UX guidelines
- Testing procedures
- Troubleshooting

### Version Control
- All commits must be signed
- Follow conventional commit format
- Branch protection rules enforced
- Code review required for merges

### CI/CD
Automated checks for:
- Build validation
- Tests
- Linting
- Type checking
- Security scanning
- Code quality

### Security
- GPG signing required
- Branch protection enforced
- CodeQL scanning enabled
- Dependency auditing
- Security policy enforced

## Contributing
1. Create a feature branch
2. Make your changes
3. Follow coding standards
4. Add tests
5. Create a pull request

## Support
- Check `docs/troubleshooting/fixes.md`
- Create issues using templates
- Follow security policy for vulnerabilities

## License
[License details here] 