/**
 * AuthContext.tsx
 *
 * Authentication context provider for the app.
 * Manages auth state, user data, and provides auth methods to the app.
 * Handles token refresh on app foreground and listens to auth state changes.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOut as authSignOut,
  onAuthStateChanged,
  getIdToken,
} from '@/services/auth/auth.service';
import { User, UserRole, SignUpParams, SignInParams, AuthError } from '@/services/auth/auth.types';

/**
 * Auth context state interface
 */
interface AuthContextState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  error: AuthError | null;
  signUp: (params: SignUpParams) => Promise<void>;
  signIn: (params: SignInParams) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

/**
 * Default context value (throws error if used outside provider)
 */
const AuthContext = createContext<AuthContextState | undefined>(undefined);

/**
 * Token storage keys
 */
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

/**
 * Parse custom claims from ID token to extract user role
 */
function parseCustomClaims(idToken: string): { role?: UserRole } {
  try {
    // JWT tokens have 3 parts: header.payload.signature
    const payload = idToken.split('.')[1];
    if (!payload) return {};

    // Decode base64url
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(decoded);

    // Extract custom claims (Hasura sets role in custom claims)
    const role = claims['https://hasura.io/jwt/claims']?.['x-hasura-default-role'] as UserRole | undefined;

    return { role };
  } catch (error) {
    console.error('Failed to parse custom claims:', error);
    return {};
  }
}

/**
 * Store token in secure storage
 */
async function storeToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);

    // Store expiry (tokens typically valid for 1 hour)
    const expiryTime = Date.now() + 3600 * 1000;
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Failed to store token:', error);
  }
}

/**
 * Get token from secure storage
 */
async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get stored token:', error);
    return null;
  }
}

/**
 * Check if stored token is expired
 */
async function isTokenExpired(): Promise<boolean> {
  try {
    const expiryStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
    if (!expiryStr) return true;

    const expiry = parseInt(expiryStr, 10);
    return Date.now() >= expiry;
  } catch (error) {
    console.error('Failed to check token expiry:', error);
    return true;
  }
}

/**
 * Clear stored tokens
 */
async function clearStoredTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear stored tokens:', error);
  }
}

/**
 * AuthProvider component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  /**
   * Update user and role state
   */
  const updateUser = useCallback(async (newUser: User | null) => {
    setUser(newUser);

    if (newUser) {
      // Get ID token and parse role
      try {
        const token = await getIdToken();
        if (token) {
          await storeToken(token);
          const { role: parsedRole } = parseCustomClaims(token);
          setRole(parsedRole || null);
        }
      } catch (err) {
        console.error('Failed to get ID token:', err);
      }
    } else {
      setRole(null);
      await clearStoredTokens();
    }
  }, []);

  /**
   * Refresh ID token
   */
  const refreshToken = useCallback(async () => {
    try {
      const token = await getIdToken(true); // Force refresh
      if (token) {
        await storeToken(token);
        const { role: parsedRole } = parseCustomClaims(token);
        setRole(parsedRole || null);
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
      throw err;
    }
  }, []);

  /**
   * Sign up handler
   */
  const signUp = useCallback(async (params: SignUpParams) => {
    try {
      setError(null);
      setIsLoading(true);
      const newUser = await signUpWithEmail(params);
      await updateUser(newUser);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  /**
   * Sign in handler
   */
  const signIn = useCallback(async (params: SignInParams) => {
    try {
      setError(null);
      setIsLoading(true);
      const newUser = await signInWithEmail(params);
      await updateUser(newUser);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  /**
   * Google sign in handler
   */
  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const newUser = await signInWithGoogle();
      await updateUser(newUser);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  /**
   * Apple sign in handler
   */
  const handleSignInWithApple = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const newUser = await signInWithApple();
      await updateUser(newUser);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  /**
   * Sign out handler
   */
  const signOut = useCallback(async () => {
    try {
      setError(null);
      await authSignOut();
      await updateUser(null);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    }
  }, [updateUser]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Listen to auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (newUser) => {
      await updateUser(newUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [updateUser]);

  /**
   * Handle app state changes (foreground/background)
   * Refresh token when app comes to foreground if expired
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && user) {
        // Check if token is expired and refresh if needed
        const expired = await isTokenExpired();
        if (expired) {
          try {
            await refreshToken();
          } catch (err) {
            console.error('Failed to refresh token on foreground:', err);
          }
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user, refreshToken]);

  const value: AuthContextState = {
    user,
    isLoading,
    isAuthenticated: !!user,
    role,
    error,
    signUp,
    signIn,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithApple: handleSignInWithApple,
    signOut,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context (internal use, exported for testing)
 * Use the useAuth hook from @/hooks/useAuth instead
 */
export function useAuthContext(): AuthContextState {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
