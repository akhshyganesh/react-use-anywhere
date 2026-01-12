# Quick Start

Get up and running with React Use Anywhere in 5 minutes! We'll build a simple authentication flow that works from any service.

## Install

```bash
npm install react-use-anywhere
```

## Step 1: Setup Provider (30 seconds)

Wrap your app with `HookProvider` and register the hooks you want to use:

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth, // Your auth hook
      }}
    >
      <YourApp />
    </HookProvider>
  );
}
```

## Step 2: Create a Service (1 minute)

Create a service that can access your hooks:

```ts
// services/auth.ts
import { createSingletonService } from 'react-use-anywhere';

// Create services for each hook
export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');

// Now you can use hooks from anywhere!
export const login = async (email: string, password: string) => {
  try {
    const user = await api.login(email, password);

    // Set user (using auth hook)
    authService.use((auth) => auth.setUser(user));

    // Navigate to dashboard (using navigation hook)
    navigationService.use((navigate) => navigate('/dashboard'));

    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = () => {
  authService.use((auth) => auth.clearUser());
  navigationService.use((navigate) => navigate('/login'));
};
```

## Step 3: Connect in Component (30 seconds)

In any React component, connect the services to hooks:

```tsx
// components/LoginForm.tsx
import { useHookService } from 'react-use-anywhere';
import { authService, navigationService, login } from '../services/auth';

function LoginForm() {
  // Connect services to hooks (required!)
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  const handleLogin = async () => {
    await login('user@example.com', 'password');
    // Navigation happens automatically in the service!
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

## Step 4: Use Anywhere! (done!)

Now you can call your service functions from anywhere:

```ts
// utils/sessionManager.ts
import { logout } from '../services/auth';

export const checkSession = () => {
  if (isTokenExpired()) {
    logout(); // This will clear user and navigate to login!
  }
};
```

```ts
// api/interceptors.ts
import { logout } from '../services/auth';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout(); // Handle unauthorized responses
    }
    return Promise.reject(error);
  }
);
```

## Real-World Example

Here's a complete example you can copy-paste:

::: details Complete Auth Service

```ts
// services/auth.ts
import { createSingletonService } from 'react-use-anywhere';

export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');
export const notificationService = createSingletonService('notifications');

export const login = async (email: string, password: string) => {
  try {
    // Show loading
    notificationService.use((notify) => notify.info('Logging in...'));

    // API call
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Invalid credentials');

    const user = await response.json();

    // Update auth state
    authService.use((auth) => auth.setUser(user));

    // Show success message
    notificationService.use((notify) => notify.success('Welcome back!'));

    // Navigate to dashboard
    navigationService.use((navigate) => navigate('/dashboard'));

    return user;
  } catch (error) {
    // Show error
    notificationService.use((notify) =>
      notify.error('Login failed. Please try again.')
    );
    throw error;
  }
};

export const logout = () => {
  authService.use((auth) => auth.clearUser());
  notificationService.use((notify) => notify.info('Logged out'));
  navigationService.use((navigate) => navigate('/login'));
};

export const resetPassword = async (email: string) => {
  try {
    await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    notificationService.use((notify) =>
      notify.success('Password reset email sent!')
    );

    navigationService.use((navigate) => navigate('/login'));
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Failed to send reset email')
    );
  }
};
```

:::

::: details Complete App Setup

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

// Your custom hooks
function useAuth() {
  const [user, setUser] = useState(null);
  return {
    user,
    isAuthenticated: !!user,
    setUser,
    clearUser: () => setUser(null),
  };
}

function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  return {
    notifications,
    info: (msg) => setNotifications((prev) => [...prev, { type: 'info', msg }]),
    success: (msg) =>
      setNotifications((prev) => [...prev, { type: 'success', msg }]),
    error: (msg) =>
      setNotifications((prev) => [...prev, { type: 'error', msg }]),
  };
}

function App() {
  return (
    <BrowserRouter>
      <HookProvider
        hooks={{
          navigation: useNavigate,
          auth: useAuth,
          notifications: useNotifications,
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </HookProvider>
    </BrowserRouter>
  );
}
```

:::

::: details Complete Login Component

```tsx
// components/LoginPage.tsx
import { useState } from 'react';
import { useHookService } from 'react-use-anywhere';
import {
  authService,
  navigationService,
  notificationService,
  login,
} from '../services/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Connect all services (required!)
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');
  useHookService(notificationService, 'notifications');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      // Service handles navigation and notifications!
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setLoading(false);
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
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

:::

## Common Patterns

### Pattern 1: Service Chaining

```ts
export const completeOrder = async (orderData) => {
  // Process payment
  const payment = await processPayment(orderData);

  // Update cart
  cartService.use((cart) => cart.clear());

  // Show success
  notificationService.use((notify) => notify.success('Order completed!'));

  // Navigate to success page
  navigationService.use((navigate) => navigate(`/order-success/${payment.id}`));
};
```

### Pattern 2: Error Handling

```ts
export const updateProfile = async (profileData) => {
  try {
    const updatedUser = await api.updateProfile(profileData);
    authService.use((auth) => auth.setUser(updatedUser));
    notificationService.use((notify) => notify.success('Profile updated!'));
  } catch (error) {
    if (error.status === 401) {
      // Session expired
      logout();
    } else {
      notificationService.use((notify) => notify.error('Update failed'));
    }
  }
};
```

### Pattern 3: Conditional Logic

```ts
export const addToCart = (item) => {
  cartService.use((cart) => cart.addItem(item));

  // Check if user wants to go to cart
  const shouldNavigate = window.confirm('Go to cart?');
  if (shouldNavigate) {
    navigationService.use((navigate) => navigate('/cart'));
  }
};
```

## Next Steps

🎉 **You're ready!** You can now use React hooks anywhere in your app.

**What to explore next:**

- **[Core Concepts](/guide/core-concepts)** - Understand how it works under the hood
- **[Type Safety](/guide/type-safety)** - Add TypeScript for better developer experience
- **[Real Examples](/examples/basic-usage)** - More copy-paste examples
- **[API Reference](/api/overview)** - Complete function documentation

## Key Points to Remember

✅ **Create services** with `createSingletonService('hookName')`  
✅ **Connect services** in components with `useHookService(service, 'hookName')`  
✅ **Use `.use()` method** to access hook values in services  
✅ **Services work anywhere** once connected in a component

## Troubleshooting

**Service not working?** Make sure you:

1. Registered the hook in `HookProvider`
2. Connected the service with `useHookService` in a component
3. Used the correct hook name in both places

**TypeScript errors?** Check out our [Type Safety Guide](/guide/type-safety) for better typing.

Ready to build better React apps? Check out [Real Examples](/examples/basic-usage) next! →
