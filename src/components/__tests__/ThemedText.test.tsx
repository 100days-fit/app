import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    if (props.light && props.dark) {
      // Simulate light theme by default
      return props.light;
    }
    // Return hardcoded colors instead of referencing Colors
    const mockColors = {
      text: '#F5F5F5',
      background: '#121212',
      tint: '#00F5A0',
      icon: '#F5F5F5',
    };
    return mockColors[colorName] || '#000000';
  }),
}));

describe('ThemedText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text with default style', () => {
    const { getByText } = render(<ThemedText>Default Text</ThemedText>);
    
    const text = getByText('Default Text');
    expect(text).toBeTruthy();
    expect(text.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 16,
        lineHeight: 24,
      })
    );
  });

  it('renders text with title style', () => {
    const { getByText } = render(<ThemedText type="title">Title Text</ThemedText>);
    
    const text = getByText('Title Text');
    expect(text.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
      })
    );
  });

  it('renders text with subtitle style', () => {
    const { getByText } = render(<ThemedText type="subtitle">Subtitle Text</ThemedText>);
    
    const text = getByText('Subtitle Text');
    expect(text.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 20,
        fontWeight: 'bold',
      })
    );
  });

  it('renders text with defaultSemiBold style', () => {
    const { getByText } = render(<ThemedText type="defaultSemiBold">Semibold Text</ThemedText>);
    
    const text = getByText('Semibold Text');
    expect(text.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
      })
    );
  });

  it('renders text with link style', () => {
    const { getByText } = render(<ThemedText type="link">Link Text</ThemedText>);
    
    const text = getByText('Link Text');
    expect(text.props.style).toContainEqual(
      expect.objectContaining({
        lineHeight: 30,
        fontSize: 16,
        color: '#00F5A0',
      })
    );
  });

  it('applies custom style on top of type style', () => {
    const customStyle = { marginTop: 10, fontSize: 20 };
    const { getByText } = render(
      <ThemedText type="default" style={customStyle}>
        Custom Style Text
      </ThemedText>
    );
    
    const text = getByText('Custom Style Text');
    expect(text.props.style).toContainEqual(
      expect.objectContaining({
        marginTop: 10,
        fontSize: 20, // Custom style should override default
      })
    );
  });

  it('uses theme color from hook', () => {
    const { useThemeColor } = require('@/hooks/useThemeColor');
    render(<ThemedText>Theme Color Text</ThemedText>);
    
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: undefined, dark: undefined },
      'text'
    );
  });

  it('uses custom light and dark colors', () => {
    const { useThemeColor } = require('@/hooks/useThemeColor');
    render(
      <ThemedText lightColor="#FF0000" darkColor="#00FF00">
        Custom Color Text
      </ThemedText>
    );
    
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: '#FF0000', dark: '#00FF00' },
      'text'
    );
  });

  it('forwards additional props to Text component', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemedText 
        numberOfLines={1} 
        ellipsizeMode="tail"
        testID="themed-text"
        onPress={onPress}
      >
        Text with Props
      </ThemedText>
    );
    
    const text = getByText('Text with Props');
    expect(text.props.numberOfLines).toBe(1);
    expect(text.props.ellipsizeMode).toBe('tail');
    expect(text.props.testID).toBe('themed-text');
    expect(text.props.onPress).toBe(onPress);
  });

  it('applies color from theme hook', () => {
    const { getByText } = render(<ThemedText>Colored Text</ThemedText>);
    
    const text = getByText('Colored Text');
    // Check that color is applied as the first style
    expect(text.props.style[0]).toEqual({ color: '#F5F5F5' });
  });

  it('handles undefined type gracefully', () => {
    const { getByText } = render(<ThemedText type={undefined}>No Type Text</ThemedText>);
    
    const text = getByText('No Type Text');
    // Should apply default style
    expect(text.props.style).toContainEqual(
      expect.objectContaining({
        fontSize: 16,
        lineHeight: 24,
      })
    );
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <ThemedText>
        <ThemedText type="defaultSemiBold">Nested</ThemedText> Text
      </ThemedText>
    );
    
    expect(getByText('Nested')).toBeTruthy();
    expect(getByText(' Text')).toBeTruthy();
  });
});