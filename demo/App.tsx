import React, { useState, useMemo } from 'react';
import { HookInjectionProvider } from '../lib';
import { Home } from './components/Home';
import { Login } from './components/Login';
import './App.css';

// Custom navigation hook that works without React Router
const useSimpleNavigation = () => {
  return (path: string, options?: any) => {
    console.log(`Navigation called: ${path}`, options);
    // Simple hash-based navigation for demo purposes
    window.location.hash = path;
  };
};

// Custom authentication hook for demonstration
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  
  return {
    isAuthenticated,
    user,
    login: (username: string) => {
      setIsAuthenticated(true);
      setUser(username);
    },
    logout: () => {
      setIsAuthenticated(false);
      setUser(null);
    }
  };
};

// Custom theme hook for demonstration
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return {
    theme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    isDark: theme === 'dark'
  };
};

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState('/');

  // Listen to hash changes for simple routing
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash.slice(1) || '/');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial route
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Memoize hooks to prevent unnecessary re-renders
  const hooks = useMemo(() => ({
    navigation: useSimpleNavigation,
    auth: useAuth,
    theme: useTheme,
  }), []);

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case '/login':
        return <Login />;
      default:
        return <Home />;
    }
  };

  return (
    <HookInjectionProvider hooks={hooks}>
      {renderCurrentRoute()}
    </HookInjectionProvider>
  );
};

export default App;