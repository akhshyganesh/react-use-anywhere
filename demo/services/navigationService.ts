import { createSingletonNavigationService } from '../../lib';

// Create a navigation service instance  
export const navigationService = createSingletonNavigationService({
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