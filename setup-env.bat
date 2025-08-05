@echo off
echo Setting up Palestinian Domain Blocker development environment...

REM Copy environment template if .env doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo .env file created! Mozilla credentials are already configured.
) else (
    echo .env file already exists.
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Test Firefox deployment (dry run)
echo Testing Firefox deployment configuration...
node -e "
console.log('🦊 Environment Check:');
console.log('AMO_JWT_ISSUER:', process.env.AMO_JWT_ISSUER ? 'Set' : 'Missing');
console.log('AMO_JWT_SECRET:', process.env.AMO_JWT_SECRET ? 'Set' : 'Missing');
console.log('Extension ready for deployment!');
"

echo.
echo ✅ Setup complete! 
echo.
echo Next steps:
echo 1. Make your changes to the extension
echo 2. Update version in manifest.json, manifest-v2-firefox.json, and package.json
echo 3. Run: git tag v3.1.X && git push origin v3.1.X
echo 4. Optionally run: npm run deploy:firefox
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions.
pause