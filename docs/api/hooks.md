# Hooks

Functions that provide access to registered hooks from within services and other non-component code.

## useHookService

The primary function for accessing registered hooks from services.

### Signature

```typescript
function useHookService<T = any>(key: string): T;
```

### Parameters

| Parameter | Type     | Required | Description                                       |
| --------- | -------- | -------- | ------------------------------------------------- |
| `key`     | `string` | ✅       | The key used to register the hook in the provider |

### Returns

- `T` - The hook function or return value

### Usage

```typescript
import { useHookService } from 'react-use-anywhere';

export const navigationService = {
  goHome() {
    const navigate = useHookService('navigation');
    navigate('/');
  },

  goToProfile(userId: string) {
    const navigate = useHookService('navigation');
    navigate(`/profile/${userId}`);
  },
};
```

### Error Handling

```typescript
// Throws error if hook not found
const navigate = useHookService('nonexistent'); // Error: Hook 'nonexistent' not found

// Throws error if used outside provider
const navigate = useHookService('navigation'); // Error: useHookService must be used within a HookProvider
```

## useTypedHookService

Type-safe version of useHookService with compile-time type checking.

### Signature

```typescript
function useTypedHookService<T, K extends keyof T>(key: K): ReturnType<T[K]>;
```

### Type Parameters

- `T` - The hook registry interface type
- `K` - The hook key (automatically inferred from T)

### Parameters

| Parameter | Type | Required | Description                         |
| --------- | ---- | -------- | ----------------------------------- |
| `key`     | `K`  | ✅       | The hook key (must exist in type T) |

### Returns

- `ReturnType<T[K]>` - The typed return value of the hook

### Usage

```typescript
import { useTypedHookService } from 'react-use-anywhere';

type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
};

export const authService = {
  async login(credentials: LoginCredentials) {
    // Full type safety - navigate is typed as NavigateFunction
    const navigate = useTypedHookService<AppHooks>('navigation');

    // auth is typed as AuthState
    const { login } = useTypedHookService<AppHooks>('auth');

    await login(credentials);
    navigate('/dashboard');
  },
};
```

### Benefits

- **Compile-time type checking** - Prevents typos in hook keys
- **IntelliSense support** - Autocomplete for hook keys and return types
- **Refactoring safety** - Automatic updates when hook types change

## useStrictHookService

Strict version with enhanced type checking and runtime validation.

### Signature

```typescript
function useStrictHookService<T, K extends keyof T>(key: K): ReturnType<T[K]>;
```

### Type Parameters

- `T` - The hook registry interface type
- `K` - The hook key (must be a valid key of T)

### Parameters

| Parameter | Type | Required | Description                   |
| --------- | ---- | -------- | ----------------------------- |
| `key`     | `K`  | ✅       | The hook key (strictly typed) |

### Returns

- `ReturnType<T[K]>` - The strictly typed return value

### Usage

```typescript
import { useStrictHookService } from 'react-use-anywhere';

export const strictService = {
  handleNavigation() {
    // This will fail at compile time if 'navigation' is not in AppHooks
    const navigate = useStrictHookService<AppHooks, 'navigation'>('navigation');

    // This would cause a TypeScript error
    // const invalid = useStrictHookService<AppHooks, 'invalid'>('invalid');

    navigate('/dashboard');
  },
};
```

## useHook

Alias for useHookService - shorter syntax.

### Signature

```typescript
function useHook<T = any>(key: string): T;
```

Identical to `useHookService` but with a shorter name.

### Usage

```typescript
import { useHook } from 'react-use-anywhere';

export const shortService = {
  navigate() {
    const navigate = useHook('navigation'); // Same as useHookService
    navigate('/dashboard');
  },
};
```

## useTypedHook

Alias for useTypedHookService - shorter syntax.

### Signature

```typescript
function useTypedHook<T, K extends keyof T>(key: K): ReturnType<T[K]>;
```

### Usage

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
