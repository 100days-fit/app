import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignupScreen from '../signup';

// Mock the theme hook
jest.mock('../../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    const colors = {
      background: '#121212',
      highlight: '#FF5E84',
    };
    return colors[colorName] || '#000000';
  }),
}));

// Mock ThemedButton
jest.mock('../../../components/ThemedButton', () => ({
  ThemedButton: ({ title, onPress, style }: any) => {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable onPress={onPress} style={style} testID="themed-button">
        <Text>{title}</Text>
      </Pressable>
    );
  },
}));

describe('SignupScreen', () => {
  it('renders correctly with default login tab', () => {
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    // Check title and subtitle
    expect(getByText('Go ahead and set up your account')).toBeTruthy();
    expect(getByText('Sign in-up to enjoy the best managing experience')).toBeTruthy();
    
    // Check inputs
    expect(getByPlaceholderText('Email Address')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    
    // Check login is selected by default
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
    
    // Check button shows "Login"
    const button = getByText('Login');
    expect(button).toBeTruthy();
  });

  it('switches to register tab when clicked', () => {
    const { getByText, getAllByText } = render(<SignupScreen />);
    
    // Click on Register tab
    const registerTab = getByText('Register');
    fireEvent.press(registerTab);
    
    // Check button text changes to "Register"
    const buttons = getAllByText('Register');
    expect(buttons.length).toBe(2); // Tab text and button text
  });

  it('switches back to login tab when clicked', () => {
    const { getByText, getAllByText } = render(<SignupScreen />);
    
    // First switch to register
    fireEvent.press(getByText('Register'));
    
    // Then switch back to login
    const loginTab = getAllByText('Login')[0]; // Get the tab, not the button
    fireEvent.press(loginTab);
    
    // Check button text changes back to "Login"
    const buttons = getAllByText('Login');
    expect(buttons.length).toBe(2); // Tab text and button text
  });

  it('renders all form elements', () => {
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    // Check all form elements
    expect(getByPlaceholderText('Email Address')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Remember me')).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
    expect(getByText('Or login with')).toBeTruthy();
    expect(getByText('Google')).toBeTruthy();
    expect(getByText('Facebook')).toBeTruthy();
  });

  it('email input has correct keyboard type', () => {
    const { getByPlaceholderText } = render(<SignupScreen />);
    
    const emailInput = getByPlaceholderText('Email Address');
    expect(emailInput.props.keyboardType).toBe('email-address');
    expect(emailInput.props.autoCapitalize).toBe('none');
  });

  it('password input is secure', () => {
    const { getByPlaceholderText } = render(<SignupScreen />);
    
    const passwordInput = getByPlaceholderText('Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('forgot password link is pressable', () => {
    const { getByText } = render(<SignupScreen />);
    
    const forgotPassword = getByText('Forgot Password?');
    expect(forgotPassword.parent.props.onPress).toBeDefined();
  });

  it('social login buttons are pressable', () => {
    const { getByText } = render(<SignupScreen />);
    
    const googleButton = getByText('Google').parent;
    const facebookButton = getByText('Facebook').parent;
    
    expect(googleButton.props.onPress).toBeDefined();
    expect(facebookButton.props.onPress).toBeDefined();
  });

  it('applies correct styles for active tab', () => {
    const { getByText } = render(<SignupScreen />);
    
    const loginTab = getByText('Login').parent;
    const registerTab = getByText('Register').parent;
    
    // Login tab should have active styles initially
    expect(loginTab.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
      })
    );
    
    // Register tab should not have active styles
    expect(registerTab.props.style).toEqual({});
  });

  it('updates tab styles when switching', () => {
    const { getByText, rerender } = render(<SignupScreen />);
    
    // Click on Register tab
    const registerTab = getByText('Register');
    fireEvent.press(registerTab);
    
    // Force re-render to ensure state update
    rerender(<SignupScreen />);
    
    // Now register tab should have active styles
    const registerTabAfter = getByText('Register').parent;
    expect(registerTabAfter.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: '#fff',
      })
    );
  });

  it('renders with correct theme colors', () => {
    const { getByText, UNSAFE_getByType } = render(<SignupScreen />);
    
    // Check that highlight color is applied to forgot password
    const forgotPassword = getByText('Forgot Password?');
    expect(forgotPassword.props.style).toEqual({ color: '#FF5E84' });
    
    // Check background color
    const mainView = UNSAFE_getByType('View');
    expect(mainView.props.style).toEqual(
      expect.objectContaining({ backgroundColor: '#121212' })
    );
  });

  it('renders remember me checkbox', () => {
    const { getByText, UNSAFE_getAllByType } = render(<SignupScreen />);
    
    expect(getByText('Remember me')).toBeTruthy();
    
    // Find the checkbox view
    const views = UNSAFE_getAllByType('View');
    const checkbox = views.find(view => 
      view.props.className && view.props.className.includes('w-4 h-4 border')
    );
    
    expect(checkbox).toBeTruthy();
  });

  it('card has correct shadow styles', () => {
    const { UNSAFE_getAllByType } = render(<SignupScreen />);
    
    const views = UNSAFE_getAllByType('View');
    const card = views.find(view => 
      view.props.className && view.props.className.includes('rounded-3xl shadow-lg')
    );
    
    expect(card.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      })
    );
  });
});