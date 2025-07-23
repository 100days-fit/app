import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RootLayout from '../_layout';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Mock dependencies
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
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
    
    expect(SplashScreen.preventAutoHideAsync).toHaveBeenCalled();
  });

  it('returns null when fonts are not loaded', () => {
    (useFonts as jest.Mock).mockReturnValue([false]);
    
    const { toJSON } = render(<RootLayout />);
    
    expect(toJSON()).toBeNull();
    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
  });

  it('hides splash screen when fonts are loaded', async () => {
    (useFonts as jest.Mock).mockReturnValue([true]);
    
    render(<RootLayout />);
    
    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });
  });

  it('loads SpaceMono font', () => {
    render(<RootLayout />);
    
    expect(useFonts).toHaveBeenCalledWith({
      SpaceMono: 'mocked-font',
    });
  });

  it('renders ThemedStack when fonts are loaded', () => {
    (useFonts as jest.Mock).mockReturnValue([true]);
    
    const { getByTestId } = render(<RootLayout />);
    
    expect(getByTestId('themed-stack')).toBeTruthy();
  });

  it('configures header with Logo component', () => {
    (useFonts as jest.Mock).mockReturnValue([true]);
    
    const { getByTestId, getByText } = render(<RootLayout />);
    
    const headerLeft = getByTestId('header-left');
    expect(headerLeft).toBeTruthy();
    
    // Logo should render inside header
    expect(getByText('Logo')).toBeTruthy();
  });

  it('sets empty header title', () => {
    (useFonts as jest.Mock).mockReturnValue([true]);
    
    const { getByTestId } = render(<RootLayout />);
    
    const headerTitle = getByTestId('header-title');
    expect(headerTitle.props.children).toBe('');
  });

  it('Logo component renders with correct structure', () => {
    (useFonts as jest.Mock).mockReturnValue([true]);
    
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
    const mockUseFonts = useFonts as jest.Mock;
    
    // Start with fonts not loaded
    mockUseFonts.mockReturnValue([false]);
    
    const { rerender, queryByTestId } = render(<RootLayout />);
    
    // Should not render content yet
    expect(queryByTestId('themed-stack')).toBeNull();
    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
    
    // Simulate fonts loaded
    mockUseFonts.mockReturnValue([true]);
    rerender(<RootLayout />);
    
    // Should now render content and hide splash
    await waitFor(() => {
      expect(queryByTestId('themed-stack')).toBeTruthy();
      expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });
  });

  it('only calls preventAutoHideAsync once', () => {
    const { rerender } = render(<RootLayout />);
    
    // Re-render multiple times
    rerender(<RootLayout />);
    rerender(<RootLayout />);
    
    // Should still only be called once (module level)
    expect(SplashScreen.preventAutoHideAsync).toHaveBeenCalledTimes(1);
  });
});