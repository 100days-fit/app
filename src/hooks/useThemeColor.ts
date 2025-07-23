/**
 * useThemeColor.ts
 *
 * Hook to get a color value based on the current color scheme or a provided prop fallback.
 * Integrates with Colors.ts and useColorScheme. Used by themed components for dynamic styling.
 */

import { Colors } from '../constants/Colors';
import useColorScheme from './useColorScheme';

export type ThemeColorName = keyof typeof Colors.light;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
): string {
  const scheme: 'light' | 'dark' = useColorScheme();
  if (props[scheme]) {
    return props[scheme]!;
  }
  return Colors[scheme][colorName];
}
