import React, { useState } from 'react';
import { useHookService, useHook } from '../../lib';
import { navigationService, goToHome } from '../services/navigationService';
import { authService } from '../services/authService';
import { themeService, applyThemeToBody } from '../services/themeService';

export const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Connect services to hook values
  useHookService(navigationService, 'navigation');
  useHookService(authService, 'auth');
  useHookService(themeService, 'theme');

  // Use hooks directly in the component
  const auth = useHook<{ login: (name: string, email: string) => void }>('auth');
  const theme = useHook<{ theme: string; isDark: boolean }>('theme');

  // Apply theme to body
  React.useEffect(() => {
    applyThemeToBody();
  }, [theme?.theme]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && email) {
      // Use auth service directly
      authService.use((auth) => {
        auth.login(name, email);
      });
      
      // Navigate to home using service
      goToHome();
    }
  };

  const handleGoHome = () => {
    goToHome();
  };

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
            style={{ 
              padding: '0.75rem 1.5rem', 
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Login (using service)
          </button>
          
          <button 
            type="button"
            onClick={handleGoHome}
            style={{ 
              padding: '0.75rem 1.5rem', 
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </form>

        <div style={{ padding: '1rem', backgroundColor: theme?.isDark ? '#444' : '#f5f5f5', borderRadius: '8px' }}>
          <p><strong>Try logging in!</strong> The login function is called from a service, and navigation happens from the service too.</p>
          <p>This demonstrates how you can use React hooks (auth, navigation, theme) from anywhere in your code.</p>
        </div>
      </div>
    </div>
  );
};