import { createSingletonService } from '../../lib';

// Create a service to use navigation hook anywhere
export const navigationService = createSingletonService<(path: string) => void>('navigation');

// Helper functions you can use in any file
export const goToLogin = () => {
  navigationService.use((navigate) => navigate('/login'));
};

export const goToHome = () => {
  navigationService.use((navigate) => navigate('/'));
};