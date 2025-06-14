# React Hook Injection Pattern

[![npm version](https://badge.fury.io/js/react-hook-injection-pattern.svg)](https://badge.fury.io/js/react-hook-injection-pattern)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready React library that enables safe usage of React hooks in non-React files through the dependency injection pattern. **Router-agnostic** and works with **any React hooks** - not just navigation hooks.

## 🚀 Features

- ✅ **Production Ready**: Fully tested and optimized for production use
- ✅ **TypeScript Support**: Complete TypeScript definitions and type safety
- ✅ **Universal React Compatibility**: Supports **ALL React versions with hooks** (16.8.0 through 18.x)
- ✅ **Zero Dependencies**: No multiple React instances issues - uses peer dependencies
- ✅ **Hook-Agnostic**: Works with **any React hooks** - navigation, auth, state, custom hooks, etc.
- ✅ **Router-Agnostic**: Works with any React router (react-router, @tanstack/router, reach-router, custom routers)
- ✅ **Error Management**: Comprehensive error handling and fallback mechanisms
- ✅ **Flexible Patterns**: Singleton, factory, and provider patterns
- ✅ **Automatic Injection**: Easy-to-use hooks for automatic dependency injection
- ✅ **Tree Shakeable**: Optimized bundle size with ES modules
- ✅ **Concurrent Mode Ready**: Compatible with React 18 concurrent features

## 📦 Installation

```bash
npm install react-hook-injection-pattern
```

```bash
yarn add react-hook-injection-pattern
```

```bash
pnpm add react-hook-injection-pattern
```

## 🎯 The Problem

React hooks can only be used within React function components or custom hooks. This creates challenges when you need hook functionality in:

- Service files (authentication, API calls, etc.)
- Utility functions
- Business logic modules
- Class-based components
- Non-React code that needs navigation, state, or other hook-provided functionality

## 💡 The Solution

The React Hook Injection Pattern provides a clean way to inject any React hook into non-React files through:

1. **Provider Pattern**: Wrap your app with `HookInjectionProvider` 
2. **Service Pattern**: Create services that can receive hooks
3. **Automatic Injection**: Use `useHookInjection` to automatically inject hooks into services

## 🏁 Quick Start

### 1. Basic Usage - Any Hook

```tsx
import React from 'react';
import { HookInjectionProvider, createHookService, useHookInjection } from 'react-hook-injection-pattern';

// Create a service for any hook
const authService = createHookService();

// Your custom hook
function useAuth() {
  return {
    user: { name: 'John' },
    login: () => {},
    logout: () => {}
  };
}

function App() {
  return (
    <HookInjectionProvider hooks={{ auth: useAuth }}>
      <HomePage />
    </HookInjectionProvider>
  );
}

function HomePage() {
  // Inject the auth hook into the service
  useHookInjection(authService, 'auth');
  
  // Now authService can be used in any file
  return <div>Welcome!</div>;
}
```

### 2. Navigation Example (works with any router)

```tsx
import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
// or import { useRouter } from '@tanstack/router';
// or any other router hook
import { HookInjectionProvider, createHookService, useHookInjection } from 'react-hook-injection-pattern';

const navigationService = createHookService();

function Root() {
  return (
    <BrowserRouter>
      <HookInjectionProvider hooks={{ navigate: useNavigate }}>
        <App />
      </HookInjectionProvider>
    </BrowserRouter>
  );
}

function App() {
  // Inject the navigation hook into the service
  useHookInjection(navigationService, 'navigate');
  
  return <HomePage />;
}
```

### 3. Use the service in any file

```typescript
// services/userService.ts
import { navigationService } from './navigationService';

export function handleLogout() {
  clearUserData();
  
  // Use the injected navigation hook
  navigationService.execute((navigate) => {
    navigate('/login');
  });
}
```

## 🎨 Advanced Examples

### Multiple Hooks

```tsx
import { HookInjectionProvider, createHookService, useHookInjection } from 'react-hook-injection-pattern';

const authService = createHookService();
const themeService = createHookService();
const queryService = createHookService();

function App() {
  return (
    <HookInjectionProvider hooks={{
      auth: useAuth,
      theme: useTheme,
      query: useQuery
    }}>
      <HomePage />
    </HookInjectionProvider>
  );
}

function HomePage() {
  useHookInjection(authService, 'auth');
  useHookInjection(themeService, 'theme');
  useHookInjection(queryService, 'query');
  
  return <div>All services ready!</div>;
}
```

### TanStack Router Example

```tsx
import { useRouter } from '@tanstack/router';
import { HookInjectionProvider, createHookService } from 'react-hook-injection-pattern';

const routerService = createHookService();

function App() {
  return (
    <HookInjectionProvider hooks={{ router: useRouter }}>
      <HomePage />
    </HookInjectionProvider>
  );
}

// Usage in service files
routerService.execute((router) => {
  router.navigate({ to: '/dashboard' });
});
```

## 📚 API Reference

### Core Functions

#### `createHookService<T>(options?)`
Creates a generic service that can store and use any hook.

```typescript
import { createHookService } from 'react-hook-injection-pattern';

const authService = createHookService({
  enableWarnings: true,
  fallbackBehavior: 'warn',
  validator: (hook) => typeof hook === 'object' && 'user' in hook
});
```

#### `HookInjectionProvider`
Provider component that makes hooks available to services.

```tsx
<HookInjectionProvider hooks={{
  auth: useAuth,
  navigate: useNavigate,
  theme: useTheme
}}>
  <App />
</HookInjectionProvider>
```

#### `useHookInjection(service, hookName, options?)`
Hook that automatically injects a hook value into a service.

```typescript
useHookInjection(authService, 'auth', {
  onReady: () => console.log('Auth service ready'),
  onError: (error) => console.error('Injection failed', error)
});
```
import { useHookInjection } from 'react-hook-injection-pattern';
import { navigationService } from './services/navigationService';
import { authenticateUser } from './services/authService';

function LoginPage() {
  // Automatically inject navigation into the service
  useHookInjection(navigationService);

  const handleLogin = async () => {
    try {
      await authenticateUser();
      // This works! Navigation is injected into the service
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

### 4. Use in non-React files

```typescript
// services/authService.ts
import { navigationService } from './navigationService';

export async function authenticateUser() {
  const response = await fetch('/api/auth');
  
  if (response.ok) {
    // Navigate to dashboard after successful login
    navigationService.navigate('/dashboard');
  } else {
    // Navigate to error page
    navigationService.navigateToError('/auth-error');
  }
}

export function logoutUser() {
  // Clear session and navigate to login
  clearSession();
  navigationService.navigateToLogin();
}
```

## 📚 API Reference

### 🔄 React Version Compatibility

This library is designed to work with **ALL React versions that support hooks**:

| React Version | Compatibility | Notes |
|---------------|---------------|-------|
| 16.8.0 - 16.x | ✅ Full Support | Original hooks implementation |
| 17.0.0 - 17.x | ✅ Full Support | Event delegation changes - no impact |
| 18.0.0 - 18.x | ✅ Full Support | Concurrent features supported |
| 19.0.0+ | 🧪 Future Ready | Will be tested when available |

**Supported React Features:**
- `useEffect` (16.8.0+) - Used for hook injection lifecycle
- `useRef` (16.8.0+) - Used for stable references
- `useContext` (16.8.0+) - Used for provider pattern
- `useMemo` (16.8.0+) - Used for performance optimization
- `createContext` (16.3.0+) - Used for dependency injection

**Router Compatibility:**
- React Router v5 (`useHistory`) ✅
- React Router v6 (`useNavigate`) ✅
- Reach Router (`navigate`) ✅
- Custom router implementations ✅
- Next.js Router (`useRouter`) ✅

> 📖 **Detailed Compatibility Guide**: See [REACT_COMPATIBILITY.md](./REACT_COMPATIBILITY.md) for comprehensive version-specific examples and migration guides.

### Components

#### `HookInjectionProvider`

The main provider component that captures and provides hook values to the entire component tree.

```tsx
interface HookInjectionProviderProps {
  children: ReactNode;
  navigationHook?: NavigationHook;
  customHooks?: Record<string, any>;
}

<HookInjectionProvider 
  navigationHook={useNavigate}
  customHooks={{
    auth: useAuth(),
    theme: useTheme(),
  }}
>
  <App />
</HookInjectionProvider>
```

### Hooks

#### `useHookInjection`

Automatically injects hooks from the provider into a service.

```tsx
useHookInjection(service, {
  autoInject: true,
  onReady: () => console.log('Service ready'),
  onError: (error) => console.error('Injection failed', error),
});
```

#### `useNavigationFromContext`

Direct access to the navigation function from context.

```tsx
const navigate = useNavigationFromContext();
navigate('/dashboard');
```

#### `useCustomHook`

Access custom hooks by name from the provider.

```tsx
const auth = useCustomHook<AuthType>('auth');
const theme = useCustomHook<ThemeType>('theme');
```

### Services

#### `createNavigationService`

Creates a new navigation service instance.

```typescript
const navigationService = createNavigationService({
  enableWarnings: true,
  fallbackBehavior: 'warn', // 'warn' | 'error' | 'silent'
  timeout: 5000,
});
```

#### `createSingletonNavigationService`

Creates a singleton navigation service (recommended for most use cases).

```typescript
const navigationService = createSingletonNavigationService(options);
```

#### `NavigationService` Methods

```typescript
interface NavigationServiceInterface {
  navigate(path: string, options?: any): void;
  navigateToLogin(loginPath?: string): void;
  navigateToHome(homePath?: string): void;
  navigateToError(errorPath?: string, state?: any): void;
  replace(path: string, options?: any): void;
  goBack(): void;
  goForward(): void;
  isReady(): boolean;
  waitForReady(): Promise<void>;
  reset(): void;
}
```

## 🔧 Advanced Usage

### React Version Specific Examples

#### React 16.8 - 17.x with React Router v5
```tsx
import { useHistory } from 'react-router-dom';
import { HookInjectionProvider } from 'react-hook-injection-pattern';

function App() {
  const history = useHistory();
  
  return (
    <HookInjectionProvider 
      navigationHook={() => history.push}
    >
      <Routes />
    </HookInjectionProvider>
  );
}
```

#### React 18.x with React Router v6 
```tsx
import { useNavigate } from 'react-router-dom';
import { HookInjectionProvider } from 'react-hook-injection-pattern';

function App() {
  return (
    <HookInjectionProvider 
      navigationHook={useNavigate}
    >
      <Routes />
    </HookInjectionProvider>
  );
}
```

#### Next.js (Any React Version)
```tsx
import { useRouter } from 'next/router';
import { HookInjectionProvider } from 'react-hook-injection-pattern';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <HookInjectionProvider 
      navigationHook={() => router.push}
    >
      <Component {...pageProps} />
    </HookInjectionProvider>
  );
}
```

#### Custom Router Implementation
```tsx
import { HookInjectionProvider } from 'react-hook-injection-pattern';

// Your custom navigation hook
const useCustomNavigation = () => {
  return (path: string, options?: any) => {
    // Your custom navigation logic
    window.location.href = path;
  };
};

function App() {
  return (
    <HookInjectionProvider 
      navigationHook={useCustomNavigation}
    >
      <AppContent />
    </HookInjectionProvider>
  );
}
```

### Custom Hook Injection

```tsx
// 1. Define your custom hooks
const useAppHooks = () => ({
  auth: useAuth(),
  theme: useTheme(),
  user: useUser(),
});

// 2. Provide them in the context
<HookInjectionProvider customHooks={useAppHooks()}>
  <App />
</HookInjectionProvider>

// 3. Access in components
const { auth, theme, user } = useAllInjectedHooks();
```

### Service Factory Pattern

```typescript
import { createHookInjectionService } from 'react-hook-injection-pattern';

// Create a custom service for any hook type
const authService = createHookInjectionService<AuthHook>({
  enableWarnings: true,
  fallbackBehavior: 'error',
  validator: (hook) => typeof hook.login === 'function',
});

// Use it in your business logic
export function performSecureAction() {
  return authService.execute((auth) => {
    if (!auth.isAuthenticated) {
      throw new Error('User not authenticated');
    }
    // Perform action with authenticated user
  });
}
```

### Error Handling

```typescript
import { HookInjectionError } from 'react-hook-injection-pattern';

try {
  navigationService.navigate('/dashboard');
} catch (error) {
  if (error instanceof HookInjectionError) {
    switch (error.code) {
      case 'HOOK_NOT_SET':
        console.log('Navigation not ready yet');
        break;
      case 'PROVIDER_NOT_FOUND':
        console.log('Provider missing from component tree');
        break;
      default:
        console.log('Other hook injection error');
    }
  }
}
```

### Higher-Order Components

```tsx
import { withHookInjection } from 'react-hook-injection-pattern';

const MyComponent = ({ data }) => {
  // Component logic here
  return <div>{data}</div>;
};

// Automatically inject hooks when component mounts
export default withHookInjection(MyComponent, navigationService, {
  onReady: () => console.log('Navigation ready'),
  onError: (error) => console.error('Injection failed', error),
});
```

## 🧪 Testing

The library is designed to be testable. You can easily mock services in your tests:

```javascript
import { createNavigationService } from 'react-hook-injection-pattern';

describe('AuthService', () => {
  let mockNavigationService;

  beforeEach(() => {
    mockNavigationService = createNavigationService();
    mockNavigationService.setNavigate = jest.fn();
  });

  it('should navigate after successful login', async () => {
    // Your test logic here
  });
});
```

## 🔄 Migration Guide

### From v0.x to v1.x

The new version introduces breaking changes for better production readiness:

```typescript
// Old (v0.x)
import { navigationService } from 'react-hook-injection';
navigationService.setNavigate(navigate);

// New (v1.x)
import { HookInjectionProvider, useHookInjection, createSingletonNavigationService } from 'react-hook-injection-pattern';

const navigationService = createSingletonNavigationService();

// In React component
useHookInjection(navigationService);
```

## 🌟 Examples

Check out the `/examples` directory for complete working examples:

- **Basic Navigation**: Simple navigation service usage
- **Authentication Flow**: Complete auth flow with protected routes
- **Multi-Service**: Multiple services with different hooks
- **TypeScript**: Full TypeScript implementation
- **Testing**: Comprehensive testing examples

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/akhshyganesh/react-hook-injection-pattern.git
cd react-hook-injection-pattern
npm install
npm run dev  # Starts the demo
npm run build:lib  # Builds the library
npm test  # Runs tests
```

## 📄 License

MIT © [akhshyganesh](https://github.com/akhshyganesh)

## 🙏 Acknowledgments

- Inspired by dependency injection patterns in Angular and other frameworks
- Built with modern React patterns and best practices
- Thanks to the React community for feedback and contributions

---

**Made with ❤️ for the React community**
- Use dependency injection to provide hook functionality to services
- Services remain framework-agnostic and easier to test
- Singleton pattern ensures the service is available throughout the application