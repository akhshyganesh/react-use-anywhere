/**
 * Router-Agnostic Compatibility Tests
 * 
 * These tests verify that the library works with different router patterns
 * and hook types without being tied to any specific router implementation.
 */

import { 
  HookInjectionProvider,
  createHookInjectionService,
  useHookInjection,
  useHookFromContext
} from '../lib';

describe('Router-Agnostic Compatibility', () => {
  describe('Different Router Patterns', () => {
    it('should work with React Router v6 pattern', () => {
      const mockNavigate = jest.fn();
      const useNavigateHook = () => mockNavigate;
      
      const service = createHookInjectionService<(path: string) => void>();
      
      // Simulate React Router v6 usage
      service.setHook(useNavigateHook());
      service.execute((navigate) => navigate('/test'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/test');
    });

    it('should work with TanStack Router pattern', () => {
      const mockRouter = {
        navigate: jest.fn()
      };
      const useTanStackRouter = () => mockRouter.navigate;
      
      const service = createHookInjectionService<(path: string) => void>();
      
      // Simulate TanStack Router usage
      service.setHook(useTanStackRouter());
      service.execute((navigate) => navigate('/tanstack-route'));
      
      expect(mockRouter.navigate).toHaveBeenCalledWith('/tanstack-route');
    });

    it('should work with Next.js Router pattern', () => {
      const mockRouter = {
        push: jest.fn()
      };
      const useNextRouter = () => mockRouter.push;
      
      const service = createHookInjectionService<(path: string) => void>();
      
      // Simulate Next.js Router usage
      service.setHook(useNextRouter());
      service.execute((navigate) => navigate('/next-route'));
      
      expect(mockRouter.push).toHaveBeenCalledWith('/next-route');
    });

    it('should work with custom navigation pattern', () => {
      const customNavigate = jest.fn();
      const useCustomNavigation = () => customNavigate;
      
      const service = createHookInjectionService<(path: string) => void>();
      
      // Simulate custom navigation
      service.setHook(useCustomNavigation());
      service.execute((navigate) => navigate('/custom-route'));
      
      expect(customNavigate).toHaveBeenCalledWith('/custom-route');
    });

    it('should work without any router (hash-based)', () => {
      const originalHash = window.location.hash;
      
      const hashNavigate = (path: string) => {
        window.location.hash = path;
      };
      const useHashNavigation = () => hashNavigate;
      
      const service = createHookInjectionService<(path: string) => void>();
      
      // Simulate hash-based navigation
      service.setHook(useHashNavigation());
      service.execute((navigate) => navigate('/hash-route'));
      
      expect(window.location.hash).toBe('#/hash-route');
      
      // Cleanup
      window.location.hash = originalHash;
    });
  });

  describe('Different Hook Types', () => {
    it('should work with authentication hooks', () => {
      const mockAuth = {
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        isAuthenticated: false
      };
      
      const useAuth = () => mockAuth;
      const service = createHookInjectionService<typeof mockAuth>();
      
      service.setHook(useAuth());
      service.execute((auth) => {
        auth.login('testuser');
      });
      
      expect(mockAuth.login).toHaveBeenCalledWith('testuser');
    });

    it('should work with theme hooks', () => {
      const mockTheme = {
        theme: 'light',
        toggleTheme: jest.fn(),
        setTheme: jest.fn()
      };
      
      const useTheme = () => mockTheme;
      const service = createHookInjectionService<typeof mockTheme>();
      
      service.setHook(useTheme());
      service.execute((theme) => {
        theme.toggleTheme();
        theme.setTheme('dark');
      });
      
      expect(mockTheme.toggleTheme).toHaveBeenCalled();
      expect(mockTheme.setTheme).toHaveBeenCalledWith('dark');
    });

    it('should work with data fetching hooks', () => {
      const mockQuery = {
        data: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
        mutate: jest.fn()
      };
      
      const useQuery = () => mockQuery;
      const service = createHookInjectionService<typeof mockQuery>();
      
      service.setHook(useQuery());
      service.execute((query) => {
        query.refetch();
        query.mutate({ action: 'test' });
      });
      
      expect(mockQuery.refetch).toHaveBeenCalled();
      expect(mockQuery.mutate).toHaveBeenCalledWith({ action: 'test' });
    });

    it('should work with custom business logic hooks', () => {
      const mockShoppingCart = {
        items: [],
        addItem: jest.fn(),
        removeItem: jest.fn(),
        clearCart: jest.fn(),
        total: 0
      };
      
      const useShoppingCart = () => mockShoppingCart;
      const service = createHookInjectionService<typeof mockShoppingCart>();
      
      service.setHook(useShoppingCart());
      service.execute((cart) => {
        cart.addItem({ id: 1, name: 'Test Item', price: 10 });
        cart.clearCart();
      });
      
      expect(mockShoppingCart.addItem).toHaveBeenCalledWith({ 
        id: 1, 
        name: 'Test Item', 
        price: 10 
      });
      expect(mockShoppingCart.clearCart).toHaveBeenCalled();
    });
  });

  describe('Mixed Hook Usage', () => {
    it('should handle multiple different hook types simultaneously', () => {
      const navigationService = createHookInjectionService<(path: string) => void>();
      const authService = createHookInjectionService<{ login: () => void }>();
      const themeService = createHookInjectionService<{ setTheme: (theme: string) => void }>();
      
      const mockNavigate = jest.fn();
      const mockAuth = { login: jest.fn() };
      const mockTheme = { setTheme: jest.fn() };
      
      // Set up all services
      navigationService.setHook(mockNavigate);
      authService.setHook(mockAuth);
      themeService.setHook(mockTheme);
      
      // Use all services in a coordinated way
      authService.execute((auth) => auth.login());
      themeService.execute((theme) => theme.setTheme('user-preference'));
      navigationService.execute((nav) => nav('/dashboard'));
      
      expect(mockAuth.login).toHaveBeenCalled();
      expect(mockTheme.setTheme).toHaveBeenCalledWith('user-preference');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Framework Independence', () => {
    it('should work independently of any specific framework', () => {
      // This test ensures the library doesn't rely on any framework-specific APIs
      const mockHook = jest.fn(() => ({ action: jest.fn() }));
      const service = createHookInjectionService<{ action: () => void }>();
      
      service.setHook(mockHook());
      
      expect(service.isReady()).toBe(true);
      
      service.execute((hook) => {
        hook.action();
      });
      
      expect(mockHook().action).toBeDefined();
    });

    it('should handle hook failures gracefully', () => {
      const service = createHookInjectionService<() => void>({
        enableWarnings: false,
        fallbackBehavior: 'silent'
      });
      
      // Don't set any hook
      const result = service.execute((hook) => hook());
      
      expect(result).toBe(null);
      expect(service.isReady()).toBe(false);
    });
  });
});
