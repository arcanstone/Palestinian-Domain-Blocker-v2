#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Production build configuration
const BUILD_CONFIG = {
    removeComments: true,
    minifyCSS: false, // Keep readable for Chrome Web Store review
    removeDebugCode: true,
    optimizeImages: false, // No images in current build
    createZip: true
};

function log(message) {
    console.log(`[BUILD] ${message}`);
}

function removeComments(content) {
    // Remove single-line comments but preserve license headers
    content = content.replace(/^[ \t]*\/\/(?![\/\*]).*$/gm, '');
    // Remove multi-line comments but preserve license headers
    content = content.replace(/\/\*(?!\*\/\s*Licensed)[\s\S]*?\*\//g, '');
    return content;
}

function removeDebugCode(content) {
    // Remove console statements
    content = content.replace(/console\.(log|error|warn|info|debug)\([^)]*\);?/g, '');
    // Remove debug blocks
    content = content.replace(/\/\/ DEBUG START[\s\S]*?\/\/ DEBUG END/g, '');
    return content;
}

function optimizeFile(filePath) {
    if (!fs.existsSync(filePath)) {
        log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalSize = content.length;

    if (BUILD_CONFIG.removeComments) {
        content = removeComments(content);
    }

    if (BUILD_CONFIG.removeDebugCode) {
        content = removeDebugCode(content);
    }

    // Remove extra whitespace but maintain readability
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/^\s+$/gm, '');

    fs.writeFileSync(filePath, content);
    
    const optimizedSize = content.length;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    log(`Optimized ${path.basename(filePath)}: ${originalSize} → ${optimizedSize} bytes (${savings}% reduction)`);
}

function updateManifestForProduction() {
    const manifestPath = 'manifest.json';
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Ensure production-ready manifest
    manifest.version = '2.0.0';
    manifest.name = 'Palestinian Domain Blocker';
    manifest.description = 'Community-driven domain blocking extension supporting Palestinian solidarity through ethical boycotts. Block Israeli domains and companies complicit in occupation.';
    
    // Remove development-only permissions if any
    if (manifest.permissions.includes('debugger')) {
        manifest.permissions = manifest.permissions.filter(p => p !== 'debugger');
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    log('Updated manifest.json for production');
}

function validateExtension() {
    const requiredFiles = [
        'manifest.json',
        'background.js',
        'popup.html',
        'popup.js',
        'blocked.html',
        'blocked.js',
        'README.md'
    ];

    const requiredIcons = [
        'icons/icon16.png',
        'icons/icon32.png',
        'icons/icon48.png',
        'icons/icon128.png'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    const missingIcons = requiredIcons.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        log(`ERROR: Missing required files: ${missingFiles.join(', ')}`);
        process.exit(1);
    }

    if (missingIcons.length > 0) {
        log(`WARNING: Missing icon files: ${missingIcons.join(', ')}`);
        log('Extension will work but icons won\'t display properly');
    }

    // Validate manifest.json
    try {
        const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
        if (!manifest.manifest_version || !manifest.name || !manifest.version) {
            throw new Error('Invalid manifest structure');
        }
        log('Extension validation passed');
    } catch (error) {
        log(`ERROR: Invalid manifest.json: ${error.message}`);
        process.exit(1);
    }
}

function createDistributionPackage() {
    const packageInfo = {
        name: 'Palestinian Domain Blocker',
        version: '2.0.0',
        description: 'Production-ready browser extension for Palestinian solidarity',
        buildDate: new Date().toISOString(),
        files: [
            'manifest.json',
            'background.js', 
            'popup.html',
            'popup.js',
            'blocked.html',
            'blocked.js',
            'README.md'
        ],
        installation: {
            chrome: 'Load unpacked extension in Developer Mode',
            edge: 'Load unpacked extension in Developer Mode',
            firefox: 'Load temporary add-on'
        },
        support: {
            github: 'https://github.com/arcanstone/Palestinian-Domain-Blocker-v2',
            issues: 'https://github.com/arcanstone/Palestinian-Domain-Blocker-v2/issues'
        }
    };

    fs.writeFileSync('package-info.json', JSON.stringify(packageInfo, null, 2));
    log('Created package-info.json');
}

function generateInstallationGuide() {
    const guide = `# Installation Guide - Palestinian Domain Blocker v2.0.0

## Chrome/Edge/Brave Installation

1. Download the extension files
2. Open your browser's Extensions page:
   - Chrome: chrome://extensions/
   - Edge: edge://extensions/
   - Brave: brave://extensions/
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the extension folder
5. Pin the extension to your toolbar

## Firefox Installation

1. Open Firefox
2. Go to about:debugging
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select manifest.json from the extension folder

## Verification

After installation, you should see:
- Palestinian flag icon in your browser toolbar
- Extension popup opens when clicked
- Blocked domains redirect to the blocked page
- All tabs (Blocked, Whitelist, Impact, Categories, Submit) are functional

## Support

- GitHub: https://github.com/arcanstone/Palestinian-Domain-Blocker-v2
- Issues: https://github.com/arcanstone/Palestinian-Domain-Blocker-v2/issues

Built with ❤️ for Palestinian solidarity
`;

    fs.writeFileSync('INSTALL.md', guide);
    log('Generated INSTALL.md');
}

// Main build process
function build() {
    log('Starting production build...');
    
    // Validate before building
    validateExtension();
    
    // Update manifest for production
    updateManifestForProduction();
    
    // Optimize JavaScript files
    optimizeFile('background.js');
    optimizeFile('popup.js');
    optimizeFile('blocked.js');
    
    // Create distribution package info
    createDistributionPackage();
    generateInstallationGuide();
    
    log('Production build completed successfully!');
    log('Extension is ready for distribution and Chrome Web Store submission.');
    
    // Final size report
    const files = ['background.js', 'popup.js', 'blocked.js', 'popup.html', 'blocked.html', 'manifest.json'];
    let totalSize = 0;
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            const size = fs.statSync(file).size;
            totalSize += size;
            log(`${file}: ${size} bytes`);
        }
    });
    
    log(`Total extension size: ${totalSize} bytes (${(totalSize / 1024).toFixed(1)} KB)`);
}

// Run build if called directly
if (require.main === module) {
    build();
}

module.exports = { build, optimizeFile, validateExtension }; 