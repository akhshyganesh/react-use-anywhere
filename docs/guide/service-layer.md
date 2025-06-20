# Service Layer Architecture

Learn how to build scalable, maintainable applications using service-oriented architecture with React Use Anywhere.

## Architecture Overview

Traditional React applications often struggle with separation of concerns, leading to:

- Business logic mixed with UI components
- Difficulty testing complex workflows
- Tight coupling between components and external dependencies
- Props drilling for shared functionality

React Use Anywhere enables a clean service layer architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
├─────────────────────────────────────────────────────────┤
│  React Components (UI only)                            │
│  • Focus on rendering                                   │
│  • Handle user interactions                             │
│  • Delegate business logic to services                  │
└─────────────────────────────────────────────────────────┘
           ▲                           │
           │ Props/State               │ Service Calls
           ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                       │
├─────────────────────────────────────────────────────────┤
│  Business Logic Services                                │
│  • Domain-specific operations                           │
│  • Cross-cutting concerns                               │
│  • Integration with external systems                    │
│  • State management                                     │
└─────────────────────────────────────────────────────────┘
           ▲                           │
           │ Hook Access               │ API Calls
           ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                 │
├─────────────────────────────────────────────────────────┤
│  React Hooks & External Dependencies                    │
│  • React Router hooks                                   │
│  • State management hooks                               │
│  • API clients                                          │
│  • Local storage, etc.                                  │
└─────────────────────────────────────────────────────────┘
```

## Service Design Patterns

### 1. Domain Services

Organize services by business domain:

```typescript
// services/user/userService.ts
import { useHookService } from 'react-use-anywhere';

export const userService = {
  async createUser(userData: CreateUserRequest) {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    try {
      const user = await apiService.post('/users', userData);
      addNotification({
        type: 'success',
        message: 'User created successfully',
      });
      navigate(`/users/${user.id}`);
      return user;
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to create user' });
      throw error;
    }
  },

  async updateUser(userId: string, updates: UpdateUserRequest) {
    const { addNotification } = useHookService('notifications');
    const { setUser } = useHookService('auth');

    try {
      const user = await apiService.put(`/users/${userId}`, updates);

      // Update current user if editing own profile
      const { user: currentUser } = useHookService('auth');
      if (currentUser?.id === userId) {
        setUser(user);
      }

      addNotification({
        type: 'success',
        message: 'User updated successfully',
      });
      return user;
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to update user' });
      throw error;
    }
  },
};
```

### 2. Application Services

Handle application-wide concerns:

```typescript
// services/app/applicationService.ts
import { useHookService } from 'react-use-anywhere';

export const applicationService = {
  async initialize() {
    const { setLoading } = useHookService('app');
    const { setUser } = useHookService('auth');
    const { setTheme } = useHookService('theme');

    try {
      setLoading(true);

      // Initialize authentication
      const token = localStorage.getItem('authToken');
      if (token) {
        const user = await authService.validateToken(token);
        setUser(user);
      }

      // Load user preferences
      const theme = localStorage.getItem('theme') || 'light';
      setTheme(theme);

      // Load application configuration
      await configService.loadConfig();
    } catch (error) {
      console.error('Application initialization failed:', error);
    } finally {
      setLoading(false);
    }
  },

  async shutdown() {
    // Clean up resources
    await analyticsService.flush();
    cacheService.clear();
    websocketService.disconnect();
  },
};
```

### 3. Integration Services

Handle external system integration:

```typescript
// services/integration/emailService.ts
import { useHookService } from 'react-use-anywhere';

export const emailService = {
  async sendWelcomeEmail(user: User) {
    const { addNotification } = useHookService('notifications');

    try {
      await apiService.post('/emails/welcome', { userId: user.id });
      addNotification({
        type: 'info',
        message: 'Welcome email sent successfully',
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't show user notification for non-critical failure
    }
  },

  async sendPasswordResetEmail(email: string) {
    const { addNotification } = useHookService('notifications');
    const navigate = useHookService('navigation');

    try {
      await apiService.post('/emails/password-reset', { email });
      addNotification({
        type: 'success',
        message: 'Password reset email sent',
      });
      navigate('/login');
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to send password reset email',
      });
      throw error;
    }
  },
};
```

## Service Composition Patterns

### 1. Orchestration Services

Coordinate multiple services for complex workflows:

```typescript
// services/workflows/userOnboardingService.ts
import { useHookService } from 'react-use-anywhere';
import { userService } from '../user/userService';
import { emailService } from '../integration/emailService';
import { analyticsService } from '../analytics/analyticsService';

export const userOnboardingService = {
  async onboardNewUser(registrationData: RegistrationData) {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    try {
      // Step 1: Create user account
      const user = await userService.createUser(registrationData);

      // Step 2: Send welcome email
      await emailService.sendWelcomeEmail(user);

      // Step 3: Track registration
      analyticsService.track('user_registered', {
        userId: user.id,
        registrationMethod: registrationData.method,
      });

      // Step 4: Navigate to onboarding flow
      navigate('/onboarding/welcome');

      addNotification({
        type: 'success',
        message: "Welcome to our platform! Let's get you started.",
      });

      return user;
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Registration failed. Please try again.',
      });
      throw error;
    }
  },

  async completeOnboarding(userId: string, preferences: UserPreferences) {
    const navigate = useHookService('navigation');
    const { setUser } = useHookService('auth');

    try {
      // Update user preferences
      const updatedUser = await userService.updateUser(userId, {
        preferences,
        onboardingCompleted: true,
      });

      setUser(updatedUser);

      // Track onboarding completion
      analyticsService.track('onboarding_completed', { userId });

      // Navigate to main application
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      throw error;
    }
  },
};
```

### 2. Facade Services

Provide simplified interfaces to complex subsystems:

```typescript
// services/facades/contentService.ts
import { useHookService } from 'react-use-anywhere';

export const contentService = {
  async createPost(postData: CreatePostData) {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    try {
      // Create the post
      const post = await apiService.post('/posts', postData);

      // Handle file uploads if any
      if (postData.attachments?.length > 0) {
        await fileService.uploadAttachments(post.id, postData.attachments);
      }

      // Update search index
      await searchService.indexContent(post);

      // Notify followers (if post is public)
      if (post.visibility === 'public') {
        await notificationService.notifyFollowers(post);
      }

      addNotification({
        type: 'success',
        message: 'Post created successfully',
      });

      navigate(`/posts/${post.id}`);
      return post;
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to create post',
      });
      throw error;
    }
  },

  async publishPost(postId: string) {
    const { addNotification } = useHookService('notifications');

    try {
      // Update post status
      const post = await apiService.put(`/posts/${postId}`, {
        status: 'published',
        publishedAt: new Date().toISOString(),
      });

      // Send to content delivery network
      await cdnService.publishContent(post);

      // Update social media
      await socialService.sharePost(post);

      // Track analytics
      analyticsService.track('post_published', { postId });

      addNotification({
        type: 'success',
        message: 'Post published successfully',
      });

      return post;
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to publish post',
      });
      throw error;
    }
  },
};
```

## Service Lifecycle Management

### 1. Singleton Services

For services that need to maintain state across the application:

```typescript
// services/singletons/cacheService.ts
import { createSingletonService } from 'react-use-anywhere';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export const cacheService = createSingletonService('cache', () => {
  const cache = new Map<string, CacheEntry<any>>();

  return {
    set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) {
      cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      });
    },

    get<T>(key: string): T | null {
      const entry = cache.get(key);

      if (!entry) return null;

      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        cache.delete(key);
        return null;
      }

      return entry.data;
    },

    delete(key: string) {
      cache.delete(key);
    },

    clear() {
      cache.clear();
    },

    async fetchWithCache<T>(
      key: string,
      fetcher: () => Promise<T>,
      ttl?: number
    ): Promise<T> {
      const { addNotification } = this.getHook('notifications');

      // Try cache first
      const cached = this.get<T>(key);
      if (cached) return cached;

      try {
        // Fetch fresh data
        const data = await fetcher();
        this.set(key, data, ttl);
        return data;
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to load data',
        });
        throw error;
      }
    },
  };
});
```

### 2. Service Dependencies

Manage service dependencies with proper initialization order:

```typescript
// services/core/serviceManager.ts
import { useHookService } from 'react-use-anywhere';

class ServiceManager {
  private services = new Map<string, any>();
  private initializationOrder = [
    'config',
    'cache',
    'analytics',
    'auth',
    'navigation',
  ];

  async initializeServices() {
    const { setLoading } = useHookService('app');

    try {
      setLoading(true);

      for (const serviceName of this.initializationOrder) {
        await this.initializeService(serviceName);
      }
    } catch (error) {
      console.error('Service initialization failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  private async initializeService(serviceName: string) {
    try {
      const service = this.getService(serviceName);

      if (service && typeof service.initialize === 'function') {
        await service.initialize();
        console.log(`Service '${serviceName}' initialized successfully`);
      }
    } catch (error) {
      console.error(`Failed to initialize service '${serviceName}':`, error);
      throw error;
    }
  }

  getService(name: string) {
    return this.services.get(name);
  }

  registerService(name: string, service: any) {
    this.services.set(name, service);
  }

  async shutdownServices() {
    // Shutdown in reverse order
    const shutdownOrder = [...this.initializationOrder].reverse();

    for (const serviceName of shutdownOrder) {
      try {
        const service = this.getService(serviceName);
        if (service && typeof service.shutdown === 'function') {
          await service.shutdown();
        }
      } catch (error) {
        console.error(`Failed to shutdown service '${serviceName}':`, error);
      }
    }
  }
}

export const serviceManager = new ServiceManager();
```

## Error Handling Strategies

### 1. Service-Level Error Handling

```typescript
// services/base/baseService.ts
import { useHookService } from 'react-use-anywhere';

export abstract class BaseService {
  protected handleError(error: any, context: string) {
    const { addNotification } = useHookService('notifications');

    console.error(`${context}:`, error);

    // Different handling based on error type
    if (error.status === 401) {
      this.handleUnauthorized();
    } else if (error.status === 403) {
      this.handleForbidden();
    } else if (error.status >= 500) {
      this.handleServerError(error);
    } else {
      this.handleClientError(error);
    }
  }

  private handleUnauthorized() {
    const { logout } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    logout();
    addNotification({
      type: 'error',
      message: 'Session expired. Please log in again.',
    });
  }

  private handleForbidden() {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    addNotification({
      type: 'error',
      message: 'Access denied. Insufficient permissions.',
    });
    navigate('/unauthorized');
  }

  private handleServerError(error: any) {
    const { addNotification } = useHookService('notifications');

    addNotification({
      type: 'error',
      message: 'Server error. Please try again later.',
    });
  }

  private handleClientError(error: any) {
    const { addNotification } = useHookService('notifications');

    addNotification({
      type: 'error',
      message: error.message || 'An error occurred',
    });
  }
}
```

## Testing Service Architecture

### 1. Service Unit Tests

```typescript
// services/__tests__/userService.test.ts
import { useHookService } from 'react-use-anywhere';
import { userService } from '../user/userService';

jest.mock('react-use-anywhere');
const mockUseHookService = useHookService as jest.MockedFunction<
  typeof useHookService
>;

describe('userService', () => {
  const mockNavigate = jest.fn();
  const mockAddNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHookService.mockImplementation((key) => {
      switch (key) {
        case 'navigation':
          return mockNavigate;
        case 'notifications':
          return { addNotification: mockAddNotification };
        default:
          throw new Error(`Unexpected hook: ${key}`);
      }
    });
  });

  describe('createUser', () => {
    it('should create user and navigate to user page', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      const createdUser = { id: '1', ...userData };

      // Mock API response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createdUser),
      });

      const result = await userService.createUser(userData);

      expect(result).toEqual(createdUser);
      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        message: 'User created successfully',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/users/1');
    });
  });
});
```

### 2. Integration Tests

```typescript
// services/__tests__/userOnboardingService.integration.test.ts
import { userOnboardingService } from '../workflows/userOnboardingService';

describe('userOnboardingService integration', () => {
  it('should complete full onboarding workflow', async () => {
    const registrationData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      method: 'email',
    };

    // Mock all external dependencies
    jest
      .spyOn(userService, 'createUser')
      .mockResolvedValue({ id: '1', ...registrationData });
    jest.spyOn(emailService, 'sendWelcomeEmail').mockResolvedValue(undefined);
    jest.spyOn(analyticsService, 'track').mockResolvedValue(undefined);

    const result = await userOnboardingService.onboardNewUser(registrationData);

    expect(userService.createUser).toHaveBeenCalledWith(registrationData);
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(result);
    expect(analyticsService.track).toHaveBeenCalledWith('user_registered', {
      userId: '1',
      registrationMethod: 'email',
    });
  });
});
```

## Best Practices

### ✅ Do:

- **Single Responsibility**: Each service should have one clear purpose
- **Dependency Injection**: Use hooks to access external dependencies
- **Error Handling**: Implement consistent error handling patterns
- **Testing**: Write comprehensive unit and integration tests
- **Documentation**: Document service interfaces and behaviors

### ❌ Don't:

- **Direct Hook Calls**: Don't call hooks at module level
- **Tight Coupling**: Avoid direct dependencies between services
- **Mixed Concerns**: Don't mix UI logic with business logic
- **Global State**: Don't use services as global state containers
- **Side Effects**: Avoid uncontrolled side effects

## Summary

Service layer architecture with React Use Anywhere provides:

- **Clear separation of concerns** between UI and business logic
- **Improved testability** with isolated, mockable services
- **Better maintainability** with organized, focused code
- **Enhanced reusability** across different components and applications
- **Scalable architecture** that grows with your application

Ready to implement these patterns? Check out our [examples](/examples/basic-usage) for practical implementations!
