/**
 * React 16 Example
 *
 * This example demonstrates using react-use-anywhere with React 16.8+
 * React 16.8 introduced hooks, which is the minimum version supported.
 *
 * Key features in React 16:
 * - Hooks introduced in 16.8.0
 * - Fragment support
 * - Error boundaries
 * - Portals
 *
 * Installation for React 16:
 * npm install react@^16.8.0 react-dom@^16.8.0
 * npm install react-use-anywhere
 */

import React, { useState } from 'react';
import {
  HookInjectionProvider,
  createSingletonService,
  useHookInjection,
} from 'react-use-anywhere';

// =============================================================================
// HOOKS - Compatible with React 16.8+
// =============================================================================

/**
 * Authentication Hook
 * Uses useState which was introduced in React 16.8
 */
const useAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async (id: string, name: string) => {
      setIsLoading(true);
      // Simulate API call
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
 * Theme Hook
 * Simple state management for theme switching
 */
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () =>
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
  };
};

/**
 * Navigation Hook (React 16 compatible)
 * Works with React Router v5 or custom routing solutions
 */
const useNavigation = () => {
  return {
    navigate: (path: string) => {
      console.log(`[React 16] Navigating to: ${path}`);
      // For React Router v5: use history.push(path)
      // For custom solution: implement your routing logic
      window.location.hash = path;
    },
    goBack: () => {
      console.log('[React 16] Going back');
      window.history.back();
    },
  };
};

// =============================================================================
// SERVICES - Access hooks from anywhere
// =============================================================================

const authService = createSingletonService<ReturnType<typeof useAuth>>('auth');
const themeService =
  createSingletonService<ReturnType<typeof useTheme>>('theme');
const navigationService =
  createSingletonService<ReturnType<typeof useNavigation>>('navigation');

// =============================================================================
// BUSINESS LOGIC - Use services outside React components
// =============================================================================

/**
 * Handle authentication flow
 * This function can be called from anywhere in your app
 */
export const handleLogin = async (userId: string, userName: string) => {
  console.log('[React 16] Starting login process...');

  await authService.use((auth) => auth.login(userId, userName));

  console.log('[React 16] Login successful, navigating to dashboard...');
  navigationService.use((nav) => nav.navigate('/dashboard'));
};

/**
 * Check authentication and redirect if needed
 */
export const requireAuth = () => {
  const isAuthenticated = authService.use((auth) => auth.isAuthenticated);

  if (!isAuthenticated) {
    console.log('[React 16] User not authenticated, redirecting to login...');
    navigationService.use((nav) => nav.navigate('/login'));
    return false;
  }

  return true;
};

/**
 * Toggle theme from anywhere
 */
export const toggleAppTheme = () => {
  themeService.use((theme) => theme.toggleTheme());
  console.log('[React 16] Theme toggled');
};

// =============================================================================
// REACT COMPONENTS
// =============================================================================

/**
 * Component that connects hooks to services
 */
const HookConnector: React.FC = () => {
  useHookInjection('auth', useAuth);
  useHookInjection('theme', useTheme);
  useHookInjection('navigation', useNavigation);

  return null;
};

/**
 * Login Component
 */
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await handleLogin('user-' + Date.now(), username);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>React 16 - Login Page</h2>
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
    </div>
  );
};

/**
 * Dashboard Component
 */
const Dashboard: React.FC = () => {
  // In React 16, we can access hook values directly from services
  const authState = authService.use((auth) => ({
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <h2>React 16 - Dashboard</h2>
      {authState.isAuthenticated ? (
        <div>
          <p>Welcome, {authState.user?.name}!</p>
          <button onClick={() => authService.use((auth) => auth.logout())}>
            Logout
          </button>
          <button onClick={toggleAppTheme} style={{ marginLeft: '8px' }}>
            Toggle Theme
          </button>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};

/**
 * Root App Component
 */
const App: React.FC = () => {
  return (
    <HookInjectionProvider>
      <HookConnector />
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <h1>React 16.8+ Example</h1>
        <p>This example demonstrates react-use-anywhere with React 16.8+</p>

        {/* React 16 supports Fragments */}
        <React.Fragment>
          <LoginPage />
          <Dashboard />
        </React.Fragment>
      </div>
    </HookInjectionProvider>
  );
};

export default App;

// =============================================================================
// USAGE NOTES FOR REACT 16
// =============================================================================

/**
 * React 16 Compatibility Notes:
 *
 * ✅ Supported Features:
 * - All hook-based features (useState, useEffect, useContext, etc.)
 * - Fragments (React.Fragment or <>...</>)
 * - Error boundaries
 * - Portals
 * - Concurrent features are NOT available (introduced in React 18)
 *
 * 📝 Recommended Setup:
 * - Use React Router v5 for routing
 * - Use class components for error boundaries
 * - Testing: Use @testing-library/react@^11.x
 *
 * 🔄 Migration Tips:
 * - Code written for React 16 will work in React 17 and 18
 * - No breaking changes needed when upgrading
 * - react-use-anywhere ensures your business logic stays consistent
 *
 * ⚠️ Important:
 * - Minimum version: React 16.8.0 (when hooks were introduced)
 * - StrictMode is supported but less strict than React 18
 */
