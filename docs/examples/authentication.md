# Authentication Examples

Complete authentication examples using React Use Anywhere for clean, service-oriented authentication flows.

## Basic Authentication Service

A complete authentication service that handles login, logout, and session management:

```typescript
// services/authService.ts
import { useHookService } from 'react-use-anywhere';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const navigate = useHookService('navigation');
    const { setUser, setLoading } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    try {
      setLoading(true);

      // API call to authenticate
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user, token } = await response.json();

      // Store auth token
      localStorage.setItem('authToken', token);

      // Update auth state
      setUser(user);

      // Show success message
      addNotification({
        type: 'success',
        message: `Welcome back, ${user.name}!`,
      });

      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

      return user;
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Login failed',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  },

  async logout() {
    const navigate = useHookService('navigation');
    const { clearUser } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API success
      localStorage.removeItem('authToken');
      clearUser();

      addNotification({
        type: 'info',
        message: 'You have been logged out',
      });

      navigate('/login');
    }
  },

  async refreshToken() {
    const { setUser, clearUser } = useHookService('auth');
    const navigate = useHookService('navigation');

    try {
      const currentToken = localStorage.getItem('authToken');
      if (!currentToken) {
        throw new Error('No token found');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { user, token } = await response.json();

      localStorage.setItem('authToken', token);
      setUser(user);

      return user;
    } catch (error) {
      // Token is invalid, clear auth state
      localStorage.removeItem('authToken');
      clearUser();
      navigate('/login');
      throw error;
    }
  },

  async checkAuthStatus() {
    const { setUser, setLoading } = useHookService('auth');
    const navigate = useHookService('navigation');

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return null;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Auth check failed');
      }

      const user = await response.json();
      setUser(user);

      return user;
    } catch (error) {
      localStorage.removeItem('authToken');
      navigate('/login');
      return null;
    } finally {
      setLoading(false);
    }
  },
};
```

## Advanced Authentication Features

### Password Reset Flow

```typescript
// services/passwordResetService.ts
import { useHookService } from 'react-use-anywhere';

export const passwordResetService = {
  async requestPasswordReset(email: string) {
    const { addNotification } = useHookService('notifications');
    const navigate = useHookService('navigation');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      addNotification({
        type: 'success',
        message: 'Password reset email sent! Check your inbox.',
      });

      navigate('/login');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to send reset email',
      });
    }
  },

  async resetPassword(token: string, newPassword: string) {
    const { addNotification } = useHookService('notifications');
    const navigate = useHookService('navigation');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
      }

      addNotification({
        type: 'success',
        message: 'Password reset successfully! Please log in.',
      });

      navigate('/login');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Password reset failed',
      });
    }
  },
};
```

### Two-Factor Authentication

```typescript
// services/twoFactorService.ts
import { useHookService } from 'react-use-anywhere';

export const twoFactorService = {
  async verifyTwoFactor(token: string, code: string) {
    const navigate = useHookService('navigation');
    const { setUser } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, code }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const { user, authToken } = await response.json();

      localStorage.setItem('authToken', authToken);
      setUser(user);

      addNotification({
        type: 'success',
        message: 'Authentication successful!',
      });

      navigate('/dashboard');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Verification failed',
      });
    }
  },

  async enableTwoFactor() {
    const { addNotification } = useHookService('notifications');
    const navigate = useHookService('navigation');

    try {
      const response = await fetch('/api/auth/enable-2fa', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to enable 2FA');
      }

      const { qrCode, backupCodes } = await response.json();

      // Navigate to 2FA setup page with QR code
      navigate('/settings/2fa/setup', {
        state: { qrCode, backupCodes },
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to enable 2FA',
      });
    }
  },
};
```

## Social Authentication

```typescript
// services/socialAuthService.ts
import { useHookService } from 'react-use-anywhere';

export const socialAuthService = {
  async loginWithGoogle() {
    const navigate = useHookService('navigation');
    const { setUser } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    try {
      // Open Google OAuth popup
      const popup = window.open(
        '/api/auth/google',
        'google-auth',
        'width=500,height=600'
      );

      // Listen for auth completion
      const result = await new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);

        window.addEventListener('message', (event) => {
          if (event.origin !== window.location.origin) return;

          clearInterval(checkClosed);
          popup.close();

          if (event.data.success) {
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Authentication failed'));
          }
        });
      });

      const { user, token } = result;

      localStorage.setItem('authToken', token);
      setUser(user);

      addNotification({
        type: 'success',
        message: `Welcome, ${user.name}!`,
      });

      navigate('/dashboard');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Google login failed',
      });
    }
  },

  async loginWithGitHub() {
    // Similar implementation for GitHub OAuth
    // ... implementation details
  },

  async linkAccount(provider: 'google' | 'github' | 'facebook') {
    const { addNotification } = useHookService('notifications');
    const { setUser } = useHookService('auth');

    try {
      const response = await fetch(`/api/auth/link/${provider}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to link ${provider} account`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);

      addNotification({
        type: 'success',
        message: `${provider} account linked successfully!`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || `Failed to link ${provider} account`,
      });
    }
  },
};
```

## Authentication Middleware

Create middleware for protecting routes:

```typescript
// services/authMiddleware.ts
import { useHookService } from 'react-use-anywhere';

export const authMiddleware = {
  requireAuth() {
    const { user, isAuthenticated } = useHookService('auth');
    const navigate = useHookService('navigation');

    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }

    return true;
  },

  requireRole(requiredRole: string) {
    const { user } = useHookService('auth');
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    if (!user) {
      navigate('/login');
      return false;
    }

    if (user.role !== requiredRole) {
      addNotification({
        type: 'error',
        message: 'Access denied. Insufficient permissions.',
      });
      navigate('/unauthorized');
      return false;
    }

    return true;
  },

  requirePermission(permission: string) {
    const { user } = useHookService('auth');
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    if (!user?.permissions?.includes(permission)) {
      addNotification({
        type: 'error',
        message: 'Access denied. Missing required permission.',
      });
      navigate('/unauthorized');
      return false;
    }

    return true;
  },
};
```

## Session Management

```typescript
// services/sessionService.ts
import { useHookService } from 'react-use-anywhere';

export const sessionService = {
  startSession() {
    // Set up session timeout
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const timeoutId = setTimeout(() => {
      this.expireSession();
    }, SESSION_TIMEOUT);

    localStorage.setItem('sessionTimeout', timeoutId.toString());
  },

  expireSession() {
    const { addNotification } = useHookService('notifications');

    addNotification({
      type: 'warning',
      message: 'Your session has expired. Please log in again.',
    });

    authService.logout();
  },

  extendSession() {
    // Clear existing timeout
    const timeoutId = localStorage.getItem('sessionTimeout');
    if (timeoutId) {
      clearTimeout(parseInt(timeoutId));
    }

    // Start new session
    this.startSession();
  },

  async validateSession() {
    try {
      const user = await authService.checkAuthStatus();
      if (user) {
        this.extendSession();
      }
      return user;
    } catch (error) {
      console.error('Session validation failed:', error);
      return null;
    }
  },
};
```

## Complete Auth Hook

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService, sessionService } from '../services';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication status on mount
    sessionService.validateSession().finally(() => {
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    setUser,
    setLoading,
    setError,
    clearUser: () => setUser(null),
    login: authService.login,
    logout: authService.logout,
    refreshToken: authService.refreshToken,
  };
}
```

## Testing Authentication Services

```typescript
// services/__tests__/authService.test.ts
import { useHookService } from 'react-use-anywhere';
import { authService } from '../authService';

jest.mock('react-use-anywhere');
const mockUseHookService = useHookService as jest.MockedFunction<
  typeof useHookService
>;

describe('authService', () => {
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();
  const mockAddNotification = jest.fn();
  const mockSetLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHookService.mockImplementation((key) => {
      switch (key) {
        case 'navigation':
          return mockNavigate;
        case 'auth':
          return { setUser: mockSetUser, setLoading: mockSetLoading };
        case 'notifications':
          return { addNotification: mockAddNotification };
        default:
          throw new Error(`Unexpected hook: ${key}`);
      }
    });
  });

  describe('login', () => {
    it('should navigate to dashboard after successful login', async () => {
      const mockUser = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        role: 'user',
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: 'abc123' }),
      });

      await authService.login({
        email: 'john@example.com',
        password: 'password',
      });

      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: 'Welcome back, John!',
      });
    });

    it('should navigate to admin dashboard for admin users', async () => {
      const mockAdmin = {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockAdmin, token: 'abc123' }),
      });

      await authService.login({
        email: 'admin@example.com',
        password: 'password',
      });

      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });
});
```

## Key Features Demonstrated

✅ **Complete authentication flow** with login, logout, and session management  
✅ **Role-based access control** with middleware patterns  
✅ **Social authentication** integration  
✅ **Two-factor authentication** support  
✅ **Password reset functionality**  
✅ **Session timeout handling**  
✅ **Comprehensive error handling**  
✅ **Fully testable services**

These authentication patterns show how React Use Anywhere enables you to build robust, service-oriented authentication systems with clean separation of concerns!
