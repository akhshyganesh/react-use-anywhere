# 🚀 React Use Anywhere

[![npm version](https://badge.fury.io/js/react-use-anywhere.svg)](https://www.npmjs.com/package/react-use-anywhere)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/badge/gzip-<2KB-blue.svg)](https://bundlephobia.com/package/react-use-anywhere)
[![React](https://img.shields.io/badge/React-16.8%2B%20%7C%2017%20%7C%2018%20%7C%2019-61dafb.svg)](https://reactjs.org/)

**Use React hooks anywhere in your codebase - services, utilities, business logic. Build clean, testable architecture with zero boilerplate.**

---

## 🎯 The Problem Every React Developer Faces

```typescript
// ❌ This doesn't work in React
export const authService = {
  logout: () => {
    const navigate = useNavigate(); // Error: hooks only work in components!
    clearAuth();
    navigate('/login');
  },
};
```

**Sound familiar?** You're forced to:

- 🤮 Pass callbacks through endless props
- 😵 Mix business logic with UI components
- 🤢 Create complex context patterns
- 😤 Duplicate logic everywhere

## ✨ The Solution

```typescript
// ✅ This works perfectly!
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navService = createSingletonService('navigate');

export const logout = () => {
  authService.use((auth) => auth.logout());
  navService.use((navigate) => navigate('/login'));
};
```

**Call `logout()` from anywhere** - services, utilities, API clients, business logic. 🎉

---

## ⚡ Quick Start (2 Minutes)

### 1. Install

```bash
npm install react-use-anywhere
```

### 2. Wrap Your App

```tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <HookProvider hooks={{ navigate: useNavigate, auth: useAuth }}>
      <YourApp />
    </HookProvider>
  );
}
```

### 3. Create Services

```typescript
// services/authService.ts
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navService = createSingletonService('navigate');

export const logout = () => {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
};
```

### 4. Connect in Components

```tsx
import { useHookService } from 'react-use-anywhere';
import { authService, navService, logout } from './services/authService';

function MyComponent() {
  useHookService(authService, 'auth');
  useHookService(navService, 'navigate');

  return <button onClick={logout}>Logout</button>;
}
```

**Done!** Now call `logout()` anywhere in your codebase! 🎊

---

## 🔥 Real-World Examples

### Authentication with Auto-Redirect

```typescript
// services/apiService.ts
import { authService, navService } from './authService';

export const fetchData = async (endpoint: string) => {
  const response = await fetch(endpoint);

  if (response.status === 401) {
    // Auto-logout from anywhere!
    authService.use((auth) => auth.logout());
    navService.use((nav) => nav('/login'));
    throw new Error('Unauthorized');
  }

  return response.json();
};
```

### Shopping Cart with Notifications

```typescript
// services/cartService.ts
import { createSingletonService } from 'react-use-anywhere';

export const cartService = createSingletonService('cart');
export const notifyService = createSingletonService('notifications');

export const addToCart = (product: Product) => {
  cartService.use((cart) => cart.addItem(product));
  notifyService.use((notify) => notify.success(`${product.name} added!`));
};

export const checkout = async () => {
  const items = cartService.use((cart) => cart.items) || [];

  if (items.length === 0) {
    notifyService.use((notify) => notify.warning('Cart is empty'));
    return;
  }

  try {
    await processPayment(items);
    cartService.use((cart) => cart.clear());
    navService.use((nav) => nav('/success'));
  } catch (error) {
    notifyService.use((notify) => notify.error('Payment failed'));
  }
};
```

### Theme Management

```typescript
// services/themeService.ts
import { createSingletonService } from 'react-use-anywhere';

export const themeService = createSingletonService('theme');

export const toggleTheme = () => {
  themeService.use((theme) => {
    theme.toggle();
    localStorage.setItem('theme', theme.current);
    document.body.className = theme.current;
  });
};
```

---

## 📚 Core API

### `configureLogging({ enabled: boolean })`

**New in v1.x** - Control debug logging output.

```typescript
import { configureLogging } from 'react-use-anywhere';

// Enable logging for debugging (disabled by default)
configureLogging({ enabled: true });

// Disable logging (default - keeps console clean)
configureLogging({ enabled: false });
```

**Note:** Logging only works in development mode (`NODE_ENV !== 'production'`). Logs are automatically disabled in production builds.

**Best Practices:**

- Keep disabled in production (default)
- Enable temporarily when debugging hook connections
- Use environment variables for conditional enabling

```typescript
// main.tsx - Only enable in development
if (import.meta.env.DEV) {
  configureLogging({ enabled: true });
}
```

### `HookProvider`

Wrap your app to register hooks.

```tsx
import { HookProvider } from 'react-use-anywhere';

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

### `createSingletonService(hookName)`

Create a service to access hook values anywhere.

```typescript
import { createSingletonService } from 'react-use-anywhere';

const authService = createSingletonService('auth');

// Use it anywhere
export const checkAuth = () => {
  return authService.use((auth) => auth.isAuthenticated) || false;
};
```

### `useHookService(service, hookName)`

Connect service to hook value in a component.

```tsx
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  useHookService(authService, 'auth');
  useHookService(navService, 'navigate');

  // Now services are ready to use anywhere
  return <button onClick={logout}>Logout</button>;
}
```

### Service Methods

```typescript
const service = createSingletonService('myHook');

// Execute callback with hook value
service.use((hookValue) => {
  // Do something with hookValue
  return result;
});

// Get current value
const value = service.get();

// Check if ready
if (service.isReady()) {
  // Service is connected
}
```

---

## 🛡️ TypeScript Support

Full type safety with automatic type inference.

```typescript
import { createSingletonService } from 'react-use-anywhere';
import type { NavigateFunction } from 'react-router-dom';

// Type is automatically inferred
const navService = createSingletonService<NavigateFunction>('navigate');

// Fully typed
navService.use((navigate) => {
  navigate('/home'); // TypeScript knows navigate is NavigateFunction
});
```

### Advanced Type Safety

```typescript
// Define your hook types
type AppHooks = {
  navigate: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
};

// Create type-safe services
import { createStrictSingletonService } from 'react-use-anywhere';

const navService = createStrictSingletonService<AppHooks>('navigate'); // ✅
const badService = createStrictSingletonService<AppHooks>('invalid'); // ❌ TypeScript Error
```

---

## 🌐 Framework Compatibility

Works with **any React router or no router at all**:

### React Router

```tsx
import { useNavigate } from 'react-router-dom';

<HookProvider hooks={{ navigate: useNavigate }}>
  <App />
</HookProvider>;
```

### TanStack Router

```tsx
import { useRouter } from '@tanstack/react-router';

<HookProvider hooks={{ router: useRouter }}>
  <App />
</HookProvider>;
```

### Next.js

```tsx
import { useRouter } from 'next/router';

<HookProvider hooks={{ router: useRouter }}>
  <App />
</HookProvider>;
```

### Any Custom Hook

```tsx
<HookProvider
  hooks={{
    customHook: useYourCustomHook,
    anotherHook: useAnotherHook,
  }}
>
  <App />
</HookProvider>
```

---

## 🧪 Testing

Easy to test with service mocking.

```typescript
import { resetAllServices } from 'react-use-anywhere';

describe('authService', () => {
  beforeEach(() => {
    resetAllServices(); // Clean slate for each test
  });

  it('should logout and redirect', () => {
    const mockAuth = { logout: jest.fn() };
    const mockNavigate = jest.fn();

    authService._setValue(mockAuth);
    navService._setValue(mockNavigate);

    logout();

    expect(mockAuth.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
```

---

## ⭐ Why Developers Love It

> **"Reduced our state management code by 70% and eliminated all prop drilling!"**  
> _- Senior React Developer_

> **"Testing became trivial when we could mock services independently."**  
> _- QA Engineer_

> **"Finally, a library that enhances React instead of fighting it!"**  
> _- Tech Lead_

### Key Benefits

- 🎯 **Use hooks anywhere** - Services, utilities, API clients, business logic
- 🏗️ **Clean architecture** - Separate business logic from UI
- 🛡️ **Type-safe** - Full TypeScript support with compile-time validation
- ⚡ **Zero boilerplate** - 3 lines to setup, infinite possibilities
- 🌐 **Universal** - Works with React Router, Next.js, Remix, TanStack Router
- 🧪 **Easy testing** - Mock services, not components
- 📦 **Tiny** - < 2KB gzipped, zero dependencies
- 🚀 **Production-ready** - Battle-tested, no memory leaks
- 🔇 **Clean console** - Logging disabled by default, enable when needed

---

## 📖 Advanced Patterns

### Composable Services

```typescript
// services/userService.ts
export const userService = createSingletonService('user');

export const getUserProfile = () => {
  return userService.use((user) => user.profile) || null;
};

export const updateProfile = (data: ProfileData) => {
  userService.use((user) => user.updateProfile(data));
  notifyService.use((notify) => notify.success('Profile updated!'));
};
```

### Conditional Navigation

```typescript
export const navigateWithAuth = (path: string) => {
  const isAuth = authService.use((auth) => auth.isAuthenticated);

  if (!isAuth) {
    navService.use((nav) => nav('/login'));
    return false;
  }

  navService.use((nav) => nav(path));
  return true;
};
```

### Service Composition

```typescript
export const performSecureAction = async (action: () => Promise<void>) => {
  const isAuth = authService.use((auth) => auth.isAuthenticated);

  if (!isAuth) {
    notifyService.use((notify) => notify.error('Please login first'));
    navService.use((nav) => nav('/login'));
    return;
  }

  try {
    await action();
  } catch (error) {
    if (error.status === 401) {
      authService.use((auth) => auth.logout());
      navService.use((nav) => nav('/login'));
    }
  }
};
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Akhshy Ganesh](https://github.com/akhshyganesh)

---

## 🔗 Links

- [GitHub Repository](https://github.com/akhshyganesh/react-use-anywhere)
- [npm Package](https://www.npmjs.com/package/react-use-anywhere)
- [Issue Tracker](https://github.com/akhshyganesh/react-use-anywhere/issues)
- [Changelog](./CHANGELOG.md)

---

## 💖 Support

If you find this library helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Improving documentation
- 🔄 Sharing with others

---

**Made with ❤️ for the React community**
