# React Use Anywhere

> **Break free from React component boundaries** – use your favorite React hooks in services, utilities, business logic, and anywhere else in your codebase! 🚀

## 🎯 What is React Use Anywhere?

A revolutionary library that enables you to use React hooks **anywhere** in your codebase — not just in components! Access `useNavigate`, `useAuth`, `useTheme`, and any custom hooks from services, utilities, and business logic files.

### ❌ The Problem

```ts
// This doesn't work – hooks only work in components
export const authService = {
  login: async (credentials) => {
    const navigate = useNavigate(); // ❌ Invalid hook call
    const user = await api.login(credentials);
    navigate('/dashboard'); // ❌ Can't navigate from service
  },
};
```

### ✅ The Solution

```ts
// This works perfectly with React Use Anywhere!
const authService = createSingletonService('auth');
const navigationService = createSingletonService('navigate');

export const authModule = {
  login: async (credentials) => {
    const user = await api.login(credentials);
    authService.use((auth) => auth.setUser(user));
    navigationService.use((nav) => nav('/dashboard'));
  },
};
```

## Why React Use Anywhere?

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 24px 0;">

\::: tip 🎯 Use Hooks Anywhere
Break free from component boundaries! Access hooks from services, utilities, and business logic.
\:::

\::: tip 🏗️ Clean Architecture
Scalable apps with separation of concerns. No prop drilling or tight coupling.
\:::

\::: tip 🛡️ Type-Safe & Zero Overhead
Full TypeScript support, compile-time validation, and near-zero performance impact.
\:::

\::: tip ⚡ Works With Everything
Compatible with React Router, TanStack Router, Next.js, and any React hooks.
\:::

</div>

## Quick Example

**Problem:** You want to redirect users after a successful API call, but the API logic lives in a service, not a component.

**Solution:** React Use Anywhere lets you access React hooks from services!

```ts
// 1. Create a service (e.g., authService.ts)
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');

export const login = async (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    auth.login(credentials.email, credentials.password);
  });
};
```

```tsx
// 2. Connect the service to a hook (in a React component)
import { useHookService } from 'react-use-anywhere';
import { authService } from '../services/authService';

function MyComponent() {
  useHookService(authService, 'auth');
  return <div>My Component</div>;
}
```

```tsx
// 3. Setup the HookProvider at the root
import { HookProvider } from 'react-use-anywhere';
import { useAuth } from './hooks/useAuth';

function App() {
  return (
    <HookProvider hooks={{ auth: useAuth }}>
      <MyComponent />
    </HookProvider>
  );
}
```

👉 [Full Introduction & Guide](/guide/introduction)

## Core Features

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 32px 0;">

### 🛡️ Type-Safe Development

Full TypeScript support with compile-time validation.

### ⚡ Zero Runtime Overhead

Minimal performance cost via dependency injection.

### 🔧 Framework Agnostic

Works with any React stack — Router, Next.js, etc.

### 🧪 Testable Architecture

Easily test business logic without rendering components.

### 🏗️ Clean Separation

Keep logic decoupled from presentation.

### 🎯 Universal Hook Access

Use any hook anywhere — even custom ones.

</div>

## What Makes This Special?

- **🎯 Hook Agnostic:** Works with any React hook.
- **🏗️ Clean Architecture:** Maintainable, scalable apps.
- **🧪 Simple Testing:** Test logic without React trees.
- **📈 Enterprise-Ready:** Ideal for large, growing codebases.

**Ready to revolutionize your React architecture?**
📘 Start here → [Complete Introduction](/guide/introduction)
