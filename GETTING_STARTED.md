# Getting Started with React Use Anywhere

Welcome! 👋 This guide will help you get started in just a few minutes.

## What You'll Learn

1. **Install** the library (30 seconds)
2. **Basic Setup** - Your first working example (2 minutes)
3. **Add More Hooks** - Expand to auth, theme, etc. (2 minutes)
4. **Use Everywhere** - Call from services and utilities (1 minute)

---

## Step 1: Install (30 seconds)

```bash
npm install react-use-anywhere
```

That's it! ✅

---

## Step 2: Basic Setup (2 minutes)

Let's create a simple navigation service that works from anywhere.

### A. Wrap Your App

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom'; // or any router

function App() {
  return (
    <HookProvider hooks={{ navigate: useNavigate }}>
      <YourApp />
    </HookProvider>
  );
}
```

### B. Create a Service

```typescript
// services/navigation.ts
import { createSingletonService } from 'react-use-anywhere';

export const navService = createSingletonService('navigate');

// Now you can navigate from anywhere!
export const goHome = () => {
  navService.use((navigate) => navigate('/'));
};

export const goToProfile = (userId: string) => {
  navService.use((navigate) => navigate(`/profile/${userId}`));
};
```

### C. Connect in a Component

```tsx
// components/MyComponent.tsx
import { useHookService } from 'react-use-anywhere';
import { navService, goHome } from '../services/navigation';

function MyComponent() {
  // Connect the service to the hook
  useHookService(navService, 'navigate');

  return <button onClick={goHome}>Go Home</button>;
}
```

**🎉 Done!** You can now call `goHome()` from anywhere in your code!

---

## Step 3: Add More Hooks (2 minutes)

Let's add authentication and notifications.

### A. Create Auth Hook

```typescript
// hooks/useAuth.ts
import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  return {
    user,
    setUser,
    logout: () => setUser(null),
    isAuthenticated: !!user,
  };
};
```

### B. Update Provider

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

function App() {
  return (
    <HookProvider
      hooks={{
        navigate: useNavigate,
        auth: useAuth, // ✨ Added auth
      }}
    >
      <YourApp />
    </HookProvider>
  );
}
```

### C. Create Auth Service

```typescript
// services/auth.ts
import { createSingletonService } from 'react-use-anywhere';
import { navService } from './navigation';

export const authService = createSingletonService('auth');

export const login = async (email: string, password: string) => {
  const user = await api.login(email, password);
  authService.use((auth) => auth.setUser(user));
  navService.use((navigate) => navigate('/dashboard'));
};

export const logout = () => {
  authService.use((auth) => auth.logout());
  navService.use((navigate) => navigate('/login'));
};
```

### D. Connect in Component

```tsx
// components/Dashboard.tsx
import { useHookService } from 'react-use-anywhere';
import { authService, logout } from '../services/auth';
import { navService } from '../services/navigation';

function Dashboard() {
  useHookService(authService, 'auth');
  useHookService(navService, 'navigate');

  return <button onClick={logout}>Logout</button>;
}
```

**🎉 Perfect!** Now you have auth working everywhere!

---

## Step 4: Use Everywhere (1 minute)

The magic is that you can now call these services from **anywhere**:

### In API Calls

```typescript
// services/api.ts
import { authService } from './auth';
import { navService } from './navigation';

export const fetchData = async (endpoint: string) => {
  const response = await fetch(endpoint);

  if (response.status === 401) {
    // Logout and redirect from API layer!
    authService.use((auth) => auth.logout());
    navService.use((nav) => nav('/login'));
  }

  return response.json();
};
```

### In Utilities

```typescript
// utils/helpers.ts
import { navService } from '../services/navigation';

export const redirectToItem = (itemId: string) => {
  navService.use((navigate) => navigate(`/items/${itemId}`));
};
```

### In Business Logic

```typescript
// services/cart.ts
export const checkout = async (items: Item[]) => {
  if (items.length === 0) {
    navService.use((nav) => nav('/shop'));
    return;
  }

  await processPayment(items);
  navService.use((nav) => nav('/success'));
};
```

---

## What's Next?

Now that you understand the basics, explore:

- **[Full Documentation](./docs)** - Deep dive into all features
- **[Examples](./examples)** - Real-world patterns
- **[Demo App](./demo)** - See it in action
- **[API Reference](./docs/api)** - Complete API docs

## Common Patterns

### Pattern 1: Create Service Once, Use Everywhere

```typescript
// Create once
export const themeService = createSingletonService('theme');

// Use in multiple places
export const toggleDarkMode = () => {
  themeService.use((theme) => theme.toggle());
};

export const setTheme = (name: string) => {
  themeService.use((theme) => theme.set(name));
};
```

### Pattern 2: Multiple Services Together

```typescript
export const completeAction = async () => {
  // Use multiple services together
  const result = await doSomething();

  authService.use((auth) => auth.update(result));
  notifyService.use((notify) => notify.success('Done!'));
  navService.use((nav) => nav('/success'));
};
```

### Pattern 3: Conditional Logic

```typescript
export const protectedAction = () => {
  const isAuth = authService.use((auth) => auth.isAuthenticated);

  if (!isAuth) {
    navService.use((nav) => nav('/login'));
    return;
  }

  // Continue with action...
};
```

---

## Tips for Success

✅ **Connect services in components** - Use `useHookService` in any component that uses the service

✅ **Create service files** - Organize services by domain (auth, navigation, theme, etc.)

✅ **Keep UI separate** - Components for rendering, services for logic

✅ **Test easily** - Services are easy to mock and test

❌ **Don't overuse** - Simple props are fine for simple cases

❌ **Don't forget connections** - Always connect services with `useHookService`

---

## Need Help?

- 📖 **[Read the docs](./docs)**
- 💬 **[Ask questions](https://github.com/akhshyganesh/react-use-anywhere/issues)**
- 🐛 **[Report bugs](https://github.com/akhshyganesh/react-use-anywhere/issues)**
- ⭐ **[Star the repo](https://github.com/akhshyganesh/react-use-anywhere)**

---

**You're ready to build! 🚀**

Start by adding one service to your app and see how it simplifies your code. Then gradually add more as needed.
