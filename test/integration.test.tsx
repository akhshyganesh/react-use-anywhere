import { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  HookProvider,
  createSingletonService,
  useHookService,
  resetAllServices,
} from '../lib';

// Create singleton services
const authService = createSingletonService('auth');
const navigationService = createSingletonService('navigation');

interface UserData {
  username: string;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}

// Mock hooks that return actual values
const useAuth = (): AuthState => {
  const [user, setUser] = useState<UserData | null>(null);
  return {
    user,
    isAuthenticated: !!user,
    login: (userData: UserData) => setUser(userData),
    logout: () => setUser(null),
  };
};

const mockNavigate = jest.fn();
const useNavigation = (): ((path: string) => void) => mockNavigate;

// Business logic functions using services
const handleLogin = (credentials: UserData) => {
  return authService.use((auth) => {
    const authState = auth as AuthState | null;
    if (authState) {
      authState.login(credentials);
      return true;
    }
    return false;
  });
};

const handleLogout = () => {
  authService.use((auth) => (auth as AuthState | null)?.logout());
  navigationService.use((navigate) => {
    const navigateFn = navigate as ((path: string) => void) | null;
    if (navigateFn) navigateFn('/login');
  });
};

const isUserAuthenticated = (): boolean => {
  return (
    authService.use((auth) => {
      const authState = auth as AuthState | null;
      return authState?.isAuthenticated ?? false;
    }) ?? false
  );
};

// Component that connects services to hooks
const ServiceConnector = () => {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');
  return null;
};

// Test app component
const TestApp = () => {
  const [loginResult, setLoginResult] = useState<boolean | null>(null);

  const handleLoginClick = () => {
    const result = handleLogin({ username: 'testuser' });
    setLoginResult(result);
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  const checkAuth = () => {
    const isAuth = isUserAuthenticated();
    setLoginResult(isAuth);
  };

  return (
    <HookProvider
      hooks={{
        auth: useAuth,
        navigation: useNavigation,
      }}
    >
      <ServiceConnector />
      <div>
        <button data-testid="login-btn" onClick={handleLoginClick}>
          Login
        </button>
        <button data-testid="logout-btn" onClick={handleLogoutClick}>
          Logout
        </button>
        <button data-testid="check-auth-btn" onClick={checkAuth}>
          Check Auth
        </button>
        <div data-testid="login-result">{JSON.stringify(loginResult)}</div>
      </div>
    </HookProvider>
  );
};

describe('Integration Tests', () => {
  beforeEach(() => {
    resetAllServices();
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should allow login and update auth state', () => {
      render(<TestApp />);

      const loginBtn = screen.getByTestId('login-btn');
      const checkAuthBtn = screen.getByTestId('check-auth-btn');

      // Initially not authenticated
      fireEvent.click(checkAuthBtn);
      expect(screen.getByTestId('login-result')).toHaveTextContent('false');

      // Login
      fireEvent.click(loginBtn);
      expect(screen.getByTestId('login-result')).toHaveTextContent('true');

      // Check authentication status
      fireEvent.click(checkAuthBtn);
      expect(screen.getByTestId('login-result')).toHaveTextContent('true');
    });

    it('should allow logout and update auth state', () => {
      render(<TestApp />);

      const loginBtn = screen.getByTestId('login-btn');
      const logoutBtn = screen.getByTestId('logout-btn');
      const checkAuthBtn = screen.getByTestId('check-auth-btn');

      // Login first
      fireEvent.click(loginBtn);
      fireEvent.click(checkAuthBtn);
      expect(screen.getByTestId('login-result')).toHaveTextContent('true');

      // Logout
      fireEvent.click(logoutBtn);

      // Check authentication status
      fireEvent.click(checkAuthBtn);
      expect(screen.getByTestId('login-result')).toHaveTextContent('false');
    });

    it('should navigate to login page on logout', () => {
      render(<TestApp />);

      const loginBtn = screen.getByTestId('login-btn');
      const logoutBtn = screen.getByTestId('logout-btn');

      // Login first
      fireEvent.click(loginBtn);

      // Logout and check navigation
      fireEvent.click(logoutBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Service State Management', () => {
    it('should maintain state across multiple components', () => {
      const Component1 = () => {
        useHookService(authService, 'auth');
        const handleClick = () => handleLogin({ username: 'user1' });
        return (
          <button data-testid="comp1-login" onClick={handleClick}>
            Login 1
          </button>
        );
      };

      const Component2 = () => {
        useHookService(authService, 'auth');
        const isAuth = isUserAuthenticated();
        return (
          <div data-testid="comp2-auth">
            {isAuth ? 'Authenticated' : 'Not Authenticated'}
          </div>
        );
      };

      render(
        <HookProvider hooks={{ auth: useAuth, navigation: useNavigation }}>
          <Component1 />
          <Component2 />
        </HookProvider>
      );

      // Initially not authenticated
      expect(screen.getByTestId('comp2-auth')).toHaveTextContent(
        'Not Authenticated'
      );

      // Login from component 1
      fireEvent.click(screen.getByTestId('comp1-login'));

      // State should update in component 2
      expect(screen.getByTestId('comp2-auth')).toHaveTextContent(
        'Authenticated'
      );
    });
  });

  describe('Multiple Service Interaction', () => {
    it('should handle multiple services working together', () => {
      render(<TestApp />);

      const loginBtn = screen.getByTestId('login-btn');
      const logoutBtn = screen.getByTestId('logout-btn');

      // Login
      fireEvent.click(loginBtn);
      expect(authService.get()).toBeTruthy();

      // Logout should update auth and call navigation
      fireEvent.click(logoutBtn);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(isUserAuthenticated()).toBe(false);
    });
  });

  describe('Service Lifecycle', () => {
    it('should work correctly after service reset', () => {
      const { unmount } = render(<TestApp />);

      const loginBtn = screen.getByTestId('login-btn');

      // Login
      fireEvent.click(loginBtn);
      expect(isUserAuthenticated()).toBe(true);

      // Unmount the component first to stop service updates
      unmount();

      // Reset services
      resetAllServices();

      // Services should be cleared after unmount and reset
      expect(authService.get()).toBe(null);
      expect(authService.isReady()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle service calls when not ready', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const newService = createSingletonService('test');

      // Try to use service before it's connected
      const result = newService.use(() => 'test');

      expect(result).toBe(null);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle null auth state gracefully', () => {
      const result = handleLogout();
      // Should not throw error even if auth is not ready
      expect(result).toBeUndefined();
    });
  });
});
