/**
 * useRole.test.ts
 *
 * Tests for useRole hook and related role checking hooks
 */

import { renderHook } from '@testing-library/react-native';
import { UserRole } from '@/services/auth/auth.types';
import {
  useRole,
  useHasAnyRole,
  useIsAdmin,
  useIsOrganizer,
  useIsPremium,
} from '../useRole';
import { useAuth } from '../useAuth';

// Mock useAuth
jest.mock('../useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('useRole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRole', () => {
    it('returns true when user has the required role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      const { result } = renderHook(() => useRole(UserRole.ADMIN));

      expect(result.current).toBe(true);
    });

    it('returns false when user does not have the required role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result } = renderHook(() => useRole(UserRole.ADMIN));

      expect(result.current).toBe(false);
    });

    it('returns false when user has no role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: null,
      });

      const { result } = renderHook(() => useRole(UserRole.USER));

      expect(result.current).toBe(false);
    });

    it('checks for USER role correctly', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result } = renderHook(() => useRole(UserRole.USER));

      expect(result.current).toBe(true);
    });

    it('checks for PREMIUM_USER role correctly', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.PREMIUM_USER,
      });

      const { result } = renderHook(() => useRole(UserRole.PREMIUM_USER));

      expect(result.current).toBe(true);
    });

    it('checks for ORGANIZER role correctly', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ORGANIZER,
      });

      const { result } = renderHook(() => useRole(UserRole.ORGANIZER));

      expect(result.current).toBe(true);
    });

    it('updates when role changes', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result, rerender } = renderHook(() => useRole(UserRole.ADMIN));

      expect(result.current).toBe(false);

      // Update role to admin
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      rerender();

      expect(result.current).toBe(true);
    });
  });

  describe('useHasAnyRole', () => {
    it('returns true when user has one of the specified roles', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ORGANIZER,
      });

      const { result } = renderHook(() =>
        useHasAnyRole([UserRole.ORGANIZER, UserRole.ADMIN])
      );

      expect(result.current).toBe(true);
    });

    it('returns true when user has the only specified role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      const { result } = renderHook(() => useHasAnyRole([UserRole.ADMIN]));

      expect(result.current).toBe(true);
    });

    it('returns false when user does not have any of the specified roles', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result } = renderHook(() =>
        useHasAnyRole([UserRole.ORGANIZER, UserRole.ADMIN])
      );

      expect(result.current).toBe(false);
    });

    it('returns false when user has no role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: null,
      });

      const { result } = renderHook(() =>
        useHasAnyRole([UserRole.USER, UserRole.ADMIN])
      );

      expect(result.current).toBe(false);
    });

    it('handles empty roles array', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      const { result } = renderHook(() => useHasAnyRole([]));

      expect(result.current).toBe(false);
    });

    it('checks multiple roles correctly', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.PREMIUM_USER,
      });

      const { result } = renderHook(() =>
        useHasAnyRole([
          UserRole.USER,
          UserRole.PREMIUM_USER,
          UserRole.ORGANIZER,
          UserRole.ADMIN,
        ])
      );

      expect(result.current).toBe(true);
    });

    it('updates when role changes to match', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result, rerender } = renderHook(() =>
        useHasAnyRole([UserRole.ORGANIZER, UserRole.ADMIN])
      );

      expect(result.current).toBe(false);

      // Update role to organizer
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ORGANIZER,
      });

      rerender();

      expect(result.current).toBe(true);
    });

    it('updates when role changes to not match', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      const { result, rerender } = renderHook(() =>
        useHasAnyRole([UserRole.ORGANIZER, UserRole.ADMIN])
      );

      expect(result.current).toBe(true);

      // Update role to user
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      rerender();

      expect(result.current).toBe(false);
    });
  });

  describe('useIsAdmin', () => {
    it('returns true when user is admin', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      const { result } = renderHook(() => useIsAdmin());

      expect(result.current).toBe(true);
    });

    it('returns false when user is not admin', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result } = renderHook(() => useIsAdmin());

      expect(result.current).toBe(false);
    });

    it('returns false when user is organizer', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ORGANIZER,
      });

      const { result } = renderHook(() => useIsAdmin());

      expect(result.current).toBe(false);
    });

    it('returns false when user has no role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: null,
      });

      const { result } = renderHook(() => useIsAdmin());

      expect(result.current).toBe(false);
    });

    it('updates when user becomes admin', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result, rerender } = renderHook(() => useIsAdmin());

      expect(result.current).toBe(false);

      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      rerender();

      expect(result.current).toBe(true);
    });
  });

  describe('useIsOrganizer', () => {
    it('returns true when user is organizer', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ORGANIZER,
      });

      const { result } = renderHook(() => useIsOrganizer());

      expect(result.current).toBe(true);
    });

    it('returns false when user is not organizer', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result } = renderHook(() => useIsOrganizer());

      expect(result.current).toBe(false);
    });

    it('returns false when user is admin', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      const { result } = renderHook(() => useIsOrganizer());

      expect(result.current).toBe(false);
    });

    it('returns false when user has no role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: null,
      });

      const { result } = renderHook(() => useIsOrganizer());

      expect(result.current).toBe(false);
    });

    it('updates when user becomes organizer', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result, rerender } = renderHook(() => useIsOrganizer());

      expect(result.current).toBe(false);

      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ORGANIZER,
      });

      rerender();

      expect(result.current).toBe(true);
    });
  });

  describe('useIsPremium', () => {
    it('returns true when user is premium', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.PREMIUM_USER,
      });

      const { result } = renderHook(() => useIsPremium());

      expect(result.current).toBe(true);
    });

    it('returns false when user is not premium', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result } = renderHook(() => useIsPremium());

      expect(result.current).toBe(false);
    });

    it('returns false when user is admin', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.ADMIN,
      });

      const { result } = renderHook(() => useIsPremium());

      expect(result.current).toBe(false);
    });

    it('returns false when user has no role', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: null,
      });

      const { result } = renderHook(() => useIsPremium());

      expect(result.current).toBe(false);
    });

    it('updates when user becomes premium', () => {
      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.USER,
      });

      const { result, rerender } = renderHook(() => useIsPremium());

      expect(result.current).toBe(false);

      (useAuth as jest.Mock).mockReturnValue({
        role: UserRole.PREMIUM_USER,
      });

      rerender();

      expect(result.current).toBe(true);
    });
  });

  describe('Role combinations', () => {
    it('correctly distinguishes between all roles', () => {
      const roles = [
        UserRole.USER,
        UserRole.PREMIUM_USER,
        UserRole.ORGANIZER,
        UserRole.ADMIN,
      ];

      roles.forEach((role) => {
        (useAuth as jest.Mock).mockReturnValue({ role });

        const { result: isAdmin } = renderHook(() => useIsAdmin());
        const { result: isOrganizer } = renderHook(() => useIsOrganizer());
        const { result: isPremium } = renderHook(() => useIsPremium());
        const { result: isUser } = renderHook(() => useRole(UserRole.USER));

        expect(isAdmin.current).toBe(role === UserRole.ADMIN);
        expect(isOrganizer.current).toBe(role === UserRole.ORGANIZER);
        expect(isPremium.current).toBe(role === UserRole.PREMIUM_USER);
        expect(isUser.current).toBe(role === UserRole.USER);
      });
    });
  });
});
