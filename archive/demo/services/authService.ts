import { createSingletonService, createTypedSingletonService } from '../../lib';
import { goToLogin } from './navigationService';
import { logServiceCall } from './logger';
import type { AppHooks } from '../App';

// Define the auth hook type
type AuthHook = {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
};

// 🚀 STANDARD: Create a singleton service to use auth hook anywhere
export const authService = createSingletonService<AuthHook>('auth');

// 🆕 TYPE-SAFE VERSION: Create with compile-time type checking
export const typedAuthService = createTypedSingletonService<AppHooks, 'auth'>('auth');

// Helper functions you can use in any file
export const checkAuth = () => {
  logServiceCall('authService', 'checkAuth');
  
  return authService.use((auth) => {
    const isAuthenticated = auth.isAuthenticated;
    logServiceCall('authService', 'checkAuth.result', { isAuthenticated, user: auth.user });
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      goToLogin();
      return false;
    }
    return true;
  });
};

export const getCurrentUser = () => {
  logServiceCall('authService', 'getCurrentUser');
  
  return authService.use((auth) => {
    logServiceCall('authService', 'getCurrentUser.result', { user: auth.user });
    return auth.user;
  });
};

export const simulateTokenExpiry = () => {
  logServiceCall('authService', 'simulateTokenExpiry');
  console.log('Simulating token expiry...');
  
  authService.use((auth) => {
    auth.logout();
    logServiceCall('authService', 'logout.fromTokenExpiry', { reason: 'token_expired' });
    console.log('User logged out due to token expiry');
  });
  
  // Redirect to login after a short delay
  setTimeout(() => {
    goToLogin();
  }, 1000);
};