# React Use Anywhere

[![npm version](https://badge.fury.io/js/react-use-anywhere.svg)](https://badge.fury.io/js/react-use-anywhere)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Use React hooks **anywhere** in your codebase - in services, utilities, and business logic files. Works with any React hooks and any router.

## 🚀 Features

- ✅ **TypeScript Support**: Complete type safety
- ✅ **Zero Dependencies**: Uses peer dependencies only
- ✅ **Hook-Agnostic**: Works with any React hooks (navigation, auth, state, custom hooks, etc.)
- ✅ **Router-Agnostic**: Works with any React router or no router at all
- ✅ **Simple API**: Easy to use and understand
- ✅ **Tree Shakeable**: Optimized bundle size

## 📦 Installation

```bash
npm install react-use-anywhere
```

## 🎯 Quick Start

### 1. Wrap your app with the provider

```tsx
import React from 'react';
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom'; // or any navigation hook

function App() {
  return (
    <HookProvider hooks={{ navigate: useNavigate, auth: useAuth }}>
      <HomePage />
    </HookProvider>
  );
}
```

### 2. Create a service

```tsx
import { createHookService } from 'react-use-anywhere';

export const navigationService = createHookService();
export const authService = createHookService();
```

### 3. Connect the service to hooks in a React component

```tsx
import { useHookService } from 'react-use-anywhere';

function HomePage() {
  // Connect services to hooks
  useHookService(navigationService, 'navigate');
  useHookService(authService, 'auth');
  
  return <div>Welcome!</div>;
}
```

### 4. Use the service anywhere

```typescript
// services/userService.ts
import { navigationService, authService } from './services';

export function handleLogout() {
  // Use hooks from anywhere in your codebase
  authService.use((auth) => auth.logout());
  navigationService.use((navigate) => navigate('/login'));
}
```

## 🎨 Advanced Example

```tsx
import React, { useState } from 'react';
import { HookProvider, createHookService, useHookService } from 'react-use-anywhere';

// Create services
const navigationService = createHookService();
const themeService = createHookService();

// Custom hooks
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') };
};

// Business logic (works anywhere)
export const toggleAppTheme = () => {
  themeService.use((theme) => theme.toggleTheme());
  navigationService.use((navigate) => navigate('/dashboard'));
};

function App() {
  return (
    <HookProvider hooks={{ 
      navigate: useNavigate, 
      theme: useTheme 
    }}>
      <HomePage />
    </HookProvider>
  );
}

function HomePage() {
  useHookService(navigationService, 'navigate');
  useHookService(themeService, 'theme');
  
  return (
    <button onClick={toggleAppTheme}>
      Toggle Theme & Navigate
    </button>
  );
}
```

## 📚 API Reference

### `HookProvider`
Provider component that makes hooks available to services.

```tsx
<HookProvider hooks={{ hookName: useHook }}>
  <App />
</HookProvider>
```

### `createHookService()`
Creates a service that can store and use hook values.

```tsx
const service = createHookService();
```

### `useHookService(service, hookName)`
Connects a service to a hook from the provider.

```tsx
useHookService(navigationService, 'navigate');
```

### Service Methods

```tsx
// Use the hook value
service.use((hookValue) => {
  // Use the hook value here
});

// Get the current value
const value = service.get();

// Check if ready
const isReady = service.isReady();
```

## 🔄 Router Examples

### React Router v6
```tsx
import { useNavigate } from 'react-router-dom';

<HookProvider hooks={{ navigate: useNavigate }}>
  <App />
</HookProvider>
```

### TanStack Router
```tsx
import { useRouter } from '@tanstack/router';

<HookProvider hooks={{ navigate: () => useRouter().navigate }}>
  <App />
</HookProvider>
```

### Next.js
```tsx
import { useRouter } from 'next/router';

<HookProvider hooks={{ navigate: () => useRouter().push }}>
  <App />
</HookProvider>
```

## 🧪 Testing

```typescript
import { createHookService } from 'react-use-anywhere';

const mockService = createHookService();
mockService._setValue(mockHookValue);

// Test your business logic
```

## 📄 License

MIT © [akhshyganesh](https://github.com/akhshyganesh) 
