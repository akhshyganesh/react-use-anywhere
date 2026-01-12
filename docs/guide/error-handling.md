# Error Handling

Learn how to handle errors gracefully in your services. 🛡️

**Time to read:** 8 minutes  
**Level:** Beginner to Intermediate

## Why Error Handling Matters

Services make API calls, navigate between pages, and update state. Things can fail! Good error handling:

- ✅ Prevents app crashes
- ✅ Gives users helpful feedback
- ✅ Makes debugging easier
- ✅ Improves user experience

## Pattern 1: Basic Try-Catch

The simplest pattern - catch errors and show feedback.

```typescript
import { createSingletonService } from 'react-use-anywhere';

const authService = createSingletonService('auth');
const navService = createSingletonService('navigate');
const notifyService = createSingletonService('notify');

export const login = async (email: string, password: string) => {
  try {
    // Try the operation
    const user = await api.login(email, password);

    // Success! Update state and navigate
    authService.use((auth) => auth.setUser(user));
    navService.use((nav) => nav('/dashboard'));
    notifyService.use((notify) => notify.success('Welcome back!'));

    return { success: true, user };
  } catch (error) {
    // Failed! Show error message
    notifyService.use((notify) =>
      notify.error('Login failed. Please check your credentials.')
    );

    return { success: false, error };
  }
};
```

**When to use:** Most service functions

## Pattern 2: Return Result Object

Return success/error info instead of throwing.

```typescript
type Result<T> = { success: true; data: T } | { success: false; error: string };

export const updateProfile = async (
  userId: string,
  data: ProfileData
): Promise<Result<User>> => {
  try {
    const user = await api.updateUser(userId, data);

    notifyService.use((notify) => notify.success('Profile updated!'));

    return { success: true, data: user };
  } catch (error) {
    const message = error.message || 'Update failed';

    notifyService.use((notify) => notify.error(message));

    return { success: false, error: message };
  }
};

// Usage in component
const handleUpdate = async () => {
  const result = await updateProfile(userId, data);

  if (result.success) {
    console.log('User:', result.data);
  } else {
    console.log('Error:', result.error);
  }
};
```

**When to use:** When you want to handle success/failure in component

## Pattern 3: Error Types

Handle different errors differently.

```typescript
export const fetchUserData = async (userId: string) => {
  try {
    return await api.get(`/users/${userId}`);
  } catch (error) {
    // Handle different HTTP status codes
    if (error.status === 401) {
      // Unauthorized - logout and redirect
      authService.use((auth) => auth.logout());
      navService.use((nav) => nav('/login'));
      notifyService.use((notify) =>
        notify.error('Session expired. Please login again.')
      );
    } else if (error.status === 404) {
      // Not found - go to 404 page
      navService.use((nav) => nav('/404'));
    } else if (error.status === 403) {
      // Forbidden - show access denied
      notifyService.use((notify) => notify.error('Access denied'));
    } else {
      // Generic error
      notifyService.use((notify) => notify.error('Failed to load data'));
    }

    throw error;
  }
};
```

**When to use:** Different errors need different handling

## Pattern 4: Reusable Error Handler

Create a shared error handler for consistency.

```typescript
// errorHandler.ts
export const handleServiceError = (
  error: any,
  context: string,
  userMessage?: string
) => {
  // Log for debugging
  console.error(`[${context}]:`, error);

  // Show user-friendly message
  const message = userMessage || getDefaultMessage(error);
  notifyService.use((notify) => notify.error(message));

  // Handle auth errors globally
  if (error.status === 401) {
    authService.use((auth) => auth.logout());
    navService.use((nav) => nav('/login'));
  }
};

const getDefaultMessage = (error: any): string => {
  if (error.status === 500) return 'Server error. Please try again.';
  if (error.status === 404) return 'Not found';
  if (!navigator.onLine) return 'No internet connection';
  return 'Something went wrong';
};

// Use in services
export const deleteUser = async (userId: string) => {
  try {
    await api.delete(`/users/${userId}`);
    notifyService.use((notify) => notify.success('User deleted'));
  } catch (error) {
    handleServiceError(error, 'deleteUser', 'Failed to delete user');
    throw error;
  }
};
```

**When to use:** Multiple services with similar error handling

## Pattern 5: Validation Errors

Handle validation errors from API.

```typescript
type ValidationError = {
  field: string;
  message: string;
};

export const createUser = async (userData: CreateUserData) => {
  try {
    const user = await api.post('/users', userData);
    navService.use((nav) => nav(`/users/${user.id}`));
    return { success: true, user };
  } catch (error) {
    if (error.status === 422 && error.validationErrors) {
      // Show field-specific errors
      error.validationErrors.forEach((err: ValidationError) => {
        notifyService.use((notify) =>
          notify.error(`${err.field}: ${err.message}`)
        );
      });
    } else {
      notifyService.use((notify) => notify.error('Failed to create user'));
    }

    return { success: false, error };
  }
};
```

**When to use:** Forms with validation

## Pattern 6: Retry Logic

Retry failed operations automatically.

```typescript
const retry = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('All retries failed');
};

export const fetchData = async (endpoint: string) => {
  try {
    return await retry(() => api.get(endpoint));
  } catch (error) {
    handleServiceError(error, 'fetchData');
    throw error;
  }
};
```

**When to use:** Network requests that might temporarily fail

## Quick Reference

### Error Handling Checklist

For every service function that can fail:

- [ ] Wrapped in try-catch?
- [ ] User gets feedback on error?
- [ ] Logged for debugging?
- [ ] Handles common error types?
- [ ] Returns meaningful result?

### Common Patterns

```typescript
// 1. Basic
try { /* ... */ } catch (e) { notify.error() }

// 2. Return result
return { success: true/false, data/error }

// 3. Handle types
if (error.status === 401) { logout() }

// 4. Reusable handler
handleServiceError(error, 'context')

// 5. Validation
error.validationErrors.forEach(...)

// 6. Retry
await retry(() => operation())
```

### Common Mistakes

❌ **Silent failures** - No error feedback  
❌ **Generic messages** - "Error occurred"  
❌ **No logging** - Can't debug  
❌ **Throwing without catching** - Crashes app

✅ **User-friendly messages**  
✅ **Log errors for debugging**  
✅ **Handle different error types**  
✅ **Graceful degradation**

## Best Practices

1. **Always catch errors** in async service functions
2. **Show user feedback** - success and failure messages
3. **Log errors** - console.error for debugging
4. **Handle auth errors** - logout and redirect on 401
5. **Be specific** - Different messages for different errors
6. **Return results** - Let components decide what to do
7. **Test error paths** - Don't just test the happy path

## Next Steps

- **Testing Errors:** [Testing Guide](./testing-basics.md)
- **Advanced Patterns:** [Advanced Error Handling](./advanced-patterns.md)
- **See Examples:** [Authentication Example](../examples/authentication.md)

---

**Questions?** Check [Troubleshooting](./troubleshooting.md) or [ask on GitHub](https://github.com/akhshyganesh/react-use-anywhere/issues)
