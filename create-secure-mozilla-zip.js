const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const output = fs.createWriteStream('palestinian-domain-blocker-mozilla-v3.1.3-secure.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log('Secure Mozilla submission package created successfully!');
    console.log(`Archive size: ${archive.pointer()} bytes`);
});

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);

// Create temp directory and copy files with correct names
const tempDir = 'temp-mozilla-secure';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
    fs.mkdirSync(path.join(tempDir, 'icons'));
    fs.mkdirSync(path.join(tempDir, 'google-example'));
}

// Copy files with correct names
fs.copyFileSync('manifest-v2-firefox.json', path.join(tempDir, 'manifest.json'));
fs.copyFileSync('background-firefox.js', path.join(tempDir, 'background.js'));
fs.copyFileSync('popup.html', path.join(tempDir, 'popup.html'));
fs.copyFileSync('popup.js', path.join(tempDir, 'popup.js'));
fs.copyFileSync('blocked.html', path.join(tempDir, 'blocked.html'));
fs.copyFileSync('blocked.js', path.join(tempDir, 'blocked.js'));
fs.copyFileSync('dino-game.js', path.join(tempDir, 'dino-game.js'));
fs.copyFileSync('pixel-fonts.js', path.join(tempDir, 'pixel-fonts.js'));

// Copy icons
const iconFiles = fs.readdirSync('icons').filter(f => f.endsWith('.png'));
iconFiles.forEach(file => {
    fs.copyFileSync(path.join('icons', file), path.join(tempDir, 'icons', file));
});

// Copy google-example files
const gameFiles = fs.readdirSync('google-example');
gameFiles.forEach(file => {
    fs.copyFileSync(path.join('google-example', file), path.join(tempDir, 'google-example', file));
});

// Add all files to archive
archive.directory(tempDir, false);

archive.finalize().then(() => {
    // Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
});