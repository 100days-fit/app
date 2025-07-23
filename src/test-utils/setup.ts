/**
 * Common test setup and mocks shared across all test files
 * This file contains frequently used mocks to reduce duplication
 */

// Mock react-native-safe-area-context globally
export const mockSafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => mockSafeAreaInsets,
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaConsumer: ({ children }: any) => children(mockSafeAreaInsets),
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  initialWindowMetrics: {
    insets: mockSafeAreaInsets,
    frame: { x: 0, y: 0, width: 375, height: 812 },
  },
}));

// Mock Dimensions globally
export const mockDimensions = { width: 375, height: 812 };

jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => mockDimensions),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Animated for consistent test behavior
jest.mock('react-native/Libraries/Animated/Animated', () => {
  const ActualAnimated = jest.requireActual('react-native/Libraries/Animated/Animated');
  return {
    ...ActualAnimated,
    timing: (value: any, config: any) => ({
      start: (callback?: (result: { finished: boolean }) => void) => {
        value.setValue(config.toValue);
        callback && callback({ finished: true });
      },
      stop: jest.fn(),
    }),
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
    })),
  };
});

// Mock Expo modules
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
    platform: { ios: false, android: true, web: false },
  },
}));

// Utility function to create mock theme colors
export const createMockThemeColors = (overrides: Record<string, string> = {}) => ({
  text: '#F5F5F5',
  background: '#121212',
  tint: '#00F5A0',
  icon: '#F5F5F5',
  highlight: '#FF5E84',
  primary: '#00F5A0',
  accent: '#6E00FF',
  secondary: '#CFFF04',
  ...overrides,
});

// Common mock for useThemeColor hook
export const mockUseThemeColor = jest.fn((props: any, colorName: string) => {
  if (props.light && props.dark) {
    return props.light; // Simulate light theme by default
  }
  const colors = createMockThemeColors();
  return colors[colorName as keyof typeof colors] || '#000000';
});