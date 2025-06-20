# Services

Functions for creating and managing service instances with hook access capabilities.

## createHookService

Creates a service instance with access to registered hooks.

### Signature

```typescript
function createHookService<T = any>(
  name: string,
  serviceFactory: ServiceFactory<T>
): T;
```

### Parameters

| Parameter        | Type                | Required | Description                              |
| ---------------- | ------------------- | -------- | ---------------------------------------- |
| `name`           | `string`            | ✅       | Unique identifier for the service        |
| `serviceFactory` | `ServiceFactory<T>` | ✅       | Function that returns the service object |

### Returns

- `T` - The service instance with hook access capabilities

### Usage

```typescript
import { createHookService } from 'react-use-anywhere';

export const authService = createHookService('auth', () => ({
  async login(credentials: LoginCredentials) {
    const navigate = useHookService('navigation');
    const { setUser } = useHookService('auth');

    try {
      const user = await api.login(credentials);
      setUser(user);
      navigate('/dashboard');
      return user;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    const navigate = useHookService('navigation');
    const { clearUser } = useHookService('auth');

    clearUser();
    navigate('/login');
  },
}));
```

### Benefits

- **Service Encapsulation** - Wraps service logic in a manageable instance
- **Hook Access** - Service methods can access registered hooks
- **Testability** - Easy to mock and test service behavior
- **Reusability** - Service instances can be shared across components

## createSingletonService

Creates a singleton service that persists across the application lifecycle.

### Signature

```typescript
function createSingletonService<T = any>(
  name: string,
  serviceFactory: ServiceFactory<T>
): T;
```

### Parameters

| Parameter        | Type                | Required | Description                                |
| ---------------- | ------------------- | -------- | ------------------------------------------ |
| `name`           | `string`            | ✅       | Unique identifier for the singleton        |
| `serviceFactory` | `ServiceFactory<T>` | ✅       | Function that creates the service instance |

### Returns

- `T` - The singleton service instance

### Usage

```typescript
import { createSingletonService } from 'react-use-anywhere';

export const cacheService = createSingletonService('cache', () => {
  const cache = new Map();

  return {
    set(key: string, value: any, ttl?: number) {
      cache.set(key, { value, timestamp: Date.now(), ttl });
    },

    get(key: string) {
      const { addNotification } = useHookService('notifications');
      const item = cache.get(key);

      if (!item) return null;

      // Check TTL
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        cache.delete(key);
        addNotification({ type: 'info', message: 'Cache expired' });
        return null;
      }

      return item.value;
    },

    clear() {
      cache.clear();
    },
  };
});
```

### Singleton Behavior

- **Single Instance** - Only one instance exists throughout the app
- **Persistent State** - State is maintained across component renders
- **Shared Access** - Same instance accessed from anywhere
- **Memory Efficient** - Avoids creating duplicate instances

## getSingletonService

Retrieves an existing singleton service by name.

### Signature

```typescript
function getSingletonService<T = any>(name: string): T | null;
```

### Parameters

| Parameter | Type     | Required | Description                               |
| --------- | -------- | -------- | ----------------------------------------- |
| `name`    | `string` | ✅       | Name of the singleton service to retrieve |

### Returns

- `T | null` - The singleton instance or null if not found

### Usage

```typescript
import { getSingletonService } from 'react-use-anywhere';

// Get existing singleton
const cacheService = getSingletonService('cache');

if (cacheService) {
  const data = cacheService.get('user-data');
}

// Or with type safety
const typedCacheService = getSingletonService<CacheService>('cache');
```

## createTypedSingletonService

Type-safe version of createSingletonService with compile-time type checking.

### Signature

```typescript
function createTypedSingletonService<T, S = any>(
  name: string,
  serviceFactory: TypedServiceFactory<T, S>
): S;
```

### Type Parameters

- `T` - The hook registry interface type
- `S` - The service type

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
