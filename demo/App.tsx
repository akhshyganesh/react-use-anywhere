import React, { useState } from 'react';
import { HookProvider, TypedHookProvider } from '../lib';
import { Home } from './components/Home';
import { Login } from './components/Login';
import './assets/App.css';

// Define hook types for type safety
type NavigateFunction = (path: string) => void;
type AuthState = {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
};
type ThemeState = {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggle: () => void;
};

// Define the app's hook types for type safety
export type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
};

// Simple navigation hook for the demo
const useNavigation = (): NavigateFunction => {
  return (path: string) => {
    console.log(`Navigating to: ${path}`);
    window.location.hash = path;
  };
};

// Simple auth hook for the demo
const useAuth = (): AuthState => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  return {
    user,
    isAuthenticated: Boolean(user),
    login: (name: string, email: string) => {
      setUser({ name, email });
      console.log('User logged in:', { name, email });
    },
    logout: () => {
      setUser(null);
      console.log('User logged out');
    }
  };
};

// Simple theme hook for the demo
const useTheme = (): ThemeState => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      console.log('Theme changed to:', newTheme);
    }
  };
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('/');

  // Simple hash-based routing for the demo
  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.slice(1) || '/');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Define hooks object with proper typing
  const hooks: AppHooks = {
    navigation: useNavigation,
    auth: useAuth,
    theme: useTheme,
  };

  return (
    <TypedHookProvider hooks={hooks}>
      {currentPage === '/login' ? <Login /> : <Home />}
    </TypedHookProvider>
  );
};

export default App;