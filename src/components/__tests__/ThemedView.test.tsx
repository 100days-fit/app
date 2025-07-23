import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemedView } from '../ThemedView';
import { Colors } from '@/constants/Colors';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    if (props.light && props.dark) {
      // Simulate light theme by default
      return props.light;
    }
    const mockColors = {
      background: '#121212',
      text: '#F5F5F5',
    };
    return mockColors[colorName] || '#000000';
  }),
}));

describe('ThemedView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with theme background color', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view">
        <Text>Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('themed-view');
    expect(view.props.style).toContainEqual({
      backgroundColor: '#121212',
    });
  });

  it('uses custom light and dark colors', () => {
    const { useThemeColor } = require('@/hooks/useThemeColor');
    render(
      <ThemedView lightColor="#FF0000" darkColor="#00FF00">
        <Text>Content</Text>
      </ThemedView>
    );
    
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: '#FF0000', dark: '#00FF00' },
      'background'
    );
  });

  it('applies custom style on top of theme style', () => {
    const customStyle = { 
      padding: 10, 
      margin: 5,
      backgroundColor: '#CUSTOM', // This should be overridden by theme
    };
    
    const { getByTestId } = render(
      <ThemedView testID="styled-view" style={customStyle}>
        <Text>Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('styled-view');
    // Theme backgroundColor should come first, custom style second
    expect(view.props.style).toEqual([
      { backgroundColor: Colors.light.background },
      customStyle,
    ]);
  });

  it('forwards all View props', () => {
    const onLayout = jest.fn();
    const { getByTestId } = render(
      <ThemedView
        testID="view-with-props"
        onLayout={onLayout}
        pointerEvents="none"
        accessible={true}
        accessibilityLabel="Themed container"
      >
        <Text>Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('view-with-props');
    expect(view.props.onLayout).toBe(onLayout);
    expect(view.props.pointerEvents).toBe('none');
    expect(view.props.accessible).toBe(true);
    expect(view.props.accessibilityLabel).toBe('Themed container');
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </ThemedView>
    );
    
    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
  });

  it('handles array styles correctly', () => {
    const style1 = { padding: 10 };
    const style2 = { margin: 5 };
    
    const { getByTestId } = render(
      <ThemedView testID="array-style-view" style={[style1, style2]}>
        <Text>Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('array-style-view');
    expect(view.props.style).toEqual([
      { backgroundColor: Colors.light.background },
      [style1, style2],
    ]);
  });

  it('handles undefined props gracefully', () => {
    const { getByTestId } = render(
      <ThemedView 
        testID="undefined-props-view"
        style={undefined}
        lightColor={undefined}
        darkColor={undefined}
      >
        <Text>Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('undefined-props-view');
    expect(view.props.style).toEqual([
      { backgroundColor: Colors.light.background },
      undefined,
    ]);
  });

  it('uses background color from theme', () => {
    const { useThemeColor } = require('@/hooks/useThemeColor');
    render(
      <ThemedView>
        <Text>Content</Text>
      </ThemedView>
    );
    
    expect(useThemeColor).toHaveBeenCalledWith(
      { light: undefined, dark: undefined },
      'background'
    );
  });

  it('can be used as a container', () => {
    const { UNSAFE_getByType } = render(
      <ThemedView>
        <ThemedView>
          <Text>Nested content</Text>
        </ThemedView>
      </ThemedView>
    );
    
    const views = UNSAFE_getByType('View');
    expect(views).toBeTruthy();
  });

  it('applies backgroundColor as first style property', () => {
    const { getByTestId } = render(
      <ThemedView testID="bg-test" style={{ flex: 1 }}>
        <Text>Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('bg-test');
    const styles = view.props.style;
    
    // First element should be backgroundColor object
    expect(styles[0]).toEqual({ backgroundColor: Colors.light.background });
    // Second element should be custom style
    expect(styles[1]).toEqual({ flex: 1 });
  });
});