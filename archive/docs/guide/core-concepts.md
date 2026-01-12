# Core Concepts

Break free from React's component boundaries and use your hooks anywhere in your codebase! React Use Anywhere transforms how you think about state management by making React hooks accessible from utility functions, API layers, and any JavaScript code.

## The Problem This Solves

Ever wanted to call `useNavigate()` from a utility function? Or access your auth state from an API service? React's Rules of Hooks prevent this, forcing you to pass data through multiple layers or resort to complex state management solutions.

**React Use Anywhere changes everything.**

## How It Works - Three Simple Concepts

React Use Anywhere has three core parts that work together seamlessly:

1. **🏗️ HookProvider** - Executes hooks at the top level and makes values globally available
2. **🔧 Services** - Access hook values from anywhere using a simple `.use()` pattern
3. **🔌 Connections** - Link services to hooks in your React components

```
App Component
├── HookProvider (executes useNavigate, useAuth, etc.)
│   ├── Your Components (connect via useHookService)
│   └── Services everywhere (access via service.use())
```

**The magic?** Your hooks run once at the top level, following React's rules perfectly, while their values become accessible throughout your entire application.

## 1. HookProvider - Your Hook Execution Engine

The `HookProvider` is your gateway to hook freedom. It runs your hooks at the React component's top level and makes their values accessible throughout your entire application.

### Basic Setup

```tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <YourApp />
    </HookProvider>
  );
}
```

**That's it!** Now your hooks run once at the top level, and their values are available everywhere in your app.

### Type-Safe Provider (Recommended)

For better TypeScript support and developer experience:

```tsx
import { TypedHookProvider } from 'react-use-anywhere';
import type { NavigateFunction } from 'react-router-dom';

// Define your hook types for complete type safety
type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
};

function App() {
  return (
    <TypedHookProvider<AppHooks>
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <YourApp />
    </TypedHookProvider>
  );
}
```

### Key Features

- **Automatic Hook Execution**: All hooks are executed following React's Rules of Hooks
- **Error Handling**: Failed hooks are gracefully handled with warnings and fallback values
- **Type Safety**: Full TypeScript integration with compile-time validation
- **Performance Optimized**: Uses React's context system for efficient updates

## 2. Services - Access Hook Values Anywhere

Services are the bridge between your React hooks and the rest of your application. Create them once, use them everywhere - from utility functions to API calls to complex business logic.

```ts
import { createSingletonService } from 'react-use-anywhere';

// Create services that will hold your hook values
export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');

// Now use them anywhere in your codebase!
export const logout = () => {
  authService.use((auth) => auth.clearUser());
  navigationService.use((navigate) => navigate('/login'));
};

// In your API layer
export const apiRequest = async (url: string) => {
  const token = authService.use((auth) => auth.token);
  // Use token in request...
};

// In utility functions
export const redirectToProfile = (userId: string) => {
  navigationService.use((navigate) => navigate(`/profile/${userId}`));
};
```

### Why Services Are Game-Changing

- **🚀 Universal Access**: Use hooks from anywhere - no more prop drilling
- **🔧 Clean Architecture**: Separate business logic from UI components
- **📦 Modular Code**: Create reusable utility functions that access React state
- **🎯 Type Safe**: Full TypeScript support with excellent IntelliSense
- **⚡ Performance**: Efficient singleton pattern with smart updates

## 3. Connection - Link Services to Components

Connect your services to hooks in React components:

```tsx
import { useHookService } from 'react-use-anywhere';

function MyComponent() {
  // Connect services to their hook values
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <button onClick={logout}>Logout</button>;
}
```

## Type Safety for Better Developer Experience

For TypeScript projects, use typed versions for better IntelliSense and compile-time validation:

```tsx
// 1. Define your hook types
type AppHooks = {
  auth: () => AuthState;
  navigation: () => NavigateFunction;
};

// 2. Use TypedHookProvider
<TypedHookProvider<AppHooks> hooks={{...}}>
  <App />
</TypedHookProvider>

// 3. Create typed services
const authService = createStrictSingletonService<AppHooks>('auth');

// 4. Use typed connections
useTypedHookService(authService, 'auth');
```

## Real-World Example

Here's how everything works together in a typical app:

```tsx
// 1. Set up the provider
function App() {
  return (
    <HookProvider
      hooks={{
        auth: useAuth,
        navigation: useNavigate,
        theme: useTheme,
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </HookProvider>
  );
}

// 2. Create services
export const authService = createSingletonService('auth');
export const navigationService = createSingletonService('navigation');

// 3. Create business logic functions
export const loginAndRedirect = async (email: string, password: string) => {
  const success = await authService.use((auth) => auth.login(email, password));

  if (success) {
    navigationService.use((navigate) => navigate('/dashboard'));
  }
};

// 4. Connect services in components
function LoginPage() {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  const handleSubmit = () => loginAndRedirect(email, password);

  return <form onSubmit={handleSubmit}>...</form>;
}

// 5. Use anywhere in your codebase
// utils/api.js
export const makeAuthenticatedRequest = (url) => {
  const token = authService.use((auth) => auth.token);
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
```

## Why This Changes Everything

### Before React Use Anywhere

```tsx
// ❌ Prop drilling nightmare
function App() {
  const user = useAuth();
  const navigate = useNavigate();

  return <Dashboard user={user} navigate={navigate} />;
}

function Dashboard({ user, navigate }) {
  return <UserProfile user={user} navigate={navigate} />;
}

function UserProfile({ user, navigate }) {
  const handleLogout = () => {
    user.logout();
    navigate('/login'); // Finally can use it!
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// ❌ Can't use hooks in utilities
function apiCall() {
  // This doesn't work!
  const user = useAuth(); // Error: Rules of Hooks
  return fetch('/api', {
    headers: { Authorization: user.token },
  });
}
```

### After React Use Anywhere

```tsx
// ✅ Clean component structure
function App() {
  return (
    <HookProvider hooks={{ auth: useAuth, navigation: useNavigate }}>
      <Dashboard />
    </HookProvider>
  );
}

function Dashboard() {
  return <UserProfile />; // No props needed!
}

function UserProfile() {
  useHookService(authService, 'auth');
  useHookService(navigationService, 'navigation');

  return <button onClick={logout}>Logout</button>;
}

// ✅ Use hooks anywhere!
function apiCall() {
  const token = authService.use((auth) => auth.token);
  return fetch('/api', {
    headers: { Authorization: token },
  });
}
```

## Common Patterns That Become Simple

### API Layer with Authentication

```ts
// services/api.ts
export class ApiService {
  static async request(url: string, options: RequestInit = {}) {
    const token = authService.use((auth) => auth.token);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Auto-logout on auth failure
      authService.use((auth) => auth.logout());
      navigationService.use((navigate) => navigate('/login'));
      throw new Error('Authentication failed');
    }

    return response.json();
  }
}
```

### Global Event Handlers

```ts
// utils/shortcuts.ts
export const setupKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      // Open command palette
      modalService.use((modal) => modal.openCommandPalette());
    }

    if (e.key === 'Escape') {
      // Close any open modals
      modalService.use((modal) => modal.closeAll());
    }
  });
};
```

### Form Validation with Navigation

```ts
// utils/form.ts
export const handleFormSubmit = async (data: FormData) => {
  const isValid = validateForm(data);

  if (!isValid) {
    notificationService.use((notify) =>
      notify.error('Please fix the form errors')
    );
    return;
  }

  try {
    await ApiService.request('/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    notificationService.use((notify) =>
      notify.success('Form submitted successfully!')
    );

    navigationService.use((navigate) => navigate('/success'));
  } catch (error) {
    notificationService.use((notify) => notify.error('Submission failed'));
  }
};
```

## That's It!

Those are the core concepts. Most apps only need:

- `HookProvider` to run hooks
- `createSingletonService()` to create services
- `useHookService()` to connect them

The beauty of React Use Anywhere is its simplicity - you can start using it immediately with just these three concepts, yet it scales to handle complex applications with ease.

## Why You Should Use React Use Anywhere

### 🚀 **Instant Productivity Boost**

Stop fighting against React's Rules of Hooks. Start writing utility functions that can access your React state directly.

### 🧹 **Cleaner Architecture**

Separate your business logic from UI components. Create reusable functions that work anywhere in your codebase.

### 🎯 **Type Safety First**

Built with TypeScript in mind. Get excellent IntelliSense and catch errors at compile time.

### ⚡ **Zero Learning Curve**

If you know React hooks, you already know 90% of React Use Anywhere. The API is intuitive and familiar.

### 🛠️ **Production Ready**

Used in production applications. Handles errors gracefully, optimizes performance automatically, and works with all React patterns.

## Next Steps

Ready to transform your React development experience?

- **[Quick Start Guide](./quick-start.md)** - Get up and running in 5 minutes
- **[Real Examples](../examples/basic-usage.md)** - Copy-paste code for common use cases
- **[Type Safety Guide](./type-safety.md)** - Advanced TypeScript usage
- **[API Reference](../api/overview.md)** - Complete function documentation

**Start today** and see how React Use Anywhere eliminates prop drilling, simplifies state management, and makes your React code more maintainable than ever before!
