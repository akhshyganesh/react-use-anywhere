import React, { useState } from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  HookProvider, 
  createSingletonService, 
  useHookService, 
  resetAllServices 
} from '../lib';

// Mock services
const authService = createSingletonService('auth');
const navigationService = createSingletonService('navigation');
const themeService = createSingletonService('theme');

// Mock hooks
const useAuth = () => {
  const [user, setUser] = useState(null);
  return {
    user,
    isAuthenticated: !!user,
    login: (userData: any) => setUser(userData),
    logout: () => setUser(null)
  };
};

const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    setTheme
  };
};

const mockNavigate = jest.fn();

// Business logic functions
const handleLogin = async (credentials: any) => {
  return authService.use((auth) => {
    auth.login(credentials);
    return true;
  });
};

const handleLogout = () => {
  authService.use((auth) => auth.logout());
  navigationService.use((navigate) => navigate('/login'));
  themeService.use((theme) => theme.setTheme('light'));
};

const toggleAppTheme = () => {
  return themeService.use((theme) => {
    theme.toggle();
    return theme.theme;
  });
};

// Test components
const ServiceConnector = () => {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigate');
  useHookService(themeService, 'theme');
  return null;
};

const App = () => {
  return (
    <HookProvider hooks={{ 
      auth: useAuth, 
      navigate: mockNavigate, 
      theme: useTheme 
    }}>
      <ServiceConnector />
      <Dashboard />
    </HookProvider>
  );
};

const Dashboard = () => {
  const [loginResult, setLoginResult] = useState<boolean | null>(null);
  const [themeResult, setThemeResult] = useState(null);

  const handleLoginClick = async () => {
    const result = await handleLogin({ username: 'testuser' });
    setLoginResult(result);
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleThemeClick = () => {
    const newTheme = toggleAppTheme();
    setThemeResult(newTheme);
  };

  return (
    <div>
      <button data-testid="login-btn" onClick={handleLoginClick}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={handleLogoutClick}>
        Logout
      </button>
      <button data-testid="theme-btn" onClick={handleThemeClick}>
        Toggle Theme
      </button>
      <div data-testid="login-result">{JSON.stringify(loginResult)}</div>
      <div data-testid="theme-result">{themeResult}</div>
    </div>
  );
};

describe('Integration Tests', () => {
  beforeEach(() => {
    resetAllServices();
    jest.clearAllMocks();
  });

  it('should handle complete login workflow', async () => {
    render(<App />);

    // Initially not authenticated
    expect(authService.use(auth => auth.isAuthenticated)).toBe(false);

    // Click login
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-btn'));
    });

    // Should be authenticated now
    expect(authService.use(auth => auth.isAuthenticated)).toBe(true);
    expect(authService.use(auth => auth.user)).toEqual({ username: 'testuser' });
    expect(screen.getByTestId('login-result')).toHaveTextContent('true');
  });

  it('should handle complete logout workflow', async () => {
    render(<App />);

    // Login first
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-btn'));
    });

    expect(authService.use(auth => auth.isAuthenticated)).toBe(true);

    // Then logout
    act(() => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    // Should be logged out and redirected
    expect(authService.use(auth => auth.isAuthenticated)).toBe(false);
    expect(authService.use(auth => auth.user)).toBe(null);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(themeService.use(theme => theme.theme)).toBe('light');
  });

  it('should handle theme toggle workflow', () => {
    render(<App />);

    // Initially light theme
    expect(themeService.use(theme => theme.theme)).toBe('light');

    // Toggle theme
    act(() => {
      fireEvent.click(screen.getByTestId('theme-btn'));
    });

    // Should be dark theme now
    expect(themeService.use(theme => theme.theme)).toBe('dark');
    expect(screen.getByTestId('theme-result')).toHaveTextContent('dark');

    // Toggle again
    act(() => {
      fireEvent.click(screen.getByTestId('theme-btn'));
    });

    // Should be light theme again
    expect(themeService.use(theme => theme.theme)).toBe('light');
    expect(screen.getByTestId('theme-result')).toHaveTextContent('light');
  });

  it('should maintain state across multiple operations', async () => {
    render(<App />);

    // Login
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-btn'));
    });

    // Change theme
    act(() => {
      fireEvent.click(screen.getByTestId('theme-btn'));
    });

    // Verify both states are maintained
    expect(authService.use(auth => auth.isAuthenticated)).toBe(true);
    expect(themeService.use(theme => theme.theme)).toBe('dark');

    // Logout (should reset theme but maintain login state change)
    act(() => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    expect(authService.use(auth => auth.isAuthenticated)).toBe(false);
    expect(themeService.use(theme => theme.theme)).toBe('light');
  });

  it('should handle service errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    // Try to use service before it's connected
    const result = authService.use(auth => auth.isAuthenticated);
    
    expect(result).toBe(null);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Hook service not ready. Make sure you\'re using useHookService in a React component.'
    );
  });

  it('should handle hook execution errors', () => {
    render(<App />);
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Force an error in the hook usage
    const result = authService.use(() => {
      throw new Error('Test error');
    });
    
    expect(result).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error using hook service:', 
      expect.any(Error)
    );
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
