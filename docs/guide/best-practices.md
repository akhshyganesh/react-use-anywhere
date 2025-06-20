# Best Practices

Production-ready patterns and recommendations for using React Use Anywhere effectively.

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

### 2. Dependency Injection

Always use hooks for external dependencies, never import them directly:

```typescript
// ✅ Good - Dependency injection via hooks
export const authService = {
  async login(credentials: LoginCredentials) {
    const navigate = useHookService('navigation'); // Injected dependency
    const { setUser } = useHookService('auth'); // Injected dependency

    // Service logic...
  },
};

// ❌ Bad - Direct dependencies
import { navigate } from '../utils/navigation'; // Direct import

export const authService = {
  async login(credentials: LoginCredentials) {
    // Hard to test, tightly coupled
    navigate('/dashboard');
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

### 1. Organized Hook Registration

Structure your hook provider with clear organization:

```typescript
// hooks/index.ts - Centralized hook definitions
export const appHooks = {
  // Navigation hooks
  navigation: useNavigate,
  location: useLocation,

  // State management hooks
  auth: useAuth,
  theme: useTheme,
  notifications: useNotifications,

  // Data hooks
  api: useApi,
  cache: useCache,

  // UI hooks
  modal: useModal,
  loading: useLoading
};

// App.tsx - Clean provider setup
function App() {
  return (
    <TypedHookProvider<AppHooks> hooks={appHooks}>
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </TypedHookProvider>
  );
}
```

### 2. Hook Provider Nesting

Use nested providers for different application areas:

```typescript
// Global hooks for entire app
function App() {
  return (
    <HookProvider hooks={{
      navigation: useNavigate,
      theme: useTheme,
      notifications: useNotifications
    }}>
      <Router>
        <Routes>
          <Route path="/admin/*" element={
            <HookProvider hooks={{
              adminAuth: useAdminAuth,
              adminConfig: useAdminConfig
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
```

### 3. Hook Memoization

Memoize hook provider props to prevent unnecessary re-renders:

```typescript
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // ✅ Memoize to prevent recreation
  const hooks = useMemo(() => ({
    navigation: () => navigate,
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

## Type Safety Patterns

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
    const navigate = useTypedHookService<AppHooks>('navigation');
    const { addNotification } = useTypedHookService<AppHooks>('notifications');

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
      const { addNotification } =
        useTypedHookService<AppHooks>('notifications');

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

### 1. Service Memoization

Memoize expensive service operations:

```typescript
export const expensiveService = {
  // Memoize expensive computations
  calculateComplexData: useMemo(() => {
    return (input: ComplexInput) => {
      // Expensive calculation
      return processComplexData(input);
    };
  }, []),

  // Cache service calls
  cachedDataService: {
    async getData(key: string) {
      const cache = useHookService('cache');

      return cache.fetchWithCache(
        `data-${key}`,
        () => apiService.get(`/data/${key}`),
        5 * 60 * 1000 // 5 minute TTL
      );
    },
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

Create consistent testing utilities:

```typescript
// test/serviceTestUtils.ts
import { useHookService } from 'react-use-anywhere';

export function createServiceTestSetup() {
  const mockHooks = {
    navigation: jest.fn(),
    notifications: { addNotification: jest.fn() },
    auth: { user: null, isAuthenticated: false },
    // ... other mock hooks
  };

  const mockUseHookService = useHookService as jest.MockedFunction<
    typeof useHookService
  >;

  mockUseHookService.mockImplementation((key) => {
    const hook = mockHooks[key];
    if (!hook) {
      throw new Error(`Mock hook '${key}' not found`);
    }
    return hook;
  });

  return { mockHooks, mockUseHookService };
}

// Usage in tests
describe('userService', () => {
  const { mockHooks } = createServiceTestSetup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user successfully', async () => {
    // Test implementation...
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

### ❌ Don't:

- **Call hooks at module level** - only in service methods
- **Mix UI logic with business logic** - keep them separate
- **Create god services** - keep services focused and small
- **Ignore error handling** - always handle errors gracefully
- **Skip testing** - services should be thoroughly tested
- **Use direct imports** for dependencies - use hooks instead
- **Expose internal implementation** details in service interfaces

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
    const navigate = useHookService('navigation');
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

Following these best practices will help you build robust, maintainable, and scalable applications with React Use Anywhere!
