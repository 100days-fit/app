/**
 * useRequireAuth.test.ts
 *
 * Tests for useRequireAuth hook
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { useRouter, useSegments } from 'expo-router';
import { useRequireAuth } from '../useRequireAuth';
import { useAuth } from '../useAuth';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
}));

jest.mock('../useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('useRequireAuth', () => {
  const mockReplace = jest.fn();
  const mockRouter = { replace: mockReplace };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSegments as jest.Mock).mockReturnValue(['dashboard']);
  });

  it('does not redirect when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    renderHook(() => useRequireAuth());

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to login when user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/dashboard' },
      });
    });
  });

  it('does not redirect while loading auth state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    renderHook(() => useRequireAuth());

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('uses custom redirect path when provided', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    renderHook(() => useRequireAuth('/custom-path'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/custom-path' },
      });
    });
  });

  it('builds redirect path from current segments when no custom path', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    (useSegments as jest.Mock).mockReturnValue(['profile', 'settings']);

    renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/profile/settings' },
      });
    });
  });

  it('handles empty segments', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    (useSegments as jest.Mock).mockReturnValue([]);

    renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/' },
      });
    });
  });

  it('redirects when auth state changes from loading to unauthenticated', async () => {
    // Start with loading
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { rerender } = renderHook(() => useRequireAuth(), {
      initialProps: {},
    });

    expect(mockReplace).not.toHaveBeenCalled();

    // Change to not loading and not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    rerender();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/dashboard' },
      });
    });
  });

  it('does not redirect when auth state changes from loading to authenticated', () => {
    // Start with loading
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    // Change to authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    rerender();

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('handles nested routes correctly', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    (useSegments as jest.Mock).mockReturnValue(['app', 'tabs', 'profile', 'edit']);

    renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/app/tabs/profile/edit' },
      });
    });
  });

  it('only redirects once per state change', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledTimes(1);
    });

    // Rerender without changing state
    rerender();

    // Should not redirect again
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it('handles special characters in segments', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    (useSegments as jest.Mock).mockReturnValue(['user', '123', 'profile-settings']);

    renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/user/123/profile-settings' },
      });
    });
  });

  it('prefers custom redirect over segments', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    (useSegments as jest.Mock).mockReturnValue(['some', 'path']);

    renderHook(() => useRequireAuth('/priority-path'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/priority-path' },
      });
    });
  });

  it('responds to auth state changes', async () => {
    // Start authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    expect(mockReplace).not.toHaveBeenCalled();

    // User logs out
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    rerender();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/login',
        params: { returnTo: '/dashboard' },
      });
    });
  });
});
