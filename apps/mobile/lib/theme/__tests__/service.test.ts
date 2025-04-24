import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeOption, isValidTheme, getAvailableThemes, getSystemTheme, saveThemeSelection, loadThemeSelection, clearThemeSelection } from '../service';

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

// ... existing code ...