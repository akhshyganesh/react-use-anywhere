# API Overview

Complete API reference for React Use Anywhere.

## Core Exports

```typescript
import {
  // Providers
  HookProvider,
  TypedHookProvider,
  useHookContext,
  useTypedHookContext,

  // Hook Services (use in React components)
  useHookService,
  useTypedHookService,
  useStrictHookService,

  // Direct Hook Access (use in React components)
  useHook,
  useTypedHook,
  useStrictHook,
  useAllHooks,

  // Service Creation (use in service files)
  createHookService,
  createSingletonService,
  getSingletonService,
  resetAllServices,
  createTypedSingletonService,
  createStrictSingletonService,
  createInferredSingletonService,

  // Types
  type ReactHook,
  type HookService,
  type TypedHookService,
  type HookContext,
  type HookRegistry,
  type HookProviderProps,
  type TypedHookProviderProps,
  type ExtractHookType,
  type HookReturnTypes,
  type ServiceFactory,
  type TypedServiceFactory,
  // ... more types
} from 'react-use-anywhere';
```

## Quick Reference

| Function                         | Purpose                                | Used In          | Type Safety  |
| -------------------------------- | -------------------------------------- | ---------------- | ------------ |
| `HookProvider`                   | Basic hook provider                    | React Components | Runtime      |
| `TypedHookProvider`              | Type-safe provider                     | React Components | Compile-time |
| `useHookService`                 | Connect service to hook                | React Components | Runtime      |
| `useTypedHookService`            | Type-safe service connection           | React Components | Compile-time |
| `useStrictHookService`           | Strict type-safe connection            | React Components | Compile-time |
| `useHook`                        | Direct hook access                     | React Components | Runtime      |
| `useTypedHook`                   | Type-safe direct access                | React Components | Compile-time |
| `useStrictHook`                  | Strict type-safe direct access         | React Components | Compile-time |
| `createHookService`              | Create service instance                | Service Files    | Runtime      |
| `createSingletonService`         | Create singleton service (recommended) | Service Files    | Runtime      |
| `createTypedSingletonService`    | Type-safe singleton                    | Service Files    | Compile-time |
| `createStrictSingletonService`   | Strict type-safe singleton             | Service Files    | Compile-time |
| `createInferredSingletonService` | Auto-inferred type-safe singleton      | Service Files    | Compile-time |

## Categories

### [Providers](/api/providers)

Components that make hooks available throughout your app:

- `HookProvider` - Basic provider
- `TypedHookProvider` - Type-safe provider

### [Hooks](/api/hooks)

Functions to access registered hooks from React components:

- `useHookService` - Connect service to hook
- `useTypedHookService` - Type-safe service connection
- `useStrictHookService` - Strict type checking
- `useHook` - Direct hook value access
- `useTypedHook` - Type-safe direct access
- `useStrictHook` - Strict type-safe direct access
- `useAllHooks` - Access all hook values

### [Services](/api/services)

Functions to create and manage services:

- `createHookService` - Service factory (creates new instance)
- `createSingletonService` - Singleton pattern (recommended)
- `getSingletonService` - Get existing singleton
- `resetAllServices` - Reset all singletons (testing)
- `createTypedSingletonService` - Type-safe singleton
- `createStrictSingletonService` - Strict type-safe singleton
- `createInferredSingletonService` - Auto-inferred singleton

### [Types](/api/types)

TypeScript type definitions and interfaces for type safety.

## Usage Patterns

### Basic Pattern

```typescript
// 1. Create service (in service file)
import { createSingletonService } from 'react-use-anywhere';

export const navigationService = createSingletonService('navigation');

export const goHome = () => {
  return navigationService.use((navigate) => {
    navigate('/');
  });
};

// 2. Connect service (in React component)
import { useHookService } from 'react-use-anywhere';
import { navigationService } from '../services/navigationService';

function MyComponent() {
  useHookService(navigationService, 'navigation');
  return <div>Component content</div>;
}

// 3. Setup provider (in App)
<HookProvider hooks={{ navigation: useNavigate }}>
  <MyComponent />
</HookProvider>
```

### Type-Safe Pattern

```typescript
// 1. Define types
type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
};

// 2. Create typed service
import { createTypedSingletonService } from 'react-use-anywhere';

export const navigationService = createTypedSingletonService<AppHooks, 'navigation'>('navigation');

// 3. Setup typed provider
<TypedHookProvider<AppHooks> hooks={{ navigation: useNavigate, auth: useAuth }}>
  <App />
</TypedHookProvider>

// 3. Use with type safety
const navigate = useTypedHookService<AppHooks>('navigation');
```

### Singleton Pattern

```typescript
// Create singleton service
const authService = createSingletonService('auth', {
  login() {
    const navigate = useHookService('navigation');
    navigate('/dashboard');
  },
});

// Use anywhere
authService.login();
```

## Error Handling

All API functions throw descriptive errors:

```typescript
try {
  const hook = useHookService('nonexistent');
} catch (error) {
  // Error: Hook 'nonexistent' not found in HookProvider
}

try {
  useHookService('navigation'); // Outside provider
} catch (error) {
  // Error: useHookService must be used within a HookProvider
}
```

## Development vs Production

### Development Mode

- Detailed error messages
- Hook registration validation
- Performance warnings

### Production Mode

- Optimized error messages
- Minimal runtime overhead
- Tree-shaking friendly

## Browser Support

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+)
- **IE11**: Not supported (uses modern JavaScript features)
- **React Native**: Full support
- **Server-Side Rendering**: Supported with proper setup

## Bundle Size

| Import       | Gzipped Size |
| ------------ | ------------ |
| Full library | ~2.1KB       |
| Core only    | ~1.4KB       |
| Types only   | 0KB          |

## TypeScript Support

- **Full type inference** for all APIs
- **Generic type support** for custom hook types
- **Strict mode compatible**
- **Declaration files included**

Ready to dive deeper? Check out the detailed documentation for each API category.
