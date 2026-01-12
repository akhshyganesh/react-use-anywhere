# Introduction

React Use Anywhere lets you access React hook values from outside components using simple hook registration and access patterns.

## The Problem

React hooks can only be called inside components. This forces you to either:

- Pass everything as props (prop drilling)
- Use complex context patterns
- Keep all logic inside components

```tsx
// ❌ This doesn't work
export const authService = {
  login: async (credentials) => {
    const navigate = useNavigate(); // ❌ Error: hooks only work in components
    const user = await api.login(credentials);
    navigate('/dashboard');
  },
};
```

## The Solution

React Use Anywhere provides two ways to access hooks outside components:

### Option 1: Direct Hook Access (Component Context Only)

Use `getHook()` directly within React components or functions called from components:

```tsx
import { getHook } from 'react-use-anywhere';

// ✅ This works inside components
function LoginComponent() {
  const handleLogin = async () => {
    const auth = getHook('auth');
    const navigate = getHook('navigation');

    const user = await api.login(credentials);
    auth.setUser(user);
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Option 2: Services (Use Anywhere)

Create services that can access hooks from anywhere in your codebase:

```tsx
// 1. Setup: Register hooks with HookProvider
import { HookProvider } from 'react-use-anywhere';

function App() {
  return (
    <HookProvider hooks={{ navigation: useNavigate, auth: useAuth }}>
      <YourApp />
    </HookProvider>
  );
}
```

```ts
// 2. Create services that can access hooks
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');

export const login = async (credentials) => {
  const user = await api.login(credentials);

  // Access hook values through services
  authService.use((auth) => auth.setUser(user));
  navigationService.use((navigate) => navigate('/dashboard'));
};
```

```tsx
// 3. Connect services in components, then use anywhere
function LoginPage() {
  // Connect services to hooks (required!)
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <button onClick={() => login(credentials)}>Login</button>;
}
```

## When to Use Each Approach

- **Use `getHook()`** when you need hook access within React components or functions called directly from components
- **Use `createSingletonService()`** when you need hook access from:
  - Utility functions
  - API interceptors
  - Event handlers outside components
  - Background services
  - Any code that needs to work independently of React's component tree

## How It Works

1. **Setup**: Wrap your app with `HookProvider` and register your hooks
2. **Create Services**: Use `createSingletonService('hookName')` to create services that can access hooks
3. **Connect**: Use `useHookService(service, 'hookName')` in components to connect services to hooks
4. **Use Anywhere**: Call your services from anywhere in your codebase

```tsx
// 1. Setup
<HookProvider hooks={{ auth: useAuth, navigation: useNavigate }}>
  <App />
</HookProvider>;

// 2. Create services
const authService = createSingletonService('auth');

// 3. Connect in components
useHookService(authService, 'auth');

// 4. Use anywhere
authService.use((auth) => auth.login());
```

## Key Benefits

- **🏗️ Clean Architecture** - Separate business logic from UI components
- **🧪 Better Testing** - Test business logic without mounting React components
- **🔄 Reusability** - Write services once, use everywhere
- **📈 Scalability** - No prop drilling, clean separation of concerns
- **🛡️ Type Safe** - Full TypeScript support
- **⚡ Zero Overhead** - Minimal performance impact

## What You Can Build

- **Authentication flows** - Login, logout, session management
- **Navigation logic** - Route changes, redirects, deep linking
- **State management** - Global state updates from services
- **API integration** - Data fetching with loading and error states
- **Theme management** - Dynamic theme switching
- **Notifications** - Toast messages, alerts from anywhere
- **Shopping carts** - E-commerce flows with navigation
- **Real-time features** - WebSocket connections with state updates

Ready to get started? Check out the [Quick Start Guide](/guide/quick-start)!
