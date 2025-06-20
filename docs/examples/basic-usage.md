# Basic Usage

Simple examples to get you started with React Use Anywhere.

## Simple Navigation Service

The most basic example - navigation from a service:

```tsx
// App.tsx
import React from 'react';
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
      }}
    >
      <MyComponent />
    </HookProvider>
  );
}
```

```typescript
// services/navigationService.ts
import { useHookService } from 'react-use-anywhere';

export const navigationService = {
  goHome() {
    const navigate = useHookService('navigation');
    navigate('/');
  },

  goToProfile(userId: string) {
    const navigate = useHookService('navigation');
    navigate(`/profile/${userId}`);
  },

  goBack() {
    const navigate = useHookService('navigation');
    navigate(-1);
  },
};
```

```tsx
// components/MyComponent.tsx
import React from 'react';
import { navigationService } from '../services/navigationService';

export function MyComponent() {
  return (
    <div>
      <button onClick={() => navigationService.goHome()}>Go Home</button>
      <button onClick={() => navigationService.goToProfile('123')}>
        View Profile
      </button>
      <button onClick={() => navigationService.goBack()}>Go Back</button>
    </div>
  );
}
```

## Multiple Hooks Example

Using multiple hooks in a single service:

```tsx
// App.tsx
import React, { useState } from 'react';
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

// Custom hooks
function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  return {
    notifications,
    addNotification: (message) => {
      setNotifications((prev) => [...prev, { id: Date.now(), message }]);
    },
    removeNotification: (id) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
  };
}

function useAuth() {
  const [user, setUser] = useState(null);

  return {
    user,
    isAuthenticated: !!user,
    setUser,
    logout: () => setUser(null),
  };
}

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        notifications: useNotifications,
        auth: useAuth,
      }}
    >
      <MyApp />
    </HookProvider>
  );
}
```

```typescript
// services/userService.ts
import { useHookService } from 'react-use-anywhere';

export const userService = {
  async login(email: string, password: string) {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');
    const { setUser } = useHookService('auth');

    try {
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

      // Update auth state
      setUser(user);

      // Show success notification
      addNotification('Welcome back!');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      addNotification('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  },

  logout() {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');
    const { logout } = useHookService('auth');

    logout();
    addNotification('You have been logged out');
    navigate('/login');
  },
};
```

## Async Operations

Handling async operations with hooks:

```typescript
// services/dataService.ts
import { useHookService } from 'react-use-anywhere';

export const dataService = {
  async fetchUser(userId: string) {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    try {
      const response = await fetch(`/api/users/${userId}`);

      if (response.status === 404) {
        addNotification('User not found');
        navigate('/users');
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await response.json();
      addNotification(`Loaded profile for ${user.name}`);

      return user;
    } catch (error) {
      addNotification('Failed to load user data');
      navigate('/error');
      throw error;
    }
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const { addNotification } = useHookService('notifications');
    const { setUser } = useHookService('auth');

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();

      // Update auth state if it's the current user
      const { user: currentUser } = useHookService('auth');
      if (currentUser?.id === userId) {
        setUser(updatedUser);
      }

      addNotification('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      addNotification('Failed to update profile');
      throw error;
    }
  },
};
```

## Error Handling

Robust error handling in services:

```typescript
// services/apiService.ts
import { useHookService } from 'react-use-anywhere';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiService = {
  async request(endpoint: string, options?: RequestInit) {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');
    const { logout } = useHookService('auth');

    try {
      const response = await fetch(endpoint, options);

      // Handle different error types
      if (response.status === 401) {
        addNotification('Session expired. Please log in again.');
        logout();
        navigate('/login');
        throw new ApiError('Unauthorized', 401);
      }

      if (response.status === 403) {
        addNotification('You do not have permission to perform this action.');
        navigate('/unauthorized');
        throw new ApiError('Forbidden', 403);
      }

      if (response.status === 404) {
        addNotification('The requested resource was not found.');
        navigate('/not-found');
        throw new ApiError('Not Found', 404);
      }

      if (response.status >= 500) {
        addNotification('Server error. Please try again later.');
        navigate('/error');
        throw new ApiError('Server Error', response.status);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'Request failed',
          response.status,
          errorData.code
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      addNotification('Network error. Please check your connection.');
      throw new ApiError('Network Error', 0);
    }
  },

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
```

## Service Composition

Building complex services from simpler ones:

```typescript
// services/index.ts
import { useHookService } from 'react-use-anywhere';
import { apiService } from './apiService';

// Base services
export const baseServices = {
  api: apiService,

  notification: {
    success(message: string) {
      const { addNotification } = useHookService('notifications');
      addNotification(message);
    },

    error(message: string) {
      const { addNotification } = useHookService('notifications');
      addNotification(message);
    },
  },

  navigation: {
    goTo(path: string) {
      const navigate = useHookService('navigation');
      navigate(path);
    },

    goBack() {
      const navigate = useHookService('navigation');
      navigate(-1);
    },
  },
};

// Composed services
export const userManagementService = {
  async createUser(userData: CreateUserData) {
    try {
      const user = await baseServices.api.post('/api/users', userData);
      baseServices.notification.success(
        `User ${user.name} created successfully`
      );
      baseServices.navigation.goTo(`/users/${user.id}`);
      return user;
    } catch (error) {
      baseServices.notification.error('Failed to create user');
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      await baseServices.api.delete(`/api/users/${userId}`);
      baseServices.notification.success('User deleted successfully');
      baseServices.navigation.goTo('/users');
    } catch (error) {
      baseServices.notification.error('Failed to delete user');
      throw error;
    }
  },
};
```

## Testing Services

How to test your services:

```typescript
// services/__tests__/userService.test.ts
import { useHookService } from 'react-use-anywhere';
import { userService } from '../userService';

// Mock the hook service
jest.mock('react-use-anywhere', () => ({
  useHookService: jest.fn(),
}));

const mockUseHookService = useHookService as jest.MockedFunction<
  typeof useHookService
>;

describe('userService', () => {
  const mockNavigate = jest.fn();
  const mockAddNotification = jest.fn();
  const mockSetUser = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseHookService.mockImplementation((key) => {
      switch (key) {
        case 'navigation':
          return mockNavigate;
        case 'notifications':
          return { addNotification: mockAddNotification };
        case 'auth':
          return { setUser: mockSetUser, logout: mockLogout };
        default:
          throw new Error(`Unexpected hook key: ${key}`);
      }
    });
  });

  describe('login', () => {
    it('should navigate to dashboard on successful login', async () => {
      // Mock successful API response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: '1', name: 'Test User' }),
      });

      await userService.login('test@example.com', 'password');

      expect(mockSetUser).toHaveBeenCalledWith({ id: '1', name: 'Test User' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockAddNotification).toHaveBeenCalledWith('Welcome back!');
    });

    it('should show error notification on login failure', async () => {
      // Mock failed API response
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });

      await userService.login('test@example.com', 'wrongpassword');

      expect(mockAddNotification).toHaveBeenCalledWith(
        'Login failed. Please try again.'
      );
      expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('logout', () => {
    it('should logout and navigate to login page', () => {
      userService.logout();

      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(mockAddNotification).toHaveBeenCalledWith(
        'You have been logged out'
      );
    });
  });
});
```

## Key Takeaways

✅ **Services can access any registered hook**  
✅ **Hooks are called when service methods execute**  
✅ **Combine multiple hooks for complex operations**  
✅ **Handle errors gracefully with notifications and navigation**  
✅ **Compose services for better organization**  
✅ **Services are easily testable**

Ready for more advanced examples? Check out [Authentication](/examples/authentication) or [Navigation](/examples/navigation)!
