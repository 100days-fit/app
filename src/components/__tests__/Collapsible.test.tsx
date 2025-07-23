import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Collapsible } from '../Collapsible';
import { Colors } from '@/constants/Colors';

// Mock dependencies
jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('@/components/ThemedText', () => ({
  ThemedText: ({ children, type }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`themed-text-${type}`}>{children}</Text>;
  },
}));

jest.mock('@/components/ThemedView', () => ({
  ThemedView: ({ children, style }: any) => {
    const { View } = require('react-native');
    return <View testID="themed-view" style={style}>{children}</View>;
  },
}));

jest.mock('@/components/ui/IconSymbol', () => ({
  IconSymbol: ({ name, size, weight, color, style }: any) => {
    const { View } = require('react-native');
    return (
      <View 
        testID="icon-symbol" 
        accessibilityLabel={name}
        style={style}
        // Store props for testing
        {...{ size, weight, color }}
      />
    );
  },
}));

describe('Collapsible', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title and closed by default', () => {
    const { getByText, queryByText } = render(
      <Collapsible title="Test Title">
        <Text>Child Content</Text>
      </Collapsible>
    );
    
    expect(getByText('Test Title')).toBeTruthy();
    expect(queryByText('Child Content')).toBeNull();
  });

  it('expands to show children when pressed', () => {
    const { getByText, queryByText } = render(
      <Collapsible title="Expandable">
        <Text>Hidden Content</Text>
      </Collapsible>
    );
    
    // Initially closed
    expect(queryByText('Hidden Content')).toBeNull();
    
    // Press to open
    const header = getByText('Expandable').parent.parent;
    fireEvent.press(header);
    
    // Now visible
    expect(getByText('Hidden Content')).toBeTruthy();
  });

  it('collapses when pressed again', () => {
    const { getByText, queryByText } = render(
      <Collapsible title="Toggle">
        <Text>Toggleable Content</Text>
      </Collapsible>
    );
    
    const header = getByText('Toggle').parent.parent;
    
    // Open
    fireEvent.press(header);
    expect(getByText('Toggleable Content')).toBeTruthy();
    
    // Close
    fireEvent.press(header);
    expect(queryByText('Toggleable Content')).toBeNull();
  });

  it('rotates icon when expanded', () => {
    const { getByText, getByTestId } = render(
      <Collapsible title="Rotating Icon">
        <Text>Content</Text>
      </Collapsible>
    );
    
    const icon = getByTestId('icon-symbol');
    const header = getByText('Rotating Icon').parent.parent;
    
    // Check initial rotation
    expect(icon.props.style).toEqual({
      transform: [{ rotate: '0deg' }],
    });
    
    // Press to expand
    fireEvent.press(header);
    
    // Check rotated state
    expect(icon.props.style).toEqual({
      transform: [{ rotate: '90deg' }],
    });
  });

  it('uses correct icon color based on theme', () => {
    const { getByTestId } = render(
      <Collapsible title="Theme Icon">
        <Text>Content</Text>
      </Collapsible>
    );
    
    const icon = getByTestId('icon-symbol');
    expect(icon.props.color).toBe('#F5F5F5');
  });

  it('uses dark theme icon color when in dark mode', () => {
    const { useColorScheme } = require('@/hooks/useColorScheme');
    useColorScheme.mockReturnValue('dark');
    
    const { getByTestId } = render(
      <Collapsible title="Dark Theme Icon">
        <Text>Content</Text>
      </Collapsible>
    );
    
    const icon = getByTestId('icon-symbol');
    expect(icon.props.color).toBe('#F5F5F5');
  });

  it('handles null theme gracefully', () => {
    const { useColorScheme } = require('@/hooks/useColorScheme');
    useColorScheme.mockReturnValue(null);
    
    const { getByTestId } = render(
      <Collapsible title="Null Theme">
        <Text>Content</Text>
      </Collapsible>
    );
    
    const icon = getByTestId('icon-symbol');
    // Should default to light theme
    expect(icon.props.color).toBe('#F5F5F5');
  });

  it('renders multiple children correctly', () => {
    const { getByText } = render(
      <Collapsible title="Multiple Children">
        <Text>Child 1</Text>
        <Text>Child 2</Text>
        <Text>Child 3</Text>
      </Collapsible>
    );
    
    const header = getByText('Multiple Children').parent.parent;
    fireEvent.press(header);
    
    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
    expect(getByText('Child 3')).toBeTruthy();
  });

  it('applies correct styles to content container', () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <Collapsible title="Styled Content">
        <Text>Content</Text>
      </Collapsible>
    );
    
    const header = getByText('Styled Content').parent.parent;
    fireEvent.press(header);
    
    const views = UNSAFE_getAllByType('View');
    const contentView = views.find(view => 
      view.props.style && 
      view.props.style.marginTop === 6 && 
      view.props.style.marginLeft === 24
    );
    
    expect(contentView).toBeTruthy();
  });

  it('has correct TouchableOpacity props', () => {
    const { getByText } = render(
      <Collapsible title="Touch Props">
        <Text>Content</Text>
      </Collapsible>
    );
    
    const touchable = getByText('Touch Props').parent.parent;
    expect(touchable.props.activeOpacity).toBe(0.8);
  });

  it('uses correct icon props', () => {
    const { getByTestId } = render(
      <Collapsible title="Icon Props">
        <Text>Content</Text>
      </Collapsible>
    );
    
    const icon = getByTestId('icon-symbol');
    expect(icon.props.accessibilityLabel).toBe('chevron.right');
    expect(icon.props.size).toBe(18);
    expect(icon.props.weight).toBe('medium');
  });

  it('maintains state across re-renders', () => {
    const { getByText, rerender, queryByText } = render(
      <Collapsible title="Stateful">
        <Text>Stateful Content</Text>
      </Collapsible>
    );
    
    // Open it
    const header = getByText('Stateful').parent.parent;
    fireEvent.press(header);
    expect(getByText('Stateful Content')).toBeTruthy();
    
    // Re-render with same props
    rerender(
      <Collapsible title="Stateful">
        <Text>Stateful Content</Text>
      </Collapsible>
    );
    
    // Should still be open
    expect(getByText('Stateful Content')).toBeTruthy();
  });

  it('renders ThemedText with correct type', () => {
    const { getByTestId } = render(
      <Collapsible title="Text Type">
        <Text>Content</Text>
      </Collapsible>
    );
    
    expect(getByTestId('themed-text-defaultSemiBold')).toBeTruthy();
  });
});