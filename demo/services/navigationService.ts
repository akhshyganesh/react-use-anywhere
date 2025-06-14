import { createSingletonNavigationService } from '../../lib';

// Create a singleton navigation service instance
export const navigationService = createSingletonNavigationService({
  enableWarnings: true,
  fallbackBehavior: 'warn',
});