# Service Patterns

Learn how to design clean, maintainable services that use React hooks. ⭐

**Time to read:** 10 minutes  
**Level:** Beginner to Intermediate

## What You'll Learn

- ✅ Single Responsibility Principle for services
- ✅ How to structure service functions
- ✅ Error handling patterns
- ✅ When to create a new service

## 1. Single Responsibility Principle

**Rule:** Each service should do ONE thing well.

### ✅ Good: Focused Services

```typescript
// userService.ts - Handles user data only
export const userService = {
  async createUser(userData: CreateUserData) {
    const user = await api.post('/users', userData);
    return user;
  },

  async updateUser(userId: string, updates: UpdateUserData) {
    return await api.patch(`/users/${userId}`, updates);
  },

  async deleteUser(userId: string) {
    await api.delete(`/users/${userId}`);
  },
};

// emailService.ts - Handles emails only
export const emailService = {
  async sendWelcomeEmail(user: User) {
    return await api.post('/emails/welcome', { user });
  },

  async sendPasswordReset(email: string) {
    return await api.post('/emails/reset', { email });
  },
};
```

**Why this works:**

- Easy to find code
- Easy to test
- Easy to modify
- Each service has one reason to change

### ❌ Bad: Mixed Responsibilities

```typescript
// userService.ts - Does too many things!
export const userService = {
  async createUser(userData) {
    /* ... */
  },
  async sendWelcomeEmail(user) {
    /* ... */
  }, // Email!
  async trackUserCreation(user) {
    /* ... */
  }, // Analytics!
  async validateUserData(data) {
    /* ... */
  }, // Validation!
};
```

**Why this is bad:**

- Hard to find code
- Complex to test
- Changes in one area affect others

## 2. Service Function Patterns

### Pattern: Simple Action

Use for straightforward operations:

```typescript
import { createSingletonService } from 'react-use-anywhere';

const navService = createSingletonService('navigate');
const authService = createSingletonService('auth');

// Simple: Just navigate
export const goToHome = () => {
  navService.use((navigate) => navigate('/'));
};

// Simple: Just logout
export const logout = () => {
  authService.use((auth) => auth.logout());
};
```

**When to use:** Single, clear action

### Pattern: Multiple Services Together

Use for operations that need multiple hooks:

```typescript
const navService = createSingletonService('navigate');
const authService = createSingletonService('auth');
const notifyService = createSingletonService('notify');

// Logout with feedback and redirect
export const logout = () => {
  authService.use((auth) => auth.logout());
  notifyService.use((notify) => notify.info('Logged out'));
  navService.use((nav) => nav('/login'));
};

// Login with full flow
export const login = async (credentials: Credentials) => {
  try {
    const user = await api.login(credentials);

    authService.use((auth) => auth.setUser(user));
    notifyService.use((notify) => notify.success('Welcome back!'));
    navService.use((nav) => nav('/dashboard'));

    return user;
  } catch (error) {
    notifyService.use((notify) => notify.error('Login failed'));
    throw error;
  }
};
```

**When to use:** Operations involving multiple concerns

### Pattern: Conditional Logic

Use for operations with conditions:

```typescript
// Check auth before navigating
export const goToCheckout = () => {
  const isAuth = authService.use((auth) => auth.isAuthenticated);

  if (!isAuth) {
    navService.use((nav) => nav('/login'));
    notifyService.use((notify) => notify.warning('Please login first'));
    return;
  }

  navService.use((nav) => nav('/checkout'));
};

// Conditional redirect
export const handleApiError = (error: ApiError) => {
  if (error.status === 401) {
    authService.use((auth) => auth.logout());
    navService.use((nav) => nav('/login'));
  } else if (error.status === 403) {
    navService.use((nav) => nav('/forbidden'));
  } else {
    notifyService.use((notify) => notify.error(error.message));
  }
};
```

**When to use:** Decisions based on state

## 3. Error Handling Patterns

### Pattern: Try-Catch in Service

```typescript
export const login = async (email: string, password: string) => {
  try {
    const user = await api.login(email, password);

    authService.use((auth) => auth.setUser(user));
    navService.use((nav) => nav('/dashboard'));

    return { success: true, user };
  } catch (error) {
    notifyService.use((notify) =>
      notify.error('Login failed. Please try again.')
    );

    return { success: false, error };
  }
};
```

**When to use:** Operations that can fail

### Pattern: Error Handler Function

```typescript
// Reusable error handler
export const handleServiceError = (error: Error, userMessage: string) => {
  console.error('Service error:', error);

  notifyService.use((notify) => notify.error(userMessage));

  if (error.message.includes('401')) {
    authService.use((auth) => auth.logout());
    navService.use((nav) => nav('/login'));
  }
};

// Use in services
export const fetchUserData = async (userId: string) => {
  try {
    return await api.get(`/users/${userId}`);
  } catch (error) {
    handleServiceError(error, 'Failed to load user data');
    throw error;
  }
};
```

**When to use:** Consistent error handling across services

## 4. When to Create a New Service

### Create a New Service When:

✅ **Different domain** - `userService`, `productService`, `orderService`  
✅ **Different responsibility** - `authService`, `emailService`, `analyticsService`  
✅ **Different hook needed** - `navigationService`, `themeService`, `notificationService`

### Don't Create a New Service For:

❌ **Related operations** - Keep `login`, `logout`, `checkAuth` in same `authService`  
❌ **Helper functions** - Put in utils, not services  
❌ **One-time operations** - Just use directly in component

## 5. File Organization

### Good Structure

```
services/
├── auth/
│   ├── index.ts              # Exports
│   ├── authService.ts        # Main service
│   ├── authHelpers.ts        # Helpers
│   └── types.ts              # Types
│
├── navigation/
│   ├── index.ts
│   └── navigationService.ts
│
└── notifications/
    ├── index.ts
    └── notificationService.ts
```

### Alternative (Simpler)

```
services/
├── authService.ts
├── navigationService.ts
├── notificationService.ts
└── types.ts
```

**Choose based on:**

- Simple projects → Flat structure
- Complex projects → Folder per service

## Quick Reference

### Service Checklist

Before creating a service, ask:

- [ ] Does it have a clear, single purpose?
- [ ] Does it need access to a React hook?
- [ ] Is it reused in multiple places?
- [ ] Does it contain business logic (not just UI)?

If yes to all → Create a service!  
If no → Maybe just a helper function

### Common Mistakes

❌ **Too many services** - Overengineering  
❌ **Services calling services directly** - Creates coupling  
❌ **No error handling** - Fails silently  
❌ **Mixed responsibilities** - Hard to maintain

✅ **Keep services focused**  
✅ **Use services from components**  
✅ **Handle errors consistently**  
✅ **One responsibility per service**

## Next Steps

- **Learn More:** [Error Handling Guide](./error-handling.md)
- **See Examples:** [Authentication Example](../examples/authentication.md)
- **Advanced:** [Advanced Patterns](./advanced-patterns.md)

---

**Got questions?** Check [Troubleshooting](./troubleshooting.md) or [ask on GitHub](https://github.com/akhshyganesh/react-use-anywhere/issues)
