# API Reference

Complete API documentation for `react-use-anywhere`.

## Core Components

### `HookProvider`

Provider component that registers and executes hooks at the top level.

```typescript
function HookProvider<T extends Record<string, ReactHook<unknown>>>(
  props: HookProviderProps<T>
): React.ReactElement;
```

**Props:**

- `hooks: Record<string, () => any>` - Object mapping hook names to hook functions
- `children: React.ReactNode` - Child components

**Example:**

```tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

<HookProvider
  hooks={{
    navigate: useNavigate,
    auth: useAuth,
    theme: useTheme,
  }}
>
  <App />
</HookProvider>;
```

---

## Service Creation

### `createSingletonService(hookName)`

Creates or retrieves a singleton service instance. **Recommended for most use cases.**

```typescript
function createSingletonService<T = unknown>(hookName: string): HookService<T>;
```

**Parameters:**

- `hookName: string` - Name of the hook as registered in HookProvider

**Returns:** `HookService<T>` - Singleton service instance

**Example:**

```typescript
import { createSingletonService } from 'react-use-anywhere';

const authService = createSingletonService('auth');
const navService = createSingletonService('navigate');
```

### `createHookService()`

Creates a new service instance. Use only when you need multiple independent instances.

```typescript
function createHookService<T = unknown>(): HookService<T>;
```

**Returns:** `HookService<T>` - New service instance

### `getSingletonService(hookName)`

Retrieves an existing singleton service.

```typescript
function getSingletonService<T = unknown>(
  hookName: string
): HookService<T> | null;
```

**Returns:** Service instance or `null` if not exists

### `resetAllServices()`

Resets all singleton services. **Use in test cleanup.**

```typescript
function resetAllServices(): void;
```

---

## Hook Connection

### `useHookService(service, hookName)`

Connects a service to a hook value in a React component.

```typescript
function useHookService<T = unknown>(
  service: HookService<T>,
  hookName: string
): void;
```

**Parameters:**

- `service: HookService<T>` - Service to connect
- `hookName: string` - Name of hook in HookProvider

**Example:**

```tsx
import { useHookService } from 'react-use-anywhere';
import { authService } from './services';

function MyComponent() {
  useHookService(authService, 'auth');
  // Service is now ready to use
}
```

### `useHook(hookName)`

Directly access a hook value in a component.

```typescript
function useHook<T = unknown>(hookName: string): T | undefined;
```

**Returns:** Hook value or `undefined`

### `useAllHooks()`

Get all registered hook values.

```typescript
function useAllHooks(): Record<string, unknown>;
```

**Returns:** Object with all hook values

---

## Service Interface

### `HookService<T>`

Service object returned by `createSingletonService()`.

```typescript
interface HookService<T> {
  use<R>(callback: (value: T) => R): R | null;
  get(): T | null;
  isReady(): boolean;
  _setValue(newValue: T): void;
  _reset(): void;
}
```

#### `service.use(callback)`

Execute a callback with the hook value.

```typescript
service.use((value: T) => {
  // Do something with value
  return result;
});
```

**Returns:** Callback result or `null` if service not ready

**Example:**

```typescript
// Get value
const user = authService.use((auth) => auth.user);

// Call method
authService.use((auth) => auth.logout());

// Chain operations
const result = authService.use((auth) => {
  if (auth.isAuthenticated) {
    return auth.user.name;
  }
  return 'Guest';
});
```

#### `service.get()`

Get the current hook value.

```typescript
const value = service.get();
```

**Returns:** Current value or `null`

#### `service.isReady()`

Check if service has been connected.

```typescript
if (service.isReady()) {
  // Service is ready
}
```

**Returns:** `boolean`

#### `service._setValue(newValue)` ⚠️

Internal method used by `useHookService`. **Do not call directly.**

#### `service._reset()` 🧪

Reset service state. **Use in tests only.**

---

## Type-Safe Variants

### `createTypedSingletonService(hookName)`

Type-safe service creation with compile-time hook name validation.

```typescript
type AppHooks = {
  navigate: () => NavigateFunction;
  auth: () => AuthState;
};

const navService = createTypedSingletonService<AppHooks, 'navigate'>(
  'navigate'
);
```

### `createStrictSingletonService(hookName)`

Enforces valid hook names at compile time.

```typescript
type AppHooks = {
  navigate: () => NavigateFunction;
};

const navService = createStrictSingletonService<AppHooks>('navigate'); // ✅
const bad = createStrictSingletonService<AppHooks>('invalid'); // ❌ Error
```

### `useTypedHookService(service, hookName)`

Type-safe version of `useHookService`.

```typescript
useTypedHookService<AppHooks, 'navigate'>(navService, 'navigate');
```

### `useStrictHookService(service, hookName)`

Strict type-safe version with compile-time validation.

```typescript
useStrictHookService<AppHooks>(navService, 'navigate'); // ✅
useStrictHookService<AppHooks>(navService, 'invalid'); // ❌ Error
```

---

## Advanced APIs

### `useHookContext()`

Access the internal hook context. Advanced use only.

```typescript
function useHookContext(): HookContext;
```

**Returns:** Object with all hook values

**Throws:** Error if used outside HookProvider

### `TypedHookProvider`

Type-safe version of HookProvider.

```tsx
<TypedHookProvider<AppHooks> hooks={hooks}>
  <App />
</TypedHookProvider>
```

---

## TypeScript Types

### `ReactHook<T>`

Type for a React hook function.

```typescript
type ReactHook<T = unknown> = () => T;
```

### `HookService<T>`

Service interface (see above).

### `HookContext`

Context holding all hook values.

```typescript
interface HookContext {
  [hookName: string]: unknown;
}
```

### `HookProviderProps<T>`

Props for HookProvider.

```typescript
interface HookProviderProps<T extends Record<string, ReactHook<unknown>>> {
  children: React.ReactNode;
  hooks: T;
}
```

### `ExtractHookType<T>`

Utility type to extract hook return type.

```typescript
type ExtractHookType<T> = T extends ReactHook<infer R> ? R : never;
```

---

## Error Handling

### Hook Not Registered

If a hook name is not registered in HookProvider, you'll see:

```
🚨 Hook "myHook" is not registered in HookProvider.
Available hooks: "navigate", "auth", "theme"
Did you mean one of these?
  • "navigate"
```

**Solution:** Add the hook to HookProvider

### Service Not Ready

If you use a service before connecting it:

```
Hook service not ready. Make sure you're using useHookService in a React component.
```

**Solution:** Call `useHookService(service, 'hookName')` in a component

### Outside Provider

If you use hooks outside HookProvider:

```
useHookContext must be used within a HookProvider
```

**Solution:** Wrap your app with HookProvider

---

## Performance Notes

- Services use reference equality for change detection
- Singleton pattern prevents duplicate instances
- Context updates are optimized
- Tree-shakeable exports minimize bundle size

---

## Best Practices

1. **Always use `createSingletonService`** for shared state
2. **Connect services in components** with `useHookService`
3. **Use TypeScript** for type safety
4. **Reset services in tests** with `resetAllServices()`
5. **Don't store sensitive data** in services
6. **Validate hook names** during development

---

For examples and guides, see:

- [README.md](./README.md) - Main documentation
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guide
