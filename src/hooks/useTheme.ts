import { useState, useEffect, useCallback } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { colors } from '../theme';
import type { ThemeMode } from '../types';

const THEME_STORAGE_KEY = '@seller_app_theme';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Default to dark mode as shown in the delivery app
    setThemeMode('dark');
    setIsReady(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  const isDark = themeMode === 'dark';
  const currentColors = isDark ? colors.dark : colors.light;

  return {
    isDark,
    colors,
    currentColors,
    themeMode,
    toggleTheme,
    setTheme,
    isReady,
  };
};
