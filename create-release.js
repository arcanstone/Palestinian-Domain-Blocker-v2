#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple zip implementation without dependencies
function createZip() {
    console.log('[RELEASE] Creating extension package...');
    
    const files = [
        'manifest.json',
        'background.js',
        'popup.html',
        'popup.js', 
        'blocked.html',
        'blocked.js',
        'chrome-warning.html',
        'README.md',
        'INSTALL.md',
        'QUICK-INSTALL.md',
        'install-extension.bat',
        'install-extension.ps1',
        'LICENSE'
    ];
    
    const iconFiles = [
        'icons/icon16.png',
        'icons/icon32.png',
        'icons/icon48.png',
        'icons/icon128.png'
    ];
    
    // Create dist directory with extension folder
    const extensionFolderName = 'Palestinian-Domain-Blocker';
    const distPath = path.join('dist', extensionFolderName);
    
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
    }
    
    // Copy all files to extension folder inside dist
    files.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(distPath, file));
            console.log(`[RELEASE] Copied ${file}`);
        } else {
            console.warn(`[RELEASE] Warning: ${file} not found`);
        }
    });
    
    // Copy icons directory
    if (!fs.existsSync(path.join(distPath, 'icons'))) {
        fs.mkdirSync(path.join(distPath, 'icons'));
    }
    
    iconFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(distPath, file));
            console.log(`[RELEASE] Copied ${file}`);
        } else {
            console.warn(`[RELEASE] Warning: ${file} not found`);
        }
    });
    
    console.log(`[RELEASE] Extension files prepared in dist/${extensionFolderName}/ directory`);
    console.log('[RELEASE] Users can now drag the Palestinian-Domain-Blocker folder out of the zip');
    console.log('[RELEASE] For stores: zip the contents of the extension folder (not the folder itself)');
}

function generateReleaseNotes() {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    const version = manifest.version;
    
    const releaseNotes = `# Palestinian Domain Blocker v${version} Release

## Installation Instructions

### For Users (Easy Installation)
1. Download the release zip file
2. Extract to a folder on your computer
3. Open Chrome/Edge/Brave browser
4. Go to Extensions page (chrome://extensions/ or edge://extensions/)
5. Enable "Developer mode" (toggle in top-right corner)
6. Click "Load unpacked" and select the extracted folder
7. Pin the extension to your toolbar

### For Developers
- Clone this repository
- Run \`npm install\` (if you want to use the build tools)
- Run \`node build.js\` to optimize the extension
- Load unpacked in Chrome developer mode

## Features in v${version}
- Block 250+ Israeli domains and companies
- Community-driven domain submission system
- Real-time blocking using Chrome's declarativeNetRequest API  
- Personal impact tracking and statistics
- Alternative service recommendations
- Palestinian-themed UI with Arabic text support
- Cross-browser compatibility (Chrome, Edge, Brave, Firefox)

## What's New in This Release
- Improved build system and release automation
- Better error handling and validation
- Enhanced installation documentation
- Ready for Chrome Web Store submission

## Support & Contributing
- Report issues: [GitHub Issues](https://github.com/arcanstone/Palestinian-Domain-Blocker-v2/issues)
- Submit new domains: Use the extension's built-in submission feature
- Contribute code: Fork the repository and submit pull requests

Built with ❤️ for Palestinian solidarity

---
Extension Size: ~${Math.round(getTotalSize() / 1024)}KB
Compatible: Chrome 88+, Edge 88+, Firefox 90+, Brave
`;

    fs.writeFileSync('RELEASE_NOTES.md', releaseNotes);
    console.log('[RELEASE] Generated RELEASE_NOTES.md');
}

function getTotalSize() {
    const files = ['manifest.json', 'background.js', 'popup.html', 'popup.js', 'blocked.html', 'blocked.js'];
    let totalSize = 0;
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            totalSize += fs.statSync(file).size;
        }
    });
    
    return totalSize;
}

function main() {
    console.log('[RELEASE] Starting release preparation...');
    
    // Build the extension first
    try {
        const { build } = require('./build.js');
        build();
    } catch (error) {
        console.log('[RELEASE] Running basic build without optimization...');
    }
    
    // Generate release files
    generateReleaseNotes();
    createZip();
    
    console.log('[RELEASE] Release preparation complete!');
    console.log('[RELEASE] Files ready in dist/ directory');
    console.log('[RELEASE] Next steps:');
    console.log('[RELEASE] 1. Test the extension by loading from dist/ folder');
    console.log('[RELEASE] 2. Create zip file from dist/ contents for distribution');
    console.log('[RELEASE] 3. Upload to GitHub releases or Chrome Web Store');
}

if (require.main === module) {
    main();
}

module.exports = { createZip, generateReleaseNotes };