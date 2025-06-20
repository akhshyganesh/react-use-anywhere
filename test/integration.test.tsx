import React, { useState } from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
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
        <div data-testid="login-result">{JSON.stringify(loginResult)}</div>
      </div>
    </HookProvider>
  );
};

describe('Integration Tests', () => {
  beforeEach(() => {
    resetAllServices();
    jest.clearAllMocks();
  });

  it('should handle complete login workflow', () => {
    render(<TestApp />);

    // Initially not authenticated
    expect(
      authService.use((auth) => (auth as AuthState | null)?.isAuthenticated)
    ).toBe(false);

    // Click login
    act(() => {
      fireEvent.click(screen.getByTestId('login-btn'));
    });

    // Should be authenticated now
    expect(
      authService.use((auth) => (auth as AuthState | null)?.isAuthenticated)
    ).toBe(true);
    expect(authService.use((auth) => (auth as AuthState | null)?.user)).toEqual(
      {
        username: 'testuser',
      }
    );
    expect(screen.getByTestId('login-result')).toHaveTextContent('true');
  });

  it('should handle logout workflow', () => {
    render(<TestApp />);

    // Login first
    act(() => {
      fireEvent.click(screen.getByTestId('login-btn'));
    });

    expect(
      authService.use((auth) => (auth as AuthState | null)?.isAuthenticated)
    ).toBe(true);

    // Then logout
    act(() => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    // Should be logged out and navigation called
    expect(
      authService.use((auth) => (auth as AuthState | null)?.isAuthenticated)
    ).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should maintain singleton service state', () => {
    const service1 = createSingletonService('test');
    const service2 = createSingletonService('test');

    // Should be the same instance
    expect(service1).toBe(service2);

    // State should be shared
    service1._setValue({ shared: 'state' });
    expect(service2.get()).toEqual({ shared: 'state' });
  });
});

describe('Singleton Service Behavior', () => {
  beforeEach(() => {
    resetAllServices();
  });

  it('should share state across multiple components', () => {
    // Create multiple instances of the same service
    const service1 = createSingletonService('shared');
    const service2 = createSingletonService('shared');
    const service3 = createSingletonService('shared');

    expect(service1).toBe(service2);
    expect(service2).toBe(service3);

    // Set value in one instance
    service1._setValue({ shared: 'state' });

    // Should be available in all instances
    expect(service2.get()).toEqual({ shared: 'state' });
    expect(service3.get()).toEqual({ shared: 'state' });
  });

  it('should maintain different state for different service IDs', () => {
    const authService = createSingletonService('auth');
    const themeService = createSingletonService('theme');

    authService._setValue({ user: 'test' });
    themeService._setValue({ theme: 'dark' });

    expect(authService.get()).toEqual({ user: 'test' });
    expect(themeService.get()).toEqual({ theme: 'dark' });
  });
});
