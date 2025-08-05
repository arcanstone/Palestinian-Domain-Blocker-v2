# Palestinian Domain Blocker - Deployment Guide

## Quick Reference for Claude Sessions

This guide provides step-by-step instructions for Claude AI sessions to handle releases and deployments for the Palestinian Domain Blocker extension.

## 🚀 Making a New Release

### 1. Update Version Numbers
Update version in **ALL THREE FILES**:
```bash
# Update these files with the new version (e.g., 3.1.5):
- manifest.json (line 4: "version": "3.1.5")
- manifest-v2-firefox.json (line 4: "version": "3.1.5") 
- package.json (line 3: "version": "3.1.5")
```

### 2. Test Extensions Work
```bash
# Test both extensions build correctly:
cd "C:\Users\14164\Documents\israel_blocker\Palestinian-Domain-Blocker-v2"
npm install
# Manual test Firefox deployment (dry run):
node deploy-firefox.js
```

### 3. Commit Version Changes
```bash
git add manifest.json manifest-v2-firefox.json package.json
git commit -m "Update version to 3.1.5 for release

- Bump version across all manifests
- Ready for automated release deployment

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin master
```

### 4. Create Automated Release
```bash
# This triggers GitHub Actions to create the release automatically:
git tag v3.1.5
git push origin v3.1.5
```

**✅ Done!** GitHub Actions will:
- Build Chrome and Firefox packages
- Create GitHub release with proper notes
- Attach both ZIP files to the release

---

## 🦊 Firefox Store Deployment

### 1. Set Up Environment Variables
```bash
# Copy the .env.example to .env (if not exists):
cp .env.example .env

# Get actual GitHub token from CREDENTIALS.txt (git-ignored file) if needed
# Replace placeholder in .env with real token value

# Or manually set for one session:
export AMO_JWT_ISSUER=user:19234733:86
export AMO_JWT_SECRET=063a5148fef48a71499801b25550e6ae1ba428fd372ca079715cfd46df3cfd17
```

### 2. Deploy to Firefox Store
```bash
# Deploy current version to Mozilla Add-ons:
npm run deploy:firefox
```

**Expected Output:**
```
🦊 Firefox Add-ons Automated Deployment
🚀 Starting Firefox Add-ons deployment...
📦 Creating Firefox build...
🔄 Submitting to Mozilla Add-ons...
🎉 Successfully submitted to Firefox Add-ons for review!
✅ Extension passed validation and is now in the review queue
```

**If it fails:** Check credentials in .env file match Mozilla developer console.

---

## 🔑 Credential Management

### Mozilla API Keys
- **Where to get:** https://addons.mozilla.org/developers/addon/api/key/
- **Current values:** Already in `.env.example` (working as of Aug 2025)
- **Extension ID:** `palestinian-domain-blocker@solidarity.org`

### GitHub
- **Auto-releases:** GitHub Actions uses built-in `GITHUB_TOKEN` (no setup needed)
- **Manual API access:** Personal access token available in `CREDENTIALS.txt` if needed
- **Repository:** https://github.com/arcanstone/Palestinian-Domain-Blocker-v2

---

## 📁 Repository Structure (Essential Files Only)

```
Palestinian-Domain-Blocker-v2/
├── manifest.json                    # Chrome manifest
├── manifest-v2-firefox.json         # Firefox manifest  
├── background.js + background-firefox.js  # Core blocking logic
├── popup.html/js + blocked.html/js   # UI components
├── dino-game.js + pixel-fonts.js     # Game files
├── icons/ (4 PNG files)              # Extension icons
├── google-example/ (2 PNG files)     # Game sprites
├── deploy-firefox.js                 # Firefox deployment script
├── .github/workflows/release.yml     # Auto-release workflow
├── package.json                      # NPM config + scripts
├── README.md + LICENSE               # Documentation
└── DEPLOYMENT_GUIDE.md (this file)   # Instructions for Claude
```

**Never commit:** ZIP files, dist/ folders, node_modules/, .env files

---

## 🎮 Game Physics Settings (DO NOT CHANGE)

The dinosaur game has been perfectly tuned:
- **Jump Power:** 3 (perfect height)
- **Gravity:** 0.08 (smooth landing)
- **Animation:** `Math.sin(animationFrame * 0.15) * 1` (running bobbing)
- **Collision:** 4px dino padding, 2px obstacle padding

**⚠️ Do not modify these values** - user confirmed they are perfect.

---

## 🐛 Common Issues & Solutions

### GitHub Release Not Created
**Problem:** Tag pushed but no release appeared
**Solution:** Check GitHub Actions tab for errors. Workflow may need permissions.

### Firefox Deployment Fails
**Problem:** `web-ext` command fails or credentials rejected
**Solution:** 
1. Verify credentials in .env match Mozilla developer console
2. Check extension ID matches registered extension
3. Ensure all required files exist

### Build Errors
**Problem:** Missing dependencies or archiver errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Version Mismatch
**Problem:** Different versions in manifest files
**Solution:** Always update ALL THREE files with same version number

---

## 📋 Release Checklist

Before creating a release, verify:

- [ ] All 3 manifest files have same version number
- [ ] Extension builds without errors (`npm install` succeeds)
- [ ] Firefox deployment script runs without errors
- [ ] Game physics are unchanged (jumpPower: 3, gravity: 0.08)
- [ ] No ZIP files or build artifacts in repository
- [ ] Commit message follows format with Claude Code attribution

After release:
- [ ] GitHub release appears with both Chrome and Firefox ZIP files
- [ ] Firefox Add-ons store shows new version (if deployed)
- [ ] Extension ID remains `palestinian-domain-blocker@solidarity.org`

---

## 🤖 Claude Session Template

When starting a new Claude session for releases:

```
I need to create a new release (v3.1.X) for the Palestinian Domain Blocker extension.

Repository: C:\Users\14164\Documents\israel_blocker\Palestinian-Domain-Blocker-v2\
Current working version: 3.1.4

Please follow the DEPLOYMENT_GUIDE.md for exact steps. The key things:
1. Update version in 3 files (manifest.json, manifest-v2-firefox.json, package.json)
2. Test builds work
3. Commit and push
4. Create and push git tag for automated release
5. Optionally deploy to Firefox store using credentials in .env.example

Firefox credentials are in .env.example file - copy to .env if needed.
```

This ensures consistent releases across all Claude sessions! 🚀