# Core Concepts

Understanding the core concepts of React Use Anywhere will help you build more effective and maintainable applications.

## Architecture Overview

React Use Anywhere uses a **service-oriented pattern** with **dependency injection** to make React hooks available outside of components. The library provides both **basic** and **type-safe** APIs for maximum flexibility.

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Components    │    │    Services     │                │
│  │                 │    │                 │                │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │                │
│  │ │useHookSvc() │ │    │ │service.use()│ │                │
│  │ │             │ │    │ │             │ │                │
│  │ └─────────────┘ │    │ └─────────────┘ │                │
│  └─────────────────┘    └─────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│                   HookProvider                              │
│               (Hook Registry)                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

The library consists of three main components:

1. **HookProvider** - Executes hooks and stores values in React context
2. **Services** - Hold hook values and provide access methods
3. **Connection Hooks** - Connect services to hook values in React components

## 1. HookProvider - The Foundation

The `HookProvider` is the central registry that executes hooks at the top level and makes their values available throughout your application via React context.

### Basic Provider

```tsx
import { HookProvider } from 'react-use-anywhere';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <YourApp />
    </HookProvider>
  );
}
```

### Type-Safe Provider (Recommended)

For better TypeScript support and compile-time validation:

```tsx
import { TypedHookProvider } from 'react-use-anywhere';
import type { NavigateFunction } from 'react-router-dom';

// Define your hook types for better type safety
type AppHooks = {
  navigate: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
};

function App() {
  return (
    <TypedHookProvider<AppHooks>
      hooks={{
        navigate: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <YourApp />
    </TypedHookProvider>
  );
}
```

### How It Works

1. **Hook Execution**: Provider executes all hooks at the top level (following Rules of Hooks)
2. **Value Storage**: Hook return values are stored in React context for global access
3. **Error Handling**: Failed hooks are gracefully handled with warnings and fallback values
4. **Service Connection**: Components connect services to specific hook values using connection hooks
5. **Value Access**: Services access hook values through the `.use()` method pattern

### Provider Features

- **Global Hook Registry**: Tracks all registered hooks for validation and debugging
- **Runtime Validation**: Provides helpful error messages for missing or invalid hooks
- **Type Safety**: TypeScript integration for compile-time hook name validation
- **Nested Providers**: Support for multiple providers in different app sections
- **Hot Reloading**: Works seamlessly with React development tools

### Provider Nesting

You can nest providers for different sections of your app:

```tsx
function App() {
  return (
    <HookProvider hooks={{ navigate: useNavigate }}>
      <Router>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <HookProvider
                hooks={{
                  adminAuth: useAdminAuth,
                  adminTheme: useAdminTheme,
                }}
              >
                <AdminSection />
              </HookProvider>
            }
          />
          <Route path="/*" element={<PublicSection />} />
        </Routes>
      </Router>
    </HookProvider>
  );
}
```

### Context Access Hooks

Access hook context directly in components:

```tsx
import {
  useHookContext,
  useTypedHookContext,
  useAllHooks,
} from 'react-use-anywhere';

function MyComponent() {
  // Basic context access
  const context = useHookContext();
  const navValue = context.navigate;

  // Type-safe context access (recommended)
  const typedContext = useTypedHookContext<AppHooks>();
  const navigate = typedContext.navigate; // Fully typed!

  // Get all hooks at once
  const allHooks = useAllHooks();

  return <div>...</div>;
}
```

## 2. Services - The Core Abstraction

Services are the primary abstraction that hold hook values and provide access to them. They act as a bridge between your React hooks and non-React code.

### Service Types

The library provides multiple service creation methods:

| Method                             | Use Case                         | Type Safety | Recommendation                   |
| ---------------------------------- | -------------------------------- | ----------- | -------------------------------- |
| `createHookService()`              | New instance each time           | Basic       | ❌ Avoid - use singleton instead |
| `createSingletonService()`         | Shared instance (recommended)    | Basic       | ✅ Standard choice               |
| `createTypedSingletonService()`    | Shared + type checking           | High        | ✅ For TypeScript projects       |
| `createStrictSingletonService()`   | Shared + compile-time validation | Highest     | ✅ For strict typing             |
| `createInferredSingletonService()` | Auto-typed from provider         | Automatic   | ✅ For advanced use cases        |

### Basic Service Creation

```typescript
import { createSingletonService } from 'react-use-anywhere';

// Create services for each hook - these are shared across your app
export const authService = createSingletonService<AuthState>('auth');
export const navigationService =
  createSingletonService<NavigateFunction>('navigate');
export const themeService = createSingletonService<ThemeState>('theme');
```

### Type-Safe Service Creation (Recommended)

```typescript
import { createStrictSingletonService } from 'react-use-anywhere';

// Define your hook types first
type AppHooks = {
  auth: () => AuthState;
  navigate: () => NavigateFunction;
  theme: () => ThemeState;
};

// Create services with compile-time validation
export const authService = createStrictSingletonService<AppHooks>('auth');
export const navigationService =
  createStrictSingletonService<AppHooks>('navigate');
export const themeService = createStrictSingletonService<AppHooks>('theme');

// This would cause a TypeScript error:
// const badService = createStrictSingletonService<AppHooks>('invalid'); // ❌ Error!
```

### Service Methods & Interface

Every service implements the `HookService<T>` interface with these methods:

| Method             | Description                      | Returns     | Use Case                    |
| ------------------ | -------------------------------- | ----------- | --------------------------- |
| `get()`            | Get current hook value           | `T \| null` | Direct access (can be null) |
| `isReady()`        | Check if service is connected    | `boolean`   | Conditional logic           |
| `use(callback)`    | Execute callback with hook value | `R \| null` | **Recommended way**         |
| `_setValue(value)` | Internal: Set hook value         | `void`      | Used by connection hooks    |
| `_reset()`         | Internal: Reset service state    | `void`      | Used for testing            |

### Service Usage Patterns

#### 1. The `.use()` Pattern (Recommended)

The primary way to access hook values safely:

```typescript
// Helper functions that use services
export const login = (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    // auth is guaranteed to be the hook value here
    auth.login(credentials.email, credentials.password);
  });
};

export const navigateToHome = () => {
  return navigationService.use((navigate) => {
    navigate('/');
  });
};

// Chain multiple services
export const loginAndRedirect = (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    auth.login(credentials.email, credentials.password);

    // Chain with navigation service
    navigationService.use((navigate) => {
      navigate('/dashboard');
    });
  });
};
```

#### 2. Conditional Service Usage

```typescript
export const conditionalAction = () => {
  // Check if service is ready first
  if (!authService.isReady()) {
    console.warn('Auth service not connected yet');
    return;
  }

  return authService.use((auth) => {
    if (auth.isAuthenticated) {
      // Perform authenticated action
      navigationService.use((navigate) => {
        navigate('/dashboard');
      });
    } else {
      // Redirect to login
      navigationService.use((navigate) => {
        navigate('/login');
      });
    }
  });
};
```

#### 3. Direct Access Pattern (Use with Caution)

```typescript
export const getUser = () => {
  // Direct access - might return null if not connected
  const auth = authService.get();
  return auth?.user || null;
};

// Safer version with readiness check
export const safeGetUser = () => {
  if (!authService.isReady()) {
    return null;
  }
  return authService.get()?.user || null;
};
```

### Advanced Service Patterns

#### 1. Service Classes

For complex state management, create service classes:

```typescript
class NotificationService {
  private notifications: Notification[] = [];

  add(message: string, type: 'success' | 'error' = 'success') {
    // Create notification
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };

    this.notifications.push(notification);

    // Use the notifications hook
    return notificationService.use((notificationHook) => {
      notificationHook.addNotification(notification);
    });
  }

  remove(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);

    return notificationService.use((notificationHook) => {
      notificationHook.removeNotification(id);
    });
  }

  getAll() {
    return this.notifications;
  }
}

// Create the underlying service
const notificationService =
  createSingletonService<NotificationHookValue>('notifications');

// Export the class instance
export const notifications = new NotificationService();
```

#### 2. Service Composition

Combine multiple services for complex operations:

```typescript
export const userProfileService =
  createSingletonService<UserProfileHook>('userProfile');
export const toastService = createSingletonService<ToastHook>('toast');

export const updateUserProfile = (updates: ProfileData) => {
  return userProfileService.use((profile) => {
    // Update profile
    profile.updateProfile(updates);

    // Show success message
    toastService.use((toast) => {
      toast.success('Profile updated successfully!');
    });

    // Navigate away if needed
    navigationService.use((navigate) => {
      navigate('/profile');
    });
  });
};
```

#### 3. Service Utilities

Helper utilities for working with services:

```typescript
import { getSingletonService, resetAllServices } from 'react-use-anywhere';

// Get existing service
export const getAuthService = () => {
  return getSingletonService<AuthState>('auth');
};

// Reset all services (useful for testing)
export const resetServices = () => {
  resetAllServices();
};
```

## 3. Connection Hooks - Bridging React and Services

Connection hooks are React hooks that connect services to hook values from the provider. They make hook values available in services by calling the service's `_setValue()` method.

### Available Connection Hooks

| Hook                     | Type Safety             | Use Case                  |
| ------------------------ | ----------------------- | ------------------------- |
| `useHookService()`       | Basic                   | Standard connection       |
| `useTypedHookService()`  | Type-safe               | Better TypeScript support |
| `useStrictHookService()` | Compile-time validation | Strictest typing          |

### Basic Connection

```tsx
import { useHookService } from 'react-use-anywhere';
import { authService, navigationService } from '../services';

function MyComponent() {
  // Connect services to hooks - this enables services to access hook values
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  // Now services can access hook values anywhere in your code
  const handleLogin = () => {
    login({ email: 'user@example.com', password: 'password' });
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Type-Safe Connection (Recommended)

```tsx
import { useStrictHookService } from 'react-use-anywhere';

function MyComponent() {
  // Type-safe connections with compile-time validation
  useStrictHookService<AppHooks>(authService, 'auth'); // ✅ Valid
  useStrictHookService<AppHooks>(navigationService, 'navigation'); // ✅ Valid
  // useStrictHookService<AppHooks>(authService, 'invalid');  // ❌ TypeScript Error!

  return <div>...</div>;
}
```

### Direct Hook Access

Sometimes you want to use hook values directly in components:

```tsx
import { useHook, useStrictHook, useAllHooks } from 'react-use-anywhere';

function MyComponent() {
  // Direct hook access (basic)
  const navigate = useHook<NavigateFunction>('navigation');
  const auth = useHook<AuthState>('auth');

  // Type-safe direct access
  const typedNavigate = useStrictHook<AppHooks>('navigation');
  const typedAuth = useStrictHook<AppHooks>('auth');

  // Get all hooks at once
  const allHooks = useAllHooks();

  return <div>...</div>;
}
```

### Connection Rules & Best Practices

1. **Connection Requirement**: Services must be connected to access hook values
2. **Component Scope**: Connections are scoped to the component and its children
3. **Multiple Connections**: Same service can be connected in multiple components
4. **Automatic Cleanup**: Connections are cleaned up when components unmount
5. **Performance**: Connection hooks use optimized updates and avoid unnecessary re-renders

### Connection Strategies

#### Strategy 1: Connect in Parent Component

```tsx
// App.tsx - Connect services at the top level
function App() {
  // Connect all services here
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');
  useHookService(themeService, 'theme');

  return (
    <div>
      <HeaderComponent />
      <MainContent />
      <FooterComponent />
    </div>
  );
}

// Child components can use services without connecting
function HeaderComponent() {
  const handleLogout = () => {
    logout(); // Service already connected in App
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

#### Strategy 2: Connect Where Needed

```tsx
// Components connect their own services
function LoginComponent() {
  useHookService(authService, 'auth');
  // ... login logic
}

function NavigationComponent() {
  useHookService(navigationService, 'navigation');
  // ... navigation logic
}
```

#### Strategy 3: Hybrid Approach

```tsx
// Connect common services at the top level
function App() {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <Router>...</Router>;
}

// Connect specialized services in specific components
function AdminPanel() {
  useHookService(adminService, 'admin'); // Only needed in admin section
  // ... admin logic
}
```

## 4. Type Safety & Developer Experience

React Use Anywhere provides multiple levels of type safety to match your project's needs.

### Type Safety Levels

| Level         | APIs                                                                      | Benefits                     | Trade-offs                |
| ------------- | ------------------------------------------------------------------------- | ---------------------------- | ------------------------- |
| **Basic**     | `HookProvider`, `createSingletonService`, `useHookService`                | Simple to use, minimal setup | Runtime validation only   |
| **Type-Safe** | `TypedHookProvider`, `createTypedSingletonService`, `useTypedHookService` | Compile-time checking        | Requires type definitions |
| **Strict**    | `createStrictSingletonService`, `useStrictHookService`                    | Strictest validation         | More verbose setup        |

### Setting Up Type Safety

#### 1. Define Hook Types

```typescript
// types/hooks.ts
import type { NavigateFunction } from 'react-router-dom';

export type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  };
  theme: () => {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  };
  api: () => {
    data: unknown;
    loading: boolean;
    error: string | null;
    fetchData: (url: string) => Promise<void>;
  };
};
```

#### 2. Create Type-Safe Provider

```tsx
// App.tsx
import { TypedHookProvider } from 'react-use-anywhere';
import type { AppHooks } from './types/hooks';

function App() {
  return (
    <TypedHookProvider<AppHooks>
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
        api: useApi,
      }}
    >
      <AppContent />
    </TypedHookProvider>
  );
}
```

#### 3. Create Type-Safe Services

```typescript
// services/index.ts
import { createStrictSingletonService } from 'react-use-anywhere';
import type { AppHooks } from '../types/hooks';

// Services with strict type checking
export const authService = createStrictSingletonService<AppHooks>('auth');
export const navigationService =
  createStrictSingletonService<AppHooks>('navigation');
export const themeService = createStrictSingletonService<AppHooks>('theme');
```

#### 4. Use Type-Safe Connections

```tsx
// components/MyComponent.tsx
import { useStrictHookService } from 'react-use-anywhere';
import type { AppHooks } from '../types/hooks';

function MyComponent() {
  // Type-safe connections
  useStrictHookService<AppHooks>(authService, 'auth');
  useStrictHookService<AppHooks>(navigationService, 'navigation');

  return <div>...</div>;
}
```

### Error Handling & Validation

The library provides comprehensive error handling and validation:

#### Runtime Hook Validation

```typescript
// Automatic validation with helpful suggestions
const badService = createSingletonService('nonexistent');
// Console Error: 🚨 Hook "nonexistent" is not registered in HookProvider.
// Available hooks: "auth", "navigation", "theme"
// Did you mean one of these?
//   • "navigation"
//   • "auth"
```

#### Service Connection Validation

```tsx
function MyComponent() {
  useHookService(authService, 'wrongname');
  // Console Error: 🚨 useHookService: Hook "wrongname" is not registered in HookProvider.
  // Available hooks: "auth", "navigation", "theme"
  // Did you mean one of these?
  //   • "auth"
}
```

#### Type-Safe Compile-Time Validation

```typescript
// TypeScript will catch these errors at compile time
const badService = createStrictSingletonService<AppHooks>('invalid');
//                                                        ^^^^^^^^^
// Error: Argument of type '"invalid"' is not assignable to parameter of type 'keyof AppHooks'
```

## 5. Complete Example - Putting It All Together

Here's a comprehensive example showing how all pieces work together:

### 1. Type Definitions

```typescript
// types/hooks.ts
import type { NavigateFunction } from 'react-router-dom';

export type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  };
  theme: () => {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  };
};

export interface User {
  id: string;
  name: string;
  email: string;
}
```

### 2. Service Layer

```typescript
// services/index.ts
import { createStrictSingletonService } from 'react-use-anywhere';
import type { AppHooks } from '../types/hooks';

// Create type-safe singleton services
export const authService = createStrictSingletonService<AppHooks>('auth');
export const navigationService =
  createStrictSingletonService<AppHooks>('navigation');
export const themeService = createStrictSingletonService<AppHooks>('theme');

// Helper functions using services
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  return authService.use(async (auth) => {
    await auth.login(credentials.email, credentials.password);

    // Chain navigation after successful login
    navigationService.use((navigate) => {
      navigate('/dashboard');
    });
  });
};

export const logout = () => {
  return authService.use((auth) => {
    auth.logout();

    navigationService.use((navigate) => {
      navigate('/');
    });
  });
};

export const getCurrentUser = () => {
  return authService.use((auth) => auth.user);
};

export const isAuthenticated = () => {
  return authService.use((auth) => auth.isAuthenticated) || false;
};

export const toggleTheme = () => {
  return themeService.use((theme) => {
    theme.toggleTheme();
  });
};
```

### 3. App Setup

```tsx
// App.tsx
import { TypedHookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';
import type { AppHooks } from './types/hooks';
import { useAuth, useTheme } from './hooks';
import { MainApp } from './components/MainApp';

function App() {
  return (
    <TypedHookProvider<AppHooks>
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <MainApp />
    </TypedHookProvider>
  );
}
```

### 4. Components with Service Connections

```tsx
// components/MainApp.tsx
import { useStrictHookService } from 'react-use-anywhere';
import type { AppHooks } from '../types/hooks';
import { authService, navigationService, themeService } from '../services';
import { LoginComponent } from './LoginComponent';
import { DashboardComponent } from './DashboardComponent';

export function MainApp() {
  // Connect all services at the top level
  useStrictHookService<AppHooks>(authService, 'auth');
  useStrictHookService<AppHooks>(navigationService, 'navigation');
  useStrictHookService<AppHooks>(themeService, 'theme');

  // Check authentication status
  const isAuth = isAuthenticated();

  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
      <main>{isAuth ? <DashboardComponent /> : <LoginComponent />}</main>
    </div>
  );
}
```

### 5. Using Services in Components

```tsx
// components/LoginComponent.tsx
import { useState } from 'react';
import { login } from '../services';

export function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

// components/DashboardComponent.tsx
import { getCurrentUser, logout } from '../services';

export function DashboardComponent() {
  const user = getCurrentUser();

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// components/ThemeToggle.tsx
import { toggleTheme } from '../services';

export function ThemeToggle() {
  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

### 6. Using Services in Non-React Code

```typescript
// utils/api.ts
import { authService, navigationService } from '../services';

export class ApiClient {
  async request(url: string, options: RequestInit = {}) {
    // Get auth token from service
    const token = authService.use((auth) =>
      auth.isAuthenticated ? auth.user?.token : null
    );

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    // Handle auth errors
    if (response.status === 401) {
      // Logout and redirect
      authService.use((auth) => auth.logout());
      navigationService.use((navigate) => navigate('/login'));
      throw new Error('Unauthorized');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
```

## 6. Service Lifecycle & Management

Understanding the service lifecycle is crucial for effective usage.

### Service States

Services go through different states during their lifecycle:

1. **Created**: Service is created but not connected to any hook
2. **Connected**: Service is connected to a hook via `useHookService`
3. **Ready**: Service has received hook value and is ready to use
4. **Updated**: Service receives new hook values when hooks re-render
5. **Disconnected**: All components using the service have unmounted

### Lifecycle Methods

```typescript
export const debugService = () => {
  console.log('Service ready:', authService.isReady());
  console.log('Service value:', authService.get());

  authService.use((auth) => {
    console.log('Service used with value:', auth);
  });
};
```

### Service Management Utilities

```typescript
import {
  getSingletonService,
  resetAllServices,
  getHookRegistry,
  isHookRegistered,
  getRegisteredHookNames,
} from 'react-use-anywhere';

// Get existing singleton service
const existingService = getSingletonService<AuthState>('auth');

// Check if hook is registered
if (isHookRegistered('auth')) {
  console.log('Auth hook is registered');
}

// Get all registered hook names
const hookNames = getRegisteredHookNames();
console.log('Available hooks:', hookNames);

// Reset all services (useful for testing)
resetAllServices();
```

### Performance Considerations

#### Optimized Updates

Services use optimized update mechanisms to prevent unnecessary re-renders:

```typescript
// Services only update when hook values actually change
// Deep comparison is used for objects to prevent false updates
useHookService(authService, 'auth'); // Only updates when auth state changes
```

#### Memory Management

- **Singleton Services**: Shared instances reduce memory usage
- **Automatic Cleanup**: Connections are cleaned up when components unmount
- **Lazy Initialization**: Services are only created when first accessed

#### Best Practices for Performance

```typescript
// ✅ Good: Use singleton services
export const authService = createSingletonService<AuthState>('auth');

// ❌ Avoid: Creating new service instances
function MyComponent() {
  const service = createHookService(); // Creates new instance each render
  return <div>...</div>;
}

// ✅ Good: Connect services at appropriate level
function App() {
  // Connect commonly used services at the top level
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <AppContent />;
}

// ✅ Good: Connect specialized services where needed
function AdminPanel() {
  // Only connect admin service in admin components
  useHookService(adminService, 'admin');
  return <div>...</div>;
}
```

## 7. Error Handling & Debugging

The library provides comprehensive error handling and debugging capabilities.

### Automatic Error Handling

#### Hook Execution Errors

```tsx
// Provider handles hook execution errors gracefully
<HookProvider
  hooks={{
    auth: useAuth,
    navigation: useNavigate,
    problematic: useBrokenHook, // This hook might throw an error
  }}
>
  <App />
</HookProvider>

// Console Output:
// ⚠️ Failed to execute hook "problematic": Error message
// Hook value will be undefined, services will handle gracefully
```

#### Service Connection Errors

```typescript
// Service methods handle connection errors
export const safeLogin = (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    if (!auth) {
      console.warn('Auth service not available');
      return null;
    }

    return auth.login(credentials.email, credentials.password);
  });
};
```

### Validation & Helpful Messages

#### Hook Name Validation

```typescript
// Automatic validation with suggestions
const badService = createSingletonService('auht'); // Typo in 'auth'

// Console Output:
// 🚨 Hook "auht" is not registered in HookProvider.
// Available hooks: "auth", "navigation", "theme"
// Did you mean one of these?
//   • "auth"
```

#### Provider Setup Validation

```typescript
// Warns if no hooks are registered
const service = createSingletonService('auth');

// Console Output:
// 🚨 No hooks registered yet. Make sure to wrap your app with HookProvider first.
// Example: <HookProvider hooks={{ auth: yourAuthHook }}>
```

### Debugging Utilities

#### Service Debugging

```typescript
// Debug service state
export const debugAuthService = () => {
  console.log('Auth Service Debug:', {
    isReady: authService.isReady(),
    currentValue: authService.get(),
    hookRegistered: isHookRegistered('auth'),
  });
};

// Check all registered hooks
export const debugHooks = () => {
  const hookNames = getRegisteredHookNames();
  console.log('Registered hooks:', hookNames);

  const registry = getHookRegistry();
  console.log('Hook registry:', registry);
};
```

#### Component Debugging

```tsx
// Debug component connections
function DebugComponent() {
  // Check if services are connected
  useHookService(authService, 'auth');

  useEffect(() => {
    console.log('Component mounted, services:', {
      authReady: authService.isReady(),
      authValue: authService.get(),
    });
  }, []);

  return <div>...</div>;
}
```

### Error Recovery Patterns

#### Graceful Degradation

```typescript
export const safeNavigate = (path: string) => {
  return navigationService.use((navigate) => {
    if (navigate) {
      navigate(path);
    } else {
      // Fallback to window.location
      console.warn('Navigation service not available, using fallback');
      window.location.href = path;
    }
  });
};
```

#### Retry Logic

```typescript
export const retryableAction = async (action: () => Promise<void>) => {
  let retries = 3;

  while (retries > 0) {
    try {
      await action();
      break;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Action failed after retries:', error);
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
```

#### Service Availability Checks

```typescript
export const withServiceCheck = <T>(
  service: HookService<T>,
  action: (value: T) => void,
  fallback?: () => void
) => {
  if (!service.isReady()) {
    console.warn('Service not ready');
    fallback?.();
    return;
  }

  service.use(action);
};

// Usage
withServiceCheck(
  authService,
  (auth) => auth.login(email, password),
  () => console.log('Auth service not available')
);
```

## 8. Best Practices & Patterns

### Service Organization

#### ✅ Recommended Patterns

```typescript
// Good: One service per hook, clear separation
export const authService = createSingletonService<AuthState>('auth');
export const navigationService =
  createSingletonService<NavigateFunction>('navigation');
export const themeService = createSingletonService<ThemeState>('theme');

// Good: Use type-safe versions for better DX
export const authService = createStrictSingletonService<AppHooks>('auth');
export const navigationService =
  createStrictSingletonService<AppHooks>('navigation');

// Good: Create helper functions for common operations
export const getCurrentUser = () => {
  return authService.use((auth) => auth.user);
};

export const isAuthenticated = () => {
  return authService.use((auth) => auth.isAuthenticated);
};

// Good: Chain services for complex operations
export const loginAndRedirect = (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    auth.login(credentials.email, credentials.password);

    navigationService.use((navigate) => {
      navigate('/dashboard');
    });
  });
};
```

#### ❌ Anti-Patterns to Avoid

```typescript
// Avoid: Creating service instances in components
function MyComponent() {
  const service = createHookService(); // ❌ Creates new instance each render
  return <div>...</div>;
}

// Avoid: Not using singleton services
export const authService1 = createHookService(); // ❌ Not shared
export const authService2 = createHookService(); // ❌ Different instance

// Avoid: Accessing services before connection
const user = authService.get(); // ❌ Might be null if not connected

// Avoid: Not handling service readiness
export const dangerousAction = () => {
  authService.use((auth) => {
    auth.login(); // ❌ What if auth is null?
  });
};
```

### Connection Management

#### ✅ Connection Best Practices

```tsx
// Good: Connect services in components that use them
function LoginComponent() {
  useHookService(authService, 'auth');
  // ... use auth functionality
}

// Good: Connect shared services in parent components
function App() {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <Routes>...</Routes>; // Child components can use services
}

// Good: Use type-safe connections
function TypeSafeComponent() {
  useStrictHookService<AppHooks>(authService, 'auth');
  useStrictHookService<AppHooks>(navigationService, 'navigation');

  return <div>...</div>;
}
```

### Service Design Patterns

#### 1. Simple Service Functions

```typescript
// For simple operations
export const login = (email: string, password: string) => {
  return authService.use((auth) => auth.login(email, password));
};

export const logout = () => {
  return authService.use((auth) => auth.logout());
};

export const navigateToProfile = (userId: string) => {
  return navigationService.use((navigate) => navigate(`/profile/${userId}`));
};
```

#### 2. Service Facade Pattern

```typescript
// Group related functionality
export class AuthFacade {
  static login(credentials: LoginCredentials) {
    return authService.use((auth) =>
      auth.login(credentials.email, credentials.password)
    );
  }

  static logout() {
    return authService.use((auth) => auth.logout());
  }

  static getCurrentUser() {
    return authService.use((auth) => auth.user);
  }

  static isAuthenticated() {
    return authService.use((auth) => auth.isAuthenticated);
  }
}
```

#### 3. Service Composition Pattern

```typescript
// Combine multiple services for complex operations
export class UserService {
  static async updateProfile(updates: ProfileData) {
    // Update profile
    await userProfileService.use(async (profile) => {
      await profile.updateProfile(updates);
    });

    // Show notification
    notificationService.use((notifications) => {
      notifications.success('Profile updated successfully!');
    });

    // Navigate to profile page
    navigationService.use((navigate) => {
      navigate('/profile');
    });
  }

  static async deleteAccount() {
    const confirmed = window.confirm('Are you sure?');
    if (!confirmed) return;

    await userProfileService.use(async (profile) => {
      await profile.deleteAccount();
    });

    // Logout and redirect
    AuthFacade.logout();
    navigationService.use((navigate) => {
      navigate('/');
    });
  }
}
```

### Testing Best Practices

#### Service Testing

```typescript
import { authService } from '../services/auth';
import { resetAllServices } from 'react-use-anywhere';

describe('Auth Service', () => {
  beforeEach(() => {
    resetAllServices(); // Reset all services before each test
  });

  test('should return user when authenticated', () => {
    // Mock the service value
    const mockAuth = {
      user: { name: 'John' },
      isAuthenticated: true,
    };
    authService._setValue(mockAuth);

    const user = authService.use((auth) => auth.user);
    expect(user.name).toBe('John');
  });

  test('should handle service not ready', () => {
    expect(authService.isReady()).toBe(false);

    const result = authService.use((auth) => auth.user);
    expect(result).toBeNull(); // Service returns null when not ready
  });
});
```

#### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { HookProvider } from 'react-use-anywhere';
import { MyComponent } from './MyComponent';

// Mock hooks for testing
const mockUseAuth = () => ({
  user: { name: 'Test User' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
});

const mockUseNavigate = () => jest.fn();

test('component with services', () => {
  render(
    <HookProvider
      hooks={{
        auth: mockUseAuth,
        navigation: mockUseNavigate,
      }}
    >
      <MyComponent />
    </HookProvider>
  );

  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

### Performance Optimization

#### Lazy Service Creation

```typescript
// Create services only when needed
let _authService: HookService<AuthState> | null = null;

export const getAuthService = () => {
  if (!_authService) {
    _authService = createSingletonService<AuthState>('auth');
  }
  return _authService;
};
```

#### Selective Connections

```tsx
// Connect services only where needed
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
      </Routes>
    </Router>
  );
}

function AuthRoutes() {
  // Only connect auth service in auth routes
  useHookService(authService, 'auth');
  return <Routes>...</Routes>;
}

function DashboardRoutes() {
  // Connect all dashboard services
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');
  useHookService(themeService, 'theme');
  return <Routes>...</Routes>;
}
```

## 9. Advanced Patterns & Use Cases

### Service Composition & Orchestration

#### Complex Workflow Management

```typescript
export class CheckoutService {
  static async processCheckout(orderData: OrderData) {
    // Step 1: Validate user authentication
    const isValid = await authService.use(async (auth) => {
      if (!auth.isAuthenticated) {
        navigationService.use((navigate) => navigate('/login'));
        return false;
      }
      return true;
    });

    if (!isValid) return;

    // Step 2: Process payment
    const paymentResult = await paymentService.use(async (payment) => {
      return await payment.processPayment(orderData.payment);
    });

    if (!paymentResult.success) {
      notificationService.use((notifications) => {
        notifications.error('Payment failed: ' + paymentResult.error);
      });
      return;
    }

    // Step 3: Create order
    await orderService.use(async (order) => {
      await order.createOrder(orderData);
    });

    // Step 4: Show success and redirect
    notificationService.use((notifications) => {
      notifications.success('Order placed successfully!');
    });

    navigationService.use((navigate) => {
      navigate('/orders/' + paymentResult.orderId);
    });
  }
}
```

#### Event-Driven Service Communication

```typescript
// Event system for services
class ServiceEventBus {
  private listeners = new Map<string, Function[]>();

  emit(event: string, data: unknown) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach((handler) => handler(data));
  }

  on(event: string, handler: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler: Function) {
    const handlers = this.listeners.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}

export const serviceEvents = new ServiceEventBus();

// Services can listen to events
serviceEvents.on('user.login', (user) => {
  analyticsService.use((analytics) => {
    analytics.track('user_logged_in', { userId: user.id });
  });
});

serviceEvents.on('user.logout', () => {
  // Clear cached data
  resetAllServices();
});
```

### Conditional Service Loading

```typescript
// Lazy load services based on user role
export class PermissionService {
  static loadUserServices(userRole: string) {
    const baseServices = ['auth', 'navigation', 'theme'];
    const roleServices: Record<string, string[]> = {
      admin: ['admin', 'analytics', 'userManagement'],
      moderator: ['moderation', 'reporting'],
      user: ['profile', 'notifications'],
    };

    const services = [...baseServices, ...(roleServices[userRole] || [])];

    return services.map((serviceName) => {
      return (
        getSingletonService(serviceName) || createSingletonService(serviceName)
      );
    });
  }
}
```

### Service Middleware Pattern

```typescript
// Middleware for service calls
type ServiceMiddleware<T> = (next: (value: T) => unknown, value: T) => unknown;

class EnhancedService<T> {
  private middlewares: ServiceMiddleware<T>[] = [];

  constructor(private baseService: HookService<T>) {}

  use(callback: (value: T) => unknown) {
    return this.baseService.use((value) => {
      // Apply middlewares
      const chain = this.middlewares.reduce(
        (next, middleware) => (val) => middleware(next, val),
        callback
      );

      return chain(value);
    });
  }

  addMiddleware(middleware: ServiceMiddleware<T>) {
    this.middlewares.push(middleware);
    return this;
  }
}

// Usage
const loggingMiddleware: ServiceMiddleware<AuthState> = (next, auth) => {
  console.log('Auth service called with:', auth);
  const result = next(auth);
  console.log('Auth service result:', result);
  return result;
};

const enhancedAuthService = new EnhancedService(authService).addMiddleware(
  loggingMiddleware
);
```

### Service Mocking for Testing

```typescript
// Advanced service mocking
export class ServiceMocker {
  private originalServices = new Map<string, HookService<unknown>>();

  mock<T>(serviceName: string, mockValue: T): HookService<T> {
    const originalService = getSingletonService<T>(serviceName);
    if (originalService) {
      this.originalServices.set(serviceName, originalService);
    }

    const mockService = createHookService<T>();
    mockService._setValue(mockValue);

    // Replace singleton
    (singletonServices as any).set(serviceName, mockService);

    return mockService;
  }

  restore(serviceName?: string) {
    if (serviceName) {
      const original = this.originalServices.get(serviceName);
      if (original) {
        (singletonServices as any).set(serviceName, original);
        this.originalServices.delete(serviceName);
      }
    } else {
      // Restore all
      this.originalServices.forEach((service, name) => {
        (singletonServices as any).set(name, service);
      });
      this.originalServices.clear();
    }
  }
}

// Usage in tests
const mocker = new ServiceMocker();

beforeEach(() => {
  mocker.mock('auth', {
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
  });
});

afterEach(() => {
  mocker.restore();
});
```

## 10. Key Takeaways & Summary

### Core Concepts Summary

| Concept              | Purpose                                 | Key Features                                            |
| -------------------- | --------------------------------------- | ------------------------------------------------------- |
| **HookProvider**     | Executes hooks and provides context     | Hook execution, value storage, error handling           |
| **Services**         | Bridge between React and non-React code | `.use()` method, singleton pattern, type safety         |
| **Connection Hooks** | Connect services to hook values         | `useHookService`, type-safe variants, automatic cleanup |
| **Type Safety**      | Compile-time validation                 | Strict typing, helpful errors, IntelliSense             |

### Essential Patterns

✅ **Use these patterns for success:**

1. **Singleton Services** - Use `createSingletonService()` for shared state
2. **Type-Safe APIs** - Use `createStrictSingletonService()` and `useStrictHookService()`
3. **Service `.use()` Pattern** - Always use `.use()` method for accessing hook values
4. **Connection Strategy** - Connect services in parent components or where needed
5. **Helper Functions** - Create service-based utility functions
6. **Error Handling** - Check service readiness and handle errors gracefully

### Migration Guide

#### From Direct Hook Usage

```typescript
// Before: Direct hook usage
function MyComponent() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = () => {
    auth.login(email, password);
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
}

// After: Service-based approach
// 1. Create services
export const authService = createSingletonService<AuthState>('auth');
export const navigationService = createSingletonService<NavigateFunction>('navigation');

// 2. Create helper functions
export const login = (email: string, password: string) => {
  return authService.use((auth) => {
    auth.login(email, password);
    navigationService.use((navigate) => navigate('/dashboard'));
  });
};

// 3. Connect services in components
function MyComponent() {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  const handleLogin = () => login(email, password);

  return <button onClick={handleLogin}>Login</button>;
}
```

### Quick Reference

#### Essential Imports

```typescript
// Core functionality
import {
  HookProvider,
  TypedHookProvider,
  createSingletonService,
  createStrictSingletonService,
  useHookService,
  useStrictHookService,
} from 'react-use-anywhere';
```

#### Basic Setup Template

```typescript
// 1. Define types
type AppHooks = {
  auth: () => AuthState;
  navigation: () => NavigateFunction;
};

// 2. Create services
export const authService = createStrictSingletonService<AppHooks>('auth');
export const navigationService = createStrictSingletonService<AppHooks>('navigation');

// 3. Setup provider
function App() {
  return (
    <TypedHookProvider<AppHooks>
      hooks={{
        auth: useAuth,
        navigation: useNavigate,
      }}
    >
      <AppContent />
    </TypedHookProvider>
  );
}

// 4. Connect services
function AppContent() {
  useStrictHookService<AppHooks>(authService, 'auth');
  useStrictHookService<AppHooks>(navigationService, 'navigation');

  return <div>...</div>;
}
```

### Next Steps

1. **Start Simple** - Begin with basic `HookProvider` and `createSingletonService`
2. **Add Type Safety** - Migrate to `TypedHookProvider` and `createStrictSingletonService`
3. **Create Service Layer** - Build helper functions that use services
4. **Optimize Connections** - Use appropriate connection strategies
5. **Add Error Handling** - Implement robust error handling patterns
6. **Test Services** - Write tests for your service layer

### Common Gotchas

❌ **Avoid these common mistakes:**

1. **Forgetting to connect services** - Services must be connected with `useHookService`
2. **Using `createHookService` instead of `createSingletonService`** - Prefer singletons
3. **Accessing services before connection** - Always check `isReady()` or use `.use()`
4. **Not handling service errors** - Always handle potential null values
5. **Creating services in components** - Create services at module level
6. **Not using type-safe variants** - Use strict typing for better DX

### Performance Tips

- Use singleton services for shared state
- Connect services at appropriate component levels
- Leverage type-safe APIs for better IDE support
- Use service composition for complex operations
- Implement proper error boundaries

### Resources

- **GitHub Repository**: [react-use-anywhere](https://github.com/your-repo/react-use-anywhere)
- **API Documentation**: [API Reference](../api/overview.md)
- **Examples**: [Usage Examples](../examples/basic-usage.md)
- **Best Practices**: [Best Practices Guide](./best-practices.md)

---

**Ready to get started?** Check out the [Quick Start Guide](./quick-start.md) for a hands-on introduction to React Use Anywhere!
