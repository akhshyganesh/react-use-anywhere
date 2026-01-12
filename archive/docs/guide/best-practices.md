# Best Practices

Production-ready patterns and recommendations for using React Use Anywhere effectively.

## Core Concepts

### Understanding the Library Architecture

React Use Anywhere consists of three main components:

1. **HookProvider** - Provides hooks to your service layer
2. **useHookService** - Accesses hooks within services
3. **Service Layer** - Business logic that can access React hooks

The key insight is that services can use React hooks through the provider system, enabling complex business logic outside of components while maintaining access to React's ecosystem.

## Service Design Principles

### 1. Single Responsibility Principle

Each service should have one clear, well-defined responsibility:

```typescript
// ✅ Good - Single responsibility
export const userService = {
  async createUser(userData: CreateUserData) {
    /* ... */
  },
  async updateUser(userId: string, updates: UpdateUserData) {
    /* ... */
  },
  async deleteUser(userId: string) {
    /* ... */
  },
  async getUserById(userId: string) {
    /* ... */
  },
};

export const emailService = {
  async sendWelcomeEmail(user: User) {
    /* ... */
  },
  async sendPasswordResetEmail(email: string) {
    /* ... */
  },
  async sendNotificationEmail(notification: Notification) {
    /* ... */
  },
};

// ❌ Bad - Mixed responsibilities
export const userService = {
  async createUser(userData: CreateUserData) {
    /* ... */
  },
  async sendWelcomeEmail(user: User) {
    /* ... */
  }, // Email responsibility
  async trackUserCreation(user: User) {
    /* ... */
  }, // Analytics responsibility
  async validateUserData(userData: CreateUserData) {
    /* ... */
  }, // Validation responsibility
};
```

### 2. Dependency Injection Through Hooks

Always access external dependencies through the hook provider system. This is the core principle of React Use Anywhere:

```typescript
// ✅ Good - Use hooks through the provider system
export const authService = {
  async login(credentials: LoginCredentials) {
    const navigate = useHookService('navigate'); // Access hook via provider
    const { user, setUser } = useHookService('userState'); // State management hook
    const { addToast } = useHookService('notifications'); // UI feedback hook

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Login failed');

      const userData = await response.json();
      setUser(userData);
      addToast({ type: 'success', message: 'Login successful!' });
      navigate('/dashboard');

      return userData;
    } catch (error) {
      addToast({ type: 'error', message: 'Login failed. Please try again.' });
      throw error;
    }
  },
};

// ❌ Bad - Direct imports bypass the hook provider system
import { navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const authService = {
  async login(credentials: LoginCredentials) {
    // This bypasses React Use Anywhere's provider system
    // Makes testing difficult and breaks the library's architecture
    const userData = await loginApi(credentials);
    navigate('/dashboard');
    toast.success('Login successful!');
  },
};
```

### 3. Error Handling Consistency

Implement consistent error handling patterns across all services:

```typescript
// Base error handling utility
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public context?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// Consistent error handling pattern
export const baseService = {
  async handleServiceCall<T>(
    operation: () => Promise<T>,
    errorContext: string
  ): Promise<T> {
    const { addNotification } = useHookService('notifications');

    try {
      return await operation();
    } catch (error) {
      console.error(`${errorContext}:`, error);

      if (error instanceof ServiceError) {
        addNotification({
          type: 'error',
          message: error.message,
        });
      } else {
        addNotification({
          type: 'error',
          message: 'An unexpected error occurred',
        });
      }

      throw error;
    }
  },
};

// Usage in services
export const userService = {
  async createUser(userData: CreateUserData) {
    return baseService.handleServiceCall(async () => {
      const response = await apiService.post('/users', userData);
      const navigate = useHookService('navigation');
      navigate(`/users/${response.id}`);
      return response;
    }, 'Create User');
  },
};
```

## Hook Provider Patterns

### 1. Basic Hook Provider Setup

Set up your HookProvider at the application root with all necessary hooks:

```typescript
// App.tsx - Basic setup
import { HookProvider } from 'react-use-anywhere';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  return (
    <HookProvider
      hooks={{
        navigate: useNavigate,
        location: useLocation,
        // Add other hooks your services need
      }}
    >
      <Router>
        <Routes>
          // Your routes
        </Routes>
      </Router>
    </HookProvider>
  );
}
```

### 2. Typed Hook Provider

For better type safety, use TypeScript with your hook provider:

```typescript
// types/hooks.ts
export interface AppHooks {
  navigate: ReturnType<typeof useNavigate>;
  location: ReturnType<typeof useLocation>;
  auth: ReturnType<typeof useAuth>;
  notifications: ReturnType<typeof useNotifications>;
}

// App.tsx - Typed setup
import { HookProvider } from 'react-use-anywhere';

function App() {
  return (
    <HookProvider<AppHooks>
      hooks={{
        navigate: useNavigate,
        location: useLocation,
        auth: useAuth,
        notifications: useNotifications,
      }}
    >
      <YourApp />
    </HookProvider>
  );
}

// In services - Type-safe access
export const authService = {
  async login(credentials: LoginCredentials) {
    const navigate = useHookService<AppHooks>('navigate');
    const auth = useHookService<AppHooks>('auth');
    // TypeScript will provide full type safety
  },
};
```

### 3. Hook Provider Nesting and Context Management

Use nested providers for different application areas and understand hook resolution:

```typescript
// Global hooks for entire app
function App() {
  return (
    <HookProvider hooks={{
      navigate: useNavigate,
      theme: useTheme,
      notifications: useNotifications
    }}>
      <Router>
        <Routes>
          <Route path="/admin/*" element={
            <HookProvider hooks={{
              adminAuth: useAdminAuth,
              adminConfig: useAdminConfig,
              // Inner provider can override outer hooks
              notifications: useAdminNotifications
            }}>
              <AdminArea />
            </HookProvider>
          } />
          <Route path="/*" element={<PublicArea />} />
        </Routes>
      </Router>
    </HookProvider>
  );
}

// In AdminArea, services will use the admin-specific hooks
export const adminService = {
  async performAdminAction() {
    // This will use useAdminNotifications, not the global notifications
    const { addNotification } = useHookService('notifications');
    // This will use useAdminAuth
    const auth = useHookService('adminAuth');

    // Implementation...
  }
};
```

### 4. Hook Function vs Hook Values

Understand when to provide hook functions vs hook values:

```typescript
function App() {
  // ✅ Good - Provide hook functions for React hooks
  const hooks = {
    navigate: useNavigate,        // Function that returns navigate
    location: useLocation,        // Function that returns location
    theme: useTheme,             // Function that returns theme state
  };

  // ❌ Bad - Don't call hooks at provider level
  const badHooks = {
    navigate: useNavigate(),     // Called too early, breaks Rules of Hooks
    location: useLocation(),     // Called too early
    theme: useTheme(),          // Called too early
  };

  return <HookProvider hooks={hooks}>...</HookProvider>;
}

// For custom hooks that need parameters:
function App() {
  const hooks = {
    // ✅ Good - Wrap parameterized hooks
    api: () => useApi({ baseURL: process.env.REACT_APP_API_URL }),
    auth: () => useAuth({ redirectTo: '/login' }),

    // ✅ Good - For hooks that return functions
    fetchUser: () => {
      const api = useApi();
      return (id: string) => api.get(`/users/${id}`);
    }
  };

  return <HookProvider hooks={hooks}>...</HookProvider>;
}
```

## Service Organization

### 1. Directory Structure

Organize services by domain and responsibility:

```
src/
├── services/
│   ├── auth/
│   │   ├── authService.ts
│   │   ├── sessionService.ts
│   │   └── permissionService.ts
│   ├── user/
│   │   ├── userService.ts
│   │   ├── profileService.ts
│   │   └── preferencesService.ts
│   ├── api/
│   │   ├── apiService.ts
│   │   ├── cacheService.ts
│   │   └── retryService.ts
│   ├── navigation/
│   │   ├── navigationService.ts
│   │   ├── routeGuardService.ts
│   │   └── breadcrumbService.ts
│   ├── ui/
│   │   ├── themeService.ts
│   │   ├── modalService.ts
│   │   └── notificationService.ts
│   └── workflows/
│       ├── onboardingService.ts
│       ├── checkoutService.ts
│       └── reportingService.ts
```

### 2. Service Exports

Create clean, typed exports for your services:

```typescript
// services/index.ts
export { authService } from './auth/authService';
export { userService } from './user/userService';
export { apiService } from './api/apiService';
export { navigationService } from './navigation/navigationService';
export { themeService } from './ui/themeService';

// Export types
export type { User, AuthState } from './auth/types';
export type { ApiResponse, ApiError } from './api/types';
```

### 3. Service Interfaces

Define clear interfaces for services:

```typescript
// services/interfaces.ts
export interface UserService {
  createUser(data: CreateUserData): Promise<User>;
  updateUser(id: string, data: UpdateUserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getUserById(id: string): Promise<User>;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  checkAuthStatus(): Promise<User | null>;
}

// Implementation
export const userService: UserService = {
  async createUser(data: CreateUserData) {
    // Implementation...
  },

  async updateUser(id: string, data: UpdateUserData) {
    // Implementation...
  },

  // ... other methods
};
```

## Advanced Patterns

### 1. Service Composition

Compose services to build complex workflows:

```typescript
// Base service for common operations
export const baseService = {
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    const { addNotification } = useHookService('notifications');

    try {
      return await operation();
    } catch (error) {
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    }
  },

  async withLoading<T>(operation: () => Promise<T>): Promise<T> {
    const { showLoading, hideLoading } = useHookService('loading');

    showLoading();
    try {
      return await operation();
    } finally {
      hideLoading();
    }
  },
};

// Composed service using base functionality
export const userService = {
  async createUser(userData: CreateUserData) {
    return baseService.withErrorHandling(
      () =>
        baseService.withLoading(async () => {
          const { addNotification } = useHookService('notifications');
          const navigate = useHookService('navigate');

          const user = await apiService.post('/users', userData);
          addNotification({
            type: 'success',
            message: 'User created successfully',
          });
          navigate(`/users/${user.id}`);
          return user;
        }),
      'Failed to create user'
    );
  },
};
```

### 2. Service Middleware Pattern

Implement middleware for cross-cutting concerns:

```typescript
// Service middleware
export const serviceMiddleware = {
  withAuth<T extends any[], R>(
    serviceMethod: (...args: T) => Promise<R>,
    requiredRole?: string
  ) {
    return async (...args: T): Promise<R> => {
      const { user, isAuthenticated } = useHookService('auth');
      const navigate = useHookService('navigate');

      if (!isAuthenticated) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      if (requiredRole && !user?.roles?.includes(requiredRole)) {
        throw new Error('Insufficient permissions');
      }

      return serviceMethod(...args);
    };
  },

  withAnalytics<T extends any[], R>(
    serviceMethod: (...args: T) => Promise<R>,
    eventName: string
  ) {
    return async (...args: T): Promise<R> => {
      const analytics = useHookService('analytics');

      const startTime = Date.now();
      try {
        const result = await serviceMethod(...args);
        analytics.track(eventName, {
          success: true,
          duration: Date.now() - startTime,
        });
        return result;
      } catch (error) {
        analytics.track(eventName, {
          success: false,
          duration: Date.now() - startTime,
          error: error.message,
        });
        throw error;
      }
    };
  },
};

// Usage
export const adminService = {
  deleteUser: serviceMiddleware.withAuth(
    serviceMiddleware.withAnalytics(async (userId: string) => {
      const { addNotification } = useHookService('notifications');

      await apiService.delete(`/users/${userId}`);
      addNotification({
        type: 'success',
        message: 'User deleted successfully',
      });
    }, 'user_deleted'),
    'admin'
  ),
};
```

### 3. Service Factory Pattern

Create service factories for dynamic service creation:

```typescript
// Service factory
export function createCrudService<T>(entityName: string, endpoint: string) {
  return {
    async create(data: Partial<T>): Promise<T> {
      const { addNotification } = useHookService('notifications');
      const navigate = useHookService('navigate');

      try {
        const result = await apiService.post<T>(endpoint, data);
        addNotification({
          type: 'success',
          message: `${entityName} created successfully`,
        });
        navigate(`${endpoint}/${result.id}`);
        return result;
      } catch (error) {
        addNotification({
          type: 'error',
          message: `Failed to create ${entityName.toLowerCase()}`,
        });
        throw error;
      }
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      const { addNotification } = useHookService('notifications');

      try {
        const result = await apiService.put<T>(`${endpoint}/${id}`, data);
        addNotification({
          type: 'success',
          message: `${entityName} updated successfully`,
        });
        return result;
      } catch (error) {
        addNotification({
          type: 'error',
          message: `Failed to update ${entityName.toLowerCase()}`,
        });
        throw error;
      }
    },

    async delete(id: string): Promise<void> {
      const { addNotification } = useHookService('notifications');

      try {
        await apiService.delete(`${endpoint}/${id}`);
        addNotification({
          type: 'success',
          message: `${entityName} deleted successfully`,
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: `Failed to delete ${entityName.toLowerCase()}`,
        });
        throw error;
      }
    },

    async getById(id: string): Promise<T> {
      return apiService.get<T>(`${endpoint}/${id}`);
    },

    async getAll(): Promise<T[]> {
      return apiService.get<T[]>(endpoint);
    },
  };
}

// Usage
interface User {
  id: string;
  name: string;
  email: string;
}

export const userService = createCrudService<User>('User', '/api/users');
export const postService = createCrudService<Post>('Post', '/api/posts');
```

## TypeScript Integration and Type Safety

### 1. Comprehensive Type Definitions

Define complete type systems for your application:

```typescript
// types/hooks.ts
export type NavigateFunction = (
  path: string,
  options?: NavigateOptions
) => void;

export interface AuthHook {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
}

export interface NotificationHook {
  notifications: Notification[];
  addNotification: (notification: CreateNotificationData) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Global app hooks type
export interface AppHooks {
  navigation: () => NavigateFunction;
  auth: () => AuthHook;
  notifications: () => NotificationHook;
  theme: () => ThemeHook;
  api: () => ApiHook;
}
```

### 2. Strict Service Typing

Use strict typing for service methods:

```typescript
// ✅ Good - Explicit types
export const userService = {
  async createUser(data: CreateUserData): Promise<User> {
    const navigate = useHookService<AppHooks>('navigation');
    const { addNotification } = useHookService<AppHooks>('notifications');

    // Implementation with full type safety
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    // Implementation...
  },
};

// ❌ Bad - No explicit types
export const userService = {
  async createUser(data: any) {
    // No type safety
  },
};
```

### 3. Generic Service Patterns

Create reusable generic service patterns:

```typescript
// Generic CRUD service
export function createCrudService<T, CreateData, UpdateData>(
  entityName: string,
  endpoint: string
) {
  return {
    async create(data: CreateData): Promise<T> {
      const { addNotification } = useHookService<AppHooks>('notifications');

      try {
        const result = await apiService.post<T>(endpoint, data);
        addNotification({
          type: 'success',
          message: `${entityName} created successfully`,
        });
        return result;
      } catch (error) {
        addNotification({
          type: 'error',
          message: `Failed to create ${entityName.toLowerCase()}`,
        });
        throw error;
      }
    },

    async update(id: string, data: UpdateData): Promise<T> {
      // Similar implementation...
    },

    async delete(id: string): Promise<void> {
      // Similar implementation...
    },

    async getById(id: string): Promise<T> {
      // Similar implementation...
    },
  };
}

// Usage
export const userService = createCrudService<
  User,
  CreateUserData,
  UpdateUserData
>('User', '/api/users');
```

## Performance Optimization

### 1. Hook Provider Memoization

Memoize hook provider props to prevent unnecessary re-renders:

```typescript
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // ✅ Memoize to prevent recreation
  const hooks = useMemo(() => ({
    navigate: () => navigate,
    location: () => location,
    auth: () => auth
  }), [navigate, location, auth]);

  return (
    <HookProvider hooks={hooks}>
      <YourApp />
    </HookProvider>
  );
}
```

### 2. Service Memoization

Memoize expensive service operations:

```typescript
export const expensiveService = {
  // Memoize expensive computations within service methods
  calculateComplexData(input: ComplexInput) {
    const memoizedCalculator = useHookService('memoizedCalculator');
    return memoizedCalculator(input);
  },

  // Cache service calls using hooks
  async getCachedData(key: string) {
    const cache = useHookService('cache');

    return cache.fetchWithCache(
      `data-${key}`,
      () => apiService.get(`/data/${key}`),
      5 * 60 * 1000 // 5 minute TTL
    );
  },
};
```

### 2. Lazy Service Loading

Load services only when needed:

```typescript
// Lazy service loading
export const lazyServices = {
  get adminService() {
    return import('./admin/adminService').then((m) => m.adminService);
  },

  get reportingService() {
    return import('./reporting/reportingService').then(
      (m) => m.reportingService
    );
  },
};

// Usage
export const dashboardService = {
  async loadAdminData() {
    const { requireRole } = useHookService('auth');

    if (!requireRole('admin')) return;

    const adminService = await lazyServices.adminService;
    return adminService.getAdminData();
  },
};
```

## Testing Best Practices

### 1. Service Testing Setup

Create consistent testing utilities for mocking the hook provider:

```typescript
// test/serviceTestUtils.ts
import { renderHook } from '@testing-library/react';
import { HookProvider } from 'react-use-anywhere';

export function createServiceTestWrapper(mockHooks: Record<string, any>) {
  return ({ children }: { children: React.ReactNode }) => (
    <HookProvider hooks={mockHooks}>
      {children}
    </HookProvider>
  );
}

export function createMockHooks() {
  return {
    navigate: jest.fn(),
    notifications: {
      addNotification: jest.fn(),
      removeNotification: jest.fn(),
    },
    auth: {
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    },
    api: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    },
  };
}

// Usage in tests
describe('authService', () => {
  let mockHooks: ReturnType<typeof createMockHooks>;
  let wrapper: ReturnType<typeof createServiceTestWrapper>;

  beforeEach(() => {
    mockHooks = createMockHooks();
    wrapper = createServiceTestWrapper(mockHooks);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(
      () => {
        // Test your service method that uses useHookService
        return authService.login({ email: 'test@example.com', password: 'password' });
      },
      { wrapper }
    );

    // Verify hook interactions
    expect(mockHooks.api.post).toHaveBeenCalledWith('/login', expect.any(Object));
    expect(mockHooks.navigate).toHaveBeenCalledWith('/dashboard');
  });
});
```

### 2. Integration Testing

Test service integration patterns:

```typescript
// integration/userWorkflow.test.ts
describe('User Workflow Integration', () => {
  it('should complete full user creation workflow', async () => {
    // Setup test environment
    const testUser = createTestUser();

    // Mock external dependencies
    jest.spyOn(apiService, 'post').mockResolvedValue(testUser);
    jest.spyOn(emailService, 'sendWelcomeEmail').mockResolvedValue(undefined);

    // Execute workflow
    const result = await userOnboardingService.onboardNewUser(testUser);

    // Verify all steps completed
    expect(apiService.post).toHaveBeenCalledWith('/users', testUser);
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(result);
    expect(mockHooks.navigation).toHaveBeenCalledWith('/onboarding/welcome');
  });
});
```

## Production Deployment

### 1. Environment Configuration

Handle different environments properly:

```typescript
// services/config/environmentService.ts
export const environmentService = {
  getConfig() {
    const env = process.env.NODE_ENV || 'development';

    const configs = {
      development: {
        apiUrl: 'http://localhost:3000/api',
        enableDebug: true,
        logLevel: 'debug',
      },
      staging: {
        apiUrl: 'https://staging-api.example.com',
        enableDebug: true,
        logLevel: 'info',
      },
      production: {
        apiUrl: 'https://api.example.com',
        enableDebug: false,
        logLevel: 'error',
      },
    };

    return configs[env];
  },

  isProduction() {
    return process.env.NODE_ENV === 'production';
  },

  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  },
};
```

### 2. Error Monitoring

Integrate with error monitoring services:

```typescript
// services/monitoring/errorService.ts
export const errorService = {
  captureError(error: Error, context?: any) {
    // Development logging
    if (environmentService.isDevelopment()) {
      console.error('Service Error:', error, context);
    }

    // Production error tracking
    if (environmentService.isProduction()) {
      // Send to error monitoring service (Sentry, Bugsnag, etc.)
      window.errorTracker?.captureException(error, { extra: context });
    }
  },

  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info'
  ) {
    if (environmentService.isProduction()) {
      window.errorTracker?.captureMessage(message, level);
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  },
};
```

## Key Principles Summary

### ✅ Do:

- **Use TypeScript** for better type safety and developer experience
- **Follow single responsibility** principle for each service
- **Implement consistent error handling** across all services
- **Write comprehensive tests** for all service methods
- **Use dependency injection** via hooks for external dependencies
- **Organize services by domain** and responsibility
- **Document service interfaces** and expected behaviors
- **Handle edge cases** and error scenarios gracefully
- **Provide hooks as functions** in the HookProvider, not values
- **Use useHookService** to access hooks within your services
- **Leverage nested providers** for different application areas

### ❌ Don't:

- **Call hooks at module level** - only in service methods
- **Mix UI logic with business logic** - keep them separate
- **Create god services** - keep services focused and small
- **Ignore error handling** - always handle errors gracefully
- **Skip testing** - services should be thoroughly tested
- **Use direct imports** for dependencies - use hooks instead
- **Expose internal implementation** details in service interfaces
- **Call hooks directly in provider setup** - provide the hook functions
- **Forget to nest providers** when you need different hook contexts

## Common Patterns and Use Cases

### 1. When to Use React Use Anywhere

Use React Use Anywhere when you need to:

- **Move complex business logic out of components** while maintaining access to React hooks
- **Share stateful logic** across multiple components without prop drilling
- **Create testable service layers** that can access React's ecosystem
- **Build reusable business logic** that needs React hook capabilities
- **Implement cross-cutting concerns** like authentication, analytics, or notifications

### 2. When NOT to Use React Use Anywhere

Don't use React Use Anywhere when:

- **Simple component state** is sufficient
- **Logic doesn't need React hooks** - use plain functions instead
- **You're building a pure utility library** without React dependencies
- **Performance is critical** and the overhead isn't justified

### 3. Integration with Existing Patterns

React Use Anywhere works well with:

- **State management libraries** (Redux, Zustand, Jotai) - access them via hooks
- **Router libraries** (React Router, Next.js Router) - use navigation hooks in services
- **UI libraries** (Material-UI, Chakra UI) - access theme and component hooks
- **Data fetching libraries** (React Query, SWR) - use data hooks in business logic

## Migration Guide

### From Traditional React Patterns

```typescript
// Before - Traditional pattern
function MyComponent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      const user = await response.json();
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}

// After - Service-oriented pattern
export const authService = {
  async login(credentials) {
    const navigate = useHookService('navigate');
    const { setUser } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    try {
      const user = await apiService.post('/login', credentials);
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      addNotification({ type: 'error', message: 'Login failed' });
      throw error;
    }
  }
};

function MyComponent() {
  const handleLogin = (credentials) => authService.login(credentials);
  return <LoginForm onSubmit={handleLogin} />;
}
```

### From Custom Hooks to Services

```typescript
// Before - Custom hook with business logic
function useUserManagement() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const createUser = async (userData) => {
    try {
      const user = await api.post('/users', userData);
      addNotification({ type: 'success', message: 'User created' });
      navigate(`/users/${user.id}`);
      return user;
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to create user' });
      throw error;
    }
  };

  return { createUser };
}

// After - Service with hook access
export const userService = {
  async createUser(userData) {
    const navigate = useHookService('navigate');
    const { addNotification } = useHookService('notifications');

    try {
      const user = await api.post('/users', userData);
      addNotification({ type: 'success', message: 'User created' });
      navigate(`/users/${user.id}`);
      return user;
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to create user' });
      throw error;
    }
  }
};

// In component - much cleaner
function UserForm() {
  const handleSubmit = (userData) => userService.createUser(userData);
  return <Form onSubmit={handleSubmit} />;
}
```

Following these best practices will help you build robust, maintainable, and scalable applications with React Use Anywhere!
