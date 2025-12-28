/**
 * AuthContext.test.tsx
 *
 * Tests for AuthContext and AuthProvider
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider, useAuthContext } from '../AuthContext';
import * as authService from '@/services/auth/auth.service';
import { User, UserRole, AuthError } from '@/services/auth/auth.types';

// Mock dependencies
jest.mock('expo-secure-store');
jest.mock('@/services/auth/auth.service');

// Mock AppState
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

// Helper to create a wrapper with AuthProvider
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
};

// Mock user data
const mockUser: User = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: true,
  phoneNumber: null,
};

// Mock ID token with custom claims
const mockIdToken = btoa(JSON.stringify({ header: 'value' })) + '.' +
  btoa(JSON.stringify({
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': UserRole.USER,
    },
  })) + '.' +
  btoa(JSON.stringify({ signature: 'value' }));

const mockAdminIdToken = btoa(JSON.stringify({ header: 'value' })) + '.' +
  btoa(JSON.stringify({
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': UserRole.ADMIN,
    },
  })) + '.' +
  btoa(JSON.stringify({ signature: 'value' }));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
    (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      callback(null); // Default to no user
      return jest.fn(); // Return unsubscribe function
    });
    (authService.getIdToken as jest.Mock).mockResolvedValue(null);
  });

  describe('useAuthContext', () => {
    it('throws error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuthContext());
      }).toThrow('useAuthContext must be used within an AuthProvider');

      consoleError.mockRestore();
    });

    it('returns auth context when used within AuthProvider', () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.role).toBeNull();
    });
  });

  describe('Initial state', () => {
    it('starts with loading state', () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('sets loading to false after auth state check', async () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Auth state listener', () => {
    it('updates user when auth state changes', async () => {
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('extracts role from ID token', async () => {
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.role).toBe(UserRole.USER);
      });
    });

    it('stores token when user signs in', async () => {
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', mockIdToken);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
          'auth_token_expiry',
          expect.any(String)
        );
      });
    });

    it('clears token when user signs out', async () => {
      let authCallback: ((user: any) => void) | null = null;

      // Start with authenticated user
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        authCallback = callback;
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Sign out by triggering the callback with null
      await act(async () => {
        if (authCallback) {
          authCallback(null);
        }
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token_expiry');
      });
    });
  });

  describe('signUp', () => {
    it('signs up user successfully', async () => {
      (authService.signUpWithEmail as jest.Mock).mockResolvedValue(mockUser);
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        });
      });

      expect(authService.signUpWithEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('handles sign up error', async () => {
      const authError: AuthError = {
        code: 'auth/email-already-in-use',
        message: 'Email already in use',
      };
      (authService.signUpWithEmail as jest.Mock).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Call signUp and expect it to reject
      await act(async () => {
        try {
          await result.current.signUp({
            email: 'test@example.com',
            password: 'password123',
          });
        } catch (error) {
          // Error is expected, we'll check the state below
        }
      });

      // After act() completes, the error state should be set
      expect(result.current.error).toEqual(authError);
      expect(result.current.user).toBeNull();
    });
  });

  describe('signIn', () => {
    it('signs in user successfully', async () => {
      (authService.signInWithEmail as jest.Mock).mockResolvedValue(mockUser);
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(authService.signInWithEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.current.user).toEqual(mockUser);
    });

    it('handles sign in error', async () => {
      const authError: AuthError = {
        code: 'auth/wrong-password',
        message: 'Wrong password',
      };
      (authService.signInWithEmail as jest.Mock).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.signIn({
            email: 'test@example.com',
            password: 'wrong',
          });
        } catch (error) {
          // Error is expected
        }
      });

      expect(result.current.error).toEqual(authError);
    });
  });

  describe('signInWithGoogle', () => {
    it('calls Google sign in service', async () => {
      (authService.signInWithGoogle as jest.Mock).mockResolvedValue(mockUser);
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(authService.signInWithGoogle).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
    });

    it('handles Google sign in error', async () => {
      const authError: AuthError = {
        code: 'auth/popup-closed',
        message: 'Popup closed',
      };
      (authService.signInWithGoogle as jest.Mock).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.signInWithGoogle();
        } catch (error) {
          // Error is expected
        }
      });

      expect(result.current.error).toEqual(authError);
    });
  });

  describe('signInWithApple', () => {
    it('calls Apple sign in service', async () => {
      (authService.signInWithApple as jest.Mock).mockResolvedValue(mockUser);
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(authService.signInWithApple).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
    });

    it('handles Apple sign in error', async () => {
      const authError: AuthError = {
        code: 'auth/cancelled',
        message: 'Cancelled',
      };
      (authService.signInWithApple as jest.Mock).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.signInWithApple();
        } catch (error) {
          // Error is expected
        }
      });

      expect(result.current.error).toEqual(authError);
    });
  });

  describe('signOut', () => {
    it('signs out user successfully', async () => {
      // Start with authenticated user
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);
      (authService.signOut as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(authService.signOut).toHaveBeenCalled();
    });

    it('handles sign out error', async () => {
      const authError: AuthError = {
        code: 'auth/network-error',
        message: 'Network error',
      };
      (authService.signOut as jest.Mock).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.signOut();
        } catch (error) {
          // Error is expected
        }
      });

      expect(result.current.error).toEqual(authError);
    });
  });

  describe('refreshToken', () => {
    it('refreshes token successfully', async () => {
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock)
        .mockResolvedValueOnce(mockIdToken)
        .mockResolvedValueOnce(mockAdminIdToken);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.role).toBe(UserRole.USER);
      });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(authService.getIdToken).toHaveBeenCalledWith(true);
      await waitFor(() => {
        expect(result.current.role).toBe(UserRole.ADMIN);
      });
    });

    it('handles refresh token error', async () => {
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock)
        .mockResolvedValueOnce(mockIdToken)
        .mockRejectedValueOnce(new Error('Token refresh failed'));

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await expect(
        act(async () => {
          await result.current.refreshToken();
        })
      ).rejects.toThrow('Token refresh failed');
    });
  });

  describe('clearError', () => {
    it('clears error state', async () => {
      const authError: AuthError = {
        code: 'auth/error',
        message: 'Error',
      };
      (authService.signInWithEmail as jest.Mock).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Trigger error
      await act(async () => {
        try {
          await result.current.signIn({
            email: 'test@example.com',
            password: 'wrong',
          });
        } catch (error) {
          // Error is expected
        }
      });

      expect(result.current.error).toEqual(authError);

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('App state handling', () => {
    it('refreshes token when app comes to foreground if expired', async () => {
      let appStateCallback: ((state: string) => void) | null = null;

      (AppState.addEventListener as jest.Mock).mockImplementation((_, callback) => {
        appStateCallback = callback;
        return { remove: jest.fn() };
      });

      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });

      (authService.getIdToken as jest.Mock)
        .mockResolvedValueOnce(mockIdToken)
        .mockResolvedValueOnce(mockAdminIdToken);

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('0'); // Expired token

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Simulate app coming to foreground
      await act(async () => {
        if (appStateCallback) {
          appStateCallback('active');
        }
        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should have refreshed token
      await waitFor(() => {
        expect(authService.getIdToken).toHaveBeenCalledWith(true);
      });
    });

    it('does not refresh token if not expired', async () => {
      let appStateCallback: ((state: string) => void) | null = null;

      (AppState.addEventListener as jest.Mock).mockImplementation((_, callback) => {
        appStateCallback = callback;
        return { remove: jest.fn() };
      });

      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });

      (authService.getIdToken as jest.Mock).mockResolvedValue(mockIdToken);

      // Token not expired
      const futureTime = Date.now() + 3600 * 1000;
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(futureTime.toString());

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      jest.clearAllMocks();

      // Simulate app coming to foreground
      await act(async () => {
        if (appStateCallback) {
          appStateCallback('active');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should not have called getIdToken again
      expect(authService.getIdToken).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('handles missing ID token gracefully', async () => {
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.role).toBeNull();
      });
    });

    it('handles invalid ID token format', async () => {
      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue('invalid-token');

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.role).toBeNull();
      });
    });

    it('handles token without custom claims', async () => {
      const tokenWithoutClaims = btoa(JSON.stringify({ header: 'value' })) + '.' +
        btoa(JSON.stringify({ sub: 'user-id' })) + '.' +
        btoa(JSON.stringify({ signature: 'value' }));

      (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
        callback(mockUser);
        return jest.fn();
      });
      (authService.getIdToken as jest.Mock).mockResolvedValue(tokenWithoutClaims);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.role).toBeNull();
      });
    });
  });
});
