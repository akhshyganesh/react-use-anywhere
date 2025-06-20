# 🚀 React Use Anywhere

**Use React hooks anywhere in your codebase - even in plain JavaScript/TypeScript files!**

[![npm version](https://badge.fury.io/js/react-use-anywhere.svg)](https://badge.fury.io/js/react-use-anywhere)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Why This Library Exists

Have you ever wanted to:

- **Call navigation from a service layer?** (e.g., redirect after API calls)
- **Access user authentication state in utility functions?**
- **Update theme from business logic files?**
- **Use React Context values outside components?**

**Traditional React** forces you to pass props down or use complex patterns. **React Use Anywhere** lets you access any React hook from anywhere in your codebase - services, utilities, business logic, anywhere!

## ✨ Key Benefits

- 🎯 **Use hooks anywhere** - Not just in React components
- 🔧 **Service-oriented architecture** - Perfect for clean architecture patterns
- 🛡️ **Type-safe** - Full TypeScript support with compile-time validation
- ⚡ **Zero boilerplate** - Simple setup, powerful results
- 🏗️ **Framework agnostic** - Works with any React setup (Vite, CRA, Next.js, etc.)
- 🎨 **Great DX** - Excellent developer experience with helpful error messages

## 🚀 Quick Start

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

## 📖 Common Use Cases

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

### 🎨 Theme Service

```typescript
// services/themeService.ts
export const themeService = createSingletonService('theme');

export const toggleTheme = () => {
  themeService.use((theme) => theme.toggle());
};

export const applyThemeToBody = () => {
  themeService.use((theme) => {
    document.body.className = theme.isDark ? 'dark' : 'light';
  });
};
```

### 🌐 API Service with Auto-Redirect

```typescript
// services/apiService.ts
import { requireAuth, logout } from './authService';
import { goToLogin } from './navigationService';

export const apiCall = async (endpoint: string) => {
  // Check auth before API call
  if (!requireAuth()) return;

  try {
    const response = await fetch(endpoint);

    if (response.status === 401) {
      logout(); // Clear auth state
      goToLogin(); // Redirect to login
      throw new Error('Unauthorized');
    }

    return response.json();
  } catch (error) {
    // Handle errors with navigation
    if (error.message === 'Network Error') {
      navigationService.use((navigate) => navigate('/offline'));
    }
    throw error;
  }
};
```

## 🏗️ Architecture Patterns

### Clean Architecture with Services

```
src/
├── components/          # React components
├── services/           # Business logic services
│   ├── authService.ts
│   ├── apiService.ts
│   └── themeService.ts
├── hooks/              # Custom React hooks
└── utils/              # Pure utility functions
```

### Service Layer Benefits

- **Separation of Concerns**: Keep business logic out of components
- **Reusability**: Use the same logic across multiple components
- **Testability**: Easy to test business logic independently
- **Maintainability**: Centralized state management and side effects

## 🔧 API Reference

### Core Functions

#### `createSingletonService<T>(hookName: string)`

Creates a singleton service for accessing hook values.

#### `useHookService(service, hookName)`

Connects a service to a hook value in React components.

#### `useHook<T>(hookName: string)`

Directly access hook values in React components.

#### `useAllHooks()`

Get all hook values from the context.

### Type-Safe Functions

#### `createTypedSingletonService<THooks, K>(hookName: K)`

Type-safe version with compile-time validation.

#### `createStrictSingletonService<THooks>(hookName: keyof THooks)`

Enforces valid hook names at compile time.

#### `createInferredSingletonService<THooks, K>(hookName: K)`

Automatically infers types from provider setup.

#### `TypedHookProvider<THooks>`

Type-safe provider with hook type validation.

#### `useTypedHookService<THooks, K>(service, hookName)`

Type-safe version of useHookService.

#### `useStrictHookService<THooks>(service, hookName)`

Enforces valid hook names at compile time.

#### `useTypedHook<THooks, K>(hookName)`

Type-safe direct hook access.

#### `useStrictHook<THooks>(hookName)`

Strict type-safe direct hook access.

### Service Methods

#### `service.use(callback)`

Execute code with the current hook value.

#### `service.get()`

Get the current hook value (or null if not ready).

#### `service.isReady()`

Check if the service has a hook value available.

### Additional Functions

#### `getSingletonService<T>(hookName: string)`

Get an existing singleton service.

#### `resetAllServices()`

Reset all singleton services (useful for testing).

#### `createHookService<T>()`

Creates a service instance (use createSingletonService instead for better performance).

## 🎮 Try the Demo

Clone this repo and run the demo to see it in action:

```bash
git clone https://github.com/yourusername/react-use-anywhere
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
