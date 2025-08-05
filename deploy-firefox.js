const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuration
const EXTENSION_ID = 'palestinian-domain-blocker@solidarity.org';
const FIREFOX_FILES = [
    { src: 'manifest-v2-firefox.json', dest: 'manifest.json' },
    { src: 'background-firefox.js', dest: 'background.js' },
    { src: 'popup.html', dest: 'popup.html' },
    { src: 'popup.js', dest: 'popup.js' },
    { src: 'blocked.html', dest: 'blocked.html' },
    { src: 'blocked.js', dest: 'blocked.js' },
    { src: 'dino-game.js', dest: 'dino-game.js' },
    { src: 'pixel-fonts.js', dest: 'pixel-fonts.js' }
];

function createFirefoxBuild() {
    const buildDir = 'firefox-build';
    
    // Clean and create build directory
    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir);
    fs.mkdirSync(path.join(buildDir, 'icons'));
    fs.mkdirSync(path.join(buildDir, 'google-example'));

    // Copy core files
    FIREFOX_FILES.forEach(({ src, dest }) => {
        fs.copyFileSync(src, path.join(buildDir, dest));
    });

    // Copy icons
    const iconFiles = fs.readdirSync('icons').filter(f => f.endsWith('.png'));
    iconFiles.forEach(file => {
        fs.copyFileSync(path.join('icons', file), path.join(buildDir, 'icons', file));
    });

    // Copy game assets
    const gameFiles = fs.readdirSync('google-example');
    gameFiles.forEach(file => {
        fs.copyFileSync(path.join('google-example', file), path.join(buildDir, 'google-example', file));
    });

    return buildDir;
}

function setupWebExt() {
    console.log('🔧 Setting up web-ext for Firefox automation...');
    
    try {
        execSync('npm install -g web-ext', { stdio: 'inherit' });
        console.log('✅ web-ext installed globally');
    } catch (error) {
        console.log('⚠️  web-ext might already be installed');
    }
}

function deployToFirefox() {
    console.log('🚀 Starting Firefox Add-ons deployment...');

    // Check for required environment variables
    const requiredVars = ['AMO_JWT_ISSUER', 'AMO_JWT_SECRET'];
    const missing = requiredVars.filter(v => !process.env[v]);
    
    if (missing.length > 0) {
        console.log('❌ Missing required environment variables:');
        missing.forEach(v => console.log(`   - ${v}`));
        console.log('\n📋 Setup Instructions:');
        console.log('1. Go to: https://addons.mozilla.org/developers/addon/api/key/');
        console.log('2. Generate API credentials');
        console.log('3. Set environment variables:');
        console.log('   set AMO_JWT_ISSUER=your_issuer_here');
        console.log('   set AMO_JWT_SECRET=your_secret_here');
        console.log('4. Run this script again');
        return;
    }

    try {
        // Create Firefox build
        console.log('📦 Creating Firefox build...');
        const buildDir = createFirefoxBuild();

        // Submit to Mozilla Add-ons
        console.log('🔄 Submitting to Mozilla Add-ons...');
        const cmd = `web-ext sign --source-dir=${buildDir} --api-key=${process.env.AMO_JWT_ISSUER} --api-secret=${process.env.AMO_JWT_SECRET}`;
        
        try {
            execSync(cmd, { stdio: 'inherit' });
            console.log('🎉 Successfully submitted to Firefox Add-ons!');
        } catch (error) {
            // Check if it's the "listed add-on" case (which is actually success)
            if (error.message.includes('submitted for review') || error.message.includes('passed validation')) {
                console.log('🎉 Successfully submitted to Firefox Add-ons for review!');
                console.log('✅ Extension passed validation and is now in the review queue');
            } else {
                throw error; // Re-throw if it's a different error
            }
        }
        console.log('📋 Next steps:');
        console.log('   - Check https://addons.mozilla.org/developers/ for review status');
        console.log('   - Review typically takes 1-7 days');
        console.log('   - You\'ll receive email notifications about the review');

        // Cleanup
        fs.rmSync(buildDir, { recursive: true });

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        console.log('\n💡 Common issues:');
        console.log('   - Check your API credentials are correct');
        console.log('   - Ensure extension ID matches your registered extension');
        console.log('   - Verify all required files are present');
    }
}

// Main execution
console.log('🦊 Firefox Add-ons Automated Deployment\n');

if (process.argv.includes('--setup')) {
    setupWebExt();
} else {
    deployToFirefox();
}