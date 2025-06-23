# Service Layer Architecture

Build clean, maintainable apps by separating business logic from UI components using React Use Anywhere.

## The Problem

Traditional React apps often have:

- Business logic mixed with UI components
- Hard-to-test complex workflows
- Props drilling for shared functionality
- Tight coupling between components

## The Solution

React Use Anywhere enables clean service layer architecture:

```
React Components (UI only)
    ↕ (calls)
Service Layer (business logic)
    ↕ (uses)
React Hooks (infrastructure)
```

## Service Patterns

### 1. Domain Services

Organize by business area:

```ts
// services/userService.ts
import { createSingletonService } from 'react-use-anywhere';

const authService = createSingletonService('auth');
const notificationService = createSingletonService('notifications');
const navigationService = createSingletonService('navigation');

export const userService = {
  async updateProfile(updates: UserUpdates) {
    try {
      const user = await api.updateUser(updates);

      // Update auth state
      authService.use((auth) => auth.setUser(user));

      // Show success message
      notificationService.use((notifications) =>
        notifications.success('Profile updated!')
      );

      return user;
    } catch (error) {
      notificationService.use((notifications) =>
        notifications.error('Update failed')
      );
      throw error;
    }
  },

  async deleteAccount() {
    await api.deleteUser();
    authService.use((auth) => auth.clearUser());
    navigationService.use((navigate) => navigate('/goodbye'));
  },
};
```

### 2. Cross-Cutting Services

Handle app-wide concerns:

```ts
// services/appService.ts
import { createSingletonService } from 'react-use-anywhere';

const authService = createSingletonService('auth');
const themeService = createSingletonService('theme');
const navigationService = createSingletonService('navigation');
const notificationService = createSingletonService('notifications');

export const appService = {
  async initialize() {
    // Check auth status
    const token = localStorage.getItem('token');
    if (token) {
      authService.use((auth) => auth.restoreSession(token));
    }

    // Set theme from system/localStorage
    const theme = localStorage.getItem('theme') || 'system';
    themeService.use((themeHook) => themeHook.setTheme(theme));

    // Navigate to appropriate page
    authService.use((auth) => {
      const isAuthenticated = auth.isAuthenticated;
      navigationService.use((navigate) =>
        navigate(isAuthenticated ? '/dashboard' : '/login')
      );
    });
  },

  async handleError(error: Error) {
    console.error(error);
    notificationService.use((notifications) =>
      notifications.error('Something went wrong')
    );
  },
};
```

### 3. Workflow Services

Handle multi-step processes:

```ts
// services/checkoutService.ts
import { createSingletonService } from 'react-use-anywhere';

const loadingService = createSingletonService('loading');
const cartService = createSingletonService('cart');
const orderService = createSingletonService('orders');
const notificationService = createSingletonService('notifications');
const navigationService = createSingletonService('navigation');

export const checkoutService = {
  async processCheckout(paymentInfo: PaymentInfo) {
    try {
      // 1. Show loading
      loadingService.use((loading) => loading.start());

      // 2. Process payment
      const payment = await api.processPayment(paymentInfo);

      // 3. Clear cart
      cartService.use((cart) => cart.clear());

      // 4. Update order history
      orderService.use((orders) => orders.addOrder(payment.order));

      // 5. Show success and navigate
      notificationService.use((notifications) =>
        notifications.success('Order placed successfully!')
      );
      navigationService.use((navigate) =>
        navigate(`/orders/${payment.order.id}`)
      );
    } catch (error) {
      notificationService.use((notifications) =>
        notifications.error('Payment failed')
      );
    } finally {
      loadingService.use((loading) => loading.stop());
    }
  },
};
```

## Best Practices

### Keep Components Simple

```tsx
// ✅ Good - Component only handles UI
function ProfilePage() {
  // Connect the service to hook
  useHookService(authService, 'auth');
  useHookService(notificationService, 'notifications');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        userService.updateProfile(formData);
      }}
    >
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  );
}

// ❌ Bad - Business logic in component
function ProfilePage() {
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const user = await api.updateUser(formData);
      setUser(user);
      showNotification('Saved!');
      navigate('/profile');
    } catch (error) {
      showNotification('Error!');
    } finally {
      setLoading(false);
    }
  };
  // ... more mixed logic
}
```

### Service Composition

```ts
// Compose smaller services into larger workflows
export const onboardingService = {
  async completeOnboarding(userData: OnboardingData) {
    // Use multiple services together
    await userService.updateProfile(userData.profile);
    await settingsService.setPreferences(userData.preferences);
    await analyticsService.track('onboarding_completed');

    navigationService.use((navigate) => navigate('/dashboard'));
  },
};
```

### Error Boundaries

```ts
// Handle errors at the service level
export const safeService = {
  async performAction() {
    try {
      await riskyOperation();
    } catch (error) {
      // Log error
      analyticsService.trackError(error);

      // Show user-friendly message
      notificationService.use((notifications) =>
        notifications.error('Action failed, please try again')
      );

      // Fallback behavior
      navigationService.use((navigate) => navigate('/safe-page'));
    }
  },
};
```

## Benefits

- **🧪 Testable** - Test business logic without React components
- **♻️ Reusable** - Share services across different parts of your app
- **🔧 Maintainable** - Clear separation between UI and business logic
- **📈 Scalable** - Add features without increasing component complexity

## Next Steps

- **[Best Practices](/guide/best-practices)** - Production patterns
- **[Real Examples](/examples/basic-usage)** - Copy-paste service code
- **[Testing Guide](/guide/testing)** - How to test services
