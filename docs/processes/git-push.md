# Git Push Process

When triggered by "Let's Push to Git" or "Push to Git", execute these steps:

1. **Check Status**
   - Run `git status`
   - List modified files
   - Check for untracked files

2. **Review Changes**
   - Summarize changes made
   - Group changes by feature/fix
   - Note any breaking changes
   - List any dependency updates

3. **Version Update**
   - Check current version in `package.json`
   - Determine version bump type:
     - MAJOR (x.0.0): Breaking changes
     - MINOR (0.x.0): New features
     - PATCH (0.0.x): Bug fixes/small changes
   - Update version number
   - Update CHANGELOG.md if exists

4. **Prepare Commit**
   - Create commit message following format:
     ```
     type(scope): summary [vX.X.X]

     - Detailed change 1
     - Detailed change 2
     ```
   - Types: feat, fix, docs, style, refactor, test, chore
   - Keep summary under 50 chars
   - Add details as bullet points
   - Include version in commit message

5. **Stage and Commit**
   - Stage package.json and CHANGELOG.md first
   - Stage other modified files
   - Create commit with message
   - Verify commit

6. **Create Version Tag**
   - Create new git tag with version number
   - Format: `git tag -a vX.X.X -m "Version X.X.X"`

7. **Push Changes**
   - Push commits to appropriate branch
   - Push tags with `git push --tags`
   - Report push status
   - Provide commit hash and tag 