# Authentication Examples

Complete authentication flows you can copy-paste into your React application.

## Basic Login/Logout Flow

```tsx
// App.tsx - Setup authentication provider
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        notifications: useNotifications,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </HookProvider>
  );
}
```

```ts
// services/auth.ts - Complete authentication service
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');
export const notificationService = createSingletonService('notifications');

export const login = async (email: string, password: string) => {
  try {
    notificationService.use((notify) => notify.info('Signing in...'));

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error('Login failed');
    }

    const { user, token } = await response.json();

    // Store token
    localStorage.setItem('authToken', token);

    // Update auth state
    authService.use((auth) => auth.setUser(user));

    // Show success message
    notificationService.use((notify) =>
      notify.success(`Welcome back, ${user.name}!`)
    );

    // Navigate to dashboard
    navigationService.use((navigate) => navigate('/dashboard'));

    return user;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error(error.message || 'Login failed')
    );
    throw error;
  }
};

export const logout = () => {
  // Clear token
  localStorage.removeItem('authToken');

  // Clear user state
  authService.use((auth) => auth.clearUser());

  // Show message
  notificationService.use((notify) => notify.info('Logged out successfully'));

  // Navigate to login
  navigationService.use((navigate) => navigate('/login'));
};

export const signup = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    notificationService.use((notify) => notify.info('Creating account...'));

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const { user, token } = await response.json();

    // Store token
    localStorage.setItem('authToken', token);

    // Update auth state
    authService.use((auth) => auth.setUser(user));

    // Show success message
    notificationService.use((notify) =>
      notify.success('Account created successfully!')
    );

    // Navigate to dashboard
    navigationService.use((navigate) => navigate('/dashboard'));

    return user;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error(error.message || 'Failed to create account')
    );
    throw error;
  }
};

export const checkAuthStatus = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return false;
  }

  try {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const user = await response.json();
      authService.use((auth) => auth.setUser(user));
      return true;
    } else {
      // Invalid token
      logout();
      return false;
    }
  } catch (error) {
    // Network error
    logout();
    return false;
  }
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Current password is incorrect');
      }
      throw new Error('Failed to update password');
    }

    notificationService.use((notify) =>
      notify.success('Password updated successfully')
    );

    return true;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error(error.message || 'Failed to update password')
    );
    throw error;
  }
};
```

## Protected Routes & Route Guards

```tsx
// components/ProtectedRoute.tsx - Route protection
import { useEffect, useState } from 'react';
import { useHookService } from 'react-use-anywhere';
import { authService, checkAuthStatus } from '../services/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Connect auth service
  useHookService(authService, 'auth');

  useEffect(() => {
    checkAuthStatus().then((isAuth) => {
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
}
```

## Using the Authentication System

### Setup your hooks:

```tsx
// hooks/useAuth.ts
import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    clearUser: () => setUser(null),
    setLoading,
  };
}

// hooks/useNotifications.ts
import { useState } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  return {
    notifications,
    info: (message: string) => console.log('Info:', message),
    success: (message: string) => console.log('Success:', message),
    error: (message: string) => console.log('Error:', message),
  };
}
```

### Connect services in your app:

```tsx
// components/AuthProvider.tsx
import { useHookService } from 'react-use-anywhere';
import {
  authService,
  navigationService,
  notificationService,
  checkAuthStatus,
} from '../services/auth';
import { useEffect } from 'react';

function AuthProvider({ children }: { children: React.ReactNode }) {
  // Connect all auth services
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');
  useHookService(notificationService, 'notifications');

  useEffect(() => {
    // Check auth status on app load
    checkAuthStatus();
  }, []);

  return <>{children}</>;
}
```

### Use in components:

```tsx
// components/LoginForm.tsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      // Service handles everything else!
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

This authentication system provides:

- ✅ **Complete login/logout flow**
- ✅ **Protected routes**
- ✅ **Error handling and user feedback**
- ✅ **TypeScript support**
- ✅ **Easy to test and maintain**

Copy these examples and customize them for your specific backend API endpoints and requirements.

````

## Advanced Authentication Features

### Password Reset Flow

```typescript
// services/passwordResetService.ts
import { navigationService, notificationService } from './auth';

export const passwordResetService = {
  async requestPasswordReset(email: string) {
    try {
      notificationService.use(notify => notify.info('Sending reset email...'));

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      notificationService.use(notify =>
        notify.success('Password reset email sent! Check your inbox.')
      );

      navigationService.use(navigate => navigate('/login'));
    } catch (error) {
      notificationService.use(notify =>
        notify.error(error.message || 'Failed to send reset email')
      );
    }
  },

  async resetPassword(token: string, newPassword: string) {
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

      notificationService.use(notify =>
        notify.success('Password reset successfully! Please log in.')
      );

      navigationService.use(navigate => navigate('/login'));
    } catch (error) {
      notificationService.use(notify =>
        notify.error(error.message || 'Password reset failed')
      );
    }
  },
};
````

### Two-Factor Authentication

```typescript
// services/twoFactorService.ts
import { authService, navigationService, notificationService } from './auth';

export const twoFactorService = {
  async verifyTwoFactor(token: string, code: string) {
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
      authService.use((auth) => auth.setUser(user));

      notificationService.use((notify) =>
        notify.success('Authentication successful!')
      );

      navigationService.use((navigate) => navigate('/dashboard'));
    } catch (error) {
      notificationService.use((notify) =>
        notify.error(error.message || 'Verification failed')
      );
    }
  },

  async enableTwoFactor() {
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
      navigationService.use((navigate) =>
        navigate('/settings/2fa/setup', {
          state: { qrCode, backupCodes },
        })
      );
    } catch (error) {
      notificationService.use((notify) =>
        notify.error(error.message || 'Failed to enable 2FA')
      );
    }
  },
};
```

## Key Features Demonstrated

✅ **Complete authentication flow** with login, logout, and session management  
✅ **Protected routes** with proper redirect handling  
✅ **Service-based architecture** for clean separation of concerns  
✅ **Error handling and user feedback** through notifications  
✅ **TypeScript support** with proper typing  
✅ **Easy to test and maintain** with isolated services

## Getting Started

1. **Set up your hooks** - Create `useAuth` and `useNotifications` hooks
2. **Connect services** - Use `useHookService` to connect services to hooks
3. **Wrap your app** - Add `HookProvider` and `AuthProvider` to your app root
4. **Use the services** - Import and use `login`, `logout`, etc. functions in your components

These authentication patterns show how React Use Anywhere enables you to build robust, service-oriented authentication systems with clean separation of concerns!
