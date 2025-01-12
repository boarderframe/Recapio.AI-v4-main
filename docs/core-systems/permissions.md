# Recapio Development Command Access Documentation

## Overview
This document details all commands that have been granted automatic execution access in the development environment. These commands can be executed without requiring explicit user approval while maintaining logging and output visibility.

## File System Operations
```bash
ls          # List directory contents
cd          # Change directory
pwd         # Print working directory
mkdir       # Create directory
touch       # Create file
rm          # Remove files/directories
cp          # Copy files/directories
mv          # Move/rename files/directories
```

## Development Server Commands
```bash
npm run dev     # Start development server
npm start       # Start production server
npm run build   # Build the application
```

## Package Management
```bash
npm install     # Install dependencies
npm update      # Update packages
npm audit fix   # Fix security vulnerabilities
yarn *          # All yarn commands
npx *           # Execute npm package binaries
```

## Git Operations
```bash
git status      # Check repository status
git branch      # List/manage branches
git fetch       # Update remote tracking branches
git pull        # Fetch and merge changes
git add         # Stage changes
git commit      # Commit changes
git push        # Push changes to remote
git checkout    # Switch branches
git merge       # Merge branches
git rebase      # Rebase branches
git stash       # Stash changes
```

## Process Management
```bash
ps             # List processes
kill           # Terminate processes
top            # Monitor system processes
```

## Node.js Environment
```bash
node           # Run Node.js scripts
npm run *      # Run any npm script
npm test       # Run tests
npm run test:watch  # Run tests in watch mode
```

## Code Quality Tools
```bash
npm run format     # Format code
npm run lint       # Lint code
prettier --write   # Format with Prettier
```

## Database Operations
```bash
supabase *         # Supabase CLI commands
prisma *           # Prisma CLI commands
```

## Build & Deployment
```bash
next build         # Build Next.js application
next export        # Export static site
vercel            # Vercel CLI commands
netlify           # Netlify CLI commands
```

## Environment Management
```bash
export            # Set environment variables
env               # Print environment
source            # Execute scripts in current shell
```

## Security Considerations

### Maintained Safeguards
1. All command executions are logged
2. Command outputs are visible
3. Sensitive operations are documented
4. Environment variables are protected

### Protected Operations
The following operations still require manual review:
1. Production deployments
2. Database migrations affecting production
3. Environment variable modifications
4. Security credential changes

## Usage Guidelines

### Best Practices
1. Commands will be explained before execution
2. Outputs will be monitored and reported
3. Error handling will be implemented
4. Sensitive operations will be flagged

### Error Handling
1. Failed commands will be reported
2. Recovery steps will be suggested
3. Alternative approaches will be provided
4. Issues will be documented

## Monitoring

### Command Execution
- All commands are logged
- Execution time is tracked
- Errors are captured
- Output is preserved

### Performance Impact
- Resource usage is monitored
- Long-running operations are noted
- System load is considered
- Concurrent operations are managed

## Troubleshooting

### Common Issues
1. Permission denied errors
2. Resource constraints
3. Network connectivity
4. Environment conflicts

### Resolution Steps
1. Check permissions
2. Verify environment
3. Review configurations
4. Monitor system resources

## Future Considerations

### Potential Additions
1. Additional build tools
2. Testing frameworks
3. Monitoring tools
4. Deployment options

### Security Updates
1. Regular access review
2. Permission adjustments
3. Security patch management
4. Audit logging enhancements 