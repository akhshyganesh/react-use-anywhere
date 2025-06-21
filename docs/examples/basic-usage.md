# Real-World Examples

Copy-paste examples for common use cases. Each example is production-ready and includes error handling.

## Prerequisites

Before using these examples, make sure you have:

1. **Installed react-use-anywhere**: `npm install react-use-anywhere`
2. **Set up your custom hooks** (see examples below)
3. **Wrapped your app** with `HookProvider`

## 🔐 Authentication & Login Flow

Complete authentication with login, logout, and session management:

### Step 1: Create your custom hooks

```tsx
// hooks/useAuth.ts
import { useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setUserData = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    setUser: setUserData,
    clearUser,
  };
}

// hooks/useNotifications.ts
import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { ...notification, id }]);
    },
    []
  );

  return {
    notifications,
    info: (message: string) => addNotification({ message, type: 'info' }),
    success: (message: string) => addNotification({ message, type: 'success' }),
    warning: (message: string) => addNotification({ message, type: 'warning' }),
    error: (message: string) => addNotification({ message, type: 'error' }),
  };
}
```

### Step 2: Setup the provider

```tsx
// App.tsx - Setup the provider
import { HookProvider } from 'react-use-anywhere';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';

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

### Step 3: Create the authentication service

```ts
// services/auth.ts - Authentication service
import { createSingletonService } from 'react-use-anywhere';

// Create singleton services
const notificationService = createSingletonService('notifications');
const authService = createSingletonService('auth');
const navigationService = createSingletonService('navigation');

export const login = async (email: string, password: string) => {
  try {
    // Show loading notification
    notificationService.use((notify) => notify.info('Signing in...'));

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { user, token } = await response.json();

    // Store token
    localStorage.setItem('token', token);

    // Update auth state
    authService.use((auth) => auth.setUser(user));

    // Show success message
    notificationService.use((notify) =>
      notify.success(`Welcome back, ${user.name}!`)
    );

    // Navigate to dashboard
    navigationService.use((navigate) => navigate('/dashboard'));

    return user;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Login failed. Please check your credentials.')
    );
    throw error;
  }
};

export const logout = () => {
  // Clear token
  localStorage.removeItem('token');

  // Clear user state
  authService.use((auth) => auth.clearUser());

  // Show message
  notificationService.use((notify) => notify.info('You have been logged out'));

  // Navigate to login
  navigationService.use((navigate) => navigate('/login'));
};

export const checkAuthStatus = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const user = await response.json();
      authService.use((auth) => auth.setUser(user));
      return true;
    } else {
      logout(); // Invalid token
      return false;
    }
  } catch (error) {
    logout(); // Network error
    return false;
  }
};
```

### Step 4: Create the login component

```tsx
// components/LoginPage.tsx - Login component
import { useState } from 'react';
import { useHookService } from 'react-use-anywhere';
import { login } from '../services/auth';

// Import the services to connect them
import { createSingletonService } from 'react-use-anywhere';
const authService = createSingletonService('auth');
const notificationService = createSingletonService('notifications');
const navigationService = createSingletonService('navigation');

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Connect services to hooks - this makes the hook values available in services
  useHookService(authService, 'auth');
  useHookService(notificationService, 'notifications');
  useHookService(navigationService, 'navigation');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      // Service handles everything: state, navigation, notifications
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
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
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
```

## 🛒 Shopping Cart & E-commerce

Shopping cart with add to cart, remove items, and checkout flow:

### Step 1: Create the cart hook

```tsx
// hooks/useCart.ts
import { useState, useCallback } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
}
```

### Step 2: Shopping cart service

```ts
// services/cart.ts - Shopping cart service
import { createSingletonService } from 'react-use-anywhere';

const cartService = createSingletonService('cart');
const notificationService = createSingletonService('notifications');
const navigationService = createSingletonService('navigation');

export const addToCart = async (
  productId: string,
  name: string,
  price: number,
  quantity: number = 1
) => {
  try {
    // Add to cart state
    cartService.use((cart) =>
      cart.addItem({ productId, name, price, quantity })
    );

    // Show success message
    notificationService.use((notify) =>
      notify.success(`Added ${quantity} item(s) to cart`)
    );

    // Optional: Ask if user wants to go to cart
    const goToCart = window.confirm('Item added! Go to cart?');
    if (goToCart) {
      navigationService.use((navigate) => navigate('/cart'));
    }
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Failed to add item to cart')
    );
  }
};

export const removeFromCart = (productId: string) => {
  cartService.use((cart) => cart.removeItem(productId));
  notificationService.use((notify) => notify.info('Item removed from cart'));
};

export const updateQuantity = (productId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  cartService.use((cart) => cart.updateQuantity(productId, quantity));
};

export const clearCart = () => {
  cartService.use((cart) => cart.clear());
  notificationService.use((notify) => notify.info('Cart cleared'));
};

export const checkout = async () => {
  try {
    notificationService.use((notify) => notify.info('Processing order...'));

    const order = await cartService.use(async (cart) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items }),
      });

      if (!response.ok) throw new Error('Checkout failed');

      const order = await response.json();
      cart.clear(); // Clear cart after successful order
      return order;
    });

    notificationService.use((notify) =>
      notify.success('Order placed successfully!')
    );

    navigationService.use((navigate) =>
      navigate(`/order-confirmation/${order.id}`)
    );

    return order;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Checkout failed. Please try again.')
    );
    throw error;
  }
};
```

## 🎨 Theme Management

Complete theme system with persistence and system preference detection:

```tsx
// hooks/useTheme.ts
import { useState, useCallback, useEffect } from 'react';

export function useTheme() {
  const [current, setCurrent] = useState<'light' | 'dark' | 'auto'>('auto');

  const setTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    setCurrent(theme);
  }, []);

  return {
    current,
    setTheme,
  };
}
```

```ts
// services/theme.ts - Theme management service
import { createSingletonService } from 'react-use-anywhere';

const themeService = createSingletonService('theme');

export const setTheme = (themeName: 'light' | 'dark' | 'auto') => {
  themeService.use((theme) => {
    theme.setTheme(themeName);

    // Persist to localStorage
    localStorage.setItem('theme', themeName);

    // Apply to document
    if (themeName === 'auto') {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      document.documentElement.setAttribute(
        'data-theme',
        systemPrefersDark ? 'dark' : 'light'
      );
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
  });
};

export const toggleTheme = () => {
  themeService.use((theme) => {
    const currentTheme = theme.current;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
};

export const initializeTheme = () => {
  // Get saved theme or default to auto
  const savedTheme =
    (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto';
  setTheme(savedTheme);

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      themeService.use((theme) => {
        if (theme.current === 'auto') {
          document.documentElement.setAttribute(
            'data-theme',
            e.matches ? 'dark' : 'light'
          );
        }
      });
    });
};

export const getCurrentTheme = () => {
  return themeService.use((theme) => theme.current);
};
```

## 📱 Notifications & Toast Messages

Notification system with different types and auto-dismiss:

```tsx
// hooks/useNotifications.ts (if not already created)
import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const add = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp'>) => {
      const id = Date.now().toString();
      setNotifications((prev) => [
        ...prev,
        {
          ...notification,
          id,
          timestamp: new Date(),
        },
      ]);
      return id;
    },
    []
  );

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    add,
    remove,
    clear,
    info: (message: string) => add({ message, type: 'info' }),
    success: (message: string) => add({ message, type: 'success' }),
    warning: (message: string) => add({ message, type: 'warning' }),
    error: (message: string) => add({ message, type: 'error' }),
  };
}
```

```ts
// services/notifications.ts - Notification management
import { createSingletonService } from 'react-use-anywhere';

const notificationService = createSingletonService('notifications');

export const showNotification = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration: number = 5000
) => {
  const id = notificationService.use((notifications) => {
    return notifications.add({
      message,
      type,
    });
  });

  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      dismissNotification(id);
    }, duration);
  }

  return id;
};

export const dismissNotification = (id: string) => {
  notificationService.use((notifications) => {
    notifications.remove(id);
  });
};

export const clearAllNotifications = () => {
  notificationService.use((notifications) => {
    notifications.clear();
  });
};

// Convenience methods
export const showSuccess = (message: string) =>
  showNotification(message, 'success');
export const showError = (message: string) =>
  showNotification(message, 'error', 0); // Don't auto-dismiss errors
export const showWarning = (message: string) =>
  showNotification(message, 'warning');
export const showInfo = (message: string) => showNotification(message, 'info');
```

## 📊 Data Fetching & API Management

Complete data fetching with loading states, error handling, and caching:

```tsx
// hooks/useApi.ts
import { useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useApi() {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  return {
    userProfile,
    searchResults,
    setUserProfile: useCallback((user: User) => setUserProfile(user), []),
    setSearchResults: useCallback(
      (results: User[]) => setSearchResults(results),
      []
    ),
  };
}

// hooks/useLoading.ts
import { useState, useCallback } from 'react';

export function useLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const start = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
  }, []);

  const stop = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  return {
    loadingStates,
    start,
    stop,
    isLoading,
  };
}
```

```ts
// services/api.ts - API service with loading states
import { createSingletonService } from 'react-use-anywhere';

const apiService = createSingletonService('api');
const loadingService = createSingletonService('loading');
const notificationService = createSingletonService('notifications');

export const fetchUserProfile = async (userId: string) => {
  try {
    loadingService.use((loading) => loading.start('userProfile'));

    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');

    const user = await response.json();

    apiService.use((api) => api.setUserProfile(user));

    return user;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Failed to load user profile')
    );
    throw error;
  } finally {
    loadingService.use((loading) => loading.stop('userProfile'));
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
) => {
  try {
    loadingService.use((loading) => loading.start('updateProfile'));

    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update user');

    const updatedUser = await response.json();

    apiService.use((api) => api.setUserProfile(updatedUser));
    notificationService.use((notify) =>
      notify.success('Profile updated successfully')
    );

    return updatedUser;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Failed to update profile')
    );
    throw error;
  } finally {
    loadingService.use((loading) => loading.stop('updateProfile'));
  }
};

export const searchUsers = async (query: string) => {
  try {
    loadingService.use((loading) => loading.start('searchUsers'));

    const response = await fetch(
      `/api/users/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Search failed');

    const results = await response.json();

    apiService.use((api) => api.setSearchResults(results));

    return results;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Search failed. Please try again.')
    );
    return [];
  } finally {
    loadingService.use((loading) => loading.stop('searchUsers'));
  }
};
```

## 🔄 Real-time Updates & WebSockets

WebSocket connection management with automatic reconnection:

```tsx
// hooks/useWebSocket.ts
import { useState, useCallback } from 'react';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const setConnected = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  const handleMessage = useCallback((message: any) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  return {
    isConnected,
    messages,
    setConnected,
    handleMessage,
  };
}
```

```ts
// services/websocket.ts - Real-time updates
import { createSingletonService } from 'react-use-anywhere';

const websocketService = createSingletonService('websocket');
const notificationService = createSingletonService('notifications');

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

export const connectWebSocket = () => {
  try {
    ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts = 0;

      websocketService.use((wsState) => wsState.setConnected(true));
      notificationService.use((notify) =>
        notify.success('Connected to real-time updates')
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      websocketService.use((wsState) => wsState.setConnected(false));

      // Attempt to reconnect
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts++;
          notificationService.use((notify) =>
            notify.info(`Reconnecting... (attempt ${reconnectAttempts})`)
          );
          connectWebSocket();
        }, 2000 * reconnectAttempts);
      } else {
        notificationService.use((notify) =>
          notify.error('Lost connection to server. Please refresh the page.')
        );
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      notificationService.use((notify) =>
        notify.error('Connection error occurred')
      );
    };
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
  }
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
    websocketService.use((wsState) => wsState.setConnected(false));
  }
};

export const sendMessage = (type: string, payload: any) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  } else {
    notificationService.use((notify) =>
      notify.warning('Not connected to server')
    );
  }
};

const handleWebSocketMessage = (data: any) => {
  websocketService.use((wsState) => wsState.handleMessage(data));

  // Handle specific message types
  switch (data.type) {
    case 'USER_ONLINE':
      notificationService.use((notify) =>
        notify.info(`${data.payload.username} is now online`)
      );
      break;
    case 'NEW_MESSAGE':
      notificationService.use((notify) =>
        notify.info(`New message from ${data.payload.sender}`)
      );
      break;
    case 'SYSTEM_ALERT':
      notificationService.use((notify) => notify.warning(data.payload.message));
      break;
  }
};
```

## 📝 Form Handling & Validation

Complete form management with validation and error handling:

```tsx
// hooks/useForms.ts
import { useState, useCallback } from 'react';

interface FormField {
  value: any;
  errors: string[];
  touched: boolean;
}

interface FormState {
  [fieldName: string]: FormField;
}

export function useForms() {
  const [forms, setForms] = useState<Record<string, FormState>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const setFieldValue = useCallback(
    (formName: string, fieldName: string, value: any) => {
      setForms((prev) => ({
        ...prev,
        [formName]: {
          ...prev[formName],
          [fieldName]: {
            ...prev[formName]?.[fieldName],
            value,
            touched: true,
          },
        },
      }));
    },
    []
  );

  const setFieldErrors = useCallback(
    (formName: string, fieldName: string, errors: string[]) => {
      setForms((prev) => ({
        ...prev,
        [formName]: {
          ...prev[formName],
          [fieldName]: {
            ...prev[formName]?.[fieldName],
            errors,
          },
        },
      }));
    },
    []
  );

  const setSubmitting = useCallback(
    (formName: string, isSubmitting: boolean) => {
      setSubmitting((prev) => ({
        ...prev,
        [formName]: isSubmitting,
      }));
    },
    []
  );

  return {
    forms,
    submitting,
    setFieldValue,
    setFieldErrors,
    setSubmitting,
  };
}
```

```ts
// services/forms.ts - Form handling service
import { createSingletonService } from 'react-use-anywhere';

const formService = createSingletonService('forms');
const notificationService = createSingletonService('notifications');

interface ValidationRule {
  validate: (value: any) => string | null;
}

export const validateField = (
  formName: string,
  fieldName: string,
  value: any,
  rules: ValidationRule[]
) => {
  const errors: string[] = [];

  for (const rule of rules) {
    const error = rule.validate(value);
    if (error) errors.push(error);
  }

  formService.use((forms) => forms.setFieldErrors(formName, fieldName, errors));

  return errors.length === 0;
};

export const submitForm = async (
  formName: string,
  formData: any,
  submitFn: (data: any) => Promise<any>
) => {
  try {
    formService.use((forms) => forms.setSubmitting(formName, true));

    // Submit the form
    const result = await submitFn(formData);

    notificationService.use((notify) =>
      notify.success('Form submitted successfully')
    );

    return result;
  } catch (error) {
    notificationService.use((notify) =>
      notify.error('Failed to submit form. Please try again.')
    );
    throw error;
  } finally {
    formService.use((forms) => forms.setSubmitting(formName, false));
  }
};

export const resetForm = (formName: string) => {
  // Reset form implementation would go here
  notificationService.use((notify) => notify.info('Form reset'));
};

// Validation rules
export const validationRules = {
  required: (message = 'This field is required') => ({
    validate: (value: any) => (!value || value.trim() === '' ? message : null),
  }),

  email: (message = 'Please enter a valid email') => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return value && !emailRegex.test(value) ? message : null;
    },
  }),

  minLength: (length: number, message?: string) => ({
    validate: (value: string) => {
      const msg = message || `Must be at least ${length} characters`;
      return value && value.length < length ? msg : null;
    },
  }),

  maxLength: (length: number, message?: string) => ({
    validate: (value: string) => {
      const msg = message || `Must be no more than ${length} characters`;
      return value && value.length > length ? msg : null;
    },
  }),
};
```

## Using These Examples

Each example includes:

- ✅ **Complete service implementation**
- ✅ **Error handling and loading states**
- ✅ **User feedback via notifications**
- ✅ **Proper state management**
- ✅ **Navigation handling**

### To use any example:

1. **Copy the hook code** into your `hooks/` folder
2. **Copy the service code** into your `services/` folder
3. **Add the required hooks** to your `HookProvider`
4. **Call service functions** from anywhere in your app

### Common setup for all examples:

```tsx
// App.tsx - Provider setup for all examples
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { useCart } from './hooks/useCart';
import { useTheme } from './hooks/useTheme';
import { useApi } from './hooks/useApi';
import { useLoading } from './hooks/useLoading';
import { useWebSocket } from './hooks/useWebSocket';
import { useForms } from './hooks/useForms';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        notifications: useNotifications,
        cart: useCart,
        theme: useTheme,
        api: useApi,
        loading: useLoading,
        websocket: useWebSocket,
        forms: useForms,
      }}
    >
      <YourApp />
    </HookProvider>
  );
}
```

These examples demonstrate real-world patterns you can copy directly into your applications. Each service is designed to handle edge cases, provide good user experience, and maintain clean separation of concerns.
