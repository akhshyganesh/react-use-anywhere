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

Create a service that can access your hooks:

```typescript
// services/authService.ts
import { useHookService } from 'react-use-anywhere';

export const authService = {
  async login(email: string, password: string) {
    const navigate = useHookService('navigation');
    const { setUser, setLoading } = useHookService('auth');

    try {
      setLoading(true);

      // Simulate API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const user = await response.json();
      setUser(user);

      // Navigate from service layer! 🎉
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Could also navigate to error page
      navigate('/login?error=true');
    } finally {
      setLoading(false);
    }
  },

  logout() {
    const navigate = useHookService('navigation');
    const { clearUser } = useHookService('auth');

    clearUser();
    navigate('/login');
  },
};
```

## Step 3: Use Your Service

Now use your service from anywhere - components, other services, utilities:

```tsx
// components/LoginForm.tsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call service method - it handles navigation internally
    await authService.login(email, password);
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
// services/themeService.ts
import { useHookService } from 'react-use-anywhere';

export const themeService = {
  toggleTheme() {
    const { theme, setTheme } = useHookService('theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  },

  initializeTheme() {
    const { setTheme } = useHookService('theme');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Use system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  },
};
```

```typescript
// services/analyticsService.ts
import { useHookService } from 'react-use-anywhere';

export const analyticsService = {
  trackUserAction(action: string, data?: any) {
    const { user } = useHookService('auth');
    const navigate = useHookService('navigation');

    // Track the event
    analytics.track(action, {
      userId: user?.id,
      timestamp: Date.now(),
      ...data,
    });

    // Redirect premium users to special page
    if (user?.isPremium && action === 'upgrade_attempt') {
      navigate('/premium-dashboard');
    }
  },
};
```

## Step 5: Combine Services

Services can call other services:

```typescript
// services/userService.ts
import { useHookService } from 'react-use-anywhere';
import { authService } from './authService';
import { analyticsService } from './analyticsService';

export const userService = {
  async updateProfile(profileData: ProfileData) {
    const { user, setUser } = useHookService('auth');
    const navigate = useHookService('navigation');

    try {
      const updatedUser = await api.updateProfile(user.id, profileData);
      setUser(updatedUser);

      // Track the action
      analyticsService.trackUserAction('profile_updated', {
        fields: Object.keys(profileData),
      });

      navigate('/profile?updated=true');
    } catch (error) {
      if (error.status === 401) {
        // Session expired, logout user
        authService.logout();
      }
      throw error;
    }
  },
};
```

## Complete Example

Here's a full working example:

::: details Complete App.tsx

```tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HookProvider } from 'react-use-anywhere';

// Custom hooks
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    setUser,
    setLoading,
    clearUser: () => setUser(null),
  };
}

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return {
    theme,
    setTheme,
    isDark: theme === 'dark',
  };
}

// Main App component
function AppContent() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HookProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
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

✅ **Services can access hooks** - Use `useHookService` to access any registered hook  
✅ **Navigation from anywhere** - Redirect users from service layer  
✅ **Clean separation** - Business logic separate from UI components  
✅ **Composable services** - Services can call other services  
✅ **Type-safe** - Full TypeScript support available

Ready to dive deeper? Check out [Core Concepts](/guide/core-concepts) next!
