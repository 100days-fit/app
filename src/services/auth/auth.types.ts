/**
 * Authentication service type definitions
 */

import { User as FirebaseUser } from 'firebase/auth';

/**
 * User role enum matching backend schema
 */
export enum UserRole {
  USER = 'user',
  PREMIUM_USER = 'premium_user',
  ORGANIZER = 'organizer',
  ADMIN = 'admin',
}

/**
 * Extended user interface with app-specific fields
 */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  role?: UserRole;
  createdAt?: string;
}

/**
 * Authentication error interface with user-friendly messages
 */
export interface AuthError {
  code: string;
  message: string;
  originalError?: unknown;
}

/**
 * Sign up parameters
 */
export interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Sign in parameters
 */
export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Map Firebase error codes to user-friendly messages
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/weak-password': 'Password is too weak. Use at least 8 characters with letters and numbers.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'No account found with this email. Please check or sign up.',
  'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please sign in again.',
};

/**
 * Convert Firebase user to app user format
 */
export function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    phoneNumber: firebaseUser.phoneNumber,
  };
}

/**
 * Create auth error from Firebase error
 */
export function createAuthError(error: unknown): AuthError {
  const firebaseError = error as { code?: string; message?: string };
  const code = firebaseError.code || 'auth/unknown';
  const message = AUTH_ERROR_MESSAGES[code] || 'An unexpected error occurred. Please try again.';

  return {
    code,
    message,
    originalError: error,
  };
}
