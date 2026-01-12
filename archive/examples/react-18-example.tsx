/**
 * React 18 Example
 *
 * This example demonstrates using react-use-anywhere with React 18
 *
 * Key features in React 18:
 * - Concurrent rendering
 * - Automatic batching
 * - Transitions
 * - Suspense improvements
 * - useId, useDeferredValue, useTransition hooks
 *
 * Installation for React 18:
 * npm install react@^18.0.0 react-dom@^18.0.0
 * npm install react-use-anywhere
 */

import React, {
  useState,
  useEffect,
  useTransition,
  useDeferredValue,
  useId,
} from 'react';
import {
  HookInjectionProvider,
  createSingletonService,
  useHookInjection,
} from 'react-use-anywhere';

// =============================================================================
// HOOKS - React 18 Features
// =============================================================================

/**
 * Authentication Hook with React 18 automatic batching
 * Multiple state updates are batched automatically
 */
const useAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    lastLogin,
    login: async (id: string, name: string) => {
      // React 18: All state updates are batched automatically
      // Even in async functions and native event handlers!
      setIsLoading(true);
      setUser(null);
      setLastLogin(null);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // These three updates will be batched together
      setUser({ id, name });
      setLastLogin(new Date());
      setIsLoading(false);
    },
    logout: () => {
      // Batched automatically
      setUser(null);
      setLastLogin(null);
    },
  };
};

/**
 * Theme Hook with transitions
 * Uses React 18's useTransition for smooth theme changes
 */
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isPending, startTransition] = useTransition();

  return {
    theme,
    isDark: theme === 'dark',
    isPending,
    toggleTheme: () => {
      // React 18: Mark this as a non-urgent update
      startTransition(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      });
    },
    setTheme: (newTheme: 'light' | 'dark') => {
      startTransition(() => {
        setTheme(newTheme);
      });
    },
  };
};

/**
 * Search Hook with useDeferredValue
 * React 18's useDeferredValue for smooth search experience
 */
const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    // This runs with the deferred value, keeping UI responsive
    if (deferredQuery) {
      const filtered = mockDatabase.filter((item) =>
        item.toLowerCase().includes(deferredQuery.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [deferredQuery]);

  return {
    searchQuery,
    setSearchQuery,
    results,
    isSearching: searchQuery !== deferredQuery, // True when deferred
  };
};

// Mock database for search
const mockDatabase = [
  'React 18 Concurrent Mode',
  'React 18 Automatic Batching',
  'React 18 Transitions',
  'React 18 Suspense',
  'React 18 useId Hook',
  'React 18 useDeferredValue',
  'React 18 useTransition',
];

/**
 * Navigation Hook with React 18 features
 */
const useNavigation = () => {
  const [history, setHistory] = useState<string[]>(['/']);
  const [isPending, startTransition] = useTransition();

  return {
    navigate: (path: string) => {
      console.log(`[React 18] Navigating to: ${path}`);
      startTransition(() => {
        setHistory((prev) => [...prev, path]);
        window.location.hash = path;
      });
    },
    goBack: () => {
      console.log('[React 18] Going back');
      startTransition(() => {
        setHistory((prev) => prev.slice(0, -1));
        window.history.back();
      });
    },
    history,
    currentPath: history[history.length - 1],
    isPending,
  };
};

/**
 * Form Hook with useId
 * React 18's useId for accessible forms
 */
const useForm = () => {
  const formId = useId();
  const [values, setValues] = useState<Record<string, string>>({});

  return {
    formId,
    values,
    getFieldId: (fieldName: string) => `${formId}-${fieldName}`,
    setValue: (fieldName: string, value: string) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));
    },
    reset: () => setValues({}),
  };
};

// =============================================================================
// SERVICES
// =============================================================================

const authService = createSingletonService<ReturnType<typeof useAuth>>('auth');
const themeService =
  createSingletonService<ReturnType<typeof useTheme>>('theme');
const navigationService =
  createSingletonService<ReturnType<typeof useNavigation>>('navigation');
const searchService =
  createSingletonService<ReturnType<typeof useSearch>>('search');

// =============================================================================
// BUSINESS LOGIC - Taking advantage of React 18
// =============================================================================

export const performOptimisticUpdate = async (action: string) => {
  console.log(`[React 18] Starting optimistic update: ${action}`);

  const isAuthenticated = authService.use((auth) => auth.isAuthenticated);

  if (!isAuthenticated) {
    navigationService.use((nav) => nav.navigate('/login'));
    return { success: false };
  }

  // React 18: Updates are batched automatically
  console.log('[React 18] Update batched automatically');

  return { success: true };
};

export const performSearch = (query: string) => {
  // React 18: Deferred value keeps UI responsive
  searchService.use((search) => search.setSearchQuery(query));

  const results = searchService.use((search) => ({
    results: search.results,
    isSearching: search.isSearching,
  }));

  console.log(`[React 18] Search results:`, results);
  return results;
};

export const navigateWithTransition = (path: string) => {
  // React 18: Non-urgent navigation with transition
  navigationService.use((nav) => nav.navigate(path));

  const isPending = navigationService.use((nav) => nav.isPending);
  console.log(`[React 18] Navigation pending: ${isPending}`);
};

export const toggleThemeWithTransition = () => {
  // React 18: Smooth theme transition
  themeService.use((theme) => theme.toggleTheme());

  const isPending = themeService.use((theme) => theme.isPending);
  console.log(`[React 18] Theme transition pending: ${isPending}`);
};

// =============================================================================
// COMPONENTS
// =============================================================================

const HookConnector: React.FC = () => {
  useHookInjection('auth', useAuth);
  useHookInjection('theme', useTheme);
  useHookInjection('navigation', useNavigation);
  useHookInjection('search', useSearch);
  useHookInjection('form', useForm);

  return null;
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const formId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // React 18: All these updates are batched
      await authService.use((auth) =>
        auth.login('user-' + Date.now(), username)
      );
      navigateWithTransition('/dashboard');
    }
  };

  return (
    <div
      style={{ padding: '20px', border: '2px solid #61dafb', margin: '10px' }}
    >
      <h2>React 18 - Login</h2>
      <form onSubmit={handleSubmit}>
        {/* React 18: useId for accessibility */}
        <label htmlFor={`${formId}-username`}>Username:</label>
        <input
          id={`${formId}-username`}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          style={{ padding: '8px', marginLeft: '8px', marginRight: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Login
        </button>
      </form>
      <p style={{ fontSize: '12px', color: '#666' }}>
        ⚡ React 18: Automatic batching & concurrent features
      </p>
    </div>
  );
};

const SearchDemo: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

  return (
    <div
      style={{ padding: '20px', border: '2px solid #61dafb', margin: '10px' }}
    >
      <h3>React 18 - Search with useDeferredValue</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search React 18 features..."
        style={{ padding: '8px', width: '300px' }}
      />
      <div style={{ marginTop: '10px' }}>
        {query && (
          <p>
            <em>Searching for: {query}</em>
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{ padding: '20px', border: '2px solid #61dafb', margin: '10px' }}
    >
      <h2>React 18 - Dashboard</h2>

      <div style={{ marginBottom: '15px' }}>
        <p>Counter: {count}</p>
        <button
          onClick={() => {
            // React 18: All updates are batched automatically
            // Even in setTimeout, promises, and native events!
            setCount((c) => c + 1);
            setCount((c) => c + 1);
            setCount((c) => c + 1);
            // This results in a single re-render
          }}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          +3 (Batched)
        </button>
        <button
          onClick={() => performOptimisticUpdate('Data Export')}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          Export Data
        </button>
        <button
          onClick={toggleThemeWithTransition}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          Toggle Theme (Transition)
        </button>
        <button
          onClick={() => authService.use((auth) => auth.logout())}
          style={{ padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>

      <SearchDemo />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HookInjectionProvider>
      <HookConnector />
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1>⚛️ React 18 Example</h1>
        <p>
          React 18 introduces concurrent features, automatic batching,
          transitions, and new hooks for better performance.
        </p>

        <LoginPage />
        <Dashboard />
      </div>
    </HookInjectionProvider>
  );
};

export default App;

// =============================================================================
// REACT 18 SPECIFIC NOTES
// =============================================================================

/**
 * React 18 Key Features:
 *
 * ⚡ Automatic Batching:
 * - State updates are batched everywhere (timeouts, promises, events)
 * - Fewer re-renders = better performance
 * - No code changes needed to benefit
 *
 * 🔄 Concurrent Rendering:
 * - React can work on multiple tasks simultaneously
 * - Can interrupt rendering for more urgent updates
 * - Opt-in with startTransition and useDeferredValue
 *
 * ✨ New Hooks:
 * - useId: Generate unique IDs for accessibility
 * - useTransition: Mark updates as non-urgent
 * - useDeferredValue: Defer updating derived values
 * - useSyncExternalStore: Subscribe to external stores
 *
 * 🎯 Suspense Improvements:
 * - Better support for data fetching
 * - Streaming SSR with selective hydration
 * - Better error boundaries
 *
 * 📝 Setup:
 * - Use createRoot instead of ReactDOM.render
 * - Wrap app with <React.StrictMode> to catch issues
 * - Test with @testing-library/react@^13.x
 *
 * 🔄 Migration from 17:
 * - Most code works without changes
 * - Update to createRoot for concurrent features
 * - Gradually adopt new features
 * - react-use-anywhere works seamlessly
 *
 * ⚠️ Important:
 * - StrictMode now runs effects twice in development
 * - Automatic batching may affect some edge cases
 * - Use flushSync() if you need synchronous updates
 *
 * 🎨 Perfect For:
 * - Complex applications with many state updates
 * - Apps that need smooth UI during heavy computation
 * - Applications using Suspense for data fetching
 * - Server-side rendering with streaming
 */
