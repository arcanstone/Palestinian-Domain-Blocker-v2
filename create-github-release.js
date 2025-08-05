const fs = require('fs');

const version = "3.1.4";
const releaseData = {
    tag_name: `v${version}`,
    target_commitish: "master",
    name: `Palestinian Domain Blocker v${version}`,
    body: `## What's New in v${version}

🧹 **Repository Cleanup & Automation**
- Removed duplicate and unnecessary files while preserving all functionality
- Added automated Firefox Add-ons deployment system
- Fixed Firefox manifest background script reference
- Streamlined extension structure with only essential files

🦊 **Firefox Store Submission** 
- Extension successfully submitted to Mozilla Add-ons store
- Passed all validation checks
- Now awaiting manual review (typically 1-7 days)

🎮 **Game Features Maintained**
- Chrome dinosaur sprite with running animation  
- Tuned jump physics (jumpPower: 3, gravity: 0.08)
- Proper collision detection with tank obstacles
- Pixel-perfect fonts for retro gaming experience

🚀 **Developer Experience**
- Automated deployment: \`npm run deploy:firefox\`
- Clean repository structure (~15 essential files)
- Both Chrome and Firefox extensions build correctly

## Downloads

- **Firefox**: [Install from Add-ons Store](https://addons.mozilla.org/en-US/firefox/addon/palestinian-domain-blocker/) (pending approval)
- **Chrome/Edge**: Download the Chrome package below

## Files
- \`palestinian-domain-blocker-chrome-v${version}.zip\` - Chrome/Edge extension
- \`palestinian-domain-blocker-firefox-v${version}.zip\` - Firefox extension (for manual installation)

Both packages contain the same blocking functionality with browser-specific optimizations.`,
    draft: false,
    prerelease: false
};

console.log('🚀 Creating GitHub Release v' + version);
console.log('\n📋 Release Notes:');
console.log(releaseData.body);

console.log('\n🔑 To create the release, run this command with your GitHub token:');
console.log(`curl -X POST \\`);
console.log(`  -H "Authorization: token YOUR_GITHUB_TOKEN" \\`);
console.log(`  -H "Accept: application/vnd.github.v3+json" \\`);
console.log(`  https://api.github.com/repos/arcanstone/Palestinian-Domain-Blocker-v2/releases \\`);
console.log(`  -d '${JSON.stringify(releaseData, null, 2)}'`);

console.log('\n📎 After creating the release, upload these files:');
console.log(`- palestinian-domain-blocker-chrome-v${version}.zip`);
console.log(`- palestinian-domain-blocker-firefox-v${version}.zip`);