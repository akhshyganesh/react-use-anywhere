# Quick Start

Let's build your first service using React Use Anywhere in just 5 minutes!

## Step 1: Setup the Provider

First, wrap your app with the `HookProvider` and register your hooks:

```tsx
// App.tsx
import React from 'react';
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { MainComponent } from './components/MainComponent';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
      }}
    >
      <MainComponent />
    </HookProvider>
  );
}

export default App;
```

## Step 2: Create Your First Service

Create a service using `createSingletonService`:

```typescript
// services/authService.ts
import { createSingletonService } from 'react-use-anywhere';

// Create a singleton service for the 'auth' hook
export const authService = createSingletonService('auth');

export const login = async (email: string, password: string) => {
  return authService.use((auth) => {
    // Access the auth hook value
    auth.setLoading(true);

    try {
      // Simulate API call
      const user = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());

      auth.setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      auth.setLoading(false);
    }
  });
};

export const logout = () => {
  return authService.use((auth) => {
    auth.clearUser();
  });
};
```

## Step 3: Connect Service to Hook

In your React component, connect the service to the hook:

```tsx
// components/LoginForm.tsx
import React, { useState } from 'react';
import { useHookService } from 'react-use-anywhere';
import { authService, login } from '../services/authService';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Connect the service to the hook - this is required!
  useHookService(authService, 'auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      // Service handles the login logic
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Step 4: Create More Services

Add more services for different concerns:

```typescript
// services/navigationService.ts
import { createSingletonService } from 'react-use-anywhere';

export const navigationService = createSingletonService('navigate');

export const goToHome = () => {
  return navigationService.use((navigate) => {
    navigate('/');
  });
};

export const goToLogin = () => {
  return navigationService.use((navigate) => {
    navigate('/login');
  });
};
```

```tsx
// components/Navigation.tsx - Don't forget to connect!
import React from 'react';
import { useHookService } from 'react-use-anywhere';
import {
  navigationService,
  goToHome,
  goToLogin,
} from '../services/navigationService';

export function Navigation() {
  // Connect service to hook
  useHookService(navigationService, 'navigate');

  return (
    <nav>
      <button onClick={goToHome}>Home</button>
      <button onClick={goToLogin}>Login</button>
    </nav>
  );
}
```

```typescript
// services/themeService.ts
import { createSingletonService } from 'react-use-anywhere';

export const themeService = createSingletonService('theme');

export const toggleTheme = () => {
  return themeService.use((theme) => {
    theme.toggle();

    // Save to localStorage
    localStorage.setItem('theme', theme.theme);
    return theme.theme;
  });
};

export const getCurrentTheme = () => {
  return themeService.use((theme) => {
    return theme.theme;
  });
};
```

## Step 5: Combine Services

Services can call other services:

```typescript
// services/userService.ts
import { createSingletonService } from 'react-use-anywhere';
import { logout } from './authService';
import { goToHome } from './navigationService';

export const userService = createSingletonService('auth');

export const updateProfile = async (profileData: ProfileData) => {
  return userService.use(async (auth) => {
    try {
      const updatedUser = await api.updateProfile(auth.user.id, profileData);
      auth.setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      if (error.status === 401) {
        // Session expired, logout user
        await logout();
        goToHome();
      }
      throw error;
    }
  });
};
```

## Complete Example

Here's a full working example based on the actual demo implementation:

::: details Complete App.tsx

```tsx
import React, { useState } from 'react';
import { HookProvider } from 'react-use-anywhere';

// Define hook types for type safety
type NavigateFunction = (path: string) => void;
type AuthState = {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
};
type ThemeState = {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggle: () => void;
};

// Custom hooks
const useNavigation = (): NavigateFunction => {
  return (path: string) => {
    console.log(`Navigating to: ${path}`);
    window.location.hash = path;
  };
};

const useAuth = (): AuthState => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  return {
    user,
    isAuthenticated: Boolean(user),
    login: (name: string, email: string) => {
      setUser({ name, email });
      console.log('User logged in:', { name, email });
    },
    logout: () => {
      setUser(null);
      console.log('User logged out');
    },
  };
};

const useTheme = (): ThemeState => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      console.log('Theme changed to:', newTheme);
    },
  };
};

function App() {
  return (
    <HookProvider
      hooks={{
        navigate: useNavigation,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <MyComponent />
    </HookProvider>
  );
}

export default App;
```

:::

## What's Next?

🎉 **Congratulations!** You've built your first service with React Use Anywhere.

**Next steps:**

- **[Learn Core Concepts](/guide/core-concepts)** - Understand how everything works
- **[Add Type Safety](/guide/type-safety)** - Make your code more robust
- **[Explore Examples](/examples/basic-usage)** - See real-world usage patterns
- **[Try the Demo](/demo/)** - Interactive playground

## Key Takeaways

✅ **Create services with `createSingletonService`** - Use this to create services that can access hooks  
✅ **Connect services in React components** - Use `useHookService(service, 'hookName')` to connect  
✅ **Access hook values with `.use()`** - Services use `.use(callback)` to access hook values  
✅ **Services are reusable** - Same service can be connected in multiple components  
✅ **Type-safe variants available** - Use `createTypedSingletonService` for type safety

## Important Notes

🚨 **Services must be connected** - Always use `useHookService` in a React component to connect your service to a hook  
🚨 **Use `.use()` method** - Services access hook values via the `.use(callback)` method  
🚨 **Singleton pattern recommended** - Use `createSingletonService` instead of `createHookService` for better performance

Ready to dive deeper? Check out [Core Concepts](/guide/core-concepts) next!
