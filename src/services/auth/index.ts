/**
 * Auth service barrel export
 */

export {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  getCurrentUser,
  getIdToken,
  onAuthStateChanged,
} from './auth.service';

export {
  UserRole,
  mapFirebaseUser,
  createAuthError,
  AUTH_ERROR_MESSAGES,
} from './auth.types';

export type {
  User,
  AuthError,
  SignUpParams,
  SignInParams,
} from './auth.types';
