# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension that blocks domains of companies with documented Israeli military contracts. The extension is built using Chrome Manifest V3 and is compatible with Chrome, Edge, Firefox, and Brave browsers.

## Development Commands

### Building
- `npm run build` - Runs the production build script (build.js) which optimizes files, removes debug code, validates the extension, and generates distribution packages
- `npm run build:chrome` - Build for Chrome (Manifest V3)
- `npm run build:firefox` - Build for Firefox (Manifest V2)
- `npm run build:all` - Build for both browsers
- `npm test` - Currently no tests configured (exits with code 0)

### Packaging
- `npm run zip` - Creates Chrome zip (default)
- `npm run zip:chrome` - Creates Chrome extension zip with proper folder structure
- `npm run zip:firefox` - Creates Firefox extension zip with proper folder structure
- `npm run zip:all` - Creates both Chrome and Firefox zips

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

### Dual Browser Support

The extension supports both Chrome and Firefox with different API approaches:

**Chrome Version (Manifest V3)**:
- `background.js` - Service worker using `declarativeNetRequest` API
- `manifest.json` - Manifest V3 format

**Firefox Version (Manifest V2)**:
- `background-firefox.js` - Background script using `webRequest` API
- `manifest-v2-firefox.json` - Manifest V2 format

### Core Components

- **background.js** - Chrome service worker with declarativeNetRequest API for domain blocking
- **background-firefox.js** - Firefox background script with webRequest API for domain blocking
- **popup.js/popup.html** - Extension popup interface with tabs for blocked domains, whitelist, impact metrics, categories, and submission (cross-browser compatible)
- **blocked.js/blocked.html** - Page displayed when blocked domains are accessed, with alternative service suggestions (cross-browser compatible)
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

## Current Status (v3.1.2)

### Completed Features
- **Dual Browser Support**: Chrome (Manifest V3) and Firefox (Manifest V2) versions working
- **Fixed UI Issues**: Blocked page no longer shows "Loading...", alternatives display correctly
- **Professional Build System**: Separate Chrome/Firefox packaging with `npm run zip:chrome` and `npm run zip:firefox`
- **Mozilla Submission Ready**: Clean XPI structure with extension ID for permanent Firefox installation

### Files Ready for Distribution
- **Chrome**: Use standard `manifest.json` + `background.js` 
- **Firefox**: Use `manifest-v2-firefox.json` + `background-firefox.js`
- **Mozilla Submission**: File `palestinian-domain-blocker-mozilla-v3.1.2.zip` is ready for upload

### Testing Completed
- Chrome extension loads and blocks domains correctly
- Firefox extension works via about:debugging (temporary)
- Blocked page displays domain name and alternatives properly
- Extension popup interface functional

### Mozilla Submission Process
1. Upload `palestinian-domain-blocker-mozilla-v3.1.2.zip` to https://addons.mozilla.org/developers/
2. Extension ID: `palestinian-domain-blocker@solidarity.org`
3. Clean structure with manifest.json at root level
4. Version 3.1.2, ~40KB file size

### Known Issues / Next Steps
- UI improvements needed (user wants to make changes)
- Need comprehensive testing before Mozilla submission
- Regular Firefox users cannot install unsigned extensions (requires Mozilla signing)

### Testing Checklist Before Mozilla Submission
- [ ] Verify all blocked domains redirect properly
- [ ] Test popup functionality (all tabs, add/remove domains)  
- [ ] Test alternatives display on blocked pages
- [ ] Verify extension persists after browser restart
- [ ] Check for console errors or broken functionality
- [ ] Test with different domain variations (www vs non-www)
- [ ] Ensure extension icon displays correctly