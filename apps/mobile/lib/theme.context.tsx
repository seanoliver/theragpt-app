/**
 * Theme Context and Provider
 * Provides theme selection and management throughout the app
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { ThemeOption, getSystemTheme, loadThemeSelection, saveThemeSelection } from './theme.service';

// Theme context interface
interface ThemeContextType {
  theme: ThemeOption;
  effectiveTheme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeOption.SYSTEM,
  effectiveTheme: ThemeOption.LIGHT,
  setTheme: () => {},
});

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 * Manages theme state and provides it to the app
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Current selected theme (LIGHT, DARK, or SYSTEM)
  const [theme, setThemeState] = useState<ThemeOption>(ThemeOption.SYSTEM);

  // The actual theme to apply (always LIGHT or DARK, never SYSTEM)
  const [effectiveTheme, setEffectiveTheme] = useState<ThemeOption>(getSystemTheme());

  // Load saved theme on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await loadThemeSelection();
        if (savedTheme) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadSavedTheme();
  }, []);

  // Update effective theme when theme changes or system theme changes
  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === ThemeOption.SYSTEM) {
        setEffectiveTheme(getSystemTheme());
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    // Listen for system theme changes if using SYSTEM theme
    if (theme === ThemeOption.SYSTEM) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        updateEffectiveTheme();
      });

      return () => {
        // Clean up listener on unmount or when theme changes
        subscription.remove();
      };
    }
  }, [theme]);

  // Set theme and persist to storage
  const setTheme = async (newTheme: ThemeOption) => {
    setThemeState(newTheme);
    await saveThemeSelection(newTheme);
  };

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};