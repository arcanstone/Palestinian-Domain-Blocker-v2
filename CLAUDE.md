# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension that blocks domains of companies with documented Israeli military contracts. The extension is built using Chrome Manifest V3 and is compatible with Chrome, Edge, Firefox, and Brave browsers.

## Development Commands

- `npm run build` - Runs the production build script (build.js) which optimizes files, removes debug code, validates the extension, and generates distribution packages
- `npm run zip` - Creates a packaged zip file for distribution using archiver
- `npm test` - Currently no tests configured (exits with code 0)

## Build System

The build process is handled by `build.js` which:
- Removes comments and debug code from JavaScript files
- Validates all required files are present
- Updates manifest.json for production
- Generates package-info.json and INSTALL.md
- Provides file size reports

Required files for a valid build:
- manifest.json, background.js, popup.html, popup.js, blocked.html, blocked.js, README.md
- Icon files: icons/icon16.png, icons/icon32.png, icons/icon48.png, icons/icon128.png

## Architecture

### Core Components

- **background.js** - Service worker that handles domain blocking logic using Chrome's declarativeNetRequest API
- **popup.js/popup.html** - Extension popup interface with tabs for blocked domains, whitelist, impact metrics, categories, and submission
- **blocked.js/blocked.html** - Page displayed when a blocked domain is accessed, with alternative service suggestions
- **military-contractors-list.js** - Contains the verified list of domains to block, organized by categories

### Domain Management

The extension uses two main domain lists:
- `preSelectedDomains` - Core list of 32 verified domains with military contracts
- Domain categories including Israeli defense companies, US defense contractors, and tech companies with government contracts

### Storage

Uses Chrome's storage.local API to store:
- blockedDomains - User's custom blocked domains
- whitelistedDomains - Domains exempted from blocking

### Installation Scripts

- `install-extension.bat` - Windows batch script for automated Chrome/Edge installation
- `install-extension.ps1` - PowerShell script alternative
- `install-firefox.bat` - Firefox-specific installation script

## Extension Permissions

The extension requires:
- declarativeNetRequest - For blocking domains
- storage - For user preferences
- tabs - For tab management
- webNavigation - For navigation events
- Host permissions for all URLs

## File Structure

- Core extension files are in the root directory
- Icons are in the `icons/` subdirectory
- Documentation files: README.md, INSTALL.md, QUICK-INSTALL.md, RELEASE_NOTES.md
- Build artifacts are generated in `dist/` directory

## Release Process

### Creating a New Release

1. **Update version number** in manifest.json (current pattern: v3.1.0 -> v3.1.1 for patches)

2. **Test and commit changes**:
   ```bash
   npm install  # Install dependencies if needed
   npm run zip  # Test zip creation (creates proper folder structure)
   git add .
   git commit -m "Description of changes"
   git push origin master
   ```

3. **Create and push git tag**:
   ```bash
   git tag v3.1.1  # Use next version number
   git push origin v3.1.1
   ```

4. **Build release package**:
   ```bash
   node create-release.js  # Creates dist/Palestinian-Domain-Blocker/ folder structure
   cd dist
   # Create zip from folder (for GitHub releases)
   powershell -Command "Compress-Archive -Path 'Palestinian-Domain-Blocker' -DestinationPath '../palestinian-domain-blocker-v3.1.1.zip' -Force"
   ```

5. **GitHub Actions**: The tag push automatically triggers `.github/workflows/release.yml` which creates the GitHub release

### Release Artifacts

- **npm run zip**: Creates zip with `Palestinian-Domain-Blocker/` folder structure (user-friendly)
- **create-release.js**: Creates `dist/Palestinian-Domain-Blocker/` folder with all files for distribution
- **GitHub Actions**: Automatically creates GitHub release when tags are pushed

### Version History Reference

Latest releases: v3.1.0 (current) -> v3.1.1 (next patch)
Tag pattern: v[major].[minor].[patch]

### Important Notes

- The zip structure was fixed in v3.1.1 to create a single folder instead of loose files
- Users can now easily drag the `Palestinian-Domain-Blocker` folder out of downloaded zips
- GitHub Actions workflow may need RELEASE_TOKEN secret to create releases automatically