import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import Constants from 'expo-constants';

/**
 * Firebase configuration from environment variables
 * All variables must be prefixed with EXPO_PUBLIC_ to be accessible in Expo
 */
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Validate Firebase configuration
 * Throws an error if any required configuration is missing
 */
const validateConfig = () => {
  const required = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missing = required.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase configuration: ${missing.join(', ')}\n` +
      'Please ensure all EXPO_PUBLIC_FIREBASE_* environment variables are set in app.config.js'
    );
  }
};

// Validate configuration on initialization
validateConfig();

/**
 * Initialize Firebase app
 * Uses singleton pattern to prevent multiple initializations
 */
let firebaseApp: FirebaseApp;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

/**
 * Firebase Auth instance
 */
export const auth: Auth = getAuth(firebaseApp);

/**
 * Export Firebase app instance for other services
 */
export { firebaseApp };
