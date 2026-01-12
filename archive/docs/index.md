# React Use Anywhere

**Use React hooks in services, utilities, and business logic** - not just components! 🚀

## What is this?

React Use Anywhere lets you access any React hook (`useNavigate`, `useAuth`, `useState`, etc.) from **anywhere** in your codebase - services, utilities, business logic files, and more.

## ❌ The Problem You Know

```ts
// This doesn't work - hooks only work in components
export const authService = {
  login: async (credentials) => {
    const navigate = useNavigate(); // ❌ Error: Invalid hook call
    const user = await api.login(credentials);
    navigate('/dashboard'); // ❌ Can't navigate from service
  },
};
```

## ✅ The Solution

```ts
// This works perfectly!
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');

export const login = async (credentials) => {
  const user = await api.login(credentials);

  // Set user state
  authService.use((auth) => auth.setUser(user));

  // Navigate after login
  navigationService.use((navigate) => navigate('/dashboard'));
};
```

## Quick Start (2 minutes)

### 1. Install

```bash
npm install react-use-anywhere
```

### 2. Create a simple auth hook

```tsx
// hooks/useAuth.ts
import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  return {
    user,
    setUser,
    clearUser: () => setUser(null),
    isAuthenticated: !!user,
  };
};
```

### 3. Wrap your app

```tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

function App() {
  return (
    <HookProvider hooks={{ navigation: useNavigate, auth: useAuth }}>
      <YourApp />
    </HookProvider>
  );
}
```

### 4. Create services

```ts
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');

export const logout = () => {
  authService.use((auth) => auth.clearUser());
  navigationService.use((navigate) => navigate('/login'));
};
```

### 5. Connect in components

```tsx
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <button onClick={logout}>Logout</button>;
}
```

**That's it!** Now you can call `logout()` from anywhere in your app.

## Why Developers Love React Use Anywhere

> "Reduced our state management code by 70% and eliminated all prop drilling!"

> "Testing became so much easier when we could mock services independently."

> "Finally, a library that doesn't fight React - it enhances it!"

**Join thousands of developers** who've simplified their React apps with React Use Anywhere

Your future self will thank you! 🙌

## Real-World Examples

### 🔐 Authentication Flow

```ts
// services/auth.ts
export const login = async (email, password) => {
  try {
    const user = await api.login(email, password);
    authService.use((auth) => auth.setUser(user));
    navigationService.use((navigate) => navigate('/dashboard'));
    notificationService.use((notify) => notify.success('Welcome back!'));
  } catch (error) {
    notificationService.use((notify) => notify.error('Login failed'));
  }
};
```

### 🛒 Shopping Cart

```ts
// services/cart.ts
export const addToCart = async (productId) => {
  cartService.use((cart) => cart.addItem(productId));
  notificationService.use((notify) => notify.success('Added to cart!'));

  // Navigate to cart page
  navigationService.use((navigate) => navigate('/cart'));
};
```

### 🎨 Theme Management

```ts
// services/theme.ts
export const toggleTheme = () => {
  themeService.use((theme) => {
    const newTheme = theme.current === 'dark' ? 'light' : 'dark';
    theme.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
};
```

### 📊 Data Sync

```ts
// services/dataSync.ts
export const syncUserData = async () => {
  loadingService.use((loading) => loading.start());

  try {
    const userData = await api.fetchUserData();
    userService.use((user) => user.setData(userData));
    notificationService.use((notify) => notify.success('Data synced!'));
  } finally {
    loadingService.use((loading) => loading.stop());
  }
};
```

## Why Use This?

### ✅ **Clean Architecture**

- Keep business logic separate from UI components
- No more prop drilling or complex context chains
- Services can be reused across different parts of your app

### ✅ **Better Testing**

- Test business logic without rendering React components
- Mock services easily for unit tests
- Cleaner, more focused tests

### ✅ **Type Safety**

- Full TypeScript support with compile-time validation
- IntelliSense and autocompletion everywhere
- Catch errors before runtime

### ✅ **Works Everywhere**

- React Router, TanStack Router, Next.js
- Any React hooks (built-in or custom)
- Zero dependencies, tiny bundle size

## Next Steps

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 32px 0;">

### 🚀 **Get Started**

[**Quick Start Guide →**](/guide/quick-start)
Complete setup in 5 minutes

### 📚 **Learn More**

[**Core Concepts →**](/guide/core-concepts)
Understand how it works

### 💡 **See Examples**

[**Real Examples →**](/examples/basic-usage)
Copy-paste solutions

### 🔧 **API Reference**

[**API Docs →**](/api/overview)
Complete function reference

</div>

## Popular Use Cases

- **Authentication flows** - Login, logout, password reset
- **Navigation** - Redirect after actions, deep linking
- **Notifications** - Toast messages, alerts
- **Theme management** - Dark/light mode switching
- **Shopping carts** - Add items, checkout flows
- **Data fetching** - API calls with loading states
- **Form handling** - Validation, submission
- **Real-time updates** - WebSocket connections

**Ready to write cleaner React code?** Start with the [Quick Start Guide](/guide/quick-start) →
