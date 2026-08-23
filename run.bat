@echo off
REM Build the local demo (Vite) and the publishable package (babel src/lib -^> dist).
npm run build
npm run build-npm
