# Hotfix Workflow

This document outlines the procedures for handling emergency fixes (hotfixes) in the Recapio.AI repository.

## When to Use Hotfix Workflow

Use this workflow when:
- A critical bug is discovered in production
- Security vulnerabilities need immediate patching
- Production service is degraded or down
- Data integrity issues require immediate fixes

## Hotfix Process

### 1. Emergency Assessment
1. Identify the severity of the issue
2. Notify relevant team members
3. Create emergency ticket in issue tracker
4. Document the current state and impact

### 2. Branch Creation
1. Create hotfix branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/ISSUE-ID-brief-description
   ```
2. Branch naming convention: `hotfix/REC-XXX-description`

### 3. Development Process
1. Make minimal required changes to fix the issue
2. Add appropriate tests
3. Ensure all commits are signed
4. Document changes thoroughly

### 4. Review Process
1. Create pull request to `main`
2. Request emergency review from team leads
3. Run critical test suite
4. Security team review if security-related

### 5. Deployment Process
1. Merge to `main` after approval
2. Deploy to production
3. Verify fix in production
4. Monitor for any side effects

### 6. Post-Deployment
1. Backport changes to `develop`
2. Update documentation if needed
3. Create incident report
4. Schedule post-mortem if needed

## Emergency Access Procedures

### Temporary Protection Override
1. Repository admin can temporarily disable specific branch protections
2. Document the override in emergency ticket
3. Re-enable protection immediately after fix
4. Require two-person authorization for override

### Emergency Merge Process
1. Use "Merge without waiting for requirements" option
2. Requires repository admin approval
3. Document emergency merge in ticket
4. Post-merge review required

## Security Considerations

### Authentication Requirements
- Maintain GPG signing even for emergency commits
- Use emergency admin access only when necessary
- Log all emergency access usage

### Code Quality
- Maintain basic code quality standards
- Required tests must still pass
- Security checks cannot be bypassed

## Post-Emergency Tasks

### Documentation
1. Update incident log
2. Document any new vulnerabilities discovered
3. Update security policies if needed
4. Review and update this workflow if needed

### Review and Improvement
1. Conduct post-mortem meeting
2. Identify process improvements
3. Update monitoring if needed
4. Review emergency response effectiveness

## Communication Guidelines

### Internal Communication
1. Use emergency communication channel
2. Keep stakeholders updated
3. Document all decisions
4. Maintain clear command chain

### External Communication
1. Prepare user communication if needed
2. Follow security disclosure policy
3. Update status page
4. Coordinate with support team

## Recovery Procedures

### Rollback Process
If hotfix causes issues:
1. Immediate rollback to last known good state
2. Use automated rollback procedure
3. Notify all stakeholders
4. Begin new hotfix cycle if needed

### Monitoring
1. Enhanced monitoring post-deployment
2. Watch key metrics closely
3. Ready to rollback if needed
4. Document any anomalies

## Training and Preparation

### Team Readiness
1. Regular hotfix drills
2. Access verification
3. Documentation review
4. Emergency contact list maintenance

### Documentation Maintenance
1. Quarterly review of this document
2. Update contact information
3. Review and test procedures
4. Update based on lessons learned 