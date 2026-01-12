# Navigation Examples

Simple, practical navigation patterns that work with any React router using react-use-anywhere.

## Why Use react-use-anywhere for Navigation?

Navigation is a perfect use case for react-use-anywhere because:

- **Access navigation from anywhere** - services, utilities, event handlers
- **Router-agnostic** - works with React Router, Next.js, TanStack Router, etc.
- **Clean separation** - keep navigation logic out of components
- **Easy testing** - mock navigation in tests easily

## Basic Navigation Service

Works with React Router, TanStack Router, Next.js, etc:

```ts
// services/navigation.ts
import { createSingletonService } from 'react-use-anywhere';

export const navigationService = createSingletonService('navigation');

export const nav = {
  // Basic navigation
  goTo(path: string) {
    navigationService.use((navigate) => navigate(path));
  },

  // Go back
  goBack() {
    navigationService.use((navigate) => navigate(-1));
  },

  // Replace current route
  replace(path: string) {
    navigationService.use((navigate) => navigate(path, { replace: true }));
  },

  // Navigation with state
  goWithState(path: string, state: any) {
    navigationService.use((navigate) => navigate(path, { state }));
  },
};
```

## Setup with React Router

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { navigationService } from './services/navigation';

function AppContent() {
  const navigate = useNavigate();

  return (
    <HookProvider hooks={{ navigation: navigate }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
```

## Using Navigation in Components

```tsx
// components/Navigation.tsx
import React from 'react';
import { nav } from '../services/navigation';

function Navigation() {
  return (
    <nav>
      <button onClick={() => nav.goTo('/')}>Home</button>
      <button onClick={() => nav.goTo('/dashboard')}>Dashboard</button>
      <button onClick={() => nav.goBack()}>Back</button>
    </nav>
  );
}
```

## Smart Navigation Service

Navigation with auth checks and redirects:

```ts
// services/smartNav.ts
import { createSingletonService } from 'react-use-anywhere';

const navigationService = createSingletonService('navigation');
const authService = createSingletonService('auth');

export const smartNav = {
  // Navigate to user area (redirect to login if not authenticated)
  goToUserArea() {
    authService.use((auth) => {
      if (!auth.isAuthenticated) {
        navigationService.use((navigate) => navigate('/login'));
        return;
      }

      // Navigate based on role
      const path = auth.user?.role === 'admin' ? '/admin' : '/dashboard';
      navigationService.use((navigate) => navigate(path));
    });
  },

  // Protected navigation
  goToProtected(path: string) {
    authService.use((auth) => {
      if (auth.isAuthenticated) {
        navigationService.use((navigate) => navigate(path));
      } else {
        // Store intended destination
        localStorage.setItem('redirectAfterLogin', path);
        navigationService.use((navigate) => navigate('/login'));
      }
    });
  },

  // Post-login redirect
  handleLoginSuccess() {
    const redirectPath =
      localStorage.getItem('redirectAfterLogin') || '/dashboard';
    localStorage.removeItem('redirectAfterLogin');
    navigationService.use((navigate) => navigate(redirectPath));
  },
};
```

## Component Integration

```tsx
// components/UserArea.tsx
import React from 'react';
import { smartNav } from '../services/smartNav';

function UserArea() {
  return (
    <div>
      <button onClick={() => smartNav.goToUserArea()}>Go to Dashboard</button>
      <button onClick={() => smartNav.goToProtected('/settings')}>
        Settings
      </button>
    </div>
  );
}
```

## Workflow Navigation

Navigate as part of complex workflows:

```ts
// services/checkout.ts
import { createSingletonService } from 'react-use-anywhere';

const navigationService = createSingletonService('navigation');
const cartService = createSingletonService('cart');
const notificationService = createSingletonService('notifications');

export const checkout = {
  async completeOrder(orderData: OrderData) {
    try {
      const order = await api.createOrder(orderData);

      // Clear cart
      cartService.use((cart) => cart.clear());

      // Show success message
      notificationService.use((notify) =>
        notify.success('Order placed successfully!')
      );

      // Navigate to confirmation
      navigationService.use((navigate) =>
        navigate('/order-confirmation', { state: { orderId: order.id } })
      );
    } catch (error) {
      notificationService.use((notify) => notify.error('Order failed'));
      // Stay on checkout page
    }
  },
};
```

## Next.js Integration

```tsx
// For Next.js App Router
import { useRouter } from 'next/navigation';
import { HookProvider } from 'react-use-anywhere';

function App({ children }) {
  const router = useRouter();

  return <HookProvider hooks={{ navigation: router }}>{children}</HookProvider>;
}

// Service works the same way
export const nextNav = {
  goTo(path: string) {
    navigationService.use((router) => router.push(path));
  },

  replace(path: string) {
    navigationService.use((router) => router.replace(path));
  },
};
```

## TanStack Router Integration

```tsx
// For TanStack Router
import { useNavigate } from '@tanstack/react-router';
import { HookProvider } from 'react-use-anywhere';

function App({ children }) {
  const navigate = useNavigate();

  return (
    <HookProvider hooks={{ navigation: navigate }}>{children}</HookProvider>
  );
}

// Same service patterns work!
```

## Error Handling

```ts
export const safeNav = {
  goTo(path: string) {
    try {
      navigationService.use((navigate) => navigate(path));
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback behavior
      window.location.href = path;
    }
  },
};
```

That's it! These patterns work with any React router and keep your navigation logic clean and reusable.
