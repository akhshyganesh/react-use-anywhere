# 🚀 React Use Anywhere

[![npm version](https://badge.fury.io/js/react-use-anywhere.svg)](https://badge.fury.io/js/react-use-anywhere)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Finally! Use React hooks in services, utilities, and business logic - not just components.**

## ❌ The Problem Every React Developer Faces

```ts
// This is what we all WANT to do but can't:
export const authService = {
  login: async (credentials) => {
    const navigate = useNavigate(); // ❌ Error: hooks only work in components
    const user = await api.login(credentials);
    navigate('/dashboard'); // ❌ Can't access navigation from services
  },
};
```

**Sound familiar?** You end up with:

- 🤮 Endless prop drilling
- 🤢 Messy component logic mixed with business logic
- 😵 Complex context patterns everywhere
- 😤 Can't reuse logic outside components

## ✅ The Solution That Changes Everything

Now you can write this instead:

```ts
// This works perfectly! 🎉
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');

export const login = async (credentials) => {
  const user = await api.login(credentials);

  // Set user state from your auth hook
  authService.use((auth) => auth.setUser(user));

  // Navigate using your navigation hook
  navigationService.use((navigate) => navigate('/dashboard'));
};
```

**That's it!** Clean, simple, and works everywhere.

## 🏃‍♂️ Quick Start (1 minutes 15 seconds)

### 1. Install

```bash
npm install react-use-anywhere
```

### 2. Create a simple auth hook (30 seconds)

```typescript
// hooks/useAuth.ts
import { useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => void;
}

export const useAuth = (): AuthState => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useCallback((newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      clearUser();
      setIsLoading(false);
    }, 500);
  }, [clearUser]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    clearUser,
    logout,
  };
};
```

### 3. Wrap your app (15 seconds)

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

### 4. Create services (15 seconds)

```ts
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigate');

export const logout = () => {
  authService.use((auth) => auth.clearUser());
  navigationService.use((navigate) => navigate('/login'));
};
```

### 5. Connect in components (15 seconds)

```tsx
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigate');

  return <button onClick={logout}>Logout</button>;
}
```

**Done!** Now call `logout()` from anywhere in your app! 🎉

## 🔥 Real-World Examples

### 🔐 Authentication Service

```typescript
// services/authService.ts
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigate');

export const requireAuth = () => {
  return authService.use((auth) => {
    if (!auth.isAuthenticated) {
      // Redirect to login from anywhere!
      navigationService.use((navigate) => navigate('/login'));
      return false;
    }
    return true;
  });
};

export const getCurrentUser = () => {
  return authService.use((auth) => auth.user);
};
```

### 🛒 Shopping Cart

```typescript
// services/cartService.ts
export const cartService = createSingletonService('cart');
export const notificationService = createSingletonService('notifications');

export const addToCart = (product) => {
  cartService.use((cart) => cart.addItem(product));
  notificationService.use((notify) => notify.success('Added to cart!'));

  // Navigate to cart if user wants
  if (window.confirm('Go to cart?')) {
    navigationService.use((navigate) => navigate('/cart'));
  }
};
```

### 🎨 Theme Management

```typescript
// services/themeService.ts
export const themeService = createSingletonService('theme');

export const toggleTheme = () => {
  themeService.use((theme) => {
    theme.toggle();
    localStorage.setItem('theme', theme.current);
  });
};
```

### 🌐 API Error Handling

```typescript
// services/apiService.ts
export const apiCall = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint);
    if (response.status === 401) {
      // Auto-logout on unauthorized
      authService.use((auth) => auth.logout());
      navigationService.use((navigate) => navigate('/login'));
      throw new Error('Unauthorized');
    }
    return response.json();
  } catch (error) {
    notificationService.use((notify) => notify.error('Something went wrong!'));
    throw error;
  }
};
```

## 🏗️ Perfect for Clean Architecture

Stop mixing UI logic with business logic! Create a clean service layer:

```
src/
├── components/          # Pure React components
├── services/           # Business logic (uses hooks via services)
│   ├── authService.ts
│   ├── cartService.ts
│   └── apiService.ts
├── hooks/              # Custom React hooks
└── utils/              # Pure utility functions
```

## ✨ Why Developers Love React Use Anywhere

> "Reduced our state management code by 70% and eliminated all prop drilling!"

> "Testing became so much easier when we could mock services independently."

> "Finally, a library that doesn't fight React - it enhances it!"

- 🎯 **Use hooks anywhere** - Not just in React components
- 🏗️ **Clean architecture** - Perfect for service layers and business logic
- 🛡️ **Type-safe** - Full TypeScript support with compile-time validation
- ⚡ **Zero boilerplate** - Simple setup, powerful results
- 🌐 **Works everywhere** - React Router, Next.js, Remix, TanStack Router
- 🧪 **Easy testing** - Mock services, not components

## 📚 Complete Setup Guide

### 1. Installation

```bash
npm install react-use-anywhere
# or
yarn add react-use-anywhere
```

### 2. Wrap Your App

```tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <HookProvider
      hooks={{
        navigate: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <YourAppComponents />
    </HookProvider>
  );
}
```

### 3. Create Services

```typescript
// services/navigationService.ts
import { createSingletonService } from 'react-use-anywhere';

export const navigationService = createSingletonService('navigate');

export const goToLogin = () => {
  navigationService.use((navigate) => {
    navigate('/login');
  });
};
```

### 4. Connect Services in Components

```tsx
// components/SomeComponent.tsx
import { useHookService } from 'react-use-anywhere';
import { navigationService } from '../services/navigationService';

function SomeComponent() {
  // This makes the navigate hook available in navigationService
  useHookService(navigationService, 'navigate');

  return <div>Your component</div>;
}
```

### 5. Use Anywhere! 🎉

```typescript
// anywhere in your code - even non-React files!
import { goToLogin } from './services/navigationService';

// In an API client
async function handleApiError(error) {
  if (error.status === 401) {
    goToLogin(); // 🚀 Navigate from anywhere!
  }
}

// In business logic
function processUserLogout() {
  clearUserData();
  goToLogin(); // 🚀 Works everywhere!
}
```

## 🛡️ Type-Safe Usage

For the best developer experience, use the type-safe versions:

```typescript
// Define your app's hook types
type AppHooks = {
  navigate: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
};

// Create type-safe services
const navService = createTypedSingletonService<AppHooks, 'navigate'>('navigate');

// Use type-safe providers
<TypedHookProvider<AppHooks> hooks={{ navigate, auth, theme }}>
  <App />
</TypedHookProvider>
```

## 🎮 Try the Demo

Clone this repo and run the demo to see it in action:

```bash
git clone https://github.com/akhshyganesh/react-use-anywhere
cd react-use-anywhere
npm install
npm run dev
```

The demo shows:

- 🔐 Authentication flow with service-based login/logout
- 🎨 Theme switching from service layer
- 🧭 Navigation from non-React files
- 📊 Real-time debug panel showing all service calls
- 🛡️ Type-safe service usage examples

## 🤝 When NOT to Use This

This library is great for:

- ✅ Service layers and business logic
- ✅ Utility functions that need React state
- ✅ API clients that need navigation/auth
- ✅ Complex applications with clear architecture

Don't use it for:

- ❌ Simple prop drilling (just pass props)
- ❌ Component-to-component communication (use standard React patterns)
- ❌ Everything (still use normal React patterns where appropriate)

## 🔍 How It Works

1. **HookProvider** executes your hooks at the top level and provides values via React Context
2. **Services** are created as singletons that can store and access hook values
3. **useHookService** connects services to hook values in React components
4. **Services can be used anywhere** - they automatically access the latest hook values

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run demo
npm run dev

# Build library
npm run build

# Run tests
npm test
```

## 📄 License

MIT © [akhshyganesh](https://github.com/akhshyganesh)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit PRs.

## ⭐ Show Your Support

If this library helps you build better React applications, please give it a star! ⭐

---

**Made with ❤️ for the React community**

Ready to write cleaner React code? **Start with just one service and see the difference!** 🚀
