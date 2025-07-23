import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../useThemeColor';
import { Colors } from '@/constants/Colors';

// Mock useColorScheme hook
jest.mock('../useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'),
}));

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to light theme by default
    const useColorScheme = require('../useColorScheme').default;
    useColorScheme.mockReturnValue('light');
  });

  it('returns light theme color when in light mode', () => {
    const { result } = renderHook(() => 
      useThemeColor({}, 'text')
    );
    
    expect(result.current).toBe(Colors.light.text);
  });

  it('returns dark theme color when in dark mode', () => {
    const useColorScheme = require('../useColorScheme').default;
    useColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => 
      useThemeColor({}, 'background')
    );
    
    expect(result.current).toBe(Colors.dark.background);
  });

  it('uses prop color over theme color in light mode', () => {
    const { result } = renderHook(() => 
      useThemeColor({ light: '#FF0000', dark: '#00FF00' }, 'text')
    );
    
    expect(result.current).toBe('#FF0000');
  });

  it('uses prop color over theme color in dark mode', () => {
    const useColorScheme = require('../useColorScheme').default;
    useColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => 
      useThemeColor({ light: '#FF0000', dark: '#00FF00' }, 'text')
    );
    
    expect(result.current).toBe('#00FF00');
  });

  it('falls back to theme color when prop color is undefined', () => {
    const { result } = renderHook(() => 
      useThemeColor({ light: undefined, dark: undefined }, 'highlight')
    );
    
    expect(result.current).toBe(Colors.light.highlight);
  });

  it('handles missing dark prop in dark mode', () => {
    const useColorScheme = require('../useColorScheme').default;
    useColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => 
      useThemeColor({ light: '#FF0000' }, 'text')
    );
    
    // Should fall back to theme color since dark prop is missing
    expect(result.current).toBe(Colors.dark.text);
  });

  it('handles missing light prop in light mode', () => {
    const { result } = renderHook(() => 
      useThemeColor({ dark: '#00FF00' }, 'text')
    );
    
    // Should fall back to theme color since light prop is missing
    expect(result.current).toBe(Colors.light.text);
  });

  it('works with all color names from theme', () => {
    const colorNames = Object.keys(Colors.light) as Array<keyof typeof Colors.light>;
    
    colorNames.forEach(colorName => {
      const { result } = renderHook(() => 
        useThemeColor({}, colorName)
      );
      
      expect(result.current).toBe(Colors.light[colorName]);
    });
  });

  it('updates when color scheme changes', () => {
    const useColorScheme = require('../useColorScheme').default;
    
    const { result, rerender } = renderHook(() => 
      useThemeColor({}, 'text')
    );
    
    // Initial light mode
    expect(result.current).toBe(Colors.light.text);
    
    // Change to dark mode
    useColorScheme.mockReturnValue('dark');
    rerender();
    
    expect(result.current).toBe(Colors.dark.text);
  });

  it('prioritizes prop colors even when scheme changes', () => {
    const useColorScheme = require('../useColorScheme').default;
    
    const { result, rerender } = renderHook(() => 
      useThemeColor({ light: '#FF0000', dark: '#00FF00' }, 'text')
    );
    
    // Light mode with prop
    expect(result.current).toBe('#FF0000');
    
    // Change to dark mode
    useColorScheme.mockReturnValue('dark');
    rerender();
    
    // Should use dark prop color
    expect(result.current).toBe('#00FF00');
  });

  it('handles empty props object', () => {
    const { result } = renderHook(() => 
      useThemeColor({}, 'primary')
    );
    
    expect(result.current).toBe(Colors.light.primary);
  });

  it('type checks color names', () => {
    // This is a compile-time test, but we can verify runtime behavior
    const { result } = renderHook(() => 
      // @ts-expect-error - Testing invalid color name
      useThemeColor({}, 'invalidColor')
    );
    
    // Should return undefined or throw based on implementation
    expect(result.current).toBeUndefined();
  });
});