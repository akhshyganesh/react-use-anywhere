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

```typescript
// In your service file (not a React component!)
import { useHookService } from 'react-use-anywhere';

export const authService = {
  async login(credentials: LoginCredentials) {
    const navigate = useHookService('navigation');
    const { setUser } = useHookService('auth');

    try {
      const user = await api.login(credentials);
      setUser(user);
      navigate('/dashboard'); // Navigate from service layer!
    } catch (error) {
      console.error('Login failed:', error);
    }
  },
};
```

Get started with our [installation guide](/guide/installation) or jump into [examples](/examples/basic-usage)!
