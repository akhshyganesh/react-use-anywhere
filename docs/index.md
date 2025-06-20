# React Use Anywhere Documentation

Welcome to the React Use Anywhere documentation! 🚀

Use React hooks anywhere in your codebase - even in plain JavaScript/TypeScript files!

## Quick Navigation

- **[Getting Started](/guide/introduction)** - Learn what React Use Anywhere is and why you need it
- **[Installation](/guide/installation)** - Get up and running in minutes
- **[API Reference](/api/overview)** - Complete API documentation
- **[Examples](/examples/basic-usage)** - Real-world usage examples
- **[Live Demo](/demo/)** - Interactive demonstration

## Key Features

::: tip 🎯 Use Hooks Anywhere
Not just in React components - access hooks from services, utilities, business logic, anywhere!
:::

::: tip 🔧 Service-Oriented Architecture
Perfect for clean architecture patterns with dependency injection
:::

::: tip 🛡️ Type-Safe
Full TypeScript support with compile-time validation
:::

::: tip ⚡ Zero Boilerplate
Simple setup, powerful results
:::

## What You Can Do

- **Call navigation from service layers** (e.g., redirect after API calls)
- **Access user authentication state in utility functions**
- **Update themes from business logic files**
- **Use React Context values outside components**
- **Create clean, testable service architectures**

## Quick Example

Make sure you have **'auth'** keyboard constant which is given in createSingletonService, useHookService and key in hooks of HookProvider

```typescript
// 1. Create a service (in service file)
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');

export const login = async (credentials: LoginCredentials) => {
  return authService.use((auth) => {
    // Use auth hook value directly
    auth.login(credentials.email, credentials.password);
  });
};
```

```tsx
// 2. Connect service to hook (in React component)
import { useHookService } from 'react-use-anywhere';
import { authService } from '../services/authService';

function MyComponent() {
  // Connect the service to the hook
  useHookService(authService, 'auth');

  return <div>My Component</div>;
}
```

```tsx
// 3. Warp HookProvider in App Component
import { HookProvider } from 'react-use-anywhere';
import { useAuth } from './hooks/useAuth';

function App() {
  return (
    <HookProvider
      hooks={{
        auth: useAuth,
      }}
    >
      <MyComponent />
    </HookProvider>
  );
}
```

Get started with our [installation guide](/guide/installation) or jump into [examples](/examples/basic-usage)!
