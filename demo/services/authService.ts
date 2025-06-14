import { navigationService } from './navigationService';

export function simulateTokenCheck() {
  const tokenExpired = true;

  if (tokenExpired) {
    console.log('Token expired, redirecting...');
    navigationService.navigateToLogin();
  }
}