/**
 * Colors.ts
 *
 * This file defines the color tokens for light and dark modes, inspired by a vibrant, modern wellness aesthetic.
 * Use these tokens throughout the app for consistent theming. Integrates with useThemeColor and Tailwind/nativewind.
 *
 * Palette:
 * - Primary: #00F5A0
 * - Accent: #6E00FF
 * - Background: #121212
 * - Text: #F5F5F5
 * - Highlight: #FF5E84
 * - Secondary: #CFFF04
 */

export const Colors = {
    light: {
        primary: '#00F5A0',
        accent: '#6E00FF',
        background: '#F5F5F5',
        text: '#121212',
        highlight: '#FF5E84',
        secondary: '#CFFF04',
        card: '#FFFFFF',
        border: '#E5E7EB', // Tailwind gray-200
    },
    dark: {
        primary: '#00F5A0',
        accent: '#6E00FF',
        background: '#121212',
        text: '#F5F5F5',
        highlight: '#FF5E84',
        secondary: '#CFFF04',
        card: '#232323',
        border: '#374151', // Tailwind gray-700
    },
};

export type ThemeColorName = keyof typeof Colors.light; 