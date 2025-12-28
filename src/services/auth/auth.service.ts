/**
 * Authentication service for Firebase operations
 * Handles email/password, Google, and Apple sign-in flows
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import {
  User,
  AuthError,
  SignUpParams,
  SignInParams,
  mapFirebaseUser,
  createAuthError,
} from './auth.types';

/**
 * Sign up with email and password
 * @param params - Email, password, and optional display name
 * @returns Promise<User> - Authenticated user
 * @throws AuthError
 */
export async function signUpWithEmail({
  email,
  password,
  displayName,
}: SignUpParams): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Sign in with email and password
 * @param params - Email and password
 * @returns Promise<User> - Authenticated user
 * @throws AuthError
 */
export async function signInWithEmail({ email, password }: SignInParams): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Sign in with Google
 * Note: Requires platform-specific implementation
 * Mobile: Use @react-native-google-signin/google-signin or expo-auth-session
 * @returns Promise<User> - Authenticated user
 * @throws AuthError
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    // TODO: Implement Google Sign-In flow using expo-auth-session
    // This requires platform-specific setup:
    // 1. Configure Google OAuth client IDs in Firebase Console
    // 2. Use expo-auth-session to handle OAuth flow
    // 3. Exchange authorization code for Firebase credential
    // 4. Call signInWithCredential()

    throw new Error('Google Sign-In not yet implemented. Use expo-auth-session for implementation.');
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Sign in with Apple
 * Note: Requires platform-specific implementation
 * Mobile: Use expo-apple-authentication
 * @returns Promise<User> - Authenticated user
 * @throws AuthError
 */
export async function signInWithApple(): Promise<User> {
  try {
    // TODO: Implement Apple Sign-In flow using expo-apple-authentication
    // This requires:
    // 1. Configure Apple Sign-In in Firebase Console
    // 2. Use expo-apple-authentication for iOS
    // 3. Exchange identity token for Firebase credential
    // 4. Call signInWithCredential()

    throw new Error('Apple Sign-In not yet implemented. Use expo-apple-authentication for implementation.');
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Sign out the current user
 * @returns Promise<void>
 * @throws AuthError
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Send password reset email
 * @param email - User's email address
 * @returns Promise<void>
 * @throws AuthError
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Send email verification to current user
 * @returns Promise<void>
 * @throws AuthError - If no user is signed in
 */
export async function sendEmailVerification(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    await firebaseSendEmailVerification(user);
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Get current authenticated user
 * @returns User | null
 */
export function getCurrentUser(): User | null {
  const firebaseUser = auth.currentUser;
  return firebaseUser ? mapFirebaseUser(firebaseUser) : null;
}

/**
 * Get ID token for current user
 * @param forceRefresh - Force token refresh even if not expired
 * @returns Promise<string | null> - ID token or null if no user
 * @throws AuthError
 */
export async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    throw createAuthError(error);
  }
}

/**
 * Listen to auth state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
    callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
  });
}
