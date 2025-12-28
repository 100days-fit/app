/**
 * useRole.ts
 *
 * Hook to check if user has a specific role.
 * Use for role-based access control in the app.
 */

import { UserRole } from '@/services/auth/auth.types';
import { useAuth } from './useAuth';

/**
 * Check if user has a specific role
 *
 * @param requiredRole - The role to check for
 * @returns true if user has the required role, false otherwise
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const isAdmin = useRole(UserRole.ADMIN);
 *
 *   if (!isAdmin) {
 *     return <Text>Access denied</Text>;
 *   }
 *
 *   return <AdminDashboard />;
 * }
 * ```
 */
export function useRole(requiredRole: UserRole): boolean {
  const { role } = useAuth();
  return role === requiredRole;
}

/**
 * Check if user has any of the specified roles
 *
 * @param roles - Array of roles to check for
 * @returns true if user has any of the roles, false otherwise
 *
 * @example
 * ```tsx
 * function ContentCreator() {
 *   const canCreate = useHasAnyRole([UserRole.ORGANIZER, UserRole.ADMIN]);
 *
 *   if (!canCreate) {
 *     return <Text>You don't have permission to create content</Text>;
 *   }
 *
 *   return <CreateContentForm />;
 * }
 * ```
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const { role } = useAuth();
  return role !== null && roles.includes(role);
}

/**
 * Check if user is an admin
 *
 * @returns true if user is an admin, false otherwise
 *
 * @example
 * ```tsx
 * function Settings() {
 *   const isAdmin = useIsAdmin();
 *
 *   return (
 *     <View>
 *       <Text>Settings</Text>
 *       {isAdmin && <AdminSettings />}
 *     </View>
 *   );
 * }
 * ```
 */
export function useIsAdmin(): boolean {
  return useRole(UserRole.ADMIN);
}

/**
 * Check if user is an organizer
 *
 * @returns true if user is an organizer, false otherwise
 *
 * @example
 * ```tsx
 * function ChallengeList() {
 *   const isOrganizer = useIsOrganizer();
 *
 *   return (
 *     <View>
 *       <ChallengeCards />
 *       {isOrganizer && <CreateChallengeButton />}
 *     </View>
 *   );
 * }
 * ```
 */
export function useIsOrganizer(): boolean {
  return useRole(UserRole.ORGANIZER);
}

/**
 * Check if user is a premium user
 *
 * @returns true if user is a premium user, false otherwise
 *
 * @example
 * ```tsx
 * function FeatureGate() {
 *   const isPremium = useIsPremium();
 *
 *   if (!isPremium) {
 *     return <UpgradeToPremiumPrompt />;
 *   }
 *
 *   return <PremiumFeature />;
 * }
 * ```
 */
export function useIsPremium(): boolean {
  return useRole(UserRole.PREMIUM_USER);
}
