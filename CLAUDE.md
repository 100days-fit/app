# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MilesAhead is a React Native/Expo fitness tracking mobile application focused on social competition. Built with Expo SDK 52, TypeScript, and NativeWind (Tailwind CSS for React Native).

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Platform-specific starts
npm run ios      # Start on iOS simulator
npm run android  # Start on Android emulator
npm run web      # Start for web

# Linting
npm run lint     # Check for linting errors
npm run lint:fix # Auto-fix linting errors

# Testing
npm test         # Run tests in watch mode
```

## Architecture & Key Patterns

### Project Structure
- **File-based routing**: Using Expo Router v4 in `src/app/`
- **Component organization**: Themed components in `src/components/` with platform-specific variants (`.ios.tsx`)
- **Styling**: Hybrid approach using NativeWind (Tailwind) + StyleSheet
- **Type safety**: TypeScript with strict mode enabled
- **Path aliases**: `@/` → `./src/`, `@assets/` → `./assets/`

### Theme System
The app uses a custom "Neon Wellness Theme" defined in `tailwind.config.js`:
- Primary: #00F5A0 (bright cyan)
- Accent: #6E00FF (purple)
- Background: #121212 (dark)
- Text: #F5F5F5 (light)
- Highlight: #FF5E84 (pink)
- Secondary: #CFFF04 (lime)

Components should use `ThemedText`, `ThemedView`, and other themed components from `src/components/` for consistent styling.

### Navigation Structure
- Root layout: `src/app/_layout.tsx` - Handles font loading and global setup
- Tab navigation: `src/app/(tabs)/_layout.tsx` - Bottom tab structure
- Main screens: `index.tsx` (home), `walkthrough.tsx` (onboarding), `signup.tsx`, `login.tsx`

### Key Dependencies
- **Firebase**: Configured but not implemented - intended for auth, database, and social features
- **Lottie**: Used for splash screen animations
- **React Navigation**: Tab and stack navigation
- **Expo modules**: Font loading, haptics, status bar, etc.

### Development Notes
- Always use themed components for consistency
- Follow existing patterns for platform-specific code
- The app targets iOS and Android (tablet support enabled)
- EAS project configured with ID: 18b76fe5-1f2c-4e5d-b029-e58c33ae3e4a
- Owner: 100days.fit

### Current Implementation Status
- UI foundation and navigation structure complete
- Onboarding flow with 3 screens implemented
- Signup screen UI complete (non-functional)
- Login screen exists but is empty
- No backend integration or core features implemented yet

## Testing

### Test Framework
The project uses **Jest** with **React Native Testing Library** for unit testing. Configuration uses the `jest-expo` preset.

### Running Tests
```bash
npm test          # Run tests in watch mode
npm test -- --coverage  # Run with coverage report
```

### Test Structure
- Test files should be placed in `__tests__` folders next to the components they test
- Use `.test.tsx` or `.test.ts` extension
- Mock external dependencies and focus on component behavior

### Key Testing Patterns
```typescript
// Mock hooks
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => Colors.light[colorName])
}));

// Mock components
jest.mock('@/components/ThemedText', () => ({
  ThemedText: ({ children }: any) => <Text>{children}</Text>
}));

// Test user interactions
fireEvent.press(button);
await waitFor(() => expect(something).toBeTruthy());
```

### Test Coverage Status
- ✅ Walkthrough screen
- ✅ Signup screen  
- ✅ Themed components (ThemedText, ThemedView, ThemedButton)
- ✅ useThemeColor hook
- ✅ Collapsible component
- ✅ Root layout
- ❌ Other components and hooks need tests

## Testing Requirements for New Features

### Mandatory Testing Policy
**ALL new features, components, hooks, and utilities MUST have comprehensive unit tests before being considered complete.**

### Test Coverage Requirements
1. **Components**: Minimum 90% coverage including:
   - All user interactions (press, swipe, input)
   - All conditional rendering paths
   - Props validation and edge cases
   - Accessibility features
   - Platform-specific behavior

2. **Hooks**: 100% coverage including:
   - All return values and state changes
   - Effect cleanup
   - Error handling
   - Edge cases and boundary conditions

3. **Utilities/Helpers**: 100% coverage including:
   - All function branches
   - Error cases
   - Type validation
   - Edge cases

### Test Implementation Guidelines
1. **Write tests BEFORE or WITH implementation** (TDD preferred)
2. **Test user behavior, not implementation details**
3. **Include both positive and negative test cases**
4. **Test accessibility features** (labels, hints, roles)
5. **Mock external dependencies** properly
6. **Use descriptive test names** that explain the expected behavior

### Example Test Structure for New Components
```typescript
// ComponentName.test.tsx
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => { /* setup */ });
  
  // Rendering tests
  it('renders correctly with required props', () => {});
  it('renders correctly with all props', () => {});
  
  // Interaction tests
  it('handles user interactions correctly', () => {});
  
  // State tests
  it('manages internal state properly', () => {});
  
  // Edge cases
  it('handles edge cases gracefully', () => {});
  
  // Accessibility
  it('has proper accessibility attributes', () => {});
  
  // Platform-specific (if applicable)
  it.ios('handles iOS-specific behavior', () => {});
  it.android('handles Android-specific behavior', () => {});
});
```

### Pre-Implementation Checklist
Before implementing any new feature:
- [ ] Define test cases based on requirements
- [ ] Create test file structure
- [ ] Write failing tests (red phase)
- [ ] Implement feature (green phase)
- [ ] Refactor if needed (refactor phase)
- [ ] Ensure >90% coverage
- [ ] Run full test suite to prevent regressions

### Continuous Testing
- Run tests before committing: `npm test -- --watchAll=false`
- Check coverage: `npm test -- --coverage`
- Fix any failing tests immediately
- Update tests when modifying existing features

## Integration Testing

### Multi-Component Flow Testing
For testing complex user journeys that span multiple components:

```typescript
// Example: Login to Dashboard flow
describe('Authentication Flow', () => {
  it('allows user to login and navigate to dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    
    // Fill login form
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    
    // Submit login
    fireEvent.press(getByText('Login'));
    
    // Verify navigation to dashboard
    await waitFor(() => {
      expect(getByText('Dashboard')).toBeTruthy();
    });
  });
});
```

### Screen Navigation Testing
Test navigation between screens using React Navigation:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: React.ReactNode) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Test" component={() => component} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### State Management Integration
For testing components with shared state (Context, Redux, etc.):

```typescript
const renderWithProviders = (
  ui: React.ReactElement,
  { initialState = {}, ...options } = {}
) => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <StateProvider initialState={initialState}>
        {children}
      </StateProvider>
    </ThemeProvider>
  );
  
  return render(ui, { wrapper: TestWrapper, ...options });
};
```

### Error Boundary Testing
Test error handling across component boundaries:

```typescript
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error');
  return <Text>No error</Text>;
};

it('handles component errors gracefully', () => {
  const { rerender } = render(
    <ErrorBoundary fallback={<Text>Error occurred</Text>}>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  );
  
  rerender(
    <ErrorBoundary fallback={<Text>Error occurred</Text>}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Error occurred')).toBeTruthy();
});
```