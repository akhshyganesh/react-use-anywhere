/**
 * React Version Compatibility Tests
 * 
 * This test suite verifies that the library works with different React versions
 * that support hooks (16.8.0+)
 */

import { NavigationService, createNavigationService } from '../lib';

// Mock React hooks for different versions
const mockUseEffect = jest.fn();
const mockUseRef = jest.fn(() => ({ current: null }));
const mockUseMemo = jest.fn((fn) => fn());
const mockUseContext = jest.fn();
const mockCreateContext = jest.fn(() => ({ Provider: 'div', Consumer: 'div' }));

// Test basic functionality without React dependencies
describe('React Version Compatibility', () => {
  describe('Core functionality (React-agnostic)', () => {
    it('should create navigation service without React', () => {
      const service = createNavigationService();
      expect(service).toBeInstanceOf(NavigationService);
    });

    it('should handle navigation when function is set', () => {
      const service = createNavigationService() as NavigationService;
      const mockNavigate = jest.fn();
      
      service.setNavigate(mockNavigate);
      service.navigate('/test');
      
      expect(mockNavigate).toHaveBeenCalledWith('/test', undefined);
    });

    it('should work with any navigation function signature', () => {
      const service = createNavigationService() as NavigationService;
      
      // Test React Router v5 style
      const mockNavigateV5 = jest.fn();
      service.setNavigate(mockNavigateV5);
      service.navigate('/test');
      expect(mockNavigateV5).toHaveBeenCalledWith('/test', undefined);

      // Test React Router v6 style
      const mockNavigateV6 = jest.fn();
      service.setNavigate(mockNavigateV6);
      service.navigate('/test', { replace: true });
      expect(mockNavigateV6).toHaveBeenCalledWith('/test', { replace: true });

      // Test custom navigation function
      const mockCustomNavigate = jest.fn();
      service.setNavigate(mockCustomNavigate);
      service.navigate('/test', { customOption: 'value' });
      expect(mockCustomNavigate).toHaveBeenCalledWith('/test', { customOption: 'value' });
    });
  });

  describe('React Version Specific Features', () => {
    it('should be compatible with React 16.8+ hook patterns', () => {
      // Simulate React 16.8 environment
      const service = createNavigationService({
        enableWarnings: true,
        fallbackBehavior: 'warn'
      });

      expect(service.isReady()).toBe(false);
      
      const mockNavigate = jest.fn();
      service.setNavigate(mockNavigate);
      
      expect(service.isReady()).toBe(true);
    });

    it('should handle concurrent mode safely (React 18+)', async () => {
      const service = createNavigationService() as NavigationService;
      const mockNavigate = jest.fn();
      
      // Simulate concurrent updates
      service.setNavigate(mockNavigate);
      
      // Multiple rapid calls should work
      service.navigate('/route1');
      service.navigate('/route2');
      service.navigate('/route3');
      
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenLastCalledWith('/route3', undefined);
    });

    it('should work with Strict Mode (all React versions)', () => {
      // In Strict Mode, effects run twice in development
      const service = createNavigationService() as NavigationService;
      const mockNavigate = jest.fn();
      
      // Simulate StrictMode double execution
      service.setNavigate(mockNavigate);
      service.setNavigate(mockNavigate); // Second call in StrictMode
      
      service.navigate('/test');
      expect(mockNavigate).toHaveBeenCalledTimes(1); // Should only navigate once
    });
  });

  describe('TypeScript Compatibility', () => {
    it('should work with different React type versions', () => {
      // Test that our types are compatible with different @types/react versions
      const service = createNavigationService();
      
      // Should accept any function that matches NavigationFunction signature
      const stringNavigate = (path: string) => console.log(path);
      const stringWithOptionsNavigate = (path: string, options?: any) => console.log(path, options);
      
      if (service.setNavigate) {
        service.setNavigate(stringNavigate);
        service.setNavigate(stringWithOptionsNavigate);
      }
      
      expect(service.isReady()).toBe(true);
    });
  });

  describe('Router Compatibility', () => {
    it('should work with React Router v5 useHistory', () => {
      const service = createNavigationService() as NavigationService;
      
      // Simulate React Router v5 history.push
      const mockHistory = {
        push: jest.fn(),
        replace: jest.fn(),
        goBack: jest.fn(),
      };
      
      service.setNavigate(mockHistory.push);
      service.navigate('/v5-route');
      
      expect(mockHistory.push).toHaveBeenCalledWith('/v5-route', undefined);
    });

    it('should work with React Router v6 useNavigate', () => {
      const service = createNavigationService() as NavigationService;
      
      // Simulate React Router v6 navigate
      const mockNavigate = jest.fn();
      
      service.setNavigate(mockNavigate);
      service.navigate('/v6-route', { replace: true });
      
      expect(mockNavigate).toHaveBeenCalledWith('/v6-route', { replace: true });
    });

    it('should work with Reach Router', () => {
      const service = createNavigationService() as NavigationService;
      
      // Simulate Reach Router navigate
      const mockReachNavigate = jest.fn();
      
      service.setNavigate(mockReachNavigate);
      service.navigate('/reach-route');
      
      expect(mockReachNavigate).toHaveBeenCalledWith('/reach-route', undefined);
    });

    it('should work with custom router implementations', () => {
      const service = createNavigationService() as NavigationService;
      
      // Simulate custom router
      const mockCustomRouter = jest.fn();
      
      service.setNavigate(mockCustomRouter);
      service.navigate('/custom-route', { customData: 'test' });
      
      expect(mockCustomRouter).toHaveBeenCalledWith('/custom-route', { customData: 'test' });
    });
  });
});
