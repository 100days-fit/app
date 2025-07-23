import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Animated } from 'react-native';
import IntroWalkthrough from '../walkthrough';

// Note: SafeAreaInsets and Dimensions are mocked globally in setup.ts

describe('IntroWalkthrough', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with first screen content', () => {
    const { getByText } = render(<IntroWalkthrough />);
    
    expect(getByText('Compete with Friends. Stay Active.')).toBeTruthy();
    expect(getByText('Join step, distance, or active minute challenges with your friends and groups.')).toBeTruthy();
    expect(getByText('Next →')).toBeTruthy();
    expect(getByText('🏃‍♂️🏃‍♀️👥')).toBeTruthy();
    expect(getByText('Leaderboard')).toBeTruthy();
  });

  it('navigates to the second screen when Next is pressed', async () => {
    const { getByText, queryByText } = render(<IntroWalkthrough />);
    
    const nextButton = getByText('Next →');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('We Track It for You.')).toBeTruthy();
      expect(getByText('MilesAhead syncs your daily steps, distance, and active minutes from your phone — no input needed.')).toBeTruthy();
      expect(getByText('📱')).toBeTruthy();
      expect(getByText('7,824 steps')).toBeTruthy();
      expect(getByText('4.3 km')).toBeTruthy();
      expect(getByText('42 active mins')).toBeTruthy();
    });

    // First screen content should not be visible
    expect(queryByText('Compete with Friends. Stay Active.')).toBeNull();
  });

  it('navigates to the third screen when Next is pressed twice', async () => {
    const { getByText, queryByText } = render(<IntroWalkthrough />);
    
    // Press Next twice
    fireEvent.press(getByText('Next →'));
    
    await waitFor(() => {
      expect(getByText('We Track It for You.')).toBeTruthy();
    });

    fireEvent.press(getByText('Next →'));

    await waitFor(() => {
      expect(getByText('Chase the Leader. Or Be One.')).toBeTruthy();
      expect(getByText('Get real-time updates and daily nudges when someone passes you in the rankings.')).toBeTruthy();
      expect(getByText('Let\'s Go 🚀')).toBeTruthy();
      expect(getByText('🏆')).toBeTruthy();
      expect(getByText('Alex')).toBeTruthy();
      expect(getByText('You')).toBeTruthy();
      expect(getByText('+2 today! 🔥')).toBeTruthy();
    });
  });

  it('does not navigate beyond the last screen', async () => {
    const { getByText } = render(<IntroWalkthrough />);
    
    // Navigate to last screen
    fireEvent.press(getByText('Next →'));
    await waitFor(() => expect(getByText('We Track It for You.')).toBeTruthy());
    
    fireEvent.press(getByText('Next →'));
    await waitFor(() => expect(getByText('Let\'s Go 🚀')).toBeTruthy());
    
    // Press the final button
    fireEvent.press(getByText('Let\'s Go 🚀'));
    
    // Should still be on the last screen
    expect(getByText('Chase the Leader. Or Be One.')).toBeTruthy();
  });

  it('navigates to specific screen using progress dots', async () => {
    const { getByLabelText, getByText } = render(<IntroWalkthrough />);
    
    // Click on the third dot
    const thirdDot = getByLabelText('Go to screen 3');
    fireEvent.press(thirdDot);

    await waitFor(() => {
      expect(getByText('Chase the Leader. Or Be One.')).toBeTruthy();
      expect(getByText('Let\'s Go 🚀')).toBeTruthy();
    });
  });

  it('can navigate backwards using progress dots', async () => {
    const { getByLabelText, getByText } = render(<IntroWalkthrough />);
    
    // Navigate to second screen
    fireEvent.press(getByText('Next →'));
    await waitFor(() => expect(getByText('We Track It for You.')).toBeTruthy());
    
    // Go back to first screen
    const firstDot = getByLabelText('Go to screen 1');
    fireEvent.press(firstDot);

    await waitFor(() => {
      expect(getByText('Compete with Friends. Stay Active.')).toBeTruthy();
    });
  });

  it('progress dots have correct accessibility states', () => {
    const { getByLabelText } = render(<IntroWalkthrough />);
    
    const firstDot = getByLabelText('Go to screen 1');
    const secondDot = getByLabelText('Go to screen 2');
    const thirdDot = getByLabelText('Go to screen 3');

    expect(firstDot.props.accessibilityState.selected).toBe(true);
    expect(secondDot.props.accessibilityState.selected).toBe(false);
    expect(thirdDot.props.accessibilityState.selected).toBe(false);
  });

  it('does not navigate when clicking on current screen dot', async () => {
    const { getByLabelText, getByText } = render(<IntroWalkthrough />);
    
    const firstScreen = getByText('Compete with Friends. Stay Active.');
    expect(firstScreen).toBeTruthy();
    
    // Click on the first dot (current screen)
    const firstDot = getByLabelText('Go to screen 1');
    fireEvent.press(firstDot);

    // Should still be on first screen
    expect(getByText('Compete with Friends. Stay Active.')).toBeTruthy();
  });

  it('button has correct accessibility label', () => {
    const { getByLabelText, getByText } = render(<IntroWalkthrough />);
    
    // First screen
    expect(getByLabelText('Next →')).toBeTruthy();
    
    // Navigate to last screen
    fireEvent.press(getByText('Next →'));
    fireEvent.press(getByText('Next →'));
    
    // Last screen
    waitFor(() => {
      expect(getByLabelText('Let\'s Go 🚀')).toBeTruthy();
    });
  });

  it('applies correct styles based on current screen', () => {
    const { getByLabelText, getAllByTestId } = render(<IntroWalkthrough />);
    
    // Check that first dot is active
    const dots = [
      getByLabelText('Go to screen 1'),
      getByLabelText('Go to screen 2'),
      getByLabelText('Go to screen 3'),
    ];

    // First dot should have active styles
    expect(dots[0].props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: '#5CF2FF',
        width: 24,
      })
    );

    // Other dots should have inactive styles
    expect(dots[1].props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: '#D1D5DB',
      })
    );
  });

  it('renders rank circles with correct colors', async () => {
    const { getByText, UNSAFE_getAllByType } = render(<IntroWalkthrough />);
    
    // Navigate to third screen
    fireEvent.press(getByText('Next →'));
    fireEvent.press(getByText('Next →'));

    await waitFor(() => {
      const rankCircles = UNSAFE_getAllByType('View').filter(
        view => view.props.style && 
        Array.isArray(view.props.style) && 
        view.props.style.some((s: any) => s.backgroundColor === '#5CF2FF' || s.backgroundColor === '#A1A1AA')
      );
      
      expect(rankCircles.length).toBe(2);
    });
  });
});