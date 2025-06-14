// React Version Compatibility Demonstration
import { 
  logCompatibilityInfo, 
  getCompatibilityInfo,
  isReactVersionSupported,
  createSingletonNavigationService 
} from 'react-use-anywhere';

// This example shows how the library works with ANY React version

console.log('🚀 React Hook Injection Pattern - Version Compatibility Demo');

// Check compatibility
logCompatibilityInfo();

// Get detailed compatibility info
const info = getCompatibilityInfo();
console.log('Compatibility Info:', info);

// Verify React version support
console.log('React Version Supported:', isReactVersionSupported());

// Create service (works with any React version)
const navigationService = createSingletonNavigationService({
  enableWarnings: true,
  fallbackBehavior: 'warn'
});

// Test service functionality (React-agnostic)
const mockNavigate = (path: string, options?: any) => {
  console.log(`✅ Navigation called: ${path}`, options);
};

navigationService.setNavigate?.(mockNavigate);
navigationService.navigate('/test-route');
navigationService.navigateToLogin();
navigationService.navigateToHome();

console.log('🎉 Library works with your React version!');

export default { info, navigationService };
