/**
 * Router-Agnostic Demo
 * 
 * This example shows how the React Hook Injection Pattern works with different routers
 * and various types of hooks - demonstrating its truly modular nature.
 */

import React, { useState } from 'react';
import { 
  HookInjectionProvider, 
  createSingletonService, 
  useHookInjection, 
  useHookFromContext 
} from 'react-use-anywhere';

// =============================================================================
// 1. ROUTER-AGNOSTIC EXAMPLES
// =============================================================================

// Example 1: React Router v6
// import { BrowserRouter, useNavigate } from 'react-router-dom';
// const useNavigation = useNavigate;

// Example 2: TanStack Router
// import { useRouter } from '@tanstack/router';
// const useNavigation = () => useRouter().navigate;

// Example 3: Next.js Router
// import { useRouter } from 'next/router';
// const useNavigation = () => useRouter().push;

// Example 4: Custom Hash Router (for this demo)
const useHashNavigation = () => {
  return (path: string, options?: any) => {
    console.log(`Navigating to: ${path}`, options);
    window.location.hash = path;
  };
};

// =============================================================================
// 2. CUSTOM HOOKS FOR DIFFERENT PURPOSES
// =============================================================================

// Authentication Hook
const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async (username: string) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setUser(username);
      setIsLoading(false);
    },
    logout: () => {
      setUser(null);
    }
  };
};

// Theme Hook
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    setTheme
  };
};

// Data Fetching Hook
const useApiData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData({ message: `Data from ${url}`, timestamp: Date.now() });
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

// =============================================================================
// 3. SERVICES USING STANDARD SINGLETON PATTERN 🚀
// =============================================================================

// Standard approach - using singleton services for shared state
export const navigationService = createSingletonService<(path: string, options?: any) => void>('navigation');

export const authService = createSingletonService<{
  user: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
}>('auth');

export const themeService = createSingletonService<{
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}>('theme');

export const apiService = createSingletonService<{
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: (url: string) => Promise<void>;
}>('api');

// =============================================================================
// 4. BUSINESS LOGIC USING SERVICES (ROUTER-AGNOSTIC)
// =============================================================================

// Authentication flow that works with any router
export const handleLogin = async (username: string) => {
  console.log('🔐 Starting login process...');
  
  const success = await authService.execute(async (auth) => {
    await auth.login(username);
    return auth.isAuthenticated;
  });

  if (success) {
    console.log('✅ Login successful, redirecting...');
    navigationService.execute((navigate) => {
      navigate('/dashboard');
    });
  }
};

// Theme switching that affects UI
export const toggleAppTheme = () => {
  themeService.execute((theme) => {
    theme.toggleTheme();
    console.log(`🎨 Theme switched to: ${theme.theme}`);
  });
};

// Data fetching with error handling
export const loadUserData = async () => {
  console.log('📊 Loading user data...');
  
  await apiService.execute(async (api) => {
    await api.fetchData('/api/user');
  });
};

// Logout flow
export const handleLogout = () => {
  console.log('👋 Logging out...');
  
  authService.execute((auth) => {
    auth.logout();
  });
  
  navigationService.execute((navigate) => {
    navigate('/login');
  });
};

// =============================================================================
// 5. REACT COMPONENTS
// =============================================================================

const DemoPage: React.FC = () => {
  // Inject all hooks into their respective services
  useHookInjection(navigationService, 'navigation');
  useHookInjection(authService, 'auth');
  useHookInjection(themeService, 'theme');
  useHookInjection(apiService, 'api');

  // Access hooks directly from context if needed
  const theme = useHookFromContext('theme');
  const auth = useHookFromContext('auth');
  const api = useHookFromContext('api');

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: theme?.isDark ? '#222' : '#fff',
      color: theme?.isDark ? '#fff' : '#222',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <h1>🚀 Router-Agnostic Hook Injection Demo</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Current State:</h3>
        <p>Theme: {theme?.theme} | User: {auth?.user || 'Not logged in'} | API Loading: {api?.loading ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => handleLogin('John Doe')}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Login as John Doe
        </button>
        
        <button 
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Logout
        </button>
        
        <button 
          onClick={toggleAppTheme}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Toggle Theme
        </button>
        
        <button 
          onClick={loadUserData}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
        >
          Load Data
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: theme?.isDark ? '#333' : '#f8f9fa', borderRadius: '8px' }}>
        <h3>✨ Key Benefits Demonstrated:</h3>
        <ul>
          <li>🔌 <strong>Router-Agnostic:</strong> Works with React Router, TanStack Router, Next.js, or custom routers</li>
          <li>🎣 <strong>Hook-Agnostic:</strong> Works with any React hooks - auth, theme, data fetching, etc.</li>
          <li>📦 <strong>Modular:</strong> Each service handles one concern</li>
          <li>🧪 <strong>Testable:</strong> Services can be easily mocked and tested</li>
          <li>🎯 <strong>Type-Safe:</strong> Full TypeScript support with proper typing</li>
          <li>🔄 <strong>Reusable:</strong> Same business logic works across different routing solutions</li>
        </ul>
      </div>

      {api?.data && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: theme?.isDark ? '#444' : '#e9ecef', borderRadius: '8px' }}>
          <h4>API Data:</h4>
          <pre>{JSON.stringify(api.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// 6. APP SETUP (ROUTER-AGNOSTIC)
// =============================================================================

const RouterAgnosticDemo: React.FC = () => {
  // You can easily switch between different routers by changing these hooks
  const hooks = {
    navigation: useHashNavigation, // Switch to useNavigate, useRouter, etc.
    auth: useAuth,
    theme: useTheme,
    api: useApiData,
  };

  return (
    <HookInjectionProvider hooks={hooks}>
      <DemoPage />
    </HookInjectionProvider>
  );
};

export default RouterAgnosticDemo;

// =============================================================================
// 7. USAGE WITH DIFFERENT ROUTERS
// =============================================================================

/*
// React Router v6
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <HookInjectionProvider hooks={{ navigation: useNavigate, auth: useAuth }}>
    <App />
  </HookInjectionProvider>
</BrowserRouter>

// TanStack Router
import { RouterProvider } from '@tanstack/router';

<RouterProvider router={router}>
  <HookInjectionProvider hooks={{ navigation: () => router.navigate, auth: useAuth }}>
    <App />
  </HookInjectionProvider>
</RouterProvider>

// Next.js (pages/_app.tsx)
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <HookInjectionProvider hooks={{ navigation: () => router.push, auth: useAuth }}>
      <Component {...pageProps} />
    </HookInjectionProvider>
  );
}

// Remix
import { useNavigate } from '@remix-run/react';

<HookInjectionProvider hooks={{ navigation: useNavigate, auth: useAuth }}>
  <Outlet />
</HookInjectionProvider>
*/
      <Component {...pageProps} />
    </HookInjectionProvider>
  );
}

// Remix
import { useNavigate } from '@remix-run/react';

<HookInjectionProvider hooks={{ navigation: useNavigate, auth: useAuth }}>
  <Outlet />
</HookInjectionProvider>
*/
