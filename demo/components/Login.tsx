import React, { useState, useEffect } from 'react';
import { useHookService, useHook } from '../../lib';
import { navigationService, goToHome } from '../services/navigationService';
import { authService } from '../services/authService';
import { themeService, applyThemeToBody } from '../services/themeService';
import { logger, logServiceCall, logContextUpdate, logDataSync } from '../services/logger';
import { DebugPanel } from './DebugPanel';

export const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [buttonStates, setButtonStates] = useState<Record<string, boolean>>({});

  // Connect services to hook values
  useHookService(navigationService, 'navigation');
  useHookService(authService, 'auth');
  useHookService(themeService, 'theme');

  // Use hooks directly in the component
  const auth = useHook<{ login: (name: string, email: string) => void }>('auth');
  const theme = useHook<{ theme: string; isDark: boolean }>('theme');

  // Subscribe to logger updates
  useEffect(() => {
    return logger.subscribe((newLogs) => {
      setLogs(newLogs);
    });
  }, []);

  // Log context updates when hook values change
  useEffect(() => {
    if (auth) {
      logContextUpdate('auth', auth);
      logDataSync('authService', 'context→service', auth);
    }
  }, [auth]);

  useEffect(() => {
    if (theme) {
      logContextUpdate('theme', theme);
      logDataSync('themeService', 'context→service', theme);
    }
  }, [theme]);

  // Apply theme to body
  React.useEffect(() => {
    applyThemeToBody();
  }, [theme?.theme]);

  // Helper function to show visual feedback for button clicks
  const animateButton = (buttonId: string) => {
    setButtonStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [buttonId]: false }));
    }, 300);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    animateButton('login');
    
    if (name && email) {
      logServiceCall('authService', 'login', { name, email });
      
      // Use auth service directly
      authService.use((auth) => {
        auth.login(name, email);
        logServiceCall('authService', 'login.success', { name, email });
      });
      
      // Navigate to home using service
      setTimeout(() => {
        goToHome();
      }, 500); // Small delay to show the service call
    }
  };

  const handleGoHome = () => {
    animateButton('goHome');
    goToHome();
  };

  const clearLogs = () => {
    logger.clear();
  };

  const getButtonStyle = (buttonId: string, baseColor: string) => ({
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    marginRight: '1rem',
    backgroundColor: buttonStates[buttonId] ? '#ffd700' : baseColor,
    color: buttonStates[buttonId] ? '#000' : '#fff',
    border: 'none',
    borderRadius: '4px',
    transform: buttonStates[buttonId] ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const
  });

  return (
    <div style={{ 
      backgroundColor: theme?.isDark ? '#333' : '#fff',
      color: theme?.isDark ? '#fff' : '#333',
      minHeight: '100vh',
      padding: '2rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1>Login Page</h1>
        <p>Demo login form using services</p>
        
        <form onSubmit={handleLogin} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  marginTop: '0.25rem',
                  backgroundColor: theme?.isDark ? '#444' : '#fff',
                  color: theme?.isDark ? '#fff' : '#333',
                  border: '1px solid #ccc'
                }}
                placeholder="Enter your name"
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  marginTop: '0.25rem',
                  backgroundColor: theme?.isDark ? '#444' : '#fff',
                  color: theme?.isDark ? '#fff' : '#333',
                  border: '1px solid #ccc'
                }}
                placeholder="Enter your email"
              />
            </label>
          </div>
          
          <button 
            type="submit"
            style={getButtonStyle('login', '#28a745')}
          >
            🔐 Login (using service)
            {buttonStates.login && (
              <span style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                fontSize: '0.8rem'
              }}>
                ✨
              </span>
            )}
          </button>
          
          <button 
            type="button"
            onClick={handleGoHome}
            style={getButtonStyle('goHome', '#6c757d')}
          >
            🏠 Back to Home
            {buttonStates.goHome && (
              <span style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                fontSize: '0.8rem'
              }}>
                🏃‍♂️
              </span>
            )}
          </button>
        </form>

        <div style={{ padding: '1rem', backgroundColor: theme?.isDark ? '#444' : '#f5f5f5', borderRadius: '8px' }}>
          <p><strong>Try logging in!</strong> The login function is called from a service, and navigation happens from the service too.</p>
          <p>This demonstrates how you can use React hooks (auth, navigation, theme) from anywhere in your code.</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: theme?.isDark ? '#ccc' : '#666' }}>
            <strong>🔍 Watch the Debug Panel:</strong> See service calls and context synchronization in real-time!
          </div>
        </div>
      </div>

      <DebugPanel logs={logs} onClear={clearLogs} />
    </div>
  );
};