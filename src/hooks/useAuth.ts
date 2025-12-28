/**
 * useAuth.ts
 *
 * Convenience hook to access authentication context.
 * Use this hook in components that need auth state or methods.
 */

import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Access authentication state and methods
 *
 * @returns Auth context with user, isAuthenticated, and auth methods
 * @throws Error if used outside AuthProvider
 *
 * @example
 * ```tsx
 * function ProfileScreen() {
 *   const { user, isLoading, signOut } = useAuth();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!user) return <LoginPrompt />;
 *
 *   return (
 *     <View>
 *       <Text>Welcome {user.displayName}</Text>
 *       <Button onPress={signOut}>Sign Out</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useAuth() {
  return useAuthContext();
}
