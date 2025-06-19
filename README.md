# React Use Anywhere

[![npm version](https://badge.fury.io/js/react-use-anywhere.svg)](https://badge.fury.io/js/react-use-anywhere)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Use React hooks **anywhere** in your codebase - in services, utilities, and business logic files. Works with any React hooks and any router.

## 🚀 Features

- ✅ **TypeScript Support**: Complete type safety with excellent IntelliSense
- ✅ **Zero Dependencies**: Uses peer dependencies only (React 16.8+)
- ✅ **Hook-Agnostic**: Works with ANY React hooks (navigation, auth, state, custom hooks, etc.)
- ✅ **Router-Agnostic**: Works with React Router, TanStack Router, Next.js Router, or no router at all
- ✅ **Simple API**: Just 3 main functions to learn
- ✅ **Singleton Support**: Share services across your entire application
- ✅ **Tree Shakeable**: Optimized bundle size with clean exports
- ✅ **Production Ready**: Comprehensive error handling and warnings

## 📦 Installation

```bash
npm install react-use-anywhere
```

## 🎯 Quick Start

### 1. Wrap your app with the provider

```tsx
import React from 'react';
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom'; // or any navigation hook

function App() {
  return (
    <HookProvider hooks={{ 
      navigate: useNavigate, 
      auth: useAuth,
      theme: useTheme 
    }}>
      <HomePage />
    </HookProvider>
  );
}
```

### 2. Create services for your hooks

```tsx
import { createHookService } from 'react-use-anywhere';

// Create individual services
export const navigationService = createHookService();
export const authService = createHookService();

// Or use singletons (recommended for shared services)
export const themeService = createSingletonService('theme');
```

### 3. Connect services to hooks in React components

```tsx
import { useHookService } from 'react-use-anywhere';

function HomePage() {
  // Connect each service to its corresponding hook
  useHookService(navigationService, 'navigate');
  useHookService(authService, 'auth');
  useHookService(themeService, 'theme');
  
  return <div>Welcome! Your hooks are now available anywhere.</div>;
}
```

### 4. Use hooks anywhere in your codebase

```typescript
// services/userService.ts - Use hooks in plain TypeScript files!
import { navigationService, authService, themeService } from './services';

export function handleLogout() {
  // Use auth hook from anywhere
  authService.use((auth) => {
    auth.logout();
    console.log('User logged out');
  });
  
  // Use navigation hook from anywhere  
  navigationService.use((navigate) => {
    navigate('/login');
  });
  
  // Even use theme hooks from business logic
  themeService.use((theme) => {
    theme.setTheme('light'); // Reset to light theme on logout
  });
}

// Check if user is authenticated before API calls
export function makeAuthenticatedRequest(url: string) {
  const isAuthenticated = authService.use((auth) => auth.isAuthenticated);
  
  if (!isAuthenticated) {
    navigationService.use((navigate) => navigate('/login'));
    return;
  }
  
  // Make your API request...
}
```

## 🎨 Complete Example

```tsx
import React, { useState } from 'react';
import { 
  HookProvider, 
  createSingletonService, 
  useHookService 
} from 'react-use-anywhere';

// 1. Create your custom hooks
const useAuth = () => {
  const [user, setUser] = useState(null);
  return {
    user,
    isAuthenticated: !!user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null)
  };
};

const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  };
};

// 2. Create services (using singletons for shared state)
export const authService = createSingletonService('auth');
export const themeService = createSingletonService('theme');
export const navigationService = createSingletonService('navigation');

// 3. Business logic that works anywhere
export const handleLogin = async (credentials) => {
  const success = await authService.use(async (auth) => {
    // Simulate login API call
    const userData = await loginAPI(credentials);
    auth.login(userData);
    return true;
  });

  if (success) {
    navigationService.use((navigate) => navigate('/dashboard'));
    themeService.use((theme) => theme.toggle()); // Welcome them with dark mode!
  }
};

export const toggleAppTheme = () => {
  themeService.use((theme) => {
    theme.toggle();
    console.log(`Theme switched to: ${theme.theme}`);
  });
};

// 4. React components
function App() {
  return (
    <HookProvider hooks={{ 
      navigate: useNavigate,  // Any router's navigation hook
      auth: useAuth,          // Your custom auth hook
      theme: useTheme         // Your custom theme hook
    }}>
      <Dashboard />
    </HookProvider>
  );
}

function Dashboard() {
  // Connect all services to their hooks
  useHookService(navigationService, 'navigate');
  useHookService(authService, 'auth');
  useHookService(themeService, 'theme');
  
  return (
    <div>
      <button onClick={() => handleLogin({ username: 'demo' })}>
        Login
      </button>
      <button onClick={toggleAppTheme}>
        Toggle Theme  
      </button>
      <button onClick={() => navigationService.use(nav => nav('/settings'))}>
        Go to Settings
      </button>
    </div>
  );
}
```

## 📚 API Reference

### `HookProvider`
Provider component that makes hooks available to services throughout your app.

**Props:**
- `hooks`: Object mapping hook names to hook functions
- `children`: React components that will have access to the hooks

```tsx
<HookProvider hooks={{ 
  navigate: useNavigate,
  auth: useAuth,
  theme: useTheme,
  customHook: useCustomHook
}}>
  <App />
</HookProvider>
```

### `createHookService<T>()`
Creates a new service that can store and use hook values anywhere in your code.

```tsx
const navigationService = createHookService<(path: string) => void>();
const authService = createHookService<AuthHookType>();
```

### `createSingletonService<T>(serviceId)`
Creates or returns an existing singleton service. Perfect for services you want to share across your entire app.

```tsx
const themeService = createSingletonService<ThemeHookType>('theme');
const authService = createSingletonService<AuthHookType>('auth');
```

### `useHookService(service, hookName)`
Connects a service to a hook from the provider. Use this in React components to make hook values available in services.

```tsx
function MyComponent() {
  useHookService(navigationService, 'navigate');
  useHookService(authService, 'auth');
  // Now these services can be used anywhere in your codebase
}
```

### Service Methods

Every service created with `createHookService` has these methods:

```tsx
const service = createHookService<MyHookType>();

// Use the hook value in a callback - main method for using hooks anywhere
service.use((hookValue) => {
  // Use the hook value here
  hookValue.someMethod();
  return someResult;
});

// Get the current hook value (returns null if not ready)
const currentValue = service.get();

// Check if the service is ready to use
const isReady = service.isReady();
```

### Direct Hook Access

Sometimes you want to use hook values directly in React components:

```tsx
import { useHook, useAllHooks, useHookContext } from 'react-use-anywhere';

function MyComponent() {
  // Get a specific hook value
  const navigate = useHook<NavigateFunction>('navigate');
  const auth = useHook<AuthHookType>('auth');
  
  // Get all hook values
  const allHooks = useAllHooks();
  
  // Get the full context (same as useAllHooks)
  const context = useHookContext();
  
  return <div>Direct access to hooks!</div>;
}
```

## 🔄 Router Examples

### React Router v6
```tsx
import { useNavigate, useLocation } from 'react-router-dom';

<HookProvider hooks={{ 
  navigate: useNavigate,
  location: useLocation 
}}>
  <App />
</HookProvider>
```

### TanStack Router
```tsx
import { useRouter, useNavigate } from '@tanstack/react-router';

<HookProvider hooks={{ 
  navigate: useNavigate,
  router: useRouter 
}}>
  <App />
</HookProvider>
```

### Next.js App Router
```tsx
import { useRouter } from 'next/navigation';

<HookProvider hooks={{ 
  navigate: () => {
    const router = useRouter();
    return router.push;
  }
}}>
  <App />
</HookProvider>
```

### Next.js Pages Router
```tsx
import { useRouter } from 'next/router';

<HookProvider hooks={{ 
  navigate: () => {
    const router = useRouter();
    return router.push;
  },
  query: () => useRouter().query
}}>
  <App />
</HookProvider>
```

## 🧪 Testing

Testing with react-use-anywhere is straightforward:

```typescript
import { createHookService, resetAllServices } from 'react-use-anywhere';

describe('My Business Logic', () => {
  const authService = createHookService();
  const navigationService = createHookService();

  beforeEach(() => {
    // Reset all services before each test
    resetAllServices();
    
    // Set up mock hook values
    authService._setValue({
      user: { id: 1, name: 'Test User' },
      isAuthenticated: true,
      logout: jest.fn()
    });
    
    navigationService._setValue(jest.fn());
  });

  it('should logout and redirect', () => {
    const mockNavigate = jest.fn();
    navigationService._setValue(mockNavigate);
    
    // Test your business logic
    handleLogout();
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
```

## 🎯 Best Practices

### 1. Use Singleton Services for Shared State
```tsx
// ✅ Good - shared across your entire app
export const authService = createSingletonService('auth');
export const themeService = createSingletonService('theme');

// ❌ Avoid - creates new instances every time
export const getAuthService = () => createHookService();
```

### 2. Define Clear Hook Types
```tsx
// ✅ Good - clear TypeScript types
type AuthHook = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
};

export const authService = createSingletonService<AuthHook>('auth');
```

### 3. Organize Services by Domain
```tsx
// services/auth.ts
export const authService = createSingletonService<AuthHook>('auth');

// services/navigation.ts  
export const navigationService = createSingletonService<NavigationHook>('navigation');

// services/theme.ts
export const themeService = createSingletonService<ThemeHook>('theme');
```

### 4. Create Helper Functions
```tsx
// helpers/auth.ts
import { authService, navigationService } from '../services';

export const requireAuth = () => {
  const isAuthenticated = authService.use((auth) => auth.isAuthenticated);
  
  if (!isAuthenticated) {
    navigationService.use((navigate) => navigate('/login'));
    return false;
  }
  
  return true;
};

export const getCurrentUser = () => {
  return authService.use((auth) => auth.user);
};
```

## 🔍 Common Patterns

### Authentication Guard
```tsx
export const withAuth = (callback: () => void) => {
  const isAuthenticated = authService.use((auth) => auth.isAuthenticated);
  
  if (!isAuthenticated) {
    navigationService.use((navigate) => navigate('/login'));
    return;
  }
  
  callback();
};

// Usage
withAuth(() => {
  // Protected business logic
  makeAPICall();
});
```

### Theme-Aware Operations
```tsx
export const showNotification = (message: string) => {
  const isDark = themeService.use((theme) => theme.isDark);
  
  showToast(message, {
    style: {
      backgroundColor: isDark ? '#333' : '#fff',
      color: isDark ? '#fff' : '#333'
    }
  });
};
```

### Router-Agnostic Navigation
```tsx
export const goToPage = (page: string, params?: Record<string, any>) => {
  navigationService.use((navigate) => {
    // This works with any router
    navigate(page, params);
  });
};
```

## 🚨 Error Handling

The library includes comprehensive error handling:

```tsx
// Service not ready
const result = myService.use((hookValue) => {
  return hookValue.someMethod();
});
// Returns null and logs warning if service not ready

// Hook execution errors are caught and logged
// Your app continues to work even if individual hooks fail
```

## 📄 License

MIT © [akhshyganesh](https://github.com/akhshyganesh) 
