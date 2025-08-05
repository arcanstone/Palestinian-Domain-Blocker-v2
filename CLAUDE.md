# CLAUDE.md

Essential guidance for Claude Code when working with this repository.

## Project Overview

Palestinian Domain Blocker - Browser extension blocking domains of companies with Israeli military contracts. Supports Firefox (Manifest V2) and Chrome (Manifest V3) with educational blocked pages featuring a dinosaur mini-game.

## Development Commands

### Core Commands
- `npm run build` - Production build with optimization
- `npm run deploy:firefox` - **Automated Firefox Add-ons submission**
- `npm test` - No tests configured (exits 0)

### Dependencies
- `npm install` - Install archiver and web-ext dependencies

## Repository Structure (Clean & Essential)

```
├── manifest.json + manifest-v2-firefox.json  # Browser manifests
├── background.js + background-firefox.js     # Core blocking logic  
├── popup.html/js + blocked.html/js          # UI components
├── dino-game.js + pixel-fonts.js            # Game files
├── military-contractors-list.js             # Domain data
├── build.js + deploy-firefox.js             # Build/deploy tools
├── icons/ (4 PNG files)                     # Required icons
├── google-example/ (2 assets)               # Game sprites
├── README.md + LICENSE                      # Required docs
└── package.json + .gitignore                # Config
```

## Release Process

### 1. Update Version
Update version in BOTH manifests:
- `manifest.json` (Chrome)
- `manifest-v2-firefox.json` (Firefox)
- `package.json`

### 2. GitHub Release (Automated)
```bash
# Set GitHub token
GITHUB_TOKEN=your_token_here

# Create release automatically  
node create-github-release.js  # (script creates itself when needed)
```

### 3. Firefox Deployment (Automated)
```bash
# One-time setup: Get API credentials from Mozilla
# https://addons.mozilla.org/developers/addon/api/key/

# Set Mozilla credentials
set AMO_JWT_ISSUER=your_issuer
set AMO_JWT_SECRET=your_secret

# Deploy to Firefox store
npm run deploy:firefox
```

## Architecture

### Browser Support
- **Firefox**: Uses `manifest-v2-firefox.json` + `background-firefox.js` (webRequest API)
- **Chrome**: Uses `manifest.json` + `background.js` (declarativeNetRequest API)

### Game Features
- **Dinosaur**: Chrome sprite (40x40px) with running animation
- **Jump Physics**: jumpPower: 3, gravity: 0.08 (tuned for smooth gameplay)
- **Obstacles**: Tank sprites with proper collision detection
- **Fonts**: Pixel-perfect retro fonts for game UI

### Security
- **No unsafe innerHTML**: All DOM manipulation uses createElement/textContent
- **Mozilla Compliant**: Passes all Mozilla Add-ons validation
- **Cross-browser**: Compatible with Firefox 90+ and Chrome

## Current Status

### Extension Details
- **Version**: 3.1.3
- **Extension ID**: `palestinian-domain-blocker@solidarity.org`
- **Size**: ~150KB (Firefox), ~155KB (Chrome)

### Repository State
- **Clean**: No build artifacts, ZIP files, or unnecessary bloat
- **Automated**: GitHub releases and Firefox deployment fully scripted
- **Essential**: Only required files remain (~15 files total)

## Essential Notes for Next Session

### Dinosaur Game
- **Current Physics**: jumpPower: 3, gravity: 0.08 (user confirmed "perfect")
- **Animation**: Running bobbing uses `Math.sin(animationFrame * 0.15) * 1`
- **Collision**: 4px padding on dino, 2px on obstacles for accurate detection

### Deployment Tokens
- **GitHub**: User has token `github_pat_11APFLTUI0...` (don't store in repo)
- **Mozilla**: User needs to set AMO_JWT_ISSUER and AMO_JWT_SECRET from Mozilla dev console

### File Rules
- **NO ZIP files** in repository (use releases only)
- **NO build artifacts** (dist/, package-info.json, INSTALL.md)
- **NO duplicate manifests** (only manifest.json + manifest-v2-firefox.json)
- **NO documentation bloat** (keep only README.md + this CLAUDE.md)

### Version Pattern
- Tags: `v3.1.3` format
- Manifests must match package.json version
- GitHub releases include both Firefox and Chrome ZIPs

## Troubleshooting

### Common Issues
- **Build resets version**: `build.js` may reset manifest version to 2.0.0 - always fix after build
- **Mozilla validation**: Ensure no innerHTML, proper file paths (forward slashes)
- **Missing files**: Game assets must be in web_accessible_resources in both manifests

### Testing
- **No test framework configured** - manual testing only
- **Firefox**: Load via about:debugging (temporary)
- **Chrome**: Load via chrome://extensions (developer mode)