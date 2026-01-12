# Services

Functions for creating and managing service instances that can access hook values.

## createHookService

Creates a basic service instance that can hold hook values.

⚠️ **Note**: Most applications should use `createSingletonService` instead for better performance and shared state.

### Signature

```typescript
function createHookService<T = unknown>(): HookService<T>;
```

### Returns

- `HookService<T>` - A service instance with methods to access hook values

### Service Methods

| Method      | Description                           |
| ----------- | ------------------------------------- |
| `get()`     | Get the current hook value            |
| `isReady()` | Check if hook value is available      |
| `use(cb)`   | Use hook value in a callback function |
| `_reset()`  | Reset service (internal, for testing) |

### Usage

```typescript
import { createHookService } from 'react-use-anywhere';

// Create service
export const authService = createHookService<AuthState>();

// Use service values
export const getCurrentUser = () => {
  return authService.use((auth) => {
    return auth.user;
  });
};

export const isAuthenticated = () => {
  return authService.use((auth) => {
    return auth.isAuthenticated;
  });
};
```

```tsx
// Connect service to hook in React component
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  // This connection is required!
  useHookService(authService, 'auth');

  return <div>My Component</div>;
}
```

## createSingletonService

🚀 **RECOMMENDED**: Creates a singleton service that persists across the application lifecycle.

### Signature

```typescript
function createSingletonService<T = unknown>(hookName: string): HookService<T>;
```

### Parameters

| Parameter  | Type     | Required | Description                                    |
| ---------- | -------- | -------- | ---------------------------------------------- |
| `hookName` | `string` | ✅       | Name of the hook as registered in HookProvider |

### Returns

- `HookService<T>` - A singleton service instance

### Usage

```typescript
import { createSingletonService } from 'react-use-anywhere';

// Create singleton service for 'auth' hook
export const authService = createSingletonService<AuthState>('auth');

// Helper functions that use the service
export const login = async (credentials: LoginCredentials) => {
  return authService.use(async (auth) => {
    try {
      const user = await api.login(credentials);
      auth.setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  });
};

export const logout = () => {
  return authService.use((auth) => {
    auth.clearUser();
  });
};

export const getCurrentUser = () => {
  return authService.use((auth) => {
    return auth.user;
  });
};
```

```tsx
// Connect service to hook in React component
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  // This connection is required for the service to work!
  useHookService(authService, 'auth');

  // Now you can use service functions
  const handleLogin = () => {
    login({ email: 'user@example.com', password: 'password' });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Benefits

- **Shared State** - Same instance used throughout the app
- **Better Performance** - No duplicate instances
- **Automatic Validation** - Validates hook names at runtime
- **Memory Efficient** - Singleton pattern prevents memory leaks

# Services

Functions for creating and managing service instances that can access hook values.

## createHookService

Creates a basic service instance that can hold hook values.

⚠️ **Note**: Most applications should use `createSingletonService` instead for better performance and shared state.

### Signature

```typescript
function createHookService<T = unknown>(): HookService<T>;
```

### Returns

- `HookService<T>` - A service instance with methods to access hook values

### Service Methods

| Method      | Description                           |
| ----------- | ------------------------------------- |
| `get()`     | Get the current hook value            |
| `isReady()` | Check if hook value is available      |
| `use(cb)`   | Use hook value in a callback function |
| `_reset()`  | Reset service (internal, for testing) |

### Usage

```typescript
import { createHookService } from 'react-use-anywhere';

// Create service
export const authService = createHookService<AuthState>();

// Use service values
export const getCurrentUser = () => {
  return authService.use((auth) => {
    return auth.user;
  });
};

export const isAuthenticated = () => {
  return authService.use((auth) => {
    return auth.isAuthenticated;
  });
};
```

```tsx
// Connect service to hook in React component
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  // This connection is required!
  useHookService(authService, 'auth');

  return <div>My Component</div>;
}
```

## createSingletonService

🚀 **RECOMMENDED**: Creates a singleton service that persists across the application lifecycle.

### Signature

```typescript
function createSingletonService<T = unknown>(hookName: string): HookService<T>;
```

### Parameters

| Parameter  | Type     | Required | Description                                    |
| ---------- | -------- | -------- | ---------------------------------------------- |
| `hookName` | `string` | ✅       | Name of the hook as registered in HookProvider |

### Returns

- `HookService<T>` - A singleton service instance

### Usage

```typescript
import { createSingletonService } from 'react-use-anywhere';

// Create singleton service for 'auth' hook
export const authService = createSingletonService<AuthState>('auth');

// Helper functions that use the service
export const login = async (credentials: LoginCredentials) => {
  return authService.use(async (auth) => {
    try {
      const user = await api.login(credentials);
      auth.setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  });
};

export const logout = () => {
  return authService.use((auth) => {
    auth.clearUser();
  });
};

export const getCurrentUser = () => {
  return authService.use((auth) => {
    return auth.user;
  });
};
```

```tsx
// Connect service to hook in React component
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  // This connection is required for the service to work!
  useHookService(authService, 'auth');

  // Now you can use service functions
  const handleLogin = () => {
    login({ email: 'user@example.com', password: 'password' });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Benefits

- **Shared State** - Same instance used throughout the app
- **Better Performance** - No duplicate instances
- **Automatic Validation** - Validates hook names at runtime
- **Memory Efficient** - Singleton pattern prevents memory leaks

## getSingletonService

Retrieves an existing singleton service by name.

### Signature

```typescript
function getSingletonService<T = unknown>(
  hookName: string
): HookService<T> | null;
```

### Parameters

| Parameter  | Type     | Required | Description                                |
| ---------- | -------- | -------- | ------------------------------------------ |
| `hookName` | `string` | ✅       | Name of the hook as registered in provider |

### Returns

- `HookService<T> | null` - The singleton instance or null if not found

### Usage

```typescript
import { getSingletonService } from 'react-use-anywhere';

// Get existing singleton
const authService = getSingletonService<AuthState>('auth');

if (authService) {
  const user = authService.use((auth) => auth.user);
}
```

## createTypedSingletonService

Type-safe version of createSingletonService with compile-time hook name validation.

### Signature

```typescript
function createTypedSingletonService<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(hookName: K): HookService<ExtractHookType<THooks[K]>>;
```

### Type Parameters

- `THooks` - The hooks interface type
- `K` - The specific hook name key

### Usage

```typescript
import { createTypedSingletonService } from 'react-use-anywhere';

// Define your hooks type
type AppHooks = {
  auth: () => AuthState;
  navigation: () => NavigateFunction;
};

// Create typed service - TypeScript will validate hook names
export const authService = createTypedSingletonService<AppHooks, 'auth'>(
  'auth'
);

// TypeScript error if hook name is invalid
export const badService = createTypedSingletonService<AppHooks, 'invalid'>(
  'invalid'
); // ❌ Error
```

## createStrictSingletonService

Strict type-safe version that enforces valid hook names at compile time.

### Signature

```typescript
function createStrictSingletonService<
  THooks extends Record<string, ReactHook<unknown>>,
>(
  hookName: keyof THooks & string
): HookService<ExtractHookType<THooks[typeof hookName]>>;
```

### Usage

```typescript
import { createStrictSingletonService } from 'react-use-anywhere';

// Define your hooks
type MyHooks = {
  auth: () => AuthState;
  theme: () => ThemeState;
};

// Create strict service - compile-time validation
export const authService = createStrictSingletonService<MyHooks>('auth'); // ✅ Valid
export const themeService = createStrictSingletonService<MyHooks>('theme'); // ✅ Valid
export const invalidService = createStrictSingletonService<MyHooks>('invalid'); // ❌ TypeScript Error
```

## createInferredSingletonService

Automatically infers types from the HookProvider setup.

### Signature

```typescript
function createInferredSingletonService<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(hookName: K): TypedHookService<ExtractHookType<THooks[K]>, THooks>;
```

### Usage

```typescript
import { createInferredSingletonService } from 'react-use-anywhere';

// Service automatically gets proper typing from provider
export const authService = createInferredSingletonService<AppHooks, 'auth'>(
  'auth'
);
```

## resetAllServices

Resets all singleton services. Useful for testing.

### Signature

```typescript
function resetAllServices(): void;
```

### Usage

```typescript
import { resetAllServices } from 'react-use-anywhere';

// In tests
beforeEach(() => {
  resetAllServices();
});
```

## Service Usage Pattern

Here's the complete pattern for using services:

```typescript
// 1. Create service (in service file)
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService<AuthState>('auth');

export const login = (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    auth.login(credentials.email, credentials.password);
  });
};

// 2. Connect service (in React component)
import { useHookService } from 'react-use-anywhere';
import { authService, login } from '../services/authService';

function LoginComponent() {
  useHookService(authService, 'auth'); // Required connection

  const handleLogin = () => {
    login({ email: 'test@example.com', password: 'password' });
  };

  return <button onClick={handleLogin}>Login</button>;
}

// 3. Setup provider (in App)
import { HookProvider } from 'react-use-anywhere';

function App() {
  return (
    <HookProvider hooks={{ auth: useAuth }}>
      <LoginComponent />
    </HookProvider>
  );
}
```

## Key Points

- **Services are created once** - Use `createSingletonService` for shared state
- **Services must be connected** - Use `useHookService` in React components
- **Access values with `.use()`** - Services use the `.use(callback)` method
- **Runtime validation** - Hook names are validated at runtime
- **Type-safe variants** - Use typed versions for compile-time checking

### Parameters

| Parameter        | Type                        | Required | Description                         |
| ---------------- | --------------------------- | -------- | ----------------------------------- |
| `name`           | `string`                    | ✅       | Unique identifier for the singleton |
| `serviceFactory` | `TypedServiceFactory<T, S>` | ✅       | Typed factory function              |

### Usage

```typescript
import { createTypedSingletonService } from 'react-use-anywhere';

type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
  notifications: () => NotificationState;
};

export const typedAuthService = createTypedSingletonService<AppHooks>(
  'typed-auth',
  () => ({
    async login(credentials: LoginCredentials) {
      // Full type safety
      const navigate = this.getHook('navigation');
      const { setUser } = this.getHook('auth');

      const user = await api.login(credentials);
      setUser(user);
      navigate('/dashboard');
    },

    logout() {
      const navigate = this.getHook('navigation');
      const { clearUser } = this.getHook('auth');

      clearUser();
      navigate('/login');
    },
  })
);
```

## createStrictSingletonService

Strict version with enhanced type checking and runtime validation.

### Signature

```typescript
function createStrictSingletonService<T, S = any>(
  name: string,
  serviceFactory: TypedServiceFactory<T, S>
): S;
```

### Usage

```typescript
export const strictService = createStrictSingletonService<AppHooks>(
  'strict-service',
  () => ({
    performAction() {
      // Strict type checking - will fail at compile time if hook doesn't exist
      const navigate = this.getHook('navigation');
      navigate('/dashboard');
    },
  })
);
```

## createInferredSingletonService

Automatically infers types from the service factory function.

### Signature

```typescript
function createInferredSingletonService<T>(
  name: string,
  serviceFactory: () => T
): T;
```

### Usage

```typescript
export const inferredService = createInferredSingletonService(
  'inferred',
  () => ({
    // TypeScript automatically infers the return type
    getValue(): string {
      return 'value';
    },

    setValue(value: string): void {
      // Implementation
    },
  })
);
```

## resetAllServices

Clears all singleton services and resets the service registry.

### Signature

```typescript
function resetAllServices(): void;
```

### Usage

```typescript
import { resetAllServices } from 'react-use-anywhere';

// Useful for testing or cleanup
beforeEach(() => {
  resetAllServices();
});

// Or in application shutdown
window.addEventListener('beforeunload', () => {
  resetAllServices();
});
```

### When to Use

- **Testing** - Clean slate between test runs
- **Hot Reloading** - Reset services during development
- **Application Shutdown** - Clean up resources
- **Route Changes** - Reset route-specific services

## Service Factory Patterns

### 1. Simple Factory

Basic service creation:

```typescript
const simpleService = createHookService('simple', () => ({
  doSomething() {
    const navigate = useHookService('navigation');
    navigate('/somewhere');
  },
}));
```

### 2. Factory with Initialization

Service with setup logic:

```typescript
const initializedService = createSingletonService('initialized', () => {
  let isInitialized = false;

  return {
    async initialize() {
      if (isInitialized) return;

      const { addNotification } = useHookService('notifications');

      try {
        // Setup logic
        await setupService();
        isInitialized = true;
        addNotification({ type: 'success', message: 'Service ready' });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Service initialization failed',
        });
      }
    },

    isReady() {
      return isInitialized;
    },
  };
});
```

### 3. Factory with Dependencies

Service that depends on other services:

```typescript
const dependentService = createSingletonService('dependent', () => {
  return {
    async performComplexAction() {
      const cacheService = getSingletonService('cache');
      const navigate = useHookService('navigation');

      // Use cache service
      const cachedData = cacheService?.get('data');

      if (!cachedData) {
        // Fetch and cache
        const data = await fetchData();
        cacheService?.set('data', data);
      }

      navigate('/results');
    },
  };
});
```

### 4. Factory with State Management

Service that manages internal state:

```typescript
const statefulService = createSingletonService('stateful', () => {
  let state = { count: 0, items: [] };

  return {
    getState() {
      return { ...state }; // Return copy
    },

    increment() {
      const { addNotification } = useHookService('notifications');

      state.count++;
      addNotification({
        type: 'info',
        message: `Count: ${state.count}`,
      });
    },

    addItem(item: any) {
      state.items.push(item);
    },

    reset() {
      state = { count: 0, items: [] };
    },
  };
});
```

## Service Lifecycle Management

### Service Registration

Services are automatically registered when created:

```typescript
// This service is registered with name 'user-manager'
const userService = createSingletonService('user-manager', () => ({
  // Service methods
}));

// Can be retrieved later
const retrievedService = getSingletonService('user-manager');
```

### Service Dependencies

Manage service initialization order:

```typescript
const serviceA = createSingletonService('service-a', () => ({
  initialize() {
    console.log('Service A initialized');
  },
}));

const serviceB = createSingletonService('service-b', () => ({
  initialize() {
    const serviceA = getSingletonService('service-a');
    serviceA?.initialize(); // Ensure A is initialized first
    console.log('Service B initialized');
  },
}));
```

### Service Cleanup

Services can implement cleanup logic:

```typescript
const cleanupService = createSingletonService('cleanup', () => {
  const resources = [];

  return {
    addResource(resource: any) {
      resources.push(resource);
    },

    cleanup() {
      resources.forEach((resource) => {
        if (typeof resource.cleanup === 'function') {
          resource.cleanup();
        }
      });
      resources.length = 0;
    },
  };
});

// Use in app cleanup
window.addEventListener('beforeunload', () => {
  const cleanup = getSingletonService('cleanup');
  cleanup?.cleanup();
});
```

## Advanced Service Patterns

### Service Composition

Combine multiple services:

```typescript
const compositeService = createSingletonService('composite', () => {
  const authService = getSingletonService('auth');
  const cacheService = getSingletonService('cache');

  return {
    async secureOperation() {
      const { isAuthenticated } = useHookService('auth');

      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }

      // Use composed services
      const cachedResult = cacheService?.get('secure-data');
      if (cachedResult) return cachedResult;

      const result = await performSecureOperation();
      cacheService?.set('secure-data', result, 5 * 60 * 1000);

      return result;
    },
  };
});
```

### Service Decorators

Add cross-cutting concerns to services:

```typescript
function withLogging<T extends object>(service: T, serviceName: string): T {
  const loggedService = {} as T;

  for (const [key, value] of Object.entries(service)) {
    if (typeof value === 'function') {
      loggedService[key as keyof T] = ((...args: any[]) => {
        console.log(`${serviceName}.${key} called with:`, args);
        const result = value.apply(service, args);
        console.log(`${serviceName}.${key} returned:`, result);
        return result;
      }) as any;
    } else {
      loggedService[key as keyof T] = value;
    }
  }

  return loggedService;
}

// Usage
const loggedUserService = withLogging(
  createSingletonService('user', () => ({
    getUser: () => ({ id: 1, name: 'John' }),
    setUser: (user: User) => {
      /* implementation */
    },
  })),
  'UserService'
);
```

## Testing Services

### Mocking Services

```typescript
// Mock service creation
jest.mock('../services/userService', () => ({
  userService: {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

// Test with mocked service
it('should handle user creation', async () => {
  const mockUser = { id: 1, name: 'Test User' };
  userService.createUser.mockResolvedValue(mockUser);

  const result = await someFunction();

  expect(userService.createUser).toHaveBeenCalled();
  expect(result).toEqual(mockUser);
});
```

### Testing Singletons

```typescript
describe('cacheService', () => {
  beforeEach(() => {
    resetAllServices(); // Reset between tests
  });

  it('should cache values', () => {
    const cache = createSingletonService('cache', createCacheService);

    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('should return same instance', () => {
    const cache1 = createSingletonService('cache', createCacheService);
    const cache2 = getSingletonService('cache');

    expect(cache1).toBe(cache2);
  });
});
```

## Best Practices

### ✅ Do:

- Use descriptive names for services
- Implement proper error handling in service methods
- Use singletons for stateful services that need persistence
- Reset services in tests for clean state
- Document service interfaces and expected behavior

### ❌ Don't:

- Create services with overly broad responsibilities
- Use services as global state stores
- Forget to handle service dependencies
- Create circular dependencies between services
- Ignore memory management in long-running services

Service creation functions provide the foundation for building scalable, maintainable service architectures with React Use Anywhere!
