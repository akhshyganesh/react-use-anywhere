import { createSingletonService } from '../../lib';
import { logServiceCall } from './logger';

// 🚀 STANDARD: Create a singleton service to use navigation hook anywhere
export const navigationService = createSingletonService<(path: string) => void>('navigation');

// Helper functions you can use in any file
export const goToLogin = () => {
  logServiceCall('navigationService', 'goToLogin');
  
  navigationService.use((navigate) => {
    navigate('/login');
    logServiceCall('navigationService', 'navigate', { destination: '/login' });
  });
};

export const goToHome = () => {
  logServiceCall('navigationService', 'goToHome');
  
  navigationService.use((navigate) => {
    navigate('/');
    logServiceCall('navigationService', 'navigate', { destination: '/' });
  });
};