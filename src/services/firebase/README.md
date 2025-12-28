# Firebase Configuration

This directory contains Firebase initialization and configuration for the mobile app.

## Setup

### 1. Install Required Dependencies

```bash
npm install dotenv
```

Note: `expo-secure-store` will be needed for secure token storage when implementing authentication services.

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env` in the app root directory:
   ```bash
   cp .env.example .env
   ```

2. Get Firebase configuration from the Firebase Console:
   - Go to https://console.firebase.google.com/
   - Select project: `days-fit-100-staging`
   - Go to Project Settings > Your apps > SDK setup and configuration
   - Copy the config values

3. Update `.env` with your actual Firebase configuration values

### 3. Environment Variables in Expo

Expo requires environment variables to be:
- Prefixed with `EXPO_PUBLIC_` to be accessible in the app
- Loaded through `app.config.js` (not `app.json`)
- Rebuilt after changes (restart the dev server)

The configuration is automatically loaded via `app.config.js` and made available through `expo-constants`.

## Usage

```typescript
import { auth, firebaseApp } from '@/services/firebase';

// Use Firebase Auth
const user = auth.currentUser;

// Access Firebase app instance for other services
console.log(firebaseApp.options.projectId);
```

## Files

- `config.ts` - Firebase initialization and configuration
- `index.ts` - Central export point for Firebase services
- `README.md` - This file

## Important Notes

- Never commit `.env` file to version control (it's in `.gitignore`)
- Always use `EXPO_PUBLIC_` prefix for environment variables
- Restart Expo dev server after changing environment variables
- The config validates all required variables on initialization
