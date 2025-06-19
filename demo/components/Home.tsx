import React from 'react';
import { useHookService, useHook } from '../../lib';
import { navigationService, goToLogin } from '../services/navigationService';
import { authService, simulateTokenExpiry, getCurrentUser } from '../services/authService';
import { themeService, toggleTheme, applyThemeToBody } from '../services/themeService';

export const Home: React.FC = () => {
  // Connect services to hook values - this makes the hooks available in service files
  useHookService(navigationService, 'navigation');
  useHookService(authService, 'auth');
  useHookService(themeService, 'theme');

  // You can also use hooks directly in React components
  const auth = useHook<{ user: any; isAuthenticated: boolean }>('auth');
  const theme = useHook<{ theme: string; isDark: boolean }>('theme');

  // Apply theme to body when component mounts or theme changes
  React.useEffect(() => {
    applyThemeToBody();
  }, [theme?.theme]);

  const handleTokenExpiry = () => {
    simulateTokenExpiry();
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleShowUser = () => {
    const user = getCurrentUser();
    alert(`Current user: ${user?.name || 'None'} (${user?.email || 'N/A'})`);
  };

  const handleGoToLogin = () => {
    goToLogin();
  };

  return (
    <div className="container" style={{ 
      backgroundColor: theme?.isDark ? '#333' : '#fff',
      color: theme?.isDark ? '#fff' : '#333',
      minHeight: '100vh',
      padding: '2rem',
      transition: 'all 0.3s ease'
    }}>
      <h1>🚀 React Use Anywhere - Demo</h1>
      <p>Use React hooks anywhere in your codebase - even in plain JavaScript/TypeScript files!</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Current State:</h3>
        <p><strong>Theme:</strong> {theme?.theme || 'loading...'}</p>
        <p><strong>User:</strong> {auth?.isAuthenticated ? auth.user?.name : 'Not logged in'}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          onClick={handleThemeToggle}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Toggle Theme (from service)
        </button>
        
        <button 
          onClick={handleShowUser}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Get User (from service)
        </button>
        
        <button 
          onClick={handleTokenExpiry}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Simulate Token Expiry
        </button>
        
        <button 
          onClick={handleGoToLogin}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Go to Login (from service)
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: theme?.isDark ? '#444' : '#f5f5f5', borderRadius: '8px' }}>
        <h3>✨ How it works:</h3>
        <ol>
          <li><strong>Wrap your app</strong> with <code>HookProvider</code> and pass your hooks</li>
          <li><strong>Create services</strong> using <code>createSingletonService()</code></li>
          <li><strong>Connect services</strong> using <code>useHookService()</code> in React components</li>
          <li><strong>Use anywhere</strong> - call service methods from any file, even non-React files!</li>
        </ol>
      </div>
    </div>
  );
};