import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RootLayout from '../_layout';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Note: expo-font and expo-splash-screen are mocked globally in setup.ts
// Override specific behavior for this test
const mockUseFonts = jest.fn(() => [true]);
const mockPreventAutoHideAsync = jest.fn();
const mockHideAsync = jest.fn();

jest.mock('expo-font', () => ({
  useFonts: mockUseFonts,
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: mockPreventAutoHideAsync,
  hideAsync: mockHideAsync,
}));

jest.mock('@/globals.css', () => ({}));

jest.mock('@/components/ThemedText', () => ({
  ThemedText: ({ children, type }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`themed-text-${type}`}>{children}</Text>;
  },
}));

jest.mock('@/components/ThemedStack', () => ({
  ThemedStack: ({ screenOptions }: any) => {
    const { View, Text } = require('react-native');
    const Logo = screenOptions.headerLeft();
    return (
      <View testID="themed-stack">
        <View testID="header-left">{Logo}</View>
        <Text testID="header-title">{screenOptions.headerTitle}</Text>
      </View>
    );
  },
}));

// Mock require for fonts
jest.mock('@assets/fonts/SpaceMono-Regular.ttf', () => 'mocked-font', { virtual: true });

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents splash screen auto hide on mount', () => {
    render(<RootLayout />);
    
    expect(mockPreventAutoHideAsync).toHaveBeenCalled();
  });

  it('returns null when fonts are not loaded', () => {
    mockUseFonts.mockReturnValue([false]);
    
    const { toJSON } = render(<RootLayout />);
    
    expect(toJSON()).toBeNull();
    expect(mockHideAsync).not.toHaveBeenCalled();
  });

  it('hides splash screen when fonts are loaded', async () => {
    mockUseFonts.mockReturnValue([true]);
    
    render(<RootLayout />);
    
    await waitFor(() => {
      expect(mockHideAsync).toHaveBeenCalled();
    });
  });

  it('loads SpaceMono font', () => {
    render(<RootLayout />);
    
    expect(mockUseFonts).toHaveBeenCalledWith({
      SpaceMono: 'mocked-font',
    });
  });

  it('renders ThemedStack when fonts are loaded', () => {
    mockUseFonts.mockReturnValue([true]);
    
    const { getByTestId } = render(<RootLayout />);
    
    expect(getByTestId('themed-stack')).toBeTruthy();
  });

  it('configures header with Logo component', () => {
    mockUseFonts.mockReturnValue([true]);
    
    const { getByTestId, getByText } = render(<RootLayout />);
    
    const headerLeft = getByTestId('header-left');
    expect(headerLeft).toBeTruthy();
    
    // Logo should render inside header
    expect(getByText('Logo')).toBeTruthy();
  });

  it('sets empty header title', () => {
    mockUseFonts.mockReturnValue([true]);
    
    const { getByTestId } = render(<RootLayout />);
    
    const headerTitle = getByTestId('header-title');
    expect(headerTitle.props.children).toBe('');
  });

  it('Logo component renders with correct structure', () => {
    mockUseFonts.mockReturnValue([true]);
    
    const { getByText, UNSAFE_getAllByType } = render(<RootLayout />);
    
    // Find the Logo text
    const logoText = getByText('Logo');
    expect(logoText).toBeTruthy();
    
    // Check that it's a ThemedText with subtitle type
    expect(logoText.props.testID).toBe('themed-text-subtitle');
    
    // Verify the View wrapper has correct classes
    const views = UNSAFE_getAllByType('View');
    const logoContainer = views.find(view => 
      view.props.className === 'flex-row items-center px-2'
    );
    expect(logoContainer).toBeTruthy();
  });

  it('handles font loading state changes', async () => {
    // Using the mockUseFonts defined at module level
    
    // Start with fonts not loaded
    mockUseFonts.mockReturnValue([false]);
    
    const { rerender, queryByTestId } = render(<RootLayout />);
    
    // Should not render content yet
    expect(queryByTestId('themed-stack')).toBeNull();
    expect(mockHideAsync).not.toHaveBeenCalled();
    
    // Simulate fonts loaded
    mockUseFonts.mockReturnValue([true]);
    rerender(<RootLayout />);
    
    // Should now render content and hide splash
    await waitFor(() => {
      expect(queryByTestId('themed-stack')).toBeTruthy();
      expect(mockHideAsync).toHaveBeenCalled();
    });
  });

  it('only calls preventAutoHideAsync once', () => {
    const { rerender } = render(<RootLayout />);
    
    // Re-render multiple times
    rerender(<RootLayout />);
    rerender(<RootLayout />);
    
    // Should still only be called once (module level)
    expect(mockPreventAutoHideAsync).toHaveBeenCalledTimes(1);
  });
});