/**
 * useRequireAuth.ts
 *
 * Hook that redirects to login if user is not authenticated.
 * Use on protected screens that require authentication.
 */

import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './useAuth';

/**
 * Redirect to login if not authenticated
 *
 * @param redirectTo - Optional path to redirect to after login (default: current path)
 *
 * @example
 * ```tsx
 * function ProtectedScreen() {
 *   useRequireAuth();
 *
 *   return (
 *     <View>
 *       <Text>This content is only visible to authenticated users</Text>
 *     </View>
 *   );
 * }
 * ```
 *
 * @example With custom redirect
 * ```tsx
 * function DashboardScreen() {
 *   useRequireAuth('/dashboard');
 *
 *   return <Dashboard />;
 * }
 * ```
 */
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Don't redirect while loading auth state
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // Build the redirect path from current location if not provided
      const currentPath = redirectTo || `/${segments.join('/')}`;

      // Redirect to login with return path
      router.replace({
        pathname: '/login',
        params: { returnTo: currentPath },
      });
    }
  }, [isAuthenticated, isLoading, router, segments, redirectTo]);
}
