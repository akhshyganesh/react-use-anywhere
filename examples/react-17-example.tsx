/**
 * React 17 Example
 *
 * This example demonstrates using react-use-anywhere with React 17
 *
 * Key features in React 17:
 * - New JSX Transform (no need to import React)
 * - Event delegation changes
 * - No new features (bridge release)
 * - Gradual upgrades support
 *
 * Installation for React 17:
 * npm install react@^17.0.0 react-dom@^17.0.0
 * npm install react-use-anywhere
 */

import React, { useState, useEffect } from 'react';
import {
  HookInjectionProvider,
  createSingletonService,
  useHookInjection,
} from 'react-use-anywhere';

// =============================================================================
// HOOKS - React 17 Compatible
// =============================================================================

/**
 * Authentication Hook with localStorage persistence
 * React 17 has better cleanup for useEffect
 */
const useAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(() => {
    // React 17 supports lazy initial state
    const stored = localStorage.getItem('react17-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // React 17: Effect cleanup is more reliable
    if (user) {
      localStorage.setItem('react17-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('react17-user');
    }
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async (id: string, name: string) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser({ id, name });
      setIsLoading(false);
    },
    logout: () => {
      setUser(null);
    },
  };
};

/**
 * Theme Hook with system preference detection
 */
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // React 17: Better support for media queries
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    // React 17: Event listeners are properly cleaned up
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      console.log(
        '[React 17] System theme changed:',
        e.matches ? 'dark' : 'light'
      );
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () =>
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    setTheme,
  };
};

/**
 * Navigation Hook
 * React 17 works great with React Router v6
 */
const useNavigation = () => {
  const [history, setHistory] = useState<string[]>(['/']);

  return {
    navigate: (path: string) => {
      console.log(`[React 17] Navigating to: ${path}`);
      setHistory((prev) => [...prev, path]);
      window.location.hash = path;
    },
    goBack: () => {
      console.log('[React 17] Going back');
      setHistory((prev) => prev.slice(0, -1));
      window.history.back();
    },
    history,
    currentPath: history[history.length - 1],
  };
};

/**
 * Data fetching hook with AbortController
 * React 17 has excellent cleanup support
 */
const useDataFetch = () => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (url: string) => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      // Simulate fetch with abort support
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 1000);
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Aborted'));
        });
      });

      setData({
        url,
        timestamp: Date.now(),
        message: 'Data fetched successfully in React 17',
      });
    } catch (err) {
      if (!controller.signal.aborted) {
        setError('Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  return { data, loading, error, fetchData };
};

// =============================================================================
// SERVICES
// =============================================================================

const authService = createSingletonService<ReturnType<typeof useAuth>>('auth');
const themeService =
  createSingletonService<ReturnType<typeof useTheme>>('theme');
const navigationService =
  createSingletonService<ReturnType<typeof useNavigation>>('navigation');
const dataService =
  createSingletonService<ReturnType<typeof useDataFetch>>('dataFetch');

// =============================================================================
// BUSINESS LOGIC
// =============================================================================

export const performAuthenticatedAction = async (action: string) => {
  console.log(`[React 17] Performing: ${action}`);

  const isAuthenticated = authService.use((auth) => auth.isAuthenticated);

  if (!isAuthenticated) {
    console.log('[React 17] Authentication required');
    navigationService.use((nav) => nav.navigate('/login'));
    return { success: false, reason: 'Not authenticated' };
  }

  const user = authService.use((auth) => auth.user);
  console.log(`[React 17] Action performed by: ${user?.name}`);

  return { success: true, user };
};

export const loadDashboardData = async () => {
  console.log('[React 17] Loading dashboard data...');

  await dataService.use((data) =>
    data.fetchData('https://api.example.com/dashboard')
  );

  const result = dataService.use((data) => ({
    data: data.data,
    loading: data.loading,
    error: data.error,
  }));

  console.log('[React 17] Dashboard data loaded:', result);
  return result;
};

export const navigateWithTheme = (path: string) => {
  const currentTheme = themeService.use((theme) => theme.theme);
  console.log(`[React 17] Navigating to ${path} with ${currentTheme} theme`);

  navigationService.use((nav) => nav.navigate(path));
};

// =============================================================================
// COMPONENTS
// =============================================================================

const HookConnector: React.FC = () => {
  useHookInjection('auth', useAuth);
  useHookInjection('theme', useTheme);
  useHookInjection('navigation', useNavigation);
  useHookInjection('dataFetch', useDataFetch);

  return null;
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await authService.use((auth) =>
        auth.login('user-' + Date.now(), username)
      );
      navigateWithTheme('/dashboard');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>React 17 - Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Login
        </button>
      </form>
      <p style={{ fontSize: '12px', color: '#666' }}>
        React 17 supports the new JSX transform
      </p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    loadDashboardData().then(() => setDataLoaded(true));
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>React 17 - Dashboard</h2>
      <div>
        <p>Data loaded: {dataLoaded ? 'Yes' : 'Loading...'}</p>
        <button
          onClick={() => performAuthenticatedAction('Export Data')}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          Export Data
        </button>
        <button
          onClick={() => themeService.use((theme) => theme.toggleTheme())}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          Toggle Theme
        </button>
        <button
          onClick={() => authService.use((auth) => auth.logout())}
          style={{ padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HookInjectionProvider>
      <HookConnector />
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1>React 17 Example</h1>
        <p>
          React 17 is a bridge release with no new features, but improved event
          delegation and better support for gradual upgrades.
        </p>

        <LoginPage />
        <Dashboard />
      </div>
    </HookInjectionProvider>
  );
};

export default App;

// =============================================================================
// REACT 17 SPECIFIC NOTES
// =============================================================================

/**
 * React 17 Key Features:
 *
 * ✅ New JSX Transform:
 * - No need to import React in every file (with proper setup)
 * - Smaller bundle sizes
 * - Better compatibility with modern tooling
 *
 * ✅ Event Delegation:
 * - Events now attach to the root container instead of document
 * - Better support for multiple React versions on same page
 * - Improved integration with non-React code
 *
 * ✅ Effect Cleanup:
 * - More consistent cleanup timing
 * - Better support for async operations
 * - Improved memory management
 *
 * 📝 Compatibility:
 * - Fully compatible with React 16 code
 * - Forward compatible with React 18
 * - Works with React Router v6
 * - Testing: Use @testing-library/react@^12.x
 *
 * 🔄 Migration:
 * - Upgrade from 16: Usually seamless
 * - Upgrade to 18: Requires opt-in to new features
 * - react-use-anywhere works identically across all versions
 *
 * ⚙️ Setup:
 * - TypeScript 4.1+ recommended for JSX transform
 * - Update babel/webpack config for automatic JSX runtime
 * - No concurrent features (use React 18 for that)
 */
