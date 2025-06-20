# API Overview

Complete API reference for React Use Anywhere.

## Core Exports

```typescript
import {
  // Providers
  HookProvider,
  TypedHookProvider,

  // Hook Services
  useHookService,
  useTypedHookService,
  useStrictHookService,

  // Service Creation
  createHookService,
  createSingletonService,
  createTypedSingletonService,

  // Utilities
  resetAllServices,

  // Types
  type HookService,
  type TypedHookService,
  type HookRegistry,
  // ... more types
} from 'react-use-anywhere';
```

## Quick Reference

| Function                      | Purpose                  | Type Safety  |
| ----------------------------- | ------------------------ | ------------ |
| `HookProvider`                | Basic hook provider      | Runtime      |
| `TypedHookProvider`           | Type-safe provider       | Compile-time |
| `useHookService`              | Access registered hooks  | Runtime      |
| `useTypedHookService`         | Type-safe hook access    | Compile-time |
| `useStrictHookService`        | Strict type checking     | Compile-time |
| `createHookService`           | Create service instance  | Runtime      |
| `createSingletonService`      | Create singleton service | Runtime      |
| `createTypedSingletonService` | Type-safe singleton      | Compile-time |

## Categories

### [Providers](/api/providers)

Components that make hooks available throughout your app:

- `HookProvider` - Basic provider
- `TypedHookProvider` - Type-safe provider

### [Hooks](/api/hooks)

Functions to access registered hooks from services:

- `useHookService` - Basic hook access
- `useTypedHookService` - Type-safe access
- `useStrictHookService` - Strict type checking

### [Services](/api/services)

Functions to create and manage services:

- `createHookService` - Service factory
- `createSingletonService` - Singleton pattern
- `createTypedSingletonService` - Type-safe singleton

### [Types](/api/types)

TypeScript type definitions and interfaces for type safety.

## Usage Patterns

### Basic Pattern

```typescript
// 1. Setup provider
<HookProvider hooks={{ navigation: useNavigate }}>
  <App />
</HookProvider>

// 2. Use in service
const navigate = useHookService('navigation');
navigate('/dashboard');
```

### Type-Safe Pattern

```typescript
// 1. Define types
type AppHooks = {
  navigation: () => NavigateFunction;
};

// 2. Setup typed provider
<TypedHookProvider<AppHooks> hooks={{ navigation: useNavigate }}>
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
