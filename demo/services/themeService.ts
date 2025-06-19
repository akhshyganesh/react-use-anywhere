import { createSingletonService } from '../../lib';

// Define the theme hook type
type ThemeHook = {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggle: () => void;
};

// Create a service to use theme hook anywhere
export const themeService = createSingletonService<ThemeHook>('theme');

// Helper functions you can use in any file
export const toggleTheme = () => {
  themeService.use((theme) => {
    theme.toggle();
    console.log('Theme toggled from service');
  });
};

export const getCurrentTheme = () => {
  return themeService.use((theme) => theme.theme);
};

export const applyThemeToBody = () => {
  themeService.use((theme) => {
    document.body.className = theme.isDark ? 'dark-theme' : 'light-theme';
  });
};
