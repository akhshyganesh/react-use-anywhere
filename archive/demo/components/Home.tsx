import React, { useState, useEffect } from 'react';
import { useHookService, useHook } from '../../lib';
import { navigationService, goToLogin } from '../services/navigationService';
import {
  authService,
  simulateTokenExpiry,
  getCurrentUser,
} from '../services/authService';
import {
  themeService,
  toggleTheme,
  applyThemeToBody,
} from '../services/themeService';
import { logger } from '../services/logger';
import { DebugPanel } from './DebugPanel';

interface LogEntry {
  id: number;
  timestamp: string;
  type: 'service_call' | 'context_update' | 'data_sync';
  message: string;
  data?: unknown;
}

interface AuthState {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
}

interface ThemeState {
  theme: string;
  isDark: boolean;
}

export const Home: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [buttonStates, setButtonStates] = useState<Record<string, boolean>>({});

  // Connect services to hook values - this makes the hooks available in service files
  useHookService(navigationService, 'navigation');
  useHookService(authService, 'auth');
  useHookService(themeService, 'theme');

  // You can also use hooks directly in React components
  const auth = useHook<AuthState>('auth');
  const theme = useHook<ThemeState>('theme');

  // Subscribe to logger updates
  useEffect(() => {
    return logger.subscribe((newLogs) => {
      setLogs(newLogs);
    });
  }, []);

  // Apply theme to body when component mounts or theme changes
  React.useEffect(() => {
    if (theme) {
      applyThemeToBody();
    }
  }, [theme?.theme]);

  // Helper function to show visual feedback for button clicks
  const animateButton = (buttonId: string) => {
    setButtonStates((prev) => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setButtonStates((prev) => ({ ...prev, [buttonId]: false }));
    }, 300);
  };

  const handleTokenExpiry = () => {
    animateButton('tokenExpiry');
    simulateTokenExpiry();
  };

  const handleThemeToggle = () => {
    animateButton('themeToggle');
    toggleTheme();
  };

  const handleShowUser = () => {
    animateButton('showUser');
    const user = getCurrentUser();
    alert(`Current user: ${user?.name || 'None'} (${user?.email || 'N/A'})`);
  };

  const handleGoToLogin = () => {
    animateButton('goToLogin');
    goToLogin();
  };

  const clearLogs = () => {
    logger.clear();
  };

  const getButtonStyle = (buttonId: string, baseColor: string) => ({
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    backgroundColor: buttonStates[buttonId] ? '#ffd700' : baseColor,
    color: buttonStates[buttonId] ? '#000' : '#fff',
    border: 'none',
    borderRadius: '4px',
    transform: buttonStates[buttonId] ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  });

  return (
    <div
      className="container"
      style={{
        backgroundColor: theme?.isDark ? '#333' : '#fff',
        color: theme?.isDark ? '#fff' : '#333',
        minHeight: '100vh',
        padding: '2rem',
        transition: 'all 0.3s ease',
      }}
    >
      <h1>React Use Anywhere - Demo</h1>
      <p>
        Use React hooks anywhere in your codebase - even in plain
        JavaScript/TypeScript files!
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Current State:</h3>
        <p>
          <strong>Theme:</strong> {theme?.theme || 'loading...'}
        </p>
        <p>
          <strong>User:</strong>{' '}
          {auth?.isAuthenticated ? auth.user?.name : 'Not logged in'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={handleThemeToggle}
          style={getButtonStyle('themeToggle', '#28a745')}
        >
          🎨 Toggle Theme (from service)
          {buttonStates.themeToggle && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.8rem',
                animation: 'pulse 0.3s ease-in-out',
              }}
            >
              ✨
            </span>
          )}
        </button>

        <button
          onClick={handleShowUser}
          style={getButtonStyle('showUser', '#007bff')}
        >
          👤 Get User (from service)
          {buttonStates.showUser && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.8rem',
              }}
            >
              🔍
            </span>
          )}
        </button>

        <button
          onClick={handleTokenExpiry}
          style={getButtonStyle('tokenExpiry', '#dc3545')}
        >
          ⏰ Simulate Token Expiry
          {buttonStates.tokenExpiry && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.8rem',
              }}
            >
              💥
            </span>
          )}
        </button>

        <button
          onClick={handleGoToLogin}
          style={getButtonStyle('goToLogin', '#6c757d')}
        >
          🚪 Go to Login (from service)
          {buttonStates.goToLogin && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.8rem',
              }}
            >
              🏃‍♂️
            </span>
          )}
        </button>
      </div>

      <DebugPanel logs={logs} onClear={clearLogs} />

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: theme?.isDark ? '#444' : '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3>✨ How it works:</h3>
        <ol style={{ textAlign: 'start' }}>
          <li>
            <strong>Wrap your app</strong> with <code>HookProvider</code> and
            pass your hooks
          </li>
          <li>
            <strong>Create singleton services</strong> using{' '}
            <code>createSingletonService()</code> (recommended)
          </li>
          <li>
            <strong>Connect services</strong> using{' '}
            <code>useHookService()</code> in React components
          </li>
          <li>
            <strong>Use anywhere</strong> - call service methods from any file,
            even non-React files!
          </li>
        </ol>

        <div
          style={{
            marginTop: '1rem',
            padding: '0.5rem',
            backgroundColor: theme?.isDark ? '#555' : '#e9ecef',
            borderRadius: '4px',
          }}
        >
          <strong>🔍 Watch the Debug Panel:</strong> Click any button to see the
          service call flow and context synchronization in real-time!
        </div>
      </div>
    </div>
  );
};
