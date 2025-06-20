# Introduction

## What is React Use Anywhere?

**React Use Anywhere** is a revolutionary library that breaks the traditional boundaries of React hooks. While React hooks are typically confined to functional components, this library enables you to use them anywhere in your codebase - services, utilities, business logic files, anywhere!

## The Problem It Solves

Traditional React development often leads to these frustrating scenarios:

### 🚫 Before React Use Anywhere

```typescript
// ❌ This doesn't work - hooks can only be used in components
export const authService = {
  login: async (credentials) => {
    const navigate = useNavigate(); // ❌ Error: Invalid hook call
    const user = await api.login(credentials);
    navigate('/dashboard'); // ❌ Can't navigate from service
  }
};

// ❌ You're forced to pass everything as props
function MyComponent({ navigate, setUser, setTheme }) {
  // Props drilling nightmare
  return <SomeChild navigate={navigate} setUser={setUser} setTheme={setTheme} />;
}
```

### ✅ After React Use Anywhere

```typescript
// ✅ This works perfectly!
import { createSingletonService } from 'react-use-anywhere';

const navigationService = createSingletonService('navigate');
const authService = createSingletonService('auth');

export const authServiceModule = {
  login: async (credentials) => {
    const user = await api.login(credentials);

    authService.use((auth) => {
      auth.setUser(user);
    });

    navigationService.use((navigate) => {
      navigate('/dashboard'); // ✅ Navigate from service layer!
    });
  }
};

// ✅ Clean, focused components
function MyComponent() {
  // Connect services to hooks
  useHookService(navigationService, 'navigate');
  useHookService(authService, 'auth');

  return <SomeChild />;
}
```

## Why This Matters

### 🏗️ **Clean Architecture**

Separate your business logic from UI components. Create service layers that can handle navigation, authentication, theming, and more.

### 🧪 **Better Testing**

Test your business logic independently without mounting React components or mocking navigation.

### 🔄 **Reusability**

Write once, use anywhere. Your services work across different components and even different applications.

### 📈 **Scalability**

As your application grows, maintain clean separation of concerns without prop drilling or complex context management.

## How It Works

React Use Anywhere uses a clever dependency injection pattern:

1. **Provider Setup**: Wrap your app with `HookProvider` and register your hooks
2. **Service Creation**: Create services that can access hooks using `useHookService`
3. **Anywhere Access**: Use your services anywhere in your codebase

The library maintains the React lifecycle and ensures hooks work exactly as they would in components, but with the flexibility to call them from anywhere.

## What Makes It Special

- **🎯 Hook Agnostic**: Works with any React hook - built-in or custom
- **🛡️ Type Safe**: Full TypeScript support with compile-time validation
- **⚡ Zero Runtime Overhead**: Minimal performance impact
- **🔧 Framework Agnostic**: Works with React Router, Tanstack Router, Next.js, etc.
- **📦 Tiny Bundle**: Minimal size impact on your application

## Real-World Use Cases

- **E-commerce**: Handle cart updates and navigation from service layer
- **Authentication**: Manage login/logout flows from business logic
- **Analytics**: Track events and navigate based on user behavior
- **Theme Management**: Update themes from system preferences or user actions
- **Data Fetching**: Handle loading states and error navigation
- **Multi-tenant Apps**: Switch contexts and navigate based on tenant selection

Ready to get started? Check out our [installation guide](/guide/installation)!
