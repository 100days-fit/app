import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedButton } from '../ThemedButton';
import { Colors } from '@/constants/Colors';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    const colors = {
      highlight: '#FF5E84',
      text: '#F5F5F5',
    };
    return colors[colorName] || '#000000';
  }),
}));

describe('ThemedButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title text', () => {
    const { getByText } = render(<ThemedButton title="Click Me" />);
    
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('applies theme colors correctly', () => {
    const { getByText } = render(<ThemedButton title="Themed Button" />);
    
    const button = getByText('Themed Button').parent;
    const text = getByText('Themed Button');
    
    // Check button background color
    expect(button.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: '#FF5E84',
      })
    );
    
    // Check text color
    expect(text.props.style).toEqual({ color: '#F5F5F5' });
  });

  it('handles onPress events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemedButton title="Press Me" onPress={onPress} />
    );
    
    const button = getByText('Press Me').parent;
    fireEvent.press(button);
    
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles on top of default styles', () => {
    const customStyle = {
      marginTop: 20,
      paddingHorizontal: 30,
      backgroundColor: '#CUSTOM', // This should override theme color
    };
    
    const { getByText } = render(
      <ThemedButton title="Custom Style" style={customStyle} />
    );
    
    const button = getByText('Custom Style').parent;
    
    // Custom style should come after theme style
    expect(button.props.style).toEqual([
      { backgroundColor: '#FF5E84' },
      customStyle,
    ]);
  });

  it('forwards all Pressable props', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const onLongPress = jest.fn();
    
    const { getByText } = render(
      <ThemedButton
        title="Button with Props"
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        disabled={false}
        testID="themed-button"
      />
    );
    
    const button = getByText('Button with Props').parent;
    
    expect(button.props.onPressIn).toBe(onPressIn);
    expect(button.props.onPressOut).toBe(onPressOut);
    expect(button.props.onLongPress).toBe(onLongPress);
    expect(button.props.disabled).toBe(false);
    expect(button.props.testID).toBe('themed-button');
  });

  it('applies correct className for styling', () => {
    const { getByText } = render(<ThemedButton title="Styled Button" />);
    
    const button = getByText('Styled Button').parent;
    const text = getByText('Styled Button');
    
    expect(button.props.className).toBe('px-4 py-2 rounded-lg');
    expect(text.props.className).toBe('font-semibold text-base');
  });

  it('uses theme hook for both background and text colors', () => {
    const { useThemeColor } = require('@/hooks/useThemeColor');
    render(<ThemedButton title="Theme Test" />);
    
    // Should be called twice - once for background, once for text
    expect(useThemeColor).toHaveBeenCalledTimes(2);
    expect(useThemeColor).toHaveBeenCalledWith({}, 'highlight');
    expect(useThemeColor).toHaveBeenCalledWith({}, 'text');
  });

  it('handles disabled state', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemedButton title="Disabled Button" onPress={onPress} disabled={true} />
    );
    
    const button = getByText('Disabled Button').parent;
    fireEvent.press(button);
    
    // onPress should not be called when disabled
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with long title text', () => {
    const longTitle = 'This is a very long button title that might wrap to multiple lines';
    const { getByText } = render(<ThemedButton title={longTitle} />);
    
    expect(getByText(longTitle)).toBeTruthy();
  });

  it('handles empty title gracefully', () => {
    const { getByText } = render(<ThemedButton title="" />);
    
    // Should still render the button structure even with empty title
    const buttons = getByText('').parent;
    expect(buttons).toBeTruthy();
  });

  it('maintains pressable feedback', () => {
    const { getByText } = render(<ThemedButton title="Feedback Test" />);
    
    const button = getByText('Feedback Test').parent;
    
    // Pressable should have the default android_ripple or other feedback
    expect(button.type).toBe('Pressable');
  });

  it('handles style as array', () => {
    const style1 = { margin: 10 };
    const style2 = { padding: 20 };
    
    const { getByText } = render(
      <ThemedButton title="Array Style" style={[style1, style2]} />
    );
    
    const button = getByText('Array Style').parent;
    
    expect(button.props.style).toEqual([
      { backgroundColor: '#FF5E84' },
      [style1, style2],
    ]);
  });
});