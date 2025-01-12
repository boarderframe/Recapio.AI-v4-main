# GPG Signing Configuration

This document outlines the setup and configuration of GPG signing for commits in the Recapio project.

## Prerequisites

- macOS with Homebrew installed
- Git installed and configured
- GitHub account with write access to the repository

## Required Software

Install the following packages using Homebrew:

```bash
brew install gnupg pinentry-mac
```

## Setup Steps

1. **Generate GPG Key**:
   ```bash
   gpg --full-generate-key
   ```
   - Choose option 9 (ECC - sign and encrypt)
   - Select curve 25519
   - Set expiry as needed (0 for no expiry)
   - Enter your GitHub email address
   - Set a secure passphrase

2. **Configure Git**:
   ```bash
   # Get your key ID
   gpg --list-secret-keys --keyid-format=long
   
   # Configure Git to use the key
   git config --global user.signingkey YOUR_KEY_ID
   git config --global commit.gpgsign true
   git config --global user.email "your.github@email.com"
   ```

3. **Configure GPG Agent**:
   ```bash
   # Add to ~/.zshrc
   export GPG_TTY=$(tty)
   
   # Configure pinentry
   echo "pinentry-program /opt/homebrew/bin/pinentry-mac" > ~/.gnupg/gpg-agent.conf
   gpgconf --kill gpg-agent
   ```

4. **Add to GitHub**:
   ```bash
   # Export your public key
   gpg --armor --export YOUR_KEY_ID
   ```
   - Copy the output (including BEGIN and END lines)
   - Go to GitHub Settings → SSH and GPG keys → New GPG key
   - Paste and save the key

## Verification

To verify your setup:

1. Make a test commit:
   ```bash
   git commit -S -m "test: verify GPG signing"
   ```

2. Check the signature:
   ```bash
   git log -1 --show-signature
   ```

3. Push to GitHub and verify the "Verified" badge appears on your commit

## Troubleshooting

1. If GPG fails to sign:
   - Ensure your Git email matches your GPG key email
   - Check GPG agent is running
   - Verify pinentry-mac is properly configured

2. If GitHub doesn't show "Verified":
   - Confirm the GPG key is properly added to GitHub
   - Verify the commit email matches your GitHub email
   - Check the GPG key hasn't expired

## Maintenance

- Regularly verify your GPG key hasn't expired
- Keep your GPG key secure and backed up
- Consider key rotation policies for security 