import { authService } from './navigationService';

export function simulateTokenCheck() {
  const tokenExpired = true;

  if (tokenExpired) {
    console.log('Token expired, redirecting...');
    // Use the auth service to handle logout and navigation
    authService.execute((auth) => {
      auth.logout();
      console.log('User logged out due to token expiry');
    });
  }
}