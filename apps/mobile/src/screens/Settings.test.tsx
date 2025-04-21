import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Settings } from './Settings';
import { ThemeProvider, useTheme } from '../../lib/theme.context';
import { ThemeOption } from '../../lib/theme.service';

// Mock the theme context
jest.mock('../../lib/theme.context', () => {
  const originalModule = jest.requireActual('../../lib/theme.context');

  return {
    ...originalModule,
    useTheme: jest.fn(),
  };
});

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('Settings Screen Theme Selector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display all theme options', () => {
    // Mock the useTheme hook
    (useTheme as jest.Mock).mockReturnValue({
      theme: ThemeOption.LIGHT,
      effectiveTheme: ThemeOption.LIGHT,
      setTheme: jest.fn(),
    });

    const { getByText, getByTestId } = render(
      <Settings navigation={mockNavigation as any} />
    );

    // Check that all theme options are displayed
    expect(getByText('Light')).toBeTruthy();
    expect(getByText('Dark')).toBeTruthy();
    expect(getByText('System Default')).toBeTruthy();

    // Check that the theme selector section exists
    expect(getByTestId('theme-selector')).toBeTruthy();
  });

  it('should reflect current theme selection', () => {
    // Mock the useTheme hook with DARK theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: ThemeOption.DARK,
      effectiveTheme: ThemeOption.DARK,
      setTheme: jest.fn(),
    });

    const { getByTestId } = render(
      <Settings navigation={mockNavigation as any} />
    );

    // Check that the dark theme option is selected
    const darkOption = getByTestId('theme-option-DARK');
    expect(darkOption.props.accessibilityState.checked).toBe(true);

    // Light and System should not be selected
    const lightOption = getByTestId('theme-option-LIGHT');
    const systemOption = getByTestId('theme-option-SYSTEM');
    expect(lightOption.props.accessibilityState.checked).toBe(false);
    expect(systemOption.props.accessibilityState.checked).toBe(false);
  });

  it('should update theme and persist on user selection', () => {
    // Create a mock setTheme function
    const mockSetTheme = jest.fn();

    // Mock the useTheme hook
    (useTheme as jest.Mock).mockReturnValue({
      theme: ThemeOption.LIGHT,
      effectiveTheme: ThemeOption.LIGHT,
      setTheme: mockSetTheme,
    });

    const { getByTestId } = render(
      <Settings navigation={mockNavigation as any} />
    );

    // Select the dark theme
    fireEvent.press(getByTestId('theme-option-DARK'));

    // Check that setTheme was called with the correct theme
    expect(mockSetTheme).toHaveBeenCalledWith(ThemeOption.DARK);
  });

  it('should show the effective theme when system is selected', () => {
    // Mock the useTheme hook with SYSTEM theme but DARK effective theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: ThemeOption.SYSTEM,
      effectiveTheme: ThemeOption.DARK,
      setTheme: jest.fn(),
    });

    const { getByTestId, getByText } = render(
      <Settings navigation={mockNavigation as any} />
    );

    // System should be selected
    const systemOption = getByTestId('theme-option-SYSTEM');
    expect(systemOption.props.accessibilityState.checked).toBe(true);

    // Should show the current effective theme
    expect(getByText('Currently using: Dark')).toBeTruthy();
  });
});

// Integration test with ThemeProvider
describe('Settings Screen with ThemeProvider', () => {
  it('should update UI when theme changes', async () => {
    // Mock loadThemeSelection to return LIGHT
    jest.mock('../../lib/theme.service', () => ({
      ...jest.requireActual('../../lib/theme.service'),
      loadThemeSelection: jest.fn().mockResolvedValue(ThemeOption.LIGHT),
    }));

    // Use the actual ThemeProvider
    const { getByTestId } = render(
      <ThemeProvider>
        <Settings navigation={mockNavigation as any} />
      </ThemeProvider>
    );

    // Wait for theme to load
    await waitFor(() => {
      const lightOption = getByTestId('theme-option-LIGHT');
      expect(lightOption.props.accessibilityState.checked).toBe(true);
    });

    // Change to dark theme
    fireEvent.press(getByTestId('theme-option-DARK'));

    // Check that dark theme is now selected
    const darkOption = getByTestId('theme-option-DARK');
    expect(darkOption.props.accessibilityState.checked).toBe(true);
  });
});