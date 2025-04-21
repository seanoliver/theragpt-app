import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeOption, isValidTheme, getAvailableThemes, getSystemTheme, saveThemeSelection, loadThemeSelection, clearThemeSelection } from './theme.service';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Appearance API
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
  },
}));

const THEME_STORAGE_KEY = 'user_theme_preference';

describe('ThemeOption enum', () => {
  it('should include LIGHT, DARK, SYSTEM', () => {
    expect(ThemeOption.LIGHT).toBeDefined();
    expect(ThemeOption.DARK).toBeDefined();
    expect(ThemeOption.SYSTEM).toBeDefined();
  });
});

describe('getAvailableThemes', () => {
  it('should return all theme options', () => {
    const themes = getAvailableThemes();
    expect(themes).toEqual([ThemeOption.LIGHT, ThemeOption.DARK, ThemeOption.SYSTEM]);
    expect(themes.length).toBe(3);
  });
});

describe('isValidTheme', () => {
  it('should validate correct theme strings', () => {
    expect(isValidTheme('LIGHT')).toBe(true);
    expect(isValidTheme('DARK')).toBe(true);
    expect(isValidTheme('SYSTEM')).toBe(true);
  });

  it('should invalidate incorrect theme strings', () => {
    expect(isValidTheme('light')).toBe(false); // case sensitive
    expect(isValidTheme('BLUE')).toBe(false); // non-existent theme
    expect(isValidTheme('')).toBe(false);
    expect(isValidTheme(null as any)).toBe(false);
    expect(isValidTheme(undefined as any)).toBe(false);
  });
});

describe('getSystemTheme', () => {
  it('should return LIGHT when system theme is light', () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');
    expect(getSystemTheme()).toBe(ThemeOption.LIGHT);
  });

  it('should return DARK when system theme is dark', () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');
    expect(getSystemTheme()).toBe(ThemeOption.DARK);
  });

  it('should return LIGHT as fallback when system theme is null', () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue(null);
    expect(getSystemTheme()).toBe(ThemeOption.LIGHT);
  });
});

describe('saveThemeSelection / loadThemeSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should persist theme selection to AsyncStorage', async () => {
    await saveThemeSelection(ThemeOption.DARK);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, ThemeOption.DARK);
  });

  it('should retrieve theme selection from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(ThemeOption.DARK);
    const theme = await loadThemeSelection();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
    expect(theme).toBe(ThemeOption.DARK);
  });

  it('should return null if no theme is set', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const theme = await loadThemeSelection();
    expect(theme).toBeNull();
  });

  it('should handle AsyncStorage errors when saving', async () => {
    const error = new Error('Storage error');
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

    // Should not throw but log error
    await expect(saveThemeSelection(ThemeOption.LIGHT)).resolves.not.toThrow();
  });

  it('should handle AsyncStorage errors when loading', async () => {
    const error = new Error('Storage error');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

    // Should return null on error
    const theme = await loadThemeSelection();
    expect(theme).toBeNull();
  });
});

describe('clearThemeSelection', () => {
  it('should remove theme selection from AsyncStorage', async () => {
    await clearThemeSelection();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it('should handle AsyncStorage errors when clearing', async () => {
    const error = new Error('Storage error');
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(error);

    // Should not throw but log error
    await expect(clearThemeSelection()).resolves.not.toThrow();
  });
});