# Type Safety

React Use Anywhere provides comprehensive TypeScript support to ensure type safety across your entire application.

## TypedHookProvider

Use `TypedHookProvider` for full type safety:

```tsx
import { TypedHookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

// Define your hook types
type AppHooks = {
  navigate: () => ReturnType<typeof useNavigate>;
  auth: () => {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  };
  theme: () => {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
  };
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

## Typed Hook Services

Use typed services for complete type safety:

```typescript
import { createStrictSingletonService, useTypedHookService } from 'react-use-anywhere';

// Create typed services
export const navigationService = createStrictSingletonService<AppHooks>('navigate');
export const authService = createStrictSingletonService<AppHooks>('auth');

// Service with full type inference
export const authServiceModule = {
  async login(email: string, password: string) {
    try {
      const user = await authService.use(async (auth) => {
        return auth.login({ email, password });
      });

      // Navigate after successful login
      navigationService.use((navigate) => {
        navigate('/dashboard'); // ✅ Type-safe navigation
      });
    } catch (error) {
      navigationService.use((navigate) => {
        navigate('/login?error=invalid'); // ✅ Type-safe parameters
      });
    }
  },

  logout() {
    authService.use((auth) => {
      auth.logout();
    });

    navigationService.use((navigate) => {
      navigate('/login');
    });
  },
};

// Component connection (required)
function AuthComponent() {
  useTypedHookService<AppHooks, 'auth'>(authService, 'auth');
  useTypedHookService<AppHooks, 'navigate'>(navigationService, 'navigate');

  return <div>...</div>;
}
```

## Global Type Declaration

Create global types for your application:

```typescript
// types/hooks.ts
export type NavigateFunction = (
  path: string,
  options?: NavigateOptions
) => void;

export type AuthHook = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  refreshToken: () => Promise<string>;
};

export type ThemeHook = {
  theme: 'light' | 'dark';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
};

export type NotificationHook = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
};

// Global hook registry type
export type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthHook;
  theme: () => ThemeHook;
  notifications: () => NotificationHook;
};
```

## Strict Type Checking

Use strict hooks for compile-time guarantees:

```typescript
import { useStrictHookService } from 'react-use-anywhere';

export const strictService = {
  // This will fail at compile time if 'auth' is not registered
  getUserData() {
    const { user } = useStrictHookService<AppHooks, 'auth'>('auth');
    return user;
  },

  // This will fail at compile time if 'invalidHook' is not in AppHooks
  // const invalid = useStrictHookService<AppHooks, 'invalidHook'>('invalidHook'); // ❌ Compile error
};
```

## Type Inference

Let TypeScript infer types automatically:

```typescript
// Automatic type inference
export const inferredService = {
  handleThemeChange() {
    // TypeScript automatically infers the return type
    const themeHook = useTypedHookService<AppHooks>('theme');

    // themeHook is typed as: {
    //   theme: 'light' | 'dark';
    //   isDark: boolean;
    //   setTheme: (theme: 'light' | 'dark') => void;
    //   toggleTheme: () => void;
    //   systemTheme: 'light' | 'dark';
    // }

    if (themeHook.isDark) {
      themeHook.setTheme('light');
    } else {
      themeHook.setTheme('dark');
    }
  },
};
```

## Singleton Services with Types

Create typed singleton services:

```typescript
import { createTypedSingletonService } from 'react-use-anywhere';

// Typed singleton service
export const typedAuthService = createTypedSingletonService<AppHooks>(
  'auth-service',
  () => ({
    async login(credentials: LoginCredentials) {
      const { login } = this.getHook('auth');
      const navigate = this.getHook('navigation');

      try {
        const user = await login(credentials);
        navigate('/dashboard');
        return user;
      } catch (error) {
        navigate('/login?error=true');
        throw error;
      }
    },

    logout() {
      const { logout } = this.getHook('auth');
      const navigate = this.getHook('navigation');

      logout();
      navigate('/login');
    },
  })
);
```

## Advanced Type Patterns

### Conditional Hook Types

```typescript
type ConditionalHooks<T extends boolean> = T extends true
  ? { admin: () => AdminHook }
  : { user: () => UserHook };

function createConditionalProvider<T extends boolean>(isAdmin: T) {
  return (
    <TypedHookProvider<ConditionalHooks<T>> hooks={{
      ...(isAdmin ? { admin: useAdminHook } : { user: useUserHook })
    } as any}>
      <App />
    </TypedHookProvider>
  );
}
```

### Generic Service Types

```typescript
interface GenericService<T> {
  getData: () => T;
  setData: (data: T) => void;
  clearData: () => void;
}

function createTypedDataService<T>(hookKey: keyof AppHooks): GenericService<T> {
  return {
    getData() {
      const { data } = useTypedHookService<AppHooks>(hookKey);
      return data as T;
    },

    setData(data: T) {
      const { setData } = useTypedHookService<AppHooks>(hookKey);
      setData(data);
    },

    clearData() {
      const { clearData } = useTypedHookService<AppHooks>(hookKey);
      clearData();
    },
  };
}

// Usage
const userDataService = createTypedDataService<User>('userData');
const settingsService = createTypedDataService<Settings>('settings');
```

## Type-Safe Error Handling

```typescript
import { useTypedHookService } from 'react-use-anywhere';

export const safeTypedService = {
  async performAction() {
    try {
      const { performAction } = useTypedHookService<AppHooks>('actions');
      return await performAction();
    } catch (error) {
      // Type-safe error handling
      if (error instanceof HookServiceError) {
        const navigate = useTypedHookService<AppHooks>('navigation');
        navigate('/error');
      }
      throw error;
    }
  },
};
```

## Runtime Type Validation

Combine with runtime validation libraries:

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const validatedAuthService = {
  async login(credentials: LoginCredentials) {
    const { login } = useTypedHookService<AppHooks>('auth');
    const navigate = useTypedHookService<AppHooks>('navigation');

    try {
      const rawUser = await login(credentials);

      // Runtime validation
      const user = UserSchema.parse(rawUser);

      navigate('/dashboard');
      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Invalid user data:', error.errors);
        navigate('/error?type=invalid-data');
      }
      throw error;
    }
  },
};
```

## Testing with Types

Type-safe testing:

```typescript
import { jest } from '@jest/globals';
import { useTypedHookService } from 'react-use-anywhere';

// Mock with proper types
const mockUseTypedHookService = useTypedHookService as jest.MockedFunction<
  typeof useTypedHookService
>;

describe('typedAuthService', () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    mockUseTypedHookService.mockImplementation(<T>(key: keyof T) => {
      if (key === 'navigation') return mockNavigate;
      if (key === 'auth') return { login: mockLogin };
      throw new Error(`Unexpected hook key: ${String(key)}`);
    });
  });

  it('should navigate after successful login', async () => {
    const user = { id: '1', name: 'Test', email: 'test@example.com' };
    mockLogin.mockResolvedValue(user);

    await typedAuthService.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
```

## Configuration

### TSConfig Settings

Recommended TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": false
  }
}
```

### ESLint Configuration

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error"
  }
}
```

## Best Practices

1. **Always define hook types explicitly**
2. **Use TypedHookProvider in production**
3. **Prefer useStrictHookService for critical paths**
4. **Create reusable type definitions**
5. **Test type safety with strict TypeScript settings**
6. **Use runtime validation for external data**

Ready to build type-safe services? Check out our [Service Layer guide](/guide/service-layer) next!
