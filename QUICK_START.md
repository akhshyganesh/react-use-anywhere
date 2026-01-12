# 🚀 React Use Anywhere - Quick Reference

## Installation

```bash
npm install react-use-anywhere
```

## Basic Setup (3 Steps)

### 1️⃣ Wrap Your App

```tsx
import { HookProvider } from 'react-use-anywhere';

<HookProvider hooks={{ navigate: useNavigate, auth: useAuth }}>
  <App />
</HookProvider>;
```

### 2️⃣ Create Services

```typescript
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navService = createSingletonService('navigate');
```

### 3️⃣ Connect in Component

```tsx
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  useHookService(authService, 'auth');
  useHookService(navService, 'navigate');
  return <button onClick={logout}>Logout</button>;
}
```

## API Reference

### `HookProvider`

```tsx
<HookProvider hooks={{ hookName: useHook }}>{children}</HookProvider>
```

### `createSingletonService(hookName)`

```typescript
const service = createSingletonService<Type>('hookName');
```

### `useHookService(service, hookName)`

```tsx
useHookService(service, 'hookName');
```

### Service Methods

```typescript
// Execute with hook value
service.use((value) => value.method());

// Get current value
const value = service.get();

// Check if ready
if (service.isReady()) {
}

// Reset (testing)
service._reset();
```

## Common Patterns

### Authentication

```typescript
export const logout = () => {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
};
```

### API Error Handling

```typescript
if (response.status === 401) {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
}
```

### Conditional Navigation

```typescript
const navigateIfAuth = (path: string) => {
  const isAuth = authService.use((auth) => auth.isAuthenticated);
  if (isAuth) {
    navService.use((nav) => nav(path));
  }
};
```

## TypeScript

### Type-Safe Services

```typescript
import type { NavigateFunction } from 'react-router-dom';

const navService = createSingletonService<NavigateFunction>('navigate');
```

### Strict Type Checking

```typescript
type AppHooks = {
  navigate: () => NavigateFunction;
  auth: () => AuthState;
};

const navService = createStrictSingletonService<AppHooks>('navigate');
```

## Testing

```typescript
import { resetAllServices } from 'react-use-anywhere';

beforeEach(() => {
  resetAllServices();
});

test('logout redirects', () => {
  authService._setValue({ logout: jest.fn() });
  navService._setValue(jest.fn());

  logout();

  expect(navService.get()).toHaveBeenCalledWith('/login');
});
```

## Router Compatibility

### React Router

```tsx
import { useNavigate } from 'react-router-dom';
<HookProvider hooks={{ navigate: useNavigate }} />;
```

### TanStack Router

```tsx
import { useRouter } from '@tanstack/react-router';
<HookProvider hooks={{ router: useRouter }} />;
```

### Next.js

```tsx
import { useRouter } from 'next/router';
<HookProvider hooks={{ router: useRouter }} />;
```

## Best Practices

✅ **DO:**

- Use `createSingletonService` for shared state
- Connect services in components with `useHookService`
- Use TypeScript for type safety
- Reset services in test cleanup

❌ **DON'T:**

- Store sensitive data (passwords, tokens) in services
- Call `_setValue` directly (use `useHookService`)
- Forget to connect services in at least one component
- Use hooks directly in services (use service pattern instead)

## Troubleshooting

### "Hook not registered"

```typescript
// Make sure hook is in HookProvider
<HookProvider hooks={{ myHook: useMyHook }} />
```

### "Service not ready"

```typescript
// Make sure useHookService is called in a component
function Component() {
  useHookService(myService, 'myHook');
}
```

### TypeScript errors

```typescript
// Add type annotations
const service = createSingletonService<MyType>('hook');
```

## Examples

See [README.md](./README.md) for complete examples including:

- Shopping cart with notifications
- Theme management
- Form validation
- And more!

---

**Need help?** [Open an issue](https://github.com/akhshyganesh/react-use-anywhere/issues)
