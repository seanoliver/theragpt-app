import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeProvider, useTheme, ThemeContext } from './theme.context';
import { ThemeOption, loadThemeSelection, saveThemeSelection } from './theme.service';

// Mock theme service
jest.mock('./theme.service', () => ({
  ThemeOption: {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
    SYSTEM: 'SYSTEM',
  },
  loadThemeSelection: jest.fn(),
  saveThemeSelection: jest.fn(),
  getSystemTheme: jest.fn(() => 'LIGHT'),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Appearance API
jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  return {
    ...ReactNative,
    Appearance: {
      getColorScheme: jest.fn(() => 'light'),
      addChangeListener: jest.fn(),
      removeChangeListener: jest.fn(),
    },
  };
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with stored theme if available', async () => {
    (loadThemeSelection as jest.Mock).mockResolvedValue(ThemeOption.DARK);

    const { result, waitForNextUpdate } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    // Initial state before async operations complete
    expect(result.current.theme).toBe(ThemeOption.SYSTEM);

    await waitForNextUpdate();

    // After loading from storage
    expect(result.current.theme).toBe(ThemeOption.DARK);
    expect(loadThemeSelection).toHaveBeenCalledTimes(1);
  });

  it('should initialize with SYSTEM theme if no stored theme', async () => {
    (loadThemeSelection as jest.Mock).mockResolvedValue(null);

    const { result, waitForNextUpdate } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    // Initial state before async operations complete
    expect(result.current.theme).toBe(ThemeOption.SYSTEM);

    await waitForNextUpdate();

    // Should still be SYSTEM after loading from storage returns null
    expect(result.current.theme).toBe(ThemeOption.SYSTEM);
    expect(loadThemeSelection).toHaveBeenCalledTimes(1);
  });

  it('should update theme when setTheme is called', async () => {
    (loadThemeSelection as jest.Mock).mockResolvedValue(ThemeOption.LIGHT);

    const { result, waitForNextUpdate } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitForNextUpdate();

    act(() => {
      result.current.setTheme(ThemeOption.DARK);
    });

    expect(result.current.theme).toBe(ThemeOption.DARK);
    expect(saveThemeSelection).toHaveBeenCalledWith(ThemeOption.DARK);
  });

  it('should handle AsyncStorage errors gracefully', async () => {
    const error = new Error('Storage error');
    (loadThemeSelection as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    // Should default to SYSTEM even if there's an error
    await waitForNextUpdate();
    expect(result.current.theme).toBe(ThemeOption.SYSTEM);
  });

  it('should listen for system theme changes when SYSTEM is selected', async () => {
    (loadThemeSelection as jest.Mock).mockResolvedValue(ThemeOption.SYSTEM);

    const { result, waitForNextUpdate } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitForNextUpdate();

    // Verify that the appearance listener was added
    expect(Appearance.addChangeListener).toHaveBeenCalled();

    // Simulate system theme change
    const mockListener = Appearance.addChangeListener.mock.calls[0][0];
    act(() => {
      // Call the listener with a dark color scheme
      mockListener({ colorScheme: 'dark' });
    });

    // The effective theme should update based on system change
    expect(result.current.effectiveTheme).toBe(ThemeOption.DARK);
  });
});

// Test component for integration tests
const TestThemeConsumer = () => {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <View testID="theme-consumer">
      <Text testID="current-theme">{theme}</Text>
      <Text testID="effective-theme">{effectiveTheme}</Text>
      <TouchableOpacity
        testID="set-light"
        onPress={() => setTheme(ThemeOption.LIGHT)}
      >
        <Text>Set Light</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="set-dark"
        onPress={() => setTheme(ThemeOption.DARK)}
      >
        <Text>Set Dark</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="set-system"
        onPress={() => setTheme(ThemeOption.SYSTEM)}
      >
        <Text>Set System</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('Theme Context Integration', () => {
  it('should update UI when theme changes', async () => {
    (loadThemeSelection as jest.Mock).mockResolvedValue(ThemeOption.LIGHT);

    const { getByTestId } = render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    // Wait for initial theme to load
    await waitFor(() => {
      expect(getByTestId('current-theme').props.children).toBe(ThemeOption.LIGHT);
    });

    // Change theme to dark
    fireEvent.press(getByTestId('set-dark'));

    // UI should update
    expect(getByTestId('current-theme').props.children).toBe(ThemeOption.DARK);
    expect(getByTestId('effective-theme').props.children).toBe(ThemeOption.DARK);
    expect(saveThemeSelection).toHaveBeenCalledWith(ThemeOption.DARK);
  });

  it('should reflect system theme when set to SYSTEM', async () => {
    (loadThemeSelection as jest.Mock).mockResolvedValue(ThemeOption.LIGHT);

    const { getByTestId } = render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    // Wait for initial theme to load
    await waitFor(() => {
      expect(getByTestId('current-theme').props.children).toBe(ThemeOption.LIGHT);
    });

    // Mock system theme as dark
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

    // Change theme to system
    fireEvent.press(getByTestId('set-system'));

    // Current theme should be SYSTEM, effective theme should be DARK
    expect(getByTestId('current-theme').props.children).toBe(ThemeOption.SYSTEM);
    expect(getByTestId('effective-theme').props.children).toBe(ThemeOption.DARK);
  });
});