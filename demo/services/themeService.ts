import { createSingletonService, createTypedSingletonService } from '../../lib';
import { logServiceCall } from './logger';
import type { AppHooks } from '../App';

// Define the theme hook type
type ThemeHook = {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggle: () => void;
};

// 🚀 STANDARD: Create a singleton service to use theme hook anywhere
export const themeService = createSingletonService<ThemeHook>('theme');

// 🆕 TYPE-SAFE VERSION: Create with compile-time type checking
export const typedThemeService = createTypedSingletonService<AppHooks, 'theme'>('theme');

// Helper functions you can use in any file
export const toggleTheme = () => {
  logServiceCall('themeService', 'toggleTheme');
  
  const result = themeService.use((theme) => {
    theme.toggle();
    logServiceCall('themeService', 'toggle', { newTheme: theme.theme });
    console.log('Theme toggled from service');
    return theme.theme;
  });
  
  return result;
};

export const getCurrentTheme = () => {
  logServiceCall('themeService', 'getCurrentTheme');
  
  return themeService.use((theme) => {
    logServiceCall('themeService', 'getCurrentTheme.result', { theme: theme.theme });
    return theme.theme;
  });
};

export const applyThemeToBody = () => {
  logServiceCall('themeService', 'applyThemeToBody');
  
  themeService.use((theme) => {
    document.body.className = theme.isDark ? 'dark-theme' : 'light-theme';
    logServiceCall('themeService', 'applyThemeToBody.applied', { 
      className: document.body.className,
      isDark: theme.isDark 
    });
  });
};
