# Hooks

Functions for accessing registered hooks from React components and connecting services to hooks.

## useHookService

The primary function for connecting a service to a registered hook. **This must be called in a React component.**

### Signature

```typescript
function useHookService<T = unknown>(
  service: HookService<T>,
  hookName: string
): void;
```

### Parameters

| Parameter  | Type             | Required | Description                                       |
| ---------- | ---------------- | -------- | ------------------------------------------------- |
| `service`  | `HookService<T>` | ✅       | The service instance to connect                   |
| `hookName` | `string`         | ✅       | The key used to register the hook in the provider |

### Returns

- `void` - This hook doesn't return anything, it connects the service

### Usage

```tsx
import { useHookService, createSingletonService } from 'react-use-anywhere';

// Create service
export const navigationService = createSingletonService('navigation');

// Connect in React component
function MyComponent() {
  // Connect service to hook - this is required!
  useHookService(navigationService, 'navigation');

  return <div>My Component</div>;
}
```

### Service Usage After Connection

```typescript
// After connection, use the service
export const goHome = () => {
  return navigationService.use((navigate) => {
    navigate('/');
  });
};

export const goToProfile = (userId: string) => {
  return navigationService.use((navigate) => {
    navigate(`/profile/${userId}`);
  });
};
```

### Error Handling

- Throws error if hook not registered in provider
- Provides helpful suggestions for misspelled hook names
- Shows available hooks when hook name is invalid

## useTypedHookService

Type-safe version of useHookService with compile-time type checking.

### Signature

```typescript
function useTypedHookService<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(service: HookService<ExtractHookType<THooks[K]>>, hookName: K): void;
```

### Type Parameters

- `THooks` - The hook registry interface type
- `K` - The hook key (automatically inferred from THooks)

### Parameters

| Parameter  | Type                                      | Required | Description                         |
| ---------- | ----------------------------------------- | -------- | ----------------------------------- |
| `service`  | `HookService<ExtractHookType<THooks[K]>>` | ✅       | The typed service instance          |
| `hookName` | `K`                                       | ✅       | The hook key (must exist in THooks) |

### Usage

```tsx
import {
  useTypedHookService,
  createTypedSingletonService,
} from 'react-use-anywhere';

type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
};

// Create typed services
export const navigationService = createTypedSingletonService<
  AppHooks,
  'navigation'
>('navigation');
export const authService = createTypedSingletonService<AppHooks, 'auth'>(
  'auth'
);

function MyComponent() {
  // Type-safe connections - TypeScript validates hook names
  useTypedHookService<AppHooks>(navigationService, 'navigation');
  useTypedHookService<AppHooks>(authService, 'auth');

  return <div>My Component</div>;
}
```

## useStrictHookService

Strict version with enhanced type checking and runtime validation.

### Signature

```typescript
function useStrictHookService<
  THooks extends Record<string, ReactHook<unknown>>,
>(
  service: HookService<ExtractHookType<THooks[keyof THooks]>>,
  hookName: keyof THooks & string
): void;
```

### Usage

```tsx
import {
  useStrictHookService,
  createStrictSingletonService,
} from 'react-use-anywhere';

// Define hooks type
type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
};

// Create strict service
export const navigationService =
  createStrictSingletonService<AppHooks>('navigation');

function MyComponent() {
  // Strict type checking - compile-time validation
  useStrictHookService<AppHooks>(navigationService, 'navigation'); // ✅ Valid

  // This would cause TypeScript error:
  // useStrictHookService<AppHooks>(navigationService, 'invalid'); // ❌ Error

  return <div>My Component</div>;
}
```

## useHook

Direct access to hook values within React components.

### Signature

```typescript
function useHook<T = unknown>(hookName: string): T | undefined;
```

### Parameters

| Parameter  | Type     | Required | Description                |
| ---------- | -------- | -------- | -------------------------- |
| `hookName` | `string` | ✅       | Name of the hook to access |

### Returns

- `T | undefined` - The hook value or undefined if not found

### Usage

```tsx
import { useHook } from 'react-use-anywhere';

function MyComponent() {
  // Direct access to hook values
  const navigate = useHook<NavigateFunction>('navigation');
  const auth = useHook<AuthState>('auth');

  const handleLogin = () => {
    if (navigate && auth) {
      auth.login('user@example.com', 'password');
      navigate('/dashboard');
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

## useTypedHook

Type-safe direct access to hook values.

### Signature

```typescript
function useTypedHook<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(hookName: K): ExtractHookType<THooks[K]>;
```

### Usage

```tsx
import { useTypedHook } from 'react-use-anywhere';

type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
};

function MyComponent() {
  // Type-safe direct access
  const navigate = useTypedHook<AppHooks, 'navigation'>('navigation');
  const auth = useTypedHook<AppHooks, 'auth'>('auth');

  return <div>Typed access to hooks</div>;
}
```

## useStrictHook

Strict type-safe direct access to hook values.

### Signature

```typescript
function useStrictHook<THooks extends Record<string, ReactHook<unknown>>>(
  hookName: keyof THooks & string
): ExtractHookType<THooks[typeof hookName]>;
```

### Usage

```tsx
import { useStrictHook } from 'react-use-anywhere';

type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
};

function MyComponent() {
  // Strict type checking
  const navigate = useStrictHook<AppHooks>('navigation'); // ✅ Valid
  const auth = useStrictHook<AppHooks>('auth'); // ✅ Valid
  // const invalid = useStrictHook<AppHooks>('invalid'); // ❌ TypeScript Error

  return <div>Strict typed hooks</div>;
}
```

## useAllHooks

Access all registered hook values at once.

### Signature

```typescript
function useAllHooks(): Record<string, unknown>;
```

### Returns

- `Record<string, unknown>` - Object containing all hook values

### Usage

```tsx
import { useAllHooks } from 'react-use-anywhere';

function DebugComponent() {
  const allHooks = useAllHooks();

  return (
    <div>
      <h3>All Hook Values:</h3>
      <pre>{JSON.stringify(allHooks, null, 2)}</pre>
    </div>
  );
}
```

## Hook Connection Pattern

Here's the recommended pattern for using hooks:

```typescript
// 1. Create services (in service files)
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService<AuthState>('auth');
export const navigationService = createSingletonService<NavigateFunction>('navigation');

// Service functions
export const login = (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    auth.login(credentials.email, credentials.password);
  });
};

export const goHome = () => {
  return navigationService.use((navigate) => {
    navigate('/');
  });
};

// 2. Connect services (in React components)
import { useHookService } from 'react-use-anywhere';

function App() {
  // Connect all services you want to use
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <MyAppContent />;
}

// 3. Use services anywhere
function LoginButton() {
  const handleLogin = () => {
    login({ email: 'user@example.com', password: 'password' });
    goHome(); // Navigate after login
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

## Key Points

- **Connection required** - Services must be connected with `useHookService` in React components
- **Use services, not hooks directly** - Create services and helper functions instead of calling hooks everywhere
- **Type safety available** - Use typed variants for compile-time checking
- **Direct access available** - Use `useHook` for direct access when services aren't needed
- **Debug with useAllHooks** - Access all hook values for debugging

```typescript
import { useTypedHook } from 'react-use-anywhere';

export const shortTypedService = {
  navigate() {
    const navigate = useTypedHook<AppHooks>('navigation');
    navigate('/dashboard');
  },
};
```

## useStrictHook

Alias for useStrictHookService - shorter syntax.

### Usage

```typescript
import { useStrictHook } from 'react-use-anywhere';

export const shortStrictService = {
  navigate() {
    const navigate = useStrictHook<AppHooks, 'navigation'>('navigation');
    navigate('/dashboard');
  },
};
```

## useAllHooks

Access all registered hooks at once.

### Signature

```typescript
function useAllHooks<T = Record<string, any>>(): T;
```

### Returns

- `T` - Object containing all registered hooks

### Usage

```typescript
import { useAllHooks } from 'react-use-anywhere';

export const multiHookService = {
  performComplexAction() {
    const allHooks = useAllHooks<AppHooks>();

    const navigate = allHooks.navigation();
    const { user } = allHooks.auth();
    const { theme } = allHooks.theme();

    // Use multiple hooks...
  },
};
```

## Hook Access Patterns

### 1. Single Hook Access

Most common pattern - access one hook at a time:

```typescript
export const singleHookService = {
  navigate() {
    const navigate = useHookService('navigation');
    navigate('/dashboard');
  },
};
```

### 2. Multiple Hook Access

Access multiple hooks within the same service method:

```typescript
export const multiHookService = {
  async performAction() {
    const navigate = useHookService('navigation');
    const { user } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    if (!user) {
      addNotification({ type: 'error', message: 'Not authenticated' });
      navigate('/login');
      return;
    }

    // Perform authenticated action...
  },
};
```

### 3. Conditional Hook Access

Access hooks conditionally based on application state:

```typescript
export const conditionalService = {
  handleAction() {
    const { isAuthenticated } = useHookService('auth');

    if (isAuthenticated) {
      const navigate = useHookService('navigation');
      navigate('/dashboard');
    } else {
      const { openModal } = useHookService('modal');
      openModal('login');
    }
  },
};
```

### 4. Hook Destructuring

Destructure hook return values for cleaner code:

```typescript
export const destructuringService = {
  manageUser() {
    const { user, login, logout, isAuthenticated } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    if (isAuthenticated) {
      addNotification({
        type: 'info',
        message: `Welcome, ${user.name}!`,
      });
    }
  },
};
```

## Error Handling

### Common Errors

#### Hook Not Found

```typescript
// Error: Hook 'invalid' not found in HookProvider
const hook = useHookService('invalid');
```

#### Provider Not Found

```typescript
// Error: useHookService must be used within a HookProvider
const hook = useHookService('navigation');
```

#### Type Mismatch (TypeScript)

```typescript
// TypeScript error: Argument of type '"invalid"' is not assignable to parameter
const hook = useTypedHookService<AppHooks>('invalid');
```

### Safe Hook Access

```typescript
export const safeService = {
  safeNavigate() {
    try {
      const navigate = useHookService('navigation');
      navigate('/dashboard');
    } catch (error) {
      console.warn('Navigation not available:', error.message);
      // Fallback behavior
      window.location.href = '/dashboard';
    }
  },
};
```

## Performance Considerations

### Hook Call Timing

Hooks are called when service methods execute, not when modules load:

```typescript
// ❌ Wrong - called at module load time
const navigate = useHookService('navigation'); // This will fail

export const badService = {
  navigate() {
    navigate('/dashboard'); // Won't work
  },
};

// ✅ Correct - called when method executes
export const goodService = {
  navigate() {
    const navigate = useHookService('navigation'); // Called at runtime
    navigate('/dashboard'); // Works correctly
  },
};
```

### Hook Caching

Hooks are not cached between calls - each call gets fresh values:

```typescript
export const freshDataService = {
  checkAuth() {
    const { user } = useHookService('auth'); // Fresh auth state
    return user !== null;
  },

  getUserName() {
    const { user } = useHookService('auth'); // Fresh auth state again
    return user?.name;
  },
};
```

## Advanced Usage

### Generic Hook Services

Create reusable hook service patterns:

```typescript
function createDataService<T>(hookKey: string) {
  return {
    getData(): T {
      const { data } = useHookService(hookKey);
      return data;
    },

    setData(newData: T) {
      const { setData } = useHookService(hookKey);
      setData(newData);
    },
  };
}

// Usage
const userDataService = createDataService<User>('userData');
const settingsService = createDataService<Settings>('settings');
```

### Hook Composition

Combine multiple hooks for complex operations:

```typescript
export const compositeService = {
  async handleUserAction() {
    const navigate = useHookService('navigation');
    const { user, logout } = useHookService('auth');
    const { addNotification } = useHookService('notifications');
    const { setLoading } = useHookService('ui');

    try {
      setLoading(true);

      if (!user) {
        addNotification({ type: 'error', message: 'Not authenticated' });
        navigate('/login');
        return;
      }

      // Perform action...
    } catch (error) {
      if (error.status === 401) {
        logout();
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: 'Action failed' });
      }
    } finally {
      setLoading(false);
    }
  },
};
```

## Testing Hook Services

### Mocking Hook Services

```typescript
import { useHookService } from 'react-use-anywhere';

jest.mock('react-use-anywhere', () => ({
  useHookService: jest.fn(),
}));

const mockUseHookService = useHookService as jest.MockedFunction<
  typeof useHookService
>;

describe('navigationService', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockUseHookService.mockImplementation((key) => {
      if (key === 'navigation') return mockNavigate;
      throw new Error(`Mock not implemented for hook: ${key}`);
    });
  });

  it('should navigate to home', () => {
    navigationService.goHome();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
```

### Testing Multiple Hooks

```typescript
describe('authService', () => {
  const mockNavigate = jest.fn();
  const mockAddNotification = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    mockUseHookService.mockImplementation((key) => {
      switch (key) {
        case 'navigation':
          return mockNavigate;
        case 'notifications':
          return { addNotification: mockAddNotification };
        case 'auth':
          return { login: mockLogin };
        default:
          throw new Error(`Unexpected hook key: ${key}`);
      }
    });
  });

  it('should login and navigate', async () => {
    await authService.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
```

## Best Practices

### ✅ Do:

- Call hooks inside service methods, not at module level
- Use typed hooks for better development experience
- Handle errors gracefully with try/catch blocks
- Destructure hook return values for cleaner code
- Use meaningful hook keys that describe their purpose

### ❌ Don't:

- Call hooks at module load time
- Ignore TypeScript errors in typed hooks
- Use hooks in class constructors or static methods
- Cache hook return values across method calls
- Use generic any types when specific types are available

The hook access functions are the core of React Use Anywhere, enabling clean service-oriented architecture while maintaining the power and flexibility of React hooks!
