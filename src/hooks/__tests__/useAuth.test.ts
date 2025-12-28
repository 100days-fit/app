/**
 * useAuth.test.ts
 *
 * Tests for useAuth hook
 */

import { renderHook } from '@testing-library/react-native';
import React from 'react';
import { useAuth } from '../useAuth';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: jest.fn(),
}));

// Mock auth service
jest.mock('@/services/auth/auth.service', () => ({
  onAuthStateChanged: jest.fn(() => jest.fn()),
  getIdToken: jest.fn(),
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock AppState
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns auth context from useAuthContext', () => {
    const mockAuthContext = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      role: null,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
      signOut: jest.fn(),
      refreshToken: jest.fn(),
      clearError: jest.fn(),
    };

    (useAuthContext as jest.Mock).mockReturnValue(mockAuthContext);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toEqual(mockAuthContext);
    expect(useAuthContext).toHaveBeenCalled();
  });

  it('returns authenticated user when logged in', () => {
    const mockUser = {
      uid: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      emailVerified: true,
      phoneNumber: null,
    };

    const mockAuthContext = {
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      role: 'user' as const,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
      signOut: jest.fn(),
      refreshToken: jest.fn(),
      clearError: jest.fn(),
    };

    (useAuthContext as jest.Mock).mockReturnValue(mockAuthContext);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.role).toBe('user');
  });

  it('returns all auth methods', () => {
    const mockSignUp = jest.fn();
    const mockSignIn = jest.fn();
    const mockSignInWithGoogle = jest.fn();
    const mockSignInWithApple = jest.fn();
    const mockSignOut = jest.fn();
    const mockRefreshToken = jest.fn();
    const mockClearError = jest.fn();

    const mockAuthContext = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      role: null,
      error: null,
      signUp: mockSignUp,
      signIn: mockSignIn,
      signInWithGoogle: mockSignInWithGoogle,
      signInWithApple: mockSignInWithApple,
      signOut: mockSignOut,
      refreshToken: mockRefreshToken,
      clearError: mockClearError,
    };

    (useAuthContext as jest.Mock).mockReturnValue(mockAuthContext);

    const { result } = renderHook(() => useAuth());

    expect(result.current.signUp).toBe(mockSignUp);
    expect(result.current.signIn).toBe(mockSignIn);
    expect(result.current.signInWithGoogle).toBe(mockSignInWithGoogle);
    expect(result.current.signInWithApple).toBe(mockSignInWithApple);
    expect(result.current.signOut).toBe(mockSignOut);
    expect(result.current.refreshToken).toBe(mockRefreshToken);
    expect(result.current.clearError).toBe(mockClearError);
  });

  it('returns loading state', () => {
    const mockAuthContext = {
      user: null,
      isLoading: true,
      isAuthenticated: false,
      role: null,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
      signOut: jest.fn(),
      refreshToken: jest.fn(),
      clearError: jest.fn(),
    };

    (useAuthContext as jest.Mock).mockReturnValue(mockAuthContext);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
  });

  it('returns error state', () => {
    const mockError = {
      code: 'auth/invalid-email',
      message: 'Invalid email address',
    };

    const mockAuthContext = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      role: null,
      error: mockError,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
      signOut: jest.fn(),
      refreshToken: jest.fn(),
      clearError: jest.fn(),
    };

    (useAuthContext as jest.Mock).mockReturnValue(mockAuthContext);

    const { result } = renderHook(() => useAuth());

    expect(result.current.error).toEqual(mockError);
  });

  it('throws error when used outside AuthProvider', () => {
    (useAuthContext as jest.Mock).mockImplementation(() => {
      throw new Error('useAuthContext must be used within an AuthProvider');
    });

    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuthContext must be used within an AuthProvider');

    consoleError.mockRestore();
  });

  it('handles context updates', () => {
    const mockAuthContext = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      role: null,
      error: null,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
      signOut: jest.fn(),
      refreshToken: jest.fn(),
      clearError: jest.fn(),
    };

    (useAuthContext as jest.Mock).mockReturnValue(mockAuthContext);

    const { result, rerender } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();

    // Update context
    const updatedContext = {
      ...mockAuthContext,
      user: {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        emailVerified: true,
        phoneNumber: null,
      },
      isAuthenticated: true,
    };

    (useAuthContext as jest.Mock).mockReturnValue(updatedContext);

    rerender();

    expect(result.current.user).toEqual(updatedContext.user);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
