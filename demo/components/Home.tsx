import React from 'react';
import { useHookInjection, useAllInjectedHooks } from '../../lib';
import { simulateTokenCheck } from '../services/authService';
import { navigationService, navigateToLogin } from '../services/navigationService';

export const Home: React.FC = () => {
  // Inject navigation hook into the service using the legacy useHookInjection for demo
  useHookInjection(navigationService, {
    onReady: () => console.log('Navigation service ready!'),
    onError: (error) => console.error('Navigation injection failed:', error)
  });

  // Get all available hooks from context
  const injectedHooks = useAllInjectedHooks();

  const handleTokenCheck = () => {
    simulateTokenCheck();
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('Navigating to login...');
      navigateToLogin();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  const handleThemeToggle = () => {
    if (injectedHooks.theme) {
      injectedHooks.theme.toggleTheme();
      console.log('Theme toggled to:', injectedHooks.theme.theme);
    }
  };

  const handleAuthTest = () => {
    if (injectedHooks.auth) {
      if (injectedHooks.auth.isAuthenticated) {
        console.log('User is authenticated:', injectedHooks.auth.user);
        injectedHooks.auth.logout();
        console.log('User logged out');
      } else {
        injectedHooks.auth.login('DemoUser');
        console.log('User logged in');
      }
    }
  };

  const handleNavigationTest = () => {
    if (injectedHooks.navigation) {
      injectedHooks.navigation('/test-route', { demo: true });
    }
  };

  const currentTheme = injectedHooks.theme?.theme || 'light';
  const isDark = injectedHooks.theme?.isDark || false;

  return (
    <div className="container" style={{ 
      backgroundColor: isDark ? '#333' : '#fff',
      color: isDark ? '#fff' : '#333',
      transition: 'all 0.3s ease'
    }}>
      <h1>Home Page</h1>
      <h2>🚀 Router-Agnostic Hook Injection Demo</h2>
      <p>This demonstrates how to use <strong>any React hooks</strong> in non-React files using the modular library.</p>
      
      <div className="demo-buttons">
        <button 
          className="button"
          onClick={handleTokenCheck}
        >
          Simulate Token Expiry & Navigation
        </button>
        
        <button 
          className="button"  
          onClick={handleThemeToggle}
        >
          Toggle Theme (Current: {currentTheme})
        </button>
        
        <button 
          className="button"
          onClick={handleAuthTest}
        >
          Test Auth Hook ({injectedHooks.auth?.isAuthenticated ? 'Logout' : 'Login'})
        </button>

        <button 
          className="button"
          onClick={handleNavigationTest}
        >
          Test Navigation Hook
        </button>
      </div>
      
      <div className="info">
        <h3>🎯 Current Hook States:</h3>
        <p><strong>Theme:</strong> {currentTheme} (isDark: {isDark.toString()})</p>
        <p><strong>Auth:</strong> {injectedHooks.auth?.isAuthenticated ? `Authenticated as ${injectedHooks.auth.user}` : 'Not authenticated'}</p>
        <p><strong>Navigation:</strong> {injectedHooks.navigation ? 'Available' : 'Not available'}</p>
      </div>

      <div className="features">
        <h3>✨ Library Benefits:</h3>
        <ul>
          <li>🌐 <strong>Router Agnostic:</strong> Works with React Router, TanStack Router, Next.js, or NO router</li>
          <li>🎣 <strong>Hook Agnostic:</strong> Works with ANY React hooks - auth, theme, data fetching, etc.</li>
          <li>📦 <strong>Modular:</strong> Use only what you need, when you need it</li>
          <li>🔄 <strong>No Dependencies:</strong> No React Router DOM or any specific router required</li>
          <li>🛡️ <strong>Production Ready:</strong> TypeScript support, error handling, testing</li>
          <li>🧪 <strong>Testable:</strong> Services can be easily mocked and tested independently</li>
          <li>🎯 <strong>Type Safe:</strong> Full TypeScript support with proper typing</li>
        </ul>
      </div>
    </div>
  );
};