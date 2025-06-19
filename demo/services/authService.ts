import { createSingletonService } from '../../lib';
import { goToLogin } from './navigationService';

// Define the auth hook type
type AuthHook = {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
};

// Create a service to use auth hook anywhere
export const authService = createSingletonService<AuthHook>('auth');

// Helper functions you can use in any file
export const checkAuth = () => {
  return authService.use((auth) => {
    if (!auth.isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      goToLogin();
      return false;
    }
    return true;
  });
};

export const getCurrentUser = () => {
  return authService.use((auth) => auth.user);
};

export const simulateTokenExpiry = () => {
  console.log('Simulating token expiry...');
  authService.use((auth) => {
    auth.logout();
    console.log('User logged out due to token expiry');
  });
  
  // Redirect to login after a short delay
  setTimeout(() => {
    goToLogin();
  }, 1000);
};