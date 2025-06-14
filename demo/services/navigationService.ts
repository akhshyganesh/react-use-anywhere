import { createSingletonNavigationService, createHookService } from '../../lib';

// Create a navigation service instance  
export const navigationService = createSingletonNavigationService({
  enableWarnings: true,
  fallbackBehavior: 'warn',
});

// Create an auth service for the demo
export const authService = createHookService<{
  user: string | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}>({
  enableWarnings: true,
  fallbackBehavior: 'warn',
});

// Convenience functions using the service methods
export const navigateToLogin = () => {
  navigationService.navigateToLogin?.('/login');
};

export const navigateToHome = () => {
  navigationService.navigateToHome?.('/');
};