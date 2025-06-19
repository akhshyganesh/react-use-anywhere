import React, { useState } from 'react';
import { HookProvider } from '../lib';
import { Home } from './components/Home';
import { Login } from './components/Login';
import './App.css';

// Simple navigation hook for the demo
const useNavigation = () => {
  return (path: string) => {
    console.log(`Navigating to: ${path}`);
    window.location.hash = path;
  };
};

// Simple auth hook for the demo
const useAuth = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  return {
    user,
    isAuthenticated: !!user,
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
const useTheme = () => {
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

  return (
    <HookProvider
      hooks={{
        navigation: useNavigation,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      {currentPage === '/login' ? <Login /> : <Home />}
    </HookProvider>
  );
};

export default App;