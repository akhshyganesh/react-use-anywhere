# Types

TypeScript type definitions and interfaces for React Use Anywhere.

## Core Types

### ReactHook

Represents any React hook function.

```typescript
type ReactHook = (...args: any[]) => any;
```

**Usage:**

```typescript
const useCustomHook: ReactHook = () => {
  // Hook implementation
};
```

### HookService

Basic hook service interface.

```typescript
interface HookService {
  [key: string]: ReactHook;
}
```

**Usage:**

```typescript
const hooks: HookService = {
  navigation: useNavigate,
  auth: useAuth,
  theme: useTheme,
};
```

### TypedHookService

Type-safe hook service interface.

```typescript
interface TypedHookService<T> {
  [K in keyof T]: T[K];
}
```

**Usage:**

```typescript
interface AppHooks {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
}

const hooks: TypedHookService<AppHooks> = {
  navigation: useNavigate,
  auth: useAuth,
};
```

## Provider Types

### HookContext

The context object provided by HookProvider.

```typescript
interface HookContext {
  hooks: Record<string, ReactHook>;
}
```

**Properties:**

- `hooks` - Object containing all registered hooks

### HookRegistry

Registry of all available hooks.

```typescript
type HookRegistry<T = Record<string, ReactHook>> = T;
```

**Usage:**

```typescript
type AppHookRegistry = HookRegistry<{
  navigation: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
}>;
```

### HookProviderProps

Props for the HookProvider component.

```typescript
interface HookProviderProps {
  hooks: Record<string, ReactHook>;
  children: React.ReactNode;
}
```

**Properties:**

- `hooks` - Object mapping hook keys to hook functions
- `children` - Child components to render

### TypedHookProviderProps

Props for the TypedHookProvider component.

```typescript
interface TypedHookProviderProps<T> {
  hooks: T;
  children: React.ReactNode;
}
```

**Type Parameters:**

- `T` - The hook registry type

**Properties:**

- `hooks` - Typed hook registry object
- `children` - Child components to render

## Hook Access Types

### ExtractHookType

Utility type to extract the return type of a hook.

```typescript
type ExtractHookType<T> = T extends (...args: any[]) => infer R ? R : never;
```

**Usage:**

```typescript
type AuthHookReturn = ExtractHookType<typeof useAuth>;
// Infers the return type of useAuth
```

### HookReturnTypes

Maps hook keys to their return types.

```typescript
type HookReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
};
```

**Usage:**

```typescript
interface AppHooks {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
}

type HookReturns = HookReturnTypes<AppHooks>;
// Result: {
//   navigation: NavigateFunction;
//   auth: AuthState;
// }
```

## Service Types

### ServiceFactory

Factory function for creating services.

```typescript
type ServiceFactory<T = any> = () => T;
```

**Usage:**

```typescript
const authServiceFactory: ServiceFactory<AuthService> = () => ({
  login: async (credentials) => {
    /* implementation */
  },
  logout: () => {
    /* implementation */
  },
});
```

### TypedServiceFactory

Type-safe service factory with hook access.

```typescript
type TypedServiceFactory<T, S = any> = (context: {
  getHook: <K extends keyof T>(key: K) => ReturnType<T[K]>;
}) => S;
```

**Type Parameters:**

- `T` - The hook registry type
- `S` - The service type

**Usage:**

```typescript
const typedFactory: TypedServiceFactory<AppHooks, AuthService> = ({
  getHook,
}) => ({
  login: async (credentials) => {
    const navigate = getHook('navigation');
    const { setUser } = getHook('auth');
    // Implementation with type safety
  },
});
```

## Common Application Types

### NavigateFunction

Standard navigation function type (React Router compatible).

```typescript
type NavigateFunction = (
  to: string | number,
  options?: {
    replace?: boolean;
    state?: any;
  }
) => void;
```

### AuthState

Common authentication state interface.

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  refreshToken: () => Promise<string>;
}
```

### ThemeState

Common theme management interface.

```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
}
```

### NotificationState

Common notification management interface.

```typescript
interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: CreateNotificationData) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  duration?: number;
}

interface CreateNotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
```

## Error Types

### HookServiceError

Base error class for hook service errors.

```typescript
class HookServiceError extends Error {
  constructor(
    message: string,
    public hookKey?: string,
    public context?: any
  ) {
    super(message);
    this.name = 'HookServiceError';
  }
}
```

### HookNotFoundError

Error thrown when a requested hook is not found.

```typescript
class HookNotFoundError extends HookServiceError {
  constructor(hookKey: string) {
    super(`Hook '${hookKey}' not found in HookProvider`, hookKey);
    this.name = 'HookNotFoundError';
  }
}
```

### ProviderNotFoundError

Error thrown when hook service is used outside of provider.

```typescript
class ProviderNotFoundError extends HookServiceError {
  constructor() {
    super('useHookService must be used within a HookProvider');
    this.name = 'ProviderNotFoundError';
  }
}
```

## Utility Types

### DeepPartial

Makes all properties in T optional recursively.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### RequiredKeys

Extracts required keys from an interface.

```typescript
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
```

### OptionalKeys

Extracts optional keys from an interface.

```typescript
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
```

## Advanced Types

### HookServiceMap

Maps service names to their implementations.

```typescript
type HookServiceMap<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
};
```

### ConditionalHooks

Conditionally include hooks based on type predicates.

```typescript
type ConditionalHooks<T extends boolean> = T extends true
  ? { admin: () => AdminHook }
  : { user: () => UserHook };
```

### MergeHooks

Merge multiple hook registry types.

```typescript
type MergeHooks<T, U> = T & U;

// Usage
type BaseHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
};

type AdminHooks = {
  adminAuth: () => AdminAuthState;
  adminConfig: () => AdminConfig;
};

type AllHooks = MergeHooks<BaseHooks, AdminHooks>;
```

## Type Guards

### isHookServiceError

Type guard for hook service errors.

```typescript
function isHookServiceError(error: any): error is HookServiceError {
  return error instanceof HookServiceError;
}
```

### isValidHookKey

Type guard for valid hook keys.

```typescript
function isValidHookKey<T>(key: string, hooks: T): key is keyof T {
  return key in hooks;
}
```

## Generic Constraints

### HookConstraint

Ensures a type is a valid hook function.

```typescript
type HookConstraint<T> = T extends (...args: any[]) => any ? T : never;
```

### ServiceConstraint

Ensures a type is a valid service object.

```typescript
type ServiceConstraint<T> = T extends Record<string, any> ? T : never;
```

## Module Augmentation

### Extending Global Types

You can extend global types for your application:

```typescript
declare global {
  interface Window {
    __REACT_USE_ANYWHERE_DEBUG__?: boolean;
    errorTracker?: {
      captureException: (error: Error, context?: any) => void;
      captureMessage: (message: string, level?: string) => void;
    };
  }
}

// Extend default hook types
declare module 'react-use-anywhere' {
  interface DefaultHooks {
    navigation: () => NavigateFunction;
    auth: () => AuthState;
    theme: () => ThemeState;
  }
}
```

## Usage Examples

### Complete Type Setup

```typescript
// types/app.ts
import { NavigateFunction } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
}

export interface AppHooks {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
  notifications: () => NotificationState;
}

// Service type
export interface UserService {
  createUser: (data: CreateUserData) => Promise<User>;
  updateUser: (id: string, data: UpdateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}
```

### Type-Safe Service Creation

```typescript
// services/userService.ts
import { createTypedSingletonService } from 'react-use-anywhere';
import type { AppHooks, UserService } from '../types/app';

export const userService: UserService = createTypedSingletonService<AppHooks>(
  'user-service',
  ({ getHook }) => ({
    async createUser(data) {
      const navigate = getHook('navigation');
      const { addNotification } = getHook('notifications');

      // Implementation with full type safety
    },

    async updateUser(id, data) {
      // Implementation
    },

    async deleteUser(id) {
      // Implementation
    },
  })
);
```

## Best Practices

### ✅ Do:

- Define comprehensive type interfaces for your hooks
- Use TypedHookProvider for type safety
- Create reusable type definitions
- Leverage TypeScript's inference capabilities
- Document complex types with JSDoc comments

### ❌ Don't:

- Use `any` types when specific types are available
- Ignore TypeScript errors in production code
- Create overly complex generic types
- Forget to export types from your modules
- Use type assertions without proper validation

These types provide the foundation for building type-safe, maintainable applications with React Use Anywhere!
