/**
 * useColorScheme.ts
 *
 * React Native hook to get the current color scheme (light or dark).
 * Defaults to 'light' if unavailable. Used for theming throughout the app.
 */

import { useColorScheme as _useColorScheme } from 'react-native';

export default function useColorScheme(): 'light' | 'dark' {
    return _useColorScheme() ?? 'light';
}
