# Core Concepts

Understanding the core concepts of React Use Anywhere will help you build more effective and maintainable applications.

## Architecture Overview

React Use Anywhere uses a **dependency injection pattern** to make React hooks available outside of components:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Components    │    │    Services     │                │
│  │                 │    │                 │                │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │                │
│  │ │   Hooks     │ │    │ │ useHookSvc  │ │                │
│  │ │             │ │    │ │             │ │                │
│  │ └─────────────┘ │    │ └─────────────┘ │                │
│  └─────────────────┘    └─────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│                   HookProvider                              │
│               (Hook Registry)                               │
└─────────────────────────────────────────────────────────────┘
```

## 1. HookProvider

The `HookProvider` is the central registry that makes hooks available throughout your application.

### Basic Provider

```tsx
import { HookProvider } from 'react-use-anywhere';

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

### How It Works

1. **Registration**: Hooks are registered with string keys
2. **Context**: Provider creates a React context with hook instances
3. **Access**: Services use `useHookService` to access registered hooks

### Provider Nesting

You can nest providers for different parts of your app:

```tsx
function App() {
  return (
    <HookProvider hooks={{ navigation: useNavigate }}>
      <Router>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <HookProvider
                hooks={{
                  adminAuth: useAdminAuth,
                  adminTheme: useAdminTheme,
                }}
              >
                <AdminSection />
              </HookProvider>
            }
          />
          <Route path="/*" element={<PublicSection />} />
        </Routes>
      </Router>
    </HookProvider>
  );
}
```

## 2. Hook Services

Hook services are your gateway to accessing hooks from anywhere in your codebase.

### Basic Usage

```typescript
import { useHookService } from 'react-use-anywhere';

export const myService = {
  doSomething() {
    const navigate = useHookService('navigation');
    const { user } = useHookService('auth');

    // Use hooks normally
    navigate('/dashboard');
  },
};
```

### Service Patterns

#### 1. Stateless Services

Pure functions that use hooks:

```typescript
export const navigationService = {
  goToUserProfile(userId: string) {
    const navigate = useHookService('navigation');
    navigate(`/users/${userId}`);
  },

  goBack() {
    const navigate = useHookService('navigation');
    navigate(-1);
  },
};
```

#### 2. Stateful Services

Services that maintain their own state:

```typescript
class NotificationService {
  private notifications: Notification[] = [];

  add(message: string, type: 'success' | 'error' = 'success') {
    const { addNotification } = useHookService('notifications');

    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };

    this.notifications.push(notification);
    addNotification(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => this.remove(notification.id), 5000);
  }

  remove(id: number) {
    const { removeNotification } = useHookService('notifications');
    this.notifications = this.notifications.filter((n) => n.id !== id);
    removeNotification(id);
  }
}

export const notificationService = new NotificationService();
```

#### 3. Async Services

Services that handle async operations:

```typescript
export const dataService = {
  async fetchUserData(userId: string) {
    const { setLoading, setError } = useHookService('ui');
    const navigate = useHookService('navigation');

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await response.json();
      return user;
    } catch (error) {
      setError(error.message);
      navigate('/error');
      throw error;
    } finally {
      setLoading(false);
    }
  },
};
```

## 3. Hook Lifecycle

Understanding when hooks are called is crucial:

### Hook Execution Context

```typescript
// ✅ Correct: Hook called during service method execution
export const authService = {
  login() {
    const navigate = useHookService('navigation'); // ✅ Called when method runs
    navigate('/dashboard');
  },
};

// ❌ Incorrect: Hook called during module loading
const navigate = useHookService('navigation'); // ❌ Too early!

export const authService = {
  login() {
    navigate('/dashboard'); // ❌ Will fail
  },
};
```

### Hook Dependencies

Hooks follow the same rules as in components:

```typescript
export const effectService = {
  setupUserWatcher(userId: string) {
    const { user, setUser } = useHookService('auth');

    // Use effect normally
    useEffect(() => {
      const subscription = subscribeToUser(userId, setUser);
      return () => subscription.unsubscribe();
    }, [userId, setUser]);
  },
};
```

## 4. Error Handling

### Hook Not Found

```typescript
export const safeService = {
  navigateIfPossible(path: string) {
    try {
      const navigate = useHookService('navigation');
      navigate(path);
    } catch (error) {
      console.warn('Navigation not available:', error);
      // Fallback behavior
      window.location.href = path;
    }
  },
};
```

### Provider Not Found

```typescript
import { useHookService } from 'react-use-anywhere';

export const checkedService = {
  performAction() {
    // Check if provider is available
    try {
      const { user } = useHookService('auth');

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Proceed with action
    } catch (error) {
      if (error.message.includes('HookProvider')) {
        console.error('Service called outside of HookProvider');
        return;
      }
      throw error;
    }
  },
};
```

## 5. Best Practices

### Service Organization

Organize services by domain:

```
services/
├── auth/
│   ├── authService.ts
│   ├── permissionService.ts
│   └── sessionService.ts
├── navigation/
│   ├── routerService.ts
│   └── breadcrumbService.ts
├── ui/
│   ├── themeService.ts
│   ├── modalService.ts
│   └── notificationService.ts
└── data/
    ├── userService.ts
    ├── apiService.ts
    └── cacheService.ts
```

### Service Composition

Create composed services:

```typescript
// Base services
export const apiService = {
  /* ... */
};
export const authService = {
  /* ... */
};
export const navigationService = {
  /* ... */
};

// Composed service
export const userManagementService = {
  async createUser(userData: UserData) {
    // Use multiple services
    const user = await apiService.post('/users', userData);
    authService.setUser(user);
    navigationService.goToUserProfile(user.id);

    return user;
  },
};
```

### Testing Services

Services are easy to test:

```typescript
// Mock the hook service
jest.mock('react-use-anywhere', () => ({
  useHookService: jest.fn(),
}));

describe('authService', () => {
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    useHookService.mockImplementation((key) => {
      if (key === 'navigation') return mockNavigate;
      if (key === 'auth') return { setUser: mockSetUser };
    });
  });

  it('should navigate after login', async () => {
    await authService.login('test@example.com', 'password');

    expect(mockSetUser).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
```

## Next Steps

Now that you understand the core concepts:

- **[Type Safety](/guide/type-safety)** - Add TypeScript support
- **[Service Layer](/guide/service-layer)** - Advanced service patterns
- **[Best Practices](/guide/best-practices)** - Production-ready patterns
- **[API Reference](/api/overview)** - Complete API documentation
